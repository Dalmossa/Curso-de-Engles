# Lesson: Mentoring & Knowledge Transfer

**Lesson ID:** `les_b2_it_mentoring`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `adapt_with_attribution`
**Source:** S18 (opensource.guide, CC-BY-4.0), S07 (Google Code Review Guide, CC-BY-4.0) — `sourced_external_thin`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **mentoring** | mentoria | *orientação de experiente para menos experiente* |
| **knowledge transfer** | transferência de conhecimento | *passar know-how para outros* |
| **onboarding** | onboarding / integração | *processo de entrada de novos membros* |
| **shadowing** | shadowing / acompanhamento | *observar experiente trabalhando* |
| **pair programming** | programação em par | *dois devs no mesmo código* |
| **code review** | revisão de código | *feedback estruturado sobre código* |
| **documentation** | documentação | *registro escrito de decisões e processos* |
| **runbook** | runbook / manual de operação | *procedimentos operacionais* |
| **bus factor** | fator ônibus | *quantas pessoas podem sair antes de quebrar* |
| **single point of failure** | ponto único de falha | *pessoa/sistema crítico sem backup* |
| **cross-training** | treinamento cruzado | *equipe aprende habilidades uns dos outros* |
| **psychological safety** | segurança psicológica | *ambiente para errar e aprender* |

### Mini-texto (áudio: `deferred_render`)

> **Senior:** "**Mentoring** = accelerate growth. **Shadowing**: watch me debug, then you drive. **Pair programming**: 25 min each, switch driver."
>
> "**Knowledge transfer**: **code review** teaches patterns. **Documentation** captures decisions. **Runbook** for ops. **Onboarding** buddy for first 2 weeks."
>
> "**Bus factor**: if I'm hit by a bus, who knows this system? **Cross-training** reduces **single point of failure**. **Psychological safety** = ask questions without fear."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**Bus factor** measures:
| Slot | Value |
|------|-------|
| A | Team size |
| B | **How many people can leave before knowledge is lost** |
| C | Code complexity |
| D | Deployment frequency |
**Key:** B
**br_pt_form:** "fator ônibus / quantas podem sair antes de perder conhecimento"

### Item 2 — Vocabulary (Matching)
Match the mentoring activity to its purpose:
| Activity | Purpose |
|----------|---------|
| **Shadowing** | a. Observe expert working |
| **Pair programming** | b. Collaborate in real-time |
| **Code review** | c. Structured feedback |
| **Cross-training** | d. Learn others' skills |
**Key:** Shadowing→a, Pair programming→b, Code review→c, Cross-training→d
**br_pt_form:** "shadowing", "programação em par", "code review", "treinamento cruzado"

### Item 3 — Grammar: Modal verbs for mentoring advice (fill-in-blank)
Complete with **should / must / ought to**:
"You ______ ask questions early. Juniors ______ pair with seniors. Knowledge ______ be documented."
**Key:** should / should / must
**br_pt_form:** "devem", "devem", "deve"

---

## FASE 3 — Output Task [4 min]

### Speaking: Mentoring Session (pares)
**Student A (Senior):** Mentor a junior on debugging approach. Use: *mentoring, knowledge transfer, onboarding, shadowing, pair programming, code review, documentation, runbook, bus factor, single point of failure, cross-training, psychological safety*.
**Student B (Junior):** Ask questions. Take notes.

**Script:**
> "First, **shadow** me: I'll debug, you watch. Then **pair programming**: you drive, I navigate. **Code review** teaches patterns. **Document** your findings. **Bus factor** = 2 for this service. **Psychological safety**: no stupid questions."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Psychological safety** in mentoring means:
| Slot | Value |
|------|-------|
| A | No mistakes allowed |
| B | **Environment to ask questions and admit errors without fear** |
| C | Only positive feedback |
| D | No feedback at all |
**Key:** B
**br_pt_form:** "segurança psicológica / ambiente para errar e aprender"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **modal** for mentoring advice:
| Slot | Value |
|------|-------|
| A | You **can** ask questions. |
| B | You **should** ask questions. |
| C | You **might** ask questions. |
| D | You **could** ask questions. |
**Key:** B
**br_pt_form:** "Você deve fazer perguntas."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_mentoring_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_mentoring",
  "cefr_level": "B2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S18",
        "title": "opensource.guide - Mentoring",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "mentoring practices, knowledge transfer, bus factor, cross-training concepts; adapted for B2 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S07",
        "title": "Google Code Review Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "code review as mentoring tool, feedback patterns; terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Senior/Junior dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of mentoring register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; all sources CC-BY permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.modals_mentoring"
    ],
    "vocabulary": [
      "vocab.mentoring.mentoring",
      "vocab.mentoring.knowledge_transfer",
      "vocab.mentoring.onboarding",
      "vocab.mentoring.shadowing",
      "vocab.mentoring.pair_programming",
      "vocab.mentoring.code_review",
      "vocab.mentoring.documentation",
      "vocab.mentoring.runbook",
      "vocab.mentoring.bus_factor",
      "vocab.mentoring.single_point_of_failure",
      "vocab.mentoring.cross_training",
      "vocab.mentoring.psychological_safety"
    ],
    "listening": [
      "listening.mentoring_context"
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

---

## Fontes e Atribuição

- **S18** opensource.guide, licensed under CC-BY-4.0. Adapted for mentoring practices and knowledge transfer concepts.
- **S07** Google Code Review Guide, licensed under CC-BY-4.0. Referenced for code review as mentoring tool.