# Practice Pack — `les_a2_ask_for_help`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_ask_for_help_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_ask_for_help.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_ask_for_help_v1
lesson_id: les_a2_ask_for_help
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
item_id: grm_help_request_politeness_001
skill: `grammar.help_request_politeness`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Can you send to me the stack trace?"
    br_pt_form: "Você pode enviar para mim o stack trace?"
    note: "Portuguese puts the pronoun after the preposition; English places the indirect object before the direct object"
  - option: "You can send me the stack trace?"
    br_pt_form: "Você pode me enviar o stack trace?"
    note: "statement order with rising intonation only; the written polite request keeps the interrogative order"
  - option: "Could you to send me the stack trace, please?"
    br_pt_form: "Você poderia para me enviar o stack trace, por favor?"
    note: "a modal takes the base verb directly; inserting to is L1 transfer from the Portuguese 'para'"
```

**Item:**
> You need the stack trace from a teammate who is in a code review. Choose the correct polite request.

| Slot | Value |
|------|-------|
| A | "Can you send to me the stack trace?" |
| B | **"Could you send me the stack trace, please?"** ✓ |
| C | "You can send me the stack trace?" |
| D | "Could you to send me the stack trace, please?" |

**Key:** B

**Feedback:**
> A polite request keeps the modal before the subject and uses the base verb: **`Could you send me the stack trace, please?`** **A** copies the Portuguese order *enviar para mim*, **C** relies on intonation alone, and **D** inserts *to* after *could*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_help_request_context_001
skill: `reading.help_request_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The stack trace."
    br_pt_form: "O stack trace."
    note: "the last technical noun in a Portuguese note tends to read as the request; here the writer promises to post it herself"
  - option: "The incident channel link."
    br_pt_form: "O link do canal de incidente."
    note: "the channel is where she will post the log, not an item she asks for; Portuguese notes make the channel salient"
  - option: "The auth middleware."
    br_pt_form: "O middleware de autenticação."
    note: "she says she is stuck on the middleware, and Brazilian readers turn that complaint into a request for the thing itself"
```

**Stimulus:**
> "Hi Milan. Could you take a look at the failing test on my branch? I'm stuck on the auth middleware. Can you send me the commit hash? Give me a minute while I check the log — I'll drop the stack trace in the incident channel after the review."

**Item:**
> What does Bia ask Milan to send?

| Slot | Value |
|------|-------|
| A | "The stack trace." |
| B | "The incident channel link." |
| C | **"The commit hash."** ✓ |
| D | "The auth middleware." |

**Key:** C

**Feedback:**
> The direct request is **`Can you send me the commit hash?`** **A** is what Bia will post herself, **B** turns the destination channel into a requested object, and **D** mistakes the thing she is stuck on for the thing she asks for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_buying_time_phrases_001
skill: `vocab.buying_time_phrases`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Hold the line, please."
    br_pt_form: "Aguarde na linha, por favor."
    note: "that is a phone phrase for keeping someone on the call, not a way to ask for time to check something"
  - option: "Wait a little."
    br_pt_form: "Espere um pouco."
    note: "literal rendering of 'espere um pouco'; English uses the fixed chunk 'give me a minute' to request time"
  - option: "Without hurry."
    br_pt_form: "Sem pressa."
    note: "word-for-word calque of 'sem pressa'; the natural way to release pressure is 'no rush'"
```

**Item:**
> Your teammate asks for the log now, but you need a moment to find it. Which phrase buys time naturally?

| Slot | Value |
|------|-------|
| A | "Hold the line, please." |
| B | "Wait a little." |
| C | "Without hurry." |
| D | **"Give me a minute while I check the log."** ✓ |

**Key:** D

**Feedback:**
> The settled chunk for requesting a moment is **`Give me a minute`**: **`Give me a minute while I check the log.`** **A** belongs to a phone call, **B** is a calque of *espere um pouco*, and **C** is a calque of *sem pressa*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_help_reply_context_001
skill: `reading.help_reply_context`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Send the commit hash."
    br_pt_form: "Enviar o hash do commit."
    note: "the note tells the other person to send the hash when ready; the Portuguese pronoun gets mapped onto the writer"
  - option: "Close the incident channel."
    br_pt_form: "Fechar o canal de incidente."
    note: "the channel is only where notes are posted; a salient Portuguese noun gets over-read as an action"
  - option: "Join a call at four."
    br_pt_form: "Entrar em uma call às quatro."
    note: "the call is conditional on the check passing, not the next step after the review; 'after the review' gets read as 'at four'"
```

**Stimulus:**
> "Channel note — Milan: I'm still in the review. I'll take a look at the test right after it. No rush on the hash; send it when you have it. If the check passes, I'll jump on a call with you at four."

**Item:**
> What will Milan do right after the review?

| Slot | Value |
|------|-------|
| A | "Send the commit hash." |
| B | **"Take a look at the test."** ✓ |
| C | "Close the incident channel." |
| D | "Join a call at four." |

**Key:** B

**Feedback:**
> The note says **`I'll take a look at the test right after it`**, so the test review is the immediate next action. **A** is assigned to the other person, **C** invents an action on the channel, and **D** is a later step that depends on the check passing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_help_h_dental_001
skill: `pronunciation.help_h_dental`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_help_h_dental_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *help* /help/ opens with the breath /h/, which carioca speech often drops into *elp*. *this* /ðɪs/ and *with* /wɪð/ use the voiced dental /ð/, which Brazilian Portuguese tends to replace with /d/. The contrast is between the aspirated onset in *help* and the dental onset in *this*.
**Step 2 — produce (ASR-scored):** read aloud:

> "Could you help me with this bug?"

**Target phonemes:** /h/ in *help* · /ð/ in *with* and *this* · no extra vowel before the /h/ of *help*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_present_simple_regular_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The test is fail every time I push."
    br_pt_form: "O teste está falhando toda vez que eu faço push."
    note: "Portuguese uses 'está falhando' for the ongoing sense; learners carry that be-form into a bare English verb"
  - option: "The test failing every time I push."
    br_pt_form: "O teste falhando toda vez que eu faço push."
    note: "the gerund 'falhando' maps onto -ing, but the -ing form alone is not a finite present"
  - option: "The test fail every time I push."
    br_pt_form: "O teste falha toda vez que eu faço push."
    note: "Portuguese has no third-person -s ending, so the singular subject loses the English verb marker"
```

**Item:**
> Reviewing the present simple before you report a recurring bug, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The test is fail every time I push." |
| B | **"The test fails every time I push."** ✓ |
| C | "The test failing every time I push." |
| D | "The test fail every time I push." |

**Key:** B

**Feedback:**
> A recurring fact uses the present simple with the third-person **-s**: **`The test fails every time I push.`** **A** inserts *be* before the bare verb, **C** leaves a gerund with no auxiliary, and **D** drops **-s** because Portuguese marks no such ending.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_email_attach_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please annex the stack trace to the ticket."
    br_pt_form: "Por favor, anexe o stack trace ao ticket."
    note: "Portuguese 'anexar' maps onto attach; annex in English means to add territory or a building"
  - option: "Please reply the stack trace to the ticket."
    br_pt_form: "Por favor, responda com o stack trace para o ticket."
    note: "reply answers a sender; it does not add a file to a record"
  - option: "Please forward the stack trace to the ticket."
    br_pt_form: "Por favor, encaminhe o stack trace para o ticket."
    note: "forward sends a message onward to a person, which is a different action from attaching a file to a ticket"
```

**Item:**
> Reviewing the email basics, you need to add a log file to a bug ticket before you ask for help. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Please annex the stack trace to the ticket." |
| B | **"Please attach the stack trace to the ticket."** ✓ |
| C | "Please reply the stack trace to the ticket." |
| D | "Please forward the stack trace to the ticket." |

**Key:** B

**Feedback:**
> Adding a file to a ticket is **`attach`**: **`Please attach the stack trace to the ticket.`** **A** uses the false friend *annex*, **C** answers a sender instead of adding a file, and **D** sends a message onward to a person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `help_request_politeness` | Item 1 missed | **L2** | Rebuild *Could you send me...?* against *send to me* and *could you to send*. |
| `buying_time_phrases` | Item 3 missed | **L2** | Contrast *give me a minute* and *no rush* with the calques *wait a little* and *without hurry*. |
| `present_simple_regular_review` | Item 6 missed | **L2** | Drill the third-person **-s** in recurring-bug reports such as *the test fails every time*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
