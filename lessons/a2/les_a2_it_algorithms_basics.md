# Lesson: Algorithms & Data Structures Basics: Big O, Arrays, Hash Maps

**Lesson ID:** `les_a2_it_algorithms_basics`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `authored_material`
**Source:** Original authored material for Brazilian software engineers (pt-BR → en-US); no external source text reproduced or adapted.
**Estimated time:** 15 min

---

## FASE 1 — Input Contextualizado (i+1) [4 min]

### Cenário: uma conversa de code review sobre uma tela lenta

> **Bia (backend developer, Recife):** "The customer page is slow again. We scan the whole array on every render."
>
> **Téo (tech lead, remote):** "How many items are in that array now?"
>
> **Bia:** "About twenty thousand. The scan is O(n), so the wait grows with the list."
>
> **Téo:** "Could we keep each customer under an id in a hash map?"
>
> **Bia:** "Yes. A key lookup is O(1) on average, but the map uses more space."
>
> **Téo:** "That is a fair trade-off. Please write the change in the review note, with the worst case too."

### Glossário contrastivo (pt-BR ↔ en-US)

| Inglês (en-US) | Português (pt-BR) | Nota de uso prático |
|---|---|---|
| **algorithm** | algoritmo | *Algorism* é erro gráfico; a palavra termina em *-thm*. |
| **data structure** | estrutura de dados | Escreva as duas palavras: *data structure* nomeia a forma de guardar os dados. |
| **array** | array, vetor | Em código, *array* é o termo corrente; *vetor* soa mais acadêmico em pt-BR. |
| **hash map** | mapa de hash, dicionário | Mantenha *hash map* em duas palavras; *dictionary* é o nome genérico. |
| **key / value** | chave / valor | Um par é *a key-value pair*, com hífen entre os dois nomes. |
| **lookup** | consulta, busca por chave | Escreva junto: *look up* é o verbo (*look up a key*), *lookup* é o substantivo. |
| **linear scan** | varredura linear | *Scan* sugere percorrer cada item; use *scan*, não *sweep*, em revisão de código. |
| **Big O notation** | notação Big O | Diga *Big O* /ˌbiː ˈɡoʊ/; descreve crescimento, não milissegundos. |
| **time complexity** | complexidade de tempo | Prefira *time complexity* a *temporal complexity* em inglês técnico. |
| **space complexity** | complexidade de espaço | É a memória extra que a solução usa, não o tamanho do disco. |
| **trade-off** | compensação, troca de vantagens | Escreva com hífen: *a trade-off between speed and space*. |
| **worst case / on average** | pior caso / em média | Diga *on average*, não *in average*, ao falar do caso médio. |

### Tabela de armadilhas comuns (falantes de pt-BR)

| Armadilha (pt-BR → forma inadequada) | Forma natural em en-US | Por quê? |
|---|---|---|
| "The Big O measures milliseconds." | "Big O **describes how the work grows** with the input." | A notação fala de crescimento assintótico, não de tempo medido no relógio. |
| "We do a lookup **of** the key." | "We **look up** the key." / "We do a **key lookup**." | *Lookup* é substantivo; a ação é o verbo *look up*. |
| "This path is **more fast than** the scan." | "This path is **faster than** the scan." | *Fast* é adjetivo curto: comparativo com *-er*, sem *more*. |
| "The lookup is O(1) **in average**." | "The lookup is O(1) **on average**." | A expressão fixa é *on average*. |
| "We store ids in **a hashmap**." | "We store ids in **a hash map**." | O glossário do time usa *hash map* em duas palavras. |
| "O(1) é o **pior caso** aqui." | "O(1) is the **average case** here." | Em hash maps, o acesso direto é O(1) em média; o pior caso pode ser O(n). |

---

## FASE 2 — Prática Guiada [5 min]

### Exercício 1 — Gramática: comparativo com *than*

Escolha a forma correta para a frase do review: "A hash map lookup is ______ a linear scan of an unsorted array."

| Opção | Frase |
|---|---|
| A | "more fast than" |
| B | **"faster than"** |
| C | "fast than" |
| D | "fastest than" |

**Key:** B

*Fast* é adjetivo curto, então o comparativo é *faster* e a comparação usa *than*. *More fast* duplica o comparativo, *fast than* perde o *-er* e *fastest* é superlativo — não cabe quando comparamos duas opções.

### Exercício 2 — Vocabulário: o que descreve Big O?

| Opção | Frase |
|---|---|
| A | "The exact runtime in milliseconds." |
| B | **"How the amount of work grows as the input grows."** |
| C | "The number of lines in the source file." |
| D | "A score for code readability." |

**Key:** B

Big O descreve o **crescimento** do trabalho (tempo ou espaço) conforme a entrada cresce. Não é medida exata de tempo, contagem de linhas nem avaliação de estilo.

### Exercício 3 — Transformação L1 → L2

Reescreva as intenções em inglês natural:

| Português (intenção) | Resposta esperada |
|---|---|
| "A busca num array sem ordem cresce com o número de itens." | "A search in an unsorted array grows with the number of items." |
| "Em média, a consulta por chave no mapa é O(1)." | "On average, a key lookup in the hash map is O(1)." |
| "Esse caminho é mais rápido, mas usa mais espaço." | "This path is faster, but it uses more space." |

**Key:** ver tabela.

*Unsorted* é o adjetivo para "sem ordem"; *on average* é a forma fixa para "em média"; e *faster ... but uses more space* resume o *trade-off* com o comparativo correto.

---

## FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]

### 5 sentenças-alvo (leia em voz corrida)

A hash map stores values under keys, so a key lookup is usually fast.
An unsorted array needs a linear scan to find one item.
Binary search on a sorted array runs in O(log n) time.
This path is faster than a linear scan, but it uses more space.
On average, a key lookup here is O(1) and the worst case is O(n).

### Foco articulatório para falantes de pt-BR

- **/ˈælɡərɪðəm/ em *algorithm***: a tônica cai na primeira sílaba; não transporte o ritmo de *algorITmo* para o inglês.
- **/ð/ medial em *algorithm* e /ð/ inicial em *this***: ponta da língua entre os dentes com voz; evite /d/ (*algodithm*).
- **/ʃ/ em *hash***: som de *ship*, não /s/; *hash* e *map* ficam em duas palavras, com a tônica em *hash*.
- **/ˌoʊ ˈwʌn/ em *O(1)***: diga *oh one*; nunca *zero one*. Em *O(log n)*, diga *oh log en*.
- **/z/ final em *grows* e /s/ final em *keys***: mantenha a consoante final solta, sem acrescentar vogal (*grows-uh*, *keys-uh*).

### Prompt de produção (oral ou escrita)

Imagine que você está explicando uma mudança de performance em uma revisão de código com um colega em outro país. Escreva ou diga um texto curto de **4 a 6 falas** em que você:

1. Nomeia o problema com pelo menos **três** termos do glossário (*array*, *hash map*, *lookup*, *linear scan*).
2. Usa **um comparativo com *than*** para comparar dois caminhos.
3. Menciona **uma complexidade** (*O(1)*, *O(n)* ou *O(log n)*) com *on average* ou *worst case*.
4. Termina com um *trade-off* claro e uma ação concreta (*I will add the note…* / *Could you review…?*).

---

## FASE 4 — Shadow CAT / Verificação Rápida [2 min]

1. **Vocabulário (L1):** O colega diz "On average, a key lookup in the hash map is O(1)." O que ele quer dizer?
   A) A consulta sempre leva um milissegundo.  B) Em média, a consulta por chave é de acesso direto.  C) O array foi ordenado.  D) O pior caso é O(1).
   **Key:** B

2. **Gramática (L1):** Qual frase está correta?
   A) "Binary search is more fast than a linear scan."  B) "Binary search is fast than a linear scan."  C) "Binary search is faster than a linear scan."  D) "Binary search is fastest than a linear scan."
   **Key:** C

3. **Leitura (L1):** Em "The scan is O(n), so the wait grows with the list", o que crescendo explica a espera?
   A) O tamanho da lista.  B) O número de chaves do mapa.  C) A memória livre.  D) O idioma do review.
   **Key:** A

---

**Listening input:** `rendered_tts_static` — o diálogo da FASE 1 é texto autoral, não um clipe renderizado.
**Pack ID:** `pack_les_a2_it_algorithms_basics_v1`

---

## Dados para o Learner Model (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_algorithms_basics",
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
      "grammar.algorithms_comparatives",
      "grammar.algos_terms_subject_agreement"
    ],
    "vocab": [
      "vocab.it_computer_terms",
      "vocab.algos_terms_label_scan"
    ],
    "reading": [
      "reading.algos_review_note_detail",
      "reading.algos_complexity_table_scan"
    ],
    "listening": [
      "listening.algos_review_context"
    ],
    "pronunciation": [
      "pronunciation.algos_bigo_word_stress"
    ],
    "speaking": [
      "speaking.algos_code_review_explanation"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a1_reading_skimming"
  ],
  "estimated_time_min": 15
}
```
