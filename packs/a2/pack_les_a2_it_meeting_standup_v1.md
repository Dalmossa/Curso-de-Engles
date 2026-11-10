# Practice Pack: Stand-ups & Technical Meetings
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_it_meeting_standup_v1`
**Lesson:** `les_a2_it_meeting_standup.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.meeting.standup_timebox`
**domain:** `vocab`
**level:** L1
**stem:** The **stand-up** timebox is:
| Slot | Value |
|------|-------|
| A | 30 minutes |
| B | **15 minutes** |
| C | 45 minutes |
| D | 1 hour |
**Key:** B
**br_pt_form:** "15 minutos"



### ITEM 2
**item_id:** `vocab.meeting.blocker`
**domain:** `vocab`
**level:** L1
**stem:** A **blocker** in stand-up is:
| Slot | Value |
|------|-------|
| A | A task you finished |
| B | **Something stopping your progress** |
| C | A meeting invite |
| D | A code review |
**Key:** B
**br_pt_form:** "bloqueio / impedimento"



### ITEM 3
**item_id:** `vocab.meeting.parking_lot`
**domain:** `vocab`
**level:** L1
**stem:** **Parking lot** means:
| Slot | Value |
|------|-------|
| A | Where you park your car |
| B | **Discuss later, not in stand-up** |
| C | The sprint backlog |
| D | The Definition of Done |
**Key:** B
**br_pt_form:** "estacionamento / discutir depois"



### ITEM 4
**item_id:** `vocab.meeting.carry_over`
**domain:** `vocab`
**level:** L1
**stem:** **Carry over** a ticket means:
| Slot | Value |
|------|-------|
| A | Delete it |
| B | **Move it to the next sprint** |
| C | Assign to someone else |
| D | Close as wontfix |
**Key:** B
**br_pt_form:** "levar para a próxima sprint"



### ITEM 5
**item_id:** `vocab.meeting.done`
**domain:** `vocab`
**level:** L1
**stem:** **Done** in Scrum means:
| Slot | Value |
|------|-------|
| A | Code compiles |
| B | **Meets Definition of Done (tested, reviewed, deployed)** |
| C | Pushed to git |
| D | Assigned to QA |
**Key:** B
**br_pt_form:** "pronto / conforme Definition of Done"



### ITEM 6
**item_id:** `grammar.present_perfect_completed`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present perfect** for completed work:
| Slot | Value |
|------|-------|
| A | I **have closed** the ticket. |
| B | I **closed** the ticket. |
| C | I **am closing** the ticket. |
| D | I **close** the ticket. |
**Key:** A
**br_pt_form:** "Eu fechei o ticket."



### ITEM 7
**item_id:** `vocab.meeting.prereq_ticket`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **ticket** (or issue) is:
| Slot | Value |
|------|-------|
| A | A meeting note |
| B | **A unit of work tracked in Jira/GitHub** |
| C | A pull request |
| D | A deployment log |
**Key:** B
**br_pt_form:** "ticket / issue"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_meeting_standup_v1
lesson_id: les_a2_it_meeting_standup_v1
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
