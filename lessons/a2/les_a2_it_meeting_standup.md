# Lesson: Stand-ups & Technical Meetings

**Lesson ID:** `les_a2_it_meeting_standup`
**Module:** `mod_a2_it_communication`
**CEFR:** A2
**Reuse basis:** `adapt_with_attribution`
**Source:** S19 (Scrum Guide 2020, CC-BY-SA-4.0), S12 (Google Engineering Practices, CC-BY-3.0), S16 (Kubernetes docs, CC-BY-4.0) — `sourced_external_thin`
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **stand-up** | daily / reunião diária em pé | *reunião curta de sincronização (15 min)* |
| **yesterday** | ontem | *o que completei* |
| **today** | hoje | *o que vou fazer* |
| **blocker** | impedimento / bloqueio | *o que me trava — peço ajuda* |
| **sprint** | sprint | *iteração de 1–2 semanas* |
| **board** | board / quadro | *Kanban / Scrum board com colunas* |
| **ticket** | ticket / issue | *unidade de trabalho (Jira, GitHub Issues)* |
| **done** | pronto / concluído | *Definition of Done atendida* |
| **carry over** | levar para próxima sprint | *item não finalizado* |
| **parking lot** | estacionamento / depois | *tópico fora do stand-up, discutir depois* |

### Mini-texto (áudio: `deferred_render`)

> **Scrum Master:** "Good morning. **Stand-up** — 15 minutes. **Yesterday**, **today**, **blockers**."
>
> **Dev 1:** "Yesterday: finished **ticket** FEAT-401 (login fix). Today: start FEAT-402 (password reset). **Blocker**: waiting for **API** contract from backend."
>
> **Dev 2:** "Yesterday: code review for PR #234. Today: deploy to staging. No blockers."
>
> **Scrum Master:** "API contract — **parking lot**. Backend lead, sync after stand-up. **Board** updated? Good. **Sprint** goal: release candidate by Friday."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
What is the **stand-up** timebox?
| Slot | Value |
|------|-------|
| A | 30 minutes |
| B | **15 minutes** |
| C | 45 minutes |
| D | 1 hour |
**Key:** B
**br_pt_form:** "15 minutos"

### Item 2 — Vocabulary (Matching)
Match the stand-up answer to the prompt:
| Prompt | Answer |
|--------|--------|
| **Yesterday** | a. "I'll start the new endpoint." |
| **Today** | b. "Finished the login bug." |
| **Blocker** | c. "Waiting for design approval." |
**Key:** Yesterday→b, Today→a, Blocker→c
**br_pt_form:** "ontem", "hoje", "bloqueio"

### Item 3 — Grammar: Present Perfect for completed work (fill-in-blank)
Complete with **present perfect**:
"I ______ (finish) the migration. She ______ (review) the PR. We ______ (not start) the new task yet."
**Key:** have finished / has reviewed / have not started
**br_pt_form:** "terminei", "revisou", "não começamos"

---

## FASE 3 — Output Task [4 min]

### Speaking: Stand-up Simulation (grupo de 3–4)
**Roles:** Scrum Master, Dev 1, Dev 2, (Dev 3)
**Each person gives 30-second update:**
- **Yesterday:** one concrete item (ticket ID + what)
- **Today:** one concrete item
- **Blocker:** specific, actionable, or "none"

**Scrum Master:** Timeboxes 15 min. Moves deep discussions to **parking lot**.

**Example:**
> "Yesterday: closed **ticket** BUG-777 (memory leak). Today: write tests for **ticket** FEAT-888. Blocker: need **staging** access — **parking lot** with infra."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Carry over** means:
| Slot | Value |
|------|-------|
| A | Finish early |
| B | **Move unfinished work to next sprint** |
| C | Skip the stand-up |
| D | Cancel the sprint |
**Key:** B
**br_pt_form:** "levar para a próxima sprint"

### Item 2 — Grammar (L1, adaptive)
Choose the correct present perfect:
| Slot | Value |
|------|-------|
| A | I **have finished** the task. |
| B | I **finished** the task. |
| C | I **am finishing** the task. |
| D | I **finish** the task. |
**Key:** A
**br_pt_form:** "Eu terminei a tarefa."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_meeting_standup_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_meeting_standup",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "adapt_with_attribution",
    "adapted_sources": [
      {
        "id": "S19",
        "title": "The Scrum Guide 2020",
        "licence": "CC-BY-SA-4.0",
        "what_was_adapted": "stand-up structure (yesterday/today/blockers), 15-min timebox, Scrum Master role, Definition of Done reference; adapted for A2 level, not quoted",
        "attribution_location": "section 'Fontes e Atribuição' below",
        "share_alike_note": "Lesson material authored, not quoted; source cited as background per external-sources.md §7.2 recommendation"
      },
      {
        "id": "S12",
        "title": "Google Engineering Practices - Code Review",
        "licence": "CC-BY-3.0",
        "what_was_adapted": "stand-up as coordination ritual, blocker escalation pattern; framing only",
        "attribution_location": "section 'Fontes e Atribuição' below"
      },
      {
        "id": "S16",
        "title": "Kubernetes Documentation - Contributing",
        "licence": "CC-BY-4.0",
        "what_was_adapted": "technical stand-up vocabulary (ticket, board, carry over, parking lot); terminology only",
        "attribution_location": "section 'Fontes e Atribuição' below"
      }
    ],
    "authored_material": "all exercises, the mini-text (stand-up simulation), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/Ingles-Tecnico-Para-Informatica.md (CETAM, all rights reserved) - scoping of meeting register"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - terminology adapted, not quoted; Scrum Guide CC-BY-SA managed per external-sources.md §7.2 (author and cite rather than adapt)"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.present_perfect_completed"
    ],
    "vocabulary": [
      "vocab.meeting.standup",
      "vocab.meeting.yesterday",
      "vocab.meeting.today",
      "vocab.meeting.blocker",
      "vocab.meeting.sprint",
      "vocab.meeting.board",
      "vocab.meeting.ticket",
      "vocab.meeting.done",
      "vocab.meeting.carry_over",
      "vocab.meeting.parking_lot"
    ],
    "listening": [
      "listening.standup_context"
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

---

## Fontes e Atribuição

- **S19** The Scrum Guide 2020, licensed under CC-BY-SA-4.0. Adapted for structure and terminology; lesson material is original.
- **S12** Google Engineering Practices, licensed under CC-BY-3.0. Referenced for coordination patterns.
- **S16** Kubernetes Documentation, licensed under CC-BY-4.0. Referenced for technical vocabulary.