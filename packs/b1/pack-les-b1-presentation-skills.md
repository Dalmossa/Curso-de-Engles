# Practice Pack — `les_b1_presentation_skills`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_presentation_skills_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_presentation_skills.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_presentation_skills_v1
lesson_id: les_b1_presentation_skills
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
item_id: grm_presentation_skills_signpost_001
skill: `grammar.presentation_signposting`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "I will to walk you through two things."
    br_pt_form: "Eu vou para conduzir vocês por duas coisas."
    note: "a modal verb takes the bare infinitive, not to"
  - option: "Let me walking you through two things."
    br_pt_form: "Deixe eu caminhando vocês por duas coisas."
    note: "let me is followed by the base form, not a gerund"
  - option: "I am walk you through two things."
    br_pt_form: "Eu estou conduzir vocês por duas coisas."
    note: "be requires a present participle, not a bare verb"
```

**Item:**
> You are opening a five-minute pitch. Which line is a grammatical signpost?

| Slot | Value |
|------|-------|
| A | "I will to walk you through two things." |
| B | **"Let me walk you through two things."** ✓ |
| C | "Let me walking you through two things." |
| D | "I am walk you through two things." |

**Key:** B

**Feedback:**
> **`Let me walk you through two things.`** is the natural signpost: *let me* + base verb. **A** inserts *to* after a modal, **C** uses a gerund after *let me*, and **D** pairs *be* with a bare verb instead of a participle.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_presentation_skills_takeaway_001
skill: `reading.pitch_takeaway`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "It increased p95 latency to 900 ms."
    br_pt_form: "Aumentou a latência p95 para 900 ms."
    note: "900 ms was the old latency before the change; the fix reduced it"
  - option: "It is still only a proposal in the deck."
    br_pt_form: "Ainda é só uma proposta no deck."
    note: "the speaker says the fix is already in staging"
  - option: "The speaker will not take questions."
    br_pt_form: "A apresentadora não vai responder perguntas."
    note: "the speaker explicitly leaves two minutes for questions"
```

**Stimulus:**
> "Good morning. I'm Marina, a backend engineer on payments. I'll keep this to five minutes. There are two things I want you to remember. First, our p95 latency was 900 ms. Second, after the cache change it is 420 ms. The takeaway: the fix is cheap and it is already in staging. I'll leave two minutes for questions."

**Item:**
> What does the speaker say about the fix?

| Slot | Value |
|------|-------|
| A | It increased p95 latency to 900 ms. |
| B | It is still only a proposal in the deck. |
| C | **It is already in staging and costs little.** ✓ |
| D | The speaker will not take questions. |

**Key:** C

**Feedback:**
> The takeaway line says **`The fix is cheap and it is already in staging.`** **A** reverses before and after, **B** turns a deployed fix into a proposal, and **D** contradicts the two minutes reserved for questions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_presentation_skills_hook_001
skill: `vocab.pitch_hook`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "Hello, my name is Marina and I work with payments."
    br_pt_form: "Olá, meu nome é Marina e eu trabalho com pagamentos."
    note: "identification is useful, but it gives the audience no reason to lean in"
  - option: "Please open the deck on slide three."
    br_pt_form: "Por favor, abram o deck no slide três."
    note: "a logistics instruction is not a hook"
  - option: "The takeaway is that latency dropped."
    br_pt_form: "O recado é que a latência caiu."
    note: "a takeaway closes the talk; a hook opens it"
```

**Item:**
> Which opening line is a hook — one sentence that makes the audience want the rest?

| Slot | Value |
|------|-------|
| A | **"In six months, our deploy time went from forty minutes to four."** ✓ |
| B | "Hello, my name is Marina and I work with payments." |
| C | "Please open the deck on slide three." |
| D | "The takeaway is that latency dropped." |

**Key:** A

**Feedback:**
> **`In six months, our deploy time went from forty minutes to four.`** is a hook: a concrete number and a contrast in one line. **B** only identifies the speaker, **C** is a housekeeping instruction, and **D** belongs at the end as the takeaway.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_presentation_skills_qa_001
skill: `reading.pitch_qa`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The 420 ms figure was measured only in production."
    br_pt_form: "Os 420 ms foram medidos só em produção."
    note: "the speaker says the measurement ran in staging and then in production"
  - option: "The mobile client gets the change in this release."
    br_pt_form: "O cliente mobile recebe a mudança nesta release."
    note: "the answer says the change is server-side only and not in this release for mobile"
  - option: "The speaker refuses to answer the first question."
    br_pt_form: "A apresentadora se recusa a responder a primeira pergunta."
    note: "she answers it with the measurement window and both environments"
```

**Stimulus:**
> "That's all I have. Let's pause for questions. — How did you measure the four seconds? — We measured p95 over seven days, in staging and then in production. — Will the change reach the mobile client? — Not in this release; it is server-side only. Thanks for your time."

**Item:**
> What can we conclude from the Q&A?

| Slot | Value |
|------|-------|
| A | The 420 ms figure was measured only in production. |
| B | The mobile client gets the change in this release. |
| C | The speaker refuses to answer the first question. |
| D | **The measurement covered staging and production, and the change is server-side only.** ✓ |

**Key:** D

**Feedback:**
> The two answers give both facts: **`in staging and then in production`** and **`it is server-side only`**. **A** drops staging, **B** reverses the mobile answer, and **C** mistakes a full answer for a refusal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_presentation_skills_pace_001
skill: `pronunciation.presentation_three_takeaway`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_presentation_skills_pace_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *three* begins with /θ/, the same sound as *think*, with the tongue tip between the teeth — not /t/ as in *tree*. *The* begins with the voiced pair /ð/. *Pacing* carries the long /eɪ/, while *pitch* carries the short /ɪ/ — do not make them rhyme.

**Step 2 — produce (ASR-scored):** read aloud:

> "Three takeaways, one at a time: the hook, the pitch, the pacing. Any questions?"

**Target phonemes:** /θ/ in *three* · /ð/ in *the* (three occurrences) · /eɪ/ in *pacing* · /ɪ/ in *pitch*, short and relaxed.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_presentation_skills_reported_001
skill: `grammar.reported_speech_tense`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_b1_reported_speech
distractors:
  - option: "He asked how did you measure the latency."
    br_pt_form: "Ele perguntou como você mediu a latência."
    note: "a reported question uses statement order, not do-support"
  - option: "He asked me how did I measured the latency."
    br_pt_form: "Ele me perguntou como eu medi a latência."
    note: "both the word order and the verb form are wrong after asked"
  - option: "He asked how I have measured the latency."
    br_pt_form: "Ele perguntou como eu tenho medido a latência."
    note: "a past reporting verb calls for the backshifted past perfect"
```

**Item:**
> Reviewing reported speech: the engineer asked, "How did you measure the latency?" Which line reports the question correctly?

| Slot | Value |
|------|-------|
| A | "He asked how did you measure the latency." |
| B | "He asked me how did I measured the latency." |
| C | **"He asked how I had measured the latency."** ✓ |
| D | "He asked how I have measured the latency." |

**Key:** C

**Feedback:**
> Reported questions drop the question order and backshift the tense: **`He asked how I had measured the latency.`** **A** keeps *did* in the embedded clause, **B** combines that error with a wrong participle, and **D** leaves the present perfect unshifted.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_presentation_skills_interrogatives_001
skill: `vocab.qa_interrogatives`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_b1_question_forms
distractors:
  - option: "What did you measured the latency with?"
    br_pt_form: "O que você mediu a latência com?"
    note: "do-support is present but the main verb must stay in the base form"
  - option: "How you measured the latency?"
    br_pt_form: "Como você mediu a latência?"
    note: "a wh-question needs do-support for a present or past simple verb"
  - option: "Which you measured the latency?"
    br_pt_form: "Qual você mediu a latência?"
    note: "which needs a noun to modify and the right question order"
```

**Item:**
> Reviewing question forms: which question is both grammatical and natural in a Q&A after a pitch?

| Slot | Value |
|------|-------|
| A | "What did you measured the latency with?" |
| B | "How you measured the latency?" |
| C | "Which you measured the latency?" |
| D | **"How did you measure the latency?"** ✓ |

**Key:** D

**Feedback:**
> **`How did you measure the latency?`** uses *how* + *did* + base verb. **A** leaves a past participle after *did*, **B** omits *did*, and **C** uses *which* without a noun and without question order.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `signpost_imperative` | Item 1 missed | **L2** | Contrast *let me walk / let me walking / I am walk* in short pitch openings with two announced parts and a pause after the signpost. |
| `pitch_takeaway_detail` | Items 2 and 4 missed | **L2** | Drill the takeaway line and the Q&A answers in a six-sentence pitch; separate *before/after* metrics and *in staging* from *proposal*. |
| `qa_question_review` | Items 3, 6 and 7 missed | **L2** | Recycle *hook / takeaway*, reported questions from `les_b1_reported_speech` and *wh-* + *do*-support from `les_b1_question_forms` / `les_b1_tenses_review` in one Q&A thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Item 6 reviews `les_b1_reported_speech` (tense_consistency) and item 7 reviews `les_b1_question_forms` (interrogative_pronouns, present_simple_do_does); both carry `prereq_lesson` for the interleaving rule. `les_b1_tenses_review` is the third prerequisite registered in the lesson JSON and is recycled in the L2 seed.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. `listening_items: 0` is deliberate: the lesson's listening input is `deferred_render` with no audio fixture, so no listening item is scored here. The ⚠️ marker is retained rather than hidden.
6. Every option, gloss and note was authored in a clean room. The grammar-rag query for presentation signposting and pacing returned no usable material, so no retrieved text was reproduced; all items derive from the lesson's own authored scenario.
