# Lesson: Technical Leadership — Architecture Reviews, Trade-off Communication, Mentoring at Scale

**Lesson ID:** `les_b2_it_technical_leadership`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisão de arquitetura com a junta e uma sessão de mentoria

> **Marina (tech lead):** "Let's review the queue proposal before we commit. I've thought about the trade-offs, and I want every voice in the room."
>
> **Rafael (staff engineer):** "I recommend we keep the current queue. A second service reduces coupling on paper, but it adds an operational cost we have to own."
>
> **Priya (product partner):** "What do we gain for the checkout flow, and what do we give up? I need one line for the steering group."
>
> **Marina:** "We gain isolation for checkout; we give up a simpler deployment. I'll record both options in the decision log."
>
> **João (junior engineer):** "Can I ask why we didn't choose an outbox? I read about it, but I may be missing a constraint."
>
> **Rafael:** "We discussed the outbox last month and dropped it because of the delivery window. I'll mentor you through the notes after this call."
>
> **Marina:** "Then we're aligned: keep the queue, revisit in two sprints, and João gets a walkthrough. If the timeline slips, we'll follow the escalation path."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **architecture review** | revisão de arquitetura | Fórum para examinar uma decisão antes de executá-la; *review* é substantivo e verbo. |
| **trade-off** | compensação / escolha com custo | Diga o que se ganha **e** o que se perde; *trade-off* leva hífen. |
| **buy-in** | aceitação / apoio do time | Aceitação informada antes do compromisso; não é "compra". |
| **mentoring** | mentoria | Processo contínuo; a ação é *mentor someone*, não "do a mentoring". |
| **feedback loop** | ciclo de feedback | Rotina curta e repetida de retorno e ajuste, não um evento isolado. |
| **decision log** | registro de decisões | Onde ficam a escolha, o motivo e as alternativas descartadas. |
| **blocker** | bloqueio | Impedimento concreto; diga o que trava e quem pode destravar. |
| **alignment** | alinhamento | Acordo sobre o próximo passo; *we are aligned* soa natural em reunião. |
| **escalation path** | caminho de escalonamento | A rota definida para pedir uma decisão acima do time quando ele está travado. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Vamos **revizar a arquitetura**." → "review about the architecture" | "Let's **review the architecture**." | *Review* é transitivo: não pede *about*. |
| "Precisamos **discutir sobre** o trade-off." → "discuss about the trade-off" | "We need to **discuss the trade-off**." | *Discuss* leva o objeto direto; use *have a discussion about* se quiser *about*. |
| "Vou **dar feedback** para ele." → "give a feedback to him" | "I'll **give him feedback**." / "I'll **raise a concern** with him." | *Feedback* é incontável aqui e não leva *a*; *raise a concern* é mais preciso. |
| "Vamos **desbloquear** a tarefa." → "unblocking the task" como substantivo | "I can **unblock** the task today." | *Unblock* é o verbo; o impedimento é o *blocker*. |
| "Temos que ter o **buy-in** dele." → "make his buy-in" | "We need to **get buy-in** from him." | Colocação fixa: *get/gain buy-in from someone*. |
| "Estamos **alinhados nisso**." → "we are align in this" | "**We are aligned on this**." | O adjetivo pede *aligned on/with*, não *align*. |
| "Vamos **escalar o time**." → "escalate the team" | "We'll **escalate to** the architecture group." | *Escalate* vai **para** alguém: use *to*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (o que é um trade-off?)

Qual linha apresenta um ganho **e** um custo — um trade-off — com clareza?

| Opção | Enunciado |
|---|---|
| A | "We should adopt the new queue because it is modern." |
| B | **"We gain isolation for checkout, but we give up a simpler deployment."** |
| C | "The team discussed about the outbox last month." |
| D | "The tech lead will give feedback after the release." |

**Key:** B

### Exercício 2 — Complete o vocabulário da revisão

Preencha com **buy-in**, **decision log**, **escalation path**, **feedback loop** ou **unblock**:

1. "Before we change the queue, we need ____ from the product partner."
2. "I'll record the rationale in the ____ so the next reviewer knows why."
3. "If the timeline slips, follow the ____ and notify the architecture group."
4. "A short weekly ____ helps the junior engineer ask questions early."
5. "Rafael can ____ João by sharing the notes from last month."

**Key:** 1) buy-in; 2) decision log; 3) escalation path; 4) feedback loop; 5) unblock

### Exercício 3 — Transformação L1 → L2

| Português (intenção) | Resposta esperada em en-US |
|---|---|
| "Precisamos rever a arquitetura antes de decidir." | "We need to review the architecture before we decide." |
| "Não discutimos sobre o custo operacional." | "We didn't discuss the operational cost." |
| "Vou dar um feedback para ele sobre o PR." | "I'll give him feedback on the PR." / "I'll raise a concern with him about the PR." |
| "Vou desbloquear a João amanhã." | "I'll unblock João tomorrow." |

**Key:** ver tabela — em cada linha, troque o calco por uma colocação fixa: *review the architecture*, *discuss something* (sem *about*), *give someone feedback / raise a concern with someone* e *unblock someone*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

We need buy-in from the team before we commit to the architecture change.
The trade-off is clear: we gain isolation, but we give up a simpler deployment.
I've thought about your objection, and I would recommend discussing it in the review.
I'll record the decision in the decision log and share the escalation path.
We are aligned on the next step, so I can unblock the junior engineer today.

### Foco articulatório para falantes de pt-BR

- **/eɪ/ em *trade***: vogal deslizante, não o /e/ curto do pt-BR ("tréd"); segure o deslize até /ɪ/.
- **/ɔː/ em *off* (*trade-off*)**: vogal longa e arredondada; distinga de /əv/ em *of* — *trade-off* e *trade of* não soam iguais.
- **/tʃ/ em *architecture* e *question***: africada como em *check*; evite o /ʃ/ puro ("architeture").
- **/ʒ/ em *decision***: como o /ʒ/ de *measure*, com voz; não troque por /z/ nem por /dʒ/.
- **/aɪ/ em *buy-in***: duas sílabas claras (/baɪ ɪn/); não reduza para algo como "bi-in".
- **/t/ final em *commit* e *impact***: solte o ar sem inserir /i/ ao final — o pt-BR tende à epêntese (*commit-e*).

### Prompt de produção (oral ou escrita)

Conduza uma revisão de arquitetura de 2 minutos sobre uma mudança real do seu contexto. Inclua, em ordem:

1. Uma frase de abertura que convide todas as pessoas a participar.
2. O **trade-off** em uma linha: o que se ganha e o que se perde.
3. Um pedido de **buy-in** para quem vai ser afetado pela decisão.
4. Uma recomendação suave com **would recommend** ou **could**.
5. O que vai para o **decision log** e quem é o dono do registro.
6. Um **blocker** nomeado, o próximo passo alinhado e o **escalation path** se o prazo escorregar.

Feche com uma linha de mentoria acionável para uma pessoa júnior (por exemplo, o que ela deve ler ou com quem deve falar).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "we need buy-in from the product partner", *buy-in* significa:
   A) um diagrama de arquitetura aprovado
   B) **aceitação e apoio informado das pessoas afetadas pela decisão**
   C) um rollback de deploy
   D) um benchmark de performance
   **Key:** B

2. **Gramática (L1):** Qual linha soa natural em en-US?
   A) "We discussed about the outbox last month."
   B) "We made a discussion about the outbox last month."
   C) **"We discussed the outbox last month."**
   D) "We discussed about the trade-off of the outbox."
   **Key:** C

3. **Vocabulário (L1):** Na reunião, *escalation path* é:
   A) **a rota definida para pedir uma decisão acima do time quando ele está travado**
   B) o estágio do pipeline de CI que publica o artefato
   C) a fila de tarefas do sprint seguinte
   D) o histórico de commits daquele serviço
   **Key:** A

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b2_it_technical_leadership_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_technical_leadership",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "speaking"],
  "output_modalities": ["speaking"],
  "new_skills": ["meeting_vocab", "it_computer_terms"],
  "prereq_skills": ["reading_skimming", "reading_scanning"],
  "skill_items": {
    "grammar": [
      "grammar.hedged_recommendation",
      "grammar.discuss_no_preposition"
    ],
    "vocabulary": [
      "vocab.leadership.architecture_review",
      "vocab.leadership.trade_off",
      "vocab.leadership.buy_in",
      "vocab.leadership.mentoring",
      "vocab.leadership.feedback_loop",
      "vocab.leadership.decision_log",
      "vocab.leadership.blocker",
      "vocab.leadership.alignment",
      "vocab.leadership.escalation_path"
    ],
    "listening": [
      "listening.architecture_review_board"
    ],
    "pronunciation": [
      "pronunciation.trade_off_vowels",
      "pronunciation.architecture_affricate"
    ],
    "reading": [
      "reading.review_board_detail",
      "reading.decision_log_evidence"
    ],
    "speaking": [
      "speaking.tradeoff_leadership_review"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_meeting_open",
    "les_a2_it_reading_strategy",
    "les_a2_it_typescript_basics",
    "les_a2_it_algorithms_basics"
  ],
  "estimated_time_min": 15
}
```
