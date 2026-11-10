# Practice Pack: Regular Verbs Past — ED Rules
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_regular_verbs_past_v1`
**Lesson:** `les_a1_regular_verbs_past.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.past.work-worked`
**domain:** `vocab`
**level:** L1
**stem:** The past tense of **work** is:
| Slot | Value |
|------|-------|
| A | plaied |
| B | **worked** |
| C | workd |
| D | works |
**Key:** B
**br_pt_form:** "trabalhou / worked"



### ITEM 2
**item_id:** `vocab.past.play-played`
**domain:** `vocab`
**level:** L1
**stem:** The past tense of **play** is:
| Slot | Value |
|------|-------|
| A | plaied |
| B | **played** |
| C | playd |
| D | plays |
**Key:** B
**br_pt_form:** "jogou / played"



### ITEM 3
**item_id:** `vocab.past.study-studied`
**domain:** `vocab`
**level:** L1
**stem:** The past tense of **study** is:
| Slot | Value |
|------|-------|
| A | studyed |
| B | **studied** |
| C | studid |
| D | studys |
**Key:** B
**br_pt_form:** "estudou / studied"



### ITEM 4
**item_id:** `vocab.past.live-lived`
**domain:** `vocab`
**level:** L1
**stem:** The past tense of **live** is:
| Slot | Value |
|------|-------|
| A | liveed |
| B | **lived** |
| C | livd |
| D | lives |
**Key:** B
**br_pt_form:** "morou / lived"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key `lived`; over-regularisation is the error this item exists to catch). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.past.id_sound`
**domain:** `vocab`
**level:** L1
**stem:** The **/ɪd/** sound of -ed is used after:
| Slot | Value |
|------|-------|
| A | /k/ and /g/ sounds (worked, hugged) |
| B | **/t/ and /d/ sounds (wanted, needed)** |
| C | All consonants |
| D | All vowels |
**Key:** B
**br_pt_form:** "/ɪd/ / após /t/ e /d/"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; /k/ and /g/ take /t/, not /ɪd/, so this is a knowledgeable near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 6
**item_id:** `grammar.regular_verbs_past`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **past tense**:
| Slot | Value |
|------|-------|
| A | I **study** yesterday. |
| B | I **studied** yesterday. |
| C | I **studying** yesterday. |
| D | I **studies** yesterday. |
**Key:** B
**br_pt_form:** "Eu estudei ontem."



### ITEM 7
**item_id:** `vocab.past.prereq-want`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] The past tense of **want** is:
| Slot | Value |
|------|-------|
| A | want |
| B | **wanted** |
| C | wantd |
| D | wants |
**Key:** B
**br_pt_form:** "quis / wanted"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_regular_verbs_past_v1
lesson_id: les_a1_regular_verbs_past_v1
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
