# Practice Pack: American vs. British English

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