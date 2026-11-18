# Practice Pack — `les_a1_food`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_food_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_food.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_food_v1
lesson_id: les_a1_food
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
| Reading | 2 | 1–2 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_food_menu_001`
skill: `vocab.food_basic.items`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "a plate of rice"
    br_pt_form: "um prato de arroz"
    note: "names a food item to eat, not something to drink"
  - option: "some fresh bread"
    br_pt_form: "um pão fresco"
    note: "food category; plausible in a cafeteria but not a drink"
  - option: "an apple"
    br_pt_form: "uma maçã"
    note: "a countable fruit that you eat, not a drink"
```

**Item:**
> You are thirsty after a long meeting. Which option is something you can order to drink?

| Slot | Value |
|------|-------|
| A | "a plate of rice" |
| B | **"a glass of orange juice"** ✓ |
| C | "some fresh bread" |
| D | "an apple" |

**Key:** B

**Feedback:**
> **`a glass of orange juice`** is a drink request: *juice* is a drink, and *a glass of* names a serving. **A**, **C** and **D** name food items you eat.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_food_uncountable_001`
skill: `grammar.countable_uncountable_food`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "I would like a water, please."
    br_pt_form: "Eu gostaria de uma água, por favor."
    note: "uses a before an uncountable noun; water takes some or a serving phrase"
  - option: "I would like one water, please."
    br_pt_form: "Eu gostaria de uma água, por favor."
    note: "counts the water directly; English does not say one water"
  - option: "I would like water some, please."
    br_pt_form: "Eu gostaria de água um pouco, por favor."
    note: "puts some after the noun; the quantifier comes before the noun"
```

**Item:**
> Choose the correct request at the cafeteria.

| Slot | Value |
|------|-------|
| A | "I would like a water, please." |
| B | "I would like one water, please." |
| C | "I would like water some, please." |
| D | **"I would like some water, please."** ✓ |

**Key:** D

**Feedback:**
> **`I would like some water, please.`** is the natural request: *some* comes before the uncountable noun. For a serving, say *a glass of water, please*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_food_cafeteria_note_001`
skill: `reading.food_basic.context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "Rice"
    br_pt_form: "Arroz"
    note: "listed on the menu, so it is not the missing item"
  - option: "Fish"
    br_pt_form: "Peixe"
    note: "listed on the menu, so it is not the missing item"
  - option: "Fruit salad"
    br_pt_form: "Salada de frutas"
    note: "listed on the menu, so it is not the missing item"
```

**Stimulus:**
> "Team lunch is today in the cafeteria. We have rice, fish, bread and fruit salad. There is no meat today. Water and juice are free."

**Item:**
> What is NOT on the menu today?

| Slot | Value |
|------|-------|
| A | "Rice" |
| B | "Fish" |
| C | **"Meat"** ✓ |
| D | "Fruit salad" |

**Key:** C

**Feedback:**
> The note says **`there is no meat today`**, so meat is the item that is not on the menu. Rice, fish and fruit salad are all listed.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_food_meals_001`
skill: `vocab.food_basic.meals`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "breakfast"
    br_pt_form: "café da manhã"
    note: "the morning meal, not the meal at 7 p.m."
  - option: "lunch"
    br_pt_form: "almoço"
    note: "the midday meal, not the evening meal"
  - option: "a snack"
    br_pt_form: "um lanche"
    note: "a small amount of food between meals, not a main meal"
```

**Item:**
> You eat your main meal with your family at 7 p.m. What is this meal called?

| Slot | Value |
|------|-------|
| A | "breakfast" |
| B | "lunch" |
| C | "a snack" |
| D | **"dinner"** ✓ |

**Key:** D

**Feedback:**
> **`dinner`** is the main evening meal. Breakfast is in the morning, lunch is at midday, and a snack is small and between meals.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_food_meal_times_001`
skill: `grammar.time.telling`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_time_dates`
distractors:
  - option: "What time is the lunch?"
    br_pt_form: "Que hora é o almoço?"
    note: "adds the before the meal name; English uses the meal name without the here"
  - option: "What hour is the lunch?"
    br_pt_form: "Que hora é o almoço?"
    note: "hour is not the noun English uses to ask for a time point"
  - option: "What time has the lunch?"
    br_pt_form: "Que horas o almoço tem?"
    note: "literal translation of que horas ele tem; English uses is"
```

**Item:**
> You want to know when the team lunch starts. Choose the natural question.

| Slot | Value |
|------|-------|
| A | "What time is the lunch?" |
| B | "What hour is the lunch?" |
| C | "What time has the lunch?" |
| D | **"What time is lunch?"** ✓ |

**Key:** D

**Feedback:**
> **`What time is lunch?`** is the natural question: *what time* + *is* + the event, with no article before the meal name.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Reading, prerequisite review

```yaml
item_id: `rdg_food_lunch_schedule_001`
skill: `reading.time.schedule`
type: `detail_identification`
difficulty_b: -0.1
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_time_dates`
distractors:
  - option: "at 12:00"
    br_pt_form: "ao meio-dia"
    note: "the start of lunch, not the start of breakfast"
  - option: "at 9:00"
    br_pt_form: "às nove"
    note: "the end of breakfast, not the start"
  - option: "at 15:00"
    br_pt_form: "às quinze"
    note: "the closing time of the kitchen, not the start of breakfast"
```

**Stimulus:**
> "Cafeteria hours: breakfast from 7:00 to 9:00. Lunch from 12:00 to 14:00. The kitchen closes at 15:00."

**Item:**
> When does breakfast start?

| Slot | Value |
|------|-------|
| A | **"at 7:00"** ✓ |
| B | "at 12:00" |
| C | "at 9:00" |
| D | "at 15:00" |

**Key:** A

**Feedback:**
> The schedule says breakfast is **`from 7:00 to 9:00`**, so it starts at 7:00. 9:00 is when it ends, 12:00 starts lunch, and 15:00 is closing time.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_food_thirsty_001`
skill: `pronunciation.th_dental`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *thirsty* /θɜːrsti/ starts with /θ/, made with the tongue between the teeth. Many pt-BR speakers replace it with /t/ ("tirsty") or /d/ ("dirsty"), and that changes the word entirely.
**Step 2 — produce (ASR-scored):** read aloud:

> "I am thirsty. May I have a glass of water, please?"

**Target phonemes:** /θ/ in *thirsty* · /h/ in *have* · final consonant cluster in *thirsty* without an extra vowel.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `food_drinks_vs_food_items` | Item 1 missed | **L2** | Separate eat-items (rice, bread, apples) from drink requests (a glass of juice) using a simple menu. |
| `countable_uncountable_water` | Item 2 missed | **L2** | Drill *some water*, *a glass of water* and *two glasses* in short cafeteria requests. |
| `meals_of_the_day` | Item 4 missed | **L2** | Order breakfast, lunch and dinner by time of day with clock pictures. |
| `lunch_schedule_time_questions` | Item 6 missed | **L2** | Read cafeteria hours and answer what time questions about breakfast and lunch. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 5 and 6 review `les_a1_time_dates` and carry `prereq_lesson`.
4. Items target authored lesson content; no external source text is reproduced.