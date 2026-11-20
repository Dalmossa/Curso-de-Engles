# Lesson: Testing Fundamentals: Unit Tests, Mocks, TDD Cycle

**Lesson ID:** `les_a2_it_testing_fundamentals`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: um pedido de teste na revisão de código

> **Bia (backend developer, Curitiba):** "Hi Rui. I added a function that turns cents into a price string. Can you review it?"
>
> **Rui (reviewer, remote):** "Sure. Where is the test?"
>
> **Bia:** "I haven't written one yet. I ran the app and the output looked fine."
>
> **Rui:** "Please add a **unit test** first. Keep it small: one function, one expected result."
>
> **Bia:** "The function reads a settings file. Do we call the real file in the test?"
>
> **Rui:** "No. Use a **mock** for the settings reader. It returns fixed values, so the suite stays fast. Then **assert** the string."
>
> **Bia:** "Got it. I write the test, watch it fail, then write the code — **red, green, refactor**."
>
> **Rui:** "Exactly. Send the pull request when the suite is green."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **unit test** | teste unitário | Diga *a unit test*: *unit* começa com o som /j/, então o artigo é *a*. |
| **mock** | mock, objeto simulado | *Mock* serve como substantivo e verbo: *we mock the reader*. |
| **stub** | stub, substituto fixo | Um *stub* só devolve valores combinados; ele não verifica chamadas. |
| **assert** / **assertion** | afirmar / asserção | *Assert* é o verbo; *assertion* é a verificação escrita no teste. |
| **test suite** | suíte de testes | Diga *run the suite*, não *run the tests suite*. |
| **coverage** | cobertura | É incontável: *coverage is 78%*, sem artigo antes. |
| **TDD cycle** | ciclo TDD | *Red, green, refactor* são os três passos do ciclo. |
| **fixture** | fixture, cenário inicial | É o estado conhecido antes de o teste começar. |
| **code review** | revisão de código | Diga *in the code review*, não *in the revision of code*. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "The unit test **fail** without the function." | "The unit test **fails** without the function." | Sujeito singular de 3ª pessoa leva *-s* no presente simples. |
| "We need a unit test **to** this function." | "We need a unit test **for** this function." | *Test for* indica o alvo do teste; *to* não liga esses nomes. |
| "We make the test **to pass**." | "We make the test **pass**." | Depois de *make* + objeto, use o infinitivo sem *to*. |
| "We have **80% of coverage**." | "We have **80% coverage**." | *Coverage* é incontável; o número vem direto antes dele. |
| "Let's **mock up** the settings reader." | "Let's **mock** the settings reader." | *Mock up* é criar uma maquete; *mock* é substituir a dependência no teste. |
| "The result **is equals** to the string." | "The result **is equal to** the string." | *Equal* é adjetivo; *equals* é verbo e não aceita *is* antes. |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Gramática: presente simples no ciclo de testes

Escolha a forma correta: "The unit test ______ (fail) until we add the function."

| Opção | Frase |
|---|---|
| A | "fail" |
| B | **"fails"** |
| C | "is fail" |
| D | "failing" |

**Key:** B

O sujeito *the unit test* é singular de 3ª pessoa, então o verbo leva *-s*: *fails*. A forma *fail* serve para plurais e para *I/you*; *is fail* mistura auxiliar com verbo nu; *failing* não forma uma frase completa sem *be*.

### Exercício 2 — Vocabulário: o substituto da dependência

Uma função lê um arquivo de configuração. Qual termo nomeia o objeto que a substitui no teste e devolve valores fixos?

| Opção | Frase |
|---|---|
| A | "Coverage." |
| B | "A fixture." |
| C | "A code review." |
| D | **"A mock."** |

**Key:** D

O *mock* substitui a dependência real para que o teste não abra o arquivo. *Coverage* mede a parte do código exercitada, *fixture* prepara o estado inicial e *code review* é uma revisão feita por pessoas.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "Escrevemos o teste primeiro." | "We write the test first." |
| "O teste falha até o código existir." | "The test fails until the code exists." |
| "Depois fazemos o teste passar e refatoramos." | "Then we make the test pass and refactor." |

**Key:** ver tabela.

*Write*, *fails*, *make* e *refactor* estão no presente simples porque descrevem a rotina do time. Em *make the test pass*, o verbo depois de *make* fica sem *to*.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

We write a unit test before the production code.
The test fails first, so we call this step red.
We use a mock for the settings reader and keep the suite fast.
Then we assert the result and the test turns green.
After the review, we refactor the code and run the full suite again.

### Foco articulatório para falantes de pt-BR

- **/ˈjuːnɪt/ em *unit***: comece com /juː/, como em *you*; dizer /uːnɪt/ soa como *oonit*.
- **/mɑːk/ em *mock***: vogal curta e aberta, sem deslizar para /moʊk/; *mock* rima com *rock*.
- **/əˈsɜːrt/ em *assert***: a primeira sílaba é um schwa /ə/ e a tônica é a segunda; evite um *a* aberto no início.
- **/ˈkʌvərɪdʒ/ em *coverage***: use /ʌ/ como em *cup* na primeira sílaba, não /uː/.
- **/v/ em *value***: lábio inferior encostado nos dentes de cima; não troque por /w/.

### Prompt de produção (oral ou escrita)

Imagine que você está explicando o fluxo de testes para um colega que entrou agora no time. Escreva ou diga um texto curto de **4 a 6 falas** em que você:

1. Descreve os três passos **red → green → refactor** usando o presente simples.
2. Usa **unit test**, **mock** e **assert** pelo menos uma vez cada.
3. Diz qual dependência o mock substitui e por que o teste fica rápido.
4. Termina com uma frase sobre **coverage** ou sobre o **code review**.

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O revisor diz "Use a mock for the settings reader." O que ele quer dizer?
   A) Use a leitora de configuração de verdade.  B) Use um substituto para a leitura de configuração.  C) Aumente a cobertura do código.  D) Refatore a função de preço.
   **Key:** B

2. **Gramática (L1):** Qual frase está correta?
   A) "We make the test to pass."  B) "We make the test pass."  C) "We makes the test pass."  D) "We are make the test pass."
   **Key:** B

---

**Listening input:** `rendered_tts_static` — o diálogo da FASE 1 é texto autoral, não um clipe renderizado.
**Pack ID:** `pack_les_a2_it_testing_fundamentals_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_testing_fundamentals",
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
      "grammar.testing_present_simple_habits",
      "grammar.testing_article_with_terms"
    ],
    "vocab": [
      "vocab.testing.core_terms",
      "vocab.testing.label_scan",
      "vocab.it_computer_terms_testing_glossary"
    ],
    "reading": [
      "reading.testing_review_detail",
      "reading.testing_run_detail"
    ],
    "listening": [
      "listening.testing_review_context"
    ],
    "pronunciation": [
      "pronunciation.testing_term_stress"
    ],
    "speaking": [
      "speaking.testing_tdd_explanation"
    ]
  },
  "prereq_lessons": [
    "les_a1_reading_skimming",
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```
