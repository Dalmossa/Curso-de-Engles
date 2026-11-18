# Practice Pack — `les_a2_hotel_taxi`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_hotel_taxi_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_hotel_taxi.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_hotel_taxi_v1
lesson_id: les_a2_hotel_taxi
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
item_id: grm_hotel_taxi_ask_receipt_001
skill: `grammar.ask_for_requests`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I asked the taxi driver a receipt."
    br_pt_form: "Eu pedi um recibo ao motorista do táxi."
    note: "the Portuguese 'pedir algo a alguém' maps onto ask + person + for + thing; 'for' cannot be dropped"
  - option: "I asked to the taxi driver for a receipt."
    br_pt_form: "Eu pedi para o motorista do táxi um recibo."
    note: "the Portuguese 'para' gets transferred as 'to', but 'ask' takes the person directly"
  - option: "I asked the taxi driver receipt."
    br_pt_form: "Eu pedi recibo ao motorista do táxi."
    note: "a countable receipt needs the article 'a'; the bare noun reads like a label"
```

**Item:**
> You want a printed proof of payment from the taxi driver. Choose the natural request.

| Slot | Value |
|------|-------|
| A | "I asked the taxi driver a receipt." |
| B | **"I asked the taxi driver for a receipt."** ✓ |
| C | "I asked to the taxi driver for a receipt." |
| D | "I asked the taxi driver receipt." |

**Key:** B

**Feedback:**
> The pattern is **`ask + person + for + thing`**: **`I asked the taxi driver for a receipt.`** **A** drops *for*, **C** transfers the Portuguese *para* as *to* after *asked*, and **D** leaves a countable noun without its article.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_hotel_taxi_front_notice_001
skill: `reading.hotel_taxi_notice`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Ask the receptionist for a key card."
    br_pt_form: "Pedir um cartão de quarto à recepcionista."
    note: "the key card was already issued at check-in; the note does not say it was lost"
  - option: "Pay the taxi driver in cash again."
    br_pt_form: "Pagar o motorista do táxi em dinheiro de novo."
    note: "the cash payment already happened and the receipt is in the room record"
  - option: "Move check-out to 8:15."
    br_pt_form: "Mudar o check-out para as 8h15."
    note: "check-out is fixed at 11:00; 8:15 is the shuttle departure time"
```

**Stimulus:**
> "Front desk note — You checked in at 00:30. The receptionist gave you a key card for room 412. Check-out is at 11:00. The taxi ride from the airport was paid in cash, and the driver gave you a receipt. Tomorrow the shuttle to the office leaves at 8:15 from the door; if it is full, take the subway — the ticket machine is beside the map."

**Item:**
> What should the traveller do if the shuttle is full?

| Slot | Value |
|------|-------|
| A | "Ask the receptionist for a key card." |
| B | "Pay the taxi driver in cash again." |
| C | **"Take the subway; the ticket machine is beside the map."** ✓ |
| D | "Move check-out to 8:15." |

**Key:** C

**Feedback:**
> The note attaches the full-shuttle condition directly to **`take the subway`**. **A** asks for a card already issued, **B** repeats a payment already made, and **D** confuses the shuttle time with the fixed check-out time.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_hotel_taxi_key_card_001
skill: `vocab.hotel_taxi_front_desk`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "A receipt."
    br_pt_form: "Um recibo."
    note: "a receipt is proof of payment, not something that opens a hotel door"
  - option: "A subway map."
    br_pt_form: "Um mapa do metrô."
    note: "the subway map helps with routes in the city, not with room access"
  - option: "A ticket machine."
    br_pt_form: "Uma máquina de bilhetes."
    note: "a ticket machine sells transport tickets and stands by the hotel door"
```

**Item:**
> At the hotel, which item do you use to open your room door?

| Slot | Value |
|------|-------|
| A | "A receipt." |
| B | "A subway map." |
| C | "A ticket machine." |
| D | **"A key card."** ✓ |

**Key:** D

**Feedback:**
> The electronic card that opens the room is **`a key card`**: **`A key card.`** **A** proves payment, **B** shows routes, and **C** sells tickets — none of them unlocks a door.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_hotel_taxi_shift_message_001
skill: `reading.hotel_taxi_message`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The receptionist paid part of the ride."
    br_pt_form: "A recepcionista pagou parte da corrida."
    note: "the receptionist only holds the receipt; nothing says she paid"
  - option: "The shuttle leaves at 8:15."
    br_pt_form: "O shuttle sai às 8h15."
    note: "the shuttle time is a separate plan and has no effect on the taxi fare"
  - option: "The subway map shows a discount."
    br_pt_form: "O mapa do metrô mostra um desconto."
    note: "no subway map appears in the message and no discount is mentioned"
```

**Stimulus:**
> "Message from Ana (the driver) — I dropped you at the front desk at 00:30. The meter was off for the last five minutes, so the fare is $18, not $23. I left your receipt with the receptionist. I'll be at the airport at 7:00 if you need a ride to the office; otherwise take the shuttle at 8:15."

**Item:**
> Why is the fare $18 instead of $23?

| Slot | Value |
|------|-------|
| A | "The receptionist paid part of the ride." |
| B | **"The meter was off for the last five minutes."** ✓ |
| C | "The shuttle leaves at 8:15." |
| D | "The subway map shows a discount." |

**Key:** B

**Feedback:**
> The message links the lower price to the meter: **`The meter was off for the last five minutes.`** **A** invents a payment, **C** mixes in the shuttle schedule, and **D** brings in a map and a discount that never appear.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_hotel_taxi_receipt_silent_p_001
skill: `pronunciation.hotel_taxi_receipt_r`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *receipt* /rɪˈsiːt/ has a silent **p** and a long /iː/, while *receive* /rɪˈsiːv/ keeps the /v/ in the final sound; Brazilian readers tend to pronounce the written **p** as /rɪˈsepɪt/. In *receptionist* /rɪˈsepʃənɪst/, by contrast, the **p** really is heard and the vowel is /e/ before /ʃ/.
**Step 2 — produce (ASR-scored):** read aloud:

> "I asked the receptionist for a receipt at the front desk."

**Target phonemes:** /r/ in *receipt* and *receptionist* without the Brazilian rolled r · /iː/ in *receipt* · silent /p/ in *receipt* · /e/ + /ʃ/ in *receptionist*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_hotel_taxi_get_to_001
skill: `grammar.prepositions_basic`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_prepositions_basic
distractors:
  - option: "How do I get the platform?"
    br_pt_form: "Como eu chego a plataforma?"
    note: "movement to a place needs the preposition 'to' after 'get'"
  - option: "How do I get to platform?"
    br_pt_form: "Como eu chego à plataforma?"
    note: "'platform' is countable and needs the article when a specific one is meant"
  - option: "How do I get in the platform?"
    br_pt_form: "Como eu entro na plataforma?"
    note: "'in' describes being inside; movement towards the platform uses 'to'"
```

**Item:**
> Reviewing prepositions of movement before you ask the way to the train, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "How do I get the platform?" |
| B | "How do I get to platform?" |
| C | "How do I get in the platform?" |
| D | **"How do I get to the platform, please?"** ✓ |

**Key:** D

**Feedback:**
> Movement to a place takes **`get to`**, and a specific platform takes the article: **`How do I get to the platform, please?`** **A** drops *to*, **B** drops *the*, and **C** uses *in* where direction requires *to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_hotel_taxi_city_terms_001
skill: `vocab.travel_city_terms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_travel_vocab_core
distractors:
  - option: "The gate."
    br_pt_form: "O portão."
    note: "'gate' is the airport boarding point; the train equivalent is the platform"
  - option: "The fare."
    br_pt_form: "A tarifa."
    note: "a fare is the price of the trip, not a place where a train stops"
  - option: "The delay."
    br_pt_form: "O atraso."
    note: "a delay is a timing problem, not a physical place in the station"
```

**Item:**
> Back at the hotel, you need the word for the place where a train or subway stops in the city. Which one is correct?

| Slot | Value |
|------|-------|
| A | "The gate." |
| B | "The fare." |
| C | "The delay." |
| D | **"The platform."** ✓ |

**Key:** D

**Feedback:**
> The place where a train or subway stops is **`the platform`**: **`The platform.`** **A** is the airport word, **B** is a price, and **C** is a timing problem — all three come from the core travel vocabulary but answer a different question.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `hotel_taxi_ask_for` | Item 1 missed | **L2** | Contrast *asked the driver a receipt* with *asked the driver for a receipt*, then recycle the pattern in a front-desk request. |
| `hotel_taxi_place_words` | Items 3 and 7 missed | **L2** | Separate *key card*, *ticket machine*, *gate* and *platform* on a labelled hotel-to-station route. |
| `hotel_taxi_notice_scanning` | Items 2 and 4 missed | **L2** | Extract the condition and the cause from short front-desk notes and driver messages before answering. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_prepositions_basic` and `les_a2_travel_vocab_core` (the `travel_core` prerequisite of §4.3) and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
