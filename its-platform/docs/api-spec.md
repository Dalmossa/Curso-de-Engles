# ITS Platform — OpenAPI 3.1 Specification

**Version:** 0.1.0-draft · **Generated from:** `Curso-de-Ingles/ITS-ARCHITECTURE.md` §6
**Source of truth for contracts:** `Curso-de-Ingles/specs/*.md`

---

## Where the document is

The OpenAPI document itself is **`docs/api-spec.openapi.yaml`** — a bare, parseable YAML file.

Until A2 that file was *this* page: a Markdown document whose only OpenAPI content was a
```` ```yaml ```` fenced block, so every tool that reads the canonical contract had either to
strip a fence by hand or fail. ADR-040 D2 split the two: the document became
`docs/api-spec.openapi.yaml`, and the prose you are reading became `docs/api-spec.md`.

Do not re-embed the document in a fence here. A fenced copy is how the canonical spec became
unparseable in the first place, and a second copy is a second thing to drift.

`docs/api/openapi.yaml` was the **deprecated predecessor** (9 of its 14 schemas, `servers` without
the §4.4 `/api/v1` prefix, no `Problem`). Its readers were repointed or retired and the file was
**removed in A3 (2026-10-14)** under ADR-040 D3; `CHANGELOG.md` ("Removed") carries the migration
path, and `git log -- docs/api/openapi.yaml` the file itself. A reference to it anywhere outside a
dated report is stale.

---

## Notes

- **URL versioning** is `/api/v1` (`CONSTITUTION.md` §4.4). Header and query-parameter
  versioning are prohibited. NestJS: `app.setGlobalPrefix('api')` +
  `enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })`.
- **Naming:** fixed path segments are `kebab-case`; JSON properties and query parameters
  are `camelCase`; **content identifiers are `snake_case` and immutable** — `{learner_id}`,
  `{lesson_id}`, `{pack_id}`, `{dialogue_id}` and the `les_*` / `pack_*` / `lst_*` ids they
  carry are data-integrity keys governed by `verify-integrity.py` checks [1], [2], [8], [11],
  **not** style choices. Renaming one is prohibited without amending
  `Curso-de-Ingles/specs/curriculum-graph-spec.md` §4.3.
- **Errors:** `Problem` (RFC 9457) is the §4.3-mandated shape and serves
  `application/problem+json`. **As of A4 (2026-10-14) that is also what the server sends:**
  `src/common/filters/problem-exception.filter.ts` is the only code that builds an error body,
  and `tests/integration/error-response.spec.ts` asserts the served bytes over real HTTP rather
  than over this document. The members behave per the RFC and are worth stating once, because
  three of them are easy to misread: `type` is `about:blank`, so `title` is the **HTTP status
  phrase** (`"Not Found"`) and not a machine code — a client doing control flow switches on
  `status` (§4.2.1, §3.1.2); `instance` is the request path **without** the query string, because
  a query can carry a token (§4.5 data minimisation); and `detail` is a **string** that is
  **omitted** when it would only repeat the title and **always omitted** on 5xx (§4.3 forbids
  serialising internals — those go to the log with the correlation id). `request_id` is one id
  per *request*, and it is the same value the `X-Correlation-ID` response header carries on every
  response, errors included (§4.6). That header is **not declared in this document or in
  `docs/api-spec.openapi.yaml`**: declaring it is a contract addition, and the header's spelling
  is itself decided nowhere in this repository (ADR-006 prescribes Kong's `correlation-id` plugin
  without a `header_name`, and `iac/kong/kong.yml` does not load the plugin) — an open decision,
  listed with the canonical `type` domain in `reports/api/fase-4.md` §8. `ErrorResponse` is
  `deprecated: true` and referenced by **no** endpoint (measured: the canonical document's only
  occurrences are its own definition and the comments describing it; all **14** 4xx/5xx responses
  reference `Problem`). It is kept only because deleting a published schema is itself a §4.4
  breaking change, and its `Sunset` date — owed since P1.17 landed — is not yet set.
- **`/auth/refresh` is out of MVP scope** and must not be implemented — the platform is a
  Resource Server (`ADR-013`, `CONSTITUTION.md` §4.5). It must be deleted from the NestJS
  routes, not merely annotated: the mock in `auth.service.ts` **emits** `{access_token}`, which
  is the violation itself. The deletion and its §4.4 deprecation path are ADR-038 / ADR-043.

- **All schemas** are derived from specs in `Curso-de-Ingles/specs/`:
  - `item_id` prefix ↔ skill namespace → `assessment-item-spec.md` §1.2
  - `Status` vocabulary (shipped/withdrawn/shadow-only) → `listening-corpus-spec.md` §4
  - `reuse_basis` enum → `external-sources.md` §7.0
  - Mastery gate ≥ 0.85 → `curriculum-graph-spec.md` §1.1
  - Q-L2 ≥ 45s → `listening-corpus-spec.md` §3
  - Two pack schemas (canonical/legacy) → `post-lesson-practice-spec.md` §8
  - FSRS/BKT/IRT params → `stats-progress-evaluation-spec.md` §2–4

- **Contract tests** in `its-platform/tests/contract/` validate every schema against the source specs.
- **BDD scenarios** in `its-platform/tests/bdd/` map to PRD.md §9 milestones.
