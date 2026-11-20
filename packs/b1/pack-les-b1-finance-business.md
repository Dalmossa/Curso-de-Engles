# Practice Pack — `les_b1_finance_business`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_finance_business_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_finance_business.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_finance_business_v1
lesson_id: les_b1_finance_business
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
item_id: grm_finance_business_possessive_001
skill: `grammar.organisation_possessive`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The company margin fell two points."
    br_pt_form: "A margem da empresa caiu dois pontos."
    note: "juxtaposing two nouns does not mark possession in a financial report"
  - option: "The margin of company fell two points."
    br_pt_form: "A margem da empresa caiu dois pontos."
    note: "the of construction still needs a determiner before the organisation"
  - option: "The companies' margin fell two points."
    br_pt_form: "A margem das empresas caiu dois pontos."
    note: "an apostrophe after the s makes it plural, but one company is meant"
```

**Item:**
> Which line names the margin of one company in natural en-US?

| Slot | Value |
|------|-------|
| A | "The company margin fell two points." |
| B | **"The company's margin fell two points."** ✓ |
| C | "The margin of company fell two points." |
| D | "The companies' margin fell two points." |

**Key:** B

**Feedback:**
> **B** is the natural form: **`The company's margin fell two points.`** **A** drops the possessive marker, **C** omits the determiner in an *of* phrase, and **D** turns one company into several. Note that **`the margin of the company`** is also grammatical for organisations — the defect in **C** is the missing *the*, not the use of *of*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_finance_business_forecast_001
skill: `reading.finance_forecast_scan`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "From nine to ten months."
    br_pt_form: "De nove para dez meses."
    note: "an eight percent OPEX cut buys three months, not one"
  - option: "It would stay at nine months."
    br_pt_form: "Continuaria em nove meses."
    note: "the note explicitly says the cut extends the runway"
  - option: "From twelve to eighteen months."
    br_pt_form: "De doze para dezoito meses."
    note: "twelve is the result of the cut, not the starting point"
```

**Stimulus:**
> "Q3 forecast: revenue $1.2m, up twelve percent. Cloud OPEX $480k, up eighteen percent. CAPEX $50k, flat. Gross margin 41%, down two points. At the current burn rate, runway is nine months. A plan to cut OPEX by eight percent would extend runway to twelve months. Invoice volume: 214, of which 19 are overdue."

**Item:**
> What happens to runway if the OPEX cut is approved?

| Slot | Value |
|------|-------|
| A | From nine to ten months. |
| B | It would stay at nine months. |
| C | **From nine to twelve months.** ✓ |
| D | From twelve to eighteen months. |

**Key:** C

**Feedback:**
> The forecast says **`runway is nine months`** and the cut **`would extend runway to twelve months`**. **A** understates the gain, **B** ignores the stated effect of the cut, and **D** reverses the order: twelve is the destination, not the baseline. The *of which 19 are overdue* clause describes invoices, not cash runway.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_finance_business_acronyms_001
skill: `vocab.finance_acronyms`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "CAPEX"
    br_pt_form: "despesas de capital"
    note: "capital expenditure buys long-term assets, not daily running costs"
  - option: "EBITDA"
    br_pt_form: "lucro antes de juros, impostos, depreciação e amortização"
    note: "EBITDA is a profit measure, not a cost category"
  - option: "ARR"
    br_pt_form: "receita recorrente anual"
    note: "annual recurring revenue is income, not spending"
```

**Item:**
> Which acronym means the money a company spends on day-to-day running costs?

| Slot | Value |
|------|-------|
| A | CAPEX |
| B | **OPEX** ✓ |
| C | EBITDA |
| D | ARR |

**Key:** B

**Feedback:**
> **OPEX** (*operating expenditure*) is the recurring cost of running the business, such as cloud hosting. **A** (*CAPEX*) buys long-term assets, **C** (*EBITDA*) measures profit before interest and charges, and **D** (*ARR*) is recurring revenue — income rather than cost.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_finance_business_cut_001
skill: `reading.finance_forecast_inference`
type: `inference`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The company bought new hardware this month."
    br_pt_form: "A empresa comprou hardware novo neste mês."
    note: "the purchase moved to next quarter, so it did not happen this month"
  - option: "Revenue fell, so the margin fell."
    br_pt_form: "A receita caiu, então a margem caiu."
    note: "the note says revenue grew while margin did not"
  - option: "The board deck is already published."
    br_pt_form: "O material do conselho já foi publicado."
    note: "the deck goes out only after the ROI is confirmed"
```

**Stimulus:**
> "Marina: The P&L is attached. Revenue grew, but margin did not — cloud OPEX outpaced sales. I moved the CAPEX purchase to next quarter, so cash out this month is lower. Please confirm the ROI of the cache work before the board deck goes out."

**Item:**
> What can you conclude about cash this month?

| Slot | Value |
|------|-------|
| A | The company bought new hardware this month. |
| B | Revenue fell, so the margin fell. |
| C | The board deck is already published. |
| D | **Cash out is lower because a CAPEX purchase moved.** ✓ |

**Key:** D

**Feedback:**
> The line **`I moved the CAPEX purchase to next quarter, so cash out this month is lower`** supports **D**. **A** asserts the purchase happened, **B** inverts the revenue trend stated in the note, and **C** misreads a condition (*before the board deck goes out*) as a finished event.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_finance_business_margin_001
skill: `pronunciation.finance_acronyms_and_margin`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_finance_business_margin_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *margin* carries /dʒ/, /ˈmɑːrdʒɪn/, the same sound as in *jump* — not /ʒ/ and not a hard /g/. *ROI* is one unit, /ˈroʊi/, with the /oʊ/ diphthong closed before the final /i/. *CAPEX* starts with /æ/, /ˈkæpeks/, and ends in a released /ks/ with no extra vowel. Brazilian learners tend to add a final "e" (*CAPEX-e*) and to flatten /oʊ/ into a plain Portuguese /o/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The margin is forty-one percent; read the P&L and send the ROI."

**Target phonemes:** /dʒ/ in *margin* · /æ/ in *CAPEX* · /oʊ/ in *ROI* · /iː/ in *revenue* · released /ks/ final in *CAPEX*, without epenthetic /i/ · /ænd/ for the ampersand in *P and L*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_finance_business_tenses_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.5
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_tenses_review`
distractors:
  - option: "The company report revenue every quarter."
    br_pt_form: "A empresa reporta receita a cada trimestre."
    note: "a singular subject takes the s form of the present simple verb"
  - option: "The company is report revenue every quarter."
    br_pt_form: "A empresa está reportar receita a cada trimestre."
    note: "be cannot be followed by a bare verb in this construction"
  - option: "The company reported revenue every quarter."
    br_pt_form: "A empresa reportou receita a cada trimestre."
    note: "the past tense reports a finished event, not a recurring finance fact"
```

**Item:**
> Reviewing tenses: which line states a recurring finance fact correctly?

| Slot | Value |
|------|-------|
| A | **"The company reports revenue every quarter."** ✓ |
| B | "The company report revenue every quarter." |
| C | "The company is report revenue every quarter." |
| D | "The company reported revenue every quarter." |

**Key:** A

**Feedback:**
> **`The company reports revenue every quarter.`** keeps subject–verb agreement in the present simple. **B** drops the *-s*, **C** stacks *is* before a bare verb, and **D** shifts to the past, which closes the fact instead of describing a repeating one.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_finance_business_acronym_prereq_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_b1_it_acronyms_deep`
distractors:
  - option: "ROI"
    br_pt_form: "retorno sobre investimento"
    note: "ROI is a return ratio, not the metric tracked each sprint"
  - option: "EBITDA"
    br_pt_form: "lucro antes de juros, impostos, depreciação e amortização"
    note: "EBITDA is a profit measure from the income statement"
  - option: "CAPEX"
    br_pt_form: "despesas de capital"
    note: "CAPEX names long-term spending, not a tracked performance number"
```

**Item:**
> Reviewing corporate acronyms: which one names the number a team tracks to judge performance?

| Slot | Value |
|------|-------|
| A | ROI |
| B | EBITDA |
| C | **KPI** ✓ |
| D | CAPEX |

**Key:** C

**Feedback:**
> **KPI** (*key performance indicator*) is the metric the team watches — for example cycle time. **A** (*ROI*) measures return against cost, **B** (*EBITDA*) is an earnings figure, and **D** (*CAPEX*) is capital spending; none of them is the generic name for a tracked indicator.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `finance_possessive_review` | Item 1 missed | **L2** | Contrast *the company's margin* / *the margin of the company* / *the company margin* in short forecast lines; keep the determiner in the *of* form. |
| `finance_forecast_details` | Items 2 and 4 missed | **L2** | Scan a five-line forecast for revenue, OPEX, CAPEX, margin and runway; separate a stated number from an inferred consequence. |
| `finance_acronyms_and_tense` | Items 3, 5, 6 and 7 missed | **L2** | Recycle *CAPEX / OPEX / ROI / EBITDA / KPI / P&L* in present-simple status sentences, then rehearse /dʒ/, /æ/ and /oʊ/ in the same phrases. |

---

## 4. VALIDATION NOTES

1. All `b` values are illustrative priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_tenses_review` (present simple) and `les_b1_it_acronyms_deep` (`acronyms_corporate`), the two lessons in the registry that supply this lesson's prerequisite skills.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, Portuguese gloss and distractor note is authored in a clean room. The finance terms and acronyms are unprotected business vocabulary; the glossary and all examples were written originally for Brazilian software engineers.
6. The reading stimuli reuse only the forecast numbers introduced in the lesson's FASE 1 dialogue, so no restricted source text is reproduced.
