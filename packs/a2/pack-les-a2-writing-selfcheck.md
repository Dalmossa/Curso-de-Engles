# Practice Pack — `les_a2_writing_selfcheck`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_writing_selfcheck_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_writing_selfcheck.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_writing_selfcheck_v1
lesson_id: les_a2_writing_selfcheck
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
item_id: grm_selfcheck_connectors_001
skill: `grammar.writing_connectors_contrast`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "However, the build failed."
    br_pt_form: "No entanto, o build falhou."
    note: "however marks a contrast; it cannot introduce the result of a failed build"
  - option: "Besides, we stopped the deploy."
    br_pt_form: "Além disso, paramos o deploy."
    note: "besides adds an extra idea, so the logical consequence disappears"
  - option: "The build failed. In addition, we stopped the deploy."
    br_pt_form: "O build falhou. Além disso, paramos o deploy."
    note: "in addition also adds information; it does not link cause to effect"
```

**Item:**
> You are revising a PR description. The build failed and you want to show the logical result. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "However, the build failed." |
| B | **"The build failed. Therefore, we stopped the deploy."** ✓ |
| C | "Besides, we stopped the deploy." |
| D | "The build failed. In addition, we stopped the deploy." |

**Key:** B

**Feedback:**
> *Therefore* links the failed build to the action that follows: **`The build failed. Therefore, we stopped the deploy.`** **A** signals contrast with *However*, **C** uses *Besides* for an extra idea, and **D** treats the consequence as an additional fact with *In addition*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_selfcheck_note_changes_001
skill: `reading.selfcheck_revision_note`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Changed 'update' to 'updated'."
    br_pt_form: "Mudou 'update' para 'updated'."
    note: "that change fixes the tense, not the missing subject"
  - option: "Published the final version after the standup."
    br_pt_form: "Publicou a versão final depois do standup."
    note: "publishing is the last step of the note, not the subject repair"
  - option: "Wrote the draft on Monday."
    br_pt_form: "Escreveu o rascunho na segunda-feira."
    note: "writing the draft is the starting point, before any revision happened"
```

**Stimulus:**
> "Revision note — I wrote the draft on Monday. However, two sentences had no subject, so I added *we* and *the service*. I also changed 'update' to 'updated' because the test ran yesterday. Therefore, I published the final version after the standup."

**Item:**
> What did the writer change because of the missing subject?

| Slot | Value |
|------|-------|
| A | "Changed 'update' to 'updated'." |
| B | "Published the final version after the standup." |
| C | **"Added *we* and *the service*."** ✓ |
| D | "Wrote the draft on Monday." |

**Key:** C

**Feedback:**
> The note says *two sentences had no subject, so I added **we** and **the service***. **A** belongs to the tense fix, **B** is the final step after the standup, and **D** happened before the revision started.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_selfcheck_connectors_001
skill: `vocab.selfcheck_connectors`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "However, the file is large."
    br_pt_form: "No entanto, o arquivo é grande."
    note: "however introduces a contrast, not one more reason"
  - option: "Therefore, the file is large."
    br_pt_form: "Portanto, o arquivo é grande."
    note: "therefore states a conclusion; no previous fact makes this a conclusion"
  - option: "As a result, the file is large."
    br_pt_form: "Como resultado, o arquivo é grande."
    note: "as a result reports an outcome, not an additional point"
```

**Item:**
> You already gave one reason in a PR description and want to add another. Which sentence fits?

| Slot | Value |
|------|-------|
| A | "However, the file is large." |
| B | "Therefore, the file is large." |
| C | **"In addition, the file is large."** ✓ |
| D | "As a result, the file is large." |

**Key:** C

**Feedback:**
> To add another idea, use **`In addition, the file is large.`** **A** sets up a contrast, **B** draws a conclusion, and **D** announces an outcome that the sentence does not have.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_selfcheck_connector_function_001
skill: `reading.selfcheck_connector_function`
type: `detail_identification`
difficulty_b: 0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "A contrast with the subject change."
    br_pt_form: "Um contraste com a mudança de sujeito."
    note: "however carries the contrast in the first sentence, not therefore"
  - option: "An extra idea about the draft."
    br_pt_form: "Uma ideia extra sobre o rascunho."
    note: "besides or in addition would add information; therefore does not"
  - option: "The reason the writer wrote the draft."
    br_pt_form: "O motivo pelo qual o autor escreveu o rascunho."
    note: "the draft was written before the connector; therefore introduces a later action"
```

**Stimulus:**
> "I changed the subject in two lines. However, the tense was still wrong. Therefore, I corrected 'update' to 'updated' before I sent the note."

**Item:**
> What does *Therefore* introduce in the revision note?

| Slot | Value |
|------|-------|
| A | "A contrast with the subject change." |
| B | "An extra idea about the draft." |
| C | **"The action taken after finding the tense error."** ✓ |
| D | "The reason the writer wrote the draft." |

**Key:** C

**Feedback:**
> *Therefore* introduces the consequence of the tense problem: **`I corrected 'update' to 'updated'`**. **A** describes *However*, **B** describes an additive connector, and **D** points to a moment before the note was revised.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_selfcheck_review_vw_001
skill: `pronunciation.selfcheck_review_v_w`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_selfcheck_review_vw_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *review* /rɪˈvju/ and *version* /ˈvɜrʒən/ begin with /v/: upper teeth touch the lower lip, with voicing on. *work* /wɜrk/ begins with /w/: lips are rounded and the teeth do not touch. A Brazilian /w/ in *review* makes the word sound like *wiew*. In *the* /ðə/, the tongue goes between the teeth; pt-BR often turns /ð/ into /d/.
**Step 2 — produce (ASR-scored):** read aloud:

> "I will review the final version before I update the work doc."

**Target phonemes:** /v/ in *review, version* · /w/ in *work* · /ð/ in *the* · /d/ in *updated* context.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_selfcheck_svo_articles_001
skill: `grammar.selfcheck_svo_articles`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_writing_svo
distractors:
  - option: "Is necessary update the config."
    br_pt_form: "É necessário atualizar a config."
    note: "the Portuguese impersonal has no subject and the English phrase needs a finite verb"
  - option: "The config need an update."
    br_pt_form: "A config precisa de uma atualização."
    note: "with the config as subject, the third-person verb needs the -s ending"
  - option: "Needs to update the config."
    br_pt_form: "Precisa atualizar a config."
    note: "Portuguese drops the subject; 'needs' has none here, so the clause is not finite"
```

**Item:**
> Before publishing the note, you revise a line from the earlier writing practice. Which version is correct?

| Slot | Value |
|------|-------|
| A | "Is necessary update the config." |
| B | "The config need an update." |
| C | **"We need to update the config."** ✓ |
| D | "Needs to update the config." |

**Key:** C

**Feedback:**
> **`We need to update the config.`** keeps an explicit subject before the verb. **A** carries the Portuguese impersonal into English, **B** drops the third-person *-s*, and **D** leaves *needs* without a subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_selfcheck_time_expressions_001
skill: `vocab.selfcheck_time_expressions`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_writing_past
distractors:
  - option: "tomorrow"
    br_pt_form: "amanhã"
    note: "tomorrow points to the future and pairs with 'will', not with the past simple"
  - option: "now"
    br_pt_form: "agora"
    note: "now points to the present moment, so it cannot anchor a past sentence"
  - option: "every day"
    br_pt_form: "todo dia"
    note: "a routine takes the present simple, not the past simple"
```

**Item:**
> Reviewing the past narrative before you check a revision note, which time expression anchors the past simple here?

| Slot | Value |
|------|-------|
| A | "tomorrow" |
| B | "now" |
| C | **"yesterday"** ✓ |
| D | "every day" |

**Key:** C

**Feedback:**
> **`Yesterday`** anchors a completed action, as in *I updated the config yesterday*. **A** requires *will*, **B** belongs to the present, and **D** describes a habit in the present simple.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `connector_function_review` | Item 1 or 3 missed | **L2** | Sort *however*, *therefore*, *besides*, *in addition* and *as a result* by contrast, conclusion and addition before revising a PR description. |
| `revision_note_reading` | Item 2 or 4 missed | **L2** | Track which edit follows which problem in a short revision note before answering detail questions. |
| `svo_tense_checklist` | Item 6 or 7 missed | **L2** | Rebuild subject, article, plural and time markers in the same six-line checklist used in the lesson. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_writing_svo` and `les_a2_writing_past` and carry `prereq_lesson` for the interleaving rule.
4. Items 1–4 and the pronunciation cue target authored lesson content; no external source text is reproduced.
