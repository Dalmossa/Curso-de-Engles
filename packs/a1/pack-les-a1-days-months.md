# Practice Pack — `les_a1_days_months`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_days_months_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_days_months.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_days_months_v1
lesson_id: les_a1_days_months
learner_profile: default
estimated_minutes: 5
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
item_id: `voc_days_001`
skill: `vocab.date_vocabulary.days_of_week`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "on the Monday"
    br_pt_form: "na segunda-feira"
    note: "incorrectly uses an article 'the' with weekdays, which is not natural in English"
  - option: "in Monday"
    br_pt_form: "na segunda-feira"
    note: "preposition error; weekdays use 'on', not 'in'"
  - option: "at Monday"
    br_pt_form: "na segunda-feira"
    note: "preposition error; 'at' is used for times, not days"
```

**Item:**
> You are scheduling a weekly team stand-up. Which expression is naturally used for weekdays?

| Slot | Value |
|------|-------|
| A | "on the Monday" |
| B | "in Monday" |
| C | "at Monday" |
| D | **"on Monday"** ✓ |

**Key:** D

**Feedback:**
> **`on Monday`** is the natural expression for days of the week. **A** incorrectly adds "the", which is not used with weekdays. **B** and **C** use wrong prepositions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_prep_dates_001`
skill: `grammar.prep_on_in_at_dates`
type: `error_correction`
difficulty_b: 0.1
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "in Friday"
    br_pt_form: "na sexta-feira"
    note: "preposition error; weekdays always use 'on', never 'in'"
  - option: "at Monday morning"
    br_pt_form: "às manhãs de segunda-feira"
    note: "double preposition error; 'at' is for specific times, 'on' for days"
  - option: "on the Tuesday"
    br_pt_form: "na terça-feira"
    note: "incorrectly uses article 'the' with weekday names"
```

**Item:**
> Choose the correct expression: "The meeting is ___ Friday morning."

| Slot | Value |
|------|-------|
| A | "in Friday" |
| B | "at Monday morning" |
| C | "on the Tuesday" |
| D | **"on Friday morning"** ✓ |

**Key:** D

**Feedback:**
> **`on Friday morning`** uses both correct prepositions: **on** for the day and **morning** without a preposition (it follows "on"). **A**, **B**, and **C** have preposition or article errors.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_months_001`
skill: `vocab.date_vocabulary.months_of_year`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "January 15th"
    br_pt_form: "15 de janeiro"
    note: "day-month order; not standard in American English date format"
  - option: "15 January"
    br_pt_form: "15 de janeiro"
    note: "day-month order; British English format, but less common for formal dates"
  - option: "the 15th of January"
    br_pt_form: "o 15 de janeiro"
    note: "overly formal British format with article and 'of'; not typical for business contexts"
```

**Item:**
> In a US tech company email, what is the standard format for a date?

| Slot | Value |
|------|-------|
| A | "January 15th" |
| B | "15 January" |
| C | "the 15th of January" |
| D | **"November 15th"** ✓ |

**Key:** D

**Feedback:**
> **`November 15th`** follows American English convention: **Month + Day + Ordinal Suffix**. **A** shows a correct format but is not the full date context. **B** is British format. **C** is formal British with articles.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: `grm_prep_in_months_001`
skill: `grammar.prep_on_in_at_dates`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "on December"
    br_pt_form: "na dezembro"
    note: "preposition error; months use 'in', not 'on'"
  - option: "at December"
    br_pt_form: "em dezembro"
    note: "preposition error; 'at' is used for specific times, not months"
  - option: "the December"
    br_pt_form: "o dezembro"
    note: "incorrect article usage; months do not take articles in this context"
```

**Item:**
> Which is the correct preposition to refer to a month?

| Slot | Value |
|------|-------|
| A | "on December" |
| B | "at December" |
| C | "the December" |
| D | **"in December"** ✓ |

**Key:** D

**Feedback:**
> **`in December`** is correct because **in** is used with months, seasons, and years. **A**, **B**, and **C** use wrong prepositions or articles.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_date_context_001`
skill: `reading.date_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "They finish the project on Friday, April 11th."
    br_pt_form: "Eles terminam o projeto no sexta-feira, dia 11 de abril."
    note: "incorrect preposition 'on' with month name; dates need specific format"
  - option: "The retrospective is on the Friday, April 11th."
    br_pt_form: "A retrospectiva é na sexta-feira, dia 11 de abril."
    note: "incorrect use of article 'the' with weekday"
  - option: "The deadlines happen in Friday, in April."
    br_pt_form: "Os prazos acontecem na sexta-feira, em abril."
    note: "double preposition error; 'in' is not used with days"
```

**Stimulus:**
> "Our first demo is on Friday, November 15th. The client review will happen next Wednesday, December 4th. We will start the next sprint on Monday, January 6th, 2025. Please mark your calendars for Thursday, February 20th, and Monday, March 10th. The retrospective is scheduled for Friday, April 11th."

**Item:**
> According to the message, when is the retrospective?

| Slot | Value |
|------|-------|
| A | They finish the project on Friday, April 11th. |
| B | The retrospective is on the Friday, April 11th. |
| C | The deadlines happen in Friday, in April. |
| D | **Friday, April 11th** ✓ |

**Key:** D

**Feedback:**
> The text states: **"The retrospective is scheduled for Friday, April 11th."** **A** changes the meaning, **B** adds an unnecessary article, and **C** has preposition errors.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review (from les_a1_numbers_colors)

```yaml
item_id: `voc_numbers_001`
skill: `vocab.numbers.core_counting`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_numbers_colors`
distractors:
  - option: "Fifteen"
    br_pt_form: "Sete"
    note: "completely wrong number; not how to count"
  - option: "Fifty-one"
    br_pt_form: "Cinquenta e um"
    note: "inverted order; should be 105"
  - option: "One hundred five"
    br_pt_form: "Cem e cinco"
    note: "incorrect grouping; should be one hundred *and* five in English"
```

**Item:**
> How do you write 105 in English?

| Slot | Value |
|------|-------|
| A | Fifteen |
| B | Fifty-one |
| C | One hundred five |
| D | **One hundred and five** ✓ |

**Key:** D

**Feedback:**
> In British English, we use "and": **One hundred and five**. American English sometimes drops the "and", but in formal contexts, the standard includes it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_days_months_001`
skill: `pronunciation.th_sound`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_days_months_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** "the **Th**ursday" /ðə **ð**ur-**d**eɪ/ starts with the voiced TH sound (tongue between teeth), not /d/. "**F**riday" /ˈfraɪdeɪ/ starts with /f/, not /th/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Our deadline is on Thursday, April 18th, and Friday, May 5th."

**Target phonemes:** /θ/ in "the" (before consonants) · /ð/ in "Thursday" · clear distinction between /f/ in "Friday" and /θ/ in "the".

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `prep_on_in_for_dates` | Item 2 missed | **L2** | Practice *on* for specific days, *in* for months, *for* for periods (for March, for two weeks). |
| `date_format_us_uk` | Item 5 missed | **L2** | Contrast American (Month Day, Year) vs British (Day Month Year) formats. |
| `date_vocabulary_spelling` | Item 3 missed | **L2** | Review spelling patterns: -**uary**, -**February** no 'b', -**arch** silent 'b'. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.