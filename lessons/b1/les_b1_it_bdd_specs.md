# Lesson: BDD Specifications — Given-When-Then, Acceptance Criteria, Scenario Writing

**Lesson ID:** `les_b1_it_bdd_specs`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `cite_only`
**Source:** `docs/bdd-in-action.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **behavior-driven development (BDD)** | desenvolvimento orientado a comportamento | *colaboração dev/QA/business via exemplos* |
| **given-when-then** | dado-quando-então | *formato de cenário executável* |
| **scenario** | cenário | *exemplo concreto de comportamento* |
| **acceptance criteria** | critérios de aceitação | *condições para considerar pronto* |
| **feature file** | arquivo de feature | *arquivo `.feature` com cenários* |
| **step definition** | definição de passo | *código que executa um passo* |
| **example mapping** | mapeamento de exemplos | *workshop para descobrir regras* |
| **living documentation** | documentação viva | *specs que são testes executáveis* |
| **ubiquitous language** | linguagem ubíqua | *vocabulário compartilhado (DDD + BDD)* |
| **rule** | regra | *generalização de exemplos* |
| **example** | exemplo | *caso concreto que ilustra regra* |
| **question** | pergunta | *incerteza a resolver no workshop* |

### Mini-texto (áudio: `deferred_render`)

> **PO:** "Feature: **Refund**. **Rule**: full refund within 30 days. **Example**: order #123, day 15 → full refund. **Question**: day 31?"
>
> **QA:** "**Scenario**: request refund on day 15. **Given** order placed 15 days ago. **When** customer requests refund. **Then** full amount returned."
>
> **Dev:** "**Scenario**: request refund on day 31. **Given** order placed 31 days ago. **When** customer requests refund. **Then** partial refund per policy."
>
> **PO:** "**Acceptance criteria** covered. **Living documentation** = executable specs."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**Given-When-Then** describes:
| Slot | Value |
|------|-------|
| A | Database schema |
| B | **A concrete scenario with preconditions, action, and outcome** |
| C | API endpoint |
| D | Test data setup only |
**Key:** B
**br_pt_form:** "cenário concreto com pré-condição, ação e resultado"

### Item 2 — Vocabulary (Matching)
Match the BDD artifact to its purpose:
| Artifact | Purpose |
|----------|---------|
| **Feature file** | a. Executable scenarios in Gherkin |
| **Step definition** | b. Code that runs a step |
| **Example mapping** | c. Workshop to find rules/examples |
| **Living documentation** | d. Specs that are tests |
**Key:** Feature file→a, Step definition→b, Example mapping→c, Living documentation→d
**br_pt_form:** "arquivo de feature", "definição de passo", "mapeamento de exemplos", "documentação viva"

### Item 3 — Grammar: Present simple for scenario steps (fill-in-blank)
Write steps in **present simple**:
"**Given** the customer ______ (have) a valid order. **When** the customer ______ (request) a refund. **Then** the system ______ (return) the full amount."
**Key:** has / requests / returns
**br_pt_form:** "tem", "solicita", "retorna"

---

## FASE 3 — Output Task [4 min]

### Writing: Feature File (individual)
**Scenario:** Write a `.feature` file for: "Customer applies discount code at checkout".

```
Feature: Apply discount code

  Rule: Discount code reduces order total if valid and not expired.

  Example: Valid code "SAVE10" on $100 order → $90 total.
  Example: Expired code "OLD20" → error message.

  Scenario: Valid discount code applied
    Given the customer has a $100 order
    And a valid discount code "SAVE10" exists
    When the customer applies the code
    Then the order total becomes $90
    And the code is marked as used

  Scenario: Expired discount code rejected
    Given the customer has a $100 order
    And an expired discount code "OLD20" exists
    When the customer applies the code
    Then an error "Code expired" is shown
    And the order total remains $100
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Living documentation** in BDD means:
| Slot | Value |
|------|-------|
| A | Printed manual |
| B | **Executable specifications that stay in sync with code** |
| C | Wiki pages |
| D | Meeting notes |
**Key:** B
**br_pt_form:** "documentação viva / specs executáveis"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **present simple** for a Given step:
| Slot | Value |
|------|-------|
| A | Given the user **has** an account. |
| B | Given the user **have** an account. |
| C | Given the user **having** an account. |
| D | Given the user **had** an account. |
**Key:** A
**br_pt_form:** "Dado que o usuário tem uma conta."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_bdd_specs_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_bdd_specs",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (PO/QA/Dev dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task template",
    "bibliography_only": [
      "docs/bdd-in-action.md (Manning, all rights reserved) - used for term selection and Gherkin structure; all definitions and examples authored"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - BDD terms are unprotectable methodology concepts; Gherkin syntax is public domain"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.present_simple_scenarios"
    ],
    "vocabulary": [
      "vocab.bdd.behavior_driven_development",
      "vocab.bdd.given_when_then",
      "vocab.bdd.scenario",
      "vocab.bdd.acceptance_criteria",
      "vocab.bdd.feature_file",
      "vocab.bdd.step_definition",
      "vocab.bdd.example_mapping",
      "vocab.bdd.living_documentation",
      "vocab.bdd.ubiquitous_language",
      "vocab.bdd.rule",
      "vocab.bdd.example",
      "vocab.bdd.question"
    ],
    "listening": [
      "listening.bdd_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.feature_file"
    ],
    "writing": [
      "writing.feature_file",
      "writing.bdd_scenario"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication"
  ],
  "estimated_time_min": 15
}
```