# Practice Pack — `les_b2_professional_summary`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_professional_summary_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_professional_summary.md`
**Provenance:** items authored. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_professional_summary_v1
lesson_id: les_b2_professional_summary
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
item_id: grm_professional_summary_nominalization_001
skill: `grammar.nominalization_conciseness`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "The team analyzed about the latency data."
    br_pt_form: "A equipe analisou sobre os dados de latência."
    note: "the verb remains and 'analyze about' is not the English collocation"
  - option: "The team made an analyze of the latency data."
    br_pt_form: "A equipe fez uma análise dos dados de latência."
    note: "'an analyze' is not English; the noun form is analysis"
  - option: "The team conducted an analysis about the latency data."
    br_pt_form: "A equipe conduziu uma análise sobre os dados de latência."
    note: "analysis takes 'of', not 'about', when it names the material examined"
```

**Item:**
> You are condensing a report. Which line is the concise nominalization of "The team analyzed the latency data"?

| Slot | Value |
|------|-------|
| A | "The team analyzed about the latency data." |
| B | **"The team conducted an analysis of the latency data."** ✓ |
| C | "The team made an analyze of the latency data." |
| D | "The team conducted an analysis about the latency data." |

**Key:** B

**Feedback:**
> **`The team conducted an analysis of the latency data.`** replaces the verb with its noun and keeps the pattern *analysis of*. **A** keeps the verb and adds a wrong preposition, **C** uses the verb where the noun is required, and **D** changes the collocation to *about*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_professional_summary_main_idea_001
skill: `reading.summarization`
type: `main_idea_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The rollback restored checkout in eleven minutes."
    br_pt_form: "A reversão restaurou o checkout em onze minutos."
    note: "a true supporting detail, but a detail is not the main idea"
  - option: "The dashboard timestamps are in the appendix."
    br_pt_form: "Os horários do painel estão no apêndice."
    note: "a location note about the appendix, not the claim of the report"
  - option: "Leadership should stop asking for long reports."
    br_pt_form: "A liderança deveria parar de pedir relatórios longos."
    note: "an opinion the report never states; a summary adds no opinion"
```

**Stimulus:**
> "The twelve-page report says checkout latency rose after a cache key change. According to the SRE team, the rollback took eleven minutes and errors stopped. The dashboard timestamps and the ticket comments are in the appendix."

**Item:**
> Which sentence states the main idea of the report?

| Slot | Value |
|------|-------|
| A | "The rollback restored checkout in eleven minutes." |
| B | **"A cache key change caused the checkout latency spike."** ✓ |
| C | "The dashboard timestamps are in the appendix." |
| D | "Leadership should stop asking for long reports." |

**Key:** B

**Feedback:**
> The first sentence carries the claim the rest supports: **`a cache key change caused the checkout latency spike`**. **A** is a supporting detail, **C** only says where other details live, and **D** imports an opinion absent from the text.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_professional_summary_paraphrase_001
skill: `vocab.summary.paraphrase`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "condense"
    br_pt_form: "condensar / reduzir"
    note: "condensing shortens the text; it does not by itself restate the meaning"
  - option: "attribute"
    br_pt_form: "atribuir a autoria da informação"
    note: "attribution names the source of a claim, not a rewording of it"
  - option: "omit"
    br_pt_form: "omitir"
    note: "omitting removes information; paraphrasing keeps all of the meaning"
```

**Item:**
> Which verb means to restate the meaning with new words and a new structure?

| Slot | Value |
|------|-------|
| A | condense |
| B | attribute |
| C | **paraphrase** ✓ |
| D | omit |

**Key:** C

**Feedback:**
> **`Paraphrase`** keeps the meaning and changes the wording and structure. **A** shortens, **B** names the source, and **D** drops information — none of them guarantees a new wording of the same claim.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_professional_summary_attribution_001
skill: `reading.summary_attribution`
type: `inference`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The writer disagrees with the SRE team's measurement."
    br_pt_form: "O autor discorda da medição da equipe de SRE."
    note: "attribution credits a source; it does not signal disagreement"
  - option: "The report covers every service in the company."
    br_pt_form: "O relatório cobre todos os serviços da empresa."
    note: "the scope is explicitly checkout only; other services are tracked separately"
  - option: "The rollback will happen next quarter."
    br_pt_form: "A reversão acontecerá no próximo trimestre."
    note: "the rollback already happened; the quarter refers to the report, not to future work"
```

**Stimulus:**
> "According to the SRE team, the rollback took eleven minutes. In this quarter's report, the metric covers checkout only; the other services are tracked separately."

**Item:**
> What does the phrase "according to the SRE team" tell the reader?

| Slot | Value |
|------|-------|
| A | "The writer disagrees with the SRE team's measurement." |
| B | **"The eleven-minute figure comes from the SRE team's measurement, not the writer's."** ✓ |
| C | "The report covers every service in the company." |
| D | "The rollback will happen next quarter." |

**Key:** B

**Feedback:**
> **`According to the SRE team`** marks the source of the figure, so the writer is not presenting it as their own measurement. **A** reads a credit as a disagreement, **C** ignores the declared scope (*checkout only*), and **D** turns a completed rollback into a future event.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_professional_summary_gist_vowels_001
skill: `pronunciation.summary_gist_vowels`
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

**Step 1 — hear the contrast:** /dʒ/ in *gist* is the sound of *jump*, never /ʒ/ as in *vision* or /z/. /ʌ/ in *summary* is short and central, between the pt-BR /a/ and /e/. /iː/ in *key* is long and tense — Brazilian learners shorten it toward *qui*. /eɪ/ in *main* and *change* is a glide, not a flat vowel. /ə/ in *summary, supporting* and *attribution* is the schwa of unstressed syllables; giving every syllable a full vowel breaks the rhythm.

**Step 2 — produce (ASR-scored):** read aloud:

> "The gist is clear: one key point, with attribution and a short summary."

**Target phonemes:** /dʒ/ in *gist* · /ʌ/ and /ə/ in *summary* · /iː/ in *key* · /ə/ in *attribution* · /eɪ/ in *main* (from the lesson target sentences).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_professional_summary_reported_speech_001
skill: `grammar.reported_speech_feedback`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b1_reported_speech
distractors:
  - option: "Bruna said the report is long."
    br_pt_form: "Bruna disse que o relatório é longo."
    note: "reported speech after a past reporting verb requires backshift"
  - option: "Bruna said the report has been long."
    br_pt_form: "Bruna disse que o relatório tem sido longo."
    note: "present perfect keeps the viewpoint in the present and breaks backshift"
  - option: "Bruna said that the report were long."
    br_pt_form: "Bruna disse que o relatório fossem longos."
    note: "were does not agree with the singular subject report"
```

**Item:**
> Reviewing reported speech: "The report is long," Bruna said. Which line reports her words correctly?

| Slot | Value |
|------|-------|
| A | "Bruna said the report is long." |
| B | **"Bruna said the report was long."** ✓ |
| C | "Bruna said the report has been long." |
| D | "Bruna said that the report were long." |

**Key:** B

**Feedback:**
> *is* backshifts to *was* after **said**: **`Bruna said the report was long.`** **A** keeps the present, **C** holds the viewpoint in the present with *has been*, and **D** pairs a singular subject with *were*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_professional_summary_tldr_001
skill: `vocab.email_tech_tldr`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_email_basics
distractors:
  - option: "FYI: the index is missing."
    br_pt_form: "FYI: o índice está faltando."
    note: "FYI marks information for someone who does not need to act, not a summary"
  - option: "ETA: the index is missing."
    br_pt_form: "ETA: o índice está faltando."
    note: "ETA is an estimated time, not a one-line takeaway"
  - option: "ASAP: the index is missing."
    br_pt_form: "ASAP: o índice está faltando."
    note: "ASAP expresses urgency and carries no summary at all"
```

**Item:**
> Reviewing email vocabulary: which line gives a one-line takeaway at the top of an update?

| Slot | Value |
|------|-------|
| A | **"TL;DR: the index is missing."** ✓ |
| B | "FYI: the index is missing." |
| C | "ETA: the index is missing." |
| D | "ASAP: the index is missing." |

**Key:** A

**Feedback:**
> **`TL;DR: the index is missing.`** is the one-line takeaway. **B** only informs, **C** is a time estimate, and **D** is urgency — none of them condenses the update.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `summary_gist_first` | Item 2 missed | **L2** | Separate a one-sentence gist from supporting details and appendix notes in short status reports. |
| `summary_nominalization` | Item 1 missed | **L2** | Drill *conducted an analysis / made a decision* against *analyze / decided* in three-line condensations. |
| `summary_attribution_scope` | Items 3, 4 and 7 missed | **L2** | Recycle *paraphrase / according to / scope / TL;DR* in one summarized incident update with a named source and a declared boundary. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_reported_speech` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room. The grammar-rag query `"summarizing paraphrase main idea detail reduction" --top-k 2` returned a multiple-choice exercise passage and a passage on perfect participles (*Having seen the film twice*); neither supports summarizing, so neither was used — the pack is anchored in the authored lesson and the canonical pack models instead.
6. §4.3 registration checked: `les_b1_it_write_docs` is the lesson that introduces the `writing_summary` skill. Of the ids in the previous lesson JSON, only `les_a2_it_terms_basics` and `les_b2_register_nuance` are real lesson ids and were kept; `les_a2_it_communication`, `les_b1_it_technical` and `les_b1_fluency_project` are module names, not lesson ids, and were dropped. No self-loop: the lesson id does not appear in its own `prereq_lessons`.
7. `item_id` values use the distinctive token `professional_summary` derived from the lesson id, are semantically namespaced by domain prefix and were checked against `packs/*/pack-les-*.md` for collisions.
