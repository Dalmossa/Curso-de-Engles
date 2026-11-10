# Practice Pack: Domain-Driven Design — Aggregates, Entities, Value Objects, Repositories
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_ddd_modeling_v1`
**Lesson:** `les_b1_it_ddd_modeling.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.ddd.entity`
**domain:** `vocab`
**level:** L1
**stem:** An **entity** in DDD:
| Slot | Value |
|------|-------|
| A | Has no identity |
| B | **Has a unique identity that persists over time** |
| C | Is always immutable |
| D | Cannot contain other objects |
**Key:** B
**br_pt_form:** "entidade / tem identidade única"



### ITEM 2
**item_id:** `vocab.ddd.value_object`
**domain:** `vocab`
**level:** L1
**stem:** A **value object** is:
| Slot | Value |
|------|-------|
| A | Mutable, with identity |
| B | **Immutable, no identity, compared by value** |
| C | Always an entity |
| D | A database table |
**Key:** B
**br_pt_form:** "objeto de valor / imutável, sem identidade"



### ITEM 3
**item_id:** `vocab.ddd.aggregate`
**domain:** `vocab`
**level:** L1
**stem:** An **aggregate** is:
| Slot | Value |
|------|-------|
| A | A single entity |
| B | **A cluster of entities/value objects with a root** |
| C | A database transaction |
| D | A repository method |
**Key:** B
**br_pt_form:** "agregado / cluster com raiz"



### ITEM 4
**item_id:** `vocab.ddd.repository`
**domain:** `vocab`
**level:** L1
**stem:** A **repository** in DDD:
| Slot | Value |
|------|-------|
| A | Executes SQL directly |
| B | **Abstracts persistence of aggregates** |
| C | Is the same as a DAO |
| D | Creates value objects |
**Key:** B
**br_pt_form:** "repositório / abstração de persistência"



### ITEM 5
**item_id:** `vocab.ddd.bounded_context`
**domain:** `vocab`
**level:** L1
**stem:** A **bounded context** defines:
| Slot | Value |
|------|-------|
| A | A database schema |
| B | **A boundary where a model applies** |
| C | A deployment unit |
| D | A team structure |
**Key:** B
**br_pt_form:** "contexto delimitado / limite do modelo"



### ITEM 6
**item_id:** `grammar.passive_ddd`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **passive** for a DDD definition:
| Slot | Value |
|------|-------|
| A | The aggregate root **accesses** the aggregate. |
| B | The aggregate **is accessed** through its root. |
| C | The aggregate **accessing** the root. |
| D | The aggregate **accessed** the root. |
**Key:** B
**br_pt_form:** "O agregado é acessado através de sua raiz."



### ITEM 7
**item_id:** `vocab.ddd.prereq_invariant`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] An **invariant** in DDD is:
| Slot | Value |
|------|-------|
| A | A database constraint |
| B | **A business rule that must always be true** |
| C | A test case |
| D | A domain event |
**Key:** B
**br_pt_form:** "invariante / regra que sempre deve ser verdadeira"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_ddd_modeling_v1
lesson_id: les_b1_it_ddd_modeling_v1
learner_profile: default
estimated_minutes: 4 min
spec_conformance:
  item_count: 7                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (assumed)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 7/7 scored items
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```
