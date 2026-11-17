# Lesson: Writing RFCs & Design Docs

**Lesson ID:** `les_b2_it_rfc_writing`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US).
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: propondo uma mudança via RFC

> **Renato (staff engineer):** "Before we change the authentication flow, we need a short RFC so the team can review the proposal asynchronously."
>
> **Paula (backend engineer):** "What should the document include?"
>
> **Renato:** "Start with the problem statement and the goals. Then define non-goals to keep the scope clear. After that, describe the proposed design, the alternatives considered, and the main risks."
>
> **Paula:** "How specific should the requirements be?"
>
> **Renato:** "Use clear requirement language: what the system must do, what it should do when possible, and what it may support as an option. Finally, include a rollout plan and open questions."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **RFC (Request for Comments)** | proposta para discussão/revisão | Documento para alinhar decisão técnica antes da implementação. |
| **design doc** | documento de design | Descreve solução, decisões e impactos técnicos. |
| **problem statement** | definição do problema | Explica o que precisa ser resolvido e por quê. |
| **goals / non-goals** | objetivos / fora de escopo | Delimitam o que a proposta cobre e o que não cobre. |
| **proposal** | proposta | Solução recomendada e como funciona. |
| **alternatives considered** | alternativas consideradas | Opções avaliadas e motivos de não escolha. |
| **rollout plan** | plano de implantação/liberação | Etapas de entrega, migração e reversão. |
| **open questions** | questões em aberto | Pontos que ainda precisam de decisão ou validação. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "The system **has to obligatorily** validate…" | "The system **must** validate…" | *Must* já expressa requisito obrigatório; evite redundância. |
| "It **would be interesting** to have retries." (vago em requisito) | "The client **should** retry transient failures." / "The client **may** retry…" | Requisitos técnicos pedem linguagem precisa de obrigação/recomendação/opção. |
| "The objective is **make** the API faster." | "The goal is **to make** the API faster." / "The goal is **making**…" (menos comum) | Padrões comuns: *goal is to + verb*. |
| "We will **disponibilize** the endpoint." | "We will **make the endpoint available**." / "We will **expose** the endpoint." | *Disponibilizar* não vira *disponibilize*; escolha verbo adequado. |
| Confundir escopo: listar desejos em *non-goals* sem clareza | Escrever *"Non-goal: migrating legacy clients in this phase."* | *Non-goals* devem excluir explicitamente itens para evitar expansão de escopo. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Estrutura do RFC

Associe cada seção ao seu propósito:

| Seção | Propósito |
|---|---|
| **Problem statement** | a. Why the change is needed |
| **Goals / Non-goals** | b. What is in scope and out of scope |
| **Proposal** | c. Recommended solution |
| **Alternatives considered** | d. Other options and why they were not chosen |
| **Rollout plan** | e. How the change will be delivered safely |

**Key:** Problem→a, Goals/Non-goals→b, Proposal→c, Alternatives→d, Rollout→e
**Chave:** Problem→a, Goals/Non-goals→b, Proposal→c, Alternatives→d, Rollout→e

### Exercício 2 — Linguagem de requisitos (must / should / may)

Complete com **must**, **should** ou **may**:

1. "The service ____ reject requests without a valid token." (obrigatório) → **must**
2. "The client ____ log retry attempts for observability." (fortemente recomendado) → **should**
3. "The API ____ include a debug field in non-production environments." (opcional) → **may**

### Exercício 3 — Reescrita para precisão

| Vago (pt-BR → en-US) | Preciso (esperado) |
|---|---|
| "It would be nice if we had timeouts." | "The gateway **must** enforce a request timeout." |
| "Maybe we can add metrics later." | "The service **should** emit latency and error metrics." |
| "If someone wants, add tracing." | "Teams **may** enable distributed tracing in staging." |

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

This RFC defines the problem, the goals, and the non-goals for the proposed change. The service must validate every request before it reaches the core business logic. The client should retry transient failures with exponential backoff. The implementation may include additional debug logs in staging environments. The rollout plan should describe migration steps, monitoring signals, and a safe rollback path.

### Foco articulatório para falantes de pt-BR

- **/ɒ/ ou /ɔː/ em *problem, rollback*** e **/oʊ/ em *rollout, goals***: evite reduzir tudo a /o/ fechado.
- **/ʃ/ em *should*** e **/s/ em *must***: mantenha distinção clara em leitura técnica.
- **Encontros em *strengths?* não — aqui: *requirements, requests***: evite vogal epentética entre consoantes.
- **Ênfase em modais** em leitura de especificação: *must/should/may* devem soar destacados.

### Prompt de produção (oral ou escrita)

Escreva um mini-RFC (8–12 linhas) para uma mudança técnica simples (ex.: adicionar rate limiting, padronizar logs, criar endpoint de health check). Inclua: **Problem statement**, **Goals**, **Non-goals**, **Proposal** e **Rollout plan**. Use pelo menos um **must**, um **should** e um **may** com significados distintos.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática/requisitos (L1):** Qual frase expressa um requisito obrigatório?  
   A) "The service may validate tokens."  B) "The service should validate tokens."  C) **"The service must validate tokens."**  D) "The service can validate tokens."  
   **Key:** C
   **Chave:** C

2. **Estrutura (L1):** A seção que delimita o que **não** será feito é:  
   A) Problem statement  B) Proposal  C) **Non-goals**  D) Rollout plan  
   **Key:** C
   **Chave:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_rfc_writing_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_rfc_writing",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material; no external source text reproduced or adapted.",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.modals_requirements_must_should_may"
    ],
    "vocabulary": [
      "vocab.rfc.problem_statement",
      "vocab.rfc.goals_non_goals",
      "vocab.rfc.proposal",
      "vocab.rfc.alternatives_considered",
      "vocab.rfc.rollout_plan"
    ],
    "listening": [
      "listening.rfc_context"
    ],
    "pronunciation": [
      "pronunciation.modal_stress",
      "pronunciation.consonant_clusters"
    ],
    "reading": [
      "reading.design_document"
    ],
    "writing": [
      "writing.rfc_section"
    ]
  },
  "prereq_lessons": [
    "les_b1_it_write_docs",
    "les_b2_it_architecture_decisions"
  ],
  "estimated_time_min": 15
}
```
