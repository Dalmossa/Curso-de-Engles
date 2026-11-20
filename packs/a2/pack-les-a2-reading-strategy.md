# Practice Pack — `les_a2_reading_strategy`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_reading_strategy_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_reading_strategy.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_reading_strategy_v1
lesson_id: les_a2_reading_strategy
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
item_id: grm_reading_skim_imperative_001
skill: `grammar.reading_imperatives`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "Scan the changelog for the deploy date."
    br_pt_form: "Faça scanning no changelog para a data do deploy."
    note: "scanning targets one specific datum; the instruction here asks for the overall point"
  - option: "Skimming the changelog for the main idea."
    br_pt_form: "Fazendo skimming no changelog para a ideia geral."
    note: "the -ing form cannot open a direct instruction; Portuguese gerund 'fazendo' gets carried over"
  - option: "Skims the changelog for the main idea."
    br_pt_form: "Faz skimming no changelog para a ideia geral."
    note: "a third-person -s ending turns the instruction into a statement about someone else"
```

**Item:**
> You have ten seconds before a deploy. Which instruction tells a teammate to read for the **main idea**?

| Slot | Value |
|------|-------|
| A | "Scan the changelog for the deploy date." |
| B | **"Skim the changelog for the main idea."** ✓ |
| C | "Skimming the changelog for the main idea." |
| D | "Skims the changelog for the main idea." |

**Key:** B

**Feedback:**
> A direct reading instruction uses the base verb: **`Skim the changelog for the main idea.`** **A** describes *scanning*, **C** uses a gerund where the imperative is required, and **D** adds a third-person **-s**.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_strat_release_gist_001
skill: `reading.reading_skimming`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The charts load slowly for everyone."
    br_pt_form: "Os gráficos carregam devagar para todo mundo."
    note: "the note limits the slow charts to the migration; a detail is promoted to the main idea"
  - option: "Users must take action before Friday."
    br_pt_form: "Os usuários precisam agir antes de sexta."
    note: "the note says the opposite: 'no action is needed before Friday'"
  - option: "The old password rules remain in place."
    br_pt_form: "As regras antigas de senha continuam valendo."
    note: "the note says the rules were removed; Brazilian readers anchor on the familiar noun"
```

**Stimulus:**
> "Release 2.4.0 — Login is now faster and password reset is simpler. We removed the old password rules and added single sign-on. A few charts load slowly during the data migration. No action is needed before Friday."

**Item:**
> Skim the note. What is its main idea?

| Slot | Value |
|------|-------|
| A | "The charts load slowly for everyone." |
| B | **"Login is faster and password reset is simpler."** ✓ |
| C | "Users must take action before Friday." |
| D | "The old password rules remain in place." |

**Key:** B

**Feedback:**
> The headline sentence carries the gist: **`Login is now faster and password reset is simpler.`** **A** turns a migration detail into a universal claim, **C** reverses "no action is needed", and **D** reverses "we removed the old password rules".
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_strat_false_cognates_001
skill: `vocab.reading_false_cognates`
type: `contextual_selection`
difficulty_b: 0.2
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Actually the API is stable."
    br_pt_form: "Atualmente a API está estável."
    note: "'actually' means 'de fato'; using it for 'atualmente' is the classic BR-PT false cognate"
  - option: "Eventually the API is stable."
    br_pt_form: "Eventualmente a API está estável."
    note: "'eventually' means 'com o tempo', not 'atualmente'; the Portuguese adverb misleads here"
  - option: "In the moment the API is stable."
    br_pt_form: "No momento a API está estável."
    note: "calque of 'no momento'; English uses 'currently' or 'at the moment', not 'in the moment'"
```

**Item:**
> A Brazilian teammate writes a status update meaning "Atualmente a API está estável." Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "Actually the API is stable." |
| B | "Eventually the API is stable." |
| C | "In the moment the API is stable." |
| D | **"Currently the API is stable."** ✓ |

**Key:** D

**Feedback:**
> The English word for "atualmente" in a status update is **`currently`**: **`Currently the API is stable.`** **A** means "de fato", **B** means "com o tempo", and **C** is a calque of "no momento".
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_strat_deprecated_context_001
skill: `reading.reading_context_inference`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "Fast and newly released."
    br_pt_form: "Rápido e recém-lançado."
    note: "learners associate '-ated' words with new technology; the note gives no speed information"
  - option: "Removed from service this morning."
    br_pt_form: "Removido do serviço nesta manhã."
    note: "the note says it still answers requests and will be removed after the migration"
  - option: "Written in another programming language."
    br_pt_form: "Escrito em outra linguagem de programação."
    note: "a plausible tech guess, but the surrounding sentences say nothing about implementation language"
```

**Stimulus:**
> "The legacy endpoint is **deprecated**. It still answers requests, but new clients should use /v2/orders. We will remove it after the migration."

**Item:**
> Infer the meaning of **deprecated** from the surrounding sentences.

| Slot | Value |
|------|-------|
| A | "Fast and newly released." |
| B | "Removed from service this morning." |
| C | **"Still available, but planned for removal."** ✓ |
| D | "Written in another programming language." |

**Key:** C

**Feedback:**
> "Still answers requests" plus "we will remove it after the migration" yields **`Still available, but planned for removal.`** **A** invents speed, **B** contradicts the current availability, and **D** invents an implementation detail.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_strat_sk_cluster_001
skill: `pronunciation.reading_s_cluster`
type: `minimal_pair_production`
difficulty_b: 0.1
cefr: A2
domain: pronunciation
provenance: authored
asr_scored: true
clip: clips/practice/prn_strat_sk_cluster_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *skim* /skɪm/ and *scan* /skæn/ begin with the /sk/ cluster; *some* /sʌm/ begins with /s/ alone. Brazilian Portuguese inserts a vowel before the cluster and produces "esquim" and "escã". Keep the /s/ and /k/ attached, with no extra vowel.
**Step 2 — produce (ASR-scored):** read aloud:

> "I skim the changelog and scan the ticket for the status."

**Target phonemes:** /sk/ in *skim, scan* · /s/ in *status* · /ð/ in *the*.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_strat_ps_regular_001
skill: `grammar.present_simple_regular`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: `les_a1_present_simple`
distractors:
  - option: "The job fail every night."
    br_pt_form: "O job falha toda noite."
    note: "Portuguese has no third-person -s, so the singular subject loses the English verb marker"
  - option: "The job is fail every night."
    br_pt_form: "O job está falhando toda noite."
    note: "Portuguese 'está falhando' invites a be-form before the bare English verb"
  - option: "The job failing every night."
    br_pt_form: "O job falhando toda noite."
    note: "the gerund maps onto the Portuguese 'falhando', but it is not a finite present form"
```

**Item:**
> Reviewing the present simple before you describe a recurring behaviour in the changelog, which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The job fail every night." |
| B | **"The job fails every night."** ✓ |
| C | "The job is fail every night." |
| D | "The job failing every night." |

**Key:** B

**Feedback:**
> A recurring fact uses the present simple with a third-person **-s**: **`The job fails every night.`** **A** drops **-s**, **C** inserts *be* before the bare verb, and **D** leaves a gerund with no auxiliary.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_strat_release_attach_001
skill: `vocab.email_verbs`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: `les_a2_email_basics`
distractors:
  - option: "Please annex the log to the ticket."
    br_pt_form: "Por favor, anexe o log ao ticket."
    note: "'anexar' maps onto attach; annex means to add territory or a building in English"
  - option: "Please forward the log to the ticket."
    br_pt_form: "Por favor, encaminhe o log para o ticket."
    note: "forward sends a message onward to a person, not a file into a record"
  - option: "Please reply the log to the ticket."
    br_pt_form: "Por favor, responda com o log para o ticket."
    note: "reply answers a sender; it does not add a file to a ticket"
```

**Item:**
> Reviewing the email basics before you read the release notes, which sentence asks for the log file to be added to the ticket?

| Slot | Value |
|------|-------|
| A | "Please annex the log to the ticket." |
| B | **"Please attach the log to the ticket."** ✓ |
| C | "Please forward the log to the ticket." |
| D | "Please reply the log to the ticket." |

**Key:** B

**Feedback:**
> Adding a file to a ticket is **`attach`**: **`Please attach the log to the ticket.`** **A** uses the false friend *annex*, **C** sends a message onward to a person, and **D** answers a sender instead of adding a file.
>
**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `reading_skim_scan_contrast` | Items 1 and 2 missed | **L2** | Contrast *skim for the main idea* and *scan for the date* in short changelog previews. |
| `false_cognates_status` | Item 3 missed | **L2** | Separate *currently*, *actually* and *eventually* in status updates written by BR-PT speakers. |
| `context_inference_tech` | Item 4 missed | **L2** | Infer *deprecated*, *legacy* and *breaking change* from the sentence that follows each term. |
| `present_simple_regular_review` | Item 6 missed | **L2** | Drill the third-person **-s** in recurring-bug reports such as *the job fails every night*. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a1_present_simple` and `les_a2_email_basics` and carry `prereq_lesson` for the interleaving rule.
4. Items target authored lesson content; no external source text is reproduced.
5. Listening is deferred (`listening_items: 0`); its slot is redistributed to the two reading items, per `post-lesson-practice-spec.md` §2.2.
