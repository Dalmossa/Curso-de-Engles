# Practice Pack — `les_b1_project_client_sim`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_project_client_sim_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_project_client_sim.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_client_sim_v1
lesson_id: les_b1_project_client_sim
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
item_id: grm_project_client_sim_meeting_open_001
skill: `grammar.scope_hedging_modals`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Let's discuss about the scope first."
    br_pt_form: "Vamos discutir sobre o escopo primeiro."
    note: "discuss is transitive in English; the preposition about is L1 transfer from Portuguese"
  - option: "Could we to add the app to phase two?"
    br_pt_form: "Poderíamos para incluir o aplicativo na fase dois?"
    note: "a modal verb is followed by the bare infinitive, not by to"
  - option: "We starting the kickoff now."
    br_pt_form: "Nós iniciando o kickoff agora."
    note: "a progressive form needs the auxiliary are; a bare ing-form cannot open the sentence"
```

**Item:**
> You are opening a requirements meeting with a client. Which line is grammatical and sets the order of the meeting?

| Slot | Value |
|------|-------|
| A | "Let's discuss about the scope first." |
| B | **"Let's start on time: requirements, scope, then the timeline."** ✓ |
| C | "Could we to add the app to phase two?" |
| D | "We starting the kickoff now." |

**Key:** B

**Feedback:**
> **`Let's start on time: requirements, scope, then the timeline.`** is the natural signpost: it announces three parts before the content. **A** keeps the Portuguese preposition after *discuss*, **C** inserts *to* after a modal, and **D** uses a bare *-ing* form without an auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_project_client_sim_scope_memo_001
skill: `reading.project_client_meeting_dialogue`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Add the mobile app to phase one."
    br_pt_form: "Incluir o aplicativo mobile na fase um."
    note: "Helena accepts the two-week cost and explicitly keeps the app out of phase one"
  - option: "Move the daily view to phase two."
    br_pt_form: "Mover a visão diária para a fase dois."
    note: "the daily sales view is the must-have for kickoff, not the deferred item"
  - option: "Cancel the kickoff until the app is ready."
    br_pt_form: "Cancelar o kickoff até o aplicativo ficar pronto."
    note: "nothing is cancelled; the team signs off on phase one in the same meeting"
```

**Stimulus:**
> "Helena: We need the order dashboard for 120 stores. The daily sales view by region is a must-have for kickoff. — Camila: A mobile app would be a new deliverable; it adds two weeks. — Helena: Fine. Let's sign off on phase one and put the app in the follow-up note as phase two."

**Item:**
> What did Helena agree to at the end of the meeting?

| Slot | Value |
|------|-------|
| A | Add the mobile app to phase one. |
| B | **Keep the app out of phase one and note it for phase two.** ✓ |
| C | Move the daily view to phase two. |
| D | Cancel the kickoff until the app is ready. |

**Key:** B

**Feedback:**
> Helena closes with **`Let's sign off on phase one and put the app in the follow-up note as phase two.`** **A** reverses that decision, **C** defers the must-have instead of the app, and **D** invents a cancellation that never appears in the dialogue.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_project_client_sim_deliverable_001
skill: `vocab.project_meeting_deliverable`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "milestones"
    br_pt_form: "marcos"
    note: "a milestone is a checkpoint date, not the artefact handed over on that date"
  - option: "stakeholders"
    br_pt_form: "partes interessadas"
    note: "stakeholders are people or areas with an interest, not artefacts"
  - option: "follow-ups"
    br_pt_form: "acompanhamentos"
    note: "a follow-up is a later message or action, not the thing produced in phase one"
```

**Item:**
> Which word names a tangible output the team will hand over? "The wireframes and the API spec are ______."

| Slot | Value |
|------|-------|
| A | milestones |
| B | stakeholders |
| C | **deliverables** ✓ |
| D | follow-ups |

**Key:** C

**Feedback:**
> **`Deliverables`** are the tangible artefacts — wireframes and the API spec. **A** names the checkpoint dates instead, **B** names people rather than outputs, and **D** names the later messages that track the work.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_project_client_sim_kickoff_notes_001
skill: `reading.project_scope_email`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The design sign-off moved to week four."
    br_pt_form: "O aceite do design passou para a semana quatro."
    note: "design sign-off is confirmed for week three; no date moved"
  - option: "The mobile app was added to phase one."
    br_pt_form: "O aplicativo mobile foi incluído na fase um."
    note: "the email puts the app in phase two, as agreed in the meeting"
  - option: "The milestones were already sent on Monday."
    br_pt_form: "Os marcos já foram enviados na segunda-feira."
    note: "the sender will send the milestones by Friday; Monday is when the data wait began"
```

**Stimulus:**
> "Subject: Norte Varejo — phase one scope. Hi Helena, confirming what we agreed: the daily sales view by region is in phase one; the mobile app is phase two. Design sign-off is week three. I've been waiting for the regional data since Monday, so that is the risk I want to flag. I'll send the milestones by Friday."

**Item:**
> What is the risk the sender flags in the follow-up note?

| Slot | Value |
|------|-------|
| A | The design sign-off moved to week four. |
| B | The mobile app was added to phase one. |
| C | The milestones were already sent on Monday. |
| D | **The regional data has not arrived since Monday.** ✓ |

**Key:** D

**Feedback:**
> The note says **`I've been waiting for the regional data since Monday, so that is the risk I want to flag.`** **A** moves a date that was never moved, **B** reverses the phase decision, and **C** turns Monday into the delivery date of the milestones, which are due by Friday.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_project_client_sim_milestone_scope_001
skill: `pronunciation.project_meeting_milestone_diphthong`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_project_client_sim_milestone_scope_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *milestone* begins with /aɪ/, the diphthong of *my*, and ends with /oʊ/ — not "mil-estone". *Scope* also ends in /oʊ/, a long gliding vowel, not the short Portuguese /o/. *Follow-up* starts with /f/, lower lip on the upper teeth, never the rounded /w/ or the voiced /v/. *Three* opens with the voiceless /θ/, while *the* opens with its voiced pair /ð/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The first milestone is scope sign-off, and we followed up on three deliverables."

**Target phonemes:** /aɪ/ in *milestone* · /oʊ/ in *milestone* and *scope* · /f/ in *followed* · /θ/ in *three* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_project_client_sim_modal_can_need_001
skill: `grammar.modal_can_need`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_meeting_open
distractors:
  - option: "Can we to add the app to the scope?"
    br_pt_form: "Podemos para incluir o aplicativo no escopo?"
    note: "a modal takes the bare verb; inserting to after can is L1 transfer"
  - option: "We can add the app to the scope?"
    br_pt_form: "Podemos incluir o aplicativo no escopo?"
    note: "statement order with rising intonation alone is not the standard written request"
  - option: "Can we adding the app to the scope?"
    br_pt_form: "Podemos incluindo o aplicativo no escopo?"
    note: "a present participle cannot follow a modal verb"
```

**Item:**
> Reviewing meeting openers: which line is a correct polite request to put an item on the agenda?

| Slot | Value |
|------|-------|
| A | "Can we to add the app to the scope?" |
| B | **"Can we add the app to the scope?"** ✓ |
| C | "We can add the app to the scope?" |
| D | "Can we adding the app to the scope?" |

**Key:** B

**Feedback:**
> A polite request in a meeting keeps interrogative order and a bare verb after the modal: **`Can we add the app to the scope?`** **A** inserts *to* after *can*, **C** relies on intonation alone, and **D** substitutes a participle for the base form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_project_client_sim_it_terms_basics_001
skill: `vocab.it_terms_basics`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "repository"
    br_pt_form: "repositório"
    note: "a repository stores code or data; it is not the view a stakeholder reads"
  - option: "endpoint"
    br_pt_form: "ponto de acesso da API"
    note: "an endpoint is an API address, not the screen that shows daily sales"
  - option: "pipeline"
    br_pt_form: "fluxo de processamento de dados"
    note: "a pipeline moves data through stages; it does not display the result"
```

**Item:**
> Reviewing IT basics: which word names the screen that shows the daily sales view by region?

| Slot | Value |
|------|-------|
| A | **dashboard** ✓ |
| B | repository |
| C | endpoint |
| D | pipeline |

**Key:** A

**Feedback:**
> A **`dashboard`** is the visual view a stakeholder reads. **B** is storage, **C** is an API address, and **D** is the data flow that feeds the screen.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `meeting_open_signpost` | Item 1 missed | **L2** | Contrast *discuss about / discuss*, *could we to / could we* and *we starting / we are starting* in short meeting openings that announce exactly three parts. |
| `client_scope_detail` | Items 2 and 4 missed | **L2** | Drill must-have versus deferred item, the week-three sign-off and the *since Monday* risk in a five-line follow-up note; separate *phase one* from *phase two*. |
| `meeting_vocab_review` | Items 3, 6 and 7 missed | **L2** | Recycle *deliverable / milestone*, the *can + bare verb* opener from `les_a2_meeting_open` and *dashboard / endpoint / pipeline* from `les_a2_it_terms_basics` in one scoping exchange; extend with the hedging drill from `les_b1_negotiation` and the pacing drill from `les_b1_presentation_skills`. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_meeting_open` (modal_can_need, meeting_vocab) and `les_a2_it_terms_basics` (it_computer_terms) and carry `prereq_lesson` for the interleaving rule. `les_b1_negotiation` and `les_b1_presentation_skills` are registered prerequisites in the lesson JSON and are recycled in the L2 seed instead of occupying a pack slot.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. `listening_items: 0` is deliberate: the lesson's listening input is `deferred_render` with no audio fixture, so no listening item is scored here. The ⚠️ marker is retained rather than hidden.
6. The grammar-rag query `client meeting simulation requirements scope timeline follow up` (top-k 2) returned low-similarity material (~22) about starting a meeting on time and about *for* + period / *since* + point in time. Only those two reusable patterns informed the authored dialogue and the follow-up note; no retrieved text was reproduced.
7. The client (Norte Varejo / Helena Prado) and the vendor (Vega Software / Camila) are invented for this lesson. Every option, gloss, distractor note and stimulus was authored in a clean room; no restricted source was consulted or reproduced.
