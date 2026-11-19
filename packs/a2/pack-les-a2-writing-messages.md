# Practice Pack — `les_a2_writing_messages`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_writing_messages_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_writing_messages.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_writing_messages_v1
lesson_id: les_a2_writing_messages
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
item_id: grm_writing_messages_register_001
skill: `grammar.writing_message_register`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Dear Marina, I am writing to inform you that staging is green."
    br_pt_form: "Prezada Marina, venho informar que o staging está verde."
    note: "a formal email opening does not fit a quick chat message to a teammate"
  - option: "Hi Marina, I am writing to inform you that staging is green."
    br_pt_form: "Oi, Marina, venho informar que o staging está verde."
    note: "the informal opener clashes with the formal reporting formula that follows it"
  - option: "Dear team, please be advised that staging is green."
    br_pt_form: "Prezado time, informamos que o staging está verde."
    note: "formal notice register, appropriate for a client circular rather than a chat update"
```

**Item:**
> You post a quick update in the team chat before a deploy. Which line fits the register?

| Slot | Value |
|------|-------|
| A | "Dear Marina, I am writing to inform you that staging is green." |
| B | **"Hi Marina, staging is green. I'll check the worker log now."** ✓ |
| C | "Hi Marina, I am writing to inform you that staging is green." |
| D | "Dear team, please be advised that staging is green." |

**Key:** B

**Feedback:**
> *Hi Marina* with the contraction **`I'll`** is the natural chat register. **A** and **D** are formal email wording, while **C** mixes an informal opener with *I am writing to inform you*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_writing_messages_thread_001
skill: `reading.message_thread`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "It is blocking the deploy."
    br_pt_form: "Está bloqueando o deploy."
    note: "Rafa answers 'No, it isn't' when Marina asks whether it is blocking"
  - option: "He will fix it before 15:00."
    br_pt_form: "Ele vai corrigir isso antes das 15:00."
    note: "he promises a note and a check, not a fix with a deadline"
  - option: "The duty engineer found it first."
    br_pt_form: "O engenheiro de plantão encontrou isso primeiro."
    note: "Rafa says 'I found one warning'; the duty engineer only receives the note"
```

**Stimulus:**
> "09:12 — Marina: The deploy is at 15:00. Can you check staging before then? / 09:14 — Rafa: Sure. I'll check it now and post a short note here. / 09:20 — Rafa: Update: staging is green. I found one warning in the worker log. / 09:21 — Marina: Thanks. Short version — is it blocking? / 09:22 — Rafa: No, it isn't. I'm writing a note for the duty engineer."

**Item:**
> What does Rafa say about the warning in the worker log?

| Slot | Value |
|------|-------|
| A | "It is blocking the deploy." |
| B | **"He found it in the worker log and it is not blocking."** ✓ |
| C | "He will fix it before 15:00." |
| D | "The duty engineer found it first." |

**Key:** B

**Feedback:**
> Rafa reports **`I found one warning in the worker log`** and then confirms **`No, it isn't`** (blocking). **A** reverses that answer, **C** invents a fix deadline, and **D** assigns the discovery to the wrong person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_writing_messages_closers_001
skill: `vocab.messages_closers`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Without more,"
    br_pt_form: "Sem mais,"
    note: "a word-for-word calque of the Portuguese closing; it is not an English sign-off"
  - option: "Attentively,"
    br_pt_form: "Atenciosamente,"
    note: "the Portuguese formal closing does not exist as an English email sign-off"
  - option: "Finishing here,"
    br_pt_form: "Encerrando por aqui,"
    note: "understandable but not a conventional closing chunk in en-US work messages"
```

**Item:**
> Which line closes a short note to a teammate in natural en-US?

| Slot | Value |
|------|-------|
| A | "Without more," |
| B | "Attentively," |
| C | "Finishing here," |
| D | **"Thanks, Rafa"** ✓ |

**Key:** D

**Feedback:**
> **`Thanks, Rafa`** is the short, natural sign-off for a chat note; *Best regards* is reserved for more formal email. **A**, **B** and **C** are calques or unusual closures that a native reader would not expect in a work message.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_writing_messages_note_001
skill: `reading.message_note`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Reply to confirm the note."
    br_pt_form: "Responder para confirmar o recado."
    note: "the note says 'You don't need to reply', so a confirmation reply is not requested"
  - option: "Fix the warning in the worker log."
    br_pt_form: "Corrigir o aviso no log do worker."
    note: "the warning is described as not blocking; no repair task is assigned"
  - option: "Check staging at 09:20."
    br_pt_form: "Checar o staging às 09:20."
    note: "the writer already checked staging at 09:20; that is a reported action"
```

**Stimulus:**
> "Note for the duty engineer — I checked staging at 09:20. It is green. I found one warning in the worker log; it is not blocking. I am adding the details to the ticket now. Please review the ticket before the deploy at 15:00. You don't need to reply — just flag it if you see a problem."

**Item:**
> What does the writer ask the duty engineer to do?

| Slot | Value |
|------|-------|
| A | "Reply to confirm the note." |
| B | **"Review the ticket before the deploy."** ✓ |
| C | "Fix the warning in the worker log." |
| D | "Check staging at 09:20." |

**Key:** B

**Feedback:**
> The request is explicit: **`Please review the ticket before the deploy at 15:00.`** **A** contradicts *No need to reply*, **C** turns a non-blocking warning into a task, and **D** mistakes a completed action for a request.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_writing_messages_thanks_001
skill: `pronunciation.messages_thanks_headsup`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *thanks* /θæŋks/ starts with the voiceless /θ/, while *the* /ðə/ starts with voiced /ð/. Brazilian Portuguese tends to replace both with /t/, /d/ or /f/. In *hi* and *heads-up*, /h/ needs a breath before the vowel; in *Rafa*, /r/ is a light tap, not the back /r/ of Portuguese.
**Step 2 — produce (ASR-scored):** read aloud:

> "Hi Rafa, thanks for the heads-up on the worker log."

**Target phonemes:** /h/ in *hi, heads-up* · /θ/ in *thanks* · /ð/ in *the* · /r/ in *Rafa*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_writing_messages_svo_001
skill: `grammar.svo_order`
type: `error_correction`
difficulty_b: -0.5
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_writing_svo
distractors:
  - option: "Writing the note now."
    br_pt_form: "Escrevendo o recado agora."
    note: "a bare -ing clause has no subject and no finite verb in English"
  - option: "I am writing the note now, and I added the details to the ticket."
    br_pt_form: "Estou escrevendo o recado agora e adicionei os detalhes ao ticket."
    note: "it switches from progressive to past inside one note about the same action"
  - option: "The note I am writing now."
    br_pt_form: "O recado eu estou escrevendo agora."
    note: "the object is fronted in Portuguese order; English written notes keep subject before verb"
```

**Item:**
> Reviewing SVO order and tense consistency before you write the note, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Writing the note now." |
| B | "I am writing the note now, and I added the details to the ticket." |
| C | **"I am writing the note now and adding the details to the ticket."** ✓ |
| D | "The note I am writing now." |

**Key:** C

**Feedback:**
> **`I am writing the note now and adding the details to the ticket.`** keeps an explicit subject, SVO order and one progressive tense across both actions. **A** and **D** are not finite SVO clauses, and **B** mixes progressive with past simple.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_writing_messages_prereq_chunks_001
skill: `vocab.writing_svo_chunks`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_writing_svo
distractors:
  - option: "Is necessary to update the ticket."
    br_pt_form: "É necessário atualizar o ticket."
    note: "the Portuguese impersonal has no subject; a finite English clause needs one"
  - option: "Very important the warning in the log."
    br_pt_form: "Muito importante o aviso no log."
    note: "an adjective-first calque without subject or copula is not an English sentence"
  - option: "We discussed about the warning."
    br_pt_form: "Discutimos sobre o aviso."
    note: "the Portuguese 'sobre' becomes a spurious 'about' after 'discuss'"
```

**Item:**
> Reviewing the direct chunks from the SVO lesson, which line is natural inside a short note?

| Slot | Value |
|------|-------|
| A | "Is necessary to update the ticket." |
| B | "Very important the warning in the log." |
| C | "We discussed about the warning." |
| D | **"We need to update the ticket."** ✓ |

**Key:** D

**Feedback:**
> **`We need to update the ticket.`** converts the Portuguese impersonal into a subject + verb chunk. **A** drops the subject, **B** has no finite verb, and **C** adds *about* after *discuss*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `message_register_repair` | Item 1 or 3 missed | **L2** | Rebuild *Hi ..., I'll ...* and *Thanks,* against formal openers and calqued sign-offs in a chat update. |
| `message_thread_details` | Items 2 and 4 missed | **L2** | Extract who found what, what is blocking, and what action is requested before answering detail questions. |
| `svo_chunks_review` | Item 6 or 7 missed | **L2** | Recycle *We need to...*, explicit subjects and one tense in short notes about tickets and logs. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_writing_svo` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced or adapted.
5. Every `item_id` carries the distinctive `writing_messages` token, and all options are distinct after case normalization.
