# Practice Pack — `les_b2_exam_vocab`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_exam_vocab_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_exam_vocab.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_exam_vocab_v1
lesson_id: les_b2_exam_vocab
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
item_id: grm_exam_vocab_article_expansion_001
skill: `grammar.acronym_articles`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "We need a SLA before the launch."
    br_pt_form: "Precisamos de um SLA antes do lançamento."
    note: "'SLA' begins with the spoken sound /es/, so the article must be 'an'"
  - option: "We need SLA before the launch."
    br_pt_form: "Precisamos de SLA antes do lançamento."
    note: "a singular countable acronym needs an article in this sentence"
  - option: "We need an SLAs before the launch."
    br_pt_form: "Precisamos de uns SLAs antes do lançamento."
    note: "'an' cannot combine with the plural form 'SLAs'"
```

**Item:**
> You are writing a recap for a release. Which line uses the correct article before the acronym?

| Slot | Value |
|------|-------|
| A | "We need a SLA before the launch." |
| B | **"We need an SLA before the launch."** ✓ |
| C | "We need SLA before the launch." |
| D | "We need an SLAs before the launch." |

**Key:** B

**Feedback:**
> The article follows the **sound**, not the first letter: `SLA` is spoken /es el eɪ/, so the form is **`We need an SLA before the launch.`** **A** uses *a* before a vowel sound, **C** drops the article before a singular countable acronym, and **D** pairs *an* with a plural noun.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_exam_vocab_sla_detail_001
skill: `reading.acronym_in_context`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "A one-hour reply time."
    br_pt_form: "Um tempo de resposta de uma hora."
    note: "that is the SLA, not the objective for the quarter"
  - option: "Watching cycle time as a metric."
    br_pt_form: "Acompanhar o tempo de ciclo como métrica."
    note: "cycle time is the KPI mentioned in the recap"
  - option: "Sending the numbers by 17:00 BRT."
    br_pt_form: "Enviar os números até 17:00 BRT."
    note: "the EOD deadline is a time, not the OKR"
```

**Stimulus:**
> "The recap is short. Our SLA promises a reply within one hour. The KPI we watch is cycle time. The OKR for the quarter is to cut onboarding from five days to three. Please CC Ana; she is on PTO until Monday. Send the final numbers by EOD (17:00 BRT)."

**Item:**
> What is the OKR for the quarter?

| Slot | Value |
|------|-------|
| A | A one-hour reply time. |
| B | **Cutting onboarding from five days to three.** ✓ |
| C | Watching cycle time as a metric. |
| D | Sending the numbers by 17:00 BRT. |

**Key:** B

**Feedback:**
> The recap pairs the goal with a measurable result — **`The OKR for the quarter is to cut onboarding from five days to three.`** **A** restates the SLA, **C** restates the KPI, and **D** restates the EOD deadline.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_exam_vocab_mvp_fit_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "The most valuable player on the team."
    br_pt_form: "O jogador mais valioso do time."
    note: "that is the sports sense of MVP, not the product sense"
  - option: "A weekly metric on the dashboard."
    br_pt_form: "Uma métrica semanal no painel."
    note: "a tracked measure is a KPI"
  - option: "A paid leave from work."
    br_pt_form: "Uma folga remunerada do trabalho."
    note: "paid leave is PTO, not MVP"
```

**Item:**
> A teammate says, "We shipped the MVP in six weeks." Which meaning fits this context?

| Slot | Value |
|------|-------|
| A | **The smallest version that still delivers value.** ✓ |
| B | The most valuable player on the team. |
| C | A weekly metric on the dashboard. |
| D | A paid leave from work. |

**Key:** A

**Feedback:**
> In a product recap, `MVP` is *minimum viable product* — **`the smallest version that still delivers value.`** **B** is the sports reading, **C** describes a *KPI*, and **D** describes *PTO*. Context resolves the polysemy.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_exam_vocab_glossary_scan_001
skill: `reading.exam_glossary_scan`
type: `detail_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "ROI — promised response time."
    br_pt_form: "ROI — tempo de resposta prometido."
    note: "the promised response time is the SLA"
  - option: "KPI — benefit compared with cost."
    br_pt_form: "KPI — benefício comparado ao custo."
    note: "benefit versus cost defines ROI"
  - option: "CC — a metric tracked weekly."
    br_pt_form: "CC — uma métrica acompanhada semanalmente."
    note: "a weekly tracked measure is a KPI; CC sends a copy"
```

**Stimulus:**
> "Glossary note: ROI compares benefit with cost. KPI is the metric the team tracks each week. SLA states the promised response time. OKR pairs a goal with measurable results. CC sends a copy to someone who does not need to act."

**Item:**
> Which pair matches the acronym to its definition in the note?

| Slot | Value |
|------|-------|
| A | ROI — promised response time. |
| B | KPI — benefit compared with cost. |
| C | **OKR — a goal with measurable results.** ✓ |
| D | CC — a metric tracked weekly. |

**Key:** C

**Feedback:**
> The note says **`OKR pairs a goal with measurable results.`** **A** swaps in the SLA definition, **B** swaps in the ROI definition, and **D** swaps in the KPI definition while ignoring what *CC* does.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_exam_vocab_acronym_speech_001
skill: `pronunciation.acronym_letter_by_letter`
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

**Step 1 — hear the contrast:** *ROI* is read letter by letter, /ɑːr oʊ aɪ/ — never *roy* as one word. *ASAP* can be /eɪ es eɪ piː/ when spelled out or /eɪsæp/ as a word; in an exam, spell the letters to avoid ambiguity. In *WIP*, the first sound is /w/ with rounded lips, not /v/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The ROI report is due by EOD — flag the risk ASAP."

**Target phonemes:** /oʊ/ in the middle letter of *ROI* · /iː/ in *EOD* · /eɪ/ in the first letter of *ASAP* · final /s/ in *ASAP* without an added /i/ · /w/ in *WIP*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_exam_vocab_word_family_prereq_001
skill: `grammar.word_family_forms`
type: `error_correction`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_a2_corpus_intro`
distractors:
  - option: "The decide was made by EOD."
    br_pt_form: "A decide foi feita até o fim do dia."
    note: "'decide' is a verb; the noun form is needed after 'the'"
  - option: "The decisive was made by EOD."
    br_pt_form: "A decisive foi feita até o fim do dia."
    note: "'decisive' is an adjective, not the noun for the decision"
  - option: "The decidedly was made by EOD."
    br_pt_form: "A decidedly foi feita até o fim do dia."
    note: "'decidedly' is an adverb and cannot follow the article"
```

**Item:**
> Reviewing word families: which line uses the correct form after the article?

| Slot | Value |
|------|-------|
| A | "The decide was made by EOD." |
| B | **"The decision was made by EOD."** ✓ |
| C | "The decisive was made by EOD." |
| D | "The decidedly was made by EOD." |

**Key:** B

**Feedback:**
> The article needs a noun: **`The decision was made by EOD.`** **A** uses the base verb, **C** uses the adjective, and **D** uses the adverb — none of them can occupy the noun slot.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_exam_vocab_pto_prereq_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_b1_it_acronyms_deep`
distractors:
  - option: "PTO — product testing office."
    br_pt_form: "PTO — escritório de testes de produto."
    note: "there is no such expansion in the acronym glossary"
  - option: "PTO — project task overview."
    br_pt_form: "PTO — visão geral de tarefas do projeto."
    note: "a plausible invention, but not the expansion taught in the lesson"
  - option: "PTO — public training opportunity."
    br_pt_form: "PTO — oportunidade pública de treinamento."
    note: "training opportunities are not the paid-leave meaning of PTO"
```

**Item:**
> Reviewing acronyms: which pair matches the acronym to its expansion?

| Slot | Value |
|------|-------|
| A | **PTO — paid time off.** ✓ |
| B | PTO — product testing office. |
| C | PTO — project task overview. |
| D | PTO — public training opportunity. |

**Key:** A

**Feedback:**
> **`PTO` expands to *paid time off*,** the term for paid leave. **B**, **C** and **D** are plausible-sounding inventions, but none is the expansion used in an en-US workplace or in the glossary.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `acronym_article_review` | Item 1 missed | **L2** | Contrast *a/an* with the initial **sound** of SLA (/es/), EOD (/iː/) and ROI (/ɑːr/), using the same short release recap. |
| `acronym_meaning_scan` | Items 2 and 4 missed | **L2** | Re-scan a five-line recap and map each acronym to its job — SLA (promise), KPI (measure), OKR (goal), CC (copy), EOD (time). |
| `exam_vocab_polysemy` | Items 3, 6 and 7 missed | **L2** | Recycle the MVP two-sense contrast, the *decide/decision/decisive* family and the PTO expansion in one follow-up card set. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_corpus_intro` and `les_b1_it_acronyms_deep` respectively and carry `prereq_lesson` for the interleaving rule; no item points back to `les_b2_exam_vocab`.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss, note and distractor was authored in a clean room for this pack. The ten acronyms are unprotected abbreviations; no vocabulary list, ordering or spelling was copied, reordered or respelled from any restricted source.
