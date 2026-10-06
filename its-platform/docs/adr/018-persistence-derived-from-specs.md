---
adr: 018
title: Persistence derived from the specs — and the invariant floor (no stored rule weaker than its predicate)
status: Accepted
date: 2026-10-05
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@backend-lead, @dba, @security-lead, @qa-sdet]
informed: [@team]
tags: [data-model, erd, postgres, invariants, rls, migration, pgvector]
---

## Context

`docs/data-model.erd.md` v0.1.0-draft declares its source as `ITS-ARCHITECTURE.md §7` — a
twenty-line diagram headed *"Data Model (**ERD Sketch**)"*, which contains no `items`, no
`options`, no `skills`, no `modules`, no `dialogues`, no `voices`, and no FSRS. **The DDL was
expanded from a sketch instead of derived from the six specs it exists to represent.** Every
divergence below descends from that choice.

Three data models are live simultaneously, with no relationship between them:

| Artefact | Tables | Learner-scoped tables with RLS policies |
|---|---:|---:|
| `ITS-ARCHITECTURE.md` §7 (sketch) | 15 | — |
| `docs/data-model.erd.md` | **28** | **0** |
| `db/models.py` + `001_initial.py` | **10** | **0** |
| `BACKLOG.md` P0.3 acceptance | *"12 tables ported"* | — |

`ADR-003` is `Accepted` and specifies isolation as
`USING (id = current_setting('app.current_learner_id')::uuid)`. `grep -c "ROW LEVEL SECURITY |
CREATE POLICY | current_setting"` against `001_initial.py` returns **0**. `CONSTITUTION.md` §2
names RLS as the application layer of Defense in Depth. Nothing implements it.

### The single most damaging line in the ERD

`docs/data-model.erd.md:408`, invariant 1 of 9:

```
1. **Mastery gate**: gate_passed = (mastery >= 0.85) — trigger on UPDATE
```

`PRD.md` §6.6 decision 6, `post-lesson-practice-spec.md` §7.1, `curriculum-graph-spec.md` §6.1
and `stats-progress-evaluation-spec.md` §3.2 **all** state the gate as:

```
P(mastery) ≥ 0.85  ∧  CI₉₅_lower(P(mastery)) > 0.70  ∧  ≥ 3 observations across ≥ 2 distinct days, incl. ≥ 1 spaced
```

The trigger discards the uncertainty clause and the evidence clause. `mastery` is
`NUMERIC(4,3)` — one scalar. **There is no confidence interval on `P(mastery)` anywhere in
either data model**, and `theta_estimates.ci95_*` is an interval on θ, a different quantity read
at a different scale. A database that materialises this trigger would unlock prerequisites in
exactly the failure mode the repository exists to prevent, and it would do so **silently**,
because a scalar threshold looks correct.

`CONSTITUTION.md` §9 step 3 requires a weakening to be stated. `AGENTS.md` records the same
class of defect fourteen times, each found by `verify-integrity.py` and not by reading:
*"A number without a derivation is a defect in that document."*

### A formula that cannot produce its own stated range

`post-lesson-practice-spec.md` §2.1: `items = clamp(round(2 + 3 × P̂_mastery), 4, 8)`.

```
P̂ ∈ [0,1]  →  2 + 3P̂ ∈ [2,5]  →  round → [2,5]  →  clamp → [4,5]
```

**6, 7 and 8 are unreachable at any mastery level.** The spec's own worked example (§8.1,
`p_hat_mastery: 0.55`, comment `item_count: 7  # = clamp(round(2 + 3 × 0.55), 4, 8) = 7`) computes
`round(3.65) = 4 → clamp = 4`, not 7. And §2.2's per-domain minimums sum to **6**, while the
formula's maximum is **5** — the two sections are jointly unsatisfiable and **no legal L1 pack
exists**. ERD invariant 4 then hard-codes `packs = 7 items` as a CHECK, persisting the one value
the formula cannot produce, and is wrong for L2 (5–12, §3.4) and L3 (≤6, §4.2) regardless.

## Decision

### 1. The invariant floor — a new principle in `CONSTITUTION.md` §2

> **No persisted invariant may be weaker than the predicate it materialises.** A stored
> constraint that drops a conjunct of its governing predicate is not a simplification; it is an
> undeclared weakening and is rejected under §9 step 3. Where the predicate cannot be evaluated
> at the storage layer, **it is derived in the domain layer and never stored at all** — it is
> not approximated in the database.

Applied immediately: `mastery.gate_passed` and its trigger are **deleted**. The gate is a domain
function. The database stores the evidence; the domain decides.

### 2. `CI₉₅_lower(P(mastery))` — derivation, and it is derived not stored

`stats` §3.2 requires a CI on the mastery probability. BKT's posterior variance is not available
in closed form, and BKT is a filtering model, not a generative one. The MVP uses an effective-sample
form on the logit scale, with the decay already specified in `curriculum-graph` §7.2
(`P(know)_t = P(know)_0 × exp(−λ·days)`; **λ = 0.02 vocabulary, 0.005 grammar, 0.03
pronunciation**) — a rule that currently has nowhere to live:

```
n_eff     = Σ_i  exp( −λ_domain · days_since(observation_i) )
z         = logit( p_know )
SE_logit  = 1 / √( 3 + n_eff )                      # 3 = normal-prior pseudo-count → finite at n = 0
CI₉₅_lower(P) = σ( z − 1.96 · SE_logit )
CI₉₅_upper(P) = σ( z + 1.96 · SE_logit )

gate(skill) = p_know ≥ 0.85
            ∧ CI₉₅_lower > 0.70
            ∧ n_obs ≥ 3
            ∧ distinct_days ≥ 2
            ∧ spaced_obs ≥ 1
```

Worked check at `p_know = 0.90`:

| Evidence | `n_eff` | `SE_logit` | `CI₉₅_lower` | Numeric clause | Evidence clause |
|---|---:|---:|---:|---|---|
| 3 obs, same day | 3.00 | 0.408 | 0.802 | pass | **fails** (1 day, 0 spaced) |
| 3 obs, 2 days | 2.95 | 0.410 | 0.801 | pass | **fails** (0 spaced) |
| 5 obs, 2 days, 1 spaced | 4.90 | 0.310 | 0.856 | pass | pass |

The evidence clause does real work rather than decorating a threshold, which is its purpose. All
three quantities are **derived**; only `p_know`, `n_obs`, `distinct_days`, `spaced_obs` and
`last_practice_at` are stored.

**This is a modelling assumption, not a derivation from data**, and is registered as one:
approximating a BKT filter's uncertainty by an effective-sample logit interval is unvalidated.
`PRD.md` §10 gains a falsifier — *"if observed mastery calibration error `|P − empirical|` exceeds
the 0.05 target in `stats` §12 and the error is not explained by the `n_eff` approximation, the
interval must be replaced by a proper Bayesian filter (Beta-Binomial on the correct/incorrect
count) before the gate is trusted for progression."* The Beta-Binomial alternative is recorded
here as the designated replacement.

### 3. `fsrs_states.retrievability` — deleted, and `w` is versioned

The GENERATED column implements `R(t) = exp(−t/S)`. `stats` §6.1 mandates
`R(t) = (1 + FACTOR·t/S)^DECAY` with `DECAY = −w[20] = 0.1542` and
`FACTOR = 0.9^(1/DECAY) − 1 = 0.9803`:

| `t` | `exp(−t/S)` | `(1+0.9803·t/S)^(−0.1542)` |
|---|---:|---:|
| `S` | 0.368 | 0.900 |
| `10S` | ≈ 0.000045 | **0.693** |
| `365S` | ≈ 0 | **0.404** |

A materialised retrievability is **wrong by construction**, and it is also **wrong per row over
time**: it freezes the current parameter set into the row, and `stats` §6.2a schedules a refit at
512 pooled reviews. Therefore:

- **`retrievability` is deleted.** `R` is computed in the domain from `stability`, `last_review`
  and `w_version`.
- **`fsrs_states.w_version TEXT NOT NULL`** is added, so a row is attributable to the parameter
  set that produced it.
- `due_date` is kept as a stored projection (it is an index target), with the same rule: it is
  derived, it carries its derivation's version, and it is recomputed on `w_version` change.

### 4. Grade scale — `post-lesson` §3.2/§3.3 is inverted relative to FSRS-4.5

`post-lesson` §3.2 declares `R = 1 | 2 | 3` and §3.3 assigns **correct-immediately → 1**.
FSRS-4.5 derives `S0` from four values in the order 0.212 / 1.2931 / 2.3065 / 8.2956, where
**1 is the worst rating (Again)**. The two scales are inverted, and mapping three grades onto a
four-rating parameterisation was never stated. Decision — adopt FSRS's native scale and map
§3.3's five rows explicitly:

| `post-lesson` §3.3 outcome | FSRS rating | Rationale |
|---|---|---|
| correct after hint | **3 (Good)** | plus §3.3's rule: re-queued in the same session |
| correct after hesitation | **3 (Good)** | correct with effort |
| incorrect then self-corrected | **3 (Good)** | §3.3: *"Self-correction is the success signal."* |
| correct immediately | **4 (Easy)** | perfect, immediate recall |
| incorrect, no hint | **1 (Again)** | total blackout |

All four ratings are exercised, so `S0` and `D0` are both reachable. `Hard (2)` is reserved for
guided recall and is currently unassigned — recorded rather than forced.

### 5. One `items` table for all scored content, with listening as a subtype

`fsrs_states` is keyed `(learner_id, item_id)` with `item_id REFERENCES items(id)`, but listening
slots live in `listening_items` — while `post-lesson` §3.4 schedules L2 review across **all five
domains including Listening**. Roughly one fifth of the review queue is unmodellable, and ADR-015
already places both in Item Bank / Listening Corpus under one owner boundary.

**Decision: `listening_items` becomes a subtype of `items`**, discriminated by
`modality = 'listening'` and a nullable `dialogue_id` FK. `Dialogue` (context 3) owns `Speaker`,
`Voice`, `Clip` and `clip_renders`; `AssessmentItem` (context 2) owns the slot's stem, key,
distractors, calibration and lifecycle. One item table, one FK, one FSRS queue, one
`skill_ids TEXT[]`. The lesson↔item and dialogue↔item relationships are then *different
associations of one aggregate*, not two nearly-identical tables.

### 6. Status vocabularies — collision resolved by naming, not by merging

Two closed vocabularies collide in one repository: `SDD.md` §4's five authoring states
(`authored, specified, unauthored, blocked, withdrawn`) with *"a word outside this set in any
status column is a defect"*, and `listening-corpus-spec.md` §5's
(`shipped, withdrawn, shadow-only`). `curriculum-graph` §4.3 additionally uses
`blocked_no_adequate_source`, which the ERD's own CHECK **cannot store**, and `SDD.md` §11
introduces `shipped` and `shadow-only`, which §4 forbids.

Decision — one vocabulary per question, columns named for their question:

| Column | Vocabulary | Owner | Question it answers |
|---|---|---|---|
| `lessons.authoring_state` | `authored \| specified \| unauthored \| blocked \| withdrawn` | `SDD.md` §4 | does the design and its artefact exist? |
| `lessons.publication_state` | `publishable \| restricted_pending_permission \| not_publishable` | `external-sources.md` §7.0 | may it ship? |
| `lessons.permission_state` | `not_required \| requested \| granted \| refused` | `external-sources.md` §7.0 | has written permission been obtained? |
| `items.retired` | `false \| true` + `retired_reason` | `assessment` §7 | pulled by defect, retained for audit, not served |
| `listening_items.status` | `shipped \| shadow_only` | `listening-corpus` §5 | servable? |

**`retired` replaces `withdrawn` for pulled-by-defect retention across all content classes**, which
unifies `SDD.md` §11 ("`withdrawn` is for items pulled by defect") with `assessment` §7
(`quality.retired`). `withdrawn` remains in `authoring_state` only, meaning "removed". Two words,
two questions, no overlap.

`permission_state` has **no home in any current artefact**. `reuse_basis = 'adapt_requires_permission'`
records that a lesson *requires* permission — never whether it was *obtained*. So the 48
permission-gated lessons of `PRD.md` §2 carry no fact about their own status, and `PRD.md` §9's
M5 exit condition (*"the 13 externally-sourced lessons publish with attribution strings; the 48
restricted ones either hold permission or are excluded"*) cannot be evaluated from the database at
all. `cite_only` lessons — the original material, publishable with no permission — are equally
indistinguishable. One column answers the question; `reuse_basis` does not.

### 7. The L1 pack-size formula is re-derived, not patched

```
items = clamp( round( 4 + 5 × P̂_mastery ), 5, 8 )
```

| `P̂` | 0.0 | 0.2 | 0.4 | 0.6 | 0.8 | 1.0 |
|---|---|---|---|---|---|---|
| `items` | 5 | 5 | 6 | 7 | 8 | 8 |

- Every value in **[5, 8]** is reachable.
- The spec's own worked example reproduces: `P̂ = 0.55 → round(6.75) = 7`, matching the `7` its
  §8.1 comment already asserts.
- **Floor 5, not 4**, because `post-lesson` §2.2's per-domain minimums become
  Grammar 2 · Vocabulary 1 · Reading 1 · Pronunciation 1 = **5** once Listening is removed —
  Listening items are `shadow_only`/`retired` until audio renders (`PRD.md` §9 M3), and 0 listening
  items is a §2.3 reality, not a design choice.
- **Re-derive when listening returns.** With audio, the floor returns to 6 and the formula must be
  recomputed; this ADR does not pre-authorise a value for that case.

§2.2's distribution table is amended to state the tie-break: surplus slots beyond the four
mandatory domains are allocated **to the lesson's `required_skills` in registry order**, so a pack
is a deterministic function of `(lesson_id, P̂)` and two learners with the same state get the same
pack. ERD invariant 4 is deleted as a CHECK and becomes a **domain construction rule**, because it
does not hold for L2 (5–12) or L3 (≤6).

### 8. `pgvector` and `content_embeddings` are removed from the MVP

The ERD declares `VECTOR(1536)`, an HNSW index, and a `content_embeddings` table. **No endpoint
uses it, no spec mentions it, and `RNF-001` forbids an asserted artefact.** Content is served by
id. Deferred to P3 with a stated blocker: a retrieval requirement that names a query. If it
returns, it is its own ADR — an HNSW index on authored pedagogical content is a pedagogical
decision (what counts as semantically near a lesson) wearing a database hat.

### 9. Sixteen corrections

`data-model.erd.md` is **superseded**. Each row is the amendment; `BACKLOG.md` P0.3a derives the
replacement ERD from the six specs with this table as its acceptance criterion.

| # | Table | Change | Source of the requirement |
|---:|---|---|---|
| 1 | `items` | `skill_id` FK → `skill_ids TEXT[]` + GIN. A single FK cannot hold `assessment` §1's `skill_ids[]` | `assessment` §1 |
| 2 | `items` | Add the full calibration + quality + provenance + assets + metadata layer: `a, b, a_se, b_se, n_responses, calibration_status, anchored_by TEXT[], last_refit, infit_mnsq, outfit_mnsq, point_biserial, difficulty_p, dif_flags JSONB, p_random, retired, retired_reason, provenance_kind, provenance_source_file, provenance_source_locator, reviewed_by, tts_required, review_due` | `assessment` §1, §3, §5, §7. **Today `(a,b)` has no column anywhere and P1.8 produces them** |
| 3 | `items` | `item_type` CHECK → the specs' vocabulary (`gap_fill, error_correction, form_selection, definition_match, register_selection, scanning, cloze, matching, ordering, contextual_selection, minimal_pair, production`). Current CHECK intersects **none** of it | `assessment` §1, §2.3 |
| 4 | `listening_distractors` | `distractor_type` CHECK → `l1_transfer, overgeneralization, semantic_plausible, form_alternative, register_mismatch, negative_control`. Current four values are **invented**; the type §2.1 calls *"the highest-value distractor in the whole bank"* is uninsertable | `assessment` §2.1 |
| 5 | `fsrs_states` | Delete `retrievability`; add `w_version`, `grade`, `state`, `hint_used` | `stats` §6.1, §6.2a; `post-lesson` §3.2 |
| 6 | `listening_items` | Fold into `items` as a subtype (`modality='listening'`, nullable `dialogue_id`). Restores the FSRS FK across all five domains | `post-lesson` §3.4, §7 |
| 7 | `item_responses` | **Delete `bkt_transition`** and its CHECK. `learned/retained/forgot/guessed` is defined in **no** spec and is not recoverable from a binary outcome — it is a claim about *why*. `confidence` (already in the ERD) is the learner's only honest signal of that | absence across all 6 specs |
| 8 | `mastery_history` → `learner_mastery` | Rename (it is current state, not history — history is the append-only event log per ADR-015). Add `n_obs, distinct_days, spaced_obs`. **Delete `gate_passed` + trigger** | invariant floor, §1 above |
| 9 | `learners` | Delete `cefr_level`. If cached, it is a projection carrying `derived_from_diagnostic_id` + `as_of` and is never a source of truth — the ERD's mutable column has no provenance | ADR-017 §3 |
| 10 | `learners` | Delete `streak_days`, `xp` | ADR-015 §3 |
| 11 | `learners` | Delete `consent_given_at`, `consent_version`; add append-only `consent_records(learner_id, purpose, version, granted_at, withdrawn_at, legal_basis)`. Two columns cannot express purpose-specific, withdrawable consent | `CONSTITUTION` §8.1; LGPD Art. 8 |
| 12 | `lessons` | Split `status` into `authoring_state` + `publication_state` + `permission_state`; add `SkillPrerequisite` join | §6 above; ADR-015 §4 |
| 13 | `dialogues` | Add `speakers`, `dialogue_speakers`, `clips`, `clip_renders` (the take entity implied by `v_take_03` and by `DEF-13`'s remedy *"a second render on panel voices"*) | `listening-corpus` §2.1, §2.3 |
| 14 | `slot_responses` | Add `voice_id`, `clip_id`, `assist_used BOOLEAN`, `replays SMALLINT`. Without them the Control-1 voice-balance analysis and the accommodation-vs-ability separation are both impossible | `listening-corpus` §2.1 (*"Record `voice_id` and `dialogue_id` on **every response**"*), §2.2 |
| 15 | `diagnostic_results` | Add `form_version`, `start_cefr`, `below_scale`, `remediation_nodes TEXT[]` (≤3), `bkt_priors_override JSONB`, `skill_theta JSONB` carrying §3.3a's three-state lattice with an **explicit discriminator**. `blueprint_coverage JSONB` is defined in no spec — either spec it or delete it | `diagnostic` §3.6; `curriculum-graph` §5.1 |
| 16 | all learner-scoped tables | **RLS policies + `SET LOCAL` wrapper.** 0 policies exist today against an `Accepted` ADR and a `CONSTITUTION` §2 principle | `ADR-003`; `BACKLOG` P2.1 |

## Consequences

### Positive

- The data model becomes derivable from the specs, and every column names its §.
- The mastery gate is implemented as written, or not at all — no silent conjunct-dropping.
- One item table, one FK, one review queue, one `skill_ids` array across five domains.
- `(a, b)` has columns, so `BACKLOG.md` P1.8 has an output.
- 0 RLS policies becomes 100% or the build fails.

### Negative

- `ADR-018` invalidates `db/models.py` as written. `mastery_history`, `cefr_level`, `streak_days`,
  `xp`, `consent_given_at`, `WRITING`/`SPEAKING` domains and the `Vocabulary` spelling are all
  corrected or removed. `BACKLOG.md` P0.3 was already going to be a full port (ADR-012); this
  makes it a full port **plus** a re-derivation, and the re-derivation is the part that was going
  to be missed.
- The `n_eff` interval is an assumption with a designated replacement. If `PRD.md` §10's new
  falsifier fires, `learner_mastery` gains `n_correct`/`n_incorrect` and the Beta-Binomial
  posterior replaces the approximation. Designed for, not done.
- Splitting `lessons.status` into three columns means every loader, every check, and
  `verify-integrity.py` check [2]'s status recomputation must be updated together.
- Losing `withdrawn` as a DB status means withdrawn items are stored as `retired`; the
  *authoring* `withdrawn` never enters the database. Content-team readers expecting one column
  will need the glossary.

### Neutral

- Deleting `content_embeddings` removes a capability nobody asked for. If semantic retrieval
  turns out to matter, ADR-016's skill registry is the better substrate for it anyway.
- 28 tables will not survive as 28. The derived model is estimated at 22–26 tables after folds
  5 and 6 and after deleting `content_embeddings`, `learner_preferences` (folded into
  `consent_records`) and `options` (folded into `items` as JSONB where the distractor set is
  write-once, kept relational where DIF analysis needs to query it).

### What weakens (CONSTITUTION.md §9 step 3)

| Weakened | Before | After | Why accepted |
|---|---|---|---|
| Mastery gate strictness at the storage layer | `gate_passed` computed in the database | computed in the domain layer; DB stores evidence only | The trigger was weaker than its predicate (invariant floor). A scalar threshold is not a gate with an interval |
| Retrievability availability | `SELECT retrievability` answered from the row | must call the domain function | The generated column implemented a decay model the spec replaced with a power law, and froze the parameter set into each row |
| DB-level pack-size enforcement | CHECK `= 7` | domain construction rule | The CHECK was wrong for the formula, and for two of the three layers |
| `L2`/`L3` reuse of `practice_attempts` | one table for three layers | `pack_layer` discriminator | The three layers have three different size rules; one CHECK served none |
| Semantic content search | `pgvector` + HNSW declared | removed | No consumer, no spec, and §2 forbids asserted artefacts |

## Alternatives Considered

1. **Fix the ERD in place, 16 targeted edits.** Rejected — the header's stated source is a sketch.
   Editing the output leaves the cause in place, and the next reader re-derives from §7 again.
2. **Keep `gate_passed` as a cached column maintained by the application.** Rejected — a cached
   boolean that must agree with a four-clause predicate is a second source of truth for the most
   consequential decision in the product.
3. **Compute a real BKT posterior variance (numerical integration over the 4-state chain).**
   Rejected for the MVP — correct, expensive, and it needs the parameter fits that do not exist
   yet. The Beta-Binomial path is cheaper than the chain and is recorded as the replacement.
4. **Keep `withdrawn` in both vocabularies and rely on the column name to disambiguate.**
   Rejected — `SDD.md` §4 makes an out-of-vocabulary word a defect, and one word cannot be in two
   closed sets.
5. **Keep `listening_items` separate and add a second FSRS table for listening items.**
   Rejected — two nearly identical item tables with two lifecycles and two calibration paths is
   how the current 28-table divergence started.
6. **Derive a CI on `P(mastery)` from the Beta-Binomial conjugate now.** Rejected — BKT's `p_learn`
   is a rate, not a count, so a conjugate update is not equivalent to the filter the specs mandate.
   Recorded as the replacement, not the MVP path.
7. **Correct the L1 formula to `round(4 + 4P̂)` clamped [4, 8].** Rejected — it makes 8
   unreachable (`P̂ = 1 → 8` ✓ but `P̂ = 0.9 → 7.6 → 8` and no value above 0.75 yields 7), and it
   does not reproduce the spec's own worked example.

## Implementation Plan

- [x] **P0.3a** — re-derive `docs/data-model.erd.md` from the six specs; the 16 rows above are the
      acceptance criterion; header source becomes the specs, not `ITS-ARCHITECTURE.md §7`
- [x] Delete `data-model.erd.md`'s 9 invariants; replace with a pointer to this record
- [ ] Amend `CONSTITUTION.md` **§2** with the invariant floor, as version **2.1.0**. Additive;
      **nothing weakens.** §9 step 5 requires Tech Lead + Security Lead + Director — recorded as
      `PROPOSED` in §9's changelog rather than ratified by this ADR
- [ ] Amend `post-lesson` §2.1/§2.2 (formula + floor 5 + tie-break) via `SDD.md` §9
- [ ] Amend `post-lesson` §3.2/§3.3 (FSRS 4-point mapping) via `SDD.md` §9
- [ ] Amend `SDD.md` §4 and §11 (`retired` unification); `listening-corpus` §5
- [ ] Amend `curriculum-graph` §4.3's listening trigger per ADR-017 §4
- [ ] Add the `PRD.md` §10 falsifier for the `n_eff` interval
- [ ] DDL + TypeORM entities + bidirectional mappers for the derived model
- [ ] RLS policies on every learner-scoped table + the `PgSessionContext` wrapper;
      tested on **real PostgreSQL**, never PGlite (ADR-014)
- [ ] `domain/` property tests: BKT bounds, FSRS monotonicity and `R(t)` against `stats` §6.1,
      gate conjuncts, `items` prefix↔namespace (ADR-016)

## References

- `docs/data-model.erd.md` (28 tables, superseded) · `ITS-ARCHITECTURE.md` §7 (sketch)
- `src/its_platform/db/models.py` (10 tables) · `src/its_platform/db/migrations/versions/001_initial.py`
- `specs/post-lesson-practice-spec.md` §2.1, §2.2, §2.3, §3.2, §3.3, §3.4, §4.2, §7, §12.4
- `specs/stats-progress-evaluation-spec.md` §3.2, §4.2, §4.4, §4.5, §6.1, §6.2, §6.2a, §12
- `specs/assessment-item-spec.md` §1, §2.1, §2.3, §2.4, §3.2, §3.3, §5.1, §7, §8.1
- `specs/diagnostic-spec.md` §3.3a, §3.6, §4.3 · `specs/curriculum-graph-spec.md` §6.1, §7.2
- `specs/listening-corpus-spec.md` §2.1, §2.2, §2.3, §5 · `specs/diagnostic-spec.md` §2.1.1
- `external-sources.md` §7.0 · `SDD.md` §4, §11 · `AGENTS.md` · `PRD.md` §2, §6.6, §9, §10, RNF-001
- [ADR-003](003-postgresql-rls.md) · [ADR-012](012-migrate-api-layer-to-nestjs.md) ·
  [ADR-014](014-datastore-pglite-dev-postgres-prod.md) · [ADR-015](015-domain-model-bounded-contexts.md) ·
  [ADR-016](016-canonical-identifier-registry.md) · [ADR-017](017-mvp-adaptive-scope.md)
- `CONSTITUTION.md` §2, §4.6, §8.1, §9 · `BACKLOG.md` P0.3, P1.8, P2.1, P3.1
