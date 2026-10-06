---
adr: 015
title: Domain model — eight bounded contexts, declared aggregate roots, and single-tenant MVP
status: Accepted
date: 2026-10-05
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@backend-lead, @platform-lead, @security-lead]
informed: [@team]
tags: [domain-model, ddd, bounded-contexts, aggregates, tenancy, consistency]
---

## Context

`ITS-ARCHITECTURE.md` §3 draws a data-flow diagram with seven boxes and arrows. It names no
aggregate, no aggregate root, no consistency boundary, and no contract on any arrow. The six
specs in `specs/` define predicates over concepts they never declare:

| Predicate in a spec | Concept it needs | Declared anywhere? |
|---|---|---|
| `curriculum-graph` §6.1 — `∀ skill ∈ prereq_skills(les_B): P(mastery) ≥ 0.85` | the prerequisite **skill set** of a lesson | **No** — `§4.1` has a *Prereq Lessons* column only. It exists solely inside lesson-file JSON (`mastery_gate.required_skills`), which `curriculum-graph` does not read |
| `post-lesson` §4.2 — rank the error log by `frequency × severity × recency`; select a distractor containing "the distinctive wrong form the learner produced" | **the error log** | **No** — no id, no schema, no write path |
| `curriculum-graph` §4.3 — remediation trigger `listening θ < −1.5` | a listening θ | `diagnostic` §2.1.1(3) makes it **permanently unproducible** |
| `curriculum-graph` §11 — Content Selector input is **affective state** | affective state | **No** — named as an input, never defined |
| `curriculum-graph` §11, `stats` §12 — **Pedagogical Memory** | traversal log, completion history | **No** |
| `assessment` §7 — a retired item *"remains queryable — a learner who was placed using a retired item must still be auditable"* | the append-only event log | `stats` §9.1 gives an 18-field schema; **no table, no artefact class, therefore no gate** (`SDD.md` §1 forbids a class without one) |

`curriculum-graph` §1.1 declares **four** node kinds — Lesson, Module, Milestone (`ms_`),
Diagnostic Entry (`diag_`) — each with its own mastery gate. `§11` then makes Gamification
depend on Milestone nodes. Instantiations of `ms_` and `diag_`: **zero**.

**The specs are a set of predicates without a set of nouns.** That is not a documentation
defect; it is the reason `docs/data-model.erd.md` had to invent a structure. That ERD declares
its source as `ITS-ARCHITECTURE.md §7` — a twenty-line diagram headed *"Data Model (**ERD
Sketch**)"* which contains no `items`, no `options`, no `skills`, no `dialogues`, no `voices`,
no FSRS. The DDL was expanded from a sketch rather than derived from the six specs it exists to
represent, and it diverges from them in sixteen places.

### Tenancy is undetermined and it moves an aggregate boundary

`ITS-ARCHITECTURE.md` §12 item 4 lists *"Multi-tenant (schools) vs. single-tenant (B2C)"* as an
open question due at M1 — the first milestone. It is still open. This is not a
configuration flag:

- `ADR-003` is `Accepted` and builds isolation on `current_setting('app.current_learner_id')`.
  A tenant hierarchy needs a **second** predicate, and RLS policies compose them: `USING
  (tenant_id = current_setting('app.current_tenant_id')::uuid AND id = …)`. That is a policy
  rewrite on every learner-scoped table, not a new column.
- `CONSTITUTION.md` §6.1 makes a security-model change a **MAJOR** version bump.
- A school model implies `Organization`, and `Organization` sits **above** `LearnerAccount` in
  the aggregate tree. Every query, every repository signature, and every `fk` changes.

### Three live data models

| Artefact | Tables | Notes |
|---|---|---|
| `ITS-ARCHITECTURE.md` §7 (sketch) | 15 | declared source of the ERD |
| `docs/data-model.erd.md` | **28** | `v0.1.0-draft`, 0 RLS policies, 0 pgvector |
| `src/its_platform/db/models.py` + `001_initial.py` | **10** | no `items`, `options`, `skills`, `modules`, `lessons`, `dialogues`, `voices` |
| `BACKLOG.md` P0.3 acceptance | **"12 tables ported"** | matches none of the above |

## Decision

### 1. Eight bounded contexts, with declared roots and consistency boundaries

The six specs already imply their own boundaries by self-declaring authority
(`assessment-item-spec.md` §1: *"Authoritative for: item schema, calibration protocol,
distractor taxonomy, DIF, lifecycle, bank sizing"*; `diagnostic-spec.md` §2.1.1 reserving
Listening). This ADR gives those boundaries names, roots, and the ownership each one lacks.

| # | Context | Aggregate root(s) | Consistency boundary | Owns |
|---|---|---|---|---|
| 1 | **Curriculum Catalog** | `CurriculumGraph` | one write per content commit | modules, lessons, prerequisites, skill taxonomy, CEFR mapping |
| 2 | **Item Bank** | `AssessmentItem` | one item, one lifecycle transition | items, options, distractors, calibration `(a,b)`, review gates §5, lifecycle §7 |
| 3 | **Listening Corpus** | `Dialogue` | one dialogue incl. its clips | clips, slots, `Speaker`, `Voice`, render/take, Q-L1…Q-L10 |
| 4 | **Learner Model** | `LearnerModel` | one learner; per-skill estimates inside | `P(mastery)` + CI, θ + SE, FSRS review state |
| 5 | **Delivery** | `LearningSession` | one session (10–35 min) | attempts, responses, FASE 1–4 progression |
| 6 | **Diagnostic / Placement** | `DiagnosticRun` | one run; 12–28 items, one sitting | item selection under blueprint, θ, CEFR band, start node, `placement_provisional` |
| 7 | **Selection & Scheduling** | *none — stateless policy* | none; a pure function of 1, 2, 4 | `/next` decision, L2 due-queue, L3 set generation |
| 8 | **Identity & Compliance** | `LearnerAccount`, `ConsentRecord` | one account; one consent per purpose | identity, consent, audit log, data-subject export/erasure |

**Two consistency boundaries are explicitly saga, not transaction**, and are recorded here so
nobody puts them in a transaction:

- `post-lesson` §7.2 (gate failure: continue → re-present 3 items → 2 more sessions → route to
  `les_rem_*` → flag a human) spans **multiple sessions**. It is a process, owned by context 7.
- `diagnostic` §2.1.1(4) (the re-diagnostic is *"a scheduled event, not a user action"*) spans
  time and is triggered by **audio corpus render completion**, not by a request.

### 2. Single-tenant B2C for the MVP; tenancy is a MAJOR change, not a column

`learners` gets **no** `tenant_id`. `Organization` does not exist. RLS keeps exactly the
ADR-003 predicate.

ADR-003's own title says *"for multi-tenancy"* while its mechanism is per-learner. **This ADR
narrows ADR-003's scope claim to what it implements**: learner isolation. It does not
supersede ADR-003 — the GUC, `SET LOCAL`, and distinct-role mechanism are unchanged — but the
title overstates it, and a future reader must not read it as authorising a tenant hierarchy.

To keep the door open without paying for it, the RLS context is introduced as a value object
with one seam:

```typescript
// domain/ — framework-free, no typeorm import (§4.2)
interface SessionContext { readonly learnerId: string }
// infrastructure/ — the single place that writes the GUC (ADR-003)
class PgSessionContext implements SessionContext { /* SET LOCAL app.current_learner_id */ }
```

Adding a tenant later means a second GUC and a second conjunct in each policy. It does not mean
rewriting the domain, because the domain never names the GUC.

### 3. `ms_` and `diag_` are removed, not instantiated

`curriculum-graph` §1.1's four node kinds become **two** (Lesson, Module). `ms_` and `diag_`
are struck rather than populated, because §11's Gamification dependency on Milestone nodes is
the only consumer and `PRD.md` §4 counts **0** badges. `CONSTITUTION.md` §9 step 3 applies: a
declared-but-empty type is a promise the repository does not keep.

Removing them removes `learners.streak_days` and `learners.xp` — both present in
`data-model.erd.md` with **no basis in any spec**, in a product whose PRD rates the
learner-facing application `RF-009` **Low**.

### 4. The three missing entities are declared here, minimally

| Entity | Where it lives | Minimal shape |
|---|---|---|
| `ErrorLogEntry` | context 4, inside `LearnerModel` | `{ learnerId, skillId, errorPattern, frequency, firstSeen, lastSeen, producedForm }`. `errorPattern` is the vocabulary `content-map` §9.1 *predicts* (`null_subject`, `eventually`, `responsible_of`); `producedForm` is what the learner **actually wrote**. `post-lesson` §4.3's distinction is the whole point — the predicted error is not the observation |
| `SkillPrerequisite` | context 1 | `(lesson_id, skill_id, weight)` — **migrated out of lesson-file JSON into the graph**, so §6.1's gate predicate becomes derivable from the Catalog and not from a markdown field |
| `AffectiveSignal` | context 4 | `{ learnerId, kind, observedAt, strength }` with `kind ∈ {skip_streak, hint_seeking, session_abandon, time_on_task_spike}` and **no scoring rule in the MVP**. Recorded so `curriculum-graph` §11's input exists; deliberately not wired into selection, because no spec defines how to read it |

### 5. The event log is promoted to a first-class artefact class

`stats` §9.1's 18-field append-only event becomes the `AppendOnlyEvent` aggregate, owned by
context 8, with a closed `event_type` vocabulary, a retention policy, and — per
`CONSTITUTION.md` §4.6 — a hash-chained, append-only store. `assessment` §7 requires it (a retired
item *"remains queryable"*, and so must every placement and every calibration decision that touched
it), and the store it needs already has a story: `BACKLOG.md` P2.2, which also already requires
real PostgreSQL for its concurrency behaviour.

**Scope correction.** `SDD.md` §1's rule — *"a new artefact class may not be added without a gate"* —
governs **content artefacts only**: files in the content repository, read by `verify-integrity.py`.
`AppendOnlyEvent` is a table in `its-platform` and cannot be gated there, so registering it in
`SDD.md` §1 would have produced a gate that cannot read its artefact — false coverage, which is
worse than the absence of a gate because it reads as coverage. Its gate is `CONSTITUTION.md` §4.6
+ ASVS `v4.0.3-7.3.3` + `BACKLOG.md` P2.2. What `SDD.md` §1 *does* gain, under ADR-016, is class 8:
the **audio clip / render manifest**.

## Consequences

### Positive

- §6.1's central gate predicate becomes computable from data the Catalog owns.
- The repository has one data model with a stated derivation, replacing three with no
  relationship.
- Contexts 7 and 8 are pure or near-pure, which is where the property tests from
  `CONSTITUTION.md` §4.8 (`mutmut` ≥ 85%) have the most surface to bite on.
- The tenancy question is closed at the only point where closing it is cheap.

### Negative

- **This record invalidates work already done.** `data-model.erd.md` (28 tables) and
  `db/models.py` (10 tables) both become non-authoritative. `BACKLOG.md` P0.3's "12 tables
  ported" is unreachable as written and is re-scoped by ADR-018.
- Declaring `SkillPrerequisite` as a table means the lesson-file `mastery_gate.required_skills`
  becomes a **derived** value, so the loader has a second source of truth to reconcile against.
  The loader is the ACL (see ADR-016) and must assert equality, failing the content check on
  divergence.
- `AffectiveSignal` is recorded but unread. Dead data on day one is a real cost, accepted
  because the alternative — deleting the input from `curriculum-graph` §11 — weakens a spec.
- Eight contexts is more than a team of this size can staff as eight deployables. **Contexts are
  a modular-monolith decomposition, not a deployment topology.** One deployable, eight modules.

### Neutral

- Context 7 being stateless does not mean it is cheap: `post-lesson` §4.2's L3 generator is the
  most algorithmically dense rule in the product and will need its own property tests.
- `ADR-003` stays `Accepted` and is not superseded. Its title is noted as overstating scope.

### What weakens (CONSTITUTION.md §9 step 3)

| Weakened | Before | After | Why accepted |
|---|---|---|---|
| Graph node kinds | 4 (Lesson, Module, Milestone, Diagnostic Entry) | 2 | `ms_`/`diag_` had **zero** instances repo-wide while carrying gates and a Gamification dependency. Declaring them was an unfunded promise |
| Gamification surface | `learners.streak_days`, `learners.xp`, `AGENTS.md` component 10 | removed from persistence | No spec defines a badge, a threshold, an award event, or a revocation rule. `AGENTS.md` remains a pedagogical intention, not a persistence obligation |
| Tenancy | Open question, due M1 (§12.4) | Closed: single-tenant | Closing it as *open* until P2 would have meant P0.3 porting a `learners` table whose aggregate boundary was still undetermined |

## Alternatives Considered

1. **Nine contexts, splitting `Selection & Scheduling` from `Diagnostic`.** Rejected — the
   start-node mapping (`curriculum-graph` §5.1) is a diagnostic output, not a scheduling
   decision, and splitting them puts the `false_beginner` profile vocabulary across a boundary.
2. **`Item Bank` and `Listening Corpus` merged.** Rejected — provenance differs materially:
   `listening-corpus-spec.md` §2.4 makes CAT eligibility a function of `provenance.kind`, and a
   merge would apply item-level rules to clips that need per-clip ear checks (Q-L7, 20 % sample).
3. **`Pedagogical Memory` as its own context.** Rejected — it is a projection over contexts 4, 5
   and 6, not a source of truth. Making it a context would create a second writer for learner
   state and violate `CONSTITUTION.md` §2 Defense in Depth.
4. **Multi-tenant now.** Rejected — no school customer is named in `PRD.md` §3, whose four
   personas are all individual learners. Adopting it now pays a permanent policy cost for a
   requirement with no recorded source.
5. **Instantiate `ms_`/`diag_` rather than strike them.** Rejected — it creates 18+ artefacts of
   content to satisfy a type declaration, and `PRD.md` §10 does not list badge coverage as a
   falsifier.
6. **Split `Identity & Compliance` from `Audit`.** Rejected — LGPD Art. 18 export/erasure is
   `BACKLOG.md` P1.16 at **Must**, inside a 30-day statutory clock. It belongs with the consent
   record that triggers it, not in a context that would be deferred for being inconvenient.

## Implementation Plan

- [ ] `docs/domain-model.md` published: context map, aggregate roots, invariants per root,
      the 16 ERD corrections (ADR-018)
- [ ] Strike `ms_`/`diag_` from `curriculum-graph-spec.md` §1.1 and remove the Gamification row
      from §11 — via `SDD.md` §9 amendment, defects named
- [ ] Add `SkillPrerequisite` extraction to the Catalog loader; assert equality with lesson-file
      `mastery_gate.required_skills`, failing the content check on divergence
- [ ] `AppendOnlyEvent` wired into `BACKLOG.md` P2.2's audit store (already `Must`); it is
      **not** a `SDD.md` §1 artefact class — see §5's scope correction
- [ ] `BACKLOG.md`: insert `P0.3a` (derive the ERD per ADR-018) before `P0.3`; amend P0.3's
      acceptance criterion; add `ErrorLogEntry` write path to `P1.4`
- [ ] `docs/adr/README.md` index updated; `data-model.erd.md` header marked superseded
- [ ] Re-open `ITS-ARCHITECTURE.md` §12 item 4 as **closed by ADR-015**

## References

- `ITS-ARCHITECTURE.md` §3 (data flow), §7 (ERD sketch), §12 item 4 (tenancy)
- `specs/curriculum-graph-spec.md` §1.1, §1.2, §4.1, §4.3, §5.1, §6.1, §7.2, §11
- `specs/stats-progress-evaluation-spec.md` §2, §6.2, §7.2, §9.1, §12
- `specs/diagnostic-spec.md` §2.1.1, §3.3a, §4.1, §4.2
- `specs/assessment-item-spec.md` §1, §2.4, §5, §7
- `specs/post-lesson-practice-spec.md` §4.2, §4.3, §7.2
- `specs/listening-corpus-spec.md` §2.4, §3, §4
- [ADR-003](003-postgresql-rls.md) · [ADR-012](012-migrate-api-layer-to-nestjs.md)
- `CONSTITUTION.md` §2, §4.2, §4.6, §6.1, §8.1, §9
- `docs/data-model.erd.md` (28 tables, superseded) · `src/its_platform/db/models.py` (10 tables)
