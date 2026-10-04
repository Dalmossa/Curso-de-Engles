# Lesson: Writing RFCs & Design Docs

**Lesson ID:** `les_b2_it_rfc_writing`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `adapt_with_attribution`
**Source:** S17 (Kubernetes Enhancement Proposals, Apache-2.0), S01 (Google Style Guide, CC-BY-4.0) + RFC 2119/8174 (IETF TLP, quote-only) — `sourced_external_thin`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **RFC** | RFC / Request for Comments | *proposta formal de mudança* |
| **design doc** | documento de design | *especificação técnica detalhada* |
| **KEP** | KEP / Kubernetes Enhancement Proposal | *proposta de melhoria para K8s* |
| **problem statement** | declaração do problema | *o que se quer resolver* |
| **goals** | objetivos | *o que se quer alcançar* |
| **non-goals** | não-objetivos | *o que explicitamente não se quer* |
| **proposal** | proposta | *solução proposta* |
| **alternatives** | alternativas | *outras opções consideradas* |
| **implementation plan** | plano de implementação | *como executar* |
| **rollout plan** | plano de rollout | *como lançar* |
| **success criteria** | critérios de sucesso | *como medir se funcionou* |
| **open questions** | perguntas em aberto | *incertezas a resolver* |

### Mini-texto (áudio: `deferred_render`)

> **Author:** "**RFC**: *Add idempotency keys to Payment API*. **Problem statement**: duplicate charges on retry. **Goals**: prevent double charge, idempotent API. **Non-goals**: refund automation."
>
> "**Proposal**: `Idempotency-Key` header, store key+result 24h. **Alternatives**: client dedup (rejected: unreliable), DB unique constraint (rejected: race condition)."
>
> "**Implementation plan**: 1) Middleware. 2) Storage. 3) Tests. **Rollout**: canary 5% → 100%. **Success criteria**: 0 duplicate charges. **Open questions**: key expiration policy?"

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**Non-goals** in an RFC:
| Slot | Value |
|------|-------|
| A | Are hidden requirements |
| B | **Explicitly state what is out of scope** |
| C | Are optional |
| D | Are the same as goals |
**Key:** B
**br_pt_form:** "não-objetivos / explicitamente fora de escopo"

### Item 2 — Vocabulary (Matching)
Match the RFC section to its purpose:
| Section | Purpose |
|---------|---------|
| **Problem statement** | a. What to solve |
| **Goals** | b. What to achieve |
| **Non-goals** | c. What NOT to achieve |
| **Success criteria** | d. How to measure success |
**Key:** Problem statement→a, Goals→b, Non-goals→c, Success criteria→d
**br_pt_form:** "declaração do problema", "objetivos", "não-objetivos", "critérios de sucesso"

### Item 3 — Grammar: Modal verbs for requirements (RFC 2119) (fill-in-blank)
Complete with **MUST / SHOULD / MAY**:
"The API ______ (must) validate the key. Clients ______ (should) retry with same key. The key ______ (may) expire after 24h."
**Key:** must / should / may
**br_pt_form:** "deve / devem / podem"

---

## FASE 3 — Output Task [4 min]

### Writing: RFC Section (individual)
**Write the Problem Statement + Goals + Non-Goals** for: "Add rate limiting to public API."

**Template:**
```
## Problem Statement
[2-3 sentences: what problem, who is affected, why it matters]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Non-Goals
- [ ] Non-goal 1
- [ ] Non-goal 2
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Open questions** in an RFC:
| Slot | Value |
|------|-------|
| A | Are answered immediately |
| B | **Uncertainties to resolve before/during implementation** |
| C | Are optional |
| D | Are the same as goals |
**Key:** B
**br_pt_form:** "perguntas em aberto / incertezas a resolver"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **modal** for an RFC requirement:
| Slot | Value |
|------|-------|
| A | The API **can** validate the key. |
| B | The API **should** validate the key. |
| C | The API **must** validate the key. |
| D | The API **might** validate the key. |
**Key:** C
**br_pt_form:** "A API deve validar a chave."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_rfc_writing_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_rfc_writing",
  "cefr_level": "B2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S17",
        "title": "Kubernetes Enhancement Proposals (KEP)",
        "licence": "Apache-2.0",
        "what_was_adapted": "RFC/KEP structure: problem statement, goals, non-goals, proposal, implementation plan, rollout plan, success criteria, open questions; adapted for B2 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S01",
        "title": "Google Developer Documentation Style Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "technical writing style, clarity, conciseness; terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "RFC 2119/8174",
        "title": "IETF RFC 2119/8174 - Key words for use in RFCs",
        "licence": "IETF TLP (quote-only)",
        "what_was_adapted": "MUST/SHOULD/MAY normative keywords; quoted verbatim per IETF TLP, pending legal opinion per external-sources.md §7.3",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Author explanation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of RFC/design doc register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - RFC structure adapted, not quoted; RFC 2119 keywords quoted per IETF TLP"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing"],
  "skill_items": {
    "grammar": [
      "grammar.modals_requirements"
    ],
    "vocabulary": [
      "vocab.rfc.rfc",
      "vocab.rfc.design_doc",
      "vocab.rfc.kep",
      "vocab.rfc.problem_statement",
      "vocab.rfc.goals",
      "vocab.rfc.non_goals",
      "vocab.rfc.proposal",
      "vocab.rfc.alternatives",
      "vocab.rfc.implementation_plan",
      "vocab.rfc.rollout_plan",
      "vocab.rfc.success_criteria",
      "vocab.rfc.open_questions"
    ],
    "listening": [
      "listening.rfc_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.rfc"
    ],
    "writing": [
      "writing.rfc"
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

---

## Fontes e Atribuição

- **S17** Kubernetes Enhancement Proposals, licensed under Apache-2.0. Adapted for RFC/KEP structure and sections.
- **S01** Google Developer Documentation Style Guide, licensed under CC-BY-4.0. Referenced for technical writing style.
- **RFC 2119/8174** IETF, licensed under IETF TLP (quote-only). Normative keywords MUST/SHOULD/MAY quoted verbatim. Legal opinion pending per `external-sources.md` §7.3.