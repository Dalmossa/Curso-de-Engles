# Practice Pack — `les_a2_it_clean_code_basics`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_clean_code_basics_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_clean_code_basics.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_clean_code_basics_v1
lesson_id: les_a2_it_clean_code_basics
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
item_id: grm_clean_code_passive_001
skill: `grammar.passive_cleanup_routine`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The cleanup job is run every night, and the old name replaced last week."
    br_pt_form: "O job de limpeza é executado toda noite, e o nome antigo substituiu na semana passada."
    note: "the first clause is passive, but the second has no 'was' and turns the name into the agent"
  - option: "The cleanup job run every night, and the old name was replaced last week."
    br_pt_form: "O job de limpeza executar toda noite, e o nome antigo foi substituído na semana passada."
    note: "a singular subject in the present simple needs the -s ending on the main verb"
  - option: "The cleanup job runs every night, and the old name is replace last week."
    br_pt_form: "O job de limpeza executa toda noite, e o nome antigo é substituir na semana passada."
    note: "'last week' requires the past passive 'was replaced', not the present form 'is replace'"
```

**Item:**
> A review note describes a nightly routine and a rename done last week. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The cleanup job is run every night, and the old name replaced last week." |
| B | "The cleanup job run every night, and the old name was replaced last week." |
| C | "The cleanup job runs every night, and the old name is replace last week." |
| D | **"The cleanup job runs every night, and the old name was replaced last week."** ✓ |

**Key:** D

**Feedback:**
> The routine takes the present simple with a singular subject, and the rename is a past passive: **`The cleanup job runs every night, and the old name was replaced last week.`** **A** drops *was* in the second clause, **B** omits the *-s* in the routine, and **C** mixes a past time with the present form *is replace*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_clean_code_review_note_001
skill: `reading.clean_code_review_note`
type: `detail_identification`
difficulty_b: -0.2
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Build the address in one function."
    br_pt_form: "Construir o endereço em uma única função."
    note: "the address is already built in one function; that is a description, not the proposal"
  - option: "Delete the audit row."
    br_pt_form: "Excluir a linha de auditoria."
    note: "the audit row is listed as a job the function does, not as something to remove"
  - option: "Rename the payment service."
    br_pt_form: "Renomear o serviço de pagamentos."
    note: "the note talks about functions inside a module, never about the service name"
```

**Stimulus:**
> "Review note — `sendInvoiceReminder` builds the address, sends the email, and writes the audit row. The address format appears in `buildLabel` too. Proposal: split the jobs and add a test before moving the code."

**Item:**
> What does the reviewer propose?

| Slot | Value |
|------|-------|
| A | Build the address in one function. |
| B | Delete the audit row. |
| C | **Split the jobs and add a test before moving the code.** ✓ |
| D | Rename the payment service. |

**Key:** C

**Feedback:**
> The word *Proposal* introduces the action: **`Split the jobs and add a test before moving the code.`** **A** restates what the function already does, **B** invents a deletion, and **D** changes the scope from functions to the service.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_clean_code_smells_001
skill: `vocab.clean_code_smell_debt`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "This function has much code smell."
    br_pt_form: "Esta função tem muito cheiro de código."
    note: "'smell' is countable in this sense: use 'a code smell' or 'three code smells'"
  - option: "This function is a code smelling."
    br_pt_form: "Esta função é um cheirando de código."
    note: "the term is the noun phrase 'code smell'; the -ing form does not name the signal"
  - option: "This function has many technical debt."
    br_pt_form: "Esta função tem muitas dívidas técnicas."
    note: "'debt' is uncountable here; the amount phrase is 'much technical debt'"
```

**Item:**
> A colleague points to a long function that does three jobs. Which sentence uses the term correctly?

| Slot | Value |
|------|-------|
| A | "This function has much code smell." |
| B | "This function is a code smelling." |
| C | "This function has many technical debt." |
| D | **"This function has a code smell."** ✓ |

**Key:** D

**Feedback:**
> *Smell* is countable here, so the term takes the article *a*: **`This function has a code smell.`** **A** treats it as uncountable, **B** changes the noun into an -ing form, and **C** applies a plural quantifier to the uncountable noun *debt*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_clean_code_snippet_001
skill: `reading.clean_code_snippet`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The print call."
    br_pt_form: "A chamada print."
    note: "it writes to the screen; it saves nothing outside the function"
  - option: "The label assignment."
    br_pt_form: "A atribuição label."
    note: "the assignment only joins two strings in a local variable"
  - option: "The return line."
    br_pt_form: "A linha return."
    note: "returning a value is not a write to storage"
```

**Stimulus:**

```python
def ship_order(order):
    label = order.street + " " + order.city
    print(label)
    save_audit(order.id, "label printed")
    return label
```

**Item:**
> Besides building the label, which line writes data outside this function?

| Slot | Value |
|------|-------|
| A | The print call. |
| B | The label assignment. |
| C | The return line. |
| D | **The save_audit call.** ✓ |

**Key:** D

**Feedback:**
> Only **`The save_audit call.`** persists information outside the function. **A** prints to the screen, **B** builds a local string, and **C** hands a value back to the caller.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_clean_code_th_v_001
skill: `pronunciation.clean_code_th_v`
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

**Step 1 — hear the contrast:** *three* /θri/ starts with the voiceless dental fricative /θ/: tongue tip between the teeth, no voice. Saying *tree* /tri/ replaces it with /t/ and changes the word. *Behavior* /bɪˈheɪvjər/ carries /v/: upper teeth on the lower lip, with voice; *behaviour* with /w/ is not the en-US word in this lesson.
**Step 2 — produce (ASR-scored):** read aloud:

> "Three small functions do the job, and the behavior is the same."

**Target phonemes:** /θ/ in *three* · /v/ in *behavior* · /ð/ in *the* · /dʒ/ in *job*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_clean_code_prereq_skim_001
skill: `grammar.skim_subject_verb`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "The cleanup job run every night."
    br_pt_form: "O job de limpeza executar toda noite."
    note: "a singular subject needs 'runs' in the present simple"
  - option: "The cleanup jobs runs every night."
    br_pt_form: "Os jobs de limpeza executa toda noite."
    note: "a plural subject takes the base verb, not the -s form"
  - option: "The cleanup job running every night."
    br_pt_form: "O job de limpeza executando toda noite."
    note: "an -ing clause alone has no finite verb; the sentence needs 'runs'"
```

**Item:**
> You skim a review note for the routine sentence. Which one has the right subject–verb pair?

| Slot | Value |
|------|-------|
| A | "The cleanup job run every night." |
| B | "The cleanup jobs runs every night." |
| C | "The cleanup job running every night." |
| D | **"The cleanup job runs every night."** ✓ |

**Key:** D

**Feedback:**
> A singular subject in a present routine takes the *-s* form: **`The cleanup job runs every night.`** **A** drops the ending, **B** adds *-s* to a plural subject, and **C** leaves the sentence without a finite verb.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_clean_code_prereq_terms_001
skill: `vocab.it_terms_basics`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "deploy"
    br_pt_form: "deploy (publicação da versão)"
    note: "a deploy puts a version into production; it is not the saved change itself"
  - option: "log"
    br_pt_form: "log (registro de eventos)"
    note: "a log records events at runtime, not code changes in history"
  - option: "ticket"
    br_pt_form: "ticket (tarefa registrada)"
    note: "a ticket tracks work; the code change is stored in a commit"
```

**Item:**
> Reviewing IT terms in a code review note, which word means a saved change in the code history?

| Slot | Value |
|------|-------|
| A | deploy |
| B | log |
| C | ticket |
| D | **commit** ✓ |

**Key:** D

**Feedback:**
> The stored change is a **`commit`**. A **deploy** ships a version, a **log** records runtime events, and a **ticket** tracks the task — none of them is the saved change itself.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `passive_cleanup_routine` | Item 1 or 6 missed | **L2** | Contrast *the job runs* (routine) with *the name was replaced* (past passive) in short review notes. |
| `smell_countability` | Item 3 missed | **L2** | Drill *a code smell / three code smells* against *much technical debt* in the same review sentence. |
| `review_note_details` | Items 2 and 4 missed | **L2** | Skim a review note and a code snippet for the exact proposal and the line that writes data. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration; listening stays deferred.
3. Items 6 and 7 review `les_a1_reading_skimming` and `les_a2_it_terms_basics` and carry `prereq_lesson` for the interleaving rule.
4. The grammar items and the countability drill follow the two base points of the lesson: present simple/passive routines and countable vs uncountable nouns.
5. Items target authored lesson content; no external source text is reproduced.
