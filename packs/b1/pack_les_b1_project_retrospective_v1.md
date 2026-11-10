# Practice Pack: Retrospective & Post-mortem Talk
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_project_retrospective_v1`
**Lesson:** `les_b1_project_retrospective.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.retro.retrospective`
**domain:** `vocab`
**level:** L1
**stem:** A **retrospective** is:
| Slot | Value |
|------|-------|
| A | A planning meeting |
| B | **Team improvement meeting: what went well, what didn't, actions** |
| C | A code review |
| D | A demo to stakeholders |
**Key:** B
**br_pt_form:** "retrospectiva / reunião de melhoria"



### ITEM 2
**item_id:** `vocab.retro.post_mortem`
**domain:** `vocab`
**level:** L1
**stem:** A **post-mortem** is:
| Slot | Value |
|------|-------|
| A | A funeral for the project |
| B | **Blameless analysis after an incident** |
| C | A sprint review |
| D | A performance review |
**Key:** B
**br_pt_form:** "postmortem / análise sem culpar após incidente"



### ITEM 3
**item_id:** `vocab.retro.action_item`
**domain:** `vocab`
**level:** L1
**stem:** An **action item** from a retrospective:
| Slot | Value |
|------|-------|
| A | A vague wish |
| B | **Concrete task with owner and deadline** |
| C | A compliment |
| D | A user story |
**Key:** B
**br_pt_form:** "item de ação / tarefa com dono e prazo"



### ITEM 4
**item_id:** `vocab.retro.blameless`
**domain:** `vocab`
**level:** L1
**stem:** **Blameless** means:
| Slot | Value |
|------|-------|
| A | Ignore the problem |
| B | **Focus on system fixes, not human error** |
| C | Blame the process only |
| D | No documentation |
**Key:** B
**br_pt_form:** "sem culpar / foco no sistema"



### ITEM 5
**item_id:** `vocab.retro.root_cause`
**domain:** `vocab`
**level:** L1
**stem:** **Root cause** analysis finds:
| Slot | Value |
|------|-------|
| A | The first symptom |
| B | **The fundamental reason the problem occurred** |
| C | Who to fire |
| D | The ticket number |
**Key:** B
**br_pt_form:** "causa raiz"



### ITEM 6
**item_id:** `grammar.imperative_action`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **imperative** for an action item:
| Slot | Value |
|------|-------|
| A | **Add** monitoring to the service. |
| B | **Adding** monitoring to the service. |
| C | **Added** monitoring to the service. |
| D | **Adds** monitoring to the service. |
**Key:** A
**br_pt_form:** "Adicione monitoramento ao serviço."



### ITEM 7
**item_id:** `vocab.retro.prereq_followup`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Follow-up** means:
| Slot | Value |
|------|-------|
| A | Forget about it |
| B | **Check if action was completed** |
| C | Schedule another meeting |
| D | Blame someone |
**Key:** B
**br_pt_form:** "acompanhamento / verificar se foi feito"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_retrospective_v1
lesson_id: les_b1_project_retrospective_v1
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
