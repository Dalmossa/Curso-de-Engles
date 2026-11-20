# Practice Pack — `les_a1_wh_questions`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_wh_questions_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_wh_questions.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_wh_questions_v1
lesson_id: les_a1_wh_questions
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
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_whq_word_order_001`
skill: `grammar.wh_questions_word_order`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Where you do find the rollback guide?"
    br_pt_form: "Onde você encontra o guia de rollback?"
    note: "pt-BR keeps the subject before the auxiliary; English puts 'do' before the subject in a question"
  - option: "Where do find the rollback guide you?"
    br_pt_form: "Onde encontra o guia de rollback você?"
    note: "pt-BR subject-final question order copied into English, where the subject follows the auxiliary"
  - option: "Where the rollback guide is?"
    br_pt_form: "Onde está o guia de rollback?"
    note: "pt-BR can omit an auxiliary in questions; English needs 'do/does' when there is no other auxiliary"
```

**Item:**
> Otto wants to know how to find the rollback guide. Which question do you ask?

| Slot | Value |
|------|-------|
| A | "Where you do find the rollback guide?" |
| B | **"Where do you find the rollback guide?"** ✓ |
| C | "Where do find the rollback guide you?" |
| D | "Where the rollback guide is?" |

**Key:** B

**Feedback:**
> With *do/does*, the order is question word + auxiliary + subject + verb: **`Where do you find the rollback guide?`** **A** puts the subject before the auxiliary, **C** copies the pt-BR subject-final order, and **D** leaves out the auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_whq_how_adjective_001`
skill: `grammar.how_adjective_questions`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "How long is it to the office?"
    br_pt_form: "Quanto tempo é até o escritório?"
    note: "asks about duration; 'how far' asks about distance"
  - option: "How old is it to the office?"
    br_pt_form: "É antigo o caminho até o escritório?"
    note: "'how old' asks about age; the question is about distance"
  - option: "How far it is to the office?"
    br_pt_form: "Até o escritório, quão longe fica?"
    note: "no inversion after 'how far'; English needs 'is it' before the place"
```

**Item:**
> You want to know the distance to the office. Which question do you ask?

| Slot | Value |
|------|-------|
| A | "How long is it to the office?" |
| B | **"How far is it to the office?"** ✓ |
| C | "How old is it to the office?" |
| D | "How far it is to the office?" |

**Key:** B

**Feedback:**
> `How` + adjective forms the question: **`How far is it to the office?`** asks about distance. **A** asks about duration, **C** asks about age, and **D** drops the inversion that the question needs.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_whq_word_map_001`
skill: `vocab.wh_question_words`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "where"
    br_pt_form: "onde"
    note: "asks about a place, not about a reason"
  - option: "when"
    br_pt_form: "quando"
    note: "asks about a time, not about a reason"
  - option: "what"
    br_pt_form: "o que"
    note: "asks about a thing or a definition, not about a reason"
```

**Item:**
> You need to ask why the release was postponed. Which question word do you use?

| Slot | Value |
|------|-------|
| A | where |
| B | when |
| C | what |
| D | **why** ✓ |

**Key:** D

**Feedback:**
> **`why`** asks for the reason, so *"Why was the release postponed?"* is the question you need. **A** asks about a place, **B** about a time, and **C** about a thing or a definition.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_whq_how_forms_001`
skill: `vocab.how_adjective_forms`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "How far is the smoke test?"
    br_pt_form: "Quão longe está o teste de fumaça?"
    note: "'how far' asks about distance; the speaker talks about duration"
  - option: "How old is the smoke test?"
    br_pt_form: "Quão velho é o teste de fumaça?"
    note: "'how old' asks about age, not about how long the test takes"
  - option: "What time is the smoke test?"
    br_pt_form: "Que horas é o teste de fumaça?"
    note: "asks for the clock time, not for the duration of the task"
```

**Item:**
> The smoke test takes about ten minutes. Which question asks about that duration?

| Slot | Value |
|------|-------|
| A | "How far is the smoke test?" |
| B | "How old is the smoke test?" |
| C | "What time is the smoke test?" |
| D | **"How long does the smoke test take?"** ✓ |

**Key:** D

**Feedback:**
> **`How long does the smoke test take?`** asks about duration. **A** asks about distance, **B** about age, and **C** about the hour on the clock.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_whq_w_initial_001`
skill: `pronunciation.w_initials`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_whq_w_initial_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *what* /wʌt/ and *where* /weər/ start with /w/, made with rounded lips — not /v/, as in *very*. *how* /haʊ/ and *who* /huː/ start with /h/: air first, then the vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "What time does the deploy window open? How long does the smoke test take?"

**Target phonemes:** /w/ in *what*, *where* and *window* · /h/ in *how* · rising intonation on the direct question.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_whq_demonstr_answer_001`
skill: `grammar.demonstratives_near_far`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_pronouns_demonstrative`
distractors:
  - option: "This is the rollback guide."
    br_pt_form: "Este é o guia de rollback."
    note: "'this' marks near distance; the guide is on the shelf across the room (far)"
  - option: "Those is the rollback guide."
    br_pt_form: "Aqueles é o guia de rollback."
    note: "'those' is plural and cannot take the singular verb 'is'"
  - option: "These are the rollback guide."
    br_pt_form: "Estas são o guia de rollback."
    note: "plural form with a singular noun"
```

**Item:**
> Otto points at the guide on the shelf across the room and asks: "What is that?" What do you answer?

| Slot | Value |
|------|-------|
| A | "This is the rollback guide." |
| B | "Those is the rollback guide." |
| C | "These are the rollback guide." |
| D | **"That is the rollback guide."** ✓ |

**Key:** D

**Feedback:**
> The guide is **far** from the speakers and singular, so the answer is **`That is the rollback guide.`** **A** uses the near form *this*, **B** pairs the plural *those* with the singular verb *is*, and **C** uses a plural form for a single guide.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Reading, prerequisite review

```yaml
item_id: `rdg_whq_demonstr_context_001`
skill: `reading.demonstrative_context`
type: `detail_identification`
difficulty_b: -0.3
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_pronouns_demonstrative`
distractors:
  - option: "The alerts from the night before."
    br_pt_form: "Os alertas da noite anterior."
    note: "'these' marks the near plural alerts, not 'those'"
  - option: "The rollback guide on the desk."
    br_pt_form: "O guia de rollback na mesa."
    note: "not mentioned in the text"
  - option: "The deploy board on the whiteboard."
    br_pt_form: "O quadro de deploy no whiteboard."
    note: "'this' marks the near singular board; the question asks about 'those'"
```

**Stimulus:**
> "Duda walks into the release room. Otto points at the whiteboard. 'This is the deploy board,' he says. Then he points at the laptop. 'These are the alerts from last night.' Finally he points at the shelf across the room. 'Those are the old backup tapes.'"

**Item:**
> According to the text, what are "those"?

| Slot | Value |
|------|-------|
| A | The alerts from the night before. |
| B | The rollback guide on the desk. |
| C | The deploy board on the whiteboard. |
| D | **The old backup tapes.** ✓ |

**Key:** D

**Feedback:**
> The last line says **`Those are the old backup tapes.`** — *those* points at the far, plural objects on the shelf. **A** is the near plural *these*, **C** is the near singular *this*, and **B** never appears in the text.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `wh_question_auxiliary_order` | Item 1 missed | **L2** | Re-drill the pattern question word + *do/does* + subject + verb with deploy and wiki questions. |
| `how_adjective_axis` | Items 2, 4 missed | **L2** | Sort *how far* (distance), *how old* (age) and *how long* (duration) with office, server and build scenarios. |
| `indirect_question_reset` | Item 6 missed | **L2** | Rewrite five indirect questions (*"He asked me where… is."*) as direct questions and back again. |
| `wh_word_meaning_map` | Item 3 missed | **L2** | Match what / where / when / who / why to the information each one requests in a release meeting. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_pronouns_demonstrative` inside a wh-question frame, keeping the prereq link in the adaptive selector.
4. The six scored items carry a filled `br_pt_form` on every distractor; item 5 is a production item with no distractor set.
5. Items target authored lesson content; no external source text is reproduced.
