# Practice Pack — `les_a1_there_is_are`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_there_is_are_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_there_is_are.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_there_is_are_v1
lesson_id: les_a1_there_is_are
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
item_id: `grm_there_agreement_001`
skill: `grammar.there_is_are`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: '"There is eight chairs around the table."'
    br_pt_form: "Há oito cadeiras ao redor da mesa."
    note: "plural subject with singular verb; eight chairs takes there are"
  - option: '"There are a big screen on the wall."'
    br_pt_form: "Há uma tela grande na parede."
    note: "plural verb with a singular countable subject; a big screen takes there is"
  - option: '"Have a whiteboard next to the door."'
    br_pt_form: "Tem um quadro branco ao lado da porta."
    note: "possession verb; describing what exists in a place takes there is / there are"
```

**Item:**
> Choose the correct sentence to describe the new meeting room.

| Slot | Value |
|------|-------|
| A | "There is eight chairs around the table." |
| B | **"There are eight chairs around the table."** ✓ |
| C | "There are a big screen on the wall." |
| D | "Have a whiteboard next to the door." |

**Key:** B

**Feedback:**
> **`There are eight chairs around the table.`** pairs the plural subject with *there are*. **A** mixes a plural noun with singular *there is*, and **C** mixes a singular countable noun with plural *there are*. **D** uses *have*, which shows possession, not existence in a place.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_office_objects_001`
skill: `vocab.office_environment`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: '"A webcam."'
    br_pt_form: "Uma webcam."
    note: "camera for video calls, not a surface you write on"
  - option: '"A chair."'
    br_pt_form: "Uma cadeira."
    note: "furniture for sitting, not for writing"
  - option: '"A screen."'
    br_pt_form: "Uma tela."
    note: "display for projection, not for marker writing"
```

**Item:**
> You are describing the meeting room to a colleague. Which word names the object the team writes on with markers during planning?

| Slot | Value |
|------|-------|
| A | "A webcam." |
| B | "A chair." |
| C | **"A whiteboard."** ✓ |
| D | "A screen." |

**Key:** C

**Feedback:**
> **`A whiteboard.`** is the surface you write on with markers. **A** is a camera for calls, **B** is for sitting, and **D** displays content instead of receiving writing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_room_description_001`
skill: `reading.room_description`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: '"The screen."'
    br_pt_form: "A tela."
    note: "the screen is on the wall, not next to the door"
  - option: '"The kitchen."'
    br_pt_form: "A cozinha."
    note: "never mentioned in the room description"
  - option: '"The chairs."'
    br_pt_form: "As cadeiras."
    note: "the chairs are around the table, not next to the door"
```

**Stimulus:**
> "This is our new meeting room on the second floor. There is a big screen on the wall, and there are eight chairs around the table. There is a whiteboard next to the door."

**Item:**
> What is next to the door?

| Slot | Value |
|------|-------|
| A | "The screen." |
| B | "The kitchen." |
| C | **"The whiteboard."** ✓ |
| D | "The chairs." |

**Key:** C

**Feedback:**
> The stimulus states **`There is a whiteboard next to the door.`** The screen is on the wall, the chairs are around the table, and the kitchen is never mentioned.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_quantifiers_any_001`
skill: `vocab.quantifiers_some_any`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: '"Is there some coffee in the kitchen?"'
    br_pt_form: "Tem algum café na cozinha?"
    note: "some sounds like an offer; a neutral question takes any"
  - option: '"Is there a coffee in the kitchen?"'
    br_pt_form: "Tem um café na cozinha?"
    note: "a before an uncountable noun; the natural form is some coffee or a cup of coffee"
  - option: '"Are there any coffee in the kitchen?"'
    br_pt_form: "Tem algum café na cozinha?"
    note: "plural verb with an uncountable noun; coffee takes there is"
```

**Item:**
> You want a neutral answer about coffee. Choose the natural question.

| Slot | Value |
|------|-------|
| A | "Is there some coffee in the kitchen?" |
| B | **"Is there any coffee in the kitchen?"** ✓ |
| C | "Is there a coffee in the kitchen?" |
| D | "Are there any coffee in the kitchen?" |

**Key:** B

**Feedback:**
> **`Is there any coffee in the kitchen?`** is the neutral question: *any* in questions, *coffee* uncountable with singular *there is*. **A** sounds like an offer, **C** puts a singular article on an uncountable noun, and **D** uses the plural verb with an uncountable noun.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, prerequisite review

```yaml
item_id: `rdg_have_has_context_001`
skill: `reading.have_has_context`
type: `detail_identification`
difficulty_b: -0.4
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_have_has`
distractors:
  - option: '"A whiteboard."'
    br_pt_form: "Um quadro branco."
    note: "not listed among Rafa's items"
  - option: '"A desk by the window."'
    br_pt_form: "Uma mesa perto da janela."
    note: "never mentioned in the text"
  - option: '"A webcam."'
    br_pt_form: "Uma webcam."
    note: "never mentioned in the text"
```

**Stimulus:**
> "Rafa is a QA engineer. She has a laptop, a charger, and a notebook. The laptop has a Linux sticker on the lid."

**Item:**
> What does Rafa have?

| Slot | Value |
|------|-------|
| A | **"A charger."** ✓ |
| B | "A whiteboard." |
| C | "A desk by the window." |
| D | "A webcam." |

**Key:** A

**Feedback:**
> The stimulus says **`She has a laptop, a charger, and a notebook.`** The charger is one of the listed items; the other options are never mentioned.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_have_has_agreement_001`
skill: `grammar.have_has_agreement`
type: `error_correction`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_have_has`
distractors:
  - option: '"Every developer have access to the test environment."'
    br_pt_form: "Todo desenvolvedor tem acesso ao ambiente de testes."
    note: "third-person singular subject needs has, not have"
  - option: '"Every developer haves access to the test environment."'
    br_pt_form: "Todo desenvolvedor tem acesso ao ambiente de testes."
    note: "invented third-person form; the correct form is has"
  - option: '"Every developer is have access to the test environment."'
    br_pt_form: "Todo desenvolvedor tem acesso ao ambiente de testes."
    note: "copula is plus base verb; possession uses has directly"
```

**Item:**
> Choose the correct sentence about possession.

| Slot | Value |
|------|-------|
| A | "Every developer have access to the test environment." |
| B | **"Every developer has access to the test environment."** ✓ |
| C | "Every developer haves access to the test environment." |
| D | "Every developer is have access to the test environment." |

**Key:** B

**Feedback:**
> **`Every developer has access to the test environment.`** uses third-person singular *has*. **A** keeps the base form *have*, **C** invents a form *haves*, and **D** adds an unnecessary copula.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_th_voiced_there_001`
skill: `pronunciation.th_voiced_there`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_th_voiced_there_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *there* /ðer/ starts with voiced /ð/, tongue between the teeth; *dere* with /d/ is the common pt-BR substitution.
**Step 2 — produce (ASR-scored):** read aloud:

> "There is a webcam on the screen."

**Target phonemes:** /ð/ in *there* · linking *there is* → /ðerəz/ in connected speech · clear final /s/ in *is*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `there_is_are_singular_plural` | Item 1 missed | **L2** | Re-run singular vs plural agreement with meeting-room nouns. |
| `quantifiers_some_any` | Item 4 missed | **L2** | Contrast *some* in offers and *any* in neutral questions. |
| `have_has_third_person` | Item 6 missed | **L2** | Review third-person singular *has* with team and role nouns. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Items 5 and 6 review `les_a1_have_has` and are scored as prerequisite review, not as new evidence for this lesson's skills.
3. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
4. Items target authored lesson content; no external source text is reproduced.