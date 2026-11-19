# Practice Pack — `les_a2_it_incidents`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_incidents_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_incidents.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_incidents_v1
lesson_id: les_a2_it_incidents
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
item_id: grm_incidents_timeline_past_001
skill: `grammar.past_simple_timeline`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The alert fires at 14:02 and the on-call wakes up."
    br_pt_form: "O alerta dispara às 14:02 e o plantonista acorda."
    note: "present simple reports a routine, not a completed event in an incident timeline"
  - option: "The alert is firing at 14:02 and the on-call is waking up."
    br_pt_form: "O alerta está disparando às 14:02 e o plantonista está acordando."
    note: "present continuous describes something in progress, not the logged detection"
  - option: "The alert will fire at 14:02 and the on-call will wake up."
    br_pt_form: "O alerta vai disparar às 14:02 e o plantonista vai acordar."
    note: "future tense predicts an event, but the report records what already happened"
```

**Item:**
> You are writing the incident timeline. Which line reports two completed events?

| Slot | Value |
|------|-------|
| A | "The alert fires at 14:02 and the on-call wakes up." |
| B | **"The alert fired at 14:02 and the on-call woke up."** ✓ |
| C | "The alert is firing at 14:02 and the on-call is waking up." |
| D | "The alert will fire at 14:02 and the on-call will wake up." |

**Key:** B

**Feedback:**
> A timeline uses the past simple: **`The alert fired at 14:02 and the on-call woke up.`** **A** is a routine, **C** is an action in progress, and **D** is a prediction — none of them records a finished detection.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_incidents_severity_impact_001
skill: `reading.incident_report_timeline`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The alert was detected for the first time."
    br_pt_form: "O alerta foi detectado pela primeira vez."
    note: "detection happened at 14:02, before the rollback at 14:09"
  - option: "The status page was updated after the postmortem."
    br_pt_form: "A página de status foi atualizada depois do postmortem."
    note: "the status page was updated during response; the postmortem is scheduled for Friday"
  - option: "The root cause was confirmed."
    br_pt_form: "A causa raiz foi confirmada."
    note: "the report explicitly says the root cause is still under investigation"
```

**Stimulus:**
> "SEV-2 — Checkout API. Detection: 14:02. Impact: twenty percent of checkouts failed. Mitigation: rollback to 3.8.0 at 14:09. Status page updated; escalation to payments done. Root cause: under investigation. Blameless postmortem on Friday, with one action item owned by Rafa."

**Item:**
> What happened at 14:09?

| Slot | Value |
|------|-------|
| A | The alert was detected for the first time. |
| B | **The team rolled back to 3.8.0 as mitigation.** ✓ |
| C | The status page was updated after the postmortem. |
| D | The root cause was confirmed. |

**Key:** B

**Feedback:**
> The timeline line says **`Mitigation: rollback to 3.8.0 at 14:09.`** **A** moves detection from 14:02 to 14:09, **C** invents an order after the postmortem, and **D** contradicts *under investigation*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_incidents_postmortem_001
skill: `vocab.it_internet_terms`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "status page"
    br_pt_form: "página de status"
    note: "the status page communicates current state to users, not a written analysis"
  - option: "mitigation"
    br_pt_form: "mitigação"
    note: "mitigation is the temporary action taken during the incident response"
  - option: "escalation"
    br_pt_form: "escalonamento"
    note: "escalation brings another team in; it is not the review that follows"
```

**Item:**
> Which term names the written review that focuses on the system, not on the person? "We scheduled a ______ for Friday."

| Slot | Value |
|------|-------|
| A | status page |
| B | mitigation |
| C | **blameless postmortem** ✓ |
| D | escalation |

**Key:** C

**Feedback:**
> **`Blameless postmortem`** is the review that examines the system and produces action items. **A** is the public status page, **B** is the temporary fix during response, and **D** is the handoff to another team.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_incidents_status_page_001
skill: `reading.incident_status_update`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Resolved, and the postmortem is closed."
    br_pt_form: "Resolvido, e o postmortem foi encerrado."
    note: "the update says the team is monitoring, and the postmortem is still ahead"
  - option: "Escalated to payments with no owner."
    br_pt_form: "Escalado para pagamentos sem responsável."
    note: "escalation is complete and Rafa owns the action item"
  - option: "Detected for the first time."
    br_pt_form: "Detectado pela primeira vez."
    note: "first detection was at 14:02; this update is from 15:10"
```

**Stimulus:**
> "Update 15:10 — Errors are down after the rollback. We are monitoring the checkout API, and the status page says 'Monitoring'. The root cause is still under investigation. Rafa owns one action item: add a rollback check by Friday. Bia will write the blameless postmortem."

**Item:**
> What is the current service status in this update?

| Slot | Value |
|------|-------|
| A | Resolved, and the postmortem is closed. |
| B | **Monitoring after the rollback.** ✓ |
| C | Escalated to payments with no owner. |
| D | Detected for the first time. |

**Key:** B

**Feedback:**
> The update says **`We are monitoring the checkout API`** and the status page reads *Monitoring*. **A** upgrades monitoring to resolved, **C** ignores the named owner, and **D** confuses the 14:02 detection with the 15:10 update.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_incidents_sev_acronyms_001
skill: `pronunciation.incident_acronyms`
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

**Step 1 — hear the contrast:** *SEV* is read letter by letter, /es iː viː/ — the *E* is long, not the /e/ of *set*. *Outage* is /ˈaʊtɪdʒ/: the diphthong starts open, and the final /dʒ/ has no extra vowel. Brazilian learners often flatten /aʊ/ toward /o/ and say *page* with a final Portuguese vowel instead of /eɪdʒ/.

**Step 2 — produce (ASR-scored):** read aloud:

> "SEV-2: an outage on the status page — twenty percent of checkouts."

**Target phonemes:** /iː/ in *SEV* · /aʊ/ in *outage* · /dʒ/ in *outage* and *page*, without epenthetic /ɪ/ · /eɪ/ in *page* · /t/ final in *percent*, released without an added vowel.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_incidents_compound_head_001
skill: `grammar.compound_head_agreement`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "The status page updates was late."
    br_pt_form: "As atualizações da página de status foi atrasado."
    note: "a plural head needs 'were', and a single update would need 'update'"
  - option: "The status pages update were late."
    br_pt_form: "A atualização das páginas de status foram atrasadas."
    note: "the singular head 'update' cannot take 'were'"
  - option: "The status page update were late."
    br_pt_form: "A atualização da página de status foram atrasadas."
    note: "one update is singular, so the verb must be 'was'"
```

**Item:**
> Reviewing IT noun compounds: which sentence has the correct head and verb for **one** update on the status page?

| Slot | Value |
|------|-------|
| A | "The status page updates was late." |
| B | "The status pages update were late." |
| C | **"The status page update was late."** ✓ |
| D | "The status page update were late." |

**Key:** C

**Feedback:**
> The head is *update* (singular), so the verb is *was*: **`The status page update was late.`** **A** pairs a plural head with *was*, **B** keeps a plural modifier with *were*, and **D** uses *were* for one update.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_incidents_buying_time_001
skill: `vocab.buying_time_phrases`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_ask_for_help
distractors:
  - option: "Wait — I'm busy right now."
    br_pt_form: "Espera — estou ocupado agora."
    note: "this dismisses the requester instead of politely holding the turn"
  - option: "I'll answer tomorrow."
    br_pt_form: "Vou responder amanhã."
    note: "a delay of a day is not buying a moment during an incident"
  - option: "What? Say it again."
    br_pt_form: "O quê? Diga de novo."
    note: "asking for repetition is not the same as asking for time to check"
```

**Item:**
> Reviewing help requests: the commander asks for an incident update and you need a moment to check the dashboard. Which line buys time politely?

| Slot | Value |
|------|-------|
| A | **"Give me a moment to check the status page."** ✓ |
| B | "Wait — I'm busy right now." |
| C | "I'll answer tomorrow." |
| D | "What? Say it again." |

**Key:** A

**Feedback:**
> **`Give me a moment to check the status page.`** holds the turn with a clear reason. **B** is abrupt, **C** postpones beyond the incident, and **D** asks for repetition instead of time.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `incident_timeline_past` | Item 1 missed | **L2** | Contrast *fires / fired / is firing / will fire* in a three-line detection → mitigation → status note with explicit times. |
| `incident_detail_scan` | Items 2 and 4 missed | **L2** | Drill scanning a short update for time, impact and current status; separate *monitoring* from *resolved* and *under investigation* from *confirmed*. |
| `incident_term_register` | Item 3, 6 and 7 missed | **L2** | Recycle *SEV-2 / outage / mitigation / root cause / blameless postmortem*, singular compound heads, and a polite *give me a moment* before an update. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and is blocked on render; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` (`grammar.compound_head_agreement`) and `les_a2_ask_for_help` (`vocab.buying_time_phrases`) and carry `prereq_lesson` for the interleaving rule.
4. `br_pt_form_coverage: 6/6` counts the six scored MCQ items; item 5 is correctly `not_applicable_no_distractor_set`.
5. Every option, gloss and note is authored in a clean room; no restricted source text is reproduced. The incident terms *SEV*, *status page* and *postmortem* are generic technical vocabulary, not quoted material.
