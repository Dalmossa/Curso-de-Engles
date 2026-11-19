# Lesson: Advanced Question Forms

**Lesson ID:** `les_b1_question_forms`
**Module:** `mod_b1_grammar_consolidate`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: stand-up de 09:15 depois de um incidente de pagamento

> **Ana (tech lead, São Paulo):** "Who owns the retry limit in the payment service?"
>
> **Rafa (backend developer, remoto):** "I do. Which branch did you merge yesterday, Ana?"
>
> **Ana:** "The fix branch. What does the dashboard show now?"
>
> **Rafa:** "The error rate is back to baseline, but I don't know why it spiked at 14:00."
>
> **Ana:** "Good. Do you know which query caused the timeout?"
>
> **Rafa:** "Not yet — can you tell me where the slow query log is?"
>
> **Ana:** "It's in the runbook. Whose idea was the index change, by the way?"
>
> **Rafa:** "Mine. I'll post the details right after this stand-up."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **Who owns the retry limit?** | Quem é o dono do limite de retentativa? | Quando *who* é o sujeito, não há auxiliar: *Who owns...?*, não *Who does own...?* |
| **Who did you call?** | Quem você ligou? | Aqui *who* é objeto: o auxiliar *did* aparece antes do sujeito *you*. |
| **Which branch did you merge?** | Qual branch você mesclou? | *Which* escolhe entre opções conhecidas; pede auxiliar quando o sujeito é *you*. |
| **What does the dashboard show?** | O que o painel mostra? | *What* pergunta informação aberta; *does* concorda com *the dashboard*. |
| **Whose idea was it?** | De quem foi a ideia? | *Whose* marca posse; não confunda com *who's* (*who is* / *who has*). |
| **Do you know which query caused it?** | Você sabe qual query causou isso? | Depois de *do you know*, use ordem de afirmação: *which query caused*, não *which query did cause*. |
| **Can you tell me where the log is?** | Você pode me dizer onde está o log? | Pergunta embutida: sujeito antes do verbo; *is* fica no fim da oração. |
| **I don't know why it spiked.** | Eu não sei por que subiu. | A mesma regra vale em subordinada: *why it spiked*, sem inversão. |
| **I do.** | Eu sou / eu faço. | Resposta curta com o auxiliar da pergunta (*Who owns it? — I do.*). |
| **slow query log** | log de consultas lentas | Termo composto corrente em operações; evite *log of slow queries*. |
| **by the way** | a propósito | Marca mudança de tópico na conversa; não existe *by the way of*. |
| **runbook** | manual de operação | Palavra padrão em engenharia; não traduza como *book of run*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Onde você trabalha?" → "Where work you?" | "**Where do you work?**" | O pt-BR dispensa auxiliar e deixa o sujeito oculto; o en-US exige *do/does* + sujeito + verbo base. |
| "Quem você ligou?" → "Who you called?" | "**Who did you call?**" | *Who* é objeto aqui, então a pergunta precisa do auxiliar *did*. |
| "Quem ligou para você?" → "Who did call you?" | "**Who called you?**" | Quando *who* é o sujeito, não se usa *did*: a própria palavra já ocupa o lugar do auxiliar. |
| "Você sabe onde está o log?" → "Do you know where is the log?" | "**Do you know where the log is?**" | Em pergunta embutida, o auxiliar da oração principal já apareceu; a parte internalizada segue ordem de afirmação. |
| "Qual você escolheu?" → "What did you choose?" (entre duas opções) | "**Which one did you choose?**" | *Which* restringe a um conjunto conhecido; *what* é aberto. |
| "De quem é esse erro?" → "Who's error is this?" | "**Whose error is this?**" | *Who's* é contração de *who is*; posse é *whose*. |
| "Por que o deploy falhou?" → "Why the deploy failed?" | "**Why did the deploy fail?**" | Pergunta direta com verbo principal pede *do-support*; *did* atrai o verbo para a forma base. |
| "Você tem algum log?" → "Do you have some logs?" | "**Do you have any logs?**" | Em perguntas neutras, o padrão é *any*; *some* soa como expectativa de resposta sim. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (ordem em pergunta embutida)

Qual linha mantém a ordem correta depois de *Do you know...?*

| Opção | Linha |
|---|---|
| A | "Do you know where is the slow query log?" |
| B | **"Do you know where the slow query log is?"** |
| C | "Do you know where does the slow query log live?" |
| D | "Do you know where the slow query log is at?" |

**Key:** B

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de um stand-up de engenharia:

| Português (intenção) | Resposta esperada |
|---|---|
| "Onde você trabalha?" | "Where do you work?" |
| "Quem revisou o deploy?" | "Who reviewed the deploy?" |
| "Quem você chamou?" | "Who did you call?" |
| "Qual branch você mesclou?" | "Which branch did you merge?" |
| "Você pode me dizer por que a latência subiu?" | "Can you tell me why the latency went up?" |

**Key:** ver tabela — *who* como sujeito não toma auxiliar, *who* como objeto toma *did*, e a pergunta embutida mantém sujeito antes do verbo.

### Exercício 3 — Complete as perguntas do stand-up

Preencha com **Who**, **Which**, **What**, **Whose**, **Do** ou **Does**:

1. "______ owns the index fix?"
2. "______ branch did you merge yesterday?"
3. "______ does the dashboard show after the fix?"
4. "______ idea was the rollback?"
5. "______ you know which query timed out?"
6. "______ the retry limit live in the config file?"

**Key:** 1) Who; 2) Which; 3) What; 4) Whose; 5) Do; 6) Does — em *Who owns...?* o pronome é sujeito, mas em *Which branch did you...?* o auxiliar obedece a *you*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
Who owns the retry limit in the payment service?
Which branch did you merge yesterday, Ana?
What does the dashboard show after the fix?
Can you tell me where the slow query log is?
I don't know why the error rate spiked at 14:00, but I do know whose idea it was.

### Foco articulatório para falantes de pt-BR

- **/h/ + /uː/ em *who, whose***: a primeira letra é muda como /w/; comece com ar em /h/ e mantenha a vogal longa /uː/. Não diga *wuː* nem reduza para /ʊ/.
- **/w/ em *what, which, where***: lábios arredondados e soltos, sem encostar no dente como em /v/.
- **/ɝː/ em *work***: vogal com *r* americano, não o "uó" do pt-BR; a língua recua sem tocar o céu da boca.
- **/z/ final em *does, is, logs***: mantenha a voz no final; não troque por /s/ nem acrescente vogal (*does-e*).
- **/ð/ em *the***: ponta da língua entre os dentes com voz; evite /d/.
- **Entonação**: em perguntas WH diretas, o tom desce no final; em *Can you tell me where the log is?*, a pergunta embutida também termina descendente, embora a frase comece com um auxiliar.

### Prompt de produção (oral ou escrita)

Você está abrindo um stand-up curto sobre um incidente de pagamento. Escreva (ou diga em voz alta) um bloco com:

1. uma pergunta com **Who** como sujeito, sem auxiliar;
2. uma pergunta com **Who** como objeto, com **did/do**;
3. uma pergunta com **Which** e auxiliar, escolhendo entre duas opções;
4. uma pergunta com **What does...?**
5. uma pergunta com **Whose**;
6. uma pergunta embutida com **Do you know...?** ou **Can you tell me...?**, mantendo ordem de afirmação;
7. um detalhe real do seu contexto (endpoint, fila, ticket, flag) e ao menos uma resposta curta com auxiliar (*I do*, *It is...*).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Gramática (L1):** Qual linha usa ordem de afirmação dentro da pergunta?
   A) "Do you know where is the log?"  B) **"Do you know where the log is?"**  C) "Do you know where does the log live?"  D) "Do you know where the log is at?"
   **Key:** B

2. **Pronomes interrogativos (L1):** Em qual frase *who* é o sujeito e por isso não recebe auxiliar?
   A) **"Who called Ana?"**  B) "Who did call Ana?"  C) "Who did Ana call?"  D) "Whose did Ana call?"
   **Key:** A

3. **Registro (L1):** Qual linha mantém o tom colaborativo do stand-up?
   A) "Tell me the log path."  B) "Where is the log?"  C) **"Can you tell me where the log is?"**  D) "You tell me where is the log."
   **Key:** C

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_question_forms_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_question_forms",
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
      "grammar.interrogative_pronouns",
      "grammar.present_simple_do_does",
      "grammar.embedded_question_order"
    ],
    "vocabulary": [
      "vocab.question_forms_interrogatives",
      "vocab.question_forms_incident_terms"
    ],
    "listening": [
      "listening.question_forms_standup"
    ],
    "pronunciation": [
      "pronunciation.question_forms_wh_focus"
    ],
    "reading": [
      "reading.question_forms_standup"
    ],
    "speaking": [
      "speaking.question_forms_standup"
    ]
  },
  "new_skills": ["interrogative_pronouns", "present_simple_do_does"],
  "prerequisite_skills": ["hedging"],
  "prereq_lessons": [
    "les_a2_greetings_intro",
    "les_a2_small_talk",
    "les_a2_introducing_others",
    "les_a2_meeting_open",
    "les_a2_meeting_participate",
    "les_a2_email_basics",
    "les_a2_phone_calls",
    "les_a2_ask_for_help",
    "les_a2_deadlines_tasks",
    "les_a2_feedback_praise",
    "les_a2_corporate_wrapup",
    "les_a2_corpus_intro",
    "les_a2_past_narrative",
    "les_a2_future_will",
    "les_a2_present_continuous",
    "les_a2_modals_can_need",
    "les_a2_imperatives",
    "les_a2_prepositions_basic",
    "les_a2_travel_vocab_core",
    "les_a2_collocations",
    "les_a2_stress_timing",
    "les_a2_airport",
    "les_a2_hotel_taxi",
    "les_a2_restaurant_shopping",
    "les_a2_reading_strategy",
    "les_a2_writing_svo",
    "les_a2_writing_bio",
    "les_a2_writing_messages",
    "les_a2_writing_past",
    "les_a2_writing_selfcheck",
    "les_b1_tenses_review",
    "les_b1_modals",
    "les_b1_conditionals",
    "les_b1_passive",
    "les_b1_reported_speech"
  ],
  "estimated_time_min": 15
}
```
