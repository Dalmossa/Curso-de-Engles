# BDD Scenarios — ITS Platform

**Source:** `Curso-de-Ingles/PRD.md` §9 Milestones, `ITS-ARCHITECTURE.md` §10
**Format:** Gherkin (Given/When/Then)
**Tool:** pytest-bdd + playwright (API + UI)
**Location:** `its-platform/tests/bdd/`

---

## Feature: Diagnostic Placement (M1 → M4)

### Scenario: Absolute beginner places at A1 foundation
```gherkin
Given a new learner "L1" registers with no prior English
When the learner starts the diagnostic placement test
And the adaptive engine administers items per diagnostic-spec.md blueprint
And the learner answers 70% of A1 items correctly
And the learner answers 20% of A2 items correctly
Then the IRT estimator returns θ = -1.2 ± 0.3 (SE)
And the start node is mapped to "les_a1_alphabet_sounds" (mod_a1_foundation)
And the learner's profile shows CEFR level "A1"
And the first recommended activity is "les_a1_alphabet_sounds"
```

### Scenario: False beginner places at A2 workplace
```gherkin
Given a learner "L2" registers claiming "some English"
When the diagnostic runs
And the learner answers 90% of A1 items correctly
And the learner answers 60% of A2 workplace items correctly
And the learner answers 10% of B1 items correctly
Then the IRT estimator returns θ = 0.1 ± 0.25
And the start node is "les_a2_greetings_intro" (mod_a2_workplace_intro)
And the learner's profile shows CEFR level "A2"
```

### Scenario: Diagnostic stops at SE threshold
```gherkin
Given a diagnostic in progress for learner "L3"
When the standard error of θ drops below 0.3
And at least 15 items have been administered
Then the diagnostic terminates early
And the placement result is returned with CI95
```

---

## Feature: Curriculum Navigation (M2)

### Scenario: Mastery gate unlocks next lesson
```gherkin
Given learner "L1" has completed "les_a1_alphabet_sounds"
And the BKT mastery for skill "alphabet" is 0.87
And the BKT mastery for skill "greetings_vocab" is 0.45
When the learner requests the next activity
Then the curriculum graph returns "les_a1_greetings" as next
And the rationale shows "mastery_gate" with skill "greetings_vocab" < 0.85
```

### Scenario: Prerequisite chain respected
```gherkin
Given learner "L1" has mastered "les_a1_alphabet_sounds" (mastery 0.9)
And learner "L1" has NOT mastered "les_a1_greetings" (mastery 0.3)
When the learner requests next activity
Then "les_a1_greetings" is recommended (prerequisite for "les_a2_greetings_intro")
And "les_a2_greetings_intro" is NOT recommended (prerequisite not met)
```

### Scenario: Spaced review interrupts progression
```gherkin
Given learner "L1" is ready for "les_a1_present_simple"
And the FSRS scheduler shows "les_a1_greetings" review due today
When the learner requests next activity
Then the next activity is a REVIEW of "les_a1_greetings"
And the rationale shows "spaced_review" with skill "greetings_vocab"
And after review completion, "les_a1_present_simple" becomes next
```

---

## Feature: Practice Pack Submission (M3)

### Scenario: Practice submission updates BKT and schedules FSRS
```gherkin
Given learner "L1" is practicing "pack-les-a1-greetings"
And the pack has 7 items (3 grammar, 2 vocab, 1 pronunciation, 1 listening)
When the learner submits responses: 5 correct, 2 incorrect
And response times are within normal range
Then the API returns 202 Accepted with PracticeResult
And the Celery task "update_bkt_mastery" fires for each item (priority queue)
And the Celery task "schedule_fsrs_review" fires for each item (standard queue)
And within 5 seconds, the learner's mastery for "grammar.present_simple" increases from 0.62 to 0.71
And the next review for item "grm_grammar.present_simple_01" is scheduled in 3 days
```

### Scenario: Production item (pronunciation) scored by ASR
```gherkin
Given learner "L1" submits a pronunciation item (minimal_pair_th_voiced)
And the item has no multiple-choice options (production type)
When the learner uploads audio via signed URL
And the ASR worker scores the pronunciation
Then the Celery task "update_bkt_mastery" fires with correct=true/false
And no "schedule_fsrs_review" fires (production items use different spacing)
```

### Scenario: Listening pack submission
```gherkin
Given learner "L1" completes "dlg_a1_01_greetings" listening dialogue
And the dialogue has 6 slots (gist, detail, inference, lexical, pronunciation)
When the learner submits answers for all 6 slots
Then the listening service scores each slot
And BKT updates fire for skill "listening" per slot
And the dialogue status "shipped" is verified (not "withdrawn" or "shadow-only")
```

---

## Feature: Content Delivery (M1)

### Scenario: Lesson renders with FASE 1-4 structure
```gherkin
Given learner "L1" requests lesson "les_a1_alphabet_sounds"
When the content service fetches the lesson
Then the response carries exactly four phases, numbered 1..4 in this order
And each phase carries the lesson's own heading (its leading ## stripped, both
  authored header generations accepted) and that section's markdown verbatim
  | phase | heading (the lesson's own)                    | markdown          |
  | 1     | FASE 1 — Input (i+1) [N min]                  | the section body  |
  | 2     | FASE 2 — Guided Practice [N min]              | that section's body |
  | 3     | FASE 3 — Output Task [N min]                  | that section's body |
  | 4     | FASE 4 — Shadow CAT [N min]                   | that section's body |
And the learner_model member is the lesson's "DADOS PARA O LEARNER MODEL" JSON
  block, parsed, or null for the one lesson that declares none
And the reuse_basis is "cite_only"
And authoring_state and publication_state are the lesson's declared values
```

### Scenario: Pack renders with canonical schema
```gherkin
Given learner "L1" requests pack "pack_les_a1_greetings_v1"
When the practice service fetches the pack
Then the response includes 7 items
And each item has: item_id, item_type, skill, domain, prompt, scoring, options
And item_id prefix matches skill namespace (grm_, voc_, prn_, lst_)
And all options are distinct (case-sensitive, bold stripped)
And for each item with scoring="choice": exactly one option has is_key=true and key is that option's letter
And for each item with scoring<>"choice": options is empty and key is null (6 of 847 — ADR-004 "None for production items")
And every non-key option carries a note (distractor rationale)
And each item's listening_items is [] (ADR-004's declared default; post-lesson §2.2 requires the 0 to be explicit)
```

### Scenario: Legacy pack renders correctly
```gherkin
Given learner "L1" requests pack "pack_les_a1_food_v1" (legacy schema)
When the practice service fetches the pack
Then the parser detects legacy schema
And the response includes 7 items with same structure as canonical
And the schema_version field is "legacy_v1"
And item_id is served verbatim and not pattern-matched (two generations resolve through identifier_aliases, ADR-016 §2)
```

---

## Feature: Listening Delivery (M5)

### Scenario: Dialogue with shipped items only
```gherkin
Given learner "L1" requests listening dialogue "dlg_a1_01_first_intro"
When the listening service fetches the dialogue
Then the dialogue is served only if status="shipped" and duration_seconds ≥ 45 (Q-L2 floor)
And a dialogue that does not exist and a dialogue that exists but is not "shipped"
  produce the same 404 body (ADR-027 §3 — the caller cannot tell them apart)
And every slot has skill in {gist, detail, inference, lexical, pragmatic, pronunciation}
And every slot has a non-null key — including the 11 slots that mark it with "✓ —"
  in the option table's trailing column rather than "✓" in its value column
And every slot carries the dialogue's authored transcript (dialogues.transcript, ADR-027 §3b),
  the same string for every slot
And each slot's distractors carry letter, text and an optional type from the six-value taxonomy
```

---

## Feature: Security & Compliance (M6)

### Scenario: Learner cannot access another learner's data
```gherkin
Given learner "L1" has mastery data
And learner "L2" is authenticated
When L2 requests GET /learners/L1/profile
Then the response is 403 Forbidden
And the PostgreSQL RLS policy blocks the query
```

### Scenario: Audio upload requires consent
```gherkin
Given learner "L1" has NOT granted "pronunciation_audio" consent
When L1 attempts to upload audio for pronunciation item
Then the response is 403 Forbidden
And the consent check runs before signed URL generation
```

### Scenario: Rate limiting on auth endpoints
```gherkin
Given an attacker attempts 100 login requests in 1 minute
When the 6th request arrives
Then Kong returns 429 Too Many Requests
And the IP is blocked for 15 minutes
```

---

## Feature: Authoring Guard (M6)

### Scenario: Pack with adapt_* on restricted source blocked
```gherkin
Given an author creates a pack citing "frases-ingles-trabalho.md"
And the pack declares reuse_basis="adapt_with_attribution"
When the author attempts to publish
Then the pre-publish check fails
And the error states: "restricted source requires adapt_requires_permission"
```

---

## Test Execution

```bash
# Run all BDD scenarios
pytest tests/bdd/ -v --tb=short

# Run specific feature
pytest tests/bdd/features/diagnostic.feature -v

# Run with Playwright for UI scenarios
pytest tests/bdd/ --browser=chromium --headed

# Generate HTML report
pytest tests/bdd/ --html=report/bdd.html --self-contained-html
```

---

## Contract Test Coverage Map

| BDD Feature | Contract Test | Spec Source |
|---|---|---|
| Diagnostic Placement | `test_diagnostic_blueprint_compliance` | `diagnostic-spec.md` §2 |
| Curriculum Navigation | `test_mastery_gate_enforcement` | `curriculum-graph-spec.md` §1.1 |
| Practice Submission | `test_bkt_update_bounds` | `stats-progress-evaluation-spec.md` §2 |
| Content Delivery | `test_lesson_fase_structure` | `post-lesson-practice-spec.md` §3 |
| Listening Delivery | `test_shipped_items_only` | `listening-corpus-spec.md` §4 |
| Security | `test_rls_isolation` | `security-spec.md` §2.3 |
| Authoring Guard | `test_restricted_adapt_blocked` | `external-sources.md` §0.5.1 |