# Practice Pack — `les_a2_restaurant_shopping`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_restaurant_shopping_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_restaurant_shopping.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_restaurant_shopping_v1
lesson_id: les_a2_restaurant_shopping
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
item_id: grm_restaurant_comparative_than_001
skill: `grammar.restaurant_comparatives`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The appetizer is cheap than the main course."
    br_pt_form: "A entrada é barata que o prato principal."
    note: "the Portuguese 'barata que' maps onto the bare adjective; English short adjectives need -er before than"
  - option: "The appetizer is more cheap than the main course."
    br_pt_form: "A entrada é mais barata que o prato principal."
    note: "'mais barata' suggests 'more cheap', but English uses the inflected form 'cheaper' for a one-syllable adjective"
  - option: "The appetizer is as cheap than the main course."
    br_pt_form: "A entrada é tão barata quanto o prato principal."
    note: "'tão ... quanto' maps onto as ... as, which cannot be combined with than; the meaning here is a comparison, not equality"
```

**Item:**
> You are ordering a light start before the main course. Choose the correct comparison.

| Slot | Value |
|------|-------|
| A | "The appetizer is cheap than the main course." |
| B | **"The appetizer is cheaper than the main course."** ✓ |
| C | "The appetizer is more cheap than the main course." |
| D | "The appetizer is as cheap than the main course." |

**Key:** B

**Feedback:**
> A short adjective takes **-er + than**: **`The appetizer is cheaper than the main course.`** **A** drops the **-er**, **C** doubles the comparison with *more*, and **D** mixes the equality pattern *as ... as* with *than*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_restaurant_bill_included_001
skill: `reading.restaurant_bill_note`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The appetizer was cheaper than the main course."
    br_pt_form: "A entrada era mais barata que o prato principal."
    note: "the price comparison is in the note, but it explains the total, not why no extra cash was left"
  - option: "The waiter forgot to bring the receipt."
    br_pt_form: "O garçom esqueceu de trazer o recibo."
    note: "the note never mentions a missing receipt; Brazilian readers turn the salient 'bill' detail into a service failure"
  - option: "The restaurant was closed at seven."
    br_pt_form: "O restaurante fechava às sete."
    note: "seven is the reservation time in the dialogue, not a closing time stated in this note"
```

**Stimulus:**
> "Dinner note — We asked for the bill after dessert. The waiter said the tip is included, so I left no extra cash. My appetizer was cheaper than Ana's main course, but the total still surprised me."

**Item:**
> Why did the writer leave no extra cash?

| Slot | Value |
|------|-------|
| A | "The appetizer was cheaper than the main course." |
| B | **"The tip is included."** ✓ |
| C | "The waiter forgot to bring the receipt." |
| D | "The restaurant was closed at seven." |

**Key:** B

**Feedback:**
> The note states **`the tip is included, so I left no extra cash`**. **A** is a true detail with the wrong consequence, **C** invents a missing receipt, and **D** confuses the reservation time with a closing time.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_restaurant_bill_check_001
skill: `vocab.restaurant_bill_words`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "the menu"
    br_pt_form: "o cardápio"
    note: "the menu lists what you can order; a Brazilian learner may reach for it when asked to pay because it sits on the table"
  - option: "the tip"
    br_pt_form: "a gorjeta"
    note: "the tip is the extra payment for service, not the amount the restaurant asks you to pay"
  - option: "the receipt"
    br_pt_form: "o recibo / a nota fiscal"
    note: "the receipt proves a payment that already happened; 'conta' before paying is the bill"
```

**Item:**
> The waiter comes to your table after dinner and you want the amount to pay. Which word do you need?

| Slot | Value |
|------|-------|
| A | "the menu" |
| B | "the tip" |
| C | "the receipt" |
| D | **"the bill"** ✓ |

**Key:** D

**Feedback:**
> The amount to pay at a restaurant is **`the bill`**: **`Could you bring the bill, please?`** **A** is the list of dishes, **B** is the extra money for the waiter, and **C** is the proof of payment you keep afterwards.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_restaurant_size_receipt_001
skill: `reading.store_receipt_note`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Get a bigger size for free at the airport shop."
    br_pt_form: "Pegar um tamanho maior de graça na loja do aeroporto."
    note: "the airport shop appears in another scene, not in this note; no free replacement is promised"
  - option: "Give the clerk a tip and keep the shirt."
    br_pt_form: "Dar uma gorjeta ao atendente e ficar com a camisa."
    note: "a tip belongs to the restaurant scene; the store note offers an exchange or a refund instead"
  - option: "Return it after thirty days."
    br_pt_form: "Devolver depois de trinta dias."
    note: "the note sets a seven-day window; thirty days is an invented deadline that Brazilian return habits make tempting"
```

**Stimulus:**
> "Store note — I tried a size M shirt, but it wasn't big enough. The clerk said today's sale ends at six and gave me a receipt. If it still doesn't fit, I can exchange it or ask for a refund within seven days."

**Item:**
> What can the writer do if the shirt still doesn't fit?

| Slot | Value |
|------|-------|
| A | **"Ask for a refund within seven days."** ✓ |
| B | "Get a bigger size for free at the airport shop." |
| C | "Give the clerk a tip and keep the shirt." |
| D | "Return it after thirty days." |

**Key:** A

**Feedback:**
> The note says **`I can exchange it or ask for a refund within seven days`**. **B** imports the airport shop and a free upgrade, **C** mixes in the restaurant's *tip*, and **D** changes the stated seven-day window to thirty.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_restaurant_thank_dental_001
skill: `pronunciation.restaurant_dental_th`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_restaurant_thank_dental_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *thank* /θæŋk/ uses the voiceless dental /θ/, while *tank* /tæŋk/ uses /t/ — Brazilian Portuguese tends to replace /θ/ with /t/, collapsing the pair. *this* /ðɪs/ uses the voiced dental /ð/, which tends to become /d/ (*dis*). The contrast is between the two dental fricatives and their stops.

**Step 2 — produce (ASR-scored):** read aloud:

> "Thank you — this tip is for the waiter."

**Target phonemes:** /θ/ in *thank* (not /t/) · /ð/ in *this* (not /d/) · /t/ in *tip* · /æ/ in *thank*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_restaurant_modals_001
skill: `grammar.modals_can_need`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_modals_can_need
distractors:
  - option: "Can you to bring the bill?"
    br_pt_form: "Você pode para trazer a conta?"
    note: "a modal takes the base verb directly; inserting 'to' is L1 transfer from the Portuguese 'para'"
  - option: "You can bring the bill?"
    br_pt_form: "Você pode trazer a conta?"
    note: "statement order with rising intonation only; the written polite request keeps the interrogative order"
  - option: "Could you bringing the bill?"
    br_pt_form: "Você poderia trazendo a conta?"
    note: "the gerund 'trazendo' maps onto -ing, but a modal requires the base form"
```

**Item:**
> Reviewing modal questions before you ask the waiter for the bill, which sentence is a correct polite request?

| Slot | Value |
|------|-------|
| A | "Can you to bring the bill?" |
| B | **"Could you bring the bill, please?"** ✓ |
| C | "You can bring the bill?" |
| D | "Could you bringing the bill?" |

**Key:** B

**Feedback:**
> A polite question keeps the modal before the subject and the base verb after it: **`Could you bring the bill, please?`** **A** inserts *to*, **C** relies on intonation alone, and **D** uses a gerund where a modal needs the base form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_restaurant_city_pharmacy_001
skill: `vocab.travel_city_terms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_travel_vocab_core
distractors:
  - option: "My colleague is lose. Is there a pharmacy nearby?"
    br_pt_form: "Meu colega está perder. Há uma farmácia por perto?"
    note: "'perder' maps onto the verb lose; after 'is' you need the adjective 'lost'"
  - option: "My colleague is lost. Is there a farmacia nearby?"
    br_pt_form: "Meu colega está perdido. Há uma drogaria por perto?"
    note: "'farmacia' is the Portuguese spelling; en-US writes the place as 'pharmacy'"
  - option: "My colleague is lost. Is there a hospital nearby?"
    br_pt_form: "Meu colega está perdido. Há um hospital por perto?"
    note: "a hospital treats injury, but the request names a pharmacy for light help; the emergency word in the scene is not a hospital"
```

**Item:**
> Reviewing city words from the travel lesson: your colleague cannot find the street and needs medicine. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"My colleague is lost. Is there a pharmacy nearby?"** ✓ |
| B | "My colleague is lose. Is there a pharmacy nearby?" |
| C | "My colleague is lost. Is there a farmacia nearby?" |
| D | "My colleague is lost. Is there a hospital nearby?" |

**Key:** A

**Feedback:**
> **Be + lost** describes a person without references, and *pharmacy* is the en-US city word: **`My colleague is lost. Is there a pharmacy nearby?`** **B** uses the verb after *is*, **C** keeps the Portuguese spelling, and **D** substitutes a place the scene never asks for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `restaurant_comparative_review` | Item 1 missed | **L2** | Contrast *cheaper than* with *cheap than*, *more cheap* and the mixed *as ... as than*. |
| `bill_tip_receipt_distinction` | Items 2 and 3 missed | **L2** | Sort *bill*, *tip*, *receipt* and *change* on a single restaurant receipt before re-reading the note. |
| `store_return_words` | Item 4 missed | **L2** | Drill *exchange* versus *refund* against the seven-day window in a short store note. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_modals_can_need` and `les_a2_travel_vocab_core` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
5. The grammar focus (short comparative + *than*, *as ... as*, *enough*) was grounded in the grammar-RAG query `restaurant shopping and emergencies` (top-2), which surfaced *than*-based comparison and *I've waited long enough* frames.
