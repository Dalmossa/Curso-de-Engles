# Practice Pack — `les_b2_professional_email_advanced`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b2_professional_email_advanced_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_professional_email_advanced.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_professional_email_advanced_v1
lesson_id: les_b2_professional_email_advanced
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
item_id: grm_professional_email_advanced_register_001
skill: `grammar.formal_email_register`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "Hi Ana, sorry for the mess — we will fix it maybe next week."
    br_pt_form: "Oi Ana, desculpe pela bagunça — a gente conserta talvez na semana que vem."
    note: "contractions and a vague time frame drop the register below a client-facing reply"
  - option: "Dear Ms. Costa, we are very sorry for the inconvenience, okay?"
    br_pt_form: "Prezada Sra. Costa, estamos muito tristes pelo transtorno, tudo bem?"
    note: "a generic apology plus a chat tag is not a formal business register"
  - option: "Hello Ana, the invoice was wrong — sorry about that. Check attached."
    br_pt_form: "Olá Ana, a fatura estava errada — desculpe por isso. Confira o anexo."
    note: "a first name, an informal apology and a bare imperative weaken the client relationship"
```

**Item:**
> You are answering a client who received a duplicate charge. Which opening keeps a formal register, names the error and gives a time-bound commitment?

| Slot | Value |
|------|-------|
| A | "Hi Ana, sorry for the mess — we will fix it maybe next week." |
| B | **"Dear Ms. Costa, thank you for flagging this. I apologize for the duplicate charge. I will send the corrected invoice by 15:00."** ✓ |
| C | "Dear Ms. Costa, we are very sorry for the inconvenience, okay?" |
| D | "Hello Ana, the invoice was wrong — sorry about that. Check attached." |

**Key:** B

**Feedback:**
> The formal pattern combines an acknowledgment, a precise apology and a commitment with an owner and a time: **`Dear Ms. Costa, thank you for flagging this... by 15:00.`** **A** uses chat contractions and *maybe*, **C** adds a generic apology with a chat tag, and **D** drops the formal salutation and replaces the commitment with a bare imperative.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_professional_email_advanced_complaint_001
skill: `reading.client_complaint_email`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "A full refund of the May subscription."
    br_pt_form: "Um reembolso integral da assinatura de maio."
    note: "the client asks for a correction of the invoice, not a refund"
  - option: "A call with the account director before Thursday."
    br_pt_form: "Uma ligação com o diretor de contas antes de quinta."
    note: "the account director is an internal escalation path, not a client request"
  - option: "A new contract for the next billing cycle."
    br_pt_form: "Um novo contrato para o próximo ciclo de cobrança."
    note: "nothing in the message asks to renegotiate the contract"
```

**Stimulus:**
> "Subject: Duplicate charge on May invoice. Dear Billing Team, our finance team found the same charge twice on the May invoice, and we cannot close the month. Please send a corrected invoice and confirm the final amount by Friday. I have copied our finance lead so we all see the same numbers. Regards, Helena Costa."

**Item:**
> What does the client explicitly ask for in the message?

| Slot | Value |
|------|-------|
| A | A full refund of the May subscription. |
| B | **A corrected invoice and confirmation of the amount by Friday.** ✓ |
| C | A call with the account director before Thursday. |
| D | A new contract for the next billing cycle. |

**Key:** B

**Feedback:**
> The request is explicit: **`Please send a corrected invoice and confirm the final amount by Friday.`** **A** invents a refund, **C** turns an internal escalation into a client demand, and **D** mistakes a billing correction for contract renegotiation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_professional_email_advanced_acknowledgment_001
skill: `vocab.email_acknowledgment`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "Please find attached the corrected invoice."
    br_pt_form: "Segue em anexo a fatura corrigida."
    note: "this introduces an attachment; it does not acknowledge the client's message"
  - option: "I will escalate this to our account director."
    br_pt_form: "Vou escalar isso ao nosso diretor de contas."
    note: "this announces escalation, not acknowledgment of the impact"
  - option: "Kind regards,"
    br_pt_form: "Atenciosamente,"
    note: "this is a closing, not an opening acknowledgment"
```

**Item:**
> Which phrase acknowledges the client's message before the explanation begins?

| Slot | Value |
|------|-------|
| A | Please find attached the corrected invoice. |
| B | I will escalate this to our account director. |
| C | **Thank you for flagging this — I understand the impact on your month-end close.** ✓ |
| D | Kind regards, |

**Key:** C

**Feedback:**
> An acknowledgment shows that the impact was understood first: **`Thank you for flagging this — I understand the impact on your month-end close.`** **A** presents the attachment, **B** announces escalation, and **D** is the sign-off that comes at the end.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_professional_email_advanced_escalation_001
skill: `reading.email_escalation_policy`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Because the finance lead asked to receive a separate copy later."
    br_pt_form: "Porque o líder financeiro pediu uma cópia separada depois."
    note: "the note says the finance lead is copied now, not later"
  - option: "Because BCC keeps the client from seeing internal names."
    br_pt_form: "Porque o BCC impede que o cliente veja nomes internos."
    note: "the team explicitly avoids BCC in a client reply"
  - option: "Because the account director must approve every sentence."
    br_pt_form: "Porque o diretor de contas precisa aprovar cada frase."
    note: "escalation is conditional on the deadline, not on line-by-line approval"
```

**Stimulus:**
> "Internal note: keep Helena's finance lead in CC on the client reply — they own the reconciliation and need to see the same thread. Do not use BCC here; the client should know who is copied. If the corrected amount is not confirmed by Friday, escalate to the account director and send a follow-up on Monday."

**Item:**
> Why is the finance lead kept in CC rather than BCC?

| Slot | Value |
|------|-------|
| A | Because the finance lead asked to receive a separate copy later. |
| B | **Because the finance lead owns the reconciliation and needs to see the same thread.** ✓ |
| C | Because BCC keeps the client from seeing internal names. |
| D | Because the account director must approve every sentence. |

**Key:** B

**Feedback:**
> The internal note states the reason: **`they own the reconciliation and need to see the same thread.`** **A** invents a later request, **C** reverses the explicit rule against BCC in client replies, and **D** exaggerates a conditional escalation into line-by-line approval.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_professional_email_advanced_th_schwa_001
skill: `pronunciation.formal_email_th_dh`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_professional_email_advanced_th_schwa_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *Thank* opens with voiceless /θ/, while *the* and *whether* use voiced /ð/; Brazilian learners often replace both with /t/, /d/ or /s/. In *I apologize for the confusion*, the unstressed syllables carry /ə/, not a full Portuguese vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "Thank you for flagging this — I apologize for the confusion. Could you confirm the corrected amount by Friday?"

**Target phonemes:** /θ/ in *Thank* · /ð/ in *the, this, whether* · /ə/ in *apologize, confirm, corrected* · /aɪ/ in *Friday*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_professional_email_advanced_could_you_001
skill: `grammar.polite_requests_email`
type: `error_correction`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_email_technical`
distractors:
  - option: "Could you to confirm receipt by Friday, please?"
    br_pt_form: "Você pode para confirmar o recebimento até sexta, por favor?"
    note: "a modal takes the bare verb; the preposition is L1 transfer"
  - option: "You can confirm receipt by Friday?"
    br_pt_form: "Você pode confirmar o recebimento até sexta?"
    note: "statement order with rising intonation only is not the standard written request"
  - option: "Confirming receipt by Friday, please?"
    br_pt_form: "Confirmando o recebimento até sexta, por favor?"
    note: "a gerund has no modal and cannot carry a polite request"
```

**Item:**
> Reviewing email basics: which line is a correct polite request in a client email?

| Slot | Value |
|------|-------|
| A | "Could you to confirm receipt by Friday, please?" |
| B | **"Could you confirm receipt by Friday, please?"** ✓ |
| C | "You can confirm receipt by Friday?" |
| D | "Confirming receipt by Friday, please?" |

**Key:** B

**Feedback:**
> A polite written request keeps interrogative order and a bare verb after the modal: **`Could you confirm receipt by Friday, please?`** **A** inserts *to* after *could*, **C** relies on intonation alone, and **D** uses a gerund with no request structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_professional_email_advanced_followup_001
skill: `vocab.email_follow_up`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_email_technical`
distractors:
  - option: "Please find attached the summary — check the numbers."
    br_pt_form: "Segue em anexo o resumo — confira os números."
    note: "this introduces a file; it does not resume an unanswered message"
  - option: "Dear team, please find the revised process below."
    br_pt_form: "Prezada equipe, segue abaixo o processo revisado."
    note: "this is an opening line, not a follow-up to a previous email"
  - option: "I attach you the correction — confirm it."
    br_pt_form: "Eu anexo você a correção — confirme."
    note: "the verb takes the file as object, not the person, and the tone is abrupt"
```

**Item:**
> Reviewing email basics: which line is a polite follow-up after a client did not reply?

| Slot | Value |
|------|-------|
| A | **"I'm following up on my message from Tuesday — could you confirm the revised amount?"** ✓ |
| B | "Please find attached the summary — check the numbers." |
| C | "Dear team, please find the revised process below." |
| D | "I attach you the correction — confirm it." |

**Key:** A

**Feedback:**
> A follow-up names the earlier message and asks for a concrete answer: **`I'm following up on my message from Tuesday — could you confirm the revised amount?`** **B** only presents an attachment, **C** is an opening rather than a follow-up, and **D** misuses *attach* and sounds abrupt.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `formal_email_register_review` | Item 1 missed | **L2** | Contrast *Hi Ana / sorry for the mess* with *Dear Ms. Costa / I apologize* in a short client reply with a named owner and deadline. |
| `client_request_detail` | Item 2 missed | **L2** | Drill explicit requests in a complaint email; separate *corrected invoice* from invented refunds, calls and contract changes. |
| `email_discourse_markers` | Items 3, 4 and 7 missed | **L2** | Recycle acknowledgment, apology, CC-versus-BCC, escalation and follow-up in one reconstructed client thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. The pronunciation item is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_email_technical` (`email_vocab`, `email_register`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; the ASR item is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The terms *CC*, *BCC*, *FYI* and *ETA* are unprotected professional conventions or abbreviations.
6. The four normalized options of each MCQ are distinct after removing markdown marks, check marks, quotes and case; distractor order in each YAML block follows the slot order in its table.
