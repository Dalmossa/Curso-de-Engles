# Practice Pack — `les_b1_project_retrospective`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_project_retrospective_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_project_retrospective.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_project_retrospective_v1
lesson_id: les_b1_project_retrospective
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
item_id: grm_project_retrospective_hedging_001
skill: `grammar.retrospective_hedging`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The handoff slipped because you were late."
    br_pt_form: "O handoff atrasou porque você se atrasou."
    note: "blames a person instead of softening the observation about the process"
  - option: "The handoff must be fixed immediately by everyone."
    br_pt_form: "O handoff precisa ser corrigido imediatamente por todos."
    note: "an order with no owner; 'must' removes the hedging the retrospective needs"
  - option: "Maybe the handoff will slip again next sprint."
    br_pt_form: "Talvez o handoff atrase de novo no próximo sprint."
    note: "moves the claim to the future and never names what happened in this sprint"
```

**Item:**
> Rafael is reviewing the QA handoff. Which line softens the criticism and still proposes a fix?

| Slot | Value |
|------|-------|
| A | "The handoff slipped because you were late." |
| B | **"It seems the handoff slipped; we could freeze the contract earlier."** ✓ |
| C | "The handoff must be fixed immediately by everyone." |
| D | "Maybe the handoff will slip again next sprint." |

**Key:** B

**Feedback:**
> **`It seems the handoff slipped; we could freeze the contract earlier.`** names the finding and offers a change without accusing anyone. **A** attacks a colleague, **C** issues a vague order, and **D** only speculates about a future sprint.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_project_retrospective_went_well_001
skill: `reading.retrospective_summary`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The load test."
    br_pt_form: "O teste de carga."
    note: "the load test passed on the first run; nothing blocked it"
  - option: "The QA handoff."
    br_pt_form: "O handoff para QA."
    note: "the handoff slipped by one day, but the contract change is named as the blocker of another item"
  - option: "The contract checklist."
    br_pt_form: "O checklist de contrato."
    note: "the checklist is the action item created because of the problem, not the blocked work"
```

**Stimulus:**
> "Sprint 14 summary. What went well: the payment retry passed the load test on the first run. What to improve: the handoff to QA slipped by one day. The API contract changed on Wednesday, and that was a blocker for the frontend screen. Action item: Rafael will add a contract checklist by Friday and flag changes in the stand-up."

**Item:**
> Which item was blocked by the API contract change?

| Slot | Value |
|------|-------|
| A | The load test. |
| B | The QA handoff. |
| C | **The frontend screen.** ✓ |
| D | The contract checklist. |

**Key:** C

**Feedback:**
> The summary says **`that was a blocker for the frontend screen`** right after the contract change. **A** passed on the first run, **B** slipped by a day for a different reason, and **D** is the action item created afterwards.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_project_retrospective_action_item_001
skill: `vocab.retrospective_action_item`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "blocker"
    br_pt_form: "bloqueio"
    note: "a blocker stopped work; it does not carry an owner or a deadline"
  - option: "retrospective"
    br_pt_form: "retrospectiva"
    note: "the meeting itself, not a task that comes out of it"
  - option: "improve"
    br_pt_form: "melhorar"
    note: "a verb for the change, not the name of the assigned task"
```

**Item:**
> The retro ended with a named task and a date. Which word fits? "We closed the retro with one ___."

| Slot | Value |
|------|-------|
| A | blocker |
| B | retrospective |
| C | **action item** ✓ |
| D | improve |

**Key:** C

**Feedback:**
> An **`action item`** is the output of a retro: a task with an owner and a deadline. **A** is the impediment discussed, **B** is the meeting, and **D** is the verb used to propose the change.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_project_retrospective_blocker_001
skill: `reading.retrospective_blocker`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "A task with an owner and a date."
    br_pt_form: "Uma tarefa com dono e data."
    note: "that defines an action item, not a blocker"
  - option: "A compliment about the test run."
    br_pt_form: "Um elogio sobre a execução dos testes."
    note: "the praise went to the retry test; Tom is describing a problem"
  - option: "A new estimate for the next sprint."
    br_pt_form: "Uma nova estimativa para o próximo sprint."
    note: "Tom says the estimate may have been optimistic, but that is not what 'blocker' means"
```

**Stimulus:**
> "Luiza: It seems we had one day for regression instead of three. Tom: Maybe the estimate was optimistic — the contract changed on Wednesday and that was a blocker for my screen. Ana: Rafael owns the action item: checklist by Friday."

**Item:**
> What does Tom mean by "blocker"?

| Slot | Value |
|------|-------|
| A | A task with an owner and a date. |
| B | **Something that stopped his work.** ✓ |
| C | A compliment about the test run. |
| D | A new estimate for the next sprint. |

**Key:** B

**Feedback:**
> Tom connects the contract change to his screen: **`that was a blocker for my screen`** means the work could not move. **A** describes Rafael's action item, **C** belongs to the "what went well" part, and **D** misreads *estimate* as the meaning of *blocker*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_project_retrospective_pronunciation_001
skill: `pronunciation.retrospective_dentals_diphthongs`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_project_retrospective_pronunciation_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *went* starts with /w/, rounded lips — not the /v/ of *vent*. *maybe* carries the /eɪ/ diphthong in its first syllable, not a plain /e/. In *worth*, /θ/ is voiceless with the tongue tip between the teeth; in *the*, /ð/ is the voiced counterpart. Brazilian learners often replace /θ/ with /t/ and flatten /eɪ/.

**Step 2 — produce (ASR-scored):** read aloud:

> "What went well? It seems worth reviewing — maybe we could improve the handoff."

**Target phonemes:** /w/ in *went, well, worth* · /eɪ/ in *maybe* · /iː/ in *seems* · /θ/ in *worth* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_project_retrospective_tense_consistency_001
skill: `grammar.retrospective_tense_consistency`
type: `error_correction`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_tenses_review`
distractors:
  - option: "What was gone well in the sprint?"
    br_pt_form: "O que foi ido bem no sprint?"
    note: "'was gone' is not the past of 'go'; the irregular form 'went' is needed"
  - option: "What goes well in the sprint?"
    br_pt_form: "O que vai bem no sprint?"
    note: "the present tense reads as a routine question, not an analysis of the sprint that ended"
  - option: "What did went well in the sprint?"
    br_pt_form: "O que foi que foi bem no sprint?"
    note: "'did' already marks the past, so the main verb must stay in the base form"
```

**Item:**
> Reviewing tense consistency: which question correctly asks about the sprint that just ended?

| Slot | Value |
|------|-------|
| A | "What was gone well in the sprint?" |
| B | **"What went well in the sprint?"** ✓ |
| C | "What goes well in the sprint?" |
| D | "What did went well in the sprint?" |

**Key:** B

**Feedback:**
> **`What went well in the sprint?`** uses the irregular past for a finished event. **A** uses a nonexistent passive form, **C** shifts to the present, and **D** stacks two past markers.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_project_retrospective_meeting_vocab_001
skill: `vocab.retrospective_meeting_vocab`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_meeting_open`
distractors:
  - option: "What did we do yesterday?"
    br_pt_form: "O que fizemos ontem?"
    note: "too narrow for a retrospective; it asks for a log, not for learning"
  - option: "Who is wrong about the handoff?"
    br_pt_form: "Quem está errado sobre o handoff?"
    note: "turns the retro into blame instead of inviting evidence and improvement"
  - option: "When is the next meeting?"
    br_pt_form: "Quando é a próxima reunião?"
    note: "a scheduling question, not the opening of the retro's content"
```

**Item:**
> Reviewing meeting vocabulary: which question opens a retrospective properly?

| Slot | Value |
|------|-------|
| A | "What did we do yesterday?" |
| B | "Who is wrong about the handoff?" |
| C | **"What went well, and what should we improve?"** ✓ |
| D | "When is the next meeting?" |

**Key:** C

**Feedback:**
> **`What went well, and what should we improve?`** sets the two-part frame of a retrospective. **A** limits the answer to yesterday, **B** assigns blame, and **D** only handles the calendar.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `retro_hedging_review` | Item 1 missed | **L2** | Contrast *it seems / maybe / we could / it might be worth* with blunt blame in three short retro notes. |
| `retro_detail_scan` | Items 2 and 4 missed | **L2** | Drill *blocker* vs *action item* vs test result in a five-line sprint summary; keep the cause explicit. |
| `retro_prereq_recycle` | Items 3, 6 and 7 missed | **L2** | Recycle *went well / improve / who owns* with tense consistency from `les_b1_tenses_review` and the meeting frame from `les_a2_meeting_open`. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_tenses_review` and `les_a2_meeting_open` and carry `prereq_lesson` for the interleaving rule; the current lesson introduces `meeting_vocab` and `hedging`, so it is not its own prerequisite.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. The sprint, speakers and all options were authored in a clean room as a fictional scenario; no agile-handbook or other restricted source text is reproduced.
6. The grammar-rag query (*"retrospective meeting what went well improve action items hedging"*) returned unrelated present-perfect and pronoun excerpts; none of its text was used.
