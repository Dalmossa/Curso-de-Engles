"use strict";
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
import { computeThetaEstimate } from '../../../src/domain/services/diagnostic-placement.service.js';
import { administerDiagnostic } from '../../../src/domain/services/diagnostic-fixed-form.service.js';
import { CEFR_THRESHOLDS } from '../../../src/domain/entities/pilot-bank.js';
import { createDiagnosticFormV1 } from '../../../src/domain/services/pilot-bank.service.js';
/** The real form, once. Every test measures this one. */
const FORM = createDiagnosticFormV1();
/** `NUMERIC(6,3)` holds `±999.999` — ADR-019's column type for `theta`, `theta_after`, `se_*`. */
const NUMERIC_6_3_LIMIT = 999.999;
/** ADR-025 Decision 1: the grid is `θ₀ + k·0.01`, k ∈ [−600, +600], so |θ̂ − θ₀| ≤ 6. */
const GRID_HALF_RANGE = 6.0;
/**
 * The form's items as scoring vectors for a response pattern. `bit i` set means item `i` (in
 * form order) was answered correctly, so the 4096 patterns are enumerated by `0 … 4095`.
 */
function pattern(bits) {
    return FORM.items.map((item, index) => ({
        correct: (bits & (1 << index)) !== 0,
        a: item.a,
        b: item.b,
    }));
}
/** The named patterns ADR-025's Context table measures, as form-ordered bit masks. */
const NAMED = {
    /** 12/12 — the likelihood is strictly increasing in θ, so only the prior bounds it. */
    allCorrect: 0xfff,
    /** 0/12 — the pattern that must produce a NEGATIVE θ (E2). */
    allWrong: 0x000,
    /** 3/12, the first three items. */
    threeCorrect: 0b000000000111,
    /** 6/12, items 1, 3, 5, … in form order. */
    alternating: 0x555,
    /** 11/12, everything but item 8 in form order. */
    allButOne: 0xfff & ~(1 << 7),
};
const estimate = (bits, initialTheta = 0.0) => computeThetaEstimate(pattern(bits), initialTheta);
describe('computeThetaEstimate — ADR-025 E1/E2/E3: the estimate is finite, signed and bounded', () => {
    it('1. 12/12 is finite and positive, 0/12 is finite and negative, and neither diverges', () => {
        const allCorrect = estimate(NAMED.allCorrect);
        const allWrong = estimate(NAMED.allWrong);
        const sixTwelve = estimate(NAMED.alternating);
        const eleven = estimate(NAMED.allButOne);
        // E3/E2: the old estimator's two defining failures. Every pattern was finite, but θ ≥ 0 in
        // all 4096 of them, so an all-wrong learner sat at the population mean (θ = 0 → A2) with a
        // *narrower* interval than a learner who answered half correctly.
        expect(Number.isFinite(allCorrect.theta)).toBe(true);
        expect(Number.isFinite(allWrong.theta)).toBe(true);
        expect(allCorrect.theta).toBeGreaterThan(0);
        expect(allWrong.theta).toBeLessThan(0);
        // The estimate is ordered by the evidence (ADR-025 Context table, "finite and ordered").
        expect(allWrong.theta).toBeLessThan(sixTwelve.theta);
        expect(sixTwelve.theta).toBeLessThan(allCorrect.theta);
        expect(sixTwelve.theta).toBeLessThan(eleven.theta);
        // E1: the prior makes the estimate bounded on the pattern where a prior-less estimator has
        // no maximum at all (a monotone likelihood ⇒ θ̂ = +∞). It does NOT delete the estimate:
        // 12/12 still sits above the B1 entry.
        for (const { theta, se } of [allCorrect, allWrong, sixTwelve, eleven]) {
            expect(Math.abs(theta)).toBeLessThanOrEqual(GRID_HALF_RANGE);
            // E3: se is finite and strictly positive for every non-empty response set — never the
            // fabricated `1.0` the `info > 0 ? … : 1.0` fallback returned where information underflowed.
            expect(Number.isFinite(se)).toBe(true);
            expect(se).toBeGreaterThan(0);
            expect(se).toBeLessThan(GRID_HALF_RANGE);
        }
        // The extremes are on opposite sides of the A2 entry, so the fix reaches the placement:
        // 0/12 is a measurement below the scale, not the population mean.
        expect(allWrong.theta).toBeLessThan(CEFR_THRESHOLDS.A2.min);
        expect(allCorrect.theta).toBeGreaterThan(CEFR_THRESHOLDS.B1.min);
        // ADR-025 §6: the form's hardest item has b = 0.1, so 12 items cannot evidence B2 — the
        // all-correct learner lands at B1. A content change adding a b ≥ 0.5 item must move this.
        expect(allCorrect.theta).toBeLessThan(CEFR_THRESHOLDS.B2.min);
    });
    it('2. an empty response vector returns the prior mean and se = Infinity — no fabricated se', () => {
        // ADR-025 Decision 3: ΣI = 0 is §3.4's own limit. The previous `: 1.0` branch reported a
        // narrow interval for the one input that carries no information at all.
        expect(computeThetaEstimate([])).toEqual({ theta: 0, se: Infinity });
        // `initialTheta` is the prior mean, so the empty posterior mode is exactly it.
        expect(computeThetaEstimate([], 2.5)).toEqual({ theta: 2.5, se: Infinity });
        expect(computeThetaEstimate([], -3.25).theta).toBe(-3.25);
    });
});
describe('computeThetaEstimate — ADR-025 Decision 2: initialTheta is the prior mean', () => {
    it('3. shifting θ₀ shifts θ̂ in the same direction and moves the grid with it', () => {
        const vectors = pattern(NAMED.alternating);
        const atZero = computeThetaEstimate(vectors, 0);
        const shifted = computeThetaEstimate(vectors, 1);
        // The prior is the first factor of §3.4's expression: moving its mean right moves the mode
        // right. (`initialTheta` used to be a Newton anchor the update drifted away from.)
        expect(shifted.theta).toBeGreaterThan(atZero.theta);
        // E1 is relative to θ₀, not to zero — the grid is `θ₀ + k·0.01`.
        const far = computeThetaEstimate(pattern(NAMED.allCorrect), 4);
        expect(far.theta).toBeGreaterThanOrEqual(4 - GRID_HALF_RANGE);
        expect(far.theta).toBeLessThanOrEqual(4 + GRID_HALF_RANGE);
        // The grid resolution is the contract: θ̂ is always θ₀ + k·0.01 for an integer k, which is
        // what makes the tie-break (strict `>`, smallest θ) exactly reproducible.
        for (const result of [atZero, shifted, far]) {
            expect(Math.abs(result.theta * 100 - Math.round(result.theta * 100))).toBeLessThan(1e-6);
        }
    });
});
describe('computeThetaEstimate — ADR-025 E5: the estimator is pure and deterministic', () => {
    it('4. two calls with the same argument deep-equal (no clock, no RNG, no sampler)', () => {
        const vectors = pattern(NAMED.alternating);
        const first = computeThetaEstimate(vectors, 0);
        const second = computeThetaEstimate(vectors, 0);
        // Deep equality, not closeness: Metropolis-Hastings (the spec's second named method) is
        // excluded precisely because a sampler would make this fail.
        expect(first).toEqual(second);
        // A different pattern must differ, or the assertion above is vacuous.
        expect(computeThetaEstimate(pattern(NAMED.allWrong), 0)).not.toEqual(first);
        // And the caller's array is not mutated.
        const before = JSON.stringify(vectors);
        computeThetaEstimate(vectors, 0);
        expect(JSON.stringify(vectors)).toBe(before);
    });
});
describe("computeThetaEstimate — ADR-025 Decision 5: the storage contract is a gate", () => {
    it("5. every one of the form's 4096 response patterns fits NUMERIC(6,3) and the ADR bound", () => {
        // FULL sweep, no stride: the claim is universal ("4096/4096"), and a stride would leave it
        // unproven. 4096 × 1201 grid points × 12 items ≈ 20 s.
        const overflow = [];
        const outsideGrid = [];
        const deadSe = [];
        let minTheta = Infinity;
        let maxTheta = -Infinity;
        let minSe = Infinity;
        let maxSe = -Infinity;
        for (let bits = 0; bits < 4096; bits++) {
            const { theta, se } = estimate(bits);
            if (!Number.isFinite(se) || se <= 0)
                deadSe.push(bits);
            if (se > NUMERIC_6_3_LIMIT || Math.abs(theta) > NUMERIC_6_3_LIMIT)
                overflow.push(bits);
            if (Math.abs(theta) > GRID_HALF_RANGE || se >= GRID_HALF_RANGE)
                outsideGrid.push(bits);
            minTheta = Math.min(minTheta, theta);
            maxTheta = Math.max(maxTheta, theta);
            minSe = Math.min(minSe, se);
            maxSe = Math.max(maxSe, se);
        }
        // 2509 of these violated the column before; the assertion is that none does now.
        expect(overflow).toEqual([]);
        // The tighter, model-level bound ADR-025 Decision 5 states (both far inside NUMERIC(6,3)).
        expect(outsideGrid).toEqual([]);
        expect(deadSe).toEqual([]);
        expect(minTheta).toBeGreaterThanOrEqual(-GRID_HALF_RANGE);
        expect(maxTheta).toBeLessThanOrEqual(GRID_HALF_RANGE);
        expect(minSe).toBeGreaterThan(0);
        expect(maxSe).toBeLessThan(GRID_HALF_RANGE);
    }, 180_000);
    it('6. every persisted theta_after/se_after of the runs the ledger can receive fits the column', () => {
        // The columns that actually killed the write are the per-response ones: `theta_after` and
        // `se_after` are the *prefix* estimates, each with its own prior mean, so they are not the
        // overall sweep above. 128 of the 4096 runs is a documented stride — a full run costs ~17
        // estimator calls (~43 ms), so 4096 runs would be ~3 minutes of CI for a bound that is
        // already 160× clear of the column.
        const STRIDE = 32;
        const overflow = [];
        const deadSe = [];
        let maxAbsThetaAfter = 0;
        let maxSeAfter = 0;
        let runs = 0;
        for (let bits = 0; bits < 4096; bits += STRIDE) {
            const run = administerDiagnostic({
                learnerId: 'learner-1',
                sessionId: 'session-1',
                role: 'general',
                startedAt: new Date('2026-10-11T10:00:00.000Z'),
                completedAt: new Date('2026-10-11T10:12:00.000Z'),
                responses: FORM.items.map((item, index) => ({
                    itemId: item.id,
                    correct: (bits & (1 << index)) !== 0,
                    responseTimeMs: 1000 + index,
                })),
            });
            runs++;
            for (const response of run.responses) {
                maxAbsThetaAfter = Math.max(maxAbsThetaAfter, Math.abs(response.thetaAfter));
                maxSeAfter = Math.max(maxSeAfter, response.seAfter);
                if (!Number.isFinite(response.seAfter) || response.seAfter <= 0) {
                    deadSe.push(`${bits}:${response.itemId}`);
                }
                if (Math.abs(response.thetaAfter) > NUMERIC_6_3_LIMIT ||
                    response.seAfter > NUMERIC_6_3_LIMIT) {
                    overflow.push(`${bits}:${response.itemId}`);
                }
            }
            if (Math.abs(run.thetaOverall) > NUMERIC_6_3_LIMIT || run.seOverall > NUMERIC_6_3_LIMIT) {
                overflow.push(`${bits}:overall`);
            }
        }
        expect(runs).toBe(128);
        expect(deadSe).toEqual([]);
        expect(overflow).toEqual([]);
        expect(maxAbsThetaAfter).toBeLessThan(NUMERIC_6_3_LIMIT);
        expect(maxSeAfter).toBeLessThan(NUMERIC_6_3_LIMIT);
    }, 120_000);
});
describe('computeThetaEstimate — ADR-025 E4: a correct answer never lowers θ̂', () => {
    it('7. flipping false → true on any sampled pair does not decrease θ̂', () => {
        // E4 is preserved from the old implementation (0/24576 violations), so it is a regression
        // net rather than a new property. Exhaustive over all 4096 base patterns × 12 flips is
        // 24576 pairs ≈ 2 calls each ≈ 2.5 minutes; the pairs are sampled with a stride (every 16th
        // base pattern, all 12 flips → 3072 pairs, 12.5 % of them) and the stride is deterministic,
        // not random. The property itself is exact: the flip changes the objective by
        // `+aᵢ(θ − bᵢ)`, which is increasing in θ, so the argmax cannot move left.
        const BASE_STRIDE = 16;
        const violations = [];
        let pairs = 0;
        for (let bits = 0; bits < 4096; bits += BASE_STRIDE) {
            const before = estimate(bits).theta;
            for (let index = 0; index < FORM.items.length; index++) {
                if ((bits & (1 << index)) !== 0)
                    continue; // only false → true
                const after = estimate(bits | (1 << index)).theta;
                pairs++;
                if (after < before)
                    violations.push({ from: bits, item: index, before, after });
            }
        }
        expect(pairs).toBeGreaterThan(0);
        expect(violations).toEqual([]);
    }, 180_000);
});
//# sourceMappingURL=theta-estimator.spec.js.map