---
adr: 030
title: Gateway rate limiting — layering, numbers, and an honest declarative config
status: Accepted
date: 2026-10-12
authors: [@platform-lead]
deciders: [@platform-lead, @sre-lead, @security-lead]
consulted: [@backend-lead]
informed: [@team]
tags: [api-gateway, kong, rate-limiting, redis, security, security-spec]
---

## Context

P2.3's acceptance is **per-learner 100/min, per-IP 1000/min, enforced at the gateway**
(BACKLOG P2.3; ADR-006 chose Kong 3.4+ in DB-less mode with a declarative config). Opening
the story surfaced four measured facts:

1. **ADR-006's Implementation Plan carries six `[x]` checkboxes for artefacts that do not
   exist.** A grep of the non-doc tree for `kong|declarative|deck` returns zero matches;
   `iac/` contains only empty directories (`terraform/`, `helm/`, `argocd/`); there is no
   `kong.yml`, no Helm chart, no `deck` step in CI, no Prometheus/correlation-id plugin
   config anywhere in the repository. The checkboxes recorded the ADR's design approval, not
   delivery — the same disease ADR-009 was corrected for on 2026-10-06.
2. **ADR-006's example YAML routes to three upstreams that no longer exist.**
   `curriculum-service`, `adaptive-engine` and `auth-service` are the pre-ADR-012 split; the
   API layer is a NestJS monolith (`src/app.module.ts`, controllers `health`/`auth`/
   `content`/`learners`). A configuration copied from the ADR would encode non-existent
   upstreams into the gateway.
3. **The rate-limit numbers conflict across artefacts.**
   - P2.3 acceptance (canonical): per-learner **100/min**, per-IP **1000/min**.
   - `security-spec.md` §2: *"rate limiting (100 req/min/learner)"* — agrees with the
     per-learner figure.
   - ADR-006's example: per-service split limits (curriculum 100/min, adaptive 50/min, auth
     20/min) plus hour caps — a split that died with the monolith; the hour caps would 429 a
     legitimate learner long before the 100/min window fills (`test_kong_rate_limiting`'s
     *"101st request → 429"* is only reachable if no hour cap trips first).
   - `threat-model.md` S-03 (credential stuffing): *"Rate limiting (5/min), CAPTCHA after 3
     failures"*.
   - `tests/bdd/README.md`, auth scenario: *"100 attempts… When the 6th request arrives…
     Kong returns 429… And the IP is blocked for 15 minutes"*.
4. **The auth route has no identity to key on yet.** P1.15–P1.17 (auth) and ADR-013 are
   open; `/auth/refresh` returns 501. "Per-learner" therefore cannot bind to a JWT today.

## Decision

**D1 — One upstream, not three.** A single Kong service `its-platform-api` (URL
`http://its-platform-api:3000`, the NestJS monolith) with one route per controller surface,
`strip_path: false` (the API has no global prefix; `@Controller()` paths are served as-is).
ADR-006's example upstreams are superseded by ADR-012, stated in the config header.

**D2 — Three rate-limiting layers, all `policy: redis`:**

| Layer | Scope | `limit_by` | Limit | Threat | Status |
|---|---|---|---|---|---|
| Per-IP | service (all routes) | `ip` | **1000/min** | D-06 flood | **enforced now** |
| Per-learner | `/learners` route | `consumer` | **100/min** | fair use | declared now; enforced when auth lands |
| Auth per-IP | `/auth` route | `ip` | **5/min** | S-03 stuffing | **enforced now** |

Multiple `rate-limiting` instances compose additively: on `/auth` both the service-wide
1000/min and the route 5/min are counted, and the tighter window trips first.

**D3 — The acceptance numbers are canonical; ADR-006's example numbers are superseded.**
`minute: 100` per-learner and `minute: 1000` per-IP are the gate's asserted contract. The
hour caps are dropped (they conflict with the 100/min acceptance and with
`test_kong_rate_limiting`'s *"101st → 429"*); the per-service split numbers are moot. The
auth route tightens per-IP to **5/min** per S-03 — the BDD scenario's *"6th request → 429"*
holds exactly.

**D4 — "Blocked for 15 minutes" is not expressible in the built-in plugin.** The
`rate-limiting` plugin's windows are second/minute/hour/day/month/year; there is no
block-and-release feature. The BDD scenario is corrected to the achievable contract: the 6th
request in a minute → **429 + `Retry-After`**, window rolls at the minute boundary. A
15-minute ban (a custom plugin or WAF rule) stays out of scope, recorded in the ADR-006
Implementation Plan rather than silently promised.

**D5 — Per-learner keying is latent, and the config says so.** `limit_by: consumer` is
declared on the `/learners` route; no consumers exist until P1.15–P1.17 (ADR-013). Until
then Kong keys the fallback (the client IP), but the service-wide per-IP 1000/min still
bounds every client, so the latent per-learner 100/min is **never the looser limit**. The
acceptance is therefore declared now and enforced the moment authentication lands, without
an unenforced gap in between. `limit_by: header` was rejected (D-Alternatives) because a
client-supplied `X-Learner-Id` is forgeable — header-based keying is for trusted internal
headers only.

**D6 — Redis.** `policy: redis`; `redis_host: redis-cluster`, `redis_port: 6379` literal
(matching ADR-005/006's service name and `runbook.md`); **`redis_database: 2`** — a
dedicated counters DB, per `security-spec.md`'s *"separate DBs per service"* (DB 0 = Celery
broker, DB 1 = Celery result, DB 2 = gateway counters); `redis_username`/`redis_password`
are **only** `${KONG_REDIS_USERNAME}`/`${KONG_REDIS_PASSWORD}` placeholders resolved by
`deck` at sync time (P2.5) — the state file carries no secrets and the gate enforces it;
`fault_tolerant: true` (fail-open on Redis outage) matches ADR-006's example and the
platform's availability bias for D-01/D-06, with the mitigation that P2.7 must alert on
Redis health (the `/ready` probe's `redis` check).

**D7 — The config is defined and gated, not deployed.** `iac/kong/kong.yml` is the
declarative contract. `npm run kong:check` = `scripts/kong-config-check.mjs` parses it with
the `yaml` package (a dependency already present) and asserts: `_format_version: "3.0"` +
`_transform: true`; a single monolith upstream with no legacy service names anywhere in the
file; route coverage derived from `docs/api/openapi.yaml` (every first segment of its paths)
plus `/health` and `/ready`; the three layers with their exact `limit_by`/`minute`; `policy:
redis` on every rate-limit plugin; `strip_path: false` on every route; no literal
`redis_password`. Deck sync and Helm/ArgoCD arrive with P2.5; until then this is a static
contract gate, the same family as `contract:check`/`domain:check`, and CI's `summary`
aggregate includes the new `kong-check` job.

**D8 — ADR-006 is corrected** (ADR-009 precedent): six unchecked boxes with their owning
stories, two checked boxes that P2.3 actually delivers, and an audit note.

## Consequences

### Positive
- The P2.3 acceptance is machine-checked, not reviewed — `kong-config-check.mjs` fails on
  a wrong limit, a missing layer, a non-Redis policy, a legacy upstream, or a committed
  secret.
- The numbers are reconciled in one place: `security-spec.md` §2, `threat-model.md`
  S-03/D-06, the BDD scenario, and the acceptance now agree.
- The gateway encodes the *current* stack (monolith), not the pre-ADR-012 split.
- The per-learner limit is declared now, so the only work left when auth lands is defining
  consumers — no gateway rework.

### Negative
- Per-learner enforcement is **latent** until P1.15–P1.17/ADR-013; the interim guarantee is
  the per-IP ceiling, not the learner one.
- `fault_tolerant: true` means a Redis outage disables rate limiting (fail-open) — the
  correct bias for D-01/D-06 availability, but P2.7 must alert on Redis health for it to be
  a managed tradeoff.
- The BDD scenario text changes — the "15-minute block" claim is struck. Recorded in
  `CHANGELOG.md` as a non-breaking spec correction.
- `.env.example` grows four `KONG_REDIS_*` variables that nothing consumes until P2.5's
  deployment.

### Neutral
- Redis DB 2 is reserved for gateway counters in the service-DB map; ADR-005/011 document
  the other numbered DBs.
- The example YAML in ADR-006 remains as history, but with a note that the live config is
  `iac/kong/kong.yml`.

## Alternatives Considered

1. **App-level (NestJS) throttling** — Rejected as the enforcement point: ADR-006 and
   `CONSTITUTION.md` §4.6 place the control at the gateway, and without auth an app-layer
   per-learner limit is indistinguishable from per-IP. Defence in depth may revisit in P3.
2. **NGINX `limit_req` / Envoy local rate limiting** — Rejected: not distributed (Redis),
   or adds a second gateway for one control.
3. **`limit_by: header` on `X-Learner-Id` for per-learner** — Rejected: a client-supplied
   header is forgeable with no auth; security theatre.
4. **`fault_tolerant: false` (fail-closed)** — Rejected: one Redis outage takes the whole
   API down; D-01/D-06 bias availability and alert (P2.7).
5. **Keep ADR-006's per-service split numbers** — Rejected: the split upstreams do not
   exist and the hour caps contradict the 100/min acceptance.

## Implementation Plan

- [x] `iac/kong/kong.yml` — declarative config: single monolith upstream, three layers, Redis policy (P2.3, 2026-10-12)
- [x] `scripts/kong-config-check.mjs` + `npm run kong:check` (P2.3, 2026-10-12)
- [x] CI `kong-check` job, wired into the `summary` aggregate (P2.3, 2026-10-12)
- [x] ADR-006 Implementation Plan corrected; audit finding registered in BACKLOG (P2.3, 2026-10-12)
- [ ] `deck sync` in CI (`deck sync --state iac/kong/kong.yml`) — P2.5
- [ ] Kong Helm chart + ArgoCD application — P2.5
- [ ] 15-minute ban for auth after repeated 429s (custom plugin or WAF rule) — P3
- [ ] Per-learner consumers defined once JWT lands — P1.15–P1.17 (ADR-013)

## References

- BACKLOG P2.3 (acceptance); ADR-006 (gateway choice + corrected plan); ADR-009 (honesty precedent); ADR-012 (monolith); ADR-005/011 (Redis)
- `security-spec.md` §2; `threat-model.md` S-03, D-06
- `tests/bdd/README.md` (auth scenario, corrected); `tests/README.md` §2 (`test_kong_rate_limiting`)
- Kong rate-limiting plugin reference: https://docs.konghq.com/hub/kong-inc/rate-limiting/