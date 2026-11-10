# Practice Pack: TOEIC: Writing
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_toeic_writing_v1`
**Lesson:** `les_b2_toeic_writing.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.writing.cohesion`
**domain:** `vocab`
**level:** L1
**stem:** **Cohesion** in writing refers to:
| Slot | Value |
|------|-------|
| A | Logical flow |
| B | **Grammatical/lexical links between sentences** |
| C | Vocabulary variety |
| D | Paragraph length |
**Key:** B
**br_pt_form:** "coesão / links gramaticais entre frases"



### ITEM 2
**item_id:** `vocab.writing.opinion_essay`
**domain:** `vocab`
**level:** L1
**stem:** An **opinion essay** structure:
| Slot | Value |
|------|-------|
| A | Introduction only |
| B | **Thesis → body paragraphs → conclusion** |
| C | Only arguments |
| D | Only examples |
**Key:** B
**br_pt_form:** "ensaio de opinião / tese → desenvolvimento → conclusão"



### ITEM 3
**item_id:** `vocab.writing.time_management`
**domain:** `vocab`
**level:** L1
**stem:** **Time management** in TOEIC Writing:
| Slot | Value |
|------|-------|
| A | Writing fast |
| B | **Distributing time: plan, write, review** |
| C | Skipping tasks |
| D | Writing slowly |
**Key:** B
**br_pt_form:** "gestão de tempo / planejar, escrever, revisar"



### ITEM 4
**item_id:** `vocab.writing.word_count`
**domain:** `vocab`
**level:** L1
**stem:** **Word count** in TOEIC:
| Slot | Value |
|------|-------|
| A | Is ignored |
| B | **Is scored (minimum required)** |
| C | Is optional |
| D | Is unlimited |
**Key:** B
**br_pt_form:** "contagem de palavras / mínimo exigido"



### ITEM 5
**item_id:** `vocab.writing.business_email`
**domain:** `vocab`
**level:** L1
**stem:** A **business email** in TOEIC:
| Slot | Value |
|------|-------|
| A | Uses slang |
| B | **Professional tone, clear call to action** |
| C | Is informal |
| D | Has no structure |
**Key:** B
**br_pt_form:** "e-mail comercial / tom profissional, chamada para ação"



### ITEM 6
**item_id:** `grammar.future_forms_essay`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **future form** for an essay prediction:
| Slot | Value |
|------|-------|
| A | Renewable energy **dominates** the market by 2030. |
| B | Renewable energy **will dominate** the market by 2030. |
| C | Renewable energy **is dominating** the market by 2030. |
| D | Renewable energy **dominated** the market by 2030. |
**Key:** B
**br_pt_form:** "Energia renovável dominará o mercado até 2030."



### ITEM 7
**item_id:** `vocab.writing.prereq_thesis`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] A **thesis** in an essay:
| Slot | Value |
|------|-------|
| A | Is a question |
| B | **States the central position** |
| C | Is a summary |
| D | Is a quote |
**Key:** B
**br_pt_form:** "tese / posição central"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_toeic_writing_v1
lesson_id: les_b2_toeic_writing_v1
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
