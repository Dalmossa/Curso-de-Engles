# Lesson: Technical Presentations

**Lesson ID:** `les_b1_it_presentations`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US).
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: apresentando uma proposta técnica para o time

> **Marina (backend engineer):** "Good morning, everyone. Thanks for joining. Today, I'm going to walk you through a proposal to reduce API latency in our checkout service."
>
> **Marina:** "First, I'll outline the current problem and the metrics we collected. Next, I'll compare two possible approaches. After that, I'll explain the trade-offs and our recommendation. Finally, I'll open the floor for questions."
>
> **Rafael (frontend engineer):** "Could you clarify how this change affects the client-side timeout?"
>
> **Marina:** "That's a great question. In short, the timeout stays the same, but retries become safer because the operation will be idempotent. If there are no further questions, I'll move on to the implementation timeline."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **to walk you through** | apresentar/explicar passo a passo | Muito usado ao explicar proposta, arquitetura ou demo. |
| **to outline** | apresentar os pontos principais | Abre a seção sem entrar em detalhes ainda. |
| **agenda** | pauta/roteiro | Em apresentações: sequência do que será coberto. |
| **trade-off** | compensação/troca | Escolha em que se ganha algo e se perde outro. |
| **recommendation** | recomendação | Conclusão técnica defendida pelo apresentador. |
| **to open the floor for questions** | abrir para perguntas | Fechamento educado de uma seção ou da fala. |
| **to clarify** | esclarecer | Pedido objetivo, comum em revisões técnicas. |
| **timeline** | cronograma | Datas/etapas de implementação. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "I will **explain you** the architecture." | "I will **explain the architecture to you**." / "I will **walk you through** the architecture." | *Explain* pede objeto direto (a coisa explicada), não a pessoa como objeto direto. |
| "I will **presentate** the results." | "I will **present** the results." | Falso cognato/formação inexistente: o verbo é *present*. |
| "In the **first** I will talk about…" | "**First,** I will talk about…" / "**To begin with,** I'll talk about…" | Em inglês, o marcador de sequência não leva artigo/preposição como no português. |
| "If you have doubts, ask me." | "If you have **questions**, feel free to ask." | Em contexto profissional, *questions* é mais natural que *doubts*. |
| "I will speak **about** the topic **X**." (calco) | "I will talk **about topic X**." / "I'll cover topic X." | Evite artigo redundante e escolha verbo mais direto (*cover/talk about*). |
| "For **finish**…" | "**To conclude,**…" / "**Finally,**…" | Marcadores de fechamento usam *to conclude/finally/in summary*, não *for + infinitivo*. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Sequenciamento (signposting)

Coloque os marcadores na ordem mais clara para uma apresentação técnica:

| Posição | Marcador |
|---|---|
| 1 | **First / To begin with** |
| 2 | **Next / Then** |
| 3 | **After that** |
| 4 | **Finally / To conclude** |

**Chave:** 1 → abertura do primeiro ponto; 2 → próximo ponto; 3 → ponto seguinte; 4 → fechamento.

### Exercício 2 — Transformação L1 → L2

Reescreva as frases para um inglês profissional natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Vou explicar vocês sobre o novo deploy." | "I'm going to walk you through the new deployment." |
| "No primeiro, vou falar do problema." | "First, I'll talk about the problem." / "To begin with, I'll outline the problem." |
| "Para terminar, abro para dúvidas." | "Finally, I'll open the floor for questions." |

### Exercício 3 — Preenchimento contextual

Complete com: **outline**, **trade-offs**, **recommendation**, **clarify**

1. "First, I'll ____ the current architecture." → **outline**
2. "Next, I'll compare the ____ of each option." → **trade-offs**
3. "Our ____ is to start with a canary release." → **recommendation**
4. "Could you ____ what you mean by 'safe rollback'?" → **clarify**

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

Good morning, everyone, today I will walk you through our deployment proposal. First, I will outline the current problem and the metrics we collected. Next, I will compare two approaches and explain the main trade-offs. Our recommendation is to release the change gradually with a clear rollback plan. Finally, if you have any questions, I will be happy to clarify the details.

### Foco articulatório para falantes de pt-BR

- **/w/ em *walk, will, we***: arredonde os lábios sem inserir vogal antes ("uóok" → /wɔːk/).
- **/ð/ em *the, that***: língua entre os dentes, voz ligada (evite /d/ ou /z/).
- **Ritmo e redução**: *going to* → /ˈɡoʊɪŋ tə/ em fala natural; *I'll* contraído em apresentações informais-técnicas.
- **Grupos consonantais em *metrics, asks, next***: evite vogal epentética ("métricsi", "nexiti").

### Prompt de produção (oral ou escrita)

Prepare uma miniapresentação de **60–90 segundos** sobre uma melhoria técnica real (ex.: reduzir latência, aumentar cobertura de testes, migrar um serviço). Use pelo menos **4 marcadores** (First, Next, After that, Finally) e inclua **problema → opções/trade-offs → recomendação → convite a perguntas**.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Qual frase abre melhor uma apresentação?  
   A) "I explain you the plan."  B) **"I'll walk you through the plan."**  C) "I presentate the plan."  D) "For first, the plan."  
   **Chave:** B

2. **Discurso (L1):** Escolha o marcador adequado para encerrar:  
   A) "In the first…"  B) "After that…"  C) **"To conclude, I'll summarize our recommendation."**  D) "I have a doubt."  
   **Chave:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_presentations_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_presentations",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material; no external source text reproduced or adapted.",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.presentation_signposting",
      "grammar.explain_to_vs_explain"
    ],
    "vocabulary": [
      "vocab.presentation.walk_through",
      "vocab.presentation.outline",
      "vocab.presentation.trade_off",
      "vocab.presentation.recommendation",
      "vocab.presentation.open_floor"
    ],
    "listening": [
      "listening.presentation_context"
    ],
    "pronunciation": [
      "pronunciation.w_initial",
      "pronunciation.th_voiced",
      "pronunciation.consonant_clusters"
    ],
    "speaking": [
      "speaking.technical_presentation"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_meeting_standup",
    "les_b1_it_architecture_vocab"
  ],
  "estimated_time_min": 15
}
```
