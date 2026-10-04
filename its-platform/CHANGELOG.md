# Changelog

All notable changes to the ITS Platform API are recorded here.

**Mandate:** `CONSTITUTION.md` §4.4 — *"Every breaking change is recorded in `CHANGELOG.md`
with the migration path before the change merges."* This file is that record. It was
mandated by Constitution v1.0.0 and did not exist until 2026-10-04; the omission was found
while amending §4.4, not by any automated check.

**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning per
[SemVer](https://semver.org/spec/v2.0.0.html) as governed by `CONSTITUTION.md` §6.1.

---

## Unreleased

No released version yet. The platform has never been deployed.

### Changed — breaking

| Change | Migration path | Story |
|---|---|---|
| Error responses move from `ErrorResponse` (`{error, message, request_id}`, `application/json`) to RFC 9457 `Problem` (`{type, title, status, detail, instance}`, `application/problem+json`) | Clients branching on the `error` string read `Problem.title`; clients reading `message` read `Problem.detail`; `request_id` is retained as an RFC 9457 extension member. `ErrorResponse` remains declared and `deprecated: true` for the duration of the migration. | P1.17 |

### Changed — non-breaking

| Change | Notes | Story |
|---|---|---|
| Base URL gains an `/api` prefix: `/v1` → `/api/v1` | Only the `servers.url` entries in `docs/api-spec.openapi.yaml` change. **No path within the API is renamed** — the 9 published paths are unchanged. A client that built its base URL from the server list must re-read it. | ADR-012 |
| Local development port `8000` → `3000` | uvicorn's default → NestJS's default. Loopback only. | ADR-012 |
| Global path versioning enforced | `app.setGlobalPrefix('api')` + `enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })`. Header and query-parameter versioning are prohibited by §4.4. | ADR-012 |

### Added

| Addition | Notes | Story |
|---|---|---|
| `Problem` schema (RFC 9457) | Declared in `components/schemas`. `ErrorResponse` is marked `deprecated: true`. | P1.17 |
| `/auth/refresh` annotated `x-mvp-scope: excluded` | Returns `501`. The path is annotated rather than deleted because removal is itself a breaking change and ADR-013 does not authorise one. | ADR-013 |

### Deprecated

| Deprecated | Sunset | Replacement | Notes |
|---|---|---|---|
| `ErrorResponse` schema | TBD — set when P1.17 lands | `Problem` | Do not use for new endpoints. |
| `/auth/refresh` | **No sunset date.** Blocked on ADR-013. | Token refresh performed by the external IdP | Not merely deprecated — **out of MVP scope and must not be implemented.** Sunset is deliberately absent because the endpoint is not planned, not scheduled. |

---

## Deprecation policy

`CONSTITUTION.md` §4.4 governs. Restated here so the changelog is self-contained for a
reader who arrives from a release note.

| Rule | Value |
|---|---|
| **Response headers on a deprecated endpoint** | `Deprecation: true` and `Sunset: <HTTP-date>` (RFC 8594) |
| **Minimum notice — security and correctness fixes** | 90 days |
| **Minimum notice — feature retirement** | 180 days |
| **Retirement gate** | The `Sunset` date has passed **and** ADR-006 (Kong) access logs show **no external traffic to that prefix for 30 consecutive days**. This metric must already exist when the endpoint is deprecated, not be built afterwards. |
| **Rule for changing a `Sunset` date** | Allowed only in the direction of *later*, and the change is itself a changelog entry with a reason. |

---

## Version history

No released versions. `CONSTITUTION.md` §6.1 defines the release SemVer policy that will
apply from the first release.
