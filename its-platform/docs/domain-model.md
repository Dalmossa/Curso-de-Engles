# ITS Platform — Domain Model

**Version:** 1.0.0 · **Status:** ratified by ADR-015, ADR-016, ADR-017, ADR-018
**Derived from:** the six specs in `../../specs/` — **not** from `ITS-ARCHITECTURE.md §7`
**Supersedes:** nothing. `docs/data-model.erd.md` v0.1.0-draft is superseded by ADR-018 and is
being re-derived; this document is the model, the ERD is its rendering.

---

## 1. Why this document exists

`ITS-ARCHITECTURE.md` §3 draws a data-flow diagram with seven boxes and no contracts. The six
specs define predicates over concepts they never declare. `docs/data-model.erd.md` declared a
source that was a twenty-line sketch. The result was three live data models (15 / 28 / 10
tables) and no aggregate root anywhere in the repository.

This document names the contexts, the roots, the consistency boundaries and the invariants. The
ADRs record *why*; this records *what*.

---

## 2. Bounded contexts

| # | Context | Aggregate root | Consistency boundary | Owner of its vocabulary |
|---:|---|---|---|---|
| 1 | Curriculum Catalog | `CurriculumGraph` | one write per content commit | skill taxonomy, CEFR mapping, `les_*`/`mod_*` |
| 2 | Item Bank | `AssessmentItem` | one item, one lifecycle transition | item schema, calibration protocol, distractor taxonomy, DIF, lifecycle, bank sizing (`assessment` §1 self-declared authority) |
| 3 | Listening Corpus | `Dialogue` | one dialogue incl. its clips and renders | Q-L1…Q-L10, voice panel, `dlg_*` |
| 4 | Learner Model | `LearnerModel` | one learner | BKT/IRT/FSRS parameterisation, mastery gate, error log, affective signals |
| 5 | Delivery | `LearningSession` | one session (10–35 min) | L1/L2/L3 layer rules, session budget |
| 6 | Diagnostic / Placement | `DiagnosticRun` | one run, 12–28 items, one sitting | blueprint, stopping rules, start-node mapping, profile |
| 7 | Selection & Scheduling | *stateless policy* | none — pure function of 1, 2, 4 | `/next`, L2 due-queue, L3 generation |
| 8 | Identity & Compliance | `LearnerAccount`, `ConsentRecord`, `AppendOnlyEvent` | one account / one consent / append-only stream | consent purposes, audit, LGPD Art. 18 |

**Contexts are a modular-monolith decomposition, not a deployment topology.** One deployable,
eight modules. ADR-012's `src/{domain,application,infrastructure,interface}` cuts across all
eight.

### 2.1 Context map

```
   Content repo (markdown + §4.3 registry), versioned by git commit
        │
        │  ACL: ContentLoader — FASE 1–4 blocks → internal model
        ▼
   ┌───────────────────────────┐
   │ 1 Curriculum Catalog     │◄──── conformist + OHS ────┬──────────┐
   └─────────────┬─────────────┘                          │          │
                 │                                        │          │
   ┌─────────────┴───────────────┐   ┌──────────────────┐ │          │
   │ 2 Item Bank                │◄──┤ 3 Listening      │ │          │
   │   AssessmentItem           │   │   Corpus         │ │          │
   │   (a,b) gates §5 §7        │   │   Dialogue       │ │          │
   └─────────────┬───────────────┘   └──────────────────┘ │          │
                 │ needs b for targeting                     │          │
                 ▼                                           │          │
   ┌───────────────────────────────────────┐                 │          │
   │ 4 Learner Model                      │                 │          │
   │   P(mastery)+CI · θ+SE · FSRS        │                 │          │
   │   ErrorLogEntry · AffectiveSignal    │                 │          │
   └──────────────┬────────────────────────┘                 │          │
                  │                                              │          │
        ┌─────────┴──────────┐                    ┌─────────────┴──────┐   │
        ▼                    ▼                    │ 6 Diagnostic        │   │
   ┌─────────────────┐  ┌──────────────┐         │   DiagnosticRun     │   │
   │ 5 Delivery      │  │ 7 Selection  │◄────────┤   fixed form v1     │   │
   │  LearningSession│─▶│   (policy)   │         └─────────────┬──────┘   │
   └─────────────────┘  └──────────────┘                       │          │
                                                             ▼          │
   ┌──────────────────────────────────────────────────────────────┐     │
   │ 8 Identity & Compliance — ConsentRecord · AppendOnlyEvent    │◄────┘
   │    security boundary; RLS per ADR-003; audit per CONSTITUTION §4.6
   └──────────────────────────────────────────────────────────┘
```

### 2.2 Anti-corruption layers, and why each is mandatory

| Boundary | What the two sides disagree about | ACL obligation |
|---|---|---|
| Content repo → Catalog | lesson markdown carries `**Reuse basis:**`, `**Status:**`, FASE blocks and a `mastery_gate.required_skills` JSON block | Loader **asserts** `mastery_gate.required_skills` equals the `SkillPrerequisite` table. Divergence fails the content check. (ADR-015 §4) |
| Catalog → Item Bank | five `skill_id` spellings; dotted `item_id`s indistinguishable from `skill_id`s | `identifier_aliases` resolution, `kind ∈ {item, skill}` (ADR-016) |
| Item Bank → Learner Model | no `(a,b)` column existed; `p_random` placement differs between `stats` §4.1 (`metadata`) and `assessment` §1 | item read model returns `(a, b, a_se, b_se, calibration_status, p_random)` as one VO; a consumer that cannot cite the calibration status is refused |
| Learner Model → Delivery | BKT gives `p_know`; the gate needs `CI₉₅_lower(P)`, which BKT cannot supply | mastery VO carries evidence counts; the gate is evaluated in the domain, never in SQL (ADR-018 §1) |
| Any → Compliance | consent purpose, withdrawal, audit | every mutation of learner-scoped state emits an `AppendOnlyEvent`; the GUC wrapper is the single writer of `app.current_learner_id` |

---

## 3. Aggregate roots and their invariants

Invariants marked **[domain]** must be enforced in `src/domain/` with no framework import
(ADR-012's CI check enforces the import ban). Invariants marked **[db]** are additionally
constrained by DDL. **[domain]** alone means the invariant is **not** expressible in SQL and
storing it would breach the invariant floor (ADR-018 §1).

### 3.1 `CurriculumGraph` (context 1)

| # | Invariant | Where |
|---|---|---|
| C-1 | Acyclic. Remediation edges point only to earlier or review nodes (`curriculum-graph` §1.3) | **[domain]** — `topological_sort` at load; blocks deploy per §10 |
| C-2 | Every `les_*` in the §4.3 registry has a file whose `**Lesson ID:**` declares it, and `authoring_state` == the file's `**Status:**` | **[db]** + `verify-integrity.py` [2] |
| C-3 | CEFR monotonicity along prerequisite edges | **[domain]** |
| C-4 | Skill balance: each skill domain holds ≥ 15 % of lessons per CEFR band | **[domain]** (§10) |
| C-5 | Remediation coverage: every skill has ≥ 1 remediation node | **[domain]** (§10) |
| C-6 | `block_count <= 4` (§4.4.4: 4 human-only decisions) | **[domain]** |

`ms_` and `diag_` **do not exist.** `curriculum-graph` §1.1's four node kinds are two. See
ADR-015 §3 for what weakens.

### 3.2 `AssessmentItem` (context 2)

| # | Invariant | Where |
|---|---|---|
| I-1 | Lifecycle: `authored → drafted → peer_reviewed → expert_anchored (n=0) → partially_calibrated (n≥50) → empirically_calibrated (n≥200) → serving`, with `rejected`, `revision`, `retired` reachable (`assessment` §7) | **[domain]** |
| I-2 | **Ids are immutable and never reused.** A retired item keeps its id (`assessment` §1.2, §7) | **[db]** — `CHECK` + no `UPDATE` grant on `items.id` |
| I-3 | MCQ: exactly 4 options, exactly one key, option texts distinct case-sensitively with bold stripped, options not differing only in length/punctuation/case (§2.2 G-Q3) | **[domain]** + **[db]** for distinctness |
| I-4 | ≥ 1 `l1_transfer` distractor whenever a documented BR-PT form exists | **[domain]** (§2.2) |
| I-5 | ≤ 1 `negative_control`, never the only non-key option | **[domain]** |
| I-6 | `p_random`: 1/n for MCQ, 1/n! for `matching` (n ≤ 4) and `ordering` (n ≤ 5) | **[domain]** (§2.3) |
| I-7 | `item_id` prefix ↔ primary skill namespace (§1.2) | **[db]** via `verify-identifiers.py` I-2 |
| I-8 | `br_pt_form` state is exactly one of: filled / null+`note:` / null+`not_applicable_no_distractor_set` (§2.2.1) | **[domain]** |
| I-9 | Retirement triggers: r_pb < 0.20 · key share ≈ 1/n · 3 consecutive misses by ≥ 5 distinct learners · A-class DIF confirmed · content stale · `review_due` passed (auto-retire at 180 days) (§7.1) | **[domain]** |
| I-10 | A retired item **remains queryable** (§7) | **[db]** — never deleted |

### 3.3 `Dialogue` (context 3)

| # | Invariant | Where |
|---|---|---|
| D-1 | Q-L1 unambiguous render, 100 % | **[domain]** |
| D-2 | Q-L2 duration **45–120 s** | **[db]** CHECK |
| D-3 | Q-L3 speech rate 130–165 wpm | **[domain]** |
| D-4 | Q-L4 ≥ 1 labelled BR-PT interference per L1 dialogue | **[domain]** |
| D-5 | Q-L5 two speakers for conversational register, 100 % of dialogue-tier items | **[db]** |
| D-6 | Q-L6 minimal pairs rendered by the **same voice at the same rate** — overrides Control 1, non-negotiable, item is void otherwise (§2.3) | **[domain]** + **[db]** on `(clip_a.voice_id = clip_b.voice_id)` |
| D-7 | Q-L7 per-clip ear check: 100 % of L2 clips, 20 % sample of L1 | **[domain]** |
| D-8 | Q-L8 voice × skill matrix balanced within 1 clip per cell | **[domain]** |
| D-9 | Q-L9 transcript matches audio word-for-word — the load-bearing gate (§3) | **[domain]** |
| D-10 | Q-L10 no clip shorter than `word_count / 2.2` **seconds** (§3 states `2.2 wpm`, off by ~100× from Q-L3; corrected) | **[domain]** |
| D-11 | Control 1: no single dialogue supplies > 30 % of one learner's listening items; each panel voice spans ≥ 2 levels, ≥ 3 dialogues, ≥ 2 item types (§2.1) | **[domain]** |
| D-12 | `Speaker` is an entity. Within a dialogue, voice ≡ speaker identity and the confound is load-bearing — `lst_lexical_007` is *solvable because of it* (§2.1) | **[db]** |

### 3.4 `LearnerModel` (context 4) — the root that carries the gate

| # | Invariant | Where |
|---|---|---|
| L-1 | `p_know ∈ [0,1]` | **[db]** CHECK |
| L-2 | **`gate(skill) = p_know ≥ 0.85 ∧ CI₉₅_lower(P) > 0.70 ∧ n_obs ≥ 3 ∧ distinct_days ≥ 2 ∧ spaced_obs ≥ 1`** | **[domain]** — see below |
| L-3 | `n_eff = Σ exp(−λ_d · Δdays)`, `λ = 0.02 vocab · 0.005 grammar · 0.03 pronunciation` (`curriculum-graph` §7.2) | **[domain]** |
| L-4 | `SE_logit = 1/√(3 + n_eff)`; `CI₉₅_lower = σ(logit(p_know) − 1.96·SE_logit)` | **[domain]** — ADR-018 §2 |
| L-5 | Recommend review: `p_know < 0.60 ∨ CI₉₅_upper < 0.75` (`stats` §3.2) | **[domain]** |
| L-6 | Struggle flag: `p_know` declining **3+ consecutive sessions** (`stats` §3.2; `curriculum-graph` §6.4) | **[domain]** |
| L-7 | Accelerate: `p_know ≥ 0.95 ∧ CI₉₅_lower > 0.85 ∧ time_on < 0.5 × median ∧ diagnostic θ above target (`curriculum-graph` §6.3) | **[domain]** |
| L-8 | **Listening is BKT-only.** No listening θ is produced, reported or displayed; no predicate may read one (`PRD` §6.6.4; `diagnostic` §2.1.1(3)) | **[domain]** |
| L-9 | `R(t) = (1 + 0.9803·t/S)^(−0.1542)` — **power law**, not `exp(−t/S)`. `elapsed_days` truncates to whole days, so `R = 1.000` within a day and intra-day L2 review is forbidden (`stats` §6.2b) | **[domain]** |
| L-10 | Every `R` is attributable to the `w_version` that produced it (`stats` §6.2a refits at 512 pooled reviews) | **[db]** |
| L-11 | FSRS grade ∈ {1 Again, 2 Hard, 3 Good, 4 Easy}, mapped per ADR-018 §4 | **[db]** CHECK |
| L-12 | Stability prior modulation: `factor = 1 + 0.25·(logit(p_mastery) − logit(0.15))`, `S0 × min(2.0, max(0.5, factor))` (`stats` §6.2) — **not** the post-hoc interval multiplier struck there | **[domain]** |

The diagnostic contributes a **prior on θ only, never on mastery** (`post-lesson` §7 evidence
table: *"diagnostic CAT 15–30 items → prior on θ only, not mastery"*). One sitting cannot satisfy
L-2's evidence clause, so the two inputs are structurally separated.

### 3.5 `LearningSession` (context 5)

| # | Invariant | Where |
|---|---|---|
| S-1 | `items = clamp(round(4 + 5·P̂_mastery), 5, 8)` — ADR-018 §7 | **[domain]** |
| S-2 | 55–75 % current lesson / 25–45 % prerequisite (§2.1) | **[domain]** |
| S-3 | **No L1/L2/L3 layer is gated on mastery** (§1: *"A learner who failed the Shadow CAT does not get skipped forward — they get more practice."*) | **[domain]** — this is the most architecturally load-bearing sentence in `post-lesson` |
| S-4 | Interleaved delivery, never blocked-by-type (§2.1) | **[domain]** |
| S-5 | L2 pack: 5–12 items, cap 12 hard, **0 new items**, ≤ 4 from any one domain, resample lowest-stability 12 (§3.4) | **[domain]** |
| S-6 | No grouping affordance (§3.5: *"measurably reduces retention"*) | **[domain]** |
| S-7 | L3: ≤ 6 items, ascending `b`, `b ≈ current θ + 0.3 logit`, ≥ 2 items minimum, easiest first, never 2 consecutive above θ, **never blocks "next lesson"** (§4.4) | **[domain]** |
| S-8 | L3 rank = `frequency × severity × recency` over `ErrorLogEntry` (§4.2) — see §4 | **[domain]** |
| S-9 | Session budget: lesson day ≈ 35 min (10+5+15+5); non-lesson day ≈ 15 min; lesson split Adquirir 8 / Praticar 4 / Produzir 2 opt-in / Ajustar 1 (§5) | **[domain]** |

### 3.6 `DiagnosticRun` (context 6)

| # | Invariant | Where |
|---|---|---|
| G-1 | Fixed form `diagnostic_form_v1`, **12 items**: Grammar 4 · Vocabulary 3 · Reading 3 · Pronunciation 2. **Listening 0** | **[domain]** |
| G-2 | Selection is by blueprint position. **No MFI, no CAT** — three independent spec rules forbid it (ADR-017) | **[domain]** |
| G-3 | `provenance.kind == authored` is permitted in a fixed form; G-Q7's CAT exclusion does not apply because a fixed form does not use difficulty to select | **[domain]** |
| G-4 | `band_bounds = [θ − 1.96·SE_eff, θ + 1.96·SE_eff]`; `start_cefr` = the **lowest** CEFR band whose **entry** threshold (`A2 = −0.5, B1 = 0.5, B2 = 1.5`, `stats` §3.1) lies inside `band_bounds`; above the top entry → `B2`. Under-placement, never over-placement — see **ADR-023 §2** for the operational form and its two totality clauses | **[domain]** |
| G-5 | `below_scale` = `θ + 1.96·SE_eff < −0.5`, i.e. `band_bounds` lies entirely below the A2 entry → start node `les_a1_alphabet_sounds` (ADR-023 §2) | **[domain]** |
| G-6 | `remediation_nodes` ≤ 3 (`curriculum-graph` §6.4), derived from `bkt_priors_override` + profile | **[domain]** |
| G-7 | `placement_provisional` is **derived** from `calibration_status != empirically_calibrated`, never stored as a boolean | **[domain]** |
| G-8 | Per-domain reportability lattice (§3.3a), stored with an **explicit discriminator**: `point_estimate` (n ≥ 5) / `band` (n 3–4) / `insufficient_evidence` (n 0–2) | **[db]** — the three-state union has **no tag today**, so every consumer branches on key presence |
| G-9 | The re-diagnostic is a **scheduled event**, not a user action (§2.1.1(4)). MVP has no audio, so there is no re-diagnostic and G-7 never clears | **[domain]** |

Property tests required: `start_cefr` is monotone **non-decreasing** in θ (ADR-023 corrects the
"non-increasing" that stood here and contradicted G-4's own rule); `start_cefr ≤` every band in
`candidate`; `start_node ∈ CurriculumGraph`; `G-1` always sums to 12.

### 3.7 `ConsentRecord` and `AppendOnlyEvent` (context 8)

| # | Invariant | Where |
|---|---|---|
| X-1 | Consent is **purpose-specific and versioned**: `(learner_id, purpose, version)` with `granted_at`, `withdrawn_at`, `legal_basis`. Append-only; withdrawal is a new row, never an update | **[db]** |
| X-2 | Withdrawal triggers erasure within **30 days** (LGPD Art. 18; `BACKLOG` P1.16, Must) | **[domain]** |
| X-3 | `AppendOnlyEvent` carries a closed `event_type` and a hash chain; records auth success **and** failure, access-control denials, validation failures, consent changes, and export/erasure (`CONSTITUTION` §4.6, ASVS `v4.0.3-7.3.3`) | **[db]** — WORM-backed, append-only |
| X-4 | Every mutation of learner-scoped state emits an event. `PgSessionContext` is the single writer of the GUC | **[domain]** + **[db]** |

---

## 4. The three entities the specs needed and did not have

### 4.1 `ErrorLogEntry` — context 4

`post-lesson` §4.2 step 1 ranks it by `frequency × severity × recency`; step 2 selects a distractor
set *"containing the specific wrong form the learner produced"*. It has no id, no schema, and no
write path anywhere.

```typescript
// domain/ — no framework import
type ErrorPattern =
  | 'null_subject' | 'eventually' | 'responsible_of' | 'th_stopped' | 'w_v_interference'
  | 'false_cognate_activated' | 'spelling_no_epenthetic_vowel' | 'article_omission';

interface ErrorLogEntry {
  readonly learnerId: string;
  readonly skillId: SkillId;                  // canonical (ADR-016)
  readonly pattern: ErrorPattern;
  readonly producedForm: string;              // what the learner WROTE — the observation
  readonly frequency: number;
  readonly severity: number;                  // 0..1
  readonly firstSeenAt: Date;
  readonly lastSeenAt: Date;
}
```

`producedForm` is the whole point. §4.3's values (`null_subject`, `eventually`,
`responsible_of`) are `content-map` §9.1 *predicted* errors — what a BR-PT speaker is expected to
produce. The predicted error is not the observation. L3's second step requires the former; nothing
in the repository currently records the latter.

### 4.2 `SkillPrerequisite` — context 1

`curriculum-graph` §6.1's gate predicate is `∀ skill ∈ prereq_skills(les_B)`. `§4.1` has a
*Prereq Lessons* column only. `prereq_skills` exists **solely** inside lesson-file JSON
(`**mastery_gate**."required_skills"`), which the graph spec does not read. The graph's central
predicate is therefore not derivable from the Catalog.

```sql
CREATE TABLE skill_prerequisite (
  lesson_id  VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  skill_id   VARCHAR(50) NOT NULL,             -- canonical, ADR-016
  PRIMARY KEY (lesson_id, skill_id)
);
```

The lesson-file JSON becomes **derived**: the loader asserts equality and the content check fails
on divergence. Two sources of truth exist for ~3 weeks; the check is what makes that safe.

### 4.3 `AffectiveSignal` — context 4

`curriculum-graph` §11 names affective state as the **Content Selector's input**.
`diagnostic` §4.2 flags learners for *"affective-filter monitoring"*. `post-lesson` §4.4 is
organised around psychological safety. No entity, no id, no measurement rule.

```typescript
type AffectiveKind =
  | 'skip_streak' | 'hint_seeking' | 'session_abandon' | 'time_on_task_spike' | 'rapid_guessing';

interface AffectiveSignal { readonly learnerId: string; readonly kind: AffectiveKind;
                            readonly observedAt: Date; readonly strength: number; }
```

**Recorded but not read in the MVP.** No spec defines how to interpret a signal, so acting on one
would be an invented pedagogy. Acceptance is that the vocabulary exists and that `Selection` can be
extended without a migration. Deleting the input from `curriculum-graph` §11 instead would weaken
a spec, which `CONSTITUTION` §9 step 3 forbids without a stated reason.

### 4.4 Plus two the specs imply without naming

- **`Speaker`** — `listening-corpus` §2.1 makes within-dialogue voice ≡ speaker identity and
  `lst_lexical_007` is *solvable because voice familiarity is perfectly confounded with speaker
  gender*. Load-bearing and undefined. → `speakers`, `dialogue_speakers`.
- **`Render` / take** — `v_take_03` and `DEF-13`'s remedy (*"a second render on panel voices"*).
  `assessment` §7 requires retired items to remain auditable; an item's `b` was estimated on *one*
  render and there is no way to know which. → `clips`, `clip_renders(dialogue, clip, take,
  voice_id, rate, duration_s, uri, ear_checked_at)`.

---

## 5. Identifier ledger

Canonical forms are decided in ADR-016. This table is the summary the loader and the CI check share.

| Class | Canonical | Owner | Legacy forms to alias |
|---|---|---|---|
| Skill | `<domain>.<slug>` — `grammar.be_affirmative` | Item Bank | bare `th_voiced` · `lst.gist` · `pron_th_voiced` · `vocab_collocation` |
| Assessment item | `<prefix>_<skill-slug>_<NNN>` — `grm_be_affirmative_001` | Item Bank | dotted `vocab.tenses.present` · `it_greetings_001` · `gram_present_simple_be_001` |
| Listening item | `lst_<skill-slug>_<NNN>` | Listening Corpus | `lst_gist` · `lst_<cefr>_<nn>` · `lst_corp_041` |
| Lesson / Module | `les_<cefr>_<slug>` / `mod_<level>_<theme>` | Catalog | immutable |
| Pack | `pack_<lesson_lessonid>_v<N>` | Item Bank | — |
| Dialogue | `dlg_<cefr>_<NN>_<slug>` | Listening Corpus | — |
| Clip / Render | `clip_<dialogue>_<NNN>` / `take_<clip>_<NN>` | Listening Corpus | `v_take_03` |
| Profile | `false_beginner` | Diagnostic | `false_beginner_suspected` · `default\|false_beginner\|it_track` |

**Two spellings in one JSON object** — `diagnostic` §3.6's `bkt_priors_override` mixes bare and
namespaced keys:

```json
{ "present_simple_be": 0.35, "th_voiced": 0.10, "tech_vocab_basic": 0.40,
  "listening.noun_compound_identification": 0.05, "pronunciation.s_consonant_cluster": 0.10 }
```

This is the clearest single proof that no registry existed: five keys, two conventions, one
object, in the spec that a diagnostic result is persisted from.

---

## 6. State vocabularies

One vocabulary per question; columns named for their question. This resolves the collision where
`SDD.md` §4's five authoring states and `listening-corpus` §5's three operational states share the
word `withdrawn`.

| Vocabulary | Values | Owner | Question |
|---|---|---|---|
| Authoring state | `authored \| specified \| unauthored \| blocked \| withdrawn` | `SDD.md` §4 | does the design and its artefact exist? |
| Publication state | `publishable \| restricted_pending_permission \| not_publishable` | `external-sources.md` §7.0 | may it ship? |
| Permission state | `not_required \| requested \| granted \| refused` | `external-sources.md` §7.0 | has written permission been obtained? |
| Item lifecycle | `authored → drafted → peer_reviewed → expert_anchored → partially_calibrated → empirically_calibrated → serving`, + `rejected \| revision \| retired` | `assessment` §7 | where is this item in review? |
| Listening status | `shipped \| shadow_only` | `listening-corpus` §5 | is it servable? |
| FSRS card state | `new \| learning \| review \| relearning` | `stats` §6.2b | where is this card? |
| FSRS grade | `1 Again \| 2 Hard \| 3 Good \| 4 Easy` | `stats` §6.1 | how was this recalled? |
| BKT transition | `learned \| retained \| forgot \| guessed` | **nobody** | — **deleted**, ADR-018 §9.7 |

`retired` replaces `withdrawn` for "pulled by defect, retained for audit, not served", unifying
`SDD.md` §11 with `assessment` §7. `withdrawn` survives in `authoring_state` meaning *removed*.
Two words, two questions, no overlap.

---

## 7. What the specs still do not answer

Recorded so they are not mistaken for settled. Each is a decision owed by a human, not a gap to be
closed by inference.

| # | Question | Owed by |
|---:|---|---|
| 1 | `br_pt_tags` grammar and facet set. §6.2 gives 4 examples, §8.3 adds 2, §1 shows a 7th (`pragmatics:introduce_vs_describe`), and the `<facet>:<value>` form is never stated | Content Lead |
| 2 | False-cognate deck: live as **30** (`assessment` §4.2), **22** (§8.3 / `post-lesson` §9.1), **16** (Tier A, §8.3), **6** (Tier B post-review). Four counts, one deck | Content Lead |
| 3 | Distractor-free population counted **5** (`assessment` §2.2.1), **6** (§2.2.1's own note), **14** (`SDD` §3.2 / `post-lesson` §12.2) | Content Lead |
| 4 | `P(knowledge)` decay λ per domain is used by L-3 (§2 above) but λ for `reading`, `listening`, `coherence` is unspecified | Backend Lead |
| 5 | `replays` at 1.0× are scored and **unbounded** (`listening-corpus` §2.2) — an unbounded nuisance variable inside an item whose `b` must be stable to < 0.30 logit (§5.2) | Backend Lead |
| 6 | Affective-signal thresholds. Recorded, unread (§4.3) | Content Lead |
| 7 | `checklist_completion` is named once in `assessment` §10.1 and specified nowhere: no schema, no scoring rule, no place in §1's type enumeration | Content Lead |
| 8 | Coherence constructs are declared *"explicitly insufficient"* for a θ move on their own and *"must not be the sole gate"* (§10.1) — unresolved | Backend Lead |
| 9 | The re-diagnostic's trigger entity. §2.1.1(4) mandates a scheduled event; there is no schedule, no trigger record, no relation to the first run | Backend Lead |
| 10 | Multi-tenancy. **Closed** — single-tenant B2C, ADR-015 §2. Reopening is a MAJOR change | — |

---

## 8. Documents

| Document | Relationship |
|---|---|
| [ADR-015](adr/015-domain-model-bounded-contexts.md) | contexts, roots, consistency boundaries, tenancy |
| [ADR-016](adr/016-canonical-identifier-registry.md) | identifier ledger, aliases, the CI gate |
| [ADR-017](adr/017-mvp-adaptive-scope.md) | Stage-1 IRT, fixed-form diagnostic, ordinal routing |
| [ADR-018](adr/018-persistence-derived-from-specs.md) | invariant floor, the 16 corrections, the pack formula |
| `docs/data-model.erd.md` | **v1.0.0 — derived from the six specs** (P0.3a, 2026-10-05); acceptance = ADR-018 §9's 16 rows |
| `docs/api-spec.openapi.yaml` | 9 paths; **no spec names an endpoint**, so there is no contract to check against |
| `../../specs/` | the six specs — the derivation source |
| `../CONSTITUTION.md` | §2 derivation over assertion · §4.2 Clean Architecture · §9 the invariant floor |

---

*Derived 2026-10-05. Every rule names the spec section that produces it, per `CONSTITUTION.md` §2
and `RNF-001`. A rule here without a `§` is a defect in this document.*
