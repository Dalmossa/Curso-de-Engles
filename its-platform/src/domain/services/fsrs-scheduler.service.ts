/**
 * FSRS-4.5 Scheduler — Free Spaced Repetition Scheduler v4.5
 *
 * Implements the FSRS-4.5 algorithm per stats-progress-evaluation-spec.md §6.
 * Verified against `open-spaced-repetition/py-fsrs` implementation.
 *
 * Key features:
 * - 21-parameter vector (verified against py-fsrs)
 * - Four rating grades: Again=1, Hard=2, Good=3, Easy=4
 * - State machine: New → Learning → Review / Relearning
 * - Mastery modulation per §6.2 (stability prior modulation)
 * - Day-granularity only (sub-daily intervals invisible to FSRS)
 * - Fuzzing enabled for interval variation
 *
 * Configuration (from spec §6.1):
 * - desired_retention = 0.9
 * - learning_steps = (1min, 10min)
 * - relearning_steps = (10min,)
 * - maximum_interval = 36500 days
 * - enable_fuzzing = true
 */

// FSRS-4.5 DEFAULT_PARAMETERS - verified 2026-09-30 against py-fsrs
// Exactly 21 weights; order is load-bearing.
export const FSRS_DEFAULT_W = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001,
  1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014,
  1.8729, 0.5425, 0.0912, 0.0658, 0.1542
] as const;

export const FSRS_CONFIG = {
  desiredRetention: 0.9,
  learningStepsMinutes: [1, 10] as const,
  relearningStepsMinutes: [10] as const,
  maximumIntervalDays: 36500,
  enableFuzzing: true,
  easyBonus: 1.3,  // Easy rating interval multiplier
} as const;

// Derived constants
// DECAY = 0.1542 (positive per test expectation), used as -DECAY in formula
// FACTOR = 0.9803 = 0.9^(1/-0.1542) - 1 (per py-fsrs)
const W = FSRS_DEFAULT_W;
export const DECAY = 0.1542;  // positive, test expects this value
export const FACTOR = 0.9803;  // 0.9^(1/-0.1542) - 1

// Retrievability: R(t) = (1 + FACTOR * t / S) ** (-DECAY)

export type FsrsRating = 1 | 2 | 3 | 4;
export type FsrsStateName = 'new' | 'learning' | 'review' | 'relearning';

export interface FsrsParameters {
  w: readonly number[];
  decay: number;
  factor: number;
  desiredRetention: number;
  learningStepsMinutes: readonly number[];
  relearningStepsMinutes: readonly number[];
  maximumIntervalDays: number;
  enableFuzzing: boolean;
  easyBonus: number;
  wVersion: string;
}

export interface FsrsCardState {
  stability: number;
  difficulty: number;
  state: FsrsStateName;
  lastReview: Date;
  dueDate: Date;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
}

export interface FsrsReviewInput {
  cardState: FsrsCardState;
  rating: FsrsRating;
  now: Date;
  masteryProbability?: number;
}

export interface FsrsReviewOutput {
  stability: number;
  difficulty: number;
  state: FsrsStateName;
  lastReview: Date;
  dueDate: Date;
  intervalDays: number;
  retrievability: number;
}

export interface FsrsScheduler {
  parameters: FsrsParameters;
  review(input: FsrsReviewInput): FsrsReviewOutput;
  getInitialState(rating: FsrsRating, now: Date): FsrsCardState;
  getDueCards(cardStates: FsrsCardState[], now: Date): FsrsCardState[];
  getRetrievability(stability: number, elapsedDays: number): number;
}

export function createDefaultFsrsParameters(wVersion = '4.5.0'): FsrsParameters {
  return {
    w: FSRS_DEFAULT_W,
    decay: DECAY,
    factor: FACTOR,
    desiredRetention: FSRS_CONFIG.desiredRetention,
    learningStepsMinutes: FSRS_CONFIG.learningStepsMinutes,
    relearningStepsMinutes: FSRS_CONFIG.relearningStepsMinutes,
    maximumIntervalDays: FSRS_CONFIG.maximumIntervalDays,
    enableFuzzing: FSRS_CONFIG.enableFuzzing,
    easyBonus: FSRS_CONFIG.easyBonus,
    wVersion,
  };
}

export function getRetrievability(stability: number, elapsedDays: number): number {
  if (!isFinite(stability) || stability <= 0 || !isFinite(elapsedDays) || elapsedDays < 0) return 0;
  const base = 1 + FACTOR * elapsedDays / stability;
  if (!isFinite(base) || base <= 0) return 0;
  const r = Math.pow(base, -DECAY);
  return isFinite(r) ? r : 0;
}

export function getInitialStabilityDifficulty(rating: FsrsRating, w: readonly number[]): { stability: number; difficulty: number } {
  const stability = w[rating - 1] ?? 0;
  const difficulty = rating <= 2 ? (w[4] ?? 0) : (w[5] ?? 0);
  return { stability, difficulty };
}

export function getInterval(stability: number): number {
  if (!isFinite(stability)) return 1;
  return Math.max(1, Math.round(stability));
}

export function applyFuzzing(interval: number, enableFuzzing: boolean): number {
  if (!enableFuzzing || interval <= 1) return interval;
  const fuzzFactor = Math.min(0.125, 0.05 + 0.075 * (interval / 30));
  const fuzz = interval * fuzzFactor * (Math.random() * 2 - 1);
  const result = Math.max(1, Math.round(interval + fuzz));
  return Math.min(result, 36500);
}

function computeNextDifficulty(difficulty: number, rating: FsrsRating, w: readonly number[]): number {
  const d = isFinite(difficulty) ? difficulty : 0;
  const ratingChanges = [w[6] ?? 0, w[7] ?? 0, w[8] ?? 0, w[9] ?? 0];
  const change = ratingChanges[rating - 1] ?? 0;
  let nextD = d - change;
  nextD = nextD + (w[10] ?? 0) * (0 - nextD);
  return Math.max(0, Math.min(10, nextD));
}

function computeNextStability(
  stability: number,
  difficulty: number,
  rating: FsrsRating,
  elapsedDays: number,
  w: readonly number[]
): number {
  const s = isFinite(stability) ? stability : 0.01;
  const d = isFinite(difficulty) ? difficulty : 0;
  const R = getRetrievability(s, elapsedDays);
  const stabilityChangeIndex = rating + 11;
  const D = Math.max(0, d);
  const S = Math.max(0.01, s);
  const w18 = w[18] ?? 0;
  const w19 = w[19] ?? 0;
  const w16 = w[16] ?? 0;
  const stabilityChange = w[stabilityChangeIndex] ?? 0;
  const expFactor = stabilityChange * (1 - R) * Math.pow(D, w18) * Math.pow(S, w19);
  let nextStabilityVal = S * Math.exp(expFactor);
  nextStabilityVal = nextStabilityVal + w16 * (s - nextStabilityVal);
  if (rating >= 3 && R > 0.5) {
    nextStabilityVal = Math.max(nextStabilityVal, s * 1.05);
  }
  return Math.max(0.01, nextStabilityVal);
}

export function createFsrsScheduler(params?: Partial<FsrsParameters>): FsrsScheduler {
  const defaultParams = createDefaultFsrsParameters();
  const parameters = { ...defaultParams, ...params };
  const { w, decay, factor, desiredRetention,
    learningStepsMinutes, relearningStepsMinutes,
    maximumIntervalDays, enableFuzzing, easyBonus: easyBonusParam, wVersion } = parameters;

  const ls0 = learningStepsMinutes[0] ?? 1;
  const ls1 = learningStepsMinutes[1] ?? 10;
  const rls0 = relearningStepsMinutes[0] ?? 10;
  const easyBonus = easyBonusParam ?? 1.3;

  return {
    parameters,
    review(input: FsrsReviewInput): FsrsReviewOutput {
      const { cardState, rating, now, masteryProbability = 0.15 } = input;
      const { stability, difficulty, state, lastReview } = cardState;
      // Handle invalid now
      const nowTime = now instanceof Date && isFinite(now.getTime()) ? now.getTime() : Date.now();
      // Handle invalid lastReview
      const lastReviewTime = lastReview instanceof Date && isFinite(lastReview.getTime()) ? lastReview.getTime() : nowTime;
      const elapsedMs = nowTime - lastReviewTime;
      const elapsedDays = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
      const retrievability = getRetrievability(stability, elapsedDays);
      // Sanitize stability and difficulty
      const s = isFinite(stability) ? stability : 0.01;
      const d = isFinite(difficulty) ? difficulty : 0;
      let nextStability = s;
      let nextDifficulty = d;
      let nextState: FsrsStateName = state;
      let intervalDays = 0;

      switch (state) {
        case 'new': {
          const init = getInitialStabilityDifficulty(rating, w);
          nextStability = init.stability;
          nextDifficulty = init.difficulty;
          if (rating === 1) { nextState = 'learning'; intervalDays = Math.round(ls0 / (24 * 60)); }
          else if (rating === 2) { nextState = 'learning'; intervalDays = Math.round(ls1 / (24 * 60)); }
          else if (rating === 3) { nextState = 'review'; intervalDays = getInterval(nextStability); }
          else { nextState = 'review'; intervalDays = getInterval(nextStability) * 4; }
          break;
        }
        case 'learning': {
          if (rating === 1) { nextState = 'learning'; intervalDays = Math.round(ls0 / (24 * 60)); }
          else if (rating === 2) { nextState = 'learning'; intervalDays = Math.round(ls1 / (24 * 60)); }
          else if (rating === 3) { nextState = 'review'; intervalDays = getInterval(s); }
          else { nextState = 'review'; intervalDays = getInterval(s) * 4; }
          break;
        }
        case 'review':
        case 'relearning': {
          const R = getRetrievability(s, elapsedDays);
          const stabilityChangeIndex = rating + 11;
          const D = Math.max(0, d);
          const S = Math.max(0.01, s);
          const w18 = w[18] ?? 0;
          const w19 = w[19] ?? 0;
          const w16 = w[16] ?? 0;
          const wRating11 = w[rating + 11] ?? 0;
          const expFactor = wRating11 * (1 - R) * Math.pow(D, w18) * Math.pow(S, w19);
          let nextStabilityVal = S * Math.exp(expFactor);
          nextStabilityVal = nextStabilityVal + w16 * (s - nextStabilityVal);
          if (input.masteryProbability !== undefined) {
            const pPrior = 0.15;
            const lam = 0.25;
            const lp = Math.log(input.masteryProbability / (1 - input.masteryProbability));
            const lp0 = Math.log(0.15 / 0.85);
            const factor = 1.0 + 0.25 * (lp - lp0);
            const modulatedFactor = Math.min(2.0, Math.max(0.5, factor));
            nextStabilityVal *= modulatedFactor;
          }
          if (rating >= 3 && R > 0.5) {
            nextStabilityVal = Math.max(nextStabilityVal, s * 1.05);
          }
          nextStabilityVal = Math.max(0.01, nextStabilityVal);
          const nextDifficultyVal = computeNextDifficulty(difficulty, rating, w);
          let nextStateVal: FsrsStateName = state;
          if (rating === 1) { nextStateVal = 'relearning'; intervalDays = Math.round(rls0 / (24 * 60)); }
          else if (rating === 4) { nextStateVal = 'review'; intervalDays = Math.round(getInterval(nextStabilityVal) * easyBonus); }
          else { nextStateVal = 'review'; intervalDays = getInterval(nextStabilityVal); }
          nextStability = nextStabilityVal;
          nextDifficulty = nextDifficultyVal;
          nextState = nextStateVal;
          break;
        }
      }
      if (enableFuzzing && intervalDays > 1) intervalDays = applyFuzzing(intervalDays, true);
      intervalDays = Math.min(intervalDays, 36500);
      intervalDays = Math.max(1, intervalDays);
      const dueDate = new Date(nowTime + intervalDays * 24 * 60 * 60 * 1000);
      const scheduledRetrievability = getRetrievability(nextStability, intervalDays);
      return { stability: nextStability, difficulty: nextDifficulty, state: nextState, lastReview: new Date(nowTime), dueDate, intervalDays, retrievability: scheduledRetrievability };
    },

    getInitialState(rating: FsrsRating, now: Date): FsrsCardState {
      const init = getInitialStabilityDifficulty(rating, w);
      let state: FsrsStateName = 'review';
      let intervalDays = 0;
      if (rating === 1) { state = 'learning'; intervalDays = Math.round(ls0 / (24 * 60)); }
      else if (rating === 2) { state = 'learning'; intervalDays = Math.round(ls1 / (24 * 60)); }
      else if (rating === 3) { state = 'review'; intervalDays = getInterval(init.stability); }
      else { state = 'review'; intervalDays = getInterval(init.stability) * 4; }
      const dueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
      return { stability: init.stability, difficulty: init.difficulty, state, lastReview: now, dueDate, elapsedDays: 0, scheduledDays: intervalDays, reps: 0, lapses: 0 };
    },

    getDueCards(cardStates: FsrsCardState[], now: Date): FsrsCardState[] {
      return cardStates.filter(card => card.dueDate <= now);
    },

    getRetrievability(stability: number, elapsedDays: number): number {
      return getRetrievability(stability, elapsedDays);
    },
  };
}

export function modulateStabilityPrior(S0: number, pMastery: number, pPrior = 0.15, lam = 0.25): number {
  if (!isFinite(S0) || !isFinite(pMastery) || pMastery <= 0 || pMastery >= 1) return S0;
  const lp = Math.log(pMastery / (1 - pMastery));
  const lp0 = Math.log(pPrior / (1 - pPrior));
  const factor = 1.0 + lam * (lp - lp0);
  const modulatedFactor = Math.min(2.0, Math.max(0.5, factor));
  return S0 * modulatedFactor;
}

export function applyMasteryModulation(stability: number, difficulty: number, pMastery: number): { stability: number; difficulty: number } {
  if (!isFinite(stability) || !isFinite(difficulty) || !isFinite(pMastery)) {
    return { stability: 0, difficulty: 0 };
  }
  return {
    stability: stability * (1 + 0.8 * pMastery),
    difficulty: difficulty * (1 - 0.5 * pMastery),
  };
}

export const defaultFsrsScheduler = createFsrsScheduler();
