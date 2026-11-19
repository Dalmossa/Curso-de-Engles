# Practice Pack — `les_b2_toeic_reading`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_toeic_reading_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_toeic_reading.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_toeic_reading_v1
lesson_id: les_b2_toeic_reading
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
item_id: grm_toeic_reading_present_perfect_001
skill: `grammar.present_perfect_exam_experience`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "I took two practice tests, but I do not receive the scores yet."
    br_pt_form: "Fiz dois testes de treino, mas ainda não recebo as notas."
    note: "past for a finished count clashes with a present state that is still open"
  - option: "I am taking two practice tests, but I have not received the scores yet."
    br_pt_form: "Estou fazendo dois testes de treino, mas ainda não recebi as notas."
    note: "a progressive action in progress conflicts with a completed count of two"
  - option: "I have took two practice tests, but I did not received the scores yet."
    br_pt_form: "Eu tenho feito dois testes de treino, mas não recebi as notas."
    note: "have requires the past participle taken, and did requires the bare verb receive"
```

**Item:**
> Which line correctly reports exam experience up to now?

| Slot | Value |
|------|-------|
| A | "I took two practice tests, but I do not receive the scores yet." |
| B | **"I have taken two practice tests, but I have not received the scores yet."** ✓ |
| C | "I am taking two practice tests, but I have not received the scores yet." |
| D | "I have took two practice tests, but I did not received the scores yet." |

**Key:** B

**Feedback:**
> **B** uses *have taken* and *have not received* for experience that reaches the present. **A** mixes a finished past count with an open present state, **C** makes the tests ongoing when the count is already two, and **D** gets both irregular forms wrong (*have took*, *did not received*).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_toeic_reading_main_idea_001
skill: `reading.3levels`
type: `main_idea_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The ticket queue will close on Friday."
    br_pt_form: "A fila de chamados será fechada na sexta-feira."
    note: "the memo explicitly says no change is planned for the ticket queue"
  - option: "Support staff must learn a new phone number."
    br_pt_form: "A equipe de suporte precisa aprender um novo número de telefone."
    note: "the memo says the phone number stays the same"
  - option: "The new rota comes out on Friday and the shift moves on 6 October."
    br_pt_form: "A nova escala sai na sexta e o turno muda em 6 de outubro."
    note: "both facts are true details, but neither states the main idea of the memo"
```

**Stimulus:**
> "Memo — Northwind Systems. The support desk will move its evening shift to a remote schedule starting 6 October. Team leads will publish a new rota by Friday; no change is planned for the phone number or the ticket queue. Staff should check the rota before their next shift."

**Item:**
> Which sentence states the main idea of the memo?

| Slot | Value |
|------|-------|
| A | The ticket queue will close on Friday. |
| B | Support staff must learn a new phone number. |
| C | **The support desk is changing how its evening shift is scheduled.** ✓ |
| D | The new rota comes out on Friday and the shift moves on 6 October. |

**Key:** C

**Feedback:**
> **C** covers the whole memo: the evening shift becomes remote. **A** and **B** contradict the sentence saying the phone number and ticket queue do not change, while **D** lists two correct details that together still do not express the gist.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_toeic_reading_distractor_001
skill: `vocab.toeic.distractor`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "the first sentence that introduces the passage"
    br_pt_form: "a primeira frase que apresenta o texto"
    note: "that is the opening of a passage, not a wrong answer option"
  - option: "the clock that ends the section"
    br_pt_form: "o relógio que encerra a seção"
    note: "a timer controls time, not the plausibility of an answer option"
  - option: "a word the writer defines in a context clue"
    br_pt_form: "uma palavra que o autor define em uma pista de contexto"
    note: "that describes vocabulary in context, not an incorrect option"
```

**Item:**
> In a multiple-choice reading question, what is a distractor?

| Slot | Value |
|------|-------|
| A | **An incorrect option designed to look plausible.** ✓ |
| B | The first sentence that introduces the passage. |
| C | The clock that ends the section. |
| D | A word the writer defines in a context clue. |

**Key:** A

**Feedback:**
> **A** is the exam-strategy sense of *distractor*: a wrong option that looks convincing. **B** describes the passage opening, **C** describes the timer, and **D** describes a vocabulary clue — none of them is an answer choice competing with the key.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_toeic_reading_inference_001
skill: `reading.inference`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The lifts were already back in service."
    br_pt_form: "Os elevadores já estavam em serviço novamente."
    note: "the notice says they stay out of service until the inspector signs off"
  - option: "Ana did not need to reach the sixth floor."
    br_pt_form: "A Ana não precisava ir ao sexto andar."
    note: "the laptop was left in the sixth-floor meeting room, so she did need to go up"
  - option: "The meeting room was closed for the inspection."
    br_pt_form: "A sala de reuniões foi fechada para a inspeção."
    note: "the notice is about lifts only; the room is not said to be closed"
```

**Stimulus:**
> "Notice: Lifts out of service until the safety inspector signs off. Ana had left her laptop in the sixth-floor meeting room. She took the stairs instead of waiting by the lift."

**Item:**
> What is the most reasonable inference?

| Slot | Value |
|------|-------|
| A | The lifts were already back in service. |
| B | Ana did not need to reach the sixth floor. |
| C | The meeting room was closed for the inspection. |
| D | **The inspector had not approved the lifts yet.** ✓ |

**Key:** D

**Feedback:**
> **D** follows from *until the safety inspector signs off* plus Ana taking the stairs. **A** reverses the condition, **B** ignores the laptop on the sixth floor, and **C** extends a lift notice to the meeting room without support.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_toeic_reading_diphthongs_001
skill: `pronunciation.toeic_diphthongs_clusters`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *main*, *name* and *date* end in the glide /eɪ/, not the pure /e/ of pt-BR *mae*; *skim* and *scan* begin with the cluster /sk/, without the extra vowel of "esquim"; *then* starts with the voiced dental fricative /ð/, never the /d/ of pt-BR *de*.

**Step 2 — produce (ASR-scored):** read aloud:

> "Skim the passage first for the main idea, then scan it for the name or date the question stem asks for."

**Target phonemes:** /sk/ in *skim, scan* · /eɪ/ in *main, name, date* · /ð/ in *the, then* · /tʃ/ in *question* · /ɪ/ in *skim, it* (short, not the tense /iː/ of pt-BR *si*), without an inserted vowel in the /sk/ cluster.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_toeic_reading_present_simple_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.4
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "The notice list the new hours, and the team checks the rota every Friday."
    br_pt_form: "O aviso lista os novos horários, e o time confere a escala toda sexta."
    note: "a singular subject takes the third-person -s form in the present simple"
  - option: "The notice lists the new hours, and the team is check the rota every Friday."
    br_pt_form: "O aviso lista os novos horários, e o time está conferir a escala toda sexta."
    note: "a routine fact does not take the progressive be plus bare verb"
  - option: "The notice listed the new hours, and the team check the rota every Friday."
    br_pt_form: "O aviso listou os novos horários, e o time confere a escala toda sexta."
    note: "mixing a past event with a present routine breaks tense consistency"
```

**Item:**
> Reviewing IT English basics: which line states a routine fact correctly?

| Slot | Value |
|------|-------|
| A | "The notice list the new hours, and the team checks the rota every Friday." |
| B | **"The notice lists the new hours, and the team checks the rota every Friday."** ✓ |
| C | "The notice lists the new hours, and the team is check the rota every Friday." |
| D | "The notice listed the new hours, and the team check the rota every Friday." |

**Key:** B

**Feedback:**
> **B** keeps the -s on both singular subjects in a routine statement. **A** drops the -s on *list*, **C** uses a progressive where a habit is meant, and **D** shifts from past to present without a reason.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_toeic_reading_scan_target_001
skill: `vocab.toeic.scanning`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_reading_strategy`
distractors:
  - option: "Read the first line of every paragraph to get the gist."
    br_pt_form: "Ler a primeira linha de cada parágrafo para captar a ideia geral."
    note: "that is skimming for the main idea, not scanning for a specific target"
  - option: "Translate the memo into Portuguese word by word."
    br_pt_form: "Traduzir o aviso para o português palavra por palavra."
    note: "translation is not a reading strategy for locating a detail in English"
  - option: "Guess the date from your experience with similar memos."
    br_pt_form: "Adivinhar a data pela experiência com avisos parecidos."
    note: "a date must come from the passage, never from outside knowledge"
```

**Item:**
> Reviewing reading strategy: you need the date of the new rota. Which action is scanning?

| Slot | Value |
|------|-------|
| A | **Move your eyes down the memo looking only for the word Friday.** ✓ |
| B | Read the first line of every paragraph to get the gist. |
| C | Translate the memo into Portuguese word by word. |
| D | Guess the date from your experience with similar memos. |

**Key:** A

**Feedback:**
> **A** is scanning — a targeted visual search for one detail. **B** is skimming, **C** is translation, and **D** replaces the text with outside knowledge; none of those locates the date in the passage.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `skim_scan_switch` | Items 2 and 7 missed | **L2** | Drill the switch from gist reading to targeted detail search on short fictional memos; read the question stem first. |
| `exam_tense_review` | Items 1 and 6 missed | **L2** | Contrast *have taken / took / take* with *last month, so far, yet* in short exam-experience sentences. |
| `inference_and_distractor` | Items 3 and 4 missed | **L2** | Practise justifying an inference with one quoted clause and rejecting a distractor that echoes a word but changes the relationship. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration, so the manifest keeps `listening_items: 0` with the ⚠️ deferred marker.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a2_it_reading_strategy` respectively, and carry `prereq_lesson` for the interleaving rule; both ids are verified in `curriculum-graph-spec.md` §4.3.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every passage, statement, option, gloss and note in this pack is fictional and authored in a clean room for Brazilian software engineers. No real TOEIC item, answer key, or proprietary preparation material was reproduced or adapted.
6. Item ids are globally unique and contain the lesson token `toeic_reading`; no option or Portuguese gloss is repeated within an item after normalisation.
