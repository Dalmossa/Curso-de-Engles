# Practice Pack: BDD Specifications — Given-When-Then, Acceptance Criteria, Scenario Writing
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_bdd_specs_v1`
**Lesson:** `les_b1_it_bdd_specs.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.bdd.given_when_then`
**domain:** `vocab`
**level:** L1
**stem:** **Given-When-Then** structures:
| Slot | Value |
|------|-------|
| A | Database queries |
| B | **A scenario: preconditions, action, outcome** |
| C | API documentation |
| D | Test data only |
**Key:** B
**br_pt_form:** "dado-quando-então / cenário com pré-condição, ação, resultado"



### ITEM 2
**item_id:** `vocab.bdd.scenario`
**domain:** `vocab`
**level:** L1
**stem:** A **scenario** in BDD is:
| Slot | Value |
|------|-------|
| A | A vague requirement |
| B | **A concrete example of behavior** |
| C | A test script |
| D | A user story |
**Key:** B
**br_pt_form:** "cenário / exemplo concreto de comportamento"



### ITEM 3
**item_id:** `vocab.bdd.acceptance_criteria`
**domain:** `vocab`
**level:** L1
**stem:** **Acceptance criteria** define:
| Slot | Value |
|------|-------|
| A | When the team goes home |
| B | **Conditions that must be met to consider a story done** |
| C | The sprint goal |
| D | The tech stack |
**Key:** B
**br_pt_form:** "critérios de aceitação"



### ITEM 4
**item_id:** `vocab.bdd.feature_file`
**domain:** `vocab`
**level:** L1
**stem:** A **feature file** (`.feature`) contains:
| Slot | Value |
|------|-------|
| A | Only code |
| B | **Scenarios written in Gherkin (Given/When/Then)** |
| C | Database migrations |
| D | Deployment configs |
**Key:** B
**br_pt_form:** "arquivo de feature / Gherkin"



### ITEM 5
**item_id:** `vocab.bdd.living_documentation`
**domain:** `vocab`
**level:** L1
**stem:** **Living documentation** means:
| Slot | Value |
|------|-------|
| A | Printed manual |
| B | **Executable specs that stay in sync with code** |
| C | Wiki pages |
| D | Meeting notes |
**Key:** B
**br_pt_form:** "documentação viva / specs executáveis"



### ITEM 6
**item_id:** `grammar.present_simple_scenario`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present simple** for a Then step:
| Slot | Value |
|------|-------|
| A | Then the system **return** the error. |
| B | Then the system **returns** the error. |
| C | Then the system **returning** the error. |
| D | Then the system **returned** the error. |
**Key:** B
**br_pt_form:** "Então o sistema retorna o erro."



### ITEM 7
**item_id:** `vocab.bdd.prereq_example_mapping`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Example mapping** is a workshop to:
| Slot | Value |
|------|-------|
| A | Write code |
| B | **Discover rules, examples, and questions** |
| C | Deploy to production |
| D | Estimate story points |
**Key:** B
**br_pt_form:** "mapeamento de exemplos / descobrir regras"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_bdd_specs_v1
lesson_id: les_b1_it_bdd_specs_v1
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
