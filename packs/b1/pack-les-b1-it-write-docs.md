# Practice Pack — `les_b1_it_write_docs`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_write_docs_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_write_docs.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_write_docs_v1
lesson_id: les_b1_it_write_docs
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
item_id: grm_write_docs_rfc_imperative_001
skill: `grammar.docs_imperative_directive`
type: `contextual_selection`
difficulty_b: -0.35
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Installing the dependencies before you run the code sample."
    br_pt_form: "Instalando as dependências antes de executar o exemplo de código."
    note: "a gerund fragment describes an action but gives the reader no directive"
  - option: "To install the dependencies before you run the code sample."
    br_pt_form: "Para instalar as dependências antes de executar o exemplo de código."
    note: "an infinitive phrase states purpose, not the step the reader must perform"
  - option: "Installed the dependencies before you run the code sample."
    br_pt_form: "Instalou as dependências antes de executar o exemplo de código."
    note: "past tense reports what happened instead of instructing the reader"
```

**Item:**
> You are writing the *getting started* section of a README. Which line is a clear directive?

| Slot | Value |
|------|-------|
| A | "Installing the dependencies before you run the code sample." |
| B | **"Install the dependencies before you run the code sample."** ✓ |
| C | "To install the dependencies before you run the code sample." |
| D | "Installed the dependencies before you run the code sample." |

**Key:** B

**Feedback:**
> Documentation instructions use the base verb: **`Install the dependencies before you run the code sample.`** **A** is a gerund fragment, **C** is an unfinished purpose phrase, and **D** reports a past action instead of telling the reader what to do.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_write_docs_rfc_problem_001
skill: `reading.docs_rfc_structure`
type: `detail_identification`
difficulty_b: -0.15
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "This RFC proposes an Idempotency-Key header stored in Redis."
    br_pt_form: "Este RFC propõe um cabeçalho Idempotency-Key armazenado no Redis."
    note: "this is the proposal, the answer to the problem, not the problem itself"
  - option: "Extra storage and a small latency cost."
    br_pt_form: "Armazenamento extra e um pequeno custo de latência."
    note: "these are the trade-offs, the price of the chosen solution"
  - option: "Five percent of traffic on Tuesday, then one hundred percent on Friday."
    br_pt_form: "Cinco por cento do tráfego na terça e cem por cento na sexta."
    note: "this is the rollout schedule, not the motivation for the change"
```

**Stimulus:**
> "## Problem. Retries can charge a customer twice when the first payment response is lost. ## Proposal. This RFC proposes an `Idempotency-Key` header stored in Redis for twenty-four hours. ## Trade-offs. Extra storage and a small latency cost. ## Rollout. Five percent of traffic on Tuesday, then one hundred percent on Friday."

**Item:**
> Which sentence states the **problem** this RFC addresses?

| Slot | Value |
|------|-------|
| A | "This RFC proposes an Idempotency-Key header stored in Redis." |
| B | **"Retries can charge a customer twice when the first payment response is lost."** ✓ |
| C | "Extra storage and a small latency cost." |
| D | "Five percent of traffic on Tuesday, then one hundred percent on Friday." |

**Key:** B

**Feedback:**
> The Problem section names the failure: **`Retries can charge a customer twice when the first payment response is lost.`** **A** is the proposal, **C** lists the trade-offs, and **D** gives the rollout — all three answer *how*, not *why*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_write_docs_rfc_001
skill: `vocab.docs_rfc_terms`
type: `contextual_selection`
difficulty_b: 0.15
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "runbook"
    br_pt_form: "manual de operação"
    note: "a runbook gives on-call steps for an incident, not a removal warning"
  - option: "table of contents"
    br_pt_form: "índice do documento"
    note: "the table of contents lists sections; it says nothing about a version"
  - option: "code sample"
    br_pt_form: "exemplo de código"
    note: "a code sample illustrates usage; it is not a notice about removal"
```

**Item:**
> Which term names a short warning that an endpoint will be removed in a future version?

| Slot | Value |
|------|-------|
| A | runbook |
| B | **deprecation note** ✓ |
| C | table of contents |
| D | code sample |

**Key:** B

**Feedback:**
> **`Deprecation note`** is the warning that something is *deprecated* and will be removed. **A** is the on-call manual, **C** is the document index, and **D** is an executable illustration — none of them announces a removal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_write_docs_runbook_detail_001
skill: `reading.docs_runbook_detail`
type: `detail_identification`
difficulty_b: 0.05
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Restore the previous config file immediately."
    br_pt_form: "Restaurar o arquivo de configuração anterior imediatamente."
    note: "restoring the config is the rollback, not the conditional step asked about"
  - option: "Set the retry flag to off."
    br_pt_form: "Definir a flag de retentativa como off."
    note: "this is Step 2 and has already been done when the condition is checked"
  - option: "Check that the queue depth is below one thousand."
    br_pt_form: "Verificar se a profundidade da fila está abaixo de mil."
    note: "this is Step 3, performed before the conditional check in Step 4"
```

**Stimulus:**
> "Runbook: payment retry incident. Step 1 — Check the dashboard for duplicate charges. Step 2 — Set the retry flag to `off` in the config. Step 3 — Confirm the queue depth is below one thousand. Step 4 — Page the platform on-call if the flag does not take effect within five minutes. Rollback: restore the previous config file from the `releases` folder."

**Item:**
> What should the on-call engineer do **if the retry flag does not take effect**?

| Slot | Value |
|------|-------|
| A | Restore the previous config file immediately. |
| B | Set the retry flag to `off`. |
| C | **Page the platform on-call.** ✓ |
| D | Check that the queue depth is below one thousand. |

**Key:** C

**Feedback:**
> Step 4 is the conditional instruction: **`Page the platform on-call if the flag does not take effect within five minutes.`** **A** is the rollback path, **B** is the earlier Step 2, and **D** is Step 3 — none of them answers the *if* clause.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_write_docs_acronym_stress_001
skill: `pronunciation.docs_acronym_stress`
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

**Step 1 — hear the contrast:** *idempotency* is /ˌaɪdəmˈpoʊtənsi/, with the stress on *po* — Brazilian learners often stress the first syllable, as in "ídem". *deprecated* is /dɪˈprekeɪtɪd/, with the /eɪ/ diphthong in the middle; avoid a flat /e/. *twice* is /twaɪs/: the /aɪ/ ends in /s/, with no extra vowel after it.

**Step 2 — produce (ASR-scored):** read aloud:

> "This RFC proposes idempotency keys; a retry can charge a customer twice. The old endpoint will be deprecated in version three."

**Target phonemes:** /aɪ/ in *idempotency* and *twice* · /ˈpoʊ/ stress in *idempotency* · /eɪ/ in *deprecated* · /z/ final in *keys* and /s/ final in *twice*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_write_docs_prereq_tense_001
skill: `grammar.docs_tense_consistency`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_writing_svo
distractors:
  - option: "The team add a retry limit in version 2 and the endpoint was deprecated in version 3."
    br_pt_form: "O time adiciona um limite de retentativa na versão 2 e o endpoint foi descontinuado na versão 3."
    note: "'team' is singular here and needs 'added' or 'adds', not the base form 'add'"
  - option: "The team adds a retry limit in version 2 and the endpoint deprecates in version 3."
    br_pt_form: "O time adiciona um limite de retentativa na versão 2 e o endpoint é descontinuado na versão 3."
    note: "present tense clashes with the finished time marker 'in version 2'"
  - option: "Added a retry limit in version 2 and the endpoint will be deprecated in version 3."
    br_pt_form: "Adicionou um limite de retentativa na versão 2 e o endpoint será descontinuado na versão 3."
    note: "a past-tense verb with no subject breaks the subject-verb-object order of the entry"
```

**Item:**
> Reviewing SVO order and tense consistency: which changelog entry keeps subject, verb and time marker aligned?

| Slot | Value |
|------|-------|
| A | "The team add a retry limit in version 2 and the endpoint was deprecated in version 3." |
| B | **"The team added a retry limit in version 2 and the endpoint will be deprecated in version 3."** ✓ |
| C | "The team adds a retry limit in version 2 and the endpoint deprecates in version 3." |
| D | "Added a retry limit in version 2 and the endpoint will be deprecated in version 3." |

**Key:** B

**Feedback:**
> The finished release takes the past tense and the future removal takes *will be deprecated*: **`The team added a retry limit in version 2 and the endpoint will be deprecated in version 3.`** **A** drops agreement, **C** uses the present with a finished time marker, and **D** has no subject before *Added*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_write_docs_prereq_artifacts_001
skill: `vocab.docs_artifact_names`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "the ADR"
    br_pt_form: "o registro de decisão de arquitetura"
    note: "an ADR records a decision already made, not the first steps to run the project"
  - option: "the changelog"
    br_pt_form: "o histórico de mudanças"
    note: "a changelog lists releases after the fact; it does not teach setup"
  - option: "the runbook"
    br_pt_form: "o manual de operação"
    note: "a runbook serves on-call during an incident, not a new engineer's first run"
```

**Item:**
> Reviewing IT core terms: which document gives a new engineer the first steps to run the project locally?

| Slot | Value |
|------|-------|
| A | the ADR |
| B | **the getting started guide** ✓ |
| C | the changelog |
| D | the runbook |

**Key:** B

**Feedback:**
> **`The getting started guide`** is written for a first local run. **A** records decisions, **C** lists version history, and **D** is for incident response — different readers, different documents.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `docs_directive_drill` | Item 1 missed | **L2** | Contrast *install / installing / to install / installed* in a four-step getting-started section with an explicit audience. |
| `docs_section_mapping` | Items 2 and 4 missed | **L2** | Label Problem, Proposal, Trade-offs, Rollout in a short RFC, then answer one conditional question from a runbook step. |
| `docs_version_vocabulary` | Items 3, 6 and 7 missed | **L2** | Recycle *deprecation note / changelog / ADR / getting started* with past vs. future time markers in one release entry. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_writing_svo` and `les_a2_it_terms_basics` respectively and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. All documentation terms used here are generic industry vocabulary with definitions written for this pack.
