# Practice Pack — `les_b1_sales_marketing`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_sales_marketing_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_sales_marketing.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_sales_marketing_v1
lesson_id: les_b1_sales_marketing
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
item_id: grm_sales_marketing_present_001
skill: `grammar.sales_reporting_present`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The campaign convert twelve percent of its leads."
    br_pt_form: "A campanha converter doze por cento de seus leads."
    note: "a singular subject requires the s form of the present simple verb"
  - option: "The campaign is convert twelve percent of its leads."
    br_pt_form: "A campanha está converter doze por cento de seus leads."
    note: "be cannot sit directly before a bare verb in this fact statement"
  - option: "The campaign converted twelve percent of its leads."
    br_pt_form: "A campanha converteu doze por cento de seus leads."
    note: "the past tense closes a recurring campaign fact instead of reporting it"
```

**Item:**
> Which line reports a recurring campaign fact in natural en-US?

| Slot | Value |
|------|-------|
| A | "The campaign convert twelve percent of its leads." |
| B | **"The campaign converts twelve percent of its leads."** ✓ |
| C | "The campaign is convert twelve percent of its leads." |
| D | "The campaign converted twelve percent of its leads." |

**Key:** B

**Feedback:**
> **B** keeps agreement and the present simple: **`The campaign converts twelve percent of its leads.`** **A** drops the *-s*, **C** stacks *is* before a bare verb, and **D** shifts to the past, which closes the fact instead of describing a repeating one.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_sales_marketing_dashboard_001
skill: `reading.sales_dashboard_scan`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The 2.4% CTR."
    br_pt_form: "A taxa de cliques de 2,4%."
    note: "CTR counts clicks over impressions, not leads that became customers"
  - option: "The 3% churn rate."
    br_pt_form: "A taxa de churn de 3%."
    note: "churn measures customers who left, not the share who converted"
  - option: "The 97% retention rate."
    br_pt_form: "A taxa de retenção de 97%."
    note: "retention is the complement of churn in the same dashboard"
```

**Stimulus:**
> "Campaign dashboard — five hundred new leads; one hundred twenty qualified prospects; conversion rate twelve percent; CTR 2.4%; churn three percent; retention ninety-seven percent; pipeline $180,000; ROI 2.1x."

**Item:**
> Which figure is the share of leads that became customers?

| Slot | Value |
|------|-------|
| A | The 2.4% CTR. |
| B | **The 12% conversion rate.** ✓ |
| C | The 3% churn rate. |
| D | The 97% retention rate. |

**Key:** B

**Feedback:**
> The dashboard states **`conversion rate twelve percent`** — sixty of the five hundred leads became customers. **A** is clicks over impressions, **C** counts departures, and **D** is the share that stayed.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_sales_marketing_funnel_001
skill: `vocab.sales_funnel`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "customer"
    br_pt_form: "cliente que já comprou"
    note: "a customer has already bought; the person described has only shown interest"
  - option: "prospect"
    br_pt_form: "candidato qualificado"
    note: "a prospect has passed the qualification filter described in the lesson"
  - option: "deal"
    br_pt_form: "negócio fechado"
    note: "a deal is the transaction itself, not the person at the start of the funnel"
```

**Item:**
> Which word names a person who has shown interest but is not yet qualified?

| Slot | Value |
|------|-------|
| A | customer |
| B | **lead** ✓ |
| C | prospect |
| D | deal |

**Key:** B

**Feedback:**
> A **lead** is the raw interested person before qualification. **A** has already bought, **C** has passed the filter, and **D** names the transaction rather than the person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_sales_marketing_campaign_001
skill: `reading.sales_campaign_inference`
type: `inference`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "It was cancelled because ROI turned negative."
    br_pt_form: "Foi cancelada porque o ROI ficou negativo."
    note: "the note says ROI stayed positive and the campaign was not cancelled"
  - option: "The upsell sequence increased retention."
    br_pt_form: "A sequência de upsell aumentou a retenção."
    note: "the upsell sequence was paused; retention was below target"
  - option: "Churn fell after the new subject line."
    br_pt_form: "O churn caiu depois da nova linha de assunto."
    note: "churn rose to five percent; the subject line change is only planned"
```

**Stimulus:**
> "Beatriz: The cold email campaign doubled qualified prospects, but churn rose to five percent. I paused the upsell sequence; retention is the priority this week. ROI is still positive because acquisition cost fell, so we are not cancelling the campaign."

**Item:**
> What can you conclude about the campaign?

| Slot | Value |
|------|-------|
| A | It was cancelled because ROI turned negative. |
| B | The upsell sequence increased retention. |
| C | Churn fell after the new subject line. |
| D | **It brought more prospects but hurt retention.** ✓ |

**Key:** D

**Feedback:**
> The contrast **`doubled qualified prospects, but churn rose to five percent`** supports **D**. **A** reverses the ROI statement and the decision, **B** credits a sequence that was paused, and **C** invents a drop in churn after a change that has not happened yet.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_sales_marketing_roi_churn_001
skill: `pronunciation.sales_roi_ctr_churn`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *ROI* is one word, /ˈroʊi/, with the /oʊ/ diphthong closed before /i/ — not two Portuguese vowels. *CTR* is spelled out, /siː tiː ɑːr/, with short letter names. *Churn* starts /tʃ/ as in *chair*, not /ʃ/ or plain /t/, and carries the rhotic /ɜːr/. *Campaign* ends in /eɪ/, a closing diphthong, not a plain Portuguese /e/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The CTR is two point four percent, and ROI is positive; churn rose to three percent."

**Target phonemes:** /ˈroʊi/ in *ROI* as one word · /siː tiː ɑːr/ in *CTR*, with no extra vowel after the letter names · /tʃ/ and /ɜːr/ in *churn* · /eɪ/ in *campaign* · /iː/ in *lead*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_sales_marketing_responsible_001
skill: `grammar.acronym_prepositions`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_it_acronyms_deep`
distractors:
  - option: "The growth lead is responsible by the campaign's ROI."
    br_pt_form: "O líder de crescimento é responsável por meio do ROI da campanha."
    note: "by would name the means, not the thing someone is accountable for"
  - option: "The growth lead is responsible to the campaign's ROI."
    br_pt_form: "O líder de crescimento presta contas ao ROI da campanha."
    note: "to points at a person or authority, not at a metric"
  - option: "The growth lead is responsible with the campaign's ROI."
    br_pt_form: "O líder de crescimento é responsável junto com o ROI da campanha."
    note: "with makes the metric a companion instead of the object of accountability"
```

**Item:**
> Reviewing acronym prepositions: which line says who is accountable for the campaign's ROI?

| Slot | Value |
|------|-------|
| A | "The growth lead is responsible by the campaign's ROI." |
| B | **"The growth lead is responsible for the campaign's ROI."** ✓ |
| C | "The growth lead is responsible to the campaign's ROI." |
| D | "The growth lead is responsible with the campaign's ROI." |

**Key:** B

**Feedback:**
> **`Responsible for`** takes the thing you answer for: **`The growth lead is responsible for the campaign's ROI.`** **A** names a means with *by*, **C** aims *to* at a metric instead of a person, and **D** turns the metric into a companion with *with*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_sales_marketing_acronym_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_b1_it_acronyms_deep`
distractors:
  - option: "CTR"
    br_pt_form: "taxa de cliques"
    note: "CTR counts clicks against impressions, not gain against cost"
  - option: "KPI"
    br_pt_form: "indicador-chave de desempenho"
    note: "KPI is the generic name for a tracked metric, not a return ratio"
  - option: "OKR"
    br_pt_form: "objetivos e resultados-chave"
    note: "OKR is a planning framework, not the ratio of gain to spending"
```

**Item:**
> Reviewing corporate acronyms: which one names the gain divided by what the campaign cost?

| Slot | Value |
|------|-------|
| A | CTR |
| B | KPI |
| C | **ROI** ✓ |
| D | OKR |

**Key:** C

**Feedback:**
> **ROI** (*return on investment*) is the ratio of gain to cost — 2.1x in the campaign note. **A** is a click rate, **B** is the generic label for a tracked number, and **D** belongs to quarterly planning.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `sales_funnel_terms` | Item 3 missed | **L2** | Sort *lead → prospect → customer* with one sentence each: interest, qualification, purchase; add *deal* as the transaction. |
| `sales_dashboard_details` | Items 2 and 4 missed | **L2** | Scan a six-line campaign dashboard for conversion, CTR, churn and retention; separate a stated number from an inferred consequence. |
| `sales_metrics_register` | Items 1, 5, 6 and 7 missed | **L2** | Recycle *ROI / CTR / KPI / OKR* in present-simple report lines with *responsible for*, then rehearse /ˈroʊi/, /tʃ/ and /eɪ/ in the same phrases. |

---

## 4. VALIDATION NOTES

1. All `b` values are illustrative priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_it_acronyms_deep` (`grammar.acronym_prepositions` and `vocab.acronyms_corporate`), the registry lesson that deepens this lesson's prerequisite skill.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. The distinctive `sales_marketing` token appears in all seven `item_id` values, written without backticks; `skill` and `type` keep the backticks required by the pack contract.
6. Options, Portuguese glosses and distractor notes are authored in a clean room; no option or gloss within an item collapses to the same normalized string.
7. The reading stimuli reuse only the campaign figures introduced in the lesson's FASE 1 dialogue, so no restricted source text is reproduced or adapted.
