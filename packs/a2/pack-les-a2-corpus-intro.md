# Practice Pack — `les_a2_corpus_intro`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_corpus_intro_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_corpus_intro.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_corpus_intro_v1
lesson_id: les_a2_corpus_intro
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
item_id: grm_acronym_preposition_frame_001
skill: `grammar.acronym_sentence_frame`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I will post the log in PTO."
    br_pt_form: "Eu vou postar o log em folga."
    note: "carries the Portuguese preposition 'em' into a time frame that English expresses with by"
  - option: "I will post the log until EOD."
    br_pt_form: "Eu vou postar o log até o fim do dia."
    note: "uses until for a delivery point; the natural deadline frame is by, not a duration marker"
  - option: "I will post the log on EOD."
    br_pt_form: "Eu vou postar o log no fim do dia."
    note: "overgeneralizes on from the PTO frame onto a deadline expression that does not take it"
```

**Item:**
> A teammate writes a status update before the daily. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "I will post the log in PTO." |
| B | **"I will post the log by EOD."** ✓ |
| C | "I will post the log until EOD." |
| D | "I will post the log on EOD." |

**Key:** B

**Feedback:**
> A delivery deadline is framed with **`by`**: **`I will post the log by EOD.`** **A** translates *em folga* into the wrong preposition, **C** treats the deadline as a duration with *until*, and **D** copies *on* from the PTO frame into a phrase that rejects it.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_acronym_chat_context_001
skill: `reading.acronym_chat_context`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Close the P0 incident."
    br_pt_form: "Fechar o incidente P-zero."
    note: "the note states the P0 is already closed; readers latch onto the most dramatic acronym in the text"
  - option: "Open a new PR."
    br_pt_form: "Abrir um novo PR."
    note: "the PR is already open, and Brazilian readers often turn a stated status into a requested action"
  - option: "Set the ETA for the CD release."
    br_pt_form: "Definir o ETA do release CD."
    note: "the ETA is given as noon, so it is information rather than a task; the time expression draws the eye"
```

**Stimulus:**
> "Channel note — Bia: The P0 is closed and the PR is open. FYI: Ana is on PTO, so I need the SLA check from you by EOD. The ETA for the CD release is noon. Please mark the open questions TBD."

**Item:**
> What does Bia ask Ravi to do?

| Slot | Value |
|------|-------|
| A | "Close the P0 incident." |
| B | "Open a new PR." |
| C | **"Run the SLA check by EOD."** ✓ |
| D | "Set the ETA for the CD release." |

**Key:** C

**Feedback:**
> The request is explicit: **`I need the SLA check from you by EOD.`** **A** and **B** describe states that the note says already hold, and **D** turns a supplied ETA into an instruction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_acronyms_corporate_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "On paid leave."
    br_pt_form: "De folga remunerada."
    note: "that is PTO, a different abbreviation that appears beside WFH in the same update"
  - option: "On a support call."
    br_pt_form: "Em uma ligação de suporte."
    note: "the learner maps a remote-work situation onto the phone phrases from the previous lesson"
  - option: "Before the end of the day."
    br_pt_form: "Antes do fim do dia."
    note: "that is the EOD deadline, another acronym in the same note that is easy to swap for a location"
```

**Item:**
> Milan writes: "I'm WFH today, so join the review online." What does WFH mean here?

| Slot | Value |
|------|-------|
| A | "On paid leave." |
| B | "On a support call." |
| C | **"Working from home."** ✓ |
| D | "Before the end of the day." |

**Key:** C

**Feedback:**
> **WFH** describes where someone is working, not when: **`I'm WFH today.`** **A** is PTO, **B** belongs to call vocabulary, and **D** is the EOD deadline.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_acronym_reply_context_001
skill: `reading.acronym_reply_context`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The SLA check failed."
    br_pt_form: "A verificação do SLA falhou."
    note: "the check is still planned, so readers turn a future task into a completed cause"
  - option: "The PR was closed."
    br_pt_form: "O PR foi fechado."
    note: "the thread only says the PR link will be posted; a salient acronym gets read as an outcome"
  - option: "The CD release is at noon."
    br_pt_form: "O release CD é ao meio-dia."
    note: "the noon time is the ETA, and Portuguese readers often convert a time detail into a reason"
```

**Stimulus:**
> "Reply in thread — Ravi: FYI: Ana is on PTO today and Milan is WFH. The RFC review moves to tomorrow. I will run the SLA check by EOD and post the PR link ASAP. The owner of the last item is TBD."

**Item:**
> Why does the RFC review move to tomorrow?

| Slot | Value |
|------|-------|
| A | "The SLA check failed." |
| B | **"Two reviewers are unavailable today."** ✓ |
| C | "The PR was closed." |
| D | "The CD release is at noon." |

**Key:** B

**Feedback:**
> The reason comes first: **`Ana is on PTO today and Milan is WFH.`** Both people are absent, so the review moves. **A** invents a failed check, **C** invents a closed PR, and **D** mistakes the ETA detail for a cause.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_acronym_letter_names_001
skill: `pronunciation.acronym_letter_names`
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

**Step 1 — hear the contrast:** *EOD* is spelled out as three short letters, E-O-D, while *ETA* is one word, /ˈiːtɑː/. *P0* ends with the digit *zero* /zɪəroʊ/, never the letter *oh*. Portuguese tends to attach a vowel after consonant letter names, so *P* can come out as "pê" and *D* as "dê"; the English letter names are shorter and clipped.

**Step 2 — produce (ASR-scored):** read aloud:

> "FYI: the ETA is noon, and the P-zero fix is in the PR."

**Target phonemes:** /piː/ in *P* · /z/ in *zero* · /ˈiːtɑː/ in *ETA* as one word · no extra vowel after the consonant letter names.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_psq_present_simple_report_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The SLA give the team four hours."
    br_pt_form: "O SLA dá quatro horas para o time."
    note: "Portuguese has no third-person -s ending, so the singular subject loses the English verb marker"
  - option: "The SLA is give the team four hours."
    br_pt_form: "O SLA está dar quatro horas para o time."
    note: "carries the Portuguese progressive feeling into a fact; a routine statement takes the simple present"
  - option: "The SLA gives to the team four hours."
    br_pt_form: "O SLA dá para o time quatro horas."
    note: "inserts the Portuguese 'para' before the recipient; gives takes the indirect object directly"
```

**Item:**
> Reviewing the present simple before you write the status update, which sentence is correct?

| Slot | Value |
|------|-------|
| A | **"The SLA gives the team four hours."** ✓ |
| B | "The SLA give the team four hours." |
| C | "The SLA is give the team four hours." |
| D | "The SLA gives to the team four hours." |

**Key:** A

**Feedback:**
> A standing fact uses the present simple with third-person **-s**: **`The SLA gives the team four hours.`** **B** drops the **-s**, **C** adds a *be* form before the bare verb, and **D** inserts *to* before the recipient.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_psq_deadline_vocab_001
skill: `vocab.deadline_vocab`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_deadlines_tasks
distractors:
  - option: "ETA."
    br_pt_form: "A previsão de horário."
    note: "an ETA is an estimate of when something will happen, not the latest permitted time"
  - option: "SLA."
    br_pt_form: "O acordo de nível de serviço."
    note: "an SLA is the agreement that sets the expectation; the word for the limit itself is different"
  - option: "Stand-up."
    br_pt_form: "A reunião em pé."
    note: "a stand-up is a short meeting, and Brazilian readers pick a familiar workplace noun over the time word"
```

**Item:**
> Reviewing deadline language from an earlier lesson, which word names the latest time by which a task must be finished?

| Slot | Value |
|------|-------|
| A | "ETA." |
| B | "SLA." |
| C | **"Deadline."** ✓ |
| D | "Stand-up." |

**Key:** C

**Feedback:**
> The latest permitted time is the **`deadline`**, which pairs naturally with the **by EOD** frame from this lesson. **A** is an estimate, **B** is an agreement, and **D** is a meeting.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `acronym_time_frames` | Item 1 missed | **L2** | Rebuild *by EOD* against *until EOD*, *on EOD* and the *in PTO* calque in short status updates. |
| `acronym_letter_vs_word` | Items 3 and 5 missed | **L2** | Sort the set into spelled acronyms (*EOD, PR, P0*) and word-like ones (*ETA, ASAP*) before the next daily. |
| `deadline_word_contrast` | Item 7 missed | **L2** | Contrast *deadline*, *ETA* and *SLA* in the same status note so the three time ideas stop overlapping. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_deadlines_tasks` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
5. Every `item_id` is written without backticks in this pack, per the Lote 6 canonical convention; `skill` and `type` keep the backticks required by the pack contract.
