export { MasteryGateService, buildMasteryEvidence } from './mastery-gate.service.js';
export type { MasteryEvidence, MasteryGateResult } from './mastery-gate.service.js';

export { NextActivitySelector } from './next-activity-selector.js';
export type {
  NextActivityCandidate,
  NextActivitySelection,
  LearnerModel,
  FsrsState,
  ActivityType,
} from './next-activity-selector.js';

export { BktEngine, DEFAULT_BKT_PARAMS, computeGuessProbability } from './bkt-engine.service.js';
export type {
  BktParameters,
  BktState,
  BktUpdateResult,
  BktSkillParam,
} from './bkt-engine.service.js';

export { createFsrsScheduler, defaultFsrsScheduler } from './fsrs-scheduler.service.js';
export type {
  FsrsParameters,
  FsrsCardState,
  FsrsReviewInput,
  FsrsReviewOutput,
  FsrsScheduler,
  FsrsRating,
  FsrsStateName,
} from './fsrs-scheduler.service.js';

export { ErrorLogService } from './error-log.service.js';
export type { ErrorLogEntry } from './error-log.service.js';

export { AdaptiveEngine } from './adaptive-engine.service.js';
export type {
  AdaptiveEngineConfig,
  LearnerProfile,
  PracticeResult,
  LessonCompletion,
  DiagnosticResult,
  AdaptiveEngineResult,
} from './adaptive-engine.service.js';

export {
  AuditChainVerifier,
  verifyAuditChain,
  serializeAuditRow,
  hashAuditRow,
} from './audit-chain-verifier.js';
export type { AuditChainRow, AuditChainResult, AuditChainReader } from './audit-chain-verifier.js';
