# Practice Pack — `les_b2_exam_simulations`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_exam_simulations_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_exam_simulations.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_exam_simulations_v1
lesson_id: les_b2_exam_simulations
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
item_id: grm_exam_simulations_review_pass_001
skill: `grammar.past_perfect_review_pass`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "By the time the timer ran out, I finish the writing task."
    br_pt_form: "Quando o cronômetro acabou, eu termino a tarefa de escrita."
    note: "a present tense cannot report an action completed before a past moment"
  - option: "By the time the timer ran out, I have finished the writing task."
    br_pt_form: "Quando o cronômetro acabou, eu tenho terminado a tarefa de escrita."
    note: "present perfect does not pair with a finished past reference point"
  - option: "By the time the timer ran out, I was finish the writing task."
    br_pt_form: "Quando o cronômetro acabou, eu estava terminar a tarefa de escrita."
    note: "the auxiliary was needs a present participle, not the bare verb"
```

**Item:**
> You are writing a debrief of a mock test. Which line reports what was already done before the timer ended?

| Slot | Value |
|------|-------|
| A | "By the time the timer ran out, I finish the writing task." |
| B | **"By the time the timer ran out, I had finished the writing task."** ✓ |
| C | "By the time the timer ran out, I have finished the writing task." |
| D | "By the time the timer ran out, I was finish the writing task." |

**Key:** B

**Feedback:**
> **B** uses *had finished* for the action completed before the past reference point. **A** puts a present tense in a past frame, **C** pairs present perfect with a closed past moment, and **D** follows *was* with the bare verb instead of a participle.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_exam_simulations_mock_schedule_001
skill: `reading.3levels`
type: `main_idea_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Candidates must bring their own timer to the writing section."
    br_pt_form: "Os candidatos precisam levar seu próprio cronômetro para a seção de escrita."
    note: "the briefing sets a timetable but never asks candidates to bring equipment"
  - option: "The score report is handed out before the break."
    br_pt_form: "O relatório de notas é entregue antes da pausa."
    note: "the report is released the next working day, not during the session"
  - option: "The reading section is longer than the writing section."
    br_pt_form: "A seção de leitura é mais longa que a seção de escrita."
    note: "the figures say the opposite: 25 minutes of reading against 30 of writing"
```

**Stimulus:**
> "Candidate briefing — Northwind Certification Centre. The practice session has two timed sections: reading, 25 minutes, and writing, 30 minutes, with a five-minute break between them. A score report is released the next working day and lists results by skill. Candidates may book one review pass with an invigilator before leaving the room."

**Item:**
> Which sentence states the main idea of the briefing?

| Slot | Value |
|------|-------|
| A | "Candidates must bring their own timer to the writing section." |
| B | "The score report is handed out before the break." |
| C | **"The session runs on a fixed timetable and reports results by skill."** ✓ |
| D | "The reading section is longer than the writing section." |

**Key:** C

**Feedback:**
> **C** covers the whole briefing: a set timetable and a skill-based report. **A** invents a rule about equipment, **B** moves the report to before the break even though it comes the next working day, and **D** reverses the two section lengths.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_exam_simulations_pacing_001
skill: `vocab.exam.pacing`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "elimination"
    br_pt_form: "eliminação"
    note: "elimination removes wrong options; it does not distribute the available time"
  - option: "verdict"
    br_pt_form: "veredito"
    note: "a verdict is a final judgement, not a time-planning skill"
  - option: "transcript"
    br_pt_form: "transcrição"
    note: "a transcript is a written record of speech, unrelated to time control"
```

**Item:**
> You have ten items and twelve minutes left. Which word names the skill of spreading your time evenly across them?

| Slot | Value |
|------|-------|
| A | "elimination" |
| B | **"pacing"** ✓ |
| C | "verdict" |
| D | "transcript" |

**Key:** B

**Feedback:**
> **B** is *pacing*: controlling how much time each part gets. **A** is about crossing out options, **C** is a final judgement, and **D** is a written record of speech; none of them describes an even distribution of minutes.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_exam_simulations_score_report_001
skill: `reading.3levels`
type: `detail_identification`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Repeat the reading section because it scored 82."
    br_pt_form: "Refazer a seção de leitura porque tirou 82."
    note: "the report explicitly says no action is needed for reading"
  - option: "Rewrite the argument, which the marker called unclear."
    br_pt_form: "Reescrever o argumento, que o avaliador chamou de confuso."
    note: "the marker says the argument is clear; the problem is the register"
  - option: "Book another full mock test before studying."
    br_pt_form: "Agendar outro teste completo antes de estudar."
    note: "the report recommends a study block, not another test"
```

**Stimulus:**
> "Score report — practice session, candidate 4471. Reading: 82. Writing: 61. The writing marker notes: 'The argument is clear, but the email register is too informal for a client.' Recommended next block: formal email practice. No action needed for reading."

**Item:**
> According to the report, what should the candidate do next?

| Slot | Value |
|------|-------|
| A | "Repeat the reading section because it scored 82." |
| B | "Rewrite the argument, which the marker called unclear." |
| C | "Book another full mock test before studying." |
| D | **"Practise the formal email register before the next test."** ✓ |

**Key:** D

**Feedback:**
> **D** matches the recommended block: formal email practice. **A** contradicts *no action needed for reading*, **B** reverses the marker's comment about the argument, and **C** swaps the recommended study block for another test.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_exam_simulations_section_drill_001
skill: `pronunciation.exam_section_drill`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_exam_simulations_section_drill_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *guess* and *section* carry the short lax /e/, while *make* and *rate* carry the glide /eɪ/; Brazilian learners often flatten both into one pt-BR /e/. In *review*, the /v/ needs the lower lip on the upper teeth, not the rounded /w/, and the final /k/ of *make* must not gain an extra /i/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Use elimination to cross out two options before you make a guess. Track your guess rate so the score report tells you what to review."

**Target phonemes:** /e/ in *guess, section* · /eɪ/ in *make, rate* · /v/ in *review* · /k/ final in *make*, without epenthetic /i/ · /ɔː/ in *report* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_exam_simulations_hedging_001
skill: `grammar.hedging_register`
type: `error_correction`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_b2_register_nuance`
distractors:
  - option: "Give me my score report now."
    br_pt_form: "Me dê o relatório de notas agora."
    note: "a bare imperative is too blunt for a request to staff you do not know"
  - option: "I want that you send the score report."
    br_pt_form: "Eu quero que você envie o relatório de notas."
    note: "the phrase with want that is an L1 calque; English uses a modal request here"
  - option: "Maybe you can to send the score report?"
    br_pt_form: "Talvez você possa para enviar o relatório de notas?"
    note: "a modal takes the bare verb, so can to is ungrammatical"
```

**Item:**
> Reviewing register and nuance: which line is a suitably hedged request to an invigilator about a score report?

| Slot | Value |
|------|-------|
| A | "Give me my score report now." |
| B | "I want that you send the score report." |
| C | **"Could you possibly let me know when the score report will be available?"** ✓ |
| D | "Maybe you can to send the score report?" |

**Key:** C

**Feedback:**
> **C** uses a modal plus *possibly* and asks about availability, which keeps the register polite. **A** is a blunt imperative, **B** transfers the Portuguese *quero que* structure into English, and **D** breaks the modal rule by inserting *to* after *can*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_exam_simulations_time_budget_001
skill: `vocab.toeic.time_budget`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_b2_toeic_reading`
distractors:
  - option: "a guess rate"
    br_pt_form: "uma taxa de chutes"
    note: "guess rate counts uncertain answers, not planned minutes"
  - option: "a score report"
    br_pt_form: "um relatório de notas"
    note: "the score report is issued after the test, not written before it"
  - option: "a review pass"
    br_pt_form: "uma passada de revisão"
    note: "the review pass is the final check itself, not the minute-by-minute plan"
```

**Item:**
> Reviewing exam vocabulary: you write "25 min reading / 30 min writing / 3 min review" at the top of your sheet. What is that plan called?

| Slot | Value |
|------|-------|
| A | "a guess rate" |
| B | "a score report" |
| C | **"a time budget"** ✓ |
| D | "a review pass" |

**Key:** C

**Feedback:**
> **C** is a *time budget*: the minutes assigned to each block before you start. **A** counts uncertain answers, **B** is the document you receive after the test, and **D** is the final check, not the plan that allocates the minutes.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `exam_retrospect_tense` | Items 1 and 6 missed | **L2** | Contrast *had finished / have taken / could you possibly* in short exam-debrief sentences with an explicit time reference and a polite register. |
| `exam_strategy_vocab` | Items 3 and 7 missed | **L2** | Recycle *time budget, pacing, elimination, guess rate, score report* in one fictional candidate briefing; contrast *pacing* with *rhythm*. |
| `score_report_reading` | Items 2 and 4 missed | **L2** | Drill gist versus detail on short fictional score reports with skill-by-skill lines; reject options that reverse stated figures or comments. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration, so the manifest keeps `listening_items: 0` with the ⚠️ deferred marker.
3. Items 6 and 7 review `les_b2_register_nuance` and `les_b2_toeic_reading` respectively and carry `prereq_lesson` for the interleaving rule; both ids are verified in `curriculum-graph-spec.md` §4.3.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every briefing, report, statement, option, gloss and note in this pack is fictional and authored in a clean room for Brazilian software engineers. No official TOEIC, IELTS or CELPE-Bras item, answer key, or proprietary preparation material was reproduced or adapted.
6. Item ids are globally unique and contain the lesson token `exam_simulations`; no option or Portuguese gloss is repeated within an item after normalisation.
