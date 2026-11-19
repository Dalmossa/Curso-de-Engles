# Lesson: Debugging & Error Reporting

**Lesson ID:** `les_b1_it_debugging`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: caçando um bug intermitente e escrevendo o relatório

> **Bia (backend developer, São Paulo):** "The checkout bug is back, but only when a coupon is applied. I can't reproduce it on my machine."
>
> **Rafael (tech lead, remote):** "Start with the log lines from 14:07. Add a breakpoint in the coupon lookup and send me the stack trace."
>
> **Bia:** "Got it. The stack trace points to `CouponService.GetDiscount`. The log shows an empty value for the coupon."
>
> **Rafael:** "Bisect the last five commits. I think the regression came from the coupon change on Tuesday."
>
> **Bia:** "You're right. The root cause is an uninitialised discount object. We call it a flaky test because it only fails under load."
>
> **Rafael:** "Ship a workaround today and prepare the hotfix for tomorrow. Then add a regression test with clear steps to reproduce."
>
> **Bia:** "Agreed. I'll write the incident report with the expected behaviour, the actual behaviour and the cause of the failure."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **reproduce** | reproduzir | Em relatório, o título é *steps to reproduce*; *reproduce* é o verbo. |
| **repro / reproduction** | repro / reprodução | *Repro* é gíria de time: diga *I found a repro*, com artigo, não *o repro*. |
| **stack trace** | rastro de pilha / stack trace | Escreva separado: *stack trace*; *stacktrace* junto é erro gráfico comum. |
| **breakpoint** | ponto de parada | Uma palavra só: *breakpoint*, não *break point*. |
| **log line / log level** | linha de log / nível de log | *Log* é substantivo e verbo; *a log line* é uma única linha. |
| **bisect** | bissecionar (commits) | Em Git, *git bisect*; diga *bisect the last five commits*, não *do a bisection of* them. |
| **regression** | regressão | *A regression* conta como um evento novo: *the change caused a regression*. |
| **flaky test** | teste intermitente | *Flaky* descreve o **teste**; para o bug, prefira *intermittent bug*. |
| **root cause** | causa raiz | Diga *the root cause **of** the failure* — não *from the failure*. |
| **workaround** | solução temporária / gambiarra | Substantivo junto: *a workaround*; o verbo é separado: *work around the issue*. |
| **hotfix** | correção urgente | Escreva junto em texto de release: *hotfix*, não *hot fix*. |
| **incident report** | relatório de incidente | *Report* é o documento; *reporting* é o ato de relatar. |
| **steps to reproduce** | passos para reproduzir | Título fixo do relatório; *steps for reproduce* está errado. |
| **that** (oração relativa) | que (oração relativa) | *The commit **that** introduced the bug* — use *that* para coisas; *what* não vem depois de substantivo. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "I can't reproduce the bug **in** my machine." | "I can't reproduce the bug **on** my machine." | Máquina é superfície de trabalho: use *on my machine*, não *in*. |
| "The **stacktrace** points to the service." | "The **stack trace** points to the service." | O termo é escrito como duas palavras em texto técnico. |
| "The root cause **from** the failure is clear." | "The root cause **of** the failure is clear." | *Cause* pede *of*; *reason* pede *for* (*the reason for the timeout*). |
| "The commit **what** introduced the bug was reverted." | "The commit **that** introduced the bug was reverted." | Depois de um substantivo, a relativa usa *that/which*; *what* já contém o antecedente. |
| "We made a **work around** for today." | "We shipped a **workaround** today." | No substantivo, escreva junto; *work around* é o verbo. |
| "The bug is **flaky** only under load." | "The test is **flaky**; the bug is **intermittent**." | *Flaky* qualifica o teste, não o comportamento do sistema. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Gramática: oração relativa com *that*

Escolha a forma correta para a frase do incidente:

| Opção | Frase |
|---|---|
| A | "The log line **what** recorded the failure was deleted." |
| B | **"The log line **that** recorded the failure was deleted."** |
| C | "The log line **who** recorded the failure was deleted." |
| D | "The log line recorded the failure was deleted." |

**Key:** B

*That* liga *the log line* ao verbo *recorded*. *What* não pode vir depois de um substantivo, *who* serve para pessoas e, sem pronome relativo, a frase perde a ligação entre o nome e a ação.

### Exercício 2 — Vocabulário: complete com o termo certo

Complete cada frase com **breakpoint**, **stack trace** ou **workaround**:

1. "Add a ______ at line 42 to inspect the coupon object."
2. "The ______ shows the calls that led to the exception."
3. "We enabled a ______ while the hotfix is under review."

**Key:** 1) breakpoint; 2) stack trace; 3) workaround.

O *breakpoint* pausa a execução, o *stack trace* mostra a sequência de chamadas até o erro e o *workaround* contorna o problema enquanto a correção definitiva não chega.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "A causa raiz da falha está no serviço de cupom." | "The root cause of the failure is in the coupon service." |
| "O motivo do timeout ainda não está claro." | "The reason for the timeout is still unclear." |
| "O commit que introduziu a regressão foi revertido." | "The commit that introduced the regression was reverted." |

**Key:** ver tabela.

*Cause* combina com *of* e *reason* com *for*. Na terceira frase, o pronome relativo depois de *the commit* é *that* — nunca *what*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
I can reproduce the bug only when a coupon is applied.
The stack trace points to `CouponService.GetDiscount`.
I set a breakpoint on the coupon lookup and read the log lines.
The commit that introduced the regression was reverted yesterday.
The root cause of the failure is an uninitialised discount object.

### Foco articulatório para falantes de pt-BR

- **/ˌriːprəˈduːs/ em *reproduce***: a tônica cai na última sílaba (*re-pro-DUCE*); não puxe o acento para *RE-pro-duce*.
- **/ˈstæk treɪs/ em *stack trace***: são duas palavras, com /s/ final em cada uma; não junte como *stacktrace* nem acrescente uma vogal ao final.
- **/ˈbreɪkpɔɪnt/ em *breakpoint***: uma palavra só, com o ditongo /eɪ/ na primeira sílaba; evite a pausa de *break point*.
- **/ðæt/ em *that* e /əv/ em *of***: em *that*, a ponta da língua encosta nos dentes de cima com voz; em *the root cause of the failure*, *of* fica fraco (/əv/).

### Prompt de produção (oral ou escrita)

Imagine que você está passando o diagnóstico de um bug para um colega em outro fuso. Escreva ou diga **4 a 6 falas** em que você:

1. Descreve o bug com **reproduce** e uma condição (*only when…*).
2. Diz onde procurou, usando **stack trace**, **breakpoint** ou **log lines**.
3. Usa uma oração relativa com **that** (*the commit that introduced…*).
4. Usa **the root cause of** ou **the reason for** e nomeia **workaround** ou **hotfix**.
5. Termina com uma frase sobre os **steps to reproduce**.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O colega diz "We'll ship a workaround today." O que ele quer dizer?
   A) Vamos corrigir a causa raiz hoje.  B) Vamos entregar uma solução temporária hoje.  C) Vamos apagar os logs hoje.  D) Vamos revert o deploy hoje.
   **Key:** B

2. **Gramática (L1):** Qual frase está correta?
   A) "The commit what introduced the bug was reverted."  B) "The commit that introduced the bug was reverted."  C) "The commit who introduced the bug was reverted."  D) "The commit introduced the bug was reverted."
   **Key:** B

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_debugging_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_debugging",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.debugging_relative_clause_that",
      "grammar.debugging_cause_of_reason_for",
      "grammar.compound_head_agreement"
    ],
    "vocab": [
      "vocab.it_computer_terms.debugging_report",
      "vocab.debugging.reproduce",
      "vocab.debugging.stack_trace",
      "vocab.debugging.breakpoint",
      "vocab.debugging.log_line",
      "vocab.debugging.bisect",
      "vocab.debugging.regression",
      "vocab.debugging.flaky_test",
      "vocab.debugging.root_cause",
      "vocab.debugging.workaround",
      "vocab.debugging.hotfix",
      "vocab.gloss_pattern_that_is"
    ],
    "reading": [
      "reading.debugging_incident_report_scan",
      "reading.debugging_log_detail"
    ],
    "listening": [
      "listening.debugging_handoff_context"
    ],
    "pronunciation": [
      "pronunciation.debugging_term_stress"
    ],
    "speaking": [
      "speaking.debugging_handoff"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_it_reading_strategy",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
