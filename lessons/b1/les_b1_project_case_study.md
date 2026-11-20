# Lesson: Case Study Presentation

**Lesson ID:** `les_b1_project_case_study`
**Module:** `mod_b1_fluency_project`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: a equipe ensaia a apresentação de um case study de checkout

> **Bia (tech lead, São Paulo):** "Let's keep it to six beats: context, challenge, intervention, outcome, recommendation, takeaway. No vendor pitch — just our numbers."
>
> **Rafa (backend engineer, São Paulo):** "Context first: at Aurora Pay, checkout confirmation took thirty-eight seconds at p95 last March."
>
> **Lena (product manager, remote):** "The challenge was the fraud check inside the request path — the customer saw a spinner the whole time."
>
> **Rafa:** "Our intervention was to queue the check and return a pending state with an idempotency key."
>
> **Bia:** "Then the outcome: p95 confirmation fell to six seconds, and 'stuck payment' tickets dropped by a third."
>
> **Lena:** "Name the metric in that line and save the recommendation for the last slide."
>
> **Bia:** "Agreed. I recommend that the check stay asynchronous and that we add a timeout budget. The takeaway is simple: measure the customer wait, not only the service."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **case study** | estudo de caso | *Study of case* não existe: o composto em inglês é *case study*. |
| **context** | contexto | Abre a apresentação com a situação inicial; não use o cognato *contexto*. |
| **challenge** | desafio / problema central | Nomeia o obstáculo que a equipe precisou resolver; não é sinônimo automático de *difficulty*. |
| **intervention** | intervenção / mudança feita | É a ação entre o desafio e o desfecho; não confunda com *intercession*. |
| **outcome** | desfecho / resultado observado | Prefira *outcome* para o efeito medido; *result* é mais genérico. |
| **metric** | métrica | É o número acompanhado; *metrica* não é grafia do inglês. |
| **recommendation** | recomendação | Grafia com **mm**: *recommendation*, não *recomendation*. |
| **takeaway** | recado principal | Escreva junto: *takeaway* é substantivo; *take away* é o verbo "levar embora". |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Estudo de caso" → "study of case" | "case study" | O composto inglês inverte a ordem da tradução literal. |
| "O contexto era..." → "The contexto was..." | "The context was..." | *Contexto* é palavra portuguesa; em inglês, use *context*. |
| "A intervenção que fizemos" → "The intervention that we did" | "The intervention we made" / "Our intervention was to queue the check" | *Intervention* combina com *make* ou com *be to*; *do an intervention* soa como termo médico. |
| "Caiu de 38 para 6" → "dropped 38 to 6" | "dropped **from** 38 **to** 6" | Sem *from*, o leitor não sabe qual era o ponto de partida. |
| "Recomendação" → "recomendation" | "recommendation" | A grafia inglesa tem *mm* na primeira sílaba. |
| "O recado é..." → "The take away is..." | "The takeaway is..." | Como substantivo, *takeaway* é uma palavra só. |
| "Colocamos a checagem na fila" → "We put the check in queue" | "We queued the check" / "We moved the check to a queue" | *Queue* pede artigo ou uso verbal; *in queue* é calque de "na fila". |
| "Medimos o tempo do serviço" → "We measured the time of service" | "We measured the customer wait" | Em case study, o tempo que importa é o vivido pelo cliente. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (linha de outcome com métrica)

Qual linha apresenta o **outcome** com uma métrica clara?

| Opção | Linha |
|---|---|
| A | "The fraud check ran inside the request path." |
| B | **"p95 confirmation fell from 38 to 6 seconds, and stuck-payment tickets dropped by a third."** |
| C | "We queued the check and returned a pending state." |
| D | "I recommend that we add a timeout budget." |

**Key:** B

A descreve o desafio, C descreve a intervenção e D é a recomendação; só B traz o desfecho com número e comparação.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de um case study:

| Português (intenção) | Resposta esperada |
|---|---|
| "O contexto era um checkout lento." | "The context was a slow checkout." |
| "O desafio era uma checagem de fraude dentro do request." | "The challenge was a fraud check inside the request path." |
| "A intervenção foi colocar a checagem na fila." | "Our intervention was to queue the check." |
| "O desfecho foi seis segundos no p95." | "The outcome was six seconds at p95." |
| "Recomendo que a checagem seja assíncrona." | "I recommend that the check be asynchronous." |

**Key:** ver tabela

Cada linha troca o calque por uma expressão fixa do gênero (*context, challenge, intervention, outcome*) e mantém o subjunctive mandativo depois de *recommend that*.

### Exercício 3 — Complete o roteiro do case study

Preencha com **context, challenge, intervention, outcome** ou a forma verbal adequada:

1. "Here's the ______: confirmation took thirty-eight seconds at p95."
2. "The ______ was the fraud check in the request path."
3. "Our ______ was to queue the check and return a pending state."
4. "The ______ was six seconds at p95."
5. "I recommend that the check ______ (be) asynchronous."

**Key:** 1) context; 2) challenge; 3) intervention; 4) outcome; 5) be

Em 5, *recommend that* pede a forma base (*be*), não *is* — o mesmo padrão de *suggest that* e *it is essential that*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

At Aurora Pay, checkout confirmation took thirty-eight seconds at p95 last March.
The challenge was a synchronous fraud check inside the request path.
Our intervention was to queue the check and return a pending state with an idempotency key.
The outcome was six seconds at p95, with "stuck payment" tickets down by a third.
I recommend that the check stay asynchronous; the takeaway is to measure the customer wait.

### Foco articulatório para falantes de pt-BR

- **/θ/ em *thirty-eight* e *path***: ponta da língua entre os dentes, sem voz; não diga "tirty" nem "sirty".
- **/ð/ em *the, the request***: mesmo lugar de /θ/, mas com voz; alterne as duas séries sem substituir por /d/.
- **/eɪ/ em *payment* e *takeaway***: deslize de /e/ para /ɪ/; não reduza a uma vogal pura do pt-BR.
- **/iː/ em *key* e *keep***: vogal longa e tensa; evite o /ɪ/ curto de *kid*.
- **/ə/ em *synchronous* e *recommendation***: schwa na sílaba átona; dar vogal cheia a cada sílaba quebra o ritmo.
- **/k/ final em *check***: solte o ar sem inserir "e" (*check-e*); o pt-BR tende à epêntese final.
- **Pausa de meio segundo após cada rótulo** (*The challenge was...*, *Our intervention was...*): a pausa é o que dá tempo de processar a estrutura em seis partes.

### Prompt de produção (oral ou escrita)

Apresente um case study fictício ou real de 60 a 90 segundos sobre uma mudança pequena em um sistema (índice, cache, fila, teste, script). Escreva o roteiro — ou diga as mesmas frases em voz alta — com:

1. um **context** de uma frase contendo um número;
2. um **challenge** que nomeie o gargalo, sem slogan;
3. uma **intervention** que descreva a mudança efetiva;
4. um **outcome** com métrica antes/depois no padrão *from X to Y*;
5. uma **recommendation** com *I recommend that ... be ...*;
6. um **takeaway** iniciado por *The takeaway is...*.

Inclua um detalhe verificável do seu contexto (ticket, serviço, fila, deploy ou janela de medição) e mantenha um ritmo constante: um rótulo, uma frase, uma pausa curta.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "Our intervention was to queue the check", *intervention* significa:
   A) a métrica  B) a mudança que a equipe fez  C) o problema original  D) o slide final
   **Key:** B
   A métrica é o número observado, o problema é o *challenge* e o encerramento é o *takeaway*.

2. **Gramática (L1):** Qual linha compara a métrica corretamente?
   A) "Confirmation dropped 38 to 6 seconds."  B) "Confirmation dropped from 38 to 6 seconds."  C) "Confirmation dropped of 38 to 6 seconds."  D) "Confirmation dropped until 38 to 6 seconds."
   **Key:** B
   A perde o *from*, C replica a preposição do pt-BR e D usa *until* com um par de valores.

3. **Estrutura (L1):** A frase "The takeaway is to measure the customer wait" tem a função de:
   A) abrir o contexto  B) descrever a intervenção  C) apresentar a métrica  D) fechar com o recado principal
   **Key:** D
   O *takeaway* não introduz o caso nem repete o número: ele resume a lição que a plateia deve levar.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b1_project_case_study_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_project_case_study",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "speaking", "writing"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.case_study_metric_from_to",
      "grammar.case_study_mandative_recommendation"
    ],
    "vocabulary": [
      "vocab.case_study.context",
      "vocab.case_study.challenge",
      "vocab.case_study.intervention",
      "vocab.case_study.outcome",
      "vocab.case_study.metric",
      "vocab.case_study.recommendation",
      "vocab.case_study.takeaway"
    ],
    "listening": [
      "listening.case_study_prep_dialogue"
    ],
    "pronunciation": [
      "pronunciation.case_study_dental_fricatives",
      "pronunciation.case_study_vowel_glides"
    ],
    "reading": [
      "reading.case_study_section_map",
      "reading.case_study_metric_scan"
    ],
    "speaking": [
      "speaking.case_study_delivery",
      "fluency_pace"
    ],
    "writing": [
      "writing_formal_email",
      "writing.case_study_recommendation"
    ]
  },
  "prereq_lessons": [
    "les_b2_professional_email_advanced",
    "les_b2_professional_summary",
    "les_a2_it_typescript_basics",
    "les_a2_it_algorithms_basics",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```

---

## Nota de autoria

O case study da Aurora Pay é fictício e foi escrito para esta lição; nenhum livro de negócios, artigo ou material de terceiros foi reproduzido ou adaptado. A consulta ao grammar-rag usou o tópico `case study presentation structure problem solution recommendation` com `--top-k 2`: o resultado [1] sobre subjunctive mandativo (*suggest that* / *it is essential that*) fundamentou o padrão *I recommend that the check be...* no exercício 3 e na FASE 3; o resultado [2] sobre orações de particípio perfeito (*Having seen...*) foi descartado por registro inadequado para uma apresentação de 15 minutos. Todo o restante é autoral, em pt-BR → en-US.
