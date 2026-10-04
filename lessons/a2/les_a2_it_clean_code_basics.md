# Lesson: Clean Code Practices — Refactoring, Code Smells, SOLID

**Lesson ID:** `les_a2_it_clean_code_basics`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/codigolimpo.md` + `docs/arquitetura-limpa.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **refactor** | refatorar | *restructure code without changing behavior* |
| **code smell** | cheiro de código | *sinal de problema de design* |
| **technical debt** | dívida técnica | *custo futuro de soluções rápidas* |
| **clean code** | código limpo | *código legível, simples, testável* |
| **SOLID** | SÓLIDO | *5 princípios de design OO* |
| **DRY** | não se repita | *Don't Repeat Yourself* |
| **KISS** | mantenha simples | *Keep It Simple, Stupid* |
| **YAGNI** | não vai precisar | *You Aren't Gonna Need It* |

### Mini-texto (áudio: `deferred_render`)

> **Senior Dev:** "This function has a **code smell** — it does three things at once. We should **refactor** it into smaller functions."
>
> **Junior Dev:** "But it works. Why change it?"
>
> **Senior Dev:** "Because **technical debt** slows us down later. **Clean code** follows **SOLID**: each function has **one responsibility** (**Single Responsibility Principle**). Also **DRY** — don't copy-paste logic. **KISS** — keep it simple. And **YAGNI** — don't add features we don't need yet."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
What does **refactor** mean?
| Slot | Value |
|------|-------|
| A | Add new features to the code |
| B | **Restructure code without changing behavior** |
| C | Fix a bug reported by QA |
| D | Delete the entire module |
**Key:** B
**br_pt_form:** "refatorar"

### Item 2 — Vocabulary (Matching)
Match the term to its meaning:
| Term | Meaning |
|------|---------|
| **code smell** | a sign of a design problem |
| **technical debt** | future cost of quick solutions |
| **DRY** | Don't Repeat Yourself |
| **YAGNI** | You Aren't Gonna Need It |
**Key:** code smell→a, technical debt→b, DRY→c, YAGNI→d
**br_pt_form:** "cheiro de código", "dívida técnica", "não se repita", "não vai precisar"

### Item 3 — Grammar: Imperative for advice (fill-in-blank)
Complete with the verb in **imperative**:
"______ (keep) it simple. ______ (don't repeat) yourself. ______ (don't add) features you don't need."
**Key:** Keep / Don't repeat / Don't add
**br_pt_form:** "Mantenha", "Não repita", "Não adicione"

---

## FASE 3 — Output Task [4 min]

### Speaking: Code Review Roleplay (pares)
**Student A (Senior):** Explain **one** code smell you see in this snippet. Use: *refactor, code smell, technical debt, SOLID, DRY, KISS, YAGNI*.
**Student B (Junior):** Ask one clarification question. Then summarize the advice in your own words.

```python
# Snippet for discussion
def process_user(u):
    db = connect()
    data = db.query("SELECT * FROM users WHERE id=" + u.id)
    email = data[0]['email']
    send_welcome(email)
    log("User processed")
    return True
```

**Expected output (Senior):** "This function has a **code smell** — it connects to DB, queries, sends email, and logs. **Refactor** into smaller functions. **Single Responsibility** — one function per job. **DRY** — the SQL string is hardcoded."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
Which principle says "each module should have one reason to change"?
| Slot | Value |
|------|-------|
| A | DRY |
| B | **Single Responsibility Principle** |
| C | YAGNI |
| D | KISS |
**Key:** B
**br_pt_form:** "Princípio da Responsabilidade Única"

### Item 2 — Grammar (L1, adaptive)
Choose the correct imperative for giving advice:
| Slot | Value |
|------|-------|
| A | **Refactor** this function. |
| B | Refactoring this function. |
| C | To refactor this function. |
| D | Refactored this function. |
**Key:** A
**br_pt_form:** "Refatore esta função."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_clean_code_basics_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_clean_code_basics",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text, the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table",
    "bibliography_only": [
      "docs/codigolimpo.md (BaixeLivros notice applies) - scoping of clean code vocabulary and examples",
      "docs/arquitetura-limpa.md (Alta Books, all rights reserved) - scoping of SOLID, DRY, KISS, YAGNI principles"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; vocabulary terms are unprotectable facts about the language"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.imperative_advice"
    ],
    "vocabulary": [
      "vocab.clean_code.refactor",
      "vocab.clean_code.code_smell",
      "vocab.clean_code.technical_debt",
      "vocab.clean_code.solid_srp",
      "vocab.clean_code.dry_yagni",
      "vocab.clean_code.boy_scout_rule"
    ],
    "listening": [
      "listening.clean_code_context"
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