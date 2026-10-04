---
name: Testing Strategy
description: Test pyramid, quality gates, coverage targets, CI/CD integration for ITS Platform
---

# Testing Strategy Skill — ITS Platform

## When to Use
- Setting up test infrastructure
- Defining quality gates
- Configuring CI/CD test pipeline
- Establishing coverage targets
- Choosing testing frameworks

## Test Pyramid (Google)

```
        ┌─────────────┐
        │   E2E/BDD   │  ← 10%  (PRD milestones, critical paths)
        └─────────────┘
      ┌───────────────────┐
      │  Contract Tests   │  ← 20%  (Spec ↔ Implementation)
      └───────────────────┘
    ┌───────────────────────────┐
    │  Integration Tests        │  ← 30%  (DB, Redis, Celery, Kong)
    └───────────────────────────┘
  ┌───────────────────────────────────┐
  │  Unit + Property Tests            │  ← 40%  (BKT, IRT, FSRS, parsers)
  └───────────────────────────────────┘
```

## Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Unit (algorithms) | ≥ 95% | Pure functions, fully testable |
| Unit (parsers) | ≥ 90% | Edge cases in markdown parsing |
| Integration | ≥ 80% | DB/Redis interactions |
| Contract | 100% | Every spec endpoint covered |
| BDD | 100% of PRD milestones | Critical paths only |

## Frameworks & Tools

```toml
# pyproject.toml test dependencies
[project.optional-dependencies]
test = [
    "pytest>=7.4",
    "pytest-asyncio>=0.21",
    "pytest-bdd>=6.1",
    "pytest-cov>=4.1",
    "hypothesis>=6.82",
    "mutmut>=2.4",
    "schemathesis>=3.13",
    "playwright>=1.40",
    "testcontainers>=3.7",
]
```

## CI/CD Pipeline

```yaml
# .github/workflows/test.yml
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -e ".[test]"
      - run: pytest tests/unit/ -v --cov=its_platform --cov-fail-under=90

  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: test }
        ports: [5432:5432]
      redis:
        image: redis:7
        ports: [6379:6379]
    steps:
      - uses: actions/checkout@v4
        with: { submodules: recursive }
      - run: pytest tests/integration/ -v -m "not slow"

  contract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { submodules: recursive }
      - run: pytest tests/contract/ -v

  bdd:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pytest tests/bdd/ -v --browser=chromium

  mutation:
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule' || github.event.pull_request.base.ref == 'release/*'
    steps:
      - uses: actions/checkout@v4
      - run: pip install mutmut
      - run: mutmut run --paths-to-mutate=its_platform/adaptive/engine/
      - run: mutmut results
```

## Property-Based Testing (Hypothesis)

```python
# tests/unit/test_bkt_properties.py
from hypothesis import given, strategies as st
from its_platform.adaptive.engine.bkt import update_mastery

@given(
    prior=st.floats(min_value=0.0, max_value=1.0),
    correct=st.booleans(),
    slip=st.floats(min_value=0.0, max_value=0.3),
    guess=st.floats(min_value=0.0, max_value=0.3),
)
def test_bkt_bounds(prior, correct, slip, guess):
    posterior = update_mastery(prior, correct, slip, guess)
    assert 0.0 <= posterior <= 1.0

@given(
    prior=st.floats(min_value=0.0, max_value=1.0),
    slip=st.floats(min_value=0.0, max_value=0.3),
    guess=st.floats(min_value=0.0, max_value=0.3),
)
def test_bkt_monotonic_correct(prior, slip, guess):
    post_correct = update_mastery(prior, True, slip, guess)
    post_incorrect = update_mastery(prior, False, slip, guess)
    assert post_correct >= post_incorrect
```

## Mutation Testing (mutmut)

```bash
# Monthly + release branches
pip install mutmut
mutmut run --paths-to-mutate=its_platform/adaptive/engine/
mutmut results  # Target: ≥ 85% mutation score
```

## Quality Gates

```yaml
# Branch protection rules
required_status_checks:
  - unit
  - integration
  - contract
  - bdd
  - mutation (adaptive engine)
  
coverage_thresholds:
  unit: 90% (algorithms), 85% (parsers)
  integration: 80%
  contract: 100%
  mutation: 85% (adaptive engine)
```

## Validation Checklist
- [ ] Test pyramid ratios maintained
- [ ] Coverage targets enforced in CI
- [ ] Property tests for all algorithms (BKT, IRT, FSRS)
- [ ] Contract tests for 100% OpenAPI endpoints
- [ ] BDD scenarios for 100% PRD milestones
- [ ] Mutation testing ≥ 85% on adaptive engine
- [ ] Flaky test policy: quarantine → fix → delete in 48h