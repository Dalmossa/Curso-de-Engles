# Practice Pack — `les_a2_phone_calls`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_phone_calls_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_phone_calls.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_phone_calls_v1
lesson_id: les_a2_phone_calls
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
item_id: `grm_call_continuous_now_001`
skill: `grammar.present_continuous_calls`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I am calling for the incident ticket."
    br_pt_form: "Estou ligando para o ticket do incidente."
    note: "'for' suggests fetching something; the progressive form is fine, but the preposition does not introduce the topic"
  - option: "I call you now about the incident."
    br_pt_form: "Eu ligo você agora sobre o incidente."
    note: "present simple cannot mark an action in progress, and 'call you' needs 'to' before the person"
  - option: "I calling about the incident ticket."
    br_pt_form: "Eu ligando sobre o ticket do incidente."
    note: "the -ing form needs the auxiliary 'be'; 'am' is missing"
```

**Item:**
> You open a support call with a colleague abroad. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I am calling for the incident ticket." |
| B | "I call you now about the incident." |
| C | **"I am calling about the incident ticket."** ✓ |
| D | "I calling about the incident ticket." |

**Key:** C

**Feedback:**
> An action in progress at the moment of speaking uses *be* + verb-*ing*: **`I am calling about the incident ticket.`** **A** uses the wrong preposition (*about* introduces the topic), **B** drops the progressive and leaves out *to* before the person, and **D** is missing the auxiliary *am*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: `rdg_call_vm_001`
skill: `reading.phone_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Send her the summary by email."
    br_pt_form: "Enviar a ela o resumo por e-mail."
    note: "Dana is writing the summary herself; sending it is not what she asks for"
  - option: "Open the deploy window now."
    br_pt_form: "Abrir a janela de deploy agora."
    note: "the deploy window is the deadline for the callback, not an action Dana requests"
  - option: "Join the duty rota."
    br_pt_form: "Entrar na escala de plantão."
    note: "Dana is already on the duty rota; that is how she took the call"
```

**Stimulus:**
> "Hi, this is Dana from the duty rota. I missed your call about the payment incident. I am writing the summary now. Can you call me back before the deploy window at 15:00?"

**Item:**
> What does Dana ask the caller to do?

| Slot | Value |
|------|-------|
| A | Send her the summary by email. |
| B | **Call her back before 15:00.** ✓ |
| C | Open the deploy window now. |
| D | Join the duty rota. |

**Key:** B

**Feedback:**
> Dana says she missed the call and asks **`Can you call me back before the deploy window at 15:00?`** — that is a callback request with a deadline. **A** inverts who writes the summary, **C** turns the time limit into an action, and **D** misreads the duty rota as an invitation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_call_trouble_001`
skill: `vocab.phone_call_trouble`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Can you hang up, please?"
    br_pt_form: "Você pode desligar, por favor?"
    note: "hang up ends the call, which is the opposite of asking for a repeat"
  - option: "Are you breaking up?"
    br_pt_form: "Você está cortando?"
    note: "a yes/no question about the connection; it reports the problem but does not ask for the repeat"
  - option: "Can you hold the line, please?"
    br_pt_form: "Você pode aguardar na linha, por favor?"
    note: "hold the line asks the other person to wait, not to say it again"
```

**Item:**
> The audio is bad and you missed the status code. Which phrase asks the colleague to say it again?

| Slot | Value |
|------|-------|
| A | "Can you hang up, please?" |
| B | "Are you breaking up?" |
| C | "Can you hold the line, please?" |
| D | **"Sorry, you're breaking up. Can you repeat that?"** ✓ |

**Key:** D

**Feedback:**
> When the connection is poor you report it and then ask for the repeat: **`Sorry, you're breaking up. Can you repeat that?`** **A** ends the call instead of fixing the problem, **B** only flags the connection quality, and **C** asks the other person to wait.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_call_transcript_001`
skill: `reading.phone_continuity`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The client answered on the second call."
    br_pt_form: "O cliente atendeu na segunda ligação."
    note: "the second call was not answered; it went to voicemail"
  - option: "Rafa sent an email instead of calling."
    br_pt_form: "Rafa enviou um e-mail em vez de ligar."
    note: "he called twice and left a message; no email replaced a call"
  - option: "The standup was cancelled."
    br_pt_form: "O standup foi cancelado."
    note: "the standup is the deadline for the callback, not an event that was cancelled"
```

**Stimulus:**
> "Call note 09:12 — I tried to reach the client twice. The first call dropped and the second went to voicemail. I left a message and asked for a callback before the standup."

**Item:**
> What does the note say about the two calls?

| Slot | Value |
|------|-------|
| A | The client answered on the second call. |
| B | Rafa sent an email instead of calling. |
| C | **The first call dropped and the second went to voicemail.** ✓ |
| D | The standup was cancelled. |

**Key:** C

**Feedback:**
> The note states the outcome of each attempt: **`The first call dropped and the second went to voicemail.`** **A** contradicts the voicemail detail, **B** introduces an email the note never mentions, and **D** confuses the standup deadline with a cancellation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: `prn_call_v_w_001`
skill: `pronunciation.phone_v_w`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_call_v_w_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *verify* /ver/ and *video* /vid/ start with /v/: upper teeth on the lower lip, voicing on. *we* /wi/ and *west* start with /w/: rounded lips and no teeth contact. Saying *video* with /w/ turns it into *wideo*, which no native listener decodes.
**Step 2 — produce (ASR-scored):** read aloud:

> "Can we verify that on a video call with the west coast team?"

**Target phonemes:** /v/ in *verify, video* · /w/ in *we, west* · /ð/ in *with*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: `grm_email_can_send_001`
skill: `grammar.email_requests`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "You can send me the file?"
    br_pt_form: "Você pode me enviar o arquivo?"
    note: "statement order with rising intonation only; the interrogative is the standard written request"
  - option: "Can you to send me the file, please?"
    br_pt_form: "Você pode para me enviar o arquivo, por favor?"
    note: "modals take the base verb directly; 'to' after 'can' is L1 transfer"
  - option: "Sending me the file, please?"
    br_pt_form: "Enviando-me o arquivo, por favor?"
    note: "a gerund cannot carry the request; the modal is missing"
```

**Item:**
> Reviewing the email basics before the deployment thread, which sentence is a correct polite request?

| Slot | Value |
|------|-------|
| A | "You can send me the file?" |
| B | **"Can you send me the file before the call, please?"** ✓ |
| C | "Can you to send me the file, please?" |
| D | "Sending me the file, please?" |

**Key:** B

**Feedback:**
> A polite written request keeps the interrogative order: **`Can you send me the file before the call, please?`** **A** relies on intonation alone, **C** inserts *to* after the modal, and **D** uses a gerund with no request structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: `voc_email_forward_001`
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please reply the email to the platform team."
    br_pt_form: "Por favor, responda o e-mail para o time de plataforma."
    note: "reply answers the sender; it does not send the message to a new recipient"
  - option: "Please attach the email in the platform team."
    br_pt_form: "Por favor, anexe o e-mail no time de plataforma."
    note: "attach adds a file to a message, it does not pass a received email onward"
  - option: "Please give back the email to the platform team."
    br_pt_form: "Por favor, devolva o e-mail para o time de plataforma."
    note: "give back means returning something to its owner, the wrong action here"
```

**Item:**
> Reviewing the email basics, a colleague wants to send a received message to another team without editing it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"Please forward the email to the platform team."** ✓ |
| B | "Please reply the email to the platform team." |
| C | "Please attach the email in the platform team." |
| D | "Please give back the email to the platform team." |

**Key:** A

**Feedback:**
> Passing a received message to someone else is **`forward`**: **`Please forward the email to the platform team.`** **B** answers the original sender, **C** adds a file instead of forwarding the message, and **D** means returning, not sharing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `present_continuous_calls` | Item 1 missed | **L2** | Contrast *I call* and *I am calling* in call openings about a live incident. |
| `phone_trouble_phrases` | Item 3 missed | **L2** | Recycle *breaking up*, *speak up*, *hold the line*, *call back* in a short bad-signal dialogue. |
| `callback_deadline_reading` | Items 2 and 4 missed | **L2** | Extract deadlines from voicemails and call notes before the deploy window. |
| `email_verbs_review` | Item 7 missed | **L2** | Separate *forward*, *reply*, *attach* in email threads that continue after a call. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.