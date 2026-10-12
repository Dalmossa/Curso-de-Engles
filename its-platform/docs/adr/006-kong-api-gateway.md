---
adr: 006
title: Kong as API Gateway with declarative config
status: Accepted
date: 2026-10-03
authors: [@platform-lead]
deciders: [@platform-lead, @sre-lead, @security-lead]
consulted: [@backend-lead]
informed: [@team]
tags: [api-gateway, kong, declarative, kubernetes]
---

## Context

The ITS Platform needs an API Gateway for:
- **Authentication** — JWT validation, PKCE, token refresh
- **Rate limiting** — per-learner, per-IP, per-endpoint
- **Request/response transformation** — headers, versioning
- **Observability** — logging, metrics, tracing
- **Security** — WAF, IP blocking, CORS
- **Load balancing** — service discovery, health checks

Alternatives: Kong, Traefik, NGINX Ingress, AWS ALB, Envoy/Gateway API.

## Decision

**Use Kong 3.4+ in DB-less mode with declarative configuration (deck).**

### Why Kong?

| Requirement | Kong | Traefik | NGINX | AWS ALB | Envoy |
|---|---|---|---|---|---|
| JWT validation | ✅ Native | ✅ Plugin | ❌ Lua | ✅ Native | ✅ Filter |
| Rate limiting (distributed) | ✅ Redis-backed | ✅ Plugin | ❌ | ✅ Native | ✅ Filter |
| Declarative config | ✅ deck sync | ✅ CRDs | ❌ | ❌ | ✅ xDS |
| Plugin ecosystem | ✅ Large | ✅ Medium | ❌ Small | ❌ | ✅ WASM |
| Kubernetes native | ✅ Ingress Controller | ✅ Native | ✅ Ingress | ✅ ALB Controller | ✅ Gateway API |
| Team familiarity | ✅ High | Medium | High | High | Low |

### Declarative Configuration (deck)

```yaml
# kong/kong.yml
_format_version: "3.0"
_transform: true

services:
  - name: curriculum-service
    url: http://curriculum-service.its-platform.svc.cluster.local:8000
    routes:
      - name: curriculum-route
        paths:
          - /v1/curriculum
        strip_path: true
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
          policy: redis
          redis_host: redis-cluster
          redis_port: 6379
          fault_tolerant: true
      - name: correlation-id
      - name: request-transformer
        config:
          add:
            headers:
              - "X-Service:curriculum"

  - name: adaptive-engine
    url: http://adaptive-engine.its-platform.svc.cluster.local:8000
    routes:
      - name: adaptive-route
        paths:
          - /v1/adaptive
        strip_path: true
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 50
          hour: 500
          policy: redis
      - name: correlation-id

  - name: auth-service
    url: http://auth-service.its-platform.svc.cluster.local:8000
    routes:
      - name: auth-route
        paths:
          - /v1/auth
        strip_path: true
    plugins:
      - name: rate-limiting
        config:
          minute: 20
          hour: 100
          policy: redis
      - name: cors

consumers:
  - username: its-platform-spa
    custom_id: spa-client
    plugins:
      - name: jwt
        config:
          key: its-platform-spa
          algorithm: RS256
          rsa_public_key: "${JWT_PUBLIC_KEY}"

plugins:
  - name: prometheus
  - name: request-termination
    config:
      status_code: 503
      message: "Service temporarily unavailable"
```

> **Note (2026-10-12, ADR-030):** the config example above predates ADR-012 — its three
> upstreams (`curriculum-service`, `adaptive-engine`, `auth-service`) no longer exist; the
> API layer is a NestJS monolith. The live declarative config is `iac/kong/kong.yml` (one
> service `its-platform-api`), whose rate-limiting numbers supersede the example's
> per-service split — see ADR-030 §D1–D3.

### Kong Ingress Controller (KIC)

```yaml
# helm/kong/values.yaml
ingressController:
  enabled: true
  installCRDs: true
  env:
    KONG_DECLARATIVE_CONFIG: /kong/declarative/kong.yml
    KONG_LUA_PACKAGE_PATH: /kong/plugins/?.lua;;
  enterprise:
    enabled: false
  proxy:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
      service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
  admin:
    enabled: false  # DB-less mode
  envFrom:
    - secretRef:
        name: kong-secrets
```

## Consequences

### Positive
- **GitOps native** — `deck sync` in CI/CD; config in repo
- **DB-less** — no PostgreSQL for Kong; stateless, scalable
- **Plugin richness** — JWT, rate-limiting, correlation-id, transformers built-in
- **Kubernetes native** — KIC manages routes via Ingress/CRDs
- **Observability** — Prometheus plugin, OpenTelemetry, access logs
- **Performance** — NGINX core, ~10k req/s per worker

### Negative
- **Lua plugins** — custom logic in Lua (learning curve)
- **deck sync** — must run in CI; drift detection needed
- **Memory** — ~200MB base + plugins; plan capacity
- **Upgrade risk** — Kong major versions break plugins

### Neutral
- **License** — Open Source (Apache 2.0); Enterprise features not needed
- **Gateway API** — KIC supports Gateway API CRDs (HTTPRoute, GRPCRoute)

## Alternatives Considered

1. **Traefik** — Good K8s native, but plugin ecosystem smaller; rate limiting less mature
2. **NGINX Ingress + Lua** — Manual Lua for JWT/rate-limiting; no declarative sync
3. **AWS ALB + Cognito** — Vendor lock-in; limited customization; no declarative config
4. **Envoy + Gateway API** — Steep learning curve; xDS complexity; team unfamiliar
5. **Custom middleware in FastAPI** — No cross-service concerns (rate limiting, auth)

## Implementation Plan

> **Audit finding 2026-10-12 — ADR-006 carried false `[x]` checkboxes (corrected by P2.3 /
> ADR-030).** Six items below were marked done although **no Kong artefact existed anywhere
> in the repository** — no `kong.yml`, no Helm chart, no `deck` step, no plugin config;
> `iac/` held only empty directories and a grep of the non-doc tree for `kong|declarative|deck`
> had zero matches. The checkboxes recorded design approval, not delivery — the same disease
> ADR-009 was corrected for on 2026-10-06. The two items P2.3 actually delivers keep their
> checkmark; the rest stay unchecked until their artefacts exist.

- [ ] Add Kong Helm chart to `iac/helm/its-platform/charts/kong-2.20.0.tgz` — **no chart exists; P2.5**
- [x] Create `iac/kong/kong.yml` declarative config — **P2.3 2026-10-12 (ADR-030)** *(the plan said `kong/kong.yml`; the repo's infra root is `iac/`, so the config lives at `iac/kong/kong.yml`)*
- [ ] Add `deck` to CI pipeline: `deck sync --state iac/kong/kong.yml` — **P2.5**
- [x] Configure Redis-backed rate limiting (shared with Celery) — **P2.3 2026-10-12 (ADR-030): three layers, `policy: redis`**
- [ ] Add Prometheus plugin + ServiceMonitor — **P2.7**
- [ ] Add correlation-id plugin for distributed tracing — **P0.8/P2.8**
- [ ] Custom plugin: `reuse-basis-check` (validates `Reuse basis` header) — P3
- [ ] Custom plugin: `content-license` (blocks `adapt_*` on restricted content) — P3
- [ ] WAF rules: OWASP Core Rule Set via `kong-plugin-waf` — P3
- [ ] Canary deployment via `deck` weight-based routing — P3

## References

- `security-spec.md` §2.1 — Auth flow via Kong
- `threat-model.md` §3.5 — DoS D-06
- `iac-spec.md` §3.2 — Kong Helm values
- Kong docs: https://docs.konghq.com
- deck docs: https://docs.konghq.com/deck