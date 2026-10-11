/**
 * ADR-023 — diagnostic routing semantics: the property tests (that ADR's "the acceptance").
 *
 * Everything here runs against the **real** `SE_eff` (0.567) that `pilot-bank.service.ts` §1
 * declares, so the windows the tests exercise are the windows production sees.
 *
 * The registry proof (test 6) loads the real `specs/curriculum-graph-spec.md` through the
 * existing infrastructure parser/validator rather than a fixture copy: `start_node` must be a
 * *lesson ID of the registry*, and a fixture would only prove the fixture.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

import { CEFR_THRESHOLDS, START_NODE_TABLE } from '../../../src/domain/entities/pilot-bank.js';
import { computeStartNode } from '../../../src/domain/services/diagnostic-placement.service.js';
import type {
  CefrBand,
  PlacementInput,
} from '../../../src/domain/services/diagnostic-placement.service.js';
import { createDiagnosticFormV1 } from '../../../src/domain/services/pilot-bank.service.js';
import { validateDAG } from '../../../src/infrastructure/curriculum/dag-validator.js';
import { parseCurriculumSpec } from '../../../src/infrastructure/curriculum/curriculum-parser.js';
import type { CurriculumGraph } from '../../../src/infrastructure/curriculum/curriculum-types.js';

/** The form's own `SE_eff` (pilot-bank.service.ts §1), never a hand-copied 0.567. */
const SE_EFF = createDiagnosticFormV1().calibrationDisclosure.seEffective;

/** `t_h` of ADR-023 Decision 2 — the 1.96 of a two-sided 95 % interval. */
const T_H = 1.96 * SE_EFF;

const CEFR_RANK: Record<CefrBand, number> = { A1: 0, A2: 1, B1: 2, B2: 3 };

/** Rank of a band, for the monotonicity and "lowest" properties. */
function rankOf(band: string): number {
  return CEFR_RANK[band as CefrBand] ?? -1;
}

/** `computeStartNode` at a given θ, with the real SE and everything else defaulted. */
function at(theta: number, overrides: Partial<PlacementInput> = {}): ReturnType<typeof computeStartNode> {
  return computeStartNode({ thetaOverall: theta, seEffective: SE_EFF, ...overrides });
}

/** Inclusive θ sweep with an exact number of steps (no float accumulation). */
function sweep(from: number, to: number, step: number): number[] {
  const steps: number[] = [];
  for (let i = Math.round(from / step); i <= Math.round(to / step); i++) steps.push(i * step);
  return steps;
}

/** ADR-023's three band boundaries, read from the formula, not from a hand-copied table. */
const BAND_BOUNDARY = {
  a1ToA2: CEFR_THRESHOLDS.A2.min - T_H, // < −1.611 → A1
  a2ToB1: CEFR_THRESHOLDS.A2.min + T_H, // (0.611, 1.611] → B1
  b1ToB2: CEFR_THRESHOLDS.B1.min + T_H, // > 1.611 → B2
} as const;

describe('diagnostic-placement.service (ADR-023)', () => {
  it('1. start_cefr is monotone non-decreasing in θ', () => {
    const ranks: Array<{ theta: number; rank: number }> = [];

    for (const theta of sweep(-5, 5, 0.01)) {
      ranks.push({ theta, rank: rankOf(at(theta).startCefr) });
    }

    const violations = ranks
      .map((entry, i) => ({ ...entry, previous: ranks[i - 1]?.rank ?? entry.rank }))
      .filter((entry) => entry.rank < entry.previous);

    expect(violations).toEqual([]);
    // The sweep spans every band, or the property above would hold vacuously.
    expect(ranks[0]?.rank).toBe(CEFR_RANK.A1);
    expect(ranks[ranks.length - 1]?.rank).toBe(CEFR_RANK.B2);
  });

  it('2. start_cefr is the lowest band whose entry threshold lies inside band_bounds', () => {
    const violations: Array<{ theta: number; reason: string }> = [];

    for (const theta of sweep(-5, 5, 0.05)) {
      const lower = theta - T_H;
      const upper = theta + T_H;

      // Derived from the formula at runtime — iterate the entry thresholds of stats §3.1.
      const candidate = (
        [
          ['A2', CEFR_THRESHOLDS.A2.min],
          ['B1', CEFR_THRESHOLDS.B1.min],
          ['B2', CEFR_THRESHOLDS.B2.min],
        ] as const
      )
        .filter(([, entry]) => entry >= lower && entry <= upper)
        .map(([band]) => band);

      if (candidate.length === 0) continue; // the two totality clauses, covered by tests 4 and 5

      const { startCefr } = at(theta);
      const lowest = candidate[0]!; // ascending entries, so this IS the lowest candidate

      if (startCefr !== lowest) violations.push({ theta, reason: `expected ${lowest}` });
      for (const band of candidate) {
        if (rankOf(startCefr) > rankOf(band)) {
          violations.push({ theta, reason: `not ≤ candidate ${band}` });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('3. below_scale is exactly θ + 1.96·SE_eff < −0.5, and it implies A1', () => {
    const violations: Array<{ theta: number; reason: string }> = [];

    for (const theta of sweep(-5, 5, 0.01)) {
      const { belowScale, startCefr } = at(theta);
      const expected = theta + 1.96 * SE_EFF < CEFR_THRESHOLDS.A2.min;

      if (belowScale !== expected) violations.push({ theta, reason: 'predicate' });
      if (belowScale && startCefr !== 'A1') violations.push({ theta, reason: 'below_scale → not A1' });
    }

    expect(violations).toEqual([]);
  });

  it('4. the ladder changes only at the boundaries the table derives (−1.611 / 0.611 / 1.611)', () => {
    const { a1ToA2, a2ToB1, b1ToB2 } = BAND_BOUNDARY;

    // The ADR's table, rounded: < −1.611 → A1, [−1.611, 0.611] → A2, (0.611, 1.611] → B1, > 1.611 → B2.
    expect(a1ToA2).toBeCloseTo(-1.611, 2);
    expect(a2ToB1).toBeCloseTo(0.611, 2);
    expect(b1ToB2).toBeCloseTo(1.611, 2);

    // Both sides of each boundary, well inside the 0.01 tolerance.
    const bothSides: Array<[number, string, string]> = [
      [a1ToA2, 'A1', 'A2'],
      [a2ToB1, 'A2', 'B1'],
      [b1ToB2, 'B1', 'B2'],
    ];

    for (const [boundary, below, above] of bothSides) {
      expect({ theta: boundary - 0.005, cefr: at(boundary - 0.005).startCefr }).toEqual({
        theta: boundary - 0.005,
        cefr: below,
      });
      expect({ theta: boundary + 0.005, cefr: at(boundary + 0.005).startCefr }).toEqual({
        theta: boundary + 0.005,
        cefr: above,
      });
    }

    // The table's brackets: the closed edges belong to the band below them.
    expect(at(a1ToA2).startCefr).toBe('A2');
    expect(at(a2ToB1).startCefr).toBe('A2');
    expect(at(b1ToB2).startCefr).toBe('B1');
  });

  it('5. θ above the top entry yields B2 — the totality clause, never below_scale', () => {
    // 3.0 is above 1.5 + t_h = 2.611: the bounds lie entirely above the top entry, so the
    // "band below A1" reading would be wrong here (ADR-023 Decision 2, clause 1).
    expect(at(3.0).startCefr).toBe('B2');
    expect(at(3.0).belowScale).toBe(false);
    expect(at(3.0).startNode).toBe(START_NODE_TABLE['B2']!.general);
  });

  it('7a. remediation_nodes is [] when no §5.1 trigger fires', () => {
    expect(at(0.2, { pronunciationTheta: 0.2 }).remediationNodes).toEqual([]);
    // §5.1's predicate is strict: −1.0 does not fire, −1.0 is not < −1.0.
    expect(at(0.2, { pronunciationTheta: -1.0 }).remediationNodes).toEqual([]);
    expect(at(0.2).remediationNodes).toEqual([]);
  });

  it('7b. below_scale is a start-node signal, not a remediation trigger', () => {
    const below = at(-3.0);
    expect(below.belowScale).toBe(true);
    expect(below.startCefr).toBe('A1');
    expect(below.startNode).toBe('les_a1_alphabet_sounds');
    // The old implementation returned all five nodes here (ADR-023 Context §2).
    expect(below.remediationNodes).toEqual([]);
  });

  it('7c. a low pronunciation θ emits exactly the pronunciation node', () => {
    expect(at(0.2, { pronunciationTheta: -1.5 }).remediationNodes).toEqual([
      'les_rem_pronunciation_th_vw',
    ]);
  });

  it('7d. false_beginner_suspected emits the confidence node, after pronunciation', () => {
    // ADR-024 D8: `false_beginner_suspected` is the `profile` (the §4 diagnosis), never a
    // `role`. The assertion is the same one it always was.
    const beginner = at(-0.3, { profile: 'false_beginner_suspected' });
    expect(beginner.remediationNodes).toEqual(['les_rem_confidence_builder']);

    const both = at(-0.3, {
      profile: 'false_beginner_suspected',
      pronunciationTheta: -2.0,
    });
    expect(both.remediationNodes).toEqual([
      'les_rem_pronunciation_th_vw',
      'les_rem_confidence_builder',
    ]);
  });

  it('7e. never emits a listening node and never exceeds the cap of 3', () => {
    const violations: Array<{ reason: string }> = [];

    // The same four values the old single `learnerProfile` carried, spelled as the two
    // quantities `PlacementInput` now has (ADR-024 D8). Not an added case and not a removed
    // one: `general`/`it`/`dev` are the three roles, `false_beginner_suspected` the profile.
    const profiles: ReadonlyArray<Pick<PlacementInput, 'role' | 'profile'>> = [
      { role: 'general' },
      { role: 'it' },
      { role: 'dev' },
      { role: 'general', profile: 'false_beginner_suspected' },
    ];

    for (const learnerProfile of profiles) {
      for (const pronunciationTheta of [-4, -1.01, -1, -0.99, 0, 2]) {
        for (const thetaOverall of [-4, -1.6, -0.3, 0.2, 0.7, 3]) {
          const { remediationNodes } = at(thetaOverall, { ...learnerProfile, pronunciationTheta });

          if (remediationNodes.length > 3) violations.push({ reason: `cap: ${thetaOverall}` });
          if (remediationNodes.includes('les_rem_listening_slow_clear')) {
            // ADR-017 §2/§4: no listening trigger can fire at placement (0 observations).
            violations.push({ reason: `listening node at ${thetaOverall}` });
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('8a. dev/it with vocabulary θ > grammar θ routes to the IT node', () => {
    for (const role of ['dev', 'it'] as const) {
      const { startCefr, startNode } = at(0.9, {
        role,
        grammarTheta: -0.4,
        vocabularyTheta: 0.6,
      });

      const row = START_NODE_TABLE[startCefr]!;
      expect(row.it).not.toBe(row.general); // otherwise this test cannot distinguish the rule
      expect(startNode).toBe(row.it);
    }
  });

  it('8b. general routes to the General node even when vocabulary θ > grammar θ', () => {
    const { startCefr, startNode } = at(0.9, {
      role: 'general',
      grammarTheta: -0.4,
      vocabularyTheta: 0.6,
    });

    expect(startNode).toBe(START_NODE_TABLE[startCefr]!.general);
  });

  it('8c. dev with vocabulary θ ≤ grammar θ routes to the General node', () => {
    for (const [vocabularyTheta, grammarTheta] of [
      [-0.2, 0.4],
      [0.4, 0.4],
    ] as const) {
      const { startCefr, startNode } = at(0.9, {
        role: 'dev',
        vocabularyTheta,
        grammarTheta,
      });

      expect(startNode).toBe(START_NODE_TABLE[startCefr]!.general);
    }
  });
});

describe('diagnostic-placement.service — start_node ∈ CurriculumGraph (ADR-023 test 6)', () => {
  let curriculumGraph: CurriculumGraph;

  beforeAll(() => {
    // The real registry, through the same parser the DAG loader uses — no fixture copy.
    const registryMarkdown = readFileSync(
      resolve(__dirname, '../../../../specs/curriculum-graph-spec.md'),
      'utf-8'
    );
    curriculumGraph = parseCurriculumSpec(registryMarkdown);
  });

  it('the registry parses and validates as the DAG the specs describe', () => {
    const validation = validateDAG(curriculumGraph);

    expect(validation.errors).toEqual([]);
    expect(validation.valid).toBe(true);
    expect(validation.stats.nodeCount).toBe(141);
    expect(validation.stats.lessonCount).toBe(123);
    expect(curriculumGraph.entryPoints.size).toBe(8);
  });

  it('every routed start_node is a real lesson of the registry, for both tracks', () => {
    const tracks: Array<{ name: string; input: Partial<PlacementInput> }> = [
      { name: 'IT', input: { role: 'dev', grammarTheta: -0.8, vocabularyTheta: 0.9 } },
      { name: 'General', input: { role: 'general' } },
    ];

    const violations: Array<{ theta: number; track: string; startNode: string }> = [];

    for (const track of tracks) {
      for (const theta of sweep(-5, 5, 0.1)) {
        const { startNode } = computeStartNode({
          thetaOverall: theta,
          seEffective: SE_EFF,
          ...track.input,
        });

        const node = curriculumGraph.nodes.get(startNode);
        if (!node || node.type !== 'lesson') {
          violations.push({ theta, track: track.name, startNode });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('emits no remediation node that is not a lesson of the registry', () => {
    const emitted = new Set<string>();
    const violations: string[] = [];

    const inputs: ReadonlyArray<Pick<PlacementInput, 'role' | 'profile'>> = [
      { role: 'general' },
      { role: 'it' },
      { role: 'dev' },
      { role: 'general', profile: 'false_beginner_suspected' },
    ];

    for (const learnerProfile of inputs) {
      for (const thetaOverall of sweep(-4, 4, 0.1)) {
        for (const pronunciationTheta of [-2, -1.01, -0.5, 0, 1]) {
          for (const node of at(thetaOverall, { ...learnerProfile, pronunciationTheta })
            .remediationNodes) {
            emitted.add(node);
          }
        }
      }
    }

    for (const node of emitted) {
      if (curriculumGraph.nodes.get(node)?.type !== 'lesson') violations.push(node);
    }

    expect(violations).toEqual([]);
  });

  it('9. START_NODE_TABLE is §5.1 verbatim, and every one of its eight ids is a real lesson', () => {
    // Locked row by row, not spot-checked: the previous table disagreed with §5.1 on **two**
    // rows (B1/IT and both B2 entries) and every one of the six replaced ids also exists as a
    // lesson, so no existence check — this one included — could have caught the drift.
    expect(START_NODE_TABLE).toEqual({
      A1: { general: 'les_a1_alphabet_sounds', it: 'les_a1_alphabet_sounds' },
      A2: { general: 'les_a2_greetings_intro', it: 'les_a2_it_terms_basics' },
      B1: { general: 'les_b1_tenses_review', it: 'les_b1_it_architecture_vocab' },
      B2: { general: 'les_b2_register_nuance', it: 'les_b2_it_mentoring' },
    });

    // §5.1's rows, not the three stale ids the previous table also accepted
    // (`les_b1_it_write_docs`, `les_b2_professional_argument`, `les_b2_it_advanced_patterns`),
    // each of which is a real lesson — so this must be asserted by name, not by existence.
    expect(Object.values(START_NODE_TABLE).flatMap((row) => [row.general, row.it])).not.toContain(
      'les_b1_it_write_docs',
    );
    expect(START_NODE_TABLE['B2']).toEqual({
      general: 'les_b2_register_nuance',
      it: 'les_b2_it_mentoring',
    });

    const violations: string[] = [];

    for (const band of ['A1', 'A2', 'B1', 'B2'] as const) {
      const row = START_NODE_TABLE[band];
      for (const track of ['general', 'it'] as const) {
        const id = row![track];
        const node = curriculumGraph.nodes.get(id);
        if (!node || node.type !== 'lesson') violations.push(`${band}/${track}: ${id}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
