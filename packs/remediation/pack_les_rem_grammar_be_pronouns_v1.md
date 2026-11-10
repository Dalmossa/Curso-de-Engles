# Practice Pack: To Be + Pronouns (Remediation)
**Reuse basis:** cite_only

**Pack ID:** `pack_les_rem_grammar_be_pronouns_v1`
**Lesson:** `les_rem_grammar_be_pronouns.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.tobe.negative_contraction_001`
**domain:** `vocab`
**level:** L1
**stem:** Contract the negative: "They are not ready yet." →
| Slot | Value |
|------|-------|
| A | **They aren't ready yet.** |
| B | They arent ready yet. |
| C | They not are ready yet. |
| D | They isn't ready yet. |
**Key:** A
**br_pt_form:** "They are not → They aren't — contração negativa de *are not*"

> **Replaced 2026-10-01.** This item was `vocab.tobe.contraction`, byte-identical to ITEM 4 of
> `pack_les_a1_to_be_forms_v1.md` — and that A1 item is itself defective: options A and B are both
> the string `I'm`, so it has two correct answers and cannot be scored. This replacement scores the
> negative contraction instead, which is the specific form a false beginner breaks on and the point
> of `les_rem_grammar_be_pronouns`. **The A1 item's duplicate options are still open** and are
> recorded in `post-lesson-practice-spec.md` §12. Found by [11c].



### ITEM 2
**item_id:** `vocab.tobe.subject-pronoun`
**domain:** `vocab`
**level:** L1
**stem:** **Subject pronouns** are:
| Slot | Value |
|------|-------|
| A | me, you, him, her, us, them |
| B | **I, you, he, she, it, we, they** |
| C | my, your, his, her, our, their |
| D | mine, yours, his, hers, ours, theirs |
**Key:** B
**br_pt_form:** "pronomes sujeito / I, you, he, she, it, we, they"



### ITEM 3
**item_id:** `vocab.tobe.affirmative`
**domain:** `vocab`
**level:** L1
**stem:** **Affirmative** sentences:
| Slot | Value |
|------|-------|
| A | Contain "not" |
| B | **Are positive statements** |
| C | Are questions |
| D | Are commands |
**Key:** B
**br_pt_form:** "afirmativa / frases positivas"



### ITEM 4
**item_id:** `vocab.tobe.negative`
**domain:** `vocab`
**level:** L1
**stem:** **Negative** sentences:
| Slot | Value |
|------|-------|
| A | Are positive |
| B | **Contain "not"** |
| C | Are questions |
| D | Are commands |
**Key:** B
**br_pt_form:** "negativa / contêm not"



### ITEM 5
**item_id:** `vocab.tobe.short-answer`
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
**br_pt_form:** "Sim, estou. / resposta curta"



### ITEM 6
**item_id:** `grammar.to_be_pronouns`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **"to be" form**:
| Slot | Value |
|------|-------|
| A | She **am** smart. |
| B | She **is** smart. |
| C | She **are** smart. |
| D | She **be** smart. |
**Key:** B
**br_pt_form:** "Ela é inteligente."



### ITEM 7
**item_id:** `vocab.tobe.prereq-object-pronoun`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Object pronouns** are:
| Slot | Value |
|------|-------|
| A | I, you, he, she, it, we, they |
| B | **me, you, him, her, it, us, them** |
| C | my, your, his, her, our, their |
| D | mine, yours, his, hers, ours, theirs |
**Key:** B
**br_pt_form:** "pronomes objeto / me, you, him, her, it, us, them"

## 1. MANIFEST

```yaml
pack_id: pack_les_rem_grammar_be_pronouns_v1
lesson_id: les_rem_grammar_be_pronouns_v1
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
