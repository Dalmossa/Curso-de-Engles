---
adr: 022
title: Content loader ↔ P0.4 schema reconciliation — the persistence contract, derived-field rules, and the skip baseline
status: Accepted
date: 2026-10-10
authors: [@system-design-architect]
deciders: [@system-design-architect, @backend-lead, @content-owner]
consulted: [@qa-sdet, @database-engineer]
informed: [@team]
tags: [content-loader, parser, typeorm, pglite, schema-reconciliation, adr-004, adr-019, adr-020, skips, listening-corpus]
---

## Context

`BACKLOG.md` **P0.5** was recorded `DONE (2026-10-07)` against a gate
(`scripts/content-check.mjs`) that could not fail: it patched
`drv.master = { connect: async () => … }` while
`PostgresDriver.obtainMasterConnection()` calls `this.master.connect(cb)`, so the
promise never settled and Node exited **0 without executing a single assertion**.
With the harness repaired (2026-10-10) the loader fails immediately. **P0.10** exists
to reconcile it.

Two independent layers diverged, and neither was ever compared to the other:

1. **`content-loader.ts` writes a schema it invented.** Its SQL names
   `cefr_levels (cefr_level, description)`, `domains (domain_id, name)`,
   `modules (module_id, …)`, `lessons (lesson_id, source_markdown, prereq_lessons,
   skill_items)`, `packs (pack_id, title, …, publication_state)`,
   `items (item_id, pack_id, type, question, …)`,
   `item_options (item_id, slot, value, …)`, `dialogues (kind, setting, register, turns)`,
   `speakers (voice_label, …)`, `voices (description)` and **`listening_slots`**.
2. **`src/migrations/1791331200000-create-schema.ts` (ADR-019) defines 33 tables** —
   the P0.4 source of truth — under different names and columns, with `NOT NULL`,
   `CHECK` and `REFERENCES` constraints the loader's rows do not satisfy. There is no
   `listening_slots` table at all; clips live in `clips(id, dialogue_id, speaker_id,
   sort_index, utterance_text, phonetic_target)`.

A third layer was never reconciled either: **the parsers do not read the real
artefacts.** Measured against the repository (2026-10-10):

| Fact | Measurement | Parser assumption | Effect |
|---|---|---|---|
| Real lessons carry `**Module:**` / `**CEFR:**` prose fields | 115/122 have both; the other 7 use `\| **CEFR Level** \| A2 (…) \|` and declare no module | reads `lm.module_id` / `lm.cefr_level` from a JSON block; reads neither prose field | `lessons.cefr_level` and `lessons.module_id` arrive empty → `NOT NULL` violation × 122 |
| Real packs are **`legacy_v1`** (`**Pack ID:**`) | 115 legacy / 7 canonical (ADR-004) | `parseLegacyItem` takes `item_id` from the `### ITEM n` header **before** `**item_id:**` | every legacy item id is `"1"`,`"2"`,… → global PK collisions across packs; the declared dotted ids are discarded |
| The 8 `MATCHING_KEY_UNSUPPORTED` items live in **legacy** packs | measured: each id appears once, all in `pack_les_*_v1.md` | the skip rule exists only in `parseCanonicalPack` | the gate's skip baseline is unreachable |
| Canonical items are YAML blocks (`item_id:` inside ``` ```yaml ```) | 49 items | `**item_id:**` regex | canonical items parse to `null` and are silently dropped |
| Corpus speakers are `**Voices:** Ana \`v_a\` (F), …` and the transcript is `> **Ana:** …` | 13 dialogues, 30 speaker slots | `\*\*v_[abcd]\*\*:` inside the block | zero speakers detected → `dialogue_speakers` empty → the deferred **D-5** trigger (`>= 2` distinct speakers) fails at `COMMIT`, aborting the whole load |
| Corpus slot status is `**Status:** withdrawn — §9 DEF-6` | 68 shipped, 7 withdrawn, 1 shadow-only | `status = line.trim().toLowerCase()` | status is the whole annotation string, not a field value |
| Dialogue duration is declared in corpus §8.1 (49–84 s @150 wpm) | 13 rows | word count over the **whole** dialogue block ÷150 | includes every option and feedback paragraph → far above the `CHECK (… BETWEEN 45 AND 120)` |

`ADR-020` §5 already specified the policy (skips, not a failed seed) and the gate's
`EXPECTED_SKIP_COUNT`; what was never done is deriving that constant from the content,
and this ADR does.

## Decision

**1. ADR-019's DDL is the only persistence contract. The loader is rewritten to it,
table for table.** `docs/data-model.erd.md` is descriptive; the migration is what runs.

| Loader (today) | Target (ADR-019) |
|---|---|
| `cefr_levels (cefr_level, description)` | `cefr_levels (code, label, sort_order, theta_threshold)` |
| `domains (domain_id, name)` | `domains (id, label, tracked)` |
| `modules (module_id, …)` | `modules (id, title, cefr_level, track, source_markdowns, sort_order, expected_lessons)` |
| `lessons (lesson_id, …, source_markdown, prereq_lessons, skill_items)` | `lessons (id, module_id, title, cefr_level, reuse_basis, authoring_state, publication_state, permission_state, source_ref)` |
| `lessons.prereq_lessons` (JSON column) | `lesson_prerequisites (lesson_id, prereq_id, edge_type)` |
| `lessons.skill_items` (JSON column) | `skill_prerequisite (lesson_id, skill_id, weight)` |
| `packs (pack_id, title, cefr_level, time_cap, split, interleaved, …, publication_state)` | `packs (id, lesson_id, schema_version, reuse_basis, manifest, item_ids)` |
| `items (item_id, pack_id, type, question, …)` | `items (id, schema_version, skill_ids, lesson_id, dialogue_id, slot_number, clip_ids, cefr_level, domain_id, item_type, listening_kind, listening_tier, modality, scoring, stem, key, p_random, provenance_kind, …)` |
| `item_options (item_id, slot, value, note, …)` | `item_options (item_id, position, option_text, is_key, distractor_type, br_pt_form, note, expected_share)` |
| `dialogues (dialogue_id, title, cefr_level, kind, duration_seconds, status, setting, register, turns)` | `dialogues (id, title, cefr_level, status, duration_seconds)` |
| `speakers (speaker_id, voice_label, display_name)` | `speakers (id, display_name, gender)` |
| `voices (voice_id, gender, description)` | `voices (id, label, accent, gender, active)` |
| `dialogue_speakers (dialogue_id, speaker_id, voice_id)` | unchanged |
| **`listening_slots`** | **does not exist** → `clips (id, dialogue_id, speaker_id, sort_index, utterance_text, phonetic_target)` |

**2. The parsers read the formats that exist on disk**, keeping the ADR-004 schema
detection exactly (`^pack_id:` ⇒ canonical; `**Pack ID:**` ⇒ legacy_v1; neither ⇒ throw):

- `lesson-parser`: read `**Module:**` and `**CEFR:**`; fall back to the
  `| **CEFR Level** | A2 (…) |` metadata row (first CEFR token) and the CEFR directory.
  The JSON learner-model block stays supported (integration fixtures use it) but is no
  longer the only source.
- `pack-parser`: item id is `**item_id:**` (legacy) / `item_id:` inside the YAML item
  block (canonical); the `### ITEM n` header is a positional fallback only. The
  `MATCHING_KEY_UNSUPPORTED` rule moves to a **shared** step so it applies to both
  schemas. Canonical items parse their YAML fields (`skill`, `type`, `cefr`,
  `distractors[].{option,note,br_pt_form}`).
- `listening-parser`: dialogue id from `## \`dlg_…\``, speakers from `**Voices:**`,
  transcript lines `> **Name:** text` → **clips**, slot headers
  `### L⟨tier⟩-⟨n⟩ — \`lst_*\`` → items, `**Status:**` normalised to its leading token,
  duration from §8.1 (transcript words ÷ 150 wpm).

**3. Derived-field rules.** These are mechanical functions of the declared content, not
new content. Each is provisional where it is marked; the marked ones are refined by
**ADR-021** (skill metadata) and **P1.12** (content API), not here.

| Column | Rule |
|---|---|
| `modules.track` | spec values `General` / `IT Track` / `Both` → `General` / **`IT`** / `Both` (the DDL `CHECK` admits only `General,IT,Both`) |
| `lessons.module_id` | declared `**Module:**`; else the lesson→module row of `curriculum-graph-spec.md` §4.3 |
| `lessons.cefr_level` | declared `**CEFR:**`; else the metadata table's `CEFR Level` first token; else the CEFR directory |
| `lessons.authoring_state` | `authored` for a file on disk; `blocked` for a `blocked_*` id |
| `lessons.publication_state` / `permission_state` | `cite_only`/`adapt_with_attribution` → `publishable`/`not_required`; `adapt_requires_permission` → `restricted_pending_permission`/`requested` |
| `lessons.source_ref` | declared `**Source:**` |
| `packs.manifest` | the pack metadata the DDL does not carry: `{title, cefr_level, time_cap, split, interleaved}` |
| `packs.item_ids` | the ids actually inserted for that pack (skips excluded) |
| `items.id` | declared item id (**not** the positional header) |
| `items.cefr_level` | pack lesson's CEFR (uppercased, `remediation` → its module's CEFR) |
| `items.domain_id` | declared `**domain:**` (legacy) / the namespace of `skill:` (canonical); must be in `domains` and ≠ `coherence` — canonical items whose skill namespace is `coherence` are stored under the domain of their pack |
| `items.item_type` | declared `type` mapped through the existing table (`multiple_choice`/`contextual_selection`→`contextual_selection`, `*minimal_pair*`→`minimal_pair`, `defect_counting`→`scanning`, `true_false_microtext`/`checklist_completion`→`contextual_selection`); else (legacy declares no type) options present → `contextual_selection`, no options → `production`. **Provisional** |
| `items.modality` | `listening` for corpus items; else `text`. **Provisional** |
| `items.scoring` | options present → `choice`; no options → `free_text`; `minimal_pair` production → `asr_phoneme_match`. **Provisional** |
| `items.stem` | the item's prompt (canonical `**stem:**`/question; legacy `**stem:**` minus its option table) |
| `items.p_random` | `1 / n_options` (never 0; the DDL requires `> 0`) |
| `items.skill_ids` | canonical: `[skill]`; legacy (no skill declared): `[<domain_id>]`. **Provisional — ADR-021** |
| `items.provenance_kind` | `authored` (the content's own licence stance: these are authored artefacts) |
| `item_options.position` | slot letter `A`→1 … `F`→6 |
| `item_options.option_text` | the option value |
| `item_options.is_key` | bolded row / matching `**Key:**` |
| `item_options.note` | declared note/`distractor_type`; else the literal `no distractor rationale recorded (legacy_v1)` — the DDL's `CHECK (is_key OR note IS NOT NULL)` forbids `NULL` for a distractor and the loader may not invent a rationale |
| `clips.id` / `sort_index` / `utterance_text` | `clp_⟨dg⟩_⟨n⟩` / transcript line order / the transcript line text |
| `dialogues.status` | `shipped` (the corpus declares per-*slot* status; all 13 dialogues are the shipped corpus) |
| `dialogues.duration_seconds` | §8.1: transcript words ÷ 150 wpm, rounded; ∈ [45,120] |

**4. Seeds are derived from the content, not guessed.** `cefr_levels` = `A1…C2`
(`sort_order` 1–6); `domains` = the domain set the content references ∪ `{vocab,
grammar, reading, listening, pronunciation, speaking, writing}`; `modules` from
`curriculum-graph-spec.md` §4.3 + the module table; `voices` from the corpus panel
(`v_a`/`v_c` F, `v_b`/`v_d` M; `accent` from `content-map.md` §6.2, `en-US`).
**`skills` is not seeded by P0.10** — no loaded table references it (real lessons
declare no `skill_items`, so `skill_prerequisite` is empty) — it is seeded by ADR-021.

**5. Skips are reported, never silent, and the baseline is derived.** The gate asserts
`EXPECTED_SKIP_COUNT`, so the constant must equal what the rules produce on the real
content:

| Rule | Count | Derivation (measured 2026-10-10) |
|---|---|---|
| `matching_key_unsupported` | **8** | the 8 ids in `MATCHING_KEY_UNSUPPORTED`, each appearing exactly once, all in legacy packs |
| slot `**Status:**` ∉ {`shipped`} (stored as dialogue metadata only) | **8** | 82 slot headers; 68 shipped, **7 withdrawn + 1 shadow-only** |
| **Total** | **16** | `8 + 8 = 16` = `EXPECTED_SKIP_COUNT` |

The constant is re-derived whenever the content is cleaned, and the gate forces the
change. `EXPECTED_SKIP_COUNT` is **not** changed by this ADR; it is validated by it.

**6. Idempotency is keyed on the business PK.** `INSERT … ON CONFLICT (id) DO UPDATE`
for `cefr_levels`, `domains`, `modules`, `lessons`, `packs`, `items`, `dialogues`,
`speakers`, `voices`, `clips`; `delete + re-insert` per parent for the tables with no
business key (`item_options`, `lesson_prerequisites`, `skill_prerequisite`,
`dialogue_speakers`). The whole load stays inside one transaction.

## Consequences

### Positive

- Every `INSERT … ON CONFLICT` names a real table and real column (P0.10's acceptance),
  so `integration` and `content-loader` can go green on evidence rather than by
  construction.
- The parsers become a faithful first reader of the artefacts the app serves in P1.12;
  the skip baseline becomes a number with an arithmetic behind it.
- The provisional markers give ADR-021 and P1.12 an explicit, bounded surface to
  refine instead of an undocumented default.

### Negative

- Real-content fidelity now depends on several derived rules; each marked `Provisional`
  is a place where the loader is *adequate* for P0.10 and *not yet* the last word.
- `items.skill_ids = [<domain_id>]` for legacy items is weaker than ADR-021's canonical
  skill registry and will be rewritten when §4.3 gains its columns.
- The 7 lessons that declare no module force a registry lookup; if the §4.3 row is
  missing, the load must fail loudly rather than default (a defaulted module is the
  silent-no-op failure ADR-021 §3 names).

### Neutral

- `EXPECTED_SKIP_COUNT = 16` is unchanged; its derivation is what is new.
- The `legacy_v1` packs keep their schema (ADR-004); only the reader is corrected.

## Alternatives Considered

1. **Change the schema to match the loader (`cefr_level`, `listening_slots`, …).**
   Rejected: ADR-018 makes persistence derive from the specs, and ADR-019 already
   delivered the DDL; rewriting it to match an invented loader inverts the direction.
2. **Prefilter/transform the content at load time (rename columns via a view).**
   Rejected: a view hides the mismatch instead of reconciling it, and the parsers must
   be fixed regardless (they do not read the real formats).
3. **Drop the skip baseline and assert only `errors.length === 0`.** Rejected: that is
   the ADR-020 §5 regression the baseline exists to catch, and a gate without a
   fail-closed invariant is the P0.5 defect again.
4. **Skip the 8 non-admissible slots as *items* but count them elsewhere.** Rejected:
   one `skips[]` channel with typed reasons is auditable; two channels is how a count
   drifts.
5. **Seed `skills` from `content-map.md` §3 now.** Rejected for P0.10: nothing loaded
   references it, and ADR-021 owns the reconciliation of §3's ids with the namespaced
   `skill:` values (they are not the same vocabulary yet).

## Implementation Plan

- [x] Rewrite the loader's SQL to the ADR-019 columns (12 tables, §1 table)
- [x] `lesson-parser`: `**Module:**`, `**CEFR:**`, metadata-table and directory fallbacks
- [x] `pack-parser`: id precedence; shared `MATCHING_KEY_UNSUPPORTED` step; canonical YAML items
- [x] `listening-parser`: `**Voices:**`, transcript→`clips`, slots→items, status normalisation, §8.1 duration
- [x] Derived-field rules (§3) + seeds (§4)
- [x] Skip rules produce exactly 16 on the real content (§5)
- [x] Update `tests/integration/*.spec.ts` to the ADR-019 column names; keep `report.*` counts
- [x] `scripts/content-check.mjs` green on the real repo (0 errors, 16 skips)
- [x] Verify `verify-integrity.py` and `prd-score.py` unchanged; commit

### What the implementation added to the plan

- `curriculum-parser`: the §3 module table and the §4.3 lesson→module registry, which
  are the source of the module a lesson points at.
- `pack-parser` also reads the `**Options:**` list form and falls back to `vocab` for an
  item that declares neither `skill:` nor `domain:` — both needed by the integration
  fixtures, neither contradicting §3.
- `pack-parser` reads a leading `---` YAML frontmatter manifest in addition to the
  fenced ```` ```yaml ```` one; `parsePack`'s `^pack_id:` detection already covered both.
- `lesson-parser` uses the JSON `cefr_level` as a *last resort* and only when it is a
  valid code — the 7 lessons that declare `A2+` there stay rejected.
- The integration fixture root now writes the minimal `specs/curriculum-graph-spec.md`
  its lesson needs, and the listening fixture is the real corpus format with ≥ 2 voices
  (D-5) and a ≥ 45 s transcript (Q-L2). Without them the fixture root loaded zero rows
  and the suites asserted a schema that no longer exists.
- 3 real content defects surfaced by the load and were fixed at the source: an option
  table whose 4th row repeated letter `C` (now `D`) in
  `pack_les_a2_it_meeting_standup_v1.md`,
  `pack_les_b1_project_negotiation_roleplay_v1.md` and
  `pack_les_b1_it_architecture_vocab_v1.md`.

**Not closed by P0.10** (deliberately, and owned by ADR-021): the 7 provisional markers
of §3 and the `items.skill_ids = [<domain_id>]` shape for legacy items.

## References

- `src/migrations/1791331200000-create-schema.ts`, ADR-019 — the DDL that runs
- `docs/data-model.erd.md` §6 — the derived model (descriptive)
- `docs/adr/020-content-loader-port.md` §1–5 — the port's own contract
- `docs/adr/004-two-pack-schemas.md` — canonical vs `legacy_v1`, with counts
- `docs/adr/018-persistence-derived-from-specs.md` §1 — the invariant floor
- `docs/adr/021-per-lesson-skill-metadata.md` — skill metadata owner
- `specs/curriculum-graph-spec.md` §4.3 — the lesson registry and module table
- `content-map.md` §3 (canonical skill ids), §6.2 (voice spec)
- `corpus/listening-corpus.md` §0, §8.1, §8.2 — inventory and durations
- `its-platform/BACKLOG.md` P0.5, P0.7, P0.8, P0.10
