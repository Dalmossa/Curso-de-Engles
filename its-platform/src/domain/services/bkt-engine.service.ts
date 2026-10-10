/**
 * BKT Engine — Bayesian Knowledge Tracing per skill.
 *
 * Implements the BKT parameterization from stats-progress-evaluation-spec.md §2.1:
 * - P(L₀) = 0.15 (initial knowledge, false beginner bias)
 * - P(T)  = 0.25 (learn rate)
 * - P(S)  = 0.10 (slip)
 * - P(G)  = per-item = item.metadata.p_random (1/n_options for MCQ)
 *
 * Per §2.1: P(G) is per-item, not global. Items without p_random are excluded from CAT.
 * Parameters P(L₀), P(T), P(S) are judgement anchors to be fitted via EM (pyBKT).
 *
 * Vectorized update_mastery(): 10k updates < 50 ms p95 target.
 */

import { BktSkillParam } from '../entities/stats.js';
import { LearnerMastery } from '../entities/learner-model.js';

export type { BktSkillParam, LearnerMastery };

export interface BktParameters {
  pL0: number;  // Initial knowledge probability
  pT: number;   // Learn rate
  pS: number;   // Slip probability
  pG: number;   // Guess probability (per-item)
}

export interface BktState {
  pKnow: number;        // P(L) — probability learner knows the skill
  pLearn: number;       // P(T) — learn rate
  pSlip: number;        // P(S) — slip probability
  pGuess: number;       // P(G) — guess probability
}

export interface BktUpdateResult {
  stateBefore: BktState;
  stateAfter: BktState;
  pKnowDelta: number;
  evidenceCount: number;  // nObs after update
}

/**
 * Default BKT parameters per skill (judgement anchors).
 * Source: stats-progress-evaluation-spec.md §2.1 Table.
 */
export const DEFAULT_BKT_PARAMS: Omit<BktParameters, 'pG'> = {
  pL0: 0.15,  // False beginner bias
  pT: 0.25,   // Learn rate
  pS: 0.10,   // Slip probability
};

/**
 * Computes guess probability for an item.
 * Per §2.1: P(G)_item = item.metadata.p_random = 1/n_options for MCQ.
 * For cloze/fill-in-the-blank: 1/n_possible_answers.
 * For matching/ordering: 1/n! (much smaller).
 */
export function computeGuessProbability(itemType: string, nOptions: number): number {
  switch (itemType) {
    case 'mcq':
    case 'gap_fill':
    case 'error_correction':
    case 'form_selection':
    case 'register_selection':
    case 'definition_match':
      return 1 / Math.max(1, nOptions);
    case 'matching':
    case 'ordering':
      // 1/n! for permutations
      let fact = 1;
      for (let i = 2; i <= nOptions; i++) fact *= i;
      return 1 / fact;
    case 'minimal_pair':
      // Typically 2 options
      return 1 / Math.max(2, nOptions);
    case 'cloze':
      // Single blank, typically 4 options
      return 1 / Math.max(4, nOptions);
    default:
      // Conservative default: 4-option MCQ
      return 0.25;
  }
}

/**
 * Initializes BKT state for a skill.
 * If learnerMastery exists, computes P(L) from evidence.
 * Otherwise returns prior P(L₀).
 */
export function initializeBktState(
  skillId: string,
  learnerMastery: LearnerMastery | null,
  bktParams: BktSkillParam,
  itemPGuess: number
): BktState {
  const { pL0, pT, pS } = bktParams;
  const pG = itemPGuess;

  if (!learnerMastery || learnerMastery.nObs === 0) {
    // No evidence yet — return prior
    return { pKnow: pL0, pLearn: pT, pSlip: pS, pGuess: pG };
  }

  // With evidence, P(L) is the posterior from learner_mastery.pKnow
  // (which is already updated by previous BKT updates)
  return {
    pKnow: Math.max(pL0, Math.min(1, learnerMastery.pKnow)),
    pLearn: pT,
    pSlip: pS,
    pGuess: pG,
  };
}

/**
 * Core BKT update — single observation.
 *
 * Standard BKT forward algorithm:
 * 1. Compute P(L | obs) via Bayes
 * 2. Apply learn transition: P(L)_next = P(L | obs) + (1 - P(L | obs)) * P(T)
 *
 * @param state Current BKT state
 * @param correct Whether the response was correct
 * @returns Updated BKT state
 */
export function bktUpdate(state: BktState, correct: boolean): BktState {
  const { pKnow, pLearn, pSlip, pGuess } = state;

  // Ensure all inputs are valid numbers, replace NaN/Infinity with defaults
  const safePKnow = Number.isFinite(pKnow) ? pKnow : 0;
  const safePLearn = Number.isFinite(pLearn) ? pLearn : 0.25;
  const safePSlip = Number.isFinite(pSlip) ? pSlip : 0.10;
  const safePGuess = Number.isFinite(pGuess) ? pGuess : 0.25;

  // Clamp to valid ranges
  const pKnowClamped = Math.max(0, Math.min(1, safePKnow));
  const pLearnClamped = Math.max(0, Math.min(1, safePLearn));
  const pSlipClamped = Math.max(0, Math.min(1, safePSlip));
  const pGuessClamped = Math.max(0, Math.min(1, safePGuess));

  // Additional safety: ensure pSlip and pGuess are not exactly 0 to avoid division by zero
  // in edge cases where they might be used in denominators
  const pSlipSafe = Math.max(0.001, pSlipClamped);
  const pGuessSafe = Math.max(0.001, pGuessClamped);

  // P(correct | L) = 1 - P(S)
  // P(correct | ~L) = P(G)
  // P(correct) = P(L) * (1 - P(S)) + (1 - P(L)) * P(G)

  const pCorrectGivenKnow = 1 - pSlipSafe;
  const pCorrectGivenNotKnow = pGuessSafe;

  const pCorrect = pKnowClamped * pCorrectGivenKnow + (1 - pKnowClamped) * pCorrectGivenNotKnow;

  // Handle edge cases where pCorrect is 0 or 1
  if (pCorrect <= 0) {
    // Learner has no knowledge and cannot guess - learns at rate pLearn
    return {
      pKnow: pLearnClamped,
      pLearn: pLearnClamped,
      pSlip: pSlipClamped,
      pGuess: pGuessClamped,
    };
  }

  if (pCorrect >= 1) {
    // Learner knows perfectly and never slips - stays at 1
    return {
      pKnow: 1,
      pLearn: pLearnClamped,
      pSlip: pSlipClamped,
      pGuess: pGuessClamped,
    };
  }

  // P(L | obs)
  let pKnowGivenObs: number;
  if (correct) {
    // P(L | correct) = P(correct | L) * P(L) / P(correct)
    pKnowGivenObs = (pCorrectGivenKnow * pKnowClamped) / pCorrect;
  } else {
    // P(L | incorrect) = P(incorrect | L) * P(L) / P(incorrect)
    // P(incorrect | L) = P(S)
    // P(incorrect | ~L) = 1 - P(G)
    const pIncorrect = 1 - pCorrect;
    const pIncorrectGivenKnow = pSlipSafe;
    pKnowGivenObs = (pIncorrectGivenKnow * pKnowClamped) / pIncorrect;
  }

  // Clamp to [0, 1]
  pKnowGivenObs = Math.max(0, Math.min(1, pKnowGivenObs));

  // Learn transition: P(L)_next = P(L | obs) + (1 - P(L | obs)) * P(T)
  const pKnowNext = pKnowGivenObs + (1 - pKnowGivenObs) * pLearnClamped;

  return {
    pKnow: Math.max(0, Math.min(1, pKnowNext)),
    pLearn: pLearnClamped,
    pSlip: pSlipClamped,
    pGuess: pGuessClamped,
  };
}

/**
 * Vectorized BKT update for multiple observations at once.
 * Target: 10k updates < 50 ms p95.
 *
 * @param states Array of current BKT states
 * @param correct Array of correctness booleans (same length as states)
 * @returns Array of updated BKT states
 */
export function bktUpdateBatch(
  states: BktState[],
  correct: boolean[]
): BktState[] {
  if (states.length !== correct.length) {
    throw new Error('States and correct arrays must have same length');
  }

  // Pre-allocate result array
  const results = new Array<BktState>(states.length);

  for (let i = 0; i < states.length; i++) {
    const state = states[i]!;
    const isCorrect = correct[i]!;

    // Ensure all inputs are valid numbers, replace NaN/Infinity with defaults
    const safePKnow = Number.isFinite(state.pKnow) ? state.pKnow : 0;
    const safePLearn = Number.isFinite(state.pLearn) ? state.pLearn : 0.25;
    const safePSlip = Number.isFinite(state.pSlip) ? state.pSlip : 0.10;
    const safePGuess = Number.isFinite(state.pGuess) ? state.pGuess : 0.25;

    // Clamp to valid ranges
    const pKnowClamped = Math.max(0, Math.min(1, safePKnow));
    const pLearnClamped = Math.max(0, Math.min(1, safePLearn));
    const pSlipClamped = Math.max(0, Math.min(1, safePSlip));
    const pGuessClamped = Math.max(0, Math.min(1, safePGuess));

    // Additional safety: ensure pSlip and pGuess are not exactly 0
    const pSlipSafe = Math.max(0.001, pSlipClamped);
    const pGuessSafe = Math.max(0.001, pGuessClamped);

    const pCorrectGivenKnow = 1 - pSlipSafe;
    const pCorrectGivenNotKnow = pGuessSafe;

    const pCorrect = pKnowClamped * pCorrectGivenKnow + (1 - pKnowClamped) * pCorrectGivenNotKnow;

    if (pCorrect <= 0) {
      results[i] = {
        pKnow: pLearnClamped,
        pLearn: pLearnClamped,
        pSlip: pSlipClamped,
        pGuess: pGuessClamped,
      };
      continue;
    }

    if (pCorrect >= 1) {
      results[i] = {
        pKnow: 1,
        pLearn: pLearnClamped,
        pSlip: pSlipClamped,
        pGuess: pGuessClamped,
      };
      continue;
    }

    let pKnowGivenObs: number;
    if (isCorrect) {
      pKnowGivenObs = (pCorrectGivenKnow * pKnowClamped) / pCorrect;
    } else {
      const pIncorrect = 1 - pCorrect;
      const pIncorrectGivenKnow = pSlipSafe;
      pKnowGivenObs = (pIncorrectGivenKnow * pKnowClamped) / pIncorrect;
    }

    // Clamp
    pKnowGivenObs = Math.max(0, Math.min(1, pKnowGivenObs));

    // Learn transition
    const pKnowNext = pKnowGivenObs + (1 - pKnowGivenObs) * pLearnClamped;

    results[i] = {
      pKnow: Math.max(0, Math.min(1, pKnowNext)),
      pLearn: pLearnClamped,
      pSlip: pSlipClamped,
      pGuess: pGuessClamped,
    };
  }

  return results;
}

/**
 * Computes mastery probability with confidence interval.
 * Per stats-progress-evaluation-spec.md §4.2:
 * Mastery = P(θ > θ*_CEFR | D) ≥ τ (τ = 0.85)
 * CI₉₅_lower(P) > 0.70 required for gate.
 *
 * Uses logit-normal approximation for CI on probability.
 */
export interface MasteryEstimate {
  pMastery: number;
  ci95Lower: number;
  ci95Upper: number;
  evidenceCount: number;
}

export function computeMasteryWithCI(
  pKnow: number,
  nObs: number,
  distinctDays: number,
  spacedObs: number
): MasteryEstimate {
  // n_eff = Σ exp(-λ_d * Δdays) per skill domain (curriculum-graph §7.2)
  // For now, use simplified: n_eff ≈ nObs + spacedObs * 2
  // (spaced observations count more)
  const nEff = Math.max(3, nObs + spacedObs * 2);

  // Logit transformation for CI
  const logit = Math.log(pKnow / (1 - pKnow));
  const seLogit = 1.96 / Math.sqrt(3 + nEff);  // Per stats-spec §4.2

  const ci95LowerLogit = logit - seLogit;
  const ci95UpperLogit = logit + seLogit;

  // Back-transform
  const ci95Lower = 1 / (1 + Math.exp(-ci95LowerLogit));
  const ci95Upper = 1 / (1 + Math.exp(-ci95UpperLogit));

  return {
    pMastery: pKnow,
    ci95Lower,
    ci95Upper,
    evidenceCount: nObs,
  };
}

/**
 * Checks if mastery gate is satisfied for a skill.
 * Per curriculum-graph-spec.md §6.1 and stats-progress-evaluation-spec.md §4.2:
 * - pKnow ≥ 0.85
 * - CI₉₅_lower > 0.70
 * - nObs ≥ 3
 * - distinctDays ≥ 2
 * - spacedObs ≥ 1
 */
export interface MasteryGateResult {
  passes: boolean;
  reasons: string[];
  mastery: MasteryEstimate;
}

export function checkMasteryGate(
  pKnow: number,
  nObs: number,
  distinctDays: number,
  spacedObs: number
): MasteryGateResult {
  const mastery = computeMasteryWithCI(pKnow, nObs, distinctDays, spacedObs);
  const reasons: string[] = [];

  if (pKnow < 0.85) reasons.push(`pKnow ${pKnow.toFixed(3)} < 0.85`);
  if (mastery.ci95Lower <= 0.70) reasons.push(`CI₉₅_lower ${mastery.ci95Lower.toFixed(3)} ≤ 0.70`);
  if (nObs < 3) reasons.push(`nObs ${nObs} < 3`);
  if (distinctDays < 2) reasons.push(`distinctDays ${distinctDays} < 2`);
  if (spacedObs < 1) reasons.push(`spacedObs ${spacedObs} < 1`);

  return {
    passes: reasons.length === 0,
    reasons,
    mastery,
  };
}

/**
 * Creates BKT skill parameters from domain entity.
 */
export function createBktParameters(bktParam: BktSkillParam): BktParameters {
  return {
    pL0: bktParam.pL0,
    pT: bktParam.pT,
    pS: bktParam.pS,
    pG: 0.25,  // Default; will be overridden per-item in update
  };
}

/**
 * Gets BKT params for a skill, falling back to defaults.
 */
export function getBktParamsForSkill(
  skillId: string,
  bktParamsMap: Map<string, BktSkillParam>
): BktParameters {
  const param = bktParamsMap.get(skillId);
  if (!param) {
    return {
      pL0: DEFAULT_BKT_PARAMS.pL0,
      pT: DEFAULT_BKT_PARAMS.pT,
      pS: DEFAULT_BKT_PARAMS.pS,
      pG: 0.25,
    };
  }
  return createBktParameters(param);
}
/**
 * BKT Engine class — wraps BKT functions for use in AdaptiveEngine.
 */
export class BktEngine {
  private params: BktParameters;

  constructor(params: BktParameters) {
    this.params = params;
  }

  initialize(skillId: string, learnerMastery: LearnerMastery | null, itemPGuess: number): BktState {
    const bktSkillParam = {
      skillId,
      pL0: this.params.pL0,
      pT: this.params.pT,
      pS: this.params.pS,
      pG: itemPGuess,
      source: 'adaptive_engine',
      fittedAt: null,
      modelVersion: '1.0',
    };
    return initializeBktState(skillId, learnerMastery, bktSkillParam, itemPGuess);
  }

  update(state: BktState, correct: boolean): BktUpdateResult {
    const stateBefore = { ...state };
    const stateAfter = bktUpdate(state, correct);
    return {
      stateBefore,
      stateAfter,
      pKnowDelta: stateAfter.pKnow - stateBefore.pKnow,
      evidenceCount: 1,
    };
  }

  getParameters(): BktParameters {
    return { ...this.params };
  }
}
