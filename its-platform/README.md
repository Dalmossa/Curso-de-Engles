# ITS Platform

**Intelligent Tutoring System for English Learning** — Adaptive learning platform for Brazilian Portuguese speakers with focus on IT professionals.

## Overview

ITS Platform is a production-ready adaptive learning system built on evidence-based pedagogical principles:

- **BKT (Bayesian Knowledge Tracing)** for mastery tracking
- **IRT (Item Response Theory)** for adaptive placement (CAT)
- **FSRS (Free Spaced Repetition Scheduler)** for optimal review scheduling
- **CEFR-aligned curriculum** (A1–C2) with 123 lessons, 122 practice packs
- **LGPD/GDPR compliant** with PostgreSQL RLS, JWT auth, audit logging

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
                        API Gateway (Kong)
└─────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  Learner      │         │  Adaptive     │         │  Content      │
│  Service      │         │  Engine       │         │  Service      │
│  (Auth,       │         │  (BKT/IRT/    │         │  (Lessons,    │
│   Profile)    │         │   FSRS)       │         │   Packs)      │
└───────────────┘         └───────────────┘         └───────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  ▼
                    ┌───────────────────────────┐
                    │     PostgreSQL (RLS)      │
                    │     Redis (Cache/Queue)   │
                    └───────────────────────────┘
```

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 16+
- Redis 7+
- Poetry 1.8+

### Installation

```bash
# Clone and enter
cd its-platform

# Install dependencies
make install

# Configure environment
cp .env.example .env
# Edit .env with your database/redis credentials

# Run database migrations
make db-upgrade

# Sync content from repository
make content-sync

# Start development server
make run-dev
```

### Docker

```bash
# Build image
make docker-build

# Run with docker-compose (requires postgres, redis)
docker-compose up -d
```

## Development

### Common Commands

```bash
# Code quality
make check-all          # lint + format-check + type-check
make format             # auto-format with black

# Testing
make test               # all tests
make test-unit          # unit tests only (≥95% coverage)
make test-integration   # integration tests (≥80% coverage)
make test-bdd           # BDD tests
make test-mutation      # mutation testing (≥85% score)

# Database
make db-migrate MSG="add new column"  # create migration
make db-upgrade                       # apply migrations

# Content
make content-verify     # verify-integrity.py + prd-score.py
make content-sync       # sync lessons/packs to database

# Run
make run-dev            # development server with reload
make run                # production server
```

### Project Structure

```
its-platform/
├── src/its_platform/           # Application source
│   ├── main.py                 # FastAPI entry point
│   ├── config.py               # Settings management
│   ├── api/v1/                 # API routers
│   ├── db/                     # Database layer
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── session.py          # Async session management
│   │   └── migrations/         # Alembic migrations
│   ├── content/                # Content loading
│   │   ├── loader.py           # Markdown parsing
│   │   └── service.py          # DB sync service
│   └── adaptive/               # BKT/IRT/FSRS engines (TODO)
├── tests/
│   ├── unit/                   # Unit tests (≥95%)
│   ├── integration/            # Integration tests (≥80%)
│   ├── contract/               # Contract tests (100%)
│   └── bdd/                    # BDD tests (100% milestones)
├── docs/
│   ├── api-spec.openapi.yaml   # OpenAPI 3.1 spec
│   ├── security-spec.md        # Security specification
│   ├── threat-model.md         # STRIDE threat model
│   ├── runbook.md              # Operations runbook
│   └── adr/                    # Architecture Decision Records
├── pyproject.toml              # Poetry configuration
├── alembic.ini                 # Alembic configuration
├── Dockerfile                  # Multi-stage Docker build
├── Makefile                    # Development commands
└── .github/workflows/ci.yml    # CI/CD pipeline
```

## API Documentation

- **Swagger UI**: http://localhost:8000/docs (dev only)
- **ReDoc**: http://localhost:8000/redoc (dev only)
- **OpenAPI Spec**: `/openapi.json`
- **Health Check**: `/health`
- **Readiness**: `/ready`
- **Metrics**: `/metrics` (Prometheus)

## Content Repository

Content (lessons, packs, listening corpus) is maintained in the parent `Curso-de-Ingles/` repository and loaded via the Content Service.

```bash
# Verify content integrity (runs 13 checks)
python3 ../verify-integrity.py

# Score PRD compliance
python3 ../prd-score.py
```

## Security

- **Authentication**: JWT with PKCE, 15min access / 30day refresh tokens
- **Authorization**: PostgreSQL Row-Level Security (RLS) on all learner-scoped tables
- **Transport**: mTLS via Istio (production)
- **Gateway**: Kong API Gateway with rate limiting
- **Compliance**: LGPD Art. 18 (data export/erasure), OWASP ASVS L2

## Observability

- **Metrics**: Prometheus (`/metrics`)
- **Logs**: Structured JSON via structlog
- **Traces**: OpenTelemetry → OTLP
- **SLOs**: Defined in `docs/runbook.md`

## Deployment

### Kubernetes (Helm + ArgoCD)

```bash
# Install via Helm
helm install its-platform ./iac/helm/its-platform \
  --namespace its-platform \
  --create-namespace

# ArgoCD manages sync (GitOps)
```

### Environments

| Environment | Branch | Deploy |
|-------------|--------|--------|
| Development | `develop` | Auto on push |
| Staging | `main` | Auto on push |
| Production | `release/*` | Manual ArgoCD sync |

## Contributing

1. Follow `CONSTITUTION.md` standards
2. Write tests first (TDD/BDD)
3. Run `make check-all` before PR
4. Contract tests must pass for API changes
5. Mutation testing ≥85% for adaptive engine

## License

Proprietary — ITS Platform Team