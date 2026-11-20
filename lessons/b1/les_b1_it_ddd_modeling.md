# Lesson: Domain-Driven Design: Aggregates, Entities, Value Objects, Repositories

**Lesson ID:** `les_b1_it_ddd_modeling`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: uma discussão de modelagem antes de abrir o editor

> **Marina (tech lead, Belo Horizonte):** "Before we touch the code, let's agree on the words. In our *Billing* context, an invoice is an **entity**: we follow it by its number even when the amount changes."
>
> **Tomás (backend developer, remote):** "And the delivery address on it? I would call that a **value object** — we compare the street, the city and the postcode, not an id."
>
> **Marina:** "Good. The invoice and its lines form one **aggregate**: we load them together and save them together. The invoice is the **aggregate root**, so nothing else may change a line directly."
>
> **Tomás:** "Then the **invariant** is that the total equals the sum of the lines, and the root checks it before we save?"
>
> **Marina:** "Exactly. Our **repository** behaves like a collection: `Invoices.findById(...)`. It keeps the database out of the domain."
>
> **Tomás:** "When the total is confirmed, we record a **domain event** — `InvoiceConfirmed` — and the other contexts can react to it."
>
> **Marina:** "That is the point of a **bounded context**: *Billing* says *invoice*, *Shipping* says *parcel*. One word, one meaning, inside its own boundary."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **bounded context** | contexto delimitado | *Context* é a área onde o termo faz sentido; não escreva *limited context* em code review. |
| **ubiquitous language** | linguagem onipresente | *Ubiquitous* quer dizer "presente em todo lugar"; escreva sem hífen e use a mesma palavra em reunião e no código. |
| **entity** | entidade | Um *entity* se define pela identidade; o plural é *entities*, não *entitys*. |
| **value object** | objeto de valor | Escreva as duas palavras separadas: comparamos os campos, não um id. |
| **aggregate** | agregado | Substantivo com acento na primeira sílaba: /ˈæɡrɪɡət/. Não confunda com o verbo *aggregate*. |
| **aggregate root** | raiz do agregado | *Root* é a única porta de entrada do grupo; diga *the root of the aggregate* ao explicar para alguém de fora. |
| **repository** | repositório | Atenção à grafia: *repository*, não *repositry*. O verbo natural é *load* / *save*. |
| **invariant** | invariante | *Invariant* funciona como substantivo e adjetivo; o verbo que combina com ele é *enforce*. |
| **domain event** | evento de domínio | Um *event* registra algo que **já aconteceu**: *InvoiceConfirmed*, não *InvoiceConfirming*. |
| **factory** | fábrica | *Factory* monta objetos complexos; *factor* é "fator" — são palavras diferentes. |
| **to enforce an invariant** | impor uma invariante | Use *enforce* para regras que precisam continuar verdadeiras; *implement* soa como detalhe de código. |
| **to load / to save an aggregate** | carregar / salvar um agregado | Na linguagem de repositório, *load* e *save* soam mais naturais que *get* e *put*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "Nós **implementamos** a invariante no repositório." | "We **enforce** the invariant at the aggregate root." | *Enforce* é o verbo de regra; *implement* descreve código, não a garantia do domínio. |
| "O objeto de valor **tem um ID**." | "The value object **has no ID**; we compare its fields." | Objetos de valor são comparados pelo conteúdo; id é marca de entidade. |
| "A entidade é **sempre imutável**." | "An entity keeps its **identity** even when its fields change." | O que permanece na entidade é a identidade, não todos os campos. |
| "O repositório salva **entidades soltas**." | "The repository **saves the aggregate** as one unit." | A unidade de persistência é o agregado, não cada objeto isolado. |
| "Nós **fazemos** um evento quando o total muda." | "We **record** a domain event when the total is confirmed." | Evento é registro de um fato passado: *record* ou *publish*. |
| "**Aggregate root** é a raiz do banco." | "The aggregate root is the **only entry point** to the cluster." | *Root* aqui é a porta de entrada do modelo, não uma tabela raiz. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Relative clauses em definições técnicas

Escolha a palavra que completa a definição de forma natural: "A value object is a description ______ we compare by its fields, not by an id."

| Opção | Frase |
|---|---|
| A | "who" |
| B | **"that"** |
| C | "whom" |
| D | "whose" |

**Key:** B

Use *that* (ou *which*) para definir coisas: a descrição é um objeto, não uma pessoa. *Who* e *whom* servem para pessoas, e *whose* indica posse — nenhum dos três cabe nessa oração relativa.

### Exercício 2 — Passive voice com invariantes

Complete: "Invariants ______ at the aggregate root before the change is saved."

| Opção | Frase |
|---|---|
| A | "enforce" |
| B | **"are enforced"** |
| C | "are enforcing" |
| D | "enforced" |

**Key:** B

O sujeito *invariants* recebe a ação, então o registro técnico pede *be + past participle*: **are enforced**. *Enforce* e *are enforcing* ficam ativos, e *enforced* sozinho não tem auxiliar.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Carregamos o agregado pelo repositório." | "We load the aggregate through the repository." |
| "A raiz verifica a invariante antes de salvar." | "The root enforces the invariant before saving." |
| "Registramos um evento de domínio quando o total é confirmado." | "We record a domain event when the total is confirmed." |

**Key:** ver tabela.

*Through* marca o caminho da operação, *enforce* é o verbo da regra e *record* combina com um fato já concluído — por isso a última frase usa *is confirmed* antes de *we record*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

We define the entity by its id, not by its fields.
The address is a value object that we compare by its content.
The invoice and its lines form one aggregate, and the root is the only door.
Invariants are enforced at the root before the aggregate is saved.
We record a domain event when the total is confirmed.

### Foco articulatório para falantes de pt-BR

- **/ˈæɡrɪɡət/ em *aggregate***: a tônica é a primeira sílaba (*AG*-gre-gate); evitar *agre-GATE* ajuda o interlocutor a reconhecer o termo na reunião.
- **/rɪˈpɒzɪtəri/ em *repository***: acento na segunda sílaba (*re-PO-si-tory*); a tendência em pt-BR é puxar o acento para o início.
- **/dɒˈmeɪn/ em *domain* e /ɪnˈværiənt/ em *invariant***: os dois terminam com a sílaba tônica; não desloque para *DO-main* nem *IN-variant*.
- **/ˈentɪti/ em *entity* e /θ/ em *through***: *entity* começa tônico; em *through*, a ponta da língua passa entre os dentes (/θ/), sem virar /t/ ou /f/.

### Prompt de produção (oral ou escrita)

Imagine que você está explicando o modelo de *Billing* para um colega de outro time. Escreva ou diga **4 a 6 falas** em que você:

1. Nomeia um *bounded context* e uma palavra que pertence a ele.
2. Aponta uma **entity** (com id) e um **value object** (comparado por campos).
3. Usa uma oração relativa com **that** para definir um dos termos.
4. Usa uma passiva com **is/are + past participle** (*is enforced* / *is saved*).
5. Termina com um **domain event** no passado (*We recorded...*).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O colega diz "The root enforces the invariant." O que ele quer dizer?
   A) O repositório cria uma nova tabela.  B) A raiz verifica a regra antes de salvar.  C) O evento foi publicado antes da mudança.  D) O objeto de valor recebeu um id.
   **Key:** B

2. **Gramática (L1):** Qual definição está correta?
   A) "A value object who has no id."  B) "A value object that we compare by its fields."  C) "A value object whom we compare by its fields."  D) "A value object whose we compare by its fields."
   **Key:** B

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_b1_it_ddd_modeling_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_ddd_modeling",
  "cefr_level": "B1",
  "status": "authored",
  "reuse_basis": "authored_material",
  "provenance": "authored_material",
  "source": "Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.",
  "listening_input": "rendered_tts_static",
  "listening_input_status": "rendered_tts_static - static TTS audio clips rendered for corpus listening and pending practice items",
  "skills_touched": ["grammar", "vocabulary", "listening", "reading", "pronunciation", "speaking"],
  "output_modalities": ["speaking", "writing"],
  "skill_items": {
    "grammar": [
      "grammar.ddd_defining_relative_clauses",
      "grammar.passive_definitions"
    ],
    "vocab": [
      "vocab.ddd.bounded_context",
      "vocab.ddd.ubiquitous_language",
      "vocab.ddd.entity",
      "vocab.ddd.value_object",
      "vocab.ddd.aggregate",
      "vocab.ddd.aggregate_root",
      "vocab.ddd.repository",
      "vocab.ddd.invariant",
      "vocab.ddd.domain_event",
      "vocab.it_terms_basics"
    ],
    "reading": [
      "reading.ddd_invariant_scan",
      "reading.ddd_model_notes"
    ],
    "listening": [
      "listening.ddd_architecture_context"
    ],
    "pronunciation": [
      "pronunciation.ddd_term_stress"
    ],
    "speaking": [
      "speaking.ddd_model_defense"
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
