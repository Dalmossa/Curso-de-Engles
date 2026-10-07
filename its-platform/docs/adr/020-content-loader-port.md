---
adr: 020
title: P0.5 content loader — parsers over the real markdown formats, upsert idempotency, and a PGlite/Postgres gate
status: Accepted
date: 2026-10-06
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@backend-lead, @content-owner, @qa-sdet]
informed: [@team]
tags: [content-loader, parser, typeorm, pglite, seed, packs, listening-corpus, lessons]
---

## Context

P0.4 delivered the schema (33 tables, RLS, triggers) but **nothing populates it**. P0.5 must
port the content pipeline (lessons, practice packs, listening corpus) from Python to
TypeScript, reading the real markdown artefacts and persisting them through the TypeORM
DataSource — acceptance: passes `verify-integrity.py` check [4] (`check_json`) and respects
both pack schemas of ADR-004.

The audit of the legacy Python loader (`src/its_platform/content/loader.py`) is decisive:
**its parse rules do not match the content they were written for.** It expects YAML
frontmatter (`---`) that no lesson/pack file has, and a corpus shaped as
`## Dialogue: {id}` / `### SLOT {id}` while the real corpus uses `## dlg_a1_01_first_intro`
headers with `**Field:** value` prose. `load_listening_corpus()` returns **zero dialogues**
on the real corpus. The port must therefore parse the formats that actually exist on disk —
keeping from the Python side only the metadata API shape and the sha256 content-hash idea,
and adding the file-identity invariant that check [2]/[8] enforce (`**Lesson ID:**` inside
the file, never the filename: `lessons/a2/lesson-15min-workplace-greetings.md` declares
`les_a2_greetings_intro`).

Real content inventory (verified 2026-10-06):

| Artefact | Files | Notes |
|---|---|---|
| `lessons/{a1,a2,b1,b2,remediation}/*.md` | 122 | CEFR dirs; learner-model JSON block at `## 📊 DADOS PARA O LEARNER MODEL`; `**Lesson ID:**` is the id |
| `packs/**/pack_les_*_v1.md` | 115 | legacy_v1 schema (prose headers, dotted item ids) |
| `packs/a2/pack-les-*.md` | 7 | canonical schema (YAML manifest `^pack_id:`) |
| `corpus/listening-corpus.md` | 1 | 13 dialogues, 82 slots (74 admissible; status is a **field**, not prose — check [5]) |

## Decision

### 1. Pure parsers, separated from I/O and persistence

`src/infrastructure/content/` gains pure, DB-free parsers that map **string → typed record**:

- `content-types.ts` — shared interfaces (`LessonRecord`, `PackRecord`, `PackItemRecord`,
  `DialogueRecord`, `SlotRecord`, …).
- `lesson-parser.ts` — `parseLesson(markdown): LessonRecord`: header fields via
  `**Field:**` regex, learner-model JSON via strict `JSON.parse` (fail fast, file name in
  error — the check [4] guarantee), id from `**Lesson ID:**`, never the filename.
- `pack-parser.ts` — `parsePack(markdown, filename): PackRecord`: **schema detection exactly
  per ADR-004** (`^pack_id:` ⇒ canonical; `**Pack ID:**` ⇒ legacy_v1; neither ⇒ throw).
  Parses items and options from both schemas (canonical YAML item blocks, legacy prose
  `**item_id:**` + `| Slot | Value |` tables + `**Key:**` + `**br_pt_form:**`).
  Distinctness and one-key rules (I-3) and `item_id` global uniqueness ([11c]) are validated
  at parse time.
- `listening-parser.ts` — `parseListeningCorpus(markdown): CorpusRecord`: real headers
  `## dlg_<cefr>_<NN>_<slug>`, `### L1-N — \`lst_*\`` slots, `**Status:**` as a **field**
  (check [5]), transcripts into clips, voices/speakers mapping.

Parsers never import TypeORM. They are unit-testable with the real artefacts as fixtures
(including the filename-≠-id lesson).

### 2. Loader = parsers + DataSource upsert

`content-loader.ts` (infrastructure, depends on DataSource) walks the content root
(`CONTENT_REPO_PATH`, default = repository root, **not** the stale `../content` default in
`src/config/configuration.ts`), parses, then persists **idempotently**:

- `lessons`, `packs`, `items`: `INSERT … ON CONFLICT (id) DO UPDATE` — re-running the loader
  converges instead of duplicating. There is no `content_hash` column in the P0.4 schema
  (PY legacy tables are superseded), so idempotency is keyed on the business PK.
- `item_options` (BIGSERIAL, no business PK): delete + re-insert per item inside the same
  transaction.
- `voices`, `speakers`, `dialogues`, `dialogue_speakers`, `clips`: upsert by PK (natural
  keys from the corpus), clips transact per dialogue.
- Content graph seeds: `cefr_levels`, `domains`, `skills`, `modules` are static lookup rows;
  the loader upserts the exact set the content references (no guessing).
- `lesson_prerequisites` / `skill_prerequisite`: derived from the learner-model JSON
  (`prereq_lessons`, `skill_items`), replaced per lesson (delete + insert).

The loader leaves `authoring_state='authored'` for files that exist (check [2]
filesystem↔registry stance), `publication_state`/`permission_state` derived from
`reuse_basis` provenance rules, and never invents numbers the content does not declare.

### 3. Gate: `scripts/content-check.mjs`

Plain-ESM gate in the `scripts/` family, same shape as `migration-check.mjs`:

- `node scripts/content-check.mjs` — seeds PGlite in-memory with the P0.4 migration, runs
  the loader against a **copy of the real content** resolved from `CONTENT_REPO_PATH`, then
  asserts: 122 lessons (with `les_a2_greetings_intro` from the mismatched filename),
  122 packs (7 canonical + 115 legacy_v1), dialogue/slot counts from the corpus inventory,
  `item_id` global uniqueness, every scorable item declares a `Key`, no option equals its
  key ([11d]/[11e] stance), and every file parsed without a strict-JSON failure.
- `DATABASE_URL=… node scripts/content-check.mjs` — same assertions against real PostgreSQL
  (16), proving the loader/persistence path that P1.12 serves.

### 4. CI job `content-loader`

New GitHub Actions job (Node, PGlite path only — RLS is already proven by
`rls-integration`): `npm ci` → `npm run build` → `node scripts/content-check.mjs`
(no DATABASE_URL), with `CONTENT_REPO_PATH` set to the checkout root. Wired into the
`summary` aggregate like every other gate.

### 5. Loader policy for content that violates DB invariants

The raw content contains known violations the P0.4 triggers reject — check [11e] found
**28 items whose distractor is byte-identical to their key** (I-3 distinctness), plus
admissibility rules that make some listening slots withdrawn/shadow-only (check [5]).
The loader therefore reports **skips** instead of failing the whole seed, and the gate
asserts the **expected skip baseline** so a regression is still fail-closed:

- Skips can never be silent: `loadContent` returns a `LoadReport` with `skips[]`
  (item_id / dialogue_id + reason) and the gate asserts
  `skips.length === EXPECTED_SKIP_COUNT` (constant documented in the gate, re-derived from
  the content when the content is cleaned — the gate then forces the constant to change).
- Item/option rows that would violate I-3, [11d] (scorable item without Key), or [11e]
  are not inserted; everything else is.
- Listening slots with `**Status:**` other than `shipped` are stored as dialogue metadata
  only (never as items) — status is read as a **field** (check [5] stance).

## Consequences

### Positive

- Parser fidelity is verified by construction: the gate consumes the same real artefacts
  the app will serve in P1.12, and it runs in CI.
- Python loader stays untouched until P0.9; the TS port is a separate, testable surface.
- Idempotent upserts make `content:load` re-runnable in dev/CI without destructive drops.
- Fail-fast strict parsing reproduces check [4]'s guarantee at seed time (invalid JSON in a
  lesson fails the load with the file name, not a silent partial seed).

### Negative

- Parser surface is large (122 lessons + 122 packs + corpus) and lived with the content
  format churn; the shredding rules are regex-over-markdown, which the content's own
  `verify-integrity.py` checks continue to police — the TS gate is a second reader, not a
  replacement, until P0.9.
- The loader writes `lessons`, `packs`, `items` … but not the analytics tables
  (`fsrs_parameters`, learner state, …); those stay P1.

### Neutral

- `db:seed` npm script changes from an echo placeholder to `content-load` invoking the
  loader against the configured DataSource.
- `CONTENT_REPO_PATH` default moves to the repository root; `src/config/configuration.ts`
  keeps the env override (fixing the stale `../content` pointer is P0.5 scope).

## Alternatives Considered

1. **Port the Python `ContentLoader` API as-is** — rejected: its parse rules return zero
   dialogues on the real corpus; porting it faithfully would port the defect.
2. **Store content as one JSONB blob per file** — rejected: loses the relational query
   surface (items by skill, packs by lesson, dialogue slots) that P1.12 needs.
3. **Reuse `verify-integrity.py` as the only validation** — rejected: the Python checks are
   content-side; P0.5 needs a load-side gate that proves the DB was populated correctly on
   both PGlite and PostgreSQL.
4. **Add a `content_hash` column for Python-style upsert** — rejected: P0.4 schema has no
   such column; PK-keyed upsert converges without schema churn.

## Implementation Plan

- [ ] `src/infrastructure/content/content-types.ts` — typed records for lessons, packs, corpus
- [ ] `src/infrastructure/content/lesson-parser.ts` — header regex + strict JSON block
- [ ] `src/infrastructure/content/pack-parser.ts` — ADR-004 schema detection + both item shapes
- [ ] `src/infrastructure/content/listening-parser.ts` — real corpus headers, slots-as-fields
- [ ] `src/infrastructure/content/content-loader.ts` — DataSource upsert + content-graph seeds
- [ ] `scripts/content-check.mjs` — PGlite + DATABASE_URL modes, fidelity asserts
- [ ] Jest unit tests per parser (real artefacts as fixtures)
- [ ] CI job `content-loader` + summary wiring; `db:seed`/`db:migrate` scripts fixed
- [ ] Verified locally (PGlite + Postgres 16) and committed