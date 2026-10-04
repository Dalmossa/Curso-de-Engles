---
adr: 014
title: Datastore driver — PostgreSQL 16 in all environments; PGlite as the dev/test driver
status: Accepted
date: 2026-10-04
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@platform-lead, @backend-lead, @security-lead]
informed: [@team]
tags: [database, postgres, pglite, rls, testing, local-development]
---

## Context

ADR-012 selects NestJS + TypeORM. The ORM needs a driver, and the repository has already
committed to a datastore in three places that are not negotiable without superseding an
accepted record:

| Commitment | Location | What it depends on |
|---|---|---|
| Row-Level Security for multi-tenancy | [ADR-003](003-postgresql-rls.md) | `current_setting('app.current_learner_id')::uuid`, `SET LOCAL` per transaction, distinct DB roles |
| Backup and PITR | [ADR-009](009-pgbackrest-backup.md) | pgBackRest — PostgreSQL-only |
| ERD header | `docs/data-model.erd.md:4` | *"PostgreSQL 16+ with pgvector extension"* |
| Live schema | `src/its_platform/db/models.py` | `PGUUID(as_uuid=True)`, `DateTime(timezone=True)`, `JSON`, and four named `ENUM` types (`cefr_level`, `skill_domain`, `diagnostic_status`, `practice_item_type`) created in `migrations/versions/001_initial.py` |

ADR-012's evaluation of ORM candidates was driven by the ADR-003 constraint, not by ORM
popularity. The same constraint should drive driver selection, and it eliminates the two
convenience engines that were raised during the migration discussion.

### SQLite — eliminated

SQLite has **no row-level security at all**. This is not "harder in SQLite"; the concept
does not exist. With it also go `current_setting()`, `SET LOCAL`, session variables,
`timestamptz`, `JSONB`, native `UUID`, and named `ENUM` types. SQLite additionally
serialises writes with a whole-database lock, which sits directly on the critical path:
the adaptive engine writes a BKT state transition per item response (ADR-002). Choosing
SQLite would make the first RLS test — `BACKLOG.md` P2 — impossible to write.

### MySQL 8 — eliminated

MySQL is materially closer than SQLite and would satisfy most of the table above, with two
genuine degradations: no true `TIMESTAMPTZ` (`TIMESTAMP` is bounded to 1970–2038; `DATETIME`
has no zone), and `JSON` stored as text without a `JSONB` equivalent or GIN indexing — the
schema stores `JSON` in `skill_domains`, `prerequisites`, and `source_references`.

But MySQL also has **no row-level security**. `SET LOCAL` exists in MySQL only for
transaction characteristics, not as an equivalent of a transaction-scoped user GUC, so
ADR-003's isolation pattern does not port. Adopting MySQL would therefore require
reversing ADR-003, ADR-009, the ERD header, **and** the `CONSTITUTION.md` §2
Defense-in-Depth principle — which names RLS explicitly as the application layer of
defence. That is a decision about the security model, not about a database.

### The need behind those options

The legitimate requirement is developer velocity: running the test suite locally without
installing and operating a PostgreSQL server. That need is real and it is met without
touching the architecture.

### PGlite — what it actually is

PGlite is PostgreSQL compiled to WebAssembly, packaged as an npm dependency. Real Postgres
SQL semantics — `UUID`, `JSONB`, `timestamptz`, named enums, RLS policies, `pgvector` via
the extensions API — with no daemon and no installer:

```typescript
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();                  // in-memory
const db = new PGlite('./.pgdata');       // filesystem persistence
await db.exec('CREATE TABLE ...');        // migrations, multi-statement
await db.query('SELECT ... WHERE id = $1', [id]);  // parameterised
```

**The decisive limitation**, from the official documentation:

> *"As PGlite only has a single exclusive connection to the database…"*

One connection means one session, so connection-scoped state — `SET LOCAL`, `SET ROLE`,
per-request GUC assignment — cannot be exercised concurrently. This is exactly the
mechanism ADR-003 relies on, and it defines where PGlite may and may not be used.

## Decision

**PostgreSQL 16 is the datastore in every environment. PGlite is a dev/test driver that
speaks the same SQL, not a different database.**

| Environment | Driver | Rationale |
|---|---|---|
| **Unit tests** | **PGlite** (in-memory) | Real Postgres semantics, zero daemon, runs inside `npm test` |
| **Integration, RLS, CI** | **PostgreSQL 16** (service container) | Multi-connection and role-scoped behaviour that PGlite does not model |
| **Local development** | **PGlite** by default; Postgres via `docker compose` when RLS work needs it | Matches CI semantics without a mandatory install |
| **Staging / production** | **PostgreSQL 16 + pgvector** | ADR-003, ADR-009, `docs/data-model.erd.md` |

Selected by `DATASTORE_DRIVER=pglite|postgres`. **The application code is identical in
both modes** — this is a driver swap behind the TypeORM `DataSource`, not a dialect
abstraction. Any query that behaves differently between the two is a bug: PGlite is
Postgres, so divergence means the test is asserting something Postgres does not do.

### Binding constraint: what must not run on PGlite

Tests that exercise any of the following **must** run against real PostgreSQL:

1. **RLS policies** — ADR-003's `USING (id = current_setting(...))` cannot be tested against a single connection that is already the owner role.
2. **`SET LOCAL` / `SET ROLE` / per-request GUC assignment** — connection-scoped state.
3. **Cross-learner isolation** — requires two concurrent sessions holding different learner identities.
4. **Anything asserting write concurrency** — PGlite's exclusive connection cannot exhibit contention.
5. **pgBackRest backup and PITR** — ADR-009, external process.

A PGlite test that asserts learner A cannot read learner B's rows is **not a passing test**;
it is a test that cannot fail, and it must not be counted toward the RLS coverage that
`BACKLOG.md` P2 requires.

### CI must run both

`npm test` (PGlite) on every commit for speed; a PostgreSQL service container for the P2
integration suite. A PR that only passes on PGlite has not been verified for multi-tenancy.

## Consequences

### Positive

- **No architectural reversal.** ADR-003, ADR-009, the ERD, and §2 Defense-in-Depth all
  stand unchanged. The convenience is bought at the driver layer, where it costs nothing.
- **Local development needs no database installation.** `npm install` is the whole setup;
  the test suite creates an in-memory Postgres itself.
- **Dev and prod share a SQL dialect.** There is no SQLite/MySQL dialect shim to maintain
  and no class of bug that reproduces only in one environment.
- **Migration scripts are exercised locally.** Alembic's `001_initial.py` — four named
  enums, `PGUUID`, `timestamptz` — runs unchanged against PGlite, so schema drift is caught
  before CI.

### Negative

- **RLS coverage cannot be faked.** The P2 suite needs a real PostgreSQL service container.
  This is additional CI setup, and it is the reason the constraint above is written as a
  hard rule rather than a recommendation.
- **PGlite is single-connection.** Tests that rely on concurrent sessions fail there and
  must be routed to the PostgreSQL suite. The two-suite split adds friction to test
  authoring, and a developer who does not read this ADR will lose time discovering it.
- **No network server.** PGlite is in-process. Anything that needs to connect over a socket
  — an external tool, a manual `psql` session, a load test — requires real PostgreSQL. The
  optional PGlite Socket extension exists but is not adopted here, because depending on it
  would blur the boundary this ADR draws.
- **An extra dependency to audit.** `@electric-sql/pglite` is Apache-2.0 / PostgreSQL-licensed
  and enters the `npm audit` and `dependabot` surface from §8.2. It must never be bundled
  into a production image.

### Neutral

- **Performance characteristics differ.** PGlite is in-process WASM; it is not a benchmark
  target and no latency SLO is measured against it. `BACKLOG.md` P2 load testing uses
  PostgreSQL.
- **Extension set is a subset.** pgvector is available through the extensions API, but the
  catalogue is smaller than a full PostgreSQL installation. An extension required in
  production must be confirmed present in PGlite before being used in a unit test.

## Alternatives Considered

1. **SQLite for local development** — Rejected. No RLS, no `timestamptz`, no `JSONB`, no
   native enums, and a whole-database write lock on the adaptive engine's hot path. It
   would have required reverting ADR-003 and would make the first RLS test unwritable.
2. **MySQL 8** — Rejected. No row-level security, so ADR-003 does not port; plus no
   `timestamptz` and text-backed `JSON`. Reversing three accepted records and §2 to gain
   local convenience is a bad trade.
3. **PostgreSQL in Docker as the only option** — Workable, and remains available as
   `DATASTORE_DRIVER=postgres` for local RLS work. Not sufficient alone: it makes
   `npm install && npm test` a three-step dance requiring a container runtime, which is
   precisely the friction PGlite removes.
4. **Docker/Testcontainers for tests** — Better fidelity than PGlite, worse ergonomics. It
   stays in the plan for the **P2 integration suite**, where the extra fidelity is required
   and the slower startup is acceptable. Rejected as the *unit-test* default.
5. **An in-memory mock repository** — Fastest, and would hide exactly the bugs RLS exists to
   catch: SQL syntax errors, missing migrations, and policy mismatches. Rejected.

## Implementation Plan

- [ ] Add `@electric-sql/pglite` to `devDependencies`; assert it is absent from the production image
- [ ] Configure TypeORM `DataSource` factory selecting driver from `DATASTORE_DRIVER`
- [ ] Port Alembic `001_initial.py` to a TypeORM migration; verify it runs on both drivers
- [ ] Jest setup: PGlite in-memory instance per test file, seeded from `001_initial`
- [ ] Tag RLS and concurrency tests `// @requires-postgres`; wire them to the CI service-container job
- [ ] Add a CI job asserting the PostgreSQL integration suite actually runs (a silently skipped job is a passing job — see `AGENTS.md` on silent failure modes)
- [ ] `docker-compose.dev.yml` providing PostgreSQL 16 + pgvector for local RLS work
- [ ] Document the two-suite split in `tests/README.md`

## References

- `CONSTITUTION.md` §2 (Defense in Depth), §4.1 (Technology Stack), §4.8 (Testing Standards)
- [ADR-003](003-postgresql-rls.md) — the constraint that eliminated SQLite and MySQL
- [ADR-009](009-pgbackrest-backup.md) — PostgreSQL-only, must run against real PostgreSQL
- [ADR-012](012-migrate-api-layer-to-nestjs.md) — ORM whose driver this decision configures
- `docs/data-model.erd.md:4` — *"PostgreSQL 16+ with pgvector extension"*
- `src/its_platform/db/migrations/versions/001_initial.py` — four named enums (`cefr_level`, `skill_domain`, `diagnostic_status`, `practice_item_type`), `PGUUID`, `timestamptz`
- PGlite documentation: https://pglite.dev/docs/ — single exclusive connection; extensions API
- `AGENTS.md` — precedent for a check that passes while the thing it checks is absent
