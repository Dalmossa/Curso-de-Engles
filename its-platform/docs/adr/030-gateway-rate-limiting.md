---
adr: 030
title: Gateway Rate Limiting — three Redis-backed layers with exact numbers
status: Accepted
date: 2026-10-12
authors: [@platform-lead]
deciders: [@platform-lead, @sre-lead, @security-lead]
consulted: [@backend-lead]
informed: [@team]
tags: [kong, rate-limiting, redis, gateway, adr-006]
---

## Context

ADR-006 selected Kong 3.4+ as the API Gateway with declarative `deck` config.
Its implementation plan listed six items, of which only the declarative config and
the Redis-backed rate limiting were marked done — but **no artefact existed** in
the repository. This ADR delivers the two items P2.3 actually implements and
replaces the remaining checkboxes in ADR-006 with unchecked placeholders.

The platform's threat model (threat-model.md §3.5, D-06) names **flood** as a
P1 DoS vector: an attacker can overwhelm the API with unlimited requests.
The auth endpoints (S-03) are additionally subject to **credential stuffing**.
The MVP scope requires a **per-learner** quota for practice submissions (P2.3
acceptance). Three layers, composed additively, cover all three concerns.

## Decision

Three additive rate-limiting layers, all Redis-backed, all declared in the
single declarative file `iac/kong/kong.yml` (ADR-006 §Implementation Plan):

| Layer | Scope | `limit_by` | `minute` | Rationale |
|---|---|---|---|---|
| **Service** | every request to `its-platform-api` | `ip` | **1000** | D-06 flood (threat-model.md §3.5) |
| **/learners** | `/api/v1/learners` routes | `consumer` | **100** | P2.3 acceptance — per-learner practice quota |
| **/auth** | `/api/v1/auth` routes | `ip` | **5** | S-03 credential stuffing (threat-model.md S-03) |

All layers:
- `policy: redis` (shared Redis cluster with Celery)
- `redis_database: 2` (DB 2, separate from Celery DB 0)
- `fault_tolerant: true` (fail-open — denial is preferable to outage)
- `headers: true` (client receives `X-RateLimit-*` headers)
- `redis_username: "${KONG_REDIS_USERNAME}"`, `redis_password: "${KONG_REDIS_PASSWORD}"` — literal secrets forbidden

The `/learners` layer uses `limit_by: consumer` keyed on the JWT `sub` (ADR-013).
Until authentication lands (P1.15–P1.17), Kong falls back to IP for the consumer
key, and the service-wide 1000/min IP limit still bounds every client. The
latent 100/min consumer limit is never the looser one.

### Route Coverage

All API routes declared under `/api/v1` (CONSTITUTION §4.4) with `strip_path:
false` — the version segment is part of the contract. The only exceptions are
the `/health` and `/ready` probes (VERSION_NEUTRAL, excluded from the global
prefix in `src/main.ts`), which stay at the root.

### Route Coverage Derivation

Route coverage is derived from the canonical OpenAPI document
(`docs/api-spec.openapi.yaml`): every first segment under `/api/v1` must be
served by some route. The `/health` and `/ready` probes are the single declared
exception and must also exist.

### Redis Details

- Shared Redis cluster with Celery (ADR-005, ADR-011)
- Database 2 (`redis_database: 2`) — separate from Celery (DB 0)
- Credentials via `${KONG_REDIS_USERNAME}` / `${KONG_REDIS_PASSWORD}` placeholders
  (literal secrets anywhere fails the gate — ADR-030 D6/D7)

### `deck` Sync

Declarative sync (`deck sync --state iac/kong/kong.yml`) is **not** part of
P2.3; it belongs to P2.5 (Helm + ArgoCD). The config is validated by the
machine gate `scripts/kong-config-check.mjs` (`npm run kong:check`), which
runs in CI.

## Consequences

### Positive
- **Three explicit, machine-checked layers** — no ambiguity about "who limits
  what" or "what the number is".
- **Fail-open (`fault_tolerant: true`)** — a Redis outage never becomes an API
  outage; the denial is preferable to total unavailability.
- **Gate enforces the contract** — `scripts/kong-config-check.mjs` (9 assertions)
  makes the declarative file the single source of truth; drift is a red gate.
- **Per-learner quota latent but correct** — `limit_by: consumer` is the right
  primitive; it degrades gracefully to IP until auth lands.

### Negative
- **Redis dependency** — a Redis outage disables rate limiting (fail-open).
- **Consumer key latency** — `limit_by: consumer` requires the JWT to be
  validated first; Kong does this per-request. Acceptable for P2.3 throughput.
- **Per-learner quota latent until auth** — until P1.15–P1.17 the 100/min
  consumer limit never triggers; the 1000/min IP limit is the active bound.

### Neutral
- The example in ADR-006 (three upstreams: curriculum-service, adaptive-engine,
  auth-service) is explicitly documented as pre-ADR-012 and superseded by the
  NestJS monolith `its-platform-api`. That example remains in ADR-006 as a
  historical note.

## Implementation Plan

- [x] Create `iac/kong/kong.yml` with three layers — **P2.3 done 2026-10-12**
- [x] Create `scripts/kong-config-check.mjs` (9 assertions) — **P2.3 done**
- [x] Add `kong:check` job to CI (`.github/workflows/ci.yml`) — **P2.3 done**
- [ ] Add Kong Helm chart to `iac/helm/its-platform/charts/` — **P2.5**
- [ ] Add `deck sync` step to CI pipeline — **P2.5**
- [ ] Add Prometheus plugin + ServiceMonitor — **P2.7**
- [ ] Add correlation-id plugin — **P0.8/P2.8**
- [ ] Custom plugin: `reuse-basis-check` — P3
- [ ] Custom plugin: `content-license` (blocks `adapt_*` on restricted) — P3
- [ ] WAF rules (OWASP CRS via `kong-plugin-waf`) — P3
- [ ] Canary deployment via `deck` weight-based routing — P3

## Validation

Machine gate `scripts/kong-config-check.mjs` (`npm run kong:check`) enforces
all 9 assertions (ADR-030 D7):

1. `kong.yml` parses as YAML, `_format_version: "3.0"`, `_transform: true`
2. No legacy upstream (`curriculum-service`, `adaptive-engine`, `auth-service`)
   in active YAML (comment lines excluded)
3. Exactly one upstream: `its-platform-api`
4. Every API route under `/api/v1`, `strip_path: false`; probes at root
5. Route coverage from canonical OpenAPI — every first segment covered
6. Three layers with exact `limit_by` + `minute` (service 1000/ip, learners
   100/consumer, auth 5/ip)
7. Every rate-limiting plugin Redis-backed with placeholders, DB 2, fault-
   tolerant, headers, no literal secrets
8. Route coverage from canonical OpenAPI spec matches declared routes
9. Probes `/health` and `/ready` present

All 9 assertions must pass for `kong:check` to exit 0.

## References

- ADR-006 — Kong as API Gateway (this ADR supersedes its implementation plan)
- ADR-031 — identifiers, URLs, nesting (the `/api/v1` prefix)
- ADR-033 — versioning/deprecation (probes are VERSION_NEUTRAL)
- `threat-model.md` §3.5 — DoS D-06 flood, S-03 credential stuffing
- `CONSTITUTION.md` §4.4 — URL path versioning mandatory
- `iac/kong/kong.yml` — the single declarative config
- `scripts/kong-config-check.mjs` — the machine gate
- `.github/workflows/ci.yml` — the CI job `kong-check`

