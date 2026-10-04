# Lesson: Incident Reports & Problem Statements

**Lesson ID:** `les_a2_it_incidents`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `adapt_with_attribution`
**Source:** S02 (Google Cloud Well-Architected, CC-BY-4.0), S15 (MDN Web Docs, CC-BY-SA-2.5) — `sourced_external`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **incident** | incidente | *evento que degrada serviço* |
| **severity** | severidade | *nível de impacto (SEV-1 a SEV-4)* |
| **root cause** | causa raiz | *origem fundamental do problema* |
| **mitigation** | mitigação | *ação para reduzir impacto* |
| **resolution** | resolução | *correção definitiva* |
| **postmortem** | postmortem | *análise após incidente (sem culpa)* |
| **runbook** | runbook / manual de operação | *passos padronizados de resposta* |
| **on-call** | de plantão | *pessoa responsável fora do horário* |
| **SLA** | SLA | *Service Level Agreement* |
| **impact** | impacto | *usuários/sistemas afetados* |

### Mini-texto (áudio: `deferred_render`)

> **On-call:** "We have a **SEV-2 incident**: payment API returning 504. **Impact**: 15% of checkouts failing. **Mitigation**: rolled back deploy v2.3.1 → v2.3.0. **Root cause** under investigation."
>
> **Lead:** "Update **runbook** step 3: add cache clear before rollback. **SLA**: restore 99.9% in 15 min. **On-call** owns communication."
>
> **Later:** "**Postmortem** scheduled Friday. Blameless. Timeline, impact, root cause, **action items** to prevent recurrence."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
**SEV-1** means:
| Slot | Value |
|------|-------|
| A | Low priority, cosmetic issue |
| B | **Critical outage, all hands on deck** |
| C | Scheduled maintenance |
| D | Documentation update |
**Key:** B
**br_pt_form:** "crítico, todos mobilizados"

### Item 2 — Vocabulary (Matching)
Match the incident phase to the action:
| Phase | Action |
|-------|--------|
| **Detection** | a. Roll back / apply workaround |
| **Mitigation** | b. Alert fires / on-call paged |
| **Resolution** | c. Deploy permanent fix |
| **Postmortem** | d. Write timeline, root cause, action items |
**Key:** Detection→b, Mitigation→a, Resolution→c, Postmortem→d
**br_pt_form:** "detecção", "mitigação", "resolução", "postmortem"

### Item 3 — Grammar: Past Simple for timeline (fill-in-blank)
Complete with **past simple**:
"At 14:00, the alert ______ (fire). The on-call ______ (wake) up. She ______ (rollback) the deploy. By 14:15, the service ______ (recover)."
**Key:** fired / woke / rolled back / recovered
**br_pt_form:** "disparou", "acordou", "fez rollback", "recuperou"

---

## FASE 3 — Output Task [4 min]

### Writing: Incident Summary (individual)
**Scenario:** You are the on-call. Write a **3-sentence incident summary** for the #incidents channel. Include:
- **Severity** (SEV-1/2/3/4)
- **Impact** (what % users, what feature)
- **Mitigation** (what you did)
- **Current status** (investigating / resolved / monitoring)

**Template:**
```
🚨 INCIDENT SEV-X — [Service/Feature]

Impact: X% of users unable to [action].

Mitigation: [what you did — rollback, config change, scale up].

Status: [investigating | resolved | monitoring].

Root cause: [if known] / under investigation.

Postmortem: [date] — blameless.
```

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Blameless postmortem** means:
| Slot | Value |
|------|-------|
| A | No one writes a report |
| B | **Focus on system, not person — prevent recurrence** |
| C | Blame the on-call engineer |
| D | Skip the analysis |
**Key:** B
**br_pt_form:** "sem culpar pessoas, focar no sistema"

### Item 2 — Grammar (L1, adaptive)
Choose the correct past simple for a timeline event:
| Slot | Value |
|------|-------|
| A | The deploy **failed** at 14:00. |
| B | The deploy **fail** at 14:00. |
| C | The deploy **failing** at 14:00. |
| D | The deploy **fails** at 14:00. |
**Key:** A
**br_pt_form:** "O deploy falhou às 14:00."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_incidents_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_incidents",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S02",
        "title": "Google Cloud Well-Architected Framework - Reliability Pillar",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "incident response terminology (severity levels, mitigation, runbook, on-call, SLA, blameless postmortem); framework concepts adapted for A2 level",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S15",
        "title": "MDN Web Docs - HTTP Status Codes / Error Handling",
        "licence": "CC-BY-SA-2.5",
        "what_was_adapted": "5xx error context (504 Gateway Timeout), technical vocabulary for incident reporting; terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below",
        "share_alike_note": "Lesson material authored, not quoted; source cited as background per external-sources.md §7.2"
      }
    ],
    "authored_material": "all exercises, the mini-text (incident chat simulation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task template",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of incident report register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; CC-BY-SA managed per external-sources.md §7.2"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.past_simple_timeline"
    ],
    "vocabulary": [
      "vocab.incident.incident",
      "vocab.incident.severity",
      "vocab.incident.root_cause",
      "vocab.incident.mitigation",
      "vocab.incident.resolution",
      "vocab.incident.postmortem",
      "vocab.incident.runbook",
      "vocab.incident.on_call",
      "vocab.incident.sla",
      "vocab.incident.impact"
    ],
    "listening": [
      "listening.incident_context"
    ],
    "pronunciation": [
      "pronunciation.acronyms"
    ],
    "writing": [
      "writing.incident_summary"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```

---

## Fontes e Atribuição

- **S02** Google Cloud Well-Architected Framework, Reliability Pillar, licensed under CC-BY-4.0. Adapted for incident response vocabulary and concepts.
- **S15** MDN Web Docs, licensed under CC-BY-SA-2.5. Referenced for HTTP 5xx error context and terminology.