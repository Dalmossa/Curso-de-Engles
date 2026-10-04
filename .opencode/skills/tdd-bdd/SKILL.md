---
name: TDD/BDD
description: Test-Driven Development and Behavior-Driven Development practices for ITS Platform
---

# TDD/BDD Skill — ITS Platform

## When to Use
- Writing new code (TDD cycle)
- Defining acceptance criteria (BDD scenarios)
- Collaborating with domain experts
- Creating living documentation

## TDD (Kent Beck) — Red/Green/Refactor

### The Cycle
```
1. RED    → Write a failing test (small increment)
2. GREEN  → Make it pass (quick, even with "sins")
3. REFACTOR → Eliminate duplication, improve design
```

### Rules
- **Write test FIRST** — no production code without failing test
- **Small steps** — one assertion per test ideally
- **Run tests OFTEN** — after every change
- **Refactor ONLY on green** — never refactor on red

### Example Flow
```python
# 1. RED - Write test first
def test_bkt_update_mastery_correct_increases_posterior():
    prior = 0.5
    posterior = update_mastery(prior, correct=True, slip=0.1, guess=0.2)
    assert posterior > prior  # Learning increases mastery

# 2. GREEN - Minimal implementation
def update_mastery(prior, correct, slip, guess):
    if correct:
        return prior + (1 - prior) * (1 - slip)
    return prior * (1 - guess)

# 3. REFACTOR - Clean up, add edge cases, property tests
```

## BDD (John Ferguson Smart) — Given/When/Then

### Feature File Structure
```gherkin
# tests/bdd/features/diagnostic.feature
Feature: Diagnostic Placement
  As a new learner
  I want to take a placement test
  So that I start at the right level

  Scenario: Absolute beginner places at A1 foundation
    Given a new learner "L1" registers with no prior English
    When the learner starts the diagnostic placement test
    And the adaptive engine administers items per diagnostic-spec.md blueprint
    And the learner answers 70% of A1 items correctly
    And the learner answers 20% of A2 items correctly
    Then the IRT estimator returns θ = -1.2 ± 0.3 (SE)
    And the start node is mapped to "les_a1_alphabet_sounds"
    And the learner's profile shows CEFR level "A1"
```

### Step Definitions (pytest-bdd)
```python
# tests/bdd/step_defs/diagnostic_steps.py
from pytest_bdd import given, when, then, parsers
from its_platform.services.diagnostic import DiagnosticService

@given('a new learner "L1" registers with no prior English')
def new_learner():
    return {"id": "L1", "prior_english": False}

@when('the learner starts the diagnostic placement test')
async def start_diagnostic(new_learner, diagnostic_service):
    return await diagnostic_service.start(new_learner["id"])

@then(parsers.parse('the IRT estimator returns θ = {theta} ± {se}'))
def check_theta_estimate(result, theta, se):
    assert abs(result.theta - float(theta)) < 0.5
    assert abs(result.se - float(se)) < 0.2
```

## Three Layers of BDD Automation

```python
# Layer 1: Business Rules (what should happen)
# Layer 2: Business Flow (user journey)
# Layer 3: Technical (how it works)

# its_platform/tests/bdd/layers/
# business_rules/     → pure domain logic
# business_flow/      → API calls, user journeys
# technical/          → DB, Redis, Celery internals
```

## TDD + BDD Integration

```
BDD Scenario (Given/When/Then)
       ↓
Acceptance Test (pytest-bdd)
       ↓
Unit Tests (TDD) → Implementation
       ↓
Integration Test → Contract Test → BDD passes
```

## Rules
- [ ] Write BDD scenario BEFORE implementation
- [ ] TDD for every unit of code
- [ ] Property tests for algorithms (BKT, IRT, FSRS)
- [ ] Contract tests for ALL endpoints
- [ ] BDD scenarios trace to PRD milestones
- [ ] Living documentation generated from BDD