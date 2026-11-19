# Lesson: Modal Verbs Deep Dive

**Lesson ID:** `les_b1_modals`
**Module:** `mod_b1_grammar_consolidate`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: pedidos, recomendações e uma regra rígida na revisão de um release

> **Marina (tech lead, São Paulo):** "Could you review the retry limit before Friday, Caio?"
>
> **Caio (backend developer, remoto):** "Sure. Would you mind if I add a short note to the RFC first? The trade-off isn't clear yet."
>
> **Marina:** "Please do. I'd suggest we keep the feature flag off until the index is in — we might need to roll back if the error rate climbs."
>
> **Luiza (QA engineer, Recife):** "I can run the load test tomorrow. We need to confirm the latency before we ship."
>
> **Caio:** "I'll add the index today. That one is a must — without it, retries can double-charge a customer."
>
> **Marina:** "Good. You may hand off the RFC review to me if you're pulled into the incident — just check with me first."
>
> **Luiza:** "Understood. I'll post the numbers in the channel; could you confirm you've seen them?"

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **hedge** | atenuador | Recurso que reduz a força da afirmação; *I'd suggest* é um hedge, *must* não é. |
| **Could you...?** | Você poderia...? | Pedido padrão no trabalho; não fala de passado aqui. O modal pede verbo base. |
| **Would you mind...?** | Você se importaria...? | Pedido ainda mais suave; depois de *mind*, use verbo com **-ing**. |
| **I'd suggest we...** | Eu sugeriria que... | Recomendação com dono e ação; *I'd* = *I would*, sem soar como ordem. |
| **might need to** | pode ser que precisemos | Possibilidade (*might*) + obrigação suave (*need to*): combine os dois sem *will*. |
| **need to** | precisar | Semi-modal: diferente de *can/must*, ele **leva *to*** antes do próximo verbo. |
| **must** | ter que / é obrigatório | Regra rígida e não negociável; evite em pedidos — soa como imposição. |
| **may** | poder (permissão) | Autorização formal, geralmente com condição: *You may hand off... — just check first.* |
| **feature flag** | flag de funcionalidade | Desligar a flag (*keep the flag off*) é ação temporária, não remoção de código. |
| **roll back** | reverter um deploy | Escreva junto na forma verbal: *we roll back*; o substantivo é *rollback*. |
| **trade-off** | prós e contras de uma escolha | Apresente ganho **e** custo; uma coluna só não é *trade-off*. |
| **before we ship** | antes de publicar | *Ship* é o verbo corrente para liberar uma versão; evite *before we deploy it live*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Você pode revisar...?" → "Could you to review...?" | "**Could you review** the retry limit?" | Modal é seguido da forma base do verbo, sem *to*. |
| "Ela pode ajudar." → "She could helps." | "She **could help**." | Depois de um modal nunca há **-s** de terceira pessoa. |
| "Temos que adicionar." → "We must to add the index." | "We **must add** the index." | *Must* também pede verbo base, sem *to*. |
| "Precisamos adicionar." → "We need add the index." | "We **need to add** the index." | *Need* é semi-modal e exige *to* quando é verbo principal. |
| "Você se importaria de adicionar...?" → "Would you mind to add...?" | "**Would you mind adding**...?" | *Mind* exige o gerúndio; *to add* aqui está errado. |
| "Eu sugiro esperar." → "I suggest to wait." | "**I'd suggest we wait**." / "I suggest waiting." | *Suggest* não toma *to* + verbo; use *that* com sujeito ou o gerúndio. |
| "Talvez seja..." → "Maybe is..." | "It **may be** worth checking." | *May be* é verbo (duas palavras); *maybe* é advérbio e muda a estrutura da frase. |
| "Você deve corrigir agora, por favor." → "You must fix it, please." | "**Could you fix** it before the review?" | *Must* expressa obrigação; para pedir, use *could* ou *would*. |
| "Eu posso rodar..." → "I am can run the test." | "**I can run** the test." | *Can* não combina com *be*; ele mesmo carrega o tempo da frase. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (recomendação atenuada)

Qual linha faz uma recomendação sem impor nem virar fragmento?

| Opção | Linha |
|---|---|
| A | "You must keep the feature flag off." |
| B | **"I'd suggest we keep the feature flag off until the index is in."** |
| C | "I am suggest we keep the feature flag off." |
| D | "Maybe keeping the feature flag off until the index is in." |

**Key:** B — *I'd suggest we keep...* atenua a recomendação e mantém sujeito + verbo base; **A** é uma ordem com *must*, **C** mistura *be* com o modal e **D** não tem verbo finito.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de uma conversa de revisão de release:

| Português (intenção) | Resposta esperada |
|---|---|
| "Você pode revisar o limite de retentativa antes de sexta?" | "Could you review the retry limit before Friday?" |
| "Você se importaria de adicionar uma nota no RFC?" | "Would you mind adding a note to the RFC?" |
| "Eu sugeriria esperarmos o rollback terminar." | "I'd suggest we wait for the rollback to finish." |
| "Pode ser que precisemos reverter se o erro subir." | "We might need to roll back if the error climbs." |
| "Precisamos confirmar a latência antes de publicar." | "We need to confirm the latency before we ship." |

**Key:** ver tabela — o pedido usa *could* + verbo base, *mind* exige **-ing**, *suggest* abre uma oração com sujeito, *might* atenua a possibilidade e *need to* marca a condição para publicar.

### Exercício 3 — Complete a troca de mensagens

Preencha com **Could**, **Would**, **might**, **need to**, **must** ou **should**:

1. "______ you review the retry limit before Friday?"
2. "______ you mind adding a note to the RFC?"
3. "We ______ need to roll back if the error rate climbs above two percent."
4. "We ______ confirm the latency before we ship."
5. "The index is a hard requirement — we ______ add it before the release."
6. "You ______ post an update every fifteen minutes during a SEV-2."

**Key:** 1) Could; 2) Would; 3) might; 4) need to; 5) must; 6) should — note que *might need to* combina possibilidade com obrigação suave, enquanto *must* fica reservado à regra inegociável do índice.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
Could you review the retry limit before Friday, Caio?
Would you mind adding a note to the RFC before the review?
I'd suggest we keep the feature flag off until the index is in.
We might need to roll back if the error rate climbs above two percent.
We need to confirm the latency before we ship, and the index is a must.

### Foco articulatório para falantes de pt-BR

- **/kʊd/ em *could***: a vogal é /ʊ/, curta e relaxada — não diga /kuːd/. Solte o /k/ final sem inserir "e".
- **/wʊd/ em *would***: comece com /w/, lábios arredondados e soltos; não troque por /v/ como em *video*.
- **/ʃʊd/ em *should***: o primeiro som é /ʃ/ (como em *ship*), não /s/; a vogal continua sendo /ʊ/.
- **/d/ final em *could, would, should***: toque leve na alvéola, sem a epêntese que o pt-BR acrescenta ("could-e").
- **/maɪt/ em *might* e /meɪ/ em *may***: em *might*, o ditongo é /aɪ/ e o /t/ final não ganha vogal; em *may*, o deslize é /eɪ/.
- **/iː/ em *need***: vogal longa e tensa; não reduza ao /ɪ/ de *it*.
- **/ð/ em *the***: ponta da língua entre os dentes com voz; não troque por /d/.
- **Entonação**: em *Could you...?* e *Would you mind...?*, o tom sobe no final; em *I'd suggest...*, ele desce suavemente — a ideia é colaborar, não mandar.

### Prompt de produção (oral ou escrita)

Você está comentando um release em uma pull request ou chamada curta com o time. Escreva (ou diga em voz alta) um bloco com:

1. um pedido com **Could you...?**, com verbo base e um prazo;
2. um segundo pedido com **Would you mind...?** seguido de verbo com **-ing**;
3. uma recomendação atenuada com **I'd suggest we...**;
4. uma possibilidade com **might need to** e uma condição explícita;
5. uma obrigação com **need to** e uma regra rígida com **must** — deixe claro qual das duas é negociável;
6. uma permissão com **may** acompanhada de uma condição (*just check with me first*, por exemplo);
7. um detalhe real do seu contexto (endpoint, fila, flag, ticket) e ao menos uma frase com modal + verbo base sem *to*.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Função (L1):** Em "We might need to roll back if the error rate climbs", *might* sinaliza:
   A) certeza  B) **possibilidade com uma obrigação atenuada**  C) habilidade no passado  D) proibição
   **Key:** B — *might* reduz a certeza e *need to* carrega a ação; não há aqui nem passado, nem proibição.

2. **Gramática (L1):** Qual linha pede algo de forma correta?
   A) "Would you mind to add a note?"  B) **"Would you mind adding a note?"**  C) "Would you mind add a note?"  D) "Would you mind added a note?"
   **Key:** B — *mind* exige o gerúndio; as demais usam infinitivo, verbo base ou particípio onde o gerúndio é obrigatório.

3. **Registro (L1):** Você quer um pedido educado em um comentário de code review. Qual linha combina forma e tom?
   A) "You must fix this now."  B) "You can to fix this."  C) **"Could you fix this before the review?"**  D) "You fixing this before the review?"
   **Key:** C — *could* + verbo base soa como pedido; **A** impõe, **B** acrescenta *to* depois do modal e **D** não tem verbo finito.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_modals_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_modals",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "speaking", "writing"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.modal_hedging",
      "grammar.modal_can_need_bare_verb"
    ],
    "vocabulary": [
      "vocab.modals_hedging",
      "vocab.modals_can_need"
    ],
    "listening": [
      "listening.modals_context"
    ],
    "pronunciation": [
      "pronunciation.modals_weak_forms"
    ],
    "reading": [
      "reading.modals_request_email",
      "reading.modals_policy_note"
    ],
    "speaking": [
      "speaking.modal_hedged_recommendation"
    ],
    "writing": [
      "writing.modal_hedged_update"
    ]
  },
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
    "les_b1_tenses_review"
  ],
  "estimated_time_min": 15
}
```
