---
adr: 001
title: Use FastAPI for API services
status: Accepted
date: 2026-10-03
authors: [@platform-lead]
deciders: [@platform-lead, @backend-lead, @security-lead]
consulted: [@adaptive-lead, @sre-lead]
informed: [@team]
tags: [api, framework, python, async]
---

## Context

The ITS Platform needs a modern, high-performance Python web framework for its microservices (curriculum, adaptive, diagnostic, content, assessment, listening, auth). Requirements:

- **Async native** — handle 10k+ concurrent learners with low latency
- **OpenAPI 3.1** auto-generation — contract-first development
- **Pydantic v2** validation — type-safe request/response
- **Dependency injection** — testability, clean architecture
- **Performance** — comparable to Node.js/Go for I/O-bound workloads
- **Team expertise** — Python ML ecosystem (scikit-learn, numpy) for adaptive engine

Alternatives evaluated: Flask, Django Ninja, FastAPI, Starlette (raw), Node.js/Express, Go/Gin.

## Decision

**Use FastAPI 0.110+ for all API services.**

Standardize on:
- `fastapi` + `uvicorn` (production) / `fastapi[dev]` (dev)
- `pydantic-settings` for config
- `sqlalchemy[asyncio]` + `asyncpg` for DB
- `redis[hiredis]` for cache/queue
- `httpx` for service-to-service calls

## Consequences

### Positive
- **Auto-generated OpenAPI** — single source of truth for contracts (matches `api-spec.openapi.yaml`)
- **Type safety** — Pydantic models catch bugs at dev time, not runtime
- **Async throughout** — no blocking I/O; handles 10k+ connections per worker
- **Dependency injection** — clean separation of concerns, easy mocking in tests
- **Performance** — ~2x Flask, ~5x Django for async workloads
- **Ecosystem** — integrates with ML stack (scikit-learn, torch) for adaptive engine

### Negative
- **Learning curve** — team members new to async/await, DI patterns
- **Migration cost** — if later switching to Go/Rust for performance-critical paths
- **Debugging async** — stack traces harder to read; need structured logging

### Neutral
- **Middleware ecosystem** — smaller than Express; may need custom middleware
- **Testing** — `pytest-asyncio` + `httpx.AsyncClient` required

## Alternatives Considered

1. **Django Ninja** — Good OpenAPI, but Django ORM not async-first; heavier
2. **Flask + Flask-RESTX** — Mature but no native async; OpenAPI manual
3. **Starlette (raw)** — Too low-level; reinvent DI, validation, OpenAPI
4. **Node.js/Express** — Team lacks TS expertise; ML integration harder
5. **Go/Gin** — Best performance but team is Python-first; ML ecosystem gap

## Implementation Plan

- [x] Add `fastapi`, `uvicorn[standard]`, `pydantic[email]` to `pyproject.toml`
- [x] Create base `FastAPI` app factory with lifespan, middleware, exception handlers
- [x] Define Pydantic models matching `api-spec.openapi.yaml`
- [x] Set up `sqlalchemy[asyncio]` + `alembic` for migrations
- [x] Configure `prometheus-fastapi-instrumentator` for metrics
- [ ] Add rate limiting middleware (per-learner, per-IP)
- [ ] Add request ID correlation middleware
- [ ] Document patterns in `CONTRIBUTING.md`

## References

- `api-spec.openapi.yaml` — Contract definitions
- `CONSTITUTION.md` §3 — Code standards
- FastAPI docs: https://fastapi.tiangolo.com
- Pydantic v2 migration guide: https://docs.pydantic.dev/latest/migration/