# Practice Pack — `les_b1_question_forms`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_question_forms_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_question_forms.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_question_forms_v1
lesson_id: les_b1_question_forms
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
item_id: grm_question_forms_does_support_001
skill: `grammar.present_simple_do_does`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Where works Ana?"
    br_pt_form: "Onde trabalha a Ana?"
    note: "a present-simple question needs do/does before the subject"
  - option: "Where does Ana works?"
    br_pt_form: "Onde a Ana trabalha?"
    note: "does takes the bare verb; there is no third-person -s after the auxiliary"
  - option: "Where Ana works?"
    br_pt_form: "Onde a Ana trabalha sem auxiliar?"
    note: "statement order without do/does is not an interrogative"
```

**Item:**
> You are asking a new teammate where she works. Which question is correct?

| Slot | Value |
|------|-------|
| A | "Where works Ana?" |
| B | **"Where does Ana work?"** ✓ |
| C | "Where does Ana works?" |
| D | "Where Ana works?" |

**Key:** B

**Feedback:**
> Present-simple questions use **do/does + subject + bare verb**: **`Where does Ana work?`** **A** inverts the main verb instead of using *does*, **C** wrongly adds *-s* after the auxiliary, and **D** keeps statement order and never marks the question.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_question_forms_standup_detail_001
skill: `reading.question_forms_standup`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Ana"
    br_pt_form: "A Ana"
    note: "Ana asks the questions; she answers 'The fix branch' and does not claim the retry limit"
  - option: "The platform team"
    br_pt_form: "O time de plataforma"
    note: "the platform team is never mentioned in this stand-up"
  - option: "The dashboard"
    br_pt_form: "O painel"
    note: "the dashboard shows the error rate; it cannot own the retry limit"
```

**Stimulus:**
> "Stand-up, 09:15 — Ana: Who owns the retry limit? Rafa: I do. Which branch did you merge yesterday? Ana: The fix branch. Rafa: What does the dashboard show now? Ana: It shows the error rate back at baseline. Rafa: Can you tell me where the slow query log is? Ana: It's in the runbook. I still don't know why it spiked at 14:00."

**Item:**
> Who owns the retry limit?

| Slot | Value |
|------|-------|
| A | Ana |
| B | **Rafa** ✓ |
| C | The platform team |
| D | The dashboard |

**Key:** B

**Feedback:**
> Rafa answers **"I do"** to Ana's *Who owns the retry limit?*, so **`Rafa`** is the owner. **A** asks the question instead, **C** is an unmentioned team, and **D** is only the source of the error-rate reading.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_question_forms_which_one_001
skill: `vocab.question_forms_interrogatives`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "Who"
    br_pt_form: "Quem"
    note: "who asks for a person, not for a choice between known options"
  - option: "What"
    br_pt_form: "O que"
    note: "what is open-ended; it does not restrict the answer to a mentioned set"
  - option: "Whose"
    br_pt_form: "De quem"
    note: "whose asks about possession, not about selecting one of two tickets"
```

**Item:**
> Two tickets are open: PAY-218 and PAY-219. Which word asks the listener to pick one?

| Slot | Value |
|------|-------|
| A | Who |
| B | What |
| C | Whose |
| D | **Which** ✓ |

**Key:** D

**Feedback:**
> **`Which`** selects from a known, bounded set — here, the two tickets. **A** (*Who*) asks for a person, **B** (*What*) leaves the set open, and **C** (*Whose*) asks who owns something.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_question_forms_embedded_order_001
skill: `reading.question_forms_embedded`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The writer already knows the query that timed out."
    br_pt_form: "O autor já sabe qual consulta expirou."
    note: "the message says 'I don't know which query timed out'"
  - option: "Ana added the index before the message."
    br_pt_form: "A Ana adicionou o índice antes da mensagem."
    note: "the writer says 'I'll add the index' — a future action, not a finished one"
  - option: "The runbook is missing from the repository."
    br_pt_form: "O runbook está faltando no repositório."
    note: "the writer asks where the runbook lives; nothing says it is missing"
```

**Stimulus:**
> "Posted in #payments: I don't know which query timed out, but Ana says the index is missing. Do you know where the runbook lives? Can you tell me why the latency went up after 14:00? I'll add the index and share the query plan."

**Item:**
> Which statement is true according to the message?

| Slot | Value |
|------|-------|
| A | The writer already knows the query that timed out. |
| B | Ana added the index before the message. |
| C | **The writer does not know which query timed out.** ✓ |
| D | The runbook is missing from the repository. |

**Key:** C

**Feedback:**
> The first clause states it directly: **`I don't know which query timed out`**, with statement order after *know*. **A** reverses that clause, **B** turns the writer's future *I'll add* into a past action by Ana, and **D** invents a missing runbook where the text only asks for its location.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_question_forms_wh_focus_001
skill: `pronunciation.question_forms_wh_focus`
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

**Step 1 — hear the contrast:** *who* /huː/ and *whose* /huːz/ start with /h/, not /w/; *what, which, where* start with /w/ and rounded lips. *Work* carries the American /ɝː/, and the final sound in *does* and *is* is voiced /z/, not /s/. Brazilian learners tend to say *wuː* for *who*, flatten /ɝː/ into "uó", and devoice the final /z/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Who owns the retry limit? Which branch did you merge? What does the dashboard show? Can you tell me where the log is, Ana?"

**Target phonemes:** /h/ + /uː/ in *who* · /h/ + /uː/ + /z/ in *whose* · /w/ in *what, which, where* · /ɝː/ in *work* · /z/ final in *does, is* · falling intonation on the WH-questions and on the embedded question.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_question_forms_hedged_request_001
skill: `grammar.modal_hedging`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_b1_modals
distractors:
  - option: "Can you telling me where the log is?"
    br_pt_form: "Você pode me dizendo onde está o log?"
    note: "can takes the bare verb, not a gerund"
  - option: "Could you tell me where is the log?"
    br_pt_form: "Você poderia me dizer onde está o log?"
    note: "the embedded clause keeps statement order; no inversion after 'tell me'"
  - option: "Could you to tell me where the log is?"
    br_pt_form: "Você poderia para me dizer onde está o log?"
    note: "a modal takes the bare verb; 'to' after 'could' is L1 transfer"
```

**Item:**
> Reviewing `les_b1_modals`: which line is a polite request with correct embedded word order?

| Slot | Value |
|------|-------|
| A | "Can you telling me where the log is?" |
| B | "Could you tell me where is the log?" |
| C | "Could you to tell me where the log is?" |
| D | **"Could you tell me where the log is?"** ✓ |

**Key:** D

**Feedback:**
> *Could* softens the request and takes the bare verb, while the embedded clause keeps statement order: **`Could you tell me where the log is?`** **A** uses a gerund after *can*, **B** inverts *is* inside the embedded clause, and **C** inserts *to* after the modal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_question_forms_ask_for_help_001
skill: `vocab.ask_for_help_request`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_ask_for_help
distractors:
  - option: "Give me the log now."
    br_pt_form: "Me dê o log agora."
    note: "a command, not a request; it carries no softening at all"
  - option: "I want that you check the log."
    br_pt_form: "Eu quero que você verifique o log."
    note: "'want' does not take a that-clause with a bare subject; use 'I want you to...'"
  - option: "You can check the log?"
    br_pt_form: "Você pode verificar o log?"
    note: "statement order with rising intonation is not the standard written request"
```

**Item:**
> Reviewing `les_a2_ask_for_help`: you need a colleague to check a log. Which line is a natural polite request?

| Slot | Value |
|------|-------|
| A | "Give me the log now." |
| B | "I want that you check the log." |
| C | **"Could you check the log for me, please?"** ✓ |
| D | "You can check the log?" |

**Key:** C

**Feedback:**
> **`Could you check the log for me, please?`** is the neutral workplace request: modal + bare verb + *please*. **A** is an order, **B** forces the Portuguese *que* construction into English, and **D** relies on statement order plus intonation instead of the request pattern.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `present_simple_do_support` | Item 1 missed | **L2** | Contrast *Where works Ana? / Where Ana works? / Where does Ana work?* until *do/does + subject + bare verb* is automatic. |
| `embedded_question_order` | Items 2, 4 and 6 missed | **L2** | Recycle *I don't know which query timed out*, *Do you know where the log is?* and *Could you tell me why...?* with explicit subject-before-verb marking. |
| `interrogative_pronoun_choice` | Items 3, 5 and 7 missed | **L2** | Drill *who* (subject vs object), *which* (bounded set), *what* (open set), *whose* (possession) and the polite request frame in one stand-up script. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_modals` (`grammar.modal_hedging`) and `les_a2_ask_for_help` (polite requests), and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Grammar-RAG was queried before authoring with `--topic "advanced question forms interrogative pronouns do does" --top-k 2`. Result [2] (question word and reported-speech word order) informed the embedded-question rule in items 2, 4 and 6; result [1] was only an index pointer to auxiliary verbs and *any/some in questions* and contributed no wording. All item text is authored in a clean room; no external source text is reproduced or adapted.
6. §4.3 alignment: new skills for `les_b1_question_forms` are `interrogative_pronouns` and `present_simple_do_does`; `hedging` is treated as a prerequisite skill supplied by `les_b1_modals`.
7. The token `question_forms` appears in all seven `item_id` values; every distractor carries a quoted `br_pt_form` and a `note`, and the four normalized options of each MCQ are distinct.
