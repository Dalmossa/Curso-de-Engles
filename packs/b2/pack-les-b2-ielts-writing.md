# Practice Pack — `les_b2_ielts_writing`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_ielts_writing_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_ielts_writing.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_ielts_writing_v1
lesson_id: les_b2_ielts_writing
learner_profile: default
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 6/6 scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 2 | 2–3 | ✅ |
| Vocabulary | 2 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 2 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_ielts_writing_overview_001
skill: `grammar.academic_overview`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "In 2019 the library lent 120 laptops, in 2020 it lent 140, and in 2021 it lent 190."
    br_pt_form: "Em 2019 a biblioteca emprestou 120 notebooks, em 2020 emprestou 140 e em 2021 emprestou 190."
    note: "this lists individual figures instead of naming the main trend first"
  - option: "The chart is about laptops and years and it shows several different numbers."
    br_pt_form: "O gráfico é sobre notebooks e anos e mostra vários números diferentes."
    note: "it restates the topic without stating a trend or a comparison"
  - option: "Laptops were borrowed by residents in 2019 and again much later in 2023."
    br_pt_form: "Notebooks foram emprestados por moradores em 2019 e bem depois em 2023."
    note: "the passive is vague and gives no magnitude or direction for the trend"
```

**Item:**
> You are writing about a fictional library loan chart. Which line is a proper data overview?

| Slot | Value |
|------|-------|
| A | "In 2019 the library lent 120 laptops, in 2020 it lent 140, and in 2021 it lent 190." |
| B | **"Overall, laptop loans rose steadily across the period, with the sharpest gain after 2021."** ✓ |
| C | "The chart is about laptops and years and it shows several different numbers." |
| D | "Laptops were borrowed by residents in 2019 and again much later in 2023." |

**Key:** B

**Feedback:**
> **A** lists raw figures before any overview; **C** restates the topic without a trend; **D** hides the direction in a vague passive. **`Overall, ... rose steadily ...`** names the trend first, and the details come later.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_ielts_writing_trend_detail_001
skill: `reading.data_overview`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "In 2019, the library lent 120 laptops."
    br_pt_form: "Em 2019, a biblioteca emprestou 120 notebooks."
    note: "this is a supporting detail, not the overview of the whole period"
  - option: "The library introduced a new loan policy in 2021."
    br_pt_form: "A biblioteca introduziu uma nova política de empréstimo em 2021."
    note: "the policy is context for the change, not the trend the overview reports"
  - option: "The library owned 300 laptops in 2023."
    br_pt_form: "A biblioteca possuía 300 notebooks em 2023."
    note: "the figure is a number of loans, not the size of the collection"
```

**Stimulus:**
> "Overall, loans rose across the five years, with the steepest increase after a 2021 policy change. In 2019, 120 laptops were lent; by 2023, that figure reached 300."

**Item:**
> Which sentence states the data overview?

| Slot | Value |
|------|-------|
| A | "In 2019, the library lent 120 laptops." |
| B | **"Loans rose across the five years, with the steepest increase after 2021."** ✓ |
| C | "The library introduced a new loan policy in 2021." |
| D | "The library owned 300 laptops in 2023." |

**Key:** B

**Feedback:**
> **A** is one detail, not the whole trend; **C** explains context rather than reporting the pattern; **D** mistakes a loan count for stock. The overview is **`Loans rose across the five years ...`** — direction and scope, before the numbers.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_ielts_writing_cohesion_term_001
skill: `vocab.academic_writing_criteria`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "task response"
    br_pt_form: "resposta à tarefa"
    note: "this criterion checks whether every part of the question was answered"
  - option: "lexical resource"
    br_pt_form: "recurso lexical"
    note: "this criterion concerns precise and accurate word choice"
  - option: "grammatical range"
    br_pt_form: "variedade gramatical"
    note: "this criterion concerns the variety and accuracy of sentence structures"
```

**Item:**
> Which criterion measures the visible linking of ideas through referencing and logical connectors?

| Slot | Value |
|------|-------|
| A | task response |
| B | lexical resource |
| C | **cohesion** ✓ |
| D | grammatical range |

**Key:** C

**Feedback:**
> **A** checks coverage of the question; **B** checks word choice; **D** checks sentence structures. **Cohesion** is the visible link — *this figure*, *by contrast*, *however* — between one sentence and the next.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_ielts_writing_conclusion_move_001
skill: `reading.argument_conclusion`
type: `inference`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "It introduces a new statistic about the following year."
    br_pt_form: "Introduz uma nova estatística sobre o ano seguinte."
    note: "a conclusion must not add fresh data to the argument"
  - option: "It repeats the introduction word for word."
    br_pt_form: "Repete a introdução palavra por palavra."
    note: "restating the thesis means new wording, not copying"
  - option: "It apologises for the small size of the sample."
    br_pt_form: "Pede desculpas pelo tamanho pequeno da amostra."
    note: "nothing in the paragraph signals an apology or a limitation"
```

**Stimulus:**
> "Overall, the figures support a gradual shift toward shared devices. This pattern, rather than any single annual spike, is the reason the loan programme should continue. In conclusion, that judgement stands without any new figure."

**Item:**
> What does the writer do in the final sentence?

| Slot | Value |
|------|-------|
| A | "It introduces a new statistic about the following year." |
| B | "It repeats the introduction word for word." |
| C | "It apologises for the small size of the sample." |
| D | **"It restates the judgement in different words and adds no new figure."** ✓ |

**Key:** D

**Feedback:**
> **A** would break the rule against new data; **B** confuses restating with copying; **C** invents an apology the paragraph never makes. **`In conclusion, that judgement stands ...`** returns to the claim with new wording.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_ielts_writing_criteria_sounds_001
skill: `pronunciation.academic_criteria_diphthongs`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** /ð/ in *the* is voiced, with the tongue between the teeth — not /d/ ("de"). /θ/ in *thesis* is the voiceless counterpart — not /t/ ("tesis"). /eɪ/ in *data* and *details* is a glide, not a flat /e/. /aɪ/ in *rise* is a full diphthong; Brazilian learners often add a final vowel. /əʊ/ in *overview* glides from /ə/ to /ʊ/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The thesis names a steady rise; the data overview comes before the details."

**Target phonemes:** /ð/ in *the* · /θ/ in *thesis* · /eɪ/ in *data, details* · /aɪ/ in *rise* · /əʊ/ in *overview*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_ielts_writing_formal_note_001
skill: `grammar.formal_email_register`
type: `error_correction`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b2_professional_email_advanced
distractors:
  - option: "Hi Prof, just checking the file attachment thing."
    br_pt_form: "Oi Prof, só conferindo a questão do arquivo anexo."
    note: "greeting and wording are too casual for correspondence with a professor"
  - option: "Hey, see attached, thanks."
    br_pt_form: "Oi, segue anexo, valeu."
    note: "chat-style register has no place in a formal academic note"
  - option: "To Prof Silva, summary is here."
    br_pt_form: "Para a Prof Silva, o resumo está aqui."
    note: "a fragment with no finite verb does not form a complete request"
```

**Item:**
> Reviewing advanced professional correspondence: which line keeps a formal register with a professor?

| Slot | Value |
|------|-------|
| A | "Hi Prof, just checking the file attachment thing." |
| B | **"Dear Professor Silva, I am attaching the requested summary for your review."** ✓ |
| C | "Hey, see attached, thanks." |
| D | "To Prof Silva, summary is here." |

**Key:** B

**Feedback:**
> **A** uses a chat greeting and a vague noun; **C** drops the greeting and the request entirely; **D** is a fragment with no finite verb. **`Dear Professor Silva, I am attaching ... for your review.`** keeps greeting, verb and purpose in the same register.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_ielts_writing_hedge_word_001
skill: `vocab.register_hedging`
type: `contextual_selection`
difficulty_b: 0.3
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_b2_register_nuance
distractors:
  - option: "proves"
    br_pt_form: "prova"
    note: "overstates the certainty a limited set of figures can support"
  - option: "definitely"
    br_pt_form: "definitivamente"
    note: "an adverb of certainty removes the warranted caution"
  - option: "obviously"
    br_pt_form: "obviamente"
    note: "it asserts self-evidence instead of calibrating the claim to the evidence"
```

**Item:**
> Reviewing register and nuance: which word keeps a claim appropriately cautious? "The figures ______ a gradual shift toward shared devices."

| Slot | Value |
|------|-------|
| A | proves |
| B | definitely |
| C | **suggests** ✓ |
| D | obviously |

**Key:** C

**Feedback:**
> **A** claims more certainty than the figures support; **B** and **D** are certainty adverbs that erase the hedge. **`The figures suggest ...`** calibrates the claim to the evidence without losing the stance.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `overview_before_details` | Item 1 or 2 missed | **L2** | Contrast *In 2019 it was 120...* with *Overall, loans rose...* in a five-line fictional chart report; separate the trend from its supporting figures. |
| `criterion_and_move_labels` | Items 3 and 4 missed | **L2** | Label *cohesion* against *task response / lexical resource / grammatical range*, then label a conclusion move against a copied introduction and a new statistic. |
| `register_and_hedge_review` | Items 5, 6 and 7 missed | **L2** | Recycle *suggests* vs *proves / definitely / obviously* and the formal note pattern *Dear Professor..., I am attaching...* in one follow-up thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Item 6 reviews `les_b2_professional_email_advanced` (`grammar.formal_email_register`) and item 7 reviews `les_b2_register_nuance` (`vocab.register_hedging`); both carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The criterion labels *task response*, *coherence*, *cohesion*, *lexical resource* and *grammatical range*, and the moves *thesis*, *data overview* and *conclusion*, are unprotectable academic concepts.
6. §4.3 registration checked: the prerequisite lesson ids are real and no module name or self-reference was used as a prerequisite.
7. The seven item ids carry the distinctive lesson token, are unique in this file and were checked against canonical `pack-les-*.md` packs only. The deprecated v1 pack was deleted by path and never consulted.
8. No official IELTS prompt, item, answer key, band descriptor wording or proprietary preparation material was reproduced. The chart, the loan figures and every sentence in this pack are original inventions for Brazilian software engineers.
