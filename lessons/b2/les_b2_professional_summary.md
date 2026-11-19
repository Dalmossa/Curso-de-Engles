# Lesson: Writing: Summarizing

**Lesson ID:** `les_b2_professional_summary`
**Module:** mod_b2_professional
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: um resumo de doze páginas para a liderança

> **Bruna (tech lead, São Paulo):** "I've read the twelve-page report, so here's the **gist**: checkout latency rose after the cache key change."
>
> **Daniel (engineering manager, remote):** "Give me the **main idea** first — what should leadership remember?"
>
> **Bruna:** "Two **key points**: the timeout came from the cache change, not from traffic, and errors stopped after the rollback."
>
> **Daniel:** "Keep the **supporting details** in the appendix. Is there an **attribution** we should preserve?"
>
> **Bruna:** "Yes — **according to the SRE team**, the rollback took eleven minutes. I'll keep that attribution instead of presenting the figure as ours."
>
> **Daniel:** "Good. **Paraphrase** the recommendation rather than quoting the report, and **condense** the two causes into one line. Watch the **scope**: this report covers checkout only."
>
> **Bruna:** "Then my **summary** is three sentences — cause, evidence, fallback. No opinions and no copy-paste."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **summary** | resumo | Versão condensada e objetiva do original; *abstract* é o resumo estruturado no início de um artigo acadêmico. |
| **gist** | ideia central / cerne | O ponto que sobra se você apagar todos os detalhes: *the gist is...*. |
| **paraphrase** | paráfrase / parafrasear | Mesmo sentido, palavras novas e estrutura nova; copiar frases do original não é paráfrase. |
| **condense** | condensar / reduzir | Encurtar mantendo a essência: *condense the two causes into one line*. |
| **key point** | ponto-chave | Informação essencial que merece sobreviver ao corte; não confundir com *key point* = "ponto da chave". |
| **supporting detail** | detalhe de apoio | Evidência que sustenta o ponto principal e costuma ir para o apêndice. |
| **attribution** | atribuição de autoria da informação | Dizer de onde veio o dado: *according to the SRE team*. |
| **scope** | escopo / abrangência | O limite do que o resumo cobre: *this report covers checkout only*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "O resumo do artigo" → "the **abstract** of the status update" | "the **summary** of the status update" | *Abstract* é o resumo formal de artigo acadêmico; em relatório de trabalho, use *summary*. |
| "Vou resumir" → "I'm going to **sum** the report" / "**resume** the report" | "I'm going to **summarize** the report." / "Let me **sum up** the report." | *Resume* em inglês significa "retomar", não "resumir"; *sum up* é o phrasal verb natural. |
| Copiar a frase do relatório trocando duas palavras → "paraphrase" | "**Paraphrase** it: restate the meaning in new words." | Paráfrase muda a estrutura, não só um sinônimo; copiar a sintaxe do original é plágio de forma. |
| "O ponto principal" → "the **main point of the key**" | "the **main idea**" / "the **gist**" | *Main idea* e *gist* são as expressões fixas para a ideia central de um texto. |
| "De acordo com a equipe" → "**according with** the team" | "**according to** the team" / "**the team reports that**..." | A preposição correta é *to*; *according with* não é inglês natural. |
| "Os detalhes de apoio" → "the **support details**" | "the **supporting details**" | O particípio *supporting* funciona como adjetivo; *support details* soa como instrução de suporte técnico. |
| "O escopo é só o checkout" → "the **reach** is checkout only" | "the **scope** is checkout only" / "**this covers** checkout only" | *Scope* é a palavra de engenharia e negócios para abrangência; *reach* é alcance físico ou de audiência. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (o que é um resumo objetivo?)

Qual linha é um *summary* — e não uma cópia, uma opinião ou um apêndice de dados?

| Opção | Linha |
|---|---|
| A | "The report was twelve pages long and the team worked very hard on it; in my opinion it is excellent." |
| B | **"According to the SRE team, a cache key change caused the checkout spike; errors stopped after the rollback. Scope: checkout only."** |
| C | "The cache key was changed on Tuesday at 14:03, the dashboard was refreshed at 14:07, and the ticket has thirty-two comments." |
| D | "I think leadership should stop asking for long reports and rewrite the whole process next quarter." |

**Key:** B
A mistura opinião (*in my opinion, excellent*) com informação irrelevante; C despeja detalhes de apoio sem a ideia central; D é uma recomendação pessoal, não um resumo.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de um resumo profissional:

| Português (intenção) | Resposta esperada |
|---|---|
| "A ideia central é que o erro veio do cache." | "The gist is that the error came from the cache." |
| "De acordo com o SRE, a reversão levou onze minutos." | "According to the SRE team, the rollback took eleven minutes." |
| "Vou parafrasear a recomendação, sem copiar o texto." | "I'll paraphrase the recommendation instead of copying the text." |
| "O escopo é só o checkout neste relatório." | "The scope is checkout only in this report." |

**Key:** ver tabela — cada linha troca a tradução literal por *gist / according to / paraphrase / scope* e mantém a informação sem acrescentar opinião.

### Exercício 3 — Condense com nominalização

Reescreva as frases usando um substantivo no lugar do verbo (mais conciso, mesmo sentido):

1. "The team analyzed the latency data." → "The team conducted an ______ of the latency data."
2. "The system performs well." → "The system's ______ is excellent."
3. "The team decided quickly." → "The team's ______ was quick."

**Key:** 1) analysis; 2) performance; 3) decision — a nominalização encurta o resumo sem mudar o agente nem o sentido.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

Here is the gist: cache latency rose after the key change.
One key point is that the timeout came from the cache, not from traffic.
According to the SRE team, the rollback took eleven minutes.
The report gives two supporting details, but they belong in the appendix.
My summary condenses the causes in three sentences, with clear attribution and a narrow scope.

### Foco articulatório para falantes de pt-BR

- **/dʒ/ em *gist***: como em *jump*, com a língua atrás dos dentes; não use /ʒ/ (*vision*) nem /z/.
- **/ʌ/ em *summary***: vogal curta e central, entre o /a/ e o /e/ do pt-BR; não diga *sammary* com /a/ aberto.
- **/iː/ em *key***: vogal longa e tensa; o pt-BR tende a encurtar, transformando *key* em *qui*.
- **/eɪ/ em *main* e *change***: deslize de /e/ para /ɪ/; mantenha o ditongo, não uma vogal pura.
- **/ə/ em *summary, supporting, attribution***: schwa na sílaba átona; dar vogal cheia a todas as sílabas quebra o ritmo do resumo.
- **/ʃ/ em *attribution***: como em *ship*, nunca /s/; a sílaba tônica fica em *-bu-*.

### Prompt de produção (escrita, 50–70 palavras)

Escolha um relatório longo do seu trabalho — incidente, sprint, revisão de arquitetura — e escreva um resumo curto em inglês. Inclua:

1. a **ideia central** em uma frase, com *the gist is...* ou *the main idea is...*;
2. **dois detalhes** (key points), no máximo — o resto vai para o apêndice;
3. uma **atribuição** explícita com *according to...* para pelo menos um número;
4. uma **paráfrase** da recomendação, sem copiar a estrutura do original;
5. o **escopo** declarado no fim (*this covers... only*).

Sem *in my opinion*, sem adjetivos de elogio e sem frases copiadas do relatório: o leitor deve conseguir reconstruir a decisão só com o seu resumo.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "Here's the gist", *gist* significa:
   A) uma lista de detalhes  B) **a ideia central**  C) a atribuição  D) o apêndice
   **Key:** B

2. **Vocabulário (L1):** Qual linha usa *paraphrase* corretamente?
   A) "I copied the sentence and changed one word."  B) "I summarized it in three words."  C) **"I restated the recommendation in new words and a new structure."**  D) "I moved the details to the appendix."
   **Key:** C

3. **Gramática (L1):** Qual linha mantém a nominalização correta?
   A) "The team conducted an analyze of the data."  B) **"The team conducted an analysis of the data."**  C) "The team conducted an analysis about the data."  D) "The team analyzed about the data."
   **Key:** B

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_professional_summary_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_professional_summary",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing", "speaking"],
  "skill_items": {
    "grammar": [
      "grammar.nominalization_conciseness",
      "grammar.summary_attribution"
    ],
    "vocabulary": [
      "vocab.summary.summary",
      "vocab.summary.gist",
      "vocab.summary.paraphrase",
      "vocab.summary.condense",
      "vocab.summary.key_point",
      "vocab.summary.supporting_detail",
      "vocab.summary.attribution",
      "vocab.summary.scope"
    ],
    "listening": [
      "listening.summary_context"
    ],
    "pronunciation": [
      "pronunciation.summary_gist_vowels"
    ],
    "reading": [
      "reading.summarization",
      "reading.summary_attribution"
    ],
    "writing": [
      "writing_summary"
    ]
  },
  "prereq_lessons": [
    "les_b1_it_write_docs",
    "les_a2_it_terms_basics",
    "les_b2_register_nuance"
  ],
  "estimated_time_min": 15
}
```
