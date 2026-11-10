# Practice Pack: HR & Career Vocabulary
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b1_hr_career_v1`
**Lesson:** `les_b1_hr_career.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.hr.promotion`
**domain:** `vocab`
**level:** L1
**stem:** **Promotion** means:
| Slot | Value |
|------|-------|
| A | Leaving a job |
| B | **Moving to a higher position** |
| C | Being fired |
| D | Applying for a job |
**Key:** B
**br_pt_form:** "promotion / mover para posição superior"



### ITEM 2
**item_id:** `vocab.hr.salary`
**domain:** `vocab`
**level:** L1
**stem:** **Salary** is:
| Slot | Value |
|------|-------|
| A | A benefit |
| B | **Compensation / pay** |
| C | A promotion |
| D | A job |
**Key:** B
**br_pt_form:** "salário / remuneração / pagamento"



### ITEM 3
**item_id:** `vocab.hr.benefits`
**domain:** `vocab`
**level:** L1
**stem:** **Benefits** are:
| Slot | Value |
|------|-------|
| A | Salary |
| B | **Perks / extras** |
| C | Promotions |
| D | Interviews |
**Key:** B
**br_pt_form:** "benefícios / vantagens / extras"



### ITEM 4
**item_id:** `vocab.hr.resignation`
**domain:** `vocab`
**level:** L1
**stem:** **Resignation** is:
| Slot | Value |
|------|-------|
| A | A temporary leave of absence |
| B | **Voluntary departure** |
| C | Involuntary departure |
| D | A promotion |
**Key:** B
**br_pt_form:** "resignation / pedido de demissão / saída voluntária"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; a leave is reversible, a resignation is not). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.hr.layoff`
**domain:** `vocab`
**level:** L1
**stem:** **Layoff** is:
| Slot | Value |
|------|-------|
| A | Voluntary departure |
| B | **Involuntary departure** |
| C | A promotion |
| D | A salary |
**Key:** B
**br_pt_form:** "layoff / demissão / saída involuntária"



### ITEM 6
**item_id:** `grammar.present_simple_hr`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present simple**:
| Slot | Value |
|------|-------|
| A | The company **offer** good benefits. |
| B | The company **offers** good benefits. |
| C | The company **offering** good benefits. |
| D | The company **offered** good benefits. |
**Key:** B
**br_pt_form:** "A empresa oferece bons benefícios."



### ITEM 7
**item_id:** `vocab.hr.prereq-interview`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Interview** is:
| Slot | Value |
|------|-------|
| A | A job |
| B | **A selection meeting** |
| C | A salary |
| D | A benefit |
**Key:** B
**br_pt_form:** "interview / entrevista / reunião de seleção"

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_hr_career_v1
lesson_id: les_b1_hr_career_v1
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
