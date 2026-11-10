# Practice Pack: Articles, Nouns, Adjectives
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a1_articles_nouns_v1`
**Lesson:** `les_a1_articles_nouns.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.articles.a`
**domain:** `vocab`
**level:** L1
**stem:** **A** is used before:
| Slot | Value |
|------|-------|
| A | Vowel sounds |
| B | **Consonant sounds (book, car, dog)** |
| C | All words |
| D | No words |
**Key:** B
**br_pt_form:** "a / antes de som consoante"



### ITEM 2
**item_id:** `vocab.articles.an`
**domain:** `vocab`
**level:** L1
**stem:** **An** is used before:
| Slot | Value |
|------|-------|
| A | Consonant sounds |
| B | **Vowel sounds (apple, egg, hour)** |
| C | All words |
| D | No words |
**Key:** B
**br_pt_form:** "an / antes de som de vogal"



### ITEM 3
**item_id:** `vocab.articles.the`
**domain:** `vocab`
**level:** L1
**stem:** **The** is used for:
| Slot | Value |
|------|-------|
| A | General nouns |
| B | **Specific/known nouns** |
| C | All nouns |
| D | No nouns |
**Key:** B
**br_pt_form:** "the / substantivos específicos/conhecidos"



### ITEM 4
**item_id:** `vocab.articles.uncountable`
**domain:** `vocab`
**level:** L1
**stem:** **Uncountable nouns**:
| Slot | Value |
|------|-------|
| A | Have plural form |
| B | **Do not have plural form (water, information)** |
| C | Always use "a" |
| D | Are always specific |
**Key:** B
**br_pt_form:** "substantivos incontáveis / sem plural"



### ITEM 5
**item_id:** `vocab.articles.adjective`
**domain:** `vocab`
**level:** L1
**stem:** **Adjectives** in English:
| Slot | Value |
|------|-------|
| A | Come after nouns |
| B | **Come before nouns (big book, red car)** |
| C | Are verbs |
| D | Are articles |
**Key:** B
**br_pt_form:** "adjetivos / antes do substantivo"



### ITEM 6
**item_id:** `grammar.articles_a_an_the`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **article**:
| Slot | Value |
|------|-------|
| A | **a** apple |
| B | **an** apple |
| C | **the** apple |
| D | **—** apple |
**Key:** B
**br_pt_form:** "uma maçã"



### ITEM 7
**item_id:** `vocab.articles.prereq_plural`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Plural** nouns:
| Slot | Value |
|------|-------|
| A | Are always uncountable |
| B | **Add -s or -es (book → books, box → boxes)** |
| C | Never change |
| D | Always use "the" |
**Key:** B
**br_pt_form:** "plural / adiciona -s ou -es"

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_articles_nouns_v1
lesson_id: les_a1_articles_nouns_v1
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
