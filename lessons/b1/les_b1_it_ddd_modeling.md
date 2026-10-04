# Lesson: Domain-Driven Design — Aggregates, Entities, Value Objects, Repositories

**Lesson ID:** `les_b1_it_ddd_modeling`
**Module:** `mod_b1_it_technical`
**CEFR:** B1
**Reuse basis:** `cite_only`
**Source:** `docs/ddd-rapido.md` (`cite_only`)
**Estimated time:** 15 min

---

## FASE 1 — Input (i+1) [4 min]

### Vocabulário-chave (com gloss PT-BR)

| English | PT-BR | Contexto |
|---------|-------|----------|
| **domain-driven design (DDD)** | design orientado a domínio | *abordagem de modelagem centrada no domínio* |
| **aggregate** | agregado | *cluster de objetos tratados como unidade* |
| **entity** | entidade | *objeto com identidade única* |
| **value object** | objeto de valor | *objeto sem identidade, imutável* |
| **repository** | repositório | *abstração de persistência de agregados* |
| **factory** | fábrica | *cria agregados/entidades complexos* |
| **domain event** | evento de domínio | *algo que aconteceu no domínio* |
| **bounded context** | contexto delimitado | *limite onde um modelo se aplica* |
| **ubiquitous language** | linguagem ubíqua | *vocabulário compartilhado devs + domain experts* |
| **invariant** | invariante | *regra que sempre deve ser verdadeira* |
| **aggregate root** | raiz do agregado | *única entrada para o agregado* |
| **persistence ignorance** | ignorância de persistência | *domínio não sabe como é salvo* |

### Mini-texto (áudio: `deferred_render`)

> **Architect:** "Our **bounded context** is *Ordering*. **Ubiquitous language**: *Order*, *OrderLine*, *Customer*, *Product*."
>
> **Dev:** "**Aggregate**: `Order` (root) + `OrderLine`s. **Entity**: `Order` (has ID). **Value Object**: `Money`, `Address` (immutable, no ID). **Invariant**: `Order.total = sum(OrderLines)`."
>
> **Architect:** "**Repository**: `OrderRepository` saves/loads `Order` aggregate. **Factory**: creates `Order` with valid initial state. **Domain event**: `OrderPlaced` published after save."

---

## FASE 2 — Guided Practice [5 min]

### Item 1 — Vocabulary (MCQ)
An **entity** in DDD:
| Slot | Value |
|------|-------|
| A | Has no identity |
| B | **Has a unique identity that persists over time** |
| C | Is always immutable |
| D | Cannot contain other objects |
**Key:** B
**br_pt_form:** "tem identidade única que persiste"

### Item 2 — Vocabulary (Matching)
Match the DDD concept to its characteristic:
| Concept | Characteristic |
|---------|----------------|
| **Aggregate** | a. Cluster with root entity |
| **Value Object** | b. Immutable, no identity |
| **Repository** | c. Persistence abstraction |
| **Domain Event** | d. Something that happened |
**Key:** Aggregate→a, Value Object→b, Repository→c, Domain Event→d
**br_pt_form:** "agregado", "objeto de valor", "repositório", "evento de domínio"

### Item 3 — Grammar: Passive for definitions (fill-in-blank)
Complete with **passive voice**:
"An aggregate root ______ (use) to access the aggregate. Invariants ______ (enforce) by the root. Value objects ______ (create) by factories."
**Key:** is used / are enforced / are created
**br_pt_form:** "é usado", "são impostas", "são criados"

---

## FASE 3 — Output Task [4 min]

### Speaking: DDD Model Defense (pares)
**Student A (Architect):** Present a DDD model for *Shopping Cart*. Use: *aggregate, entity, value object, repository, factory, domain event, bounded context, ubiquitous language, invariant, aggregate root*.
**Student B (Reviewer):** Challenge: "Why is `Cart` an aggregate root?" "Why is `Money` a value object?"

**Model:**
- **Bounded context**: *Shopping*
- **Aggregate**: `Cart` (root) + `CartItem`s
- **Entity**: `Cart` (ID), `CartItem` (ID)
- **Value Object**: `Money`, `ProductId`, `Quantity`
- **Invariant**: `Cart.total = sum(CartItems)`
- **Repository**: `CartRepository`
- **Factory**: `CartFactory.create(customerId)`
- **Domain event**: `CartCreated`, `ItemAdded`

---

## FASE 4 — Shadow CAT [2 min]

### Item 1 — Vocabulary (L1, adaptive)
A **value object** is:
| Slot | Value |
|------|-------|
| A | Mutable, with identity |
| B | **Immutable, no identity, compared by value** |
| C | Always an entity |
| D | A database table |
**Key:** B
**br_pt_form:** "imutável, sem identidade, comparado por valor"

### Item 2 — Grammar (L1, adaptive)
Choose the correct **passive**:
| Slot | Value |
|------|-------|
| A | The invariant **enforces** the rule. |
| B | The invariant **is enforced** by the aggregate root. |
| C | The invariant **enforcing** the rule. |
| D | The invariant **enforced** the rule. |
**Key:** B
**br_pt_form:** "A invariante é imposta pela raiz do agregado."

---

**Listening input:** `deferred_render`
**Pack ID:** `pack_les_b1_it_ddd_modeling_v1`

---

## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

```json
{
  "lesson_id": "les_b1_it_ddd_modeling",
  "cefr_level": "B1",
  "provenance": {
    "reuse_basis": "cite_only",
    "adapted_sources": [],
    "authored_material": "all exercises, the mini-text (Architect/Dev dialogue), the correction table, the rubric, the 2 Shadow CAT items, the vocabulary table, the Output Task scenario",
    "bibliography_only": [
      "docs/ddd-rapido.md (InfoQ, CC-BY-NC-ND - quote only) - used for term selection only; all definitions authored"
    ],
    "listening_input": "deferred_render",
    "listening_input_status": "render_blocked - no audio rendered; the phase serves text and marks the item deferred_render",
    "verbatim_reproduction": "none - DDD terms are unprotectable domain concepts; definitions authored"
  },
  "skills_touched": ["grammar", "vocabulary", "listening", "pronunciation", "speaking"],
  "output_modalities": ["speaking"],
  "skill_items": {
    "grammar": [
      "grammar.passive_definitions"
    ],
    "vocabulary": [
      "vocab.ddd.domain_driven_design",
      "vocab.ddd.aggregate",
      "vocab.ddd.entity",
      "vocab.ddd.value_object",
      "vocab.ddd.repository",
      "vocab.ddd.factory",
      "vocab.ddd.domain_event",
      "vocab.ddd.bounded_context",
      "vocab.ddd.ubiquitous_language",
      "vocab.ddd.invariant",
      "vocab.ddd.aggregate_root"
    ],
    "listening": [
      "listening.ddd_context"
    ],
    "pronunciation": [
      "pronunciation.technical_terms"
    ]
  },
  "prereq_lessons": [
    "les_a2_it_terms_basics",
    "les_a2_it_communication"
  ],
  "estimated_time_min": 15
}
```