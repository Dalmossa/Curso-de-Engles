# Practice Pack — `les_a2_deadlines_tasks`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_deadlines_tasks_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_deadlines_tasks.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_deadlines_tasks_v1
lesson_id: les_a2_deadlines_tasks
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
item_id: grm_deadline_time_expressions_001
skill: `grammar.deadline_time_expressions`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The deadline is in Thursday, so I'll send the patch in the next two hours."
    br_pt_form: "O prazo é na quinta-feira, então vou enviar o patch nas próximas duas horas."
    note: "Portuguese uses 'na' for a weekday; English takes 'on' for days of the week"
  - option: "The deadline is on Thursday, so I'll send the patch in the two next hours."
    br_pt_form: "O prazo é na quinta-feira, então vou enviar o patch nas duas próximas horas."
    note: "word order of 'as duas próximas horas' transferred; English puts 'next' before the numeral"
  - option: "The deadline is on Thursday, so I'll send the patch in next two hours."
    br_pt_form: "O prazo é na quinta-feira, então vou enviar o patch nas próximas duas horas sem artigo."
    note: "the article is dropped before 'next two hours'; Portuguese omits it in the same position"
```

**Item:**
> In a stand-up you state the deadline for the API patch. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "The deadline is in Thursday, so I'll send the patch in the next two hours." |
| B | **"The deadline is on Thursday, so I'll send the patch in the next two hours."** ✓ |
| C | "The deadline is on Thursday, so I'll send the patch in the two next hours." |
| D | "The deadline is on Thursday, so I'll send the patch in next two hours." |

**Key:** B

**Feedback:**
> A weekday takes **`on`** and the time expression is **`the next two hours`**: `next` comes before the numeral and keeps the article. **A** transfers *na quinta* into *in Thursday*, **C** copies the Portuguese order *as duas próximas horas*, and **D** loses the article before *next two hours*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_deadline_standup_note_001
skill: `reading.deadline_note`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Send the old estimate to the client."
    br_pt_form: "Enviar o estimativa antiga para o cliente."
    note: "the writer already sent the old estimate yesterday, so sending it is not the pending action"
  - option: "Finish the load test."
    br_pt_form: "Terminar o teste de carga."
    note: "the load test finished in time for the demo, so it is no longer pending"
  - option: "Follow up by email before the review."
    br_pt_form: "Acompanhar por e-mail antes da revisão."
    note: "the note says the follow-up happens after the review, not before it"
```

**Stimulus:**
> "Stand-up note — The API fix is due on Thursday at 15:00. I sent the old estimate to the client yesterday and I need to correct it today. I'll follow up by email after the review. The load test finished in time for the demo."

**Item:**
> What does the writer still need to do today?

| Slot | Value |
|------|-------|
| A | "Send the old estimate to the client." |
| B | "Finish the load test." |
| C | **"Correct the old estimate."** ✓ |
| D | "Follow up by email before the review." |

**Key:** C

**Feedback:**
> The note says **`I need to correct it today`**, so correcting the old estimate is the pending action. **A** repeats an action already finished yesterday, **B** turns a completed load test into a pending one, and **D** reverses the stated order of the follow-up.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_deadline_followup_001
skill: `vocab.deadline_vocab`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "I'll catch up by email."
    br_pt_form: "Vou me atualizar por e-mail."
    note: "catch up means exchanging news or reaching the same level, not checking the progress of a task"
  - option: "I'll sign off by email."
    br_pt_form: "Vou me despedir por e-mail."
    note: "sign off closes a conversation, the opposite of continuing a thread about a deadline"
  - option: "I'll forward it by email."
    br_pt_form: "Vou encaminhar isso por e-mail."
    note: "forward passes an existing message onward; it does not mean coming back to check a commitment"
```

**Item:**
> The client asks what happens after the code review. Which sentence means "vou acompanhar o prazo por e-mail"?

| Slot | Value |
|------|-------|
| A | **"I'll follow up by email."** ✓ |
| B | "I'll catch up by email." |
| C | "I'll sign off by email." |
| D | "I'll forward it by email." |

**Key:** A

**Feedback:**
> Checking back on a commitment through email is **`follow up by email`**. **B** describes catching up on news, **C** ends the exchange instead of keeping it open, and **D** sends an existing message to a new recipient.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_followup_thread_001
skill: `reading.followup_thread`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The review moved to 10:00."
    br_pt_form: "A revisão mudou para as 10h."
    note: "10:00 is simply the review time; the text does not say it moved"
  - option: "The client cancelled the demo."
    br_pt_form: "O cliente cancelou a demo."
    note: "the demo is only mentioned as the moment before the backlog check"
  - option: "The old estimate was deleted."
    br_pt_form: "O estimativa antiga foi apagada."
    note: "the note asks to keep the old estimate in the notes, the opposite of deleting it"
```

**Stimulus:**
> "Thread reply — I updated the board: the review is at 10:00 and the deadline moved to Friday. I wrote to the client about the new date this morning. Please check the backlog before the demo, and let's keep the old estimate in the notes."

**Item:**
> What actually changed in the schedule?

| Slot | Value |
|------|-------|
| A | "The review moved to 10:00." |
| B | **"The deadline moved to Friday."** ✓ |
| C | "The client cancelled the demo." |
| D | "The old estimate was deleted." |

**Key:** B

**Feedback:**
> The thread states **`the deadline moved to Friday`**, so that is the schedule change. **A** mistakes a stated time for a change, **C** invents a cancellation, and **D** contradicts the instruction to keep the old estimate.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_deadline_s_cluster_001
skill: `pronunciation.deadline_s_cluster`
type: `minimal_pair_production`
difficulty_b: 0.05
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *status* /ˈsteɪtəs/ and *sprint* /sprɪnt/ start with /s/ clusters; *task* /tæsk/ ends in /sk/. Brazilian Portuguese inserts a vowel before those clusters, producing "estatus", "esprint" and "tasque".
**Step 2 — produce (ASR-scored):** read aloud:

> "The status of the task is on track for the next sprint."

**Target phonemes:** /s/ in *status, sprint* with no initial /e/ · /sk/ closing *task* · /t/ in *next* released straight into *sprint*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_irregular_sent_yesterday_001
skill: `grammar.past_simple_irregular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_regular_verbs_past`
distractors:
  - option: "I send the wrong estimate yesterday."
    br_pt_form: "Eu envio o estimativa errada ontem."
    note: "yesterday needs the past tense; Portuguese commonly keeps the present form beside a past time word"
  - option: "I send-ed the wrong estimate yesterday."
    br_pt_form: "Eu enviei-ed o estimativa errada ontem."
    note: "send is irregular: the past form is sent, not a regular -ed ending"
  - option: "I have sent the wrong estimate yesterday."
    br_pt_form: "Eu tenho enviado a estimativa errada ontem."
    note: "present perfect does not combine with a finished time expression such as yesterday"
```

**Item:**
> Reviewing the past tense before you write the follow-up note, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I send the wrong estimate yesterday." |
| B | **"I sent the wrong estimate yesterday."** ✓ |
| C | "I send-ed the wrong estimate yesterday." |
| D | "I have sent the wrong estimate yesterday." |

**Key:** B

**Feedback:**
> With **`yesterday`** the verb is in the past simple, and *send* is irregular: **`I sent the wrong estimate yesterday.`** **A** keeps the present form, **C** applies the regular *-ed* rule to an irregular verb, and **D** pairs the present perfect with a finished time expression.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_email_followup_verbs_001
skill: `vocab.email_followup_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please reply the client note to the platform team."
    br_pt_form: "Por favor, responda a nota do cliente para o time de plataforma."
    note: "reply answers the original sender; it does not pass the message to a new team"
  - option: "Please attach the client note to the platform team."
    br_pt_form: "Por favor, anexe a nota do cliente no time de plataforma."
    note: "attach adds a file to a message, it does not send a received message onward"
  - option: "Please follow up the client note to the platform team."
    br_pt_form: "Por favor, acompanhe a nota do cliente para o time de plataforma."
    note: "follow up means checking progress later, not delivering an existing note to a recipient"
```

**Item:**
> Reviewing the email basics, you want to send a received client note to the platform team without editing it. Which verb is correct?

| Slot | Value |
|------|-------|
| A | **"Please forward the client note to the platform team."** ✓ |
| B | "Please reply the client note to the platform team." |
| C | "Please attach the client note to the platform team." |
| D | "Please follow up the client note to the platform team." |

**Key:** A

**Feedback:**
> Passing a received message to someone else unchanged is **`forward`**: `Please forward the client note to the platform team.` **B** answers the sender, **C** adds a file instead of sharing the message, and **D** describes a later check on progress rather than the transfer.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `deadline_time_expressions` | Item 1 missed | **L2** | Rebuild *on + weekday* and *the next two hours* against *in Thursday* and *the two next hours*. |
| `follow_up_verb_vs_noun` | Item 3 missed | **L2** | Contrast *I'll follow up by email* with *catch up*, *sign off* and *a follow-up email*. |
| `irregular_sent_past` | Item 6 missed | **L2** | Drill *send → sent* beside *yesterday* and against *send-ed* and *have sent yesterday*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_regular_verbs_past` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
5. The *next + numeral* order in Item 1 and the *in time for* phrasing in Item 2 come from the grammar-reference query of 2026-11-18 recorded in the lesson's authoring report.
