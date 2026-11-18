# Practice Pack — `les_a2_prepositions_basic`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_prepositions_basic_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_prepositions_basic.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_prepositions_basic_v1
lesson_id: les_a2_prepositions_basic
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
item_id: grm_prep_place_time_selection_001
skill: `grammar.prepositions_place_time`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The config file is on the folder in the staging server, and the deploy is at 15:00."
    br_pt_form: "O arquivo de configuração está na pasta no servidor de staging, e o deploy é às 15:00."
    note: "Portuguese uses the same 'na/no' for both containment and surface; English needs in for a folder and on for a server"
  - option: "The config file is in the folder on the staging server, and the deploy is in 15:00."
    br_pt_form: "O arquivo de configuração está na pasta no servidor de staging, e o deploy é em 15:00."
    note: "'em 15:00' maps onto in, but a clock time takes at in English"
  - option: "The config file is in the folder in the staging server, and the deploy is on 15:00."
    br_pt_form: "O arquivo de configuração está na pasta no servidor de staging, e o deploy fica em cima das 15:00."
    note: "'em cima das' is a calque of on; on marks a surface, never a clock time"
```

**Item:**
> A developer tells a teammate where the staging config lives and when the deploy starts. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "The config file is on the folder in the staging server, and the deploy is at 15:00." |
| B | **"The config file is in the folder on the staging server, and the deploy is at 15:00."** ✓ |
| C | "The config file is in the folder on the staging server, and the deploy is in 15:00." |
| D | "The config file is in the folder in the staging server, and the deploy is on 15:00." |

**Key:** B

**Feedback:**
> A folder is an interior (**`in`**), a server is a platform (**`on`**) and a clock time is a point (**`at`**). **A** copies the Portuguese *na/no* split, **C** transfers *em 15:00* into *in*, and **D** uses *on* for a time and *in* for the server.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_prep_desk_note_001
skill: `reading.prepositions_note`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "On the wall next to the standup table."
    br_pt_form: "Na parede ao lado da mesa de standup."
    note: "the dashboard is on the wall; the Portuguese 'na parede' makes that location salient for the wrong noun"
  - option: "Under the team header."
    br_pt_form: "Debaixo do cabeçalho do time."
    note: "that is where the incident pin sits, not the runbook"
  - option: "In room 204 on the second floor."
    br_pt_form: "Na sala 204 no segundo andar."
    note: "that is the dashboard's room; a Brazilian reader maps 'na sala' onto the first location mentioned"
```

**Stimulus:**
> "Sprint note — the runbook is in the shared drive. The dashboard is on the wall in room 204, on the second floor. The release meeting is on Monday at nine. The incident pin is under the team header."

**Item:**
> Where is the runbook?

| Slot | Value |
|------|-------|
| A | "On the wall next to the standup table." |
| B | "Under the team header." |
| C | **"In the shared drive."** ✓ |
| D | "In room 204 on the second floor." |

**Key:** C

**Feedback:**
> The note opens with **`the runbook is in the shared drive`**. **A** and **D** locate the dashboard instead, and **B** locates the incident pin.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_prep_place_time_chunks_001
skill: `vocab.prepositions_place_time`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "We are in the second floor, on room 204, at the desk by the window."
    br_pt_form: "Estamos no segundo andar, na sala 204, na mesa perto da janela."
    note: "'no andar / na sala' collapses floor and room in Portuguese; English uses on for floors and in for rooms"
  - option: "We are on the second floor, in room 204, in the desk by the window."
    br_pt_form: "Estamos no segundo andar, na sala 204, em cima da mesa perto da janela."
    note: "'em cima da mesa' means on top of the desk; sitting at the desk takes at"
  - option: "We are on the second floor, in room 204, to the desk by the window."
    br_pt_form: "Estamos no segundo andar, na sala 204, para a mesa perto da janela."
    note: "'para a mesa' maps onto to, which marks direction rather than a stationary position"
```

**Item:**
> A colleague gives you the location of the pairing station. Which sentence uses the natural place chunks?

| Slot | Value |
|------|-------|
| A | "We are in the second floor, on room 204, at the desk by the window." |
| B | "We are on the second floor, in room 204, in the desk by the window." |
| C | "We are on the second floor, in room 204, to the desk by the window." |
| D | **"We are on the second floor, in room 204, at the desk by the window."** ✓ |

**Key:** D

**Feedback:**
> Floors take **`on`**, rooms take **`in`** and the exact workstation takes **`at`**: **`We are on the second floor, in room 204, at the desk by the window.`** **A** swaps floor and room, **B** says *in the desk*, and **C** turns the location into direction with *to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_prep_schedule_note_001
skill: `reading.prepositions_schedule`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "On Tuesday."
    br_pt_form: "Na terça-feira."
    note: "Tuesday is the new day of the retro, not the day of the freeze"
  - option: "At 18:00 on Thursday."
    br_pt_form: "Às 18:00 de quinta-feira."
    note: "Thursday is the old retro slot; the freeze moved to Friday"
  - option: "Before the standup."
    br_pt_form: "Antes do standup."
    note: "that is when the onboarding session happens, not the freeze"
```

**Stimulus:**
> "Calendar note — the code freeze is on Friday at 18:00. The retro moved from Thursday to Tuesday, and the onboarding session is in room 204 before the standup."

**Item:**
> When is the code freeze?

| Slot | Value |
|------|-------|
| A | **"On Friday at 18:00."** ✓ |
| B | "On Tuesday." |
| C | "At 18:00 on Thursday." |
| D | "Before the standup." |

**Key:** A

**Feedback:**
> The note states **`the code freeze is on Friday at 18:00`**. **B** is the retro's new day, **C** is the retro's old day with the right hour, and **D** belongs to the onboarding session.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_prep_in_on_at_001
skill: `pronunciation.prepositions_function_words`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *in* /ɪn/ has a short relaxed vowel, *on* /ɑːn/ an open long one and *at* /æt/ a wide front one; in connected speech *at* weakens to /ət/. Brazilian Portuguese tends to close /æ/ toward /e/ and to insert a vowel inside /kst/ in *next to*.
**Step 2 — produce (ASR-scored):** read aloud:

> "The logs are in the folder next to the monitor, and the deploy is at nine on Monday."

**Target phonemes:** /ɪ/ in *in* · /ɑː/ in *on* · /æ/ (weak /ət/) in *at* · /nekst tuː/ in *next to* with no epenthetic vowel · no extra vowel after the final /t/ of *at*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_prep_present_simple_review_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The deploy script is run at nine every Monday."
    br_pt_form: "O script de deploy é executado às nove toda segunda-feira."
    note: "'é executado' invites a passive in English, but a routine is stated actively with the present simple"
  - option: "The deploy script run at nine every Monday."
    br_pt_form: "O script de deploy roda às nove toda segunda-feira."
    note: "Portuguese marks no third-person -s ending, so the singular subject loses the English verb marker"
  - option: "The deploy script running at nine every Monday."
    br_pt_form: "O script de deploy rodando às nove toda segunda-feira."
    note: "the gerund 'rodando' maps onto -ing, but -ing alone is not a finite present"
```

**Item:**
> Reviewing the present simple before you describe a recurring deploy, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The deploy script is run at nine every Monday." |
| B | **"The deploy script runs at nine every Monday."** ✓ |
| C | "The deploy script run at nine every Monday." |
| D | "The deploy script running at nine every Monday." |

**Key:** B

**Feedback:**
> A recurring routine uses the present simple with the third-person **-s**: **`The deploy script runs at nine every Monday.`** **A** inserts a passive that the Portuguese agentless sentence suggests, **C** drops **-s** because Portuguese has no such ending, and **D** leaves a gerund with no auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_prep_deadline_vocab_review_001
skill: `vocab.deadline_vocab`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_deadlines_tasks
distractors:
  - option: "The deadline is in next Monday at noon."
    br_pt_form: "O prazo é na próxima segunda ao meio-dia."
    note: "'na próxima segunda' maps onto in, but English drops the preposition before next and last"
  - option: "The deadline is at next Monday at noon."
    br_pt_form: "O prazo é à próxima segunda ao meio-dia."
    note: "at marks a clock point, not a day; the day already has its own at noon"
  - option: "The deadline is on next Monday in noon."
    br_pt_form: "O prazo é na próxima segunda em meio-dia."
    note: "'em meio-dia' transfers into in; a clock point takes at"
```

**Item:**
> Reviewing deadline chunks, a teammate says "o prazo é na próxima segunda ao meio-dia". Which sentence says the same thing?

| Slot | Value |
|------|-------|
| A | "The deadline is in next Monday at noon." |
| B | "The deadline is at next Monday at noon." |
| C | **"The deadline is next Monday at noon."** ✓ |
| D | "The deadline is on next Monday in noon." |

**Key:** C

**Feedback:**
> Before *next Monday* English uses no preposition, and the clock point takes **`at`**: **`The deadline is next Monday at noon.`** **A** transfers *na próxima* into *in*, **B** puts *at* on the day, and **D** adds both errors at once.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `prepositions_place_time_split` | Item 1 missed | **L2** | Contrast *in the folder / on the server / at 15:00* against the Portuguese *na/no/às* collapse. |
| `place_chunks_floor_room_desk` | Item 3 missed | **L2** | Rebuild *on the second floor, in room 204, at the desk* and drop *in the floor*, *to the desk*. |
| `deadline_preposition_review` | Items 4 and 7 missed | **L2** | Extract day and hour from schedule notes, then rebuild *next Monday at noon* without *in* or *on* before *next*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_deadlines_tasks` and carry `prereq_lesson` for the interleaving rule.
4. Every MCQ distractor carries a filled `br_pt_form` and a `note`; the six scored items account for the 6/6 coverage in the manifest.
5. Items target authored lesson content; no external source text is reproduced.
