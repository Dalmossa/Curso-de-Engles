# Architecture Decision Records (ADR)

**Repository:** `its-platform/docs/adr/`
**Format:** Markdown with YAML frontmatter (MADR 3.0.0)
**Process:** See `CONSTITUTION.md` §4

---

## Index

| ID | Title | Status | Date | Supersedes |
|---|---|---|---|---|
| [001](001-use-fastapi.md) | Use FastAPI for API services | Accepted | 2026-10-03 | — |
| [002](002-bkt-irt-hybrid.md) | Hybrid BKT/IRT/FSRS for adaptive engine | Accepted | 2026-10-03 | — |
| [003](003-postgresql-rls.md) | PostgreSQL Row-Level Security for multi-tenancy | Accepted | 2026-10-03 | — |
| [004](004-two-pack-schemas.md) | Support two pack schemas (canonical + legacy) | Accepted | 2026-10-03 | — |
| [005](005-async-celery.md) | Async processing via Celery + Redis | Accepted | 2026-10-03 | — |
| [006](006-kong-api-gateway.md) | Kong as API Gateway with declarative config | Accepted | 2026-10-03 | — |
| [007](007-istio-mtls.md) | Istio mTLS for service mesh | Accepted | 2026-10-03 | — |
| [008](008-argocd-gitops.md) | ArgoCD for GitOps deployments | Accepted | 2026-10-03 | — |
| [009](009-pgbackrest-backup.md) | pgBackRest for PostgreSQL backup | Accepted | 2026-10-03 | — |
| [010](010-content-submodule.md) | Curso-de-Ingles as Git submodule | Accepted | 2026-10-03 | — |
| [011](011-message-broker-selection.md) | Message Broker Selection for ITS Platform | Accepted | 2026-10-04 | — |

---

## Template

```markdown
---
adr: 00X
title: Short Title
status: Proposed | Accepted | Rejected | Superseded
date: YYYY-MM-DD
authors: [@github_handle]
deciders: [@github_handle]
consulted: [@github_handle]
informed: [@github_handle]
tags: [tag1, tag2]
---

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Drawback 1
- Drawback 2

### Neutral
- Consideration 1

## Alternatives Considered

1. **Alternative A** — Why rejected
2. **Alternative B** — Why rejected

## Implementation Plan

- [ ] Step 1
- [ ] Step 2

## References

- Link to spec, doc, or issue
```