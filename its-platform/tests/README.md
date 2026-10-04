# Test Strategy — ITS Platform

**Philosophy:** Test Pyramid + Contract Testing + Property-Based Testing
**Source:** `ITS-ARCHITECTURE.md` §5, `CONSTITUTION.md` §3

---

## Test Pyramid

```
        ┌─────────────┐
        │   E2E / BDD │  ← 10%  (PRD milestones, critical paths)
        │  pytest-bdd │
        └─────────────┘
      ┌───────────────────┐
      │  Contract Tests   │  ← 20%  (Spec ↔ Implementation)
      │  (Schema, Specs)  │
      └───────────────────┘
    ┌───────────────────────────┐
    │  Integration Tests        │  ← 30%  (Service interactions)
    │  (DB, Redis, Celery, Kong)│
    └───────────────────────────┘
  ┌───────────────────────────────────┐
  │  Unit Tests + Property Tests      │  ← 40%  (Pure functions, invariants)
  │  (BKT, IRT, FSRS, Parsers)        │
  └───────────────────────────────────┘
```

---

## 1. Unit Tests (40%)

### Target: Pure functions, algorithms, parsers

```bash
# Run unit tests
pytest tests/unit/ -v --cov=its_platform --cov-report=term-missing
```

### Key Modules to Test

| Module | What to Test | Property Tests |
|---|---|---|
| `adaptive/engine/bkt.py` | `update_mastery(prior, correct, slip, guess)` | `0 ≤ posterior ≤ 1`, monotonic in evidence |
| `adaptive/engine/irt.py` | `estimate_theta(responses, item_params)` | CI95 narrows with more items |
| `adaptive/engine/fsrs.py` | `next_interval(stability, difficulty, grade)` | interval ≥ previous, stability ≥ 0 |
| `practice/parsers/canonical.py` | `parse_canonical_pack(markdown)` | item_id prefix ↔ skill namespace |
| `practice/parsers/legacy.py` | `parse_legacy_pack(markdown)` | all items have key, options distinct |
| `content/loader.py` | `load_lesson(filepath)` | FASE 1-4 present, JSON valid |
| `curriculum/graph.py` | `next_activity(learner_state, dag)` | returns valid node, respects prereqs |

### Property-Based Testing (Hypothesis)

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

# tests/unit/test_fsrs_properties.py
@given(
    stability=st.floats(min_value=0.1, max_value=1000.0),
    difficulty=st.floats(min_value=0.0, max_value=10.0),
    grade=st.integers(min_value=1, max_value=4),  # Again, Hard, Good, Easy
)
def test_fsrs_interval_monotonic(stability, difficulty, grade):
    interval = next_interval(stability, difficulty, grade)
    assert interval > 0
    # Higher grade → longer interval (for same stability/difficulty)
```

---

## 2. Integration Tests (30%)

### Target: Service interactions, DB, Redis, Celery, Kong

```bash
# Run integration tests (requires testcontainers or test DB)
pytest tests/integration/ -v -m "not slow"
```

### Key Integration Points

| Test | What It Validates |
|---|---|
| `test_practice_submission_flow` | API → Celery → BKT update → DB → FSRS schedule |
| `test_diagnostic_placement_flow` | API → IRT calibration → start node mapping |
| `test_lesson_rendering` | Content loader → FASE 1-4 → learner_model JSON |
| `test_listening_delivery` | Shipped items only, Q-L2 ≥ 45s |
| `test_rls_isolation` | Learner A cannot read Learner B's data |
| `test_kong_jwt_validation` | Invalid JWT → 401, valid JWT → 200 |
| `test_kong_rate_limiting` | 101st request → 429 |
| `test_celery_retry_dlq` | Max retries → dead letter queue |
| `test_migration_legacy_to_canonical` | Legacy pack → canonical → same items |

---

## 3. Contract Tests (20%)

### Target: Spec ↔ Implementation compliance

```bash
# Run contract tests
pytest tests/contract/ -v
```

### Contract Test Categories

| Contract | Test File | Spec Source |
|---|---|---|
| OpenAPI ↔ FastAPI | `test_openapi_conformance.py` | `api-spec.openapi.yaml` |
| Lesson schema | `test_lesson_schema.py` | `post-lesson-practice-spec.md` §3 |
| Pack schema (both) | `test_pack_schema.py` | `post-lesson-practice-spec.md` §8 |
| Assessment item | `test_item_schema.py` | `assessment-item-spec.md` §1.2 |
| Listening corpus | `test_listening_schema.py` | `listening-corpus-spec.md` §3 |
| Curriculum graph | `test_registry_completeness.py` | `curriculum-graph-spec.md` §4.3 |
| Adaptive params | `test_bkt_irt_fsrs_params.py` | `stats-progress-evaluation-spec.md` §2-4 |
| Diagnostic blueprint | `test_diagnostic_blueprint.py` | `diagnostic-spec.md` §2 |

### Example: OpenAPI Conformance

```python
# tests/contract/test_openapi_conformance.py
import pytest
from fastapi.testclient import TestClient
from its_platform.main import app
from openapi_spec_validator import validate_spec

client = TestClient(app)

def test_openapi_spec_valid():
    spec = client.get("/openapi.json").json()
    validate_spec(spec)  # Raises if invalid OpenAPI 3.1

@pytest.mark.parametrize("path,method", [
    ("/v1/learners/{id}/placement", "POST"),
    ("/v1/learners/{id}/next", "GET"),
    ("/v1/learners/{id}/practice", "POST"),
    ("/v1/content/lessons/{id}", "GET"),
    ("/v1/content/packs/{id}", "GET"),
    ("/v1/content/listening/{id}", "GET"),
])
def test_endpoint_in_spec(path, method):
    spec = client.get("/openapi.json").json()
    assert path in spec["paths"]
    assert method.lower() in spec["paths"][path]

def test_request_response_examples():
    """Every endpoint has at least one example in OpenAPI spec"""
    spec = client.get("/openapi.json").json()
    for path, methods in spec["paths"].items():
        for method, details in methods.items():
            if method in ("get", "post", "put", "patch", "delete"):
                req_body = details.get("requestBody", {})
                if req_body:
                    assert "examples" in req_body.get("content", {}).get("application/json", {})
                for resp in details.get("responses", {}).values():
                    if "content" in resp:
                        assert "examples" in resp["content"].get("application/json", {})
```

---

## 4. BDD / E2E Tests (10%)

### Target: PRD Milestones, Critical User Journeys

```bash
# Run BDD scenarios
pytest tests/bdd/ -v --tb=short

# With Playwright for UI
pytest tests/bdd/ --browser=chromium --headed
```

See `tests/bdd/README.md` for scenario definitions.

---

## Test Configuration

```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -ra
    --strict-markers
    --strict-config
    --cov=its_platform
    --cov-report=term-missing
    --cov-report=xml:coverage.xml
    --cov-fail-under=80
markers =
    unit: Pure function tests
    integration: Service integration tests
    contract: Spec conformance tests
    bdd: Gherkin scenarios
    slow: Tests taking > 10s
    requires_db: Needs PostgreSQL
    requires_redis: Needs Redis
    requires_kong: Needs Kong
```

### Coverage Targets

| Layer | Target | Rationale |
|---|---|---|
| Unit (algorithms) | 95% | Pure functions, fully testable |
| Unit (parsers) | 90% | Edge cases in markdown parsing |
| Integration | 80% | DB/Redis interactions |
| Contract | 100% | Every spec endpoint covered |
| BDD | 100% of PRD milestones | Critical paths only |

---

## CI Pipeline

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
```

---

## Mutation Testing (Periodic)

```bash
# Run monthly or on release branches
pip install mutmut
mutmut run --paths-to-mutate=its_platform/adaptive/engine/
mutmut results
```

Target: **Mutation score ≥ 85%** for adaptive engine modules.

---

## Test Data Management

| Approach | When |
|---|---|
| **Factories** (factory_boy) | Unit/Integration tests — consistent test data |
| **Fixtures** (pytest) | Shared setup (DB session, Redis, authenticated client) |
| **Snapshots** (syrupy) | Contract tests — freeze OpenAPI, JSON responses |
| **Property-based** (Hypothesis) | Algorithms — BKT, IRT, FSRS invariants |
| **Golden files** | Parser tests — markdown ↔ parsed object |