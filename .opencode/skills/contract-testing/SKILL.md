---
name: Contract Testing
description: OpenAPI conformance, schema validation, schemathesis, spec compliance for ITS Platform
---

# Contract Testing Skill — ITS Platform

## When to Use
- Validating API implementation against OpenAPI spec
- Schema validation (request/response ↔ Pydantic models)
- Spec compliance (verify-integrity.py checks)
- Consumer-driven contract testing

## Workflow

### 1. OpenAPI Conformance (schemathesis)
```python
# tests/contract/test_openapi_conformance.py
import pytest
import schemathesis
from its_platform.main import app

schema = schemathesis.from_asgi("/openapi.json", app)

@schema.parametrize()
def test_api_conformance(case):
    case.call_and_validate()

# Run with: pytest tests/contract/test_openapi_conformance.py -v
```

### 2. Schema Validation (Pydantic ↔ OpenAPI)
```python
# tests/contract/test_schema_validation.py
from its_platform.schemas.curriculum import NextActivity
from its_platform.main import app

def test_next_activity_schema_matches_openapi():
    """Pydantic model matches OpenAPI schema"""
    openapi_schema = app.openapi()
    next_activity_schema = openapi_schema["components"]["schemas"]["NextActivity"]
    
    # Generate example from Pydantic
    example = NextActivity(
        activity_type="lesson",
        activity_id="les_a1_alphabet_sounds",
        rationale=Rationale(
            selection_rule="mastery_gate",
            mastery_gaps=["greetings_vocab"],
            i_plus_1=True
        ),
        estimated_duration_minutes=15,
        prerequisites_met=True
    )
    
    # Validate against OpenAPI schema
    from openapi_spec_validator import validate_spec
    validate_spec(openapi_schema)
```

### 3. Spec Compliance (verify-integrity.py)
```bash
# Run content integrity checks
python3 verify-integrity.py

# Checks 13 categories:
# [1] Registry closure
# [2] Lesson count arithmetic
# [3] Source corpus + licence warnings
# [4] JSON blocks parse
# [5] Listening corpus integrity
# [6] External source registry
# [7] Cross-references (xrefs)
# [8] Authored lesson files
# [9] Practice packs
# [10] Internal section references
# [11] Restricted sources not publishable
# [12] Markdown table column consistency
# [13] Worked examples honor disclosures
```

### 4. Consumer-Driven Contracts (Pact)
```python
# tests/contract/test_consumer_driven.py
import aiohttp
from pact import Consumer, Provider

consumer = Consumer("ITS-Platform-SPA")
provider = Provider("ITS-Platform-API")
pact = consumer.has_pact_with(provider, pact_dir="./pacts")

def test_get_next_activity():
    expected = {
        "activity_type": "lesson",
        "activity_id": "les_a1_alphabet_sounds",
        "rationale": {
            "selection_rule": "mastery_gate",
            "mastery_gaps": ["greetings_vocab"],
            "i_plus_1": True
        },
        "estimated_duration_minutes": 15,
        "prerequisites_met": True
    }
    
    (pact
     .given("learner L1 exists with mastery gaps")
     .upon_receiving("a request for next activity")
     .with_request("GET", "/v1/learners/L1/next")
     .will_respond_with(200, body=expected))
    
    with pact:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{pact.uri}/v1/learners/L1/next") as resp:
                assert resp.status == 200
                data = await resp.json()
                assert data == expected
```

## Validation Checklist
- [ ] schemathesis passes for 100% endpoints
- [ ] Pydantic models match OpenAPI schemas
- [ ] verify-integrity.py PASS (0 failures)
- [ ] prd-score.py ≥ 80%
- [ ] Consumer-driven contracts generated and verified
- [ ] Schema validation in CI for every PR