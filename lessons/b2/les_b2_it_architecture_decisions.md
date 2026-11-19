# Lesson: Architecture Decision Records

**Lesson ID:** `les_b2_it_architecture_decisions`
**Module:** `mod_b2_it_senior`
**CEFR:** B2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisão de um ADR na reunião de arquitetura

O time discute o **ADR-027**, um registro fictício sobre a escolha de uma fila gerenciada para eventos de pedido. O áudio está diferido (`deferred_render`); o texto abaixo é o input.

> **Rafael (staff engineer, São Paulo):** "Let's review ADR-027 before the architecture meeting. The **status** is still **proposed**, and I want it **accepted** today."
>
> **Carla (platform engineer, Recife):** "The **context** is clear: order events are dropped when the checkout service restarts during a deploy. But the **decision** needs one sentence, not three."
>
> **Rafael:** "Agreed. 'We will publish order events to a managed queue.' That is the decision."
>
> **Carla:** "Then list the **alternatives**: a self-hosted broker — **rejected**, because the on-call load is too high; and database polling — **rejected**, because it adds latency."
>
> **Rafael:** "And the **consequences**: fewer dropped events, but a new monthly cost and less control over retention. That is the **trade-off**."
>
> **Carla:** "One more **constraint**: the team must keep the current database for six more months. Put it in the context, not in the decision."
>
> **Rafael:** "Good. If the cost stops making sense, we don't edit this record — we write a new ADR that **supersedes** it and link both."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **ADR (Architecture Decision Record)** | registro de decisão de arquitetura | Sigla corrente; escreva *ADR-027* com hífen e número. |
| **context** | contexto | A situação que motivou a decisão; vem antes da decisão. |
| **decision** | decisão | Uma frase no passado ou no futuro simples: *we decided to…*, *we will use…*. |
| **consequences** | consequências | Efeitos positivos **e** negativos; prefira a *impacts*, que soa negativo em en-US. |
| **alternatives** | alternativas | Opções consideradas; o padrão é *alternatives considered*. |
| **trade-off** | compensação / troca de benefícios | Ganho aqui, custo ali; não traduza como *change*. |
| **superseded** | substituído por registro posterior | Em ADR, a decisão antiga é marcada como *superseded*, não apagada. |
| **rejection** | rejeição | Ato de descartar uma alternativa; nomes de seção usam *rejected*. |
| **constraint** | restrição / limitação | Limite imposto (prazo, orçamento, sistema legado); não confunda com *restriction* de acesso. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "A decisão foi tomada." → "The decision was taken." | "The decision was made." / "We decided." | Em inglês, decisões são *made*, nunca *taken*. |
| "Por causa disso." → "For this cause." | "Consequently." / "As a result." | *For this cause* soa arcaico; o conector natural é *consequently*. |
| "Nós decidimos usar uma fila." → "We decided use a queue." | "We decided to use a queue." | *Decide* pede infinitivo com **to**. |
| "Foi rejeitado por causa da latência." → "It was rejected cause of latency." | "It was rejected because of latency." / "It was rejected due to latency." | *Because of* e *due to* são as formas fixes; *cause of* não é conector. |
| "Os impactos da decisão." → "The impacts of the decision." | "The consequences of the decision." | *Consequences* cobre ganhos e perdas; *impacts* tende ao negativo. |
| "Substituímos o ADR antigo." → "We replaced the old ADR." (sem rastro) | "The old ADR was **superseded** by ADR-028." | *Supersede* preserva o histórico; *replace* sugere apagar. |
| "Uma troca de benefícios." → "A change of benefits." | "A trade-off." | *Trade-off* é o termo fixo para equilíbrio entre custo e benefício. |
| "Restrição de tempo." → "Time restriction." (em arquitetura) | "Time constraint." | *Constraint* é o limite de projeto; *restriction* é mais comum em regras de acesso. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Vocabulário (MCQ)

Em um ADR, o que a seção **consequences** registra?

| Slot | Value |
|---|---|
| A | A lista de pessoas que aprovaram a decisão. |
| B | **Os efeitos positivos e negativos da decisão.** ✓ |
| C | O código-fonte que implementa a decisão. |
| D | O cronograma de implantação do time. |

**Key:** B

### Exercício 2 — Gramática (voz passiva em ADR)

Reescreva a frase na voz passiva, no estilo de um ADR: "The team rejected database polling because of latency."

> "Database polling ______ ______ because of latency."

| Slot | Value |
|---|---|
| A | is reject |
| B | was rejecting |
| C | **was rejected** ✓ |
| D | were rejected |

**Key:** C

### Exercício 3 — Registro (tradução de armadilhas)

Escolha a versão em en-US natural para: "A decisão foi tomada; por causa disso, mudamos o plano."

| Slot | Value |
|---|---|
| A | "The decision was taken; for this cause, we changed the plan." |
| B | "The decision was made; consequently, we changed the plan." ✓ |
| C | "The decision was made; for this cause, we changed the plan." |
| D | "The decision was taken; consequently, we changed the plan." |

**Key:** B

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

ADR-027 is still proposed, so the team will review it before the architecture meeting.
The context is clear: order events are dropped when the checkout service restarts during a deploy.
We decided to publish order events to a managed queue, and we rejected database polling because of latency.
The consequences are fewer dropped events, a new monthly cost, and less control over retention.
If the trade-off stops making sense, we don't edit this record; we write a new ADR that supersedes it.

### Foco articulatório para falantes de pt-BR

- **/ð/ em *the, this, that***: o mesmo /ð/ sonoro de *the* — ponta da língua entre os dentes, com voz. Não substitua por /d/ (*de*).
- **/ʒ/ em *decision***: som sonoro de *measure*, não o /ʃ/ surdo de *ship*. Evite o "decishon" do pt-BR.
- **/t/ final em *rejected***: solte o ar sem acrescentar /ɪ/ (*rejected-e*); a epêntese final é comum em pt-BR.
- **/iː/ em *team, events***: vogal longa e tensa; não encurte para /ɪ/.
- **Acento em *supersede* /ˌsuːpərˈsiːd/**: a força está na última sílaba, não na primeira — "su-per-**SEED**".

### Prompt de produção (escrita)

Escreva um ADR curto em inglês para uma decisão fictícia do seu contexto (fila, cache ou banco). Use cabeçalhos e inclua, em tópicos:

1. um **título** no formato `ADR-XXX: <decisão>`;
2. um **status** (*proposed* ou *accepted*);
3. um **context** de duas frases com o problema e pelo menos uma **constraint**;
4. uma **decision** de uma frase com *we decided to…* ou *we will use…*;
5. pelo menos duas **consequences**, uma positiva e uma negativa;
6. uma **alternative** com *rejected —* e o motivo;
7. uma frase de **trade-off** dizendo o que se ganha e o que se perde.

Não reproduza texto de nenhuma fonte externa: invente o cenário e escreva com as suas próprias palavras.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "ADR-028 supersedes ADR-027", o verbo significa:
   A) Aprova o ADR antigo.  B) **Substitui o ADR antigo, mantendo o histórico.**  C) Apaga o ADR antigo.  D) Copia o ADR antigo.  
   **Key:** B — *supersede* preserva o registro anterior e o marca como tal; não é exclusão nem aprovação.

2. **Gramática (L1):** Qual linha registra uma alternativa no estilo de um ADR?
   A) **"Database polling was rejected because of latency."**  B) "Database polling rejected because of latency."  C) "Database polling were rejected because of latency."  D) "Database polling was reject because of latency."  
   **Key:** A — o passivo exige *was* + particípio (*rejected*) e concordância com o sujeito singular.

3. **Registro (L1):** Qual par de conectores está correto em "A decisão foi tomada; por causa disso, o plano mudou"?
   A) "The decision was taken; for this cause, the plan changed."  B) "The decision was taken; consequently, the plan changed."  C) **"The decision was made; consequently, the plan changed."**  D) "The decision was made; for this cause, the plan changed."  
   **Key:** C — *decision is made* e *consequently* são as formas naturais; *taken* e *for this cause* soam inadequados.

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b2_it_architecture_decisions_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b2_it_architecture_decisions",
  "cefr_level": "B2",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "deferred_render",
  "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "reading", "writing"],
  "output_modalities": ["writing"],
  "skill_items": {
    "grammar": ["grammar.passive_adr", "grammar.passive_basics"],
    "vocabulary": [
      "vocab.adr.context",
      "vocab.adr.decision",
      "vocab.adr.consequences",
      "vocab.adr.alternatives",
      "vocab.adr.trade_off",
      "vocab.adr.supersede",
      "vocab.adr.rejection",
      "vocab.adr.constraint",
      "vocab.adr.status",
      "vocab.it_computer_terms"
    ],
    "listening": ["listening.adr_review"],
    "pronunciation": ["pronunciation.adr_voiced_th", "pronunciation.adr_word_stress"],
    "reading": ["reading.adr_scan"],
    "writing": ["writing.adr_draft"]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_typescript_basics",
    "les_a2_it_algorithms_basics"
  ],
  "estimated_time_min": 15
}
```

---

## Nota de autoria

O diálogo, o ADR fictício (ADR-027), as tabelas, os exercícios, as sentenças-alvo, o prompt de produção e os itens de verificação são 100% originais, escritos em clean-room para falantes de pt-BR. Nenhum texto de fonte externa foi reproduzido ou adaptado; nomes de cargos, empresas e números de ADR são fictícios.
