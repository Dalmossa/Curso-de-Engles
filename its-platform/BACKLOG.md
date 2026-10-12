# ITS Platform — Product Backlog

**Source:** `Curso-de-Ingles/PRD.md` §9, `ITS-ARCHITECTURE.md` §10, `CONSTITUTION.md`
**Structure:** Phase-gated, dependency-ordered. See *Why this file was restructured* below.
**Prioritisation:** MoSCoW (Must/Should/Could/Won't)
**Constraint:** `CONSTITUTION.md` §2 — *Derivation over Assertion*. Every number below
names its derivation. No capacity figures appear anywhere in this file, and none may be
added without stating how the team size and availability were determined.

---

## Legend

| Prefix | Type | Meaning |
|---|---|---|
| **P0** | Phase 0 | Stack migration. Blocks everything. |
| **P1** | Phase 1 | MVP core — the adaptive tutor. |
| **P2** | Phase 2 | MVP release — infrastructure and security gates. |
| **P3** | Phase 3 | Deferred. Explicitly out of the MVP. |
| **Legacy** | — | The `M1.1`–`M7.7` id this story carried before the 2026-10-04 restructuring. Traceability only. |
| **B** | Bug | P1: 24h, P2: 72h, P3: one sprint |

---

## Why this file was restructured (2026-10-04)

The previous version was organised as seven sequential milestones (M1–M7) with a sprint
table. Six defects were found by auditing it against the repository. Each is stated with
its evidence, because a restructure that cannot say what was wrong is indistinguishable
from a preference.

| # | Defect | Evidence |
|---|---|---|
| **D1** | **The stack migration was not in the plan at all.** All 40 stories assumed Python/FastAPI. [ADR-012](docs/adr/012-migrate-api-layer-to-nestjs.md) supersedes [ADR-001](docs/adr/001-use-fastapi.md); ~34 days of already-built work must be redone in TypeScript and no story said so. | `pyproject.toml`, CI running `ruff`/`mypy`, `src/its_platform/*.py` |
| **D2** | **The item the PRD says blocks the entire statistical layer had no story.** PRD §9 risk **RF-002** (build the 10-item Stage-1 pilot bank) is `High` and gates M2 → M6. It appears nowhere in the backlog, while M4.1/M4.2 depend on the `a`/`b` parameters it produces. | `PRD.md` §9: *"No Stage-1 responses, therefore no IRT calibration. This blocks the CAT, every θ…"*; `PRD.md` §9 M2 exit condition; RF-002 |
| **D3** | **11 stories were in no sprint**, including 3 `Must`: M2.4, M5.2, M6.5. Effort omitted: 27d. M6.7 (LGPD Art. 18 data export/erasure, a legal obligation with a <30-day deadline) was unscheduled. | Sprint table listed only M1.1–1.5, M2.1–2.3, M3.1/3.3/3.4/3.5, M3.2/3.4, M4.1–4.3, M5.1, M6.1–6.4, M7.1–7.7 |
| **D4** | **M3.4 appeared in two sprints** (3 and 4), double-counting 2d. | Sprint 3 and Sprint 4 |
| **D5** | **Capacity was fabricated.** `5 devs × 10d = 50d` per sprint × 8 = 400d against 97d of scheduled work — **18% average utilisation** (sprint 5: 6d of stories in a 50d sprint = 12%). Nothing states how "5 devs" was derived. This violates `CONSTITUTION.md` §2 directly. | Sprint table `Capacity` column |
| **D6** | **`M` ids collided with the PRD's own milestones and meant different things.** Backlog M2 = Curriculum Graph; PRD M2 = Calibration pilot. A reader cross-referencing a risk ID to a milestone would silently get the wrong milestone. | `PRD.md` §9 M0–M6 vs backlog M1–M7 |

### Two further corrections

**M1.1's dependency was fictional.** It required ADR-010 (content submodule, `Accepted`).
No `.gitmodules` file exists; content lives in the same repository. TD-002 inherits the
same phantom dependency and is **removed** rather than deferred — there is nothing to
automate until ADR-010 is either implemented or superseded.

**TD-001 was miscategorised.** "Legacy pack migration (115 packs)" sat under *Technical
Debt*, but `verify-integrity.py` emits a schema warning about it on **every run**. Work
that a release gate blocks is not debt; it is an unfulfilled obligation. It moves to P3 as
`P3.9` with that framing, and its 20 days are the largest single item in the deferred phase.

### On the phase axis

Milestones answer *"what do we deliver?"*. The actual problem was *"what is blocked, and
what is in the MVP?"* — a question about dependencies and a cut line. Phases answer both.
Legacy `M` ids are retained per story so nothing loses its history.

---

## Phase 0 — Stack migration · BLOCKING

Everything in P1 and P2 assumes this phase is complete. No product feature may be started
against the Python implementation; it is being replaced, not extended.

| ID | Story | Legacy | Pri | Est | Depends | Spec / ADR | Acceptance |
|---|---|---|---|---|---|---|---|
| **P0.1** | Scaffold NestJS + TypeScript `strict`, eslint, prettier, jest | — | Must | 1d | ADR-012 | `CONSTITUTION.md` §4.1, §4.7 | `npm run typecheck` clean; `noImplicitAny` + `strictNullChecks` on |
| **P0.2** | TypeORM `DataSource` factory + **CI domain-isolation check** | — | Must | 1d | P0.1 | ADR-012, ADR-014 | A file under `src/domain/` importing `typeorm` or `@nestjs/*` fails CI |
| **P0.3a** | **Re-derive `docs/data-model.erd.md` from the six specs** | — | **Must** | **2d** | P0.2 | **ADR-018**, `docs/domain-model.md` | **All 16 corrections of ADR-018 §9 applied**, each naming its spec `§`. Header source becomes `specs/`, not `ITS-ARCHITECTURE.md §7`. The 9 invariants are deleted, not ported |
| **P0.3** | Derived model → ORM entities + domain entities + bidirectional mappers | — | Must | 3d | P0.2, **P0.3a** | ADR-012, ADR-015, ADR-018 | Derived model ported in full; **no `@Entity()` outside `infrastructure/entities/`**; **`mastery.gate_passed` absent** — the gate is a domain function |
| **P0.4** | Port `001_initial.py` migration; verify on PGlite **and** Postgres | — | Must | 1d | P0.3 | ADR-014, ADR-018, **ADR-019** | 4 named enums, `PGUUID`, `timestamptz`, `JSONB` created identically on both drivers; **`CREATE POLICY` present on every learner-scoped table** — ✅ **DONE 2026-10-06**: `src/migrations/1791331200000-create-schema.ts` (DDL único exportado como `SCHEMA_STATEMENTS`), gate `scripts/migration-check.mjs` verde em PGlite (10/10) e Postgres 16 (13/13), job CI `rls-integration` com `services: postgres:16-alpine`, ADR-019 (4 enums nomeados, triggers I-3/D-5/G-8, hash-chain com advisory lock, predicate RLS `missing_ok`) |
| **P0.5** | Port content loader (lessons, packs, listening) | M1.2–M1.5, M1.1 | Must | 2d | P0.4 | ADR-020 | Passes `verify-integrity.py` check [4] (`check_json`); pack schemas per ADR-004; loader TS + gate `content-check.mjs` (PGlite/PG real), unit tests, skips baseline fail-closed | **REOPENED 2026-10-10** — DONE (2026-10-07) was asserted on a gate that could not fail. `scripts/content-check.mjs` patched `drv.master = { connect: async () => … }`, but `PostgresDriver.obtainMasterConnection()` calls `this.master.connect(cb)`; the async function ignored the callback, the promise never settled, and Node exited **0 without running a single assertion**. With the harness repaired the loader fails immediately: it writes `cefr_levels (cefr_level, description)` and `modules (module_id, …)` against a schema (ADR-019) that defines `cefr_levels (code, label, …)` and `modules (id, …)`. The loader and the ERD were never reconciled → **P0.10**. The integration tests that should have caught this could not connect (P0.7) and never ran (P0.8/CI). **DONE 2026-10-11 via P0.10** — the loader now writes the ADR-019 schema and `content-check.mjs` reports `{"lessons":122,"packs":122,"dialogues":13,"slots":74,"items":921,"skips":16}` with 0 errors; `integration` (6/6) and `content-loader` are green. |
| **P0.10** | **Reconcile `content-loader.ts` with the P0.4 schema (ADR-019)** | — | **Must** | **2d** | P0.5 | **ADR-019**, ADR-020, `docs/data-model.erd.md` | Every `INSERT … ON CONFLICT` names a real table and real columns: `cefr_levels(code,label,sort_order,theta_threshold)`, `domains(id,label,tracked)`, `modules(id,…)`, `lessons(id,module_id,reuse_basis,authoring_state,publication_state,permission_state,source_ref)`, `packs(id,lesson_id,schema_version,reuse_basis,manifest,item_ids)`, `items(id,schema_version,skill_ids,…)`, `clips` (the loader's `listening_slots` does not exist). Acceptance: `integration` and `content-loader` jobs green; `content-check.mjs` reports its lesson/pack/item counts. | **DONE 2026-10-11** (ADR-022). The loader is a writer of the ADR-019 DDL: 12 tables rewritten table-for-table, one transaction, business-key upserts. The three parsers were corrected against the formats that exist on disk (prose `**Module:**`/`**CEFR:**` + metadata table + directory + bounded JSON fallback for lessons; `**item_id:**` precedence and YAML items for packs; `**Voices:**`/transcript/slot status for the corpus). `node scripts/content-check.mjs` → `{"lessons":122,"packs":122,"dialogues":13,"slots":74,"items":921,"skips":16}` / `PASS`; the 16 skips are derived (8 `MATCHING_KEY_UNSUPPORTED` items + 7 withdrawn + 1 shadow-only slot), not asserted. `npm test` 181 passed / 5 failed (all 5 pre-existing and blocked on ADR-021 `next-activity-selector`, not P0.10); `verify-integrity.py` PASS (0 failures); `prd-score.py` 96.1% PASS. Three real content defects were found by the load and fixed (a 4th option row repeating letter `C` in three packs). 7 provisional markers remain, deliberately owned by ADR-021. |
| **P0.6** | Global `ValidationPipe` + RFC 9457 `Problem` exception filter + NestJS API scaffolding for endpoints + contract tests | — | Must | 1d | P0.1 | `CONSTITUTION.md` §4.3, §4.5 | `whitelist` + `forbidNonWhitelisted` + `transform`; unknown field → 400, not silent strip | **DONE 2026-10-07** |
| **P0.7** | Test harness + test expansion | — | Must | 1d | P0.6 | — | Expandir harness de testes (PGlite reutilizável, fixtures, helpers), integration tests para loader, contract tests ampliados, unit tests parsers, script test:all; manter gates existentes verdes | **PARTIAL — corrected 2026-10-10.** Expansion landed, but `tests/helpers/db.ts` never connected: patching only `dataSource.query` leaves `createQueryRunner()` broken, so the two loader suites failed with `TypeError: object is not iterable` (from destructuring a non-tuple `obtainMasterConnection()` result) before they could assert anything. `npm test` also lacked `--experimental-vm-modules`, so the whole run aborted with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`. Both fixed 2026-10-10 (`tests/helpers/db.ts`, `package.json` test scripts). |
| **P0.8 (CI hardening)** | CI jobs: `content-loader` (PGlite seed+asserts), `contract-check` (OpenAPI lint+smoke), summary wiring | — | Must | 1d | P0.5 | ADR-020, OpenAPI | CI gates green for P0.5+P0.6; added to workflow | **CORRECTED 2026-10-10.** DONE (2026-10-07) was wrong on two counts. (1) The workflow lived at `its-platform/.github/workflows/ci.yml`; GitHub reads `<repo-root>/.github/workflows/` only, and `git log --all --diff-filter=D -- .github/workflows` shows no root workflow ever existed, so **no job in it ever ran**. (2) `content-loader` could not fail (see P0.5). The workflow now lives at the repository root with the jobs relocated and corrected: `lint` typechecks/lints TypeScript (it ran Poetry against the Python tree P0.9 deleted), and `unit`/`integration` exist as real jobs instead of comment stubs. |
| **P0.8** | OpenTelemetry bootstrap, Correlation-ID, `/health`, `/ready` | — | Must | 1d | P0.1 | `CONSTITUTION.md` §4.6 | `traceparent` propagated; `request_id` on every error response |
| **P0.9** | Contract tests green on both drivers; **delete the Python tree** | M1.5 | Must | 1d | P0.3–0.8 | ADR-012 | `its-platform/tests/contract/` passes; `src/its_platform/` and `pyproject.toml` gone; CI `bdd-tests` removed; verify-release-gates updated | DONE (2026-10-08) |

**P0 = 16d** (`1+1+2+3+1+2+1+1+1+1+2` — added P0.3a at 2d and **P0.10** at 2d; total rises from 12 to 16)

> **P0.3a is a prerequisite of P0.3, not a parallel task.** `docs/data-model.erd.md` declared
> `ITS-ARCHITECTURE.md §7` — a twenty-line *sketch* — as its source, and its invariant 1
> (`gate_passed = mastery >= 0.85`) **drops two of the four conjuncts** that `PRD.md` §6.6,
> `post-lesson` §7.1 and `curriculum-graph` §6.1 all require. Porting it first would encode a
> weakened gate into the schema, which is unrecoverable once `001_initial.py` carries it.

> **P0.7 is bounded by ADR-013.** This story validates tokens. It must not implement
> `/auth/refresh` — the platform is a Resource Server only. The published contract contains
> that path; the implementation must not.

> **P0.4's RLS clause is overdue, not new work.** `001_initial.py` contains **zero**
> `ROW LEVEL SECURITY` / `CREATE POLICY` / `current_setting` statements, against `ADR-003`
> (`Accepted`) and `CONSTITUTION.md` §2. The migration being ported is the place the policies
> should already have been, and the port is the cheapest moment to put them there.
>
> **Corrected 2026-10-11 (ADR-026).** The line that used to end this note — *"Verified on real
> PostgreSQL only — RLS, `SET LOCAL` and role-switching cannot run on PGlite (ADR-014), so a green
> PGlite run has verified nothing here"* — is false in its first half and right for a reason it does
> not name. Measured: `SET ROLE its_platform_app` + `SET LOCAL` + ADR-003's policy + its rejection
> behave identically on PGlite and on PostgreSQL. A PGlite run verified nothing because the harness
> connects as the **table owner**, and an owner is not subject to its own policies unless
> `FORCE ROW LEVEL SECURITY` is set. What genuinely needs real PostgreSQL is **two sessions**
> (contention, pool cross-talk) — P2.1/P2.2. Full measurements: `docs/adr/026`.

---

## Phase 1 — MVP core

The critical path runs **P0 → P1.8 → P1.9 → P1.10**. P1.8 is the Stage-1 pilot bank: per
PRD §9, every statistical claim downstream is blocked until it produces real `a`/`b`
parameters. This is the story the old backlog was missing.

| ID | Story | Legacy | Pri | Est | Depends | Spec / ADR | Acceptance |
|---|---|---|---|---|---|---|---|
| P1.1 | DAG loader from the lesson registry | M2.1 | Must | 2d | P0.5 | `../specs/curriculum-graph-spec.md` §4.3 | 18 modules, 123 lessons (118 regular + 5 remediation), prerequisites; acyclicity, CEFR monotonicity, reachability (all 123 lessons reachable from 8 entry points via prerequisite + cross-module edges); 18 modules, 5 remediation nodes, 8 entry points | DONE (2026-10-08) |
| **P1.2** | Mastery gate enforcement | M2.2 | Must | 1d | P1.1, P1.4 | `../specs/curriculum-graph-spec.md` §6.1, **ADR-018 §1–2** | The **full four-clause** gate, in `src/domain/`: `p ≥ 0.85 ∧ CI₉₅_lower(P) > 0.70 ∧ n_obs ≥ 3 ∧ distinct_days ≥ 2 ∧ spaced_obs ≥ 1`. `CI₉₅_lower = σ(logit(p) − 1.96/√(3+n_eff))`, `n_eff = Σexp(−λ_d·Δdays)` per `curriculum-graph` §7.2. **No stored `gate_passed`** — invariant floor | DONE (2026-10-08) |
| **P1.3** | Next-activity selector (i+1) | M2.3 | Must | 3d | P1.1, P1.2, P1.5 | `../specs/curriculum-graph-spec.md`, PRD §6, **ADR-021** | Returns lesson / pack / spaced review; honours prerequisites; **remediation priority (100k bonus), track/CEFR affinity, FSRS due items** | **NOT DONE — corrected 2026-10-10.** The `DONE (2026-10-09)` claim is contradicted by the code: `getPrerequisiteSkills()` reads `node.metadata['skills']` and `getNewSkills()` reads `node.metadata['newSkills']`, and `curriculum-parser.ts` never populates either. So `filterByMasteryGate()` unlocks everything (64 measurable nodes vs. 123) and `iPlus1Score` is constant `0`, making rule `i_plus_1` unreachable; `getFsrsPriorityForLesson()` is a stub `return 0`. The metadata exists only as the §7.1 worked example for one edge — designed, never materialised. 5 tests in `next-activity-selector.spec.ts` fail for exactly this reason. Blocker: **ADR-021** (source + canonical ids + fail-closed). Also carries committed `[DEBUG]` `console.log`s. |
| **P1.4** | BKT engine **+ `ErrorLogEntry` write path** | M3.1 | Must | 4d | P0.2 | ADR-002, ADR-015 §4, `../specs/stats-progress-evaluation-spec.md` §2 | `update_mastery()` vectorised; 10k updates < 50 ms p95; property tests. **Plus:** writes `{skill_id, pattern, produced_form, frequency, severity, first_seen, last_seen}` — `post-lesson` §4.2 ranks this by `frequency × severity × recency` and had **no table, no id and no write path** to rank | DONE (2026-10-10)
| **P1.5** | FSRS-4.5 scheduler | M3.3 | Must | 3d | P0.2 | ADR-002, `../specs/stats-progress-evaluation-spec.md` §4 | `next_interval()` monotonic; stability ≥ 0; property tests | **DONE (2026-10-10)** |
| **P1.6** | `AdaptiveEngine` orchestrator + domain events | M3.4 | Must | 2d | P1.4, P1.5 | ADR-012, ADR-011 | Emits typed domain events; handlers are idempotent (at-least-once assumed) | **DONE (2026-10-10)** |
| **P1.7** | Async task queue with priority classes | M3.5 | Must | 2d | P0.7 | ADR-005, ADR-011 | `update_bkt_mastery` priority, `schedule_fsrs` standard | **DONE (2026-10-10)** |
| **P1.8** | **Stage-1 pilot bank: 12 items, five validation criteria** | **RF-002** | **Must** | 4d | P0.4 | **ADR-017 §1–2**, `../specs/assessment-item-spec.md` §9, PRD §9 M2 | Produces the first real `(a, b)` **with declared SE** (`Var_a = 0.35²`, `Var_b = (1.75/n_raters)²`); each of the five criteria reported **pass or fail, with failures named**. **Re-scoped 10 → 12** so `diagnostic_form_v1` can be filled without repetition | **DONE (2026-10-10)** |
| **P1.9** | Fixed-form diagnostic executor `diagnostic_form_v1` (**no CAT**) | M4.1 | Must | 3d | P1.8, P1.11 | **ADR-017 §2**, `../specs/diagnostic-spec.md` §2 | **12 items** (Gram 4 · Voc 3 · Read 3 · Pron 2 · **Listening 0**), selected **by blueprint position, never by θ**. Form version pinned on the run. `authored` provenance admitted (gate G-Q7 is a *CAT* rule). **No SE stopping rule — see below** **DONE (2026-10-11) (ADR-024).** The 12-item executor, its form gate, its §3.3a lattice and its run shape. **Corrected 2026-10-11 (ADR-025):** the executor's θ estimator, `computeThetaEstimate`, implemented **none** of `diagnostic-spec.md` §3.4 — it was a fixed-point iteration whose update was not the likelihood's gradient, so θ ≥ 0 in all 4096 response patterns (0/12 sat at the population mean, A2), `se` reached 1.8×10⁷, and 2509/4096 runs overflowed `NUMERIC(6,3)`. The run *shape* was right; every number inside it was wrong. ADR-025 implements §3.4's log-posterior under an explicit `N(θ₀, 1)` prior, a 1201-point grid (`θ₀ + k·0.01`, ties → smallest θ) and `se = 1/√ΣI` (`Infinity` on an empty vector, never the old `: 1.0`). Nothing in ADR-023/ADR-024 changes; all 4096 patterns now store. `tests/domain/services/theta-estimator.spec.ts`. |
| **P1.10** | Placement result persistence | M4.3 | Must | 1d | P1.9 | `../specs/diagnostic-spec.md` | **DONE (2026-10-11).** `DiagnosticResultRepository.persist()` (`src/infrastructure/repositories/diagnostic-result.repository.ts`) writes one `diagnostic_results` row and its N `diagnostic_responses` rows in **one transaction** (the result row is every response row's FK target), mapping the P1.9 `DiagnosticRun` onto the ADR-019 DDL. Two mapping facts are load-bearing and easy to get wrong: (1) `skill_theta` is serialized as the §3.3a **lattice keyed by domain**, not a bare θ map — the G-8 trigger does `jsonb_each(NEW.skill_theta)`, so an array raises `cannot call jsonb_each on a non-object`, and flattening it to a point estimate would silently drop the `band`/`insufficient_evidence` states ADR-024 D7 introduced; (2) `created_at = run.completedAt` (ADR-024 D4), so the persisted row is a function of the run and not of when the write ran. Exposed through `DiagnosticResultService` (registered in `PlacementModule`); `tx?: QueryRunner` lets a caller that already owns a transaction join it. 12 integration tests against the **real migration** (`tests/integration/diagnostic-persistence.spec.ts`). **Closed 2026-10-11 (ADR-025):** the estimator defect this row reported — `computeThetaEstimate` (P1.9) diverging on all-correct / near-perfect runs, `se_after` ≈2.2e6, 2509/4096 runs outside `NUMERIC(6,3)` — is fixed: every pattern now stores (`|θ̂| ≤ 6`, `0 < se < 6`), and the integration suite writes the class of run it could not before — **all 12 correct** (θ = 1.46 → B1) and **all 12 incorrect** (θ = −2.07 → A1, `below_scale`) — instead of documenting their absence. **Operational:** both tables carry the `learner_isolation` RLS policy for role `its_platform_app`; the repository does not set `app.current_learner_id` (no established pattern in the repo yet). **Corrected 2026-10-11 (ADR-026): that is not a caveat, it is a defect.** Measured end-to-end through `persist()`: as `its_platform_app` with no context set, the write is rejected (`new row violates row-level security policy for table "diagnostic_results"`); the 12 tests pass only because the harness connects as the table **owner**, which is not subject to the policy (`relforcerowsecurity = false` on both tables). Tracked as **B-001**, fixed per **ADR-026** (`PgSessionContext.withLearner()`; `set_config('app.current_learner_id', $1, true)`; the predicate becomes `nullif(current_setting(…, true), '')::uuid` because after the first `SET LOCAL` on a connection PostgreSQL reports `''`, not `NULL`, and `''::uuid` raises). The owning tests landed with it — a 6-test app-role `describe` in the same file, 18/18 on PGlite and on real PostgreSQL 16. |
| **P1.11** | Start-node mapping, **ordinal + conservative** | M2.4 | Must | 2d | P1.1 | **ADR-017 §3**, **ADR-023**, `../specs/curriculum-graph-spec.md` §5.1 | `start_cefr` = the **lowest** CEFR band whose θ threshold lies inside `[θ ± 1.96·SE_eff]` — under-placement, never over-placement, same direction as `stats` §2.1's `P(L₀)=0.15`. Plus `remediation_nodes` (≤3) and `below_scale`. Property-tested: `start_cefr` monotone in θ, `start_node ∈ CurriculumGraph` | **DONE 2026-10-11 (ADR-023).** `computeStartNode` implemented the wrong rule: the point-estimate ladder `−2.0/−0.5/0.5/1.5/2.5` capped at `C1` (a 4th ladder that exists in no artefact), accepting `seEffective` and **never using it** — `ci95Lower`/`ci95Upper` were computed then discarded — plus invented `belowScale` cutoffs and all five remediation nodes returned unconditionally. ADR-023 fixes the operational meaning of ADR-017 §3 (its formula admits two readings; `diagnostic-spec` §3.6's worked example — the only executable one — decides it: `θ=−0.3, SE=0.28 → A2 → les_a2_greetings_intro`), sources the threshold set from `stats` §3.1 (`A2=−0.5, B1=0.5, B2=1.5`; §5.1's `−1.0` ladder superseded), keeps §5.1's start-node table verbatim (**the B1/IT and both B2 rows were stale** — all six replaced ids exist as real lessons, so existence could never decide a row), applies §5.1's track rule (`profile ∈ {it,dev}` **and** `vocabulary θ > grammar θ`), and caps remediation at §5.1's two live triggers (`les_rem_pronunciation_th_vw` at pronunciation θ < −1.0, `les_rem_confidence_builder` for `false_beginner_suspected`). `les_rem_listening_slow_clear` is **never** emitted at placement: ADR-017 §2/§4 forbid a trigger from reading a listening θ, and placement has 0 listening observations. Property-tested by 17 new tests (`tests/domain/services/diagnostic-placement.service.spec.ts`): 4 derived boundaries asserted on both sides, the top totality clause (θ=3.0 → `B2`, never `below_scale`), all eight table rows locked, and `start_node ∈ CurriculumGraph` swept over both tracks against the real 141-node/123-lesson registry. `domain-model.md` G-4's "monotone non-increasing" corrected to non-decreasing (it contradicted its own rule). `npm test` 198 passed / 5 failed (the 5 pre-existing, ADR-021-blocked). |
| **P1.12** | Content API — lessons, packs, dialogues | M5.1 + API layer | Must | 3d | P0.5 | ADR-004, `../specs/listening-corpus-spec.md` §4 | Only `Status=shipped`; Q-L2 ≥ 45 s validated; both pack schemas served. **ADR-027 (Accepted, 2026-10-11).** The three routes exist as mocks (`getLesson('anything')` → `title: 'Sample Lesson'`), and making them answer from the persisted catalog turned up **six measured facts**. (1) `LessonContent.required` was `[lesson_id, fase1…fase4, learner_model]`, and **no table, column or parser produced any of them** — the shape was invented in an OpenAPI file whose own header cites `ITS-ARCHITECTURE.md` §6, a section titled *"(Sketch)"*. (2) The lessons **do** carry four phases: `122/122` yield `[1,2,3,4]` under a fence-aware, generation-agnostic regex, in two header generations (**115** `## FASE n — Title [N min]`, **7** `## <emoji> FASE n: TITLE — N min`), and `121/122` carry a parseable learner-model block (absent only in `lessons/a2/les_a2_it_internet_history.md`). `fase4.items[].item_id` has **no source** at all — FASE 4's items are inline MCQ with no id, the ids live in the pack, the same lesson's FASE 4 has 2 items against the pack's 7, and the pack's ITEM 1 appears in no phase. (3) `PackContent` **contradicts ADR-004**, whose own model already says `options: List[Option]  # Empty for production/minimal-pair items` and `key: Optional[str]  # None for production items`: of 847 items, **6 have zero options and a null key** (all `scoring = 'asr_phoneme_match'`) while 841 carry exactly one A–D key. (4) `DialogueContent.slots[].key` is required and measured **null in 11 of 74** shipped slots — a **reader defect**, not a content gap: 76 option rows mark the key with `✓` in the value column and 11 mark it with `✓ —` in the trailing column, and `parseSlotTable` read only the first. Those 11 items were **unscorable** on every surface (diagnostic, shadow CAT, FSRS) and invisible to `verify-integrity.py`, whose **[9]/[11d]/[11e] glob only `packs/`**. (5) `slots[].transcript` is required and had no column: the transcript is the *authored* artefact and `clips` are derived from it (each clip keeps one turn's text + `speaker_id`, losing the speaker's name). (6) The two OpenAPI files have **drifted**: `slots[].skill` has 6 values in one and 5 in the other (`pragmatic`, used 7×, is missing from the second), `status` reads `shadow_only` vs `shadow-only`, and `distractors[].type` publishes a 4-value enum that neither matches `assessment-item-spec.md`'s six-value taxonomy nor is satisfiable (126 of 233 non-key options carry prose there); `cefr_level`'s `'^A[12]\|B[12]\|C[12]$'` is an ungrouped alternation that admits `"B1 garbage"`. **Decision:** the persisted catalog is the only read path (ADR-020 §3; the image copies no content); `LessonContent` gains `phases[]` + `learner_model` and loses `fase1`–`fase4`; the lesson body is materialised by the loader into `lessons.body JSONB` (fold criterion of ADR-018, `packs.manifest` precedent — *not* the schema ADR-022 §1 rejected); `PackContent` is restored to ADR-004; `dialogue.transcript` is stored because `clips` are derived from it. **Breaking** (CONSTITUTION §4.4): `CHANGELOG.md` + both OpenAPI files + `tests/contract/schemas.spec.ts` + the BDD scenario move together. **Part A (persistence) DONE 2026-10-11:** `lessons.body`, `dialogues.transcript`, the two-generation key reader, `content-check.mjs` asserting 122 lessons / 4 phases each / 121 learner models / the conditional key invariant / non-empty transcripts. Measured: `content-check` PASS on PGlite **and** on PostgreSQL 16 (`migration-check` 15/0, fresh cluster), suite **250 passed / 5 failed** (the 5 still only `next-activity-selector`, ADR-021). The negative control was watched failing: reverting the key rule fails with exactly the 11 slots. **Parts B/C DONE 2026-10-11:** the three routes read the persisted catalogue through `ContentRepository` + `ContentService` (no mock, no file access); an unknown id and a non-`shipped` dialogue return the **same** 404 body; both OpenAPI files carry the three amended schemas and are **constraint-identical** with descriptions stripped (the `slots[].skill` / `status` / `distractor_type` / `cefr_level` drift is closed; five non-content schemas remain divergent — recorded, out of scope). Validating the amendment against a **real payload** found two further defects *in the contract*: `required: [key]` does not exclude an explicit `key: null` (the `then` branch needed a `type` conjunct, as did `PackOption.note`'s `is_key: false` branch), and `PackOption.note`/`br_pt_form` as `type: string` were **unsatisfiable by the catalogue** — measured on the loaded DB: 3660 `item_options`, 915 key options (841 pack + 74 slot), **all 915** served `note: null`, 117 a null `br_pt_form`, and 0 of 2579 distractors with a null `note`. `tests/contract/schemas.spec.ts` is now a real validator (JSON-Schema subset, no new dependency) over **both** files plus a drift guard; `tests/integration/content-api.spec.ts` drives the real `loadContent` into PGlite and asserts the three payloads, including the 11-slot regression and the 45 s floor. Measured: suite **283 passed / 5 failed** (the 5 still only `next-activity-selector`, ADR-021), `content-check` PASS (PGlite), `typecheck`/`build`/`lint` (0 errors) / `contract:check` / `domain:check` / `rls:check` / `curriculum-check` green, `migration-check` **15/0** on a fresh PG 16 cluster, `verify-integrity` PASS (0 fail, 1 warn), `prd-score` 96.1%. |
| **P1.13** | Audio streaming with signed URLs | M5.2 | Must | 2d | P1.12 | **ADR-028** (Accepted, 2026-10-11) | **The row cited `ADR-005`, which is Celery/Redis — corrected.** 5 min TTL; KMS key rotation; **consent is *not* a precondition** (a catalogue asset carries no personal data, and a learner id in a loggable URL is disclosure without a compensating control — ADR-028 §4). New path `GET /content/listening/{dialogue_id}/audio`; admission is the **same 404** as an unknown id (`shipped` + one take complete for the whole dialogue +, for the dialogues carrying an L2 item, `ear_checked_by`/`ear_checked_at` — **11 of 13 carry one**; the other two (`dlg_a2_02_what_does`, `dlg_b1_01_incident`) have **both** their L2 items `withdrawn` (`§9 DEF-7` ×2, `DEF-10`, `DEF-11`), and because the gate is read from `items.listening_tier`, `DEF-11`'s deferred replacement (`§10.3`) re-arms it with no code change). **M3 (`PRD.md` §9) is not done: 0 renders exist**, so the endpoint is verifiable only against seeded rows — recorded in ADR-028's Consequences, not hidden. |
| **P1.14** | JWT auth wired to the IdP contract | M6.2 | Must | 2d | P0.7 | ADR-013, `CONSTITUTION.md` §4.5 | 15 min access token. **Refresh rotation is the IdP's responsibility** — `/auth/refresh` stays out of scope |
| **P1.15** | Consent management (LGPD) | M6.5 | Must | 2d | P0.7 | `CONSTITUTION.md` §8.1, ADR-013 | Granular consents; withdrawal triggers erasure |
| **P1.16** | Data export and erasure (LGPD Art. 18) | M6.7 | **Must** | 3d | P1.15 | `CONSTITUTION.md` §8.1 | `GET /me/data-export` and `DELETE /me` within **< 30 days** |
| **P1.17** | Migrate error responses `ErrorResponse` → RFC 9457 `Problem` | — | Must | 2d | P0.6 | `CONSTITUTION.md` §4.3, §4.4 | `application/problem+json` on all 9 paths. **Breaking change** — recorded in `CHANGELOG.md` with migration path before merge |
| **P1.18** | Pre-publish licence check | M6.1 | Must | 2d | P1.12 | `AGENTS.md` licensing, ADR-006 | Blocks `adapt_*` against restricted sources |

**P1 = 43d** (`2+1+3+4+3+2+2+4+3+1+2+3+2+2+2+3+2+2` — P1.4 +1d for the `ErrorLogEntry` write path)

> **P1.16 was `Should`. It is now `Must`.** Art. 18 carries a statutory response deadline.
> Classing a legal obligation as optional is how it gets missed.

> **P1.9's former acceptance criterion — *"stops at `SE < 0.3`"* — was unreachable and is
> struck.** From `stats` §4.5, `SE_stat = 1/√(n·a²/4)`; at `n = 12` that is `0.577/a`, so
> `SE < 0.3` requires **a > 1.92**, far outside the `a ≥ 1.2` authoring target and outside the
> PRD §10 falsifier's range. An acceptance criterion that no implementation can satisfy is a
> story that cannot be closed. Per ADR-017 §2 the fixed form completes at 12 items and the
> precision is *reported*, not optimised — `SE_eff ≈ 0.567`, CI₉₅ half-width ±1.11 on θ, wider
> than the 1.0 gap between CEFR thresholds, which is why P1.11 routes conservatively instead.

> **P1.2's former acceptance criterion was the defect ADR-018 exists to fix.** *"BKT p ≥ 0.85
> required for prerequisite traversal"* is `docs/data-model.erd.md`'s invariant 1 restated as a
> story: it drops the `CI₉₅_lower > 0.70` conjunct and the whole ≥3-obs / ≥2-days / ≥1-spaced
> evidence clause. `post-lesson` §7.1 states why the evidence clause exists — a learner who
> answers three questions correctly in one sitting has not demonstrated retention. Implementing
> P1.2 as written would ship that behaviour as a feature.

---

## Phase 2 — MVP release

Infrastructure and the gates that decide whether the MVP may ship.

Listed in **execution order**. Ids are sequential within the phase.

| ID | Story | Legacy | Pri | Est | Depends | Spec / ADR | Acceptance |
|---|---|---|---|---|---|---|---|
| **P2.1** | RLS policies + cross-learner integration suite | M6.4 | Must | 2d | P0.4 | **ADR-003**, ADR-014 | All learner-scoped tables; 403 on cross-learner access. **Runs on real PostgreSQL — PGlite's single exclusive connection cannot test this**. **DONE 2026-10-12**, but the first three attempts (`f41c956`, `331cc50`, `3c944d8`) shipped specs that **never ran** — see **B-002**. The repair (one file that actually runs beats three that do not): **`tests/integration/rls-isolation.spec.ts`** replaces the three deleted files — 15 tests, green in both modes (11 both-modes + 4 real-PG-only concurrency via two `pg` connections; only `TEST_DATABASE_URL` enables the real describe, not `DATABASE_URL`), and CI's `rls-integration` job now runs `(diagnostic-persistence|rls-isolation)` with `--runInBand` (measured: parallel real-mode workers drop each other's `public` schema — 23/36 failed without the flag). The verification also surfaced **B-003** (the DDL's column-level `REVOKE UPDATE (id) ON items` was inert and the gate was fooled by an FK error) — fixed per **ADR-029**: `trg_item_id_immutable` + `trg_append_only_guard` enforce immutability in PL/pgSQL for **every** role, `migration-check` asserts **six** named triggers, and its rewritten I-2 assertion requires the trigger's message as the app role **and** the owner. Measured: `migration-check` **16/0** (+ PGlite **13/0**); the three real-mode specs **37/37 on one cluster**; full suite **342 passed / 5 failed / 8 skipped / 355** (no DB URL) and **348 passed / 7 failed / 355** (real PG, the 7 all pre-existing at HEAD); `verify-integrity` PASS, `prd-score` 96.1%. **Follow-up (P0-grade, the root cause of B-002):** `tsconfig.test.json` does not compile (`TS6059` on every test file) so nothing type-checks `tests/` — make `tsc -p tsconfig.test.json` a real gate. |
| **P2.2** | Immutable, tamper-evident audit log | M6.6 | **Must** | 2d | P2.1 | **ASVS `v4.0.3-7.1.3`, `7.2.1`, `7.2.2`, `7.3.3`**, §4.6 | Append-only hash chain; WORM-backed; records auth success **and** failure, access-control denials, validation failures, consent changes, data export/erasure. **Concurrency behaviour tested on real PostgreSQL** — appends serialise, which PGlite cannot exercise. **DONE 2026-10-12 — application half + tests (the DDL half pre-existed from ADR-019).** `AuditRepository.append()` is the only write — insert-only, no `UPDATE`/`DELETE` statement exists in the file — `seq` kept as a `string` (BIGINT → `int8`), the chain computed only by the trigger, `readChain()` casting every component to the trigger's exact `::text` form so `AuditChainVerifier` (pure: no TypeORM/NestJS, ADR-014) recomputes the bytes character for character (ten `|`-joined fields, `sha256(utf8(…))`). The verifier reports the first bad row for a broken `prev_hash` link, a `row_hash` mismatch, or a **`seq` gap** — the only check that sees a deleted **middle** row (tail truncation is not claimed: a shorter chain is still contiguous, which is a WORM/retention property, not a recompute). `AuditService` validates before any write (closed 12-value `event_type`, UUID `learner_id`, plain-object `payload` — a `JSONB` array/`Date`/class instance has lost its keys) and routes learner-scoped events through `PgSessionContext.withLearner` because `learner_isolation`'s `WITH CHECK` refuses the row otherwise; a `learner_id IS NULL` system row is appended directly under a worker/admin context. **Eight of the twelve event types have no call site and none was invented** — `auth_success`/`auth_failure`/`access_denied`/`validation_failure`/`consent_granted`/`consent_withdrawn`/`data_export`/`data_erasure` belong to P1.15–P1.17 and M6, which are **not built**; the service header tabulates *why* each of the twelve exists (`stats` §9.1; ASVS `v4.0.3-7.1.3/7.2.1/7.2.2`; LGPD Art. 8/18) and states the missing call sites plainly. Measured (after the P2.1 repair: `rls-isolation.spec.ts` replaced the three never-run specs, ADR-029 landed): audit integration **4/4 on real PostgreSQL 16.15**; full suite **342 passed / 5 failed / 8 skipped / 355** (no DB URL; the 5 are still only `next-activity-selector`, ADR-021) and **348 passed / 7 failed / 355** (real PG: 5 `next-activity-selector` + 2 pre-existing `content-loader`/`loader.integration`, which CI never runs on real PG) — at HEAD (`3c944d8`) the real-PG count was **325/20/345** and **15 of those 20 failures were the three broken RLS suites this repair deleted**, so no regression from this story and the RLS layer now contributes 0 failures; `migration-check` **16/0** on a fresh PG 16.15 cluster and 13/0 on PGlite, with the I-2 assertion rewritten (app role **and** owner — see P2.1's row and ADR-029); `rls:check` **120 files / 0 violations** (three comment mentions of the GUC name in the new files reworded — Rule 1 is a literal-substring gate); `domain:check` 23 files / 0; `verify-integrity` PASS (0 fail, 1 pre-existing warn); `prd-score` 96.1% PASS. |
| **P2.3** | Kong rate limiting (Redis-backed) | M6.3 | Must | 2d | P0.8 | ADR-006 | Per-learner 100/min, per-IP 1000/min, enforced at the gateway |
| **P2.4** | **Security audit (OWASP ASVS 4.0.3 L2)** | M7.5 | Must | 5d | P1.14–1.18, P2.1–P2.3 | `CONSTITUTION.md` §8.1 | Zero critical/high; medium findings documented with owners. **Depends on P2.2** — an assessor cannot validate `7.3.3` against a system with no immutable log |
| **P2.5** | Helm chart + ArgoCD (dev/staging/prod) | M7.1 | Must | 3d | P1.7 | ADR-008 | `helm install` works; ArgoCD auto-syncs dev, manual for prod |
| **P2.6** | pgBackRest + DR | M7.2 | Must | 3d | P2.1 | ADR-009 | RPO < 1 min, RTO < 2 h; **weekly** restore test |

> **Audit finding 2026-10-06 — ADR-009 carried false `[x]` checkboxes.** Six items
> ("sidecar", "S3 repo with KMS", "WAL archiving", "backup schedule", "retention",
> "weekly restore test in CI") were marked done although **no PostgreSQL cluster, backup or
> restore test exists anywhere in the repository** — the checkboxes recorded design approval,
> not delivery. The ADR has been corrected (no box checked until the artefact exists).
> `runbook.md` §5.2 also cites legacy deployments (`api-gateway`, `curriculum-service`,
> `adaptive-engine`) that do not exist in the current stack — that section is rewritten as
> part of P2.11/P2.6, not before.
| **P2.7** | Observability stack (Prom/Grafana/Loki/Tempo) + SLO dashboards | M7.3 | Must | 3d | P0.8, P2.2 | ADR-007 | Metrics, logs, traces; `/health` + `/ready` are the bound probes; log ingestion consumes the P2.2 audit trail |
| **P2.8** | OpenTelemetry instrumentation, core request path | TD-003 (part) | Must | 4d | P2.7 | `CONSTITUTION.md` §4.6 | Traces, metrics, logs unified; remainder → P3.12 |
| **P2.9** | Resilience patterns on outbound calls | — | Must | 3d | P0.8 | `CONSTITUTION.md` §4.6 | Circuit breaker (closed→open→half-open); retry with **exponential backoff + jitter on idempotent calls only**; documented fallback; explicit timeout on every call |
| **P2.10** | Load test, 1k concurrent | M7.4 | Must | 2d | P2.3, P2.5 | `CONSTITUTION.md` §6.3 | p95 < 200 ms; error rate < 0.1%. **PostgreSQL, not PGlite** — PGlite cannot exhibit contention |
| **P2.11** | Runbook + on-call rotation | M7.6 | Must | 2d | P2.7 | `CONSTITUTION.md` §7 | Covers P1–P4; 4-week rotation. Incident procedures consume the P2.2 audit trail |
| **P2.12** | Documentation (API, architecture, runbook) | M7.7 | Should | 3d | all | `CONSTITUTION.md` §10 | `docs/` complete; OpenAPI examples on every response |

**P2 = 34d** (`2+2+2+5+3+3+3+4+3+2+2+3`)

> **Why the audit log is P2.2 and not last.** ASVS 4.0.3 `7.3.3` is a **Level 2** requirement:
> *"Verify that security logs are protected from unauthorized access **and modification**."*
> That clause cannot be assessed against a system whose logs are mutable, so running the
> assessment first guarantees a finding on `7.3.3` plus the three clauses that depend on a
> trustworthy record — `7.1.3` (auth success and failure), `7.2.1` (all auth decisions), and
> `7.2.2` (all access-control denials). Two days of work moves before a five-day assessment
> and removes a likely release-gate failure. The old order also had the property that the
> finding would be raised *by* the audit and remediated *after* it — the same work, worse
> sequencing, and an open finding carried through §6.3.

---

## Phase 3 — Deferred

**Explicitly outside the MVP.** Each item states what blocks it, so deferral is not mistaken
for neglect.

| ID | Story | Legacy | Pri | Est | Blocked by | Note |
|---|---|---|---|---|---|---|
| **P3.1** | **Stage-2 IRT calibration** | M3.2 | Could | 5d | **P1.8**, plus `n ≥ 50` responses per item | **Renamed by ADR-017 §1.** The old blocker — *"zero `a`/`b` values exist"* — is **false**: P1.8 creates them at Stage-1 with declared SE. The real blocker is `n ≥ 50` per item (`assessment` §3.2) to move off `expert_anchored` (`SE_parameter` 0.30 → 0.12). PRD §10's falsifier stands: the IRT layer is *"not viable as specified"* if the pilot cannot reach `a ≥ 1.2` on 7 of 12 |
| **P3.2** | IRT θ estimation endpoint | M4.2 | Could | 2d | P3.1 | Returns θ, SE, CI95. Cannot be built on uncalibrated parameters |
| **P3.3** | CAT simulation and validation | M4.4 | Could | 3d | P1.8 → P3.1, **plus `reviewed_by` coverage** | **Gated by ADR-017 §2 for a reason no amount of calibration fixes:** `assessment` §2.4 G-Q7 bars `authored` items from the CAT until `reviewed_by` is set, and §8.1's MVP pool is 120 items. 120 items × a named reviewer each is a content programme with no committed reviewer — PRD §7 blocker 3 records that the one independent ELT review **has not happened**, and the reviewer of that review authored the material. A CAT is blocked on **review coverage**, not on parameters |
| **P3.4** | ASR pronunciation scoring | M5.3 | Should | 5d | P1.13 | Requires rendered audio (`PRD.md` §9 M3) |
| **P3.5** | Shadow CAT mode | M5.4 | Could | 2d | P3.1 | `shadow-only` items excluded from scoring |
| **P3.6** | Curriculum graph admin API | M2.5 | Should | 2d | P1.1 | Author CRUD over modules and lessons |
| **P3.7** | Cold-start priors per skill | M3.6 | Should | 1d | P1.4, P1.1 | Population priors derived from the graph |
| **P3.8** | Model versioning and A/B framework | M3.7 | Could | 3d | P1.6 | Swap model versions per learner cohort |
| **P3.9** | **Legacy pack migration (115 packs)** | TD-001 | **Must** | 20d | — | **Reclassified from tech debt.** `verify-integrity.py` warns on this on **every run**; a release gate that blocks is an obligation, not debt. Largest single item here |
| **P3.10** | Mutation testing in CI | TD-004 | Could | 2d | P0.1 | Monthly on release branches; `CONSTITUTION.md` §4.8 sets ≥ 85% |
| **P3.11** | Chaos engineering | TD-005 | Could | 10d | P2.5, P2.9 | Pod kill, network partition, latency injection |
| **P3.12** | OpenTelemetry — non-core paths | TD-003 (rest) | Should | 6d | P2.6 | Remainder of the instrumentation sweep |
| **P3.13** | ADR-013 Q2: IdP evaluation | — | Should | 2d | ADR-013 closure | Blocked behind Q1 by design. Managed vs self-hosted, incl. LGPD posture |
| **P3.14** | **Legacy pack schema migration — close the pack-schema warning** | TD-001 | Should | 20d | P0.5 | `verify-integrity.py` emits a **WARN** on every run for 115 packs (110 with no `**Reuse basis:**` in the `pack_les_<lesson>_v1.md` schema and IDs that do not satisfy §1.2's prefix↔namespace rule). `[11c]/[11d]/[11e]` do cover them, so release gates are not blocked, but the warning is a permanent alarm. Close by bringing those packs to the same schema validation surface as `pack-les-*.md` or by retiring them. See `../specs/post-lesson-practice-spec.md` §12. **Completion metric per ADR-016 §4: `verify-identifiers.py` check I-5 (`alias coverage`) reaches 0.** Until that script exists, "close the warning" is a prose intention; with it, it is a number that goes to zero |

**P3 = 70d** (`5+2+3+5+2+2+1+3+20+2+10+6+2+20` — added P3.14 at 20d; total rises from 65 to 70)

---

## Effort summary

Arithmetic is shown because `CONSTITUTION.md` §2 forbids asserted numbers.

| Phase | Stories | Effort | In MVP |
|---|---|---|---|
| **P0** — stack migration | 10 | 14d | ✅ |
| **P1** — MVP core | 18 | 43d | ✅ |
| **P2** — MVP release | 12 | 34d | ✅ |

| **P3** — deferred | 14 | 70d | ❌ |
| **MVP total** | **40** | **91d** | |
| **Grand total** | 54 | 161d | |

### Reconciliation against the previous version

| | Previous | Now | Δ |
|---|---|---|---|
| Scheduled work | 97d (M1–M7) | 91d (P0+P1+P2) | −6d |
| Sprint capacity asserted | 400d | **none** | removed |
| Average sprint utilisation | 18% | n/a | no capacity model to misreport against |
| Stories in no sprint | 11 | **0** | fixed |
| Stories scheduled twice | 1 (M3.4) | **0** | fixed |
| Stories covering the stack migration | 0 | 10 | added |
| Story for PRD RF-002 (blocks the statistical layer) | 0 | 1 | added |
| Deferred, with a stated blocker | 0 | 14 | added (includes P3.14 to close the pack-schema warning) |
| L2 logging clauses with no implementing story | 4 | **0** | added |
| **Stories re-scoped by ADR-015…018** | — | **8** | P0.3, P0.3a, P0.4, P1.2, P1.4, P1.8, P1.9, P1.11 |
| **Acceptance criteria that were unsatisfiable as written** | — | **2** | P1.2 (weakened gate), P1.9 (`SE < 0.3` needs `a > 1.92`) |

The MVP total is **6 days smaller** than the old scheduled figure while absorbing 34 days of
Python work that must be redone, 27 days of previously-unscheduled stories, 9 days of
newly-found gaps, and 3 days added by ADR-015…018 (`P0.3a` 2d + `P1.4` +1d). The reduction
comes entirely from deferring work that **cannot currently be done** — 34d of IRT/CAT that
requires Stage-2 response data no story produces — not from optimism. `CONSTITUTION.md` §2 is
satisfied by the arithmetic above rather than by a capacity assertion.

### Two more corrections made by ADR-015…018

**P0.3's acceptance criterion was *"12 tables ported"* — matching nothing.** `docs/data-model.erd.md`
has 28, `db/models.py` and `001_initial.py` have 10 each, and `ITS-ARCHITECTURE.md §7` — the
ERD's own declared source — has 15. Three live data models, no relationship between them, and a
fourth number in the backlog. P0.3 now depends on **P0.3a**, which derives the model from the
six specs with ADR-018's 16 corrections as its acceptance criterion.

**P1.2's acceptance criterion was the defect, not the requirement.** *"BKT p ≥ 0.85 required for
prerequisite traversal"* is `data-model.erd.md:408`'s invariant 1 restated as a story. Two
independent documents would then have asserted the same weakened gate, which is how a weakened
invariant becomes permanent: the first time it is written down, it is a draft; the second time,
it is a requirement.

### Two priority corrections made after the audit

**M6.6 (audit log) was `Should`; it is now `Must`, at P2.2.** ASVS 4.0.3 `7.3.3` is a Level 2
requirement and cannot be assessed without it. `7.1.3`, `7.2.1`, and `7.2.2` depend on the
same record. Under the old order the assessment would have raised the finding and the
remediation would have followed it — same work, worse sequencing, and an open finding carried
into the §6.3 release gate.

**M6.7 (LGPD Art. 18 export/erasure) was `Should`; it is now `Must`, at P1.16.** Art. 18
carries a statutory response deadline. An obligation with a legal clock is not a `Should`.

---

## Critical path

```
P0 (14d)  ──▶  P1.8 pilot bank (4d)  ──▶  P1.9 fixed form v1 (3d)  ──▶  P1.10 placement
```

Everything else in P1 either runs parallel to this or consumes its output. **P1.8 is the
story to protect.** PRD §9: *"Everything statistical depends on M2, and M2 depends on M1 —
which is why RF-002 (the pilot bank) is High and RF-009 (the application) is Low despite
being the most visible work in the project."*

Note the tension with `PRD.md` risk **RF-009** ("build the learner-facing application"),
which is rated `Low` but is the work most likely to be started first, because it is the
part that is visible. Starting P1.12 before P1.8 yields an application that displays a
mastery probability with no calibrated confidence interval behind it — the exact failure
`../specs/diagnostic-spec.md` §3.6 records as a defect in a worked example.

---

## Bugs

| ID | Title | Severity | Status | Phase |
|---|---|---|---|---|
| ID | Title | Severity | Status | Phase |
|---|---|---|---|---|
| B-001 | **A learner-scoped write cannot run as `its_platform_app`** — `app.current_learner_id` is never set, so every learner-scoped `INSERT`/`SELECT` is refused by `learner_isolation` (or, from the second transaction on a warm connection, by `invalid input syntax for type uuid: ""`). `DiagnosticResultRepository.persist()` (P1.10) is the first instance; every later learner-scoped repository is the same. The 12 persistence integration tests are green because the harness connects as the table **owner**, which bypasses RLS. | P1 | **Fixed (2026-10-11, ADR-026).** `PgSessionContext.withLearner()` is the single writer; `DiagnosticResultService.persistRun` runs through it; the predicate is `nullif(current_setting(…, true), '')::uuid`; `scripts/rls-context-check.mjs` (Rules 1–3) is wired into `test:all` and CI. Verified: the spec is **18/18 on PGlite and 18/18 on real PostgreSQL 16.14**, the new negative control was watched failing when the role is dropped, and `migration-check.mjs` is 15/15 on a fresh cluster. **Follow-up left open, by design:** `FORCE ROW LEVEL SECURITY` (ADR-026 alternatives §6) — until then the owner role still bypasses the policies, so the harness must take `SET ROLE` for such a test to mean anything. | Phase 1 |
| B-002 | **The RLS integration suite never ran — three committed specs were broken and CI executed none of them.** `rls-concurrency.spec.ts` (331cc50) imports `../helpers/test-db.js`, which never existed (`tests/helpers/db.ts` is the helper), so it did not compile; `rls-cross-learner.spec.ts` (f41c956) asserted `rowCount` on `dataSource.query()` (TypeORM returns rows, not a `pg` Result — `undefined`); `rls-boundary.spec.ts` (3c944d8) seeded a 20-element `fsrs_parameters.w` against `CHECK (jsonb_array_length(w) = 21)`. No gate could see any of it: CI's `rls-integration` job ran **one named spec**, and `tsc --noEmit` ignores `tests/`. The 15 real-PG failures these suites carried were counted in every "full suite" claim from 3c944d8 on. | P1 | **Fixed (2026-10-12).** The three files were **deleted** (not salvaged) and replaced by `tests/integration/rls-isolation.spec.ts` — 15 tests, green in both modes (default 342/5/8/355; real PG 348/7/355 — the 7 remaining are `next-activity-selector` ×5 and the two loader suites, all pre-existing at HEAD). CI's `rls-integration` job now runs the `(diagnostic-persistence|rls-isolation)` pattern with `--runInBand` (measured necessity, recorded in the workflow comment). **Root cause follow-up (P0-grade):** make `tsconfig.test.json` compile so `tsc -p tsconfig.test.json` is a gate — then a test file that cannot compile fails CI instead of being counted as "passed". | Phase 2 |
| B-003 | **`items.id` immutability (I-2) was not enforced, and the gate that asserted it passed for the wrong reason.** The DDL's `REVOKE UPDATE (id) ON items` is inert against the table-level `GRANT UPDATE ON ALL TABLES` (PostgreSQL ACLs have no negative entries; a column-level REVOKE cannot carve a column back out of a table-level grant) — measured: `has_column_privilege('its_platform_app','items','id','UPDATE')` = true, `pg_attribute.attacl` has no row for `items`, and `UPDATE items SET id` as the app role rewrote the primary key. `migration-check`'s I-2 assertion passed 16/16 only because its own seeded `item_options` children made the UPDATE fail with `item_options_item_id_fkey` — an RI error mistaken for a permission proof. | P1 | **Fixed (2026-10-12, ADR-029).** Immutability moved to PL/pgSQL: `trg_item_id_immutable` (raises `items.id is immutable` when `NEW.id IS DISTINCT FROM OLD.id`) and `trg_append_only_guard` (X-3, WORM for `append_only_events`) cover **every** role — table owner and `its_platform_admin` included, which no REVOKE can express. The inert column REVOKE is removed from both sections; `migration-check` asserts **six** named triggers and its rewritten I-2 assertion seeds an item with **no** options children and requires the trigger's `/immutable/` message as the app role **and** as the connection owner. Covered at two layers: `rls-isolation.spec.ts` and `audit-append.spec.ts` both assert the trigger under both roles. | Phase 2 |

---

## Definition of Ready (DoR)

- [ ] Acceptance criteria are testable and name the spec or ADR they satisfy
- [ ] Every dependency is `Done` or explicitly waived in the PR description
- [ ] Contract tests written for new endpoints
- [ ] Estimated, and the estimate's basis stated

## Definition of Done (DoD)

Aligned with `CONSTITUTION.md` §4.8. **The previous version of this list said "≥ 90%
coverage for new code", which was weaker than §4.8 on algorithms and silent about three
mandatory layers** — a standard that weakened without being declared, contrary to §9 step 3.

- [ ] Code complete and self-reviewed
- [ ] **Domain isolation holds** — no `typeorm` or `@nestjs/*` import under `src/domain/` (P0.2 check green)
- [ ] Unit tests ≥ **95%** for algorithms; ≥ **90%** for parsers and loaders (§4.8)
- [ ] Integration tests ≥ 80%; run against the driver this story requires (PGlite or PostgreSQL — ADR-014)
- [ ] **Contract tests pass for 100% of the endpoints touched**
- [ ] **BDD scenarios pass for the PRD milestone this story serves**
- [ ] Lint, format, typecheck, and `spectral` clean
- [ ] No PII in log output — verified, not assumed (§4.6)
- [ ] Reviewed and approved
- [ ] Documentation updated; ADR added if §5 applies
- [ ] No open P1/P2 bugs

**Removed from this list:** *"Deployed to staging + smoke tested"*. Deployment is a
release-level gate under §6.3, not a per-story one; requiring it per story made the DoD
depend on infrastructure that is not ready until P2.5.

---

*Restructured 2026-10-04. Defects D1–D6 and the two corrections are recorded above so the
change is auditable — a restructure that cannot state what was wrong is indistinguishable
from a preference.*
