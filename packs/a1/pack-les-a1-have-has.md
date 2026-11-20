# Practice Pack — `les_a1_have_has`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_have_has_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_have_has.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_have_has_v1
lesson_id: les_a1_have_has
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
item_id: `grm_have_has_subject_001`
skill: `grammar.have_has_present_simple`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "My manager have two monitors."
    br_pt_form: "Meu gerente tem dois monitores."
    note: "third person singular takes has; have is used with I, you, we and they"
  - option: "My manager haves two monitors."
    br_pt_form: "Meu gerente hav-es dois monitores."
    note: "invents an ending that have never takes; the third person signal is the switch to has, not -es"
  - option: "My manager having two monitors."
    br_pt_form: "Meu gerente tendo dois monitores."
    note: "the -ing form needs an auxiliary such as to be; possession in the present simple uses have or has"
```

**Item:**
> A tech lead lists the equipment in her home office during a team call. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "My manager have two monitors." |
| B | **"My manager has two monitors."** ✓ |
| C | "My manager haves two monitors." |
| D | "My manager having two monitors." |

**Key:** B

**Feedback:**
> The subject **my manager** is third person singular, so the verb is **`has`**. **A** uses *have* with a singular subject, **C** adds an ending the verb does not take, and **D** uses the *-ing* form without an auxiliary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Vocabulary, current lesson

```yaml
item_id: `voc_have_possession_001`
skill: `vocab.possession_nouns`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "I have notebook and two pens."
    br_pt_form: "Eu tenho caderno e duas canetas."
    note: "drops the article before a singular countable noun; Portuguese does not mark it in the same way"
  - option: "I have a notebook and two pen."
    br_pt_form: "Eu tenho um caderno e duas caneta."
    note: "leaves the noun singular after two; English marks the plural on the noun itself"
  - option: "I am a notebook and two pens."
    br_pt_form: "Eu sou um caderno e duas canetas."
    note: "uses to be for possession; have is the verb that says what somebody owns"
```

**Item:**
> You join a new team and describe what you keep in the shared office drawer. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | "I have notebook and two pens." |
| B | **"I have a notebook and two pens."** ✓ |
| C | "I have a notebook and two pen." |
| D | "I am a notebook and two pens." |

**Key:** B

**Feedback:**
> Possession uses **`have`**, and a singular countable noun needs an article: **`I have a notebook and two pens.`** **A** omits the article, **C** drops the plural, and **D** uses the wrong verb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_have_charger_note_001`
skill: `reading.have_has_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "The meeting room."
    br_pt_form: "A sala de reunião."
    note: "the interns already have the room until ten, so it is not what the writer lacks"
  - option: "The spare charger."
    br_pt_form: "O carregador reserva."
    note: "the writer has the charger in the bag already"
  - option: "The projector adapter."
    br_pt_form: "O adaptador do projetor."
    note: "Marco has the adapter, so it is not missing for the writer"
```

**Stimulus:**
> "Hi Ana. I have your spare charger in my bag. Marco has the adapter for the projector, and the interns have the meeting room until ten. We have a demo at eleven, and I don't have the slides yet. Do you have five minutes before the rehearsal?"

**Item:**
> What does the writer still need before the demo?

| Slot | Value |
|------|-------|
| A | "The meeting room." |
| B | "The spare charger." |
| C | **"The slides."** ✓ |
| D | "The projector adapter." |

**Key:** C

**Feedback:**
> The writer says **`I don't have the slides yet`**, so the slides are the missing item. The room, the charger and the adapter are all already with someone.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Grammar, prerequisite review

```yaml
item_id: `grm_psq_do_have_question_001`
skill: `grammar.do_does_auxiliary`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A1
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple_questions`
distractors:
  - option: "Does Marco has the staging credentials?"
    br_pt_form: "O Marco tem as credenciais de staging?"
    note: "after the auxiliary does the main verb stays in the base form (have)"
  - option: "Do Marco have the staging credentials?"
    br_pt_form: "Será que o Marco tem as credenciais de staging?"
    note: "the subject is third person singular, so the auxiliary is does, not do"
  - option: "Does Marco to have the staging credentials?"
    br_pt_form: "O Marco para ter as credenciais de staging?"
    note: "the base verb follows the auxiliary directly; the infinitive with to is not used here"
```

**Item:**
> In a distributed team you need the staging credentials from Marco. Choose the correct question.

| Slot | Value |
|------|-------|
| A | "Does Marco has the staging credentials?" |
| B | "Do Marco have the staging credentials?" |
| C | **"Does Marco have the staging credentials?"** ✓ |
| D | "Does Marco to have the staging credentials?" |

**Key:** C

**Feedback:**
> With a singular subject the auxiliary is **`does`** and the main verb stays in the base form: **`Does Marco have the staging credentials?`** **A** keeps the *-s* on the verb after the auxiliary, **B** uses the wrong auxiliary, and **D** adds an infinitive that this pattern does not take.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_have_got_status_001`
skill: `reading.have_got_status`
type: `detail_identification`
difficulty_b: 0.0
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "A blocker."
    br_pt_form: "Um blocker."
    note: "the writer opens the note by saying they have got a blocker"
  - option: "The staging credentials."
    br_pt_form: "As credenciais de staging."
    note: "Bruno has got the credentials, not the writer"
  - option: "Thirty minutes before the call."
    br_pt_form: "Trinta minutos antes da call."
    note: "the team has got that time already"
```

**Stimulus:**
> "Channel notes: I've got a blocker on the login page. Bruno has got the staging credentials, and we've got thirty minutes before the client call. I haven't got a new estimate yet."

**Item:**
> What does the writer not have yet?

| Slot | Value |
|------|-------|
| A | "A blocker." |
| B | "The staging credentials." |
| C | "Thirty minutes before the call." |
| D | **"A new estimate."** ✓ |

**Key:** D

**Feedback:**
> The note ends with **`I haven't got a new estimate yet`**, so the estimate is the only missing item. The blocker, the credentials and the thirty minutes are all stated as already available.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_psq_short_answer_have_001`
skill: `vocab.do_does_short_answers`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_present_simple_questions`
distractors:
  - option: "Yes, I have."
    br_pt_form: "Sim, eu tenho."
    note: "repeats the main verb; the question is built with the auxiliary do, so the short answer repeats do"
  - option: "Yes, I am."
    br_pt_form: "Sim, eu sou."
    note: "uses to be as the auxiliary; this question has no form of to be"
  - option: "Yes, you do."
    br_pt_form: "Sim, você faz."
    note: "switches to the second person; the answer keeps the first person of the question"
```

**Item:**
> A teammate asks: "Do you have the test report?" Answer naturally for yourself with a yes.

| Slot | Value |
|------|-------|
| A | "Yes, I have." |
| B | "Yes, I am." |
| C | "Yes, you do." |
| D | **"Yes, I do."** ✓ |

**Key:** D

**Feedback:**
> A question with **`Do you...?`** takes a short answer with **`do`**: **`Yes, I do.`** **A** repeats the main verb, **B** borrows the wrong auxiliary, and **C** changes the person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_have_contraction_001`
skill: `pronunciation.have_has_sibilant`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_have_contraction_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *have* /hæv/ starts with an aspirated /h/; in the contraction *I've* /aɪv/ the /h/ disappears and only the weak /v/ remains. *has* closes with /z/ and does not add a syllable.
**Step 2 — produce (ASR-scored):** read aloud:

> "I've got a new laptop, and she's got two monitors."

**Target phonemes:** /h/ in *have* · weak /v/ in *I've* · /z/ closing *has* · no extra vowel after *has*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `have_has_third_person` | Item 1 missed | **L2** | Drill the has / have split with he, she, it and with team names. |
| `do_does_have_questions` | Item 4 missed | **L2** | Rebuild *Does she have...?* against *Does she has...?* and *Do she have...?*. |
| `do_does_short_answers` | Item 6 missed | **L2** | Rebuild *Yes, I do* / *No, she doesn't* after *Do you...?* and *Does she...?*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.