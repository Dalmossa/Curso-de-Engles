# Lesson: TypeScript Basics: Types, Interfaces, Generics, Async

**Lesson ID:** `les_a2_it_typescript_basics`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: revisando a tipagem de uma função de perfil

> **Marina (frontend developer, Belo Horizonte):** "I let TypeScript infer most types, but I annotated `id`: it can be a string or null."
>
> **Caio (tech lead, remote):** "Good. Does the interface describe the shape of the whole profile?"
>
> **Marina:** "Yes. `Profile` says which fields we expect; it does not create the values."
>
> **Caio:** "And what happens when `id` is null?"
>
> **Marina:** "We use a type guard. We check whether it is a string, and then we narrow the type."
>
> **Caio:** "Can we keep the input type and the output type linked?"
>
> **Marina:** "That is the generic. The function is async too, so we await the Promise before we return the profile."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **type annotation** | anotação de tipo | Escreva *annotate a variable* / *add a type annotation*; não diga *tipo anotado* em inglês. |
| **type inference** | inferência de tipo | *TypeScript infers the type* soa natural; o sujeito é o compilador, não o desenvolvedor. |
| **interface** | interface, contrato de forma | Diga *the interface describes the shape of the object*; *interface* não é sinônimo de classe. |
| **union type** | tipo união | Na fala, leia `string \| null` como *string or null* — nunca *string and null*. |
| **type guard** | guarda de tipo | *Add a type guard* é a forma corrente; a guarda é o que estreita o tipo. |
| **narrow down** | estreitar, reduzir | Phrasal verb: *we narrow the type after the check*. Também existe *narrow it down*. |
| **generic** | genérico, tipo parametrizado | *A generic keeps the input and output types linked*; evite *generics serve for everything*. |
| **Promise** | promessa | Use artigo: *a Promise of Profile*; em código, escreva `Promise<Profile>`. |
| **async / await** | assíncrono / esperar | *This function is async, so we await the response* — *await* é o verbo da linguagem. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "TypeScript **infer** the type." | "TypeScript **infers** the type." | Sujeito de 3ª pessoa singular leva *-s* no presente simples. |
| "We **no need** to write the type." | "We **don't need** to write the type." | *Need* é verbo: a negação pede *don't* / *doesn't*. |
| "It can be **string and null**." | "It can be **a string or null**." | Uma união é uma alternativa; use *or*, e *string* leva artigo na fala. |
| "We use **any** for everything." | "We **avoid any** and use a union type." | `any` desliga a checagem; em revisão, o verbos esperado é *avoid*. |
| "The generic **works for everything**." | "The generic **keeps the input and output types linked**." | O valor do genérico é a relação entre entrada e saída, não amplitude. |
| "We **wait** the Promise." | "We **await** the Promise." | *Wait* pede preposição (*wait for*); *await* é transitivo e é o termo da linguagem. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Gramática: concordância ao falar de inferência

Escolha a forma correta: "TypeScript ______ the type, so we don't need to write it."

| Opção | Frase |
|---|---|
| A | **"infers"** |
| B | "infer" |
| C | "is infer" |
| D | "don't infer" |

**Key:** A

*TypeScript* é sujeito de 3ª pessoa do singular, então o presente simples leva *-s*: *infers*. A forma *infer* serve para *I/you/we/they*; *is infer* mistura *be* com verbo na forma base; e *don't infer* contradiz a segunda metade da frase.

### Exercício 2 — Vocabulário: termo ↔ explicação

Ligue cada explicação ao termo correto da revisão:

| Explicação na revisão | Termo |
|---|---|
| "It keeps the input type and the output type linked." | a. a generic |
| "It says which fields we expect on the object." | b. an interface |
| "It checks the value and narrows the type." | c. a type guard |

**Key:** ver tabela.

O genérico preserva a relação entre entrada e saída; a interface descreve a forma esperada sem criar valores; e a guarda de tipo é o que permite estreitar o tipo depois da checagem.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Nós esperamos a Promise antes de retornar." | "We await the Promise before we return." |
| "O id pode ser string ou nulo." | "The id can be a string or null." |
| "Nós reduzimos o tipo com uma guarda." | "We narrow the type with a type guard." |

**Key:** ver tabela.

*Wait* exigiria *for*; aqui o verbo da linguagem é *await*. A união se lê com *or* e artigo em *string*, e *narrow* funciona como verbo transitivo seguido do objeto *the type*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

The interface describes the shape of the profile, not the values inside it.
The id is a union type: it can be a string or null.
We narrow it with a type guard before we call the API.
The generic keeps the input type and the output type together.
This function is async, so we await the Promise before we return the name.

### Foco articulatório para falantes de pt-BR

- **/ˈjuːniən/ em *union***: a tônica cai na primeira sílaba, diferente de *união* no pt-BR; não desloque o acento para *-on*.
- **/dʒəˈnerɪk/ em *generic***: comece com /dʒ/ (como em *generic*, não /g/ duro) e marque a segunda sílaba.
- **/ˈprɑːmɪs/ em *Promise***: tônica na primeira sílaba; evite o ritmo de *proMESSA*, com acento no fim.
- **/əˈweɪt/ em *await***: comece com o som fraco /ə/ e mantenha o /w/ antes da vogal; não diga *avayt*.
- **/ˈnæroʊ/ em *narrow***: a primeira vogal é /æ/ (mais aberta que o *a* do pt-BR) e o final é /oʊ/, não *narrowê*.

### Prompt de produção (oral ou escrita)

Imagine que você está explicando uma pequena função de perfil para um colega em outra empresa. Escreva ou diga **4 a 6 falas** de uma revisão de código em que você:

1. Usa **interface** para falar da forma do objeto.
2. Apresenta o `id` como **union type** (*string or null*).
3. Explica o **type guard** com o verbo *narrow*.
4. Usa **generic** para ligar entrada e saída, e termina com **async** + **await** + **Promise**.
5. Faz uma pergunta sobre o caso nulo e fecha com uma ação concreta (*I will add the guard* / *Please check the signature*).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O colega diz "We narrow it with a type guard." O que ele quer dizer?
   A) Nós apagamos o tipo da variável.  B) Nós reduzimos o tipo depois de checar o valor.  C) Nós trocamos a interface por uma classe.  D) Nós criamos uma Promise nova.
   **Key:** B

2. **Gramática / uso (L1):** Qual frase está natural em uma revisão de código?
   A) "TypeScript infer the type, so we skip the annotation."  B) "TypeScript don't infer the type here."  C) "TypeScript infers the type, so we skip the annotation."  D) "TypeScript is infer the type here."
   **Key:** C

---

**Listening input:** `rendered_tts_static`
**Pack ID:** `pack_les_a2_it_typescript_basics_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_typescript_basics",
  "cefr_level": "A2",
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
      "grammar.ts_type_inference",
      "grammar.ts_null_modals"
    ],
    "vocabulary": [
      "vocab.ts_core_types",
      "vocab.ts_label_skim"
    ],
    "reading": [
      "reading.ts_review_detail",
      "reading.ts_inference_note"
    ],
    "listening": [
      "listening.ts_review_context"
    ],
    "pronunciation": [
      "pronunciation.ts_technical_stress"
    ],
    "speaking": [
      "speaking.ts_review_walkthrough"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
