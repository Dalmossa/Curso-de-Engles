# Practice Pack — `les_b2_it_strategy`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_it_strategy_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_strategy.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_strategy_v1
lesson_id: les_b2_it_strategy
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
item_id: grm_it_strategy_future_forms_001
skill: `grammar.strategy_future_forms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "We will migrating to the platform layer next quarter."
    br_pt_form: "Estaremos migrando para a camada de plataforma no próximo trimestre."
    note: "'will' takes the bare verb; 'will migrating' is not a future form"
  - option: "We are going migrate to the platform layer next quarter."
    br_pt_form: "Nós ir migrar para a camada de plataforma no próximo trimestre."
    note: "'be going to' needs 'to' before the lexical verb"
  - option: "We will to migrate to the platform layer next quarter."
    br_pt_form: "Vamos para migrar a camada de plataforma no próximo trimestre."
    note: "a modal is followed by the base verb, never by 'to'"
```

**Item:**
> Which line states the Q1 commitment with correct future forms?

| Slot | Value |
|------|-------|
| A | "We will migrating to the platform layer next quarter." |
| B | "We are going migrate to the platform layer next quarter." |
| C | **"We're going to migrate to the platform layer next quarter, and the team will present the roadmap on Monday."** ✓ |
| D | "We will to migrate to the platform layer next quarter." |

**Key:** C

**Feedback:**
> **C** combines *be going to* for the plan and *will* for the scheduled presentation. **A** puts an *-ing* form after *will*, **B** drops *to* from *be going to*, and **D** inserts *to* after the modal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_it_strategy_roadmap_detail_001
skill: `reading.strategy_roadmap_summary`
type: `detail_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Keeping read-only access through Q2."
    br_pt_form: "Manter acesso somente leitura até o Q2."
    note: "read-only access is the mitigation, not a prerequisite for Milestone 1"
  - option: "Freezing the legacy reporting UI until Q3."
    br_pt_form: "Congelar a interface de relatórios legada até o Q3."
    note: "the freeze is the trade-off announced in the roadmap"
  - option: "Reviewing the KPI baseline in March."
    br_pt_form: "Revisar a linha de base do KPI em março."
    note: "the baseline review is the cadence, not something the milestone waits for"
```

**Stimulus:**
> "North star: cut lead time for changes by half. In Q1 we're doubling down on the platform layer; the legacy reporting UI stays frozen until Q3. Milestone 1 (March): self-service deploy for all teams. Dependency: the identity API must support fine-grained scopes. Risk: migration of old reports may slip — mitigation: keep read-only access through Q2. We'll review the KPI baseline at each milestone."

**Item:**
> Which item is a dependency for Milestone 1?

| Slot | Value |
|------|-------|
| A | "Keeping read-only access through Q2." |
| B | **"The identity API supporting fine-grained scopes."** ✓ |
| C | "Freezing the legacy reporting UI until Q3." |
| D | "Reviewing the KPI baseline in March." |

**Key:** B

**Feedback:**
> The stimulus names it directly: **`Dependency: the identity API must support fine-grained scopes.`** **A** is the mitigation for the risk, **C** is the trade-off, and **D** is the review cadence.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_strategy_tradeoff_001
skill: `vocab.strategy.trade_off`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "buy-in"
    br_pt_form: "adesão das partes interessadas"
    note: "buy-in is the support you get from stakeholders, not a scope sacrifice"
  - option: "milestone"
    br_pt_form: "marco verificável do projeto"
    note: "a milestone is a checkpoint with a date, not a compromise between options"
  - option: "dependency"
    br_pt_form: "pré-requisito de uma etapa"
    note: "a dependency is something that must happen first, not something given up"
```

**Item:**
> Which term means giving up one benefit to gain another in a roadmap decision?

| Slot | Value |
|------|-------|
| A | "buy-in" |
| B | "milestone" |
| C | **"trade-off"** ✓ |
| D | "dependency" |

**Key:** C

**Feedback:**
> **`Trade-off`** is the explicit compromise behind a strategy choice. **A** (*buy-in*) is stakeholder commitment, **B** (*milestone*) is a dated checkpoint, and **D** (*dependency*) is a prerequisite for a later step.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_it_strategy_risk_detail_001
skill: `reading.strategy_risk_mitigation`
type: `detail_identification`
difficulty_b: 0.2
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Revisit the CAPEX request immediately."
    br_pt_form: "Revisar a solicitação de CAPEX imediatamente."
    note: "the CAPEX review is conditional on missing the SLA, not the mitigation itself"
  - option: "Ship the MVP in Q2."
    br_pt_form: "Entregar o MVP no Q2."
    note: "shipping the MVP is the scope decision, not a mitigation for the database risk"
  - option: "Commit to multi-region in Q2."
    br_pt_form: "Comprometer-se com multi-região no Q2."
    note: "Ana explicitly says the team is not committing to multi-region yet"
```

**Stimulus:**
> "At the steering review, Ana said: 'We can ship the MVP in Q2, but we are not committing to multi-region yet. The main risk is the single-region database; we'll mitigate it with nightly backups and a tested restore. If the SLA target of 99.9% is missed, we'll revisit the CAPEX request.'"

**Item:**
> What mitigation does Ana propose for the single-region risk?

| Slot | Value |
|------|-------|
| A | "Revisit the CAPEX request immediately." |
| B | "Ship the MVP in Q2." |
| C | "Commit to multi-region in Q2." |
| D | **"Nightly backups and a tested restore."** ✓ |

**Key:** D

**Feedback:**
> The mitigation is **`nightly backups and a tested restore`**. **A** is a conditional budget step after an SLA miss, **B** restates the delivery window, and **C** is ruled out by Ana's own words.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_it_strategy_dental_diphthongs_001
skill: `pronunciation.strategy_th_dental`
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

**Step 1 — hear the contrast:** *north star* ends in /θ/, a voiceless dental fricative — the tongue tip goes between the teeth, not behind them. *The* uses the voiced /ð/, and *trade* carries the diphthong /eɪ/. Brazilian learners often replace /θ/ with /t/ ("nort star") and add a final vowel after /f/ in *off* ("trade-off-e").

**Step 2 — produce (ASR-scored):** read aloud:

> "Our north star is the trade-off we can defend: fewer reports, less tech debt."

**Target phonemes:** /θ/ final in *north* · /ð/ in *the* · /eɪ/ in *trade* · /f/ final in *off*, without epenthetic /ɪ/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_it_strategy_present_simple_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_a2_corpus_intro
distractors:
  - option: "The identity API is support fine-grained scopes."
    br_pt_form: "A API de identidade está suportar escopos refinados."
    note: "'is support' mixes the verb 'be' with the base verb; state a fact with the simple present"
  - option: "The identity API supports to fine-grained scopes."
    br_pt_form: "A API de identidade suporta para escopos refinados."
    note: "'supports' takes a direct object; the preposition 'to' is L1 transfer"
  - option: "The identity API is supports fine-grained scopes."
    br_pt_form: "A API de identidade é suporta escopos refinados."
    note: "do not add 'is' before a lexical verb in the present simple"
```

**Item:**
> Reviewing corporate vocabulary: which line states a current fact about the platform?

| Slot | Value |
|------|-------|
| A | "The identity API is support fine-grained scopes." |
| B | **"The identity API supports fine-grained scopes."** ✓ |
| C | "The identity API supports to fine-grained scopes." |
| D | "The identity API is supports fine-grained scopes." |

**Key:** B

**Feedback:**
> A current fact uses the simple present with a direct object: **`The identity API supports fine-grained scopes.`** **A** mixes *be* with the base verb, **C** adds an unnecessary *to*, and **D** doubles the verb marker with *is supports*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_it_strategy_acronyms_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: -0.1
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_b1_it_acronyms_deep
distractors:
  - option: "ROI"
    br_pt_form: "retorno sobre investimento"
    note: "ROI measures financial return, not a service availability target"
  - option: "CAPEX"
    br_pt_form: "despesas de capital"
    note: "CAPEX is a budget category for capital assets, not a reliability figure"
  - option: "OPEX"
    br_pt_form: "despesas operacionais"
    note: "OPEX is recurring operating cost, not an availability percentage"
```

**Item:**
> Reviewing advanced acronyms: which one expands to "Service Level Agreement" in a roadmap review?

| Slot | Value |
|------|-------|
| A | "ROI" |
| B | "CAPEX" |
| C | **"SLA"** ✓ |
| D | "OPEX" |

**Key:** C

**Feedback:**
> **`SLA`** is *Service Level Agreement*, the availability commitment discussed in the roadmap review. **A** (*ROI*) is about financial return, **B** (*CAPEX*) is capital spending, and **D** (*OPEX*) is recurring operating cost.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `strategy_future_forms` | Item 1 missed | **L2** | Contrast *will migrate / going to migrate / migrating* in short roadmap commitments with a named quarter. |
| `roadmap_detail_scan` | Items 2 and 4 missed | **L2** | Scan a six-line roadmap excerpt for *dependency*, *mitigation* and *trade-off*; keep each label distinct. |
| `strategy_vocab_recycle` | Items 3, 6 and 7 missed | **L2** | Recycle *trade-off / buy-in / milestone / dependency* with the simple-present fact pattern and the OKR/KPI/SLA/CAPEX/OPEX acronym set. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_corpus_intro` (`present_simple_regular`) and `les_b1_it_acronyms_deep` (`acronyms_corporate`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss, note and stimulus is authored in a clean room; no restricted source text is reproduced. The acronyms OKR, KPI, SLA, ROI, CAPEX and OPEX are unprotected abbreviations.
6. The listening slot is intentionally empty (`listening_items: 0`): the lesson marks its input as `deferred_render`, so no listening item is invented here.
