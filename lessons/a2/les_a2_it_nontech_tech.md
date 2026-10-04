# Lesson: Tech for Non-Technical Colleagues

**Lesson ID:** `les_a2_it_nontech_tech`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **explain like I'm 5** | explique como se eu tivesse 5 anos | *simplificação extrema* |
| **analogy** | analogia | *comparação para explicar conceito técnico* |
| **jargon** | jargão / termo técnico | *vocabulário especializado* |
| **layperson** | leigo | *pessoa sem formação técnica* |
| **high level** | alto nível / visão geral | *sem detalhes de implementação* |
| **drill down** | aprofundar / detalhar | *ir do geral para o específico* |
| **business impact** | impacto no negócio | *efeito em receita, clientes, prazo* |
| **trade-off** | troca / compensação | *ganha aqui, perde ali* |
| **scope** | escopo | *o que está incluído / excluído* |
| **stakeholder** | parte interessada | *quem é afetado pela decisão* |

### Mini-texto (áudio: `deferred_render`)

> **PM:** "Can you **explain like I'm 5** why the migration takes two weeks?"
>
> **Dev:** "Sure. **Analogy**: our database is a library. We're moving every book to a new building **high level** — new shelves, new catalog. **Jargon**: we rewrite the **schema**, rebuild **indexes**, verify **constraints**. **Business impact**: zero downtime, but read-only for 4 hours Saturday. **Trade-off**: speed vs. safety. **Scope**: users table only this sprint. **Stakeholders**: sales, support, infra."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**Explain like I'm 5** means:
| Slot | Value |
|------|-------|
| A | Use maximum technical jargon |
| B | **Simplify to the extreme, no jargon** |
| C | Explain to a child |
| D | Write documentation for 5-year-olds |
**Key:** B
**br_pt_form:** "explique como se eu tivesse 5 anos"

### Item 2 — Vocabulary (Matching)
Match the term to when you'd use it:
| Term | Situation |
|------|-----------|
| **high level** | a. "We're migrating the database." |
| **drill down** | b. "The index rebuild uses B-tree..." |
| **business impact** | c. "Revenue drops 20% if delayed." |
| **trade-off** | c. "Faster but less safe." |
**Key:** high level→a, drill down→b, business impact→c, trade-off→d
**br_pt_form:** "alto nível", "aprofundar", "impacto no negócio", "troca"

### Item 3 — Grammar: Modal verbs for recommendation (fill-in-blank)
Complete with **should / shouldn't / must / mustn't**:
"You ______ use jargon with stakeholders. You ______ give a high-level summary first. You ______ drill down if they ask. You ______ promise dates without engineering input."
**Key:** shouldn't / should / should / mustn't
**br_pt_form:** "não deve", "deve", "deve", "não deve"

---

## FASE 3 — Output Task [4 min]

### Speaking: Translation Exercise (pares)
**Student A (Dev):** Explain **one** technical concept to a non-technical PM. Use: *explain like I'm 5, analogy, high level, business impact, trade-off, scope, stakeholder*.
**Student B (PM):** Ask 2 clarifying questions. Summarize back in your own words.

**Concepts to choose from:**
- Database migration
- API rate limiting
- CI/CD pipeline
- Microservices vs monolith
- Technical debt

**Example (Dev):** "**High level**: we're splitting the big app into small services. **Analogy**: like replacing one big kitchen with food trucks — each does one thing well. **Business impact**: faster features, but **trade-off**: more complexity to operate. **Scope**: payments service first."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Jargon** is:
| Slot | Value |
|------|-------|
| A | Simple everyday language |
| B | **Specialized technical vocabulary** |
| C | A programming language |
| D | A type of bug |
**Key:** B
**br_pt_form:** "jargão técnico"

### Item 2 — Grammar (L1, adaptive)
Choose the correct modal for strong recommendation:
| Slot | Value |
|------|-------|
| A | You **can** avoid jargon with stakeholders. |
| B | You **should** avoid jargon with stakeholders. |
| C | You **might** avoid jargon with stakeholders. |
| D | You **could** avoid jargon with stakeholders. |
**Key:** B
**br_pt_form:** "Você deve evitar jargão com stakeholders."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_nontech_tech_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_nontech_tech",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (PM/Dev dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Dicionario-de-Siglas-e-Termos-Profissionais-em-Ingles.md (BaixeLivros notice applies) - scoping of business/technical bridge vocabulary"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; vocabulary terms are unprotectable facts about professional communication"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.modals_recommendation"
    ],
    "vocabulary": [
      "vocab.nontech.explain_like_5",
      "vocab.nontech.analogy",
      "vocab.nontech.jargon",
      "vocab.nontech.layperson",
      "vocab.nontech.high_level",
      "vocab.nontech.drill_down",
      "vocab.nontech.business_impact",
      "vocab.nontech.trade_off",
      "vocab.nontech.scope",
      "vocab.nontech.stakeholder"
    ],
    "listening": [
      "listening.nontech_context"
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