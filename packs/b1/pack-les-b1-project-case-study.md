# Practice Pack — `les_b1_project_case_study`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_project_case_study_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_project_case_study.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_case_study_v1
lesson_id: les_b1_project_case_study
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
item_id: grm_project_case_study_metric_from_to_001
skill: `grammar.case_study_metric_from_to`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Confirmation dropped 38 seconds to 6 seconds."
    br_pt_form: "A confirmação caiu 38 segundos para 6 segundos."
    note: "the from-to frame is required to mark the starting value"
  - option: "Confirmation dropped of 38 seconds to 6 seconds."
    br_pt_form: "A confirmação caiu de 38 segundos para 6 segundos."
    note: "the Portuguese preposition de does not follow drop in this pattern"
  - option: "Confirmation dropped until 38 seconds to 6 seconds."
    br_pt_form: "A confirmação caiu até 38 segundos para 6 segundos."
    note: "until names an endpoint in time, not the first value of a comparison"
```

**Item:**
> The case study says confirmation was 38 seconds before the change and 6 seconds after it. Which line reports the metric correctly?

| Slot | Value |
|------|-------|
| A | "Confirmation dropped 38 seconds to 6 seconds." |
| B | **"Confirmation dropped from 38 seconds to 6 seconds."** ✓ |
| C | "Confirmation dropped of 38 seconds to 6 seconds." |
| D | "Confirmation dropped until 38 seconds to 6 seconds." |

**Key:** B

**Feedback:**
> **`Confirmation dropped from 38 seconds to 6 seconds.`** uses *from X to Y* for a before/after pair. **A** omits *from*, **C** carries the Portuguese preposition into English, and **D** uses *until* for a point in time instead of a starting value.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_project_case_study_outcome_detail_001
skill: `reading.case_study_outcome_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The fraud check ran inside the request path."
    br_pt_form: "A checagem de fraude rodava dentro do request."
    note: "this is the challenge, stated before the intervention"
  - option: "The team queued the check and returned a pending state."
    br_pt_form: "A equipe enfileirou a checagem e retornou um estado pendente."
    note: "this is the intervention, not the measured effect"
  - option: "The team recommends a timeout budget for the check."
    br_pt_form: "A equipe recomenda um orçamento de tempo limite para a checagem."
    note: "this belongs to the recommendation section, after the outcome"
```

**Stimulus:**
> "Context: at Aurora Pay, checkout confirmation was thirty-eight seconds at p95 in March. Challenge: the fraud check ran inside the request path. Intervention: we queued the check and returned a pending state with an idempotency key. Outcome: p95 confirmation fell to six seconds, and stuck-payment tickets dropped by a third. Recommendation: keep the check asynchronous and add a timeout budget. Takeaway: measure the customer wait."

**Item:**
> What does the **outcome** section report?

| Slot | Value |
|------|-------|
| A | The fraud check ran inside the request path. |
| B | The team queued the check and returned a pending state. |
| C | **p95 confirmation fell to six seconds, and stuck-payment tickets dropped by a third.** ✓ |
| D | The team recommends a timeout budget for the check. |

**Key:** C

**Feedback:**
> The outcome line gives the measured effect: **`p95 confirmation fell to six seconds... tickets dropped by a third.`** **A** restates the challenge, **B** restates the intervention, and **D** belongs to the recommendation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_project_case_study_intervention_001
skill: `vocab.case_study_intervention`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "outcome"
    br_pt_form: "desfecho"
    note: "the outcome is what happened after the change, not the change itself"
  - option: "metric"
    br_pt_form: "métrica"
    note: "a metric is the number used to observe the effect"
  - option: "challenge"
    br_pt_form: "desafio"
    note: "the challenge is the problem before any action is taken"
```

**Item:**
> The team moved the fraud check to a queue and returned a pending state. Which label names that part of a case study?

| Slot | Value |
|------|-------|
| A | outcome |
| B | metric |
| C | challenge |
| D | **intervention** ✓ |

**Key:** D

**Feedback:**
> **`Intervention`** is the action taken between challenge and outcome. **A** names the effect, **B** names the measuring instrument, and **C** names the problem that motivated the action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_project_case_study_recommendation_001
skill: `reading.case_study_recommendation`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Add a timeout budget to the fraud check."
    br_pt_form: "Adicionar um orçamento de tempo limite à checagem de fraude."
    note: "this is the recommendation, an action to take next"
  - option: "The fraud check was synchronous."
    br_pt_form: "A checagem de fraude era síncrona."
    note: "this describes the original challenge, not the closing lesson"
  - option: "p95 confirmation fell to six seconds."
    br_pt_form: "A confirmação no p95 caiu para seis segundos."
    note: "this is the outcome metric, not the takeaway"
```

**Stimulus:**
> "Recommendation: keep the fraud check asynchronous and add a timeout budget. Takeaway: measure the customer wait, not only the service latency."

**Item:**
> Which line states the **takeaway** of the case study?

| Slot | Value |
|------|-------|
| A | Add a timeout budget to the fraud check. |
| B | **Measure the customer wait, not only the service latency.** ✓ |
| C | The fraud check was synchronous. |
| D | p95 confirmation fell to six seconds. |

**Key:** B

**Feedback:**
> The takeaway is the general lesson: **`Measure the customer wait, not only the service latency.`** **A** is the recommendation for the next step, **C** is the challenge, and **D** is the outcome metric.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_project_case_study_dental_glides_001
skill: `pronunciation.case_study_dental_fricatives`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *path* and *thirty-eight* open with /θ/, the voiceless dental fricative — tongue tip between the teeth, not /t/ as in *tirty* and not /s/ as in *sirty*. *The* uses the voiced pair /ð/. *Key* carries the long /iː/, while *takeaway* carries /eɪ/ in both syllables that spell *a* and /ə/ in the middle. Final /k/ in *check* has no added vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "The check was on the path: thirty-eight seconds at p95. The key outcome was six seconds, and the takeaway is to measure the wait."

**Target phonemes:** /θ/ in *path, thirty-eight* · /ð/ in *The* (twice) · /iː/ in *key* · /eɪ/ and /ə/ in *takeaway* · /k/ final in *check*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_project_case_study_email_recommendation_001
skill: `grammar.formal_email_recommendation`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b2_professional_email_advanced`
distractors:
  - option: "I recommend that the check is asynchronous."
    br_pt_form: "Eu recomendo que a checagem é assíncrona."
    note: "recommend that takes the mandative base form, not a finite present"
  - option: "I recommend to move the check to a queue."
    br_pt_form: "Eu recomendo mover a checagem para uma fila."
    note: "recommend does not take an infinitive complement in this construction"
  - option: "I recommend that the check be move to a queue."
    br_pt_form: "Eu recomendo que a checagem seja mover para uma fila."
    note: "the passive needs the past participle after the base form be"
```

**Item:**
> Reviewing formal correspondence: which line states a recommendation in an update to stakeholders?

| Slot | Value |
|------|-------|
| A | "I recommend that the check is asynchronous." |
| B | "I recommend to move the check to a queue." |
| C | "I recommend that the check be move to a queue." |
| D | **"I recommend that the check be moved to a queue."** ✓ |

**Key:** D

**Feedback:**
> The mandative pattern is **`I recommend that the check be moved to a queue.`** **A** uses *is* where the base form is required, **B** puts an infinitive after *recommend*, and **C** leaves the participle in the base form after *be*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_project_case_study_summary_gist_001
skill: `vocab.summary_gist`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_b2_professional_summary`
distractors:
  - option: "The appendix has seven charts and forty ticket comments."
    br_pt_form: "O apêndice tem sete gráficos e quarenta comentários de ticket."
    note: "supporting details belong in the appendix, not in the gist"
  - option: "According to the payments team, tickets fell by a third."
    br_pt_form: "Segundo a equipe de pagamentos, os tickets caíram um terço."
    note: "a true attributed detail, but still a detail rather than the main point"
  - option: "I think the deck is excellent."
    br_pt_form: "Eu acho que o deck é excelente."
    note: "a summary carries no personal opinion"
```

**Item:**
> Reviewing summarizing: which line gives the **gist** of the case study in one sentence?

| Slot | Value |
|------|-------|
| A | The appendix has seven charts and forty ticket comments. |
| B | According to the payments team, tickets fell by a third. |
| C | **Moving the fraud check off the request path cut the customer wait.** ✓ |
| D | I think the deck is excellent. |

**Key:** C

**Feedback:**
> **`Moving the fraud check off the request path cut the customer wait.`** is the gist: cause and effect in one line. **A** lists appendix material, **B** gives an attributed supporting detail, and **D** adds an opinion the case study never makes.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `metric_from_to_repair` | Item 1 missed | **L2** | Contrast *dropped 38 to 6 / dropped of 38 to 6 / dropped from 38 to 6* in before-after lines with a named metric. |
| `case_study_section_map` | Items 2 and 4 missed | **L2** | Re-label a six-line case study into *context / challenge / intervention / outcome / recommendation / takeaway*, separating measured effect from next action. |
| `recommendation_register_review` | Items 3, 6 and 7 missed | **L2** | Recycle *intervention*, the mandative *recommend that ... be ...* from `les_b2_professional_email_advanced`, and *gist* from `les_b2_professional_summary` in one stakeholder update. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Item 6 reviews `les_b2_professional_email_advanced` (`writing_formal_email`) and item 7 reviews `les_b2_professional_summary` (`writing_summary`); both carry `prereq_lesson` for the interleaving rule. The remaining registered prerequisites (`les_a2_it_typescript_basics`, `les_a2_it_algorithms_basics`, `les_a2_it_terms_basics`) supply the `reading_skimming` / `reading_scanning` substrate exercised by Items 2 and 4.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. `listening_items: 0` is deliberate: the lesson's listening input is `deferred_render` with no audio fixture, so no listening item is scored here. The ⚠️ marker is retained rather than hidden.
6. Grammar-rag query `case study presentation structure problem solution recommendation` (`--top-k 2`) returned [1] a subjunctive chunk (*suggest that*, *it is essential that*) and [2] a chunk on perfect-participle clauses (*Having seen the film twice...*). Result [1] was used honestly to ground the mandative recommendation in the lesson's Exercise 3/FASE 3 and Item 6; result [2] was not used, since that written-register structure does not fit a four-minute case-study pack.
7. Every option, gloss and note was authored in a clean room. The Aurora Pay case study is fictional and no restricted or third-party text is reproduced; all `item_id` values use the namespace prefix required by `assessment-item-spec.md` §1.2 (`grm_`/`rdg_`/`voc_`/`prn_`) plus the `project_case_study` token, and were checked for global uniqueness.
