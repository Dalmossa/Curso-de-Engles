# Practice Pack — `les_a2_it_typescript_basics`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_typescript_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_typescript_basics.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_typescript_basics_v1
lesson_id: les_a2_it_typescript_basics
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
item_id: grm_ts_inference_agree_001
skill: `grammar.ts_type_inference`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "TypeScript infer the type, so we don't need to write it."
    br_pt_form: "TypeScript inferir o tipo, então não precisamos escrever."
    note: "third-person singular needs the -s ending: 'infers'"
  - option: "TypeScript is infer the type, so we don't need to write it."
    br_pt_form: "TypeScript está infer o tipo, então não precisamos escrever."
    note: "the progressive does not fit a general statement about the compiler"
  - option: "TypeScript don't infer the type, so we don't need to write it."
    br_pt_form: "TypeScript não infere o tipo, então não precisamos escrever."
    note: "'don't' cannot agree with a singular subject and contradicts the clause"
```

**Item:**
> You are describing type inference in a review note. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"TypeScript infers the type, so we don't need to write it."** ✓ |
| B | "TypeScript infer the type, so we don't need to write it." |
| C | "TypeScript is infer the type, so we don't need to write it." |
| D | "TypeScript don't infer the type, so we don't need to write it." |

**Key:** A

**Feedback:**
> A singular subject takes the *-s* ending in the present simple: **`TypeScript infers the type, so we don't need to write it.`** **B** drops the ending, **C** turns a general rule into a progressive action, and **D** uses a plural negative with a singular subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_ts_review_detail_001
skill: `reading.ts_review_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The interface is async and returns a Promise."
    br_pt_form: "A interface é assíncrona e retorna uma Promise."
    note: "the note calls the function async, not the interface"
  - option: "The generic turns null into a string."
    br_pt_form: "O genérico transforma nulo em string."
    note: "the generic links two types; it does not convert a value"
  - option: "The type guard removes the id from the profile."
    br_pt_form: "A guarda de tipo remove o id do perfil."
    note: "the guard narrows the id before use; it does not delete a field"
```

**Stimulus:**
> "Review note: the `Profile` interface has an `id` of type `string | null`. The function is async, so we await the API call. The generic keeps the input and output types together. A type guard narrows the `id` before we use it."

**Item:**
> Which statement is true according to the review note?

| Slot | Value |
|------|-------|
| A | **The API call is awaited because the function is async.** ✓ |
| B | The interface is async and returns a Promise. |
| C | The generic turns null into a string. |
| D | The type guard removes the id from the profile. |

**Key:** A

**Feedback:**
> The note says **`The function is async, so we await the API call`**. **B** assigns async to the wrong thing, **C** gives the generic a conversion role it does not have, and **D** mistakes narrowing for removing a field.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_ts_generics_001
skill: `vocab.ts_core_types`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "A type guard."
    br_pt_form: "Uma guarda de tipo."
    note: "the guard checks a value at runtime; it does not link input and output types"
  - option: "A union type."
    br_pt_form: "Um tipo união."
    note: "a union lists alternatives for one value; it does not relate two positions"
  - option: "An interface."
    br_pt_form: "Uma interface."
    note: "an interface names the expected fields of an object, not the type relationship"
```

**Item:**
> A teammate says: "This keeps the input type and the output type linked." Which term do they mean?

| Slot | Value |
|------|-------|
| A | A type guard. |
| B | A union type. |
| C | An interface. |
| D | **A generic.** ✓ |

**Key:** D

**Feedback:**
> **`A generic`** is the term for a type parameter that preserves the link between what goes in and what comes out. **A** checks a value, **B** lists alternatives for a single value, and **C** describes the shape of an object.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_ts_inference_note_001
skill: `reading.ts_inference_note`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Because TypeScript cannot read numbers."
    br_pt_form: "Porque TypeScript não consegue ler números."
    note: "the note shows inference working from a value; there is no such limitation"
  - option: "Because the city name is a number."
    br_pt_form: "Porque o nome da cidade é um número."
    note: "Recife is a string literal, so this contradicts the note"
  - option: "Because every constant needs an annotation."
    br_pt_form: "Porque toda constante precisa de anotação."
    note: "the author removed the annotation from the constant, so the opposite is true"
```

**Stimulus:**
> "I removed the annotation on `const city = 'Recife'`. TypeScript reads the value and keeps the type. I kept the annotation on `let port: number or string` because the value can change later."

**Item:**
> Why did the author keep the annotation on `port`?

| Slot | Value |
|------|-------|
| A | Because TypeScript cannot read numbers. |
| B | **Because the value can change later.** ✓ |
| C | Because the city name is a number. |
| D | Because every constant needs an annotation. |

**Key:** B

**Feedback:**
> The note states the reason directly: **`because the value can change later`**. **A** invents a limitation, **C** misreads the string literal, and **D** is contradicted by the annotation that was removed from `city`.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_ts_technical_stress_001
skill: `pronunciation.ts_technical_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_ts_technical_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *INterface* /ˈɪntərfeɪs/ puts the stress on the first syllable, while a Portuguese reading tends to even the syllables out. *generic* /dʒəˈnerɪk/ moves the stress to the second syllable, and *Promise* /ˈprɑːmɪs/ keeps it on the first — not on the last as in *promessa*. *await* /əˈweɪt/ begins with a weak /ə/ and carries the stress on /weɪt/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The interface uses a generic, and we await the Promise."

**Target phonemes:** /ˈɪntərfeɪs/ in *interface* · /dʒəˈnerɪk/ in *generic* · /əˈweɪt/ in *await* · /ˈprɑːmɪs/ in *Promise* (release the final /s/; do not add a final vowel).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_ts_null_modals_001
skill: `grammar.ts_null_modals`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "You can check the null case before you use the id."
    br_pt_form: "Você pode verificar o caso nulo antes de usar o id."
    note: "'can' expresses possibility, but the review states a requirement"
  - option: "You must to check the null case before you use the id."
    br_pt_form: "Você deve verificar o caso nulo antes de usar o id."
    note: "a modal is followed by the bare infinitive, not by 'to'"
  - option: "You don't must check the null case before you use the id."
    br_pt_form: "Você não deve verificar o caso nulo antes de usar o id."
    note: "'must' does not take 'don't'; the negative form is 'must not'"
```

**Item:**
> Reviewing the null case of an id, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "You can check the null case before you use the id." |
| B | **"You must check the null case before you use the id."** ✓ |
| C | "You must to check the null case before you use the id." |
| D | "You don't must check the null case before you use the id." |

**Key:** B

**Feedback:**
> **`You must check the null case before you use the id.`** uses *must* plus the bare infinitive for a requirement. **A** weakens it to a possibility, **C** inserts *to* after the modal, and **D** builds an impossible negative with *don't*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_ts_label_skim_001
skill: `vocab.ts_label_skim`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "union type (string or null)"
    br_pt_form: "tipo união (string ou nulo)"
    note: "this label lists alternatives for a value; it does not check the value"
  - option: "generic <T>"
    br_pt_form: "genérico <T>"
    note: "the generic links input and output types; it is not a runtime check"
  - option: "await Promise"
    br_pt_form: "esperar a Promise"
    note: "await handles the asynchronous result; it does not narrow a type"
```

**Item:**
> Skim this review checklist: "interface • union type (string or null) • generic <T> • await Promise • type guard". Which label names the check that narrows a value?

| Slot | Value |
|------|-------|
| A | "union type (string or null)" |
| B | "generic <T>" |
| C | **"type guard"** ✓ |
| D | "await Promise" |

**Key:** C

**Feedback:**
> **`type guard`** is the label for the check that narrows a value before use. **A** only lists alternatives, **B** relates two types, and **D** waits for an asynchronous result.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `ts_inference_agreement` | Item 1 or item 6 missed | **L2** | Contrast *TypeScript infers* with *we don't need* and *you must check* in short review sentences, so the -s ending and the modal form are tied to their subjects. |
| `ts_term_function_mapping` | Item 3 or item 7 missed | **L2** | Recycle *interface*, *union type*, *generic*, *type guard* and *await* as function questions instead of bare translations. |
| `ts_review_detail_skim` | Items 2 or 4 missed | **L2** | Skim a short review note for the reason behind the annotation and for which element is async before answering detail questions. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a1_reading_skimming` and carry `prereq_lesson` for the interleaving rule.
4. Item 2 and item 4 use distinct detail targets (async/await chain vs. reason for keeping an annotation), so neither can be answered by the other's sentence.
5. All code-shaped labels, dialogues, definitions and distractors were authored for this pack; no external source text is reproduced or adapted.
