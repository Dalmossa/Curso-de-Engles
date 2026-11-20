# Practice Pack — `les_a2_collocations`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_collocations_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_collocations.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_collocations_v1
lesson_id: les_a2_collocations
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
item_id: grm_collocations_decision_fit_001
skill: `grammar.collocation_aula_verb_noun_fit`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "We need to do a decision before the deploy."
    br_pt_form: "Precisamos fazer uma decisão antes do deploy."
    note: "calque of 'fazer uma decisão'; the English partner of decision is make, not do"
  - option: "We need to make a decide before the deploy."
    br_pt_form: "Precisamos fazer um decide antes do deploy."
    note: "the article signals a noun; Brazilian learners keep the verb form after make"
  - option: "We need to doing a decision before the deploy."
    br_pt_form: "Precisamos fazendo uma decisão antes do deploy."
    note: "the gerund maps onto the Portuguese 'fazendo'; after 'need to' the base verb is required"
```

**Item:**
> A tech lead closes a planning call before a trip. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "We need to do a decision before the deploy." |
| B | **"We need to make a decision before the deploy."** ✓ |
| C | "We need to make a decide before the deploy." |
| D | "We need to doing a decision before the deploy." |

**Key:** B

**Feedback:**
> The fixed partner of **`decision`** is **`make`**: **`We need to make a decision before the deploy.`** **A** translates "fazer uma decisão" word for word, **C** puts a verb after the article where the noun is required, and **D** carries the Portuguese gerund into a pattern that needs the base verb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_collocations_trip_note_001
skill: `reading.collocation_aula_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Take a taxi to the hotel."
    br_pt_form: "Pegar um táxi para o hotel."
    note: "no taxi appears in the note; the concrete travel noun attracts Brazilian readers under time pressure"
  - option: "Attend a class in the lounge."
    br_pt_form: "Assistir a uma aula no lounge."
    note: "the lounge is suggested for the call, not for a class; Portuguese 'assistir' pulls readers toward a class"
  - option: "Cancel the demo."
    br_pt_form: "Cancelar a demo."
    note: "the demo is moved to Thursday, not cancelled; 'move' gets read as 'cancel' in a fast skim"
```

**Stimulus:**
> "Gate note — I made the decision to move the demo to Thursday. I will catch the 06:20 flight if the rain stops, but the forecast says heavy rain until noon. Rafa strongly recommends the airport lounge for the call; he is deeply committed to keeping the client in the loop. No fast food before the demo — I will eat after."

**Item:**
> What does the writer plan to do if the rain stops?

| Slot | Value |
|------|-------|
| A | "Take a taxi to the hotel." |
| B | **"Catch the 06:20 flight."** ✓ |
| C | "Attend a class in the lounge." |
| D | "Cancel the demo." |

**Key:** B

**Feedback:**
> The condition is explicit: **`I will catch the 06:20 flight if the rain stops.`** **A** invents a taxi the note never mentions, **C** moves the class reading from *assistir aula* into the lounge, and **D** turns *move the demo* into a cancellation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_collocations_word_partners_001
skill: `vocab.collocation_aula_word_partners`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "I assisted a class online."
    br_pt_form: "Eu assisti a uma aula online."
    note: "'assist' in English means to help; Brazilian learners transfer the false friend 'assistir aula'"
  - option: "I assisted to a class online."
    br_pt_form: "Eu assisti à aula online."
    note: "the Portuguese preposition a/à gets carried after the false friend; English 'assist' takes no 'to' here"
  - option: "I attended to a class online."
    br_pt_form: "Eu atendi a uma aula online."
    note: "'attend to' means to deal with a matter, not to be present at a class"
```

**Item:**
> You want to say you were present at an online training session during the deployment window. Which sentence is natural?

| Slot | Value |
|------|-------|
| A | "I assisted a class online." |
| B | **"I attended a class online."** ✓ |
| C | "I assisted to a class online." |
| D | "I attended to a class online." |

**Key:** B

**Feedback:**
> Being present at a class is **`attend`**: **`I attended a class online.`** **A** uses the false friend *assist* ("help"), **C** adds the Portuguese preposition after it, and **D** changes the meaning with the phrasal *attend to* ("handle").

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_collocations_weather_advice_001
skill: `reading.collocation_aula_advice`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Sending the deck tonight."
    br_pt_form: "Enviar o deck hoje à noite."
    note: "that is what he is committed to do, not what he recommends; Brazilian readers conflate the two chunks"
  - option: "Working from the airport lounge."
    br_pt_form: "Trabalhar do lounge do aeroporto."
    note: "the lounge is a fallback if the wifi fails, not the recommendation itself"
  - option: "Bringing fast food to the call."
    br_pt_form: "Levar comida rápida para a call."
    note: "the note says the opposite; 'don't bring' flips to 'bring' under a fast skim"
```

**Stimulus:**
> "From Rafa: The demo moved to Thursday because heavy rain is expected on Wednesday. I strongly recommend the 07:10 train instead of a flight, and I am deeply committed to sending the deck tonight. If the wifi is broken at the hotel, I will work from the airport lounge. Please do not bring fast food to the client call."

**Item:**
> What does Rafa strongly recommend?

| Slot | Value |
|------|-------|
| A | "Sending the deck tonight." |
| B | **"Taking the 07:10 train instead of a flight."** ✓ |
| C | "Working from the airport lounge." |
| D | "Bringing fast food to the call." |

**Key:** B

**Feedback:**
> The recommendation is introduced by **`I strongly recommend`**: **`Taking the 07:10 train instead of a flight.`** **A** belongs to his commitment, **C** is a conditional fallback, and **D** reverses an explicit prohibition.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_collocations_decision_stress_001
skill: `pronunciation.collocation_aula_decision_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_collocations_decision_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *decision* /dɪˈsɪʒən/ closes with the voiced /ʒ/, not a Portuguese-style /si.on/, and carries stress on the second syllable. *recommend* /ˌrekəˈmend/ puts the force on the final syllable. Brazilian speech tends to flatten both words into an even rhythm.
**Step 2 — produce (ASR-scored):** read aloud:

> "We need to make a decision; I strongly recommend the train."

**Target phonemes:** /ʒ/ in *decision* · weak /ə/ in *a decision* · final-syllable stress in *recommend* · no extra vowel after /dʒ/ in *decision*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_collocations_present_simple_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The wifi break every time I connect."
    br_pt_form: "O wifi quebra toda vez que eu conecto."
    note: "Portuguese has no third-person -s, so the singular subject loses the English verb marker"
  - option: "The wifi is break every time I connect."
    br_pt_form: "O wifi está quebrar toda vez que eu conecto."
    note: "the Portuguese progressive 'está quebrando' becomes be plus a bare verb in the learner's English"
  - option: "The wifi breaking every time I connect."
    br_pt_form: "O wifi quebrando toda vez que eu conecto."
    note: "the gerund 'quebrando' maps onto -ing, but -ing alone is not a finite present"
```

**Item:**
> Reviewing the present simple before you report a recurring problem with the hotel wifi, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The wifi break every time I connect." |
| B | **"The wifi breaks every time I connect."** ✓ |
| C | "The wifi is break every time I connect." |
| D | "The wifi breaking every time I connect." |

**Key:** B

**Feedback:**
> A recurring fact uses the present simple with the third-person **-s**: **`The wifi breaks every time I connect.`** **A** drops **-s** because Portuguese marks no such ending, **C** inserts *be* before the bare verb, and **D** leaves a gerund with no auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_collocations_email_attach_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_email_basics
distractors:
  - option: "Please annex the boarding pass to the email."
    br_pt_form: "Por favor, anexe o cartão de embarque ao e-mail."
    note: "Portuguese 'anexar' maps onto attach; annex in English means to add territory or a building"
  - option: "Please reply the boarding pass to the email."
    br_pt_form: "Por favor, responda com o cartão de embarque ao e-mail."
    note: "reply answers a sender; it does not add a file to a message"
  - option: "Please forward the boarding pass to the email."
    br_pt_form: "Por favor, encaminhe o cartão de embarque ao e-mail."
    note: "forward sends a message onward to a person, which is not adding a file to a message"
```

**Item:**
> Reviewing the email basics before the trip, you need to add a boarding pass file to a message for the travel team. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Please annex the boarding pass to the email." |
| B | **"Please attach the boarding pass to the email."** ✓ |
| C | "Please reply the boarding pass to the email." |
| D | "Please forward the boarding pass to the email." |

**Key:** B

**Feedback:**
> Adding a file to a message is **`attach`**: **`Please attach the boarding pass to the email.`** **A** uses the false friend *annex*, **C** answers a sender instead of adding a file, and **D** sends a message onward to a person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `collocation_aula_verb_noun_fit` | Item 1 missed | **L2** | Rebuild *make/do/take* with *decision*, *risk* and *reservation* in short travel updates. |
| `collocation_aula_word_partners` | Items 3 and 4 missed | **L2** | Contrast *attend/assist*, *heavy/strong* and *fast/quick* inside a gate note, never as bare word lists. |
| `present_simple_regular_review` | Item 6 missed | **L2** | Drill the third-person **-s** in recurring-bug reports such as *the wifi breaks every time*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. All seven `item_id` values carry the `collocations` lesson token; no generic id from another pack is reused.
5. Items target authored lesson content; no external source text is reproduced.
