---
adr: 027
title: Content API — the persisted catalog as the only read path, and the three response schemas amended to what the content actually declares
status: Accepted
date: 2026-10-11
authors: [@system-design-architect]
deciders: [@system-design-architect, @backend-lead, @content-owner]
consulted: [@qa-sdet, @database-engineer]
informed: [@team]
tags: [content-api, p1.12, lesson-phases, adr-004, adr-020, adr-022, openapi, breaking-change, contract-amendment]
---

## Context

`BACKLOG.md` **P1.12** (*"Content API — lessons, packs, dialogues"*, M5.1 + API layer, `Must`,
3d, depends `P0.5`) carries three acceptance criteria:

> Only `Status=shipped`; Q-L2 ≥ 45 s validated; both pack schemas served

and two references: **ADR-004** (the two pack schemas) and `specs/listening-corpus-spec.md` **§4**
(the six slot types and the 45 s floor). The three endpoints already exist as **stubs**:
`src/modules/content/content.controller.ts` + `content.service.ts` return hardcoded objects —
`getLesson('anything')` returns `title: 'Sample Lesson'`. So P1.12 is not "add three routes";
it is "make the three routes answer from the catalog the loader persisted".

Writing that turned up six facts. Each was measured on this repository on 2026-10-11, and the
last three are blockers.

### 1. `P0.5`/`P0.10`'s persisted data answers two of the three endpoints, and not the third

The loader (ADR-020, reconciled to the ADR-019 DDL by ADR-022) writes: `cefr_levels`,
`domains`, `modules`, `lessons`, `lesson_prerequisites`, `skill_prerequisite`, `packs`,
`items`, `item_options`, `dialogues`, `speakers`, `voices`, `dialogue_speakers`, `clips`.

`PackContent` and `DialogueContent` are functions of those rows. `LessonContent` is not: its
`required` is `[lesson_id, fase1, fase2, fase3, fase4, learner_model]`, and **no table, no
column and no parser produces any of the five**. `content-types.ts`'s own header states the
loader's contract — *"Every field below names a real column of a real table"* — and there is
no `fase1`.

### 2. `LessonContent`'s shape is derived from nothing

| Artefact | Says |
|---|---|
| `docs/api-spec.openapi.yaml` header | *"Generated from: `Curso-de-Ingles/ITS-ARCHITECTURE.md` §6"* · *"Source of truth for contracts: `Curso-de-Ingles/specs/*.md`"* |
| `ITS-ARCHITECTURE.md` §6 | Titled **"(Sketch)"**. Its `/content/lessons/{lesson_id}` entry is **6 lines**: a summary and a `$ref`. No schema body |
| `grep -rn 'fase' specs/ PRD.md` | **One** hit, and not a schema: `diagnostic-spec.md:48` cites `les_a2_it_terms_basics` FASE 1.3 as a listening task |
| `docs/domain-model.md` §2.1 | One line: *`ACL: ContentLoader — FASE 1–4 blocks → internal model`* — the responsibility is stated, the model is not |
| `BACKLOG.md` P0.5 / ADR-020 §1 | The loader's assignment: header fields, learner-model JSON, packs, corpus. FASE blocks are not mentioned |

So the `fase1`–`fase4` property shapes were invented in the OpenAPI file, from a sketch that
had none.

### 3. The lessons *do* carry four phases — measured over all 122 files

| Fact | Measurement (2026-10-11) |
|---|---|
| Lesson files | **122** |
| With `FASE 1,2,3,4` as level-`##` headings, in order, **outside** code fences | **122 / 122** |
| Header generation A — `## FASE n — <Title> [N min]` | **115** |
| Header generation B — `## <emoji> FASE n: <TITLE> — N min` | **7** (`lessons/a2/les_a2_it_*` and siblings) |
| With `## 📊 DADOS PARA O LEARNER MODEL` followed by a ```` ```json ```` fence that `JSON.parse` accepts | **121 / 122** (`bad: 0`) |
| The one without | `lessons/a2/les_a2_it_internet_history.md` |

The extraction is total: one tolerant regex (emoji-optional, `—`/`:` separator-agnostic),
fence-aware, yields exactly `[1,2,3,4]` for 122 of 122 files.

### 4. The contract's inner shapes do not describe the content, and `fase4` is unsatisfiable

FASE 2 and FASE 4 bodies are the *pack* item format — `### Item N — <skill> (<format>)`, a
`Slot | Value` table, `**Key:**`, `**br_pt_form:**` — with **no `item_id`**:

| Key | Contract asks | The lesson contains |
|---|---|---|
| `fase1` | `{content: string, media: [{type,url}]}` | FASE 1 markdown — **compatible** |
| `fase2` | `{exercises: [{type ∈ recognition\|production\|minimal_pair, prompt, expected_response, recast_enabled}]}` | FASE 2 markdown; `type` inventable, `expected_response` = the `**Key:**` |
| `fase3` | `{task: string, success_criteria: string[], meta_button?: bool}` | FASE 3 markdown; a heading and a **numbered task list** |
| `fase4` | `{items: [{item_id, skill}]}` | FASE 4 markdown; **the items carry no id** |

`fase4.items[].item_id` has **no source**. It is not in the lesson; the loader writes no rows
for lesson bodies; and the pack is not a declared join. Verified: `les_a1_alphabet_sounds`
FASE 4 has **2** items while `pack_les_a1_alphabet_sounds_v1` has **7**, and the pack's
ITEM 1 (`vocab.alphabet.consonants`) appears in **no** phase of that lesson.

A loader that guessed the mapping would assert a join the content never declares — the class
of defect `CONSTITUTION.md` §9 step 3 exists for, and that the CHANGELOG's `bkt_transition`
removal states plainly: *"defined in **no** spec … Nothing replaces it, deliberately."*

### 5. `PackContent` contradicts **ADR-004**, which is already Accepted

ADR-004 §"Unified Item Model" — the decision P1.12 cites as its own reference — already states
the shape:

```python
options: List[Option]  # Empty for production/minimal-pair items
key: Optional[str]     # None for production items
```

The OpenAPI files publish `required: [item_id, skill, domain, prompt, options, key]` with
`options.minItems: 3` and `key.pattern: ^[A-D]$`. Measured over the 122 packs / 847 items:

| Fact | Measurement |
|---|---|
| Items with **zero** options | **6** — all `scoring = 'asr_phoneme_match'` |
| Items with **`key` null** | **6** — the same six; the other 841 carry exactly one key (A–D only) |
| Items with exactly one `is_key` option | **841 / 847** |
| `item_options` rows / of which key options | **3660** / **915** — 841 in the packs and 74 in the dialogue slots (one per shipped slot), and every item that has a choice carries exactly **four** options |
| Key options whose `br_pt_form` is null | **117 of 915** (the other 798 carry a form) |
| Key options whose `note` is null | **915 of 915** — and non-key options with a null `note`: **0** |
| `skill_ids` namespaces in use | `vocab`, `grammar`, `reading`, `pronunciation` — all inside the published enum |

Two of those rows are defects in their own right, and neither is visible without reading the
served payload. `minItems: 3` does not mean "at most three are missing": it **rejects `options:
[]`**, so the six legitimate items above are rejected precisely because they are legitimate.
And a key option is served with `note: null`, so the published `note: {type: string}` rejects the
response for **every pack and every dialogue in the catalogue** — the constraint was satisfiable
by nothing the loader can write. The `br_pt_form` half is narrower but real: 117 responses.

So the published `PackContent` is not a sketch that lacked a source; it is a **drift from an
Accepted ADR**. The six items are the production/minimal-pair items `post-lesson` §2.4 and
`assessment-item-spec` describe, and `verify-integrity.py` **[11d]** already encodes the same
rule for the packs it reads — *"every item **with a distractor table** declares a `**Key:**`"*.

### 6. `DialogueContent` has one field with no storage, and its published enums disagree with the DDL and with each other

Measured over the corpus (1 file, 13 dialogues, 74 shipped slots, 296 option rows) and the two
OpenAPI files:

| Fact | Measurement |
|---|---|
| Slots whose option table marks the key with `✓` **in the Value column** | **76 rows** |
| Slots that mark the key with `✓ —` in the **last** column instead | **11** — so **11 / 74** slots load with `items.key = NULL` |
| `listening-parser.ts`'s rule | `isKey = rawValue.includes('✓')` — the **value** column only |
| Slots with more than one key, after the fix | **0** |
| Dialogue transcript | Held only as `clips.utterance_text`, which is **the turn text without the speaker**; the parser reads the verbatim block and discards it |
| `distractors[].type` | Required, enum `[semantic_plausible, overgeneralization, phonological, lexical]`. Real vocabulary is `assessment-item-spec.md` §"Distractor taxonomy" — `l1_transfer` (in use, absent from the enum), `overgeneralization`, `semantic_plausible`, `form_alternative`, `register_mismatch`, `negative_control`. **126 of 233 non-key options have no type at all** |
| `status` enum | `openapi.yaml`: `[shipped, withdrawn, shadow_only]` · `api-spec.openapi.yaml`: `[shipped, withdrawn, shadow-only]` · the DDL: `CHECK (status IN ('shipped','shadow_only'))` |
| `slots[].skill` enum | `openapi.yaml` has 6 values including `pragmatic` (7 slots use it); `api-spec.openapi.yaml` has 5 and its schema is **violated 7 times** by the shipped corpus |
| `slots[].key` | required `^[A-D]$`; measured **11 / 74 null** (§ above), **0** options outside A–D |
| `cefr_level` pattern | `'^A[12]|B[12]|C[12]$'` in both files — an ungrouped alternation, so it anchors only its first and last branch and admits `"B1 garbage"`. `CEFR_SEED` is exactly `A1…C2` |

The eleven keyless slots are a **reader defect, not a content gap**: the corpus marks those keys
with `✓ —` in the trailing column, and every one of the eleven is a shipped B1 (or A2) item
whose correct option is unambiguous from its own feedback. They load unscorable today, and
nothing in the repository notices — `verify-integrity.py` **[9]/[11d]/[11e]** glob `packs/`
(and, per its own report, only `pack-les-*.md`), so `corpus/listening-corpus.md` is outside every
check that would have caught it.

## Decision

### 1. One read path: the persisted catalog

`ContentService` reads the database the loader wrote. It does **not** read `lessons/`,
`packs/` or `corpus/` at request time.

- ADR-020 §3 defines the loader's persistence as the thing `P1.12 serves`
  (*"proving the loader/persistence path that P1.12 serves"*).
- The image carries no content to read: `Dockerfile` still describes the pre-ADR-012
  FastAPI image (`pyproject.toml`, `poetry`, `python -m its_platform.main`, `EXPOSE 8000`)
  and copies `src/` only. Neither `pyproject.toml` nor `poetry.lock` exists.
- A request-time file read moves content validity from the gate (`content-check.mjs`,
  which parses the real repo) to the request.

### 2. `/content/packs/{pack_id}` → `PackContent`, from `packs` + `items` + `item_options`

- `schema_version` is the row's — both schemas served (ADR-004).
- `items[].item_id` is `items.id`, never the positional `### ITEM n` fallback (ADR-022 §2).
- `options[]` ordered by `item_options.position`; `letter` is that position's letter
  (`A`→1 … `F`→6); `is_key` marks the key.
- `items[].skill` is the namespace of `items.skill_ids[0]` (`"vocab.hedge_calibration"` →
  `vocab`), which measured lands inside the published six-value enum for every row.
- Unknown id ⇒ `404`.

`PackContent` is **amended back to ADR-004** (§Context 5). Three edits, each with a column
behind it:

| Field | Was | Becomes | Why |
|---|---|---|---|
| `items[].options` | `minItems: 3` | no `minItems` | ADR-004: *"Empty for production/minimal-pair items"*. 6 measured |
| `items[].key` | required, `^[A-D]$` | `type: [string, 'null']`, `^[A-D]$`, **required *and* typed `string` when `scoring == 'choice'`** | ADR-004: *"None for production items"*. 6 measured, all `asr_phoneme_match`. The type conjunct is load-bearing: `required` alone is satisfied by an explicit `key: null`, which is precisely what those 6 rows serialise to — caught by validating the amended schema, not by reading it |
| `items[].scoring`, `items[].item_type` | absent | **added**, enums of the DDL's own CHECK values | An item with `options: []` and `key: null` is uninterpretable without knowing it is phoneme-matched rather than malformed. Both are `NOT NULL` columns the loader already writes |
| `items[].options[].br_pt_form`, `[].note` | `type: string` | `type: [string, 'null']`; `note` still required **and typed `string`** when `is_key` is false | Measured on the loaded catalogue: **all 915** key options are served with `note: null` — both parsers write `note: isKey ? null : …` — so the published `note: {type: string}` rejected the response for **every pack and every dialogue there is**. `br_pt_form` is `null` on **117** of the 915 (the other 798 carry a form), so that half rejected 117 responses. The `if is_key: false` branch needed the same type conjunct as `key`: `required: [note]` alone is satisfied by a present `note: null`, and the non-key half is satisfiable — 0 of the 2579 distractor options has a null `note` |

**That the published `PackOption.note` was unsatisfiable is the same defect as the rest of this
ADR, found the same way.** It was not visible in `content-check.mjs` (which reads the DDL, where
`CHECK (is_key OR note IS NOT NULL)` *is* satisfied) nor in `verify-integrity.py` (which reads the
content), because the contract was the only artefact asserting the unsatisfiable thing — and
nothing validated a served payload against it. `tests/contract/schemas.spec.ts` did not: it
asserted `expect(instance.fase4).toBeDefined()`.

`items[].listening_items` stays in the schema and is served as **`[]`**, which is ADR-004's
declared default (`List[ListeningSlot] = []`) and what `post-lesson` §2.2 requires be *explicit*
rather than silent. It is empty for every item today, and that is a measured fact rather than an
omission: `post-lesson` §2.2's `listening_items: 0` is recorded in the 7 packs that declare it,
every one of the 847 loaded pack items is `modality = 'text'`, and the 74 listening slots carry
`dialogue_id` with `lesson_id IS NULL` — no pack item owns a listening slot, and `items.clip_ids`
(the column that would carry one) is never populated.

### 3. `/content/listening/{dialogue_id}` → `DialogueContent`, from `dialogues` + `speakers` + `voices` + `items`

- **Only `status='shipped'` is served.** Any other value ⇒ the *same* `404` body as an
  unknown id, so a caller cannot distinguish "does not exist" from "exists, not shipped".
- **`duration_seconds ≥ 45`** (Q-L2). The DDL enforces
  `CHECK (duration_seconds BETWEEN 45 AND 120)`; the service re-asserts the floor rather than
  serving a row that violates it.
- `slots[]` from the listening `items` rows ordered by `slot_number`; `voices[]` from
  `dialogue_speakers` → `speakers` + `voices`.
- `slots[].skill` is `items.listening_kind` with its `lst_` prefix removed, and
  `lst_pron_minpair` → `pronunciation` — `listening-corpus-spec.md` §4's own type→skill table,
  whose six rows are all in use (gist 13, detail 14, inference 11, lexical 10, pragmatic 7,
  pronunciation 19).

Three defects are repaired rather than worked around, and one field is given a source:

**(a) The reader learns the second generation of the key marker.** `parseSlotTable` reads the
key from the value column only; 11 shipped slots put `✓ —` in the trailing column instead. The
rule becomes "the `✓` may appear in either the value column or the note column", the note
normalises to `null` for the key row, and `DialogueContent.slots[].key` therefore keeps its
published `required` + `^[A-D]$`. `content-check.mjs` asserts **every shipped slot has exactly
one key** — the assertion `verify-integrity.py` cannot make, because it does not read `corpus/`.

**(b) `dialogues` gains `transcript`.** `DialogueContent.slots[].transcript` is required and had
no column: the loader parsed the corpus's verbatim transcript, used it for one duration count
and split it into `clips`, which keep only `utterance_text` + `speaker_id` — the speaker's own
name is lost. The transcript is the **authored** artefact and the clips are derived from it, so
the transcript is stored:

```sql
transcript TEXT NOT NULL   -- the `> **Speaker:** …` block, verbatim
```

Serving it per slot is the published shape and is what the sketch's required list asks for; the
value is the dialogue's transcript, identical across a dialogue's slots. A *per-slot* slice
would need a slot↔clip link, and none exists — `items.clip_ids` is never populated. That is
recorded here as the reason, not silently served as a plausible-looking empty string.

**(c) `distractors[].type` becomes nullable and adopts the spec's vocabulary.**
`assessment-item-spec.md`'s taxonomy is six values, and the DDL's `item_options.distractor_type`
CHECK is already those six. The published enum (`semantic_plausible, overgeneralization,
phonological, lexical`) is neither: `l1_transfer` — the spec's *"highest-value distractor in the
whole bank"* — is used and absent, and `phonological`/`lexical` appear nowhere. It is also not
required in practice: 126 of 233 non-key options carry prose in that column
(`nonresponse`, `[tɹiː] — no [θ]`), so the type is `[string, 'null']` with the six-value enum.

And two enums are reconciled with the DDL, which is the derived artefact:

- `status`: `[shipped, shadow_only]` in **both** files. `withdrawn` describes a *slot* — the
  loader skips those (`slot_status_not_shipped`) — and the DDL forbids it on a dialogue;
  `shadow-only` is the corpus's prose spelling, `shadow_only` is what the column stores.
- `slots[].skill`: the six values. `api-spec.openapi.yaml` is missing `pragmatic`, which the
  shipped corpus uses 7 times.

The one contract-wide repair: `cefr_level`'s `'^A[12]|B[12]|C[12]$'` becomes
`'^(A1|A2|B1|B2|C1|C2)$'` wherever it appears in the two files. The published pattern is an
ungrouped alternation — it anchors only `A1…` and `…C2$` and matches `"B1 garbage"` anywhere —
so the fix *tightens* a pattern that claimed a constraint it did not apply.

### 4. `LessonContent` is amended to what a lesson is: four authored phases

The endpoint keeps its path and returns the lesson's own four sections, verbatim:

```json
{
  "lesson_id": "les_a1_alphabet_sounds",
  "title": "Alphabet, Sounds, Letter Names",
  "cefr_level": "A1",
  "reuse_basis": "cite_only",
  "authoring_state": "authored",
  "publication_state": "publishable",
  "phases": [
    { "phase": 1, "heading": "FASE 1 — Input (i+1) [4 min]",   "markdown": "…" },
    { "phase": 2, "heading": "FASE 2 — Guided Practice [5 min]", "markdown": "…" },
    { "phase": 3, "heading": "FASE 3 — Output Task [4 min]",     "markdown": "…" },
    { "phase": 4, "heading": "FASE 4 — Shadow CAT [2 min]",      "markdown": "…" }
  ],
  "learner_model": { }
}
```

- `required: [lesson_id, title, cefr_level, reuse_basis, authoring_state, publication_state, phases, learner_model]`
- `phases`: `type: array`, `minItems 4`, `maxItems 4`; each item
  `required: [phase, heading, markdown]`, `phase` an integer `1..4`, `heading` the section's
  own title with its leading `##` stripped and its markup preserved (both generations).
- `learner_model`: the parsed `## 📊 DADOS PARA O LEARNER MODEL` block, or **`null`** for the
  one lesson whose file has none. It is `type: [object, "null"]` — the amendment states which
  file, rather than inventing a block.
- `publication_state`/`reuse_basis` are served because **P1.18** (pre-publish licence check,
  *"blocks `adapt_*` against restricted sources"*) consumes them; they are the lesson's
  declared values, not a new derivation.

**Why amend and not parse.** The realist parser would have to invent `expected_response`
semantics, an exercise taxonomy the repository does not agree on, and the one thing the
content cannot give: `fase4.items[].item_id`. The lesson's *structured* counterpart already
has an endpoint — the pack — and it is the pack that the practice engine reads.

### 5. The lesson body is materialised by the loader, in `lessons.body`

```sql
body JSONB NOT NULL DEFAULT '{"phases":[],"learner_model":null}'
-- {"phases":[{"phase":1,"heading":"FASE 1 — Input (i+1) [4 min]","markdown":"…"}, …],
--  "learner_model": { … } | null }
```

- `lesson-parser` gains `extractPhases` / `extractLearnerModel`; the phase rule is the
  measured one (§Context 3): fence-aware, emoji-optional, generation-agnostic, and it
  **throws** on a file that does not yield exactly `[1,2,3,4]` — the same fail-fast stance
  `JSON.parse` on the learner-model block already has (ADR-022 §2).
- The loader is the only writer; the API never parses a file.
- `content-check.mjs` asserts **122** lessons, **122** with four phases numbered 1–4, and
  **121** with a non-null `learner_model`. A constant, like `EXPECTED_SKIP_COUNT`, that the
  next content edit forces to change rather than letting drift.

**Why a column and not a table.** ADR-018's fold criterion, as applied in
`data-model.erd.md` §3 to `packs.manifest`: write-once authored content is folded unless a
query needs to traverse it. The four blocks are read whole, always together, and never
filtered. A `lesson_phases` table would add a 34th table, a second parent/child delete path
and a row count for the gate to police, for no query.

**Why this is not the schema ADR-022 rejected.** ADR-022 §1 rejected a loader that *invented*
`lessons(source_markdown, prereq_lessons, skill_items)` while ADR-019's DDL was the contract.
Here the DDL is still the contract: the column is added to `data-model.erd.md` §3/§6.1
**first**, then to the migration, and it carries the content's own sections. The direction
ADR-018 requires is preserved; the drift ADR-022 found is not re-created.

### 6. This is a breaking change, and it is recorded as one

`docs/api/*.yaml` loses `LessonContent.fase1`–`fase4` (replaced by `phases`), and `PackContent`
and `DialogueContent` lose required-field guarantees they never held. Under
`CONSTITUTION.md` §4.4 (*"changing a field's type or semantics"*) that is a breaking change:
it is recorded in `CHANGELOG.md` with the migration path, and the three artefacts that restate
the schemas — both OpenAPI files, `tests/contract/schemas.spec.ts` and
`tests/bdd/README.md`'s *"Lesson renders with FASE 1-4 structure"* scenario — move in the
same change. The API is `0.1.0`, has never been released, and has no external traffic
(`CHANGELOG.md` §4.4's retirement gate cannot apply to a version that does not exist yet).

## Consequences

### Positive

- P1.12's three criteria become machine-checkable against the loader's own output:
  `dialogues.status = 'shipped'`, `duration_seconds ≥ 45`, and both
  `packs.schema_version` values present.
- `/content/lessons/{id}` stops returning a lesson that does not exist: today every id
  answers `title: 'Sample Lesson'`.
- The contract gains a source. A future change that the content cannot satisfy is now
  detectable by comparing the amendment to the 122 files, instead of being filed in the same
  document as the claim.
- Both header generations (115 + 7) are served by one reader, and the 7-file minority is no
  longer invisible.
- `PackContent` agrees with ADR-004 again. The drift was invisible because ADR-004 is prose and
  the OpenAPI is not, and nothing compared them.
- **11 unscorable listening items become scorable.** They were loaded with `key IS NULL` and
  `is_key = false` on every option, so no client — diagnostic, shadow CAT or FSRS — could have
  scored them, and no gate in either repository looked at `corpus/`.

### Negative

- **Breaking.** `fase1`…`fase4` disappear; a consumer written against the sketch must read
  `phases[]`. `key` on a pack item and on a dialogue slot, and `distractors[].type`, become
  nullable where they were required — a consumer must handle `null` for the 6 ASR-scored pack
  items and the 126 untyped distractors, rather than assuming the schema's old promise. There
  are no consumers today (the endpoints returned mocks), but the record is real and
  `CHANGELOG.md` carries it.
- `lessons.body` holds authored markdown: the table stops being small and gains a column the
  loader re-uploads on every content pin. It is read by exactly one endpoint. `dialogues.transcript`
  is the same trade at a smaller scale.
- `phases` is markdown, so an LLM or a drill generator cannot read FASE 2's answer keys from
  this response. That is not a loss against the contract (which named no options), and it is
  available where it is declared: the pack.
- `slots[].transcript` repeats the dialogue's transcript once per slot, because the published
  shape asks for it per slot and no slot↔clip link exists. The duplication is the contract's,
  not the data's.
- The `✓`-in-trailing-column convention is now understood by the reader, but `verify-integrity.py`
  still checks only `packs/`. **A corpus item may still be authored with no key marker at all and
  load silently unscorable.** `content-check.mjs` closes the case that exists (every shipped slot
  has exactly one key); extending `verify-integrity.py` **[11d]** to `corpus/` is the durable fix
  and is left to the content repository, which owns that gate.

### Neutral

- `docs/api/openapi.yaml` and `docs/api-spec.openapi.yaml` do **not** carry identical
  `DialogueContent` bodies: they disagree on `slots[].skill` (6 values vs 5) and on `status`
  (`shadow_only` vs `shadow-only`), and `api-spec`'s five-value `skill` enum is violated 7 times
  by the shipped corpus. Both are amended together to the values above;
  `contract-check.mjs` reads only the first, so the second is checked by
  `tests/contract/schemas.spec.ts`.
- **The drift is not limited to the three content schemas, and the two `item_id` patterns were
  complementary.** Measured after the amendment: `ErrorResponse`, `LearnerProfile`,
  `PlacementResult`, `PracticeSubmission` and `Problem` still differ between the two files
  (`Problem` exists only in `api-spec`), and paths are the only structure they agree on. Those are
  **not** P1.12's scope and are left as found — Alternative 12 records why. On the three schemas
  this ADR owns, the constraints are now byte-equal after description stripping, including the
  shared `PackOption` (added to `api-spec`, which had inlined it).
- **The `item_id` pattern was the sharpest instance of the drift.** `api/openapi.yaml` published
  `^(vocab|grammar|reading|pronunciation|listening|coherence)(\.[a-z0-9_-]+)+$` and `api-spec`
  published `^(grm|voc|rdg|prn|lst|coh)_[a-z0-9_.-]+$`. Against the 888 distinct ids the catalog
  actually holds, the first accepts **771** and the second **117**, **0 ids satisfy both**, and
  neither accepts the other's half. The catalog carries two generations —
  `vocab.meeting.standup_timebox` (771, the legacy packs) and `voc_www_vs_internet_001` /
  `lst_gist_011` (117, the canonical packs and the listening corpus) — and ADR-016 §2 resolves
  both through the alias table. **No pattern is published now**: a pattern this ADR cannot derive
  from a spec, that rejects most of the catalogue, is the defect class the ADR exists to remove.
  `tests/contract/schemas.spec.ts` validates both files against the same instances, which is the
  comparison nothing was making.
- **Two of the BDD scenarios this ADR amends named ids that do not exist.** *"Lesson renders with
  FASE 1-4 structure"* cites `les_a1_alphabet_sounds` (real) but the pack scenario cited
  `pack-les-a1-greetings` and the listening scenario `dlg_a1_01_greetings`. The catalogue holds
  `pack_les_a1_greetings_v1` and `dlg_a1_01_first_intro`; neither published name resolves. The
  scenarios now cite ids the loader has actually written — the same defect as the rest of this
  ADR (an artefact asserting something no source produces), found by checking rather than reading.
- **`item_options.distractor_type` is still not published on `PackContent`'s options** — only on
  `DialogueContent`'s `distractors[].type`. Considered and left out: the dialogue contract already
  declared a `type` (with a wrong vocabulary, so amending it is a correction), while `PackOption`
  never declared one, and adding a field is a different change from repairing one. The data is
  there for whoever needs it; the pack's consumer needs `is_key` and `scoring`, which are
  published.
- `migration-check.mjs`'s counts (33 tables, 4 enum types, 15 RLS tables, 45 policies, 4
  triggers, 27 indexes) are unaffected by a column on an existing table — `lessons.body` and
  `dialogues.transcript` are both columns.
- `.opencode/skills/openapi-spec/SKILL.md` carries a third copy of the schema; it is a helper
  document, not a contract, and is left to the tooling that owns it.
- `verify-integrity.py`'s **[11d]** already states the rule the corpus breaks ("every item with a
  distractor table declares a `**Key:**`"). This ADR does not change that check; it makes the
  loader read the marker form the corpus actually uses.

## Alternatives Considered

1. **Serve `LessonContent` from the lesson files at request time.** Rejected: ADR-020 §3
   makes the loader's persistence what P1.12 serves; the image copies no content; and a
   request-time parse moves the content-validity proof out of the gate.
2. **Keep the contract; fill `fase2.exercises` and `fase4.items` by parsing FASE 2/FASE 4.**
   Rejected: `fase4.items[].item_id` has no source, and the pack join is undeclared —
   measured, the pack's ITEM 1 appears in no phase of the same lesson.
3. **Keep the contract; return `[]` for `exercises`, `[]` for `items`.** Rejected: a `200`
   whose body asserts four phases it does not carry. `CONSTITUTION.md` §4.3's *"never `200`
   with an error payload"* states the principle for errors; the same reading applies to
   content.
4. **Return the lesson body as a single `markdown` string.** Rejected: the four phases are
   what the file declares and what the BDD scenario names; a client made to re-implement the
   heading rule has been handed the parser's job.
5. **A `lesson_phases` table.** Rejected — see §5; no query needs it, and ADR-018's own fold
   criterion is answered by `packs.manifest`.
6. **Defer the lesson resource; ship packs and dialogues only.** Rejected: the route exists
   and answers a mock, and `P1.18` consumes this resource's `publication_state`. A deferred
   route that lies is worse than the amendment.
7. **Declare the FASE blocks a `@content-owner` deliverable and block the endpoint.**
   Rejected: the content is not missing — the parser was. All 122 lessons carry the four
   phases; only the platform's reading of them was absent.
8. **Reset the 11 keyless dialogue slots to `shadow_only`, or drop them.** Rejected: the keys
   are in the corpus, marked `✓ —` in the trailing column. Withdrawing eleven valid, keyed
   items to avoid teaching the reader a second marker would delete content to protect a parser
   bug.
9. **Make `key` non-null by defaulting it to `A`.** Rejected: it would make every keyless item
   scorable *and wrong*, and the `Key:` field would stop meaning "the author declared this".
10. **Serve `dialogue.transcript` by re-joining `clips`.** Rejected: the transcript is the
    authored artefact and `clips` are derived from it; reconstructing the source from its own
    derivation loses the speaker names the clip splitter discards, and is exactly backwards.
11. **Drop `slots[].transcript` and `items[].listening_items` from the contract.** Rejected:
    `transcript` is a required field of the published schema with a real source once
    `dialogues.transcript` exists; `listening_items` is sourced by ADR-004 and `post-lesson`
    §2.2 and is *correctly* `[]`. Removing fields to avoid satisfying them is the opposite of
    the amendment this ADR makes.
12. **One OpenAPI file.** Rejected for this ADR — it is the right end state, but choosing which
    of the two is canonical and rewiring `contract-check.mjs` is its own change, and doing it
    inside P1.12 would leave the API half unverifiable. Recorded here as the drift is now
    known: the two files disagreed on two enums, on the `item_id` pattern, and on five
    non-content schemas, and nothing compared them.

## Implementation Plan

- [x] `docs/data-model.erd.md`: §3 citation row for `lessons.body`, §5 diagram, §6.1 DDL
- [x] `src/migrations/1791331200000-create-schema.ts`: `body JSONB` on `lessons`
- [x] `content-types.ts` `LessonRecord.body`; `lesson-parser.ts` `extractPhases` + `extractLearnerModel`
- [x] `content-loader.ts`: persist `body`
- [x] `scripts/content-check.mjs`: 122 / 122×4 phases / 121 learner models
- [x] `tests/unit/content/parsers.spec.ts`: both header generations, the throw, `learner_model`
- [x] `docs/data-model.erd.md` + migration + loader + types: `dialogues.transcript TEXT NOT NULL`
- [x] `listening-parser.ts`: the key marker's second generation (`✓` in either column)
- [x] `content-check.mjs`: every shipped slot has exactly one key
- [x] `docs/api/openapi.yaml` **and** `docs/api-spec.openapi.yaml`: the three schemas (ADR-027
      §2–§5), the `cefr_level` pattern, the `status`/`skill`/`distractor_type` reconciliation,
      the `item_id` patterns withdrawn (Neutral, measured 771/117/0-both), and `PackOption`'s
      `br_pt_form`/`note` made `null`-able (915 key options served `note: null`, 117 a null
      `br_pt_form`; the counts measured on the loaded catalogue, not estimated);
      constraints verified byte-equal between the two files with descriptions stripped
- [x] `tests/bdd/README.md`: the three content scenarios rewritten to the amended contract, and
      the two ids they cited that do not exist replaced with ids the loader writes
- [x] `CHANGELOG.md`: the breaking change, with its migration path
- [ ] `src/modules/content/`: real `ContentService`, Controller 404s, `ContentModule` wiring
- [ ] `tests/`: parser unit, service integration against the real migration, contract shape
- [ ] `CHANGELOG`/`BACKLOG`/`MEMORY` updated; all gates green; committed

## References

- `BACKLOG.md` P1.12, P1.18; `PRD.md` §8 RF-009
- `docs/api/openapi.yaml`, `docs/api-spec.openapi.yaml` — `/content/*` and the three schemas
- `Curso-de-Ingles/ITS-ARCHITECTURE.md` §6 — *"(Sketch)"*, the amendment procedure §11
- `Curso-de-Ingles/corpus/listening-corpus.md` — 13 dialogues, 74 shipped slots, 344 option rows
- **ADR-004** (two pack schemas) — P1.12's reference, and the source `PackContent` drifted from
- **ADR-018** §1 (fold criterion, invariant floor) · **ADR-019** (the DDL) ·
  **ADR-020** §3 (what P1.12 serves) · **ADR-022** §1–§2 (loader ↔ schema reconciliation)
- `specs/listening-corpus-spec.md` §4 — the six slot types and the 45 s floor (§5 — `status`)
- `specs/assessment-item-spec.md` §"Distractor taxonomy" — the six `distractor_type` values
- `specs/post-lesson-practice-spec.md` §2.2, §2.4 — `listening_items: 0`, production items
- `src/migrations/1791331200000-create-schema.ts` — the only DDL artefact
