# Lesson: TypeScript Basics — Types, Interfaces, Generics, Async

**Lesson ID:** `les_a2_it_typescript_basics`
**Module:** `mod_a2_it_fundamentals`
**CEFR:** A2
**Reuse basis:** `cite_only`
**Source:** `docs/typescript-guia-pratico.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **type** | tipo | *anotação de tipo estático* |
| **interface** | interface | *contrato de forma de objeto* |
| **generic** | genérico | *tipo parametrizado* |
| **type inference** | inferência de tipo | *TypeScript deduz o tipo* |
| **union type** | tipo união | *`string \| number`* |
| **async / await** | assíncrono / esperar | *promises sintaxe limpa* |
| **Promise** | promessa | *valor futuro* |
| **type guard** | guarda de tipo | *estreita o tipo em runtime* |

### Mini-texto (áudio: `deferred_render`)

> **Dev:** "In TypeScript, we add **types**. This function takes a **string** and returns a **number**."
>
> **Reviewer:** "What if the input is `null`?"
>
> **Dev:** "We use a **union type**: `string \| null`. And a **type guard** checks it: `if (typeof x === 'string')`. For async, we use **async / await** with **Promise**."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
What does **interface** define in TypeScript?
| Slot | Value |
|------|-------|
| A | A class implementation |
| B | **The shape of an object (contract)** |
| C | A database schema |
| D | A CSS style |
**Key:** B
**br_pt_form:** "interface"

### Item 2 — Vocabulary (Matching)
Match the term to its example:
| Term | Example |
|------|---------|
| **generic** | a. `Array<string>` |
| **union type** | b. `string \| number` |
| **type guard** | c. `typeof x === "string"` |
| **async** | d. `async function fetch()` |
**Key:** generic→a, union type→b, type guard→c, async→d
**br_pt_form:** "genérico", "tipo união", "guarda de tipo", "assíncrono"

### Item 3 — Grammar: Modal verbs for possibility (fill-in-blank)
Complete with **can / cannot / must**:
"A variable of type `string \| null` ______ be null. You ______ check it before use. It ______ be a string."
**Key:** can / must / can
**br_pt_form:** "pode", "deve", "pode"

---

## FASE 3 — Output Task [4 min]

### Speaking: Code Review Roleplay (pares)
**Student A (Author):** Explain this function signature. Use: *type, interface, generic, union, async, await, Promise, type guard*.
**Student B (Reviewer):** Ask: "What happens if `id` is null?" and "Is this async?"

```typescript
interface User { id: string | null; name: string; }

async function fetchUser<T>(id: T): Promise<User | null> {
  if (typeof id === "string") {
    return await api.get<User>(`/users/${id}`);
  }
  return null;
}
```

**Expected output (Author):** "This function is **async**, returns a **Promise** of **User** or **null**. The **interface** defines **User** with a **union type** `string \| null`. The **generic** `<T>` lets us pass different ID types. The **type guard** `typeof id === 'string'` narrows the type."

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
`Array<string>` is an example of a:
| Slot | Value |
|------|-------|
| A | Union type |
| B | **Generic** |
| C | Type guard |
| D | Interface |
**Key:** B
**br_pt_form:** "genérico"

### Item 2 — Grammar (L1, adaptive)
Choose the correct modal for obligation:
| Slot | Value |
|------|-------|
| A | You **can** handle the null case. |
| B | You **must** handle the null case. |
| C | You **should not** handle the null case. |
| D | You **might** handle the null case. |
**Key:** B
**br_pt_form:** "Você deve tratar o caso nulo."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_a2_it_typescript_basics_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_a2_it_typescript_basics",
  "cefr_level": "A2",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text, the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table",
    "bibliography_only": [
      "docs/typescript-guia-pratico.md (Casa do Código/Alura, all rights reserved) - scoping of TypeScript vocabulary: types, interfaces, generics, async/await"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - all content authored; vocabulary terms are unprotectable facts about the language"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.modals_obligation"
    ],
    "vocabulary": [
      "vocab.typescript.type",
      "vocab.typescript.interface",
      "vocab.typescript.generic",
      "vocab.typescript.union_type",
      "vocab.typescript.async_await",
      "vocab.typescript.promise",
      "vocab.typescript.type_guard"
    ],
    "listening": [
      "listening.typescript_context"
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