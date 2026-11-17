# Practice Pack — `les_a1_alphabet_sounds`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_alphabet_sounds_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_alphabet_sounds.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_alphabet_sounds_v1
lesson_id: les_a1_alphabet_sounds
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
item_id: `voc_letters_vowels_001`
skill: `vocab.alphabet.vowel`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "B, C, D, F, G"
    br_pt_form: "consoantes / B, C, D, F, G"
    note: "these are consonants, not vowels"
  - option: "A, B, C, D, E"
    br_pt_form: "mistura de vogais e consoantes"
    note: "mixes one vowel with consonants; not the full vowel set"
  - option: "X, Y, Z"
    br_pt_form: "consoantes finais / X, Y, Z"
    note: "these are consonants at the end of the alphabet"
```

**Item:**
> Which letters are the **vowels** in English?

| Slot | Value |
|------|-------|
| A | "B, C, D, F, G" |
| B | **"A, E, I, O, U"** ✓ |
| C | "A, B, C, D, E" |
| D | "X, Y, Z" |

**Key:** B

**Feedback:**
> The English **vowels** are **`A, E, I, O, U`**. The other options list consonants or a mixed set.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_letters_consonants_001`
skill: `vocab.alphabet.consonant`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "A, E, I, O, U"
    br_pt_form: "vogais / A, E, I, O, U"
    note: "these are the vowels, not the consonants"
  - option: "Only B, C, D"
    br_pt_form: "apenas B, C, D"
    note: "incomplete; English has 21 consonants, not just three"
  - option: "All letters"
    br_pt_form: "todas as letras"
    note: "includes vowels; consonants exclude A, E, I, O, U"
```

**Item:**
> Which letters are the **consonants** in English?

| Slot | Value |
|------|-------|
| A | "A, E, I, O, U" |
| B | **"B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z"** ✓ |
| C | "Only B, C, D" |
| D | "All letters" |

**Key:** B

**Feedback:**
> English has **21 consonants**: every letter except A, E, I, O, U. **A** lists vowels, **C** is incomplete, and **D** wrongly includes vowels.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Grammar, current lesson

```yaml
item_id: `grm_articles_letters_001`
skill: `grammar.articles_letters`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "a B"
    br_pt_form: "um B"
    note: "incorrect: the letter name 'bee' starts with a consonant sound, so it takes 'a'"
  - option: "the F"
    br_pt_form: "o F"
    note: "definite article does not fit this general introduction of a letter"
  - option: "(no article)"
    br_pt_form: "sem artigo"
    note: "a singular countable noun such as a letter name needs an article"
```

**Item:**
> Choose the correct **article** before the letter name **F** ("eff"):

| Slot | Value |
|------|-------|
| A | "a F" |
| B | **"an F"** ✓ |
| C | "the F" |
| D | "(no article)" |

**Key:** B

**Feedback:**
> Use **`an`** before **F** because its name "eff" begins with a vowel sound (/ɛ/). The article depends on sound, not spelling. **A** would fit a consonant sound, while **C** and **D** are not appropriate here.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_letters_email_001`
skill: `reading.alphabet_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "She spells her name slowly."
    br_pt_form: "Ela soletrá seu nome devagar."
    note: "Ana does spell, but the question asks for the email domain"
  - option: "She works in room B."
    br_pt_form: "Ela trabalha na sala B."
    note: "not mentioned; unrelated to the email address"
  - option: "She calls IT support."
    br_pt_form: "Ela liga para o suporte de TI."
    note: "Ana is already speaking with support; not the email detail"
```

**Stimulus:**
> **Ana:** "My email is ana.silva at techcorp dot com. A-N-A dot S-I-L-V-A at T-E-C-H-C-O-R-P dot C-O-M."
>
> **Bruno:** "Can you repeat the domain, please?"
>
> **Ana:** "T-E-C-H-C-O-R-P dot com."

**Item:**
> What is the email **domain** that Ana spells?

| Slot | Value |
|------|-------|
| A | "She spells her name slowly." |
| B | "She works in room B." |
| C | **"techcorp"** ✓ |
| D | "She calls IT support." |

**Key:** C

**Feedback:**
> Ana spells the domain as **`T-E-C-H-C-O-R-P`**, i.e. **techcorp**. The other options are actions or details not asked for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Vocabulary, current lesson

```yaml
item_id: `voc_letters_spelling_001`
skill: `vocab.alphabet.spelling`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "Writing it fast"
    br_pt_form: "Escrevendo rápido"
    note: "spelling is oral, not writing speed"
  - option: "Pronouncing it"
    br_pt_form: "Pronunciando"
    note: "pronunciation says the word; spelling says each letter"
  - option: "Translating it"
    br_pt_form: "Traduzindo"
    note: "translation changes language; spelling stays in English letters"
```

**Item:**
> To **spell** your name means:

| Slot | Value |
|------|-------|
| A | "Writing it fast" |
| B | **"Saying each letter one by one"** ✓ |
| C | "Pronouncing it" |
| D | "Translating it" |

**Key:** B

**Feedback:**
> **Spelling** means saying each letter of a word one by one (A-N-A). **A** is about speed, **C** is pronunciation of the whole word, and **D** is translation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_uppercase_lowercase_001`
skill: `grammar.letter_case`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_alphabet_sounds`
distractors:
  - option: "a" is uppercase
    br_pt_form: "a é maiúscula"
    note: "incorrect: 'a' is the lowercase form"
  - option: "1" is a letter
    br_pt_form: "1 é uma letra"
    note: "digits are not letters; case applies only to letters"
  - option: "@" is uppercase
    br_pt_form: "@ é maiúscula"
    note: "symbols have no uppercase/lowercase form"
```

**Item:**
> Which statement about **uppercase** and **lowercase** is correct?

| Slot | Value |
|------|-------|
| A | "'a' is uppercase" |
| B | **"'A' is uppercase; 'a' is lowercase"** ✓ |
| C | "'1' is a letter" |
| D | "'@' is uppercase" |

**Key:** B

**Feedback:**
> **Uppercase** is the capital form (**A**) and **lowercase** is the small form (**a**). Digits and symbols do not have case.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_letters_names_001`
skill: `pronunciation.letter_names`
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

**Step 1 — hear the contrast:** *A* is "ay" (/eɪ/), starting with a vowel sound; *B* is "bee" (/biː/), starting with a consonant sound /b/. Do not read them with Portuguese letter names.

**Step 2 — produce (ASR-scored):** read aloud:

> "A is ay, B is bee, C is cee."

**Target phonemes:** /eɪ/ in *A*, /b/ in *B*, /siː/ in *C*; clear separation between each letter name.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `article_before_letter_name` | Item 3 missed | **L2** | Contrast *a* vs *an* based on the sound of the letter name (*a B*, *an F*, *an H*). |
| `vowel_consonant_set` | Item 1 or 2 missed | **L2** | Drill the vowel set (A, E, I, O, U) vs the 21 consonants in isolation and in words. |
| `letter_name_clarity` | Item 7 missed | **L2** | Replay model letter names (*ay, bee, cee*) and have the learner repeat with breath-clear onsets. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production (`minimal_pair_production`) and does not substitute for listening-pool calibration; it is blocked on audio render.
3. `br_pt_form` is provided for every scored item with a distractor set (6/6); Item 7 has `br_pt_form: null` per the pronunciation schema.
4. Items target authored lesson content; no external source text is reproduced or adapted.
