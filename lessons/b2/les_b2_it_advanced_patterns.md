# Lesson: Advanced Patterns & Anti-Patterns

**Lesson ID:** `les_b2_it_advanced_patterns`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `cite_only`
**Source:** `docs/codigolimpo.md` + `docs/arquitetura-limpa.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **design pattern** | padrão de design | *solução reutilizável (Factory, Observer, Strategy)* |
| **anti-pattern** | anti-padrão | *solução que parece boa mas causa problemas* |
| **singleton** | singleton | *uma única instância global* |
| **god object** | objeto deus | *classe que faz tudo* |
| **spaghetti code** | código espaguete | *código sem estrutura, difícil de seguir* |
| **boilerplate** | boilerplate | *código repetitivo necessário* |
| **refactoring** | refatoração | *reestruturar sem mudar comportamento* |
| **technical debt** | dívida técnica | *custo futuro de decisões rápidas* |
| **code smell** | cheiro de código | *sinal de problema de design* |
| **SOLID** | SOLID | *5 princípios de design OO* |
| **DRY** | DRY | *Don't Repeat Yourself* |
| **YAGNI** | YAGNI | *You Aren't Gonna Need It* |

### Mini-texto (áudio: `deferred_render`)

> **Senior:** "**Design patterns** solve recurring problems. **Factory** creates objects. **Observer** notifies changes. **Strategy** swaps algorithms."
>
> "**Anti-patterns** to avoid: **Singleton** (global state, hard to test). **God object** (one class does everything). **Spaghetti code** (no structure). **Boilerplate** (repetitive code)."
>
> "**Code smells**: long method, duplicate code, feature envy. **Refactoring** fixes without changing behavior. **Technical debt** — pay it down. **SOLID**, **DRY**, **YAGNI** — design principles."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
An **anti-pattern** is:
| Slot | Value |
|------|-------|
| A | A best practice |
| B | **A solution that seems good but causes problems** |
| C | A design pattern |
| D | A testing strategy |
**Key:** B
**br_pt_form:** "anti-padrão / solução que parece boa mas causa problemas"

### Item 2 — Vocabulary (Matching)
Match the pattern/anti-pattern to its description:
| Term | Description |
|------|-------------|
| **Factory** | a. Creates objects without specifying class |
| **Singleton** | b. One global instance (anti-pattern) |
| **God object** | c. Class that does everything (anti-pattern) |
| **Observer** | d. Notifies dependents of state change |
**Key:** Factory→a, Singleton→b, God object→c, Observer→d
**br_pt_form:** "Factory", "Singleton", "god object", "Observer"

### Item 3 — Grammar: Present simple for definitions (fill-in-blank)
Complete with **present simple**:
"A ______ (singleton) ______ (ensure) one instance. A ______ (factory) ______ (create) objects. ______ (spaghetti code) ______ (be) hard to maintain."
**Key:** singleton / ensures / factory / creates / Spaghetti code / is
**br_pt_form:** "garante", "cria", "é"

---

## FASE 3 — Output Task [4 min]

### Speaking: Code Review with Patterns (pares)
**Student A (Reviewer):** Identify patterns and anti-patterns in this code. Use: *design pattern, anti-pattern, singleton, god object, spaghetti code, boilerplate, refactoring, technical debt, code smell, SOLID, DRY, YAGNI*.
**Student B (Author):** Defend or accept. Propose refactoring.

```python
class OrderProcessor:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def process(self, order):
        # validate, save, send email, log, notify, generate report...
        pass
```

**Expected (Reviewer):** "This is a **Singleton** (anti-pattern) + **God object**. **Code smell**: too many responsibilities. **Refactoring**: extract `Validator`, `Repository`, `Notifier`. **SOLID**: Single Responsibility. **DRY**: extract common logic."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**God object** is:
| Slot | Value |
|------|-------|
| A | A well-designed class |
| B | **A class that does everything (anti-pattern)** |
| C | A design pattern |
| D | A testing tool |
**Key:** B
**br_pt_form:** "god object / classe que faz tudo (anti-padrão)"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **present simple** for a definition:
| Slot | Value |
|------|-------|
| A | A factory **create** objects. |
| B | A factory **creates** objects. |
| C | A factory **creating** objects. |
| D | A factory **created** objects. |
**Key:** B
**br_pt_form:** "Uma fábrica cria objetos."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_advanced_patterns_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_advanced_patterns",
  "cefr_level": "B2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (Senior explanation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/codigolimpo.md (BaixeLivros notice applies) - scoping of design patterns, anti-patterns, code smells, SOLID, DRY, YAGNI",
      "docs/arquitetura-limpa.md (Alta Books, all rights reserved) - scoping of clean architecture principles"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - pattern terms are unprotectable software engineering concepts; definitions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.present_simple_definitions"
    ],
    "vocabulary": [
      "vocab.patterns.design_pattern",
      "vocab.patterns.anti_pattern",
      "vocab.patterns.singleton",
      "vocab.patterns.god_object",
      "vocab.patterns.spaghetti_code",
      "vocab.patterns.boilerplate",
      "vocab.patterns.refactoring",
      "vocab.patterns.technical_debt",
      "vocab.patterns.code_smell",
      "vocab.patterns.solid",
      "vocab.patterns.dry",
      "vocab.patterns.yagni"
    ],
    "listening": [
      "listening.patterns_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication",
    "les_b1_it_technical",
    "les_b1_fluency_project",
    "les_b2_professional"
  ],
  "estimated_time_min": 15
}
```