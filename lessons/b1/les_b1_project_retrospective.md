# Lesson: Retrospective & Post-mortem Talk

**Lesson ID:** `les_b1_project_retrospective`
**Module:** `mod_b1_fluency_project`
**CEFR:** B1
**Reuse basis:** `cite_only`
**Source:** `docs/frases-ingles-trabalho.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **retrospective** | retrospectiva | *reunião de melhoria contínua* |
| **post-mortem** | postmortem | *análise sem culpa após incidente* |
| **what went well** | o que foi bem | *sucessos a manter* |
| **what didn't go well** | o que não foi bem | *problemas a melhorar* |
| **action item** | item de ação | *tarefa concreta com dono e prazo* |
| **blameless** | sem culpar | *foco no sistema, não na pessoa* |
| **root cause** | causa raiz | *origem fundamental* |
| **follow-up** | acompanhamento | *verificar se ação foi feita* |
| **sprint** | sprint | *iteração de 1–2 semanas* |
| **improvement** | melhoria | *mudança positiva incremental* |
| **facilitator** | facilitador | *quem conduz a reunião* |
| **psychological safety** | segurança psicológica | *ambiente para falar abertamente* |

### Mini-texto (áudio: `deferred_render`)

> **Facilitator:** "**Retrospective** — 3 columns: **What went well**, **What didn't go well**, **Action items**."
>
> **Team:** "**Went well**: CI pipeline stable. **Didn't go well**: flaky tests in `AuthService`. **Action**: @dev fix flaky tests by Friday."
>
> **Facilitator:** "**Post-mortem** for SEV-2: **blameless**. **Root cause**: missing index. **Action**: add index, review all queries. **Follow-up** in 2 weeks."
>
> **Team:** "**Psychological safety** — we own mistakes, fix system."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
A **retrospective** focuses on:
| Slot | Value |
|------|-------|
| A | Blaming individuals |
| B | **Continuous improvement: what went well, what didn't, actions** |
| C | Only technical debt |
| D | Sprint planning |
**Key:** B
**br_pt_form:** "melhoria contínua: o que foi bem, o que não foi, ações"

### Item 2 — Vocabulary (Matching)
Match the term to its context:
| Term | Context |
|------|---------|
| **Retrospective** | a. End of sprint, team improvement |
| **Post-mortem** | b. After incident, blameless analysis |
| **Action item** | c. Concrete task with owner/deadline |
| **Blameless** | d. Focus on system, not person |
**Key:** Retrospective→a, Post-mortem→b, Action item→c, Blameless→d
**br_pt_form:** "retrospectiva", "postmortem", "item de ação", "sem culpar"

### Item 3 — Grammar: Imperative for action items (fill-in-blank)
Write **imperative** action items:
"______ (fix) flaky tests in AuthService. ______ (add) index to orders table. ______ (schedule) follow-up meeting."
**Key:** Fix / Add / Schedule
**br_pt_form:** "Corrija", "Adicione", "Agende"

---

## FASE 3 — Output Task [4 min]

### Speaking: Retrospective Roleplay (grupo de 3–4)
**Roles:** Facilitator, Dev 1, Dev 2, (Dev 3)
**Facilitator:** Runs 15-min retro. Three rounds: **Went well**, **Didn't go well**, **Actions**.
**Each person:** Contributes 1 item per round.
**Facilitator:** Ensures **blameless** tone. Assigns **action items** with owner + deadline.

**Example:**
> **Facilitator:** "What went well?"
> **Dev 1:** "Code review turnaround < 2hr."
> **Facilitator:** "What didn't go well?"
> **Dev 2:** "Flaky tests block CI."
> **Facilitator:** "Action: @Dev2 fix flaky tests by Friday. Follow-up next retro."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
**Blameless post-mortem** means:
| Slot | Value |
|------|-------|
| A | No report written |
| B | **Focus on system fixes, not human error** |
| C | Skip the analysis |
| D | Blame the on-call |
**Key:** B
**br_pt_form:** "postmortem sem culpar / foco no sistema"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **imperative** for an action item:
| Slot | Value |
|------|-------|
| A | **Investigate** the flaky tests. |
| B | **Investigating** the flaky tests. |
| C | **Investigated** the flaky tests. |
| D | **Investigates** the flaky tests. |
**Key:** A
**br_pt_form:** "Investigue os testes instáveis."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_project_retrospective_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_project_retrospective",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (Facilitator/Team dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/frases-ingles-trabalho.md (BaixeLivros notice applies) - scoping of retrospective/post-mortem vocabulary and phrases"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - retrospective terms are unprotectable process concepts; definitions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.imperative_action_items"
    ],
    "vocabulary": [
      "vocab.retro.retrospective",
      "vocab.retro.post_mortem",
      "vocab.retro.went_well",
      "vocab.retro.didnt_go_well",
      "vocab.retro.action_item",
      "vocab.retro.blameless",
      "vocab.retro.root_cause",
      "vocab.retro.follow_up",
      "vocab.retro.sprint",
      "vocab.retro.improvement",
      "vocab.retro.facilitator",
      "vocab.retro.psychological_safety"
    ],
    "listening": [
      "listening.retro_context"
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