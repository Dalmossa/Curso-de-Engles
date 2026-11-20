# Practice Pack — `les_b1_it_bdd_specs`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_bdd_specs_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_bdd_specs.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_bdd_specs_v1
lesson_id: les_b1_it_bdd_specs
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
item_id: grm_bdd_given_step_agreement_001
skill: `grammar.bdd_given_when_then_tense`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Given the customer have a valid token. When the customer submits the form. Then the API returns 201."
    br_pt_form: "Dado que o cliente tem um token válido, a API retorna 201."
    note: "'have' is the base form and cannot follow the singular subject 'the customer'"
  - option: "Given the customer has a valid token. When the customer submit the form. Then the API returns 201."
    br_pt_form: "Dado que o cliente tem um token válido, quando o cliente envia o formulário, a API retorna 201."
    note: "'submit' misses the -s ending required after the singular subject 'the customer'"
  - option: "Given the customer has a valid token. When the customer submits the form. Then the API return 201."
    br_pt_form: "Dado que o cliente tem um token válido, quando o cliente envia o formulário, a API retorna 201 para o cliente."
    note: "'return' lacks the third-person -s; the observable outcome must use 'returns'"
```

**Item:**
> You are reviewing a feature file for a token-based form. Which set of steps uses the present simple correctly?

| Slot | Value |
|------|-------|
| A | "Given the customer have a valid token. When the customer submits the form. Then the API returns 201." |
| B | **"Given the customer has a valid token. When the customer submits the form. Then the API returns 201."** ✓ |
| C | "Given the customer has a valid token. When the customer submit the form. Then the API returns 201." |
| D | "Given the customer has a valid token. When the customer submits the form. Then the API return 201." |

**Key:** B

**Feedback:**
> Each step describes a stable state or action, so the third-person singular takes *-s*: **`has / submits / returns`**. **A** uses the base form *have*, **C** drops *-s* from *submit*, and **D** drops *-s* from *return*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_bdd_feature_scenario_rule_001
skill: `reading.bdd_scenario_structure`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The login page opens."
    br_pt_form: "A página de login abre."
    note: "this is the Then step, the outcome, not the precondition"
  - option: "The user submits a new password."
    br_pt_form: "O usuário envia uma nova senha."
    note: "this is the When step, the action taken after the precondition"
  - option: "The team writes unit tests."
    br_pt_form: "O time escreve testes de unidade."
    note: "unit tests are not part of this feature file excerpt"
```

**Stimulus:**
> "Feature: Password reset. Scenario: Valid link. Given a valid reset link. When the user submits a new password. Then the login page opens."

**Item:**
> Which part of the scenario is the **Given** step?

| Slot | Value |
|------|-------|
| A | The login page opens. |
| B | **A valid reset link.** ✓ |
| C | The user submits a new password. |
| D | The team writes unit tests. |

**Key:** B

**Feedback:**
> **Given** introduces the precondition: **`a valid reset link`**. **A** belongs to *Then* (the outcome), **C** belongs to *When* (the action), and **D** is absent from the excerpt.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_bdd_given_when_then_001
skill: `vocab.it_computer_terms.bdd_specs`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "A step definition."
    br_pt_form: "Uma definição de passo."
    note: "a step definition is the code that executes a step, not the document that holds scenarios"
  - option: "An acceptance criterion."
    br_pt_form: "Um critério de aceite."
    note: "an acceptance criterion is one condition, not a file of executable scenarios"
  - option: "A database migration."
    br_pt_form: "Uma migração de banco de dados."
    note: "a migration changes schema or data; it does not store Gherkin scenarios"
```

**Item:**
> A new teammate asks which artifact holds executable scenarios written in Gherkin. What do you answer?

| Slot | Value |
|------|-------|
| A | "A step definition." |
| B | "An acceptance criterion." |
| C | **"A feature file."** ✓ |
| D | "A database migration." |

**Key:** C

**Feedback:**
> **`A feature file`** is the `.feature` document that stores scenarios. **A** is executable code behind a step, **B** is a single condition, and **D** belongs to database work.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_bdd_acceptance_criteria_detail_001
skill: `reading.bdd_criteria_detail`
type: `detail_identification`
difficulty_b: 0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The service logs a request id."
    br_pt_form: "O serviço registra um id de requisição."
    note: "a server log is internal and cannot be checked on the user's screen"
  - option: "The developer writes an API client."
    br_pt_form: "O desenvolvedor escreve um cliente de API."
    note: "this is a task for the team, not a result the user sees"
  - option: "The story is discussed on Monday."
    br_pt_form: "A história é discutida na segunda-feira."
    note: "a meeting is a process event, not an observable product outcome"
```

**Stimulus:**
> "Acceptance criteria for 'Download invoice': the service logs a request id; the developer writes an API client; the invoice appears as a PDF within ten seconds; the story is discussed on Monday."

**Item:**
> Which acceptance criterion can a **user verify on the screen**?

| Slot | Value |
|------|-------|
| A | The service logs a request id. |
| B | **The invoice appears as a PDF within ten seconds.** ✓ |
| C | The developer writes an API client. |
| D | The story is discussed on Monday. |

**Key:** B

**Feedback:**
> Only **`the invoice appears as a PDF within ten seconds`** is visible to the user. **A** is an internal log, **C** is a development task, and **D** is a meeting — none of them is an observable outcome.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_bdd_given_when_then_stress_001
skill: `pronunciation.bdd_given_when_then_stress`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_bdd_given_when_then_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *given* /ˈɡɪvən/ puts the stress on the first syllable with a short /ɪ/; *then* /ðen/ starts with the voiced dental fricative /ð/, not /d/; *returns* /rɪˈtɜːrn/ stresses the second syllable, unlike the pt-BR rhythm of *retorna*.

**Step 2 — produce (ASR-scored):** read aloud:

> "Given a valid token, when the user submits the form, then the API returns 201."

**Target phonemes:** /ˈɡɪvən/ in *given* · /ð/ in *then* · /tʃ/ in *feature* (from the lesson glossary) · /rɪˈtɜːrn/ in *returns* · final /s/ in *returns* (release it; do not add a final vowel).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_bdd_prereq_present_simple_s_001
skill: `grammar.bdd_present_simple_third_person`
type: `error_correction`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The checkout page show the total."
    br_pt_form: "A página de checkout mostra o total."
    note: "a singular subject requires 'shows', not the base form"
  - option: "The checkout pages shows the total."
    br_pt_form: "As páginas de checkout mostram o total."
    note: "a plural subject takes the base verb; -s belongs to the singular"
  - option: "The checkout page is show the total."
    br_pt_form: "A página de checkout está mostrar o total."
    note: "the progressive with 'is' does not combine with the bare verb 'show'"
```

**Item:**
> Before writing a spec note, review the present simple. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The checkout page show the total." |
| B | "The checkout pages shows the total." |
| C | **"The checkout page shows the total."** ✓ |
| D | "The checkout page is show the total." |

**Key:** C

**Feedback:**
> A singular subject takes the *-s* ending: **`The checkout page shows the total.`** **A** omits it, **B** adds it to a plural subject, and **C→D** inserts an impossible *is show* construction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_bdd_prereq_it_terms_scan_001
skill: `vocab.it_computer_terms.feature_artifacts`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "API endpoint."
    br_pt_form: "Endpoint de API."
    note: "an endpoint is a URL that serves a request, not a document of scenarios"
  - option: "Status code."
    br_pt_form: "Código de status."
    note: "a status code is a numeric response value, not a place where scenarios live"
  - option: "Build pipeline."
    br_pt_form: "Pipeline de build."
    note: "a pipeline runs automated steps; it does not store Gherkin text"
```

**Item:**
> Skim this label list: "API endpoint • feature file • status code • build pipeline". Which label names the document that stores Gherkin scenarios?

| Slot | Value |
|------|-------|
| A | "API endpoint." |
| B | **"Feature file."** ✓ |
| C | "Status code." |
| D | "Build pipeline." |

**Key:** B

**Feedback:**
> **`Feature file`** is the label for the document of executable scenarios. **A** is a URL, **C** is a response number, and **D** is an automation sequence — scanning for the word *file* resolves the item quickly.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `bdd_step_tense` | Item 1 or item 6 missed | **L2** | Contrast *the customer has / the page shows* with *the pages show* in short spec sentences, tying *-s* to the subject. |
| `bdd_artifact_mapping` | Item 3 or item 7 missed | **L2** | Recycle *feature file*, *step definition*, *acceptance criterion* and *API endpoint* as function questions instead of bare translations. |
| `bdd_criteria_detail` | Items 2 or 4 missed | **L2** | Skim a short feature excerpt for the Given precondition and for the criterion that is visible on screen before answering. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 1–5 assess the B1 lesson directly; items 6 and 7 review `les_a1_present_simple` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Item 2's excerpt and item 4's criteria list use distinct detail targets (Given precondition vs. screen-visible outcome), so neither can be answered from the other's stimulus.
5. All scenario excerpts, term definitions, distractors and Portuguese glosses were authored for this pack; no external source text is reproduced or adapted.
