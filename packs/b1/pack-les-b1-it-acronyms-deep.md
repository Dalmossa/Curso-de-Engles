# Practice Pack — `les_b1_it_acronyms_deep`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_acronyms_deep_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_acronyms_deep.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_acronyms_deep_v1
lesson_id: les_b1_it_acronyms_deep
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
item_id: grm_acronyms_deep_definition_clause_001
skill: `grammar.acronym_definition_clauses`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "An ADR is a record what explains a choice the team made."
    br_pt_form: "Um ADR é um registro que explica uma escolha que o time fez."
    note: "uses 'what' after a noun; English needs a relative pronoun tied to the antecedent"
  - option: "An ADR is a record explains a choice the team made."
    br_pt_form: "Um ADR é um registro explica uma escolha que o time fez."
    note: "drops the relative pronoun entirely, a calque of the Portuguese 'que' being omitted"
  - option: "An ADR is a record who explains a choice the team made."
    br_pt_form: "Um ADR é um registro quem explica uma escolha que o time fez."
    note: "uses the personal pronoun 'who' for an inanimate record"
```

**Item:**
> You are writing the first glossary line for an ADR. Choose the natural definition.

| Slot | Value |
|------|-------|
| A | "An ADR is a record what explains a choice the team made." |
| B | **"An ADR is a record which explains a choice the team made."** ✓ |
| C | "An ADR is a record explains a choice the team made." |
| D | "An ADR is a record who explains a choice the team made." |

**Key:** B

**Feedback:**
> *Which* attaches the defining clause to **a record**. **A** uses *what* after a noun, **C** omits the link between subject and clause, and **D** treats a document as a person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_acronyms_deep_glossary_scan_001
skill: `reading.acronyms_deep_glossary_scan`
type: `detail_identification`
difficulty_b: -0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "99.9% over 30 days."
    br_pt_form: "99,9% em 30 dias."
    note: "that figure is the SLO target, not the measured SLI; the two acronyms differ by one letter"
  - option: "Four hours."
    br_pt_form: "Quatro horas."
    note: "the recovery window belongs to the SLA, the external promise in the same note"
  - option: "45 minutes."
    br_pt_form: "45 minutos."
    note: "the last incident MTTR is a duration, and a salient incident number draws the eye away from the percentage"
```

**Stimulus:**
> "Weekly health note — Luiza: Our SLI is 99.6% successful requests this week. The SLO is 99.9% over 30 days, and the SLA gives the client four hours of recovery time. Last incident MTTR was 45 minutes. The ADR for the retry change is in the repo."

**Item:**
> Which figure belongs to the SLI?

| Slot | Value |
|------|-------|
| A | "99.9% over 30 days." |
| B | "Four hours." |
| C | **"99.6% this week."** ✓ |
| D | "45 minutes." |

**Key:** C

**Feedback:**
> The note says **Our SLI is 99.6% successful requests this week**. **A** is the SLO, **B** is the SLA window, and **D** is the MTTR from the last incident.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_acronyms_deep_sli_001
skill: `vocab.acronyms_deep_reliability`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "SLO."
    br_pt_form: "O objetivo de nível de serviço."
    note: "the internal target for the signal, easily swapped for the signal itself"
  - option: "SLA."
    br_pt_form: "O acordo de nível de serviço."
    note: "the agreement made with the client, not a charted measurement"
  - option: "RCA."
    br_pt_form: "A análise de causa raiz."
    note: "an investigation document from the incident, not a live reliability metric"
```

**Item:**
> In a reliability review, which acronym names the measured signal you chart every minute?

| Slot | Value |
|------|-------|
| A | "SLO." |
| B | "SLA." |
| C | "RCA." |
| D | **"SLI."** ✓ |

**Key:** D

**Feedback:**
> **SLI** is the indicator you actually measure. **A** is the target set on it, **B** is the external agreement, and **C** is the post-incident analysis.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_acronyms_deep_status_inference_001
skill: `reading.acronyms_deep_status_inference`
type: `inference_from_context`
difficulty_b: 0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The ADR."
    br_pt_form: "O ADR."
    note: "the note says the ADR was filed yesterday, so it is already done"
  - option: "The incident."
    br_pt_form: "O incidente."
    note: "the incident is explicitly closed, and readers often keep the most dramatic event open in memory"
  - option: "The RACI."
    br_pt_form: "O RACI."
    note: "the RACI exists and assigns roles; the note never presents it as pending work"
```

**Stimulus:**
> "Channel note — Diego: We closed the incident, but the RCA is still open. Priya filed the ADR yesterday, and the SLO report goes to the client on Friday. Luiza is accountable in the RACI; I am only consulted."

**Item:**
> According to the note, what is still unfinished?

| Slot | Value |
|------|-------|
| A | "The ADR." |
| B | **"The RCA."** ✓ |
| C | "The incident." |
| D | "The RACI." |

**Key:** B

**Feedback:**
> The contrast is explicit: **We closed the incident, but the RCA is still open**. **A** was filed, **C** was closed, and **D** is a role map that already exists.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_acronyms_deep_letter_vs_word_001
skill: `pronunciation.acronyms_deep_letter_vs_word`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_acronyms_deep_letter_vs_word_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *SLI*, *RCA*, *ADR* and *MFA* are spelled out letter by letter, with short names such as /tiː/ and /diː/ instead of the Portuguese "tê" and "dê". *SaaS* and *ROI* are single words, /sæs/ and /ˈroʊi/. Brazilian Portuguese tends to attach a vowel after a final consonant, which turns /tiː/ into two syllables.

**Step 2 — produce (ASR-scored):** read aloud:

> "The SLI missed the SLO, so we ran an RCA and filed an ADR; SaaS is back and ROI is positive."

**Target phonemes:** /es/ · /tiː/ · /ɑːr/ in the spelled names · /diː/ in *ADR* · /sæs/ in *SaaS* as one word · /ˈroʊi/ in *ROI* as one word · no extra vowel after the consonant letter names.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_acronyms_deep_compound_agreement_001
skill: `grammar.compound_head_agreement`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The SLA targets is met."
    br_pt_form: "As metas do SLA é atendida."
    note: "uses a singular verb with the plural head 'targets'; Portuguese has no visible number agreement here"
  - option: "The SLA target are met."
    br_pt_form: "A meta do SLA são atendidas."
    note: "makes the singular head 'target' agree with a plural verb"
  - option: "The SLAs target are met."
    br_pt_form: "Os SLA meta são atendidas."
    note: "pluralizes the acronym instead of the head noun of the compound"
```

**Item:**
> Reviewing noun-compound agreement, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The SLA targets is met." |
| B | **"The SLA targets are met."** ✓ |
| C | "The SLA target are met." |
| D | "The SLAs target are met." |

**Key:** B

**Feedback:**
> The head noun **targets** controls the verb, so **are** is required. **A** uses a singular verb, **C** pairs a singular head with a plural verb, and **D** puts the plural on the acronym instead of on the head.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_acronyms_deep_expansion_register_001
skill: `vocab.acronym_expansion_register`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "Use only MFA; a mixed audience knows every IT acronym."
    br_pt_form: "Use só MFA; um público misto conhece toda sigla de TI."
    note: "assumes shared knowledge that a mixed audience cannot be assumed to have"
  - option: "Spell out 'multi factor authentication' on every mention and drop the acronym."
    br_pt_form: "Escreva 'multi factor authentication' em cada menção e deixe a sigla de fora."
    note: "expands every time and loses the established short form; also misses the hyphen in the long form"
  - option: "Add '(SaaS)' after MFA to explain the category."
    br_pt_form: "Acrescente '(SaaS)' depois de MFA para explicar a categoria."
    note: "pairs the wrong acronym with the term; SaaS is a delivery model, not a security control"
```

**Item:**
> Reviewing acronym register: you write the first mention of MFA for a mixed audience. What is the natural move?

| Slot | Value |
|------|-------|
| A | "Use only MFA; a mixed audience knows every IT acronym." |
| B | **"Write 'multi-factor authentication (MFA)' once, then use MFA."** ✓ |
| C | "Spell out 'multi factor authentication' on every mention and drop the acronym." |
| D | "Add '(SaaS)' after MFA to explain the category." |

**Key:** B

**Feedback:**
> One full expansion with the acronym in parentheses, then the short form: **multi-factor authentication (MFA)**. **A** assumes the audience already knows it, **C** repeats the long form forever and drops the useful short form, and **D** attaches an unrelated delivery-model term.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `acronyms_deep_slo_sli_sla_contrast` | Items 2 and 3 missed | **L2** | Rebuild the three-way contrast with one charted signal, one internal target and one external promise before the next status note. |
| `acronyms_deep_letter_vs_word` | Item 5 missed | **L2** | Sort the set into spelled names (*SLI, ADR, MFA*) and word-like ones (*SaaS, ROI, RACI*) before rehearsing the briefing aloud. |
| `acronyms_deep_register_and_agreement` | Items 1, 6 and 7 missed | **L2** | Revisit defining relative clauses, plural heads in noun compounds and the expand-once-then-shorten move in a single rewrite task. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; its Gates stay rendered (TTS static).
3. Items 6 and 7 review `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items 1–5 target authored lesson content; no restricted source text is reproduced or adapted.
5. Every `item_id` carries the distinctive `acronyms_deep` token and is written without backticks, per the Lote 6 canonical convention; `skill` and `type` keep the backticks required by the pack contract.
6. No two options or `br_pt_form` values within an item collapse to the same normalized string, including case.
