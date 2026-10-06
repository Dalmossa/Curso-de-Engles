# SDD — Spec-Driven Development: how this repository changes

**Status:** active · **Version:** 1.0 · **Applies to:** all 12 spec documents, 4 artefact fixtures,
122 lesson files, 122 practice packs, 1 listening corpus, and 2 verifier scripts at repo root.

**What this document is.** A change process with gates. It says what may be changed, by what
route, and what must be true before the change is real. It does not say what the system is —
that is `PRD.md` §1–§10 and the 7 specs. §9 (milestones with Entry/Exit) and §10 ("what would
make this PRD wrong") are the two closest to `SDD.md`: §9 is what the VERIFY phase means, §10 is
the amendment trigger of `SDD.md` §9.

**What this document is not.** Not a style guide, not a tutorial, not a place to record
pedagogical decisions (those are PRD §6 "decisions of record"), and not a duplicate of
`AGENTS.md`, which remains the operating instruction for agents.

---

## 0. PRECEDENCE — which document wins

| Rank | Document | Authority | May be overridden by |
|-----:|----------|-----------|---------------------|
| 1 | `verify-integrity.py` | Executable gate | An amendment that deletes the check, recorded in §9 |
| 2 | `AGENTS.md` | Agent operating rules | Rank 1, or a `SDD.md` §9 amendment |
| 3 | `PRD.md` | Scope, numbers, priorities | A recorded amendment naming the retracted figure |
| 4 | The 7 specs | Domain design | A higher rank that names the section it displaces |
| 5 | `SDD.md` | Process | Nothing except itself, by §9 |
| 6 | `external-sources.md` §0.5/§7.0 | Licence law | Nothing in this repo |
| 7 | Prose in a lesson or pack file | Content | Its own lesson's spec section |
| 8 | `prompt-v1.md` | Historical prompt | Nothing — no authority, not citable as source of truth |

**A conflict is a defect, not a choice.** If two documents at ranks 3 and 4 disagree, the
change does not proceed until one of them is amended in writing. "The spec is stale" is not a
finding; it is the finding, and it has an owner.

---

## 1. ARTEFACT TAXONOMY — 8 classes, 8 gates

| # | Artefact | Naming rule | Gate | Verifier |
|---|----------|-------------|------|----------|
| 1 | Module | `mod_<level>_<theme>` | all lessons authored, every lesson has a declared reuse basis | [1] [2] |
| 2 | Lesson | `les_<level>_<slug>`, filename == `**Lesson ID:**` | §3.1 below | [8] |
| 3 | Practice pack | `pack_les_<lesson>_v1.md` (legacy) or `pack-les-<lesson>.md` (canonical) | §3.2 below | [9] [11b]–[11e] |
| 4 | Listening item | `lst_<cefr>_<nn>` inside a `dlg_<level>_<nn>_<slug>` file | `**Status:**` field present; ≥45 s duration | [5] |
| 5 | Dialogue | `dlg_<level>_<nn>_<slug>` | §3.3 below | [5] [10] |
| 6 | Assessment item | `item_id` prefix ↔ skill namespace (§1.2 of `assessment-item-spec.md`) | id unique across **both** pack schemas; `note:` on every distractor; no option repeated | [9] [11c]–[11e] |
| 7 | Spec section | `§<n>.<m>` | numbered; every internal `§` reference resolves | [10] |
| 8 | **Audio clip / render manifest** *(ADR-016)* | `clip_<dialogue>_<NNN>`, `take_<clip>_<NN>` | Q-L1 unambiguous render · **Q-L6: minimal-pair clips by the same voice at the same rate, or the item is void** · Q-L7 ear check (100 % L2, 20 % sample L1) · every `take` records `voice_id`, `rate`, `duration_s` | [5] [Q-L6] I-6 |

**A class with no gate is a class that drifts.** Every row above names the check that catches
its failure mode; a new artefact class may not be added without one.

**Class 8 exists because the corpus already references an entity that has no class.** The listening
corpus carries `v_take_03`, and `DEF-13`'s remedy is *"a second render on panel voices"* — but a
take has no manifest, no naming rule and no gate, so `assessment` §7's requirement that a retired
item stay auditable is unsatisfiable: `b` was estimated against **one** render and there is no way
to know which. Voice is load-bearing rather than incidental —
`listening-corpus-spec.md` §2.1 makes within-dialogue voice ≡ speaker identity, and
`lst_lexical_007` is *solvable because of it*. A nuisance variable inside the object a difficulty
estimate is anchored to needs a gate like any other.

**Scope note.** This taxonomy governs **content artefacts only** — files in this repository, read
by `verify-integrity.py`. Platform runtime artefacts are out of its scope: `AppendOnlyEvent`
(ADR-015 §5) is a table in `its-platform`, gated by `CONSTITUTION.md` §4.6, OWASP ASVS
`v4.0.3-7.3.3` and `BACKLOG.md` P2.2. Registering it here would be a category error — a content gate
that cannot read a database table gives false coverage, not coverage.

---

## 2. CHANGE LIFECYCLE — 7 stages, no stage skippable

```
INTAKE ──▶ CLASSIFY ──▶ SPEC DELTA ──▶ AUTHOR ──▶ VERIFY ──▶ RECORD ──▶ RELEASE
   │           │            │             │          │          │          │
   │           │            │             │          │          │          └─ §9 amendment if
   │           │            │             │          │          │             a check changed
   │           │            │             │          │          └─ prd-score.py if a §5 figure moved
   │           │            │             │          └─ verify-integrity.py, exit 0
   │           │            │             └─ file only; the spec section must already exist
   │           │            └─ the §ref that changes lives in THIS stage, never only in prose
   │           └─ exactly one artefact class, or the change is two changes (§6)
   └─ written, one paragraph: what breaks if this is not done
```

**STAGE 3 is the one that is skipped.** Nine of the defects recorded in `AGENTS.md` happened
because an artefact changed and the spec section describing it did not. The rule: *if the
artefact's shape or semantics change, the spec section changes in the same change, in the same
commit, or the change is incomplete.*

---

## 3. GATES

### 3.1 Lesson

| Requirement | Where declared | Check |
|-------------|----------------|-------|
| `**Lesson ID:**` == filename stem | `curriculum-graph-spec.md` §4.3 | [8] |
| `**Reuse basis:**` ∈ {`cite_only`, `adapt_with_attribution`, `adapt_requires_permission`} | `external-sources.md` §7.0 | [8] [3b] |
| `adapt_*` barred against a restricted source | `external-sources.md` §0.5.1 | [8] |
| If list-shaped: reuse basis ≠ `cite_only` | PRD §2 | [3b] |
| Listed in the §4.3 registry with a status matching the disk | `curriculum-graph-spec.md` §4.3 | [2] registry status |
| No `cite_only` respelling of a source string | AGENTS.md check [8] | [8] |

**Note the last row:** 239 of 560 respellings are multi-word and none lacks a diacritic, so the
diacritic requirement costs no signal and removes the `[preposition phrase]` false positive. It
stays.

### 3.2 Practice pack

- `**Reuse basis:**` matches the provenance of its items — [11b]
- Every `item_id` unique across both schemas — [11c] found 10 collisions
- Every item with a distractor table declares a `**Key:**` — [11d]; the 14 ASR-scored
  production/minimal-pair items are correctly exempt because they have no choice to score
- No item offers the same option twice, case-sensitive, bold stripped — [11e] found 28 items
  whose distractor was byte-identical to its own key
- **115 of 122 packs are on the legacy schema.** 110 declare no `**Reuse basis:**`. This is a
  tracked warning, not a pass. Migration order is `post-lesson-practice-spec.md` §12; it is
  RF-001 in PRD §8.

### 3.3 Dialogue

- ≥45 s at normal rate (Q-L2). Four dialogues were 30–44 s and were pulled.
- `**Status:**` is the state; the body is evidence. The two are never reconciled — three
  attempts to cross-validate failed, each recorded in `listening-corpus.md`.
- Any `§` reference in the header must resolve — [10] found two headers citing a "§7 sourcing
  note" that did not exist, which was also the exact licensing mislabelling the licence section
  exists to prevent.

---

## 4. CLOSED STATE VOCABULARY

`authored` · `specified` · `unauthored` · `blocked` · `withdrawn`

Five states, no others. A word outside this set in any status column is a defect.

**`withdrawn` exists because the first four could not express the truth.** An item pulled by a
recorded defect is not unwritten and not pending. `listening-corpus.md` §8.2 published 68
admissible items against a real 74 for the life of the table, because there was no state for
"decided and removed", so it was relabelled as something it was not.

---

## 5. DERIVATION DISCIPLINE

**Every number in any document names the command or spec section that produces it.**

| Claim | Derivation | Checker |
|-------|-----------|---------|
| 123 lessons | distinct `les_` rows in `curriculum-graph-spec.md` §4.3 | [2] |
| 122 authored | `**Lesson ID:**` across repo-root `les_*.md` | [2] [8] |
| 74 admissible listening items | `**Status:** shipped` in `listening-corpus.md` | [5] |
| 855 practice items | both pack schemas at repo root | [9] [11c] |
| 19 accepted external sources | `external-sources.md` §0.5.1 | [6] |
| 58 restricted lessons (A_restricted) | `check_sources` part B | [3b] |
| 141 IDs in registry §4.3 | `check_registry` | [1] |
| 994 tables consistent | `check_tables` | [12] |
| 68 internal §-references resolved | `check_sxrefs` | [10] |

A number without a derivation is a defect in that document, not a rounding difference. This is
RNF-001 and it exists because `listening-corpus.md` §8.2 shipped the wrong count for years.

---

## 6. ONE CHANGE, ONE CLASS

If a change touches two artefact classes, it is two changes, reviewed separately. The reason is
specific: the 9 recorded defects each had a single root cause visible only across class
boundaries — a pack declaring a reuse basis its items did not have [11b], a deck reproducing a
restricted book 700 lines from the section that says it may not [11], a registry `Status` column
disagreeing with the disk.

---

## 7. ANTI-PATTERNS — the nine that actually occurred

| # | Anti-pattern | Found by | Cost |
|---|-------------|----------|------|
| 1 | Count taken from the registry, never compared to the disk | [2] | 7 ids and 116 files reported as consistent |
| 2 | Hand-maintained summary table | RNF-001 / [5] | 68 vs 74 admissible items, years |
| 3 | Item status read from prose, not the field | [5] | withdrawal history cited as if it were the state |
| 4 | Fence present, contents never parsed | [4] | Python implicit string concatenation shipped as JSON |
| 5 | Worked example contradicting its own disclosure | [13] | diagnostic example printed a listening θ after Listening was removed |
| 6 | Regex meant to drop one column dropped another | [12] | 40 Portuguese glosses deleted from `content-map.md` §11.1 |
| 7 | Distractor byte-identical to its key | [11e] | 28 unscorable items |
| 8 | Reviewer reviewed their own work | `tier-b-review.md` §0 | Tier B deck's stated purpose 57% unmet |
| 9 | Dangling `§` reference | [10] | 4 real ones, one of them a licensing mislabelling |

This table is not folklore. Each row is a check that exists today, and it is the reason the
class is closed.

---

## 8. HUMAN-ONLY DECISIONS

Four items are blocked on a person, not on work:

1. `les_b1_it_presentations` — `blocked_no_adequate_source`; rebuild the source, rescope, or drop
2. Written, perpetual, redistribution-granting permission for 48 list-shaped lessons — PRD RF-004
3. The licensing P0 on 6 `source_derived` items in `pack-les-a2-greetings-intro.md` — PRD RF-008
4. Independent ELT review of `content-map.md` §11.2 by a qualified professional — PRD RF-006

An agent may not resolve any of these by deciding. It may record evidence and prepare the
request.

---

## 9. AMENDMENT PROCEDURE

To change any rule in this document, any check in `verify-integrity.py`, or any status
vocabulary word:

1. Write the change as a diff against the current text, naming the check(s) affected
2. Show the defect it was written for, with the file and section where it occurred
3. State what the change stops catching — a gate that gets weaker must be visible
4. Record it in the changelog below with a date and the defect's identifier
5. Run `python3 verify-integrity.py` before and after; both runs are part of the record

**Deleting a check requires a defect that the check caused.** It has happened: [11d] would have
failed the 14 ASR-scored items forever if it had not been conditioned on the item having a
choice to score.

---

## 10. VERIFIER COVERAGE MAP

| Check | Module | Lesson | Pack | Listening Item | Dialogue | Assessment Item | Spec Section |
|-------|:------:|:------:|:----:|:--------------:|:--------:|:---------------:|:------------:|
| [1] Registry | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [2] Lesson count | ✅ | ✅ | | | | | |
| [3] Sources | | ✅ | | | | | |
| [4] JSON | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [5] Corpus | | | | ✅ | ✅ | | |
| [6] External | | ✅ | | | | | |
| [7] Xrefs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [8] Lessons | | ✅ | | | | | |
| [9] Packs | | | ✅ | | | ✅ | |
| [10] Sxrefs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [11] Restricted | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [12] Tables | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| [13] Examples | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Derived from `def check_*` in `verify-integrity.py`, not from `AGENTS.md`** (which omits [7]).
The gap in `AGENTS.md` is registered as an open defect (§9.3).

---

## 11. WORKED CHANGE FLOWS (PRESCRITIVOS)

Each flow shows: INTAKE → SPEC DELTA → VERIFIER BEFORE/AFTER → RECORD.

### Flow 1: Pack schema migration (legacy → canonical)

**INTAKE:** 115 packs on `pack_les_<lesson>_v1.md`, 110 missing `**Reuse basis:**`, dotted IDs violating §1.2 prefix↔namespace. RF-001 in PRD §8.

**SPEC DELTA:**
- `post-lesson-practice-spec.md` §12: add migration order, declare legacy schema deprecated
- `verify-integrity.py` [9]: extend glob to include `pack_les_*_v1.md` (or add parallel check)
- Each pack file: add `**Reuse basis:**` line matching item provenance; rename `item_id` to `pack_les_<lesson>_v1.<skill>.<nn>`

**VERIFIER BEFORE:** [9] passes (7 canonical packs); [11b]–[11e] pass on all 122 packs; WARN on 115 legacy packs

**VERIFIER AFTER:** [9] passes on 122 packs; WARN eliminated; 110 `Reuse basis` lines present; all IDs satisfy prefix rule

**RECORD:** Changelog entry with date, PRD RF-001 reference, `verify-integrity.py` output before/after attached

---

### Flow 2: Listening item withdrawal (defect-driven)

**INTAKE:** `lst_gist_002` in `dlg_b1_01_incident.md` — key was never ear-checked; `**Status:**` says `shipped` but evidence says `shadow-only`.

**SPEC DELTA:**
- `listening-corpus.md` header for `lst_gist_002`: change `**Status:** shipped` → `shadow-only`
- Add §9 defect log entry: "key never ear-checked; retained for distractor design only"
- No file deletion — `withdrawn` is for items pulled by defect; `shadow-only` is for items kept but not scored

**VERIFIER BEFORE:** [5] counts 74 admissible items; `lst_gist_002` included

**VERIFIER AFTER:** [5] counts 73 admissible + 1 shadow-only; `Status` field read correctly; §9 defect log entry present

**RECORD:** Changelog entry with date, §9 defect ID, `verify-integrity.py` output before/after attached

---

### Flow 3: Adding a new lesson (registry-first)

**INTAKE:** New module `mod_a1_phonology` needs lesson `les_a1_⟨new⟩`; no file exists yet.

**SPEC DELTA:**
- `curriculum-graph-spec.md` §4.3: add row for `les_a1_⟨new⟩` with `Status: specified`
- Create `les_a1_⟨new⟩.md` with `**Lesson ID:** les_a1_⟨new⟩`, `**Reuse basis:** cite_only`, `**Status:** authored`
- Create `pack-les-a1-⟨new⟩.md` with `**Reuse basis:** cite_only`, 7 items with unique IDs
- `PRD.md` §4 table: increment lesson counts

**VERIFIER BEFORE:** [1] would flag orphan ID; [2] would show count mismatch; [8] would not find file

**VERIFIER AFTER:** [1] 0 orphans; [2] counts match; [8] filename == Lesson ID; [9] pack present; all pass

**RECORD:** Changelog entry with date, registry row diff, `verify-integrity.py` output before/after attached

---

## 12. CHANGELOG

| Version | Date | Trigger |
|---------|------|---------|
| 1.0 | 2026-10-02 | Initial authoring per plan `/home/dalmo/.opencode/plan/2026-10-02-sdd.md`; repo green (verify-integrity.py PASS, prd-score.py 100%) |
| 1.1 | 2026-10-02 | Added `SDD.md` to `SPECS` in `verify-integrity.py` (F5); fixed worked flow template IDs to use `⟨new⟩` placeholder to avoid orphan refs; added `check_xrefs` line [7] to `AGENTS.md` table and updated count 13→14 (D6/F6c); both verifiers PASS |