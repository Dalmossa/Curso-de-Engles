# Practice Pack — `les_b2_professional_review`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_professional_review_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_professional_review.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_professional_review_v1
lesson_id: les_b2_professional_review
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
item_id: grm_professional_review_hedging_001
skill: `grammar.hedging_review`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "The proposal is proven to work; ship it everywhere."
    br_pt_form: "A proposta está comprovada; publique em todo lugar."
    note: "overstates the evidence; a review needs a hedged claim"
  - option: "I think maybe the change could possibly help a bit."
    br_pt_form: "Eu acho que talvez a mudança possa ajudar um pouco."
    note: "stacks hedges and loses a clear position"
  - option: "In my view the change helps and there is no downside."
    br_pt_form: "Na minha opinião a mudança ajuda e não há desvantagem."
    note: "drops the reservation and overstates certainty"
```

**Item:**
> You are reviewing a proposal with a small staging sample. Which line is a balanced claim?

| Slot | Value |
|------|-------|
| A | "The proposal is proven to work; ship it everywhere." |
| B | **"The data suggests the change helps, with the caveat that the run was small."** ✓ |
| C | "I think maybe the change could possibly help a bit." |
| D | "In my view the change helps and there is no downside." |

**Key:** B

**Feedback:**
> **`The data suggests ... with the caveat that ...`** sets a position, a degree of certainty and a limitation in one line. **A** claims proof the sample cannot support, **C** stacks hedges until the position disappears, and **D** states a view but erases the trade-off.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_professional_review_evidence_001
skill: `reading.review_evidence`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The author rejects the collector change."
    br_pt_form: "O autor rejeita a mudança do coletor."
    note: "the author endorses the change; the limitation is about scope"
  - option: "The bill stayed the same after the change."
    br_pt_form: "A conta ficou igual após a mudança."
    note: "the text names a larger bill as the trade-off"
  - option: "The rollout was already completed."
    br_pt_form: "O rollout já foi concluído."
    note: "the author recommends a pilot before the rollout, so it has not happened"
```

**Stimulus:**
> "In my view, the new collector is the right call. The staging run shows a thirty percent drop in p95 over six hours, but the sample covered one service only. The trade-off is a larger bill. I'd recommend a pilot before the full rollout."

**Item:**
> What limits the author's claim about p95?

| Slot | Value |
|------|-------|
| A | **"The staging run covered one service only."** ✓ |
| B | "The author rejects the collector change." |
| C | "The bill stayed the same after the change." |
| D | "The rollout was already completed." |

**Key:** A

**Feedback:**
> The scope restriction is explicit — **`the sample covered one service only`**. **B** inverts the author's positive stance, **C** contradicts the stated larger bill, and **D** mistakes a recommended pilot for a finished rollout.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_professional_review_trade_off_001
skill: `vocab.review.trade_off`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "caveat"
    br_pt_form: "ressalva / limitação declarada"
    note: "a caveat is a limitation you declare, not the exchange itself"
  - option: "reservation"
    br_pt_form: "ressalva (dúvida que se mantém)"
    note: "a reservation is a doubt you still hold, not the balance of costs"
  - option: "recommendation"
    br_pt_form: "recomendação"
    note: "a recommendation is the action you propose, not the exchange of costs"
```

**Item:**
> "Better visibility against a larger bill" is a:

| Slot | Value |
|------|-------|
| A | caveat |
| B | reservation |
| C | **trade-off** ✓ |
| D | recommendation |

**Key:** C

**Feedback:**
> A **trade-off** names both sides of an exchange. **A** is the declared limitation, **B** is the doubt the writer still holds, and **D** is the action proposed — none of them is the balance itself.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_professional_review_reservation_001
skill: `reading.review_reservation`
type: `inference`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The migration is certain to cut incidents in every season."
    br_pt_form: "A migração com certeza reduz incidentes em toda estação."
    note: "overstates the claim; the writer limits it to a quiet period"
  - option: "The writer opposes the migration because of seasonal traffic."
    br_pt_form: "O autor é contra a migração por causa do tráfego sazonal."
    note: "the writer supports the migration and only names a reservation"
  - option: "The pilot covered a peak month already."
    br_pt_form: "O piloto já cobriu um mês de pico."
    note: "the writer recommends extending the pilot to a peak month, so it has not happened"
```

**Stimulus:**
> "I'd argue the migration is worthwhile. The docs show fewer incidents after the pilot, though the pilot ran for two weeks in a quiet period. My reservation is seasonal traffic. With that caveat, I'd recommend extending the pilot to a peak month."

**Item:**
> Which sentence best captures the writer's overall stance?

| Slot | Value |
|------|-------|
| A | "The migration is certain to cut incidents in every season." |
| B | **"The migration looks worthwhile, but the evidence is limited to a quiet period."** ✓ |
| C | "The writer opposes the migration because of seasonal traffic." |
| D | "The pilot covered a peak month already." |

**Key:** B

**Feedback:**
> **`I'd argue ... worthwhile`** plus **`though ... in a quiet period`** is support with a bounded claim. **A** turns a bounded claim into certainty, **C** flips a reservation into opposition, and **D** reads a proposal as a completed pilot.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_professional_review_caveat_vowels_001
skill: `pronunciation.review_caveat_vowels`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_professional_review_caveat_vowels_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** /v/ in *view* puts the lower lip on the upper teeth — not the rounded /w/ of *viu*. /θ/ in *thesis* is voiceless between the teeth; /æ/ in *caveat* is lower and more open than the pt-BR /e/; /eɪ/ in *staging* and *data* glides, while /ʃ/ in *recommendation* is *ship*, never /s/.

**Step 2 — produce (ASR-scored):** read aloud:

> "In my view, the thesis holds, with the caveat that the staging data suggests a trade-off; my recommendation is a pilot."

**Target phonemes:** /v/ in *view* · /θ/ in *thesis* · /æ/ in *caveat* · /eɪ/ in *staging* and *data* · /ʃ/ in *recommendation*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_professional_review_reported_speech_001
skill: `grammar.reported_speech_feedback`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b1_reported_speech
distractors:
  - option: "Tiago said the staging run is too short."
    br_pt_form: "Tiago disse que a execução em staging é curta demais."
    note: "reported speech after a past reporting verb shifts the present to past"
  - option: "Tiago said the staging run has been too short."
    br_pt_form: "Tiago disse que a execução em staging tem sido curta demais."
    note: "present perfect keeps the viewpoint in the present and breaks backshift"
  - option: "Tiago said that the staging run were too short."
    br_pt_form: "Tiago disse que a execução em staging fossem curtas demais."
    note: "were with a singular subject and a subjunctive sense is wrong here"
```

**Item:**
> Reviewing reported speech: "The staging run is too short," Tiago said. Which line reports it correctly?

| Slot | Value |
|------|-------|
| A | "Tiago said the staging run is too short." |
| B | **"Tiago said the staging run was too short."** ✓ |
| C | "Tiago said the staging run has been too short." |
| D | "Tiago said that the staging run were too short." |

**Key:** B

**Feedback:**
> *is* backshifts to *was* after **said**: **`Tiago said the staging run was too short.`** **A** keeps the present, **C** holds the viewpoint in the present with *has been*, and **D** pairs a singular subject with *were*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_professional_review_feedback_vocab_001
skill: `vocab.feedback_vocab`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_feedback_praise
distractors:
  - option: "Good job on the report."
    br_pt_form: "Bom trabalho no relatório."
    note: "praise without a specific action is not actionable feedback"
  - option: "Nice work, everyone."
    br_pt_form: "Ótimo trabalho, equipe."
    note: "generic praise names neither evidence nor a next step"
  - option: "Everything looks fine to me."
    br_pt_form: "Tudo me parece bem."
    note: "a vague approval gives the reader nothing to act on"
```

**Item:**
> Reviewing feedback vocabulary: which line is specific and actionable?

| Slot | Value |
|------|-------|
| A | "Good job on the report." |
| B | "Nice work, everyone." |
| C | **"Add the p95 chart to line 45 so the reviewer can check the claim."** ✓ |
| D | "Everything looks fine to me." |

**Key:** C

**Feedback:**
> **`Add the p95 chart to line 45 ...`** names the action and the place, so the reader can act. **A** and **B** are praise with no next step, and **D** is an approval with no evidence at all.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `hedged_review_claim` | Item 1 missed | **L2** | Contrast *proven / suggests / I'd argue* in short review lines with an explicit caveat and no stacked hedges. |
| `review_evidence_scope` | Items 2 and 4 missed | **L2** | Drill scope limits (*one service only*, *a quiet period*) in a five-line review; separate a bounded claim from certainty. |
| `review_vocab_register` | Items 3, 6 and 7 missed | **L2** | Recycle *trade-off / caveat / reservation / recommendation*, backshifted reported speech and actionable feedback in one review thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_reported_speech` and `les_a2_feedback_praise` and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. *Review*, *evaluation*, *trade-off*, *caveat* and *recommendation* are unprotectable professional concepts.
6. §4.3 registration checked: `les_a2_it_terms_basics`, `les_b2_register_nuance`, `les_b1_reported_speech` and `les_a2_feedback_praise` are real lesson ids — module names were not used as prerequisites.
