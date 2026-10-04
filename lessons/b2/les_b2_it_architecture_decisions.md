# Lesson: Architecture Decision Records

**Lesson ID:** `les_b2_it_architecture_decisions`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `adapt_with_attribution`
**Source:** S03 (CC0-1.0), S04 (MIT), S05 (Google Cloud Well-Architected, CC-BY-4.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **Architecture Decision Record (ADR)** | Registro de Decisão de Arquitetura | *documento que captura decisão e contexto* |
| **context** | contexto | *situação que motivou a decisão* |
| **decision** | decisão | *o que foi escolhido* |
| **consequences** | consequências | *impactos positivos e negativos* |
| **alternatives** | alternativas | *outras opções consideradas* |
| **status** | status | *proposed / accepted / deprecated / superseded* |
| **rationale** | justificativa / raciocínio | *por que esta decisão* |
| **trade-off** | troca / compensação | *ganha aqui, perde ali* |
| **immutability** | imutabilidade | *ADRs não são editados, apenas substituídos* |
| **supersede** | substituir | *nova decisão substitui anterior* |
| **deprecated** | depreciado | *decisão não mais válida* |
| **lightweight** | leve / simplificado | *formato curto e direto* |

### Mini-texto (áudio: `deferred_render`)

> **Architect:** "**ADR** format: **Title**, **Status**, **Context**, **Decision**, **Consequences**. **Immutable** — never edit, **supersede** with new ADR."
>
> "**ADR-042**: Use event-driven architecture. **Context**: need loose coupling. **Decision**: Kafka for async. **Consequences**: +scalability, -complexity. **Alternatives**: REST polling (rejected: latency), RabbitMQ (rejected: ops overhead)."
>
> "**Status**: accepted. **Rationale**: team has Kafka experience. **Trade-off**: operational complexity for scalability."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
An **ADR** is:
| Slot | Value |
|------|-------|
| A | A code review comment |
| B | **A lightweight document capturing a decision and its context** |
| C | A project plan |
| D | A bug report |
**Key:** B
**br_pt_form:** "ADR / documento leve com decisão e contexto"

### Item 2 — Vocabulary (Matching)
Match the ADR field to its content:
| Field | Content |
|-------|---------|
| **Context** | a. Situation motivating decision |
| **Decision** | b. What was chosen |
| **Consequences** | c. Positive/negative impacts |
| **Status** | d. Proposed/accepted/deprecated |
**Key:** Context→a, Decision→b, Consequences→c, Status→d
**br_pt_form:** "contexto", "decisão", "consequências", "status"

### Item 3 — Grammar: Passive for ADR writing (fill-in-blank)
Write in **passive voice** (ADR style):
"Kafka ______ (choose) for messaging. REST polling ______ (reject) due to latency. The decision ______ (document) in ADR-042."
**Key:** was chosen / was rejected / is documented
**br_pt_form:** "foi escolhido", "foi rejeitado", "é documentado"

---

## FASE 3 — Output Task [4 min]

### Writing: ADR Draft (individual)
**Write an ADR** for: "Use PostgreSQL instead of MongoDB for orders service."

**Template:**
```
# ADR-XXX: Use PostgreSQL for Orders Service

## Status
Accepted

## Context
Need ACID transactions for order + payment consistency. Team has SQL expertise.

## Decision
Use PostgreSQL with JSONB for flexible order items.

## Consequences
+ ACID compliance
+ Team familiarity
- Less flexible schema than MongoDB
- Vertical scaling limits

## Alternatives Considered
- MongoDB (rejected: no multi-doc transactions)
- CockroachDB (rejected: operational complexity)
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Immutable** ADRs means:
| Slot | Value |
|------|-------|
| A | Cannot be read |
| B | **Cannot be edited; superseded by new ADR** |
| C | Cannot be deleted |
| D | Cannot be shared |
**Key:** B
**br_pt_form:** "imutável / não editável, substituído por novo ADR"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **passive** for ADR:
| Slot | Value |
|------|-------|
| A | The team **chose** Kafka. |
| B | Kafka **was chosen** by the team. |
| C | Kafka **is choosing** by the team. |
| D | Kafka **chosen** by the team. |
**Key:** B
**br_pt_form:** "Kafka foi escolhido pela equipe."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_architecture_decisions_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_architecture_decisions",
  "cefr_level": "B2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S03",
        "title": "Architecture Decision Records (ADR) - adr.github.io",
        "licence": "CC0-1.0",
        "what_was_adapted": "ADR format, immutability principle, status lifecycle; adapted for B2 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S04",
        "title": "MADR - Markdown ADR",
        "licence": "MIT",
        "what_was_adapted": "lightweight ADR template, rationale field; format only",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S05",
        "title": "Google Cloud Well-Architected Framework",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "trade-off analysis, decision documentation patterns; terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Architect explanation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task template",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of architecture decision register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - ADR format adapted, not quoted; CC0/MIT sources permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing"],
  "skill_items": {
    "grammar": [
      "grammar.passive_adr"
    ],
    "vocabulary": [
      "vocab.adr.adr",
      "vocab.adr.context",
      "vocab.adr.decision",
      "vocab.adr.consequences",
      "vocab.adr.alternatives",
      "vocab.adr.status",
      "vocab.adr.rationale",
      "vocab.adr.trade_off",
      "vocab.adr.immutability",
      "vocab.adr.supersede",
      "vocab.adr.deprecated",
      "vocab.adr.lightweight"
    ],
    "listening": [
      "listening.adr_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.adr"
    ],
    "writing": [
      "writing.adr"
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

- **S03** adr.github.io, licensed under CC0-1.0. Adapted for ADR format and immutability principle.
- **S04** MADR, licensed under MIT. Adapted for lightweight ADR template.
- **S05** Google Cloud Well-Architected Framework, licensed under CC-BY-4.0. Referenced for trade-off analysis patterns.