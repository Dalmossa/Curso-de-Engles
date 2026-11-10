# Practice Pack: Reader's Toolkit — Skim, Scan, Context, Cognates
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_reading_strategy_v1`
**Lesson:** `les_a2_reading_strategy.md`
**Items:** 7
**Time cap:** 4 min
**Split:** 57% current / 43% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.reading.skim`
**domain:** `vocab`
**level:** L1
**stem:** **Skim** means:
| Slot | Value |
|------|-------|
| A | Read every word |
| B | **Read quickly for main idea** |
| C | Translating |
| D | Memorizing |
**Key:** B
**br_pt_form:** "skim / ler rapidamente para ideia geral"



### ITEM 2
**item_id:** `vocab.reading.scan`
**domain:** `vocab`
**level:** L1
**stem:** **Scan** means:
| Slot | Value |
|------|-------|
| A | Read for main idea |
| B | **Read for specific details** |
| C | Translating |
| D | Memorizing |
**Key:** B
**br_pt_form:** "scan / ler para detalhes específicos"



### ITEM 3
**item_id:** `vocab.reading.cognate`
**domain:** `vocab`
**level:** L1
**stem:** **Cognates** are:
| Slot | Value |
|------|-------|
| A | Words that look different |
| B | **Words similar in Portuguese and English** |
| C | Words with no meaning |
| D | Only false friends |
**Key:** B
**br_pt_form:** "cognatos / palavras similares em PT e EN"



### ITEM 4
**item_id:** `vocab.reading.context_002`
**domain:** `vocab`
**level:** L1
**stem:** You hit an unknown word in paragraph three. What does **context** let you do?
| Slot | Value |
|------|-------|
| A | Nothing — you must look it up immediately |
| B | **Infer a plausible meaning from the surrounding sentences** |
| C | Skip the paragraph and move on |
| D | Translate the sentence word by word into Portuguese |
**Key:** B
**br_pt_form:** "inferir um significado plausível a partir do contexto"

> **Replaced 2026-10-01.** This item was `vocab.reading.context`, byte-identical to ITEM 5 of
> `pack_les_a1_reading_skimming_v1.md` apart from *Guess* → *Infer*. Two packs in a learner's path
> offered the same item with the same key, so the second sighting was not new evidence for
> `vocab.reading.context` — it was a repeat the mastery tracker would have counted twice. Found by
> the cross-pack `item_id` uniqueness check added to `verify-integrity.py` [11c].



### ITEM 5
**item_id:** `vocab.reading.topic-sentence`
**domain:** `vocab`
**level:** L1
**stem:** **Topic sentence** is:
| Slot | Value |
|------|-------|
| A | The last sentence |
| B | **The main sentence of a paragraph** |
| C | A question |
| D | A detail |
**Key:** B
**br_pt_form:** "frase-tópico / frase principal do parágrafo"



### ITEM 6
**item_id:** `grammar.imperatives_reading_002`
**domain:** `grammar`
**level:** L1
**stem:** Choose the correct **negative imperative** for a reading strategy:
"______ (not / translate) every word — infer it from the context."
| Slot | Value |
|------|-------|
| A | Do not |
| B | **Don't** |
| C | Not |
| D | Doesn't |
**Key:** B
**br_pt_form:** "Não traduza palavra por palavra — infira do contexto"

> **Replaced 2026-10-01.** This item was `grammar.imperatives_reading`, byte-identical to ITEM 6 of
> `pack_les_a1_reading_skimming_v1.md` — same stem, same options, same key. It now scores the
> negative imperative, which the A1 item does not touch and which is the form a reading instruction
> actually takes. Found by [11c].



### ITEM 7
**item_id:** `vocab.reading.prereq-infer`
**domain:** `vocab`
**level:** L1
**stem:** [Prereq] **Infer** means:
| Slot | Value |
|------|-------|
| A | Copy exactly |
| B | **Conclude beyond what is explicit** |
| C | Translate |
| D | Skip |
**Key:** B
**br_pt_form:** "inferir / concluir além do explícito"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_reading_strategy_v1
lesson_id: les_a2_reading_strategy_v1
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
