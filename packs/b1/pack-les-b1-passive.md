# Practice Pack — `les_b1_passive`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_passive_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_passive.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_passive_v1
lesson_id: les_b1_passive
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
item_id: grm_passive_be_participle_001
skill: `grammar.passive_be_participle`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The login bug was fix last night."
    br_pt_form: "O bug de login foi corrigido ontem à noite."
    note: "after 'was' the verb needs the past participle, not the base form"
  - option: "The login bug is fix last night."
    br_pt_form: "O bug de login está corrigido ontem à noite."
    note: "'is' conflicts with the past time marker and 'fix' remains a base form"
  - option: "The login bug was fixing last night."
    br_pt_form: "O bug de login estava corrigindo ontem à noite."
    note: "the progressive makes the bug the agent, but a bug cannot fix itself"
```

**Item:**
> A stand-up note has to report a finished fix. Which line uses the passive correctly?

| Slot | Value |
|------|-------|
| A | "The login bug was fix last night." |
| B | **"The login bug was fixed last night."** ✓ |
| C | "The login bug is fix last night." |
| D | "The login bug was fixing last night." |

**Key:** B

**Feedback:**
> The past passive needs *was* plus the participle *fixed*: **`The login bug was fixed last night.`** **A** keeps the base form after *was*, **C** mixes present *is* with a past time marker, and **D** turns the bug into the agent with a progressive form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_passive_status_detail_001
skill: `reading.passive_status_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Caio."
    br_pt_form: "O Caio."
    note: "Caio wrote the runbook; the patch has a different agent in the note"
  - option: "The API team."
    br_pt_form: "A equipe de API."
    note: "the API team is not named; the API appears only in the docs update"
  - option: "The person who wrote the stand-up."
    br_pt_form: "O autor do stand-up."
    note: "the author of the stand-up is not identified; 'by Ana' names the reviewer"
```

**Stimulus:**
> "Stand-up, 09:30 — The login bug was fixed at 22:00, and the patch was reviewed by Ana. The runbook was written by Caio before the deploy. The API docs are still being updated, so the new endpoint is not in section two yet. The old token will be deprecated on Friday; the rollback has already been tested."

**Item:**
> Who reviewed the patch?

| Slot | Value |
|------|-------|
| A | Caio. |
| B | **Ana.** ✓ |
| C | The API team. |
| D | The person who wrote the stand-up. |

**Key:** B

**Feedback:**
> The clause *the patch was reviewed by Ana* names the reviewer directly: **`Ana.`** **A** belongs to the runbook, **C** is invented from the docs sentence, and **D** confuses the unnamed author of the stand-up with the named agent of the passive.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_passive_irregular_participles_001
skill: `vocab.passive.irregular_participles`
type: `contextual_selection`
difficulty_b: 0.0
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "was wrote"
    br_pt_form: "foi escreveu"
    note: "'wrote' is the past simple; the participle 'written' is required after 'was'"
  - option: "was write"
    br_pt_form: "foi escrever"
    note: "the base form cannot follow 'was' in a passive construction"
  - option: "was writing"
    br_pt_form: "estava escrevendo"
    note: "the progressive is active and changes the meaning: the runbook would do the writing"
```

**Item:**
> "The runbook ___ by Caio before the deploy." Which form completes the passive?

| Slot | Value |
|------|-------|
| A | was wrote |
| B | was write |
| C | **was written** ✓ |
| D | was writing |

**Key:** C

**Feedback:**
> The irregular verb is *write — wrote — written*, and a passive takes the participle: **`was written`**. **A** uses the past simple, **B** uses the bare infinitive, and **D** switches to an active progressive.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_passive_runbook_detail_001
skill: `reading.passive_runbook_detail`
type: `detail_identification`
difficulty_b: 0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The rollback."
    br_pt_form: "O rollback."
    note: "the rollback was tested, but the note does not say it is in production"
  - option: "The verification step."
    br_pt_form: "A etapa de verificação."
    note: "the step must not be skipped; it is not a configuration value"
  - option: "The new version of the runbook."
    br_pt_form: "A nova versão do runbook."
    note: "the steps will be shared later, and version two is described as omitted"
```

**Stimulus:**
> "Runbook note — The rollback was tested before the release. The steps are going to be shared after the stand-up. The retry limit was not included in version two, so the old value is still in production. Do not skip the verification step."

**Item:**
> What is still in production?

| Slot | Value |
|------|-------|
| A | The rollback. |
| B | The verification step. |
| C | The new version of the runbook. |
| D | **The old retry limit.** ✓ |

**Key:** D

**Feedback:**
> The note says *the old value is still in production*, and that value is the retry limit: **`The old retry limit.`** **A** was only tested, **B** is a required action, and **C** refers to a version that was not included.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_passive_weak_forms_participles_001
skill: `pronunciation.passive_weak_forms_participles`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_passive_weak_forms_participles_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** in connected speech, *was* is weak /wəz/, not /wɑːz/; *written* is /ˈrɪtn/ with a short /ɪ/ and no extra syllable; *deprecated* is /ˈdeprəkeɪtɪd/, with /eɪ/ before the final /tɪd/. Brazilian learners tend to give *was* a full vowel, say *writ-teen*, and flatten /eɪ/ to /e/.

**Step 2 — produce (ASR-scored):** read aloud:

> "The bug was fixed, the runbook was written, and the old token will be deprecated on Friday."

**Target phonemes:** /wəz/ in *was* (twice) · /ˈrɪtn/ in *written* · /eɪ/ in *deprecated* · /t/ final in *fixed*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_passive_past_simple_source_001
skill: `grammar.past_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a1_regular_verbs_past
distractors:
  - option: "The team test the rollback yesterday."
    br_pt_form: "O time testa o rollback ontem."
    note: "the past time marker 'yesterday' requires the regular -ed form"
  - option: "The team testing the rollback yesterday."
    br_pt_form: "O time testando o rollback ontem."
    note: "a participle without an auxiliary is not a finite past sentence"
  - option: "The team was tested the rollback yesterday."
    br_pt_form: "O time foi testado o rollback ontem."
    note: "this makes the team the patient and leaves 'the rollback' without a grammatical role"
```

**Item:**
> Reviewing the past simple: which active sentence is the correct source for "The rollback was tested yesterday"?

| Slot | Value |
|------|-------|
| A | "The team test the rollback yesterday." |
| B | **"The team tested the rollback yesterday."** ✓ |
| C | "The team testing the rollback yesterday." |
| D | "The team was tested the rollback yesterday." |

**Key:** B

**Feedback:**
> The regular verb takes *-ed* in the past: **`The team tested the rollback yesterday.`** **A** ignores *yesterday*, **C** has no finite verb, and **D** puts the passive in the source sentence and strands the object.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_passive_by_agent_preposition_001
skill: `vocab.prepositions_basic_by`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_prepositions_basic
distractors:
  - option: "The patch was reviewed with Ana."
    br_pt_form: "O patch foi revisado com a Ana."
    note: "'with' expresses accompaniment, not the agent of a passive"
  - option: "The patch was reviewed from Ana."
    br_pt_form: "O patch foi revisado a partir da Ana."
    note: "'from' marks origin and cannot introduce the person who performed the action"
  - option: "The patch was reviewed at Ana."
    br_pt_form: "O patch foi revisado na Ana."
    note: "'at' locates a place or point in time, not a person performing the action"
```

**Item:**
> Reviewing prepositions: which line names the agent of a passive correctly?

| Slot | Value |
|------|-------|
| A | **"The patch was reviewed by Ana."** ✓ |
| B | "The patch was reviewed with Ana." |
| C | "The patch was reviewed from Ana." |
| D | "The patch was reviewed at Ana." |

**Key:** A

**Feedback:**
> The agent of a passive is introduced by *by*: **`The patch was reviewed by Ana.`** **B** suggests Ana was alongside the patch, **C** treats Ana as an origin, and **D** uses a preposition of place or time for a person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `passive_be_participle_review` | Item 1 missed | **L2** | Contrast *was fix / is fix / was fixed / was fixing* in short stand-up lines until *be + participle* is automatic. |
| `passive_irregular_participle_drill` | Item 3 or item 5 missed | **L2** | Recycle *write–wrote–written*, *do–did–done* and *build–built–built* in passive runbook sentences; replay the weak /wəz/ model. |
| `passive_agent_and_detail_scan` | Items 2, 4 or 7 missed | **L2** | Scan a status note for the *by + agent* phrase and for the exact value that remains in production, separating *by* from *with/from/at*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_regular_verbs_past` and `les_a2_prepositions_basic` and carry `prereq_lesson` for the interleaving rule.
4. Items 2 and 4 target different details — the agent of the patch and the value still in production — so neither stimulus can answer the other item.
5. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
6. Every option, gloss, stimulus and feedback line was authored for this lesson and pack in a clean room; no restricted source text is reproduced or adapted.
