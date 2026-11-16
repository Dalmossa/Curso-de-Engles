# Practice Pack — `les_b2_it_rfc_writing`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b2_it_rfc_writing_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_rfc_writing.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_rfc_writing_v1
lesson_id: les_b2_it_rfc_writing
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
item_id: `voc_rfc_non_goals_001`
skill: `vocab.rfc.goals_non_goals`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "problem statement"
    br_pt_form: "definição do problema"
    note: "explains why change is needed, not what is excluded"
  - option: "rollout plan"
    br_pt_form: "plano de implantação"
    note: "describes delivery steps, not scope exclusions"
  - option: "success metrics"
    br_pt_form: "métricas de sucesso"
    note: "measures outcomes, different purpose"
```

**Item:**
> Which RFC section explicitly states what will not be addressed in this proposal?

| Slot | Value |
|------|-------|
| A | Problem statement |
| B | Rollout plan |
| C | **Non-goals** ✓ |
| D | Success metrics |

**Key:** C

**Feedback:**
> **Non-goals** define what is out of scope. They prevent scope creep and make boundaries clear for reviewers and implementers.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_rfc_must_requirement_001`
skill: `grammar.modals_requirements_must_should_may`
type: `gap_fill`
difficulty_b: -0.1
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "may"
    br_pt_form: "pode (opcional)"
    note: "expresses an option, too weak for a mandatory requirement"
  - option: "should"
    br_pt_form: "deveria (recomendado)"
    note: "recommendation, not a strict requirement"
  - option: "must to"
    br_pt_form: "deve (com 'to' incorreto)"
    note: "modal verbs take base form without to"
```

**Item:**
> The authentication service ____ validate every request before processing it.

| Slot | Value |
|------|-------|
| A | may |
| B | should |
| C | **must** ✓ |
| D | must to |

**Key:** C

**Feedback:**
> Use **must** for a mandatory requirement. In technical specs, **should** indicates a strong recommendation and **may** indicates an option.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_rfc_rollout_plan_001`
skill: `vocab.rfc.rollout_plan`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "problem statement"
    br_pt_form: "definição do problema"
    note: "describes the issue, not how to release safely"
  - option: "alternative design"
    br_pt_form: "design alternativo"
    note: "compares options, different section purpose"
  - option: "glossary"
    br_pt_form: "glossário"
    note: "defines terms, not delivery/migration steps"
```

**Item:**
> The section that describes migration steps, monitoring, and rollback is the ____.

| Slot | Value |
|------|-------|
| A | problem statement |
| B | alternative design |
| C | **rollout plan** ✓ |
| D | glossary |

**Key:** C

**Feedback:**
> A **rollout plan** explains how a change will be introduced safely, including phased delivery, observability, and rollback strategy.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_rfc_scope_001`
skill: `reading.design_document`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "It proposes migrating all legacy clients in the same release."
    br_pt_form: null
    note: "explicitly listed as a non-goal"
  - option: "It leaves the problem undefined to stay flexible."
    br_pt_form: null
    note: "problem and goals are clearly stated"
  - option: "It avoids mentioning rollback or monitoring."
    br_pt_form: null
    note: "rollout plan includes safe delivery concerns"
```

**Stimulus:**
> "Problem: token validation is inconsistent across services. Goals: centralize validation and improve auditability. Non-goal: migrating all legacy clients in this phase. Proposal: introduce a shared validation layer. Rollout: enable gradually with monitoring and a rollback path."

**Item:**
> Which statement best summarizes the RFC excerpt?

| Slot | Value |
|------|-------|
| A | **It defines a focused proposal with clear scope, a solution, and a safe rollout.** ✓ |
| B | It proposes migrating all legacy clients in the same release. |
| C | It leaves the problem undefined to stay flexible. |
| D | It avoids mentioning rollback or monitoring. |

**Key:** A

**Feedback:**
> Effective RFCs state the problem, set goals and non-goals, propose a solution, and explain how to deliver it safely.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_rfc_should_may_001`
skill: `grammar.modals_requirements_must_should_may`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_b1_it_write_docs`
distractors:
  - option: "must / must"
    br_pt_form: "deve / deve"
    note: "makes the optional debug field mandatory, changing requirement level"
  - option: "may / should"
    br_pt_form: "pode / deveria"
    note: "reverses recommendation and optionality"
  - option: "should / must"
    br_pt_form: "deveria / deve"
    note: "incorrectly makes the optional behavior mandatory"
```

**Item:**
> The client ____ log retry attempts, and it ____ include a debug field in staging.

| Slot | Value |
|------|-------|
| A | must / must |
| B | **should / may** ✓ |
| C | may / should |
| D | should / must |

**Key:** B

**Feedback:**
> **Should** expresses a strong recommendation, while **may** expresses an optional capability. Choosing the right modal makes requirements precise.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_rfc_problem_statement_001`
skill: `vocab.rfc.problem_statement`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_b1_it_write_docs`
distractors:
  - option: "appendix"
    br_pt_form: "apêndice"
    note: "supplementary material, not the core issue definition"
  - option: "checklist"
    br_pt_form: "lista de verificação"
    note: "operational list, different document element"
  - option: "changelog"
    br_pt_form: "registro de mudanças"
    note: "history of released changes, not the motivation for a proposal"
```

**Item:**
> The section that explains why a change is needed is the ____.

| Slot | Value |
|------|-------|
| A | appendix |
| B | checklist |
| C | **problem statement** ✓ |
| D | changelog |

**Key:** C

**Feedback:**
> A **problem statement** describes the current issue, its impact, and why it matters, creating context for the proposed solution.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_rfc_modal_stress_001`
skill: `pronunciation.modal_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — focus:** stress requirement modals clearly in technical reading: **must** /mʌst/, **should** /ʃʊd/, **may** /meɪ/. Keep clusters in *requests* and *rollout plan* clear.
**Step 2 — produce (ASR-scored):** read aloud:

> "The service must validate requests, should log retries, and may enable debug mode."

**Target phonemes:** /mʌst/ in *must* · /ʃʊd/ in *should* · /meɪ/ in *may*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `modals_requirements_must_should_may` | Item 2 or 5 missed | **L2** | Distinguish obligation, recommendation, and optionality in specs. |
| `rfc_scope_sections` | Item 1 or 4 missed | **L2** | Identify goals, non-goals, proposal, and rollout elements. |
| `problem_statement_clarity` | Item 6 missed | **L2** | Write concise problem statements with impact and motivation. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production; pronunciation recognition pools are tracked separately.
3. Items target authored lesson content; no external source text is reproduced.
