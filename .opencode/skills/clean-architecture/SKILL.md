---
name: Clean Architecture
description: Clean Architecture principles, layers, dependencies, SOLID for ITS Platform
---

# Clean Architecture Skill — ITS Platform

## When to Use
- Structuring new services/modules
- Enforcing dependency rules
- Code reviews for architectural compliance
- Refactoring legacy code

## Principles (Robert C. Martin)

### The Dependency Rule
```
Source code dependencies MUST point inward.
Inner layers know NOTHING about outer layers.
```

### Layer Structure (ITS Platform)
```
┌─────────────────────────────────────────┐
│           Enterprise Business Rules     │  ← Entities (Learner, Skill, Mastery)
│        (its_platform/domain/)           │
├─────────────────────────────────────────┤
│        Application Business Rules       │  ← Use Cases (SubmitPractice, GetNext)
│        (its_platform/application/)      │
├─────────────────────────────────────────┤
│        Interface Adapters               │  ← Controllers, Presenters, Gateways
│        (its_platform/api/, /adapters/)  │
├─────────────────────────────────────────┤
│        Frameworks & Drivers             │  ← FastAPI, SQLAlchemy, Redis, Kong
│        (its_platform/infrastructure/)   │
└─────────────────────────────────────────┘
```

## Folder Structure
```
its_platform/
├── domain/                    # Enterprise Business Rules
│   ├── entities/              # Learner, Skill, Mastery, ThetaEstimate
│   ├── value_objects/         # LessonId, PackId, SkillId, CEFRLevel
│   ├── events/                # DomainEvents (MasteryUpdated, LessonCompleted)
│   ├── repositories/          # Repository interfaces (abstract)
│   └── services/              # Domain services (MasteryCalculator)
│
├── application/               # Application Business Rules
│   ├── use_cases/             # SubmitPractice, GetNextActivity, RunDiagnostic
│   ├── dtos/                  # Data Transfer Objects
│   ├── ports/                 # Port interfaces (Repository, Cache, Queue)
│   └── services/              # Application services
│
├── api/                       # Interface Adapters (FastAPI)
│   ├── v1/                    # Versioned endpoints
│   ├── schemas/               # Pydantic request/response models
│   ├── dependencies.py        # FastAPI dependency injection
│   └── middleware/            # CorrelationId, Auth, RateLimit
│
├── adapters/                  # Interface Adapters
│   ├── repositories/          # SQLAlchemy implementations
│   ├── cache/                 # Redis implementations
│   ├── queue/                 # Celery implementations
│   └── external/              # HTTP clients for external APIs
│
├── infrastructure/            # Frameworks & Drivers
│   ├── db/                    # SQLAlchemy engine, session
│   ├── cache/                 # Redis client
│   ├── queue/                 # Celery app
│   ├── auth/                  # JWT, PKCE, Kong integration
│   ├── messaging/             # Event bus
│   └── config.py              # Settings (pydantic-settings)
│
└── main.py                    # FastAPI app factory
```

## Dependency Rules

### ✅ ALLOWED (Inward)
- `application` → `domain`
- `api` → `application` → `domain`
- `adapters` → `domain` (implements interfaces)
- `infrastructure` → `adapters` → `application` → `domain`

### ❌ FORBIDDEN (Outward)
- `domain` → `application` / `api` / `adapters` / `infrastructure`
- `application` → `api` / `adapters` / `infrastructure`

## SOLID Principles

| Principle | Application |
|-----------|-------------|
| **S**ingle Responsibility | Each class/module has one reason to change |
| **O**pen/Closed | Open for extension, closed for modification (Strategy pattern) |
| **L**iskov Substitution | Subtypes must be substitutable for base types |
| **I**nterface Segregation | Many specific interfaces > one general interface |
| **D**ependency Inversion | Depend on abstractions, not concretions |

## Code Examples

### Domain Entity
```python
# its_platform/domain/entities/learner.py
from dataclasses import dataclass, field
from uuid import UUID, uuid4
from datetime import datetime
from its_platform.domain.value_objects import CEFRLevel

@dataclass
class Learner:
    id: UUID = field(default_factory=uuid4)
    cefr_level: CEFRLevel = CEFRLevel.A1
    streak_days: int = 0
    xp: int = 0
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_active_at: datetime | None = None
```

### Repository Interface (Port)
```python
# its_platform/domain/repositories/learner_repository.py
from abc import ABC, abstractmethod
from uuid import UUID
from its_platform.domain.entities.learner import Learner

class LearnerRepository(ABC):
    @abstractmethod
    async def get_by_id(self, learner_id: UUID) -> Learner | None: ...
    
    @abstractmethod
    async def save(self, learner: Learner) -> None: ...
```

### Repository Implementation (Adapter)
```python
# its_platform/adapters/repositories/sqlalchemy_learner_repository.py
from its_platform.domain.repositories.learner_repository import LearnerRepository
from its_platform.db.models.learner import LearnerModel
from its_platform.domain.entities.learner import Learner

class SQLAlchemyLearnerRepository(LearnerRepository):
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_by_id(self, learner_id: UUID) -> Learner | None:
        result = await self.session.execute(
            select(LearnerModel).where(LearnerModel.id == learner_id)
        )
        model = result.scalar_one_or_none()
        return model.to_domain() if model else None
    
    async def save(self, learner: Learner) -> None:
        model = LearnerModel.from_domain(learner)
        await self.session.merge(model)
```

### Use Case (Application Service)
```python
# its_platform/application/use_cases/submit_practice.py
from its_platform.domain.repositories import LearnerRepository, MasteryRepository
from its_platform.application.ports import QueuePort

class SubmitPracticeUseCase:
    def __init__(
        self,
        learner_repo: LearnerRepository,
        mastery_repo: MasteryRepository,
        queue: QueuePort,
    ):
        self.learner_repo = learner_repo
        self.mastery_repo = mastery_repo
        self.queue = queue
    
    async def execute(self, learner_id: UUID, submission: PracticeSubmission) -> PracticeResult:
        learner = await self.learner_repo.get_by_id(learner_id)
        # ... business logic ...
        # Fire async tasks via queue port
        await self.queue.enqueue("update_bkt_mastery", learner_id, item_id, correct, rt)
        await self.queue.enqueue("schedule_fsrs_review", learner_id, item_id, grade)
        return result
```

## Validation Checklist
- [ ] Domain has NO imports from application/api/adapters/infrastructure
- [ ] Application only imports domain
- [ ] Adapters implement domain ports (interfaces)
- [ ] Infrastructure only provides concrete implementations
- [ ] All dependencies point inward
- [ ] No circular dependencies
- [ ] Use cases orchestrate, don't contain business logic