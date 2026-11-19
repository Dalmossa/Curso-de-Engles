# Practice Pack — `les_a2_writing_past`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_writing_past_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_writing_past.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_writing_past_v1
lesson_id: les_a2_writing_past
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
item_id: grm_past_narrative_sequence_001
skill: `grammar.past_narrative_sequence`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "First, the deploy finished at 09:02. Then, the error rate goes up. Finally, we rolled back."
    br_pt_form: "Primeiro, o deploy terminou às 09:02. Depois, a taxa de erro sobe. Por fim, fizemos rollback."
    note: "'goes up' is present and breaks the past-simple timeline of a closed incident"
  - option: "First, the deploy finish at 09:02. Then, the error rate went up. Finally, we rolled back."
    br_pt_form: "Primeiro, o deploy termina às 09:02. Depois, a taxa de erro subiu. Por fim, fizemos rollback."
    note: "'finish' carries no past marking; BR-PT learners leave the verb in the present because the context supplies the time"
  - option: "First, finished the deploy at 09:02. Then, went up the error rate. Finally, we rolled back."
    br_pt_form: "Primeiro, terminou o deploy às 09:02. Depois, subiu a taxa de erro. Por fim, fizemos rollback."
    note: "verb-first order is L1 transfer; en-US needs an explicit subject before each verb"
```

**Item:**
> You are writing the summary of a closed incident. Which version keeps the whole timeline in past simple?

| Slot | Value |
|------|-------|
| A | "First, the deploy finished at 09:02. Then, the error rate goes up. Finally, we rolled back." |
| B | **"First, the deploy finished at 09:02. Then, the error rate went up. Finally, we rolled back."** ✓ |
| C | "First, the deploy finish at 09:02. Then, the error rate went up. Finally, we rolled back." |
| D | "First, finished the deploy at 09:02. Then, went up the error rate. Finally, we rolled back." |

**Key:** B

**Feedback:**
> A closed incident is narrated with one consistent tense: **`finished` → `went up` → `rolled back`**. **A** switches to present in *goes up*, **C** leaves *finish* unmarked, and **D** drops the subjects and inverts SVO order.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_past_narrative_incident_note_001
skill: `reading.incident_note_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "A failed deploy window."
    br_pt_form: "Uma janela de deploy falhada."
    note: "the deploy finished; the note never describes the window as failed"
  - option: "A new alert rule."
    br_pt_form: "Uma nova regra de alerta."
    note: "the engineer saw an alert, but no rule was found in the settings"
  - option: "A missing log file."
    br_pt_form: "Um arquivo de log ausente."
    note: "the logs were checked and available; nothing is said about a missing file"
```

**Stimulus:**
> "Incident note 09:26 — The deploy finished at 09:02. The error rate went up and the queue was growing. I checked the logs and found a bad config in the queue settings. We rolled back at 09:26 and the service recovered."

**Item:**
> What did the author find in the queue settings?

| Slot | Value |
|------|-------|
| A | A failed deploy window. |
| B | **A bad config.** ✓ |
| C | A new alert rule. |
| D | A missing log file. |

**Key:** B

**Feedback:**
> The note says *I found a bad config in the queue settings*: **`A bad config.`** **A** confuses the finished deploy with a failed window, **C** turns the alert into a rule, and **D** invents a missing log that was in fact read.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_past_narrative_connectors_001
skill: `vocab.past_narrative_connectors`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Eventually"
    br_pt_form: "Eventualmente / no fim"
    note: "'eventually' closes the sequence with an outcome; it does not mark a parallel action"
  - option: "Afterward"
    br_pt_form: "Depois disso"
    note: "'afterward' is a later action, not one happening alongside the main timeline"
  - option: "Suddenly"
    br_pt_form: "De repente"
    note: "'suddenly' marks an unexpected event, not simultaneity"
```

**Item:**
> You are writing the retro summary. Which connector introduces an action happening at the same time as the main timeline?

| Slot | Value |
|------|-------|
| A | Eventually |
| B | **Meanwhile** ✓ |
| C | Afterward |
| D | Suddenly |

**Key:** B

**Feedback:**
> **`Meanwhile`** is the parallel-action marker: *Meanwhile, the queue was growing.* **A** (*eventually*) reports the final outcome — and is not "talvez" —, **C** (*afterward*) moves the story forward, and **D** (*suddenly*) signals a surprise.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_past_narrative_postmortem_001
skill: `reading.postmortem_sequence`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Alert seen → cache nodes restarted → job stopped → latency normal."
    br_pt_form: "Alerta visto → nós de cache reiniciados → job parado → latência normal."
    note: "reverses the first two events; the cache nodes restarted before the alert was seen"
  - option: "Job stopped → alert seen → cache nodes restarted → latency normal."
    br_pt_form: "Job parado → alerta visto → nós de cache reiniciados → latência normal."
    note: "puts the stop before the alert; the alert is what triggered the stop"
  - option: "Cache nodes restarted → alert seen → batch job kept writing → latency normal."
    br_pt_form: "Nós de cache reiniciados → alerta visto → job em lote continuou escrevendo → latência normal."
    note: "swaps the parallel writing with the alert; the job was already writing when the nodes restarted"
```

**Stimulus:**
> "Post-mortem draft — First, the cache nodes restarted at 21:10. Meanwhile, the batch job kept writing to the old table. Then, the on-call engineer saw the latency alert. We stopped the job at 21:18 and pointed it to the new table. Finally, latency was back to normal at 21:25."

**Item:**
> In which order did the events happen?

| Slot | Value |
|------|-------|
| A | Alert seen → cache nodes restarted → job stopped → latency normal. |
| B | Job stopped → alert seen → cache nodes restarted → latency normal. |
| C | **Cache nodes restarted → batch job kept writing → alert seen → job stopped.** ✓ |
| D | Cache nodes restarted → alert seen → batch job kept writing → latency normal. |

**Key:** C

**Feedback:**
> The connectors fix the order: **`First` restarts → `Meanwhile` writing → `Then` alert → stop → `Finally` normal.** **A** and **B** move the alert out of its place, and **D** treats the parallel writing as if it began after the alert.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_past_narrative_ed_final_001
skill: `pronunciation.ed_past_final`
type: `minimal_pair_production`
difficulty_b: 0.2
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *walked* /wɔːkt/ ends in /t/ and has one syllable; *walk-ed* read as two syllables is not an English word. *Started* /ˈstɑːrtɪd/ really does take /ɪd/ because the stem ends in /t/; *recovered* /rɪˈkʌvərd/ ends in /d/ with no extra syllable.

**Step 2 — produce (ASR-scored):** read aloud:

> "I checked the logs, started the rollback, and recovered the service at 09:26."

**Target phonemes:** /t/ in *checked, walked* · /ɪd/ in *started* · /d/ in *recovered* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_past_narrative_irregular_001
skill: `grammar.past_simple_irregular`
type: `error_correction`
difficulty_b: -0.5
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_regular_verbs_past
distractors:
  - option: "I didn't saw the alert."
    br_pt_form: "Eu não vi o alerta."
    note: "the past is already carried by 'didn't', so 'saw' is a double past — a frequent BR-PT transfer"
  - option: "I didn't seen the alert."
    br_pt_form: "Eu não tinha visto o alerta."
    note: "'seen' is the past participle and needs have/had; it cannot follow 'didn't'"
  - option: "I don't see the alert."
    br_pt_form: "Eu não vejo o alerta."
    note: "present tense changes the time reference; the incident note describes a closed event"
```

**Item:**
> Reviewing past forms before you write the incident summary, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I didn't saw the alert." |
| B | **"I didn't see the alert."** ✓ |
| C | "I didn't seen the alert." |
| D | "I don't see the alert." |

**Key:** B

**Feedback:**
> After *didn't* the verb returns to its base form: **`I didn't see the alert.`** **A** doubles the past (*didn't saw*), **C** uses the participle (*didn't seen*), and **D** shifts the closed incident into the present.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_past_narrative_report_terms_001
skill: `vocab.incident_report_terms`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_deadlines_tasks
distractors:
  - option: "to restart"
    br_pt_form: "reiniciar"
    note: "restarting runs the same version again; it does not restore an older deploy"
  - option: "to follow up"
    br_pt_form: "dar follow-up / acompanhar"
    note: "follow up means to check again later, not to undo a change"
  - option: "to bring up"
    br_pt_form: "subir (um serviço)"
    note: "bring up starts a service; it says nothing about returning to the previous version"
```

**Item:**
> Reviewing follow-up vocabulary, a colleague needs one verb for the changelog: "return to the previous deploy version". Which verb fits?

| Slot | Value |
|------|-------|
| A | to restart |
| B | **to roll back** ✓ |
| C | to follow up |
| D | to bring up |

**Key:** B

**Feedback:**
> Undoing a deploy is **`to roll back`**: *We rolled back at 09:26.* **A** (*restart*) runs the same code again, **C** (*follow up*) is a later check, and **D** (*bring up*) only starts a service.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `past_sequence_timeline` | Item 1 missed | **L2** | Rebuild a three-step incident timeline with *First / Then / Finally* in one consistent tense. |
| `past_connector_contrast` | Item 3 missed | **L2** | Contrast *meanwhile* (parallel), *eventually* (outcome — not "talvez") and *afterward* (later) in short retro lines. |
| `irregular_past_negation` | Item 6 missed | **L2** | Drill *didn't + base* against *didn't saw / didn't seen* with the same alert sentence. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; its Gates carry **⚠️ blocked on render** until the clip is rendered.
3. Items 6 and 7 review `les_a1_regular_verbs_past` and `les_a2_deadlines_tasks` and carry `prereq_lesson` for the interleaving rule.
4. The six scored MCQ items carry a quoted `br_pt_form` and a `note` on every distractor; item 5 declares `not_applicable_no_distractor_set` by design.
5. Items target authored lesson content only; no external source text is reproduced or adapted.
