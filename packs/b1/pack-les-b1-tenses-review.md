# Practice Pack — `les_b1_tenses_review`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_tenses_review_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_tenses_review.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_tenses_review_v1
lesson_id: les_b1_tenses_review
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_tenses_review_tense_selection_001
skill: `grammar.tenses.present_simple_vs_past_simple`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "is failing / fails"
    br_pt_form: "está falhando / falha"
    note: "'every morning' is a routine, not an action in progress; 'yesterday' cannot take present simple"
  - option: "failed / fails"
    br_pt_form: "falhou / falha"
    note: "the pair reverses the time markers: every morning is present, yesterday is past"
  - option: "will fail / failed"
    br_pt_form: "vai falhar / falhou"
    note: "'will' predicts a future event, but the first clause reports a daily routine"
```

**Item:**
> Complete the status note: "The nightly build ______ at 03:00 every morning, but yesterday it ______ at 04:10 because a test was flaky."

| Slot | Value |
|------|-------|
| A | "is failing / fails" |
| B | **"fails / failed"** ✓ |
| C | "failed / fails" |
| D | "will fail / failed" |

**Key:** B

**Feedback:**
> The routine marker *every morning* takes present simple with **-s**, and the finished marker *yesterday* takes past simple with **-ed**: **`fails / failed`**. In **A**, *is failing* clashes with a daily routine; **C** swaps the two times; **D** puts a future form where a routine belongs.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_tenses_review_status_detail_001
skill: `reading.tenses_status_detail`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The team reviewed the patch with her."
    br_pt_form: "O time revisou o patch com ela."
    note: "the review is happening right now, not at 23:50"
  - option: "She shipped the release."
    br_pt_form: "Ela embarcou o release."
    note: "shipping is planned for Thursday, not finished last night"
  - option: "The build failed at 03:00."
    br_pt_form: "O build falhou às 03:00."
    note: "03:00 is the routine failure time, not the 23:50 action"
```

**Stimulus:**
> "Status — nightly build. The job fails at 03:00 every morning. Last night it failed at 04:10: a flaky test was blocking the queue. I traced it to a race condition and patched the test at 23:50. The team is reviewing the patch now. We are going to ship the release on Thursday."

**Item:**
> What did the engineer do at 23:50?

| Slot | Value |
|------|-------|
| A | The team reviewed the patch with her. |
| B | **She patched the flaky test.** ✓ |
| C | She shipped the release. |
| D | The build failed at 03:00. |

**Key:** B

**Feedback:**
> The past-simple line is explicit: **`I traced it to a race condition and patched the test at 23:50.`** **A** moves a present-continuous review into the past, **C** turns a *going to* plan into a finished release, and **D** reports the routine time instead of the 23:50 action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_tenses_review_time_marker_001
skill: `vocab.tenses.time_marker`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "now"
    br_pt_form: "agora"
    note: "'now' calls for present continuous, not past simple"
  - option: "every morning"
    br_pt_form: "toda manhã"
    note: "'every morning' is a routine marker and pairs with present simple"
  - option: "tomorrow"
    br_pt_form: "amanhã"
    note: "'tomorrow' points to a future form such as will or going to"
```

**Item:**
> In "I patched the test ___", which time marker makes the past simple the natural choice?

| Slot | Value |
|------|-------|
| A | now |
| B | every morning |
| C | tomorrow |
| D | **last night** ✓ |

**Key:** D

**Feedback:**
> **`Last night`** is a finished past marker, so *patched* is the right form. **A** (*now*) asks for *am patching*, **B** (*every morning*) for *patch*, and **C** (*tomorrow*) for *will patch* or *am going to patch*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_tenses_review_timeline_detail_001
skill: `reading.tenses_timeline_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The verification steps were written yesterday."
    br_pt_form: "Os passos de verificação foram escritos ontem."
    note: "the engineer is writing them right now, not yesterday"
  - option: "The deploy already happened on Friday."
    br_pt_form: "O deploy já aconteceu na sexta."
    note: "'are going to deploy' states a plan, not a finished event"
  - option: "The pipeline starts at 04:10 every day."
    br_pt_form: "O pipeline começa às 04:10 todos os dias."
    note: "the routine start is 03:00; 04:10 was yesterday's failure time"
```

**Stimulus:**
> "Routine: the pipeline starts at 03:00. Yesterday I fixed the flaky test and closed TICKET-42. Right now I am writing the verification steps. We are going to deploy on Friday; I will ping you when it is live."

**Item:**
> Which statement about the timeline is correct?

| Slot | Value |
|------|-------|
| A | The verification steps were written yesterday. |
| B | The deploy already happened on Friday. |
| C | **The engineer will ping after the deploy is live.** ✓ |
| D | The pipeline starts at 04:10 every day. |

**Key:** C

**Feedback:**
> The last line says **`I will ping you when it is live`** — the ping comes after the deploy. **A** misplaces a present-continuous action in yesterday, **B** reads a *going to* plan as completed, and **D** confuses the 03:00 routine with the 04:10 failure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_tenses_review_ship_sheep_001
skill: `pronunciation.tenses_ship_sheep`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *ship* /ʃɪp/ and *sheep* /ʃiːp/ form a minimal pair. The first vowel is short and relaxed (/ɪ/), the second is long and tense (/iː/). Brazilian Portuguese has no /ɪ/, so learners often read both as /i/. Compare also /θ/ in *Thursday* (no voice) with /ð/ in *the* (with voice).

**Step 2 — produce (ASR-scored):** read aloud:

> "We are going to ship the release on Thursday — ship code, not sheep."

**Target phonemes:** /ʃɪp/ in both *ship* (short /ɪ/, not the /iː/ of *sheep*) · /ʃiːp/ in *sheep* (long /iː/) · /iː/ in *release* · /θ/ in *Thursday* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_tenses_review_regular_ed_001
skill: `grammar.tenses.regular_ed`
type: `error_correction`
difficulty_b: -0.5
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_regular_verbs_past`
distractors:
  - option: "I trace the flaky test last night."
    br_pt_form: "Eu rastro o teste intermitente ontem à noite."
    note: "'last night' is finished time; present simple reports a routine instead"
  - option: "I am tracing the flaky test last night."
    br_pt_form: "Eu estou rastreando o teste intermitente ontem à noite."
    note: "present continuous cannot combine with a finished past marker"
  - option: "I will trace the flaky test last night."
    br_pt_form: "Eu vou rastrear o teste intermitente ontem à noite."
    note: "'will' predicts the future and conflicts with 'last night'"
```

**Item:**
> Reviewing regular past forms: which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I trace the flaky test last night." |
| B | **"I traced the flaky test last night."** ✓ |
| C | "I am tracing the flaky test last night." |
| D | "I will trace the flaky test last night." |

**Key:** B

**Feedback:**
> *Trace* is a regular verb, so a finished time takes **-ed**: **`I traced the flaky test last night.`** **A** keeps the present form, **C** uses continuous with a past marker, and **D** mixes a future form with *last night*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_tenses_review_auxiliary_001
skill: `vocab.tenses.auxiliary`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "Do the build fail at 03:00 every morning?"
    br_pt_form: "O build falha às 03:00 toda manhã?"
    note: "'the build' is singular, so the auxiliary must be 'does'"
  - option: "Does the build fails at 03:00 every morning?"
    br_pt_form: "O build falha às 03:00 toda manhã, com -s no verbo?"
    note: "after 'does' the main verb is bare; the -s stays only in statements"
  - option: "Is the build fail at 03:00 every morning?"
    br_pt_form: "O build está falhar às 03:00 toda manhã?"
    note: "'is' belongs to continuous forms; a routine question takes do or does"
```

**Item:**
> Reviewing present-simple questions: which line uses the right auxiliary?

| Slot | Value |
|------|-------|
| A | "Do the build fail at 03:00 every morning?" |
| B | "Does the build fails at 03:00 every morning?" |
| C | **"Does the build fail at 03:00 every morning?"** ✓ |
| D | "Is the build fail at 03:00 every morning?" |

**Key:** C

**Feedback:**
> A singular subject takes *does*, and the verb returns to its base form: **`Does the build fail at 03:00 every morning?`** **A** uses *do* with a singular subject, **B** leaves the **-s** after *does*, and **D** reaches for *is*, which belongs to the continuous.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `tense_marker_mapping` | Items 1 and 3 missed | **L2** | Drill *every morning / last night / now / tomorrow* against present simple, past simple, present continuous and will in short status lines. |
| `status_timeline_detail` | Items 2 and 4 missed | **L2** | Re-scan a five-line status note to separate a routine, a finished action, a plan (*going to*) and a promise (*will*). |
| `regular_ed_and_auxiliary` | Items 5, 6 and 7 missed | **L2** | Recycle *traced / patched*, *did you find…?* and *does the build fail…?* in one QA handover thread; keep the /ɪ/–/iː/ contrast in *ship/sheep*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_regular_verbs_past` (`past_simple_regular`) and `les_a1_present_simple` (`present_simple_regular`) — the two A1 lessons whose §4.3 rows introduce these prerequisite skills — and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The tense names and time markers are unprotectable linguistic knowledge, and all sentences were written for this pack.
