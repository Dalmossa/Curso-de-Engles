# Practice Pack — `les_a2_it_testing_fundamentals`
**Reuse basis:** `authored_material`

**Pack ID:** `pack_les_a2_it_testing_fundamentals_v1`
**Spec:** `post-lesson-practice-spec.md` §2, §8, §9
**Lesson:** `les_a2_it_testing_fundamentals.md`
**Provenance:** items `authored`. All items are 100% original and authored for Brazilian software engineers (pt-BR → en-US).
**Authoring date:** 2026-11-18

---

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_testing_fundamentals_v1
lesson_id: les_a2_it_testing_fundamentals
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
item_id: grm_testing_fails_until_fix_001
skill: `grammar.testing_present_simple_habits`
type: `contextual_selection`
difficulty_b: -0.4
cefr: A2
domain: grammar
provenance: authored
distractors:
  - option: "The unit test fail until we add the function."
    br_pt_form: "O teste unitário falha até adicionarmos a função."
    note: "the subject 'the unit test' is third-person singular, so the verb needs the -s ending"
  - option: "The unit test is fail until we add the function."
    br_pt_form: "O teste unitário está falhar até adicionarmos a função."
    note: "'is fail' mixes an auxiliary with a bare verb; a present-simple state takes no auxiliary"
  - option: "The unit tests fails until we add the function."
    br_pt_form: "Os testes unitários falha até adicionarmos a função."
    note: "a plural subject takes the base verb 'fail', not the third-person -s form"
```

**Item:**
> You are describing a TDD run to a teammate. Which sentence is correct?

| Slot | Value |
|------|-------|
| A | "The unit test fail until we add the function." |
| B | **"The unit test fails until we add the function."** ✓ |
| C | "The unit test is fail until we add the function." |
| D | "The unit tests fails until we add the function." |

**Key:** B

**Feedback:**
> A singular subject takes **fails** in the present simple: **`The unit test fails until we add the function.`** **A** omits the *-s*, **C** adds an auxiliary to a plain state, and **D** puts the singular verb after a plural subject.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 2 — Reading, current lesson

```yaml
item_id: rdg_testing_reviewer_asks_test_001
skill: `reading.testing_review_detail`
type: `detail_identification`
difficulty_b: -0.1
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "The price function."
    br_pt_form: "A função de preço."
    note: "the function is the code under test, not the dependency the reviewer wants replaced"
  - option: "The assertion."
    br_pt_form: "A asserção."
    note: "the reviewer asks to add an assertion, not to replace one that already exists"
  - option: "The pull request."
    br_pt_form: "O pull request."
    note: "the pull request is where the note was written, not an object inside the test"
```

**Stimulus:**
> "PR #42: please add a unit test for the price function. Use a mock for the settings reader, so the suite stays fast. Add an assertion for the final string. Do not call the real settings file in the test."

**Item:**
> What does the reviewer ask the developer to replace in the test?

| Slot | Value |
|------|-------|
| A | The price function. |
| B | The assertion. |
| C | **The settings reader.** ✓ |
| D | The pull request. |

**Key:** C

**Feedback:**
> The note says **`Use a mock for the settings reader`**. **A** names the code being tested, **B** is something to add rather than replace, and **D** is the place where the review happened.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 3 — Vocabulary, current lesson

```yaml
item_id: voc_testing_mock_replaces_reader_001
skill: `vocab.testing.core_terms`
type: `contextual_selection`
difficulty_b: 0.1
cefr: A2
domain: vocabulary
provenance: authored
distractors:
  - option: "Coverage."
    br_pt_form: "Cobertura."
    note: "coverage measures how much code the tests exercise; it does not replace a dependency"
  - option: "A fixture."
    br_pt_form: "Uma fixture."
    note: "a fixture sets up the starting state; the stand-in for a dependency is a mock"
  - option: "A code review."
    br_pt_form: "Uma revisão de código."
    note: "a review is a human process, not an object used inside a test"
```

**Item:**
> The test must not open the real settings file. Which term names the object that replaces the reader and returns fixed values?

| Slot | Value |
|------|-------|
| A | "Coverage." |
| B | "A fixture." |
| C | "A code review." |
| D | **"A mock."** ✓ |

**Key:** D

**Feedback:**
> **`A mock`** is the stand-in that keeps the test away from the real dependency. **A** reports how much code ran, **B** prepares the starting state, and **C** is a meeting between developers.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 4 — Reading, current lesson

```yaml
item_id: rdg_testing_run_summary_coverage_001
skill: `reading.testing_run_detail`
type: `detail_identification`
difficulty_b: 0.0
cefr: A2
domain: reading
provenance: authored
distractors:
  - option: "8 passed."
    br_pt_form: "8 passaram."
    note: "this is the number of passing tests, not the share of code exercised"
  - option: "2 mocks."
    br_pt_form: "2 mocks."
    note: "this counts the stand-in objects used, not the coverage percentage"
  - option: "4 seconds."
    br_pt_form: "4 segundos."
    note: "this is the duration of the run, not a coverage value"
```

**Stimulus:**
> "Test run: 8 passed, 0 failed. Unit tests: 6. Mocks used: 2. Coverage: 78%. Full suite time: 4 seconds."

**Item:**
> Which number in this run summary shows how much of the code the tests exercise?

| Slot | Value |
|------|-------|
| A | "8 passed." |
| B | "2 mocks." |
| C | **"78%."** ✓ |
| D | "4 seconds." |

**Key:** C

**Feedback:**
> The label **`Coverage: 78%`** gives the share of code exercised. **A** is a pass count, **B** counts stand-ins, and **D** reports how long the suite took.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 5 — Pronunciation, current lesson

```yaml
item_id: prn_testing_unit_assert_stress_001
skill: `pronunciation.testing_term_stress`
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

**Step 1 — hear the contrast:** *UNIT test* /ˈjuːnɪt test/ starts with /juː/, like the word *you* — saying /uːnɪt/ sounds like *oonit*. *assert* /əˈsɜːrt/ has a soft schwa /ə/ first and the stress on the second syllable. *coverage* /ˈkʌvərɪdʒ/ stresses the first syllable with /ʌ/, the vowel of *cup*.

**Step 2 — produce (ASR-scored):** read aloud:

> "The unit test will assert the value and show the coverage."

**Target phonemes:** /juː/ in *unit* · /əˈsɜːrt/ in *assert* · /ˈkʌv/ in *coverage* · /v/ in *value* (lower lip on the upper teeth, not /w/).

**Feedback:** recast only — replay the model, no explicit correction.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅ · **⚠️ blocked on render**

---

### ITEM 6 — Grammar, prerequisite review

```yaml
item_id: grm_testing_article_mock_database_001
skill: `grammar.testing_article_with_terms`
type: `error_correction`
difficulty_b: -0.3
cefr: A2
domain: grammar
provenance: authored
prereq_lesson: les_a2_it_terms_basics
distractors:
  - option: "We need an mock for the database."
    br_pt_form: "Precisamos de an mock para o banco de dados."
    note: "'mock' begins with the consonant sound /m/, so the article is 'a', not 'an'"
  - option: "We need mock for the database."
    br_pt_form: "Precisamos de mock sem artigo para o banco de dados."
    note: "a singular countable noun such as 'mock' needs an article in this sentence"
  - option: "We need an mocks for the database."
    br_pt_form: "Precisamos de an mocks para o banco de dados."
    note: "'an' goes with a singular noun; the plural 'mocks' cannot follow it"
```

**Item:**
> Reviewing IT terms before a stand-up, which sentence uses the right article?

| Slot | Value |
|------|-------|
| A | "We need an mock for the database." |
| B | "We need mock for the database." |
| C | "We need an mocks for the database." |
| D | **"We need a mock for the database."** ✓ |

**Key:** D

**Feedback:**
> The noun *mock* is singular and starts with /m/, so it takes **`a mock`**. **A** uses *an* before a consonant sound, **B** drops the article, and **C** pairs *an* with a plural noun.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

### ITEM 7 — Vocabulary, prerequisite review

```yaml
item_id: voc_testing_label_scan_passed_001
skill: `vocab.testing.label_scan`
type: `contextual_selection`
difficulty_b: -0.2
cefr: A2
domain: vocabulary
provenance: authored
prereq_lesson: les_a1_reading_skimming
distractors:
  - option: "12 passed"
    br_pt_form: "12 passaram"
    note: "passing tests are a positive count; they do not signal a failing run"
  - option: "coverage 84%"
    br_pt_form: "cobertura 84%"
    note: "coverage reports the share of code exercised, not the pass or fail status"
  - option: "3 mocks"
    br_pt_form: "3 mocks"
    note: "this counts stand-in objects used in the suite, not the result of the run"
```

**Stimulus:**
> CI summary: 12 passed · 1 failed · coverage 84% · mocks 3

**Item:**
> Skim the CI summary. Which label tells you the run is not fully green?

| Slot | Value |
|------|-------|
| A | "12 passed" |
| B | **"1 failed"** ✓ |
| C | "coverage 84%" |
| D | "3 mocks" |

**Key:** B

**Feedback:**
> The label **`1 failed`** is the one that breaks a green run. **A** reports successes, **C** is a coverage figure, and **D** counts the stand-ins used in the tests.

**Gates:** G-Q2 ✅ · G-Q3 ✅ · G-Q4 ✅

---

## 3. L2/L3 SEEDS

| Seed | Trigger | Layer | Note |
|------|---------|-------|------|
| `testing_singular_verb` | Item 1 missed | **L2** | Contrast *the unit test fails* with *the tests fail* in short TDD status lines, so the -s rule is tied to the subject. |
| `dependency_stand_in` | Items 3 or 6 missed | **L2** | Recycle *mock*, *stub* and *fixture* as function questions and article choices instead of bare translations. |
| `review_and_run_skim` | Items 2, 4 or 7 missed | **L2** | Skim a review note, a run summary and a CI label for the requested change, the coverage figure and the failure marker. |

---

## 4. VALIDATION NOTES

1. All `b` values are priors, per `assessment-item-spec.md` §8.2.
2. Item 5 is ASR-scored production and stays blocked until the TTS clip is rendered; it does not substitute for listening-pool calibration.
3. Items 6 and 7 review `les_a2_it_terms_basics` and `les_a1_reading_skimming` and carry `prereq_lesson` for the interleaving rule.
4. Items 2 and 4 use distinct detail targets (dependency to replace versus coverage figure), and item 7 scans a compact label rather than a prose note.
5. All terms, the review note, the run summary, the CI label, the dialogue and every distractor were authored for this pack; no external source text is reproduced or adapted.
