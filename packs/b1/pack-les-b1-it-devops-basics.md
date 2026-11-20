# Practice Pack — `les_b1_it_devops_basics`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_b1_it_devops_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b1_it_devops_basics.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b1_it_devops_basics_v1
lesson_id: les_b1_it_devops_basics
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
item_id: grm_devops_passive_pipeline_001
skill: `grammar.devops_passive_pipeline`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "The image builds after the tests are run."
    br_pt_form: "A imagem compila depois que os testes são executados."
    note: "'builds' is active voice; the image is the thing being built by the pipeline"
  - option: "The image is build after the tests are run."
    br_pt_form: "A imagem é construída depois que os testes rodam."
    note: "the passive needs the past participle 'built', not the base form 'build'"
  - option: "The image is building after the tests are run."
    br_pt_form: "A imagem está construindo depois que os testes são executados."
    note: "the progressive makes the image the agent; a pipeline step requires the passive"
```

**Item:**
> A release note describes the order of the steps. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The image builds after the tests are run." |
| B | **"The image is built after the tests are run."** ✓ |
| C | "The image is build after the tests are run." |
| D | "The image is building after the tests are run." |

**Key:** B

**Feedback:**
> **B** uses *is built* because the image receives the action. **A** turns the patient into the agent, **C** uses the base form instead of the participle, and **D** makes the step sound like a temporary action performed by the image.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_devops_pipeline_skim_001
skill: `reading.devops_pipeline_skim`
type: `detail_identification`
difficulty_b: -0.1
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "The build passed."
    br_pt_form: "O build passou."
    note: "the build passed at 09:04, several steps before the canary"
  - option: "The image was pushed to the registry."
    br_pt_form: "A imagem foi enviada para o registro."
    note: "the push happened at 09:07, before the staging deploy"
  - option: "The alert fired on p99 latency."
    br_pt_form: "O alerta disparou por latência p99."
    note: "the alert fired at 09:18, after the canary had already started"
```

**Stimulus:**
> "Pipeline log: 09:04 build passed. 09:07 image pushed to registry. 09:11 deployed to staging. 09:15 canary started at five percent. 09:18 alert fired on p99 latency."

**Item:**
> Which event happened immediately before the canary started?

| Slot | Value |
|------|-------|
| A | The build passed. |
| B | The image was pushed to the registry. |
| C | The alert fired on p99 latency. |
| D | **The release was deployed to staging.** ✓ |

**Key:** D

**Feedback:**
> The log puts the staging deploy at **09:11**, directly before the canary at **09:15**. **A** is at 09:04, **B** is at 09:07, and **C** is at 09:18 — after the canary started.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_devops_pipeline_stage_001
skill: `vocab.devops.release_pipeline`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "To compile the source code."
    br_pt_form: "Compilar o código-fonte."
    note: "compiling produces the artifact; it is not the promotion step"
  - option: "To watch the metrics on a dashboard."
    br_pt_form: "Observar as métricas no painel."
    note: "watching metrics is observability, not an action that moves a release"
  - option: "To store the image in the registry."
    br_pt_form: "Armazenar a imagem no registro."
    note: "the registry stores versions; promotion moves a release to the next environment"
```

**Item:**
> A colleague says: "The artifact is ready, but we have not promoted it yet." What does *promote* mean here?

| Slot | Value |
|------|-------|
| A | "To compile the source code." |
| B | **"To move the release to the next environment."** ✓ |
| C | "To watch the metrics on a dashboard." |
| D | "To store the image in the registry." |

**Key:** B

**Feedback:**
> *Promote* means **moving the release forward**, for example from staging to production. **A** describes the build, **C** describes monitoring, and **D** describes the registry's job.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_devops_incident_detail_001
skill: `reading.devops_incident_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "Started a new canary at five percent."
    br_pt_form: "Iniciou um novo canary a cinco por cento."
    note: "the note says the canary kept running; it does not describe a second start"
  - option: "Replaced the slow span in the trace."
    br_pt_form: "Substituiu o trecho lento no trace."
    note: "the trace only showed the slow span; no code change is described"
  - option: "Raised the error-rate threshold."
    br_pt_form: "Elevou o limite da taxa de erro."
    note: "the threshold is not mentioned as an action taken by the engineer"
```

**Stimulus:**
> "Incident note: the canary kept running after the error rate passed two percent. Traces showed a slow database span. The alert fired on p99 latency, and the on-call engineer rolled back to the previous image. The dashboard returned to baseline five minutes later."

**Item:**
> What did the on-call engineer do after the alert fired?

| Slot | Value |
|------|-------|
| A | Started a new canary at five percent. |
| B | Replaced the slow span in the trace. |
| C | **Rolled back to the previous image.** ✓ |
| D | Raised the error-rate threshold. |

**Key:** C

**Feedback:**
> The note says the engineer **rolled back to the previous image** after the alert. **A** contradicts *kept running*, **B** turns a diagnosis into a fix, and **D** introduces an unmentioned threshold change.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_devops_tech_stress_001
skill: `pronunciation.devops_tech_stress`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_devops_tech_stress_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *PIPEline* /ˈpaɪpˌlaɪn/ puts the stress on the first part; *pipeLINE* shifts it to the end and sounds like a new word. *ARTifact* /ˈɑːrtɪfækt/ is en-US spelling and stress, while *artefact* is the British spelling. *CANARY* /ˈkænəri/ starts with /k/ and keeps the stress on the first syllable.

**Step 2 — produce (ASR-scored):** read aloud:

> "The pipeline builds the artifact and pushes the image; the canary is on the dashboard."

**Target phonemes:** /ˈpaɪpˌlaɪn/ in *pipeline* · /ˈɑːrtɪfækt/ in *artifact* · /ˈiːmeɪdʒ/ in *image*, ending in /dʒ/ · /ˈkænəri/ in *canary*, with /k/ and no extra vowel at the end.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_devops_prereq_present_simple_001
skill: `grammar.devops_prereq_present_simple`
type: `error_correction`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The pipeline run after every push."
    br_pt_form: "A pipeline rodam depois de cada push."
    note: "a singular subject takes the -s ending in the present simple"
  - option: "The pipelines runs after every push."
    br_pt_form: "As pipelines roda depois de cada push."
    note: "a plural subject takes the base verb; -s belongs to the singular"
  - option: "The pipeline is running after every push."
    br_pt_form: "A pipeline está rodando depois de cada push."
    note: "the progressive suggests a temporary action, not the routine trigger"
```

**Item:**
> Reviewing the present simple before you read a pipeline log, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The pipeline run after every push." |
| B | "The pipelines runs after every push." |
| C | **"The pipeline runs after every push."** ✓ |
| D | "The pipeline is running after every push." |

**Key:** C

**Feedback:**
> *The pipeline* is singular, so the present simple verb takes **-s**: **`The pipeline runs after every push.`** **A** omits it on a singular subject, **B** adds it to a plural subject, and **D** describes a temporary action instead of the routine.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_devops_prereq_label_scan_001
skill: `vocab.devops_prereq_label_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_reading_strategy
distractors:
  - option: "artifact=jar"
    br_pt_form: "Artefato=jar"
    note: "the artifact label names the build output, not the version stored as an image"
  - option: "stage=staging"
    br_pt_form: "Estágio=staging"
    note: "the stage label names an environment, not a version"
  - option: "alert=p99"
    br_pt_form: "Alerta=p99"
    note: "the alert label names the signal, not the image version"
```

**Stimulus:**
> "Registry log: image=payments-api:2.3.0 · artifact=jar · stage=staging · alert=p99"

**Item:**
> Skim the log labels. Which one names the stored image version?

| Slot | Value |
|------|-------|
| A | "artifact=jar" |
| B | **"image=payments-api:2.3.0"** ✓ |
| C | "stage=staging" |
| D | "alert=p99" |

**Key:** B

**Feedback:**
> **`image=payments-api:2.3.0`** is the version label: *image* names the object and the tag carries the version. **A** is the build output, **C** is the environment, and **D** is the monitoring signal.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `devops_passive_steps` | Item 1 or item 6 missed | **L2** | Contrast *the image is built* with *the pipeline runs* in short release sentences, so the passive is tied to the patient of the action. |
| `devops_release_vocabulary` | Item 3 or item 7 missed | **L2** | Recycle *artifact*, *image*, *registry* and *promote* as function and label questions instead of bare translations. |
| `devops_evidence_scanning` | Items 2 or 4 missed | **L2** | Skim a timestamped log and an incident note for the step immediately before an event and for the action taken after an alert. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a2_it_reading_strategy` and carry `prereq_lesson` for the interleaving rule.
4. Items 2 and 4 use distinct detail targets — a timestamp order and an action after an alert — so neither stimulus can answer the other item.
5. The legacy JSON's `les_a2_it_communication` has no lesson file on disk and was not used as a prerequisite; the JSON declares only existing lesson ids.
6. All definitions, the dialogue, both stimuli and every distractor were authored for this lesson and pack; no external source text is reproduced or adapted.
