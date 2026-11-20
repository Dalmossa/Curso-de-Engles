# Practice Pack — `les_b1_project_integrated_review`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_project_integrated_review_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_project_integrated_review.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_integrated_review_v1
lesson_id: les_b1_project_integrated_review
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
item_id: grm_project_integrated_review_001
skill: `grammar.review_passive_voice`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The draft revised after the feedback was shared."
    br_pt_form: "O rascunho revisou depois que o feedback foi compartilhado."
    note: "a transitive verb needs a form of be in the passive; the draft does not revise itself"
  - option: "The draft was revise after the feedback was shared."
    br_pt_form: "O rascunho foi revisar depois que o feedback foi compartilhado."
    note: "the passive requires a past participle, not a bare infinitive"
  - option: "The draft has revised after the feedback was shared."
    br_pt_form: "O rascunho tem revisado depois que o feedback foi compartilhado."
    note: "the active perfect makes the draft the agent; the review process is the agent here"
```

**Item:**
> You are reporting the review process in a handoff note. Which line is correct?

| Slot | Value |
|------|-------|
| A | "The draft revised after the feedback was shared." |
| B | **"The draft was revised after the feedback was shared."** ✓ |
| C | "The draft was revise after the feedback was shared." |
| D | "The draft has revised after the feedback was shared." |

**Key:** B

**Feedback:**
> The process uses the passive: **`The draft was revised after the feedback was shared.`** **A** drops the auxiliary *be*, **C** uses the bare verb instead of the past participle, and **D** turns the draft into the agent of an active perfect.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_project_integrated_review_evidence_001
skill: `reading.project_review_dialogue`
type: `detail_identification`
difficulty_b: -0.3
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The rubric does not cover item three."
    br_pt_form: "A rubrica não cobre o item três."
    note: "Marina says the rubric rewards evidence; it does not exclude the item"
  - option: "The product owner rejected the draft."
    br_pt_form: "O product owner rejeitou o rascunho."
    note: "the product owner only asks for one more pass on the risk note"
  - option: "It was cut from the checklist."
    br_pt_form: "Ele foi cortado do checklist."
    note: "item three remains on a five-item checklist; nothing is removed"
```

**Stimulus:**
> "Marina: Let's start with the integrated review: read the brief, check the evidence, then walk through the draft. Alex: I read it twice. The checklist has five items, but item three has no evidence attached. Marina: Good catch. Add the link to the test run — the rubric gives credit for evidence, not for good intentions."

**Item:**
> Why is item three not ready for the review?

| Slot | Value |
|------|-------|
| A | The rubric does not cover item three. |
| B | The product owner rejected the draft. |
| C | **It has no evidence attached.** ✓ |
| D | It was cut from the checklist. |

**Key:** C

**Feedback:**
> Alex says it directly: **item three has no evidence attached**. **A** misreads the rubric as an exclusion, **B** turns a request for another pass into a rejection, and **D** invents a cut from a checklist that still has five items.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_project_integrated_review_rubric_001
skill: `vocab.project_review_rubric`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "checklist"
    br_pt_form: "checklist / lista de verificação"
    note: "a checklist lists items to verify; it does not assign credit"
  - option: "feedback loop"
    br_pt_form: "ciclo de feedback"
    note: "the feedback loop is the exchange of comments, not the scoring guide"
  - option: "draft"
    br_pt_form: "rascunho"
    note: "a draft is the document being scored, not the criteria used to score it"
```

**Item:**
> Which word names the scoring guide that gives credit for evidence? "Score the draft against the ___."

| Slot | Value |
|------|-------|
| A | checklist |
| B | feedback loop |
| C | draft |
| D | **rubric** ✓ |

**Key:** D

**Feedback:**
> **Rubric** is the set of criteria used to score work: **`Score the draft against the rubric.`** **A** is the list of items, **B** is the round of comments, and **C** is the text being evaluated.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_project_integrated_review_note_001
skill: `reading.project_review_note`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The test-run link is attached to item three."
    br_pt_form: "O link do teste está anexado ao item três."
    note: "the note asks for the link to be attached; it does not confirm the attachment"
  - option: "The product owner has signed off the risk note."
    br_pt_form: "O product owner já aprovou a nota de risco."
    note: "sign-off stays open, so it cannot already be done"
  - option: "A second pass on the risk note is finished."
    br_pt_form: "A segunda leitura da nota de risco está concluída."
    note: "the second pass is still wanted, not completed"
```

**Stimulus:**
> "Review note — Integrated project check. The draft is clear and the checklist has five items. Item three still has no evidence: attach the test-run link before we apply the rubric. Your revision is fine; the feedback loop is closed on that section. Sign-off stays open until the risk note gets one more pass from the product owner. — Marina"

**Item:**
> According to the note, what is already done?

| Slot | Value |
|------|-------|
| A | **The feedback loop on that section is closed.** ✓ |
| B | The test-run link is attached to item three. |
| C | The product owner has signed off the risk note. |
| D | A second pass on the risk note is finished. |

**Key:** A

**Feedback:**
> The note states **the feedback loop is closed on that section**. **B** is still a request, **C** contradicts the open sign-off, and **D** describes a pass that has not happened yet.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_project_integrated_review_phonemes_001
skill: `pronunciation.project_review_dentals_vowels`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_project_integrated_review_phonemes_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *the* begins with the voiced /ð/, while *three* begins with the voiceless /θ/ — same place between the teeth, different voicing. *Gives* and *evidence* carry /v/, lower lip against upper teeth, not /w/. *Rubric* has the long /uː/ and a released final /k/ with no extra vowel; *sign* in *sign-off* has /aɪ/ and a silent *g*.

**Step 2 — produce (ASR-scored):** read aloud:

> "The rubric gives credit for evidence; attach the test-run link to item three and ask for sign-off."

**Target phonemes:** /ð/ in *the* · /uː/ and final /k/ in *rubric* · /v/ in *gives* and *evidence* · /æ/ in *attach* · /θ/ in *three* · /aɪ/ in *sign* · /f/ in *off*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_project_integrated_review_questions_001
skill: `grammar.hedging`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_question_forms`
distractors:
  - option: "Could you tell me where is the evidence, please?"
    br_pt_form: "Você poderia me dizer onde está a evidência, por favor?"
    note: "an embedded question keeps statement order; the verb must follow the subject"
  - option: "Could you tell me where does the evidence go, please?"
    br_pt_form: "Você poderia me dizer onde a evidência vai, com 'does', por favor?"
    note: "do-support belongs in a direct question, not after 'tell me'"
  - option: "Could you to tell me where the evidence is, please?"
    br_pt_form: "Você pode para me dizer onde a evidência está, por favor?"
    note: "a modal is followed by the bare verb, never by 'to'"
```

**Item:**
> Reviewing advanced question forms: which line asks politely for the location of the evidence **inside** a statement?

| Slot | Value |
|------|-------|
| A | "Could you tell me where is the evidence, please?" |
| B | **"Could you tell me where the evidence is, please?"** ✓ |
| C | "Could you tell me where does the evidence go, please?" |
| D | "Could you to tell me where the evidence is, please?" |

**Key:** B

**Feedback:**
> A softened embedded question keeps statement order: **`Could you tell me where the evidence is, please?`** **A** inverts the verb, **C** carries *do*-support from a direct question, and **D** puts *to* after the modal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_project_integrated_review_terms_001
skill: `vocab.it_computer_terms_review`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "rubric"
    br_pt_form: "rubrica / critério de avaliação"
    note: "a rubric scores the work; it is not the recorded output of a test run"
  - option: "sign-off"
    br_pt_form: "aprovação formal"
    note: "sign-off is the approval, not the file you attach as proof"
  - option: "draft"
    br_pt_form: "rascunho"
    note: "a draft is the version of the text, not a record generated by a test"
```

**Item:**
> Reviewing core IT terms: what do you call the recorded output of a test run that you attach as evidence?

| Slot | Value |
|------|-------|
| A | rubric |
| B | sign-off |
| C | **log** ✓ |
| D | draft |

**Key:** C

**Feedback:**
> A **log** is the record produced by a test run and attached as evidence. **A** is the scoring guide, **B** is the approval that comes later, and **D** is the document being reviewed.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `review_passive_process` | Item 1 missed | **L2** | Contrast *the draft revised / was revised / was revise / has revised* in short handoff notes about a review process. |
| `review_evidence_reading` | Items 2 and 4 missed | **L2** | Separate *requested*, *closed* and *still open* in a five-line review note; keep *evidence attached* distinct from *sign-off granted*. |
| `review_glossary_recycle` | Items 3, 5 and 7 missed | **L2** | Recycle *checklist / rubric / revision / feedback loop / sign-off / log* in one rewrite, then rehearse /ð/, /θ/, /v/, /uː/ and final /k/ aloud with recast only. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration, and its Gates stay marked accordingly.
3. Items 6 and 7 review `les_b1_question_forms` (`hedging`) and `les_a2_it_terms_basics` (`it_computer_terms`), both real ids in §4.3; each carries `prereq_lesson` for the interleaving rule.
4. The lesson itself is excluded from `prereq_lessons`; §4.3 declares `all_skills` as both the new skill and the prereq skill for this row, an intentional structural auto-loop, not a self-reference by lesson id.
5. Items 1–5 target authored lesson content; every stimulus, option, gloss and note is original, with no restricted source text reproduced or adapted.
6. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
7. Every `item_id` carries the distinctive `project_integrated_review` token, is written without backticks, and appears once in the pack; `skill` and `type` keep the backticks required by the pack contract.
8. Within each MCQ, the four options and their glosses stay distinct after stripping `*✓⚠️❌_`, trimming and lowercasing — no pair differs by case alone.
9. Distractors follow the A–D table order with the keyed option removed, so the letter in `**Key:**` always matches the ✓ row.
