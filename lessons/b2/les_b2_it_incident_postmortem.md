# Lesson: Incident Postmortems

**Lesson ID:** `les_b2_it_incident_postmortem`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `adapt_with_attribution`
**Source:** S02 (Google Cloud Well-Architected, CC-BY-4.0) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **postmortem** | postmortem | *análise retrospectiva após incidente* |
| **blameless** | sem culpar | *foco no sistema, não na pessoa* |
| **timeline** | linha do tempo / cronologia | *sequência cronológica de eventos* |
| **root cause** | causa raiz | *origem fundamental do incidente* |
| **contributing factors** | fatores contribuintes | *condições que agravaram* |
| **detection** | detecção | *como o incidente foi descoberto* |
| **mitigation** | mitigação | *ações para reduzir impacto* |
| **resolution** | resolução | *como foi corrigido* |
| **action items** | itens de ação | *tarefas para prevenir recorrência* |
| **follow-up** | acompanhamento | *verificar se ações foram concluídas* |
| **severity** | severidade | *nível de impacto (SEV-1 a SEV-4)* |
| **MTTR** | MTTR | *Mean Time To Recovery* |

### Mini-texto (áudio: `deferred_render`)

> **Lead:** "**Postmortem** for SEV-2. **Blameless** — focus on system, not people."
>
> "**Timeline**: 14:00 alert fired. 14:02 on-call paged. 14:05 rollback initiated. 14:10 service restored. **MTTR**: 10 min."
>
> "**Root cause**: missing DB index. **Contributing factors**: no query review, no load test. **Detection**: alert (good). **Mitigation**: rollback (effective). **Resolution**: index added."
>
> "**Action items**: 1) Add index. 2) Query review checklist. 3) Load test before deploy. **Follow-up**: 2 weeks."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
A **blameless postmortem** focuses on:
| Slot | Value |
|------|-------|
| A | Who to blame |
| B | **System improvements, not human error** |
| C | Legal liability |
| D | Hiding the incident |
**Key:** B
**br_pt_form:** "sem culpar / melhorias no sistema"

### Item 2 — Vocabulary (Matching)
Match the postmortem section to its content:
| Section | Content |
|---------|---------|
| **Timeline** | a. Chronological event sequence |
| **Root cause** | b. Fundamental origin |
| **Contributing factors** | c. Conditions that worsened |
| **Action items** | d. Tasks to prevent recurrence |
**Key:** Timeline→a, Root cause→b, Contributing factors→c, Action items→d
**br_pt_form:** "cronologia", "causa raiz", "fatores contribuintes", "itens de ação"

### Item 3 — Grammar: Past perfect for timeline (fill-in-blank)
Complete with **past perfect**:
"By the time the alert fired, the deploy ______ (already complete). The on-call ______ (not receive) training on this service."
**Key:** had already completed / had not received
**br_pt_form:** "já tinha completado / não tinha recebido"

---

## FASE 3 — Output Task [4 min]

### Writing: Postmortem Document (individual)
**Write a postmortem** for: "Payment API 500 errors for 30 minutes."

**Include:**
- **Title**: SEV-X — Service — Date
- **Summary**: 1 paragraph
- **Timeline**: 5-10 events
- **Root cause**: 1-2 sentences
- **Contributing factors**: 2-3 items
- **Detection/Mitigation/Resolution**: 1 sentence each
- **Action items**: 3 items with owner + deadline
- **Lessons learned**: 2-3 insights

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Contributing factors** in a postmortem:
| Slot | Value |
|------|-------|
| A | Are the main cause |
| B | **Conditions that worsened the incident** |
| C | Are always human error |
| D | Are optional to document |
**Key:** B
**br_pt_form:** "fatores contribuintes / condições que agravaram"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **past perfect** for a timeline:
| Slot | Value |
|------|-------|
| A | The deploy **completed** before the alert fired. |
| B | The deploy **had completed** before the alert fired. |
| C | The deploy **has completed** before the alert fired. |
| D | The deploy **completing** before the alert fired. |
**Key:** B
**br_pt_form:** "O deploy tinha completado antes do alerta disparar."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_incident_postmortem_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_incident_postmortem",
  "cefr_level": "B2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S02",
        "title": "Google Cloud Well-Architected Framework - Reliability Pillar",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "blameless postmortem format, timeline structure, root cause analysis, action items, contributing factors; adapted for B2 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (Lead explanation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of incident postmortem register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - postmortem format adapted, not quoted; CC-BY source permissive"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing"],
  "skill_items": {
    "grammar": [
      "grammar.past_perfect_timeline"
    ],
    "vocabulary": [
      "vocab.postmortem.postmortem",
      "vocab.postmortem.blameless",
      "vocab.postmortem.timeline",
      "vocab.postmortem.root_cause",
      "vocab.postmortem.contributing_factors",
      "vocab.postmortem.detection",
      "vocab.postmortem.mitigation",
      "vocab.postmortem.resolution",
      "vocab.postmortem.action_items",
      "vocab.postmortem.follow_up",
      "vocab.postmortem.severity",
      "vocab.postmortem.mttr"
    ],
    "listening": [
      "listening.postmortem_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ],
    "reading": [
      "reading.postmortem"
    ],
    "writing": [
      "writing.postmortem"
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

- **S02** Google Cloud Well-Architected Framework, Reliability Pillar, licensed under CC-BY-4.0. Adapted for blameless postmortem format and incident analysis structure.