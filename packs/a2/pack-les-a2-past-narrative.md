# Practice Pack — `les_a2_past_narrative`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_past_narrative_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_past_narrative.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_past_narrative_v1
lesson_id: les_a2_past_narrative
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
item_id: grm_narrative_irregular_001
skill: `grammar.past_narrative_irregular`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "We runned the test again and told the team."
    br_pt_form: "Nós rodamos o teste de novo e avisamos o time."
    note: "Portuguese marks the past with a verb ending, so the learner adds regular -ed to the irregular verb run; the past form is ran"
  - option: "We run the test again and tell the team."
    br_pt_form: "A gente roda o teste de novo e avisa o time."
    note: "Portuguese keeps the present form with an explicit past time; a finished retro report needs ran and told"
  - option: "We are running the test again and told the team."
    br_pt_form: "Estamos rodando o teste de novo e avisamos o time."
    note: "the progressive frames an unfinished action; the two completed events need the past simple ran"
```

**Item:**
> A squad writes the retro note for a Friday incident. Choose the sentence that reports the two finished actions correctly.

| Slot | Value |
|------|-------|
| A | "We runned the test again and told the team." |
| B | **"We ran the test again and told the team."** ✓ |
| C | "We run the test again and tell the team." |
| D | "We are running the test again and told the team." |

**Key:** B

**Feedback:**
> The irregular past forms carry the sequence: **`We ran the test again and told the team.`** **A** regularises *run* into *runned*, **C** leaves both verbs in the present, and **D** opens with a progressive that does not fit a finished event.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_retro_timeline_001
skill: `reading.retro_timeline`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "At 14:00."
    br_pt_form: "Às 14h."
    note: "that is when the deploy went out, not when the issue was fixed"
  - option: "Before the retro."
    br_pt_form: "Antes da retro."
    note: "that is when the team wrote the timeline, not when they fixed the issue"
  - option: "At the stand-up."
    br_pt_form: "No stand-up."
    note: "the stand-up is not mentioned in the note at all"
```

**Stimulus:**
> "Retro note, Friday: the deploy went out at 14:00. Ana saw an error in the payment log, and Caio found the same issue in staging. We fixed it at 15:20 and wrote the timeline before the retro."

**Item:**
> Skim the note for the timestamp of the fix. When did the team fix the issue?

| Slot | Value |
|------|-------|
| A | "At 14:00." |
| B | **"At 15:20."** ✓ |
| C | "Before the retro." |
| D | "At the stand-up." |

**Key:** B

**Feedback:**
> The note says **`We fixed it at 15:20`**. **A** is the deploy time, **C** is when the timeline was written, and **D** introduces an event the note never mentions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_incident_tell_001
skill: `vocab.incident_sequence_verbs`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Bruno told to the team in the incident channel."
    br_pt_form: "Bruno avisou para o time no canal de incidente."
    note: "Portuguese 'avisar para' inserts a preposition; tell takes the person directly"
  - option: "Bruno said the team in the incident channel."
    br_pt_form: "Bruno disse o time no canal de incidente."
    note: "say takes the message, not the listener; Portuguese 'disse ao time' is mapped to the wrong English verb"
  - option: "Bruno spoke the team in the incident channel."
    br_pt_form: "Bruno falou o time no canal de incidente."
    note: "speak needs 'to' before a person; Portuguese 'falou o time' treats the listener as a direct object"
```

**Item:**
> In the retro, Bruno **avisou** the team in the incident channel. Which sentence says that naturally?

| Slot | Value |
|------|-------|
| A | **"Bruno told the team in the incident channel."** ✓ |
| B | "Bruno told to the team in the incident channel." |
| C | "Bruno said the team in the incident channel." |
| D | "Bruno spoke the team in the incident channel." |

**Key:** A

**Feedback:**
> **`Told the team`** is the natural form: *tell* takes the listener without a preposition. **B** inserts the Portuguese *para*, **C** uses *say* with a person instead of a message, and **D** drops the *to* that *speak* requires.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_retro_outcome_001
skill: `reading.retro_outcome`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "She wrote the timeline."
    br_pt_form: "Ela escreveu a linha do tempo."
    note: "Ana wrote the timeline, not Lu"
  - option: "She ran the tests."
    br_pt_form: "Ela rodou os testes."
    note: "the tests were running in the background; the note does not say who ran them"
  - option: "She fixed the bug."
    br_pt_form: "Ela corrigiu o bug."
    note: "the note says 'we fixed it', a team action, not Lu alone"
```

**Stimulus:**
> "Lu took a screenshot of the error and sent it to Bruno. Ana wrote the timeline while the tests were running. We learned that we need a better check before deploy."

**Item:**
> Read the note for actions and owners. What did Lu do with the screenshot?

| Slot | Value |
|------|-------|
| A | "She wrote the timeline." |
| B | "She ran the tests." |
| C | **"She sent it to Bruno."** ✓ |
| D | "She fixed the bug." |

**Key:** C

**Feedback:**
> The note opens with **`Lu took a screenshot of the error and sent it to Bruno.`** **A** gives Ana's action to Lu, **B** turns a background process into her action, and **D** assigns the team fix to her alone.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_past_ed_final_001
skill: `pronunciation.past_ed_final`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_past_ed_final_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *fixed* /fɪkst/ ends in /t/, *learned* /lɜːrnd/ ends in /d/, and *started* /stɑːrtɪd/ ends in /ɪd/. Only the last one adds a syllable; the other two close on a single consonant.
**Step 2 — produce (ASR-scored):** read aloud:

> "We fixed the bug, started the tests again and learned one thing."

**Target phonemes:** /t/ closing *fixed* · /d/ closing *learned* · /ɪd/ closing *started* · no extra vowel after the final consonants.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_ed_regular_rule_001
skill: `grammar.past_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_regular_verbs_past`
distractors:
  - option: "We fix the bug and close the ticket at 15:20."
    br_pt_form: "Nós corrigimos o bug e fechamos o ticket às 15h20."
    note: "Portuguese keeps the present form with an explicit past time; English requires fixed and closed"
  - option: "We fixeded the bug and closed the ticket at 15:20."
    br_pt_form: "A gente corrigiu e fechou o ticket às 15h20."
    note: "adds -ed to an already inflected form because Portuguese also marks the past on the verb"
  - option: "We fixing the bug and closing the ticket at 15:20."
    br_pt_form: "Estamos corrigindo o bug e fechando o ticket às 15h20."
    note: "the -ing form needs the auxiliary be, and a finished event is not a progressive"
```

**Item:**
> Before writing the retro, review the regular past. Which sentence closes the pair of finished actions correctly?

| Slot | Value |
|------|-------|
| A | "We fix the bug and close the ticket at 15:20." |
| B | "We fixeded the bug and closed the ticket at 15:20." |
| C | **"We fixed the bug and closed the ticket at 15:20."** ✓ |
| D | "We fixing the bug and closing the ticket at 15:20." |

**Key:** C

**Feedback:**
> Regular verbs take a single **-ed** for a finished action: **`We fixed the bug and closed the ticket at 15:20.`** **A** stays in the present, **B** doubles the ending, and **D** uses *-ing* without an auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_retro_artifact_001
skill: `vocab.retro_artifacts`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_reading_skimming`
distractors:
  - option: "deadline"
    br_pt_form: "prazo"
    note: "a deadline is a time limit, not a record of what happened"
  - option: "stand-up"
    br_pt_form: "stand-up / reunião diária"
    note: "a stand-up is a short meeting, not a written account"
  - option: "screenshot"
    br_pt_form: "print / captura de tela"
    note: "a screenshot is an image, not an ordered list of events"
```

**Item:**
> Skimming a retro note, you read: "Ana wrote the timeline." Which word names the record of what happened, in order?

| Slot | Value |
|------|-------|
| A | "deadline" |
| B | "stand-up" |
| C | **"timeline"** ✓ |
| D | "screenshot" |

**Key:** C

**Feedback:**
> An ordered record of events is a **`timeline`**. A **deadline** is a limit, a **stand-up** is a meeting, and a **screenshot** is an image.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `irregular_past_and_ed_rule` | Items 1 and 6 missed | **L2** | Drill *ran, found, told, saw* against *runned, finded, told to* and contrast with the single *-ed* of *fixed* and *closed*. |
| `retro_note_skimming` | Items 2 and 4 missed | **L2** | Skim a short retro note for timestamps and owners before answering detail questions. |
| `incident_verbs_artifacts_sounds` | Items 3, 5 and 7 missed | **L2** | Rebuild *told the team* against *told to / said / spoke*, name the retro artifacts, and replay the /t/, /d/, /ɪd/ model. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_regular_verbs_past` and `les_a1_reading_skimming` and carry `prereq_lesson` for the interleaving rule.
4. All six scored items carry three distractors with a filled `br_pt_form` and a `note`; item 5 has no distractor set and declares `br_pt_form_state: not_applicable_no_distractor_set`.
5. Items target authored lesson content; no external source text is reproduced.
