# Practice Pack — `les_b1_hr_career`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_hr_career_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_hr_career.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_hr_career_v1
lesson_id: les_b1_hr_career
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
item_id: grm_b1_hr_career_offers_001
skill: `grammar.present_simple_hr_facts`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The company offer good benefits and a clear promotion path."
    br_pt_form: "A empresa oferece bons benefícios e um caminho claro de promoção."
    note: "a singular subject cannot take a bare verb in the present simple"
  - option: "The company offering good benefits and a clear promotion path."
    br_pt_form: "A empresa oferecendo bons benefícios e um caminho claro de promoção."
    note: "a participle on its own cannot be the main verb of the sentence"
  - option: "The company offered good benefits and a clear promotion path."
    br_pt_form: "A empresa oferecia bons benefícios e um caminho claro de promoção."
    note: "the past tense reports an old policy, not the current offer"
```

**Item:**
> Which line states the company's current policy in natural en-US?

| Slot | Value |
|------|-------|
| A | "The company offer good benefits and a clear promotion path." |
| B | **"The company offers good benefits and a clear promotion path."** ✓ |
| C | "The company offering good benefits and a clear promotion path." |
| D | "The company offered good benefits and a clear promotion path." |

**Key:** B

**Feedback:**
> **B** is the present-simple statement of an ongoing policy: the singular subject *company* takes *offers*. **A** drops the required **-s**, **C** leaves the sentence without a finite verb, and **D** moves the policy into the past.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_b1_hr_career_probation_review_001
skill: `reading.hr_offer_email`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "On day one."
    br_pt_form: "No primeiro dia."
    note: "that is when benefits start, not when the appraisal happens"
  - option: "On 30 June."
    br_pt_form: "Em 30 de junho."
    note: "that is the end of the probation period, a date close to the review but not the review"
  - option: "Monthly."
    br_pt_form: "Mensalmente."
    note: "PTO is accrued monthly; the review is scheduled by week"
```

**Stimulus:**
> "Subject: Your first 90 days — next steps. Hi Alex, welcome aboard. Your probation period ends on 30 June. We schedule a performance review in week eight, when your manager shares the job description and the expectations for your role. Benefits start on day one, and PTO is accrued monthly. Please confirm your preferred review time."

**Item:**
> When is the performance review scheduled?

| Slot | Value |
|------|-------|
| A | "On day one." |
| B | **"In week eight."** ✓ |
| C | "On 30 June." |
| D | "Monthly." |

**Key:** B

**Feedback:**
> The note says **we schedule a performance review in week eight**. **A** is the benefits start date, **C** is the end of probation, and **D** is the PTO accrual rhythm — three different timelines in the same short email.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_b1_hr_career_resignation_001
skill: `vocab.hr_exit`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "severance."
    br_pt_form: "rescisão / pacote de pagamento na saída."
    note: "severance is money paid at departure, not the act of leaving"
  - option: "layoff."
    br_pt_form: "demissão coletiva por corte de pessoal."
    note: "a layoff is involuntary and driven by the company, not by the employee"
  - option: "headcount."
    br_pt_form: "número de vagas autorizadas."
    note: "headcount counts positions, not a person's departure"
```

**Item:**
> Ana decided to leave the company on her own and submitted a letter. Which word names her departure? "She submitted her ___ with two weeks' notice."

| Slot | Value |
|------|-------|
| A | "severance." |
| B | "layoff." |
| C | **"resignation."** ✓ |
| D | "headcount." |

**Key:** C

**Feedback:**
> **Resignation** is the voluntary departure the employee submits. **A** is the payment that may follow, **B** is a company-driven layoff, and **D** is a budget number for positions.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_b1_hr_career_headcount_001
skill: `reading.hr_people_note`
type: `inference_from_context`
difficulty_b: 0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The exit interview."
    br_pt_form: "A entrevista de saída."
    note: "Marina will run it next week; it is an event, not a resource that moves"
  - option: "The severance package."
    br_pt_form: "O pacote de rescisão."
    note: "the package follows the standard policy and stays with the departing employee"
  - option: "The backend requisition."
    br_pt_form: "A requisição de vaga de backend."
    note: "the requisition is being closed, so it cannot move to another team"
```

**Stimulus:**
> "People note — Priya: We are closing the backend requisition. The job description is updated with the new qualifications. Marina will run the exit interview with Ana next week; Ana submitted her resignation on Monday with two weeks' notice. Her severance package follows the standard policy. The headcount moves to the platform team."

**Item:**
> What moves to the platform team according to the note?

| Slot | Value |
|------|-------|
| A | "The exit interview." |
| B | "The severance package." |
| C | "The backend requisition." |
| D | **"The headcount."** ✓ |

**Key:** D

**Feedback:**
> The last line is explicit: **the headcount moves to the platform team**. **A** is a meeting Marina runs, **B** belongs to Ana's departure, and **C** is being closed rather than transferred.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_b1_hr_career_resume_position_001
skill: `pronunciation.hr_resume_position_review`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_b1_hr_career_resume_position_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *résumé* is /ˈrezəmeɪ/ — /z/ in the middle and /meɪ/ at the end; the verb *resume* is /rɪˈzuːm/, a different word. *Position* carries /ʃ/ before the final /ən/, where Brazilian Portuguese tends to produce /si/. *Review* and *severance* use /v/, not /w/. A final /k/ in *week* has no extra vowel after it.

**Step 2 — produce (ASR-scored):** read aloud:

> "My résumé lists five years of experience; I applied for the position and my manager will review it this week."

**Target phonemes:** /z/ and /eɪ/ in *résumé* · /ʃ/ in *position* · /v/ in *review* · /k/ final in *week*, with no epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_b1_hr_career_hr_article_001
skill: `grammar.acronym_article_choice`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_corpus_intro
distractors:
  - option: "I spoke to a HR business partner about the job description."
    br_pt_form: "Eu falei com uma parceira de RH sobre a descrição do cargo."
    note: "HR begins with the vowel sound /eɪ/, so it takes 'an', not 'a'"
  - option: "I spoke to an HR business partners about the job description."
    br_pt_form: "Eu falei com umas parceiras de RH sobre a descrição do cargo."
    note: "the article is singular but the noun is plural"
  - option: "I spoke to HR business partner about the job description."
    br_pt_form: "Eu falei com parceira de RH sobre a descrição do cargo."
    note: "a countable singular role needs a determiner in this sentence"
```

**Item:**
> Reviewing corporate acronyms: which line uses the correct article? "I spoke to ___ about the job description."

| Slot | Value |
|------|-------|
| A | "I spoke to a HR business partner about the job description." |
| B | **"I spoke to an HR business partner about the job description."** ✓ |
| C | "I spoke to an HR business partners about the job description." |
| D | "I spoke to HR business partner about the job description." |

**Key:** B

**Feedback:**
> The sound decides the article: **an HR business partner** because *HR* starts with /eɪtʃ/. **A** uses *a* before a vowel sound, **C** mixes a singular article with a plural noun, and **D** drops the determiner before a countable role.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_b1_hr_career_pto_001
skill: `vocab.acronyms_corporate`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_corpus_intro
distractors:
  - option: "Probation time off."
    br_pt_form: "Folga durante o período de experiência."
    note: "the P does not stand for probation; that is a different HR stage"
  - option: "Pay transfer option."
    br_pt_form: "Opção de transferência de pagamento."
    note: "an invented expansion that sounds plausible in an offer letter"
  - option: "Professional training office."
    br_pt_form: "Escritório de treinamento profissional."
    note: "a plausible corporate-sounding expansion, but not the US benefits term"
```

**Item:**
> Reviewing corporate acronyms: a US offer letter says "Benefits include PTO." What does PTO mean?

| Slot | Value |
|------|-------|
| A | "Probation time off." |
| B | "Pay transfer option." |
| C | **"Paid time off."** ✓ |
| D | "Professional training office." |

**Key:** C

**Feedback:**
> **PTO** is *paid time off*, the US term for paid leave. **A** borrows the word *probation* from the wrong HR stage, **B** invents a payment phrase, and **D** sounds corporate but has nothing to do with leave.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `hr_career_exit_contrast` | Items 3 and 4 missed | **L2** | Sort *resignation / layoff / severance / notice period* in one exit scenario before the next people note. |
| `hr_career_review_timeline` | Items 1 and 2 missed | **L2** | Rebuild the three timelines — benefits on day one, review in week eight, probation ending 30 June — with the present-simple policy line. |
| `hr_career_acronym_register` | Items 5, 6 and 7 missed | **L2** | Rehearse *HR*, *PTO*, *résumé* and *position* aloud, then write one offer-email paragraph with the right article and glosses. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; its Gates stay rendered (TTS static).
3. Items 6 and 7 review `les_a2_corpus_intro`, which introduces `acronyms_corporate`, and carry `prereq_lesson` for the interleaving rule. The skill is reinforced by `les_b1_it_acronyms_deep` in the lesson's prerequisite list.
4. Items 1–5 target authored lesson content; no restricted source text is reproduced or adapted.
5. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
6. Every `item_id` carries the distinctive `b1_hr_career` token required by the Lote 6 canonical convention, is written without backticks, and contains the `hr_career` segment; `skill` and `type` keep the backticks required by the pack contract.
7. No two options or `br_pt_form` values within an item collapse to the same normalized string, including case.
8. The grammar-rag topic query returned material on *qualifications* and *despite / in spite of*; only the *qualifications* collocation was used (Exercise 3, Item 4 stimulus), and the contrastive connector material was left out as out of scope.
