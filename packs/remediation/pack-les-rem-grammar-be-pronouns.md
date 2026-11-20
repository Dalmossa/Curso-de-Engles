# Practice Pack — `les_rem_grammar_be_pronouns`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_rem_grammar_be_pronouns_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_rem_grammar_be_pronouns.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-19

---

## 1. MANIFEST

```yaml
pack_id: pack_les_rem_grammar_be_pronouns_v1
lesson_id: les_rem_grammar_be_pronouns
learner_profile: remediation_grammar_theta_low
estimated_minutes: 4.5
spec_conformance:
  item_count: 7
  time_cap: "3–5 min"
  split: 5 current / 2 prereq
  interleaved: true
  max_per_domain: 3
  listening_items: 0
  br_pt_form_coverage: 5/5 MCQ scored items
  speaking_writing_items: 0
  authored_illustrative_parameters: true
```

### 2.1 Domain Distribution Check (§2.2)

| Domain | Items | Allowed | Status |
|--------|-------|---------|--------|
| Grammar | 3 | 2–3 | ✅ |
| Vocabulary | 1 | 1–3 | ✅ |
| Listening | 0 | 1 | ⚠️ deferred |
| Reading | 1 | 1–2 | ✅ |
| Pronunciation | 1 | 1 | ✅ |
| **Total** | **7** | 4–8 | ✅ |

---

## 2. L1 ITEMS

---

### ITEM 1 — Grammar, current lesson

```yaml
item_id: grm_grammar_be_pronouns_agreement_001
skill: `grammar.to_be_subject_agreement`
type: `contextual_selection`
difficulty_b: -0.3
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Marcelo are in the incident channel with the SREs."
    br_pt_form: "O Marcelo estão no canal do incidente com os SREs."
    note: "are does not agree with a singular subject such as Marcelo"
  - option: "Marcelo be in the incident channel with the SREs."
    br_pt_form: "O Marcelo ser no canal do incidente com os SREs."
    note: "the bare form be cannot carry the present finite verb in this sentence"
  - option: "Is in the incident channel with the SREs."
    br_pt_form: "Está no canal do incidente com os SREs."
    note: "drops the required subject, a transfer from subjectless Portuguese clauses"
```

**Item:**
> During a post-mortem you need to say where a teammate is. Choose the correct sentence.

| Slot | Value |
|------|-------|
| A | "Marcelo are in the incident channel with the SREs." |
| B | **"Marcelo is in the incident channel with the SREs."** ✓ |
| C | "Marcelo be in the incident channel with the SREs." |
| D | "Is in the incident channel with the SREs." |

**Key:** B

**Feedback:**
> The subject **Marcelo** is third person singular, so the verb is **`is`**. **A** uses the plural form, **C** leaves the verb in the bare form, and **D** omits the subject that English requires.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Grammar, current lesson

```yaml
item_id: grm_grammar_be_pronouns_omission_001
skill: `grammar.subject_and_be_omission`
type: `sentence_repair`
difficulty_b: -0.1
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "Our build failing, and they are checking the logs."
    br_pt_form: "Nosso build falhando, e eles estão verificando os logs."
    note: "drops be before the present participle, so the first clause has no finite verb"
  - option: "Our build is failing, and are checking the logs."
    br_pt_form: "Nosso build está falhando, e estão verificando os logs."
    note: "drops the subject of the second clause, a direct transfer from Portuguese"
  - option: "Our build are failing, and they are checking the logs."
    br_pt_form: "Nosso build estão falhando, e eles estão verificando os logs."
    note: "uses the plural form with a singular subject build"
```

**Item:**
> A dev reports a broken build in the team channel. Which repair keeps both clauses complete?

| Slot | Value |
|------|-------|
| A | "Our build failing, and they are checking the logs." |
| B | "Our build is failing, and are checking the logs." |
| C | **"Our build is failing, and they are checking the logs."** ✓ |
| D | "Our build are failing, and they are checking the logs." |

**Key:** C

**Feedback:**
> The correct repair supplies **is** for *build* and **they** for the second clause: **`Our build is failing, and they are checking the logs.`** **A** misses the auxiliary, **B** misses the second subject, and **D** breaks subject agreement.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_grammar_be_pronouns_contractions_001
skill: `vocab.tobe.contraction`
type: `contextual_selection`
difficulty_b: -0.2
cefr: B1
domain: vocabulary
provenance: authored
distractors:
  - option: "wear"
    br_pt_form: "vestir"
    note: "spells the contraction like the unrelated verb meaning to dress"
  - option: "weer"
    br_pt_form: "não é uma contração do inglês"
    note: "invents a spelling that does not exist in English"
  - option: "we ar"
    br_pt_form: "nós ár"
    note: "keeps a phonetic spelling instead of the written contraction"
```

**Item:**
> In a stand-up note you want the natural contraction of "we are". Which written form is correct?

| Slot | Value |
|------|-------|
| A | "wear" |
| B | "weer" |
| C | "we ar" |
| D | **"we're"** ✓ |

**Key:** D

**Feedback:**
> The written contraction of **we are** is **`we're`**. **A** is the unrelated verb *wear*, **B** is not an English word, and **C** is a phonetic spelling rather than the standard form.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_grammar_be_pronouns_status_001
skill: `reading.to_be_context`
type: `detail_identification`
difficulty_b: 0.0
cefr: B1
domain: reading
provenance: authored
distractors:
  - option: "There is two fixes in the branch."
    br_pt_form: "Há duas correções no branch."
    note: "restates the note with the wrong number agreement for two fixes"
  - option: "There are two root causes in the log."
    br_pt_form: "Há duas causas-raiz no log."
    note: "the note says there is only one root cause"
  - option: "The flaky test is a production bug."
    br_pt_form: "O teste instável é um bug de produção."
    note: "the note explicitly says the opposite about the flaky test"
```

**Stimulus:**
> "Incident note: it's a flaky test, not a production bug. There are two alerts in the log, but there's only one root cause. There are two fixes in the branch, and we're verifying them now. Marcelo is on the call."

**Item:**
> Which statement matches the incident note?

| Slot | Value |
|------|-------|
| A | "There is two fixes in the branch." |
| B | **"There are two fixes in the branch, with one root cause."** ✓ |
| C | "There are two root causes in the log." |
| D | "The flaky test is a production bug." |

**Key:** B

**Feedback:**
> The note says **`There are two fixes in the branch`** and **`there's only one root cause`**, so **B** is correct. **A** uses singular *is* with a plural noun, **C** doubles the root causes, and **D** reverses the note's statement about the flaky test.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Grammar, current lesson

```yaml
item_id: grm_grammar_be_pronouns_there_are_001
skill: `grammar.there_is_there_are`
type: `contextual_selection`
difficulty_b: 0.1
cefr: B1
domain: grammar
provenance: authored
distractors:
  - option: "There is two alerts in the log."
    br_pt_form: "Há dois alertas no log."
    note: "uses the singular form before a plural noun"
  - option: "There have two alerts in the log."
    br_pt_form: "Houveram dois alertas no log."
    note: "uses have as the existential verb where English requires be"
  - option: "Are two alerts in the log."
    br_pt_form: "Estão dois alertas no log."
    note: "moves the verb to the front without the existential there"
```

**Item:**
> You are writing a status update about a log with two alerts. Choose the natural sentence.

| Slot | Value |
|------|-------|
| A | **"There are two alerts in the log."** ✓ |
| B | "There is two alerts in the log." |
| C | "There have two alerts in the log." |
| D | "Are two alerts in the log." |

**Key:** A

**Feedback:**
> Existence with a plural noun takes **`There are`**. **B** uses the singular form with *two alerts*, **C** uses *have* instead of *be*, and **D** drops the required *there*.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_grammar_be_pronouns_short_answer_001
skill: `grammar.be_question_short_answer`
type: `contextual_selection`
difficulty_b: -0.4
cefr: B1
domain: grammar
provenance: authored
prereq_lesson: `les_b1_question_forms`
distractors:
  - option: "Yes, I do."
    br_pt_form: "Sim, eu faço."
    note: "repeats do although the question was built with be"
  - option: "Yes, I am the reviewer."
    br_pt_form: "Sim, eu sou o revisor."
    note: "repeats the predicate instead of giving the short answer"
  - option: "Yes, you are."
    br_pt_form: "Sim, você é."
    note: "switches from the first person to the second person"
```

**Item:**
> A teammate asks "Are you the reviewer for this pull request?" Give the natural short answer.

| Slot | Value |
|------|-------|
| A | "Yes, I do." |
| B | "Yes, I am the reviewer." |
| C | "Yes, you are." |
| D | **"Yes, I am."** ✓ |

**Key:** D

**Feedback:**
> A question with **`Are you...?`** takes the short answer **`Yes, I am.`** **A** borrows *do* from another auxiliary, **B** repeats the predicate, and **C** changes the person.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Pronunciation, prerequisite review

```yaml
item_id: prn_grammar_be_pronouns_contractions_001
skill: `pronunciation.be_contractions_stress`
type: `minimal_pair_production`
difficulty_b: -0.2
cefr: B1
domain: pronunciation
provenance: authored
prereq_lesson: `les_a2_stress_timing`
asr_scored: true
clip: clips/practice/prn_grammar_be_pronouns_contractions_001.mp3
br_pt_form: null
br_pt_form_state: not_applicable_no_distractor_set
```

**Step 1 — hear the contrast:** *I am* /aɪ æm/ is two full syllables in careful speech; *I'm* /aɪm/ is one beat with a closed /m/. *There's* /ðeərz/ ends in voiced /z/, while *there are* /ðeər ɑːr/ keeps a separate second word.
**Step 2 — produce (ASR-scored):** read aloud:

> "I'm on call, she's reviewing the fix, and there are two alerts in the log."

**Target phonemes:** closed /m/ in *I'm* · voiced /z/ in *she's* and *there's* · separate *are* in *there are* · no extra vowel after the final consonants.

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **✅ rendered (TTS static)**

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `be_subject_agreement` | Item 1 or 2 missed | **L2** | Drill am / is / are against he, she, it, we and they in incident updates. |
| `there_is_are_number` | Item 4 or 5 missed | **L2** | Rebuild there is versus there are using counts from the log. |
| `be_short_answers` | Item 6 missed | **L2** | Rebuild Yes I am and No she isn't after questions with be. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 7 is ASR-scored production and does not substitute for listening-pool calibration.
3. Items target authored lesson content; no external source text is reproduced.
