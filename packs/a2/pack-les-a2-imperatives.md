# Practice Pack — `les_a2_imperatives`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_imperatives_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_imperatives.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_imperatives_v1
lesson_id: les_a2_imperatives
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
item_id: grm_imperatives_base_form_001
skill: `grammar.imperatives_base_form`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "To restart the service after the deploy."
    br_pt_form: "Para reiniciar o serviço depois do deploy."
    note: "Portuguese 'para reiniciar' is carried into English as to + verb; a runbook step uses the bare imperative"
  - option: "You restart the service after the deploy."
    br_pt_form: "Você reinicia o serviço depois do deploy."
    note: "an explicit subject describes what someone does; the instruction drops the subject and the verb stays in the base form"
  - option: "Restarting the service after the deploy."
    br_pt_form: "Reiniciando o serviço depois do deploy."
    note: "the Portuguese gerund 'reiniciando' maps onto -ing, which cannot stand alone as a finite instruction"
```

**Item:**
> A tech lead is dictating the next step of a rollback. Choose the correct instruction.

| Slot | Value |
|------|-------|
| A | "To restart the service after the deploy." |
| B | "You restart the service after the deploy." |
| C | "Restarting the service after the deploy." |
| D | **"Restart the service after the deploy."** ✓ |

**Key:** D

**Feedback:**
> A runbook step is an imperative: the verb starts the sentence in the base form, with no subject, no *to* and no *-ing*. **A** uses the Portuguese infinitive pattern *para reiniciar*, **B** keeps the subject and turns the command into a description, and **C** uses the gerund. This is the same contrast as *You have to turn left* (necessity) versus *Turn left* (the instruction itself).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_imperatives_runbook_steps_001
skill: `reading.imperatives_runbook`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Close the ticket."
    br_pt_form: "Feche o ticket."
    note: "the note says the opposite: do not close the ticket yet; Brazilian readers latch onto the last noun and invert the instruction"
  - option: "Roll back past release 218."
    br_pt_form: "Reverta para antes da release 218."
    note: "the note explicitly forbids this with Don't; the negative marker is easy to skip when scanning a runbook"
  - option: "Copy the tag from the incident channel."
    br_pt_form: "Copie a tag do canal de incidente."
    note: "the tag comes from the dashboard, not the channel; a salient noun gets attached to the wrong source"
```

**Stimulus:**
> "Rollback note 14:20 — The checkout deploy failed the health check. First, check the last green release in the dashboard. Don't roll back past release 218. Then copy the tag and click 'Rollback'. Wait for the login test before you post the status in the incident channel. Don't close the ticket yet."

**Item:**
> What must the engineer do before posting the status in the incident channel?

| Slot | Value |
|------|-------|
| A | "Close the ticket." |
| B | "Roll back past release 218." |
| C | **"Wait for the login test."** ✓ |
| D | "Copy the tag from the incident channel." |

**Key:** C

**Feedback:**
> The note orders the steps: **`Wait for the login test before you post the status`**. **A** contradicts the final *Don't close the ticket*, **B** is the step the note forbids with *Don't roll back past release 218*, and **D** changes where the tag comes from. The *before* clause is what makes the order checkable.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_imperatives_procedure_verbs_001
skill: `vocab.imperatives_procedure_verbs`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Return back to the last green release."
    br_pt_form: "Retornar de volta para a última release verde."
    note: "calque of 'retornar de volta'; English keeps one direction marker, and the deploy phrasal verb is roll back"
  - option: "Come back to the last green release."
    br_pt_form: "Voltar para a última release verde."
    note: "'voltar para' maps onto come back, which describes returning to a place, not reverting a deployment"
  - option: "Turn back the last green release."
    br_pt_form: "Virar de volta a última release verde."
    note: "word-for-word rendering of 'virar de volta'; turn back means to reverse direction, not to restore a release"
```

**Item:**
> The new release broke the health check. Which verb phrase tells the on-call engineer to restore the last green release?

| Slot | Value |
|------|-------|
| A | "Return back to the last green release." |
| B | **"Roll back to the last green release."** ✓ |
| C | "Come back to the last green release." |
| D | "Turn back the last green release." |

**Key:** B

**Feedback:**
> In deploy language, restoring an earlier release is **`roll back`**: **`Roll back to the last green release.`** **A** doubles the direction with *return back* (from *retornar de volta*), **C** uses the movement verb *come back*, and **D** is a calque of *virar de volta*. The noun *rollback* names the button or the operation; *roll back* is the action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_imperatives_sequence_001
skill: `reading.imperatives_sequence`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Drain the queue."
    br_pt_form: "Drenar a fila."
    note: "draining is the first step, before the restart; the marker 'first' is easy to overlook when the noun 'queue' looks familiar"
  - option: "Re-run the queue."
    br_pt_form: "Rodar a fila de novo."
    note: "the re-run comes after the dashboard check, not immediately after the restart; 'after that' carries the order"
  - option: "Post 'resolved' in the channel."
    br_pt_form: "Postar 'resolvido' no canal."
    note: "that is the final step, signalled by 'finally', so it cannot follow the restart immediately"
```

**Stimulus:**
> "Handover note — To reset a stuck deploy, first drain the queue. Then restart the worker and check the dashboard. After that, re-run the queue. Finally, post 'resolved' in the channel. Don't delete the failed job before the replay finishes."

**Item:**
> What happens immediately after the worker restarts?

| Slot | Value |
|------|-------|
| A | **"Check the dashboard."** ✓ |
| B | "Drain the queue." |
| C | "Re-run the queue." |
| D | "Post 'resolved' in the channel." |

**Key:** A

**Feedback:**
> The note says **`Then restart the worker and check the dashboard`**, so the dashboard check is the very next action. **B** is the step before the restart (*first drain the queue*), **C** comes later (*after that*), and **D** is the final step (*finally*). The sequence markers, not the order of nouns, decide the answer.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_imperatives_final_stop_001
skill: `pronunciation.imperatives_final_stop`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: TTS_render_pending
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *check* /tʃek/ closes with /k/ and *checks* /tʃeks/ adds /s/; the imperative keeps the bare verb, so no /s/ belongs there. *paste* /peɪst/ ends in the /st/ cluster, which Brazilian Portuguese tends to break with an extra vowel ("pásti"). *first* /fɜːst/ carries the same cluster after a central vowel.
**Step 2 — produce (ASR-scored):** read aloud:

> "Check the log, paste the tag, and don't stop the worker."

**Target phonemes:** /k/ closing *check* · /st/ cluster in *paste* and *first*, no epenthetic vowel · /t/ closing *don't* · no third-person /s/ on the imperative verbs.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_imperatives_psq_present_simple_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The health check pass every time I deploy."
    br_pt_form: "O health check passa toda vez que eu faço deploy."
    note: "Portuguese marks no third-person ending, so the singular subject loses the English -s"
  - option: "The health check is pass every time I deploy."
    br_pt_form: "O health check está passando toda vez que eu faço deploy."
    note: "the Portuguese progressive 'está passando' gets carried into a bare be + verb construction"
  - option: "The health check passing every time I deploy."
    br_pt_form: "O health check passando toda vez que eu faço deploy."
    note: "the gerund 'passando' maps onto -ing, but a gerund alone is not a finite present"
```

**Item:**
> Reviewing the present simple before you write the status update, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The health check pass every time I deploy." |
| B | **"The health check passes every time I deploy."** ✓ |
| C | "The health check is pass every time I deploy." |
| D | "The health check passing every time I deploy." |

**Key:** B

**Feedback:**
> A recurring fact with a singular subject takes the present simple with **-s**: **`The health check passes every time I deploy.`** **A** drops **-s** because Portuguese has no such ending, **C** inserts *be* before the bare verb, and **D** leaves a gerund with no auxiliary. This is the same third-person marker that the imperative deliberately drops in *Check the health check*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_imperatives_psq_email_verbs_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please annex the log file to the incident ticket."
    br_pt_form: "Por favor, anexe o arquivo de log ao ticket de incidente."
    note: "Portuguese 'anexar' maps onto attach; annex in English adds territory or a building"
  - option: "Please reply the log file to the incident ticket."
    br_pt_form: "Por favor, responda com o arquivo de log para o ticket de incidente."
    note: "reply answers a sender; it does not add a file to a record"
  - option: "Please forward the log file to the incident ticket."
    br_pt_form: "Por favor, encaminhe o arquivo de log para o ticket de incidente."
    note: "forward sends a message onward to a person, which is a different action from attaching a file to a ticket"
```

**Item:**
> Reviewing the email basics, the runbook says to add the log file to the incident ticket before you close it. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Please annex the log file to the incident ticket." |
| B | "Please reply the log file to the incident ticket." |
| C | "Please forward the log file to the incident ticket." |
| D | **"Please attach the log file to the incident ticket."** ✓ |

**Key:** D

**Feedback:**
> Adding a file to a ticket is **`attach`**: **`Please attach the log file to the incident ticket.`** **A** uses the false friend *annex*, **B** answers a sender instead of adding a file, and **C** sends a message onward to a person. The instruction itself is polite rather than a bare imperative because the runbook is quoting an email step.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `imperatives_base_form` | Item 1 missed | **L2** | Rebuild *Restart the service* against *to restart*, *you restart* and *restarting* in short runbook steps. |
| `imperatives_runbook_reading` | Items 2 and 4 missed | **L2** | Extract the order of steps from *first / then / after that / finally* and audit the *don't* instructions before answering. |
| `present_simple_regular_review` | Item 6 missed | **L2** | Drill the third-person **-s** in status updates (*the health check passes*) and contrast it with the subject-free imperative. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Every `item_id` carries the `imperatives` token so it cannot collide with ids from the other lessons authored in this wave.
5. Item 1's feedback records the grammar-rag distinction between *have to* (necessity) and the imperative (the instruction itself).
6. Items target authored lesson content; no external source text is reproduced.
