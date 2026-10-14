---
name: OpenAPI Spec
description: OpenAPI 3.1 specification design, validation, examples, contract testing for ITS Platform
---

# OpenAPI Spec Skill — ITS Platform

## When to Use
- Designing or changing an API contract
- Validating the implementation against the contract
- Generating client SDKs
- Contract testing

## There is exactly one copy — never paste the document here

**Canonical: `its-platform/docs/api-spec.openapi.yaml`.**

`CONSTITUTION.md` §4.4 names it as the versioning reference, and
`its-platform/scripts/contract-gate.mjs` (`npm run contract:gate`) enforces it
against the NestJS routes.

Until A2 this skill carried a **third** copy of the schema — a 862-line fenced
YAML block — alongside `docs/api-spec.openapi.yaml` and the deprecated
`docs/api/openapi.yaml`. It had already drifted: it advertised
`/auth/refresh` as a live endpoint with a `RefreshToken` scheme, which ADR-013
forbids (this platform is a Resource Server, `CONSTITUTION.md` §4.5), and it
asserted a media type and a schema that no longer existed. A document in three
places is a document that disagrees with itself; ADR-040 D4 removed this copy
for the same reason D3 is removing the second one.

**Read the canonical file. Do not restate it.** If something here and the
canonical file disagree, the file wins and this page is wrong.

## What the gate enforces (the source of truth for these rules)

| Rule | Why it exists |
|---|---|
| Parses as bare YAML, `openapi: 3.1.x` | The canonical file was Markdown with a `.yaml` name — no tool could consume it (ADR-040 D2) |
| `components.schemas` non-empty | The old substring gate passed with it emptied (A0, N-4a) |
| Every `$ref` resolves | An unresolvable `$ref` is a contract that describes nothing |
| Every `server.url` ends in `/api/v1` | §4.4 — URL versioning is mandatory; header/query versioning is prohibited |
| No boolean `Deprecation` header | RFC 9745 defines a **date**; `true` is the obsolete draft form (ADR-033 D2) |
| `Problem` has `type`/`title`/`status` | §4.3 — errors are RFC 9457 |
| 4xx/5xx serve only `application/problem+json` | §4.3, ADR-034 D4 |
| `GET` on a path with a parameter declares `404` | R6 — another learner's object is 404, never 403 (ADR-038) |
| Spec ↔ routes agree **in both directions**, method by method | The drift no gate saw: 12 implemented × 10 published (A0) |
| `info.x-contract-provenance.spec-blobs` matches `git hash-object` | D6 — without the pin, drift between a spec and the contract is undetectable |

Route exemptions (`/health`, `/ready`) are declared in the gate and **a stale
exemption fails the gate**, so the list cannot accumulate dead permissions.

## Where the rules live — cite, do not invent

- `its-platform/CONSTITUTION.md` §4.3 (RFC 9457 errors), §4.4 (versioning,
  deprecation, breaking changes), §4.5 (TLS, Resource Server), §4.6 (correlation)
- `its-platform/docs/adr/031` identifiers/nesting · `032` pagination and
  envelope · `033` versioning/deprecation · `034` problem+json ·
  `035` idempotency · `036` caching/conditional requests · `037` async jobs ·
  `038` authZ and 404 · `040` canonical document, gate, pin
- `Curso-de-Ingles/specs/*.md` — the source of truth the contract derives from
  (ADR-018); the gate's pin names the exact revisions

## Division of responsibility — do not duplicate an obligation

- `scripts/contract-gate.mjs` owns **spec × implementation**.
- `tests/contract/schemas.spec.ts` owns **instance × schema** and the drift
  guard between the documents.
- `tests/contract/gate.spec.ts` owns the gate's own **negative controls**.

Two copies of one obligation is the defect ADR-040 exists to remove. When you
add a rule, put it in exactly one of those three.

## Checklist for a contract change

- [ ] The change is in `docs/api-spec.openapi.yaml` only — no second copy
- [ ] `npm run contract:gate` passes (and a new rule has a negative control in `tests/contract/gate.spec.ts`)
- [ ] `tests/contract/` passes
- [ ] If a published path, method, parameter, media type or error `code` changed,
      §4.4 applies: it is a breaking change with a deprecation window, recorded in
      `CHANGELOG.md`
- [ ] If the change came from a spec, the `x-contract-provenance` pin was moved
      **after** reviewing the diff it introduces
- [ ] No secrets, no internal identifiers (table names, SQL, stack traces) in
      examples — §4.5
