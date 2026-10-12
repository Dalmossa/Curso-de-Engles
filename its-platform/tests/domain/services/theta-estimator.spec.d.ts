/**
 * ADR-025 — θ estimation for the fixed form (`diagnostic-spec.md` §3.4).
 *
 * `computeThetaEstimate` was the only function on the diagnostic path with no test at all, and
 * it implemented none of §3.4. Measured on the real form before this file existed, over all 4096
 * response patterns: θ ∈ [0, 30.637635] (negative θ unreachable), se ∈ [0.473950, 1.8 × 10⁷],
 * and **2509 / 4096 patterns outside `NUMERIC(6,3)`** — i.e. most runs could not be persisted
 * (P1.10). Each test below is one of ADR-025's stated properties:
 *
 * | test | ADR-025 |
 * |---|---|
 * | extremes: finite, ordered, bounded, `0 < se < 6` | E1, E2, E3 |
 * | empty vector → `{θ: θ₀, se: Infinity}` | Decision 3 |
 * | `initialTheta` is the prior mean | Decision 2 |
 * | two calls deep-equal | E5 |
 * | the 4096-pattern sweep inside `±999.999` | Decision 5 (the storage gate) |
 * | a single `false → true` flip never lowers θ̂ | E4 |
 *
 * Cost is stated where it matters: one 12-item evaluation scans 1201 grid points, so the full
 * sweep is ~20 s and is run in full (a stride would stop proving the storage claim, which is the
 * point); the flip property is sampled with a documented stride and the reason given. Everything
 * here is deterministic and depends on no clock and no RNG.
 */
export {};
//# sourceMappingURL=theta-estimator.spec.d.ts.map