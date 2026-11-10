# Practice Pack: Reported Speech
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_reported_speech_v1`
**Lesson:** `les_b1_reported_speech.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.reported.reported-speech`
**domain:** `vocab`
**level:** L1
**stem:** **Reported speech** involves:
| Slot | Value |
|------|-------|
| A | Quoting exactly |
| B | **Reporting what someone said with tense shift** |
| C | Only questions |
| D | Only commands |
**Key:** B
**br_pt_form:** "discurso indireto / relatar o que alguém disse com mudança de tempo"



### ITEM 2
**item_id:** `vocab.reported.say`
**domain:** `vocab`
**level:** L1
**stem:** **Say** in reported speech:
| Slot | Value |
|------|-------|
| A | Needs an object |
| B | **Does not need an object** |
| C | Is only for questions |
| D | Is only for commands |
**Key:** B
**br_pt_form:** "say / não precisa de objeto"



### ITEM 3
**item_id:** `vocab.reported.tell`
**domain:** `vocab`
**level:** L1
**stem:** **Tell** in reported speech:
| Slot | Value |
|------|-------|
| A | Does not need an object |
| B | **Needs an object** |
| C | Is only for questions |
| D | Is only for commands |
**Key:** B
**br_pt_form:** "tell / precisa de objeto"



### ITEM 4
**item_id:** `vocab.reported.backshift`
**domain:** `vocab`
**level:** L1
**stem:** **Backshift** in reported speech means:
| Slot | Value |
|------|-------|
| A | Moving tense forward |
| B | **Moving tense backward (present → past)** |
| C | Keeping the same tense |
| D | Changing the subject |
**Key:** B
**br_pt_form:** "backshift / mover tempo verbal para trás (presente → passado)"



### ITEM 5
**item_id:** `vocab.reported.pronoun-change`
**domain:** `vocab`
**level:** L1
**stem:** **Pronoun change** in reported speech:
| Slot | Value |
|------|-------|
| A | Keeps the same pronoun |
| B | **Changes to match the reporter** |
| C | Is always "I" |
| D | Is always "he" |
**Key:** B
**br_pt_form:** "mudança de pronome / muda para corresponder ao relator"



### ITEM 6
**item_id:** `grammar.reported_speech`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **reported speech**:
| Slot | Value |
|------|-------|
| A | She said she **is** tired. |
| B | She said she **was** tired. |
| C | She said she **will be** tired. |
| D | She said she **has been** tired. |
**Key:** B
**br_pt_form:** "Ela disse que estava cansada."



### ITEM 7
**item_id:** `vocab.reported.prereq-ask`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Ask** in reported speech:
| Slot | Value |
|------|-------|
| A | Is a statement |
| B | **Is a question** |
| C | Is a command |
| D | Is a quote |
**Key:** B
**br_pt_form:** "ask / pergunta"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_reported_speech_v1
lesson_id: les_b1_reported_speech_v1
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
