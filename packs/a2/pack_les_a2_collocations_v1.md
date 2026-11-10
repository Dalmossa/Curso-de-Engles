# Practice Pack: Collocations — Word Partners
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_collocations_v1`
**Lesson:** `les_a2_collocations.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.collocations.make-a-reservation`
**domain:** `vocab`
**level:** L1
**stem:** **Make a reservation** is correct because:
| Slot | Value |
|------|-------|
| A | "Do" collocates with "reservation" |
| B | **"Make" collocates with "reservation"** |
| C | "Do" is always correct |
| D | Any verb works |
**Key:** B
**br_pt_form:** "make / coloca com reservation"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; *do* for *fazer* is the actual BR-PT transfer). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 2
**item_id:** `vocab.collocations.catch-a-flight`
**domain:** `vocab`
**level:** L1
**stem:** **Catch a flight** means:
| Slot | Value |
|------|-------|
| A | Miss a flight |
| B | **Board a plane** |
| C | Take a taxi |
| D | Book a ticket |
**Key:** B
**br_pt_form:** "catch a flight / embarcar em um voo"



### ITEM 3
**item_id:** `vocab.collocations.miss-a-flight`
**domain:** `vocab`
**level:** L1
**stem:** **Miss a flight** means:
| Slot | Value |
|------|-------|
| A | Board a plane |
| B | **Fail to board** |
| C | Take a taxi |
| D | Book a ticket |
**Key:** B
**br_pt_form:** "miss a flight / perder um voo"



### ITEM 4
**item_id:** `vocab.collocations.heavy-traffic`
**domain:** `vocab`
**level:** L1
**stem:** **Heavy traffic** is correct because:
| Slot | Value |
|------|-------|
| A | "Strong" collocates with "traffic" |
| B | **"Heavy" collocates with "traffic"** |
| C | "Strong" is always correct |
| D | Any adjective works |
**Key:** B
**br_pt_form:** "heavy / coloca com traffic"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; *strong* is the literal translation of PT *trânsito forte*). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.collocations.strong-coffee`
**domain:** `vocab`
**level:** L1
**stem:** **Strong coffee** is correct because:
| Slot | Value |
|------|-------|
| A | "Heavy" collocates with "coffee" |
| B | **"Strong" collocates with "coffee"** |
| C | "Heavy" is always correct |
| D | Any adjective works |
**Key:** B
**br_pt_form:** "strong / coloca com coffee"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; *heavy* is the literal translation of PT *café pesado*). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 6
**item_id:** `grammar.collocations`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **collocation**:
| Slot | Value |
|------|-------|
| A | I **do** a reservation. |
| B | I **make** a reservation. |
| C | I **take** a reservation. |
| D | I **get** a reservation. |
**Key:** B
**br_pt_form:** "Faço uma reserva."



### ITEM 7
**item_id:** `vocab.collocations.prereq-take-a-taxi`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Take a taxi** means:
| Slot | Value |
|------|-------|
| A | Drive a car |
| B | **Use a cab** |
| C | Ride a bus |
| D | Walk |
**Key:** B
**br_pt_form:** "take a taxi / usar um táxi"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_collocations_v1
lesson_id: les_a2_collocations_v1
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
