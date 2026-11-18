# Practice Pack — `les_a2_travel_vocab_core`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_travel_vocab_core_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_travel_vocab_core.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_travel_vocab_core_v1
lesson_id: les_a2_travel_vocab_core
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
item_id: grm_travel_core_flight_delay_001
skill: `grammar.present_simple_travel`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "My flight is delay, so I have a layover."
    br_pt_form: "Meu voo está com atraso, então eu tenho uma escala."
    note: "the Portuguese 'com atraso' gets flattened into 'is delay'; English needs the adjective 'delayed' after the verb"
  - option: "My flight delaying, so I have a layover."
    br_pt_form: "Meu voo atrasando, então eu tenho uma escala."
    note: "the Portuguese gerund 'atrasando' maps onto -ing, but the -ing form alone is not a finite present"
  - option: "My flight delays, so I have a layover."
    br_pt_form: "Meu voo atrasa, então eu tenho uma escala."
    note: "'atrasa' maps onto the present simple verb, but an adjective is needed after 'is'; 'delays' also reads as a habit"
```

**Item:**
> You are at the check-in counter and the agent announces a late flight. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "My flight is delay, so I have a layover." |
| B | **"My flight is delayed, so I have a layover."** ✓ |
| C | "My flight delaying, so I have a layover." |
| D | "My flight delays, so I have a layover." |

**Key:** B

**Feedback:**
> After *is* you need the adjective **`delayed`**: **`My flight is delayed, so I have a layover.`** **A** stacks a verb and a bare noun, **C** leaves a gerund with no auxiliary, and **D** turns the state into a habitual action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_travel_core_itinerary_note_001
skill: `reading.travel_itinerary`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "A longer stay at the hotel."
    br_pt_form: "Uma estadia mais longa no hotel."
    note: "the hotel is not in the note; the delay changes the connection, not the accommodation"
  - option: "A new reservation for the meeting."
    br_pt_form: "Uma nova reserva para a reunião."
    note: "the reservation is already in place and the note does not say it was changed"
  - option: "A different gate for the flight."
    br_pt_form: "Um portão diferente para o voo."
    note: "gate B12 is stated as fixed; nothing in the note says it changed"
```

**Stimulus:**
> "Trip note — I checked in online this morning. I have one suitcase and my boarding pass for gate B12. The departure is at 9:40, but there is a delay, so I expect a two-hour layover in Dallas. After customs, I need to find the currency exchange before the meeting."

**Item:**
> What does the traveller expect because of the delay?

| Slot | Value |
|------|-------|
| A | "A longer stay at the hotel." |
| B | "A new reservation for the meeting." |
| C | **"A two-hour layover in Dallas."** ✓ |
| D | "A different gate for the flight." |

**Key:** C

**Feedback:**
> The note links the delay directly to the connection: **`a two-hour layover in Dallas`**. **A** invents a hotel change, **B** treats an existing reservation as new, and **D** contradicts the fixed gate B12.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_travel_core_airport_stage_001
skill: `vocab.travel_airport_stage`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "The ticket office."
    br_pt_form: "A bilheteria."
    note: "the ticket office is the counter for buying or changing tickets, not the place where you board"
  - option: "Customs."
    br_pt_form: "A alfândega."
    note: "customs is the passport and baggage control you pass before reaching the boarding point"
  - option: "The platform."
    br_pt_form: "A plataforma."
    note: "'platform' names the train or metro area; at the airport the boarding point is the gate"
```

**Item:**
> You are at the airport and need to find where you board the plane. Which word names that place?

| Slot | Value |
|------|-------|
| A | "The ticket office." |
| B | "Customs." |
| C | "The platform." |
| D | **"The gate."** ✓ |

**Key:** D

**Feedback:**
> The boarding point at an airport is **`the gate`**: **`The gate.`** **A** is the ticket counter, **B** is the control you pass beforehand, and **C** is the train-and-metro word that Brazilian travellers carry over to the airport.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_travel_core_message_001
skill: `reading.travel_message`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Meet Leo at the currency exchange."
    br_pt_form: "Encontrar o Leo no câmbio."
    note: "the meeting is the last step, at 9:00; the message marks customs as the first action"
  - option: "Take the platform down to the pharmacy."
    br_pt_form: "Descer a plataforma até a farmácia."
    note: "the platform and the pharmacy come after customs, not before"
  - option: "Pick up the suitcase at the ticket office."
    br_pt_form: "Pegar a mala na bilheteria."
    note: "Leo already has the suitcase and will meet the traveller later; picking it up is not an instruction"
```

**Stimulus:**
> "Message from Leo — I'm at the ticket office. Your suitcase is here with me, and I have your boarding pass. Go through customs first, then take the platform down to the pharmacy. I'll meet you at the currency exchange desk at 9:00."

**Item:**
> What should the traveller do first?

| Slot | Value |
|------|-------|
| A | **"Go through customs."** ✓ |
| B | "Meet Leo at the currency exchange." |
| C | "Take the platform down to the pharmacy." |
| D | "Pick up the suitcase at the ticket office." |

**Key:** A

**Feedback:**
> The word **`first`** attaches to **`Go through customs`**. **B** is the closing arrangement at 9:00, **C** is the second step, and **D** assumes a pickup that the message never asks for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_travel_core_aisle_h_001
skill: `pronunciation.travel_aisle_h`
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

**Step 1 — hear the contrast:** *aisle* /aɪl/ ends in /l/ and its **s** is silent, while *ice* /aɪs/ ends in /s/ — Brazilians who read the spelling tend to insert the missing /s/. *have* /hæv/ needs the breath /h/ before /æv/, which carioca speech often drops into *ave*.
**Step 2 — produce (ASR-scored):** read aloud:

> "I have an aisle seat and my boarding pass."

**Target phonemes:** /aɪl/ in *aisle* with silent **s** · final /l/, not /s/ · /h/ in *have* · /æ/ in *have*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_travel_modals_001
skill: `grammar.modals_can_need`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_modals_can_need
distractors:
  - option: "Can you to tell me the gate?"
    br_pt_form: "Você pode para me dizer o portão?"
    note: "a modal takes the base verb directly; inserting 'to' is L1 transfer from the Portuguese 'para'"
  - option: "You can tell me the gate?"
    br_pt_form: "Você pode me dizer o portão?"
    note: "statement order with rising intonation only; the written polite request keeps the interrogative order"
  - option: "Could you telling me the gate?"
    br_pt_form: "Você poderia me dizendo o portão?"
    note: "the gerund 'dizendo' maps onto -ing, but a modal requires the base form"
```

**Item:**
> Reviewing modal questions before you ask an agent where to board, which sentence is a correct polite request?

| Slot | Value |
|------|-------|
| A | "Can you to tell me the gate?" |
| B | **"Can you tell me where the gate is, please?"** ✓ |
| C | "You can tell me the gate?" |
| D | "Could you telling me the gate?" |

**Key:** B

**Feedback:**
> A polite question keeps the modal before the subject and the base verb after it: **`Can you tell me where the gate is, please?`** **A** inserts *to*, **C** relies on intonation alone, and **D** uses a gerund where a modal needs the base form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_travel_email_attach_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_email_basics
distractors:
  - option: "Please annex your boarding pass to the report."
    br_pt_form: "Por favor, anexe seu cartão de embarque ao relatório."
    note: "Portuguese 'anexar' maps onto attach; 'annex' in English is about adding territory or a building"
  - option: "Please reply your boarding pass to the report."
    br_pt_form: "Por favor, responda com seu cartão de embarque para o relatório."
    note: "reply answers a sender; it does not add a file to a document"
  - option: "Please forward your boarding pass to the report."
    br_pt_form: "Por favor, encaminhe seu cartão de embarque para o relatório."
    note: "forward sends a message onward to a person, a different action from adding a file"
```

**Item:**
> Back at the hotel, you need to send your boarding pass as a file with your expense report. Which verb is correct?

| Slot | Value |
|------|-------|
| A | "Please annex your boarding pass to the report." |
| B | "Please reply your boarding pass to the report." |
| C | "Please forward your boarding pass to the report." |
| D | **"Please attach your boarding pass to the report."** ✓ |

**Key:** D

**Feedback:**
> Adding a file to a document is **`attach`**: **`Please attach your boarding pass to the report.`** **A** uses the false friend *annex*, **B** answers a sender instead of adding a file, and **C** sends a message onward to a person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `travel_delay_layover` | Item 1 missed | **L2** | Contrast *is delayed* with *is delay* and *delaying*, then recycle *layover* in a short airport notice. |
| `airport_place_words` | Item 3 missed | **L2** | Separate *gate*, *platform*, *customs* and *ticket office* on a labelled airport map. |
| `travel_itinerary_scanning` | Items 2 and 4 missed | **L2** | Extract the first action and the delay consequence from short trip notes before the meeting. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_modals_can_need` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
