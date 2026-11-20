# Practice Pack — `les_a2_modals_can_need`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_modals_can_need_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_modals_can_need.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_modals_can_need_v1
lesson_id: les_a2_modals_can_need
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
item_id: grm_modal_can_request_001
skill: `grammar.modal_can_need`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Can I to get access to the staging logs?"
    br_pt_form: "Posso para ter acesso aos logs de staging?"
    note: "inserts 'to' after the modal; the Portuguese 'para' is transferred before the verb"
  - option: "Can I gets access to the staging logs?"
    br_pt_form: "Posso tem acesso aos logs de staging?"
    note: "adds a third-person ending; the modal already carries agreement and the main verb stays in the base form"
  - option: "Do I can get access to the staging logs?"
    br_pt_form: "Posso ter acesso aos logs de staging?"
    note: "borrows 'do' from present simple questions; a modal question inverts the modal itself"
```

**Item:**
> An engineer asks a tech lead for read access before a regression run. Choose the correct request.

| Slot | Value |
|------|-------|
| A | "Can I to get access to the staging logs?" |
| B | **"Can I get access to the staging logs, please?"** ✓ |
| C | "Can I gets access to the staging logs?" |
| D | "Do I can get access to the staging logs?" |

**Key:** B

**Feedback:**
> A modal request puts **can** before the subject and the bare verb after it: **`Can I get access to the staging logs, please?`** **A** inserts *to* after the modal, **C** adds a third-person ending to the main verb, and **D** uses *do* as an auxiliary where the modal already does that job.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_modal_note_priority_001
skill: `reading.modal_workplace_note`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The staging logs."
    br_pt_form: "Os logs de staging."
    note: "the note says Bruna can read the logs already, so they are not what she still needs"
  - option: "The access review."
    br_pt_form: "A revisão de acesso."
    note: "the review is a meeting whose time is under discussion, not the missing input for the checkout check"
  - option: "The customer data."
    br_pt_form: "Os dados do cliente."
    note: "she explicitly cannot download the customer data, so it is not what she needs"
```

**Stimulus:**
> "Channel note, 09:40 — Bruna can read the staging logs, but she can't download customer data. She needs the error rate from the last deploy, so she can check the checkout flow. Duda can share the dashboard after the access review. Should we move the review to ten?"

**Item:**
> What does Bruna need before she can check the checkout flow?

| Slot | Value |
|------|-------|
| A | "The staging logs." |
| B | "The access review." |
| C | **"The error rate from the last deploy."** ✓ |
| D | "The customer data." |

**Key:** C

**Feedback:**
> The note says **`She needs the error rate from the last deploy`**, so that is the missing input. **A** is already available, **B** is a meeting being rescheduled, and **D** is explicitly forbidden by *can't download*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_modal_need_to_001
skill: `vocab.modal_necessity`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "We can check the deployment before the release."
    br_pt_form: "Podemos verificar o deploy antes da liberação."
    note: "'can' expresses ability or permission, not the necessity the handoff note must convey"
  - option: "We should to check the deployment before the release."
    br_pt_form: "Devemos para verificar o deploy antes da liberação."
    note: "inserts 'to' after a modal; the Portuguese 'para' has no counterpart after 'should'"
  - option: "We needs check the deployment before the release."
    br_pt_form: "Nós precisa verificar o deploy antes da liberação."
    note: "adds -s to 'need' with a plural subject and drops the required 'to' before the verb"
```

**Item:**
> You are writing a handoff note. Which sentence says the deployment check is necessary?

| Slot | Value |
|------|-------|
| A | "We can check the deployment before the release." |
| B | **"We need to check the deployment before the release."** ✓ |
| C | "We should to check the deployment before the release." |
| D | "We needs check the deployment before the release." |

**Key:** B

**Feedback:**
> Necessity with another verb is **`need to` + bare verb**: **`We need to check the deployment before the release.`** **A** weakens necessity to ability, **C** inserts *to* after *should*, and **D** puts *-s* on *need* with a plural subject and omits *to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_modal_advice_context_001
skill: `reading.modal_advice_context`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Download the raw customer file."
    br_pt_form: "Baixar o arquivo bruto do cliente."
    note: "Rafa explicitly says she can't download the raw file, only the chart"
  - option: "Move the access review to ten."
    br_pt_form: "Mover a revisão de acesso para as dez."
    note: "Duda proposes the new time; the thread does not say Ana reschedules it"
  - option: "Share her laptop with Duda."
    br_pt_form: "Compartilhar o notebook dela com a Duda."
    note: "nothing in the thread asks Ana to lend equipment; Duda is the one who shares a link"
```

**Stimulus:**
> "Slack thread — Ana: 'I can't open the dashboard on my laptop.' Rafa: 'You need to ask Duda for the link. She can share it after the access review.' Ana: 'Should I ask her now?' Rafa: 'Yes, and you can't download the raw file, only the chart.'"

**Item:**
> According to the thread, what can Ana do once Duda shares the link?

| Slot | Value |
|------|-------|
| A | "Download the raw customer file." |
| B | **"Open the chart from the shared link."** ✓ |
| C | "Move the access review to ten." |
| D | "Share her laptop with Duda." |

**Key:** B

**Feedback:**
> Rafa limits Ana to the chart: **`you can't download the raw file, only the chart`**. **A** contradicts that limit, **C** assigns Duda's suggestion to Ana, and **D** invents an equipment request the thread never makes.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_modal_cant_coda_001
skill: `pronunciation.modal_can_contraction`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_modal_cant_coda_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *can* /kæn/ closes in /n/; *can't* /kænt/ closes in /nt/, with the final /t/ released without an extra vowel. Brazilian learners often collapse both into *can* or add a vowel after the coda, which erases the permission contrast in a sentence like *you can read them, but you can't download the file*.
**Step 2 — produce (ASR-scored):** read aloud:

> "You can read the logs, but you can't download the raw file."

**Target phonemes:** /k/ and /æ/ in *can, can't* · /n/ coda in *can* · /nt/ coda in *can't* · no epenthetic vowel after the final /t/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_present_simple_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The dashboard share the error rate every hour."
    br_pt_form: "O dashboard compartilha a taxa de erro a cada hora."
    note: "Portuguese never marks third person with -s on the verb, so the learner drops the English ending"
  - option: "The dashboard shared the error rate every hour."
    br_pt_form: "O dashboard compartilhava a taxa de erro a cada hora."
    note: "the Portuguese imperfect describes a routine, but English present simple marks a routine with the base form plus -s"
  - option: "The dashboard is share the error rate every hour."
    br_pt_form: "O dashboard está compartilhando a taxa de erro a cada hora."
    note: "the learner maps the Portuguese progressive onto 'is' plus the bare verb instead of the -ing form"
```

**Item:**
> Before the access review you check the present simple in a handoff note. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The dashboard share the error rate every hour." |
| B | **"The dashboard shares the error rate every hour."** ✓ |
| C | "The dashboard shared the error rate every hour." |
| D | "The dashboard is share the error rate every hour." |

**Key:** B

**Feedback:**
> A routine with a singular subject takes present simple with *-s*: **`The dashboard shares the error rate every hour.`** **A** drops the *-s* that Portuguese never marks, **C** shifts to past tense, and **D** uses *is* with the bare verb instead of the *-ing* form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_have_to_001
skill: `vocab.have_to_necessity`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_have_has`
distractors:
  - option: "We have deliver the report today."
    br_pt_form: "Nós temos que entregar o relatório hoje."
    note: "Portuguese 'temos que' uses 'que', so the learner drops the English 'to' after 'have'"
  - option: "We must to deliver the report today."
    br_pt_form: "Nós devemos entregar o relatório hoje."
    note: "'devemos' maps to 'must', and the learner adds 'to' by analogy with 'have to'"
  - option: "We have to delivering the report today."
    br_pt_form: "Nós temos que estar entregando o relatório hoje."
    note: "the Portuguese progressive 'estar entregando' is carried after 'have to', where the bare verb is required"
```

**Item:**
> Reviewing the *have to* note from the Verb To Have lesson, choose the sentence that matches "Precisamos entregar o relatório hoje".

| Slot | Value |
|------|-------|
| A | "We have deliver the report today." |
| B | **"We have to deliver the report today."** ✓ |
| C | "We must to deliver the report today." |
| D | "We have to delivering the report today." |

**Key:** B

**Feedback:**
> The necessity pattern is **`have to` + bare verb**: **`We have to deliver the report today.`** **A** loses *to* because Portuguese uses *que*, **C** adds *to* after *must*, and **D** replaces the bare verb with a gerund.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `modal_bare_infinitive` | Item 1 missed | **L2** | Rebuild *can / can't / should + base* against *can to*, *cans* and *don't can*. |
| `need_to_necessity` | Items 3 and 7 missed | **L2** | Contrast *need to*, *have to* and *can* in handoff notes; keep the bare verb after modals. |
| `modal_can_cant_production` | Item 5 missed | **L3** | Recast the /kæn/ versus /kænt/ coda in a short permission exchange after the audio render. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a1_have_has` respectively and carry `prereq_lesson` for the interleaving rule.
4. Every distractor carries a filled `br_pt_form` with a specific transfer note; no option or Portuguese form repeats inside an item.
5. Items target authored lesson content; no external source text is reproduced.
