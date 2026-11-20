# Practice Pack — `les_a2_email_basics`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_a2_email_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_email_basics.md`
**Provenance:** items `authored`. All items are 100% original, authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_email_basics_v1
lesson_id: les_a2_email_basics
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
| Grammar | 3 | 2–3 | ✅ at ceiling |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ absorbs the deferred slot |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Coherence, current lesson ⭐ central construct

> Occupies the **Grammar** slot in the §2.2 budget. Its *skill* is pair-level (`coherence.*`) and it
> declares `domain: grammar` for weighting — the error is in the pairing, not in either end.

```yaml
item_id: coh_email_basics_register_pair_001
skill: `coherence.email_basics_register_pair`
type: `contextual_selection`
difficulty_b: 0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Dear Priya, ... Atenciosamente,"
    br_pt_form: "Prezada Priya, ... Atenciosamente,"
    note: "the Portuguese bureaucratic close is kept in the English template; the leaked token is the PT source form"
  - option: "Dear Priya, ... Thanks,"
    br_pt_form: "Prezada Priya, ... Valeu,"
    note: "a half-corrected template: the greeting sets distance and the closing denies it, so the pair reads cold"
  - option: "Hi Priya, ... Best regards,"
    br_pt_form: "Oi Priya, ... Atenciosamente,"
    note: "a first-name greeting with a formal close imports the Portuguese single formality field into English"
```

**Item:**
> You have worked with Priya for four months. Which opening and closing pair fits the relationship?

| Slot | Value |
|------|-------|
| A | "Dear Priya, ... Atenciosamente," |
| B | "Dear Priya, ... Thanks," |
| C | **"Hi Priya, ... Thanks,"** ✓ |
| D | "Hi Priya, ... Best regards," |

**Key:** C

**Feedback:**
> This is a pair-level construct. Each line is well formed on its own, so the learner cannot solve it by checking words in isolation.
> **A** keeps a Portuguese close inside an English email. **D** pairs a first-name greeting with a formal English close, which reads as a template that was only half-adjusted. **B** is the costly one: both halves are valid English, but *Dear* announces distance that *Thanks* immediately withdraws.
> The rule is to choose the register from the relationship and apply it to both ends. Portuguese has one closed formality field; English has a scale.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: voc_email_basics_attachment_line_001
skill: `vocab.email_basics_attachment_line`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Please find attached the staging log."
    br_pt_form: "Segue em anexo o log de staging."
    note: "a word-for-word calque of the Portuguese formula; understood by Americans but not the form they produce"
  - option: "Here attached the staging log."
    br_pt_form: "Aqui está em anexo o log de staging."
    note: "the copula is dropped after the locative, a transfer from Portuguese está"
  - option: "I attach to you the staging log."
    br_pt_form: "Anexo para você o log de staging."
    note: "Portuguese marks the recipient with para você; English has no dative slot in this pattern"
```

**Item:**
> Which line introduces an attached file the way an American engineer normally would?

| Slot | Value |
|------|-------|
| A | "Please find attached the staging log." |
| B | **"I'm attaching the staging log."** ✓ |
| C | "Here attached the staging log." |
| D | "I attach to you the staging log." |

**Key:** B

**Feedback:**
> **A** is the most common Brazilian professional-English tic: it is intelligible, but it reads as a stiff template artifact. **C** drops the verb after the locative. **D** invents a recipient slot that English does not have here.
> The target form is **I'm attaching the staging log** — verb, named file. The line that follows should say what the reader is supposed to do with it, otherwise the email comes back.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson (absorbs the deferred Listening slot)

```yaml
item_id: rdg_email_basics_status_detail_001
skill: `reading.email_basics_status_detail`
type: `detail_identification`
difficulty_b: 0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The staging check."
    br_pt_form: "A checagem de staging."
    note: "the email says the staging check passed at 14:00, so it is done"
  - option: "The login retry fix."
    br_pt_form: "A correção do login retry."
    note: "the fix is merged; it is not the pending item"
  - option: "The staging log."
    br_pt_form: "O log de staging."
    note: "the log is already attached to the email"
```

**Stimulus:**
> Subject: Status: login retry shipped; rollout tomorrow
>
> Hi Priya,
>
> The login retry fix is merged and the staging check passed at 14:00. I am still waiting on the flag configuration before the rollout.
>
> Could you check the flag name when you get a chance? I need a decision by 16:00 today.
>
> I'm attaching the staging log.
>
> Thanks,
> Rafael

**Item:**
> What is still missing before the rollout?

| Slot | Value |
|------|-------|
| A | "The staging check." |
| B | "The login retry fix." |
| C | **"The flag configuration."** ✓ |
| D | "The staging log." |

**Key:** C

**Feedback:**
> The writer says **I am still waiting on the flag configuration before the rollout**, so that is the one pending item.
> **A** passed at 14:00, **B** is merged and **D** is attached. The question trains the exact skill needed to answer a status email: separate what is done from what is blocked, then find the deadline attached to the blocked item.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, current lesson

```yaml
item_id: grm_email_basics_subject_action_001
skill: `grammar.email_basics_subject_action`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Good morning!"
    br_pt_form: "Bom dia!"
    note: "a greeting belongs in the body; the subject line is not a salutation"
  - option: "Meeting"
    br_pt_form: "Reunião"
    note: "names the topic but says nothing about the action the reader must take"
  - option: "Hello from Rafael"
    br_pt_form: "Olá do Rafael"
    note: "identifies the sender, not the request; the reader still has to open the email to find the task"
```

**Item:**
> A fix is merged and you need a decision by 16:00. Which subject line carries both the action and the deadline?

| Slot | Value |
|------|-------|
| A | "Good morning!" |
| B | **"Status: login retry shipped; decision needed by 16:00"** ✓ |
| C | "Meeting" |
| D | "Hello from Rafael" |

**Key:** B

**Feedback:**
> **A** and **D** are greetings in disguise. **C** gives the topic only. **B** states the current status and the time limit, which is what a reader needs in the inbox preview.
> The structural point: a subject line is a compressed clause about an action, not a label for a conversation. In Portuguese, "Reunião" often passes as a subject; in English business email it forces the reader to open the message.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: grm_email_basics_could_request_001
skill: `grammar.email_basics_could_request`
type: `gap_fill`
difficulty_b: -0.5
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_meeting_participate`
distractors:
  - option: "Should"
    br_pt_form: "Você deveria conferir…"
    note: "Portuguese deveria sounds like advice or obligation; English should does not perform a request"
  - option: "Would to"
    br_pt_form: "sem equivalente em pt-BR"
    note: "not an L1 transfer: the stray infinitive marker is an interlanguage error with no Portuguese source"
  - option: "Must"
    br_pt_form: "Você deve conferir…"
    note: "Portuguese deve covers both a soft requirement and a strong obligation; English must only means obligation"
```

**Item:**
> "___ you check the flag name when you get a chance?"

| Slot | Value |
|------|-------|
| A | Should |
| B | **Could** ✓ |
| C | Would to |
| D | Must |

**Key:** B

**Feedback:**
> **Could you…?** is the default polite request in workplace email. **A** gives advice, **D** imposes an obligation and **C** is not a valid modal pattern.
> The *when*-clause is worth keeping: it moves the politeness into the subordinate clause and leaves the deadline in the main clause. One hedge, placed deliberately, beats a stack of hedges that buries the ask.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: voc_email_basics_when_softener_001
skill: `vocab.email_basics_when_softener`
type: `contextual_selection`
difficulty_b: -0.8
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_meeting_participate`
distractors:
  - option: "It moves the deadline into the subordinate clause."
    br_pt_form: "Ele move o prazo para a oração subordinada."
    note: "inverts the construction: the deadline stays in the main clause, I need a decision by 16:00"
  - option: "It adds a second polite request."
    br_pt_form: "Ele acrescenta um segundo pedido educado."
    note: "the when-clause has no request of its own; it only softens the first one"
  - option: "It changes the main verb to the past tense."
    br_pt_form: "Ele muda o verbo principal para o passado."
    note: "no tense changes; could is a modal, and the main verb stays in the base form"
```

**Item:**
> In "Could you check the flag name when you get a chance?", what does the *when*-clause do?

| Slot | Value |
|------|-------|
| A | "It moves the deadline into the subordinate clause." |
| B | "It adds a second polite request." |
| C | **"It keeps the deadline in the main clause and softens the request."** ✓ |
| D | "It changes the main verb to the past tense." |

**Key:** C

**Feedback:**
> **A** reverses the roles: *I need a decision by 16:00* is a separate main clause, and the *when*-clause does not carry it. **B** invents a second request. **D** mistakes the modal for a past tense.
> The softener works because English can put courtesy in a subordinate clause while the main clause keeps the pressure. Portuguese learners often stack courtesy instead, and the deadline disappears.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: prn_email_basics_subject_stress_001
skill: `pronunciation.email_basics_word_stress`
type: `minimal_pair_production`
difficulty_b: -0.6
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_email_basics_subject_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** `STATUS` [ˈsteɪtəs] carries the stress on the first syllable; a Brazilian reader tends to lengthen the final vowel instead. `CONfirm` [kənˈfɜːrm] has secondary reduction at the start; `ROLLout` [ˈroʊlaʊt] keeps the stress on *roll*.
**Step 2 — identify:** in each word, mark the stressed syllable before reading the whole subject line.
**Step 3 — produce (ASR-scored):** read the subject line aloud:

> "Status: login retry shipped; decision needed by 16:00."

**Target phonemes:** [ˈsteɪtəs] in *Status* · [ɹ] initial in *retry* · [ˈroʊlaʊt] in *rollout* · no extra vowel after final *-s*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `coherence.email_basics_register_pair` | Item 1 missed | **L2, day granularity** | Show a new pair and grade the pair, not either end. |
| `vocab.email_basics_attachment_line` | Item 2 missed | **L2** | Rebuild *I'm attaching* against the Portuguese calque with a new named file. |
| `grammar.email_basics_could_request` | Item 5 missed | **L2** | Contrast *Could you…?* with *Should you…?* and *Must you…?* in a fresh request. |
| `vocab.email_basics_when_softener` | Item 6 missed | **L3** | High-cost register error: one hedge in the subordinate clause keeps the deadline visible. |

---

## 4. VALIDATION NOTES

1. `coherence.email_basics_register_pair` is a first-class pair-level skill: two independent features would both report mastery while the learner keeps producing mismatched pairs. It is weighted as `domain: grammar` here because `coherence` is a skill namespace, not a sixth tracked domain.
2. Item 3 is a dense observation: one response signals whether the learner can separate a done item from a blocked one and locate its deadline. Its score must not be decomposed into several sub-skills.
3. Item 7 is ASR-scored production and does not substitute for a listening-pool calibration. It stays blocked until TTS render and ear-check.
4. All `b` values are priors, per `assessment-item-spec.md` §8.2.
