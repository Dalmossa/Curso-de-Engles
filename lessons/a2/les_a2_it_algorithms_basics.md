# Lesson: Algorithms & Data Structures Basics — Big O, Arrays, Hash Maps

**Lesson ID:** `les_a2_it_algorithms_basics`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/algoritmos.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **algorithm** | algoritmo | *sequência de passos para resolver um problema* |
| **data structure** | estrutura de dados | *organização de dados na memória* |
| **array** | array / vetor | *lista indexada, acesso O(1)* |
| **hash map** | mapa de hash / dicionário | *chave → valor, busca O(1) média* |
| **linked list** | lista encadeada | *nós com ponteiros, inserção O(1)* |
| **tree** | árvore | *hierarquia, busca O(log n) se balanceada* |
| **Big O** | Big O / notação assintótica | *complexidade no pior caso* |
| **time complexity** | complexidade de tempo | *como o tempo cresce com a entrada* |
| **space complexity** | complexidade de espaço | *memória extra usada* |

### Mini-texto (áudio: `deferred_render`)

> **Interviewer:** "How do you find an item in an **array**?"
>
> **Candidate:** "Linear search — **O(n)**. But if it's sorted, **binary search** — **O(log n)**."
>
> **Interviewer:** "And in a **hash map**?"
>
> **Candidate:** "Average **O(1)** — direct key access. **Space complexity** is **O(n)**."
>
> **Interviewer:** "What about a **linked list** vs **array** for insertion at the beginning?"
>
> **Candidate:** "**Linked list** — **O(1)**. **Array** — **O(n)** because of shifting."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
What does **Big O** notation describe?
| Slot | Value |
|------|-------|
| A | Exact runtime in milliseconds |
| B | **Upper bound on growth rate** |
| C | Memory usage in bytes |
| D | Code readability score |
**Key:** B
**br_pt_form:** "Big O / notação assintótica"

### Item 2 — Vocabulary (Matching)
Match the data structure to its average **search** complexity:
| Structure | Search |
|-----------|--------|
| **Array (unsorted)** | a. O(1) |
| **Hash map** | b. O(n) |
| **Binary search tree** | c. O(log n) |
| **Linked list** | d. O(n) |
**Key:** Array→b, Hash map→a, BST→c, Linked list→d
**br_pt_form:** "array", "mapa de hash", "árvore binária", "lista encadeada"

### Item 3 — Grammar: Comparatives (fill-in-blank)
Complete with the **comparative**:
"A **hash map** is ______ (fast) than an **array** for lookup. A **linked list** uses ______ (little) memory per element than an **array** overhead."
**Key:** faster / less
**br_pt_form:** "mais rápido", "menos"

---

## FASE 3 — Output Task [4 min]

### Speaking: Interview Roleplay (pares)
**Student A (Interviewer):** Ask about time complexity of operations. Use: *algorithm, data structure, array, hash map, linked list, tree, Big O, time complexity, space complexity*.
**Student B (Candidate):** Answer with correct Big O. Explain trade-offs.

**Questions:**
1. "Search in unsorted array?"
2. "Insert at head of linked list?"
3. "Lookup in hash map?"
4. "Space of a tree with n nodes?"

**Expected output (Candidate):**
1. "O(n) — linear search."
2. "O(1) — just change head pointer."
3. "O(1) average — direct key hash."
4. "O(n) — each node stores value + pointers."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
Average time to **lookup** a key in a **hash map**:
| Slot | Value |
|------|-------|
| A | O(n) |
| B | **O(1)** |
| C | O(log n) |
| D | O(n²) |
**Key:** B
**br_pt_form:** "O(1)"

### Item 2 — Grammar (L1, adaptive)
Choose the correct comparative:
| Slot | Value |
|------|-------|
| A | Binary search is **faster than** linear search. |
| B | Binary search is **more fast than** linear search. |
| C | Binary search is **fast than** linear search. |
| D | Binary search is **fastest** linear search. |
**Key:** A
**br_pt_form:** "mais rápido que"

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_algorithms_basics_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_algorithms_basics",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text, the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table",
    "bibliography_only": [
      "docs/algoritmos.md (Elsevier, all rights reserved) - scoping of algorithm vocabulary: Big O, arrays, hash maps, trees, linked lists, complexity"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; vocabulary terms are unprotectable facts about computer science"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.comparatives"
    ],
    "vocabulary": [
      "vocab.algorithms.algorithm",
      "vocab.algorithms.data_structure",
      "vocab.algorithms.array",
      "vocab.algorithms.hash_map",
      "vocab.algorithms.linked_list",
      "vocab.algorithms.tree",
      "vocab.algorithms.big_o",
      "vocab.algorithms.time_complexity",
      "vocab.algorithms.space_complexity"
    ],
    "listening": [
      "listening.algorithms_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics"
  ],
  "estimated_time_min": 15
}
```