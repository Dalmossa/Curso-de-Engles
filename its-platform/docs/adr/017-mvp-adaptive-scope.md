---
adr: 017
title: MVP adaptive scope — Stage-1 IRT only, fixed-form diagnostic, ordinal routing
status: Accepted
date: 2026-10-05
authors: [@system-design-architect]
deciders: [@system-design-architect]
consulted: [@backend-lead, @qa-sdet]
informed: [@team]
tags: [irt, bkt, diagnostic, cat, calibration, placement, scope]
---

## Context

`PRD.md` §8 RF-002 rates the 10-item Stage-1 pilot bank **High** and places it on the critical
path: *"everything statistical depends on M2, and M2 depends on M1."* `BACKLOG.md` P1.9 says the
opposite about the CAT: *"Fixed-blueprint diagnostic executor (**no CAT**) … never selects by θ —
no calibrated item model exists yet."* Both documents are `Accepted`-grade artefacts and they
disagree. `PRD.md` §7.2 then names the disagreement's symptom: every placement is labelled
`placement_provisional` because no IRT parameter exists.

Three independent chains in the specs each independently forbid a CAT in the MVP. This ADR
records all three, because any one of them is sufficient and the reader should not have to
re-derive them.

### Chain 1 — the CAT pool is empty by provenance rule

`assessment-item-spec.md` §2.4:

> `provenance.kind == authored` → **excluded from the diagnostic CAT until `reviewed_by` is set**
> (gate G-Q7).

The corpus is `authored`. `PRD.md` §8 RF-008 records 6 `source_derived` items and 849 `authored`
ones. `external-sources.md` §0.5.1 records **zero** items with a named reviewer. **The
CAT-eligible pool is therefore 0 items today**, and becomes non-zero only when every candidate
item carries a `reviewed_by` — 120 items per `assessment` §8.1's MVP pool, each reviewed.

### Chain 2 — repetition inside a test is information-free

`stats-progress-evaluation-spec.md` §6.2b: `elapsed_days = (now − last_review).days` — **integer
truncation**. A repeat in the same sitting gives `elapsed_days = 0`, therefore `R = 1.000`. The
spec's own conclusion is binding: *"L2 spaced review operates at day granularity only. Minimum
interval 1 day."*

So a CAT over a 10-item Stage-1 bank administering 18–28 items **must repeat items**, and a
repeat contributes nothing to the FSRS estimate while corrupting the BKT estimate (an item
answered correctly twice in one session inflates `p_learn` as though it were independent
evidence).

### Chain 3 — the blueprint and the bank cannot both be satisfied

`diagnostic-spec.md` §2.1 blueprint minimum: Grammar 6 · Vocabulary 5 · Reading 4 · Pronunciation
3 = **18 items minimum**, 28 maximum, with a hard 15-minute wall clock. `BACKLOG.md` P1.8 scopes
Stage-1 at **10 items**. Ten items cannot fill an eighteen-item form without repetition.

### What Stage-1 actually produces, and what it costs

`assessment-item-spec.md` §3.3 makes the precision budget explicit:

```
SE_effective(θ) = √( SE_statistical² + SE_parameter² )
SE_parameter: expert_anchored ≈ 0.30 · partially_calibrated (n≥50) ≈ 0.12 · empirically_calibrated (n≥200) ≈ 0.06
SE_statistical = 1/√(n·a²/4)          n = 4/(a²·SE²)
authoring target a ≥ 1.2  →  n=23 for SE 0.35
```

| Items | SE_stat (a=1.2) | SE_eff (Stage-1) | CI₉₅ half-width on θ |
|---:|---:|---:|---:|
| 12 | 0.481 | 0.567 | ±1.11 |
| 18 | 0.393 | 0.494 | ±0.97 |
| 23 | 0.349 | 0.461 | ±0.90 |
| 28 | 0.315 | 0.436 | ±0.85 |

The CEFR→θ thresholds in `stats` §3.1 are A2 = −0.5, B1 = 0.5, B2 = 1.5 — band gaps of **1.0**.
**Every row above has a CI₉₅ wider than one band gap.** A Stage-1 placement cannot name a CEFR
level to one band, at any test length the blueprint permits. This is not a tuning problem; it
is what `SE_parameter ≈ 0.30` means.

### But routing does not need interval precision

`curriculum-graph-spec.md` §5.1 does not ask for a level. It returns
`(start_node_id, remediation_nodes[])` from a `(CEFR, Track)` table. That decision needs the
**ordering** of ability to be right, not the interval to be narrow — and ordering is exactly what
three-rater expert anchoring supplies. `assessment` §5.1 gate Q5 already requires it:
*"3 raters agree on `b` within 0.75 logit."*

## Decision

### 1. IRT is in the MVP at Stage-1 only. `a` and `b` are estimated, not assumed

Stage-1 produces `(a, b)` with a declared measurement error, which `assessment` §3.3 already
specifies: `Var_b = (1.75/n_raters)²` and `Var_a = (0.35)²`. This is a real estimate with a
known SE, not a placeholder — which is why `a ≡ 1.0` is rejected as an option below.

`BACKLOG.md` P3.1 *"IRT 2PL calibration — zero a/b values exist"* is **re-scoped and renamed**:
its blocker is no longer "no parameters exist" (P1.8 creates them) but "no Stage-2 evidence"
(`n ≥ 50` per `assessment` §3.2). P3.1 becomes **Stage-2 calibration**, and `PRD.md` RF-002
stays **High**. The two documents are reconciled in favour of the PRD's dependency claim.

### 2. The MVP diagnostic is a fixed form. No CAT, no MFI

- **12 items**, fixed form, selected by the blueprint's *position*, not by maximum information:
  Grammar 4 · Vocabulary 3 · Reading 3 · Pronunciation 2.
- **Listening: 0 items**, as `diagnostic` §2.1.1(3) already requires — no listening item carries
  IRT parameters and none can until audio renders (`PRD.md` §9 M3). Listening θ is not produced,
  reported, or displayed, and no remediation trigger may read it (see §4 below).
- **`authored` provenance is permitted.** Gate G-Q7 is written for the CAT; a fixed form is not a
  CAT. This is the resolution, not a loophole: the gate was authored against MFI selection, and
  the rule it encodes — *unreviewed difficulty estimates must not drive item selection* — is
  satisfied because a fixed form does not use the estimates to select.
- **The form is versioned and pinned** (`diagnostic_form_v1`), stored on the run, so a later
  Stage-2 form is comparable to it rather than silently replacing it.

### 3. Routing is ordinal and conservative

`diagnostic-form_v1` yields θ ± SE₉₅ on the **Stage-1** basis. Two rules, both stated as
formulas so they can be property-tested:

```
band_bounds   = [θ - 1.96·SE_eff , θ + 1.96·SE_eff]
candidate     = every CEFR band whose threshold lies inside band_bounds
start_cefr    = the LOWEST band in candidate        # never the highest
start_node    = start_node_table[start_cefr, track] # curriculum-graph §5.1
```

**Under-placement, never over-placement.** This is the same direction as `stats` §2.1's
`P(L₀) = 0.15` — *"false beginner bias"* — and it is the safe failure for a learner who is
over-placed: content below ability produces boredom and a false mastery signal, which then
poisons the BKT state the whole model rests on.

If `candidate` is empty (band below A1), the start node is `les_a1_alphabet_sounds` and the run
is flagged `below_scale`. This case has no spec and is added here.

`remediation_nodes[]` (the second half of `curriculum-graph` §5.1's return value, which
`diagnostic_results` has no column for) is derived from `bkt_priors_override` + the profile,
capped at 3 nodes per `curriculum-graph` §6.4.

### 4. The listening-θ trigger is replaced, not left to fail

`curriculum-graph` §4.3 gates `les_rem_listening_slow_clear` on `listening θ < −1.5`, and §10
requires a Listening remediation node for skill balance. `diagnostic` §2.1.1(3) makes a listening
θ permanently unproducible. **A predicate that can never be true is not a predicate.**

Substituted: `listening BKT p_know < 0.85` on ≥3 listening observations, which is BKT-only and
is what `PRD.md` §6.6 decision 4 already mandates (*"Listening is BKT-only in the MVP"*). The
substitution is recorded because it **weakens** the trigger — BKT is a weaker instrument than a
calibrated θ — and `CONSTITUTION.md` §9 step 3 requires that be visible.

### 5. The placement label follows the evidence, not a schedule

`diagnostic` §2.1.1(4) makes the re-diagnostic *"a scheduled event, not a user action"* run once
audio renders. The MVP has **no re-diagnostic** — it has no audio. Therefore:

`placement_provisional` is a **permanent property of every MVP placement**, computed as
`calibration_status != empirically_calibrated` rather than stored as a boolean. It is cleared by
data, never by a date and never by a flag flip. When Stage-2 reaches `n ≥ 200` per item, the
next run produces a quotable band with no code change.

## Consequences

### Positive

- The critical path becomes coherent and short: P1.8 (12-item bank) → P1.9 (fixed form) →
  P1.10 (placement). No 120-item bank and no reviewer programme stands between the learner and
  a placement.
- `p_random`, `(a, b)` and the 12-item bank are the only calibration artefacts the MVP needs, and
  all three are prerequisites of something the MVP actually does.
- A stage-1 placement is honest about its own precision. A CI₉₅ half-width of ±1.11 on θ is
  displayed as a band spanning the bands it spans — which is the same disclosure discipline
  `diagnostic` §3.3a already imposes per domain.

### Negative

- **The MVP makes a weaker claim than `PRD.md` §9 M4's exit condition** ("second diagnostic run
  produces a quotable CEFR band; `placement_provisional` is gone"). M4 cannot exit without
  rendered audio and `n ≥ 200` per item. M4's exit condition is amended by `SDD.md` §9 to
  *"routing is deterministic, conservative, and its precision is displayed"* — which is
  achievable and is what the MVP can honestly deliver.
- A fixed form wastes item difficulty. Two learners with the same ability take the same 12
  items. Accepted: with a 12-item bank, MFI would have 2 usable options per slot.
- The provenance relaxation for the fixed form must be visible in the UI. A learner placed by an
  unreviewed form is placed by a weaker instrument, and `diagnostic-form_v1`'s
  `calibration_status` is displayed with the band.

### Neutral

- `a ≥ 1.2` remains the authoring target, and 12 items at a = 1.2 gives SE_stat = 0.481. Whether
  Stage-1 raters can actually hit `a ≥ 1.2` is `PRD.md` §10's falsifier, and this ADR does not
  assume it succeeds — it assumes the value is *reported with its SE* whatever it turns out to be.

### What weakens (CONSTITUTION.md §9 step 3)

| Weakened | Before | After | Why accepted |
|---|---|---|---|
| Placement precision | `diagnostic` §3.5 CAT, min 18 / max 28 items, SE_stat < 0.35 | fixed form, 12 items, SE_stat ≈ 0.48 | Three independent spec rules already forbid the CAT (chains 1–3). The specs did not permit the alternative that was assumed to exist |
| Remediation trigger for listening | `listening θ < −1.5` (`curriculum-graph` §4.3) | `listening BKT p_know < 0.85` on ≥3 obs | A predicate over an unproducible quantity cannot be implemented or tested. BKT is the weaker instrument and is named as such |
| PRD M4 exit | "`placement_provisional` is gone from the results screen" | "routing is deterministic, conservative, and its precision is displayed" | Clearing the label requires rendered audio **and** `n ≥ 200` per item. Both are post-MVP. Scheduling a label flip instead of the evidence is the defect `PRD.md` §10 exists to catch |
| Item selection | MFI over a calibrated pool | fixed by blueprint position | `assessment` §2.4 G-Q7 empties the CAT pool; `stats` §6.2b makes repeats information-free; 10 items cannot fill 18 slots |

## Alternatives Considered

1. **CAT in the MVP, with 120 reviewed items.** Rejected — 120 items × a named reviewer each is
   a content programme with no committed reviewer. `PRD.md` §7 blocker 3 already records that the
   one independent ELT review in the project **has not happened**, and the reviewer of that
   review authored the material.
2. **`a ≡ 1.0` assumed, `b` from Stage-1.** Rejected — `assessment` §3.3's `Var_a = (0.35)²`
   presupposes an estimate of `a`. Assuming it discards a specified measurement and makes
   `SE_parameter` uncomputable from first principles.
3. **Route on the interval midpoint and let the learner discover the miss.** Rejected — an
   over-placed learner's BKT state is the input to every subsequent decision, and it is corrupted
   by content that is too easy in a way that is hard to detect. `stats` §2.1's `P(L₀) = 0.15`
   exists precisely because the population is over-confident about its own level.
4. **Report a point CEFR band with the CI in a tooltip.** Rejected — `diagnostic` §3.3a already
   established band-only reporting for 3–4 items per domain. A UI affordance does not make a
   point estimate honest.
5. **Keep the CAT in the spec and defer the diagnostic entirely.** Rejected — the diagnostic is
   the product's entry point; `PRD.md` §3's false-beginner persona *"is the target placement
   case"*. Deferring it defers the only feature that addresses the named primary persona.
6. **Raise `SE_parameter`'s ceiling by weighting raters.** Rejected — that is Stage-2 work, and
   its precondition is responses this MVP has not yet generated.

## Implementation Plan

- [ ] Re-scope `BACKLOG.md` P1.8 to 12 items; rename P3.1 → *"Stage-2 calibration"*, blocker
      `n ≥ 50` per item
- [ ] Author `diagnostic-form_v1`: 12 slots, blueprint positions, `provenance.kind` accepted set,
      `calibration_status` recorded on the run
- [ ] Implement `band_bounds` / `candidate` / `start_cefr` / `start_node` as a pure domain
      function with property tests: `start_cefr` is monotone non-increasing in θ; `start_cefr ≤`
      every band in `candidate`; `start_node ∈ CurriculumGraph`
- [ ] Add `remediation_nodes[]` (≤3) and `below_scale` to the placement result and the ERD
- [ ] Amend `curriculum-graph` §4.3's listening trigger per §4 above, via `SDD.md` §9
- [ ] Amend `diagnostic` §3.5: record 12-item fixed form as the MVP form, CAT retained for Stage-2
- [ ] Amend `PRD.md` §9 M4's exit condition
- [ ] `placement_provisional` becomes derived from `calibration_status`, not a stored boolean
- [ ] `BACKLOG.md` P3.3 gains the gate *"CAT requires `reviewed_by` coverage on the 120-item pool"*

## References

- `PRD.md` §6.6, §7, §8 RF-002/RF-008, §9 M4, §10
- `specs/diagnostic-spec.md` §2.1, §2.1.1, §3.3, §3.3a, §3.5, §3.6, §4.1
- `specs/assessment-item-spec.md` §2.4, §3.2, §3.3, §5.1, §8.1, §9
- `specs/stats-progress-evaluation-spec.md` §2.1, §3.1, §4.2, §4.4, §4.5, §6.2b
- `specs/curriculum-graph-spec.md` §4.3, §5.1, §6.4, §10
- `specs/listening-corpus-spec.md` §4 (3–5 item dialogue) · `specs/post-lesson-practice-spec.md` §3.4
- `BACKLOG.md` P1.8, P1.9, P3.1, P3.3 · `SDD.md` §9 · `CONSTITUTION.md` §4.8, §9
- [ADR-015](015-domain-model-bounded-contexts.md)
