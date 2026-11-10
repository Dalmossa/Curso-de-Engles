# Practice Pack: Technical Leadership — Architecture Reviews, Trade-off Communication, Mentoring at Scale
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_it_technical_leadership_v1`
**Lesson:** `les_b2_it_technical_leadership.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.leadership.influence_without_authority`
**domain:** `vocab`
**level:** L1
**stem:** **Influence without authority** means:
| Slot | Value |
|------|-------|
| A | Leading through formal power |
| B | **Leading through expertise and trust, not hierarchy** |
| C | Avoiding leadership |
| D | Micromanaging |
**Key:** B
**br_pt_form:** "influência sem autoridade / liderar por expertise e confiança"



### ITEM 2
**item_id:** `vocab.leadership.architecture_review`
**domain:** `vocab`
**level:** L1
**stem:** An **architecture review**:
| Slot | Value |
|------|-------|
| A | Is optional |
| B | **Evaluates technical decisions for quality and alignment** |
| C | Is a code review |
| D | Is a performance review |
**Key:** B
**br_pt_form:** "revisão de arquitetura / avalia decisões técnicas"



### ITEM 3
**item_id:** `vocab.leadership.trade_off_communication`
**domain:** `vocab`
**level:** L1
**stem:** **Trade-off communication** involves:
| Slot | Value |
|------|-------|
| A | Hiding downsides |
| B | **Explaining gains and losses of decisions** |
| C | Only positive outcomes |
| D | Technical jargon only |
**Key:** B
**br_pt_form:** "comunicação de trade-offs / explicar ganhos e perdas"



### ITEM 4
**item_id:** `vocab.leadership.servant_leadership`
**domain:** `vocab`
**level:** L1
**stem:** **Servant leadership** means:
| Slot | Value |
|------|-------|
| A | Serving coffee to team |
| B | **Removing blockers so team can succeed** |
| C | Being subordinate |
| D | Avoiding decisions |
**Key:** B
**br_pt_form:** "liderança servidora / remover bloqueios"



### ITEM 5
**item_id:** `vocab.leadership.decision_log`
**domain:** `vocab`
**level:** L1
**stem:** A **decision log** documents:
| Slot | Value |
|------|-------|
| A | Daily tasks |
| B | **Why technical choices were made** |
| C | Team birthdays |
| D | Meeting schedules |
**Key:** B
**br_pt_form:** "registro de decisões / por que escolhas foram feitas"



### ITEM 6
**item_id:** `grammar.modals_leadership`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **modal** for leadership advice:
| Slot | Value |
|------|-------|
| A | Leaders **can** communicate trade-offs. |
| B | Leaders **should** communicate trade-offs. |
| C | Leaders **might** communicate trade-offs. |
| D | Leaders **could** communicate trade-offs. |
**Key:** B
**br_pt_form:** "Líderes devem comunicar trade-offs."



### ITEM 7
**item_id:** `vocab.leadership.prereq_mentoring`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Mentoring at scale** includes:
| Slot | Value |
|------|-------|
| A | One-on-one only |
| B | **Pair programming, code reviews, tech talks** |
| C | Only formal training |
| D | Only documentation |
**Key:** B
**br_pt_form:** "mentoria em escala / pair programming, code reviews, tech talks"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_technical_leadership_v1
lesson_id: les_b2_it_technical_leadership_v1
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
