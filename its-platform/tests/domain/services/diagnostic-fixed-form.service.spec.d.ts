/**
 * ADR-024 — the fixed-form executor's acceptance tests.
 *
 * Before this file `diagnostic-fixed-form.service.ts` had **no tests at all**, and the eleven
 * defects ADR-024's Context table names were all live. Each test below is one of the
 * decisions, numbered as the ADR numbers them, so a failure names its clause.
 *
 * Two things about the instrument are load-bearing for reading these tests and are recorded
 * here rather than discovered:
 *
 * 1. `computeThetaEstimate` is the instrument, and it is now `diagnostic-spec.md` §3.4's
 *    posterior mode under an `N(θ₀, 1)` prior (ADR-025): bounded (`|θ̂ − θ₀| ≤ 6`), signed
 *    (0/12 ⇒ θ̂ < 0), finite `se`, deterministic. Its acceptance is
 *    `tests/domain/services/theta-estimator.spec.ts`; every assertion below is about *shape and
 *    derivation* — the lattice, the intervals, the routing identity — and none is a claim that
 *    the estimator is a good estimator.
 * 2. `§3.3a`'s floor is 5 items per domain and this form has 4/3/3/2/0, so **no** domain is
 *    reportable. That is the ADR's intended outcome (its Consequences, "Negative" 1), not a
 *    bug: the honest report is "three bands and two gaps".
 */
export {};
//# sourceMappingURL=diagnostic-fixed-form.service.spec.d.ts.map