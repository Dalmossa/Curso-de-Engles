# Assessment Item Spec — IRT Item Bank, Distractors, Calibration

**Purpose:** Define what a single assessment item *is* in this system: its schema, how distractors are built from BR-PT interference, how `(a, b)` are estimated, and when an item is allowed into the diagnostic CAT.

**Upstream Specs:**
- `stats-progress-evaluation-spec.md` §4 (item bank) — this spec is **authoritative** for §4.2 calibration; the "simulate if needed" clause there is superseded (§3 below).
- `diagnostic-spec.md` §6.3 (distractor design) — extended here to 6 types.
- `content-map.md` §3 (skill IDs), §9.1 (error taxonomy), §11 (source decks).
- `post-lesson-practice-spec.md` §6 (quality gates G-Q1…G-Q7).

**Downstream:** nothing. This is a leaf spec, except that lesson/pack authoring cites `item_id`s defined here.

---

## 0. WHAT THIS SPEC FIXES

A line-by-line cross-read of the four upstream specs surfaced **eight contradictions**. They are not cosmetic — two of them make the product unshippable as written.

| # | Contradiction | Where | Severity |
|---|---------------|-------|----------|
| **X1** | Calibration says "Minimum 200 responses per item (**simulate if needed**)". Simulated responses recover the parameters you generated with. This is circular — it produces a number that looks calibrated and is not. | `stats` §4.2 step 2 | 🔴 Fatal |
| **X2** | Pilot provides **200 users × 22 items ≈ 4,400 responses**. At 200/item that calibrates **22 items**. But `stats` §10 promises 50 items at MVP and 200+ at V1. Shortfall **2.3× and 9.1×**. | `stats` §4.2 × §10, `diagnostic` §7.2 | 🔴 Fatal |
| **X3** | Diagnostic MVP scope is "3 domains (Grammar, Vocab, **Listening**)". Listening is the one domain with **zero source material** (`content-map` §8.5 G2). The MVP tests the only unbuildable domain. | `diagnostic` §10 × `content-map` §8.5 | 🔴 Fatal |
| **X4** | Diagnostic blueprint requires Listening 20% / Pronunciation 10%; the full bank budgets 90 listening items. All assume content that does not exist. | `diagnostic` §2.1–2.2, `stats` §4.3 | 🔴 |
| **X5** | Diagnostic outputs 5 skill θs (multidimensional) but the CAT selects by unidimensional 2PL MFI. Per-domain θ is under-identified below ~5 items; no spec says what to report when that fails. | `stats` §5.1, `diagnostic` §1, §3.6 | 🟠 |
| **X6** | "Content balancing" is defined twice at different granularity: *max 2 items per skill per session* (`stats` §5.3) vs *max 2 items per domain per 5 items* (`diagnostic` §3.3). The first makes a 30-item test impossible. | `stats` §5.3 vs `diagnostic` §3.3 | 🟠 |
| **X7** | `P(G) = 0.20` for 4-option MCQ. Uniform random guessing on 4 options is exactly **0.25**. A guess rate below chance is impossible without partial knowledge, which contradicts the BKT definition of the not-knowing state. | `stats` §2.1 | 🟡 |
| **X8** | Event log example uses `"lesson_id": "wk_greetings_intro_v1"`. Canonical prefix is `les_`, not `wk_`. | `stats` §9.1 | 🟡 |

Corrections to X1–X8 are folded into this spec (§3, §2.4, §4.6) and propagated back into `stats-progress-evaluation-spec.md` and `diagnostic-spec.md` as marked amendments.

---

## 1. ITEM SCHEMA

Extends `stats` §4.1. Fields added here exist to satisfy the BR-PT, DIF, and lifecycle requirements that the original schema had no place for.

```json
{
  "item_id": "grm_demonstrative_this_001",
  "schema_version": "2.0",

  "skill_ids": ["grammar.demonstrative_this"],
  "lesson_id": "les_a2_greetings_intro",
  "cefr": "A2",
  "domain": "grammar",

  "type": "cloze",
  "modality": "text",

  "stem": "Sarah: \"Good morning, everyone! ____ is Marco. He's our new backend developer.\"",
  "options": ["This", "He", "There", "Here"],
  "key": "This",
  "n_options": 4,

  "distractors": [
    {"option": "He",    "type": "l1_transfer",      "br_pt_form": "Ele é o Marco",       "expected_share": 0.55},
    {"option": "There", "type": "overgeneralization","br_pt_form": "Está o Marco",        "expected_share": 0.25},
    {"option": "Here",  "type": "semantic_plausible","br_pt_form": "Aqui está o Marco",   "expected_share": 0.20}
  ],

  "br_pt_tags": ["syntax:demonstrative_this", "pragmatics:introduce_vs_describe"],

  "calibration": {
    "status": "expert_anchored",
    "a": 1.25,
    "b": -0.90,
    "c": 0.0,
    "n_responses": 0,
    "a_se": null,
    "b_se": null,
    "anchored_by": ["rater_A", "rater_B", "rater_C"],
    "last_refit": null
  },

  "quality": {
    "infit_mnsq": null,
    "outfit_mnsq": null,
    "point_biserial": null,
    "difficulty_p": null,
    "dif_flags": [],
    "retired": false,
    "retired_reason": null
  },

  "provenance": {
    "kind": "source_derived",
    "source_file": "frases-ingles-trabalho.md",
    "source_locator": "Ch 2, phrase 12 (lines 351-358)",
    "authored": null,
    "reviewed_by": null
  },

  "assets": { "tts_required": false, "tts_refs": [], "assist_tts_refs": [] },

  "metadata": {
    "estimated_time_sec": 18,
    "p_random": 0.25,
    "authored_at": "2026-09-30",
    "review_due": "2027-03-30"
  }
}
```

### 1.1 Field Notes

| Field | Why it exists |
|-------|---------------|
| `calibration.status` | **The single most important field.** Distinguishes *expert-anchored* (a judgement) from *empirically_calibrated* (a measurement). The CAT reports different SE depending on this. See §3. |
| `n_responses` | Exposed so downstream code can refuse to use an item for a claim it cannot support. |
| `distractors[].expected_share` | The author's prediction of how often each distractor is chosen. **Validated against the empirical distractor analysis at refit** (§5.3). A distractor chosen by <2% of learners is dead weight — remove it. |
| `distractors[].br_pt_form` | The Portuguese form that generates the error. Without this, `G-Q2` ("every distractor must be a form a BR-PT speaker would actually produce") is unenforceable. |
| `provenance.kind` | `source_derived` → traceable to a line in one of the 7 markdowns. `authored` → **excluded from the diagnostic CAT** until `reviewed_by` is set (this is `G-Q7`). |
| `assets.assist_tts_refs` | The 0.75× "à brasileira" audio from `content-map` §11 Decision #3. Never auto-played. |
| `p_random` | 1/n_options. For non-MCQ types (matching, ordering) the author must state the effective chance level explicitly; if it is unknown, the item cannot be used for CAT θ estimation. |

### 1.2 `item_id` Convention

```
<domain-prefix>_<skill-slug>_<seq>
grm_demonstrative_this_001
voc_corporate_term_asap_003
rdg_scanning_microtext_012
prn_th_voiced_004
lst_minimal_pair_ship_sheep_002
```

| Prefix | Skill namespace | Tracked domain for weighting |
|--------|-----------------|-----------------------------|
| `grm_` | `grammar.` | Grammar |
| `voc_` | `vocab.` | Vocabulary |
| `rdg_` | `reading.` | Reading |
| `prn_` | `pronunciation.` | Pronunciation |
| `lst_` | `listening.` | Listening (deferred — see §2.4) |
| `coh_` | `coherence.` | declared per item in `domain` |

Ids are **immutable and never reused**. A retired item keeps its id; its `quality.retired` flag is set.

**The prefix is the item's *primary skill namespace*, not its position in a practice pack.** ⚠️ Added
2026-09-30 by audit. The original table gave only prefix → domain, and the rule was inferable but not
stated. Three of the first 42 authored items violated it — a `pragmatics.` skill carrying a `grm_`
prefix, a `vocabulary.`-namespaced item whose slug came from the grammar slot — and the schema
separates `skill_ids` from `domain` without saying which one owns the id. Since `item_id` is the key
the learner model stores the observation under, **the id must name the skill that the observation
updates.** Pack-slot placement belongs in the pack manifest, which already has it.

Two consequences, both enforced by `verify-integrity.py`:

- **There is no `pragmatics.` namespace.** §1's own example carries the pragmatic dimension as a
  tag — `"br_pt_tags": ["syntax:demonstrative_this", "pragmatics:introduce_vs_describe"]` — not as a
  skill. A pragmatic distinction is therefore carried by a `br_pt_tags` entry on an item whose skill
  lives in one of the five tracked namespaces.
- **`coherence.` is a skill namespace, not a sixth tracked domain.** A `coh_` item is weighted by
  its `domain` field like any other; what makes it different is that the construct it measures is
  true of a *pair* of features (§10.1). `post-lesson-practice-spec.md` §2.2's slot budget is
  unchanged — a coherence item occupies one of the five slots, and says so in the manifest.

---

## 2. DISTRACTOR TAXONOMY

### 2.1 Six Types

`diagnostic` §6.3 prescribes four slots (Key / L1 Transfer / Overgeneralization / Plausible Semantic). That is a good spine but it is under-specified in two ways: it says nothing about non-MCQ items, and its "Plausible Semantic" bucket absorbs errors that should be distinguished. Extended to six:

| # | Type | Definition | Why it earns its place |
|---|------|-----------|----------------------|
| 1 | `l1_transfer` | The form produced by applying Portuguese rules to English. | Highest-value distractor in the whole bank. It is the *diagnostic* signal: choosing it tells the tutor which L1 rule is misfiring. |
| 2 | `overgeneralization` | A rule the learner knows, applied one step too far. | Distinguishes "hasn't learned this" from "has learned it wrong". A learner choosing these is a different remediation than one choosing `l1_transfer`. |
| 3 | `semantic_plausible` | Correct part of speech, wrong meaning. | Controls for vocabulary confusions that are not grammatical. |
| 4 | `form_alternative` | A real English form that is wrong only in this context. | *"Here is Ana"* (vs *This is Ana*). Real English, so it punishes shallow pattern-matching. |
| 5 | `register_mismatch` | Grammatically fine, socially wrong for the stated situation. | Unique to the workplace corpus. Separates *can I make a sentence* from *can I make this sentence here*. |
| 6 | `negative_control` | Deliberately nonsensical or impossible. | **Use sparingly — at most one per item, never on its own.** Exists to detect satisficing (reading only the last option). A negative control that no real learner picks costs a slot and adds nothing. |

### 2.2 Composition Rules

| Rule | Value |
|------|-------|
| Options per MCQ | 4 (matches `P(G)` in BKT; see §4.6) |
| Exactly one key | Required |
| Minimum `l1_transfer` distractors | **1**, whenever a documented BR-PT form exists |
| Maximum `negative_control` | 1, and never as the only non-key option |
| Options differing only in length | Forbidden — creates the length cue (`G-Q3`) |
| Keys balanced across option positions | Track: keys must not exceed 40% in any one position over a 50-item sample |
| Options differing only in punctuation/case | Forbidden |

#### 2.2.1 `br_pt_form` — three states, and why `null` is not one of them

`br_pt_form` records the Portuguese form that *generates* the English error, which is the whole
mechanism by which G-Q2 becomes checkable. A `null` therefore carries no information on its own:
`null` is also what an unfinished migration looks like. The value and the reason are separate
fields, and **every `null` must be explained by exactly one of the following**, or it is a defect:

| State | Field | Meaning | Enforced by |
|-------|-------|---------|-------------|
| **filled** | `br_pt_form: "…"` | A real, verifiable BR-PT source form exists. Satisfies G-Q2 for that distractor. | `verify-integrity.py` [9] counts it; the value must come from a real PT source, never from reconstruction |
| **null, reason recorded** | `br_pt_form: null` + `note: …` | A PT form *would* apply, but no verifiable PT source was available, so none was invented. **This is a finding, not a gap** — it says the distractor is currently unaccountable for G-Q2. | [9] requires a `note:` on **every** `- option:` distractor, filled or null |
| **null, not applicable** | `br_pt_form: null` + `br_pt_form_state: not_applicable_no_distractor_set` | The item has **no distractor set at all** — a production or minimal-pair item scored by ASR phoneme match. There is no Portuguese form *to* record. | [9] counts `br_pt_form_state` separately and never folds it into `n_null` |

> **Why the fourth state exists rather than being folded into `null` with a note.** A production
> item and an item whose transfer evidence was simply never written both render as
> `br_pt_form: null`. Collapsing them hides exactly the finding worth seeing: the first is a
> correct design decision, the second is missing evidence. A `note:` on the first would also be
> *false* — it would claim there was no PT source when in truth there was no distractor to have a
> PT source for.
>
> A `**Key:**` follows the same logic and is required on exactly the same condition: an item with a
> `| Slot | Value |` distractor table must declare a key, because a key scores a choice and there is
> no choice to score otherwise. Production items carry `scoring: asr_phoneme_match` instead. The 6
> `minimal_pair_*` items in `pack-les-a2-*.md` are the distractor-free population.

Counts as of 2026-11-19, across all packs: **2136 filled / 76 null-with-note / 123
null-not-applicable / 0 undocumented.** Recomputed from the files rather than
written by hand, so the first new item cannot make this table quietly wrong.

### 2.3 Non-MCQ Types

The taxonomy above assumes distractors. Three item types do not have them, and each needs its own validity check:

| Type | Chance level | Validity requirement |
|------|-------------|---------------------|
| `cloze` (free-text, typed) | Depends on answer space | Must record expected answer **variants**. `colour`/`color` both correct; `He is`/`He's` **not** equivalent if the item tests contraction. Variants are enumerated per item, not inferred. |
| `matching` (n-to-n) | 1/n! | n≤4. The `1/n!` chance level must be entered as `p_random`. |
| `ordering` (sequence) | 1/n! | n≤5. Record `p_random = 1/n!` explicitly. |

> **A free-text item with unenumerated variants must not enter the CAT.** You cannot compute P(correct) for an item whose key is a guess about what the learner will type.

### 2.4 Listening — Deferred, and What That Means for the Bank

`content-map` §8.5 G2 established that **none of the 7 source markdowns contains listening material**. Consequences, applied here:

1. **No `lst_` items may be authored for MVP.** Not placeholder items, not "read the text then answer" items.
2. `diagnostic` §10's MVP scope ("3 domains: Grammar, Vocab, **Listening**") is **replaced** by Grammar, Vocabulary, Reading. This is correction **X3**.
3. `diagnostic` §2.1's blueprint re-weights (below).
4. The CAT runs on **4 domains**, and the diagnostic must **say so** — a placement result that silently omits a competence it claims to measure is a false promise. The results screen states: *"Listening not yet assessed — coming soon."*
5. `diagnostic` §2.3 gives Vocabulary modality "Text + Audio". Under this decision Vocabulary is **text-only** until the audio corpus exists.

### 2.5 Revised Diagnostic Blueprint (replaces `diagnostic` §2.1)

| Domain | CEFR | Weight | Min items | Max items | Status |
|--------|------|--------|-----------|-----------|--------|
| Grammar | A1–B2 | 34% | 6 | 9 | ✅ buildable |
| Vocabulary | A1–B2 | 28% | 5 | 8 | ✅ buildable (text) |
| Reading | A1–B2 | 21% | 4 | 6 | ✅ buildable |
| Pronunciation | A1–A2 | 17% | 3 | 5 | ⚠️ minimal-pair **identification** only; production scoring needs the ASR engine |
| ~~Listening~~ | — | ~~20%~~ | — | — | ⛔ deferred (§2.4) |
| **Total** | | **100%** | **18** | **28** | |

Pronunciation rises from 10% to 17% because it is the domain where BR-PT learners most reliably under-perform in real production, and minimal-pair identification is scoreable without an ASR engine. Production scoring is explicitly out of scope and must not be claimed.

#### 2.5.1 Pronunciation production: the decision, the reasoning, and what would reverse it

**Decision.** The MVP scores pronunciation **reception only** — minimal-pair identification, and
discrimination between two words a qualified listener has confirmed differ. No item asks the
learner to produce a sound and no score is derived from a recording.

**Why, given that production is the thing learners actually need.** Three reasons, and the third
is the one that decides it.

1. **A score is only as good as its engine.** Phoneme-level ASR scoring needs forced alignment on
   L2 speech, where the acoustic model is weakest precisely where the learner is weakest. A
   phoneme error rate produced by a general-purpose recogniser is a number about the recogniser.
   Shipping it as a learner-facing score would be worse than shipping no score: it would be
   confidently wrong, and the BR-PT phonological gaps this repository is built around — [θ]/[ð],
   /w/ vs /v/, final -ed — are exactly the sounds a general recogniser conflates with the L1.
2. **Identification and production are different constructs and must not share a θ.** A learner can
   discriminate /stæk/ from /stʌk/ and still pronounce both identically. Putting them in one skill
   would produce the exact failure §10.3 of `post-lesson-practice-spec.md` documents at scale: every
   component passing, the combination failing, and nothing able to see it.
3. **The cost is concentrated where the learner is not.** Building and validating phoneme scoring is
   a multi-month engineering project with its own calibration population. Spending it on the MVP's
   one remaining gap would mean shipping 123 lessons against an empty item bank, because the bank
   cannot be calibrated without Stage-1 responses, and Stage-1 responses need the packs, and the
   packs need the lessons. **Production scoring is at the end of the critical path, not on it.**

**What the ITS does instead, which is not nothing.** Three substitutes, in descending order of
value:

- **Perception-first scheduling.** Every `prn_*` item is identification, so the learner hears the
  contrast before being asked for it. This is the *receptive* half of the skill and it is real
  learning, not a consolation prize.
- **Model answer playback.** Output tasks in `mod_a2_it_fundamentals` and `mod_a1_comm_basic`
  specify a `br_pronunciation_guide` second audio track (`content-map.md` Decision #3). The learner
  produces the sound, hears the target, and self-compares. The learner is the scorer, and the
  learner is the only instrument in the loop that is not miscalibrated for this task.
- **Shadow CAT perception items carry the diagnosis.** If a learner fails `prn_s_consonant_cluster`,
  the ITS knows the contrast is unresolved and can route to a minimal-pair drill even though it
  cannot score an attempt.

**What would reverse this decision — all four, not one.**

| # | Condition | Why it is necessary and not merely sufficient |
|---|-----------|-----------------------------------------------|
| 1 | An ASR engine with published L2 phoneme-level accuracy on the 9 target contrasts, measured on **Brazilian Portuguese L1** speakers | Accuracy on L1-matched speech says nothing about the population the ITS serves |
| 2 | A human-rated correlation study: engine phoneme error rate vs. a qualified listener's rating, on ≥ 100 utterances per contrast | An engine can be internally consistent and externally meaningless |
| 3 | An item schema for production responses (audio capture, retention, consent, the item's own reliability) | `assessment-item-spec.md` §1 has no field for a recording, and inventing one late is how unreviewable data enters a learner's permanent model |
| 4 | A decision on whether the produced audio is stored at all | A learner's voice is the most sensitive data this system will ever hold, and the spec must answer that *before* the capture code exists, not after |

> **Recorded as a decision rather than a gap, and dated.** 2026-09-30. Until conditions 1–4 are
> met, the results screen must not imply that pronunciation is being assessed in production — the
> same disclosure obligation that §2.1 places on Listening, and for the same reason: a competence
> the system does not measure must be named, not quietly omitted.

---

## 3. CALIBRATION PROTOCOL

> **This section supersedes `stats-progress-evaluation-spec.md` §4.2 step 2.**

### 3.1 Rule Zero — Simulated Calibration Data Is Forbidden

The `stats` spec allows "200 responses per item (**simulate if needed**)". This must be struck.

**Why it is fatal:** if item *i* is generated with `a=1.25, b=-0.90`, then 200 simulated responses from a simulated population are drawn *from that same (a,b)*. Running MML on them recovers 1.25 and −0.90 — up to sampling noise. The output looks like a calibrated parameter, passes the Infit/Outfit check in `stats` §4.2 step 4, and is **a restatement of the author's assumption dressed as a measurement.**

The consequence is worse than having no number. A CAT built on simulated-calibrated items reports an SE of 0.30 that reflects only sampling noise, while the real error — the difference between the assumed `b` and the true `b` — is unmeasured and invisible. The learner receives a placement decision they cannot audit, produced by a test that reports precision it does not have.

**What simulation *is* legitimately for:** verifying the CAT machinery itself (does MFI actually maximize information? does the stopping rule fire at the right length?). That is a test of the *software*, and §6 keeps it.

### 3.2 Two-Stage Calibration

| Stage | Method | Status value | What it licenses |
|-------|--------|--------------|-----------------|
| **Stage 1 — Expert anchoring** | 3 independent raters assign `b` from CEFR can-do descriptors; `a` from item-structure judgement. Disagreement > 0.75 logit triggers a 4th rater and discussion. | `expert_anchored` | CAT use **with inflated SE** (§3.3). Shadow CAT. Practice packs. |
| **Stage 2 — Empirical refit** | Bayesian MML (JML prior) with shrinkage toward the Stage-1 anchor. Activates at n ≥ 50; full status at n ≥ 200. | `partially_calibrated` (n<200) / `empirically_calibrated` (n≥200) | Tighter SE. V1+ claims. DIF reporting. |

**Shrinkage is what makes Stage 1 legitimate.** With a JML prior centred on the expert anchor, an item with 50 responses produces a posterior that is mostly the prior plus a real correction — and the SE on that posterior honestly reflects 50 responses. Without the prior, 50 responses produce a wildly overconfident estimate; with a pure prior, nothing is learned. The prior is not a substitute for data; it is the honest representation of "we have some data and a considered opinion."

### 3.3 SE Inflation by Calibration Status

An `expert_anchored` item's parameters carry real uncertainty. Reporting it with the SE the CAT machinery computes would overstate precision.

```
SE_effective(θ) = sqrt( SE_statistical(θ)² + SE_parameter(θ)² )

SE_parameter(θ) from the Stage-1 anchor:
  Var_b = (1.75 / n_raters)²          # disagreement across raters
  Var_a = (0.35)²                     # assumed SD of `a` judgement
  SE_parameter(θ) ≈ sqrt( Σ_i [ Var_b_i · P_i(θ)²  +  Var_a · (P_i(θ)(1−P_i(θ)))² ] )

Practical values (uniformly anchored, a≈1.2):
  status                    SE_parameter   realistic SE_effective at n=23 items
  expert_anchored                ~0.30         ~0.46
  partially_calibrated (n=100)   ~0.12         ~0.35
  empirically_calibrated (n≥200) ~0.06         ~0.31
```

**Design consequence.** `diagnostic` §3.5 sets the stopping rule at `SE(θ) < 0.35`. With a Stage-1-only pool that threshold is **mathematically unreachable** — the parameter noise alone contributes ~0.30. So:

- **The stopping rule uses `SE_statistical`, and the results screen reports `SE_effective`.** Both are shown.
- The stopping rule's purpose is *test-length control* (stop when more items stop helping), and `SE_statistical < 0.35` serves that. Claiming placement precision is a separate claim governed by `SE_effective`.
- **Placement output must carry the parameter uncertainty.** A learner placed at A2 with `SE_effective = 0.46` is placed less precisely than one placed with 0.31, and the UI should not pretend otherwise. Display band: *"Level A2 (precision: provisional)"*.

### 3.4 Response Budget Reality

The gap identified as **X2**, with numbers:

| Target | Items × 200 | Available at 200-user pilot | Gap |
|--------|------------|---------------------------|-----|
| `stats` §10 MVP | 50 × 200 = 10,000 | 4,400 | **2.3×** |
| `stats` §10 V1 | 200 × 200 = 40,000 | 4,400 | **9.1×** |
| `diag` §2.2 pool | 328 × 200 = 65,600 | 4,400 | **14.9×** |

At the pilot scale stated in `diagnostic` §7.2, **22 items reach full empirical calibration.** Every other figure in the specs is unreachable at that scale.

**Resolution — the pool is sized to the response budget, not to the wish list:**

| Horizon | Pool size | Basis |
|---------|-----------|-------|
| **MVP** | **120 items** | 6.7× an 18-item CAT (§3.5). All Stage-1 anchored. |
| **V1 (post-pilot, ~1,500 users)** | 120 → **400** | 1,500 users × 20 items = 30,000 responses → 150 items at n=200 |
| **V2 (~10,000 users)** | 400 → 900 | Sufficient for the `stats` §4.3 ambition |

The `stats` §4.3 targets (540 items) and `diagnostic` §2.2 targets (328 items) are **roadmap aspirations, not MVP commitments**, and are relabelled as such in both files.

### 3.5 CAT Length Is Set by Discrimination, Not by Preference

This was nowhere stated in any spec, and it governs everything about pool sizing.

```
2PL information at θ = b:   I = a² · P · Q = a² · 0.25
SE(θ) = 1 / √(n · a²/4)    →    n = 4 / (a² · SE²)
```

| Discrimination `a` | Items needed for `SE_statistical < 0.35` |
|----------------------|------------------------------------------|
| 0.8 | 52 |
| 1.0 | 33 |
| **1.2** | **23** ← authoring target |
| 1.5 | 15 |
| 2.0 | 9 |

**Authoring rule: CAT-pool items must target `a ≥ 1.2`.** A pool of `a≈0.8` items needs 52 administrations to reach the same precision — which breaks the 15-minute time cap before the stopping rule fires.

This is also why `diagnostic` §7.1's target "Test Length (mean) 22 ± 4 items" is consistent — it is what `a≈1.2` predicts. The number was right; nobody had recorded why.

### 3.6 What Makes an Item Discriminating (how to hit `a ≥ 1.2`)

High discrimination means learners at adjacent θ levels behave differently — the item must separate them, not merely be easy or hard.

| Technique | Effect on `a` |
|-----------|----------------|
| **Two confusable options, one correct** (*This is* vs *He is*) | ↑ Strong. Forces a real decision. |
| **All distractors are documented BR-PT forms** | ↑ Strong. The distractor a BR-PT learner actually reaches for is exactly the one that discriminates. |
| Stem is minimal and unambiguous | ↑ Prevents noise from misreading. |
| **Longest-option-is-the-key** | ↓ ↓ Destroys `a`. Forbidden by `G-Q3`. |
| Distractor that no learner ever picks | ↓ Wastes a slot; remove per §1.1. |
| Genuinely ambiguous stem | ↓ ↓ Silent killer. Two defensible answers → the item measures reading luck. |
| Double-barrelled stem | ↓ ↓ Uninterpretable θ contribution. `G-Q4`. |

---

## 4. BR-PT DISTRACTOR CORPUS

The bank that makes `G-Q2` enforceable. Sourced, not invented — every row traces to a line in one of the 7 markdowns or to a documented BR-PT transfer.

### 4.1 Grammar Transfers

| EN target | BR-PT wrong form | Type | Source |
|-----------|------------------|------|--------|
| `This is Marco.` | `He is Marco.` / `Ele é o Marco.` | l1_transfer | frases Ch2 ph12 |
| `It works.` | `It work.` | l1_transfer | IT §4.2 |
| `It's raining.` | `Is raining.` (null subject) | l1_transfer | leia Ch3 |
| `I'm working today.` | `Working today.` | l1_transfer | leia Ch3 |
| `I'm in charge of the project.` | `I'm the responsible of the project.` | l1_transfer | frases Ch11 |
| `We work together.` | `He works in my job.` | l1_transfer | frases Ch11 |
| `Let me introduce my colleague.` | `Let me present my colleague.` | l1_transfer | frases Ch11 |
| `Nice to meet you.` (2nd meeting) | `Nice to meet you.` | register_mismatch | frases Ch11 |
| `She has worked here since 2020.` | `She have worked here since 2020.` | l1_transfer | IT §3.4 |
| `start` | `estart` | l1_transfer (orthographic) | IT §7.2 |

### 4.2 False-Cognate Distractors

From the false-cognate deck (`content-map` §11.2) — 30 items authored, **22 defensible after the 2026-09-30 review** (`tier-b-review.md` §4). **Tier A (16) may be used in the CAT. Tier B (6 survivors of 14) may not** until `reviewed_by` is set **and** n ≥ 200.

| Trap | BR-PT assumption | Correct for the PT intent |
|------|------------------|---------------------------|
| actually | = atualmente | currently |
| eventually | = eventualmente (as "talvez") | probably / maybe |
| pretend | = pretender | intend |
| push | = puxar | pull |
| library | = livraria | bookshop |
| parents | = parentes | relatives |
| novel | = novela | TV series |
| lecture | = leitura | reading |
| journal | = jornal | newspaper |
| resume | = resumir | (CV: *résumé*) |
| available | = avaliado | appraised |
| arrest | = arrastar | drag |
| college | = colégio | high school |
| data | = data (calendário) | date |
| estate | = estado | state |
| exit | = êxito | success |

> **Discrepancy rule** (`content-map` §11.2): *currently* and *nowadays* are **both correct** for "atualmente"; the key is *currently*, but a response of *nowadays* must be **accepted**. Never mark it wrong. This is an item-keying rule, not a style preference.

### 4.3 Corporate-Term Distractors

For the 40-term deck (`content-map` §11.1). Per §11.1's own `type` field:

- `ACR` items (32) → distractors are **other real acronyms** from the deck. Testing *ASAP* against *EOD* or *FYI* is the only honest way: random letters would be guessable by elimination.
- `JARG` items (6: Stakeholder, Deadline, Lead, Churn, Bug, Deploy, Bandwidth) → **must be sentence-framed**, because the PT gloss is a free translation, not a definition.
- `PHRS` items (2: Touch base, Circle back) → same as JARG.
- High-value pairs: `PM` (Project Manager / the afternoon), `PoC` vs `POC`, `Lead` vs `leader`, `Deploy` vs `deployment`.

### 4.4 Pronunciation Distractors

These are **not** written-text distractors — they are audio contrast pairs, and the item is which of two near-identical tokens you heard.

| Skill | Pair | BR-PT substitution | Scoring |
|-------|------|--------------------|---------|
| `prn_th_unvoiced` | sink / think | both → *sique* / *tique* | identification; production ASR-scored |
| `prn_th_voiced` | the / this | *de* / *desse* | as above |
| `prn_h_aspirated` | have / how | *ave* / *aú*; h deleted (riocariense) | as above |
| `prn_r_initial` | room / red | *rruim* (uvular or tapped r) | as above |
| `prn_s_cluster` | start / station | *estart* / *estação* (epenthesis) | as above |
| `prn_word_stress` | PHOtograph / phoTOgrapher | flat stress | as above |

> **G3 caveat** (`content-map` §8.5): the sources supply BR-style spelling guides in brackets, explicitly *not* IPA. These support item keying and TTS prompts. They do **not** support automatic prosody scoring. Pronunciation items in the CAT are **identification only**; production is ASR-scored and reported separately, or not at all.

---

## 5. QUALITY CONTROL

### 5.1 Review Gates

| Gate | When | Who | Blocking |
|------|------|-----|----------|
| **Q1 Schema** | On create | automated | Item cannot be served |
| **Q2 Distractor taxonomy** | On create | automated — every non-key option needs a `type` from §2.1 and a `br_pt_form` if `l1_transfer` | Cannot be calibrated |
| **Q3 Source trace** | On create | automated — `provenance.locator` must resolve | Cannot be CAT item if `authored` |
| **Q4 Peer review** | Before Stage 1 | 2nd rater, blind to the 1st | Cannot anchor |
| **Q5 CAT admission** | Before diagnostic | 3 raters agree on `b` within 0.75 logit; `a` ≥ 1.2 target; no open DIF flag | Not served in CAT |
| **Q6 Post-refit** | n ≥ 50 | automated | — |

### 5.2 Statistical Fit Criteria

Extends `stats` §4.2 step 4, which gives only Infit/Outfit MNSQ ∈ [0.7, 1.3].

| Statistic | Accept | Action if outside |
|-----------|--------|-------------------|
| Infit MNSQ | 0.70 – 1.30 | Investigate: item may be miskeyed, or the stem ambiguous |
| Outfit MNSQ | 0.70 – 1.30 | Same, plus check for a `negative_control` slot |
| Point-biserial (rest) | ≥ 0.20 | Below 0.20 the item does not discriminate — **retire** |
| `p_random` residual | keyed share within 0.05 of 1/n_options | Item is guessable — rewrite (this is `G-Q3` empirically) |
| Distractor share | every non-key option ≥ 2% | Dead option — remove, or replace with a real BR-PT form |
| Predicted vs observed distractor share | within 0.15 | Author's BR-PT model of the error is wrong — update `expected_share`, and reconsider the item's placement |
| `b` stability | shift < 0.30 logit between consecutive refits | Item behaviour is drifting; check for seasonal or content effects |

> The "predicted vs observed distractor share" check is the one that keeps the BR-PT corpus honest. If the author *predicts* learners will choose `He is` 55% of the time and only 8% do, the author has mis-modelled the L1 transfer — and that mis-modelelling propagates into every remediation set generated from this item.

### 5.3 Distractor Analysis at Refit

For every item at n ≥ 50, record the empirical option-share vector. Three patterns require action:

| Pattern | Meaning | Action |
|---------|---------|--------|
| One option dominates (≥ 70%) | The item is easy for this population — likely `b` is miscalibrated | Refit `b`; if the population is genuinely weak, the item is fine but belongs at a lower CEFR tag |
| Options split evenly | **The item is working.** Learners are choosing between real alternatives. | None. This is the target state. |
| Key share ≈ 1/n_options | Keyed wrong, or the stem has multiple defensible answers | **Investigate the key before anything else.** |
| Systematic wrong option across items | A curriculum gap, not an item defect | Route to `content-map` §9.1 / remediation nodes |

### 5.4 DIF — Differential Item Functioning

`stats` §4.2 step 5 asks for DIF by L1, age, tech background. Made operational:

| Comparison | Mantel-Haensson Δ | Significance | Action |
|-----------|------------------|--------------|--------|
| BR-PT vs. other L1 | \|Δ\| ≥ 0.25 **and** χ² p < 0.05 | both required | Flag |
| Tech background (has vs not) | same | both required | Flag |
| Age band | same | both required | **Informational only** — not a basis for removal |
| Post- vs pre-correction version | Δ ≥ 0.30 | — | Must be reported if both versions exist |

**The DIF threshold requires both magnitude and significance**, deliberately. With a large enough N, a 0.03 difference becomes "significant" and every item gets flagged; with a small N, a real 0.5 bias never reaches significance. Requiring both is the standard defence against each failure.

**A DIF flag does not automatically remove an item.** Order of operations:

1. Classify the flag: **A-class** (the item is harder for BR-PT for reasons unrelated to the skill — e.g. an ambiguous stem, or a distractor that penalises correct reasoning) vs **B-class** (the item is harder for BR-PT *because of genuine L1 interference that is the point of the skill*).
2. **A-class → remove or rewrite.** An item whose difficulty for BR-PT learners comes from something other than the target skill is measuring the wrong thing.
3. **B-class → keep and label.** If the item tests `grammar.null_subject_error` and BR-PT learners miss it because PT drops subjects, that is the item working exactly as designed. Flag it, keep it, and report the flag in DIF reporting.

> Removing all B-class items would strip the bank of its entire diagnostic value for this population. The distinction between A and B classes is the whole point of running DIF rather than discarding flagged items.

---

## 6. SIMULATION — WHAT IT IS AND IS NOT FOR

Preserving the legitimate use identified in §3.1 and banning the illegitimate one:

| Use | Allowed? | Purpose |
|-----|----------|---------|
| Verify the **CAT engine** — does MFI actually pick high-information items, does the stopping rule fire at the right length, do the constraint filters work | ✅ **Yes** | Testing software against a known-truth population |
| Estimate expected test length under a given pool | ✅ Yes | Capacity planning |
| Estimate how many items will reach n=200 at a given user count | ✅ Yes | Pool sizing |
| Produce item `(a, b)` values | ⛔ **No** | §3.1 |
| Populate the item bank with "calibrated" entries | ⛔ **No** | §3.1 |
| Validate item *content* (is the stem ambiguous? is the key right?) | ✅ Yes, by expert review | Not by simulation |

Simulation runs use **known** `(a, b)` inputs and check only whether the *machinery* recovers the ordering. If the engine cannot rank items correctly when handed the true parameters, the engine is broken — and simulation is the right tool for that.

Simulation results must be stored with `"simulated": true` and can never write to the item bank.

---

## 7. ITEM LIFECYCLE

```
        authored
           │
           ▼
   ┌───────────────┐   Q2, Q3 fail    ┌─────────────┐
   │  drafted      │─────────────────▶│  rejected   │
   └───────┬───────┘                  └─────────────┘
           │ Q2, Q3 pass
           ▼
   ┌───────────────┐   Q4 fail         ┌────────────────┐
   │ peer_reviewed │──────────────────▶│  revision      │
   └───────┬───────┘                   └────────────────┘
           │ Q4 pass
           ▼
   ┌───────────────────┐
   │ expert_anchored   │◀── STATUS 1: usable in CAT with inflated SE
   │   (n = 0)         │    usable in Shadow CAT + all practice packs
   └───────┬───────────┘
           │ n ≥ 50
           ▼
   ┌───────────────────┐
   │ partially_        │◀── STATUS 2: SE_parameter ≈ 0.12
   │ calibrated        │    DIF reporting enabled
   └───────┬───────────┘
           │ n ≥ 200
           ▼
   ┌───────────────────┐   fit fail    ┌────────────┐
   │ empirically_      │──────────────▶│  retired   │
   │  calibrated       │               └────────────┘
   └───────────────────┘                      │
           │  fit pass                         │
           ▼                                   ▼
   ┌───────────────────┐               ┌────────────────┐
   │  serving (CAT +   │               │  retired —     │
   │  practice + L2)   │               │  reason logged │
   └───────────────────┘               │  id never reused│
                                         └────────────────┘
```

### 7.1 Retirement Triggers

| Trigger | Action |
|---------|--------|
| Point-biserial < 0.20 after refit | Retire — non-discriminating |
| Key share ≈ 1/n_options after investigation | Retire — likely miskeyed |
| 3 consecutive misses by ≥5 distinct learners (G-Q6) | Investigate, then retire if the item is the cause |
| DIF A-class confirmed | Rewrite or retire |
| Content stale (e.g. a technology term has changed meaning) | Revise or retire |
| `review_due` passed without review | Auto-flag; if 180 days overdue, retire |

Retired items keep their `item_id` and gain `quality.retired: true` plus a `retired_reason`. They remain queryable — a learner who was placed using a retired item must still be auditable.

---

## 8. REVISED BANK TARGETS

Replaces `stats` §4.3 and `diagnostic` §2.2 as **MVP commitments**. The old numbers remain as roadmap labels.

### 8.1 MVP Bank — 120 Items

Sized to the §3.5 information requirement (6.7× an 18-item CAT) and the §3.4 response budget. Distributed across the **88 tracked skills** (`content-map` §3).

| Domain | MVP items | Skills covered | Items/skill | CEFR spread |
|--------|-----------|----------------|-------------|-------------|
| Grammar | 40 | 31 grammar skills → 24 P0 skills | 1.7 | A1: 14, A2: 18, B1: 6, B2: 2 |
| Vocabulary | 38 | 24 vocab skills → 18 P0 skills + 40-term deck | 2.1 | A1: 12, A2: 18, B1: 6, B2: 2 |
| Reading | 22 | 15 reading/writing skills → 10 P0 skills | 2.2 | A1: 8, A2: 9, B1: 4, B2: 1 |
| Pronunciation | 20 | 18 pron skills → 6 priority pairs | 3.3 | A1: 10, A2: 8, B1: 2 |
| **Total** | **120** | 58 P0 skills covered | | A1: 44, A2: 53, B1: 18, B2: 5 |

**Honest statement of what 120 items means:** 30 of the 88 tracked skills have **zero items** in MVP. Those skills cannot appear in the CAT, cannot carry a mastery estimate, and must not appear in the diagnostic output. The results screen reports the learner's profile only across covered skills.

This is the real consequence of the response budget, and it is preferable to the alternative — 540 items at 20 responses each, none of them calibrated, all of them reported as if they were.

### 8.2 Coverage Priority Rule

When the pool cannot cover all skills, prioritise by:

1. **Diagnostic discriminativeness** — skills that separate false beginners from true beginners (§4 of `diagnostic`). Highest value per item.
2. **Gating role** — skills in `mastery_gate.required_skills` of a lesson. Without these, progression decisions break.
3. **BR-PT interference strength** — a skill where the L1 error is systematic and predictable yields a more diagnostic item than a skill with diffuse errors.
4. **Frequency in the corpus** — high-frequency skills appear in more items' stems, so their parameters are better estimated.
5. **Prerequisite centrality** — a skill that gates many others.

### 8.3 False-Cognate Deck as a Diagnostic Instrument

The false-cognate deck (`content-map` §11.2) — 30 authored, 22 after review — deserves its own treatment because its distractors are **pre-visible**: for a false-cognate item, the author already knows the wrong answer before any data arrives.

- **Tier A (16, source-derived)** → CAT-eligible.
- **Tier B — 14 authored, 6 after review** → practice packs and Shadow CAT only, until `reviewed_by` **and** n ≥ 200 responses. The 2026-09-30 adversarial review (`tier-b-review.md` §4) voided 8 of the 14 on keyability and true-cognate grounds, leaving 5 true false cognates + 1 false friend. It cleared the survivors **linguistically, not psychometrically** — `b` is a population quantity a careful reader cannot supply — so they remain CAT-ineligible.
- All 16 Tier A items carry `br_pt_tags: ["lex:false_cognate:<word>"]` and share a single skill `vocab.false_cognate_set`, which gives the CAT a clean, high-discrimination cluster: learners either know these or they reliably fall for the cognate. That is a large, consistent discrimination — ideal for MFI placement early in the test.

---

## 9. VALIDATION CRITERIA FOR THIS SPEC

This spec must itself be validated by producing a bank, the same way `post-lesson-practice-spec.md` was validated by producing a pack. Criteria:

| Claim | How to test | Target |
|-------|------------|--------|
| A 120-item pool can drive an 18-item CAT to `SE_statistical < 0.35` | Run MFI on the pool under simulated ability spread | Median length 15–22 items |
| The CAT classifies CEFR with >85% accuracy | Simulated population with known θ → placement (software test, §6) | > 85% |
| The BR-PT distractor corpus produces real discrimination | After pilot: compare option-share vectors of BR-PT vs. other L1 | ≥ 3 items show Δ ≥ 0.25 |
| Stage-1 anchoring is not worse than useless | Compare Stage-1-only vs Stage-2 placement accuracy on the same responses | Stage-1 within 0.05 of Stage-2 on classification |
| `a ≥ 1.2` is achievable for BR-PT grammar items | Refit 10 authored items | ≥ 7 items reach `a ≥ 1.2` |

**Until a 10-item pilot bank exists, every `(a, b)` value in the repository is a Stage-1 guess, and the spec says so in every schema example.**

---

## 10. AMENDMENTS PROPAGATED UPSTREAM

| Correction | Applied to |
|-----------|-----------|
| X1 — no simulated calibration | `stats` §4.2 step 2 struck; replaced by the two-stage protocol |
| X2 — pool sized to response budget | `stats` §10 MVP/V1 item counts; `stats` §4.3 relabelled roadmap; `diagnostic` §2.2 relabelled roadmap |
| X3 — MVP domain set | `diagnostic` §10 in-scope list |
| X4 — listening removed from bank and blueprint | `diagnostic` §2.1, §2.2, §2.3; `stats` §4.3 |
| X5 — per-domain θ reporting floor | `diagnostic` §3.6 |
| X6 — content balancing granularity | `stats` §5.3 rewritten to defer to `diagnostic` §3.3 |
| X7 — `P(G)` for 4-option MCQ | `stats` §2.1 |
| X8 — `les_` id prefix | `stats` §9.1 |
| X9 — **pair-level (coherence) skill ids** | `stats` §2.1 skill map; `diagnostic` §3.1 blueprint slots. See §10.1 |
| X10 — **`speech_act` label on `contextual_selection`** | new field in §4's item schema; §4.3 distractor taxonomy gains an intent-dimension. See §10.2 |

---

## 10.1 X9 — Three coherence constructs have no skill id, and all three were found by authoring

Authoring `mod_a2_workplace_intro` produced six lessons and six packs. Three of them independently
hit the same wall: **a construct that is a property of a pair of features, not of either one.**

| Construct | Lesson | Features that already exist | What the model would report |
|-----------|--------|---------------------------|----------------------------|
| `reciprocal_introduction` | `les_a2_introducing_others` | `demonstrative_this`, `intro_reaction_gradation` | **"mastery"** — while the learner omits the second introduction entirely |
| `email_register_pairing` | `les_a2_email_basics` | `email_greeting`, `email_closing` | **"mastery"** — while every email has a mismatched pair |
| `two_part_disagreement_frame` | `les_a2_meeting_participate` | `agree_verb_not_adjective`, `hedge_calibration` | **"mastery"** — while the learner validates and then agrees anyway |

**The failure is invisible to per-feature retrieval practice.** In all three cases the learner holds
every component and fails only the combination, so a review queue built from the components will
never surface the error and the learner will be told they are ready.

**This is the same argument as §3's case for two-stage calibration, applied to the skill map:** *a
test whose parts all pass is not evidence that the whole passed.* §3 already required that an
aggregate claim be validated on the aggregate. §3 did not say the aggregate must also be its own
**skill**, and it has to be — because `P(mastery)` in `stats` §4.2 is computed per skill, and there
is nowhere else for a pair-level estimate to live.

**Specification of the addition.**

| Field | Value |
|-------|-------|
| **Naming** | `coherence.<construct>`, distinct from the `grammar.` / `vocab.` namespaces |
| **Score source** | a **checklist item** (`type: checklist_completion`), not an MCQ. The learner is scored per *step*, and all steps must pass |
| **Number of observations** | one per Output Task. **Explicitly insufficient** for a θ move on its own (`stats` §9's `n = 4/(a²·SE²)`) — these constructs need at least 2–3 encounters before they inform a gate |
| **Relation to parents** | a pass on `coherence.X` does **not** imply its components are mastered; it only implies the combination was observed once |
| **Interaction with the gate** | `stats` §4.2's `required_skills` may include a `coherence.` id, but it must not be the **sole** gate — a one-observation skill with a 0.85 threshold would make the gate unpassable in practice |

**Scope.** This is an addition to the skill map, not a change to any existing feature, and it does
not alter §4's schema. Three skill ids is enough to make the omission visible; the pattern generalises
to any construct that is true of a pair, so §5's blueprint must reserve a `coherence.` slot from the
start rather than discovering them one lesson at a time.

---

## 10.2 X10 — `contextual_selection` items whose distractors differ in *intent*, not form

Two authored items (`grm_can_modal_register_001`, `grm_email_register_pairing_001`) have distractors
that are **all grammatical** and differ only in what speech act they perform:

| Option | Form | Speech act |
|--------|------|-----------|
| *Can you do the dashboard?* | valid | ask about **capacity** |
| *Can you have the dashboard ready by Thursday?* | valid | **delegate** a task |
| *Will you have the dashboard ready by Thursday?* | valid | **instruct** |

A syntax-only grader marks all three correct or all three wrong, depending on how it matches. The
item is therefore **unscoreable as specified** — not badly specified, unscoreable.

**The addition:** `contextual_selection` items MAY carry a `speech_act` map, one label per option.

```yaml
speech_act:
  A: capacity
  B: delegation      # key
  C: instruction
  D: not_english
```

The grader compares the learner's selection against the **label**, not the string. This has a
second-order benefit: the distractor taxonomy in §4.3 gains an **intent dimension**, so
*all-grammatical* distractor sets become a legitimate and authorable category instead of a defect.

**Cost, stated plainly.** This adds a second thing to validate per item, on top of the 5 criteria in
§9. For the items that need it the cost is worth it; for items that do not, `speech_act` is omitted
and the grader falls back to string matching. It is conditional, not universal.

---

*This spec defines the atomic unit of measurement in the ITS. An item that cannot be calibrated is an opinion; an item that is calibrated badly is worse than no item. Both failure modes are explicitly handled above — and X9 and X10 above are two instances of the first mode that only became visible by authoring real items.*
