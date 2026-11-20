# Practice Pack — `les_a1_regular_verbs_past`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a1_regular_verbs_past_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a1_regular_verbs_past.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-16

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a1_regular_verbs_past_v1
lesson_id: les_a1_regular_verbs_past
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
item_id: `grm_past_ed_rules_001`
skill: `grammar.past_simple_regular_ed`
type: `contextual_selection`
difficulty_b: -0.5
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "I fix the login bug yesterday."
    br_pt_form: "Eu corrijo o bug de login ontem."
    note: "present form of the verb; an action completed yesterday needs the past simple"
  - option: "I fixing the login bug yesterday."
    br_pt_form: "Eu corrigindo o bug de login ontem."
    note: "incomplete gerund form without an auxiliary verb such as was"
  - option: "I fixes the login bug yesterday."
    br_pt_form: "Ele corrige o bug de login ontem."
    note: "third-person singular present; matches he or she, not I, and does not mark the past"
```

**Item:**
> You write your standup update. Yesterday you corrected a login bug. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "I fix the login bug yesterday." |
| B | "I fixing the login bug yesterday." |
| C | **"I fixed the login bug yesterday."** ✓ |
| D | "I fixes the login bug yesterday." |

**Key:** C

**Feedback:**
> **`I fixed the login bug yesterday.`** uses base + *-ed* for an action completed in the past. **A** stays in the present, **B** lacks an auxiliary (*was fixing*), and **D** is the *he/she/it* present form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: `grm_past_ed_rules_002`
skill: `grammar.past_simple_spelling_rules`
type: `error_correction`
difficulty_b: -0.1
cefr: A1
domain: grammar
provenance: authored
distractors:
  - option: "We stoped the deploy at noon."
    br_pt_form: "Nós paramos o deploy ao meio-dia."
    note: "single p; short verbs ending in vowel plus single consonant double it before -ed"
  - option: "We stoppped the deploy at noon."
    br_pt_form: "Nós suspendemos o deploy ao meio-dia."
    note: "over-doubles the consonant to ppp and still misses the -ed ending"
  - option: "We stopped the deploy in noon."
    br_pt_form: "Nós paramos o deploy em o meio-dia."
    note: "correct spelling but wrong preposition; a fixed time point takes at, not in"
```

**Item:**
> Choose the correctly spelled report.

| Slot | Value |
|------|-------|
| A | "We stoped the deploy at noon." |
| B | "We stoppped the deploy at noon." |
| C | **"We stopped the deploy at noon."** ✓ |
| D | "We stopped the deploy in noon." |

**Key:** C

**Feedback:**
> **`We stopped the deploy at noon.`** doubles the final consonant once before *-ed*. **A** keeps a single *p*, **B** over-doubles and drops the ending, and **D** spells the verb correctly but uses the wrong preposition.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: `voc_past_ed_rules_001`
skill: `vocab.past.regular_verb_forms`
type: `contextual_selection`
difficulty_b: 0.0
cefr: A1
domain: vocabulary
provenance: authored
distractors:
  - option: "check"
    br_pt_form: "verificar"
    note: "base form; it does not mark that the action happened yesterday"
  - option: "checking"
    br_pt_form: "verificando"
    note: "present participle; it needs an auxiliary such as was to form the past"
  - option: "checks"
    br_pt_form: "verifica"
    note: "third-person singular present; used with he, she or it, not with I"
```

**Item:**
> Complete the sentence with the correct form: "Yesterday I ____ the CI pipeline twice."

| Slot | Value |
|------|-------|
| A | "check" |
| B | "checking" |
| C | **"checked"** ✓ |
| D | "checks" |

**Key:** C

**Feedback:**
> **`checked`** is base + *-ed* and fits *Yesterday I…*. **A** and **D** are present forms, and **B** is a participle that requires an auxiliary (*was checking*).

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Vocabulary, prerequisite review

```yaml
item_id: `voc_occupations_past_002`
skill: `vocab.occupations.review`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A1
domain: vocabulary
provenance: authored
prereq_lesson: `les_a1_occupations`
distractors:
  - option: "She work as a support engineer last year."
    br_pt_form: "Ela trabalhar como engenheira de suporte no ano passado."
    note: "base form after a third-person subject; also lacks the -ed ending"
  - option: "She working as a support engineer last year."
    br_pt_form: "Ela trabalhando como engenheira de suporte no ano passado."
    note: "participle without the auxiliary was"
  - option: "She works as a support engineer last year."
    br_pt_form: "Ela trabalha como engenheira de suporte no ano passado."
    note: "present tense; contradicts the finished time marker last year"
```

**Item:**
> Last year your friend had a job in support. Which sentence reports this correctly?

| Slot | Value |
|------|-------|
| A | "She work as a support engineer last year." |
| B | "She working as a support engineer last year." |
| C | **"She worked as a support engineer last year."** ✓ |
| D | "She works as a support engineer last year." |

**Key:** C

**Feedback:**
> **`She worked as a support engineer last year.`** marks a finished period with the *-ed* form. **A** and **D** stay in the present, and **B** drops the auxiliary *was*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Reading, current lesson

```yaml
item_id: `rdg_past_ed_rules_001`
skill: `reading.past_context_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: A1
domain: reading
provenance: authored
distractors:
  - option: "Opened the ticket and tested the fix."
    br_pt_form: "Abriu o ticket e testou a correção."
    note: "omits the third action reported in the message, closing the old issue"
  - option: "Closed the ticket and opened the issue."
    br_pt_form: "Fechou o ticket e abriu a issue."
    note: "inverts the two actions; the speaker opened the ticket and closed the issue"
  - option: "Tested the customer in the afternoon."
    br_pt_form: "Testou o cliente à tarde."
    note: "nonsense paraphrase; the speaker tested the fix and received the customer answer"
```

**Stimulus:**
> "Yesterday I opened the ticket, tested the fix, and closed the old issue. The customer answered in the afternoon."

**Item:**
> What did the speaker do yesterday?

| Slot | Value |
|------|-------|
| A | "Opened the ticket and tested the fix." |
| B | "Closed the ticket and opened the issue." |
| C | "Tested the customer in the afternoon." |
| D | **"Opened the ticket, tested the fix, and closed the old issue."** ✓ |

**Key:** D

**Feedback:**
> The message lists all three actions, so **`Opened the ticket, tested the fix, and closed the old issue.`** is complete. **A** drops one action, **B** reverses them, and **C** misreads the object of *tested*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Reading, prerequisite review

```yaml
item_id: `rdg_occupations_profile_002`
skill: `reading.occupations_profile`
type: `detail_identification`
difficulty_b: -0.3
cefr: A1
domain: reading
provenance: authored
prereq_lesson: `les_a1_occupations`
distractors:
  - option: "Data engineer."
    br_pt_form: "Engenheira de dados."
    note: "this is her new job, not the previous one"
  - option: "Release manager."
    br_pt_form: "Gerente de release."
    note: "she helped the release team but did not manage it"
  - option: "Support agent."
    br_pt_form: "Agente de suporte."
    note: "plausible tech role, but it is not mentioned in the text"
```

**Stimulus:**
> "Ana worked as a QA analyst for two years. She tested mobile apps and helped the release team. Last month she started a new job as a data engineer."

**Item:**
> What was Ana's job before her new position?

| Slot | Value |
|------|-------|
| A | "Data engineer." |
| B | **"QA analyst."** ✓ |
| C | "Release manager." |
| D | "Support agent." |

**Key:** B

**Feedback:**
> The text states **`Ana worked as a QA analyst for two years`**, and only later that she started a new job. **A** is the new role, while **C** and **D** are not in the text.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, current lesson

```yaml
item_id: `prn_past_ed_rules_001`
skill: `pronunciation.ed_endings`
type: `minimal_pair_production`
difficulty_b: -0.1
cefr: A1
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_past_ed_rules_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *worked* ends in /t/ and *wanted* ends in /ɪd/, one extra syllable; *lived* ends in /d/ with no extra syllable. The difference comes from the sound just before *-ed*.

**Step 2 — produce (ASR-scored):** read aloud:

> "I worked on the ticket and wanted another coffee."

**Target phonemes:** /t/ in *worked* · /ɪd/ in *wanted* · /d/ in *lived* · no epenthetic vowel inside the final cluster of *worked*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `past_ed_spelling_rules` | Item 2 missed | **L2** | Drill doubling before *-ed* (*stop → stopped*, *plan → planned*) and no doubling after two consonants (*start → started*). |
| `past_ed_base_forms` | Item 1 or 3 missed | **L2** | Rebuild base + *-ed* forms in standup sentences (*fixed, checked, deployed*). |
| `ed_pronunciation_contrast` | Item 7 blocked | **L2** | Contrast /t/, /d/ and /ɪd/ endings in short warm-up phrases once audio renders. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.