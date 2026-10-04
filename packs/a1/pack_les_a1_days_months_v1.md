# Practice Pack: Days of Week & Months

**Pack ID:** `pack_les_a1_days_months_v1`
**Lesson:** `les_a1_days_months.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---

### ITEM 1
**item_id:** `vocab.calendar.monday`
**domain:** `vocab`
**level:** L1
**stem:** **Monday** is:
| Slot | Value |
|------|-------|
| A | Part of the weekend |
| B | **1st day of the week** |
| C | 2nd day |
| D | 7th day |
**Key:** B
**br_pt_form:** "segunda-feira / 1º dia da semana"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate said Monday *is* the 1st day, the same as the key). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.

### ITEM 2
**item_id:** `vocab.calendar.friday`
**domain:** `vocab`
**level:** L1
**stem:** **Friday** is:
| Slot | Value |
|------|-------|
| A | 3rd day |
| B | **5th day** |
| C | 6th day |
| D | 7th day |
**Key:** B
**br_pt_form:** "sexta-feira / 5º dia"

### ITEM 3
**item_id:** `vocab.calendar.january`
**domain:** `vocab`
**level:** L1
**stem:** **January** is:
| Slot | Value |
|------|-------|
| A | The 2nd month |
| B | **1st month** |
| C | 6th month |
| D | 12th month |
**Key:** B
**br_pt_form:** "janeiro / 1º mês"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate said January *is* the 1st month, the same as the key). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.

### ITEM 4
**item_id:** `vocab.calendar.december`
**domain:** `vocab`
**level:** L1
**stem:** **December** is:
| Slot | Value |
|------|-------|
| A | 1st month |
| B | 6th month |
| C | **12th month** |
| D | 11th month |
**Key:** C
**br_pt_form:** "dezembro / 12º mês"

### ITEM 5
**item_id:** `vocab.calendar.today`
**domain:** `vocab`
**level:** L1
**stem:** **Today** is:
| Slot | Value |
|------|-------|
| A | Yesterday |
| B | **The current day** |
| C | Tomorrow |
| D | Last week |
**Key:** B
**br_pt_form:** "hoje / dia atual"

### ITEM 6
**item_id:** `grammar.prepositions_calendar`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **preposition**:
| Slot | Value |
|------|-------|
| A | **in** Monday |
| B | **on** Monday |
| C | **at** Monday |
| D | **—** Monday |
**Key:** B
**br_pt_form:** "na segunda-feira"

### ITEM 7
**item_id:** `vocab.calendar.prereq_tomorrow`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Tomorrow** is:
| Slot | Value |
|------|-------|
| A | Yesterday |
| B | **The day after today** |
| C | Last week |
| D | Next month |
**Key:** B
**br_pt_form:** "amanhã / dia após hoje"