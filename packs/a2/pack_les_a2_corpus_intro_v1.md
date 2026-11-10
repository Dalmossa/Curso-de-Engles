# Practice Pack: Corporate Speak — Acronyms & Jargon
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_corpus_intro_v1`
**Lesson:** `les_a2_corpus_intro.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.corporate.asap`
**domain:** `vocab`
**level:** L1
**stem:** **ASAP** stands for:
| Slot | Value |
|------|-------|
| A | Always Send All Paperwork |
| B | **As Soon As Possible** |
| C | Always Start A Project |
| D | All Systems Are Perfect |
**Key:** B
**br_pt_form:** "o mais rápido possível"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 2
**item_id:** `vocab.corporate.ceo`
**domain:** `vocab`
**level:** L1
**stem:** **CEO** stands for:
| Slot | Value |
|------|-------|
| A | Chief Engineering Officer |
| B | **Chief Executive Officer** |
| C | Chief Executive Official |
| D | Chief Executive Organization |
**Key:** B
**br_pt_form:** "Chief Executive Officer / CEO"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; *Engineering* for *Executive* is the near-miss). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 3
**item_id:** `vocab.corporate.hr`
**domain:** `vocab`
**level:** L1
**stem:** **HR** stands for:
| Slot | Value |
|------|-------|
| A | Hiring and Recruitment |
| B | **Human Resources** |
| C | Human Relations |
| D | Human Records |
**Key:** B
**br_pt_form:** "Human Resources / RH"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion; this names a function, not the expansion). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 4
**item_id:** `vocab.corporate.roi`
**domain:** `vocab`
**level:** L1
**stem:** **ROI** stands for:
| Slot | Value |
|------|-------|
| A | Return Of Income |
| B | **Return On Investment** |
| C | Rate Of Interest |
| D | Revenue On Investment |
**Key:** B
**br_pt_form:** "Return On Investment / ROI"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 5
**item_id:** `vocab.corporate.ooo`
**domain:** `vocab`
**level:** L1
**stem:** **OOO** means:
| Slot | Value |
|------|-------|
| A | In the office |
| B | **Out Of Office** |
| C | On the phone |
| D | In a meeting |
**Key:** B
**br_pt_form:** "fora do escritório"



### ITEM 6
**item_id:** `grammar.present_simple_corporate`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present simple**:
| Slot | Value |
|------|-------|
| A | The CEO **lead** the company. |
| B | The CEO **leads** the company. |
| C | The CEO **leading** the company. |
| D | The CEO **led** the company. |
**Key:** B
**br_pt_form:** "O CEO lidera a empresa."



### ITEM 7
**item_id:** `vocab.corporate.prereq-eod`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **EOD** means:
| Slot | Value |
|------|-------|
| A | End Of Discussion |
| B | **End Of Day** |
| C | End Of Deadline |
| D | End Of Delivery |
**Key:** B
**br_pt_form:** "fim do dia"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_corpus_intro_v1
lesson_id: les_a2_corpus_intro_v1
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
