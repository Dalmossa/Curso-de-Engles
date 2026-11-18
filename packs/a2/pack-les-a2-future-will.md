# Practice Pack — `les_a2_future_will`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_future_will_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_future_will.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_future_will_v1
lesson_id: les_a2_future_will
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
item_id: grm_future_will_onsite_decision_001
skill: `grammar.future_will`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I will to fix it now."
    br_pt_form: "Eu vou para consertar agora."
    note: "Portuguese 'vou' maps onto will and the preposition para gets inserted; an English modal takes the base verb with no to"
  - option: "I am will fix it now."
    br_pt_form: "Eu estou vou consertar agora."
    note: "learners stack the Portuguese 'estou' with will when both future markers feel available; English takes one future marker only"
  - option: "I going to fix it now."
    br_pt_form: "Eu indo consertar agora."
    note: "the be auxiliary is dropped because Portuguese 'vou' carries no separate auxiliary"
```

**Item:**
> In sprint planning you see red logs and volunteer to fix them on the spot. Choose the natural answer.

| Slot | Value |
|------|-------|
| A | "I will to fix it now." |
| B | **"I'll fix it now."** ✓ |
| C | "I am will fix it now." |
| D | "I going to fix it now." |

**Key:** B

**Feedback:**
> A decision made at the moment of speaking takes *will*: **`I'll fix it now.`** **A** inserts *to* after the modal, **C** stacks *be* with *will*, and **D** drops the *be* that *going to* needs.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_future_sprint_plan_001
skill: `reading.future_plan_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Run the regression suite."
    br_pt_form: "Rodar a suíte de regressão."
    note: "Bia runs it, not the writer; Portuguese notes leave the subject implicit and readers attach the action to the 'I' of the note"
  - option: "Ask the client for a status update."
    br_pt_form: "Pedir ao cliente uma atualização de status."
    note: "the client is the one asking; in a quick Portuguese-style read the subject and object of 'ask' swap places"
  - option: "Release the payment fix."
    br_pt_form: "Lançar a correção de pagamento."
    note: "the release is the team's Thursday plan, not an action the writer takes before the demo"
```

**Stimulus:**
> "Sprint plan: we are going to release the payment fix on Thursday. Bia will run the regression suite as soon as the branch is merged. The client is going to ask for a status update at three, so I'll post the summary in the release channel before the demo."

**Item:**
> What will the writer do before the demo?

| Slot | Value |
|------|-------|
| A | "Run the regression suite." |
| B | "Ask the client for a status update." |
| C | "Release the payment fix." |
| D | **"Post the summary in the release channel."** ✓ |

**Key:** D

**Feedback:**
> The writer says **`so I'll post the summary in the release channel before the demo`**. **A** is Bia's task, **B** reverses who asks whom, and **C** is the team's Thursday plan.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_future_deadline_by_001
skill: `vocab.future_time_markers`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "I'll send the report in Friday."
    br_pt_form: "Eu vou enviar o relatório na sexta."
    note: "'na sexta' maps onto in Friday; English uses on for a day and by for a deadline"
  - option: "I'll send the report until Friday."
    br_pt_form: "Eu vou enviar o relatório até sexta."
    note: "'até sexta' gets mapped onto until, which marks duration rather than a completion deadline"
  - option: "I'll send the report to Friday."
    br_pt_form: "Eu vou enviar o relatório para sexta."
    note: "Portuguese 'para' becomes to; English does not use to with a day to express a deadline"
```

**Item:**
> You need to name the deadline for sending the report, not the moment you decide to send it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I'll send the report in Friday." |
| B | "I'll send the report until Friday." |
| C | "I'll send the report to Friday." |
| D | **"I'll send the report by Friday."** ✓ |

**Key:** D

**Feedback:**
> A completion deadline takes **`by`**: **`I'll send the report by Friday.`** **A** calques *na sexta* with *in*, **B** uses *until* for a duration, and **C** carries over *para* as *to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_future_commitment_note_001
skill: `reading.future_commitment_context`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "He thinks the deploy will be smooth."
    br_pt_form: "Ele acha que o deploy vai ser tranquilo."
    note: "that is a prediction, not a promise; Portuguese readers treat will and going to as one future and skip the distinction"
  - option: "He finished the retry logic on Tuesday."
    br_pt_form: "Ele terminou a lógica de retry na terça."
    note: "that is a completed plan reported in the note, not a commitment about what comes next"
  - option: "The deploy was smooth."
    br_pt_form: "O deploy foi tranquilo."
    note: "the note says the deploy will be smooth; Portuguese 'vai ser' gets flattened into the past 'foi' on a fast read"
```

**Stimulus:**
> "Channel note — Caio: The retry logic is merged, so the plan for Tuesday is done. I think the deploy will be smooth. I won't skip the load test — I'll run it right after the stand-up."

**Item:**
> Which statement describes the commitment Caio makes in the note?

| Slot | Value |
|------|-------|
| A | "He thinks the deploy will be smooth." |
| B | "He finished the retry logic on Tuesday." |
| C | **"He will run the load test after the stand-up."** ✓ |
| D | "The deploy was smooth." |

**Key:** C

**Feedback:**
> The commitment is **`I'll run it right after the stand-up`**, so **C** restates it. **A** is a prediction, **B** reports finished work, and **D** turns a future prediction into a past fact.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_future_will_contraction_001
skill: `pronunciation.future_will_contraction`
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

**Step 1 — hear the contrast:** *I will* /aɪ ˈwɪl/ becomes *I'll* /aɪl/ in fast speech: the /wɪl/ reduces to a weak /l/ attached to the pronoun. *will* and *won't* /woʊnt/ open with /w/, rounded lips and no teeth contact — different from the /v/ of *very*, a frequent Brazilian mix-up. The final /t/ of *won't* is light and takes no extra vowel.
**Step 2 — produce (ASR-scored):** read aloud:

> "I'll run the load test, and I won't skip the demo."

**Target phonemes:** weak /l/ in *I'll* · /w/ in *will* and *won't*, not /v/ · light final /t/ in *won't* · no extra vowel after final consonants.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psp_third_person_s_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The build fail every time we push."
    br_pt_form: "O build falha toda vez que a gente faz push."
    note: "Portuguese has no third-person -s ending, so a singular subject loses the English verb marker"
  - option: "The build is fail every time we push."
    br_pt_form: "O build está falhando toda vez que a gente faz push."
    note: "Portuguese 'está falhando' carries the ongoing sense into a bare English verb with be"
  - option: "The build failing every time we push."
    br_pt_form: "O build falhando toda vez que a gente faz push."
    note: "the gerund 'falhando' maps onto -ing, but -ing alone is not a finite present"
```

**Item:**
> Reviewing the present simple before you write the sprint status, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The build fail every time we push." |
| B | **"The build fails every time we push."** ✓ |
| C | "The build is fail every time we push." |
| D | "The build failing every time we push." |

**Key:** B

**Feedback:**
> A recurring fact uses the present simple with the third-person **-s**: **`The build fails every time we push.`** **A** drops **-s** because Portuguese marks no such ending, **C** inserts *be* before the bare verb, and **D** leaves a gerund with no auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psp_followup_client_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "I'll reply the status update to the client."
    br_pt_form: "Vou responder a atualização de status para o cliente."
    note: "reply answers an incoming message; here the status update is being written for the first time"
  - option: "I'll attach the client to the status update."
    br_pt_form: "Vou anexar o cliente à atualização de status."
    note: "Portuguese 'anexar' maps onto attach, but attach adds a file to a message, not a person"
  - option: "I'll forward the status update to the client."
    br_pt_form: "Vou encaminhar a atualização de status para o cliente."
    note: "forward passes a received message onward; this update originates in the message being written"
```

**Item:**
> Reviewing the email basics, you promised a status update and now need to send a short message checking whether the client received it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I'll reply the status update to the client." |
| B | "I'll attach the client to the status update." |
| C | "I'll forward the status update to the client." |
| D | **"I'll follow up with the client about the status update."** ✓ |

**Key:** D

**Feedback:**
> Checking on a message you sent is **`follow up with`**: **`I'll follow up with the client about the status update.`** **A** answers an incoming message, **B** treats a person as a file to attach, and **C** passes a received message onward.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `future_will_onsite_decision` | Item 1 missed | **L2** | Rebuild *I'll fix it* against *I will to fix it* and *I am will fix it* in incident calls. |
| `future_time_markers_by` | Item 3 missed | **L2** | Contrast *by Friday*, *on Friday* and *until Friday* in sprint commitments. |
| `future_commitment_vs_prediction` | Items 2 and 4 missed | **L2** | Separate *I'll post it* from *the client is going to ask* and *I think it will be* in a sprint note. |
| `present_simple_third_s_review` | Item 6 missed | **L2** | Drill the third-person **-s** in recurring build reports such as *the build fails every time*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
