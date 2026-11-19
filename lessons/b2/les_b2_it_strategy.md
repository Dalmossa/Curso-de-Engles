# Lesson: Technical Strategy Communication

**Lesson ID:** `les_b2_it_strategy`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: apresentação de roadmap para stakeholders

> **Helena (staff engineer, São Paulo):** "Let me walk you through the roadmap. Our north star is faster time to value for product teams."
>
> **Marcos (product director):** "Before we dive in, what is the main trade-off you want us to approve?"
>
> **Helena:** "We're doubling down on the platform layer in Q1. That means we're pausing the legacy reporting UI until Q3."
>
> **Marcos:** "How do we get buy-in from support? They own that UI."
>
> **Helena:** "I'll share a one-pager with three milestones, the dependencies and the risks — and I'll flag the tech debt we're carrying."
>
> **Marcos:** "Which metric tells us the bet worked?"
>
> **Helena:** "Lead time for changes. We'll compare it with the KPI baseline at the end of every milestone."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso em TI |
|---|---|---|
| **roadmap** | roadmap / roteiro | Plano temporal de entregas; em en-US escreva *roadmap* junto. |
| **north star** | estrela-guia / direção norteadora | Objetivo de longo prazo que orienta decisões; não é a estrela literal. |
| **trade-off** | compensação / escolha de compromisso | Abrir mão de algo para ganhar outra coisa; use o verbo *make*: *make a trade-off*. |
| **buy-in** | adesão / comprometimento | Apoio ativo de quem decide ou executa; não é "compra". |
| **milestone** | marco verificável | Ponto checável do plano, com data e critério — não apenas "marco histórico". |
| **dependency** | dependência | Algo que precisa acontecer antes; *the API is a dependency*, *the team depends on the API*. |
| **risk** | risco | Evento futuro com probabilidade e impacto; algo que já aconteceu é um *issue*. |
| **tech debt** | dívida técnica | Custo futuro causado por atalhos atuais; a forma curta é a mais comum em falas de times. |
| **metric** | métrica | Medida observável; *KPI* é um tipo de métrica, não sinônimo de toda métrica. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Vamos priorizar isso." → "We are double down on this." | "We're **doubling down on** this." / "We'll **prioritize** this." | *Double down* pede *-ing*; a forma com *will* soa mais neutra. |
| "Dívida técnica" → "debt technical" | "**technical debt**" / "**tech debt**" | O modificador vem antes do núcleo, como em *technical strategy*. |
| "Precisamos do buy-in" → "we need the buy in" | "We need **buy-in**." | *Buy-in* é substantivo composto com hífen; não se escreve separado. |
| "O time é dependente da API" → "the team is dependent of the API" | "The team **depends on** the API." / "The API is a **dependency**." | O adjetivo pede *on*; com *dependency*, o substantivo faz o papel. |
| "Isso é um risco" (falando do incidente de ontem) | "That's an **issue**." / "That was an **issue**." | *Risk* é futuro; *issue* é um problema já presente ou passado. |
| "Nossa estrela é a experiência do dev" → "our north is developer experience" | "Our **north star** is developer experience." | O termo completo é necessário para o sentido de direção estratégica. |
| "Fazer um trade-off" → "do a trade-off" | "**Make a trade-off**." | Colocação fixa: escolhas de escopo são *made*, não *done*. |
| "Marco 1" → "mark one" | "**Milestone 1**." | *Milestone* é o substantivo para etapa verificável de um plano. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (formas de futuro no roadmap)

Qual linha apresenta o compromisso de Q1 com formas de futuro corretas?

| Opção | Frase |
|---|---|
| A | "We will migrating to the platform layer next quarter." |
| B | "We are going migrate to the platform layer next quarter." |
| C | **"We're going to migrate to the platform layer next quarter, and the team will present the roadmap on Monday."** |
| D | "We will to migrate to the platform layer next quarter." |

**Key:** C

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural de uma apresentação de roadmap:

| Português (intenção) | Resposta esperada |
|---|---|
| "Nossa estrela-guia é reduzir o tempo de entrega." | "Our north star is cutting lead time." |
| "Vamos abrir mão dos relatórios legados para reduzir dívida técnica." | "We're making a trade-off: pausing legacy reports to reduce tech debt." |
| "Precisamos da adesão do suporte antes do marco de março." | "We need buy-in from support before the March milestone." |
| "A API de identidade é uma dependência do primeiro marco." | "The identity API is a dependency for the first milestone." |

**Key:** ver tabela — cada linha troca o calco do pt-BR por uma expressão fixa de estratégia (*north star*, *make a trade-off*, *buy-in*, *dependency*).

### Exercício 3 — Complete a apresentação

Preencha com **north star**, **milestone**, **dependency**, **risk** ou **tech debt**:

1. "Our ______ is faster onboarding for new teams."
2. "The first ______ is a self-service deploy in March."
3. "Fine-grained scopes in the identity API are a ______ for that step."
4. "The single-region database is the main ______ we are mitigating."
5. "Every shortcut we keep today becomes ______ tomorrow."

**Key:** 1) north star; 2) milestone; 3) dependency; 4) risk; 5) tech debt — note que *risk* é o evento futuro, enquanto *issue* seria o problema já materializado.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
Our north star is faster time to value for every product team.
In Q1 we'll double down on the platform layer and treat the old UI as a dependency.
The main trade-off is shipping fewer reports to reduce tech debt.
We'll review each milestone against the KPI baseline and share the risks early.
If we get buy-in from support, we can present the roadmap to the steering committee.

### Foco articulatório para falantes de pt-BR

- **/θ/ em *north***: ponta da língua entre os dentes, sem voz — não diga "nort" com /t/.
- **/ð/ em *the, every***: mesmo lugar de articulação, mas com voz; distinga de /θ/ em *north*.
- **/aʊ/ em *doubling down***: diptongo completo /aʊ/ nas duas sílabas; evite uma vogal pura tipo "dobilin daun".
- **/eɪ/ em *layer* e *trade***: deslize de /e/ para /ɪ/; não substitua por /e/ do pt-BR.
- **/f/ final em *off* (de *trade-off*)**: solte o ar sem acrescentar "e" — nem "trade-off-e".
- **Ligação em *double down on*, *get buy-in***: encadeie /l/ + /d/ e /t/ + /aɪ/ sem pausa entre as palavras funcionais.

### Prompt de produção (oral ou escrita)

Você tem 2 minutos para apresentar um trecho de roadmap a stakeholders não técnicos. Escreva ou diga 6–8 frases que:

1. nomeiem a **north star** da sua área;
2. anunciem um **trade-off** explícito com *we're doubling down on...*;
3. declarem um **milestone** com data e critério verificável;
4. nomeiem uma **dependency** e um **risk**, com a mitigação;
5. peçam **buy-in** usando uma pergunta;
6. fechem com a **metric** que será revisada e com o **KPI** de referência.

Use pelo menos 6 termos do glossário e um detalhe real do seu contexto (fila, deploy, API, incidente, relatório).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Um colega diz "We need buy-in from support." O que ele quer dizer?
   A) O time de suporte vai pagar pelo projeto.
   B) **O time de suporte apoia e se compromete com o plano.** ✓
   C) O time de suporte apenas participa das reuniões.
   D) O time de suporte vai escrever o código.
   **Key:** B

2. **Gramática/uso (L1):** Qual linha usa *dependency* corretamente?
   A) "The team is dependent of the identity API."
   B) "The team is depending of the identity API."
   C) **"The identity API is a dependency for the first milestone."** ✓
   D) "The API is a dependency of the team are blocked."
   **Key:** C

3. **Pragmática (L1):** Qual frase descreve um **risk**, e não um **issue**?
   A) **"The migration may slip if the identity API is late; we'll mitigate it with read-only access."** ✓
   B) "The migration slipped last week and reports went down."
   C) "The reports were unavailable for twenty minutes yesterday."
   D) "We already fixed the broken endpoint this morning."
   **Key:** A

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_strategy_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_strategy",
  "cefr_level": "B2",
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
      "grammar.strategy_future_forms",
      "grammar.present_simple_regular"
    ],
    "vocabulary": [
      "vocab.strategy.roadmap",
      "vocab.strategy.north_star",
      "vocab.strategy.trade_off",
      "vocab.strategy.buy_in",
      "vocab.strategy.milestone",
      "vocab.strategy.dependency",
      "vocab.strategy.risk",
      "vocab.strategy.tech_debt",
      "vocab.strategy.metric",
      "vocab.acronyms_corporate"
    ],
    "listening": [
      "listening.strategy_roadmap_context"
    ],
    "pronunciation": [
      "pronunciation.strategy_th_dental",
      "pronunciation.strategy_diphthongs"
    ],
    "reading": [
      "reading.strategy_roadmap_summary",
      "reading.strategy_risk_mitigation"
    ],
    "speaking": [
      "speaking.strategy_roadmap_pitch"
    ],
    "writing": [
      "writing.strategy_onepager"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_typescript_basics",
    "les_a2_it_algorithms_basics",
    "les_a2_corpus_intro",
    "les_b1_it_acronyms_deep"
  ],
  "estimated_time_min": 15
}
```
