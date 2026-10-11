---
adr: 025
title: θ estimation for the fixed form — §3.4's posterior, the prior it needs, and the storage contract it must respect
status: Accepted
date: 2026-10-11
authors: [@system-design-architect]
deciders: [@system-design-architect, @backend-lead]
consulted: [@qa-sdet, @database-engineer]
informed: [@team]
tags: [diagnostic, irt, theta-estimation, eap, map, prior, p1.9, p1.10, adr-017, adr-024]
---

## Context

**P1.10** (*placement result persistence*) was implemented first and it surfaced a defect it does
not own: the run P1.9 produces cannot be stored for most learners. The cause is not the ledger, it
is `computeThetaEstimate` — the only estimator in the repository, and the only function on the
diagnostic path with no test at all.

`specs/diagnostic-spec.md` **§3.4** is the binding clause:

```
EAP (Expected A Posteriori):
θ_new = argmax_θ [ P(θ) * Π P(response_i | θ, a_i, b_i) ]

SE(θ) = 1 / √(Σ I_i(θ))

Implementation: Numerical quadrature (Gauss-Hermite, 31 points) or Metropolis-Hastings.
```

`src/domain/services/diagnostic-placement.service.ts` implements **none** of that. It is a
fixed-point iteration whose "gradient" is not the gradient of the likelihood:

```ts
for (const r of responses) if (r.correct) sumScore += r.a;        // Σ a·1[correct]
const p = 1 / (1 + Math.exp(-r.a * (theta - r.b)));
sumInfo += r.a * r.a * p * (1 - p);                               // Σ I_i(θ)   ✓ this part
const gradient = sumScore - sumInfo * (theta - initialTheta);     // ✗ the residual is
theta += lr * gradient;                                          //   Σ a(x_i − p_i(θ)), not
                                                                 //   sumScore − I·(θ−θ₀)
```

At `θ = θ₀` the second term is zero, so the first step is `0.1 × Σ a` over the correct items
(≈ 1.44). As θ moves past the items' `b`, `sumInfo` collapses and the update becomes the constant
drift `+0.1 × sumScore` — ≈ +1.44 per iteration, 20 times.

### Measured, on the real form (`createDiagnosticFormV1()`, node v24.21.0)

| response pattern | θ | se |
|---|---:|---:|
| 12/12 correct | 30.637635 | 1.000000 |
| 0/12 correct | 0.000000 | 0.473950 |
| 3/12 correct | 4.099537 | 3.864429 |
| 6/12 correct (alternating) | 14.378708 | 2946.900954 |
| 11/12 correct | 27.983200 | 15696101.251429 |

and, swept over **all 4096** response patterns a 12-item form admits:

| property | value |
|---|---|
| min / max θ | `0.000000` / `30.637635` |
| min / max se | `0.473950` / `18291838.458395` |
| patterns with θ or se outside `NUMERIC(6,3)` (`±999.999`) | **2509 / 4096 (61.3 %)** |
| patterns with θ ≥ 0 | **4096 / 4096** |
| patterns with se > 999.999 | 2509 |

Four consequences, in the order they matter:

1. **The estimator cannot return a negative θ.** `sumScore ≥ 0` and the only subtractive term
   vanishes at `θ = θ₀ = 0`, so every response pattern yields θ ≥ 0 — verified over all 4096. A
   learner who answers *nothing* correctly is placed at the population mean, `cefr = A2`, with
   `se = 0.474` — *narrower* than the interval of a learner who answers half correctly. `A1` and
   `below_scale` are unreachable **from the estimator**, not from the ladder. This is the
   over-placement direction ADR-017 §3 exists to remove ("under-placement, never over-placement"),
   pointing up.
2. **61.3 % of runs cannot be persisted.** `diagnostic_responses.se_after` is
   `NUMERIC(6,3)`; `se` reaches 1.83 × 10⁷. `NUMERIC(6,3)` holds at most `999.999`, so PostgreSQL
   rejects the row, and because the write is one transaction (P1.10) the whole run is lost. This is
   not an edge case: it is *every run with more than two correct answers*. The DC-1 class of
   learner the diagnostic exists for — the false beginner, `PRD.md` §3 — is exactly the one whose
   responses diverge.
3. **`se` is fabricated where information is lowest.** At `θ ≈ 30` the Fisher information
   underflows to `0`, and the guard `info > 0 ? 1/√info : 1.0` then returns `1.0` — a *narrow*
   interval reported for the least identifiable learner on the form. The 12/12 row above is that
   path, not a coincidence of values.
4. **A 3-item domain produces a 3.86 SE**, so `formatCefrSpan` reports an 8-band span from an
   artefact (the domain ladder is A1–B2).

None of this is a P1.9 defect *in the sense of a missing feature*: P1.9's acceptance is the fixed
form's shape (12 items, positional, pinned), and its tests were written to be estimator-independent
on purpose. It is a defect in the sense `CONSTITUTION.md` §4.8 means — an artefact whose numbers
are used by four consumers (`cefr`, the §3.3a band, `profile`'s Δθ signal, `start_cefr`) and which
no test constrains.

### What §3.4 requires and what it does not

The clause admits an evidential gap: it names **EAP** ("Expected A Posteriori" = the posterior
*mean*), writes the operator `argmax` (the posterior *mode*), and prescribes Gauss-Hermite
quadrature (the tool for integrating a mean). It also writes `P(θ)` without defining it. Three
readings, one of which must be executed:

| | estimated | needs |
|---|---|---|
| (a) mode with a prior, as written | `argmax_θ [log P(θ) + Σ log p_i]` | a prior |
| (b) posterior mean, per the name | `∫ θ P(θ) Π p_i dθ / ∫ …` | a prior + quadrature weights |
| (c) plain MLE | `argmax_θ Σ log p_i` | nothing, but for 12/12 the argmax is a boundary and for 0/12 it is `−` a boundary: the estimate is the grid, not the data |

## Decision

### 1. `computeThetaEstimate` implements §3.4's **formula**, not its name

```ts
logPosterior(θ) = −(θ − θ₀)² / (2σ²) + Σ_i log p_i(x_i | θ; a_i, b_i)
θ̂ = argmax over the fixed grid θ₀ + k·GRID_STEP, k ∈ [−600, +600]
   (ties resolved to the smallest θ: strict `>`, never `>=`)

GRID_STEP  = 0.01     // 1201 evaluations
σ          = 1        // P(θ) = N(θ₀, σ²)
HALF_RANGE = 6.0
```

with the 2PL log-likelihood **evaluated in its stable form** — `log1p(exp(−z))` for `z = a(θ−b)`,
`log1p(exp(+z))` for an incorrect response — so no branch overflows for any `(a, b, θ)` the model
can produce.

`argmax` is chosen over the name "EAP" for the same reason ADR-023 chose one reading of ADR-017
§3 over another: **the operator is the executable text**. A conclusion drawn from the abbreviation
would be a conclusion about the spec's prose. Reading (b) is retained as an alternative below and
is the *named* follow-up: `diagnostic-spec.md` §3.4 should be amended through `SDD.md` §9 to say
which functional it wants, at which point this clause moves with it.

### 2. The prior is `θ ~ N(θ₀, 1)`, and it is not a free parameter

No spec text defines `P(θ)`, so it is decided here:

- **`σ = 1`** — the logit scale's conventional identification, the same convention under which the
  items' `b ∈ [−1.9, +0.1]` and the CEFR thresholds `−0.5 / 0.5 / 1.5` are written.
  `stats-progress-evaluation-spec.md` §3.1's ladder is a statement about this scale.
- **`θ₀ = the caller's `initialTheta``**, default `0`. This gives the parameter the existing
  signature a meaning it did not have: the run's overall estimate (`θ₀ = 0`, the population) and
  the per-response estimate (`θ₀ =` the previous estimate, the running one) are two uses of one
  rule. `DiagnosticRun.responses[].thetaAfter` is thereby documented as a *sequential* estimate —
  the posterior mode given the first `t` responses with the `(t−1)`-th estimate as the prior's mean
  — not as twelve independent estimates.

The prior is what makes the estimate finite: for **any** all-correct response set the likelihood is
strictly increasing in θ, so its maximum is at `+∞`. A bounded estimator for a fixed form without a
prior does not exist; the previous implementation's `lr × Σa` drift is what it looks like when one
is not chosen.

### 3. `SE = 1 / √(Σ I_i(θ̂))`, as written, and never a fabricated fallback

§3.4's second line is followed literally: the 2PL Fisher information summed at the posterior mode,
no prior term. `Σ I = 0` (possible only for an empty response vector, which
`administerDiagnostic` refuses per ADR-024 D3) returns `se = Infinity` — the formula's own limit —
**not** a substituted finite number. The old `: 1.0` fallback is the branch that fabricated the
12/12 row above; an estimator may not invent precision at the one point where it has none.

### 4. The estimator is bounded, monotone, and deterministic

Properties the implementation must hold, each one a measured failure of the previous version:

| # | property | previous version |
|---|---|---|
| E1 | `\|θ̂ − θ₀\| ≤ 6` for every response pattern of the form | 30.64 |
| E2 | `θ̂ < 0` is attainable (e.g. 0/12 ⇒ below the A2 threshold) | 0/4096 patterns |
| E3 | `se` finite for every non-empty response set | 1.83 × 10⁷ |
| E4 | flipping one response `false → true` never decreases θ̂ | holds (0/24576 pairs) — kept |
| E5 | two calls with the same vector are identical; no clock, no RNG | held by luck |

E5 excludes `Metropolis-Hastings` (§3.4's second named option) for this function: ADR-024 D4 makes
the executor a pure function of its inputs, and a sampler makes the output a function of a seed
nobody passes.

### 5. The storage contract is a gate, not a downstream surprise

The regression that surfaced this — 61.3 % of runs unstorable — is closed by a test, not by
prose: the sweep of the form's patterns asserts `|θ̂| ≤ 6` and `se < 6` (both far inside
`NUMERIC(6,3)`), so the ledger's capacity is stated as the estimator's property. P1.10's
integration test now includes the class of run it could not write before (**all 12 correct**,
and all 12 incorrect), rather than documenting their absence.

### 6. What this changes downstream

Nothing in ADR-023, ADR-024 or ADR-019 changes: this ADR replaces the *number* the three of them
consume. But four consequences are named because they are observable:

- **`start_cefr = 'B2'` becomes unreachable on `diagnostic_form_v1`.** All-correct ⇒ θ̂ = 1.46
  (Decision 1's grid, exactly: 1.460000; a 0.001-grid probe gives 1.461, and the conclusion is
  unchanged at either step), and the bank's `SE_eff = 0.567` puts the interval at `[0.35, 2.57]` ⇒ candidate `{B1}` ⇒
  `les_b1_…`. Reaching B2 requires `θ̂ − 1.96·0.567 > 1.5`, i.e. θ̂ > 2.61, and the form's hardest
  item has `b = 0.1` — 12 items at `b ≤ 0.1` do not evidence B2, whatever the learner does.
  ADR-023's totality clause for `B2` remains correct *as a clause* (the routing function stays
  total); its reachability claim was written against the old divergence.
  The B2 route is restored by content, not by code: an item with `b ≥ 0.5` must exist in the form
  (`P1.8` extension, `@content-owner`).
- **`cefr = B1` is the top of the ladder the run can reach** for the same reason.
- **The false-beginner Δθ signal (§4.1) becomes evaluable.** `grammar θ − vocabulary θ > 1.0`
  wants a real contrast between two non-empty domain estimates; the old estimator's per-domain
  3-item values (se ≈ 3.9) were that contrast's artefact.
- **Every learner's diagnostic output changes.** `thetaOverall`, `cefr`, the three domain bands,
  `profile` and `start_node` are all still produced, from a bounded estimate instead of a divergent
  one. There is no backwards-compatibility question: no run has ever been persisted except in
  tests (`diagnostic_results` is empty in every environment).

## Consequences

### Positive

- 4096/4096 response patterns of the real form produce a θ and an SE that the ADR-019 DDL can
  store; the 2509 that could not now can.
- θ is negative where the evidence is negative, so the placement of the weakest learners is a
  measurement rather than the population mean.
- One estimator, one rule, with `argmax` and `SE` traceable to §3.4 line by line.
- `se_after` is finite on every response of every run, so the column's semantics hold.

### Negative

- **The prior is a judgement call.** `σ = 1` shrinks extreme evidence toward 0 in both directions:
  it under-states strong learners (which ADR-017 §3's doctrine prefers) and over-states the weakest
  (which it does not). Being explicit is the whole difference from the previous version: this bias
  is *stated, uniform and bounded*; a diverging estimator's bias was none of those.
- **Reading (b) is not implemented.** A posterior *mean* would report a marginally different
  number; the discrepancy is left in §3.4's text rather than resolved here.
- `se` is the likelihood-only SE at the posterior mode, so it is the same quantity §3.4 names but
  not the posterior's standard deviation. An EAP/second-order summary would report both.
- The all-correct learner is placed at B1 (see §6), a conservative outcome driven by the form's
  difficulty ceiling. ADR-017 §2 accepted a 12-item bank with no high-`b` items; that acceptance
  now has a visible cost instead of being hidden by a divergence.

### Neutral

- `computeThetaEstimate`'s signature does not change (`responses`, `initialTheta = 0`). The three
  existing callers — per-response, overall, and per-domain — are unaffected in shape and all
  affected in value, which is the entire point.
- The grid is 1201 points over `[θ₀ − 6, θ₀ + 6]`; the objective is strictly concave (a 2PL
  log-likelihood is concave in θ and the prior is Gaussian), so the grid's argmax is the unique
  maximiser to within `GRID_STEP/2 = 0.005` — three orders of magnitude below `SE_eff`.
- Nothing here is CAT: ADR-017 §2 keeps the form fixed and this ADR does not select items, only
  scores them.

## Alternatives Considered

1. **Leave the estimator and clamp the output** (bounds inside `computeThetaEstimate`, or a
   `CHECK`-satisfying `min(se, 999.999)`). Rejected — clamping makes the failure *invisible*
   instead of removing it: 0/12 stays at A2, and the θ reported for a strong learner stays a
   function of a divergence. It also violates the invariant-floor rule (ADR-018 §1): the stored
   rule ("θ ∈ [−6, 6]") would be weaker than the model's own.
2. **Reading (b): posterior mean via Gauss-Hermite 31 points**, the §3.4 implementation note
   taken literally. Not rejected on the merits — it is the more standard "EAP", and with a
   unimodal posterior it lands near this one. Rejected *as the first move* because it requires
   choosing weights and returning a functional the spec's operator line contradicts, and because
   the mode's grid scan is the one that can be verified by hand. Named as the follow-up amendment.
3. **Plain MLE with a bounded grid** (uniform prior). Rejected — for 12/12 the likelihood is
   monotone in θ, so the answer is the grid's edge, i.e. a constant that says nothing about the
   learner; and dropping `P(θ)` deletes the first factor of §3.4's own expression.
4. **Metropolis-Hastings** (the spec's second named method). Rejected — ADR-024 D4: the run must be
   a pure function of its inputs.
5. **Keep the old algorithm, only bound the search.** Rejected — the algorithm is a fixed point of
   an expression that is not the likelihood's gradient; it is not an approximation of §3.4, at any
   step size. No parameter makes it correct.
6. **Defer to Stage-2 calibration.** Rejected — P1.10 cannot persist a run in the meantime, and the
   routing of the weakest learners is inverted *today*. The fix is ~30 lines in a pure function.

## Implementation Plan

- [x] `computeThetaEstimate` implements the log-posterior, the prior and the grid of Decision 1–2
- [x] `se` is `1/√ΣI` at `θ̂`, `Infinity` for an empty vector, and the `: 1.0` fabrication is gone
      (Decision 3)
- [x] `tests/domain/services/theta-estimator.spec.ts` — E1–E5, the four patterns above, and the
      storage-capacity sweep (2509 → 0)
- [x] `tests/domain/services/diagnostic-fixed-form.service.spec.ts` — its header's disclosure
      ("P1.9 does not change it … `θ = 0` for all-wrong, diverges for all-correct, never θ < 0")
      is replaced by the new contract, and test 11's estimator anchor becomes an assertion about
      the ladder (a sweep over the form's patterns) instead of about a magnitude
- [x] `tests/integration/diagnostic-persistence.spec.ts` — the all-correct and all-wrong runs,
      previously unstorable, are cases
- [x] `BACKLOG.md` P1.9/P1.10 and `MEMORY.md` record the change
- [ ] `@content-owner`: an item with `b ≥ 0.5` in `diagnostic_form_v1`, or B2 stays unreachable
      (Decision 6)
- [x] amend `diagnostic-spec.md` §3.4 through `SDD.md` §9 to fix the EAP/mode ambiguity and to
      state the prior (Decision 1)

**Measured at closure (2026-10-11), by re-running the sweep against `dist/`:** 12/12 → θ = 1.46,
se = 0.764693; 0/12 → θ = −2.07, se = 0.720076; 3/12 → θ = −1.08, se = 0.526817; 6/12 (alternating)
→ θ = −0.31, se = 0.470035; 11/12 → θ = 1.01, se = 0.618731. Over all 4096 patterns:
θ ∈ [−2.07, 1.46], se ∈ [0.469497, 0.764693], **0 patterns outside `NUMERIC(6,3)`** and 3302 with
θ < 0. `cefr = B2` is unreachable (Decision 6's own prediction), so `P1.8`'s `@content-owner`
follow-up above is the only open item.

## References

- `specs/diagnostic-spec.md` §3.4 (the θ update clause), §3.3a (the storage of θ per domain), §3.6
- `specs/stats-progress-evaluation-spec.md` §3.1 (the CEFR↔θ thresholds)
- [ADR-017](017-mvp-adaptive-scope.md) §1 (`SE_eff = 0.567`), §2 (fixed form, no CAT), §3 (ordinal routing)
- [ADR-023](023-diagnostic-routing-semantics.md) Decisions 1–2 (the routing rule this number feeds)
- [ADR-024](024-fixed-form-executor-contract.md) D3 (completeness), D4 (purity), D6 (two intervals)
- [ADR-019](019-p0.4-schema-migration.md) — `diagnostic_results.theta`, `.se_*`, `diagnostic_responses.se_after` as `NUMERIC(6,3)`
- `src/domain/services/diagnostic-placement.service.ts`, `src/domain/services/diagnostic-fixed-form.service.ts`
