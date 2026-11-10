# Practice Pack: Verb To Be — Affirmative, Negative, Interrogative
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_to_be_forms_v1`
**Lesson:** `les_a1_to_be_forms.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.tobe.am`
**domain:** `vocab`
**level:** L1
**stem:** **Am** is used with:
| Slot | Value |
|------|-------|
| A | He, she, it |
| B | **I** |
| C | You, we, they |
| D | All subjects |
**Key:** B
**br_pt_form:** "am / com I"



### ITEM 2
**item_id:** `vocab.tobe.is`
**domain:** `vocab`
**level:** L1
**stem:** **Is** is used with:
| Slot | Value |
|------|-------|
| A | I |
| B | **He, she, it** |
| C | You, we, they |
| D | All subjects |
**Key:** B
**br_pt_form:** "is / com he, she, it"



### ITEM 3
**item_id:** `vocab.tobe.are`
**domain:** `vocab`
**level:** L1
**stem:** **Are** is used with:
| Slot | Value |
|------|-------|
| A | I |
| B | He, she, it |
| C | **You, we, they** |
| D | All subjects |
**Key:** C
**br_pt_form:** "are / com you, we, they"



### ITEM 4
**item_id:** `vocab.tobe.contraction`
**domain:** `vocab`
**level:** L1
**stem:** **Contraction** of "I am" is:
| Slot | Value |
|------|-------|
| A | I amn't |
| B | **I'm** |
| C | Im |
| D | I am'm |
**Key:** B
**br_pt_form:** "I'm / contração de I am"

> **Fixed 2026-10-01.** Options A and B were both the string `I'm` (A plain, B bolded as the key),
> so this item had **two correct answers and could not be scored** — the same defect class
> `verify-integrity.py` [9] was written to catch ("Found 2 unscorable items in the first 4 packs
> (duplicate options)"), uncaught here because [9] globbed only `pack-les-*.md` and this pack uses
> the `pack_les_*` schema. Found by the cross-schema uniqueness work of the same date. The
> distractors are now genuinely wrong forms and name the two errors that actually occur:
> `amn't` (over-regularisation of the negative contraction) and `Im` (dropped apostrophe).



### ITEM 5
**item_id:** `vocab.tobe.short_answer`
**domain:** `vocab`
**level:** L1
**stem:** **Short answer** to "Are you happy?":
| Slot | Value |
|------|-------|
| A | Yes, I am happy. |
| B | **Yes, I am.** |
| C | Yes, am. |
| D | Yes, happy. |
**Key:** B
**br_pt_form:** "Yes, I am. / resposta curta"



### ITEM 6
**item_id:** `grammar.to_be_forms`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **to be** form:
| Slot | Value |
|------|-------|
| A | She **am** happy. |
| B | She **is** happy. |
| C | She **are** happy. |
| D | She **be** happy. |
**Key:** B
**br_pt_form:** "Ela está feliz."



### ITEM 7
**item_id:** `vocab.tobe.prereq_affirmative`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Affirmative** sentences:
| Slot | Value |
|------|-------|
| A | Contain "not" |
| B | **Are positive statements** |
| C | Are questions |
| D | Are commands |
**Key:** B
**br_pt_form:** "afirmativa / frases positivas"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_to_be_forms_v1
lesson_id: les_a1_to_be_forms_v1
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
