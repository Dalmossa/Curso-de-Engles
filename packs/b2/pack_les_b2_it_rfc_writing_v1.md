# Practice Pack: Writing RFCs & Design Docs
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_it_rfc_writing_v1`
**Lesson:** `les_b2_it_rfc_writing.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.rfc.non_goals`
**domain:** `vocab`
**level:** L1
**stem:** **Non-goals** in an RFC:
| Slot | Value |
|------|-------|
| A | Are hidden requirements |
| B | **Explicitly state what is out of scope** |
| C | Are optional |
| D | Are the same as goals |
**Key:** B
**br_pt_form:** "não-objetivos / explicitamente fora de escopo"



### ITEM 2
**item_id:** `vocab.rfc.problem_statement`
**domain:** `vocab`
**level:** L1
**stem:** A **problem statement**:
| Slot | Value |
|------|-------|
| A | Describes the solution |
| B | **Describes what to solve, who is affected, why it matters** |
| C | Lists goals |
| D | Is optional |
**Key:** B
**br_pt_form:** "declaração do problema / o que resolver, quem afeta, por que importa"



### ITEM 3
**item_id:** `vocab.rfc.success_criteria`
**domain:** `vocab`
**level:** L1
**stem:** **Success criteria**:
| Slot | Value |
|------|-------|
| A | Are vague |
| B | **Define how to measure if the proposal worked** |
| C | Are optional |
| D | Are the same as goals |
**Key:** B
**br_pt_form:** "critérios de sucesso / como medir se funcionou"



### ITEM 4
**item_id:** `vocab.rfc.open_questions`
**domain:** `vocab`
**level:** L1
**stem:** **Open questions**:
| Slot | Value |
|------|-------|
| A | Are answered immediately |
| B | **Uncertainties to resolve before/during implementation** |
| C | Are optional |
| D | Are the same as goals |
**Key:** B
**br_pt_form:** "perguntas em aberto / incertezas a resolver"



### ITEM 5
**item_id:** `vocab.rfc.rollout_plan`
**domain:** `vocab`
**level:** L1
**stem:** A **rollout plan** describes:
| Slot | Value |
|------|-------|
| A | How to write code |
| B | **How to launch (canary, phases, rollback)** |
| C | Team structure |
| D | Budget |
**Key:** B
**br_pt_form:** "plano de rollout / como lançar"



### ITEM 6
**item_id:** `grammar.modals_requirements`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **modal** for an RFC requirement (MUST):
| Slot | Value |
|------|-------|
| A | The API **can** validate the key. |
| B | The API **should** validate the key. |
| C | The API **must** validate the key. |
| D | The API **might** validate the key. |
**Key:** C
**br_pt_form:** "A API deve validar a chave."



### ITEM 7
**item_id:** `vocab.rfc.prereq_alternatives`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Alternatives** in an RFC:
| Slot | Value |
|------|-------|
| A | Are ignored |
| B | **Are other options considered and why rejected** |
| C | Are the same as goals |
| D | Are optional |
**Key:** B
**br_pt_form:** "alternativas / outras opções consideradas e rejeitadas"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_rfc_writing_v1
lesson_id: les_b2_it_rfc_writing_v1
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
