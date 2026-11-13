---
adr: 021
title: Per-lesson skill metadata — canonical source, canonical ids, and fail-closed gating
status: Accepted
date: 2026-10-10
decided: 2026-11-10
authors: [@system-design-architect]
deciders: [@system-design-architect, @content-owner, @adaptive-lead]
consulted: [@backend-lead, @qa-sdet]
informed: [@team]
tags: [curriculum-graph, skill-metadata, adaptive-engine, next-activity-selector, i-plus-1, mastery-gate, adr-016, adr-017, adr-018]
---

## Context

`NextActivitySelector` (BACKLOG **P1.3**) is recorded as `DONE`, but three of its
decision inputs are read from a place nothing ever writes:

| Method | Reads | Written by | Effect today |
|---|---|---|---|
| `getPrerequisiteSkills(nodeId)` | `node.metadata['skills']` | — (never populated) | returns `[]` for every node |
| `getNewSkills(nodeId)` | `node.metadata['newSkills']` | — (never populated) | returns `[]`; `iPlus1Score` is always `0` |
| `getFsrsPriorityForLesson()` | — | — | stub: `return 0` |

The consequences are not cosmetic:

- `filterByMasteryGate()` filters on the set of prerequisite skills. With every
  node reporting none, it removes **nothing**: measured against the real graph, it
  maps 64 reachable nodes to 64 unlocked nodes
  (`selectionMetadata.availableNodes === filteredByGate === 64`; the graph has 141
  nodes = 123 lessons + 18 modules). Nothing is gated by mastery at all.
- The `i_plus_1` selection rule is **unreachable**: `iPlus1Score` is the only
  input to it and it is constant `0`.

This is the failure mode `ADR-017` §4 named for the listening trigger and `ADR-018`
§1 named for the invariant floor: *a predicate that can never be true is not a
predicate.* Here it is the mirror image — **an input that is never read is not a
gate.** The selector does not fail; it silently selects from the whole graph.

### The data was designed, not materialised

`specs/curriculum-graph-spec.md` mentions `skill_transfer` / `new_skills_introduced`
**three times**: a bullet in §1 and a single worked example in §7.1 —

```json
{ "from": "les_a2_greetings_intro", "to": "les_a2_small_talk",
  "skill_transfer": { "present_simple_be": 0.9, "wh_questions_how": 0.7, ... },
  "new_skills_introduced": ["past_simple", "weekend_vocab", "connected_speech"] }
```

— and nowhere else. The §4.3 registry that `curriculum-parser.ts` reads has exactly
four columns: `Lesson ID | Title | Source | Status`. There is no skills column and no
second example. The remaining 122 lessons have no skill attribution in any artefact.

`content-map.md` §3 *does* define a canonical skill vocabulary — 31 grammar, 24
vocabulary, 18 pronunciation, 15 reading/writing/error IDs, each with a `Source §`
column — and §4 maps source sections to lessons. But §3's IDs and the selector's
assumed IDs are **not the same vocabulary**: `content-map` has `past_simple_regular`
and `past_simple_irregular`; the §7.1 example and the tests use `past_simple`.
`ADR-016` (canonical identifier registry) exists precisely to forbid a second
spelling of the same skill, and it has not been applied here.

### The tests encode the example, not the graph

`tests/domain/services/next-activity-selector.spec.ts` loads the **real** spec via
`parseCurriculumSpec()` and then asserts against the §7.1 skill set
(`present_simple_be`, `wh_questions_how`, `greetings_vocab`, `th_voiced`,
`th_unvoiced`, `h_aspirated`, `present_simple`, `past_simple`, `weekend_vocab`,
`connected_speech`). Five of its cases fail. They are not five bugs in the selector;
they are one missing dataset, asserted from the only example that exists.

## Decision

**1. Per-lesson skill metadata is a required, first-class field of the curriculum
registry — not an entry in a free-form `metadata` bag.**
`specs/curriculum-graph-spec.md` §4.3 gains two columns:

```
| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |
```

`New skills` is the set the lesson introduces; `Prerequisite skills` is the set a
learner must have mastered to attempt it (the §6.1 lesson-gate input). Both are drawn
from a single canonical skill registry.

**2. The canonical skill registry is `content-map.md` §3, reconciled under ADR-016.**
Every ID the selector or a test references must appear there — one canonical form per
skill, aliases recorded in `identifier_aliases`. `past_simple` is not a second skill;
it is a desired canonical id that must be chosen over or aliased to
`past_simple_regular` / `past_simple_irregular`.

**3. `curriculum-parser.ts` populates the graph from those columns, and a missing
value is a hard parse error.** A lesson row without `New skills` and without
`Prerequisite skills` fails the parse with its `Lesson ID` — it is not defaulted to
`[]`, because `[]` is indistinguishable from "no prerequisites", which is the defect.

**4. `NextActivitySelector` fails closed.** When the parsed graph carries no skill
metadata (e.g. metadata was dropped, or a graph is constructed in a test without it)
the selector **throws** rather than unlocking every node. A gate that cannot fail is
worse than no gate; a gate whose input is absent must not resolve to "open".

**5. `getFsrsPriorityForLesson()` is either implemented against the learner's FSRS
state or deleted.** A stub returning `0` that feeds `alternatives` ranking is a
faithfulness defect no current test measures.

**6. The obligation is enforced, not documented.** A gate asserts — for every lesson
in the registry — that `New skills` is non-empty, that every prerequisite edge has a
non-empty transfer map, and that every referenced skill id resolves in the canonical
registry. It runs in `verify-integrity.py` (or `scripts/curriculum-check.mjs`), so it
runs in CI.

**7. Until (1)–(6) land, P1.3 is not `DONE`.** It is `designed`; the selector is not
shippable and `unit` in CI is red for exactly these five cases, naming this ADR.

## Consequences

### Positive

- The mastery gate (P1.2) and the i+1 rule (P1.3) begin to operate on the DAG they
  were specified against; `filterByMasteryGate` and `i_plus_1` stop being dead code.
- One canonical skill vocabulary removes the second failure mode (silent
  divergence between spec, parser, selector and tests).
- Fail-closed makes the *next* missing-metadata defect loud on the first run instead
  of producing a plausible-looking but ungated selection.

### Negative

- 123 lessons must have skill metadata authored. The §7.1 join gives a first draft for
  the ~81 lessons fed by mapped source sections; the remainder is expert work.
- Until the metadata and the parser change land, `NextActivitySelector` throws in
  contexts where it previously returned results — P1.4–P1.8 consumers that construct
  a graph without metadata must be adapted.
- `unit` in CI stays red until the dataset is complete. That is the honest state, not
  a regression introduced by re-enabling the job.

### Neutral

- §7.1's example stops being illustrative and becomes a real §4.3 row.
- The metadata is content, not code: it is versioned with `content-map.md` and moves
  through the same review as any other content change.

## Alternatives Considered

1. **Keep `metadata` optional; treat absence as "no prerequisites".** This is the
   status quo. Rejected: it is exactly the silent no-op that made P1.3 look complete.
2. **Derive lesson→skills purely mechanically** by joining `content-map.md` §3's
   `Source §` to the §4.3 `Source` column. Rejected as the *primary* mechanism:
   the relation is many-to-many, the `Source` strings have already drifted between
   the two tables, and the output vocabulary does not match the IDs the selector
   consumes. Accepted as a *first-draft generator* whose output is human-reviewed,
   which is the implementation route.
3. **Re-scope the gate to module-level mastery only** (`curriculum-graph` §6.2) and
   drop per-lesson prerequisite skills. Rejected: §6.1's lesson gate is a spec
   invariant; weakening the implementation to match missing data is the inversion
   `ADR-018` forbids (no stored rule weaker than its predicate).
4. **Delete `next-activity-selector.ts` and rebuild it against whatever data exists.**
   Rejected: it discards the specified rule set (`i_plus_1`, remediation, spaced
   review) that P1.9–P1.12 depend on.

## Implementation Plan

- [ ] Add `New skills` / `Prerequisite skills` columns to `curriculum-graph-spec.md` §4.3 (123 rows)
- [ ] Reconcile skill IDs into the canonical registry; record aliases per ADR-016
- [ ] Extend `content-map.md` §3 with any skill the selector requires that it lacks
- [ ] `curriculum-parser.ts`: read the columns; populate `metadata.newSkills`,
      `metadata.skills` and `edge.skillTransfer`; hard-fail on a missing row
- [ ] `next-activity-selector.ts`: fail closed on a graph with no skill metadata;
      remove the debug `console.log`s; implement or delete `getFsrsPriorityForLesson`
- [ ] Add the skill-integrity check to `verify-integrity.py` / `scripts/curriculum-check.mjs`
- [ ] Re-enable the five `next-activity-selector.spec.ts` cases; they become the
      acceptance test for this ADR
- [ ] Flip P1.3 in `BACKLOG.md` from `DONE` to `designed — blocked on ADR-021`

## References

- `specs/curriculum-graph-spec.md` §1, §4.3, §6.1–6.2, §7.1 — the registry, the lesson
  gate, and the single worked example
- `content-map.md` §3 (canonical skill ids), §4 (section → lesson mapping)
- `its-platform/src/domain/services/next-activity-selector.ts`
- `its-platform/src/infrastructure/curriculum/curriculum-parser.ts`
- `its-platform/tests/domain/services/next-activity-selector.spec.ts`
- [ADR-016](016-canonical-identifier-registry.md) — canonical identifier registry
- [ADR-017](017-mvp-adaptive-scope.md) §4 — a predicate that can never be true is not a predicate
- [ADR-018](018-persistence-derived-from-specs.md) §1 — the invariant floor
- `its-platform/BACKLOG.md` P1.2, P1.3, P1.9–P1.12
