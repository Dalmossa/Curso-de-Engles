# Practice Pack — `les_a1_time_dates`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_time_dates_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_time_dates.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_time_dates_v1
lesson_id: les_a1_time_dates
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
| Reading | 1 | 1–2 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_time_oclock_001`
skill: `vocab.time.oclock`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "It's nine past nine."
    br_pt_form: "São nove para nove."
    note: "unnatural in English; the wording resembles the Portuguese nove para nove"
  - option: "It's nine fifteen."
    br_pt_form: "São nove e quinze."
    note: "expresses 9:15, not the exact hour"
  - option: "It's nine to ten."
    br_pt_form: "São nove para as dez."
    note: "expresses 9:50, not 9:00"
```

**Item:**
> In a stand-up you need to say the meeting starts at exactly nine. Choose the natural expression.

| Slot | Value |
|------|-------|
| A | "It's nine past nine." |
| B | **"It's nine o'clock."** ✓ |
| C | "It's nine fifteen." |
| D | "It's nine to ten." |

**Key:** B

**Feedback:**
> **`It's nine o'clock.`** is the natural way to state an exact hour. **A** is unnatural in English, **C** is 9:15, and **D** is 9:50.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_time_telling_001`
skill: `grammar.time.telling`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "What hour is it now?"
    br_pt_form: "Que hora é agora?"
    note: "hour is not the noun English uses to ask for the current time"
  - option: "Which time is it now?"
    br_pt_form: "Qual tempo é agora?"
    note: "calque of the Portuguese qual; which does not select a time point"
  - option: "What time does it have?"
    br_pt_form: "Que horas ele tem?"
    note: "literal translation of que horas ele tem; English uses is it"
```

**Item:**
> Choose the most natural way to ask for the current time in a chat.

| Slot | Value |
|------|-------|
| A | **"What time is it now?"** ✓ |
| B | "What hour is it now?" |
| C | "Which time is it now?" |
| D | "What time does it have?" |

**Key:** A

**Feedback:**
> **`What time is it now?`** is the standard question. **B** uses "hour" incorrectly, **C** is unnatural, and **D** calques the Portuguese structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_time_schedule_001`
skill: `reading.time.schedule`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "At half past ten."
    br_pt_form: "Às dez e meia."
    note: "this is the sprint review time in the stimulus, not the stand-up"
  - option: "At three thirty PM."
    br_pt_form: "Às três e meia da tarde."
    note: "this is the demo time in the stimulus, not the stand-up"
  - option: "At noon."
    br_pt_form: "Ao meio-dia."
    note: "no time in the stimulus corresponds to noon"
```

**Stimulus:**
> "Good morning team. Let's start the stand-up at nine o'clock. The demo is scheduled for three thirty PM today. The sprint review is on Monday at half past ten."

**Item:**
> What time is the stand-up?

| Slot | Value |
|------|-------|
| A | "At half past ten." |
| B | **"At nine o'clock."** ✓ |
| C | "At three thirty PM." |
| D | "At noon." |

**Key:** B

**Feedback:**
> The stimulus states **`Let's start the stand-up at nine o'clock.`** **A** is the sprint review time, **C** is the demo time, and **D** is not in the stimulus.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_time_ampm_001`
skill: `vocab.time.ampm`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "12:30 AM"
    br_pt_form: "12h30 da madrugada"
    note: "AM marks the hours before noon, so this reads as night or early morning"
  - option: "1:30 PM"
    br_pt_form: "13h30"
    note: "one hour later than the scheduled twelve thirty"
  - option: "12:30"
    br_pt_form: "12h30"
    note: "drops AM/PM, so the afternoon cannot be identified"
```

**Item:**
> You have a call scheduled for twelve thirty in the afternoon. What is the correct expression?

| Slot | Value |
|------|-------|
| A | "12:30 AM" |
| B | **"12:30 PM"** ✓ |
| C | "1:30 PM" |
| D | "12:30" |

**Key:** B

**Feedback:**
> **`12:30 PM`** is twelve thirty in the afternoon. **A** is before noon, **C** is an hour later, and **D** drops AM/PM.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_time_expressions_001`
skill: `pronunciation.time.expressions`
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

**Step 1 — hear the contrast:** *half* /hæf/ starts with a clear /h/; *o'clock* /əˈklɒk/ ends with /k/ without epenthesis. *quarter to* requires /t/ final.

**Step 2 — produce (ASR-scored):** read aloud:

> "It's half past nine AM. The meeting is on Monday at three thirty PM."

**Target phonemes:** /h/ in *half*, /k/ in *o'clock*, /t/ in *to*, smooth linking between *July* and *twenty-second*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_days_months_001`
skill: `vocab.time.days_months`
type: `contextual_selection`
difficulty_b: -0.6
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_days_months`
distractors:
  - option: "Twenty-second of July"
    br_pt_form: "Vinte e dois de julho"
    note: "direct calque of the Portuguese date order; English puts the month first"
  - option: "Twenty-second July"
    br_pt_form: "No dia vinte e dois de julho"
    note: "reversed order; the month comes before the day in US English"
  - option: "July twenty-two"
    br_pt_form: "Julho vinte e dois"
    note: "missing the ordinal suffix -second"
```

**Item:**
> You need to state your birthday in US English. Which order is correct?

| Slot | Value |
|------|-------|
| A | "Twenty-second of July" |
| B | **"July twenty-second"** ✓ |
| C | "Twenty-second July" |
| D | "July twenty-two" |

**Key:** B

**Feedback:**
> In US English, dates follow ***Month Day*** with an ordinal: **`July twenty-second.`** **A** and **C** follow the Portuguese order, and **D** drops the ordinal suffix.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Grammar, prerequisite review

```yaml
item_id: `grm_time_prepositions_001`
skill: `grammar.time.prepositions`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_days_months`
distractors:
  - option: "The meeting is on nine o'clock"
    br_pt_form: "A reunião é na nove horas"
    note: "on is used for days and dates, not for clock times"
  - option: "The meeting is in nine o'clock"
    br_pt_form: "A reunião é dentro das nove horas"
    note: "in is used for months and years, not for clock times"
  - option: "The meeting is by nine o'clock"
    br_pt_form: "A reunião é até nove horas"
    note: "by means no later than, not a fixed time"
```

**Item:**
> Choose the correct preposition for a clock time.

| Slot | Value |
|------|-------|
| A | **"The meeting is at nine o'clock"** ✓ |
| B | "The meeting is on nine o'clock" |
| C | "The meeting is in nine o'clock" |
| D | "The meeting is by nine o'clock" |

**Key:** A

**Feedback:**
> Clock times take ***at***: **`The meeting is at nine o'clock.`** **on** is for days and dates, **in** is for months and years, and **by** means no later than.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `time_telling_o_clock` | Item 1 missed | **L2** | Contrast *o'clock* vs *past/to* with clock faces. |
| `prepositions_at_on_in` | Item 7 missed | **L2** | Drill *at* time, *on* day/date, *in* month/year. |
| `am_pm_distinction` | Item 4 missed | **L2** | Practice 12-hour clock mapping to 24-hour. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.