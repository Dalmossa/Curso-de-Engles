# Practice Pack: Writer's Toolkit — SVO Order, Explicit Subject, Tense Consistency
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_writing_svo_v1`
**Lesson:** `les_a2_writing_svo.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.writing.svo`
**domain:** `vocab`
**level:** L1
**stem:** **SVO** stands for:
| Slot | Value |
|------|-------|
| A | Structure-Verb-Object |
| B | **Subject-Verb-Object** |
| C | Sentence-Verb-Object |
| D | Subject-Verb-Order |
**Key:** B
**br_pt_form:** "Sujeito-Verbo-Objeto"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key's own expansion). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 2
**item_id:** `vocab.writing.explicit-subject`
**domain:** `vocab`
**level:** L1
**stem:** **Explicit subject** means:
| Slot | Value |
|------|-------|
| A | Omitting the subject |
| B | **Always mentioning who** |
| C | Using only pronouns |
| D | Using only nouns |
**Key:** B
**br_pt_form:** "sujeito explícito / sempre mencionar quem"



### ITEM 3
**item_id:** `vocab.writing.tense-consistency`
**domain:** `vocab`
**level:** L1
**stem:** **Tense consistency** means:
| Slot | Value |
|------|-------|
| A | Using different tenses randomly |
| B | **Keeping the same tense throughout** |
| C | Using only present tense |
| D | Using only past tense |
**Key:** B
**br_pt_form:** "consistência verbal / manter o mesmo tempo verbal"



### ITEM 4
**item_id:** `vocab.writing.coherence`
**domain:** `vocab`
**level:** L1
**stem:** **Coherence** in writing means:
| Slot | Value |
|------|-------|
| A | Using complex words |
| B | **Logical flow of ideas** |
| C | Using many transitions |
| D | Writing long sentences |
**Key:** B
**br_pt_form:** "coerência / fluxo lógico de ideias"



### ITEM 5
**item_id:** `vocab.writing.transition`
**domain:** `vocab`
**level:** L1
**stem:** **Transitions** include:
| Slot | Value |
|------|-------|
| A | First, then, finally |
| B | **First, then, after that, finally** |
| C | However, therefore |
| D | All of the above |
**Key:** D
**br_pt_form:** "transições / primeiro, depois, finalmente, no entanto, portanto"



### ITEM 6
**item_id:** `grammar.svo_order`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **SVO order**:
| Slot | Value |
|------|-------|
| A | **Coffee she likes.** |
| B | **She likes coffee.** |
| C | **Likes she coffee.** |
| D | **She coffee likes.** |
**Key:** B
**br_pt_form:** "Ela gosta de café."



### ITEM 7
**item_id:** `vocab.writing.prereq-verb`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] The **verb** in a sentence is:
| Slot | Value |
|------|-------|
| A | The person |
| B | **The action** |
| C | The thing |
| D | The place |
**Key:** B
**br_pt_form:** "verbo / a ação"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_writing_svo_v1
lesson_id: les_a2_writing_svo_v1
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
