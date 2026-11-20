# Practice Pack — `les_a2_airport`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_airport_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_airport.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_airport_v1
lesson_id: les_a2_airport
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
item_id: grm_airport_immigration_questions_001
skill: `grammar.present_simple_airport`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The immigration officer ask about your purpose of visit and the gate close at 5:30."
    br_pt_form: "O agente de imigração pergunta sobre o motivo da visita e o portão fecha às 17h30."
    note: "third-person singular subjects need -s in both verbs; the Brazilian habit of leaving the verb bare transfers to English"
  - option: "The immigration officer asking about your purpose of visit and the gate closing at 5:30."
    br_pt_form: "O agente de imigração perguntando sobre o motivo da visita e o portão fechando às 17h30."
    note: "the Portuguese gerund maps onto -ing, but neither clause has an auxiliary here"
  - option: "The immigration officer asked about your purpose of visit and the gate close at 5:30."
    br_pt_form: "O agente de imigração perguntou sobre o motivo da visita e o portão fecha às 17h30."
    note: "mixing a past event with a scheduled present makes the gate's fixed time inconsistent"
```

**Item:**
> At the transit desk you hear the officer's routine questions and the boarding time. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "The immigration officer ask about your purpose of visit and the gate close at 5:30." |
| B | **"The immigration officer asks about your purpose of visit and the gate closes at 5:30."** ✓ |
| C | "The immigration officer asking about your purpose of visit and the gate closing at 5:30." |
| D | "The immigration officer asked about your purpose of visit and the gate close at 5:30." |

**Key:** B

**Feedback:**
> Both subjects are third-person singular: **`asks`** and **`closes`**. **A** leaves the verbs bare, **C** uses gerunds with no auxiliary, and **D** mixes a past question with a scheduled present.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_airport_arrivals_notice_001
skill: `reading.airport_notice`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Go straight to gate C7 for boarding."
    br_pt_form: "Ir direto ao portão C7 para embarcar."
    note: "boarding is at 5:30, but the notice puts immigration and security before the gate"
  - option: "Hand the declaration form to the officer at the gate."
    br_pt_form: "Entregar o formulário de declaração ao agente no portão."
    note: "the notice keeps the declaration form for customs, not for the gate agent"
  - option: "Check the departures board for the São Paulo flight."
    br_pt_form: "Consultar o painel de partidas para o voo de São Paulo."
    note: "the arrivals board, not the departures board, shows the São Paulo flight"
```

**Stimulus:**
> "Airport notice — Gate C7: boarding for the connecting flight to Portland starts at 5:30. The arrivals board shows the flight from São Paulo landed on time. After you get off the plane, follow the signs to immigration, then go through security again. Please keep your declaration form ready for customs."

**Item:**
> What should the traveller do right after getting off the plane?

| Slot | Value |
|------|-------|
| A | "Go straight to gate C7 for boarding." |
| B | "Hand the declaration form to the officer at the gate." |
| C | **"Follow the signs to immigration."** ✓ |
| D | "Check the departures board for the São Paulo flight." |

**Key:** C

**Feedback:**
> The notice's sequence starts with **`follow the signs to immigration`**. **A** skips the controls, **B** moves the declaration form from customs to the gate, and **D** swaps the arrivals board for the departures board.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_airport_carry_on_001
skill: `vocab.travel_airport_documents`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "The baggage claim."
    br_pt_form: "A retirada de bagagem."
    note: "baggage claim is where you collect a checked bag after landing, not a bag you carry"
  - option: "The overhead bin."
    br_pt_form: "O compartimento superior."
    note: "the overhead bin is the storage space above the seat, not the bag itself"
  - option: "The transit desk."
    br_pt_form: "O balcão de trânsito."
    note: "the transit desk is a service counter for connecting passengers"
```

**Item:**
> You are packing for a flight to a conference. Which item is the bag you take with you into the cabin?

| Slot | Value |
|------|-------|
| A | "The baggage claim." |
| B | "The overhead bin." |
| C | "The transit desk." |
| D | **"The carry-on."** ✓ |

**Key:** D

**Feedback:**
> The bag that travels with you into the cabin is **`the carry-on`**. **A** is a place for checked bags, **B** is the space above the seat, and **C** is a counter for passengers in connection.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_airport_gate_change_001
skill: `reading.airport_gate_notice`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The boarding time, now 5:30."
    br_pt_form: "O horário de embarque, agora 17h30."
    note: "5:30 is stated as the boarding time, but the word 'now' attaches to the gate, not to the time"
  - option: "The purpose of the visit, now business."
    br_pt_form: "O motivo da visita, agora trabalho."
    note: "the message never mentions the purpose of visit; it only asks for documents"
  - option: "The security check, which was removed."
    br_pt_form: "O controle de segurança, que foi removido."
    note: "the message still says to go through security after immigration"
```

**Stimulus:**
> "Message from the gate agent — Your connecting flight to Portland now boards at gate C9, not C7. Boarding starts at 5:30. Keep your boarding pass and passport ready. After immigration, go through security and follow the signs to the transit desk if you need help."

**Item:**
> What changed in the agent's message?

| Slot | Value |
|------|-------|
| A | "The boarding time, now 5:30." |
| B | **"The gate, now C9."** ✓ |
| C | "The purpose of the visit, now business." |
| D | "The security check, which was removed." |

**Key:** B

**Feedback:**
> The contrast **`C9, not C7`** marks the change: **`the gate, now C9`**. **A** reads a fixed time as new, **C** invents a purpose of visit, and **D** contradicts the instruction to go through security.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_airport_customs_th_001
skill: `pronunciation.airport_customs_th`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_airport_customs_th_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *through* /θruː/ begins with the voiceless /θ/, while *true* /truː/ begins with /t/ — Brazilian readers tend to swap the dental fricative for /t/ or /s/. *customs* /ˈkʌstəmz/ ends in /mz/, not /ms/, and *declaration* /ˌdekləˈreɪʃn/ ends in /ʃn/.

**Step 2 — produce (ASR-scored):** read aloud:

> "I go through customs with my declaration form."

**Target phonemes:** /θ/ in *through* · /mz/ in *customs* · /ʃn/ in *declaration* · /ʌ/ in *customs*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_airport_prepositions_001
skill: `grammar.prepositions_basic`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_prepositions_basic
distractors:
  - option: "I waited in the airport and went in immigration."
    br_pt_form: "Eu esperei no aeroporto e fui na imigração."
    note: "'no aeroporto' maps onto in, but English uses at for a point like an airport; controls take through"
  - option: "I waited to the airport and went through security."
    br_pt_form: "Eu esperei para o aeroporto e passei pela segurança."
    note: "to marks motion toward a place; waiting happens at a place"
  - option: "I waited at the airport and went to security."
    br_pt_form: "Eu esperei no aeroporto e fui para a segurança."
    note: "with go through, the check is a process you pass through, not just a destination"
```

**Item:**
> Reviewing place prepositions before your connection, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I waited in the airport and went in immigration." |
| B | **"I waited at the airport and went through immigration."** ✓ |
| C | "I waited to the airport and went through security." |
| D | "I waited at the airport and went to security." |

**Key:** B

**Feedback:**
> Use **`at`** for the airport as a point and **`through`** for a control you pass: **`I waited at the airport and went through immigration.`** **A** imports *no/na* as *in*, **C** uses *to* for waiting, and **D** reduces the check to a destination.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_airport_gate_word_001
skill: `vocab.travel_airport_stage`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_travel_vocab_core
distractors:
  - option: "The platform."
    br_pt_form: "A plataforma."
    note: "platform is the train or metro word; the airport boarding point is the gate"
  - option: "The ticket office."
    br_pt_form: "A bilheteria."
    note: "the ticket office sells or changes tickets; boarding happens at the gate"
  - option: "Baggage claim."
    br_pt_form: "A retirada de bagagem."
    note: "baggage claim is for collecting a checked bag after landing"
```

**Item:**
> Reviewing core travel words from the previous lesson, which word names the place where you board the plane?

| Slot | Value |
|------|-------|
| A | "The platform." |
| B | "The ticket office." |
| C | "Baggage claim." |
| D | **"The gate."** ✓ |

**Key:** D

**Feedback:**
> The boarding point at an airport is **`the gate`**. **A** is the train-and-metro word, **B** sells or changes tickets, and **C** is where you collect a checked bag after landing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `airport_third_person_check` | Item 1 missed | **L2** | Contrast *officer ask / gate close* with *officer asks / gate closes* in a two-line airport announcement. |
| `airport_procedure_order` | Items 2 and 4 missed | **L2** | Rebuild the sequence arrivals board → immigration → security → gate from a short notice and a gate message. |
| `airport_cabin_vs_storage_words` | Item 3 missed | **L2** | Separate *carry-on*, *overhead bin*, *baggage claim* and *transit desk* on a labelled airport map. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; clip asset rendered (TTS static).
3. Items 6 and 7 review `les_a2_prepositions_basic` and `les_a2_travel_vocab_core` and carry `prereq_lesson` for the interleaving rule.
4. Listening is explicitly deferred (`listening_items: 0`); the 45 s Q-L2 floor is not claimed by any item here.
5. Every item is authored for this lesson; no external source text is reproduced or adapted, and the `airport` token keeps all seven ids globally distinctive.
