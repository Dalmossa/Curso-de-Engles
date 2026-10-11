---
adr: 023
title: Diagnostic routing semantics — the operational rule of ADR-017 §3, the CEFR↔θ threshold set, and the start-node table
status: Accepted
date: 2026-10-11
authors: [@system-design-architect]
deciders: [@system-design-architect, @backend-lead]
consulted: [@qa-sdet, @database-engineer, @content-owner]
informed: [@team]
tags: [diagnostic, placement, routing, cefr, irt, start-node, remediation, adr-017, p1.11, property-tests]
---

## Context

**P1.11** (*start-node mapping, ordinal + conservative*) is the last unmet dependency of
**P1.9** (`BACKLOG.md`: `P1.9 | … | Depends | P1.8, **P1.11**`). It is therefore the next
item on the critical path `P0 → P1.8 → P1.11 → P1.9 → P1.10`.

`src/domain/services/diagnostic-placement.service.ts` exists and is wired into
`administerDiagnostic()`, so P1.11 *looks* done. It is not: it implements none of the rule
that four artefacts state, and the rule itself is stated in a way that admits two readings
with different learner-visible outcomes. This ADR records both the contradiction and its
resolution, because the code cannot be corrected without first deciding what "correct" is.

### The four competing ladders

| # | Source | `cefr` from θ | A1/A2 boundary |
|---|---|---|---|
| 1 | `stats-progress-evaluation-spec.md` §3.1 — `A2 = −0.5, B1 = 0.5, B2 = 1.5` | point estimate | **−0.5** |
| 2 | `curriculum-graph-spec.md` §5.1 pseudo-code | point estimate | **−1.0** |
| 3 | **ADR-017 §3** (= `domain-model.md` G-4, = `BACKLOG.md` P1.11) | **interval over `[θ − 1.96·SE_eff, θ + 1.96·SE_eff]`** | n/a |
| 4 | `diagnostic-placement.service.ts` `computeStartNode` (the code) | point estimate | **−0.5**, plus invented `±2.0 / ±2.5` `belowScale` cutoffs |

Ladders 1, 2 and 4 disagree on the A1/A2 boundary; ladder 4 adds cutoffs that exist in no
source and caps at `C1`, a level `CEFR_THRESHOLDS` does not contain; and none of them is
ladder 3, which is the one `BACKLOG.md` P1.11 names as the acceptance and `domain-model.md`
G-4 restates:

> `band_bounds = [θ − 1.96·SE_eff, θ + 1.96·SE_eff]`; `start_cefr` = the **lowest** CEFR band
> whose threshold lies inside `band_bounds`. Under-placement, never over-placement.

`seEffective` is accepted by `computeStartNode` and **never used**. `ci95Lower`/`ci95Upper`
are computed and then discarded. That is the failure mode this repository keeps paying for:
a parameter that is threaded through the signature and silently has no effect on the result.

### The ambiguity inside ladder 3

"Every CEFR band whose **threshold** lies inside `band_bounds`" is satisfiable two ways,
and they disagree on learner-visible output:

- **(a) Entry thresholds.** A band's threshold is the θ at which it *begins*
  (`A2 = −0.5`, `B1 = 0.5`, `B2 = 1.5`; A1 begins at −∞ and has none).
- **(b) Touched bands.** A band is a candidate iff its θ *interval* intersects `band_bounds`.

`diagnostic-spec.md` §3.6 is the only worked example in the specs that exercises this, and
it is decisive:

```
"overall": {"theta": -0.3, "se": 0.28, "cefr": "A2", "ci_95": [-0.85, 0.25]},
"recommended_start_node": "les_a2_greetings_intro",
```

`band_bounds = [−0.849, 0.249]`. Reading **(a)**: the only entry threshold inside is `−0.5`,
so `candidate = {A2}` and `start_cefr = A2` → `les_a2_greetings_intro`. **Reproduces the
example exactly.** Reading **(b)**: the interval intersects A1's range `(−∞, −0.5]` as well,
so `candidate = {A1, A2}`, `start_cefr = A1` → `les_a1_alphabet_sounds`, contradicting the
example.

Three artefacts state the formula and the specs' only example corroborates reading **(a)**.
**(a)** is therefore the rule.

### The gap in the rule, and the honest consequence

Reading **(a)** is not total. With the fixed-form bank's declared `SE_eff = 0.567`
(`pilot-bank.service.ts` §1: `SE_statistical = 0.481`, `SE_parameter = 0.30`), `1.96·SE_eff
= 1.11132`, and entry thresholds are inside the interval only for
`θ ∈ [t − 1.111, t + 1.111]` for some `t ∈ {−0.5, 0.5, 1.5}`. Outside those windows
`candidate` is empty — at **both** ends:

- below: `θ + 1.11 < −0.5` (θ < −1.611) — the case ADR-017 §3 already anticipated
  ("band below A1");
- above: `θ − 1.611 > 1.5` (θ > 2.611) — **not anticipated**, and reachable (12 items at
  `a = 1.2` routinely estimate θ > 2.6 for a strong learner). Returning "band below A1"
  for θ = 3 would be the "predicate that can never be true" defect inverted into one that
  is always wrong.

Resulting rule, total and stated so it can be property-tested:

```
t_h        = 1.96 · SE_eff
band_entry = { A2: −0.5, B1: 0.5, B2: 1.5 }          # stats §3.1; A1 has no entry threshold
band_bounds= [θ − t_h, θ + t_h]

candidate  = { B : band_entry[B] ∈ band_bounds }
start_cefr = lowest(candidate)              if candidate ≠ ∅
           = B2                           if θ − t_h > 1.5     # bounds above the top entry
           = A1, below_scale = true       if θ + t_h < −0.5    # bounds below the A2 entry
start_node = START_NODE_TABLE[start_cefr][track]
```

With the pilot bank's `SE_eff = 0.567` this is one clean ladder, and it is **not** the
point-estimate ladder shifted by a constant:

| θ | `start_cefr` | point estimate (`stats` §3.1) | direction |
|---|---|---|---|
| < −1.611 | A1 (+`below_scale`) | A1 | equal |
| [−1.611, 0.611] | A2 | A1 for θ < −0.5 | **above the point estimate** for θ ∈ [−1.611, −0.5) |
| (0.611, 1.611] | B1 | A2 for θ < 0.5 | equal or under |
| > 1.611 | B2 | B1 for θ < 1.5 | equal or under |

The middle row is a real consequence and is recorded rather than hidden: **`SE_eff` is
0.567, so the 95 % interval is ±1.11 wide**, and a genuinely-low-A1 learner whose θ is
inside [−1.611, −0.5) is routed to A2. This is the price of the expert-anchored provisional
bank, not of the rule; it closes by itself when Stage-2 calibration shrinks `SE_eff`
(`ADR-017` §5: cleared by data, never by a flag). Reading **(b)** would remove this row and
also contradict §3.6 — it is preserved below as the alternative.

### What ADR-017 §3 does *not* leave open, and what this ADR must still fix

ADR-017 §3 already fixes: `start_node = start_node_table[start_cefr, track]` per
`curriculum-graph` §5.1; `below_scale` → `les_a1_alphabet_sounds`;
`remediation_nodes` derived from `bkt_priors_override` + profile, capped at 3; and §4's
substitution of the listening trigger. The remaining defects are in the code:

1. `START_NODE_TABLE` contradicts §5.1 on **two** rows — B1/IT (`les_b1_it_write_docs` vs
   §5.1's `les_b1_it_architecture_vocab`) and both B2 entries
   (`les_b2_professional_argument` / `les_b2_it_advanced_patterns` vs §5.1's
   `les_b2_register_nuance` / `les_b2_it_mentoring`). All six ids exist as lessons, so
   existence cannot decide it — §5.1 is the authority ADR-017 §3 names, and §5.1's B1/IT note
   records that its IT entry points were repointed on 2026-09-30 (§4.4.4.6) once their sources
   were restored, making the older ids the stale ones.
2. `remediationNodes` returns **all five** nodes unconditionally on `belowScale` and `[]`
   otherwise. §5.1 defines three *conditional* triggers, and ADR-017 §3 caps at 3.
3. `profile === 'it'` and `'dev'` are treated as identical, and §5.1's θ condition
   (`vocabulary θ > grammar θ`) is not evaluated at all.
4. Nothing asserts `start_node ∈ CurriculumGraph` or `|remediation_nodes| ≤ 3`, the latter
   being a `CHECK` on `diagnostic_results` (`cardinality(remediation_nodes) <= 3`).

## Decision

1. **`cefr` (the point estimate) uses `stats` §3.1's thresholds** —
   `CEFR_THRESHOLDS` in `src/domain/entities/pilot-bank.ts`: `< −0.5 → A1`, `< 0.5 → A2`,
   `< 1.5 → B1`, else `B2`. No `C1` (the ladder is A1–B2; `C1`/`C2` are not bands of this
   bank) and no invented `±2.0/±2.5` cutoffs. `curriculum-graph` §5.1's `−1.0` A1/A2
   boundary is **superseded**: §5.1's ladder is the algorithm ADR-017 §3 replaced, and
   `stats` §3.1 is the only artefact that defines the CEFR↔θ boundary as data.

2. **`start_cefr` is the interval rule of ADR-017 §3, read as (a) entry thresholds**, per the
   formula above, with the two totality clauses (above the top entry → `B2`; below the A2
   entry → `A1` + `below_scale`). `below_scale` is exactly `θ + 1.96·SE_eff < −0.5` —
   a predicate, not a stored flag.

3. **`start_node` uses `curriculum-graph` §5.1's table verbatim** — all eight entries,
   including the B1/IT row (`les_b1_it_architecture_vocab`) and the B2 rows
   (`les_b2_register_nuance`, `les_b2_it_mentoring`); track is `IT` iff the profile is
   IT/dev **and** `vocabulary θ > grammar θ`, else `General`.

4. **`remediation_nodes` follows §5.1's triggers, with ADR-017 §4's listening substitution,
   capped at 3**: `les_rem_pronunciation_th_vw` when pronunciation θ < −1.0;
   `les_rem_confidence_builder` when the profile is `false_beginner_suspected`. The
   listening node may **not** be emitted here: ADR-017 §2 forbids any remediation trigger
   from reading a listening θ, and §4 replaces `listening θ < −1.5` with a BKT-only
   trigger (`p_know < 0.85` on ≥3 listening observations) that cannot fire at placement,
   where there are zero listening observations. §5.1's `listening ∈ weak_skills` trigger is
   therefore dead at placement by construction, and §5.2's row that shows
   `les_rem_listening_slow_clear` as placement remediation is stale.

5. **The routing function is total and side-effect free**: same input → same output, no
   `Date`, no I/O, so P1.10 can persist exactly what P1.11 returned.

### Property tests (the acceptance)

- `start_cefr` is monotone **non-decreasing** in θ. (`domain-model.md` G-4's property list
  says "non-increasing"; that contradicts its own rule — the ladder above is non-decreasing —
  and is corrected there in this change.)
- `start_cefr` ≤ every band in `candidate` (it is the minimum), and no lower band is in
  `candidate`.
- `below_scale = true` ⟺ `θ + 1.96·SE_eff < −0.5`; it implies `start_cefr = 'A1'`.
- `start_node ∈ CurriculumGraph` for **every** θ on a sweep and both tracks.
- `|remediation_nodes| ≤ 3`, `remediation_nodes ⊆ lessons`, and no listening remediation
  node is emitted at placement.
- Boundary continuity: at `θ = −0.5 − t_h` the ladder moves A1 → A2; at `θ = 0.5 + t_h`,
  A2 → B1; at `θ = 1.5 − t_h`... let the implementation state its own boundaries from the
  formula rather than from a hand-copied table, and assert that `θ → start_cefr` changes
  only at the 4 boundaries derived in the table above.

## Consequences

### Positive

- One rule, stated once, testable, and traceable to the artefact that owns each part of it:
  the ladder is ADR-017 §3, the thresholds are `stats` §3.1, the node table and triggers are
  `curriculum-graph` §5.1.
- `seEffective` finally has an effect on the result, and `ci95Lower/Upper` stop being
  computed-then-discarded.
- The 4th ladder in the code (with `C1` and invented cutoffs) disappears.

### Negative

- The A1/A2 row above: with `SE_eff = 0.567`, learners with θ ∈ [−1.611, −0.5) route to A2.
  This is a property of the provisional bank's SE, not of the rule, and it is the single
  number to watch when Stage-2 calibration runs.
- `curriculum-graph` §5.1's pseudo-code and §5.2's example row are now *known* stale in two
  places (the ladder, and placement-time listening remediation). Amending them is a spec
  change under `SDD.md` §9 and is **not** done here; this ADR is the record until it is.
- The rule's output is deliberately below the point estimate for most θ (table above), so
  `start_cefr ≠ cefr` is normal, not a bug. Any surface that renders both must label them.

### Neutral

- `C1`/`C2` are unreachable, which is a property of the bank (12 items, A1–B2 descriptors)
  and not a limitation of the rule.
- `diagnostic-spec` §3.6's disclosure numbers (`se_statistical 0.31`, `se_effective 0.43`)
  do not match the pilot bank's (`0.481`, `0.567`). §3.6 is an *output-shape* example, not a
  claim about this bank; the bank's values are the ones P1.9 produces.

## Alternatives Considered

1. **Keep the point-estimate ladder (ladders 1/2/4).** Rejected: it is what the code does,
   it ignores `SE_eff`, and `BACKLOG.md` P1.11 plus `domain-model.md` G-4 name the interval
   rule as the acceptance. Its only support is §5.1's pseudo-code, which ADR-017 §3 exists
   to replace.
2. **Reading (b) — candidate = bands the interval *touches*.** More conservative
   (`start_cefr` never exceeds the point estimate), and it deletes the A1/A2 row above.
   Rejected because it contradicts `diagnostic-spec` §3.6's worked example, which is the
   only executable evidence in the specs; it is the fallback if the product decides strict
   under-placement outranks that example.
3. **Clamp `SE_eff` before routing (e.g. `min(SE_eff, 0.3)`) to keep the CI narrow.**
   Rejected: it fabricates precision the bank does not have, and ADR-017 §1 exists precisely
   to keep the declared error honest. `precision_label: provisional` is the truthful answer.
4. **Emit `remediation_nodes` from `bkt_priors_override` only (ADR-017 §3 literally).**
   Not rejected — deferred. `bkt_priors_override` is empty in P1.9 (`{}`), so a remediation
   trigger read from it can never fire; this ADR therefore sources the trigger from the
   skill θ the same run produced, which is what §5.1 does, and leaves the `bkt_priors_override`
   path to P1.12/ADR-021 when the map is actually populated.

## Implementation Plan

- [x] `computeStartNode` rewritten to the formula in Decision 2, taking the domain θs it needs
- [x] `START_NODE_TABLE` B1/IT and B2 rows corrected to §5.1
- [x] Track rule per Decision 3 (profile **and** `vocabulary θ > grammar θ`)
- [x] `remediationNodes` per Decision 4, `[]` when no trigger fires, never the listening node
- [x] Property tests above, in `tests/domain/services/diagnostic-placement.service.spec.ts`,
      including the `start_node ∈ CurriculumGraph` sweep against the real registry
- [x] `domain-model.md` G-4's "non-increasing" corrected to "non-decreasing" with a pointer here
- [x] `BACKLOG.md` P1.11 → DONE with the evidence; `MEMORY.md` updated

### What the implementation added to the plan

- The B1/IT row was also stale, not only B2: the table said `les_b1_it_write_docs`, §5.1 says
  `les_b1_it_architecture_vocab`. Both are real lessons. Corrected to §5.1, and test 9 now locks
  all eight rows instead of spot-checking, because existence can never decide a row.
- `PlacementInput`'s domain θs are **optional**, defaulting to `0`. That is deliberate: an absent
  domain then fails `vocabulary θ > grammar θ` and yields `General`, rather than inventing an IT
  route from missing evidence. `administerDiagnostic` always supplies them.
- The registry proof (test 6) parses `specs/curriculum-graph-spec.md` through the existing
  infrastructure parser/DAG validator rather than `curriculum-loader.ts`: the loader is
  fail-closed and refuses the registry while one lesson is still `blocked_*`, which is a P0
  content status, not a routing fact. Asserting against the **registry text** is what the ADR
  requires; a fixture copy would only prove the fixture.
- `diagnostic-spec.md` §3.6's worked example is **reproduced** by this implementation
  (`θ = −0.3`, `SE = 0.28` → `A2` → `les_a2_greetings_intro`), so reading (a) is confirmed by an
  executable artefact and not only by prose. No spec text needed amending for P1.11.
