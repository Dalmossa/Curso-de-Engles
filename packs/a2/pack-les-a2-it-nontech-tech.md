# Practice Pack — `les_a2_it_nontech_tech`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_nontech_tech_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_nontech_tech.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_nontech_tech_v1
lesson_id: les_a2_it_nontech_tech
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
item_id: grm_nontech_wh_infinitive_001
skill: `grammar.nontech_wh_infinitive`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "I can show you what to back up the file."
    br_pt_form: "Eu posso te mostrar o que fazer backup do arquivo."
    note: "'what' asks which file, but the file is already named; the missing information is the method"
  - option: "I can show you how back up the file."
    br_pt_form: "Eu posso te mostrar como fazer backup do arquivo."
    note: "the question word needs the infinitive marker 'to' before the base verb"
  - option: "I can show you how to backing up the file."
    br_pt_form: "Eu posso te mostrar como a fazer backup do arquivo."
    note: "after 'to' the verb stays in the base form, not the -ing form"
```

**Item:**
> You are giving Carla the backup steps before the deploy. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I can show you what to back up the file." |
| B | **"I can show you how to back up the file."** ✓ |
| C | "I can show you how back up the file." |
| D | "I can show you how to backing up the file." |

**Key:** B

**Feedback:**
> *How to back up* names the method: **`I can show you how to back up the file.`** **A** switches the question word to *what*, which would ask which file to choose; **C** omits the required *to*; **D** puts the verb in the *-ing* form after *to*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_nontech_release_delay_001
skill: `reading.nontech.release_delay`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Friday, with the demo."
    br_pt_form: "Sexta, com a demonstração."
    note: "Friday is the demo window; the database change is explicitly moved off Friday"
  - option: "Sunday night."
    br_pt_form: "Domingo à noite."
    note: "Sunday night is the backup window, not the time of the change"
  - option: "Before Friday, with the password update."
    br_pt_form: "Antes de sexta, com a atualização da senha."
    note: "the note gives no date for the password update"
```

**Stimulus:**
> "Release note: the demo environment stays open on Friday. The database change moves to Monday at 09:00. We will back up the files on Sunday night. Please update your password before the change."

**Item:**
> When will the database change happen?

| Slot | Value |
|------|-------|
| A | Friday, with the demo. |
| B | Sunday night. |
| C | **Monday at 09:00.** ✓ |
| D | Before Friday, with the password update. |

**Key:** C

**Feedback:**
> The note says **`The database change moves to Monday at 09:00.`** **A** confuses the demo window with the change, **B** takes the backup window as the change time, and **D** invents a date for the password update.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_nontech_plain_analogy_001
skill: `vocab.nontech.plain_language_terms`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "She is using jargon to sound technical."
    br_pt_form: "Ela está usando jargão para parecer técnica."
    note: "jargon would make the explanation harder, not easier; the sentence compares the change to a familiar place"
  - option: "She is reporting a phishing email."
    br_pt_form: "Ela está relatando um e-mail de phishing."
    note: "no email or security incident appears in her sentence"
  - option: "She is scheduling the deploy for Monday."
    br_pt_form: "Ela está agendando o deploy para segunda-feira."
    note: "she gives no day and no deploy time; she only draws a comparison"
```

**Item:**
> Bia says: "It is like moving books to a new library shelf." What is she doing?

| Slot | Value |
|------|-------|
| A | "She is using jargon to sound technical." |
| B | **"She is giving an analogy in plain language."** ✓ |
| C | "She is reporting a phishing email." |
| D | "She is scheduling the deploy for Monday." |

**Key:** B

**Feedback:**
> A comparison with something familiar is **`an analogy in plain language`**. **A** inverts the purpose of plain language, **C** changes the topic to security, and **D** turns the comparison into a schedule.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_nontech_update_notice_001
skill: `reading.nontech.update_notice`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "It was stolen in the phishing email."
    br_pt_form: "Ela foi roubada no e-mail de phishing."
    note: "the notice says no one clicked the link; it never says the password was stolen"
  - option: "The Wi-Fi team will change it."
    br_pt_form: "O time de Wi-Fi vai mudá-la."
    note: "the Wi-Fi sentence is a separate note about the meeting-room network"
  - option: "It stays the same until Friday."
    br_pt_form: "Ela continua a mesma até sexta-feira."
    note: "the notice gives Monday for the update and mentions no Friday deadline"
```

**Stimulus:**
> "Security notice: a phishing email reached the sales team this morning. No one clicked the link. We will update the shared password on Monday. The Wi-Fi in the meeting room is fine — use the guest network if your laptop cannot connect."

**Item:**
> What does the notice say about the shared password?

| Slot | Value |
|------|-------|
| A | It was stolen in the phishing email. |
| B | The Wi-Fi team will change it. |
| C | **It will be updated on Monday.** ✓ |
| D | It stays the same until Friday. |

**Key:** C

**Feedback:**
> The notice states **`We will update the shared password on Monday.`** **A** adds a theft the note denies, **B** attaches the password to the unrelated Wi-Fi line, and **D** replaces Monday with an invented Friday deadline.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_nontech_deploy_stress_001
skill: `pronunciation.nontech_deploy_password_stress`
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

**Step 1 — hear the contrast:** *de-PLOY* /dɪˈplɔɪ/ puts the stress on the second syllable, while *DE-ploy* sounds like a Brazilian Portuguese adaptation; *PASSWORD* /ˈpæsˌwɜːrd/ keeps the stress on the first syllable, with a weak second one. *Phishing* starts with /f/, the same sound as *photo* — never /p/.

**Step 2 — produce (ASR-scored):** read aloud:

> "We will deploy on Monday, so update the password before the phishing test."

**Target phonemes:** /dɪˈplɔɪ/ with second-syllable stress in *deploy* · /ˈpæsˌwɜːrd/ with first-syllable stress in *password* · /f/ in *phishing* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_nontech_wh_questions_001
skill: `grammar.nontech_wh_questions`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_wh_questions
distractors:
  - option: "What you click first?"
    br_pt_form: "O que você clica primeiro?"
    note: "a direct wh-question needs the auxiliary 'do' before the subject"
  - option: "What click you first?"
    br_pt_form: "O que clica você primeiro?"
    note: "the verb cannot come before the subject in a direct question"
  - option: "What do you clicking first?"
    br_pt_form: "O que você está clicando primeiro?"
    note: "after the auxiliary 'do' the main verb stays in the base form"
```

**Item:**
> Reviewing wh-questions before you explain the steps, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "What you click first?" |
| B | **"What do you click first?"** ✓ |
| C | "What click you first?" |
| D | "What do you clicking first?" |

**Key:** B

**Feedback:**
> A direct question uses *wh-word + do/does + subject + base verb*: **`What do you click first?`** **A** drops the auxiliary, **C** inverts verb and subject, and **D** puts the main verb in the *-ing* form after *do*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_nontech_scan_signal_001
skill: `vocab.nontech.status_board_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "Demo: GREEN"
    br_pt_form: "Demonstração: VERDE"
    note: "green says the demo is available now, not that the deploy is still pending"
  - option: "Backup: DONE"
    br_pt_form: "Backup: CONCLUÍDO"
    note: "done means the backup was completed, the opposite of pending"
  - option: "Phishing alert: CLOSED"
    br_pt_form: "Alerta de phishing: ENCERRADO"
    note: "closed means the alert was resolved, not that a release is waiting"
```

**Item:**
> Scan this status board: "Demo: GREEN · Backup: DONE · Deploy: SCHEDULED · Phishing alert: CLOSED". Which item shows the deploy has not happened yet?

| Slot | Value |
|------|-------|
| A | "Demo: GREEN" |
| B | "Backup: DONE" |
| C | **"Deploy: SCHEDULED"** ✓ |
| D | "Phishing alert: CLOSED" |

**Key:** C

**Feedback:**
> **`Deploy: SCHEDULED`** is the entry that marks a future action. **A** reports availability, **B** reports a finished backup, and **D** reports a resolved alert — scanning for the status word is what separates them.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `wh_infinitive_steps` | Item 1 or item 6 missed | **L2** | Contrast *What do you click first?* with *I don't know what to click first* so the direct question and the wh-+infinitive pattern stop competing. |
| `plain_language_analogy` | Item 3 missed | **L2** | Recycle *analogy*, *jargon* and *in plain language* by rewriting one technical sentence as a kitchen or library comparison. |
| `release_detail_scan` | Items 2, 4 or 7 missed | **L2** | Skim the release note for the date, scan the security notice for the action, then scan the status board for the pending state. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_wh_questions` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. Item 2's release note and item 4's security notice use distinct detail targets (the change date vs. the password action), so neither can be answered from the other's sentence.
5. Item 1 and item 6 both carry wh-forms but test different structures (infinitive complement vs. direct-question inversion), so they do not collapse into one another.
6. All analogies, dialogues, stimuli and distractors were authored for this pack; no external source text is reproduced or adapted.
