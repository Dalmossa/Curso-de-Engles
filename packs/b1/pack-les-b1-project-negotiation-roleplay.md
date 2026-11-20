# Practice Pack — `les_b1_project_negotiation_roleplay`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_project_negotiation_roleplay_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_project_negotiation_roleplay.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_negotiation_roleplay_v1
lesson_id: les_b1_project_negotiation_roleplay
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
item_id: grm_project_negotiation_roleplay_suggestion_001
skill: `grammar.negotiation_suggestions`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "I suggest we keeps the QA window and drops the export."
    br_pt_form: "Eu sugiro que nós mantemos a janela de QA e cortamos a exportação."
    note: "'keeps' and 'drops' carry third-person endings; a suggestion takes the base form"
  - option: "I suggest to keep the QA window and drop the export."
    br_pt_form: "Eu sugiro manter a janela de QA e cortar a exportação."
    note: "'suggest' does not take a to-infinitive in this construction"
  - option: "I suggest keeping we the QA window and drop the export."
    br_pt_form: "Eu sugiro mantermos nós a janela de QA e cortarmos a exportação."
    note: "a gerund cannot take the subject 'we' before its object"
```

**Item:**
> Ethan wants to make a firm but cooperative proposal. Which line is correct?

| Slot | Value |
|------|-------|
| A | "I suggest we keeps the QA window and drops the export." |
| B | **"I suggest we keep the QA window and drop the export."** ✓ |
| C | "I suggest to keep the QA window and drop the export." |
| D | "I suggest keeping we the QA window and drop the export." |

**Key:** B

**Feedback:**
> After *suggest*, the preferred form here is the base verb: **`I suggest we keep the QA window and drop the export.`** **A** uses third-person endings after *we*, **C** inserts *to* after *suggest*, and **D** puts the subject after a gerund.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_project_negotiation_roleplay_termsheet_001
skill: `reading.roleplay_termsheet`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Moving the deadline to the twenty-second."
    br_pt_form: "Mover o prazo para o dia vinte e dois."
    note: "that is Marina's counteroffer, not Ethan's side of the trade-off"
  - option: "Canceling the QA window completely."
    br_pt_form: "Cancelar a janela de QA completamente."
    note: "nobody proposes removing QA; Marina explicitly wants to keep it"
  - option: "Walking away from the API integration."
    br_pt_form: "Sair sem acordo da integração com a API."
    note: "walk away is a glossary term here, not an action anyone takes in this dialogue"
```

**Stimulus:**
> "Marina: Could we keep the export in scope if we move the deadline to the twenty-second? Ethan: That's a counteroffer I can consider. My concern is the QA window — if we slip, the release moves with it. Marina: I see your point. What if we keep one week of QA and ship the export in phase two? That's the trade-off on our side. Ethan: That works for me. It's essential that we put the phase-two date in writing."

**Item:**
> What does Marina offer as her side of the trade-off?

| Slot | Value |
|------|-------|
| A | Moving the deadline to the twenty-second. |
| B | **One week of QA in phase one and the export in phase two.** ✓ |
| C | Canceling the QA window completely. |
| D | Walking away from the API integration. |

**Key:** B

**Feedback:**
> The turn says **`What if we keep one week of QA and ship the export in phase two? That's the trade-off on our side.`** **A** belongs to Marina's earlier counteroffer, **C** invents a cancellation, and **D** confuses a vocabulary item with an actual decision.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_project_negotiation_roleplay_hedging_001
skill: `vocab.roleplay_hedging`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "We will move the date to the twenty-second."
    br_pt_form: "Nós vamos mover a data para o dia vinte e dois."
    note: "a flat commitment; it imposes the date instead of opening it for discussion"
  - option: "Move the date to the twenty-second."
    br_pt_form: "Mova a data para o dia vinte e dois."
    note: "an imperative is the strongest form, not a hedge"
  - option: "We have to move the date to the twenty-second."
    br_pt_form: "Temos que mover a data para o dia vinte e dois."
    note: "'have to' signals obligation, the opposite of hedging"
```

**Item:**
> Which line softens the position instead of imposing it?

| Slot | Value |
|------|-------|
| A | We will move the date to the twenty-second. |
| B | Move the date to the twenty-second. |
| C | **We could consider a later date.** ✓ |
| D | We have to move the date to the twenty-second. |

**Key:** C

**Feedback:**
> **`We could consider a later date.`** uses *could* plus *consider* to leave room for the other side. **A** commits flatly, **B** is an imperative, and **D** expresses obligation — none of them is hedging.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_project_negotiation_roleplay_concession_001
skill: `reading.roleplay_concession`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Could we keep the export in scope if we move the deadline?"
    br_pt_form: "Poderíamos manter a exportação no escopo se movermos o prazo?"
    note: "that is Marina's question, not a concession from Ethan"
  - option: "If we add CSV export, we'd need another week."
    br_pt_form: "Se adicionarmos exportação em CSV, precisaríamos de mais uma semana."
    note: "this is Ethan's opening condition, before any give-and-take"
  - option: "My concern is the QA window — if we slip, the release moves with it."
    br_pt_form: "Minha preocupação é a janela de QA — se atrasarmos, o release vai junto."
    note: "a stated concern is a reservation, not something conceded"
```

**Stimulus:**
> "Ethan: We can migrate the dashboard and the API integration by the fifteenth. If we add CSV export, we'd need another week. Marina: Could we keep the export in scope if we move the deadline to the twenty-second? Ethan: That's a counteroffer I can consider. My concern is the QA window — if we slip, the release moves with it. I suggest we keep the fifteenth and drop the export."

**Item:**
> Which line is Ethan's concession?

| Slot | Value |
|------|-------|
| A | Could we keep the export in scope if we move the deadline? |
| B | If we add CSV export, we'd need another week. |
| C | My concern is the QA window — if we slip, the release moves with it. |
| D | **I suggest we keep the fifteenth and drop the export.** ✓ |

**Key:** D

**Feedback:**
> Ethan gives up the export in phase one to protect the date: **`I suggest we keep the fifteenth and drop the export.`** **A** is Marina's counteroffer, **B** is his starting condition, and **C** is a reservation he raises before conceding.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_project_negotiation_roleplay_dentals_001
skill: `pronunciation.roleplay_dentals_diphthongs`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_project_negotiation_roleplay_dentals_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *fifteenth* starts with /fɪf/ and ends in the unvoiced dental /θ/ — tongue tip between the teeth, no voice; *the* and *that* use the voiced /ð/ in the same place. In *date* and *phase*, hold the /eɪ/ glide; in *keep*, the /iː/ is long and the final /k/ has no extra vowel. Brazilian learners often say "fiftint" for *fifteenth* and "keep-e" for *keep*.

**Step 2 — produce (ASR-scored):** read aloud:

> "I suggest we keep the fifteenth and put the phase-two date in writing."

**Target phonemes:** /θ/ final in *fifteenth* · /ð/ in *the* · /eɪ/ in *phase* and *date* · /iː/ in *keep* · /k/ final in *keep*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_project_negotiation_roleplay_conditionals_001
skill: `grammar.negotiation_conditionals`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_negotiation`
distractors:
  - option: "If we will move the deadline, we'll need another QA week."
    br_pt_form: "Se nós mudarmos o prazo, precisaremos de mais uma semana de QA."
    note: "a future auxiliary inside the if-clause breaks the first-conditional pattern"
  - option: "If we moved the deadline, we will need another QA week."
    br_pt_form: "Se nós mudássemos o prazo, precisaremos de mais uma semana de QA."
    note: "a remote if-clause requires 'would' in the result, not 'will'"
  - option: "If we move the deadline, we needed another QA week."
    br_pt_form: "Se nós mudarmos o prazo, precisávamos de mais uma semana de QA."
    note: "the result of an open condition cannot be reported in the past"
```

**Item:**
> Reviewing negotiation conditionals: which line is correct?

| Slot | Value |
|------|-------|
| A | "If we will move the deadline, we'll need another QA week." |
| B | **"If we move the deadline, we'll need another QA week."** ✓ |
| C | "If we moved the deadline, we will need another QA week." |
| D | "If we move the deadline, we needed another QA week." |

**Key:** B

**Feedback:**
> The open condition takes the present after *if* and *will* in the result: **`If we move the deadline, we'll need another QA week.`** **A** puts *will* in the condition, **C** mixes a hypothetical with a future result, and **D** puts the result in the past.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_project_negotiation_roleplay_meeting_open_001
skill: `vocab.meeting_open`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "Please find attached the revised scope and the QA plan."
    br_pt_form: "Segue em anexo o escopo revisado e o plano de QA."
    note: "that belongs to a follow-up email, not to the opening of a call"
  - option: "Sorry, you're breaking up — can you repeat the date?"
    br_pt_form: "Desculpe, sua voz está cortando — pode repetir a data?"
    note: "this repairs a connection problem; it does not open the meeting"
  - option: "Let's close the deal by Friday without a QA window."
    br_pt_form: "Vamos fechar o negócio na sexta sem janela de QA."
    note: "this jumps to the closing and contradicts the dialogue's QA concern"
```

**Item:**
> Reviewing meeting openings: which line opens the negotiation and states the objective?

| Slot | Value |
|------|-------|
| A | Please find attached the revised scope and the QA plan. |
| B | Sorry, you're breaking up — can you repeat the date? |
| C | Let's close the deal by Friday without a QA window. |
| D | **Thanks for joining. I'd like to agree on scope and a realistic deadline today.** ✓ |

**Key:** D

**Feedback:**
> A good opening thanks the participants and names the objective: **`Thanks for joining. I'd like to agree on scope and a realistic deadline today.`** **A** is an email line, **B** handles a bad connection, and **C** skips the objective and contradicts the QA concern.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `suggestion_base_form` | Item 1 missed | **L2** | Contrast *we keeps / to keep / keeping we / we keep* in short, cooperative proposals; keep the subjunctive-style base form after *suggest* and *it's essential that*. |
| `roleplay_detail_termsheet` | Items 2 and 4 missed | **L2** | Re-read a six-line scope dialogue and label each turn as *counteroffer*, *trade-off*, *concession* or *reservation* before answering detail questions. |
| `roleplay_register_review` | Items 3, 6 and 7 missed | **L2** | Recycle *could / we could consider / maybe*, the first conditional and the opening move in one follow-up negotiation thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_negotiation` (`grammar.negotiation_conditionals`) and `les_a2_meeting_open` (`vocab.meeting_open`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Grammar-rag was queried with `negotiation roleplay hedging counteroffer concession agreement` (top-2). Similarity was low (~21.6); only the mandative pattern *I suggest we keep... / It's essential that we put...* was reused as a grammatical structure, with fully original wording. The *at the end / in the end* result was discarded as irrelevant to this scenario.
6. The lesson's `prereq_lessons` has five distinct, real §4.3 ids and excludes the lesson itself; the duplicated `meeting_vocab` prerequisite entry was deduplicated.
7. Every option, gloss and note is authored in a clean room; no restricted source text or legacy negotiation book is reproduced or adapted.
