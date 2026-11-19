# Practice Pack — `les_b2_toeic_writing`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_toeic_writing_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_toeic_writing.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_toeic_writing_v1
lesson_id: les_b2_toeic_writing
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
item_id: grm_toeic_writing_connector_001
skill: `grammar.argument_connectors`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "Therefore, some decisions stall when nobody meets live."
    br_pt_form: "Portanto, algumas decisões travam quando ninguém se encontra ao vivo."
    note: "therefore signals a result, but this clause contrasts with the first one"
  - option: "For instance, some decisions stall when nobody meets live."
    br_pt_form: "Por exemplo, algumas decisões travam quando ninguém se encontra ao vivo."
    note: "for instance introduces an example, not the contrast the sentence needs"
  - option: "In conclusion, some decisions stall when nobody meets live."
    br_pt_form: "Em conclusão, algumas decisões travam quando ninguém se encontra ao vivo."
    note: "in conclusion closes an essay; this sentence belongs inside a body paragraph"
```

**Item:**
> In an opinion essay, which connector fits? "Async updates save time. ___, some decisions stall when nobody meets live."

| Slot | Value |
|------|-------|
| A | "Therefore, some decisions stall when nobody meets live." |
| B | **"However, some decisions stall when nobody meets live."** ✓ |
| C | "For instance, some decisions stall when nobody meets live." |
| D | "In conclusion, some decisions stall when nobody meets live." |

**Key:** B

**Feedback:**
> **B** marks the contrast between saving time and stalling decisions. **A** announces a result that the second clause does not express, **C** introduces an example where a contrast is needed, and **D** closes an essay in the middle of a body paragraph.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_toeic_writing_prompt_scan_001
skill: `reading.writing_prompt_requirements`
type: `detail_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Summarize the history of code review tools."
    br_pt_form: "Resumir a história das ferramentas de revisão de código."
    note: "the prompt asks for a position, not a history of the tools"
  - option: "Compare two review tools and name a winner."
    br_pt_form: "Comparar duas ferramentas de revisão e escolher uma vencedora."
    note: "no tool comparison is requested; the two views concern the practice itself"
  - option: "Write about personal preferences only."
    br_pt_form: "Escrever apenas sobre preferências pessoais."
    note: "the word limit is real, but dropping the reasons and the opposing view breaks task achievement"
```

**Stimulus:**
> "Write a response to the following question: Some engineers say code reviews slow delivery. Others say they prevent defects. Which view do you support? Give two reasons and address one opposing view. Use 180–250 words."

**Item:**
> Besides choosing a view, what must the writer do?

| Slot | Value |
|------|-------|
| A | Summarize the history of code review tools. |
| B | **Give two reasons and address one opposing view.** ✓ |
| C | Compare two review tools and name a winner. |
| D | Write about personal preferences only. |

**Key:** B

**Feedback:**
> The prompt states both obligations explicitly: **`Give two reasons and address one opposing view.`** **A** invents a history task, **C** turns two opinions into a product comparison, and **D** keeps the length rule but ignores the required content.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_toeic_writing_task_achievement_001
skill: `vocab.writing_task_terms`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "word limit"
    br_pt_form: "limite de palavras"
    note: "this is the length range, not whether the requested content was answered"
  - option: "grammar accuracy"
    br_pt_form: "precisão gramatical"
    note: "this measures error control, not coverage of the prompt"
  - option: "email format"
    br_pt_form: "formato de e-mail"
    note: "this is the layout of a message, not the completeness of the response"
```

**Item:**
> Which term means "the writer answered every part of the prompt"?

| Slot | Value |
|------|-------|
| A | word limit |
| B | **task achievement** ✓ |
| C | grammar accuracy |
| D | email format |

**Key:** B

**Feedback:**
> **`Task achievement`** is exactly the coverage of every requested part. **A** is only the length range, **C** measures error control, and **D** describes the structure of an email rather than the completeness of an answer.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_toeic_writing_revision_note_001
skill: `reading.writing_feedback_priority`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Replace technical vocabulary with simpler words."
    br_pt_form: "Substituir vocabulário técnico por palavras mais simples."
    note: "the note says to fix structure before polishing word choice"
  - option: "Add a third reason to the last paragraph."
    br_pt_form: "Acrescentar uma terceira razão ao último parágrafo."
    note: "the problem is a new argument in the closing, not a missing reason"
  - option: "Check subject-verb agreement throughout."
    br_pt_form: "Verificar concordância sujeito-verbo em todo o texto."
    note: "grammar accuracy is not the priority named in the note"
```

**Stimulus:**
> "Feedback note: Your draft has a clear position and two reasons, but the last paragraph introduces a new argument and the closing repeats the first sentence. Fix the structure before you polish word choice."

**Item:**
> What is the main revision priority?

| Slot | Value |
|------|-------|
| A | Replace technical vocabulary with simpler words. |
| B | **Remove the new argument and rewrite the closing.** ✓ |
| C | Add a third reason to the last paragraph. |
| D | Check subject-verb agreement throughout. |

**Key:** B

**Feedback:**
> The note names two structural faults: a new argument in the last paragraph and a closing that repeats the opening. **A** is word choice, explicitly postponed; **C** would add more material to the very paragraph that has too much; **D** is a grammar check, not the stated priority.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_toeic_writing_review_schwa_001
skill: `pronunciation.writing_review_schwa`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *before* carries a weak /ə/ in the first syllable, and *review* ends in a clear /v/, not /w/. Brazilian learners tend to give the unstressed vowel its full Portuguese value and to round the lips on /v/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Before I respond, I review the prompt and check the word limit."

**Target phonemes:** /ə/ in *before* and *about* · /ð/ in *the* · /v/ in *review* · /ɪ/ in *limit* · /t/ final in *limit*, without an added /ɪ/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_toeic_writing_email_register_001
skill: `grammar.email_register_request`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_b2_register_nuance`
distractors:
  - option: "Hey, send me the file, ok?"
    br_pt_form: "Oi, me manda o arquivo, ok?"
    note: "chat register and a bare imperative do not fit a formal client email"
  - option: "You must send the file now."
    br_pt_form: "Você deve enviar o arquivo agora."
    note: "a command sounds enforced; the register calls for a polite request"
  - option: "I want the file, please."
    br_pt_form: "Eu quero o arquivo, por favor."
    note: "stating a want is not a request addressed to the reader"
```

**Item:**
> Reviewing register and nuance: which line is a polite request in a formal client email?

| Slot | Value |
|------|-------|
| A | "Hey, send me the file, ok?" |
| B | **"Could you please send the revised file by Thursday?"** ✓ |
| C | "You must send the file now." |
| D | "I want the file, please." |

**Key:** B

**Feedback:**
> A polite formal request keeps interrogative order, a modal and a concrete time: **`Could you please send the revised file by Thursday?`** **A** uses chat register, **C** turns the request into a command, and **D** states the writer's want instead of asking the reader.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_toeic_writing_evidence_verb_001
skill: `vocab.argumentative_terms`
type: `contextual_selection`
difficulty_b: 0.4
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_b2_professional_argument`
distractors:
  - option: "insist"
    br_pt_form: "insistir"
    note: "a person insists on a claim; evidence cannot insist on a conclusion"
  - option: "attend"
    br_pt_form: "comparecer"
    note: "attend means to be present and does not take a conclusion as object"
  - option: "depend"
    br_pt_form: "depender"
    note: "depend needs on and describes a condition, not what evidence does to a claim"
```

**Item:**
> Reviewing argumentative vocabulary: "That objection is valid, but the evidence does not ___ the conclusion."

| Slot | Value |
|------|-------|
| A | **support** ✓ |
| B | insist |
| C | attend |
| D | depend |

**Key:** A

**Feedback:**
> **`Support`** is the verb that links evidence to a conclusion. **B** requires a person and the preposition *on*, **C** means to be present at an event, and **D** would need *on* and would describe a condition rather than evidential force.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `contrast_connector_drill` | Item 1 missed | **L2** | Contrast *however / therefore / for instance / in conclusion* in short argumentative paragraphs with one job per sentence. |
| `prompt_decomposition` | Items 2 and 3 missed | **L2** | Underline every obligation in an original writing prompt and map each one to *task achievement*; separate it from *word limit* and *grammar accuracy*. |
| `revision_and_register_review` | Items 4, 6 and 7 missed | **L2** | Recycle the feedback note, the polite request and the evidence verb in one revision thread; keep greeting and closing at the same register. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b2_register_nuance` and `les_b2_professional_argument` and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Grammar-RAG query `TOEIC writing email opinion essay structure` (top-2) returned only book front-matter text (similarity ≈ 22.9–24.2); no retrieved passage was used in this pack.
6. No official TOEIC item, prompt, answer key or proprietary preparation material was reproduced; both writing prompts in the paired lesson are fictional software-team scenarios authored in a clean room.
