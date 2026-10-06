---
adr: 016
title: Canonical identifier registry — one form per identifier class, enforced by a machine gate
status: Accepted
date: 2026-10-05
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@backend-lead, @qa-sdet]
informed: [@team]
tags: [identifiers, naming, registry, migration, ci-gate, clean-architecture]
---

## Context

Five spellings of `skill_id` coexist for the same concept, and **two of them appear inside a
single JSON object**:

| Form | Example | Where it is normative or used | Count in `specs/` |
|---|---|---|---|
| bare slug | `present_simple_be`, `th_voiced`, `greetings_vocab` | `curriculum-graph` §4.1, §7.1 · `stats` §2.2, §4.1, §8.1 | pervasive |
| `domain.skill_slug` | `grammar.be_affirmative`, `coherence.email_register_pairing` | **`assessment-item-spec.md` §1.2 — the normative table** | 9 distinct |
| short namespace | `lst.gist`, `lst.corporate_terms`, `prn.th_unvoiced` | `listening-corpus` §2.1, §4 | 6 distinct |
| prefix | `pron_th_voiced`, `vocab_collocation`, `vocab_register` | `post-lesson` §2.3, §9.1, §10.1 | — |
| **fully dotted** | `vocab.tenses.present`, `vocab.questions.yes`, `vocab.pron.th` | **770 `item_id`s across the 115 Family-B packs** | on disk |

The decisive case is `diagnostic-spec.md` §3.6's `bkt_priors_override`, which is one object with
five keys:

```json
{ "present_simple_be": 0.35,                                  // bare
  "th_voiced": 0.10,                                          // bare
  "tech_vocab_basic": 0.40,                                   // bare
  "listening.noun_compound_identification": 0.05,             // namespaced
  "pronunciation.s_consonant_cluster": 0.10 }                 // namespaced
```

Three consequences follow, and only the first is stylistic:

1. **A join cannot be written.** `skills.id` in `data-model.erd.md` is `VARCHAR(50)` with no
   constraint on shape, so `present_simple_be` and `grammar.be_affirmative` are two rows that
   mean the same thing.
2. **`item_id` and `skill_id` are the same class of string.** `assessment` §1.2 declares the
   prefix form (`grm_`, `voc_`, `rdg_`, `prn_`, `lst_`, `coh_`) and requires *prefix ↔ namespace*.
   But the 115 Family-B packs use fully dotted ids whose first segment is a **domain** name:
   `vocab.tenses.present` is textually indistinguishable from a `skill_id`. With no registry, a
   loader cannot tell whether a dotted token is an item or a skill.
3. **It was already half-diagnosed and half-fixed.** `post-lesson` §10.2 found four
   prefix↔namespace violations in 42 items, diagnosed the cause exactly — *"`assessment` §1.2's
   table mapped prefix → **domain**, while the schema separately declares `skill_ids` and
   `domain`, and nothing said which one owns the `item_id`"* — amended §1.2 to say *prefix =
   primary skill namespace*, and left 770 ids unrenamed as *"a migration, not a defect"*.

That reasoning is inverted. The repository has already demonstrated the rule this project runs
on: `AGENTS.md` records **fourteen** defects that were found by `verify-integrity.py` and not by
reading, including *"the respelling rule requires a diacritic as well as a space: 239 of 560
respellings are multi-word and none of the 239 lacks a diacritic, so the diacritic costs no
signal"*. A rule that cannot be checked by a machine does not hold. "A migration, not a defect"
is precisely the category of statement this repository exists to eliminate.

### Item ids also diverge three ways

`assessment` §1.2 `grm_…_001` (normative) · `stats` §4.1 `gram_present_simple_be_001` ·
`post-lesson` §8.1 `it_greetings_001` — which §10.2 itself exists to forbid · **dotted** in
Family B. `listening-corpus-spec.md` §4 adds `lst_gist` while `SDD.md` §1 declares
`lst_<cefr>_<nn>` and §2.1/§2.3 use `lst_corp_041`, `lst_lexical_007`,
`lst_pron_nullsubject_002`. Five forms for listening items.

`CONSTITUTION.md` §4.3 already ruled on this once:

> *`snake_case` and **immutable**: `les_a1_greetings`, `pack_les_a1_greetings_v1`,
> `lst_prn_th_001`. This is a **data-integrity rule, not a style rule.** Renaming one breaks
> `verify-integrity.py` checks [1], [2], [8], [11] and requires amending the registry.*

The rule exists. **Nothing enforces that new identifiers conform to it.**

## Decision

### 1. One canonical form per identifier class

| Class | Canonical form | Owner | Example | Validation |
|---|---|---|---|---|
| Skill | `<domain>.<slug>`, `domain ∈ {grammar, vocab, reading, pronunciation, listening, coherence}` | **Item Bank** (`assessment` §1.2) | `grammar.be_affirmative` | domain ∈ the closed set; slug `^[a-z][a-z0-9_]*$` |
| Assessment item | `<prefix>_<skill-slug>_<NNN>` with `prefix` = the skill's domain prefix | Item Bank | `grm_be_affirmative_001` | `§1.2` table; prefix ↔ namespace; id globally unique; **never reused** |
| Lesson | `les_<cefr>_<slug>` | Curriculum Catalog | `les_a1_greetings` | immutable; `CONSTITUTION` §4.3 |
| Module | `mod_<level>_<theme>` | Curriculum Catalog | `mod_a1_foundation` | immutable |
| Practice pack | `pack_<lesson_lessonid>_v<N>` | Item Bank | `pack_les_a2_greetings_intro_v1` | `lesson_id` must resolve |
| Listening item | `lst_<skill-slug>_<NNN>` | Listening Corpus | `lst_gist_001` | — |
| Dialogue | `dlg_<cefr>_<NN>_<slug>` | Listening Corpus | `dlg_a1_01_greetings` | — |
| Clip / render | `clip_<dialogue>_<NNN>` / `take_<clip>_<NN>` | Listening Corpus | `clip_dlg_a1_01_003`, `take_003_02` | new — see below |

**`Vocabulary` becomes `vocab`.** `db/models.py:54` declares `VOCABULARY = "vocabulary"`, the ERD's
`skills.domain` comment says `vocab`, and `assessment` §1.2 says `vocab.`. Two of three agree;
`models.py` is the outlier and is corrected. `Writing` and `Speaking` are **removed** from the
domain enum: `assessment` §2.2 excludes them as tracked domains — *"they are output modalities
with no reception item; tracked as constructs, not scored domains."* `models.py:58-59` currently
has both, which would make them persistable domains.

**Two new identifiers the specs imply but never name:** `Speaker` (load-bearing —
`listening-corpus` §2.1 makes within-dialogue voice ≡ speaker identity, and `lst_lexical_007`
asks which phrase *"this speaker"* used) and a clip **render/take** id (implied by `v_take_03`,
and `DEF-13`'s remedy is *"a second render on panel voices"* with no entity to hold it).

### 2. Aliases, not rewrites — and a mapping table that survives

Family-B packs are **not** bulk-renamed by hand. An `identifier_aliases` table maps every
historical form to its canonical id:

```
vocab.tenses.present      → (item) → grm_present_simple_001
prn_th_voiced             → (skill) → pronunciation.th_voiced
lst.gist                  → (skill) → listening.gist
```

`post-lesson` §12.4 step 2 already requires exactly this — *"keeping a mapping table so learner
history survives the rename"*. Every repository read resolves through the alias table, so
`(learner_id, item_id)` rows written before the migration keep resolving. Aliases are
`INSERT`-only and never deleted while any row references them.

### 3. `it_` is a defect with a known answer, not an open migration

`post-lesson` §8.1's `it_greetings_001` violates `assessment` §1.2, and §10.2 exists to enforce
that table. It is fixed in `post-lesson` §8.1 by the same rename §12.4 orders. `stats` §4.1's
`gram_` prefix is struck in favour of `grm_`.

### 4. The gate: `verify-identifiers.py`, cross-repo

A new script, `its-platform/scripts/verify-identifiers.py`, run in **both** repositories' CI
alongside `verify-integrity.py`. It fails on:

| # | Check | Detects |
|---|---|---|
| I-1 | canonical skill id | any `skill_id` not `<domain>.<slug>` in any spec, lesson, or pack |
| I-2 | prefix ↔ namespace | `assessment` §1.2 mapping, both directions |
| I-3 | global item uniqueness | ids already checked by `verify-integrity.py` [11c]; re-asserted so the platform's own loader is covered |
| I-4 | alias closure | an alias whose target does not exist in the registry |
| I-5 | alias coverage | a dotted Family-B id with no alias row — **drives the migration to zero** |
| I-6 | FK resolvability | every `skill_id`, `item_id`, `lesson_id`, `pack_id` in a pack manifest resolves to a registry row |
| I-7 | namespace closure | a `br_pt_tags` facet outside the closed set — `assessment` §6.2 lists 4 examples, §8.3 adds 2, §1 shows a 7th, and the `<facet>:<value>` grammar is never stated |
| I-8 | profile enum | `false_beginner_suspected` (`diagnostic` §3.6, `curriculum-graph` §5.1) vs `false_beginner` (§4.3, §8.1) vs `default \| false_beginner \| it_track` (`post-lesson` §8.1) → **one spelling**, `false_beginner` |

**I-5 is the migration's completion metric.** It starts non-zero (770 dotted ids plus the
`it_`/`gram_`/`lst_gist` families) and the count must reach zero. That makes the warning in
`verify-integrity.py` and the `BACKLOG.md` P3.14 schema warning converge on one measurable
number instead of two prose statements that both say "outstanding".

### 5. The registry is data, and it lives in the Catalog

`skill_registry` and `identifier_aliases` are tables, owned by context 1 (ADR-015). They are
**not** content and **not** code. This matters for ADR-012's Clean Architecture rule: a
`domain/` identifier vocabulary as TypeScript union types would duplicate the registry and put
the two out of sync, which is the failure this ADR exists to end.

## Consequences

### Positive

- `items.skill_ids` becomes `TEXT[]` with a GIN index, and joins become expressible.
- A loader can classify a dotted token, because `identifier_aliases.kind` says whether it is an
  item or a skill.
- The Family-B migration stops being 20 days of prose editing and becomes a measurable
  convergence: `I-5 == 0`.
- Aliases preserve learner history, so the migration is not a `MAJOR` data event.

### Negative

- **A second source of truth for `SkillPrerequisite` now exists**: lesson-file
  `mastery_gate.required_skills` and the ADR-015 `SkillPrerequisite` table. The loader must
  assert equality and fail the content check on divergence. Accepted: the alternative is
  leaving the graph's central gate predicate unreadable.
- I-7 forces a decision on `br_pt_tags`' vocabulary that no spec has made. That decision is
  recorded in `docs/domain-model.md`, not invented here.
- The alias table is permanent schema for classes that shrink toward zero. It is one table with
  two indexes; the cost is a nullable lookup on a path that is indexed anyway.

### Neutral

- This ADR does not decide *how* to migrate the 770 ids; that is `BACKLOG.md` P3.14, unchanged
  in scope. It decides that the migration is *measurable* and that no new id may use a retired
  form.
- Identifier immutability is now enforced twice — by `verify-integrity.py` for content and by
  `verify-identifiers.py` for the registry. Redundancy is intended.

## Alternatives Considered

1. **Rewrite all 770 ids by script now.** Rejected — `item_id` renames break
   `verify-integrity.py` [11c] uniqueness assertions and require the §4.3 registry amendment
   `CONSTITUTION.md` §4.3 names, in one unreviewable commit, before any runtime exists to test
   against. Aliases defer the risk without deferring the work.
2. **Make the canonical form the bare slug** (`th_voiced`), because it dominates the specs.
   Rejected — it has no namespace, so `vocab.there.is` (an item) and a hypothetical
   `vocab.there.is` (a skill) are the same string forever. `assessment` §1.2 already made this
   call correctly; the ADR adopts it rather than re-litigating it.
3. **Enforce in TypeScript union types.** Rejected — duplicates the registry, and `CONSTITUTION`
   §2 *Derivation over Assertion* would be violated by a vocabulary asserted in code and
   authoritative in SQL.
4. **Keep "a migration, not a defect".** Rejected — `AGENTS.md` records fourteen defects found
   by a machine and none found by reading. This one is visible only by reading, which is exactly
   the case the verifier must be built to catch.
5. **Let the ORM own the vocabulary** via `ENUM` types, as `001_initial.py` does for four
   enums. Rejected for identifiers specifically: an enum cannot express a 770-row alias set, and
   adding one is a migration. It remains correct for the genuinely closed enums
   (`reuse_basis`, `status`, `distractor_type`).

## Implementation Plan

- [ ] Create `scripts/verify-identifiers.py` with checks I-1…I-8; wire into
      `its-platform/.github/workflows/ci.yml` **and** the content repo's CI
- [ ] `skill_registry` + `identifier_aliases` DDL and migrations; seed from
      `curriculum-graph-spec.md` §4.1 and `content-map.md` §3
- [ ] Populate aliases for the 770 Family-B ids, `it_*`, `gram_*`, `lst_gist`
- [ ] Fix `post-lesson` §8.1 (`it_greetings_001`) and strike `stats` §4.1 (`gram_`)
- [ ] Unify `false_beginner` across §4.3, §5.1, §3.6, §8.1 via `SDD.md` §9 amendment
- [ ] Close `br_pt_tags`: publish the `<facet>:<value>` grammar and the facet set
- [ ] `db/models.py`: `VOCABULARY` → `vocab`; drop `WRITING`/`SPEAKING` from `SkillDomain`
- [ ] Add `Speaker`, `Clip`, `Render` to context 3 with `clip_*` / `take_*` ids

## References

- `specs/assessment-item-spec.md` §1.2 (normative prefix table), §2.4, §6.2, §8.3
- `specs/curriculum-graph-spec.md` §4.1, §5.1, §7.1
- `specs/stats-progress-evaluation-spec.md` §2.2, §4.1
- `specs/post-lesson-practice-spec.md` §8.1, §10.2, §12.4
- `specs/diagnostic-spec.md` §3.6
- `specs/listening-corpus-spec.md` §2.1, §4
- `SDD.md` §1, §5 · `AGENTS.md` (14 checks) · `CONSTITUTION.md` §2, §4.3
- [ADR-015](015-domain-model-bounded-contexts.md) · [ADR-012](012-migrate-api-layer-to-nestjs.md)
- `BACKLOG.md` P3.14 · `docs/data-model.erd.md:152-165`
