# Lesson: Case Study Presentation

**Lesson ID:** `les_b1_project_case_study`
**Module:** `mod_b1_fluency_project`
**CEFR:** B1
**Reuse basis:** `adapt_with_attribution`
**Source:** S01 (Google Style Guide, CC-BY-4.0), S05 (Google Cloud Well-Architected, CC-BY-4.0), S10 (Google Testing, CC-BY-4.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **case study** | estudo de caso | *análise detalhada de projeto real* |
| **presentation** | apresentação | *exposição oral com slides* |
| **background** | contexto / histórico | *situação inicial do projeto* |
| **challenge** | desafio | *problema a resolver* |
| **approach** | abordagem / solução | *como resolveu* |
| **outcome** | resultado / desfecho | *o que foi alcançado* |
| **metric** | métrica | *número que mede sucesso* |
| **lesson learned** | lição aprendida | *insight para futuros projetos* |
| **stakeholder** | parte interessada | *quem tem interesse no resultado* |
| **timeline** | cronograma | *sequência temporal do projeto* |
| **scope** | escopo | *o que está incluído/excluído* |
| **trade-off** | troca / compensação | *ganha aqui, perde ali* |

### Mini-texto (áudio: `deferred_render`)

> **Presenter:** "**Background**: legacy monolith, 2yr old, 500k LOC. **Challenge**: deploy takes 2hr, 30% fail rate."
>
> "**Approach**: strangler fig — extract **services** incrementally. **Scope**: payments first. **Timeline**: 6 months, 3 sprints per service."
>
> "**Outcome**: deploy 5min, fail rate <1%. **Metric**: MTTR 45min → 5min. **Lesson learned**: invest in **contract tests** early. **Trade-off**: short-term velocity for long-term autonomy."
>
> "**Stakeholders**: engineering, product, ops — aligned via **RFC** process."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
A **case study** presentation focuses on:
| Slot | Value |
|------|-------|
| A | Future plans only |
| B | **Real project: background, challenge, approach, outcome** |
| C | Team bios |
| D | Technology stack only |
**Key:** B
**br_pt_form:** "estudo de caso real: contexto, desafio, abordagem, resultado"

### Item 2 — Vocabulary (Matching)
Match the section to its content:
| Section | Content |
|---------|---------|
| **Background** | a. What was achieved (metrics) |
| **Challenge** | b. Problem to solve |
| **Approach** | c. How you solved it |
| **Outcome** | d. Context before project |
**Key:** Background→d, Challenge→b, Approach→c, Outcome→a
**br_pt_form:** "contexto", "desafio", "abordagem", "resultado"

### Item 3 — Grammar: Past simple + present perfect for results (fill-in-blank)
Complete with **past simple** or **present perfect**:
"We ______ (complete) the migration last month. Since then, deploy time ______ (drop) from 2hr to 5min. The team ______ (learn) to write contract tests."
**Key:** completed / has dropped / has learned
**br_pt_form:** "completou", "caiu", "aprendeu"

---

## FASE 3 — Output Task [4 min]

### Speaking: Mini Case Study (individual)
**Scenario:** Present a 2-minute case study for a project you worked on (real or fictional). Structure:

1. **Background** (30s): context, legacy state
2. **Challenge** (30s): problem, pain points
3. **Approach** (30s): solution, scope, timeline
4. **Outcome** (30s): metrics, lessons, trade-offs

**Use vocabulary:** *background, challenge, approach, outcome, metric, lesson learned, stakeholder, timeline, scope, trade-off*.

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Lesson learned** in a case study is:
| Slot | Value |
|------|-------|
| A | A complaint |
| B | **Insight for future projects** |
| C | A bug report |
| D | A feature request |
**Key:** B
**br_pt_form:** "lição aprendida / insight para futuros projetos"

### Item 2 — Grammar (L1, adaptive)
Choose the correct tense for a result since completion:
| Slot | Value |
|------|-------|
| A | Deploy time **dropped** 90% since launch. |
| B | Deploy time **has dropped** 90% since launch. |
| C | Deploy time **drops** 90% since launch. |
| D | Deploy time **dropping** 90% since launch. |
**Key:** B
**br_pt_form:** "O tempo de deploy caiu 90% desde o lançamento."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_project_case_study_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_project_case_study",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S01",
        "title": "Google Developer Documentation Style Guide",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "presentation structure, metric-driven narrative, technical storytelling",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S05",
        "title": "Google Cloud Well-Architected Framework",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "case study format: background, challenge, approach, outcome, metrics",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S10",
        "title": "Google Testing Documentation",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "lessons learned format, trade-off documentation",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (presenter script), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of case study presentation register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; all sources CC-BY permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.past_present_perfect_results"
    ],
    "vocabulary": [
      "vocab.project.case_study",
      "vocab.project.background",
      "vocab.project.challenge",
      "vocab.project.approach",
      "vocab.project.outcome",
      "vocab.project.metric",
      "vocab.project.lesson_learned",
      "vocab.project.stakeholder",
      "vocab.project.timeline",
      "vocab.project.scope",
      "vocab.project.trade_off"
    ],
    "listening": [
      "listening.project_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication",
    "les_b1_it_technical"
  ],
  "estimated_time_min": 15
}
```

---

## Fontes e Atribuição

- **S01** Google Developer Documentation Style Guide, licensed under CC-BY-4.0. Adapted for presentation structure and technical storytelling.
- **S05** Google Cloud Well-Architected Framework, licensed under CC-BY-4.0. Adapted for case study format and metrics-driven narrative.
- **S10** Google Testing Documentation, licensed under CC-BY-4.0. Adapted for lessons learned and trade-off documentation.