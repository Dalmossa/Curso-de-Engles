---
name: API Design
description: Design REST endpoints, OpenAPI schemas, Pydantic models, FastAPI patterns for ITS Platform
---

# API Design Skill — ITS Platform

## When to Use
- Designing new REST endpoints
- Creating/modifying OpenAPI schemas
- Defining Pydantic request/response models
- FastAPI dependency injection patterns
- API versioning and deprecation

## Workflow

### 1. Design Endpoint Contract
```yaml
# OpenAPI 3.1 snippet
paths:
  /v1/learners/{learner_id}/next:
    get:
      summary: Get next recommended activity (i+1 selection)
      operationId: getNextActivity
      security:
        - BearerAuth: []
      parameters:
        - name: learner_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: time_budget_minutes
          in: query
          schema:
            type: integer
            minimum: 5
            maximum: 60
      responses:
        '200':
          description: Next activity with rationale
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NextActivity'
              examples:
                lesson:
                  summary: Next lesson
                  value:
                    activity_type: "lesson"
                    activity_id: "les_a1_alphabet_sounds"
                    rationale:
                      selection_rule: "mastery_gate"
                      mastery_gaps: ["greetings_vocab"]
                      i_plus_1: true
                    estimated_duration_minutes: 15
                    prerequisites_met: true
```

### 2. Pydantic Model (Strict)
```python
# its_platform/schemas/curriculum.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal, Optional
from uuid import UUID

class NextActivity(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid', validate_assignment=True)
    
    activity_type: Literal["lesson", "practice_pack", "listening", "review"]
    activity_id: str = Field(pattern=r"^(les|pack|dlg)_[a-z0-9_]+$")
    rationale: "Rationale"
    estimated_duration_minutes: int = Field(ge=5, le=45)
    prerequisites_met: bool

class Rationale(BaseModel):
    model_config = ConfigDict(strict=True, extra='forbid')
    selection_rule: Literal["mastery_gate", "prerequisite", "spaced_review", "diagnostic_followup"]
    mastery_gaps: list[str]
    i_plus_1: bool
```

### 3. FastAPI Endpoint
```python
# its_platform/api/v1/curriculum.py
from fastapi import APIRouter, Depends, Path, Query
from its_platform.schemas.curriculum import NextActivity
from its_platform.services.curriculum import CurriculumService

router = APIRouter(prefix="/v1", tags=["curriculum"])

@router.get(
    "/learners/{learner_id}/next",
    response_model=NextActivity,
    summary="Get next recommended activity (i+1 selection)",
    responses={
        200: {"description": "Next activity with rationale"},
        404: {"model": ErrorResponse, "description": "Learner not found"},
        429: {"model": ErrorResponse, "description": "Rate limited"},
    },
)
async def get_next_activity(
    learner_id: UUID = Path(..., description="Learner UUID"),
    time_budget_minutes: int = Query(None, ge=5, le=60),
    curriculum: CurriculumService = Depends(),
) -> NextActivity:
    return await curriculum.get_next_activity(learner_id, time_budget_minutes)
```

## Key Patterns

### Dependency Injection
```python
# its_platform/dependencies.py
from fastapi import Depends
from its_platform.services.curriculum import CurriculumService
from its_platform.db.session import get_db

async def get_curriculum_service(db=Depends(get_db)) -> CurriculumService:
    return CurriculumService(db)
```

### Rate Limiting (Kong Plugin)
```yaml
# kong/kong.yml
plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
      policy: redis
      redis_host: redis-cluster
      redis_port: 6379
      fault_tolerant: true
```

### Correlation ID Middleware
```python
# its_platform/middleware/correlation.py
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response
```

## Validation Checklist
- [ ] OpenAPI spec has examples for all request/response bodies
- [ ] Pydantic models use `strict=True`, `extra='forbid'`
- [ ] All endpoints have RFC 7807 error responses
- [ ] Rate limiting configured per endpoint
- [ ] Correlation-ID propagated through all services
- [ ] Async/await used for all I/O
- [ ] Contract tests pass (`pytest tests/contract/ -v`)