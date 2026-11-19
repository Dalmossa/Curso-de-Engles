# Practice Pack — `les_a2_it_word_formation`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_word_formation_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_word_formation.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_word_formation_v1
lesson_id: les_a2_it_word_formation
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
item_id: grm_word_formation_derived_noun_001
skill: `grammar.word_formation_derived_form`
type: `contextual_selection`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The configure is ready."
    br_pt_form: "O configure está pronto."
    note: "'configure' is a verb; after 'the' in this release note you need the derived noun"
  - option: "The configuring is ready."
    br_pt_form: "O configurating está pronto."
    note: "the -ing form names an action in progress, not the set of settings in the repo"
  - option: "The configurator is ready."
    br_pt_form: "O configurador está pronto."
    note: "a configurator is a person or tool that configures, not the configuration itself"
```

**Item:**
> You are writing a release note. Which sentence uses the correct noun derived from *configure*?

| Slot | Value |
|------|-------|
| A | "The configure is ready." |
| B | **"The configuration is ready."** ✓ |
| C | "The configuring is ready." |
| D | "The configurator is ready." |

**Key:** B

**Feedback:**
> The noun from *configure* is **`configuration`**: *The configuration is ready.* **A** keeps the bare verb after *the*, **C** uses the -ing action form, and **D** names the agent that performs the configuration.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_word_formation_ticket_scan_001
skill: `reading.word_formation_ticket_scan`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "un- in uninstalled"
    br_pt_form: "un- em uninstalled"
    note: "un- reverses or removes an action; it does not mark repetition"
  - option: "mis- in misread"
    br_pt_form: "mis- em misread"
    note: "mis- marks an action done wrongly, not one done again"
  - option: "pre- in pre-check"
    br_pt_form: "pre- em pre-check"
    note: "pre- places an action before another one, not a second time"
```

**Stimulus:**
> "Ticket note: the retry job is blocked. Actually, the misread flag sits in the config file. Currently the worker is down. Please re-run the pre-check once the package is uninstalled."

**Item:**
> Which prefix in the note carries the meaning *again*?

| Slot | Value |
|------|-------|
| A | un- in uninstalled |
| B | mis- in misread |
| C | pre- in pre-check |
| D | **re- in retry** ✓ |

**Key:** D

**Feedback:**
> **`re-` in *retry*** is the prefix for *again*; *re-run* repeats the check. **A** removes the package, **B** points to a wrong reading, and **C** names the check that happens before the run.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_word_formation_prefix_uninstall_001
skill: `vocab.word_formation_prefixes`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "It repeats the action."
    br_pt_form: "Ele repete a ação."
    note: "re- is the prefix for again; un- does not repeat the installation"
  - option: "It means before the action."
    br_pt_form: "Ele significa antes da ação."
    note: "pre- marks time order, as in pre-check, not removal"
  - option: "It marks a wrong action."
    br_pt_form: "Ele marca uma ação errada."
    note: "mis- marks an error, as in misread; un- marks reversal"
```

**Item:**
> A colleague says "Please uninstall the old agent." What does the prefix `un-` do in that word?

| Slot | Value |
|------|-------|
| A | "It repeats the action." |
| B | **"It reverses the action."** ✓ |
| C | "It means before the action." |
| D | "It marks a wrong action." |

**Key:** B

**Feedback:**
> **`un-` reverses the action**: *uninstall* removes what was installed. **A** describes *re-* (*retry*), **C** describes *pre-* (*pre-check*), and **D** describes *mis-* (*misread*).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_word_formation_cognate_detail_001
skill: `reading.word_formation_cognate_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "A misread configuration change."
    br_pt_form: "Uma alteração de configuração lida errado."
    note: "the misread flag is mentioned, but not as the current state introduced by 'currently'"
  - option: "The replacement planned for later."
    br_pt_form: "A substituição planejada para depois."
    note: "the future replacement is the 'eventually' clause, not the 'currently' clause"
  - option: "The end of the incident."
    br_pt_form: "O fim do incidente."
    note: "the note never says the incident ended; 'pretend' refers to the old path"
```

**Stimulus:**
> "Stand-up note: actually, the timeout started in the worker. Currently we keep the legacy endpoint up. Eventually the new worker will replace it. We do not pretend the old path is gone."

**Item:**
> According to the note, what does *currently* describe?

| Slot | Value |
|------|-------|
| A | A misread configuration change. |
| B | **The legacy endpoint still being up.** ✓ |
| C | The replacement planned for later. |
| D | The end of the incident. |

**Key:** B

**Feedback:**
> *Currently* introduces **`we keep the legacy endpoint up`**, so **B** is the detail. **A** belongs to the *actually* correction, **C** belongs to the *eventually* clause, and **D** is not stated in the note.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_word_formation_stress_001
skill: `pronunciation.word_formation_stress`
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

**Step 1 — hear the contrast:** *RE-try* /ˈriːtraɪ/ keeps a long vowel in the prefix, while *configuration* /kənˌfɪɡjəˈreɪʃən/ ends in /ʃən/, not in a Portuguese-style *-cion*. *ACTually* /ˈæktʃuəli/ and *eVENTually* /ɪˈventʃuəli/ carry the /tʃ/ glide in different syllable positions, and *support* /səˈpɔːrt/ puts the stress on the second syllable.

**Step 2 — produce (ASR-scored):** read aloud:

> "Actually, the configuration needs a retry; we support the legacy endpoint."

**Target phonemes:** /riː/ in *retry* · /ʃən/ in *configuration* · /ˈæktʃuəli/ in *actually* · /səˈpɔːrt/ in *support* (stress on the second syllable).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_word_formation_present_s_001
skill: `grammar.present_simple_s`
type: `error_correction`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_present_simple
distractors:
  - option: "The configuration reload every minute."
    br_pt_form: "A configuração recarregar a cada minuto."
    note: "a singular subject needs -s on the present simple verb"
  - option: "The configurations reloads every minute."
    br_pt_form: "As configurações recarregam a cada minuto."
    note: "a plural subject takes the base verb; -s belongs to the third-person singular"
  - option: "The configuration is reload every minute."
    br_pt_form: "A configuração é recarregar a cada minuto."
    note: "the passive needs a past participle; here the subject performs the action"
```

**Item:**
> Reviewing the present simple in a release note, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The configuration reload every minute." |
| B | "The configurations reloads every minute." |
| C | "The configuration is reload every minute." |
| D | **"The configuration reloads every minute."** ✓ |

**Key:** D

**Feedback:**
> A singular subject takes **-s** in the present simple: **`The configuration reloads every minute.`** **A** omits the ending, **B** adds it to a plural subject, and **C** mixes *be* with a base verb where no passive is intended.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_word_formation_it_terms_root_001
skill: `vocab.it_terms_root_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "agent"
    br_pt_form: "agente"
    note: "an agent is a program that acts on your behalf, not a settings file"
  - option: "endpoint"
    br_pt_form: "endpoint"
    note: "an endpoint is the address of a service, not the file that stores settings"
  - option: "retry job"
    br_pt_form: "tarefa de repetição"
    note: "a retry job repeats a failed step; it does not hold configuration"
```

**Item:**
> Skim this stand-up note: "agent • endpoint • config file • retry job". Which entry names the file that holds settings?

| Slot | Value |
|------|-------|
| A | "agent" |
| B | "endpoint" |
| C | "retry job" |
| D | **"config file"** ✓ |

**Key:** D

**Feedback:**
> **`config file`** is the entry for the file that stores settings. **A** is a program that acts for you, **B** is a service address, and **C** is the step that repeats a failed action.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `prefix_job_mapping` | Item 1 or item 3 missed | **L2** | Contrast `un-`, `re-`, `pre-` and `mis-` in short ticket lines, tying each prefix to one job: reverse, again, before, wrongly. |
| `deceptive_cognate_cards` | Item 2, item 4 or FASE 4 check 1 missed | **L2** | Recycle *actually*, *currently*, *eventually*, *pretend* and *support* as pt-BR ↔ en-US meaning cards instead of literal glosses. |
| `derived_form_boundary` | Item 5 or FASE 4 check 2 missed | **L2** | Rebuild *configure → configuration*, *deploy → deployment* and *reuse → reusable* from the same root before adding the -s agreement rule. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Every MCQ offers four options that differ by more than case, and every distractor carries a distinct `br_pt_form` plus a `note`.
5. The ticket dialogue, derivatives, cognate glosses, stimuli and distractors were authored for this pack; no external source text is reproduced or adapted.
