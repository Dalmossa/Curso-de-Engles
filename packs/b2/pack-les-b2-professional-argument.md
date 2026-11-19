# Practice Pack — `les_b2_professional_argument`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b2_professional_argument_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_professional_argument.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_professional_argument_v1
lesson_id: les_b2_professional_argument
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
item_id: grm_professional_argument_thesis_001
skill: `grammar.argumentative_thesis`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "I think technical debt is something we should maybe discuss."
    br_pt_form: "Eu acho que dívida técnica é algo que talvez devêssemos discutir."
    note: "stacked hedges remove the defendable position a thesis needs"
  - option: "Technical debt is a topic in software engineering."
    br_pt_form: "Dívida técnica é um tema em engenharia de software."
    note: "names a topic but states no stance, so there is nothing to argue"
  - option: "Many teams have problems with legacy code."
    br_pt_form: "Muitas equipes têm problemas com código legado."
    note: "a generalisation about other teams is not a thesis about this decision"
```

**Item:**
> You are opening an argument about debt work. Which line is a clear, warranted thesis statement?

| Slot | Value |
|------|-------|
| A | "I think technical debt is something we should maybe discuss." |
| B | **"I argue that a monthly debt budget is warranted because deferred fixes raise rollback time."** ✓ |
| C | "Technical debt is a topic in software engineering." |
| D | "Many teams have problems with legacy code." |

**Key:** B

**Feedback:**
> **`I argue that ... is warranted because ...`** gives stance, scope and a reason. **A** hedges the position away, **C** only names a topic, and **D** generalises about other teams instead of taking a position.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_professional_argument_stance_001
skill: `reading.argument_stance`
type: `detail_identification`
difficulty_b: -0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "I argue that a monthly debt budget is warranted."
    br_pt_form: "Eu argumento que um orçamento mensal para dívida técnica é justificado."
    note: "this is the thesis, the writer's own position, not the opposing view"
  - option: "The last two incident reviews show a thirty percent rise in rollback time."
    br_pt_form: "As duas últimas revisões de incidente mostram um aumento de trinta por cento no tempo de rollback."
    note: "this is evidence supporting the claim, not the objection"
  - option: "Fewer rollbacks give the team more time to ship."
    br_pt_form: "Menos rollbacks dão à equipe mais tempo para entregar."
    note: "this answers the objection, so it is the rebuttal, not the counterargument"
```

**Stimulus:**
> "I argue that a monthly debt budget is warranted. The last two incident reviews show a thirty percent rise in rollback time after we deferred refactoring. Admittedly, a fixed budget may delay one feature per quarter. However, fewer rollbacks give the team more time to ship, not less."

**Item:**
> Which sentence states the counterargument that the writer concedes?

| Slot | Value |
|------|-------|
| A | **"Admittedly, a fixed budget may delay one feature per quarter."** ✓ |
| B | "I argue that a monthly debt budget is warranted." |
| C | "The last two incident reviews show a thirty percent rise in rollback time." |
| D | "Fewer rollbacks give the team more time to ship." |

**Key:** A

**Feedback:**
> **`Admittedly, ... may delay ...`** is the concession: the writer names a real objection. **B** is the thesis, **C** is the supporting evidence, and **D** is the rebuttal that follows the concession.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_professional_argument_rebuttal_001
skill: `vocab.argument.rebuttal`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "concession"
    br_pt_form: "concessão / reconhecimento de um ponto válido"
    note: "a concession admits the objection; it does not answer it"
  - option: "claim"
    br_pt_form: "afirmação / ponto defendido"
    note: "a claim is the point being defended, not the answer to an objection"
  - option: "warrant"
    br_pt_form: "justificativa / elo entre evidência e afirmação"
    note: "a warrant links evidence to a claim; the move after a counterargument is a rebuttal"
```

**Item:**
> In an argumentative essay, what is the name of the move that answers a counterargument with reasoning?

| Slot | Value |
|------|-------|
| A | concession |
| B | claim |
| C | **rebuttal** ✓ |
| D | warrant |

**Key:** C

**Feedback:**
> A **rebuttal** answers the objection with reasoning. **A** is the admission of the objection, **B** is the point under defence, and **D** is the link that makes a claim warranted.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_professional_argument_evidence_001
skill: `reading.argument_evidence`
type: `inference`
difficulty_b: 0.1
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "The writer repeats the thesis in the conclusion."
    br_pt_form: "O autor repete a tese na conclusão."
    note: "repetition is emphasis, not the evidence that warrants a claim"
  - option: "One team reported a feeling that incidents fell."
    br_pt_form: "Uma equipe relatou a sensação de que os incidentes diminuíram."
    note: "the text gives measured p95 and rollback numbers, not impressions"
  - option: "The second team's unchanged numbers prove the pilot failed."
    br_pt_form: "Os números inalterados da segunda equipe provam que o piloto falhou."
    note: "the writer explicitly notes that the second team did not run the pilot"
```

**Stimulus:**
> "A phased pilot cut p95 latency by eighteen percent in the checkout service across two quarters. During the same period, rollbacks fell from nine to four. A second team saw no change, but it did not run the pilot. The writer concludes that a phased release is likely to reduce incidents."

**Item:**
> Why is the conclusion about a phased release warranted by the text?

| Slot | Value |
|------|-------|
| A | "The writer repeats the thesis in the conclusion." |
| B | **"It rests on two quarters of p95 and rollback data and names the team that did not pilot."** ✓ |
| C | "One team reported a feeling that incidents fell." |
| D | "The second team's unchanged numbers prove the pilot failed." |

**Key:** B

**Feedback:**
> **`two quarters`, `eighteen percent`, `nine to four`** and the explicit note about the non-pilot team keep the claim bounded and **warranted**. **A** confuses repetition with evidence, **C** invents impressions where there are measurements, and **D** ignores the stated reason for the second team's result.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_professional_argument_dentals_001
skill: `pronunciation.argument_dental_diphthongs`
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

**Step 1 — hear the contrast:** /θ/ in *thesis, monthly* is voiceless with the tongue between the teeth — not /t/ ("tesis"). /ð/ in *the* is the voiced counterpart, not /d/ ("da"). /eɪ/ in *claims* and *phased* glides; /iː/ in *release* is long and tense. /dʒ/ in *suggests* is an affricate, not plain /s/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The thesis claims a monthly debt budget is warranted; the evidence suggests a phased release."

**Target phonemes:** /θ/ in *thesis, monthly* · /ð/ in *the* · /eɪ/ in *claims, phased* · /ɜː/ in *warranted* · /dʒ/ in *suggests* · /iː/ in *release*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_professional_argument_hedging_001
skill: `grammar.hedging_modals`
type: `error_correction`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: les_b2_register_nuance
distractors:
  - option: "The data proves 100% that the pilot worked."
    br_pt_form: "Os dados provam 100% que o piloto funcionou."
    note: "overclaims certainty that a limited sample cannot support"
  - option: "I think maybe the pilot could possibly help a bit."
    br_pt_form: "Eu acho que talvez o piloto pudesse possivelmente ajudar um pouco."
    note: "stacks hedges until the stance disappears"
  - option: "In my opinion, the pilot is true."
    br_pt_form: "Na minha opinião, o piloto é verdadeiro."
    note: "a personal opinion without evidence is not a warranted academic claim"
```

**Item:**
> Reviewing hedging from register & nuance: which line keeps a claim warranted?

| Slot | Value |
|------|-------|
| A | "The data proves 100% that the pilot worked." |
| B | **"The p95 data suggests the pilot reduced incidents."** ✓ |
| C | "I think maybe the pilot could possibly help a bit." |
| D | "In my opinion, the pilot is true." |

**Key:** B

**Feedback:**
> **`The p95 data suggests ...`** marks the degree of certainty the evidence supports. **A** overstates it, **C** stacks hedges until there is no position, and **D** offers an opinion with no evidence at all.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_professional_argument_false_cognate_001
skill: `vocab.false_cognate_actually`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "currently"
    br_pt_form: "atualmente"
    note: "'actually' is not the Portuguese 'atualmente'; use 'currently' for that sense"
  - option: "eventually"
    br_pt_form: "eventualmente / no fim"
    note: "'eventually' means 'in the end', not the intended contrast here"
  - option: "reliably"
    br_pt_form: "de forma confiável"
    note: "'reliably' describes manner, not the correction of an expectation"
```

**Item:**
> Reviewing IT false cognates: in "The pilot looked risky; actually, it cut incidents", the word *actually* means:

| Slot | Value |
|------|-------|
| A | currently |
| B | eventually |
| C | **in fact** ✓ |
| D | reliably |

**Key:** C

**Feedback:**
> **In fact** is the sense of *actually* when it corrects an expectation. **A** is the Portuguese *atualmente*, **B** means *in the end*, and **D** describes how something is done — none of them corrects the earlier expectation.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `argument_thesis_structure` | Item 1 missed | **L2** | Contrast *I think maybe / a topic in / I argue that ... because ...* in one-sentence theses with stance, scope and a reason. |
| `argument_move_identification` | Items 2 and 4 missed | **L2** | Label thesis, evidence, concession and rebuttal in a five-line paragraph; separate a bounded claim from an impression or a repetition. |
| `argument_hedge_and_gloss` | Items 3, 6 and 7 missed | **L2** | Recycle *rebuttal / concession / warrant*, *the data suggests* vs *proves*, and *actually* vs *currently* in one follow-up thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b2_register_nuance` (`grammar.hedging_modals`) and `les_a2_it_terms_basics` (`vocab.false_cognate_actually`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. *Thesis*, *claim*, *evidence*, *counterargument*, *rebuttal* and *concession* are unprotectable academic concepts.
6. §4.3 registration checked: `les_b2_register_nuance` and `les_a2_it_terms_basics` are real lesson ids; module names were not used as prerequisites.
7. All seven `item_id` values carry the lesson token `professional_argument` and are globally unique; the deprecated v1 pack was removed by path, not consulted.
