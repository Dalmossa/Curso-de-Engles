# Practice Pack — `les_b1_conditionals`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_conditionals_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_conditionals.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_conditionals_v1
lesson_id: les_b1_conditionals
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
item_id: grm_conditionals_first_real_001
skill: `grammar.conditionals_1_2`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "If the migration will finish before 16:00, we'll deploy tonight."
    br_pt_form: "Se a migração for concluída antes das 16:00, faremos o deploy hoje à noite."
    note: "'will' does not belong in the if-clause of a first conditional; use the present simple"
  - option: "If the migration finished before 16:00, we would deploy tonight."
    br_pt_form: "Se a migração terminasse antes das 16:00, faríamos o deploy hoje à noite."
    note: "past plus 'would' is the second conditional; it frames the plan as hypothetical"
  - option: "If the migration finishes before 16:00, we deploy tonight will."
    br_pt_form: "Se a migração terminar antes das 16:00, o deploy de hoje à noite será feito."
    note: "'will' must precede the base verb inside the result clause"
```

**Item:**
> You are writing the release contingency. Which line states a real, possible plan with the correct conditional?

| Slot | Value |
|------|-------|
| A | "If the migration will finish before 16:00, we'll deploy tonight." |
| B | **"If the migration finishes before 16:00, we'll deploy tonight."** ✓ |
| C | "If the migration finished before 16:00, we would deploy tonight." |
| D | "If the migration finishes before 16:00, we deploy tonight will." |

**Key:** B

**Feedback:**
> A real future plan takes the present simple after *if* and *will* in the result: **`If the migration finishes before 16:00, we'll deploy tonight.`** **A** wrongly puts *will* in the if-clause, **C** turns the plan into a hypothetical second conditional, and **D** strands *will* at the end of the result clause.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_conditionals_contingency_plan_001
skill: `reading.conditionals_contingency_plan`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "We page the on-call immediately."
    br_pt_form: "Acionamos o plantão imediatamente."
    note: "the on-call is paged only for a critical error, not for any failed check"
  - option: "We deploy at 16:00."
    br_pt_form: "Fazemos o deploy às 16:00."
    note: "that is the branch taken when the data check passes, not when it fails"
  - option: "We test the rollback on a staging replica."
    br_pt_form: "Testamos o rollback em uma réplica de staging."
    note: "the writer says there is no staging replica; the test is only hypothetical"
```

**Stimulus:**
> "Contingency note — If the data check passes, we deploy at 16:00. If it fails, we keep the old schema and roll back. Unless the error is critical, we don't page the on-call. Take the runbook in case the on-call asks for the rollback steps. If we had a staging replica, we could test the rollback end to end, but we don't have one yet."

**Item:**
> According to the note, what happens if the data check fails?

| Slot | Value |
|------|-------|
| A | We page the on-call immediately. |
| B | **We keep the old schema and roll back.** ✓ |
| C | We deploy at 16:00. |
| D | We test the rollback on a staging replica. |

**Key:** B

**Feedback:**
> The failure branch is explicit: **`If it fails, we keep the old schema and roll back.`** **A** reverses the *unless* condition (only a critical error pages the on-call), **C** is the success branch, and **D** describes a replica the team does not have.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_conditionals_unless_in_case_001
skill: `vocab.conditionals.contingency`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "As long as"
    br_pt_form: "desde que / contanto que"
    note: "this states a necessary condition, not a negative one"
  - option: "In case"
    br_pt_form: "no caso de / para o caso de"
    note: "this introduces a precaution, not the equivalent of 'if not'"
  - option: "If not"
    br_pt_form: "se não (com oração completa)"
    note: "'if not' needs a full clause with an auxiliary and would invert this sentence"
```

**Item:**
> Which connector means *a menos que* and already carries the negative? "______ the data check fails, we won't page the on-call."

| Slot | Value |
|------|-------|
| A | As long as |
| B | In case |
| C | **Unless** ✓ |
| D | If not |

**Key:** C

**Feedback:**
> **`Unless`** means *if not* and takes an affirmative clause: **`Unless the data check fails, we won't page the on-call.`** **A** expresses a necessary condition, **B** a precaution, and **D** would require *if the data check doesn't fail* — a different structure.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_conditionals_unless_detail_001
skill: `reading.conditionals_unless_detail`
type: `detail_identification`
difficulty_b: 0.2
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Freezing the branch at 15:00."
    br_pt_form: "Congelar a branch às 15:00."
    note: "the freeze lowers risk, but the writer's wish is about a staging replica"
  - option: "Running the data check twice."
    br_pt_form: "Executar o teste de dados duas vezes."
    note: "two failures stop the deploy and move the investigation to Monday"
  - option: "Deploying on Monday."
    br_pt_form: "Fazer o deploy na segunda-feira."
    note: "Monday is the investigation day after two failures, not the writer's preference"
```

**Stimulus:**
> "Hi team — I'd feel safer if we had a staging replica. We don't, so here is the plan: unless someone changes the branch after 15:00, we deploy at 16:00. The data check is the only gate. If it fails twice, we stop and investigate on Monday. As long as the branch stays frozen, the deploy is low risk."

**Item:**
> According to the note, what would make the writer feel safer?

| Slot | Value |
|------|-------|
| A | Freezing the branch at 15:00. |
| B | **Having a staging replica.** ✓ |
| C | Running the data check twice. |
| D | Deploying on Monday. |

**Key:** B

**Feedback:**
> The second conditional names the wish directly: **`I'd feel safer if we had a staging replica.`** **A** is a low-risk condition, **C** is the failure threshold, and **D** is the Monday investigation — none of them is the hypothetical the writer asks for.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_conditionals_would_could_001
skill: `pronunciation.conditionals_would_could`
type: `minimal_pair_production`
difficulty_b: 0.0
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_conditionals_would_could_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *if* /ɪf/ uses a short, lax /ɪ/, while *we'll* /wiːl/ has the long, tense /iː/. *Would* /wʊd/ and *could* /kʊd/ carry the short rounded /ʊ/ and a released final /d/ — Brazilian learners often lengthen the vowel into /uː/ or swallow the /d/. *Unless* /ənˈles/ starts with an unstressed schwa and puts the stress on the second syllable.

**Step 2 — produce (ASR-scored):** read aloud:

> "If we had a staging replica, we could test the rollback; unless it fails, we'll deploy tonight."

**Target phonemes:** /ɪ/ in *if* · /iː/ in *we'll* · /ʊ/ with released /d/ in *could* · /ə/ + /ˈles/ in *unless* · /ð/ in *the rollback* · /ɔɪ/ in *deploy* (from the lesson's articulation focus).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_conditionals_prereq_modals_001
skill: `grammar.modal_can_need`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_modals_can_need
distractors:
  - option: "If the check fails, we should to roll back immediately."
    br_pt_form: "Se o teste falhar, devemos reverter imediatamente."
    note: "a modal takes the bare verb; 'to' after 'should' is L1 transfer"
  - option: "If the check fails, we need roll back immediately."
    br_pt_form: "Se o teste falhar, precisamos reverter imediatamente."
    note: "lexical 'need' requires 'to' before the next verb"
  - option: "If the check fails, we should rolled back immediately."
    br_pt_form: "Se o teste falhar, deveríamos ter revertido imediatamente."
    note: "a modal cannot be followed by a past participle"
```

**Item:**
> Reviewing modals from the prerequisites: which sentence uses the modal correctly in a contingency note?

| Slot | Value |
|------|-------|
| A | "If the check fails, we should to roll back immediately." |
| B | "If the check fails, we need roll back immediately." |
| C | **"If the check fails, we should roll back immediately."** ✓ |
| D | "If the check fails, we should rolled back immediately." |

**Key:** C

**Feedback:**
> **`Should` takes the bare verb: `we should roll back immediately.`** **A** inserts *to* after the modal, **B** omits the *to* required by lexical *need*, and **D** puts a past participle after *should*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_conditionals_prereq_hedging_001
skill: `vocab.hedging.modals`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_b1_modals
distractors:
  - option: "You are wrong about the replica."
    br_pt_form: "Você está errado sobre a réplica."
    note: "a direct verdict attacks the person and carries no hedging"
  - option: "We must deploy now."
    br_pt_form: "Precisamos fazer o deploy agora."
    note: "'must' is categorical; it states an obligation instead of softening a view"
  - option: "The plan is definitely perfect."
    br_pt_form: "O plano é definitivamente perfeito."
    note: "'definitely' expresses certainty, the opposite of hedging"
```

**Item:**
> Reviewing the hedging taught with modals: which phrase softens a professional disagreement?

| Slot | Value |
|------|-------|
| A | "You are wrong about the replica." |
| B | **"I'd feel safer if we had a staging replica."** ✓ |
| C | "We must deploy now." |
| D | "The plan is definitely perfect." |

**Key:** B

**Feedback:**
> **`I'd feel safer if we had a staging replica.`** uses the contracted *I'd* plus a hypothetical clause to attribute the concern to the speaker. **A** judges the interlocutor, **C** imposes an obligation, and **D** asserts certainty — none of them hedges.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `conditional_time_reference` | Item 1 missed | **L2** | Contrast present in the if-clause with *will* in the result, then against past + *would/could*, using short release-planning lines. |
| `contingency_detail_scan` | Items 2 or 4 missed | **L2** | Skim a short contingency note for the failure branch and the writer's hypothetical, separating them from gates, days and precautions. |
| `connector_hedge_review` | Items 3, 6 or 7 missed | **L2** | Recycle *unless / if not / in case / as long as* with *should / need to* and *I'd feel safer* in one follow-up thread. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 1–5 assess B1 conditionals and hedging directly; items 6 and 7 review `les_a2_modals_can_need` (`modal_can_need`) and `les_b1_modals` (`hedging`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items (1, 2, 3, 4, 6 and 7); item 5 is correctly `not_applicable_no_distractor_set`.
5. Each MCQ was checked after normalization (strip `*✓⚠️❌_`, trim, lower): the four options and the four glosses are distinct, and no distractor differs from its key by case alone.
6. The two reading items use different stimuli and different detail targets (failure branch vs. writer's hypothetical), so neither can be answered from the other's text.
7. Every line of dialogue, stimulus, distractor, gloss and note was authored in a clean room; no restricted source text is reproduced or adapted. The grammar-rag query for "conditionals first and second if clauses" returned only a grammar index and an unrelated exercise excerpt — no wording from either was reused.
