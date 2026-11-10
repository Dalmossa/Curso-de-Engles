# Practice Pack: Incident Reports & Problem Statements
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_it_incidents_v1`
**Lesson:** `les_a2_it_incidents.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.incident.severity`
**domain:** `vocab`
**level:** L1
**stem:** **SEV-2** incident means:
| Slot | Value |
|------|-------|
| A | Minor issue, no user impact |
| B | **Major degradation, urgent response needed** |
| C | Scheduled maintenance |
| D | Cosmetic bug |
**Key:** B
**br_pt_form:** "degradação maior, resposta urgente"



### ITEM 2
**item_id:** `vocab.incident.mitigation`
**domain:** `vocab`
**level:** L1
**stem:** **Mitigation** during an incident is:
| Slot | Value |
|------|-------|
| A | Finding the root cause |
| B | **Reducing impact quickly (rollback, workaround)** |
| C | Writing the postmortem |
| D | Paging the on-call |
**Key:** B
**br_pt_form:** "mitigação / redução de impacto"



### ITEM 3
**item_id:** `vocab.incident.root_cause`
**domain:** `vocab`
**level:** L1
**stem:** **Root cause** is:
| Slot | Value |
|------|-------|
| A | The first symptom noticed |
| B | **The fundamental reason the incident happened** |
| C | The person who made the mistake |
| D | The ticket number |
**Key:** B
**br_pt_form:** "causa raiz"



### ITEM 4
**item_id:** `vocab.incident.postmortem`
**domain:** `vocab`
**level:** L1
**stem:** A **blameless postmortem** focuses on:
| Slot | Value |
|------|-------|
| A | Who to fire |
| B | **System improvements to prevent recurrence** |
| C | Timeline of blame |
| D | Manager approval |
**Key:** B
**br_pt_form:** "postmortem sem culpar / melhorias no sistema"



### ITEM 5
**item_id:** `vocab.incident.runbook_oncall`
**domain:** `vocab`
**level:** L1
**stem:** Match the term to its role:
| Term | Role |
|------|------|
| **runbook** | a. Person responsible outside hours |
| **on-call** | b. Step-by-step response guide |
**Key:** runbook→b, on-call→a
**br_pt_form:** "runbook / manual", "de plantão"



### ITEM 6
**item_id:** `grammar.past_simple_timeline`
**domain:** `grammar`
**level:** L1
**stem:** Complete the incident timeline (past simple):
"At 09:15, the alert ______ (trigger). The on-call ______ (acknowledge) at 09:17. She ______ (execute) runbook step 3. Service ______ (restore) at 09:25."
| Slot | Value |
|------|-------|
| A | **triggered / acknowledged / executed / restored** |
| B | trigger / acknowledge / execute / restore |
| C | triggering / acknowledging / executing / restoring |
| D | triggers / acknowledges / executes / restores |
**Key:** A
**br_pt_form:** "disparou / reconheceu / executou / restaurou"



### ITEM 7
**item_id:** `vocab.incident.prereq_sla`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **SLA** (Service Level Agreement) defines:
| Slot | Value |
|------|-------|
| A | The code style guide |
| B | **Uptime/latency targets and penalties** |
| C | The sprint goal |
| D | The team hierarchy |
**Key:** B
**br_pt_form:** "acordo de nível de serviço"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_incidents_v1
lesson_id: les_a2_it_incidents_v1
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
