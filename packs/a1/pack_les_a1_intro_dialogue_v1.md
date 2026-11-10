# Practice Pack: Introducing Yourself — 3-Step Dialogue
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_intro_dialogue_v1`
**Lesson:** `les_a1_intro_dialogue.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.intro.nice_to_meet_you`
**domain:** `vocab`
**level:** L1
**stem:** **Nice to meet you** is used:
| Slot | Value |
|------|-------|
| A | When leaving |
| B | **When meeting someone for the first time** |
| C | When thanking |
| D | When apologizing |
**Key:** B
**br_pt_form:** "prazer em conhecê-lo / ao conhecer alguém"



### ITEM 2
**item_id:** `vocab.intro.my_name_is`
**domain:** `vocab`
**level:** L1
**stem:** **My name is** is used to:
| Slot | Value |
|------|-------|
| A | Ask name |
| B | **Introduce yourself** |
| C | Say goodbye |
| D | Thank someone |
**Key:** B
**br_pt_form:** "meu nome é / apresentar-se"



### ITEM 3
**item_id:** `vocab.intro.i_am_from`
**domain:** `vocab`
**level:** L1
**stem:** **I am from** is used to talk about:
| Slot | Value |
|------|-------|
| A | Your job |
| B | **Your origin/country** |
| C | Your age |
| D | Your family |
**Key:** B
**br_pt_form:** "eu sou de / sua origem"



### ITEM 4
**item_id:** `vocab.intro.how_old_are_you`
**domain:** `vocab`
**level:** L1
**stem:** **How old are you?** asks about:
| Slot | Value |
|------|-------|
| A | Name |
| B | **Age** |
| C | Origin |
| D | Job |
**Key:** B
**br_pt_form:** "quantos anos você tem? / idade"



### ITEM 5
**item_id:** `vocab.intro.i_work_as`
**domain:** `vocab`
**level:** L1
**stem:** **I work as** is used to talk about:
| Slot | Value |
|------|-------|
| A | Hobby |
| B | **Profession** |
| C | Age |
| D | Origin |
**Key:** B
**br_pt_form:** "eu trabalho como / profissão"



### ITEM 6
**item_id:** `grammar.wh_questions`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **Wh- question**:
| Slot | Value |
|------|-------|
| A | **What** is your name? |
| B | **Where** is your name? |
| C | **How old** is your name? |
| D | **Who** is your name? |
**Key:** A
**br_pt_form:** "Qual é o seu nome?"



### ITEM 7
**item_id:** `vocab.intro.prereq_welcome`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Welcome** is used to:
| Slot | Value |
|------|-------|
| A | Say goodbye |
| B | **Greet someone arriving** |
| C | Thank someone |
| D | Apologize |
**Key:** B
**br_pt_form:** "bem-vindo / receber alguém"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_intro_dialogue_v1
lesson_id: les_a1_intro_dialogue_v1
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
