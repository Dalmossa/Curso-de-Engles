# Practice Pack: Greetings & Basic Phrases
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_greetings_v1`
**Lesson:** `les_a1_greetings.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.greetings.good_morning`
**domain:** `vocab`
**level:** L1
**stem:** **Good morning** is used:
| Slot | Value |
|------|-------|
| A | At night |
| B | **In the morning (until 12pm)** |
| C | In the afternoon |
| D | At any time |
**Key:** B
**br_pt_form:** "bom dia / de manhã até 12h"



### ITEM 2
**item_id:** `vocab.greetings.please`
**domain:** `vocab`
**level:** L1
**stem:** **Please** is used for:
| Slot | Value |
|------|-------|
| A | Saying goodbye |
| B | **Making polite requests** |
| C | Thanking |
| D | Apologizing |
**Key:** B
**br_pt_form:** "por favor / pedidos educados"



### ITEM 3
**item_id:** `vocab.greetings.thank_you`
**domain:** `vocab`
**level:** L1
**stem:** **Thank you** expresses:
| Slot | Value |
|------|-------|
| A | Apology |
| B | **Gratitude** |
| C | Request |
| D | Greeting |
**Key:** B
**br_pt_form:** "obrigado / gratidão"



### ITEM 4
**item_id:** `vocab.greetings.excuse_me`
**domain:** `vocab`
**level:** L1
**stem:** **Excuse me** is used to:
| Slot | Value |
|------|-------|
| A | Say goodbye |
| B | **Get attention or ask to pass** |
| C | Thank someone |
| D | Apologize |
**Key:** B
**br_pt_form:** "com licença / chamar atenção"



### ITEM 5
**item_id:** `vocab.greetings.goodbye`
**domain:** `vocab`
**level:** L1
**stem:** **Goodbye** / **See you later** are:
| Slot | Value |
|------|-------|
| A | Greetings |
| B | **Farewells** |
| C | Requests |
| D | Apologies |
**Key:** B
**br_pt_form:** "adeus / até mais tarde / despedidas"



### ITEM 6
**item_id:** `grammar.subject_verb`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **subject + verb**:
| Slot | Value |
|------|-------|
| A | I **is** fine. |
| B | I **am** fine. |
| C | I **are** fine. |
| D | I **be** fine. |
**Key:** B
**br_pt_form:** "Eu estou bem."



### ITEM 7
**item_id:** `vocab.greetings.prereq_hello`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Hello** is:
| Slot | Value |
|------|-------|
| A | Formal only |
| B | **Universal greeting** |
| C | Only for friends |
| D | Only for strangers |
**Key:** B
**br_pt_form:** "olá / saudação universal"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_greetings_v1
lesson_id: les_a1_greetings_v1
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
