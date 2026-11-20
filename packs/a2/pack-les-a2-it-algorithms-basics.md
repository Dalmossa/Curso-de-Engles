# Practice Pack — `les_a2_it_algorithms_basics`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_algorithms_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_algorithms_basics.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_algorithms_basics_v1
lesson_id: les_a2_it_algorithms_basics
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
item_id: grm_algos_comparative_faster_001
skill: `grammar.algorithms_comparatives`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "A hash map lookup is more fast than a linear scan."
    br_pt_form: "Uma consulta em hash map é mais rápida que uma varredura linear."
    note: "'fast' is a short adjective, so the comparative is 'faster', not 'more fast'"
  - option: "A hash map lookup is fast than a linear scan."
    br_pt_form: "Uma consulta em hash map é rápida que uma varredura linear."
    note: "a comparison needs the -er ending before 'than'; 'fast than' is incomplete"
  - option: "A hash map lookup is fastest than a linear scan."
    br_pt_form: "Uma consulta em hash map é a mais rápida que uma varredura linear."
    note: "'fastest' is the superlative and does not take 'than' when two paths are compared"
```

**Item:**
> You are comparing two lookup paths in a code review note. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "A hash map lookup is more fast than a linear scan." |
| B | **"A hash map lookup is faster than a linear scan."** ✓ |
| C | "A hash map lookup is fast than a linear scan." |
| D | "A hash map lookup is fastest than a linear scan." |

**Key:** B

**Feedback:**
> The short adjective *fast* takes **-er**: **`A hash map lookup is faster than a linear scan.`** **A** doubles the comparative with *more*, **C** drops the *-er* ending, and **D** uses the superlative in a two-way comparison.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_algos_review_bottleneck_001
skill: `reading.algos_review_note_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The tree."
    br_pt_form: "A árvore."
    note: "the tree stays as it is; the note explicitly rules out changing it"
  - option: "The page render."
    br_pt_form: "A renderização da página."
    note: "the render is where the slowdown appears, not the part Ana will replace"
  - option: "The key lookup."
    br_pt_form: "A consulta por chave."
    note: "the key lookup is the planned replacement, not the part being replaced"
```

**Stimulus:**
> "Review note: the customer list is scanned from the first item every time we render the page. Ana will replace that scan with a key lookup next sprint. The tree stays as it is because it already returns results quickly."

**Item:**
> Which part will Ana replace next sprint?

| Slot | Value |
|------|-------|
| A | The tree. |
| B | **The scan from the first item.** ✓ |
| C | The page render. |
| D | The key lookup. |

**Key:** B

**Feedback:**
> The note says **`Ana will replace that scan with a key lookup`**. **A** stays as it is, **C** is only the place where the problem shows up, and **D** is what comes after the replacement.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_algos_hash_map_lookup_001
skill: `vocab.it_computer_terms`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "An array."
    br_pt_form: "Um array."
    note: "an array keeps items in order and by index, not under named keys"
  - option: "A linear scan."
    br_pt_form: "Uma varredura linear."
    note: "a scan is the operation of checking items, not a place that stores them"
  - option: "A sorted list."
    br_pt_form: "Uma lista ordenada."
    note: "sorting helps a binary search but does not store values under ids"
```

**Item:**
> A colleague says: "Store each customer under its id and read the customer back by that id." Which structure matches the description?

| Slot | Value |
|------|-------|
| A | "An array." |
| B | **"A hash map."** ✓ |
| C | "A linear scan." |
| D | "A sorted list." |

**Key:** B

**Feedback:**
> **`A hash map`** stores a value under a key, so the id works as the key. **A** uses indexes, **C** is a way to search rather than a structure, and **D** keeps order but not key-based access.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_algos_complexity_row_001
skill: `reading.algos_complexity_table_scan`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Array, access by index."
    br_pt_form: "Array, acesso por índice."
    note: "that row is O(1), not O(log n)"
  - option: "Hash map, average key lookup."
    br_pt_form: "Hash map, consulta por chave em média."
    note: "the average key lookup row reads O(1)"
  - option: "Hash map, worst case."
    br_pt_form: "Hash map, pior caso."
    note: "the worst case row reads O(n), not O(log n)"
```

**Stimulus:**
> "Complexity legend — Array: access by index O(1), unsorted search O(n). Hash map: average key lookup O(1), worst case O(n). Balanced tree: search O(log n)."

**Item:**
> Which row gives O(log n) for a search?

| Slot | Value |
|------|-------|
| A | Array, access by index. |
| B | Hash map, average key lookup. |
| C | **Balanced tree, search.** ✓ |
| D | Hash map, worst case. |

**Key:** C

**Feedback:**
> Only the **`Balanced tree: search O(log n)`** row matches. **A** and **B** are O(1) rows, and **D** is O(n) — the legend separates average and worst case on purpose.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_algos_bigo_stress_001
skill: `pronunciation.algos_bigo_word_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_algos_bigo_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *ALgorithm* /ˈælɡərɪðəm/ carries the stress on the first syllable, while *algoRITHM* sounds like a Portuguese word with a late accent. *HASH map* uses /ʃ/ as in *ship*, never /s/. *O(1)* is spoken *oh one* /ˌoʊ ˈwʌn/, not *zero one*.

**Step 2 — produce (ASR-scored):** read aloud:

> "This algorithm uses a hash map, so the O(1) lookup stays fast as the input grows."

**Target phonemes:** /ð/ in *this* and in the middle of *algorithm* · /ʃ/ in *hash* · /ˌoʊ ˈwʌn/ in *O(1)* · /z/ final in *grows* (release the consonant; do not add a final vowel).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_algos_terms_subject_agreement_001
skill: `grammar.algos_terms_subject_agreement`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The hash maps stores user ids."
    br_pt_form: "Os hash maps armazena ids de usuário."
    note: "a plural subject takes the base verb; the -s ending belongs to a singular subject"
  - option: "The hash map store user ids."
    br_pt_form: "O hash map armazenam ids de usuário."
    note: "a singular subject needs -s on the present simple verb"
  - option: "The hash maps are store user ids."
    br_pt_form: "Os hash maps são armazenar ids de usuário."
    note: "the passive construction changes the meaning and is not needed here"
```

**Item:**
> Reviewing technical terms before a review call, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The hash maps stores user ids." |
| B | "The hash map store user ids." |
| C | "The hash maps are store user ids." |
| D | **"The hash maps store user ids."** ✓ |

**Key:** D

**Feedback:**
> A plural subject uses the base verb: **`The hash maps store user ids.`** **A** adds *-s* to a plural, **B** omits *-s* from a singular subject, and **C** turns an active statement into a passive one.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_algos_terms_label_scan_001
skill: `vocab.algos_terms_label_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "O(1) lookup."
    br_pt_form: "Consulta O(1)."
    note: "constant-time lookup is not the logarithmic search asked for"
  - option: "O(n) scan."
    br_pt_form: "Varredura O(n)."
    note: "a linear scan grows in proportion to the input, not logarithmically"
  - option: "512 MB cache."
    br_pt_form: "Cache de 512 MB."
    note: "this label names a memory size, not a search complexity"
```

**Stimulus:**
> "Skim this review label: O(1) lookup • O(n) scan • O(log n) tree • 512 MB cache."

**Item:**
> Which label names the structure with logarithmic search?

| Slot | Value |
|------|-------|
| A | "O(1) lookup." |
| B | **"O(log n) tree."** ✓ |
| C | "O(n) scan." |
| D | "512 MB cache." |

**Key:** B

**Feedback:**
> **`O(log n) tree`** is the only label with a logarithmic complexity. **A** is constant time, **C** is linear time, and **D** is a memory size — skim for the complexity notation, not for the first number you see.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `comparative_than_drill` | Item 1 or item 6 missed | **L2** | Contrast *faster than* with *more fast than* and *the maps store* with *the map stores* in short review sentences. |
| `structure_function_mapping` | Item 3 missed | **L2** | Recycle *array*, *hash map*, *key* and *lookup* as function questions instead of bare translations. |
| `complexity_legend_skim` | Items 2, 4 or 7 missed | **L2** | Skim the review note and the complexity legend for the replaced part, the O(log n) row and the label before answering detail questions. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a1_reading_skimming` and carry `prereq_lesson` for the interleaving rule.
4. Item 2's review note and item 4's complexity legend use distinct detail targets (the replaced scan vs. the O(log n) row), so neither can be answered by the other's stimulus.
5. The short words *faster*, *more fast* and *fastest* are never distinguished by capitalization alone; every option changes the grammar, not just the case.
6. All term definitions, stimuli, dialogues and distractors were authored for this pack; no external source text is reproduced or adapted.
