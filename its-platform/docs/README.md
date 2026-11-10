# ITS Platform — Documentation Index

**Version:** 1.0 | **Last Updated:** 2026-11-10

---

## 📚 Documentation Structure

```
docs/
├── README.md                    # This file
├── runbook.md                   # Main runbook (operations)
├── runbook/
│   └── on-call.md              # On-call rotation & incident procedures
├── api-spec.md                  # API documentation (markdown)
├── api-spec.openapi.yaml        # OpenAPI 3.1 specification
├── data-model.erd.md            # ERD v1.0.0 (33 tables)
├── domain-model.md              # Domain model & bounded contexts
├── security-spec.md             # Security specification
├── threat-model.md              # STRIDE threat model
├── security-audit.md            # OWASP ASVS 4.0.3 L2 audit results
├── iac-spec.md                  # Infrastructure as Code specification
├── api/                         # API documentation (legacy)
├── iac/
│   └── kong/
│       └── kong.yml            # Kong declarative config
└── adr/                         # Architecture Decision Records
    ├── 001-use-fastapi.md
    ├── 002-bkt-irt-hybrid.md
    ├── 003-postgresql-rls.md
    ├── 004-two-pack-schemas.md
    ├── 005-async-celery.md
    ├── 006-kong-api-gateway.md
    ├── 007-istio-mtls.md
    ├── 008-argocd-gitops.md
    ├── 009-pgbackrest-backup.md
    ├── 010-content-submodule.md
    ├── 011-message-broker-selection.md
    ├── 012-migrate-api-layer-to-nestjs.md
    ├── 013-auth-architecture-resource-vs-authorization-server.md
    ├── 014-datastore-pglite-dev-postgres-prod.md
    ├── 015-domain-model-bounded-contexts.md
    ├── 016-canonical-identifier-registry.md
    ├── 017-mvp-adaptive-scope.md
    ├── 018-persistence-derived-from-specs.md
    ├── 019-p0.4-schema-migration.md
    ├── 020-content-loader-port.md
    ├── 021-per-lesson-skill-metadata.md
    ├── 022-content-loader-schema-reconciliation.md
    ├── 023-diagnostic-routing-semantics.md
    ├── 024-fixed-form-executor-contract.md
    ├── 025-theta-estimation-posterior.md
    ├── 026-learner-context-app-role.md
    ├── 027-content-api.md
    ├── 028-audio-delivery.md
    ├── 029-immutability-by-trigger.md
    ├── 030-gateway-rate-limiting.md
    ├── 031-identifiers-urls-nesting.md
    ├── 032-pagination-filtering-projections.md
    ├── 033-versioning-deprecation.md
    ├── 034-problem-details-profile.md
    ├── 035-idempotency-and-optimistic-concurrency.md
    ├── 036-caching-and-range.md
    ├── 037-async-jobs.md
    ├── 038-authz-scopes-and-object-level-404.md
    ├── 039-rate-limit-response-shape.md
    ├── 040-canonical-http-contract.md
    ├── 041-h1-catalog-write-surface.md
    ├── 042-h2-erasure-vs-append-only-log.md
    ├── 043-h3-theta-cors-sdk.md
    ├── 044-a6-no-answer-key-in-served-payloads.md
    ├── 044-a7-learner-route-bodies.md
    ├── 044-a8-no-answer-key-in-served-payloads.md
    ├── 045-a7-learner-route-bodies.md
    ├── 046-rag-pgvector-retrieval.md
    └── 047-user-auth-session-cookies.md
```

---

## 📖 Key Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **runbook.md** | Operations, deployment, incident response | SRE, On-call, Platform Lead |
| **runbook/on-call.md** | On-call rotation, incident procedures | On-call engineers, Platform Lead |
| **api-spec.openapi.yaml** | Canonical API contract | Backend, Frontend, QA |
| **api-spec.md** | API documentation (human-readable) | Developers, API consumers |
| **data-model.erd.md** | Database schema (33 tables) | Backend, DB Admin |
| **domain-model.md** | Domain-driven design | Architects, Backend |
| **security-spec.md** | Security architecture | Security, SRE, Compliance |
| **threat-model.md** | STRIDE threat model | Security, Architects |
| **security-audit.md** | OWASP ASVS 4.0.3 L2 results | Security, Compliance, Auditors |
| **iac-spec.md** | Infrastructure as Code | SRE, DevOps |
| **ADR/** | Architectural decisions | Architects, Tech Leads |

---

## 🔗 External References

| Resource | URL | Purpose |
|----------|-----|---------|
| **OpenAPI Spec** | `/docs/api-spec.openapi.yaml` | Machine-readable API contract |
| **Grafana Dashboards** | `/d/its-platform-overview` | Observability |
| **ArgoCD** | `https://argocd.example.com` | GitOps deployments |
| **pgBackRest** | `pgbackrest --stanza=prod info` | Backup status |
| **ArgoCD UI** | `https://argocd.example.com` | GitOps deployments |

---

## 📋 Documentation Standards

### Writing Guidelines
- Use **Mermaid** for diagrams
- Include **code blocks** with language tags
- Reference **ADR numbers** for decisions
- Link to **GitHub issues/PRs** for changes
- Keep **runbook** updated with every incident

### API Documentation
- Single source of truth: `api-spec.openapi.yaml`
- `api-spec.md` is human-readable rendering
- All endpoints must have: description, params, responses, examples
- Breaking changes require ADR + 30-day deprecation window

### Runbook Updates
- Update after **every P1/P2 incident**
- Review quarterly (Jan/Apr/Jul/Oct)
- On-call rotation updates weekly

---

## 📝 Documentation Checklist (P2.12)

- [x] API specification complete with examples
- [x] OpenAPI 3.1 spec valid
- [x] Runbook covers deployment, incidents, scaling
- [x] On-call rotation documented
- [x] Incident response playbooks
- [x] ADR log complete (001-047)
- [x] ERD v1.0.0 (33 tables)
- [x] Security spec (OWASP ASVS L2)
- [x] Threat model (STRIDE)
- [x] Security audit results
- [x] Observability stack documented
- [x] Backup/DR procedures
- [x] Deployment procedures
- [x] Rollback procedures
- [x] On-call rotation schedule
- [x] Escalation policies
- [x] Postmortem template
- [x] Architecture diagrams (Mermaid)
- [x] SLO definitions
- [x] Alerting rules documented
- [x] Runbook review date set

---

*Last Updated: 2026-11-10 | Next Review: 2027-02-10 | Owner: Platform Lead*
