# Practice Pack — `les_a2_corporate_wrapup`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_corporate_wrapup_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_corporate_wrapup.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_corporate_wrapup_v1
lesson_id: les_a2_corporate_wrapup
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
item_id: grm_closing_wrapup_001
skill: `grammar.closing_formulas`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Let's close here and post the notes."
    br_pt_form: "Vamos fechar aqui e postar as notas."
    note: "'close here' is a calque of Portuguese 'fechar aqui'; in a meeting the idiomatic verb is wrap up"
  - option: "Let's wrapping up here and post the notes."
    br_pt_form: "Vamos encerrando aqui e postar as notas."
    note: "after 'let's' the base form is required; the -ing form is transfer from the Portuguese progressive 'vamos encerrando'"
  - option: "Let's wrap here up and post the notes."
    br_pt_form: "Vamos encerrar aqui e postar as notas."
    note: "the particle 'up' must stay next to 'wrap'; Brazilian learners move it after the place adverb as in Portuguese word order"
```

**Item:**
> The deploy checklist is finished and you want to end the call naturally. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "Let's close here and post the notes." |
| B | **"Let's wrap up here and post the notes."** ✓ |
| C | "Let's wrapping up here and post the notes." |
| D | "Let's wrap here up and post the notes." |

**Key:** B

**Feedback:**
> *Let's* takes the base form and the phrasal verb is **`wrap up`**: **`Let's wrap up here and post the notes.`** **A** uses *close*, which fits a file or a shop, not a meeting. **C** puts *-ing* after *let's*, and **D** separates the particle *up* from the verb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_closing_notes_001
skill: `reading.closing_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Post the rollback plan in the channel."
    br_pt_form: "Postar o plano de rollback no canal."
    note: "the rollback plan was already acknowledged; the promised action is posting the deploy notes"
  - option: "Cancel the retro."
    br_pt_form: "Cancelar a retro."
    note: "the retro is the reason for wrapping up, not something being cancelled; Brazilian readers often scan for the last noun and invert the purpose"
  - option: "Call Helen after five."
    br_pt_form: "Ligar para a Helen depois das cinco."
    note: "Helen is offline after five and the speaker promises email, not a call"
```

**Stimulus:**
> "That covers the checklist. Let's wrap up here so the team can start the retro — I'll post the deploy notes in the channel right after this call. I'll get back to you by email if the monitoring shows anything odd."

**Item:**
> What does the speaker promise to do right after the call?

| Slot | Value |
|------|-------|
| A | "Post the rollback plan in the channel." |
| B | **"Post the deploy notes in the channel."** ✓ |
| C | "Cancel the retro." |
| D | "Call Helen after five." |

**Key:** B

**Feedback:**
> The sentence **`I'll post the deploy notes in the channel right after this call`** names both the object and the timing. **A** swaps the notes for the rollback plan, **C** confuses the purpose of wrapping up with a cancellation, and **D** invents a call that the text rules out.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_closing_signoff_001
skill: `vocab.email_vocab_signoff`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Attentiously,"
    br_pt_form: "Atenciosamente,"
    note: "a direct calque of the Portuguese sign-off; this word does not exist as an English closing"
  - option: "Hugs,"
    br_pt_form: "Abraços,"
    note: "faithful to the Portuguese warmth but too informal for an email to a release manager"
  - option: "Sincerely yours,"
    br_pt_form: "Sinceramente seu,"
    note: "a formal letter closing that sounds distant inside an engineering team thread"
```

**Item:**
> You are closing an email to a release manager you work with every day. Which sign-off fits the register?

| Slot | Value |
|------|-------|
| A | "Attentiously," |
| B | "Hugs," |
| C | "Sincerely yours," |
| D | **"Best regards,"** ✓ |

**Key:** D

**Feedback:**
> **`Best regards,`** is neutral and professional without being cold. **A** reproduces *Atenciosamente* as a nonexistent English word, **B** carries the warmth of *Abraços* into a context that does not take it, and **C** belongs to a formal letter, not a team email.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_closing_email_001
skill: `reading.signoff_email`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "She will join the retro."
    br_pt_form: "Ela vai participar da retro."
    note: "Helen only says she is offline after five; joining the retro is not stated"
  - option: "She wants a phone call after five."
    br_pt_form: "Ela quer uma ligação depois das cinco."
    note: "'email is best' explicitly rules out a call after five"
  - option: "She did not receive the rollback plan."
    br_pt_form: "Ela não recebeu o plano de rollback."
    note: "she thanks for the rollback plan, which means she has it; the negative is an inference Brazilian readers add from 'thanks for'"
```

**Stimulus:**
> "Thanks for the quick turnaround on the rollback plan. I'm offline after five, so email is best. Best regards, Helen."

**Item:**
> What does Helen want the sender to do?

| Slot | Value |
|------|-------|
| A | "She will join the retro." |
| B | **"Send the follow-up by email."** ✓ |
| C | "She wants a phone call after five." |
| D | "She did not receive the rollback plan." |

**Key:** B

**Feedback:**
> **`I'm offline after five, so email is best`** is a channel instruction: send the follow-up by email. **A** adds a retro she never mentions, **C** reverses the channel preference, and **D** misreads a thank-you as a complaint.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_closing_th_w_001
skill: `pronunciation.closing_th_w`
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

**Step 1 — hear the contrast:** *thanks* /θæŋks/ begins with the voiceless dental fricative /θ/ — tongue between the teeth — not the /t/ of "tanks" or the /s/ of "sanks". *wrap* /ræp/ begins with /w/, rounded lips with no tooth-to-lip contact, while *very* /veri/ begins with /v/, upper teeth on the lower lip. Brazilian learners tend to swap both pairs.
**Step 2 — produce (ASR-scored):** read aloud:

> "Thanks for the quick turnaround. I'll wrap up and get back to you by email."

**Target phonemes:** /θ/ in *thanks* · /w/ in *wrap* · /r/ in *regards, reach* · final /z/ in *regards* with no added vowel.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_wrapup_post_notes_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "She post the notes after the call."
    br_pt_form: "Ela posta as notas depois da call."
    note: "regular verbs take -s in the third person singular of the present simple; Portuguese 'posta' has no visible ending"
  - option: "She posts the notes after the call yesterday."
    br_pt_form: "Ela postou as notas depois da call ontem."
    note: "a present-tense verb cannot combine with the past time marker 'yesterday'; Portuguese often keeps the same verb shape in both"
  - option: "She is post the notes after the call."
    br_pt_form: "Ela está postar as notas depois da call."
    note: "the progressive requires the -ing form; 'is post' copies the Portuguese 'está postar' pattern"
```

**Item:**
> Reviewing the present simple before you write a recap email, which sentence correctly describes what a teammate normally does after a release call?

| Slot | Value |
|------|-------|
| A | "She post the notes after the call." |
| B | **"She posts the notes after the call."** ✓ |
| C | "She posts the notes after the call yesterday." |
| D | "She is post the notes after the call." |

**Key:** B

**Feedback:**
> With a third-person singular subject, a regular present-simple verb takes **`-s`**: **`She posts the notes after the call.`** **A** drops the *-s*, **C** mixes present tense with *yesterday*, and **D** uses *is* with the base verb instead of the *-ing* form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_email_vocab_register_001
skill: `vocab.email_vocab_register`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_email_basics
distractors:
  - option: "Please answer the email to the whole team."
    br_pt_form: "Por favor, responda o e-mail para todo o time."
    note: "'answer' takes the message as its object; Portuguese 'responder para' pushes learners to add 'to' after the verb"
  - option: "Please forward me the email to the whole team."
    br_pt_form: "Por favor, encaminhe-me o e-mail para todo o time."
    note: "'forward' already names the new recipient; doubling the indirect object and 'to' copies the Portuguese clitic construction"
  - option: "Please return the email to the whole team."
    br_pt_form: "Por favor, devolva o e-mail para todo o time."
    note: "'return' means give back to the owner; Brazilian 'devolver' is often mistaken for 'encaminhar'"
```

**Item:**
> Reviewing the email basics before you close a thread, a colleague wants to send a received message to another team without editing it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"Please forward the email to the whole team."** ✓ |
| B | "Please answer the email to the whole team." |
| C | "Please forward me the email to the whole team." |
| D | "Please return the email to the whole team." |

**Key:** A

**Feedback:**
> Passing a received message on to new readers is **`forward`**: **`Please forward the email to the whole team.`** **B** answers the original sender with an extra *to*, **C** doubles the recipient, and **D** means returning the message, not sharing it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `closing_formulas_wrapup` | Item 1 missed | **L2** | Rebuild *Let's wrap up here* against *Let's close here* and *Let's wrapping up here*. |
| `signoff_register_contrast` | Item 3 missed | **L2** | Contrast *Best regards* / *Thanks* with *Attentiously* and *Hugs* in short work emails. |
| `present_simple_recap_review` | Items 6 and 7 missed | **L2** | Drill *she posts* in recap lines and keep *forward*, *answer*, *return* apart in the same thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. `item_id` values are unbackticked per the Lote 6 convention; `skill` and `type` keep their backticks as required by the pack contract (`assessment-item-spec.md` §1.2, prefix ↔ namespace).
5. Items target authored lesson content; no external source text is reproduced or adapted.
