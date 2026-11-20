# Practice Pack — `les_b2_it_technical_leadership`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_it_technical_leadership_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_technical_leadership.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_technical_leadership_v1
lesson_id: les_b2_it_technical_leadership
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
item_id: grm_b2_it_tech_leadership_recommend_001
skill: `grammar.hedged_recommendation`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "I recommend us to keep the current queue."
    br_pt_form: "Eu recomendo nós mantermos a fila atual."
    note: "recommend does not take an object plus infinitive in this pattern"
  - option: "I recommend to keep the current queue."
    br_pt_form: "Eu recomendo manter a fila atual."
    note: "recommend needs an object or a gerund clause, not a bare infinitive"
  - option: "I am recommend keeping the current queue."
    br_pt_form: "Eu sou recomendar manter a fila atual."
    note: "wrong verb form after the subject; the base verb is recommend"
```

**Item:**
> You are closing an architecture review. Which line recommends a path without sounding like an order?

| Slot | Value |
|------|-------|
| A | "I recommend us to keep the current queue." |
| B | **"I recommend keeping the current queue."** ✓ |
| C | "I recommend to keep the current queue." |
| D | "I am recommend keeping the current queue." |

**Key:** B

**Feedback:**
> **`I recommend keeping the current queue.`** is the natural hedged recommendation. **A** adds an object before the infinitive, **C** uses a bare infinitive after *recommend*, and **D** breaks the verb form after the subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_b2_it_tech_leadership_board_detail_001
skill: `reading.review_board_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Isolation for the checkout path."
    br_pt_form: "Isolamento do caminho de checkout."
    note: "that is the gain named by Marina, not the cost of the change"
  - option: "A walkthrough of the outbox notes."
    br_pt_form: "Uma explicação das notas sobre o outbox."
    note: "a mentoring action for João, not something the team gives up"
  - option: "The steering group's one-line summary."
    br_pt_form: "O resumo de uma linha para o comitê."
    note: "a communication artifact Priya asks for, not a trade-off"
```

**Stimulus:**
> "Review notes — Proposal: split the checkout queue into a second service. Marina: we gain isolation, but we give up a simpler deployment. Rafael recommends keeping the current queue; the operational cost of a second service is still open. Priya needs one line for the steering group. Decision: keep the queue and revisit in two sprints. João will get a walkthrough of the outbox notes."

**Item:**
> What does the team give up if it splits the queue?

| Slot | Value |
|------|-------|
| A | Isolation for the checkout path. |
| B | **A simpler deployment.** ✓ |
| C | A walkthrough of the outbox notes. |
| D | The steering group's one-line summary. |

**Key:** B

**Feedback:**
> The notes say **`we gain isolation, but we give up a simpler deployment.`** **A** is the gain, **C** is a mentoring action, and **D** is the summary Priya needs — none of them is the cost.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_b2_it_tech_leadership_tradeoff_001
skill: `vocab.leadership.buy_in`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "a decision log"
    br_pt_form: "um registro de decisões"
    note: "records the rationale after a choice, not the agreement before it"
  - option: "an escalation path"
    br_pt_form: "um caminho de escalonamento"
    note: "says who decides when the team is stuck, not who supports the change"
  - option: "a feedback loop"
    br_pt_form: "um ciclo de feedback"
    note: "a repeating routine of return and adjustment, not pre-commitment support"
```

**Item:**
> "Before we change the queue, we need ____ from the product partner." Which word completes Marina's point about informed support?

| Slot | Value |
|------|-------|
| A | a decision log |
| B | an escalation path |
| C | **buy-in** ✓ |
| D | a feedback loop |

**Key:** C

**Feedback:**
> **`Buy-in`** is the informed agreement and support of the people affected by a decision. **A** records the result, **B** names the route for a higher decision, and **D** is an ongoing routine rather than pre-commitment support.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_b2_it_tech_leadership_decision_log_001
skill: `reading.decision_log_evidence`
type: `detail_identification`
difficulty_b: 0.2
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "In the escalation path."
    br_pt_form: "No caminho de escalonamento."
    note: "tells who to ask when stuck, not why an alternative was dropped"
  - option: "In the feedback loop with the junior engineer."
    br_pt_form: "No ciclo de feedback com a pessoa júnior."
    note: "a mentoring routine, not the record of discarded alternatives"
  - option: "In the steering group summary."
    br_pt_form: "No resumo para o comitê."
    note: "a one-line communication artifact with no alternatives listed"
```

**Stimulus:**
> "Decision log entry — Checkout queue: keep the single queue. Why: a second service adds operational cost during the delivery window. Alternatives: outbox (dropped last month), second service (deferred). Owner: Marina. Review date: two sprints. If the timeline slips, escalate to the architecture group."

**Item:**
> Where would a reviewer look to understand why the outbox was dropped?

| Slot | Value |
|------|-------|
| A | **In the decision log.** ✓ |
| B | In the escalation path. |
| C | In the feedback loop with the junior engineer. |
| D | In the steering group summary. |

**Key:** A

**Feedback:**
> The **`decision log`** is the place for the choice, the reason and the discarded alternatives. **B** routes a stuck decision, **C** is a mentoring routine, and **D** compresses the message for the steering group without the rationale.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_b2_it_tech_leadership_vowels_001
skill: `pronunciation.trade_off_vowels`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_b2_it_tech_leadership_vowels_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *trade-off* is /ˈtreɪd ɔːf/ — the first vowel is /eɪ/, not the short /e/ of pt-BR, and the second is the long /ɔː/ of *off*, not the weak /əv/ of *of*. Brazilian learners often say "tréd-of" or fuse the two words.

**Step 2 — produce (ASR-scored):** read aloud:

> "The trade-off is clear: we gain isolation, but we give up a simpler deployment. I've thought about it and recommend we review the architecture."

**Target phonemes:** /eɪ/ in *trade* and *gain* · /ɔː/ in *off* · /ɔɪ/ in *deployment* · /θ/ in *thought* · /tʃ/ in *architecture*, with a clean final /t/ in *it* and no epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_b2_it_tech_leadership_prereq_modal_001
skill: `grammar.modal_verbs_can_need`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "Can you to explain the trade-off, please?"
    br_pt_form: "Você pode para explicar o trade-off, por favor?"
    note: "a modal takes the bare verb; to after can is L1 transfer"
  - option: "You can explain the trade-off, please?"
    br_pt_form: "Você pode explicar o trade-off, por favor?"
    note: "statement order with 'please' is not the standard clarification question"
  - option: "Can you explaining the trade-off, please?"
    br_pt_form: "Você pode explicando o trade-off, por favor?"
    note: "a gerund cannot follow the modal can"
```

**Item:**
> Reviewing meeting language: which line correctly asks a colleague to clarify a point?

| Slot | Value |
|------|-------|
| A | "Can you to explain the trade-off, please?" |
| B | **"Can you explain the trade-off, please?"** ✓ |
| C | "You can explain the trade-off, please?" |
| D | "Can you explaining the trade-off, please?" |

**Key:** B

**Feedback:**
> A clarification question keeps interrogative order and a bare verb after the modal: **`Can you explain the trade-off, please?`** **A** inserts *to* after *can*, **C** drops the question order, and **D** uses a gerund where the base verb belongs.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_b2_it_tech_leadership_prereq_itterms_001
skill: `vocab.it_computer_terms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "deploy"
    br_pt_form: "implantar / publicar"
    note: "the act of releasing a version, not the place where work waits"
  - option: "cache"
    br_pt_form: "cache"
    note: "a fast copy for repeated reads, not a line of pending work"
  - option: "blocker"
    br_pt_form: "bloqueio"
    note: "the impediment itself, not the structure holding waiting items"
```

**Item:**
> Reviewing IT core terms: in the review notes, which word names the structure that holds work waiting to be processed?

| Slot | Value |
|------|-------|
| A | deploy |
| B | cache |
| C | **queue** ✓ |
| D | blocker |

**Key:** C

**Feedback:**
> A **`queue`** holds work that is waiting to be processed. **A** is a release action, **B** is a fast copy for reads, and **D** is an impediment that may stop the work altogether.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `tradeoff_gain_cost` | Items 1 and 3 missed | **L2** | Drill *I recommend + -ing*, *buy-in from someone* and one-line gain/cost statements in a short review closing. |
| `board_detail_scan` | Items 2 and 4 missed | **L2** | Skim and scan a six-line decision log for the rationale, the discarded alternatives and the owner; separate *gain* from *cost*. |
| `review_meeting_language` | Items 5, 6 and 7 missed | **L2** | Recycle *can you...?*, core IT terms and the /eɪ/–/ɔː/ contrast of *trade-off* in one mini architecture-review role play. |

---

## 4. VALIDATION NOTES

1. All `b` values are illustrative priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_meeting_open` (`meeting_vocab`, `modal_verbs_can_need`) and `les_a2_it_terms_basics` (`it_computer_terms`, `reading_skimming`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room. The *discuss* + direct-object rule came from a grammar-reference lookup, but all examples and sentences here are original.
6. Each `item_id` carries a domain prefix matching its skill namespace and the auditor-derived token `tech_leadership` (`technical` → `tech` in the lesson id).
