# Lesson: Retrospective & Post-mortem Talk

**Lesson ID:** `les_b1_project_retrospective`
**Module:** `mod_b1_fluency_project`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: retrospectiva de sprint 14 em um time remoto de fintech

> **Ana (tech lead, São Paulo):** "Let's keep this to fifteen minutes. Three questions: what went well, what should we improve, and who owns each action item."
>
> **Rafael (backend developer, São Paulo):** "What went well was the payment retry — it passed the load test on the first run."
>
> **Luiza (QA, Recife):** "I agree. But it seems the handoff to QA was late. We had one day for regression instead of three."
>
> **Tom (frontend developer, remoto):** "Maybe the estimate was optimistic. The API contract changed on Wednesday, and that was a blocker for my screen."
>
> **Ana:** "Good. What could we have done differently? Let's name the risk before we propose the fix."
>
> **Luiza:** "We could freeze the contract on Tuesday. It might be worth adding a short blocker review before the handoff."
>
> **Rafael:** "I'll own that action item. I'll add the checklist by Friday and flag any contract change in the stand-up."
>
> **Ana:** "Then we have one action item with an owner and a date. Thanks — I'll write the summary."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **retrospective** | retrospectiva | Reunião para aprender com o sprint, não para distribuir culpa. Use *a retrospective*; *a retro* é a forma curta corrente em times de software. |
| **went well** | correu bem | *What went well?* pede o que funcionou. Vá ao passado: *went*, não *goes*. |
| **improve** | melhorar | *What should we improve?* cobra uma mudança concreta; *improve* é transitivo aqui. |
| **action item** | item de ação | Tarefa com dono **e** prazo. *Action item for the team* não nomeia responsável. |
| **blocker** | bloqueio | Algo que parou o trabalho de fato: *that was a blocker for my screen*. |
| **hedging** | ressalva / suavização | Estratégia de falar sem acusar: *maybe*, *it seems*, *we could*. |
| **maybe** | talvez | Atenua uma hipótese: *Maybe the estimate was optimistic.* Não carrega a correção sozinho. |
| **it seems** | parece que | Apresenta uma leitura dos fatos: *It seems the handoff was late.* |
| **we could** | nós poderíamos | Sugere mudança sem impor: *We could freeze the contract on Tuesday.* Mais suave que *we must*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "O que correu bem?" → "What was gone well?" | "**What went well?**" | *Go* é irregular: passado é *went*; não existe *was gone* com esse sentido. |
| "O que pode melhorar?" → "What can improve?" | "**What should we improve?**" | A pergunta pede uma sugestão do time, com dono da mudança. |
| "Poderia ser melhor." → "It could be better." | "**We could improve the handoff.**" / "**It might be worth reviewing the handoff.**" | *It could be better* soa como crítica vaga; nomeie o processo e ofereça uma ação. |
| "Foi um bloqueio." → "It was a block." | "**It was a blocker for my screen.**" | Em times de software, *blocker* é o substantivo corrente; *block* soa como verbismo. |
| "Item de ação para o time." → "Action item for the team." | "**Action item: Rafael — add the checklist by Friday.**" | Sem nome e sem data, a tarefa não é verificável na próxima retro. |
| "Talvez o prazo é otimista." → "Maybe the estimate is optimistic." | "**Maybe the estimate was optimistic.**" | O sprint já terminou; mantenha o passado na análise do que aconteceu. |
| "Parece que a entrega atrasou." → "It seems that the delivery delayed." | "**It seems the handoff slipped.**" | *Slip* descreve um prazo que escorregou; *that* é opcional depois de *it seems*. |
| "Quem é o dono da tarefa?" → "Who does own the action item?" | "**Who owns the action item?**" | Com *who* como sujeito, não há *do/does*; *does own* só soa como ênfase. |
| "Nós devemos mudar o processo." → "We must change the process." | "**We could change the process.**" | *Must* soa como ordem; em retrospectiva, *could* convida o time a decidir. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (o que é um action item?)

Na fala de Rafael, qual linha é um action item completo — com dono e prazo?

| Opção | Frase |
|---|---|
| A | "We should improve the handoff." |
| B | "Action item: Rafael — add the checklist by Friday." |
| C | "The handoff to QA was late." |
| D | "Maybe the estimate was optimistic." |

**Key:** B — um *action item* nomeia quem faz e quando; em **A** há só uma sugestão, em **C** um achado e em **D** uma hipótese com ressalva.

### Exercício 2 — Transformação L1 → L2 (hedging em retrospectiva)

Reescreva as intenções em inglês natural, mantendo a ressalva sem perder o conteúdo:

| Português (intenção) | Resposta esperada |
|---|---|
| "O handoff atrasou." | "It seems the handoff slipped." |
| "O prazo foi otimista." | "Maybe the estimate was optimistic." |
| "Dá para revisar o checklist antes do handoff." | "We could review the checklist before the handoff." |
| "Vale a pena adicionar uma revisão de bloqueio." | "It might be worth adding a blocker review." |
| "Quem cuida disso?" | "Who owns the action item?" |

**Key:** ver tabela — *it seems*, *maybe*, *we could* e *it might be worth* suavizam a crítica, mas o problema continua nomeado; *who owns* não pede *does*.

### Exercício 3 — Complete a análise do sprint

Preencha com **went**, **improve**, **owns**, **changed** ou **seems**:

1. "What ______ well? — The payment retry test."
2. "What should we ______? — The handoff to QA."
3. "Who ______ the action item? — Rafael."
4. "The API contract ______ on Wednesday and blocked the frontend screen."
5. "It ______ that we had one day for regression instead of three."

**Key:** 1) went; 2) improve; 3) owns; 4) changed; 5) seems — fatos do sprint encerrado ficam no passado; a leitura atual do time usa *seems* e *owns*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

What went well was the payment retry test.
It seems the handoff to QA slipped by one day.
Maybe the estimate was optimistic because the API contract changed on Wednesday.
We could freeze the contract earlier, and it might be worth adding a blocker review.
Action item: Rafael will add the checklist by Friday and flag any contract change.

### Foco articulatório para falantes de pt-BR

- **/w/ em *went, well, worth***: lábios arredondados e soltos; não troque por /v/ como em *vert*.
- **/eɪ/ em *maybe***: ditongo de /e/ para /ɪ/ na primeira sílaba; não reduza a um /e/ puro.
- **/iː/ em *seems, freeze***: vogal longa e tensa; evite encurtar para /ɪ/ como em *sit*.
- **/θ/ em *worth***: ponta da língua entre os dentes, sem voz; não diga *worts*.
- **/ð/ em *the, the handoff***: mesma posição de /θ/, mas com voz; distinga as duas fricativas.
- **/dʒ/ em *change***: africado; comece com /d/ e solte em /ʒ/, sem substituir pelo /ʒ/ inicial do português.

### Prompt de produção (oral ou escrita)

Você abre a retrospectiva de um sprint que acabou de terminar. Escreva um parágrafo curto (ou diga as mesmas frases em voz alta) com:

1. um item de **what went well** no passado;
2. um ponto de **what to improve** com pelo menos uma forma de *hedging* (*maybe*, *it seems*, *we could*, *it might be worth*);
3. um **blocker** com a causa que o originou;
4. uma pergunta com pronome interrogativo (*what* ou *who*);
5. um **action item** com dono e prazo explícitos;
6. consistência de tempo: passado para fatos do sprint, presente para a leitura atual do time.

Inclua um detalhe real do seu contexto (sprint, ticket, deploy, fila, teste).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** No comentário "It seems the handoff slipped.", o que aconteceu?  
   A) O handoff terminou antes do previsto.  B) **O handoff atrasou.**  C) O handoff foi cancelado.  D) O handoff correu perfeito.  
   **Key:** B — *slip* aqui é perda de prazo; *it seems* mostra que Luiza apresenta uma leitura dos fatos, não uma acusação.

2. **Gramática (L1):** Qual linha suaviza a crítica sem abandonar o problema?  
   A) "You delayed the handoff."  B) "The handoff is late."  C) **"It seems the handoff slipped; we could freeze the contract earlier."**  D) "We must fix the handoff now."  
   **Key:** C — *it seems* + *we could* mantêm o achado e abrem a discussão; **A** acusa, **B** apenas constata e **D** impõe.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_project_retrospective_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_project_retrospective",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.retrospective_hedging",
      "grammar.retrospective_tense_consistency",
      "grammar.retrospective_interrogatives"
    ],
    "vocabulary": [
      "vocab.retrospective_meeting_vocab",
      "vocab.retrospective_hedging",
      "vocab.retrospective_action_item",
      "vocab.retrospective_blocker"
    ],
    "listening": [
      "listening.retrospective_dialogue"
    ],
    "pronunciation": [
      "pronunciation.retrospective_dentals_diphthongs"
    ],
    "reading": [
      "reading.retrospective_summary",
      "reading.retrospective_blocker"
    ],
    "speaking": [
      "speaking.retrospective_talk"
    ]
  },
  "prereq_lessons": [
    "les_a2_meeting_open",
    "les_b1_question_forms",
    "les_b1_tenses_review",
    "les_b1_negotiation",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
