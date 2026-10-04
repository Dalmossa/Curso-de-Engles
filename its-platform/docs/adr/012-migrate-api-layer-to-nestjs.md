---
adr: 012
title: Migrate API layer from FastAPI to NestJS + TypeORM
status: Accepted
date: 2026-10-04
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@platform-lead, @backend-lead, @security-lead]
informed: [@team]
supersedes: [001]
tags: [api, framework, typescript, nestjs, typeorm, clean-architecture, migration]
---

## Context

ADR-001 selected FastAPI for the API layer. The M1.1 foundation was implemented in Python: `src/its_platform/` contains `main.py`, `config.py`, `db/models.py`, `db/session.py`, `db/migrations/`, `content/loader.py`, `content/service.py`. CI runs `ruff`, `mypy`, and `black`.

Three requirements were then raised that the Python/FastAPI standard does not serve:

1. **A single enforcement point for cross-cutting rules.** `CONSTITUTION.md` v2.0.0 §4.3–§4.6 mandates UTF-8 JSON validation, RFC 9457 problem responses, deny-by-default authorisation, TLS enforcement, rate limiting, and OpenTelemetry correlation on *every* endpoint. In FastAPI these become scattered middleware and per-route dependencies, and a route that forgets one is not caught at build time.
2. **Object-oriented design with enforced layering.** §4.2 mandates Clean Architecture with a framework-free domain. SQLAlchemy enforced this naturally: models lived in `db/models.py` and nothing else could touch the database. §4.2 additionally requires the domain to be testable without a database, which SQLAlchemy's `AsyncSession`-injected repositories satisfied only by convention.
3. **A strategic language alignment.** The adaptive engine (ADR-002: BKT + IRT + FSRS) needs a service that runs both the scheduler and any future inference client on one runtime. Splitting the platform across Python and TypeScript would mean two deployment pipelines, two on-call rotations, and two observability stacks for what is one system.

ADR-001 itself recorded this as a risk: *"Migration cost — if later switching to Go/Rust for performance-critical paths."* That cost is now being paid deliberately, while the implementation is still ~12 tables and ~20 tests rather than a running service.

### ORM selection

The migration forces an ORM choice. It is constrained by **ADR-003**, which is `Accepted` and unimplementable without it:

```sql
-- ADR-003:48
USING (id = current_setting('app.current_learner_id')::uuid)
```

RLS isolation is delivered by a Postgres GUC set **per transaction**. Any ORM must support executing `SET LOCAL` inside a transaction and having all subsequent queries on that same connection observe it.

Candidates, scored against constraints already committed in this repository:

| | `SET LOCAL` in a transaction | Domain decoupled by default | Migrations reviewable as SQL | Boot cost |
|---|---|---|---|---|
| **TypeORM** | ✅ via `DataSource.transaction()` → `EntityManager.query()` | ❌ `@Entity()` decorates the domain | ⚠️ TS classes | Heavy |
| **Drizzle** | ✅ via `db.transaction()` | ✅ thin query layer | ✅ emits SQL | Thin |
| **Prisma** | ⚠️ `$executeRaw` only; typed builder degraded inside RLS-scoped transactions | ❌ generated client | ⚠️ own migration engine | Heavy |
| **Kysely** | ✅ excellent `sql` tag | ✅ | ❌ no schema/migration of its own | Thin |

**TypeORM was selected.** Drizzle is technically the better fit for the RLS idiom — but TypeORM is selected by directive, and the trade is made *explicitly* rather than absorbed silently: TypeORM's default (decorating the domain) directly contradicts §4.2, so the separation is enforced by a CI check rather than by the framework. §4.2's "ORM isolation" row and §4.8's "Domain isolation is tested" paragraph exist specifically to hold this line.

## Decision

**Replace FastAPI with NestJS on Node.js LTS and TypeScript for the entire API layer. Use TypeORM with a mandatory domain-decoupling pattern.**

### Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js (LTS) | |
| Language | TypeScript | `strict: true`, `noImplicitAny`, `strictNullChecks` — non-negotiable |
| Framework | NestJS | Guards / pipes / interceptors give the single enforcement point |
| ORM | TypeORM | **See the constraint below** |
| Validation | `class-validator` + `class-transformer` | Global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` |
| Events | `@nestjs/event-emitter` | In-process domain events; ADR-011 governs external broker selection |

### Mandatory directory layout

```
src/
├── domain/                  ← ZERO imports of typeorm, @nestjs/*, or any framework
│   ├── entities/            ← pure classes, constructor-injected invariants
│   ├── value-objects/
│   └── services/            ← domain services, no I/O
├── application/             ← use cases, ports (interfaces). Imports domain only.
│   └── ports/               ← repository interfaces live here, not in infrastructure
├── infrastructure/
│   ├── entities/            ← @Entity() ORM classes — the ONLY place typeorm is imported
│   ├── mappers/             ← domain ↔ ORM translation, both directions
│   ├── repositories/        ← implements application/ports
│   └── config/
└── interface/               ← controllers, DTOs, guards, filters. No business logic.
```

**Enforcement:** a CI check fails the build if any file under `src/domain/` imports `typeorm`, `@nestjs/*`, or any package outside an explicit allow-list. §4.2 is a rule the build enforces, not a convention it hopes for.

### URL versioning

```typescript
app.setGlobalPrefix('api');
app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
```

Produces `/api/v1/...`. The `/api` prefix is set once; the version segment is URI versioning only. Header and query-parameter versioning are prohibited by §4.4.

## Consequences

### Positive

- **One enforcement point.** A guard registered globally cannot be bypassed by a route that forgets it. Public routes must opt out explicitly with `@Public()` — the omission and the exception are now distinguishable in a diff.
- **Domain purity becomes testable.** BKT and FSRS update rules are plain functions on plain objects. No database, no container, no ORM metadata to construct.
- **One runtime for the whole platform.** Adaptive engine, API, and any future inference client deploy from one pipeline with one on-call rotation.
- **TypeScript `strict` is a stronger net than `mypy --strict`** on cross-module contracts, because it also constrains untyped JavaScript coming in through dependencies (`noImplicitAny` rejects it at the boundary rather than inferring `any`).

### Negative

- **Domain↔ORM isolation is no longer free.** This is the one real regression. SQLAlchemy's file layout enforced it structurally; TypeORM's decorators actively invite violation. Mitigated by the CI check and code review — **not by the framework**.
- **A full port, not an edit.** All 12 tables in `db/models.py`, the content loader, and the health endpoints must be rewritten. During the migration window the repository has **zero executable coverage**, down from 12 tables and 20 passing tests.
- **`SET LOCAL` is easy to forget.** ADR-003 already flagged this as a debugging risk. Mitigated by wrapping RLS context in a single repository decorator so no call site can omit it.
- **TypeORM boot cost.** Metadata scanning at startup is heavier than SQLAlchemy's. Acceptable at this service count.
- **Team learning curve** — NestJS's decorator and module model, and TypeORM's entity lifecycle, are both new.

### Neutral

- **Learning is no longer faster for the adaptive engine.** ADR-001 cited scikit-learn/numpy/torch as an argument for Python. ADR-002 specifies BKT, IRT, and FSRS as published algorithms, which are implementable in any language. If a trained-model dependency is later required, it should be served over HTTP from a separate Python service — a service boundary, not a reason to keep the API layer in Python.
- **Async semantics change.** SQLAlchemy's `AsyncSession` and TypeORM's `EntityManager` are both async-capable, but the transaction-control idioms differ. Code ported from the Python implementation must be re-checked, not transliterated.
- **ADR-001 becomes `Superseded`**, not deleted. Its rationale remains historically accurate.

## Alternatives Considered

1. **Stay on FastAPI** — Rejected. The cross-cutting enforcement point can be built, but every rule in §4.3–§4.6 becomes advisory rather than structural, and the two-runtime cost is permanent.
2. **NestJS + Drizzle** — Technically the better fit for ADR-003's `SET LOCAL` idiom, and the ORM stays out of the domain without a CI check. Rejected by directive in favour of TypeORM's maturity and first-class NestJS integration. Recorded here because the technical merit is real; the deciding factor was team familiarity, not capability.
3. **NestJS + Prisma** — Rejected. `current_setting()`-based RLS policies degrade to raw SQL, the typed query builder is unavailable inside RLS-scoped transactions, and Prisma's generated client couples the application layer to the ORM — directly contrary to §4.2.
4. **Node.js + Express (no framework)** — Rejected. Reintroduces the "scattered middleware" problem that motivated this ADR. Guards/pipes/interceptors are the reason for choosing NestJS over bare Express.
5. **Microservices in mixed languages** — Rejected. Two pipelines, two observability stacks, and cross-language tracing for what is currently one deployable unit.

## Implementation Plan

Tracked as phase **P0** in `BACKLOG.md`.

- [ ] Mark ADR-001 `Superseded`, add forward link to ADR-012
- [ ] Scaffold NestJS app: `tsconfig.json` (`strict`), `eslint`, `prettier`, `jest`
- [ ] Install `typeorm`, `pg`, `@electric-sql/pglite`, `class-validator`, `class-transformer`, `@nestjs/event-emitter`
- [ ] Write the CI domain-isolation check (`src/domain/` must not import frameworks)
- [ ] Port 12 tables: ORM entities in `infrastructure/entities/`, domain entities in `domain/`, mappers in both directions
- [ ] Port `content/loader.py` → `infrastructure/content/loader.ts`; verify against `verify-integrity.py`
- [ ] Port health/readiness endpoints (`/health`, `/ready` — §4.6)
- [ ] Wire global `ValidationPipe` and RFC 9457 exception filter
- [ ] Wire global `JwtAuthGuard` with `@Public()` opt-out (token validation only — **ADR-013 must be resolved before any token issuance is built**)
- [ ] Update `docs/api-spec.openapi.yaml` `servers.url` to `/api/v1`
- [ ] Delete the Python implementation tree and `pyproject.toml` only after contract tests pass

## References

- `CONSTITUTION.md` §2 (principles), §4.1–§4.8 (standards), §6.1 (release SemVer)
- [ADR-001](001-use-fastapi.md) — superseded by this record
- [ADR-003](003-postgresql-rls.md) — the constraint that determined the ORM evaluation
- [ADR-011](011-message-broker-selection.md) — external event transport
- `docs/api-spec.openapi.yaml` — OpenAPI 3.1 contract, 9 paths
- `docs/data-model.erd.md` — 12-table model to be ported
- NestJS documentation: https://docs.nestjs.com
- TypeORM documentation: https://typeorm.io
