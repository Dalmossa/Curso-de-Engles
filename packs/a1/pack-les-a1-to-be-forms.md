# Practice Pack — `les_a1_to_be_forms`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_to_be_forms_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_to_be_forms.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_to_be_forms_v1
lesson_id: les_a1_to_be_forms
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

### ITEM 1 — Grammar, current lesson

```yaml
item_id: `grm_to_be_affirmative_001`
skill: `grammar.to_be_affirmative`
type: `contextual_selection`
difficulty_b: -0.8
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "He am a developer."
    br_pt_form: "Ele é desenvolvedor."
    note: "L1 transfer: PT omits the copula; EN requires 'is' with third-person singular subject"
  - option: "She be a QA engineer."
    br_pt_form: "Ela é engenheira de QA."
    note: "uninflected base verb; not a valid present-tense form of 'to be'"
  - option: "They is ready."
    br_pt_form: "Eles estão prontos."
    note: "subject-verb disagreement: 'they' takes 'are', not 'is'"
```

**Item:**
> Choose the grammatically correct affirmative sentence.

| Slot | Value |
|------|-------|
| A | "He am a developer." |
| B | **"She is a QA engineer."** ✓ |
| C | "She be a QA engineer." |
| D | "They is ready." |

**Key:** B

**Feedback:**
> **`She is a QA engineer.`** matches the third-person singular subject *she* with *is*. **A** misuses *am* (only for *I*); **C** uses the uninflected base *be*; **D** pairs plural *they* with singular *is*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_to_be_i_am_001`
skill: `vocab.tobe.i_am`
type: `contextual_selection`
difficulty_b: -0.7
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I have a developer."
    br_pt_form: "Eu tenho um desenvolvedor."
    note: "L1 transfer: possession verb 'have' used where English needs the copula 'am' for identity"
  - option: "I engineer."
    br_pt_form: "Eu engenheiro."
    note: "omitted copula, common when Portuguese drops 'sou/estou' before a noun"
  - option: "I is fine."
    br_pt_form: "Eu estou bem."
    note: "subject-verb disagreement: 'I' takes 'am', not 'is'"
```

**Item:**
> You are introducing yourself as a backend developer. Which sentence says who you are?

| Slot | Value |
|------|-------|
| A | "I have a developer." |
| B | **"I am a backend developer."** ✓ |
| C | "I engineer." |
| D | "I is fine." |

**Key:** B

**Feedback:**
> **`I am a backend developer.`** uses *am* with *I* to state identity. **A** means possession, not identity; **C** drops the copula; **D** mispairs *I* with *is*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_to_be_we_are_001`
skill: `vocab.tobe.we_are`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "We is ready."
    br_pt_form: "Nós estamos prontos."
    note: "subject-verb disagreement: 'we' takes 'are', not 'is'"
  - option: "We be ready."
    br_pt_form: "Nós estamos prontos."
    note: "uninflected base verb; not a valid present-tense form of 'to be'"
  - option: "We am ready."
    br_pt_form: "Nós estamos prontos."
    note: "subject-verb disagreement: 'we' takes 'are', not 'am'"
```

**Item:**
> Your team is prepared for the daily meeting. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "We is ready." |
| B | "We be ready." |
| C | **"We are ready."** ✓ |
| D | "We am ready." |

**Key:** C

**Feedback:**
> **`We are ready.`** pairs the plural subject *we* with *are*. **A**, **B**, and **D** all misuse the verb form for *we*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_to_be_context_001`
skill: `reading.tobe_context`
type: `detail_identification`
difficulty_b: -0.4
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "Maya is the QA engineer."
    br_pt_form: "Maya é a engenheira de QA."
    note: "swaps the roles of the two people introduced in the text"
  - option: "Sofia is the backend developer."
    br_pt_form: "Sofia é a desenvolvedora backend."
    note: "swaps the roles of the two people introduced in the text"
  - option: "Leo is not the tech lead."
    br_pt_form: "Leo não é o tech lead."
    note: "contradicts the text, which presents Leo as the tech lead"
```

**Stimulus:**
> "Good morning, everyone. I'm Maya, the new backend developer. This is Sofia, our QA engineer. Leo is the tech lead. We are ready for the daily meeting."

**Item:**
> Who is the backend developer?

| Slot | Value |
|------|-------|
| A | Maya is the QA engineer. |
| B | Sofia is the backend developer. |
| C | **Maya is the backend developer.** ✓ |
| D | Leo is not the tech lead. |

**Key:** C

**Feedback:**
> The text states **`I'm Maya, the new backend developer`**. **A** and **B** swap Maya's and Sofia's roles; **D** contradicts the text.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_to_be_contractions_001`
skill: `pronunciation.contractions_be`
type: `minimal_pair_production`
difficulty_b: -0.3
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_to_be_contractions_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *I am* contracts to *I'm* /aɪm/; *he is* contracts to *he's* /hiːz/; *it is* contracts to *it's* /ɪts/. The /h/ in *he's* is aspirated; there is no /h/ in *I'm*.

**Step 2 — produce (ASR-scored):** read aloud:

> "I'm Maya. She's Sofia. It's ready."

**Target phonemes:** /aɪm/ in *I'm* · /hiːz/ in *she's* · /ɪts/ in *it's* · smooth linking without separating the words.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_greetings_good_morning_001`
skill: `vocab.greetings.basic`
type: `contextual_selection`
difficulty_b: -0.9
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_greetings`
distractors:
  - option: "Good night."
    br_pt_form: "Boa noite (despedida)."
    note: "farewell or night-time wish, not a morning greeting"
  - option: "Goodbye."
    br_pt_form: "Tchau."
    note: "closing expression, used when leaving"
  - option: "See you later."
    br_pt_form: "Até mais."
    note: "farewell phrase that ends the conversation"
```

**Item:**
> You join the daily meeting at 9:00 a.m. What is the best way to start?

| Slot | Value |
|------|-------|
| A | "Good night." |
| B | **"Good morning."** ✓ |
| C | "Goodbye." |
| D | "See you later." |

**Key:** B

**Feedback:**
> **`Good morning.`** is the natural greeting for the start of the day. **A** is for late evening or leaving at night; **C** and **D** are farewells.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Grammar, prerequisite review

```yaml
item_id: `grm_be_present_intro_001`
skill: `grammar.be_present_introductions`
type: `contextual_selection`
difficulty_b: -0.8
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_greetings`
distractors:
  - option: "I have 28 years."
    br_pt_form: "Eu tenho 28 anos."
    note: "L1 transfer: Portuguese uses 'ter' for age; English uses 'to be' ('I am 28 years old')"
  - option: "I engineer."
    br_pt_form: "Eu engenheiro."
    note: "omitted copula: English requires 'am' before the noun"
  - option: "I is fine."
    br_pt_form: "Eu estou bem."
    note: "subject-verb disagreement: 'I' takes 'am', not 'is'"
```

**Item:**
> Choose the correct way to state your age and role in English.

| Slot | Value |
|------|-------|
| A | "I have 28 years." |
| B | **"I am 28 years old."** ✓ |
| C | "I engineer." |
| D | "I is fine." |

**Key:** B

**Feedback:**
> **`I am 28 years old.`** uses *to be* for age, as English requires. **A** transfers the Portuguese *ter* construction; **C** drops the copula; **D** mispairs *I* with *is*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `to_be_subject_agreement` | Item 1 or 4 missed | **L2** | Drill *I am / she is / they are* pairings in short affirmative sentences. |
| `to_be_contractions` | Item 5 missed | **L2** | Practice *I'm / he's / it's* linking in connected speech. |
| `age_with_to_be` | Item 7 missed | **L2** | Contrast *I am 28 years old* vs. L1 *tenho 28 anos*. |

---

## 4. VALIDATION NOTES

1. All `b` values are expert-anchored priors, per `assessment-item-spec.md` §3.
2. Item 5 is ASR-scored pronunciation production; it does not substitute for a listening-pool item (listening deferred under `content-map.md` §8.5 Decision B).
3. Items 6 and 7 review `les_a1_greetings` (prerequisite), per the 5 current / 2 prereq split.
4. Every scored MCQ item carries `br_pt_form` on all three distractors (coverage 6/6 scored items).
5. No `item_id` is repeated across this pack or any other pack in the repository.
6. All `**Key:**` lines are present and machine-parseable; no distractor duplicates the key within an item.
