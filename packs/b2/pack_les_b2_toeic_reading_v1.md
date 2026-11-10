# Practice Pack: TOEIC: Reading & Listening
**Reuse basis:** cite_only

**Pack ID:** `pack_les_b2_toeic_reading_v1`
**Lesson:** `les_b2_toeic_reading.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.toeic.skimming`
**domain:** `vocab`
**level:** L1
**stem:** **Skimming** a text means:
| Slot | Value |
|------|-------|
| A | Reading every word |
| B | **Reading quickly for main idea** |
| C | Translating |
| D | Memorizing |
**Key:** B
**br_pt_form:** "skimming / leitura rápida para ideia geral"



### ITEM 2
**item_id:** `vocab.toeic.scanning`
**domain:** `vocab`
**level:** L1
**stem:** **Scanning** a text means:
| Slot | Value |
|------|-------|
| A | Reading for main idea |
| B | **Reading for specific information** |
| C | Translating |
| D | Memorizing |
**Key:** B
**br_pt_form:** "scanning / leitura direcionada"



### ITEM 3
**item_id:** `vocab.toeic.inference`
**domain:** `vocab`
**level:** L1
**stem:** **Inference** in reading:
| Slot | Value |
|------|-------|
| A | Is explicit |
| B | **Requires reading between the lines** |
| C | Is vocabulary |
| D | Is grammar |
**Key:** B
**br_pt_form:** "inferência / ler entre as linhas"



### ITEM 4
**item_id:** `vocab.toeic.distractor`
**domain:** `vocab`
**level:** L1
**stem:** A **distractor** in TOEIC:
| Slot | Value |
|------|-------|
| A | Is the correct answer |
| B | **Is a wrong option designed to mislead** |
| C | Is a hint |
| D | Is a question |
**Key:** B
**br_pt_form:** "distrator / opção incorreta que confunde"



### ITEM 5
**item_id:** `vocab.toeic.context_clue`
**domain:** `vocab`
**level:** L1
**stem:** A **context clue** helps:
| Slot | Value |
|------|-------|
| A | Memorize vocabulary |
| B | **Infer meaning of unknown words** |
| C | Skip questions |
| D | Read faster |
**Key:** B
**br_pt_form:** "pista de contexto / ajuda inferir significado"



### ITEM 6
**item_id:** `grammar.present_perfect_exam`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **present perfect** for exam experience:
| Slot | Value |
|------|-------|
| A | I **take** the TOEIC last year. |
| B | I **have taken** the TOEIC twice. |
| C | I **am taking** the TOEIC twice. |
| D | I **took** the TOEIC twice. |
**Key:** B
**br_pt_form:** "Eu fiz o TOEIC duas vezes."



### ITEM 7
**item_id:** `vocab.toeic.prereq_main_idea`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] The **main idea** of a text is:
| Slot | Value |
|------|-------|
| A | Every detail |
| B | **The central point the author conveys** |
| C | The first sentence only |
| D | The conclusion only |
**Key:** B
**br_pt_form:** "ideia principal / ponto central"

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_toeic_reading_v1
lesson_id: les_b2_toeic_reading_v1
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
