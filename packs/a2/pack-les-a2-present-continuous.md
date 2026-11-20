# Practice Pack — `les_a2_present_continuous`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_present_continuous_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_present_continuous.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_present_continuous_v1
lesson_id: les_a2_present_continuous
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
item_id: grm_present_continuous_workflows_001
skill: `grammar.present_continuous_workflows`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "She is update the checkout screen right now."
    br_pt_form: "Ela está atualizar a tela de checkout agora."
    note: "the auxiliary is there but the main verb stays in the base form; Brazilian speakers carry the Portuguese infinitive after estar into English"
  - option: "She updates the checkout screen right now."
    br_pt_form: "Ela atualiza a tela de checkout agora."
    note: "present simple is chosen because Portuguese allows the simple present for an action in progress; right now forces be + -ing in English"
  - option: "She updating the checkout screen right now."
    br_pt_form: "Ela atualizando a tela de checkout agora."
    note: "the participle is present but the auxiliary is dropped, mirroring the Portuguese reduced form using apenas o gerúndio"
```

**Item:**
> During a daily, a teammate says what she is doing at this moment. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "She is update the checkout screen right now." |
| B | "She updates the checkout screen right now." |
| C | **"She is updating the checkout screen right now."** ✓ |
| D | "She updating the checkout screen right now." |

**Key:** C

**Feedback:**
> An action in progress at the moment of speaking uses *be* + verb-*ing*: **`She is updating the checkout screen right now.`** **A** leaves the verb in the base form after *is*, **B** uses the routine tense with *right now*, and **D** drops the auxiliary *is*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_workflow_progress_001
skill: `reading.workflow_progress`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Fixing the retry logic in the payment worker."
    br_pt_form: "Corrigindo a lógica de retry no worker de pagamentos."
    note: "the first speaker claims this task; the question asks specifically about Duda"
  - option: "Writing the incident notes."
    br_pt_form: "Escrevendo as notas do incidente."
    note: "that is Rafa's task in the note, so it matches the wrong person"
  - option: "Updating the checkout screen."
    br_pt_form: "Atualizando a tela de checkout."
    note: "that is Lu's task; the reader matches the activity but not the name"
```

**Stimulus:**
> "Daily note — I'm fixing the retry logic in the payment worker. Lu is updating the checkout screen and is testing it on a slow connection. Duda is watching the dashboards because the login service is still timing out. Rafa is writing the incident notes before the two o'clock deploy."

**Item:**
> What is Duda doing at the moment?

| Slot | Value |
|------|-------|
| A | "Fixing the retry logic in the payment worker." |
| B | "Writing the incident notes." |
| C | **"Watching the dashboards."** ✓ |
| D | "Updating the checkout screen." |

**Key:** C

**Feedback:**
> The note says **Duda is watching the dashboards**, so **C** is the detail asked for. **A** belongs to the writer, **B** belongs to Rafa, and **D** belongs to Lu — each distractor swaps the owner of the activity.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_workflow_in_progress_001
skill: `vocab.workflow_in_progress`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "I'm working in the retry logic for the payment worker."
    br_pt_form: "Estou trabalhando na lógica de retry do worker de pagamentos."
    note: "Portuguese uses the same preposition na for place and task; English requires work on for the thing you are developing"
  - option: "I work the retry logic for the payment worker right now."
    br_pt_form: "Eu trabalho a lógica de retry do worker de pagamentos agora."
    note: "work is intransitive here and needs on; the present simple also clashes with right now"
  - option: "I'm making the retry logic for the payment worker now."
    br_pt_form: "Estou fazendo a lógica de retry do worker de pagamentos agora."
    note: "fazer is mapped to make, but English says work on a fix or a task in this context"
```

**Item:**
> You are telling your team which task is in progress. Which sentence is natural?

| Slot | Value |
|------|-------|
| A | "I'm working in the retry logic for the payment worker." |
| B | **"I'm working on the retry logic for the payment worker."** ✓ |
| C | "I work the retry logic for the payment worker right now." |
| D | "I'm making the retry logic for the payment worker now." |

**Key:** B

**Feedback:**
> The collocation for a task you are developing is ***work on***: **`I'm working on the retry logic for the payment worker.`** **A** uses the preposition of place, **C** drops both the progressive and the preposition, and **D** translates *fazer* as *make* where English prefers *work on*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_workflow_status_note_001
skill: `reading.workflow_status_note`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Retrying failed jobs every minute."
    br_pt_form: "Tentando novamente jobs falhados a cada minuto."
    note: "that is the routine in present simple; the question asks what happens at the moment"
  - option: "Checking the deploy queue before lunch."
    br_pt_form: "Verificando a fila de deploy antes do almoço."
    note: "that is what the writer is doing today, not what the worker is doing"
  - option: "Showing the wrong status on the dashboard."
    br_pt_form: "Mostrando o status errado no dashboard."
    note: "the old dashboard shows the wrong status; the worker is not the dashboard"
```

**Stimulus:**
> "Handoff note: Usually I check the deploy queue at nine, but today I'm checking it before lunch. The worker retries failed jobs every minute; at the moment it's retrying the payment batch. The old dashboard is still showing the wrong status, so we're not using it."

**Item:**
> What is the worker doing at the moment?

| Slot | Value |
|------|-------|
| A | "Retrying failed jobs every minute." |
| B | "Checking the deploy queue before lunch." |
| C | **"Retrying the payment batch."** ✓ |
| D | "Showing the wrong status on the dashboard." |

**Key:** C

**Feedback:**
> The phrase **at the moment it's retrying the payment batch** answers the question, so **C** is correct. **A** is the worker's routine rather than the current action, **B** describes the writer, and **D** describes the old dashboard.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_present_continuous_ing_001
skill: `pronunciation.present_continuous_ing`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_present_continuous_ing_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *check* /tʃek/ ends in /k/, while *checking* /ˈtʃekɪŋ/ adds /ɪŋ/ with a velar nasal /ŋ/ at the end. *Fixing* /ˈfɪksɪŋ/ keeps the short vowel /ɪ/, not the long /iː/ of Portuguese "fixar". Brazilian speakers tend to replace /ŋ/ with /n/ or add an extra vowel after it.

**Step 2 — produce (ASR-scored):** read aloud:

> "I'm checking the queue and fixing the retry logic right now."

**Target phonemes:** /ŋ/ ending *checking* and *fixing* · short /ɪ/ in *fixing* · /aɪm/ in *I'm* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_present_simple_routine_001
skill: `grammar.present_simple_routine`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The worker retry failed jobs every minute."
    br_pt_form: "O worker tentar novamente jobs falhados a cada minuto."
    note: "the third person singular needs the -s ending; Portuguese does not mark person on the verb"
  - option: "The worker is retry failed jobs every minute."
    br_pt_form: "O worker está tentar novamente jobs falhados a cada minuto."
    note: "mixes the auxiliary is with the base verb, and a routine does not take the progressive"
  - option: "The worker retrying failed jobs every minute."
    br_pt_form: "O worker tentando novamente jobs falhados a cada minuto."
    note: "the -ing form has no auxiliary and cannot carry a routine on its own"
```

**Item:**
> Reviewing the present simple for routines before the daily, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The worker retry failed jobs every minute." |
| B | **"The worker retries failed jobs every minute."** ✓ |
| C | "The worker is retry failed jobs every minute." |
| D | "The worker retrying failed jobs every minute." |

**Key:** B

**Feedback:**
> For a routine, the present simple takes the third-person ending: **`The worker retries failed jobs every minute.`** **A** omits the *-s*, **C** mixes *is* with the base verb, and **D** uses a bare *-ing* form. The ending is **-ies** because the base ends in a consonant plus *y*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_workflow_routine_verbs_001
skill: `vocab.workflow_routine_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "I see the logs at nine every morning."
    br_pt_form: "Eu vejo os logs às nove toda manhã."
    note: "ver is mapped to see, but the routine action of examining logs is expressed by check"
  - option: "I watch the logs at nine every morning."
    br_pt_form: "Eu assisto os logs às nove toda manhã."
    note: "assistir leads to watch; watch fits a screen in motion, not a routine log review"
  - option: "I look the logs at nine every morning."
    br_pt_form: "Eu olho os logs às nove toda manhã."
    note: "olhar is translated as look, but look needs the preposition at before a direct object"
```

**Item:**
> Reviewing routine vocabulary for a handoff note, which sentence says "eu checo os logs às nove toda manhã"?

| Slot | Value |
|------|-------|
| A | "I see the logs at nine every morning." |
| B | "I watch the logs at nine every morning." |
| C | **"I check the logs at nine every morning."** ✓ |
| D | "I look the logs at nine every morning." |

**Key:** C

**Feedback:**
> Examining logs as a routine is ***check***: **`I check the logs at nine every morning.`** **A** uses *see* for *ver*, **B** uses *watch* from *assistir*, and **D** uses *look* without the required preposition *at*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `present_continuous_be_ing` | Item 1 missed | **L2** | Rebuild *be* + verb-*ing* in daily updates; drill the dropped auxiliary and the bare infinitive. |
| `present_simple_vs_continuous` | Items 4 and 6 missed | **L2** | Contrast *usually / every minute* with *right now / at the moment* in the same handoff note. |
| `work_on_task_collocation` | Item 3 missed | **L2** | Recycle *work on the ticket / work on the fix* against *work in* and *make*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` — the lesson whose §4.3 row lists `present_simple_regular` as a new skill — and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced or adapted.
5. `item_id` values are emitted without backticks in this canonical pack; `skill` and `type` keep backticks so the prefix-to-namespace check still parses them.
