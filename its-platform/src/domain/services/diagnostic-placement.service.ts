/**
 * Diagnostic Placement Service — ordinal, interval-based routing
 *
 * `computeStartNode` implements ADR-023 Decision 2 exactly:
 *
 *   t_h        = 1.96 · SE_eff
 *   band_entry = { A2: −0.5, B1: 0.5, B2: 1.5 }        # stats-progress-evaluation-spec.md §3.1
 *   band_bounds= [θ − t_h, θ + t_h]
 *   candidate  = { B : band_entry[B] ∈ band_bounds }   # ADR-023 "the ambiguity inside ladder 3", (a)
 *   start_cefr = lowest(candidate)          if candidate ≠ ∅
 *              = 'B2'                       if θ − t_h > 1.5    # bounds above the top entry
 *              = 'A1' with below_scale=true  if θ + t_h < −0.5   # bounds entirely below the A2 entry
 *   start_node = START_NODE_TABLE[start_cefr][track]    # curriculum-graph §5.1
 *
 * Two things the previous implementation got wrong and this one cannot:
 * `seEffective` now *moves* the result (it was accepted and discarded), and the returned band
 * is the lowest one the interval reaches — ADR-017 §3 "under-placement, never over-placement".
 *
 * The function is total and side-effect free: same input → same output, no `Date`, no I/O, no
 * randomness (ADR-023 Decision 5), so P1.10 can persist exactly what was returned.
 *
 * `computeThetaEstimate` (below) is the second exported function of this module and implements
 * `diagnostic-spec.md` §3.4 as ADR-025 decides it — a bounded, monotone, deterministic posterior
 * mode with a `N(θ₀, 1)` prior. It replaced a fixed-point iteration that was not §3.4's formula
 * at any step size and produced un-storable `se` values; see the function's own docstring.
 */

import type {
  FalseBeginnerProfile,
  LearnerRole,
  StartNodeMapping,
} from '../entities/pilot-bank.js';
import { CEFR_THRESHOLDS, START_NODE_TABLE } from '../entities/pilot-bank.js';

export type { FalseBeginnerProfile, LearnerRole };

/**
 * The bands this bank can route to. The ladder is A1–B2 — `CEFR_THRESHOLDS` has no C1 entry
 * and neither has the 12-item bank (ADR-023 Decision 1).
 */
export type CefrBand = 'A1' | 'A2' | 'B1' | 'B2';

/** §5.1's `track`: the IT branch or the General one. */
export type PlacementTrack = 'General' | 'IT';

/**
 * ADR-024 D8: `learnerProfile` conflated two different quantities and is **split**.
 *
 * - `role` (`general`|`it`|`dev`) is the track input of §5.1 / ADR-023 Decision 3.
 * - `profile` (`false_beginner_suspected`|`null`) is the §4 diagnosis of
 *   `diagnostic-spec.md` §4.1 — the only value §5.1's confidence-builder trigger keys on.
 *
 * A default of `role: 'general'`/`profile: null` is deliberate: an absent domain then fails
 * `vocabulary θ > grammar θ` and yields `General`, and an absent diagnosis yields no
 * remediation node, rather than inventing an IT route or an affective-filter signal.
 */
export interface PlacementInput {
  thetaOverall: number;
  seEffective: number;
  /** The track input (ADR-024 D8). */
  role?: LearnerRole;
  /** The §4 diagnosis (ADR-024 D8). */
  profile?: FalseBeginnerProfile;
  /**
   * Domain-level θs of the same run. The track rule of ADR-023 Decision 3 compares
   * `vocabulary` against `grammar`, and an absent domain behaves as θ = 0 (the estimator's own
   * starting point), which fails towards `General` rather than inventing a thumbs-up.
   */
  grammarTheta?: number;
  vocabularyTheta?: number;
  readingTheta?: number;
  pronunciationTheta?: number;
}

/** 95 % two-sided normal quantile, i.e. the 1.96 of `t_h` in ADR-017 §3. */
const CI_Z = 1.96;

/** Remediation cap: `diagnostic_results.remediation_nodes` has `cardinality(…) <= 3`. */
const MAX_REMEDIATION_NODES = 3;

/**
 * Band entry thresholds (the θ at which a band *begins*), ascending, as data.
 *
 * A1 has no entry threshold — it begins at −∞ — which is why the candidate set is built from
 * A2 upward. The values are read from `CEFR_THRESHOLDS` so stats §3.1's boundary is stated
 * once, in the entity, and this file restates nothing.
 */
const BAND_ENTRY_THRESHOLDS: ReadonlyArray<{ band: CefrBand; entry: number }> = (
  ['A2', 'B1', 'B2'] as const
).map((band) => ({ band, entry: CEFR_THRESHOLDS[band].min }));

/** `below_scale` is defined against the first entry: A2's −0.5 (ADR-023 Decision 2). */
const FIRST_ENTRY_THRESHOLD: number = CEFR_THRESHOLDS.A2.min;

/** The clause for bounds above the top entry: θ − t_h > B2's 1.5. */
const TOP_ENTRY_THRESHOLD: number = CEFR_THRESHOLDS.B2.min;

/**
 * Map an overall θ estimate + `SE_eff` to the CEFR band to start at and the node to start from.
 *
 * Pure: same input → same output (ADR-023 Decision 5).
 */
export function computeStartNode(input: PlacementInput): StartNodeMapping {
  const { thetaOverall, seEffective, role = 'general', profile = null } = input;
  const {
    grammarTheta = 0,
    vocabularyTheta = 0,
    pronunciationTheta = 0,
  } = input;

  const t_h = CI_Z * seEffective;
  const bandBoundsLower = thetaOverall - t_h;
  const bandBoundsUpper = thetaOverall + t_h;

  // Reading (a) of ADR-023's ambiguity: a band is a candidate iff its **entry threshold** lies
  // inside band_bounds, not iff its range intersects them. `diagnostic-spec.md` §3.6 is the
  // only worked example in the specs and reproduces only under (a): θ = −0.3, SE = 0.28 →
  // band_bounds = [−0.849, 0.249] → candidate = {A2} → `les_a2_greetings_intro`.
  const candidate = BAND_ENTRY_THRESHOLDS.filter(
    ({ entry }) => entry >= bandBoundsLower && entry <= bandBoundsUpper
  ).map(({ band }) => band);

  let startCefr: CefrBand;
  if (candidate.length > 0) {
    // Entered in ascending order, so candidate[0] is the LOWEST band in the set: ADR-017 §3
    // "never the highest", the same under-placement direction as `stats` §2.1's P(L₀) = 0.15.
    startCefr = candidate[0]!;
  } else if (bandBoundsLower > TOP_ENTRY_THRESHOLD) {
    // Totality clause 1 (ADR-023 Decision 2): θ − t_h > 1.5, the bounds lie entirely ABOVE the
    // top entry. Reachable — 12 items at a = 1.2 estimate θ > 2.6 for a strong learner — and
    // reading it as "band below A1" would invert the defect this ADR exists to remove.
    startCefr = 'B2';
  } else {
    // Totality clause 2: θ + t_h < −0.5, the bounds lie entirely BELOW the A2 entry (ADR-017
    // §3's "band below A1"). A1 is the only band left, since (§3.1) A1 begins at −∞.
    startCefr = 'A1';
  }

  // A predicate, never a stored flag (ADR-023 Decision 2). It cannot hold in the B2 case:
  // that clause requires θ − t_h > 1.5, so θ + t_h > 1.5 > −0.5.
  const belowScale = bandBoundsUpper < FIRST_ENTRY_THRESHOLD;

  const track = resolveTrack(role, { vocabularyTheta, grammarTheta });
  const startNode = START_NODE_TABLE[startCefr]![track === 'IT' ? 'it' : 'general'];

  return {
    startCefr,
    startNode,
    belowScale,
    // ADR-017 §3 routes `below_scale` to `les_a1_alphabet_sounds` (the A1 row), not to a
    // remediation node: below-scale is a start-node signal, and remediation has its own
    // triggers in §5.1 (ADR-023 Decision 4).
    remediationNodes: resolveRemediationNodes(profile, pronunciationTheta),
    // The §4 diagnosis, passed through — NOT the `role` above (ADR-024 D8). `profile` is what
    // ADR-023 Decision 4's confidence-builder trigger reads, and it is derived, not supplied
    // as the track.
    profile,
  };
}

/**
 * Curriculum-graph §5.1's track rule, evaluated on real domain θs:
 * `IT` iff the **role** is IT/dev **and** `vocabulary θ > grammar θ`, else `General`.
 *
 * The previous implementation read the conflated profile alone, so every `dev` learner was
 * routed to the IT nodes and §5.1's θ condition was never evaluated (ADR-023 Context §3);
 * ADR-024 D8 splits the two quantities this function now reads exactly one of.
 */
function resolveTrack(
  role: LearnerRole,
  { vocabularyTheta, grammarTheta }: { vocabularyTheta: number; grammarTheta: number }
): PlacementTrack {
  const itContext = role === 'it' || role === 'dev';
  return itContext && vocabularyTheta > grammarTheta ? 'IT' : 'General';
}

/**
 * Remediation micro-lessons per `curriculum-graph-spec.md` §5.1's triggers, capped at 3.
 *
 * Order matters and follows §5.1: pronunciation before the affective-filter node.
 *
 * **`les_rem_listening_slow_clear` is never emitted here.** ADR-017 §2 removes Listening from
 * the blueprint (0 items) and §4 forbids any placement-time trigger from reading a listening θ:
 * with no listening item there are **0 listening observations at placement**, so §5.1's
 * `listening ∈ weak_skills` predicate cannot be true. §4 replaces the trigger with a BKT-only
 * one (`p_know < 0.85` on ≥3 observations), which placement cannot satisfy either, and §5.2's
 * row showing the listening node as placement remediation is stale.
 */
function resolveRemediationNodes(
  profile: FalseBeginnerProfile,
  pronunciationTheta: number
): string[] {
  const nodes: string[] = [];

  // §5.1: `pronunciation θ < −1.0`. Strict: θ = −1.0 itself does not fire.
  if (pronunciationTheta < -1.0) nodes.push('les_rem_pronunciation_th_vw');

  // §5.1: `profile = false_beginner` — the affective filter, not a θ.
  if (profile === 'false_beginner_suspected') nodes.push('les_rem_confidence_builder');

  return nodes.slice(0, MAX_REMEDIATION_NODES);
}

/**
 * `diagnostic-spec.md` §3.4's θ estimate for the fixed form (ADR-025 Decision 1–3).
 *
 *   θ₀ = initialTheta, σ = 1                       # P(θ) = N(θ₀, σ²)
 *   logPosterior(θ) = −(θ − θ₀)² / (2σ²) + Σ_i log p_i(x_i | θ; a_i, b_i)
 *   θ̂ = argmax over { θ₀ + k·GRID_STEP : k ∈ [−600, +600] }     # 1201 points, ties → smallest θ
 *   se = 1 / √( Σ_i aᵢ²·pᵢ(1−pᵢ) ) evaluated at θ̂                # §3.4's second line, literally
 *
 * The 2PL log-likelihood is evaluated in its numerically stable log-sigmoid form, so no term
 * overflows for any finite `z = aᵢ(θ − bᵢ)`:
 *
 *   correct   : log p = log σ(z)   = −log1p(exp(−z))
 *   incorrect : log p = log(1−σ(z)) = −log1p(exp(+z))
 *
 * **`initialTheta` is the prior mean θ₀, not a warm start.** The executor calls this function
 * twice per run in two documented modes (ADR-025 Decision 2): with `0.0` for the run's *overall*
 * estimate, and with the running θ for each successive response, which is a §3.4 posterior given
 * the prefix of responses — a sequential update, **not** twelve independent estimates. The
 * previous implementation read `initialTheta` as a Newton-Raphson anchor and drifted away from
 * it (+0.1·Σa per iteration once the information term collapsed); θ ≥ 0 in all 4096 patterns and
 * `se` reached 1.8 × 10⁷, so 2509 of them could not be stored in `NUMERIC(6,3)`.
 *
 * Bounded by construction (ADR-025 E1): |θ̂ − θ₀| ≤ 6. `se = Infinity` for an empty response
 * vector — §3.4's own ΣI = 0 limit — and never a substituted finite value (Decision 3): an
 * estimator may not fabricate precision at the one point where it has none.
 */
export function computeThetaEstimate(
  responses: Array<{ correct: boolean; a: number; b: number }>,
  initialTheta = 0.0
): { theta: number; se: number } {
  const theta0 = initialTheta;
  const twoSigmaSquared = 2 * THETA_PRIOR_SIGMA * THETA_PRIOR_SIGMA;

  // The grid scan is the "numerical quadrature" of §3.4 in its discrete form. Strict `>` and
  // an ascending scan resolve a tie to the SMALLEST θ (ADR-025 Decision 1), and the index is
  // tracked as an integer so the result is exactly reproducible.
  let bestIndex = -THETA_GRID_HALF_STEPS;
  let bestLogPosterior = -Infinity;

  for (let k = -THETA_GRID_HALF_STEPS; k <= THETA_GRID_HALF_STEPS; k++) {
    const theta = theta0 + k * THETA_GRID_STEP;
    const deviation = theta - theta0;
    // The prior, evaluated as the first factor of §3.4's expression. Its curvature is what
    // bounds the estimate on an all-correct (monotone-likelihood) response set.
    let logPosterior = -(deviation * deviation) / twoSigmaSquared;

    for (const r of responses) {
      const z = r.a * (theta - r.b);
      logPosterior += r.correct ? logSigmoid(z) : logOneMinusSigmoid(z);
    }

    if (logPosterior > bestLogPosterior) {
      bestLogPosterior = logPosterior;
      bestIndex = k;
    }
  }

  const theta = theta0 + bestIndex * THETA_GRID_STEP;

  // §3.4's `SE(θ) = 1 / √(Σ I_i(θ))`, summed at the posterior mode with no prior term.
  let information = 0;
  for (const r of responses) {
    const p = sigmoid(r.a * (theta - r.b));
    information += r.a * r.a * p * (1 - p);
  }

  return { theta, se: information > 0 ? 1 / Math.sqrt(information) : Infinity };
}

/** `N(θ₀, σ²)`'s σ: the scale the rest of the ladder is expressed in (ADR-025 Decision 1). */
const THETA_PRIOR_SIGMA = 1.0;

/** Grid spacing and half-range: `θ₀ ± 600·0.01 = θ₀ ± 6` (ADR-025 Decision 1, E1). */
const THETA_GRID_STEP = 0.01;
const THETA_GRID_HALF_STEPS = 600;

/**
 * `log σ(z) = −log1p(exp(−z))`, the correct-answer 2PL term, evaluated branch-stably.
 *
 * Both halves are bounded: `exp` never receives a positive argument large enough to overflow,
 * and `log1p` keeps full precision as `z → ±∞`.
 */
function logSigmoid(z: number): number {
  return z >= 0 ? -Math.log1p(Math.exp(-z)) : z - Math.log1p(Math.exp(z));
}

/** `log(1 − σ(z)) = log σ(−z)`, the incorrect-answer 2PL term, branch-stable for the same reason. */
function logOneMinusSigmoid(z: number): number {
  return z <= 0 ? -Math.log1p(Math.exp(z)) : -z - Math.log1p(Math.exp(-z));
}

/**
 * `σ(z) = 1 / (1 + exp(−z))`, branch-stable so `exp` never overflows for `|z| → ∞`.
 *
 * Used only for §3.4's Fisher information at θ̂ (`p_i(1 − p_i)`), where the same argument
 * applies as for the log forms above.
 */
function sigmoid(z: number): number {
  if (z >= 0) return 1 / (1 + Math.exp(-z));
  const expZ = Math.exp(z);
  return expZ / (1 + expZ);
}
