# Architecture Decision Records (ADR)

**Repository:** `its-platform/docs/adr/`
**Format:** Markdown with YAML frontmatter (MADR 3.0.0)
**Process:** See `CONSTITUTION.md` §4

---

## Index

| ID | Title | Status | Date | Supersedes |
|---|---|---|---|---|
| [001](001-use-fastapi.md) | Use FastAPI for API services | **Superseded** by 012 | 2026-10-03 | — |
| [002](002-bkt-irt-hybrid.md) | Hybrid BKT/IRT/FSRS for adaptive engine | Accepted | 2026-10-03 | — |
| [003](003-postgresql-rls.md) | PostgreSQL Row-Level Security for multi-tenancy | Accepted | 2026-10-03 | — |
| [004](004-two-pack-schemas.md) | Support two pack schemas (canonical + legacy) | Accepted | 2026-10-03 | — |
| [005](005-async-celery.md) | Async processing via Celery + Redis | Accepted | 2026-10-03 | — |
| [006](006-kong-api-gateway.md) | Kong as API Gateway with declarative config | Accepted | 2026-10-03 | — |
| [007](007-istio-mtls.md) | Istio mTLS for service mesh | Accepted | 2026-10-03 | — |
| [008](008-argocd-gitops.md) | ArgoCD for GitOps deployments | Accepted | 2026-10-03 | — |
| [009](009-pgbackrest-backup.md) | pgBackRest for PostgreSQL backup | Accepted | 2026-10-03 | — |
| [010](010-content-submodule.md) | Curso-de-Ingles as Git submodule | Accepted | 2026-10-03 | — |
| [011](011-message-broker-selection.md) | Message Broker Selection for ITS Platform | Accepted | 2026-10-04 | — |
| [012](012-migrate-api-layer-to-nestjs.md) | Migrate API layer from FastAPI to NestJS + TypeORM | Accepted | 2026-10-04 | 001 |
| [013](013-auth-architecture-resource-vs-authorization-server.md) | Auth architecture — Resource Server vs Authorization Server, and IdP selection | **Proposed** — open | 2026-10-04 | — |
| [014](014-datastore-pglite-dev-postgres-prod.md) | Datastore driver — PostgreSQL 16; PGlite as dev/test driver | Accepted | 2026-10-04 | — |
| [015](015-domain-model-bounded-contexts.md) | Domain model — eight bounded contexts, aggregate roots, single-tenant MVP | Accepted | 2026-10-05 | — |
| [016](016-canonical-identifier-registry.md) | Canonical identifier registry, alias migration, and the CI gate | Accepted | 2026-10-05 | — |
| [017](017-mvp-adaptive-scope.md) | MVP adaptive scope — Stage-1 IRT only, fixed-form diagnostic, ordinal routing | Accepted | 2026-10-05 | — |
| [018](018-persistence-derived-from-specs.md) | Persistence derived from the specs, and the invariant floor | Accepted | 2026-10-05 | — |
| [019](019-p0.4-schema-migration.md) | P0.4 schema migration — named enum types, [db] triggers, RLS on real PostgreSQL, WORM hash chain | Accepted | 2026-10-06 | — |
| [020](020-content-loader-port.md) | P0.5 content loader — parsers over real markdown formats, upsert idempotency, PGlite/Postgres gate | Accepted | 2026-10-06 | — |
| [021](021-per-lesson-skill-metadata.md) | Per-lesson skill metadata — canonical source, canonical ids, and fail-closed gating | **Proposed** — open | 2026-10-10 | — |
| [022](022-content-loader-schema-reconciliation.md) | Content loader ↔ P0.4 schema reconciliation — persistence contract, derived-field rules, skip baseline | Accepted | 2026-10-10 | — |
| [023](023-diagnostic-routing-semantics.md) | Diagnostic routing semantics — ADR-017 §3's operational rule, the CEFR↔θ threshold set, the start-node table | Accepted | 2026-10-11 | — |
| [024](024-fixed-form-executor-contract.md) | Fixed-form diagnostic executor — completeness, ordering, the §3.3a reportability lattice, the run's output contract | Accepted | 2026-10-11 | — |
| [025](025-theta-estimation-posterior.md) | θ estimation for the fixed form — §3.4's posterior, the prior it needs, the storage contract it must respect | Accepted | 2026-10-11 | — |
| [026](026-learner-context-app-role.md) | Learner context for the app role — the single writer of `app.current_learner_id`, its transaction scope, and what PGlite can verify | Accepted | 2026-10-11 | — |
| [027](027-content-api.md) | Content API — the persisted catalog as the only read path; the three response schemas amended to what the content declares. `LessonContent`: `fase1…fase4` → `phases[]` + `learner_model` (materialised in `lessons.body`). `PackContent`: restored to ADR-004 (empty `options`, nullable `key`, `scoring`/`item_type` added). `DialogueContent`: the key marker's second generation read (11 unscorable slots), `dialogues.transcript` stored, the `status`/`skill`/`distractor_type` enums and the `cefr_level` pattern brought back to the DDL and the specs. Contract-wide: `PackOption.br_pt_form`/`note` become `null`-able (all 915 key options are served `note: null`), the `if/then` for `key` gains its type conjunct (`required` does not exclude a `null`), and both `item_id` patterns are withdrawn (complementary: 771/117 of 888 ids, 0 satisfying both). The two OpenAPI files are now constraint-identical on those schemas | Accepted | 2026-10-11 | — |

| [028](028-audio-delivery.md) | Audio delivery for the listening catalogue. `GET /content/listening/{dialogue_id}/audio` as a resource of its own — a signed URL has a 300 s lifetime and a catalog read does not, so it is not embedded in `DialogueContent`. One render per clip, from the highest **take complete for the whole dialogue**, at the voice `dialogue_speakers` pins to that speaker; `rate` (`1.00`/`0.75`) is a query parameter and the accommodation is recorded. Admission is the **same 404** as an unknown id: `shipped` + a complete take + (for the **11 of 13** dialogues carrying an L2 item; the other two have both their L2 items `withdrawn` — `§9 DEF-7` ×2 / `DEF-10` / `DEF-11` — and `DEF-11`'s deferred replacement re-arms the gate on its own, since it is read from `items.listening_tier`) `ear_checked_by`/`ear_checked_at`, the coarsest gate the data supports because `items.clip_ids` has no producer. `AudioUrlSigner` is a port; the mechanism the specs name is HMAC-SHA256, and the S3-presign adapter is deferred to M3 rather than written unexercised. Consent is **not** required here (no personal data in a catalogue asset; no learner id in the URL), and `clip_renders.uri` is constrained by the DDL to `catalog/…` because `iac-spec.md`'s bucket lifecycle expires `audio/` in 30 days | Accepted | 2026-10-11 | — |

| [029](029-immutability-by-trigger.md) | Immutability is a trigger, not a grant. Verification of P2.1/P2.2 measured that the DDL's `REVOKE UPDATE (id) ON items` is **inert** against the table-level `GRANT UPDATE` (PostgreSQL ACLs have no negative entries: `has_column_privilege` true, `attacl` empty, `UPDATE … SET id` rewrote the primary key as `its_platform_app`), and that `migration-check`'s I-2 assertion passed only because its own seeded `item_options` children trip a **foreign-key** error, not a permission one. Replacement: `trg_append_only_guard` (with P2.2) and `trg_item_id_immutable` refuse the mutation for **every** role — owner and `its_platform_admin` included, which no `REVOKE`-based control can express. The gates now assert the trigger's own exception (owner-role half included) instead of "some error"; the triggers assertion grows 4 → 6 named triggers | Accepted | 2026-10-12 | — |
| [030](030-gateway-rate-limiting.md) | Gateway rate limiting — three `redis`-backed layers (`ip` 1000/min service-wide, `consumer` 100/min on `/learners` declared now and enforced when auth lands, `ip` 5/min on `/auth` per S-03), one monolith upstream, the ADR-006 example's per-service split and hour caps struck, the BDD "15-minute block" corrected to 429+`Retry-After`, and a `kong:check` gate over `iac/kong/kong.yml`. Also corrects the ADR-006 Implementation Plan: six false `[x]` boxes (ADR-009 precedent) | Accepted | 2026-10-12 | — |

### Read before writing any persistence code — ADR-015…018

Four records dated 2026-10-05 change what the rest of this directory says. Read them before
opening `docs/data-model.erd.md`, `db/models.py`, or a migration.

| ADR | What it invalidates | What it requires |
|---|---|---|
| [015](015-domain-model-bounded-contexts.md) | `ms_`/`diag_` graph nodes (zero instances, four node kinds declared), `learners.streak_days`, `learners.xp`. Closes `ITS-ARCHITECTURE.md` §12 item 4 | three entities that had no id, no schema, no write path: `ErrorLogEntry`, `SkillPrerequisite`, `AffectiveSignal`; `AppendOnlyEvent` promoted to artefact class #8 in `SDD.md` §1 |
| [016](016-canonical-identifier-registry.md) | five coexisting `skill_id` forms; `item_id` indistinguishable from `skill_id` in Family-B packs | one canonical form per class, `identifier_aliases`, and `scripts/verify-identifiers.py` in **both** repos' CI |
| [017](017-mvp-adaptive-scope.md) | `PRD.md` vs `BACKLOG.md` on CAT priority — resolved against the PRD's dependency claim, but with the CAT **out** of the MVP | Stage-1 `(a,b)` with declared SE; 12-item fixed form; conservative ordinal routing; `placement_provisional` derived, never stored |
| [018](018-persistence-derived-from-specs.md) | **all 28 tables** of `docs/data-model.erd.md`, and the 9 invariants; `bkt_transition`; `pgvector`; `mastery.gate_passed` | the invariant floor (no stored rule weaker than its predicate), 16 corrections, the L1 pack formula, RLS on every learner-scoped table |

**`docs/data-model.erd.md` is superseded** and its header's stated source (`ITS-ARCHITECTURE.md §7`
— a twenty-line sketch) is why. `BACKLOG.md` P0.3a re-derives it from the six specs.

### Open ADRs — read before implementing

**[013](013-auth-architecture-resource-vs-authorization-server.md) is `Proposed` and blocks
one thing:** the platform must not implement token issuance. `/auth/refresh` is published in
`docs/api-spec.openapi.yaml` but is annotated as out of MVP scope. Building it without
closing 013 would make the platform an Authorization Server, which no accepted record
authorises. The IdP question inside 013 is deliberately unanswered.

**[012](012-migrate-api-layer-to-nestjs.md)** and **[014](014-datastore-pglite-dev-postgres-prod.md)**
carry constraints that are easy to lose in implementation and are enforced by CI:

- 012 — a file under `src/domain/` importing `typeorm` or `@nestjs/*` fails the build. TypeORM's default decorates the domain; the CI check is the only thing standing between that default and `CONSTITUTION.md` §4.2.
- 014 — concurrency tests **cannot** run on PGlite (one exclusive connection): contention, a pool handing the same connection to two learners. `SET ROLE` + `SET LOCAL` + ADR-003's policies *do* run there, and a single-session cross-learner test that switches role can fail — measured, `docs/adr/026`. On PGlite the suite must `SET ROLE its_platform_app`, or it connects as the table owner and RLS is bypassed.

---

## Template

```markdown
---
adr: 00X
title: Short Title
status: Proposed | Accepted | Rejected | Superseded
date: YYYY-MM-DD
authors: [@github_handle]
deciders: [@github_handle]
consulted: [@github_handle]
informed: [@github_handle]
tags: [tag1, tag2]
---

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Drawback 1
- Drawback 2

### Neutral
- Consideration 1

## Alternatives Considered

1. **Alternative A** — Why rejected
2. **Alternative B** — Why rejected

## Implementation Plan

- [ ] Step 1
- [ ] Step 2

## References

- Link to spec, doc, or issue
```