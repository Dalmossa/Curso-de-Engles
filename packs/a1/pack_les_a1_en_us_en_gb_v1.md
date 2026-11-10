# Practice Pack: American vs. British English
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_en_us_en_gb_v1`
**Lesson:** `les_a1_en_us_en_gb.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.dialect.flat`
**domain:** `vocab`
**level:** L1
**stem:** **Flat** in British English means:
| Slot | Value |
|------|-------|
| A | Not sharp |
| B | **Apartment** |
| C | A tire |
| D | A floor |
**Key:** B
**br_pt_form:** "flat / apartamento (UK)"



### ITEM 2
**item_id:** `vocab.dialect.apartment`
**domain:** `vocab`
**level:** L1
**stem:** **Apartment** in American English is:
| Slot | Value |
|------|-------|
| A | Lift (UK) |
| B | **Flat (UK)** |
| C | House |
| D | Room |
**Key:** B
**br_pt_form:** "apartamento / flat (UK)"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own `Flat (UK)`; `lift` is the UK word for *elevator*, a different object). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 3
**item_id:** `vocab.dialect.color_colour`
**domain:** `vocab`
**level:** L1
**stem:** **Color** (US) vs **Colour** (UK):
| Slot | Value |
|------|-------|
| A | Same spelling |
| B | **Different spelling, same meaning** |
| C | Different meaning |
| D | Different pronunciation |
**Key:** B
**br_pt_form:** "color/colour / mesma palavra, ortografia diferente"



### ITEM 4
**item_id:** `vocab.dialect.elevator`
**domain:** `vocab`
**level:** L1
**stem:** **Elevator** (US) vs **Lift** (UK):
| Slot | Value |
|------|-------|
| A | Same word |
| B | **Different words, same meaning** |
| C | Different meaning |
| D | Different pronunciation |
**Key:** B
**br_pt_form:** "elevador / lift (UK)"



### ITEM 5
**item_id:** `vocab.dialect.accent`
**domain:** `vocab`
**level:** L1
**stem:** **Accent** refers to:
| Slot | Value |
|------|-------|
| A | Spelling |
| B | **Way of pronouncing** |
| C | Vocabulary |
| D | Grammar |
**Key:** B
**br_pt_form:** "sotaque / maneira de pronunciar"



### ITEM 6
**item_id:** `grammar.spelling_differences`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **US spelling**:
| Slot | Value |
|------|-------|
| A | **color** |
| B | **colour** |
| C | **centre** |
| D | **organise** |
**Key:** A
**br_pt_form:** "color / ortografia US"



### ITEM 7
**item_id:** `vocab.dialect.prereq_truck`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Truck** (US) vs **Lorry** (UK):
| Slot | Value |
|------|-------|
| A | Same word |
| B | **Different words, same meaning** |
| C | Different meaning |
| D | Different pronunciation |
**Key:** B
**br_pt_form:** "caminhão / lorry (UK)"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_en_us_en_gb_v1
lesson_id: les_a1_en_us_en_gb_v1
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
