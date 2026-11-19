# Practice Pack — `les_b2_register_nuance`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_register_nuance_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_register_nuance.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_register_nuance_v1
lesson_id: les_b2_register_nuance
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
item_id: grm_register_nuance_hedged_request_001
skill: `grammar.email_register_hedging`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "You must review the query plan today."
    br_pt_form: "Você deve revisar o plano de consulta hoje."
    note: "a direct obligation sounds like an instruction to a client, not a request"
  - option: "Review the query plan and send me the ETA."
    br_pt_form: "Revise o plano de consulta e me envie o prazo."
    note: "the imperative is fine for teammates but too blunt for an external client"
  - option: "Maybe review the query plan sometime?"
    br_pt_form: "Talvez revise o plano de consulta qualquer hora?"
    note: "excessive hedging removes the deadline and makes the request vague"
```

**Item:**
> You are writing to an external client. Which line keeps the request polite and appropriately hedged?

| Slot | Value |
|------|-------|
| A | "You must review the query plan today." |
| B | "Review the query plan and send me the ETA." |
| C | **"We would appreciate it if you could review the query plan at your earliest convenience."** ✓ |
| D | "Maybe review the query plan sometime?" |

**Key:** C

**Feedback:**
> **C** uses a conditional frame (*would appreciate*) plus *could* and *at your earliest convenience*: the request is clear without sounding like an order. **A** imposes an obligation, **B** is a peer-level imperative, and **D** hedges so much that the action disappears.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_register_nuance_client_email_001
skill: `reading.register_analysis`
type: `register_identification`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "An informal Slack update to a teammate."
    br_pt_form: "Uma atualização informal no Slack para um colega."
    note: "'Dear Ms. Clarke' and 'Best regards' rule out chat register"
  - option: "A neutral team e-mail with an imperative and a hard deadline."
    br_pt_form: "Um e-mail neutro ao time, com imperativo e prazo fixo."
    note: "the writer uses a conditional request, not an imperative, and gives no exact hour"
  - option: "A bug report with an apology and no action for the reader."
    br_pt_form: "Um relatório de bug com pedido de desculpas e nenhuma ação para o leitor."
    note: "the reader is asked to review the plan and share an ETA"
```

**Stimulus:**
> "Dear Ms. Clarke, I'm afraid the payments release has moved to Thursday. We would appreciate it if you could review the attached query plan at your earliest convenience and share an updated ETA. Please let us know if anything is unclear. Best regards, Rafa."

**Item:**
> Which description best matches this message?

| Slot | Value |
|------|-------|
| A | An informal Slack update to a teammate. |
| B | **A formal e-mail to an external client, with hedging and a softened request.** ✓ |
| C | A neutral team e-mail with an imperative and a hard deadline. |
| D | A bug report with an apology and no action for the reader. |

**Key:** B

**Feedback:**
> **B** is right: the greeting, *I'm afraid*, *would appreciate* and *Best regards* mark formal client register. **A** ignores the salutation, **C** mistakes a conditional request for an imperative with a fixed hour, and **D** overlooks the action asked of the reader.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_register_nuance_softener_001
skill: `vocab.register.hedging`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "Send the updated ETA now."
    br_pt_form: "Envie o novo prazo agora."
    note: "an imperative with 'now' increases directness rather than softening it"
  - option: "It is absolutely urgent."
    br_pt_form: "É absolutamente urgente."
    note: "an intensifier raises force, the opposite of a softener"
  - option: "You failed to send the ETA."
    br_pt_form: "Você falhou em enviar o prazo."
    note: "this is a criticism, not a politeness strategy"
```

**Item:**
> Which phrase is a softener — it reduces the force of a request without hiding it?

| Slot | Value |
|------|-------|
| A | **"Would you mind sending the updated ETA?"** ✓ |
| B | "Send the updated ETA now." |
| C | "It is absolutely urgent." |
| D | "You failed to send the ETA." |

**Key:** A

**Feedback:**
> **A** softens the request with a modal question frame while still asking for the ETA. **B** is a direct command, **C** is an intensifier that raises pressure, and **D** criticises the reader instead of requesting anything.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_register_nuance_politeness_001
skill: `reading.politeness_strategy`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The reader must reply by 15:00."
    br_pt_form: "O leitor deve responder até 15:00."
    note: "no clock time is given; the phrase deliberately avoids a hard deadline"
  - option: "The writer has already chosen another time."
    br_pt_form: "O remetente já escolheu outro horário."
    note: "another time is only offered as a possibility if today is difficult"
  - option: "The request is optional and can be ignored."
    br_pt_form: "O pedido é opcional e pode ser ignorado."
    note: "the writer still asks for a review; politeness is not the same as no request"
```

**Stimulus:**
> "We would appreciate it if you could review the plan at your earliest convenience. If that is difficult today, please let us know and we will suggest another time."

**Item:**
> What does "at your earliest convenience" signal here?

| Slot | Value |
|------|-------|
| A | The reader must reply by 15:00. |
| B | The writer has already chosen another time. |
| C | The request is optional and can be ignored. |
| D | **A polite, flexible time expectation instead of a fixed deadline.** ✓ |

**Key:** D

**Feedback:**
> **D** captures the strategy: the writer keeps a time expectation but leaves the exact moment to the reader. **A** invents a clock time, **B** turns a conditional offer into a decided alternative, and **C** confuses politeness with dropping the request.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_register_nuance_hedge_reduction_001
skill: `pronunciation.hedging_reduction`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *would* /wʊd/ begins with /w/, rounded lips, never the /v/ of *very*; *Thursday* /ˈθɜːrzdeɪ/ starts with voiceless /θ/, tongue tip between the teeth; *appreciate* /əˈpriːʃieɪt/ ends in the glide /eɪ/, not the pure /e/ of pt-BR.

**Step 2 — produce (ASR-scored):** read aloud:

> "Would you mind reviewing the plan on Thursday? We would appreciate an updated ETA."

**Target phonemes:** /w/ in *would* · /ð/ in *the* · /θ/ in *Thursday* · /eɪ/ in *appreciate* · /iː/ in *we* · /d/ final in *mind*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_register_nuance_modals_001
skill: `grammar.hedging_modals`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b1_modals
distractors:
  - option: "This will definitely fail."
    br_pt_form: "Isso vai falhar definitivamente."
    note: "no hedge at all; 'definitely' makes the claim absolute"
  - option: "This might to need more time than we planned."
    br_pt_form: "Isso pode para precisar de mais tempo do que planejamos."
    note: "a modal takes the bare verb, not 'to'; L1 transfer"
  - option: "This is might need more time than we planned."
    br_pt_form: "Isso é pode precisar de mais tempo do que planejamos."
    note: "a modal cannot follow 'be' in this construction"
```

**Item:**
> Reviewing modal hedging: which line correctly softens the claim?

| Slot | Value |
|------|-------|
| A | "This will definitely fail." |
| B | **"This might need more time than we planned."** ✓ |
| C | "This might to need more time than we planned." |
| D | "This is might need more time than we planned." |

**Key:** B

**Feedback:**
> **B** uses *might* + bare verb to reduce certainty without losing the message. **A** is absolute, **C** inserts *to* after a modal, and **D** stacks *be* before the modal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_register_nuance_email_request_001
skill: `vocab.email_register`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_email_technical
distractors:
  - option: "You can confirm the ETA by 15:00?"
    br_pt_form: "Você pode confirmar o prazo até 15:00?"
    note: "statement order with rising intonation is not the standard written request"
  - option: "Confirm the ETA by 15:00, please?"
    br_pt_form: "Confirme o prazo até 15:00, por favor?"
    note: "the imperative with a question mark mixes registers"
  - option: "I want that you confirm the ETA by 15:00."
    br_pt_form: "Eu quero que você confirme o prazo até 15:00."
    note: "L1 transfer; natural English uses 'would like you to' or a modal request"
```

**Item:**
> Reviewing technical email register: which line is a polite, neutral request for the ETA?

| Slot | Value |
|------|-------|
| A | "You can confirm the ETA by 15:00?" |
| B | "Confirm the ETA by 15:00, please?" |
| C | **"Could you confirm the ETA by 15:00, please?"** ✓ |
| D | "I want that you confirm the ETA by 15:00." |

**Key:** C

**Feedback:**
> **C** keeps interrogative order and the bare verb after *could*: the neutral written request. **A** relies on intonation alone, **B** mixes imperative with a question mark, and **D** translates the pt-BR *quero que* word for word.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `hedged_request_register` | Item 1 missed | **L2** | Contrast *must* / imperative / *would appreciate* / over-hedging in client and team messages. |
| `register_identification` | Items 2 and 4 missed | **L2** | Label Slack, neutral team e-mail and client e-mail; match each to its politeness strategy. |
| `softener_vs_intensifier` | Items 3, 6 and 7 missed | **L2** | Recycle *would you mind*, *could*, *might* and *could you confirm* with the bare verb. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Item 6 reviews `les_b1_modals` (`hedging`) and item 7 reviews `les_a2_it_email_technical` (`email_register`); both carry `prereq_lesson` for the interleaving rule, matching the §4.3 prerequisite skills of this lesson.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The grammar-rag query on register/hedging returned only low-similarity passages about *-ing* clauses in written English, used solely to motivate the written-versus-spoken contrast in the lesson.
6. Item ids use the distinctive `register_nuance` token and were checked for collisions against the canonical `pack-les-*.md` packs; the legacy `pack_les_*_v1.md` file is removed by path, not read.
