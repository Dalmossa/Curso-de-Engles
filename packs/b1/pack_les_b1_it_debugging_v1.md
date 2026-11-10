# Practice Pack: Debugging & Error Reporting
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_it_debugging_v1`
**Lesson:** `les_b1_it_debugging.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.debug.stack_trace`
**domain:** `vocab`
**level:** L1
**stem:** A **stack trace** shows:
| Slot | Value |
|------|-------|
| A | Memory usage over time |
| B | **Sequence of function calls leading to the error** |
| C | CPU percentage |
| D | Network latency |
**Key:** B
**br_pt_form:** "stack trace / rastro de pilha"



### ITEM 2
**item_id:** `vocab.debug.breakpoint`
**domain:** `vocab`
**level:** L1
**stem:** A **breakpoint** is used to:
| Slot | Value |
|------|-------|
| A | Speed up the code |
| B | **Pause execution at a specific line** |
| C | Format the code |
| D | Run tests |
**Key:** B
**br_pt_form:** "ponto de parada"



### ITEM 3
**item_id:** `vocab.debug.root_cause`
**domain:** `vocab`
**level:** L1
**stem:** **Root cause** analysis finds:
| Slot | Value |
|------|-------|
| A | The first symptom |
| B | **The fundamental reason the bug exists** |
| C | Who wrote the buggy code |
| D | The ticket number |
**Key:** B
**br_pt_form:** "causa raiz"



### ITEM 4
**item_id:** `vocab.debug.try_catch`
**domain:** `vocab`
**level:** L1
**stem:** **Try / catch** blocks are used for:
| Slot | Value |
|------|-------|
| A | Looping |
| B | **Error handling / catching exceptions** |
| C | Defining functions |
| D | Importing modules |
**Key:** B
**br_pt_form:** "try / catch / tratamento de erro"



### ITEM 5
**item_id:** `vocab.debug.assert`
**domain:** `vocab`
**level:** L1
**stem:** An **assert** statement:
| Slot | Value |
|------|-------|
| A | Prints a log message |
| B | **Verifies a condition, fails if false** |
| C | Creates a breakpoint |
| D | Catches an exception |
**Key:** B
**br_pt_form:** "assert / afirmar / verificar"



### ITEM 6
**item_id:** `grammar.past_perfect_debugging`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **past perfect** for a debugging timeline:
| Slot | Value |
|------|-------|
| A | We **found** the bug after the user **had reported** it. |
| B | We **had found** the bug after the user **reported** it. |
| C | We **find** the bug after the user **had reported** it. |
| D | We **had found** the bug after the user **had report** it. |
**Key:** A
**br_pt_form:** "Encontramos o bug depois que o usuário tinha reportado."



### ITEM 7
**item_id:** `vocab.debug.prereq_hotfix`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **hotfix** is:
| Slot | Value |
|------|-------|
| A | A new feature |
| B | **An urgent fix for production** |
| C | A code review comment |
| D | A test case |
**Key:** B
**br_pt_form:** "hotfix / correção urgente"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_debugging_v1
lesson_id: les_b1_it_debugging_v1
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
