# Practice Pack: Architecture Decision Records
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_it_architecture_decisions_v1`
**Lesson:** `les_b2_it_architecture_decisions.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.adr.adr`
**domain:** `vocab`
**level:** L1
**stem:** An **ADR** (Architecture Decision Record) is:
| Slot | Value |
|------|-------|
| A | A code review comment |
| B | **A lightweight document capturing a decision and its context** |
| C | A project plan |
| D | A bug report |
**Key:** B
**br_pt_form:** "ADR / documento leve com decisão e contexto"



### ITEM 2
**item_id:** `vocab.adr.context`
**domain:** `vocab`
**level:** L1
**stem:** The **Context** section of an ADR describes:
| Slot | Value |
|------|-------|
| A | The decision made |
| B | **The situation motivating the decision** |
| C | The consequences |
| D | The alternatives |
**Key:** B
**br_pt_form:** "contexto / situação que motivou a decisão"



### ITEM 3
**item_id:** `vocab.adr.consequences`
**domain:** `vocab`
**level:** L1
**stem:** **Consequences** in an ADR:
| Slot | Value |
|------|-------|
| A | Are optional |
| B | **Document positive and negative impacts** |
| C | List alternatives |
| D | Describe context |
**Key:** B
**br_pt_form:** "consequências / impactos positivos e negativos"



### ITEM 4
**item_id:** `vocab.adr.status`
**domain:** `vocab`
**level:** L1
**stem:** **Status** lifecycle of an ADR:
| Slot | Value |
|------|-------|
| A | Draft → Final |
| B | **Proposed → Accepted → Deprecated/Superseded** |
| C | Open → Closed |
| D | New → Old |
**Key:** B
**br_pt_form:** "proposto → aceito → depreciado/substituído"



### ITEM 5
**item_id:** `vocab.adr.immutability`
**domain:** `vocab`
**level:** L1
**stem:** **Immutable** ADRs means:
| Slot | Value |
|------|-------|
| A | Cannot be read |
| B | **Cannot be edited; superseded by new ADR** |
| C | Cannot be deleted |
| D | Cannot be shared |
**Key:** B
**br_pt_form:** "imutável / não editável, substituído por novo ADR"



### ITEM 6
**item_id:** `grammar.passive_adr`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **passive** for ADR writing:
| Slot | Value |
|------|-------|
| A | The team **selected** PostgreSQL. |
| B | PostgreSQL **was selected** by the team. |
| C | PostgreSQL **is selecting** by the team. |
| D | PostgreSQL **selected** by the team. |
**Key:** B
**br_pt_form:** "PostgreSQL foi selecionado pela equipe."



### ITEM 7
**item_id:** `vocab.adr.prereq_tradeoff`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Trade-off** analysis in ADRs:
| Slot | Value |
|------|-------|
| A | Lists only benefits |
| B | **Documents gains and losses of each option** |
| C | Is optional |
| D | Only covers costs |
**Key:** B
**br_pt_form:** "trade-off / ganhos e perdas de cada opção"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_architecture_decisions_v1
lesson_id: les_b2_it_architecture_decisions_v1
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
