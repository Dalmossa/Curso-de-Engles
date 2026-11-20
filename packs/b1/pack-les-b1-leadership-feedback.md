# Practice Pack — `les_b1_leadership_feedback`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b1_leadership_feedback_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_leadership_feedback.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_leadership_feedback_v1
lesson_id: les_b1_leadership_feedback
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
item_id: grm_leadership_feedback_reported_001
skill: `grammar.feedback_reported_speech`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "He says the handoff notes were clear, but the follow-up was late."
    br_pt_form: "Ele diz que as notas de entrega estavam claras, mas o acompanhamento estava atrasado."
    note: "present 'says' with a past complement breaks tense consistency after a past report"
  - option: "He said the handoff notes are clear, but the follow-up is late."
    br_pt_form: "Ele disse que as notas de entrega estão claras, mas o acompanhamento está atrasado."
    note: "no backshift after the past reporting verb 'said'"
  - option: "He said that the handoff notes was clear, but the follow-up was late."
    br_pt_form: "Ele disse que as notas de entrega estava clara, mas o acompanhamento estava atrasado."
    note: "subject-verb agreement: the plural subject 'notes' requires 'were'"
```

**Item:**
> In the one-on-one, Ana reports what the client said. Which line keeps both the backshift and the meaning?

| Slot | Value |
|------|-------|
| A | "He says the handoff notes were clear, but the follow-up was late." |
| B | **"He said the handoff notes were clear, but the follow-up was late."** ✓ |
| C | "He said the handoff notes are clear, but the follow-up is late." |
| D | "He said that the handoff notes was clear, but the follow-up was late." |

**Key:** B

**Feedback:**
> **B** keeps the past reporting verb and the backshifted complement. **A** mixes *says* with a past complement, **C** drops the backshift, and **D** uses *was* with a plural subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_leadership_feedback_dialogue_001
skill: `reading.feedback_dialogue`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The handoff notes were unclear."
    br_pt_form: "As notas de entrega estavam confusas."
    note: "the client said the notes were clear; the problem was the timing"
  - option: "Rafael missed the payments sprint deadline."
    br_pt_form: "O Rafael perdeu o prazo do sprint de pagamentos."
    note: "Ana praises his throughput; no missed deadline appears in the dialogue"
  - option: "Ana refused to review the notes."
    br_pt_form: "A Ana se recusou a revisar as notas."
    note: "Ana offers to review the first two notes with Rafael"
```

**Stimulus:**
> "Ana: Let's start our one-on-one with recognition: your throughput on the payments sprint was excellent. Rafael: Thanks. I did worry about the handoff notes, though. Ana: Good — that's exactly our improvement area. The client said the notes were clear, but the follow-up was late. Rafael: What exactly did he say about the timing? Ana: He said the handoff arrived after the check-in, so the team couldn't act on it. Let's make the next one actionable: owner, date, and a short note by Friday."

**Item:**
> What was the client's actual complaint?

| Slot | Value |
|------|-------|
| A | The handoff notes were unclear. |
| B | **The follow-up arrived after the check-in.** ✓ |
| C | Rafael missed the payments sprint deadline. |
| D | Ana refused to review the notes. |

**Key:** B

**Feedback:**
> The client's words are **`the notes were clear, but the follow-up was late`**. **A** reverses what was said about the notes, **C** invents a missed deadline, and **D** turns Ana's offer to review into a refusal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_leadership_feedback_actionable_001
skill: `vocab.leadership.actionable`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "Polite enough to send to a client."
    br_pt_form: "Educado o suficiente para enviar a um cliente."
    note: "politeness is not what makes feedback actionable"
  - option: "Written in formal English."
    br_pt_form: "Escrito em inglês formal."
    note: "register is irrelevant; the term is about the next step being decidable"
  - option: "Short, regardless of the detail."
    br_pt_form: "Curto, independentemente do detalhe."
    note: "brevity alone does not tell the reader what to do"
```

**Item:**
> Ana calls the next handoff "actionable". Which option explains the word in this context?

| Slot | Value |
|------|-------|
| A | Polite enough to send to a client. |
| B | Written in formal English. |
| C | **Specific enough that the reader knows the next step, owner and date.** ✓ |
| D | Short, regardless of the detail. |

**Key:** C

**Feedback:**
> **C** matches Ana's own definition: *owner, date, and a short note*. **A** confuses tone with usefulness, **B** confuses register with content, and **D** treats length as the criterion.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_leadership_feedback_evidence_001
skill: `reading.feedback_evidence`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Send the client a new status report."
    br_pt_form: "Enviar um novo relatório de status ao cliente."
    note: "no new client report is promised in the closing exchange"
  - option: "Move the check-in to Friday."
    br_pt_form: "Mover o check-in para sexta-feira."
    note: "Friday is the note deadline, not a rescheduled check-in"
  - option: "Replace the handoff notes with a call."
    br_pt_form: "Substituir as notas de entrega por uma ligação."
    note: "the notes stay; Ana says she will review the first two"
```

**Stimulus:**
> "Rafael: Does that mean I should send the note before the check-in, not after? Ana: Yes. That's the feedback loop: note, check-in, follow-up. I'll review the first two with you, and we'll close it next week."

**Item:**
> What will Ana do as part of the follow-up?

| Slot | Value |
|------|-------|
| A | **Review Rafael's first two notes with him.** ✓ |
| B | Send the client a new status report. |
| C | Move the check-in to Friday. |
| D | Replace the handoff notes with a call. |

**Key:** A

**Feedback:**
> Ana says **`I'll review the first two with you`**, so **A** is the promised action. **B** adds a report nobody mentioned, **C** mistakes the note deadline for a new check-in date, and **D** removes the notes Ana expressly keeps.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_leadership_feedback_vowels_001
skill: `pronunciation.leadership_vowels`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_leadership_feedback_vowels_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *feedback* and *actionable* carry /æ/, an open vowel between /e/ and /a/ — Brazilian learners often produce /e/ ("fédback"). Hold /æ/ in *handoff* too. Then lengthen /iː/ in *meeting* and glide through /eɪ/ in *late* and *date*; do not read them as the Portuguese "ei".

**Step 2 — produce (ASR-scored):** read aloud:

> "The actionable feedback is due before Friday's check-in; make it clear and send the date."

**Target phonemes:** /æ/ in *actionable, feedback, handoff* · /iː/ in *meeting* and *clear* · /eɪ/ in *make, date, late* · /ð/ in *the, with* (voiced dental, not /d/ or /z/).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_leadership_feedback_backshift_001
skill: `grammar.tense_consistency`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_reported_speech`
distractors:
  - option: "He asked what exactly did the client say about the timing."
    br_pt_form: "Ele perguntou o que exatamente o cliente disse sobre o prazo."
    note: "reported questions use statement order, not did-support inversion"
  - option: "He asked what did the client say about the timing?"
    br_pt_form: "Ele perguntou o que o cliente disse sobre o prazo?"
    note: "inversion plus a question mark inside a reported question"
  - option: "He asks what exactly the client said about the timing."
    br_pt_form: "Ele pergunta o que exatamente o cliente disse sobre o prazo."
    note: "a present reporting verb shifts the time reference away from the original past question"
```

**Item:**
> Reviewing reported speech: Rafael asked, "What exactly did he say about the timing?" Which line reports his question correctly?

| Slot | Value |
|------|-------|
| A | "He asked what exactly did the client say about the timing." |
| B | **"He asked what exactly the client had said about the timing."** ✓ |
| C | "He asked what did the client say about the timing?" |
| D | "He asks what exactly the client said about the timing." |

**Key:** B

**Feedback:**
> A reported *wh-* question keeps statement order and backshifts the verb: **`He asked what exactly the client had said...`** **A** keeps *did* inversion, **C** adds a question mark to the embedded clause, and **D** changes the reporting verb to the present.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_leadership_feedback_checkin_001
skill: `vocab.meeting_vocab`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_meeting_standup`
distractors:
  - option: "We start now the meeting."
    br_pt_form: "Nós começamos agora a reunião."
    note: "the adverb splits subject and verb; English keeps them adjacent"
  - option: "Does anyone has an update?"
    br_pt_form: "Alguém tem uma atualização?"
    note: "does takes the bare verb 'have', not the third-person form"
  - option: "Let's to go through the agenda first."
    br_pt_form: "Vamos passar pela pauta primeiro."
    note: "let's takes the bare verb; the inserted 'to' is L1 transfer"
```

**Item:**
> Reviewing meeting vocabulary: which line opens the weekly check-in naturally?

| Slot | Value |
|------|-------|
| A | "We start now the meeting." |
| B | "Does anyone has an update?" |
| C | "Let's to go through the agenda first." |
| D | **"Let's start with a quick check-in; what's everyone's update?"** ✓ |

**Key:** D

**Feedback:**
> **D** uses the fixed opening *let's start with...* and the noun *check-in*. **A** breaks SVO order, **B** needs *have* after *does*, and **C** inserts *to* after *let's*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `feedback_backshift_drill` | Items 1 and 6 missed | **L2** | Contrast *says/are* with *said/were/had said* in three-line 1:1 reports about a client. |
| `one_on_one_detail_scan` | Items 2 and 4 missed | **L2** | Scan short feedback dialogue for the exact complaint and the promised action; separate *timing* from *clarity*. |
| `actionable_checkin_review` | Items 3, 5 and 7 missed | **L2** | Recycle *actionable / check-in / follow-up* plus /æ/ and /iː/ in one short stand-up opener with owner and date. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_reported_speech` (`tense_consistency`) and `les_a2_it_meeting_standup` (`meeting_vocab`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced or adapted.
6. The grammar-rag query `"leadership feedback loops performance review language"` (top-2) returned unrelated grammar excerpts; none of the retrieved text was used.
