# Practice Pack — `les_b2_it_advanced_patterns`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_it_advanced_patterns_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_advanced_patterns.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_advanced_patterns_v1
lesson_id: les_b2_it_advanced_patterns
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
item_id: grm_it_advanced_patterns_definitions_001
skill: `grammar.definitions_relative_clauses`
type: `gap_fill`
difficulty_b: 0.0
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "which"
    br_pt_form: "qual (forma inadequada para 'a place')"
    note: "'which' does not introduce a locative relative clause here; 'where' does"
  - option: "who"
    br_pt_form: "quem"
    note: "'who' refers to people, not to a place in a definition"
  - option: "what"
    br_pt_form: "o que"
    note: "'what' cannot follow the noun 'a place' as a relative pronoun"
```

**Item:**
> Complete the definition from the pair-programming dialogue: "A seam is a place ______ we can change behaviour without rewriting the module."

| Slot | Value |
|------|-------|
| A | which |
| B | **where** ✓ |
| C | who |
| D | what |

**Key:** B

**Feedback:**
> **A** (*which*) would need a preposition to work here; **C** (*who*) is only for people and **D** (*what*) cannot follow the noun *a place*. The locative relative clause is **`a place where we can change behaviour`**.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_it_advanced_patterns_dialogue_001
skill: `reading.legacy_code_dialogue`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "Because the function is written in an older language."
    br_pt_form: "Porque a função usa uma linguagem mais antiga."
    note: "the dialogue never mentions a language; the complaint is about responsibilities"
  - option: "Because the team has no automated tests at all."
    br_pt_form: "Porque o time não tem nenhum teste automatizado."
    note: "Túlio says he will add a characterization test; he does not say the team has none"
  - option: "Because the payment provider was swapped last week."
    br_pt_form: "Porque o provedor de pagamento foi trocado na semana passada."
    note: "swapping the provider is a hypothetical motivation, not the stated reason for the smell"
```

**Stimulus:**
> "There isn't one. The `processOrder` function validates the cart, charges the card, writes the audit log and sends the receipt. That's a code smell: too many responsibilities in one place."
> "First I add a characterization test to lock the current behaviour, then we refactor in small steps."

**Item:**
> Why does Túlio call `processOrder` a code smell?

| Slot | Value |
|------|-------|
| A | Because the function is written in an older language. |
| B | Because the team has no automated tests at all. |
| C | **Because it validates, charges, logs and sends the receipt in one function.** ✓ |
| D | Because the payment provider was swapped last week. |

**Key:** C

**Feedback:**
> The reason is stated directly: one function does four jobs. **A** invents a language problem, **B** overstates the testing situation, and **D** turns a possible future change into a past event. The term *code smell* names the signal, not the fix.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_advanced_patterns_terms_001
skill: `vocab.refactoring_legacy_code`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "code smell"
    br_pt_form: "cheiro de código"
    note: "a signal that something is wrong, not the problematic solution itself"
  - option: "seam"
    br_pt_form: "ponto de extensão / costura"
    note: "a place where a dependency can be changed, not a flawed solution"
  - option: "regression"
    br_pt_form: "regressão"
    note: "a behaviour that broke again, an outcome rather than a design choice"
```

**Item:**
> Which term means a solution that looks reasonable at first but creates problems later?

| Slot | Value |
|------|-------|
| A | code smell |
| B | seam |
| C | regression |
| D | **anti-pattern** ✓ |

**Key:** D

**Feedback:**
> An **anti-pattern** is the recurring solution that causes trouble later. **A** is the signal that points at a design problem, **B** is the place where behaviour can be changed safely, and **C** is the damage you observe after a change.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_it_advanced_patterns_regression_001
skill: `reading.refactor_regression`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The provider being replaced by a cheaper one."
    br_pt_form: "O provedor sendo substituído por um mais barato."
    note: "cost is not mentioned; the exchange is about preserving behaviour"
  - option: "The audit log being removed on purpose."
    br_pt_form: "O registro de auditoria sendo removido de propósito."
    note: "removing the log would be a deliberate change, not a regression"
  - option: "The pair ending the session early."
    br_pt_form: "A dupla encerrando a sessão mais cedo."
    note: "nothing in the excerpt suggests the session ends early"
```

**Stimulus:**
> "Marina: Pass the gateway in, then run the characterization test. If it stays green, we haven't changed behaviour. Túlio: And if a receipt goes missing, the test catches the regression before the customer does."

**Item:**
> What does the characterization test protect against in this exchange?

| Slot | Value |
|------|-------|
| A | **A behaviour change introduced by the refactor.** ✓ |
| B | The provider being replaced by a cheaper one. |
| C | The audit log being removed on purpose. |
| D | The pair ending the session early. |

**Key:** A

**Feedback:**
> The test locks current behaviour, so it catches an unintended change: **`if it stays green, we haven't changed behaviour`**. **B** introduces cost, which is absent, **C** describes a deliberate removal, and **D** invents an ending for the session.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_it_advanced_patterns_clusters_001
skill: `pronunciation.technical_clusters_dental`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_it_advanced_patterns_clusters_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *inject* carries /dʒ/, as in "dge" — not /ʒ/. In *behaviour* and *validation*, /v/ uses the lower lip against the upper teeth; do not round the lips into /w/. *Seam* has the long tense /iː/, not the short /ɪ/. The final /t/ in *checkout* is released without an extra vowel.

**Step 2 — produce (ASR-scored):** read aloud:

> "A seam lets us inject the gateway, so checkout behaviour and validation stay the same."

**Target phonemes:** /dʒ/ in *inject* · /v/ in *behaviour* and *validation* · /iː/ in *seam* · /t/ final in *checkout*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_it_advanced_patterns_present_simple_001
skill: `grammar.present_simple_definitions`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_it_terms_basics`
distractors:
  - option: "A seam are a place where we change behaviour."
    br_pt_form: "Uma costura são um lugar onde mudamos comportamento."
    note: "a singular subject takes 'is', not 'are'"
  - option: "A seam is a place where we changes behaviour."
    br_pt_form: "Uma costura é um lugar onde nós muda comportamento."
    note: "'we' takes the base form 'change', not the third-person 'changes'"
  - option: "A seam be a place where we change behaviour."
    br_pt_form: "Uma costura ser um lugar onde mudamos comportamento."
    note: "a definition needs the finite verb 'is', not the bare form 'be'"
```

**Item:**
> Reviewing technical definitions: which line defines a seam with correct present-simple agreement?

| Slot | Value |
|------|-------|
| A | A seam are a place where we change behaviour. |
| B | A seam is a place where we changes behaviour. |
| C | A seam be a place where we change behaviour. |
| D | **A seam is a place where we change behaviour.** ✓ |

**Key:** D

**Feedback:**
> A singular subject takes **is**, and *we* takes the base verb **change**: **`A seam is a place where we change behaviour.`** **A** breaks subject–verb agreement, **B** adds a third-person ending to *we*, and **C** leaves the verb in its bare form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_it_advanced_patterns_it_terms_001
skill: `vocab.it_algorithms_core`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_algorithms_basics`
distractors:
  - option: "Hash map"
    br_pt_form: "mapa de hash"
    note: "a data structure for key-value lookup, not a measure of growth"
  - option: "Code smell"
    br_pt_form: "cheiro de código"
    note: "a design signal from the current lesson, not an algorithms term"
  - option: "Dependency injection"
    br_pt_form: "injeção de dependência"
    note: "a way to pass a dependency in, not a way to describe running time"
```

**Item:**
> Reviewing core IT terms: which phrase describes how an algorithm's running time grows with the input size?

| Slot | Value |
|------|-------|
| A | Hash map |
| B | Code smell |
| C | **Big O notation** ✓ |
| D | Dependency injection |

**Key:** C

**Feedback:**
> **Big O notation** describes how running time or space grows with input size. **A** is a data structure, **B** is a signal about design from the current lesson, and **D** is the technique we used to create a seam.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `relative_clauses_definitions` | Item 1 missed | **L2** | Contrast *a place where*, *a signal which* and the wrong *what/who* in short technical definitions. |
| `refactoring_terms_contrast` | Items 3 and 7 missed | **L2** | Recycle *seam / code smell / anti-pattern / regression* against core IT vocabulary in one retrieval set. |
| `legacy_code_inference` | Items 2 and 4 missed | **L2** | Drill inference from a short pair-programming exchange: separate the stated smell from its cause and the regression it prevents. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a2_it_algorithms_basics` and carry `prereq_lesson` for the interleaving rule; `les_a2_it_typescript_basics` is the third verified prerequisite in the lesson model.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room. The `processOrder` example, the dialogue and the Brazilian-Portuguese trap table are original; no text from a restricted source is reproduced or adapted.
6. All seven `item_id` values contain the distinctive lesson token `advanced_patterns` and are unique across canonical packs.
