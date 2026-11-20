# Lesson: Writing Documentation & RFCs

**Lesson ID:** `les_b1_it_write_docs`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisando um RFC de política de retentativas

> **Luiza (tech lead, São Paulo):** "We need an RFC for the payment retry policy. Keep the **problem** to two sentences — no solution yet."
>
> **Caio (backend developer, remoto):** "Should the proposal mention the idempotency key, or is that a separate **design doc**?"
>
> **Luiza:** "Put it in the **proposal**. A design doc can go deeper later; the RFC needs the **trade-off** and the **rollout**."
>
> **Marina (platform engineer, Recife):** "The **runbook** is missing. If we ship this, on-call needs the rollback steps."
>
> **Caio:** "I'll add a **getting started** section and a **code sample**. The **audience** is backend devs, so skip the product overview."
>
> **Luiza:** "Good. Add a **deprecation note** for the old endpoint, link the **ADR** in the **table of contents**, and post comments by Friday."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **RFC** | proposta aberta a comentários | *Request for Comments*: um convite para revisar uma ideia; não é um relatório de bug. |
| **design doc** | documento de design | Detalha **como** implementar; o RFC discute **por que** e com quais alternativas. |
| **ADR** | registro de decisão de arquitetura | *Architecture Decision Record*: registra a decisão já tomada e o contexto dela. |
| **runbook** | manual de operação | Passos que o plantão executa durante um incidente; imperativo e sem teoria. |
| **getting started** | primeiros passos | Seção de um README para quem nunca rodou o projeto; use o imperativo. |
| **table of contents** | índice / sumário | Em docs longas, lista as seções na ordem em que aparecem. |
| **code sample** | exemplo de código | Deve compilar; trate cada trecho como código de produção. |
| **deprecation note** | aviso de descontinuação | Avisa que algo será removido; use *deprecated*, nunca *depreciated*. |
| **trade-off** | prós e contras de uma escolha | Apresente o que se ganha **e** o que se paga — uma coluna só não é trade-off. |
| **rollout** | implantação gradual | Diga a ordem e o percentual: *five percent first, then one hundred percent*. |
| **audience** | público-alvo | Escreva para quem lê: devs, operação ou produto mudam o vocabulário. |
| **keep it concise** | mantenha conciso | Cortar adjetivos vagos é decisão de escrita, não falta de detalhe técnico. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Vamos discutir sobre a proposta." → "Let's discuss about the proposal." | "Let's discuss the proposal." | *Discuss* é transitivo: não recebe *about*. |
| "A API vai ser depreciada." → "The API will be depreciated." | "The API will be **deprecated**." | *Depreciated* é termo contábil (desvalorização); em software, a palavra é *deprecated*. |
| "Nós decidimos usar Redis." → "We decided using Redis." | "We decided **to use** Redis." | *Decide* pede o infinitivo (*to* + verbo), não o gerúndio. |
| "O RFC tem como objetivo propor chaves." | "This RFC **proposes** idempotency keys." | *This RFC proposes...* é direto; *has as objective* é calque do pt-BR. |
| "A documentação deve ser escrita por nós." → "The doc must be written by us." | "**Write** the doc in an active voice." / "We will write the doc." | Voz passiva em excesso esconde o autor da ação; prefira o imperativo em instruções. |
| "O time revisa os comentários hoje; o time revisou ontem." | "The team **reviews** comments today and **reviewed** them yesterday." | Tempo verbal precisa casar com o marcador de tempo (*today* / *yesterday*). |
| "Segue em anexo o documento." → "Please find attached the doc." | "See the **linked** spec in the table of contents." | Em repositórios, o documento é *linked*, não anexado a um e-mail. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Reconhecimento (o problema do RFC)

Qual linha apresenta o **problema** sem misturar a solução?

| Opção | Linha |
|---|---|
| A | "We will add an idempotency key to stop duplicate charges." |
| B | "Retries can charge a customer twice when the first response is lost." |
| C | "The rollout starts at five percent of traffic on Tuesday." |
| D | "The ADR records the decision made in the review." |

**Key:** B
A descreve a solução (*will add*), C descreve o *rollout* e D descreve o *ADR*. A seção de problema só nomeia o que acontece hoje: *retries can charge a customer twice*.

### Exercício 2 — Transformação L1 → L2

Reescreva as intenções em inglês natural para um RFC de pagamentos:

| Português (intenção) | Resposta esperada |
|---|---|
| "O objetivo deste RFC é propor chaves de idempotência." | "This RFC proposes idempotency keys." |
| "A API antiga será descontinuada na versão 3." | "The old API will be deprecated in version 3." |
| "O time decidiu usar Redis para guardar as chaves." | "The team decided to use Redis to store the keys." |
| "Antes de rodar, instale as dependências." | "Before running, install the dependencies." |

**Key:** ver tabela.
Note as quatro decisões: *proposes* no presente para o documento, *will be deprecated* para a remoção futura, *decided to use* com infinitivo e *install* no imperativo para o leitor.

### Exercício 3 — Complete a seção de mudanças

Preencha com `proposes`, `Install`, `will be deprecated`, `Do not commit` ou `reviews`:

1. "This RFC ______ a retry limit for the payments endpoint."
2. "______ the dependencies before you run the code sample."
3. "The old endpoint ______ in version 3."
4. "______ secrets in a code sample."
5. "The tech lead ______ comments by Friday."

**Key:** 1) proposes; 2) Install; 3) will be deprecated; 4) Do not commit; 5) reviews.
O RFC *propõe* no presente, a remoção está no futuro, as instruções usam a forma base do verbo (*Install*, *Do not commit*) e *reviews* concorda com o sujeito singular *the tech lead*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)
This RFC proposes idempotency keys for the payments endpoint.
Retries can charge a customer twice when the first response is lost.
The team decided to use Redis to store each key for twenty-four hours.
Install the dependencies and run the code sample before you review the trade-offs.
The old endpoint will be deprecated in version 3; see the ADR and the runbook for rollback steps.

### Foco articulatório para falantes de pt-BR

- **/aɪ/ em *idempotency* /ˌaɪdəmˈpoʊtənsi/ e *twice* /twaɪs/**: o ditongo é o mesmo de *eye*; não reduza a primeira sílaba de *idempotency* a /i/.
- **/ˈpoʊ/ com sílaba tônica em *idempotency***: a força está em *po*, não na abertura da palavra; evite o estresse inicial de "ídem".
- **/eɪ/ em *deprecated* /dɪˈprekeɪtɪd/**: deslize de /e/ para /ɪ/ na penúltima sílaba; não pronuncie um /e/ puro.
- **/z/ final em *keys* /kiːz/ e /s/ final em *steps* /steps/**: mantenha a sonoridade final sem acrescentar uma vogal ("keys-i", "steps-i").
- **/ð/ em *the, this***: língua entre os dentes com voz; não troque por /d/ em *the trade-offs*.
- **/k/ final em *runbook* /ˈrʌnbʊk/**: solte o ar sem inserir "e" no fim; a epêntese é comum em falantes de pt-BR.

### Prompt de produção (escrita)

Escreva um **mini-RFC de 120 a 150 palavras** para "Add idempotency keys to Payment API". Atenda a todos os requisitos:

1. comece com o título `# RFC: Add Idempotency Keys to Payment API`;
2. escreva um parágrafo de **problem** em até duas frases, sem nomear a solução;
3. abra o **proposal** com *This RFC proposes...*;
4. apresente um **trade-off** com um ganho e um custo;
5. inclua uma linha de **rollout** com percentual e dia;
6. inclua uma **deprecation note** com número de versão e a palavra *deprecated*;
7. referencie o **runbook** e um **code sample** curto (ou descreva o que ele mostra) na **table of contents**.

Inclua um detalhe real do seu contexto (endpoint, fila, config, incidente).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** Em "The old endpoint will be deprecated in version 3", *deprecation note* significa:
   A) um aviso de que algo será removido em uma versão futura  B) um relatório de erro de execução  C) um exemplo de código compilável  D) um registro de decisão de arquitetura
   **Key:** A
   Um *deprecation note* avisa a remoção futura; o relatório é um *bug report*, o exemplo é um *code sample* e a decisão vai no *ADR*.

2. **Gramática (L1):** Qual linha dá uma instrução correta em um *getting started*?
   A) "Installing the dependencies before you run the sample."  B) "To install the dependencies before you run the sample."  C) **"Install the dependencies before you run the sample."**  D) "Installed the dependencies before you run the sample."
   **Key:** C
   Instruções usam a forma base do verbo (*Install*); as alternativas A e B são fragmentos e D troca a instrução por um fato passado.

3. **Registro e tempo verbal (L1):** Qual par de frases mantém o registro e o tempo coerentes em um RFC?
   A) "This RFC is propose a retry limit. The team decided using Redis."  B) **"This RFC proposes a retry limit. The team decided to use Redis."**  C) "This RFC proposes a retry limit. The team decided using Redis."  D) "This RFC is proposing a retry limit. The team decide to use Redis."
   **Key:** B
   *Proposes* concorda com o sujeito *this RFC*, e *decided to use* traz o infinitivo exigido pelo verbo — as demais misturam formas verbais incompatíveis.

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b1_it_write_docs_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_write_docs",
  "cefr_level": "B1",
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
      "grammar.docs_imperative_directive",
      "grammar.docs_tense_consistency"
    ],
    "vocabulary": [
      "vocab.docs_rfc_terms",
      "vocab.docs_artifact_names"
    ],
    "listening": [
      "listening.docs_review_context"
    ],
    "pronunciation": [
      "pronunciation.docs_acronym_stress"
    ],
    "reading": [
      "reading.docs_rfc_structure",
      "reading.docs_runbook_detail"
    ],
    "writing": [
      "writing.docs_rfc",
      "writing.docs_formal_email",
      "writing.docs_summary"
    ]
  },
  "prereq_lessons": [
    "les_a2_writing_svo",
    "les_a1_reading_skimming",
    "les_a2_reading_strategy",
    "les_a2_it_reading_strategy",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
