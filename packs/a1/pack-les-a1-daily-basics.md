# Practice Pack — `les_a1_daily_basics`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_daily_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_daily_basics.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_daily_basics_v1
lesson_id: les_a1_daily_basics
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
item_id: `voc_survival_understand_001`
skill: `vocab.survival.understanding_check`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Please wait here."
    br_pt_form: "Por favor, espere aqui."
    note: "polite instruction, but it does not communicate lack of understanding"
  - option: "Turn left at the desk."
    br_pt_form: "Vire à esquerda na mesa."
    note: "direction phrase; plausible in context but wrong communicative function"
  - option: "I would like a badge."
    br_pt_form: "Eu gostaria de um crachá."
    note: "polite request for an item, not a clarification of comprehension"
```

**Item:**
> In a meeting, the speaker talks too fast and you miss the message. What should you say first?

| Slot | Value |
|------|-------|
| A | "Please wait here." |
| B | **"I don't understand."** ✓ |
| C | "Turn left at the desk." |
| D | "I would like a badge." |

**Key:** B

**Feedback:**
> **`I don't understand.`** clearly tells the other person that you need clarification. **A** is an instruction, **C** gives directions, and **D** is a polite request for something else.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_requests_could_you_001`
skill: `grammar.requests_can_could`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Could you to help me, please?"
    br_pt_form: "Você poderia para me ajudar, por favor?"
    note: "common L1 transfer adding 'to' after the modal; modals take the base verb directly"
  - option: "You could help me please?"
    br_pt_form: "Você poderia me ajudar por favor?"
    note: "statement order with weak politeness marking; less clear as a request than the interrogative form"
  - option: "Help me, you could?"
    br_pt_form: "Me ajuda, você poderia?"
    note: "broken word order that mixes imperative and question patterns"
```

**Item:**
> Choose the most polite and correct request.

| Slot | Value |
|------|-------|
| A | "Could you to help me, please?" |
| B | **"Could you help me, please?"** ✓ |
| C | "You could help me please?" |
| D | "Help me, you could?" |

**Key:** B

**Feedback:**
> With **could/can**, use the base verb: **`Could you help me, please?`** **A** incorrectly adds *to* after the modal. **C** and **D** do not use a clear, natural request structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_survival_context_001`
skill: `reading.survival_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "She wants to start the presentation."
    br_pt_form: "Ela quer começar a apresentação."
    note: "plausible workplace action, but not supported by the text"
  - option: "She wants to change her password."
    br_pt_form: "Ela quer mudar a senha."
    note: "technical task unrelated to the badge request"
  - option: "She wants to leave the conference."
    br_pt_form: "Ela quer sair da conferência."
    note: "opposite of checking in and staying for the meeting"
```

**Stimulus:**
> "Good morning. Could you help me, please? I can't find room B. Could I have a badge, please? I would like to check in before the meeting starts."

**Item:**
> What does the speaker need to do before the meeting?

| Slot | Value |
|------|-------|
| A | Start the presentation. |
| B | Change her password. |
| C | **Check in and get a badge.** ✓ |
| D | Leave the conference. |

**Key:** C

**Feedback:**
> The speaker asks for help, requests a badge, and says **`I would like to check in`**. Together, these details show that she needs to check in and get a badge before the meeting.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_survival_wait_001`
skill: `vocab.survival.polite_request`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Please run here."
    br_pt_form: "Por favor, corra aqui."
    note: "uses a polite marker but gives the wrong action"
  - option: "Please understand here."
    br_pt_form: "Por favor, entenda aqui."
    note: "unnatural collocation that confuses comprehension with an instruction"
  - option: "Please badge here."
    br_pt_form: "Por favor, crachá aqui."
    note: "uses a noun as a verb; common when learners search quickly for a word"
```

**Item:**
> A support engineer needs you to stay in one place for a minute. What is the clearest instruction?

| Slot | Value |
|------|-------|
| A | "Please run here." |
| B | **"Please wait here."** ✓ |
| C | "Please understand here." |
| D | "Please badge here." |

**Key:** B

**Feedback:**
> **`Please wait here.`** is a clear, polite imperative. The other options use the wrong action or an unnatural word choice.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, current lesson

```yaml
item_id: `grm_imperatives_please_001`
skill: `grammar.imperatives_please`
type: `error_correction`
difficulty_b: 0.0
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "You wait here, please."
    br_pt_form: "Você espera aqui, por favor."
    note: "adds an unnecessary subject; imperatives usually omit 'you' in English"
  - option: "To wait here, please."
    br_pt_form: "Para esperar aqui, por favor."
    note: "infinitive form cannot function as a direct instruction"
  - option: "Waiting here, please."
    br_pt_form: "Esperando aqui, por favor."
    note: "gerund form does not express a clear instruction"
```

**Item:**
> Choose the correct polite instruction.

| Slot | Value |
|------|-------|
| A | "You wait here, please." |
| B | **"Please wait here."** ✓ |
| C | "To wait here, please." |
| D | "Waiting here, please." |

**Key:** B

**Feedback:**
> A polite imperative in English is short and direct: **`Please wait here.`** (or *Wait here, please*). **A** adds an unnecessary subject, while **C** and **D** use verb forms that do not give a clear instruction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_greeting_intro_001`
skill: `vocab.greetings.basic`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_greetings`
distractors:
  - option: "Good night."
    br_pt_form: "Boa noite (despedida)."
    note: "often used when leaving or going to sleep; less natural to start a morning interaction"
  - option: "Goodbye."
    br_pt_form: "Tchau."
    note: "closing expression, not an opening greeting"
  - option: "See you later."
    br_pt_form: "Até mais."
    note: "farewell phrase that does not open the conversation"
```

**Item:**
> You arrive at the help desk at 9:00 a.m. What is the best way to start?

| Slot | Value |
|------|-------|
| A | "Good night." |
| B | **"Good morning."** ✓ |
| C | "Goodbye." |
| D | "See you later." |

**Key:** B

**Feedback:**
> **`Good morning.`** is the natural greeting for the start of the day. **A** is usually for late evening or leaving at night, while **C** and **D** are farewells.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_survival_h_th_001`
skill: `pronunciation.h_initial`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_survival_h_th_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *help* /help/ starts with a clear /h/ sound, not silence and not /r/. *this* /ðɪs/ uses /ð/, made with the tongue between the teeth.
**Step 2 — produce (ASR-scored):** read aloud:

> "Could you help me with this, please?"

**Target phonemes:** /h/ in *help* · /ð/ in *this* · smooth, polite rhythm in *could you... please*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `requests_can_could_politeness` | Item 2 missed | **L2** | Contrast *Can you...?* and *Could you...?* in short workplace requests. |
| `imperatives_with_please` | Item 5 missed | **L2** | Practice direct but polite instructions (*Please wait here*, *Please open the ticket*). |
| `survival_understanding_check` | Item 1 missed | **L2** | Combine *I don't understand* with a follow-up request (*Can you repeat that, please?*). |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
