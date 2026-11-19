# Practice Pack — `les_a2_it_email_technical`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_email_technical_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_email_technical.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_email_technical_v1
lesson_id: les_a2_it_email_technical
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
item_id: grm_email_tech_action_item_001
skill: `grammar.status_update_imperative`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Reviewing the query plan and confirmed the ETA."
    br_pt_form: "Revisando o plano de consulta e confirmado o prazo."
    note: "a gerund cannot open a directive, and 'confirmed' breaks the parallel structure"
  - option: "To review the query plan and confirm the ETA."
    br_pt_form: "Para revisar o plano de consulta e confirmar o prazo."
    note: "an infinitive fragment does not tell the reader what to do in a status email"
  - option: "Reviewed the query plan and confirm the ETA."
    br_pt_form: "Revisou o plano de consulta e confirme o prazo."
    note: "past tense reports a finished action, but the email requests action now"
```

**Item:**
> You are sending a status update. Which line is a clear action item for the reader?

| Slot | Value |
|------|-------|
| A | "Reviewing the query plan and confirmed the ETA." |
| B | **"Review the query plan and confirm the ETA."** ✓ |
| C | "To review the query plan and confirm the ETA." |
| D | "Reviewed the query plan and confirm the ETA." |

**Key:** B

**Feedback:**
> A direct request in a technical email uses the base verb: **`Review the query plan and confirm the ETA.`** **A** mixes a gerund with a past participle, **C** is an unfinished infinitive, and **D** starts with a past tense that reports instead of requesting.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_email_tech_tldr_001
skill: `reading.tech_email_status`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The query plan is missing from the email."
    br_pt_form: "O plano de consulta está faltando no e-mail."
    note: "the sender says the query plan is attached; the missing thing is an index"
  - option: "The product owner has not replied."
    br_pt_form: "O product owner ainda não respondeu."
    note: "the product owner is only marked FYI; no reply is requested from them"
  - option: "The release was cancelled."
    br_pt_form: "O release foi cancelado."
    note: "the release is blocked by the timeout, not cancelled"
```

**Stimulus:**
> "Subject: [PAY-218] Payment timeout — action needed. TL;DR: The payments endpoint times out in thirty seconds and blocks tomorrow's release. Root cause: a missing index on `user_id`. Action item: Ana will add the index by 16:00. I'm attaching the query plan — please review it. FYI the product owner."

**Item:**
> What is the root cause of the timeout?

| Slot | Value |
|------|-------|
| A | The query plan is missing from the email. |
| B | **A missing index on `user_id`.** ✓ |
| C | The product owner has not replied. |
| D | The release was cancelled. |

**Key:** B

**Feedback:**
> The status line states it directly: **`Root cause: a missing index on user_id.`** **A** inverts attachment and index, **C** turns an FYI recipient into a blocker, and **D** confuses *blocked* with *cancelled*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_email_tech_status_001
skill: `vocab.email_tech_status`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "FYI"
    br_pt_form: "para seu conhecimento"
    note: "FYI marks information for someone who does not need to act, not a time"
  - option: "ASAP"
    br_pt_form: "o mais rápido possível"
    note: "ASAP expresses urgency but gives no concrete time for the fix"
  - option: "TL;DR"
    br_pt_form: "resumo em uma linha"
    note: "TL;DR introduces the summary, not a delivery time"
```

**Item:**
> The fix is delayed and the team needs a concrete time. Which abbreviation fits? "Can you send an ___?"

| Slot | Value |
|------|-------|
| A | FYI |
| B | ASAP |
| C | **ETA** ✓ |
| D | TL;DR |

**Key:** C

**Feedback:**
> **`ETA`** is the estimated time the fix will arrive. **A** (*FYI*) only informs, **B** (*ASAP*) is urgency without a time, and **D** (*TL;DR*) is the one-line summary at the top of the email.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_email_tech_escalation_001
skill: `reading.tech_email_escalation`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The product owner takes the action item."
    br_pt_form: "O product owner assume o item de ação."
    note: "the product owner is FYI only; Bruna is named as the owner"
  - option: "The sender cancels the update."
    br_pt_form: "O remetente cancela a atualização."
    note: "the sender sends an update at 15:40; nothing is cancelled"
  - option: "Bruna confirms receipt of the email."
    br_pt_form: "A Bruna confirma o recebimento do e-mail."
    note: "Bruna sends a new ETA; the reader is the one asked to confirm receipt"
```

**Stimulus:**
> "Update 15:40 — The index fix did not land before the window. I'm escalating to the platform team now. Bruna owns the action item and will send a new ETA by 17:00. Please confirm receipt; no action needed from the product owner (FYI)."

**Item:**
> What happens after the fix misses the window?

| Slot | Value |
|------|-------|
| A | The product owner takes the action item. |
| B | **The sender escalates to the platform team.** ✓ |
| C | The sender cancels the update. |
| D | Bruna confirms receipt of the email. |

**Key:** B

**Feedback:**
> The update says **`I'm escalating to the platform team now.`** **A** misreads an FYI recipient as the owner, **C** invents a cancellation, and **D** swaps Bruna's new ETA for the reader's confirmation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_email_tech_acronyms_001
skill: `pronunciation.email_tech_acronyms`
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

**Step 1 — hear the contrast:** *ETA* is read letter by letter, /iː tiː eɪ/ — the first /iː/ is long, the last letter is /eɪ/. *FYI* is /ef waɪ aɪ/, three separate letters; do not fuse it into one word. Brazilian learners often add a final vowel after /k/ in *check* ("check-e") and shorten /iː/ in *ETA*.

**Step 2 — produce (ASR-scored):** read aloud:

> "The ETA is five. FYI, the index is missing — please check it."

**Target phonemes:** /iː/ in *ETA* · /eɪ/ in the last letter of *ETA* · /aɪ/ in *FYI* (twice) · /k/ final in *check*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_email_tech_could_request_001
skill: `grammar.email_requests`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Could you to confirm the ETA by 16:00, please?"
    br_pt_form: "Você pode para confirmar o prazo até 16:00, por favor?"
    note: "a modal takes the bare verb; 'to' after 'could' is L1 transfer"
  - option: "You can confirm the ETA by 16:00?"
    br_pt_form: "Você pode confirmar o prazo até 16:00?"
    note: "statement order with rising intonation only is not the standard written request"
  - option: "Confirming the ETA by 16:00, please?"
    br_pt_form: "Confirmando o prazo até 16:00, por favor?"
    note: "a gerund has no modal and cannot carry a polite request"
```

**Item:**
> Reviewing email basics: which line is a correct polite request in a status update?

| Slot | Value |
|------|-------|
| A | "Could you to confirm the ETA by 16:00, please?" |
| B | **"Could you confirm the ETA by 16:00, please?"** ✓ |
| C | "You can confirm the ETA by 16:00?" |
| D | "Confirming the ETA by 16:00, please?" |

**Key:** B

**Feedback:**
> A polite written request keeps interrogative order and a bare verb after the modal: **`Could you confirm the ETA by 16:00, please?`** **A** inserts *to* after *could*, **C** relies on intonation alone, and **D** uses a gerund with no request structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_email_tech_attachment_001
skill: `vocab.email_attachment`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please find attached the query plan — check the index."
    br_pt_form: "Segue em anexo o plano de consulta — verifique o índice."
    note: "an anglicism that sounds like a formal letter, not a US tech email"
  - option: "I attach you the query plan — check the index."
    br_pt_form: "Eu anexo você o plano de consulta — verifique o índice."
    note: "'attach' takes the file as object; the person needs 'to' or a different verb"
  - option: "Enclosed is the query plan — check the index."
    br_pt_form: "Em anexo está o plano de consulta — verifique o índice."
    note: "'enclosed' belongs to paper letters; the neutral email verb is 'attaching'"
```

**Item:**
> Reviewing email basics: which line introduces the file and says what to do with it?

| Slot | Value |
|------|-------|
| A | **"I'm attaching the query plan — check the index."** ✓ |
| B | "Please find attached the query plan — check the index." |
| C | "I attach you the query plan — check the index." |
| D | "Enclosed is the query plan — check the index." |

**Key:** A

**Feedback:**
> The neutral US email pattern is **`I'm attaching the query plan — check the index.`** **B** uses a dated anglicism, **C** puts the person where the file belongs, and **D** borrows the register of a paper letter.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `action_item_imperative` | Item 1 missed | **L2** | Contrast *reviewing / to review / review* in short status updates with a named owner and deadline. |
| `status_email_detail` | Items 2 and 4 missed | **L2** | Drill root-cause and escalation details in a five-line status email; separate *blocked* from *cancelled*. |
| `email_register_review` | Items 3, 6 and 7 missed | **L2** | Recycle *ETA / FYI / ASAP / TL;DR*, *could you...?* and *I'm attaching* in one follow-up thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_email_basics` (`email_vocab`, `email_register`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The acronyms ETA, FYI, ASAP and TL;DR are unprotected abbreviations.
