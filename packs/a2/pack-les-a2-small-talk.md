# Practice Pack — `les_a2_small_talk`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_small_talk_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_small_talk.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US); no external source text is reproduced or adapted.
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_small_talk_v1
lesson_id: les_a2_small_talk
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 7 current / 0 prereq
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
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 1 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred render |
| Reading | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

Difficulty `b` is provisional on the IRT logit scale (§ stats spec §3.2). These values are authoring priors, not calibrated parameters. Coherence is a skill namespace, not a sixth domain: item 5 is declared with `domain: grammar`.

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_small_talk_did_short_answer_001
skill: `grammar.short_answers_did`
type: `short_answer_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Yes, I had."
    br_pt_form: "Sim, eu tive."
    note: "the question already uses did; the short answer repeats the auxiliary did, not the past form of have"
  - option: "Yes, I have."
    br_pt_form: "Sim, eu tenho."
    note: "have answers a present perfect question such as Have you had coffee yet, not a did question"
  - option: "Yes, I was."
    br_pt_form: "Sim, eu era."
    note: "borrows the auxiliary be, which does not appear in the question Did you have a quiet weekend"
```

**Item:**
> At the coffee machine, Bia asks: "Did you have a quiet weekend?" Choose your natural short answer.

| Slot | Value |
|------|-------|
| A | "Yes, I had." |
| B | **"Yes, I did."** ✓ |
| C | "Yes, I have." |
| D | "Yes, I was." |

**Key:** B

**Feedback:**
> A question built with **did** takes the short answer **"Yes, I did."** **A** repeats the main verb in the past instead of the auxiliary, **C** switches to the auxiliary of a present perfect question, and **D** borrows *be*, which is absent from the question.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: grm_small_talk_have_short_answer_001
skill: `grammar.short_answers_have`
type: `short_answer_selection`
difficulty_b: -0.2
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Yes, I did."
    br_pt_form: "Sim, eu fiz."
    note: "repeats did, which belongs to a simple past question, not to Have you had coffee yet"
  - option: "Yes, I had."
    br_pt_form: "Sim, eu tinha."
    note: "uses the past form of have; the question asks about experience up to now"
  - option: "Yes, I do."
    br_pt_form: "Sim, eu faço."
    note: "repeats the auxiliary of a present simple question such as Do you drink coffee"
```

**Item:**
> Rafael asks: "Have you had coffee yet?" Choose the short answer that keeps the same auxiliary.

| Slot | Value |
|------|-------|
| A | "Yes, I did." |
| B | **"Yes, I have."** ✓ |
| C | "Yes, I had." |
| D | "Yes, I do." |

**Key:** B

**Feedback:**
> **Have you had coffee yet?** takes **"Yes, I have."** **A** carries the past auxiliary *did*, **C** moves the experience into the past, and **D** echoes *do* from an unrelated present simple pattern.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_small_talk_weekend_question_001
skill: `vocab.small_talk_question_types`
type: `contextual_selection`
difficulty_b: -0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "How was your weekend?"
    br_pt_form: "Como foi seu fim de semana?"
    note: "asks for an evaluation of the weekend, not for the activities the person did"
  - option: "Where is your weekend?"
    br_pt_form: "Onde está o seu fim de semana?"
    note: "not a natural English question; the time expression does not take this wh pattern"
  - option: "Did you had a weekend?"
    br_pt_form: "Você teve um fim de semana?"
    note: "after the auxiliary did the main verb stays in the base form have"
```

**Item:**
> You want to know which **activities** your teammate did last Saturday. Which question fits?

| Slot | Value |
|------|-------|
| A | "How was your weekend?" |
| B | **"What did you do last weekend?"** ✓ |
| C | "Where is your weekend?" |
| D | "Did you had a weekend?" |

**Key:** B

**Feedback:**
> **What did you do last weekend?** asks about activities and invites a past-tense answer. **A** asks for an evaluation, **C** is not idiomatic English, and **D** leaves the past marker on the main verb after *did*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_small_talk_coffee_dialogue_001
skill: `reading.small_talk_dialogue_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "He visited his sister."
    br_pt_form: "Ele visitou a irmã dele."
    note: "that is what Bia did, not Rafael"
  - option: "He sent the test report on Sunday."
    br_pt_form: "Ele enviou o relatório de testes no domingo."
    note: "he sent the report at eight before the stand-up, not during the weekend"
  - option: "He had coffee with Bia."
    br_pt_form: "Ele tomou café com a Bia."
    note: "he says he had coffee at home before reaching the machine"
```

**Stimulus:**
> "How was your weekend?" "Pretty good, thanks. What did you do last weekend?" "I visited my sister. Did you have a quiet one?" "Yes, I did. I stayed in and fixed a bug in my side project." "Have you had coffee yet?" "Yes, I have — I had one at home." "Anyway, the stand-up starts in five minutes. Did you send the test report?" "I did. I sent it at eight."

**Item:**
> What did Rafael do during his weekend?

| Slot | Value |
|------|-------|
| A | "He visited his sister." |
| B | **"He stayed in and fixed a bug in his side project."** ✓ |
| C | "He sent the test report on Sunday." |
| D | "He had coffee with Bia." |

**Key:** B

**Feedback:**
> Rafael says **"I stayed in and fixed a bug in my side project."** **A** describes Bia's weekend, **C** moves the report from eight in the morning to Sunday, and **D** ignores his statement that he had coffee at home.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, current lesson (coherence namespace)

```yaml
item_id: coh_small_talk_anyway_marker_001
skill: `coherence.discourse_marker_anyway`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Actually"
    br_pt_form: "Na verdade"
    note: "adjusts or corrects the previous statement; it does not close the topic"
  - option: "Currently"
    br_pt_form: "Atualmente"
    note: "a time adverb, not a turn-taking marker for closing small talk"
  - option: "By the way"
    br_pt_form: "Aliás"
    note: "opens an extra topic instead of closing the current one"
```

**Item:**
> Bia says: "The coffee is great. ______, the stand-up starts in five minutes." Which marker closes the small-talk topic and returns to work?

| Slot | Value |
|------|-------|
| A | "Actually" |
| B | "Currently" |
| C | **"Anyway"** ✓ |
| D | "By the way" |

**Key:** C

**Feedback:**
> **Anyway** closes the current topic and moves the conversation on. **A** would correct the previous statement, **B** is a time adverb that means "atualmente", and **D** introduces a new topic rather than returning to the agenda.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Pronunciation, current lesson

```yaml
item_id: prn_small_talk_did_reduction_001
skill: `pronunciation.short_answer_reduction`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *Yes, I did* keeps **did** short and weak, with a clipped final /d/; the false rhythm "Yes, I did-i" adds a vowel that English does not have. In *Yes, I have*, the /h/ of *have* stays audible; only in *I've* does the /h/ disappear into a weak /v/.

**Step 2 — produce (ASR-scored):** read aloud:

> "Yes, I did. I stayed in and fixed a bug. Have you had coffee yet? Yes, I have."

**Target phonemes:** clipped /d/ in *did* · /h/ in *have* · /t/ closing *fixed* with no extra syllable · /j/ glide in *yet*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 7 — Reading, current lesson

```yaml
item_id: rdg_small_talk_actually_marker_001
skill: `reading.discourse_marker_actually`
type: `function_identification`
difficulty_b: 0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "It closes the conversation."
    br_pt_form: "Ele encerra a conversa."
    note: "closing is the job of Anyway, not of Actually"
  - option: "It means the same as currently."
    br_pt_form: "Ele significa o mesmo que atualmente."
    note: "actually means 'na verdade'; currently is the false-cognate repair for 'atualmente'"
  - option: "It introduces an unrelated topic."
    br_pt_form: "Ele introduz um assunto sem relação."
    note: "that is the work of By the way, not of a correction marker"
```

**Stimulus:**
> "I thought the deploy was tomorrow. Actually, it went out this morning."

**Item:**
> What does **Actually** signal in the second sentence?

| Slot | Value |
|------|-------|
| A | **"It adjusts or corrects the previous statement."** ✓ |
| B | "It closes the conversation." |
| C | "It means the same as currently." |
| D | "It introduces an unrelated topic." |

**Key:** A

**Feedback:**
> **Actually** was used to correct "tomorrow" with "this morning" — **"It adjusts or corrects the previous statement."** **B** describes *Anyway*, **C** is the false-cognate trap, and **D** describes *By the way*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `did_vs_have_short_answer` | Item 1 or 2 missed | **L2** | Rebuild the auxiliary echo: *Did you…? → Yes, I did* and *Have you…? → Yes, I have*. |
| `how_was_vs_what_did` | Item 3 missed | **L2** | Contrast an evaluation answer with an activity answer before returning to the dialogue. |
| `anyway_vs_actually` | Item 5 or 7 missed | **L2** | Drill the turn-taking split: *Actually* adjusts, *Anyway* closes. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 6 is ASR-scored production and stays blocked on render; it does not substitute for listening-pool calibration.
3. No external source text is reproduced. Every stimulus, option and distractor was authored for this pack.
