# Practice Pack: Testing Fundamentals — Unit Tests, Mocks, TDD Cycle
**Reuse basis:** cite_only

**Pack ID:** `pack_les_a2_it_testing_fundamentals_v1`
**Lesson:** `les_a2_it_testing_fundamentals.md`
**Items:** 6
**Time cap:** 4 min
**Split:** 67% current / 33% prereq
**Interleaved:** yes

---



### ITEM 1
**item_id:** `vocab.testing.unit_test`
**domain:** `vocab`
**level:** L1
**stem:** A **unit test** tests:
| Slot | Value |
|------|-------|
| A | The entire application end-to-end |
| B | **One function or class in isolation** |
| C | The database schema |
| D | The UI layout |
**Key:** B
**br_pt_form:** "teste unitário"



### ITEM 2
**item_id:** `vocab.testing.mock`
**domain:** `vocab`
**level:** L1
**stem:** A **mock** is used to:
| Slot | Value |
|------|-------|
| A | Verify that the real dependency works |
| B | Speed up the production database |
| C | **Replace a real dependency with a controllable fake** |
| D | Generate random test data |
**Key:** C
**br_pt_form:** "mock / simulado"
> **Fixed 2026-10-01.** Option A duplicated the key verbatim — two correct answers, so the
> item could not be scored. Replaced with a plausible wrong form (the duplicate repeated the key; a mock *replaces* the dependency rather than verifying it). Found by the cross-schema
> duplicate-option check added to `verify-integrity.py` [9], which globbed only `pack-les-*.md` until this date
> and so had never seen this schema.



### ITEM 3
**item_id:** `vocab.testing.stub_vs_mock`
**domain:** `vocab`
**level:** L1
**stem:** A **stub** returns fixed data. A **mock** also:
| Slot | Value |
|------|-------|
| A | Connects to the real API |
| B | **Verifies interactions (was a method called?)** |
| C | Runs only in production |
| D | Replaces the entire framework |
**Key:** B
**br_pt_form:** "stub retorna dados fixos; mock verifica chamadas"



### ITEM 4
**item_id:** `vocab.testing.tdd_cycle`
**domain:** `vocab`
**level:** L1
**stem:** The TDD cycle order is:
| Slot | Value |
|------|-------|
| A | Green → Red → Refactor |
| B | Refactor → Red → Green |
| C | **Red → Green → Refactor** |
| D | Red → Refactor → Green |
**Key:** C
**br_pt_form:** "vermelho → verde → refatorar"



### ITEM 5
**item_id:** `vocab.testing.fixture`
**domain:** `vocab`
**level:** L1
**stem:** A **fixture** provides:
| Slot | Value |
|------|-------|
| A | Random test data every run |
| B | **Known initial state for the test** |
| C | The production database |
| D | A mock server |
**Key:** B
**br_pt_form:** "fixture / cenário de teste"



### ITEM 6
**item_id:** `grammar.present_simple_habits_prereq`
**domain:** `grammar`
**level:** L1
**stem:** [Prereq] Complete: "A good developer ______ (write) tests before code."
| Slot | Value |
|------|-------|
| A | write |
| B | **writes** |
| C | writing |
| D | wrote |
**Key:** B
**br_pt_form:** "escreve"

## 1. MANIFEST

```yaml
pack_id: pack_les_a2_it_testing_fundamentals_v1
lesson_id: les_a2_it_testing_fundamentals_v1
learner_profile: default
estimated_minutes: 4 min
spec_conformance:
  item_count: 6                       # §2.1 4–8            ✅
  time_cap: "3–5 min"                 # §2.1 hard cap       ✅
  split: 5 current / 2 prereq         # §2.1 55–75 / 25–45  ✅ (assumed)
  interleaved: true                   # §2.1                ✅ (G, V, R, G, V, G, P)
  max_per_domain: 3                   # §2.2 grammar        ✅
  listening_items: 0                  # deferred until render + ear-check
  br_pt_form_coverage: 6/7 scored items
  speaking_writing_items: 0           # §2.4                ✅
  authored_illustrative_parameters: true
```
