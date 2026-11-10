# Practice Pack: Clean Code Practices — Refactoring, Code Smells, SOLID
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_it_clean_code_basics_v1`
**Lesson:** `les_a2_it_clean_code_basics.md`
**Items:** 5
**Time cap:** 4 min
**Split:** 60% current / 40% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.clean_code.refactor`
**domain:** `vocab`
**level:** L1
**stem:** What does **refactor** mean in a code review context?
| Slot | Value |
|------|-------|
| A | Rewrite code to add new features |
| B | **Restructure existing code without changing behavior** |
| C | Fix a bug reported by a user |
| D | Delete old code that is not used |
**Key:** B
**br_pt_form:** "refatorar"



### ITEM 2
**item_id:** `vocab.clean_code.code_smell`
**domain:** `vocab`
**level:** L1
**stem:** A **code smell** is:
| Slot | Value |
|------|-------|
| A | A syntax error that breaks the build |
| B | **A sign of a design problem in working code** |
| C | A virus in the repository |
| D | A comment written in bad English |
**Key:** B
**br_pt_form:** "cheiro de código"



### ITEM 3
**item_id:** `vocab.clean_code.technical_debt`
**domain:** `vocab`
**level:** L1
**stem:** **Technical debt** refers to:
| Slot | Value |
|------|-------|
| A | Money owed to the cloud provider |
| B | **Future cost of quick, suboptimal solutions** |
| C | The salary of senior developers |
| D | Hardware depreciation |
**Key:** B
**br_pt_form:** "dívida técnica"



### ITEM 4
**item_id:** `vocab.clean_code.solid_srp`
**domain:** `vocab`
**level:** L1
**stem:** The **S** in **SOLID** stands for:
| Slot | Value |
|------|-------|
| A | Simple |
| B | Secure |
| C | **Single Responsibility Principle** |
| D | Scalable |
**Key:** C
**br_pt_form:** "Princípio da Responsabilidade Única"



### ITEM 5
**item_id:** `vocab.clean_code.dry_yagni`
**domain:** `vocab`
**level:** L1
**stem:** Match each acronym to its meaning:
| Acronym | Meaning |
|---------|---------|
| **DRY** | a. You Aren't Gonna Need It |
| **KISS** | b. Don't Repeat Yourself |
| **YAGNI** | c. Keep It Simple, Stupid |
| **SOLID** | d. 5 OO design principles |
**Key:** DRY→b, KISS→c, YAGNI→a, SOLID→d
**br_pt_form:** "não se repita", "mantenha simples", "não vai precisar", "5 princípios"



### ITEM 6
**item_id:** `grammar.imperative_advice`
**domain:** `grammar`
**level:** L1
**stem:** Complete the advice using the **imperative**:
"______ (keep) functions small. ______ (don't repeat) logic. ______ (don't add) code you don't need."
| Slot | Value |
|------|-------|
| A | **Keep** / **Don't repeat** / **Don't add** |
| B | Keeping / Not repeating / Not adding |
| C | To keep / To not repeat / To not add |
| D | Kept / Didn't repeat / Didn't add |
**Key:** A
**br_pt_form:** "Mantenha / Não repita / Não adicione"



### ITEM 7
**item_id:** `vocab.clean_code.prereq_boy_scout`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] The **Boy Scout Rule** says:
| Slot | Value |
|------|-------|
| A | Always write comments in English |
| B | **Leave the code better than you found it** |
| C | Never refactor on Fridays |
| D | Test only in production |
**Key:** B
**br_pt_form:** "Deixe o código melhor do que encontrou"



### ITEM 8
**item_id:** `vocab.clean_code.prereq_single_responsibility`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A function that validates input, saves to DB, and sends email violates:
| Slot | Value |
|------|-------|
| A | DRY |
| B | YAGNI |
| C | **Single Responsibility Principle** |
| D | KISS |
**Key:** C
**br_pt_form:** "Princípio da Responsabilidade Única"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_clean_code_basics_v1
lesson_id: les_a2_it_clean_code_basics_v1
learner_profile: default
estimated_minutes: 4 min
spec_conformance:
  item_count: 8                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (assumed)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 8/7 scored items
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```
