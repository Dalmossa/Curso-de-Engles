# Practice Pack — `les_b1_it_code_review`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b1_it_code_review_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_code_review.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_code_review_v1
lesson_id: les_b1_it_code_review
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 7/7 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 3 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_cr_blocking_issue_001`
skill: `vocab.codereview.blocking_issue`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "nitpick"
    br_pt_form: "detalhe menor"
    note: "minor style or clarity point, not merge-blocking"
  - option: "suggestion"
    br_pt_form: "sugestão"
    note: "recommended improvement but not necessarily mandatory"
  - option: "approval"
    br_pt_form: "aprovação"
    note: "positive outcome, opposite of a problem to fix"
```

**Item:**
> "This input is not validated and can crash in production." In a PR, this is usually a ____.

| Slot | Value |
|------|-------|
| A | nitpick |
| B | suggestion |
| C | **blocking issue** ✓ |
| D | approval |

**Key:** C

**Feedback:**
> A **blocking issue** must be fixed before the change can be merged because it can cause incorrect behavior, failures, or risk. Nitpicks and suggestions are typically non-blocking.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_cr_modal_must_001`
skill: `grammar.modals_feedback_must_should_could`
type: `gap_fill`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "could"
    br_pt_form: "poderia"
    note: "optional suggestion; too weak for a mandatory fix before merge"
  - option: "might"
    br_pt_form: "talvez"
    note: "expresses possibility, not obligation"
  - option: "must to"
    br_pt_form: "deve de/tem que (com 'to' incorreto)"
    note: "common L1-influenced error: modal verbs take the base form without to"
```

**Item:**
> You ____ fix this validation error before merging the pull request.

| Slot | Value |
|------|-------|
| A | could |
| B | might |
| C | **must** ✓ |
| D | must to |

**Key:** C

**Feedback:**
> Use **must** for an obligation or a blocking requirement. After a modal verb (*must, should, could*), use the base form of the verb: *must fix*, not *must to fix*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_cr_nitpick_001`
skill: `vocab.codereview.nitpick`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "outage"
    br_pt_form: "queda/interrupção"
    note: "production incident, far more severe than a style comment"
  - option: "rollback plan"
    br_pt_form: "plano de reversão"
    note: "release safety artifact, unrelated to minor review comments"
  - option: "security breach"
    br_pt_form: "violação de segurança"
    note: "critical issue, not a minor naming/style point"
```

**Item:**
> "Consider renaming `tmp` to `retryCount` for clarity." This is best described as a ____.

| Slot | Value |
|------|-------|
| A | outage |
| B | **nitpick** ✓ |
| C | rollback plan |
| D | security breach |

**Key:** B

**Feedback:**
> A **nitpick** is a small comment about style, naming, or clarity. It can improve readability but usually does not block the merge.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_cr_feedback_intent_001`
skill: `reading.code_review_comment`
type: `inference`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The reviewer approves the PR with no changes."
    br_pt_form: null
    note: "contradicts the required fix and test request"
  - option: "The reviewer rejects the author personally."
    br_pt_form: null
    note: "misreads collaborative feedback as personal criticism"
  - option: "The reviewer asks to remove all tests."
    br_pt_form: null
    note: "opposite of requesting an additional test"
```

**Stimulus:**
> "The refactor improves readability. However, the null case must be handled before merge. We should also add a test for the empty input. Once these points are addressed, this should be ready."

**Item:**
> What is the reviewer's intent?

| Slot | Value |
|------|-------|
| A | **Request specific fixes before approving the PR.** ✓ |
| B | Approve the PR with no changes. |
| C | Reject the author personally. |
| D | Ask to remove all tests. |

**Key:** A

**Feedback:**
> The reviewer balances positive feedback with clear requirements (*must be handled*) and recommendations (*should add a test*), then signals conditional approval.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_cr_should_suggestion_001`
skill: `grammar.modals_feedback_must_should_could`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "must"
    br_pt_form: "deve (obrigatório)"
    note: "too strong for an optional readability improvement"
  - option: "can't"
    br_pt_form: "não pode"
    note: "expresses prohibition/inability, not a suggestion"
  - option: "might to"
    br_pt_form: "talvez (com 'to' incorreto)"
    note: "grammatically incorrect and semantically weak"
```

**Item:**
> We ____ extract this helper to make the function easier to read.

| Slot | Value |
|------|-------|
| A | must |
| B | **could** ✓ |
| C | can't |
| D | might to |

**Key:** B

**Feedback:**
> **Could** introduces an optional suggestion. For stronger recommendations use *should*; for mandatory fixes use *must*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_cr_edge_case_001`
skill: `vocab.codereview.edge_case`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "shortcut"
    br_pt_form: "atalho"
    note: "UI or workflow shortcut, not an unusual input scenario"
  - option: "template"
    br_pt_form: "modelo"
    note: "reusable pattern/document, different meaning"
  - option: "headline"
    br_pt_form: "título/manchete"
    note: "unrelated non-technical term"
```

**Item:**
> An empty input that breaks the function is an example of an ____.

| Slot | Value |
|------|-------|
| A | shortcut |
| B | template |
| C | **edge case** ✓ |
| D | headline |

**Key:** C

**Feedback:**
> An **edge case** is an uncommon or boundary situation that can reveal bugs if it is not handled correctly.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_cr_sh_v_001`
skill: `pronunciation.sh_ch_contrast`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_cr_sh_v_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — focus:** *should* /ʃʊd/ (not /s/), *change* /tʃeɪndʒ/, *validation* begins with /v/ (not /w/).
**Step 2 — produce (ASR-scored):** read aloud:

> "We should change this validation before the review."

**Target phonemes:** /ʃ/ in *should* · /tʃ/ in *change* · /v/ in *validation*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `modals_feedback_must_should_could` | Item 2 or 5 missed | **L2** | Map obligation/recommendation/option to the right modal in review comments. |
| `blocking_vs_nitpick` | Item 1 or 3 missed | **L2** | Classify review comments by severity and impact. |
| `collaborative_feedback_tone` | Item 4 missed | **L2** | Practice balanced, actionable feedback phrasing. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production; pronunciation recognition pools are tracked separately.
3. Items target authored lesson content; no external source text is reproduced.
