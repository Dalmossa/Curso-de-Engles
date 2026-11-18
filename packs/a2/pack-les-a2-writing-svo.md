# Practice Pack — `les_a2_writing_svo`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_writing_svo_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_writing_svo.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_writing_svo_v1
lesson_id: les_a2_writing_svo
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
item_id: grm_writing_svo_subject_001
skill: `grammar.explicit_subject`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Is necessary to update the config."
    br_pt_form: "É necessário atualizar a config."
    note: "the Portuguese impersonal 'é necessário' has no subject; a finite English clause needs one"
  - option: "Needs to update the config."
    br_pt_form: "Precisa atualizar a config."
    note: "Portuguese drops the subject; 'needs' has no subject here and the sentence is not finite"
  - option: "The config need an update."
    br_pt_form: "A config precisa de uma atualização."
    note: "with the thing as subject, the third-person verb still takes the -s ending"
```

**Item:**
> You are writing the first line of a PR description in English. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Is necessary to update the config." |
| B | **"We need to update the config."** ✓ |
| C | "Needs to update the config." |
| D | "The config need an update." |

**Key:** B

**Feedback:**
> *We need to update the config.* puts an explicit subject before the verb. **A** carries the Portuguese impersonal construction into English, **C** leaves *needs* without a subject, and **D** misses the third-person *-s* on *need*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_writing_svo_report_001
skill: `reading.writing_report`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "It added the stack trace."
    br_pt_form: "Ele adicionou o stack trace."
    note: "the writer added the trace; the service is not the subject of that action"
  - option: "It reproduced the failure."
    br_pt_form: "Ele reproduziu a falha."
    note: "we reproduced the failure, not the service; the SVO subject gets swapped for a salient noun"
  - option: "It attached the log."
    br_pt_form: "Ele anexou o log."
    note: "the writer attached the log; the service is not the agent in the note"
```

**Stimulus:**
> "PR note — I updated the ticket and copied the error code. The service dropped two events during the release. We reproduced the failure with the same request. I added the stack trace and attached the log. The reviewer asked for one more detail before the standup."

**Item:**
> What did the service do during the release?

| Slot | Value |
|------|-------|
| A | "It added the stack trace." |
| B | **"It dropped two events."** ✓ |
| C | "It reproduced the failure." |
| D | "It attached the log." |

**Key:** B

**Feedback:**
> The note says **`The service dropped two events during the release.`** **A** and **D** are actions by the writer, while **C** assigns to the service an action performed by *we*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_writing_svo_chunks_001
skill: `vocab.writing_svo_chunks`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Is necessary to update the config."
    br_pt_form: "É necessário atualizar a config."
    note: "calque of the Portuguese impersonal; English needs a subject before the verb"
  - option: "Very important this bug in production."
    br_pt_form: "Muito importante esse bug em produção."
    note: "the Portuguese adjective-first pattern lacks both subject and copula in English"
  - option: "We discussed about the fix."
    br_pt_form: "Discutimos sobre a correção."
    note: "'discutir sobre' maps onto 'discuss about'; the English verb takes a direct object"
```

**Item:**
> Which line for a PR description uses natural en-US chunks for a Brazilian writer?

| Slot | Value |
|------|-------|
| A | "Is necessary to update the config." |
| B | "Very important this bug in production." |
| C | "We discussed about the fix." |
| D | **"We need to update the config."** ✓ |

**Key:** D

**Feedback:**
> *We need to* is the natural chunk for the Portuguese impersonal "é necessário". **A** omits the subject, **B** has no finite verb, and **C** adds *about* after *discuss*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_writing_svo_tense_001
skill: `reading.writing_tense_keys`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "I copied the error code."
    br_pt_form: "Eu copiei o código de erro."
    note: "the -ed ending anchors this action before the note; it is not a future marker"
  - option: "The service dropped two events."
    br_pt_form: "O serviço descartou dois eventos."
    note: "past action; readers often miss the -ed and take it as the plan"
  - option: "The reviewer asked for a detail."
    br_pt_form: "O revisor pediu um detalhe."
    note: "another completed action; 'asked' is past even though the detail is still pending"
```

**Stimulus:**
> "Revision note — I opened the ticket and copied the error code. The service dropped two events. I added the log. Tomorrow I will update the config and send the summary. The reviewer asked for one more detail today."

**Item:**
> Which action is still in the future when the note is written?

| Slot | Value |
|------|-------|
| A | "I copied the error code." |
| B | "The service dropped two events." |
| C | "The reviewer asked for a detail." |
| D | **"I will update the config."** ✓ |

**Key:** D

**Feedback:**
> *Tomorrow I will update the config* is the only future action. **A**, **B** and **C** all use the past simple and are already done when the note is written.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_writing_svo_ed_001
skill: `pronunciation.writing_svo_ed`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *opened* ends in /d/, while *asked* ends in /t/. Both spell the regular past as *-ed*, but the sound follows the last consonant of the stem: voiced after a voiced sound, voiceless after a voiceless one. Brazilian readers tend to pronounce both as a full extra syllable. In *the* /ðə/, the dental /ð/ is voiced and often becomes /d/ in pt-BR.
**Step 2 — produce (ASR-scored):** read aloud:

> "I opened the ticket and asked the reviewer for the log."

**Target phonemes:** /d/ in *opened* · /t/ in *asked* · /ð/ in *the* · /r/ in *reviewer*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_writing_svo_present_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.5
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The reviewer comment on every pull request."
    br_pt_form: "O revisor comenta em todo pull request."
    note: "Portuguese marks no third-person -s, so the English verb ending disappears"
  - option: "The reviewer is comment on every pull request."
    br_pt_form: "O revisor está comentando em todo pull request."
    note: "'está comentando' maps onto 'is comment'; a recurring habit takes the simple present"
  - option: "The reviewer commenting on every pull request."
    br_pt_form: "O revisor comentando em todo pull request."
    note: "the gerund 'comentando' maps onto -ing, but a bare -ing form is not finite"
```

**Item:**
> Reviewing the present simple before you describe a recurring review habit, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The reviewer comment on every pull request." |
| B | **"The reviewer comments on every pull request."** ✓ |
| C | "The reviewer is comment on every pull request." |
| D | "The reviewer commenting on every pull request." |

**Key:** B

**Feedback:**
> A recurring fact takes the present simple with the third-person *-s*: **`The reviewer comments on every pull request.`** **A** drops the *-s*, **C** inserts *is* before the bare verb, and **D** leaves a gerund with no auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_writing_svo_articles_001
skill: `vocab.articles_nouns`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_articles_nouns
distractors:
  - option: "I attached a logs to the ticket."
    br_pt_form: "Eu anexei os logs ao ticket."
    note: "'a' cannot combine with a plural noun; 'logs' needs no article here"
  - option: "I attached log to the ticket."
    br_pt_form: "Eu anexei log ao ticket."
    note: "a countable singular noun needs an article; Portuguese permits the bare noun"
  - option: "I attached the log to ticket."
    br_pt_form: "Eu anexei o log ao ticket."
    note: "'ticket' is countable and takes 'the' when writer and reviewer know which one it is"
```

**Item:**
> Reviewing articles and plurals, which sentence correctly describes the files you attached to the ticket?

| Slot | Value |
|------|-------|
| A | "I attached a logs to the ticket." |
| B | "I attached log to the ticket." |
| C | **"I attached the logs to the ticket."** ✓ |
| D | "I attached the log to ticket." |

**Key:** C

**Feedback:**
> **`I attached the logs to the ticket.`** uses the definite article with a known plural noun. **A** combines *a* with a plural, **B** leaves a singular countable noun bare, and **D** drops the article before *ticket*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `explicit_subject_repair` | Item 1 or 3 missed | **L2** | Rebuild *We need to update the config* against *Is necessary...*, *Needs to...* and *Very important this bug...*. |
| `svo_report_reading` | Items 2 and 4 missed | **L2** | Track who does what in short PR notes before asking for the agent or the tense marker. |
| `present_simple_review` | Item 6 or 7 missed | **L2** | Drill third-person *-s* and articles/plurals in routine review sentences about tickets and logs. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a1_articles_nouns` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
