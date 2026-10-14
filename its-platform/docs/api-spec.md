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

`docs/api/openapi.yaml` is the **deprecated predecessor** (9 of its 14 schemas, `servers` without
the §4.4 `/api/v1` prefix, no `Problem`). The five consumers that still read it are enumerated in
ADR-040; removing it is ADR-040 D3.

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
  `application/problem+json`. `ErrorResponse` is deprecated but still referenced by the 9
  published endpoints; converting those is a breaking change tracked in `BACKLOG.md` P1.
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
