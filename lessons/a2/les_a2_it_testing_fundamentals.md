# Lesson: Testing Fundamentals — Unit Tests, Mocks, TDD Cycle

**Lesson ID:** `les_a2_it_testing_fundamentals`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/tdd.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **unit test** | teste unitário | *testa uma função/classe isolada* |
| **integration test** | teste de integração | *testa múltiplos componentes juntos* |
| **mock** | mock / simulado | *objeto falso que substitui dependência real* |
| **stub** | stub / substituto | *retorna valores pré-definidos* |
| **fixture** | fixture / cenário | *estado inicial conhecido para o teste* |
| **TDD** | TDD | *Test-Driven Development: red → green → refactor* |
| **assert** | afirmar / verificar | *verifica se resultado é o esperado* |
| **test double** | dublê de teste | *termo genérico para mock/stub/fake* |

### Mini-texto (áudio: `deferred_render`)

> **Dev:** "We write a **unit test** before the code. That's **TDD** — **red** (test fails), **green** (make it pass), **refactor**."
>
> **QA:** "What about the database?"
>
> **Dev:** "We use a **mock** for the DB. The test runs fast and doesn't need a real connection. A **stub** returns fixed data. The **fixture** sets up the user object. Then we **assert** the result."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
What is a **mock** in testing?
| Slot | Value |
|------|-------|
| A | A real database connection |
| B | **A fake object that replaces a real dependency** |
| C | A test that runs in production |
| D | A bug report template |
**Key:** B
**br_pt_form:** "mock / simulado"

### Item 2 — Vocabulary (Matching)
Match the TDD phase to its description:
| Phase | Description |
|-------|-------------|
| **Red** | a. Write the minimum code to pass |
| **Green** | b. Clean up the code |
| **Refactor** | c. Write a failing test |
**Key:** Red→c, Green→a, Refactor→b
**br_pt_form:** "vermelho", "verde", "refatorar"

### Item 3 — Grammar: Present Simple for habits (fill-in-blank)
Complete with **present simple**:
"We ______ (write) a test first. The test ______ (fail). We ______ (make) it pass. Then we ______ (refactor)."
**Key:** write / fails / make / refactor
**br_pt_form:** "escrevemos", "falha", "fazemos passar", "refatoramos"

---

## FASE 3 — Output Task [4 min]

### Speaking: TDD Roleplay (pares)
**Student A (Dev):** Explain the **TDD cycle** to a new team member. Use: *unit test, mock, stub, fixture, assert, red, green, refactor*.
**Student B (New Dev):** Ask: "Why test first?" and "What is a mock for?"

**Expected output (Dev):** "We write a **unit test** first — **red**. It fails because code doesn't exist. We write code — **green**. It passes. We **refactor** — clean up. For the DB, we use a **mock**. A **fixture** sets up test data. We **assert** the result."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
Which comes **first** in TDD?
| Slot | Value |
|------|-------|
| A | Write the production code |
| B | **Write a failing test** |
| C | Refactor the code |
| D | Deploy to staging |
**Key:** B
**br_pt_form:** "Escreva um teste que falhe"

### Item 2 — Grammar (L1, adaptive)
Choose the correct form for a habitual action:
| Slot | Value |
|------|-------|
| A | We **write** tests first. |
| B | We **writing** tests first. |
| C | We **writes** tests first. |
| D | We **wrote** tests first. |
**Key:** A
**br_pt_form:** "Escrevemos testes primeiro."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_testing_fundamentals_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_testing_fundamentals",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text, the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table",
    "bibliography_only": [
      "docs/tdd.md (Bookman, all rights reserved) - scoping of TDD vocabulary, red-green-refactor cycle, test doubles"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; vocabulary terms are unprotectable facts about the language"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.present_simple_habits"
    ],
    "vocabulary": [
      "vocab.testing.unit_test",
      "vocab.testing.integration_test",
      "vocab.testing.mock",
      "vocab.testing.stub",
      "vocab.testing.fixture",
      "vocab.testing.tdd_cycle",
      "vocab.testing.assert"
    ],
    "listening": [
      "listening.testing_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```