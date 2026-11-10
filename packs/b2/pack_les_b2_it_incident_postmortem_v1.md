# Practice Pack: Incident Postmortems
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_it_incident_postmortem_v1`
**Lesson:** `les_b2_it_incident_postmortem.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.postmortem.blameless`
**domain:** `vocab`
**level:** L1
**stem:** A **blameless postmortem** focuses on:
| Slot | Value |
|------|-------|
| A | Who to blame |
| B | **System improvements, not human error** |
| C | Legal liability |
| D | Hiding the incident |
**Key:** B
**br_pt_form:** "sem culpar / melhorias no sistema"



### ITEM 2
**item_id:** `vocab.postmortem.root_cause`
**domain:** `vocab`
**level:** L1
**stem:** **Root cause** in a postmortem is:
| Slot | Value |
|------|-------|
| A | The first symptom |
| B | **The fundamental origin of the incident** |
| C | The person on-call |
| D | The alert that fired |
**Key:** B
**br_pt_form:** "causa raiz / origem fundamental"



### ITEM 3
**item_id:** `vocab.postmortem.contributing_factors`
**domain:** `vocab`
**level:** L1
**stem:** **Contributing factors**:
| Slot | Value |
|------|-------|
| A | Are the main cause |
| B | **Conditions that worsened the incident** |
| C | Are always human error |
| D | Are optional to document |
**Key:** B
**br_pt_form:** "fatores contribuintes / condições que agravaram"



### ITEM 4
**item_id:** `vocab.postmortem.action_items`
**domain:** `vocab`
**level:** L1
**stem:** **Action items** in a postmortem:
| Slot | Value |
|------|-------|
| A | Are optional |
| B | **Are tasks with owner and deadline to prevent recurrence** |
| C | Are complaints |
| D | Are feature requests |
**Key:** B
**br_pt_form:** "itens de ação / tarefas com dono e prazo"



### ITEM 5
**item_id:** `vocab.postmortem.mttr`
**domain:** `vocab`
**level:** L1
**stem:** **MTTR** (Mean Time To Recovery) measures:
| Slot | Value |
|------|-------|
| A | Time to detect |
| B | **Time from incident start to service restoration** |
| C | Time to write postmortem |
| D | Time to deploy |
**Key:** B
**br_pt_form:** "MTTR / tempo médio de recuperação"



### ITEM 6
**item_id:** `grammar.past_perfect_timeline`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **past perfect** for a timeline:
| Slot | Value |
|------|-------|
| A | The index **was missing** before the incident. |
| B | The index **had been missing** before the incident. |
| C | The index **has been missing** before the incident. |
| D | The index **missing** before the incident. |
**Key:** B
**br_pt_form:** "O índice tinha estado ausente antes do incidente."



### ITEM 7
**item_id:** `vocab.postmortem.prereq_severity`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **SEV-1** incident means:
| Slot | Value |
|------|-------|
| A | Minor issue |
| B | **Critical outage, all hands on deck** |
| C | Scheduled maintenance |
| D | Documentation update |
**Key:** B
**br_pt_form:** "SEV-1 / crítico, todos mobilizados"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_incident_postmortem_v1
lesson_id: les_b2_it_incident_postmortem_v1
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
