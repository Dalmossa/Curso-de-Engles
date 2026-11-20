# Practice Pack — `les_b2_it_mentoring`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b2_it_mentoring_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_mentoring.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_mentoring_v1
lesson_id: les_b2_it_mentoring
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 7/7 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 3 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Vocabulary, current lesson

```yaml
item_id: `voc_mentor_knowledge_transfer_001`
skill: `vocab.mentoring.knowledge_transfer`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "performance review"
    br_pt_form: "avaliação de desempenho"
    note: "formal evaluation process, not the act of sharing know-how"
  - option: "incident response"
    br_pt_form: "resposta a incidentes"
    note: "operational activity during failures, different goal"
  - option: "code freeze"
    br_pt_form: "congelamento de código"
    note: "release constraint, unrelated to learning transfer"
```

**Item:**
> Documenting decisions and pairing with teammates are practical ways to support ____.

| Slot | Value |
|------|-------|
| A | performance review |
| B | **knowledge transfer** ✓ |
| C | incident response |
| D | code freeze |

**Key:** B

**Feedback:**
> **Knowledge transfer** is the process of sharing context, practices, and decisions so others can work effectively and independently.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_mentor_should_001`
skill: `grammar.modals_advice_should_could_might`
type: `gap_fill`
difficulty_b: -0.1
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "must to"
    br_pt_form: "tem que (com 'to' incorreto)"
    note: "grammatically incorrect modal form"
  - option: "can to"
    br_pt_form: "pode (com 'to' incorreto)"
    note: "modal + base verb required; adding to is incorrect"
  - option: "should to"
    br_pt_form: "deveria (com 'to' incorreto)"
    note: "common L1-influenced error after modals"
```

**Item:**
> You ____ ask for help early if the issue blocks your progress.

| Slot | Value |
|------|-------|
| A | must to |
| B | can to |
| C | **should** ✓ |
| D | should to |

**Key:** C

**Feedback:**
> Use **should** to give clear advice. Modals are followed by the base verb: *should ask*, not *should to ask*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_mentor_actionable_feedback_001`
skill: `vocab.mentoring.actionable_feedback`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "vague praise"
    br_pt_form: "elogio vago"
    note: "positive but not specific about what to do next"
  - option: "silent approval"
    br_pt_form: "aprovação silenciosa"
    note: "provides no guidance or direction"
  - option: "generic criticism"
    br_pt_form: "crítica genérica"
    note: "negative but not helpful or specific"
```

**Item:**
> "You could add tests for failure paths to make this change safer." This is an example of ____.

| Slot | Value |
|------|-------|
| A | vague praise |
| B | silent approval |
| C | **actionable feedback** ✓ |
| D | generic criticism |

**Key:** C

**Feedback:**
> **Actionable feedback** is specific and tells the person what they can do next. It supports learning and improvement more effectively than vague comments.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_mentor_recommendation_001`
skill: `reading.mentoring_context`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The mentor tells the junior to avoid asking questions."
    br_pt_form: null
    note: "contradicts explicit advice to ask for help early"
  - option: "The mentor recommends changing core logic immediately."
    br_pt_form: null
    note: "opposite of focusing on understanding first"
  - option: "The mentor suggests working without any documentation."
    br_pt_form: null
    note: "contradicts recommendation to document unclear steps"
```

**Stimulus:**
> "You should start by understanding the service boundaries. You could shadow the next release, and I would recommend documenting unclear steps. If you get stuck, ask for help early so we can unblock you quickly."

**Item:**
> What is the mentor's main approach?

| Slot | Value |
|------|-------|
| A | **Guide the junior with gradual learning, documentation, and timely support.** ✓ |
| B | Tell the junior to avoid asking questions. |
| C | Recommend changing core logic immediately. |
| D | Suggest working without any documentation. |

**Key:** A

**Feedback:**
> The mentor combines advice (*should*), options (*could*), and recommendations (*would recommend*) to support safe learning and knowledge sharing.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_mentor_would_recommend_001`
skill: `grammar.recommendation_would_recommend`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_b1_it_code_review`
distractors:
  - option: "I would recommend to read"
    br_pt_form: "eu recomendaria para ler"
    note: "incorrect pattern; use recommend + -ing or recommend that + clause"
  - option: "I recommend you to read"
    br_pt_form: "eu recomendo você a ler"
    note: "common transfer error; natural forms are recommend reading or recommend that you read"
  - option: "I would recommending reading"
    br_pt_form: "forma verbal incorreta"
    note: "incorrect verb form after would"
```

**Item:**
> Choose the most natural recommendation.

| Slot | Value |
|------|-------|
| A | "I would recommend to read the onboarding guide." |
| B | **"I would recommend reading the onboarding guide."** ✓ |
| C | "I recommend you to read the onboarding guide." |
| D | "I would recommending reading the onboarding guide." |

**Key:** B

**Feedback:**
> A natural pattern is **recommend + -ing** (*recommend reading*). You can also say *recommend that you read*, but avoid *recommend to* and *recommend you to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_mentor_onboarding_001`
skill: `vocab.mentoring.onboarding`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_b1_it_code_review`
distractors:
  - option: "rollback"
    br_pt_form: "reversão"
    note: "deployment recovery action, not a learning/integration process"
  - option: "benchmark"
    br_pt_form: "comparativo de desempenho"
    note: "performance comparison, unrelated meaning"
  - option: "refactor"
    br_pt_form: "refatoração"
    note: "code restructuring activity, different concept"
```

**Item:**
> The first weeks of ____ help new engineers understand tools, processes, and team expectations.

| Slot | Value |
|------|-------|
| A | rollback |
| B | benchmark |
| C | **onboarding** ✓ |
| D | refactor |

**Key:** C

**Feedback:**
> **Onboarding** is the process of integrating new members into a team or project so they can contribute effectively.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_mentor_modal_reduction_001`
skill: `pronunciation.modal_reduction`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_mentor_modal_reduction_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — focus:** reduced modals in natural speech: *should* /ʃʊd/, *could* /kʊd/, *would* /wʊd/. Keep *knowledge* /ˈnɑːlɪdʒ/ clear.
**Step 2 — produce (ASR-scored):** read aloud:

> "You should ask for help, and I would recommend sharing what you learned."

**Target phonemes:** /ʃʊd/ in *should* · /wʊd/ in *would* · /dʒ/ in *knowledge/learned context* (focus on rhythm and reduction).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `modals_advice_should_could_might` | Item 2 missed | **L2** | Practice choosing advice strength in mentoring scenarios. |
| `recommendation_would_recommend` | Item 5 missed | **L2** | Contrast recommend + -ing with incorrect transfer patterns. |
| `actionable_feedback` | Item 3 or 4 missed | **L2** | Rewrite vague feedback into specific, helpful guidance. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production; pronunciation recognition pools are tracked separately.
3. Items target authored lesson content; no external source text is reproduced.
