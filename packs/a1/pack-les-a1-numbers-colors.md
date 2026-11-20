# Practice Pack — `les_a1_numbers_colors`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_numbers_colors_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_numbers_colors.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_numbers_colors_v1
lesson_id: les_a1_numbers_colors
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
item_id: `grm_numbers_colors_001`
skill: `grammar.number_agreement`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "There is three keyboards on the desk."
    br_pt_form: "Há três teclados na mesa."
    note: "pt-BR 'há' is invariable, so L1 transfer keeps the singular 'is'; English uses 'are' with a plural subject"
  - option: "There have three keyboards on the desk."
    br_pt_form: "Tem três teclados na mesa."
    note: "pt-BR 'ter/tem' is not the English existential verb; English says 'there is/are', never 'there have'"
  - option: "There are three keyboard on the desk."
    br_pt_form: "Há três teclado na mesa."
    note: "English marks the plural on the noun after a numeral; the numeral alone does not carry the plural"
```

**Item:**
> Choose the correct sentence about the new workstation.

| Slot | Value |
|------|-------|
| A | "There is three keyboards on the desk." |
| B | **"There are three keyboards on the desk."** ✓ |
| C | "There have three keyboards on the desk." |
| D | "There are three keyboard on the desk." |

**Key:** B

**Feedback:**
> The subject "three keyboards" is plural, so English needs **`There are three keyboards on the desk.`** **A** transfers the invariable pt-BR "há", **C** translates "tem" literally as "have", and **D** forgets the plural -s on the noun.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_numbers_colors_002`
skill: `grammar.ordinal_floor_names`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "Marta's desk is on the three floor."
    br_pt_form: "A mesa da Marta é no terceiro andar."
    note: "floor names take the ordinal in both languages; the cardinal 'three' is not a floor name in English"
  - option: "Marta's desk is on the 3th floor."
    br_pt_form: "A mesa da Marta é no 3º andar."
    note: "the ordinal for 3 is 'third'; '3th' mixes a figure with an invented suffix and is not written English"
  - option: "Marta's desk is on the second floor."
    br_pt_form: "A mesa da Marta é no segundo andar."
    note: "correct ordinal form, but the wrong floor: the desk is on the third floor, not the second"
```

**Item:**
> The elevator stops at every floor and Marta's desk is on the third floor. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "Marta's desk is on the second floor." |
| B | "Marta's desk is on the 3th floor." |
| C | **"Marta's desk is on the third floor."** ✓ |
| D | "Marta's desk is on the three floor." |

**Key:** C

**Feedback:**
> Floor names in English use ordinals: **`Marta's desk is on the third floor.`** **A** gives the wrong floor, **B** invents the suffix "-th" on the figure, and **D** uses the cardinal number where an ordinal is required.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_numbers_colors_001`
skill: `vocab.number_words_context`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I am in seat for."
    br_pt_form: "Eu estou no assento 'para'."
    note: "'for' is the preposition; the number four sounds similar but is spelled with 'ou'"
  - option: "I am in seat forth."
    br_pt_form: "Eu estou no assento 'adiante'."
    note: "'forth' is a direction word and is not the number printed on the ticket"
  - option: "I am in four seat."
    br_pt_form: "Eu estou em quatro assento."
    note: "in this English pattern the noun comes before the number ('seat four'), not after it"
```

**Item:**
> Your conference badge says Seat 4 and you must write the number as a word in the report. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"I am in seat four."** ✓ |
| B | "I am in seat for." |
| C | "I am in seat forth." |
| D | "I am in four seat." |

**Key:** A

**Feedback:**
> The ticket number is written as the word: **`I am in seat four.`** **B** confuses the number with the preposition "for", **C** uses the direction word "forth", and **D** moves the number into the noun slot.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, prerequisite review

```yaml
item_id: `voc_numbers_colors_002`
skill: `vocab.articles_color_objects`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_articles_nouns`
distractors:
  - option: "Use a orange cable for the red server."
    br_pt_form: "Use um cabo laranja para o servidor vermelho."
    note: "'orange' starts with a vowel sound, so English needs 'an'; pt-BR 'um' does not change with the following sound"
  - option: "Use the orange cable for the red server."
    br_pt_form: "Use o cabo laranja para o servidor vermelho."
    note: "the label is the first mention of the cable, so the definite article is not natural here"
  - option: "Use it orange cable for the red server."
    br_pt_form: "Use ele cabo laranja para o servidor vermelho."
    note: "a pronoun cannot occupy the article slot in front of a countable noun"
```

**Item:**
> A label on the rack reads: "___ orange cable for the red server." Choose the correct completion.

| Slot | Value |
|------|-------|
| A | "Use a orange cable for the red server." |
| B | "Use the orange cable for the red server." |
| C | **"Use an orange cable for the red server."** ✓ |
| D | "Use it orange cable for the red server." |

**Key:** C

**Feedback:**
> The label introduces the cable for the first time, and "orange" begins with a vowel sound, so the correct form is **`Use an orange cable for the red server.`** **A** ignores the vowel sound, **B** uses a definite article for a first mention, and **D** puts a pronoun in the article position.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_numbers_colors_001`
skill: `reading.desk_notice_detail`
type: `detail_identification`
difficulty_b: -0.3
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "The blue mouse."
    br_pt_form: "O mouse azul."
    note: "the notice states that the blue mouse is broken, so it is the wrong device"
  - option: "The black keyboard."
    br_pt_form: "O teclado preto."
    note: "the notice never gives the keyboards a color, and the instruction is about the mouse"
  - option: "One of the three monitors."
    br_pt_form: "Um dos três monitores."
    note: "the monitors are only an equipment count; the instruction names the mouse"
```

**Stimulus:**
> "Desk 4 notice: we have three monitors, two keyboards, one blue mouse and one black mouse. The blue mouse is broken. Use the black mouse."

**Item:**
> Which device works at Desk 4?

| Slot | Value |
|------|-------|
| A | "The blue mouse." |
| B | "The black keyboard." |
| C | **"The black mouse."** ✓ |
| D | "One of the three monitors." |

**Key:** C

**Feedback:**
> The notice says the blue mouse is broken and instructs: **`Use the black mouse.`** **A** is the broken device, **B** changes the device and adds a color the text never gives, and **D** points to a count of monitors instead of the item to use.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Reading, prerequisite review

```yaml
item_id: `rdg_numbers_colors_002`
skill: `reading.lab_notice_detail`
type: `detail_identification`
difficulty_b: -0.4
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_articles_nouns`
distractors:
  - option: "Buy a new mouse."
    br_pt_form: "Compre um mouse novo."
    note: "the notice asks you to move an existing item, not to buy one"
  - option: "Move the orange chair."
    br_pt_form: "Mova a cadeira laranja."
    note: "the chair appears only as the place where the mouse was found, not as the object to move"
  - option: "Clean Desk 8."
    br_pt_form: "Limpe a mesa 8."
    note: "Desk 8 is only the location in the first sentence; no cleaning task is requested"
```

**Stimulus:**
> "Lab notice: a mouse is on Desk 8, next to an orange chair. The mouse belongs to the team. Bring the mouse to Room 3."

**Item:**
> What does the notice ask you to do?

| Slot | Value |
|------|-------|
| A | "Buy a new mouse." |
| B | "Move the orange chair." |
| C | "Clean Desk 8." |
| D | **"Bring the mouse to Room 3."** ✓ |

**Key:** D

**Feedback:**
> The final sentence of the notice is explicit: **`Bring the mouse to Room 3.`** **A** invents a purchase, while **B** and **C** turn location details into actions the notice never requests.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_numbers_colors_001`
skill: `pronunciation.numbers_colors_minimal_pairs`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_numbers_colors_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *three* /θriː/ starts with the th sound /θ/, with the tongue between the teeth — not the /tr/ cluster of *tree*. *four* /fɔːr/ and *for* /fɔːr/ sound the same in most US accents, but *four* is a number, not a preposition.
**Step 2 — produce (ASR-scored):** read aloud:

> "I have three blue tickets and four red cables."

**Target phonemes:** /θ/ in *three* · clear /r/ in *four* · /uː/ in *blue*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `there_be_number_agreement` | Item 1 missed | **L2** | Contrast *There is one monitor* and *There are three monitors* in short requests. |
| `ordinal_floor_names` | Item 2 missed | **L2** | Practice ordinal floor and seat names (*first, second, third*). |
| `number_words_in_context` | Item 3 missed | **L2** | Write ticket, seat and desk numbers as words (*seat four, Desk 2*). |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.