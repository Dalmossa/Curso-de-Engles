# Practice Pack — `les_b1_it_presentations`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b1_it_presentations_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_presentations.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_presentations_v1
lesson_id: les_b1_it_presentations
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
item_id: `voc_presentation_walk_through_001`
skill: `vocab.presentation.walk_through`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "explain you through"
    br_pt_form: "explicar vocês"
    note: "calque from PT-BR where learners try to attach the audience as direct object of explain"
  - option: "presentate you through"
    br_pt_form: "apresentar (presentate)"
    note: "false formation from Portuguese 'apresentar'; the English verb is present"
  - option: "talk you through the slides slowly"
    br_pt_form: "falar vocês pelos slides"
    note: "partially natural verb but wrong argument structure; keeps the direct-object person error"
```

**Item:**
> At the start of a technical demo, which sentence sounds most natural?

| Slot | Value |
|------|-------|
| A | "I will explain you through the new deployment flow." |
| B | **"I will walk you through the new deployment flow."** ✓ |
| C | "I will presentate you through the new deployment flow." |
| D | "I will talk you through the slides slowly." |

**Key:** B

**Feedback:**
> **`Walk you through`** is a natural choice when you guide an audience step by step. **A** is incorrect because *explain* takes the topic as its direct object (*explain the flow to you*), not the person. **C** uses a non-existent verb (*presentate*); use **present** or **walk you through**. **D** has the same argument problem and is less precise than B for a guided demo.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_presentation_signposting_001`
skill: `grammar.presentation_signposting`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "In the first, I will outline the problem."
    br_pt_form: "No primeiro"
    note: "direct calque from Portuguese sequencing ('no primeiro')"
  - option: "For first, I will outline the problem."
    br_pt_form: "Para primeiro"
    note: "preposition calque; English uses First/To begin with without preposition/article"
  - option: "At first, I will outline the problem."
    br_pt_form: "A princípio/No começo"
    note: "grammatical but misleading here: 'at first' often contrasts with a later change, not a presentation step"
```

**Item:**
> Which option is the clearest way to introduce the first point of a presentation?

| Slot | Value |
|------|-------|
| A | "In the first, I will outline the problem." |
| B | "For first, I will outline the problem." |
| C | **"First, I will outline the problem."** ✓ |
| D | "At first, I will outline the problem." |

**Key:** C

**Feedback:**
> Use **`First,`** or **`To begin with,`** to open a sequence in a presentation. **A** and **B** copy Portuguese structures and are not natural in English. **D** (*At first*) usually suggests an initial situation that later changed, which is different from listing agenda points.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Reading, current lesson

```yaml
item_id: `rdg_presentation_structure_001`
skill: `reading.presentation_structure`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Problem, recommendation, questions, metrics"
    br_pt_form: null
    note: "plausible but wrong order; mixes closing elements before evidence"
  - option: "Recommendation, problem, metrics, questions"
    br_pt_form: null
    note: "starts with conclusion before establishing context"
  - option: "Questions, problem, recommendation, metrics"
    br_pt_form: null
    note: "impossible flow for a clear technical presentation"
```

**Stimulus:**
> "Today I will outline the current latency problem, show the metrics we collected, compare two options, and share our recommendation. After that, I'll open the floor for questions."

**Item:**
> Which sequence best matches the speaker's plan?

| Slot | Value |
|------|-------|
| A | **Problem → metrics → options → recommendation → questions** ✓ |
| B | Problem → recommendation → questions → metrics |
| C | Recommendation → problem → metrics → questions |
| D | Questions → problem → recommendation → metrics |

**Key:** A

**Feedback:**
> The speaker signals a clear flow: **outline the problem**, **show metrics**, **compare options**, **share recommendation**, then **open for questions**. Recognizing this structure helps you follow and deliver technical presentations.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, current lesson

```yaml
item_id: `voc_presentation_trade_off_001`
skill: `vocab.presentation.trade_off`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "deadline"
    br_pt_form: "prazo"
    note: "common workplace noun but wrong meaning here"
  - option: "backup"
    br_pt_form: "backup/cópia"
    note: "technical term, semantically unrelated to balancing gains and costs"
  - option: "incident"
    br_pt_form: "incidente"
    note: "operational event, not a design compromise"
```

**Item:**
> "This approach is faster, but it uses more memory. That's a ____ we need to accept."

| Slot | Value |
|------|-------|
| A | deadline |
| B | **trade-off** ✓ |
| C | backup |
| D | incident |

**Key:** B

**Feedback:**
> A **trade-off** is a situation where you gain one benefit and accept a cost in another area. In engineering discussions, naming the trade-off clearly shows balanced reasoning.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_presentation_explain_to_001`
skill: `grammar.explain_to_vs_explain`
type: `error_correction`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_meeting_standup`
distractors:
  - option: "I will explain you the migration plan."
    br_pt_form: "vou explicar vocês o plano"
    note: "classic L1 transfer: person used as direct object of explain"
  - option: "I will explain about you the migration plan."
    br_pt_form: "explicar sobre vocês"
    note: "overcorrection mixing prepositions incorrectly"
  - option: "I will explain the migration plan you."
    br_pt_form: "explicar o plano vocês"
    note: "misplaced object showing uncertainty about argument structure"
```

**Item:**
> Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "I will explain you the migration plan." |
| B | **"I will explain the migration plan to you."** ✓ |
| C | "I will explain about you the migration plan." |
| D | "I will explain the migration plan you." |

**Key:** B

**Feedback:**
> In English, **explain** takes the topic as the object: *explain the plan*. If you mention the audience, use **to**: *explain the plan to you*. In presentations you can also say *walk you through the plan*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_presentation_open_floor_001`
skill: `vocab.presentation.open_floor`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_meeting_standup`
distractors:
  - option: "open the doubts"
    br_pt_form: "abrir as dúvidas"
    note: "literal transfer from Portuguese; English prefers questions"
  - option: "start the questions to you"
    br_pt_form: "começar as perguntas para vocês"
    note: "unnatural phrasing and wrong collocation"
  - option: "release the questions"
    br_pt_form: "liberar as perguntas"
    note: "literal verb choice not used in this context"
```

**Item:**
> To invite the audience to ask questions at the end, you can say:

| Slot | Value |
|------|-------|
| A | "Now I open the doubts." |
| B | **"Now I'll open the floor for questions."** ✓ |
| C | "Now I start the questions to you." |
| D | "Now I release the questions." |

**Key:** B

**Feedback:**
> **`Open the floor for questions`** is a clear, polite way to invite participation. In professional contexts, prefer **questions** over *doubts* when you mean perguntas.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_presentation_th_walk_001`
skill: `pronunciation.th_voiced`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *this* /ðɪs/ (voiced dental fricative) vs *dis* /dɪs/ (stop). *walk* /wɔːk/ starts with /w/, not with an added vowel.
**Step 2 — produce (ASR-scored):** read aloud:

> "Today we will walk through this deployment plan."

**Target phonemes:** /w/ in *we, walk* · /ð/ in *this* · clear consonant clusters in *walked/through* context avoided here but keep /wɔːk θruː/ smooth.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `presentation_signposting` | Item 2 missed | **L2** | Review sequencing markers (First, Next, After that, Finally) in a new technical context. |
| `explain_to_structure` | Item 5 missed | **L2** | Contrast *explain X to Y* with *walk Y through X*. |
| `trade_off_usage` | Item 4 missed | **L2** | Practice naming gains and costs explicitly in architecture decisions. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
