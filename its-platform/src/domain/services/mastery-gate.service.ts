/**
 * Mastery Gate — domain service implementing the four-clause gate per ADR-018,
 * curriculum-graph-spec.md §6.1, and stats-progress-evaluation-spec.md §3.2.
 *
 * The gate is a PURE FUNCTION over evidence (never stored). The database stores
 * evidence only; the domain decides.
 *
 * Gate predicate:
 *   p_know ≥ 0.85
 *   ∧ CI₉₅_lower(P) > 0.70
 *   ∧ n_obs ≥ 3
 *   ∧ distinct_days ≥ 2
 *   ∧ spaced_obs ≥ 1
 *
 * Where:
 *   n_eff     = Σ_i exp(−λ_domain · days_since(observation_i))
 *   z         = logit(p_know)
 *   SE_logit  = 1 / √(3 + n_eff)       // 3 = normal-prior pseudo-count
 *   CI₉₅_lower = σ(z − 1.96 · SE_logit)
 *
 * λ (decay rate) per domain per curriculum-graph-spec.md §7.2:
 *   vocabulary:   0.02
 *   grammar:      0.005
 *   pronunciation: 0.03
 *   reading:      0.02  (falls back to vocabulary rate)
 *   listening:    0.02  (falls back to vocabulary rate)
 *   coherence:    0.01  (slower decay)
 */

import { LearnerMastery } from '../entities/learner-model.js';

export interface MasteryEvidence {
  pKnow: number;
  nObs: number;
  distinctDays: number;
  spacedObs: number;
  observations: ReadonlyArray<{ skillId: string; practicedAt: Date }>;
  domain: string;
  now: Date;
}

export interface MasteryGateResult {
  passed: boolean;
  clauses: {
    numeric: boolean;        // p_know ≥ 0.85
    confidence: boolean;     // CI₉₅_lower > 0.70
    nObs: boolean;           // n_obs ≥ 3
    distinctDays: boolean;   // distinct_days ≥ 2
    spacedObs: boolean;      // spaced_obs ≥ 1
  };
  diagnostics: {
    pKnow: number;
    cI95Lower: number;
    nEff: number;
    nObs: number;
    distinctDays: number;
    spacedObs: number;
  };
}

const LAMBDA_BY_DOMAIN: Readonly<Record<string, number>> = {
  vocabulary: 0.02,
  grammar: 0.005,
  pronunciation: 0.03,
  reading: 0.02,
  listening: 0.02,
  coherence: 0.01,
} as const;

const DEFAULT_LAMBDA = 0.02;

const PSEUDO_COUNT = 3;
const Z_95 = 1.96;
const NUMERIC_THRESHOLD = 0.85;
const CI_LOWER_THRESHOLD = 0.70;
const MIN_OBS = 3;
const MIN_DISTINCT_DAYS = 2;
const MIN_SPACED_OBS = 1;

function logit(p: number): number {
  // Clamp to avoid ±Infinity
  const eps = 1e-12;
  const clamped = Math.max(eps, Math.min(1 - eps, p));
  return Math.log(clamped / (1 - clamped));
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function getLambda(domain: string): number {
  return LAMBDA_BY_DOMAIN[domain.toLowerCase()] ?? DEFAULT_LAMBDA;
}

export class MasteryGateService {
  /**
   * Evaluates the mastery gate for a single skill.
   *
   * @param evidence — LearnerMastery entity + observation timestamps + domain + current time
   * @returns MasteryGateResult with pass/fail and clause diagnostics
   */
  evaluate(evidence: MasteryEvidence): MasteryGateResult {
    const { pKnow, nObs, distinctDays, spacedObs, observations, domain, now } = evidence;

    // Clause 1: numeric threshold
    const numeric = pKnow >= NUMERIC_THRESHOLD;

    // Clause 2: CI lower bound
    const lambda = getLambda(domain);
    const nEff = this.computeEffectiveSampleSize(observations, lambda, now);
    const z = logit(pKnow);
    const seLogit = 1 / Math.sqrt(PSEUDO_COUNT + nEff);
    const ci95Lower = sigmoid(z - Z_95 * seLogit);
    const confidence = ci95Lower > CI_LOWER_THRESHOLD;

    // Clauses 3–5: evidence requirements
    const nObsClause = nObs >= MIN_OBS;
    const distinctDaysClause = distinctDays >= MIN_DISTINCT_DAYS;
    const spacedObsClause = spacedObs >= MIN_SPACED_OBS;

    const passed = numeric && confidence && nObsClause && distinctDaysClause && spacedObsClause;

    return {
      passed,
      clauses: {
        numeric,
        confidence,
        nObs: nObsClause,
        distinctDays: distinctDaysClause,
        spacedObs: spacedObsClause,
      },
      diagnostics: {
        pKnow,
        cI95Lower: ci95Lower,
        nEff,
        nObs,
        distinctDays,
        spacedObs,
      },
    };
  }

  /**
   * Evaluates the gate for multiple skills (e.g., all prerequisites of a lesson).
   * Returns a map of skillId → gate result.
   */
  evaluateAll(evidenceMap: Map<string, MasteryEvidence>): Map<string, MasteryGateResult> {
    const results = new Map<string, MasteryGateResult>();
    for (const [skillId, evidence] of evidenceMap) {
      results.set(skillId, this.evaluate(evidence));
    }
    return results;
  }

  /**
   * Checks if ALL skills in a set pass the gate (used for lesson/module entry).
   */
  allPass(evidenceMap: Map<string, MasteryEvidence>): boolean {
    for (const result of this.evaluateAll(evidenceMap).values()) {
      if (!result.passed) return false;
    }
    return true;
  }

  /**
   * Computes effective sample size n_eff = Σ exp(−λ · days_since).
   * Observations are expected to be sorted newest first (most recent first).
   */
  private computeEffectiveSampleSize(
    observations: ReadonlyArray<{ skillId: string; practicedAt: Date }>,
    lambda: number,
    now: Date
  ): number {
    if (observations.length === 0) return 0;

    let nEff = 0;
    for (const obs of observations) {
      const daysSince = (now.getTime() - obs.practicedAt.getTime()) / (1000 * 60 * 60 * 24);
      nEff += Math.exp(-lambda * daysSince);
    }
    return nEff;
  }

  /**
   * Evaluates the module-level gate (curriculum-graph-spec §6.2):
   *   Mean_{skills in mod_X} P(mastery) ≥ 0.85
   *   AND min_{skills in mod_X} P(mastery) ≥ 0.60
   */
  evaluateModuleGate(
    skillEvidences: ReadonlyArray<MasteryEvidence>
  ): { passed: boolean; meanP: number; minP: number } {
    if (skillEvidences.length === 0) return { passed: false, meanP: 0, minP: 0 };

    const meanP = skillEvidences.reduce((sum, e) => sum + e.pKnow, 0) / skillEvidences.length;
    const minP = Math.min(...skillEvidences.map(e => e.pKnow));

    const passed = meanP >= NUMERIC_THRESHOLD && minP >= 0.60;
    return { passed, meanP, minP };
  }

  /**
   * Evaluates acceleration (skip) gate (curriculum-graph-spec §6.3):
   *   P(mastery_skills(les_B)) ≥ 0.95
   *   AND CI₉₅_lower > 0.85
   *   AND time_on_les_B < 0.5 * median_time(les_B)
   *   AND diagnostic θ for those skills > les_B target θ
   */
  evaluateAccelerationGate(
    skillEvidences: ReadonlyArray<MasteryEvidence>,
    timeOnLessonMinutes: number,
    medianLessonTimeMinutes: number,
    diagnosticTheta: Map<string, number>,
    lessonTargetTheta: Map<string, number>
  ): { passed: boolean; diagnostics: string[] } {
    const diagnostics: string[] = [];
    let allPass = true;

    for (const evidence of skillEvidences) {
      const result = this.evaluate(evidence);
      if (evidence.pKnow < 0.95) {
        allPass = false;
        diagnostics.push(`skill ${evidence.domain}: pKnow ${evidence.pKnow.toFixed(3)} < 0.95`);
      }
      if (result.diagnostics.cI95Lower <= 0.85) {
        allPass = false;
        diagnostics.push(`skill ${evidence.domain}: CI95_lower ${result.diagnostics.cI95Lower.toFixed(3)} ≤ 0.85`);
      }
    }

    if (timeOnLessonMinutes >= 0.5 * medianLessonTimeMinutes) {
      allPass = false;
      diagnostics.push(`time ${timeOnLessonMinutes}min ≥ 0.5 * median ${medianLessonTimeMinutes}min`);
    }

    for (const [skillId, theta] of diagnosticTheta) {
      const target = lessonTargetTheta.get(skillId);
      if (target !== undefined && theta <= target) {
        allPass = false;
        diagnostics.push(`skill ${skillId}: theta ${theta.toFixed(2)} ≤ target ${target.toFixed(2)}`);
      }
    }

    return { passed: allPass, diagnostics };
  }
}

/**
 * Helper to build MasteryEvidence from LearnerMastery entity + observation history.
 */
export function buildMasteryEvidence(
  mastery: LearnerMastery,
  observations: ReadonlyArray<{ skillId: string; practicedAt: Date }>,
  domain: string,
  now: Date = new Date()
): MasteryEvidence {
  return {
    pKnow: mastery.pKnow,
    nObs: mastery.nObs,
    distinctDays: mastery.distinctDays,
    spacedObs: mastery.spacedObs,
    observations: observations.filter(o => o.skillId === mastery.skillId),
    domain,
    now,
  };
}