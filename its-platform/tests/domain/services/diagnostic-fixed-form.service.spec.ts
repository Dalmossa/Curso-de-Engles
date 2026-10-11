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
 * 1. `computeThetaEstimate` (P1.9 does not change it) returns `θ = 0` for an all-wrong set and
 *    diverges for an all-correct one, and it can never return `θ < 0`. Every assertion below is
 *    therefore about *shape and derivation* — the lattice, the intervals, the routing identity —
 *    and none depends on the estimator being a good estimator.
 * 2. `§3.3a`'s floor is 5 items per domain and this form has 4/3/3/2/0, so **no** domain is
 *    reportable. That is the ADR's intended outcome (its Consequences, "Negative" 1), not a
 *    bug: the honest report is "three bands and two gaps".
 */

import type { AdministerDiagnosticResponse } from '../../../src/domain/services/diagnostic-fixed-form.service.js';
import {
  administerDiagnostic,
  computeDomainReport,
  DiagnosticFormInvalidError,
  DiagnosticIncompleteError,
  DiagnosticResponseError,
  DiagnosticTimestampError,
  STOPPING_RULE_FIXED_FORM,
} from '../../../src/domain/services/diagnostic-fixed-form.service.js';
import { computeStartNode } from '../../../src/domain/services/diagnostic-placement.service.js';
import { createDiagnosticFormV1 } from '../../../src/domain/services/pilot-bank.service.js';

/** The real form, once. Every test administers this one. */
const FORM = createDiagnosticFormV1();

const STARTED_AT = new Date('2026-10-11T10:00:00.000Z');
const COMPLETED_AT = new Date('2026-10-11T10:12:00.000Z');

/** One response per form item, in form order, all with the same `correct`. */
function answer(
  correct: boolean | ((item: (typeof FORM.items)[number], index: number) => boolean)
): AdministerDiagnosticResponse[] {
  return FORM.items.map((item, index) => ({
    itemId: item.id,
    correct: typeof correct === 'function' ? correct(item, index) : correct,
    responseTimeMs: 1000 + index,
  }));
}

interface RunOverrides {
  role?: 'general' | 'it' | 'dev';
  responses?: AdministerDiagnosticResponse[];
  startedAt?: Date;
  completedAt?: Date;
}

/** `administerDiagnostic` with every input pinned, so no test reads a clock. */
function run(overrides: RunOverrides = {}) {
  return administerDiagnostic({
    learnerId: 'learner-1',
    sessionId: 'session-1',
    role: overrides.role ?? 'general',
    startedAt: overrides.startedAt ?? STARTED_AT,
    completedAt: overrides.completedAt ?? COMPLETED_AT,
    responses: overrides.responses ?? answer(true),
  });
}

/** Run `fn` and return the error it threw, or fail loudly if it did not throw. */
function capture(fn: () => unknown): Error {
  try {
    fn();
  } catch (error) {
    return error as Error;
  }
  throw new Error('expected the call to throw, and it returned a value');
}

const statesOf = (runResult: ReturnType<typeof run>) =>
  runResult.domainThetas.map(domain => domain.state);

describe('diagnostic-fixed-form.service — ADR-024 D1: the form is checked, not assumed', () => {
  it('1. administers the 12-item blueprint in form order, with no repetition and no listening item', () => {
    const result = run();

    expect(FORM.items).toHaveLength(12);
    expect(result.responses.map(response => response.itemId)).toEqual(
      FORM.items.map(item => item.id)
    );
    expect(new Set(result.responses.map(response => response.itemId)).size).toBe(12);

    // Composition by `domainId`, exactly ADR-017 §2 / ADR-024 D1.
    expect(FORM.items.filter(item => item.domainId === 'grammar')).toHaveLength(4);
    expect(FORM.items.filter(item => item.domainId === 'vocabulary')).toHaveLength(3);
    expect(FORM.items.filter(item => item.domainId === 'reading')).toHaveLength(3);
    expect(FORM.items.filter(item => item.domainId === 'pronunciation')).toHaveLength(2);
    expect(FORM.items.filter(item => item.domainId === 'listening')).toEqual([]);

    expect(result.domainThetas.map(domain => domain.domain)).toEqual([
      'grammar',
      'vocabulary',
      'reading',
      'pronunciation',
      'listening',
    ]);
  });

  it('1b. a form that fails a P1.8 criterion is refused, and the refusal names it', () => {
    // `validatePilotBank`'s result was discarded before ADR-024 D1, so this path could not be
    // reached. The error type and the named criteria are the contract.
    const error = new DiagnosticFormInvalidError(['criterion 1 (blueprint)']);
    expect(error).toBeInstanceOf(Error);
    expect(error.failures).toEqual(['criterion 1 (blueprint)']);
    expect(error.message).toContain('criterion 1 (blueprint)');
    // The real form passes the gate it gates.
    expect(run().responses).toHaveLength(12);
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D2: order, never θ', () => {
  it('2. the item sequence is a function of the form alone, never of the answers', () => {
    const allCorrect = run({ responses: answer(true) });
    const allWrong = run({ responses: answer(false) });
    // Varies `correct` *and* `responseTimeMs` in the same set.
    const mixed = run({
      responses: FORM.items.map((item, index) => ({
        itemId: item.id,
        correct: index % 3 === 0,
        responseTimeMs: index * 100,
      })),
    });

    const ids = (result: ReturnType<typeof run>) => result.responses.map(r => r.itemId);
    const formOrder = FORM.items.map(item => item.id);

    expect(ids(allCorrect)).toEqual(formOrder);
    expect(ids(allWrong)).toEqual(formOrder);
    expect(ids(mixed)).toEqual(formOrder);
    // The three runs have genuinely different θs, or the property above is vacuous.
    expect(allCorrect.thetaOverall).not.toBe(allWrong.thetaOverall);
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D3: completeness is an error', () => {
  it('3a. a missing response is DiagnosticIncompleteError, naming the ids', () => {
    const error = capture(() => run({ responses: answer(true).slice(0, 11) }));

    expect(error).toBeInstanceOf(DiagnosticIncompleteError);
    expect((error as DiagnosticIncompleteError).missingItemIds).toEqual([
      FORM.items[11]!.id,
    ]);
  });

  it('3b. an unknown itemId is DiagnosticResponseError, naming it', () => {
    const error = capture(() =>
      run({
        responses: [
          ...answer(true),
          { itemId: 'pb_not_in_the_form', correct: true, responseTimeMs: 10 },
        ],
      })
    );

    expect(error).toBeInstanceOf(DiagnosticResponseError);
    expect((error as DiagnosticResponseError).unknownItemIds).toEqual(['pb_not_in_the_form']);
    expect((error as DiagnosticResponseError).duplicateItemIds).toEqual([]);
  });

  it('3c. a duplicated itemId is DiagnosticResponseError, naming it', () => {
    const first = FORM.items[0]!.id;
    const error = capture(() =>
      run({ responses: [...answer(true), { itemId: first, correct: false, responseTimeMs: 10 }] })
    );

    expect(error).toBeInstanceOf(DiagnosticResponseError);
    expect((error as DiagnosticResponseError).duplicateItemIds).toEqual([first]);
    expect((error as DiagnosticResponseError).unknownItemIds).toEqual([]);
  });

  it('3d. zero responses throws — it must not return A2/les_a2_greetings_intro', () => {
    // The defect this replaces: `if (!resp) continue` skipped all 12, `computeThetaEstimate`
    // was called with an empty vector, and the run returned θ = 0 → A2 →
    // `les_a2_greetings_intro` — a placement derived from no evidence, with nothing in the
    // return value saying so.
    const error = capture(() => run({ responses: [] }));

    expect(error).toBeInstanceOf(DiagnosticIncompleteError);
    expect((error as DiagnosticIncompleteError).missingItemIds).toHaveLength(12);
    expect((error as DiagnosticIncompleteError).missingItemIds).toEqual(
      FORM.items.map(item => item.id)
    );
  });

  it('3e. θ is never estimated from a subset: 11 of 12 responses is still an error', () => {
    const partial = answer(false);
    partial[0] = { ...partial[0]!, correct: true };
    expect(() => run({ responses: partial.slice(1) })).toThrow(DiagnosticIncompleteError);
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D4: the run is pure', () => {
  it('4a. the caller\'s timestamps come back unchanged', () => {
    const startedAt = new Date('2026-01-02T03:04:05.000Z');
    const completedAt = new Date('2026-01-02T03:19:05.000Z');
    const result = run({ startedAt, completedAt });

    expect(result.startedAt).toEqual(startedAt);
    expect(result.completedAt).toEqual(completedAt);
    expect(result.startedAt.getTime()).toBe(startedAt.getTime());
    expect(result.completedAt.getTime()).toBe(completedAt.getTime());
  });

  it('4b. completedAt < startedAt throws, rather than being repaired by reading the clock', () => {
    const error = capture(() =>
      run({
        startedAt: new Date('2026-01-02T03:19:05.000Z'),
        completedAt: new Date('2026-01-02T03:04:05.000Z'),
      })
    );

    expect(error).toBeInstanceOf(DiagnosticTimestampError);
    // Equal timestamps are legal: a run may be instantaneous, and `completedAt >= startedAt`.
    expect(() =>
      run({ startedAt: COMPLETED_AT, completedAt: COMPLETED_AT })
    ).not.toThrow();
  });

  it('4c. two calls with the same input deep-compare equal (no clock, no randomness)', () => {
    const responses = answer((item, index) => index % 2 === 0);
    const first = run({ responses });
    const second = run({ responses });

    expect(first).toEqual(second);
    // Same rule with a different response set, to rule out an accidental constant.
    const other = run({ responses: answer(false) });
    expect(first).not.toEqual(other);
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D4/D5: form identity and stopping rule', () => {
  it('5. formId is stable across calls; formVersion stays diagnostic_form_v1', () => {
    const first = createDiagnosticFormV1();
    const second = createDiagnosticFormV1();

    expect(first.formId).toBe(second.formId);
    expect(first.formVersion).toBe('diagnostic_form_v1');
    expect(run().formVersion).toBe('diagnostic_form_v1');
    // Stable across two *runs* too, which is what "pinned on the run" means here.
    expect(run().formId).toBe(run().formId);
    // Derived from the ordered item ids: same set, same order, same identity.
    expect(first.formId).toContain(first.items[0]!.id);
    expect(first.formId).toContain(first.items[11]!.id);
  });

  it('6. stoppingRule is fixed_form_12_items and is constant in SE', () => {
    // A "low SE" run and a "high SE" run: §3.5's precision rule must not be able to touch it.
    const lowSe = run({ responses: answer(false) });
    const highSe = run({ responses: answer((item, index) => index % 2 === 0) });

    expect(lowSe.seOverall).not.toBe(highSe.seOverall); // or the assertion below is vacuous
    expect(lowSe.stoppingRule).toBe('fixed_form_12_items');
    expect(highSe.stoppingRule).toBe('fixed_form_12_items');
    expect(run().stoppingRule).toBe(STOPPING_RULE_FIXED_FORM);
  });
});

describe('diagnostic-fixed-form.service — ADR-017 §2 provenance (G-Q7 is a CAT rule)', () => {
  it('7. every item is authored, and authored items administer normally on the fixed form', () => {
    // G-Q7 ("only calibrated items may be administered") is a *CAT* rule: ADR-017 §2 admits
    // `authored` provenance for the fixed form, and the executor must not apply the CAT gate.
    expect(FORM.items.every(item => item.provenanceKind === 'authored')).toBe(true);
    expect(FORM.items.every(item => item.calibrationStatus === 'expert_anchored')).toBe(true);

    const result = run();
    expect(result.responses).toHaveLength(12);
    expect(result.placementProvisional).toBe(true); // D10 — derived, see test below
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D7: §3.3a\'s lattice', () => {
  it('8. the real form is band/band/band/insufficient/insufficient, with no point estimate', () => {
    const result = run();

    expect(statesOf(result)).toEqual([
      'band',
      'band',
      'band',
      'insufficient_evidence',
      'insufficient_evidence',
    ]);
    expect(result.domainThetas.map(domain => domain.itemsAdministered)).toEqual([4, 3, 3, 2, 0]);

    // No entry carries a point estimate — that is §3.3a applied to 4/3/3/2/0.
    for (const domain of result.domainThetas) {
      expect(domain.theta).toBeUndefined();
      expect(domain.se).toBeUndefined();
      expect(domain.cefr).toBeUndefined();
    }

    // `band` carries the derivation of §3.6's "A1–A2" shape, not a hand-written string.
    for (const domain of result.domainThetas.slice(0, 3)) {
      expect(domain.cefrBand).toMatch(/^A1|^A2|^B1|^B2/);
    }

    // Listening's absence cites its cause: §2.1 removed it from the blueprint.
    expect(result.domainThetas[4]!.reason).toContain('§2.1');

    // `skillThetaReportable` is all-false and *derived* from `state`, never listed.
    expect(result.skillThetaReportable).toEqual({
      grammar: false,
      vocabulary: false,
      reading: false,
      pronunciation: false,
      listening: false,
    });
    expect(result.skillThetaReportable).toEqual(
      Object.fromEntries(
        result.domainThetas.map(domain => [domain.domain, domain.state === 'point_estimate'])
      )
    );
  });

  it('9. a ≥ 5-item domain is a point estimate — the lattice is computed, not listed', () => {
    // Mutate a copy of the form: a 5th grammar item crosses §3.3a's floor of 5.
    const synthetic = [...FORM.items, { ...FORM.items[0]!, id: 'pb_g05_synthetic' }];
    const responses = synthetic.map(item => ({ itemId: item.id, correct: true }));

    const report = computeDomainReport(synthetic, responses);

    expect(report.domainThetas.map(domain => domain.state)).toEqual([
      'point_estimate',
      'band',
      'band',
      'insufficient_evidence',
      'insufficient_evidence',
    ]);
    // Only grammar flips; the other domains keep the state the real form gives them.
    expect(report.skillThetaReportable).toEqual({
      grammar: true,
      vocabulary: false,
      reading: false,
      pronunciation: false,
      listening: false,
    });

    const grammar = report.domainThetas[0]!;
    expect(grammar.itemsAdministered).toBe(5);
    expect(grammar.theta).toBeDefined();
    expect(grammar.se).toBeDefined();
    expect(grammar.cefr).toBeDefined();
    expect(grammar.cefrBand).toBeUndefined();

    // And the real form still reports nothing: the flip above is caused only by the item count.
    expect(statesOf(run())).toEqual([
      'band',
      'band',
      'band',
      'insufficient_evidence',
      'insufficient_evidence',
    ]);
  });

  it('10. ci95* uses the realised seOverall; placementCi95* uses the declared seEffective', () => {
    const result = run({ responses: answer(false) });

    expect(result.ci95Lower).toBeCloseTo(result.thetaOverall - 1.96 * result.seOverall, 12);
    expect(result.ci95Upper).toBeCloseTo(result.thetaOverall + 1.96 * result.seOverall, 12);
    expect(result.placementCi95Lower).toBeCloseTo(
      result.thetaOverall - 1.96 * result.seEffective,
      12
    );
    expect(result.placementCi95Upper).toBeCloseTo(
      result.thetaOverall + 1.96 * result.seEffective,
      12
    );

    // Two different numbers, one per purpose — §3.6's example has three (se 0.28,
    // se_statistical 0.31, se_effective 0.43) for the same reason.
    expect(result.seOverall).not.toBe(result.seEffective);
    expect(result.ci95Lower).not.toBe(result.placementCi95Lower);
    expect(result.ci95Upper).not.toBe(result.placementCi95Upper);

    // The declared disclosure values are untouched, and neither is replaced by the realised one.
    expect(result.seStatistical).toBe(FORM.calibrationDisclosure.seStatistical);
    expect(result.seParameter).toBe(FORM.calibrationDisclosure.seParameter);
    expect(result.seEffective).toBe(FORM.calibrationDisclosure.seEffective);
    expect(result.precisionLabel).toBe(FORM.calibrationDisclosure.precisionLabel);
  });

  it('11. cefr is never C1/C2 — the ladder is A1–B2 and total', () => {
    const responseSets = [
      answer(true),
      answer(false),
      answer((item, index) => index % 2 === 0),
      answer((item, index) => index !== 7),
    ];

    for (const responses of responseSets) {
      const result = run({ responses });
      expect(['A1', 'A2', 'B1', 'B2']).toContain(result.cefr);
      expect(['C1', 'C2']).not.toContain(result.cefr);
      expect(['A1', 'A2', 'B1', 'B2']).toContain(result.startCefr);
    }

    // The extreme the ladder must still bound: an all-correct run estimates θ ≫ 1.5, and the
    // answer is B2 (the top band of this bank), never a fabricated C1.
    const extreme = run({ responses: answer(true) });
    expect(extreme.thetaOverall).toBeGreaterThan(1.5);
    expect(extreme.cefr).toBe('B2');
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D8: profile is the §4 diagnosis', () => {
  it('12a. Grammar θ ≫ Vocabulary θ yields false_beginner_suspected and the confidence node', () => {
    // §4.1 row 1: studied grammar, no exposure.
    const result = run({
      responses: answer(item => item.domainId === 'grammar'),
    });

    expect(result.profile).toBe('false_beginner_suspected');
    expect(result.remediationNodes).toContain('les_rem_confidence_builder');
  });

  it('12b. a neutral run yields no §4 diagnosis and no confidence node', () => {
    const neutral = run({ responses: answer(false) }); // Δ = 0, pronunciation θ = 0

    expect(neutral.profile).toBeNull();
    expect(neutral.remediationNodes).not.toContain('les_rem_confidence_builder');
    expect(neutral.remediationNodes).toEqual([]);
  });

  it('12c. the track role is never mistaken for the diagnosis', () => {
    // The defect ADR-024 D8 removes: `profile` used to *be* the input role, so
    // `diagnostic_results.profile` could never hold `false_beginner_suspected` and ADR-023
    // Decision 4's confidence-builder trigger was unreachable.
    const developer = run({ role: 'dev', responses: answer(false) });

    expect(developer.role).toBe('dev');
    expect(developer.profile).toBeNull();
  });
});

describe('diagnostic-fixed-form.service — ADR-024 D10: placementProvisional is derived', () => {
  it('placementProvisional follows the items\' calibrationStatus, not a literal', () => {
    const result = run();
    const anyUncalibrated = FORM.items.some(
      item => item.calibrationStatus !== 'empirically_calibrated'
    );

    expect(result.placementProvisional).toBe(anyUncalibrated);
    expect(anyUncalibrated).toBe(true); // every pilot item is expert_anchored today
  });
});

describe('diagnostic-fixed-form.service — integration (ADR-024 acceptance)', () => {
  it('13. computeStartNode reproduces the run\'s routing outputs from the run\'s own inputs', () => {
    // Every combination of a role and a response profile, so the identity is not a coincidence
    // of one θ.
    const responseSets: AdministerDiagnosticResponse[][] = [
      answer(true),
      answer(false),
      answer((item, index) => index % 2 === 0),
      answer(item => item.domainId === 'grammar'),
      answer(item => item.domainId !== 'pronunciation'),
    ];

    for (const responses of responseSets) {
      for (const role of ['general', 'it', 'dev'] as const) {
        const result = run({ role, responses });

        // The run's own domain θs. ADR-024 D7 gates what may be *reported*, not what routing
        // may read: §3.3a's band/insufficient entries carry no θ, so the routing inputs are
        // re-derived by the same exported derivation the executor used.
        const { thetaByDomain } = computeDomainReport(FORM.items, responses);

        const reproduced = computeStartNode({
          thetaOverall: result.thetaOverall,
          seEffective: result.seEffective,
          role: result.role,
          profile: result.profile,
          grammarTheta: thetaByDomain['grammar'] ?? 0,
          vocabularyTheta: thetaByDomain['vocabulary'] ?? 0,
          readingTheta: thetaByDomain['reading'] ?? 0,
          pronunciationTheta: thetaByDomain['pronunciation'] ?? 0,
        });

        expect({
          startCefr: reproduced.startCefr,
          startNode: reproduced.startNode,
          belowScale: reproduced.belowScale,
          remediationNodes: reproduced.remediationNodes,
        }).toEqual({
          startCefr: result.startCefr,
          startNode: result.startNode,
          belowScale: result.belowScale,
          remediationNodes: result.remediationNodes,
        });
        expect(result.recommendedStartNode).toBe(result.startNode);
      }
    }
  });
});
