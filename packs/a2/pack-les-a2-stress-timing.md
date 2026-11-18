# Practice Pack — `les_a2_stress_timing`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_stress_timing_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_stress_timing.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_stress_timing_v1
lesson_id: les_a2_stress_timing
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
item_id: grm_stress_word_stress_noun_verb_001
skill: `grammar.word_stress`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "We need a RE.CORD of the deploy; please REcord it."
    br_pt_form: "Precisamos de um RE.CORD do deploy; por favor, REcord ele."
    note: "syllable-timed transfer splits the noun into two full syllables with a dot, and the Portuguese late-stress habit puts the noun pattern on the verb; English reduces the noun's weak syllable and stresses the verb's second"
  - option: "We need a RE-CORD of the deploy; please reCORD it."
    br_pt_form: "Precisamos de um RE-CORD do deploy; por favor, reCORD ele."
    note: "syllable-timed transfer gives the noun two equally strong syllables; English reduces the weak one to a schwa"
  - option: "We need a REcord of the deploy; please RE-cord it."
    br_pt_form: "Precisamos de um REcord do deploy; por favor, RE-cord ele."
    note: "keeps the noun stress but flattens the verb: the second syllable of reCORD must carry the stress, not a reduced vowel"
```

**Item:**
> A tech lead dictates a changelog entry on a poor line. Which line marks the noun and the verb correctly?

| Slot | Value |
|------|-------|
| A | "We need a RE.CORD of the deploy; please REcord it." |
| B | **"We need a REcord of the deploy; please reCORD it."** ✓ |
| C | "We need a RE-CORD of the deploy; please reCORD it." |
| D | "We need a REcord of the deploy; please RE-cord it." |

**Key:** B

**Feedback:**
> The noun takes first-syllable stress and the verb takes second-syllable stress: **`We need a REcord of the deploy; please reCORD it.`** **A** breaks the noun into two full syllables with a dot and copies that noun pattern onto the verb, **C** gives both syllables of the noun equal weight instead of reducing the second to /ə/, and **D** flattens the verb by reducing the syllable that should carry the stress.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_stress_timing_note_001
skill: `reading.stress_timing_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Speed up every syllable."
    br_pt_form: "Acelerar todas as sílabas."
    note: "the note says the small words are quick and the key words keep their full length; not every syllable speeds up"
  - option: "Give to, the and of the main stress."
    br_pt_form: "Dar o estresse principal em to, the e of."
    note: "those function words are named as weak in the note; stressing them reverses the advice"
  - option: "Move the presentation to four."
    br_pt_form: "Mover a apresentação para as quatro."
    note: "the shift to four is a stated fact about the meeting, not the action requested when the line drops"
```

**Stimulus:**
> "Call note: I logged the deploy time at three, but the presentation moved to four. Keep the small words quick — to, the and of are weak in English — and give the key words their full length. If the line drops, I will repeat the time."

**Item:**
> According to the note, what should the speaker do if the line drops?

| Slot | Value |
|------|-------|
| A | "Speed up every syllable." |
| B | "Give to, the and of the main stress." |
| C | **"Repeat the time."** ✓ |
| D | "Move the presentation to four." |

**Key:** C

**Feedback:**
> The last sentence says **`If the line drops, I will repeat the time.`** **A** over-generalises the advice about small words, **B** stresses the very words the note marks as weak, and **D** mistakes a stated time change for the recovery action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_stress_timing_reduction_001
skill: `vocab.stress_reduction`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "rhythm"
    br_pt_form: "ritmo"
    note: "rhythm names the timing pattern across words; the question asks for the vowel inside one weak syllable"
  - option: "stressed syllable"
    br_pt_form: "sílaba tônica"
    note: "the /ə/ sits in the weak syllable; the stressed syllable keeps a full vowel"
  - option: "sentence stress"
    br_pt_form: "estresse de frase"
    note: "sentence stress concerns which words are prominent, not the vowel quality of a single syllable"
```

**Item:**
> Your phonetic note writes /ˈrekərd/ for the noun *record*. Which word names the /ə/ in the second syllable?

| Slot | Value |
|------|-------|
| A | "rhythm" |
| B | "stressed syllable" |
| C | "sentence stress" |
| D | **"schwa"** ✓ |

**Key:** D

**Feedback:**
> The neutral vowel of an unstressed syllable is **schwa** /ə/: **`record` /ˈrekərd/.** **A** names the timing pattern, **B** names the loud syllable, and **C** names prominence across a sentence — none of them names that vowel.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_stress_shift_meaning_001
skill: `reading.stress_shift_meaning`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Before the preview of the metrics."
    br_pt_form: "Antes da prévia das métricas."
    note: "the preview comes before the presentation, not the other way round; Portuguese word order in the note invites the reversal"
  - option: "As soon as the build is stable."
    br_pt_form: "Assim que o build estiver estável."
    note: "the stable build is the current state of the release, not the scheduled time of the presentation"
  - option: "Right after the call drops."
    br_pt_form: "Logo depois que a chamada cair."
    note: "a dropped line is not mentioned in this note; that condition belongs to the call note, not the status note"
```

**Stimulus:**
> "Status note: the present build is stable. At three we present the numbers to the client; before that, send a one-line preview of the metrics. Keep the stress on the first syllable in the noun and on the second in the verb — the meaning stays clear even on a bad line."

**Item:**
> When does the team present the numbers to the client?

| Slot | Value |
|------|-------|
| A | "Before the preview of the metrics." |
| B | **"At three."** ✓ |
| C | "As soon as the build is stable." |
| D | "Right after the call drops." |

**Key:** B

**Feedback:**
> The note states **`At three we present the numbers to the client`**. **A** reverses the order of preview and presentation, **C** turns the current state of the build into a schedule, and **D** imports the dropped-line condition from a different note.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_stress_timed_rhythm_001
skill: `pronunciation.stress_timing`
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

**Step 1 — hear the contrast:** *REcord* /ˈrekərd/ is the noun: first syllable strong, second reduced to /ə/. *reCORD* /rɪˈkɔːrd/ is the verb: first syllable weak, second strong. Brazilian Portuguese tends to keep both vowels full and give them similar length, which flattens the pair.
**Step 2 — produce (ASR-scored):** read aloud:

> "I need a REcord of the call; please reCORD the time in the ticket."

**Target phonemes:** /ˈrekərd/ in *REcord* (noun) · /rɪˈkɔːrd/ in *reCORD* (verb) · /ə/ in the weak syllables · /ə/ in the article *a* · no extra vowel after the final /d/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_stress_present_continuous_001
skill: `grammar.present_continuous_calls`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_present_continuous`
distractors:
  - option: "We are record the deploy time now."
    br_pt_form: "Nós estamos gravar o horário do deploy agora."
    note: "Portuguese 'estamos gravar' is not English; the auxiliary be requires the -ing form of the main verb"
  - option: "We record the deploy time now."
    br_pt_form: "Nós gravamos o horário do deploy agora."
    note: "the present simple marks a routine; the phrase 'now' calls for an action in progress"
  - option: "We recording the deploy time now."
    br_pt_form: "Nós gravando o horário do deploy agora."
    note: "the gerund 'gravando' maps onto -ing, but the -ing form alone is not a finite present; the auxiliary is missing"
```

**Item:**
> Reviewing the present continuous before you report what the team is doing, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "We are record the deploy time now." |
| B | **"We are recording the deploy time now."** ✓ |
| C | "We record the deploy time now." |
| D | "We recording the deploy time now." |

**Key:** B

**Feedback:**
> An action in progress uses **be + verb-ing**: **`We are recording the deploy time now.`** **A** leaves the bare verb after *are*, **C** switches to the routine-reading present simple, and **D** drops the auxiliary and leaves a gerund.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_stress_travel_logistics_001
skill: `vocab.travel_logistics`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_travel_vocab_core`
distractors:
  - option: "I have a reserve for the seven-thirty flight."
    br_pt_form: "Eu tenho uma reserva para o voo das sete e trinta."
    note: "Portuguese 'reserva' maps onto the verb 'reserve'; the noun needed after 'a' is 'reservation'"
  - option: "I did a reservation for the seven-thirty flight."
    br_pt_form: "Eu fiz uma reserva para o voo das sete e trinta."
    note: "'fazer uma reserva' is 'make a reservation'; the light verb 'do' does not collocate here"
  - option: "I have a booking for the seven-thirty flight."
    br_pt_form: "Eu tenho um agendamento para o voo das sete e trinta."
    note: "'agendamento' maps to British 'booking'; en-US travel English prefers 'reservation' for a flight or hotel"
```

**Item:**
> Reviewing travel vocabulary before you describe a business trip to a client abroad, which sentence is natural in en-US?

| Slot | Value |
|------|-------|
| A | "I have a reserve for the seven-thirty flight." |
| B | "I did a reservation for the seven-thirty flight." |
| C | "I have a booking for the seven-thirty flight." |
| D | **"I have a reservation for the seven-thirty flight."** ✓ |

**Key:** D

**Feedback:**
> The en-US noun for a held place on a flight is **`reservation`**: **`I have a reservation for the seven-thirty flight.`** **A** uses the verb *reserve* as a noun, **B** carries over *fazer uma reserva* with the wrong light verb, and **C** uses the British *booking* where en-US prefers *reservation*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `word_stress_noun_verb` | Item 1 missed | **L2** | Rebuild **RE**cord / re**CORD** and **PRE**sent / pre**SENT** in short status lines before the next call. |
| `schwa_reduction_review` | Item 3 missed | **L2** | Contrast *rhythm*, *stressed syllable* and *sentence stress* with **schwa** /ə/ in **PHO**-tə-graph and **RE**-cord. |
| `stress_timing_production` | Item 5 missed | **L2** | Replay the model for *I need a REcord of the call; please reCORD the time in the ticket* and mark the strong syllables between attempts. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_present_continuous` and `les_a2_travel_vocab_core` and carry `prereq_lesson` for the interleaving rule.
4. Listening is deferred under Decision B; `listening_items: 0` is explicit and its slot is redistributed to Reading (2 items).
5. Items target authored lesson content; no external source text is reproduced.
6. Every `item_id` carries the `stress` token to stay globally distinct across the A2 pack set.
