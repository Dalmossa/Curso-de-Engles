# Practice Pack — `les_b2_it_incident_postmortem`
**Reuse basis:** authored_material

**Pack ID:** `pack_les_b2_it_incident_postmortem_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_b2_it_incident_postmortem.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_b2_it_incident_postmortem_v1
lesson_id: les_b2_it_incident_postmortem
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
item_id: grm_it_incident_postmortem_timeline_001
skill: `grammar.past_perfect_timeline`
type: `gap_fill`
difficulty_b: -0.2
cefr: B2
domain: grammar
provenance: authored
distractors:
  - option: "landed"
    br_pt_form: "aterrissou (passado simples)"
    note: "past simple places the change after the alert, reversing the timeline"
  - option: "has landed"
    br_pt_form: "aterrissou (present perfect)"
    note: "present perfect connects the event to now, not to a past reference point"
  - option: "is landing"
    br_pt_form: "está aterrissando (present continuous)"
    note: "progressive aspect cannot describe an event completed before the alert"
```

**Item:**
> In the postmortem timeline, which verb form fits? "By the time the alert fired, the config change ____ four minutes earlier."

| Slot | Value |
|------|-------|
| A | landed |
| B | has landed |
| C | **had landed** ✓ |
| D | is landing |

**Key:** C

**Feedback:**
> **Had landed** is the past perfect for an event completed before another past event. **A** uses past simple and reverses the order, **B** links the change to the present instead of to the alert, and **D** describes an action still in progress.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_it_incident_postmortem_detection_001
skill: `reading.blameless_postmortem`
type: `detail_identification`
difficulty_b: 0.0
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "A customer reported the errors before the alert fired."
    br_pt_form: "Um cliente relatou os erros antes do alerta disparar."
    note: "the detection line credits the alert, not a customer report"
  - option: "The retry policy was the root cause of the missing timeout."
    br_pt_form: "A política de retry foi a causa raiz do timeout ausente."
    note: "the retry policy is listed as a contributing factor, not the root cause"
  - option: "The rollback added the timeout at 14:19."
    br_pt_form: "O rollback adicionou o timeout às 14:19."
    note: "the rollback at 14:07 mitigated; the timeout at 14:19 resolved"
```

**Stimulus:**
> "Postmortem — SEV-2 checkout errors. Timeline: 13:58 config change; 14:02 alert; 14:07 rollback; 14:19 timeout added. Detection: the alert, not a customer report. Root cause: missing timeout in the new config. Contributing factors: retry policy amplified load; queue depth was not on the dashboard. Mitigation: rollback. Resolution: timeout restored. Action items: Priya — timeout by Friday; Rafael — dashboard panel by 25 November; Marina — retry review by 30 November. Follow-up: 3 December. This was a blameless review — we changed the system, not the people."

**Item:**
> Which statement is supported by the postmortem excerpt?

| Slot | Value |
|------|-------|
| A | A customer reported the errors before the alert fired. |
| B | **The alert detected the incident before any customer reported it.** ✓ |
| C | The retry policy was the root cause of the missing timeout. |
| D | The rollback added the timeout at 14:19. |

**Key:** B

**Feedback:**
> The detection line says **the alert, not a customer report**. **A** invents an earlier customer report, **C** promotes a contributing factor to root cause, and **D** merges mitigation at 14:07 with resolution at 14:19.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_it_incident_postmortem_stages_001
skill: `vocab.it_incident_postmortem_glossary`
type: `contextual_selection`
difficulty_b: 0.2
cefr: B2
domain: vocabulary
provenance: authored
distractors:
  - option: "root cause / contributing factor"
    br_pt_form: "causa raiz / fator contribuinte"
    note: "these name causes, not the two stages of the response"
  - option: "resolution / mitigation"
    br_pt_form: "resolução / mitigação"
    note: "this reverses the order of the two response stages"
  - option: "timeline / follow-up"
    br_pt_form: "linha do tempo / acompanhamento"
    note: "timeline is the record and follow-up is a later verification"
```

**Item:**
> "The ____ reduced customer impact at 14:07; the ____ at 14:19 removed the underlying problem." Which pair fits?

| Slot | Value |
|------|-------|
| A | root cause / contributing factor |
| B | resolution / mitigation |
| C | **mitigation / resolution** ✓ |
| D | timeline / follow-up |

**Key:** C

**Feedback:**
> **Mitigation** reduced the impact first; **resolution** removed the underlying problem later. **A** describes causes, **B** swaps the stages, and **D** names the record and the later check instead of the response.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_it_incident_postmortem_action_items_001
skill: `reading.blameless_postmortem`
type: `inference`
difficulty_b: 0.3
cefr: B2
domain: reading
provenance: authored
distractors:
  - option: "It names the person who caused the incident."
    br_pt_form: "Nomeia a pessoa que causou o incidente."
    note: "a blameless review assigns owners for fixes, not fault for the outage"
  - option: "It restates the timeline in chronological order."
    br_pt_form: "Repete a linha do tempo em ordem cronológica."
    note: "the timeline is a separate section of the postmortem"
  - option: "It removes the need for a follow-up."
    br_pt_form: "Elimina a necessidade de acompanhamento."
    note: "the excerpt still schedules a follow-up for 3 December"
```

**Stimulus:**
> "Action items: Priya — add the timeout to the config template by Friday. Rafael — add queue depth to the service dashboard by 25 November. Marina — review the retry policy with the platform team by 30 November. Follow-up: we will verify all three items on 3 December."

**Item:**
> What makes each action item in this excerpt actionable?

| Slot | Value |
|------|-------|
| A | **It has an owner and a due date.** ✓ |
| B | It names the person who caused the incident. |
| C | It restates the timeline in chronological order. |
| D | It removes the need for a follow-up. |

**Key:** A

**Feedback:**
> Each line pairs a named **owner** with a **due date**, which is what makes it an action item. **B** turns ownership into blame, **C** confuses the action list with the timeline, and **D** ignores the scheduled follow-up on 3 December.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_it_incident_postmortem_dental_001
skill: `pronunciation.postmortem_dental_fricatives`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: B2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_it_incident_postmortem_dental_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** /ð/ in *the* is voiced — tongue tip between the teeth, not /d/. /θ/ in *thirty* uses the same place without voice, not /t/ or /s/. Keep /eɪ/ long in *mitigation* and do not insert a vowel after the /kt/ cluster in *impact*.

**Step 2 — produce (ASR-scored):** read aloud:

> "The mitigation reduced the impact within thirty minutes, and the root cause was a missing timeout."

**Target phonemes:** /ð/ in *the* · /eɪ/ in *mitigation* · /θ/ in *thirty* · /kt/ in *impact*, without epenthetic /i/.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_it_incident_postmortem_prereq_001
skill: `grammar.tense_consistency`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B2
domain: grammar
provenance: authored
prereq_lesson: `les_b1_tenses_review`
distractors:
  - option: "The config change lands before the alert fired. We roll back at 14:07 and added the timeout at 14:19."
    br_pt_form: "A mudança de config aterra antes do alerta disparar. Revertemos às 14:07 e adicionamos o timeout às 14:19."
    note: "present forms are mixed with past reference points"
  - option: "The config change had landed before the alert fires. We are rolling back at 14:07 and add the timeout at 14:19."
    br_pt_form: "A mudança de config tinha aterrissado antes de o alerta disparar. Estamos revertendo às 14:07 e adicionamos o timeout às 14:19."
    note: "shifts between past perfect, present and progressive in one timeline"
  - option: "The config change was landing before the alert had fired. We add the timeout at 14:19."
    br_pt_form: "A mudança de config estava aterrissando antes de o alerta ter disparado. Adicionamos o timeout às 14:19."
    note: "progressive and past perfect are misapplied to completed events"
```

**Item:**
> Reviewing tense consistency: which paragraph reports the timeline coherently?

| Slot | Value |
|------|-------|
| A | The config change lands before the alert fired. We roll back at 14:07 and added the timeout at 14:19. |
| B | **The config change had landed before the alert fired. We rolled back at 14:07 and added the timeout at 14:19.** ✓ |
| C | The config change had landed before the alert fires. We are rolling back at 14:07 and add the timeout at 14:19. |
| D | The config change was landing before the alert had fired. We add the timeout at 14:19. |

**Key:** B

**Feedback:**
> Paragraph **B** keeps one past frame — past perfect for the earlier change, past simple for the response. **A** mixes present with past, **C** drifts into present and progressive, and **D** makes completed events sound unfinished.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_it_incident_postmortem_prereq_001
skill: `vocab.it_incident_reporting`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_it_incidents`
distractors:
  - option: "mitigation"
    br_pt_form: "mitigação"
    note: "mitigation reduces impact, it does not describe how the problem was found"
  - option: "resolution"
    br_pt_form: "resolução"
    note: "resolution is the final fix, not the discovery of the incident"
  - option: "follow-up"
    br_pt_form: "acompanhamento"
    note: "follow-up is the later check on action items"
```

**Item:**
> Reviewing incident reports: which term names how the problem was first noticed?

| Slot | Value |
|------|-------|
| A | mitigation |
| B | resolution |
| C | **detection** ✓ |
| D | follow-up |

**Key:** C

**Feedback:**
> **Detection** answers "how did we notice?". **A** reduces impact, **B** is the fix that closes the problem, and **D** is the later verification of the action items.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `postmortem_timeline_past_perfect` | Items 1 and 6 missed | **L2** | Contrast *had landed / landed / has landed* in a five-event incident timeline with explicit timestamps. |
| `postmortem_response_stages` | Items 3 and 7 missed | **L2** | Separate *detection → mitigation → resolution → follow-up* and drill *root cause* versus *contributing factor*. |
| `blameless_action_items` | Items 2 and 4 missed | **L2** | Rewrite fault-assigning sentences as system-focused observations and attach an owner plus a due date to every item. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is rendered (TTS static); it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_b1_tenses_review` and `les_a2_it_incidents` respectively and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss, note and stimulus is authored in a clean room. The postmortem, the people and the timestamps are fictional and 100% original; no text from a restricted source is reproduced or adapted.
6. All seven `item_id` values carry the distinctive token `it_incident_postmortem`, derived from `les_b2_it_incident_postmortem`, and are globally unique.
