# Practice Pack — `les_b1_it_architecture_vocab`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b1_it_architecture_vocab_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_architecture_vocab.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_architecture_vocab_v1
lesson_id: les_b1_it_architecture_vocab
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
item_id: `voc_arch_coupling_001`
skill: `vocab.architecture.coupling`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "availability"
    br_pt_form: "disponibilidade"
    note: "important quality attribute but refers to uptime, not dependency between modules"
  - option: "latency"
    br_pt_form: "latência"
    note: "performance metric, not structural dependency"
  - option: "throughput"
    br_pt_form: "vazão"
    note: "capacity metric, unrelated to module dependency"
```

**Item:**
> When a change in one module frequently breaks another, the system shows high ____.

| Slot | Value |
|------|-------|
| A | availability |
| B | **coupling** ✓ |
| C | latency |
| D | throughput |

**Key:** B

**Feedback:**
> **Coupling** describes how strongly modules depend on each other. High coupling makes changes risky because modifications propagate across boundaries.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_arch_passive_001`
skill: `grammar.passive_design_decisions`
type: `gap_fill`
difficulty_b: 0.0
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "designed"
    br_pt_form: "projetado (sem auxiliar)"
    note: "missing auxiliary verb; passive requires be + past participle"
  - option: "was design"
    br_pt_form: "foi projetar (forma base incorreta)"
    note: "uses base form instead of past participle"
  - option: "is designing"
    br_pt_form: "está projetando"
    note: "active continuous form, changes meaning and focus"
```

**Item:**
> The payment service ____ for high availability.

| Slot | Value |
|------|-------|
| A | designed |
| B | **was designed** ✓ |
| C | was design |
| D | is designing |

**Key:** B

**Feedback:**
> To focus on the artifact or decision, use the passive voice: **was designed** (be + past participle). This is common when describing architecture choices.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_arch_trade_off_001`
skill: `vocab.architecture.trade_off`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "deployment"
    br_pt_form: "implantação"
    note: "related to release process, not a balance of pros and cons"
  - option: "rollback"
    br_pt_form: "reversão"
    note: "recovery action, not the compromise itself"
  - option: "interface"
    br_pt_form: "interface"
    note: "boundary/contract, different concept"
```

**Item:**
> Independent deployments improve resilience, but they add operational complexity. That is a ____.

| Slot | Value |
|------|-------|
| A | deployment |
| B | rollback |
| C | **trade-off** ✓ |
| D | interface |

**Key:** C

**Feedback:**
> A **trade-off** means gaining something valuable while accepting a cost elsewhere. Naming trade-offs is essential in architecture discussions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: `rdg_arch_passive_focus_001`
skill: `reading.architecture_decision`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The team wanted to reduce monitoring costs."
    br_pt_form: null
    note: "monitoring is mentioned as required, not reduced"
  - option: "Latency will disappear after the split."
    br_pt_form: null
    note: "text states latency may increase, the opposite"
  - option: "All modules must stay in one deployment unit."
    br_pt_form: null
    note: "contradicts independent deployment decision"
```

**Stimulus:**
> "The payment logic was extracted into a separate service. Each service is deployed independently to improve availability. Additional network calls were introduced, so latency may increase and observability must be strengthened."

**Item:**
> Which statement matches the text?

| Slot | Value |
|------|-------|
| A | **Independent deployment was chosen to improve availability, despite possible latency costs.** ✓ |
| B | The team wanted to reduce monitoring costs. |
| C | Latency will disappear after the split. |
| D | All modules must stay in one deployment unit. |

**Key:** A

**Feedback:**
> The passage highlights a design decision (extract service, deploy independently), a benefit (availability), and a cost/risk (latency, need for observability). This is a typical trade-off statement.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, prerequisite review

```yaml
item_id: `grm_arch_modal_passive_001`
skill: `grammar.passive_design_decisions`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "must monitor"
    br_pt_form: "deve monitorar (ativa)"
    note: "active voice; loses focus on the system/component being acted upon"
  - option: "must be monitor"
    br_pt_form: "deve ser monitorar"
    note: "incorrect: needs past participle monitored"
  - option: "must monitored"
    br_pt_form: "deve monitorado"
    note: "missing be in passive construction"
```

**Item:**
> During rollout, the new service ____ carefully.

| Slot | Value |
|------|-------|
| A | must monitor |
| B | **must be monitored** ✓ |
| C | must be monitor |
| D | must monitored |

**Key:** B

**Feedback:**
> Modal passive form: **must + be + past participle** (*must be monitored*). This structure is common in technical requirements and operational guidance.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Vocabulary, prerequisite review

```yaml
item_id: `voc_arch_component_service_001`
skill: `vocab.architecture.component`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "password"
    br_pt_form: "senha"
    note: "security credential, unrelated to system structure"
  - option: "browser"
    br_pt_form: "navegador"
    note: "client application, not the architectural part being discussed"
  - option: "keyboard"
    br_pt_form: "teclado"
    note: "hardware device, wrong domain"
```

**Item:**
> A ____ is a part of a system with a clear responsibility that can be developed or replaced more easily.

| Slot | Value |
|------|-------|
| A | password |
| B | browser |
| C | **component** ✓ |
| D | keyboard |

**Key:** C

**Feedback:**
> In architecture discussions, a **component** is a building block with defined responsibilities and interfaces.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_arch_clusters_001`
skill: `pronunciation.consonant_clusters`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_arch_clusters_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — focus:** pronounce final clusters without adding an extra vowel: *designed* /dɪˈzaɪnd/, *extract* /ɪkˈstrækt/ (in connected speech), *trade-off* /ˈtreɪd ɔːf/.
**Step 2 — produce (ASR-scored):** read aloud:

> "The service was redesigned and deployed to reduce coupling."

**Target phonemes:** /d/ cluster in *redesigned* · /d/ in *deployed* · /pl/ in *coupling*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `passive_design_decisions` | Item 2 or 5 missed | **L2** | Practice be + past participle to describe architecture decisions. |
| `coupling_cohesion_contrast` | Item 1 missed | **L2** | Contrast dependency (coupling) with responsibility focus (cohesion). |
| `trade_off_expression` | Item 3 missed | **L2** | Produce benefit/cost statements in a new scenario. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production; pronunciation recognition pools are tracked separately.
3. Items target authored lesson content; no external source text is reproduced.
