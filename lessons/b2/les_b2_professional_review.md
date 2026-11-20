# Lesson: Writing: Review & Evaluation

**Lesson ID:** `les_b2_professional_review`
**Module:** mod_b2_professional
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: dois colegas revisam uma proposta de observabilidade

> **Marina (staff engineer, São Paulo):** "I've read the rollout proposal. **In my view**, moving the traces to the new collector is the right direction."
>
> **Tiago (platform engineer, remote):** "What's the **evidence**? I'd argue the latency numbers matter more than the architecture diagram."
>
> **Marina:** "The data **suggests** a thirty percent drop in p95 after the change — but that came from a staging run, so treat it as directional."
>
> **Tiago:** "Fair. My **reservation** is the cost: the **trade-off** is better visibility against a larger bill."
>
> **Marina:** "Agreed. With that **caveat**, my **recommendation** is to pilot one service before we roll it out."
>
> **Tiago:** "That's a **balanced assessment** — a clear position, concrete evidence, and an explicit limitation."
>
> **Marina:** "Exactly. I'll write it up so the decision record shows both the strength and the trade-off."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **review** | revisão / análise crítica | *Review* é leitura crítica com juízo; não é apenas "olhar de novo". |
| **evaluation** | avaliação | Julgamento com critérios declarados; *review* descreve o processo, *evaluation* o veredito. |
| **evidence** | evidência | Dado concreto que sustenta a afirmação; prefira números a adjetivos. |
| **trade-off** | troca de vantagens / compensação | Nomeie os dois lados: *better visibility against a larger bill*. |
| **recommendation** | recomendação | Ação proposta, com dono e escopo; não é a mesma coisa que opinião. |
| **reservation** | ressalva (dúvida que se mantém) | Sinaliza uma limitação que você ainda não resolveu. |
| **caveat** | advertência / limitação declarada | Introduz a condição que restringe a conclusão: *with that caveat*. |
| **balanced assessment** | avaliação equilibrada | Tese + evidência + limitação + recomendação na mesma passagem. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Na minha opinião, está ótimo." → "In my opinion, it's great." | "**In my view**, the change is sound." / "**I'd argue** the change is sound." | *In my opinion* repete o óbvio; *in my view* e *I'd argue* posicionam sem soar como achismo. |
| "Eu acho que os números apoiam." → "I think the numbers support it." | "**It seems** the numbers support it." / "**The data suggests** the numbers support it." | O sujeito dos dados tira o peso do "eu acho" e evita *overstatement*. |
| "Está provado que funciona." → "It's proven to work." | "**The data suggests** it works in staging." | *Proven* é forte demais para uma amostra pequena; *suggests* marca o grau de certeza. |
| "Tem um problema." → "It has a problem." | "**There's a caveat**: the run covered one service." | *Caveat* nomeia a limitação; *problem* soa como reprovação geral. |
| "O custo é ruim." → "The cost is bad." | "The **trade-off** is better visibility against a larger bill." | *Trade-off* exige os dois lados da troca, não só um adjetivo negativo. |
| "Recomendo, sem ressalvas." → "I recommend it, no reservations." | "I'd **recommend** a pilot, **with the reservation** that traffic may peak." | Uma recomendação B2 abre a limitação explicitamente em vez de apagá-la. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (avaliação equilibrada)

Qual linha é uma *balanced assessment* — posição, evidência e limitação juntas?

| Opção | Linha |
|---|---|
| A | "The proposal is proven to work. Ship it everywhere." |
| B | **"In my view the collector is the right call; the staging data suggests a drop in p95, with the caveat that the run was small."** |
| C | "I think maybe we could possibly consider something about logs." |
| D | "The collector is bad because the bill is high." |

**Key:** B
A usa *proven* sem amostra e vira *overstatement*; C acumula hedges e perde a posição; D ataca o custo sem nomear o trade-off nem a evidência.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de uma revisão profissional:

| Português (intenção) | Resposta esperada |
|---|---|
| "Na minha opinião, a mudança é sensata." | "In my view, the change is sound." |
| "Eu acho que os números apoiam isso." | "The data suggests the numbers support it." |
| "Com ressalva: foi só em staging." | "With a caveat: it was a staging run only." |
| "Recomendo um piloto, mas com cuidado." | "I'd recommend a pilot, with the reservation that traffic may peak." |

**Key:** ver tabela — cada linha troca o "eu acho" por *the data suggests* ou *it seems* e declara a ressalva em vez de escondê-la.

### Exercício 3 — Complete a avaliação com hedging

Preencha com **In my view**, **reservation**, **suggests**, **trade-off** ou **recommendation**:

1. "______ the migration is worthwhile, but I have one ______."
2. "The staging run ______ a drop in incidents over six hours."
3. "The ______ is better visibility against a larger bill."
4. "My ______ is to extend the pilot to a peak month."

**Key:** 1) In my view; reservation 2) suggests 3) trade-off 4) recommendation — *suggests* mantém o grau de certeza e *reservation* introduz a limitação sem anular a tese.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

In my view, the collector change is the right direction for the team.
The staging data suggests a thirty percent drop in p95 after the change.
My reservation is the cost, and the trade-off deserves a sentence in the record.
With that caveat, I'd recommend a pilot on one service before the rollout.
This is a balanced assessment: a clear thesis, evidence, a limitation, and a recommendation.

### Foco articulatório para falantes de pt-BR

- **/v/ em *view* e *evidence***: lábio inferior encostado nos dentes de cima; não arredonde como /w/ (*viu*).
- **/θ/ em *thesis* e *thirty***: ponta da língua entre os dentes, sem voz; evite /t/ ou /s/.
- **/æ/ em *caveat***: vogal aberta e anterior, mais baixa que o /e/ do pt-BR; não diga *caveite*.
- **/eɪ/ em *staging* e *data***: deslize de /e/ para /ɪ/; a segunda sílaba de *data* não é um /a/ curto.
- **/ʃ/ em *recommendation***: como em *ship*, nunca /s/; a sílaba tônica fica em *-da-*.
- **/ə/ em *suggests* e *evidence***: schwa na sílaba átona; o pt-BR tende a vogal cheia e quebra o ritmo.

### Prompt de produção (escrita)

Escreva uma avaliação curta (4 a 6 sentenças) de uma proposta de um colega — por exemplo, mudança de pipeline, migração de serviço ou novo fluxo de deploy. Inclua:

1. uma **tese** explícita com *in my view* ou *I'd argue*;
2. uma **evidência** concreta com *the data suggests* ou *the run showed*;
3. uma **ressalva** com *my reservation is* ou *with the caveat that*;
4. um **trade-off** com os dois lados nomeados;
5. uma **recomendação** acionável com *I'd recommend...*;
6. pelo menos uma frase em **reported speech** (*Tiago said the run was short*).

Sem *proven*, *no reservations* ou adjetivos vagos: o leitor precisa ver o grau de certeza.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "With that caveat, I'd recommend a pilot", *caveat* significa:
   A) uma evidência nova  B) **uma limitação declarada**  C) um trade-off  D) uma recomendação
   **Key:** B

2. **Registro (L1):** Qual linha evita *overstatement* e mantém a posição?
   A) "It's proven; no reservations."  B) "Maybe we could possibly think about it."  C) **"The data suggests a gain, with the caveat that the sample was small."**  D) "This is bad and should be dropped."
   **Key:** C

3. **Gramática (L1):** Qual reported speech está correto? "The run is short," Tiago said.
   A) Tiago said the run is short.  B) **Tiago said the run was short.**  C) Tiago said the run were short.  D) Tiago says the run was short.
   **Key:** B

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b2_professional_review_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_professional_review",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.hedging_review",
      "grammar.reported_speech_feedback"
    ],
    "vocabulary": [
      "vocab.review.review",
      "vocab.review.evaluation",
      "vocab.review.evidence",
      "vocab.review.trade_off",
      "vocab.review.recommendation",
      "vocab.review.reservation",
      "vocab.review.caveat",
      "vocab.review.balanced_assessment"
    ],
    "listening": [
      "listening.review_context"
    ],
    "pronunciation": [
      "pronunciation.review_caveat_vowels"
    ],
    "reading": [
      "reading.review_evidence",
      "reading.review_reservation"
    ],
    "writing": [
      "writing_opinion_review"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_b2_register_nuance"
  ],
  "estimated_time_min": 15
}
```
