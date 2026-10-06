import { LearnerEntity } from '../entities/learner.entity.js';
import { LearnerMasteryEntity } from '../entities/learner-mastery.entity.js';
import { ThetaEstimateEntity } from '../entities/theta-estimate.entity.js';
import { FsrsStateEntity } from '../entities/fsrs-state.entity.js';
import { ErrorLogEntity } from '../entities/error-log.entity.js';
import { AffectiveSignalEntity } from '../entities/affective-signal.entity.js';
import {
  Learner,
  LearnerMastery,
  ThetaEstimate,
  FsrsState,
  ErrorLogEntry,
  AffectiveSignal,
} from '../../domain/entities/learner-model.js';

export function learnerToDomain(e: LearnerEntity): Learner {
  return new Learner(e.id, e.createdAt, e.lastActiveAt, e.updatedAt);
}
export function learnerToEntity(d: Learner): LearnerEntity {
  const e = new LearnerEntity();
  e.id = d.id;
  e.createdAt = d.createdAt;
  e.lastActiveAt = d.lastActiveAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function learnerMasteryToDomain(e: LearnerMasteryEntity): LearnerMastery {
  return new LearnerMastery(
    e.learnerId,
    e.skillId,
    Number(e.pKnow),
    e.nObs,
    e.distinctDays,
    e.spacedObs,
    e.lastPracticeAt,
    e.updatedAt,
  );
}
export function learnerMasteryToEntity(d: LearnerMastery): LearnerMasteryEntity {
  const e = new LearnerMasteryEntity();
  e.learnerId = d.learnerId;
  e.skillId = d.skillId;
  e.pKnow = String(d.pKnow);
  e.nObs = d.nObs;
  e.distinctDays = d.distinctDays;
  e.spacedObs = d.spacedObs;
  e.lastPracticeAt = d.lastPracticeAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function thetaEstimateToDomain(e: ThetaEstimateEntity): ThetaEstimate {
  return new ThetaEstimate(
    e.learnerId,
    e.skillId,
    Number(e.theta),
    Number(e.se),
    Number(e.ci95Lower),
    Number(e.ci95Upper),
    e.evidenceCount,
    e.lastUpdated,
  );
}
export function thetaEstimateToEntity(d: ThetaEstimate): ThetaEstimateEntity {
  const e = new ThetaEstimateEntity();
  e.learnerId = d.learnerId;
  e.skillId = d.skillId;
  e.theta = String(d.theta);
  e.se = String(d.se);
  e.ci95Lower = String(d.ci95Lower);
  e.ci95Upper = String(d.ci95Upper);
  e.evidenceCount = d.evidenceCount;
  e.lastUpdated = d.lastUpdated;
  return e;
}

export function fsrsStateToDomain(e: FsrsStateEntity): FsrsState {
  return new FsrsState(
    e.learnerId,
    e.itemId,
    Number(e.stability),
    Number(e.difficulty),
    e.state as FsrsState['state'],
    e.grade as FsrsState['grade'],
    e.hintUsed,
    e.lastReview,
    new Date(`${e.dueDate}T00:00:00Z`),
    e.wVersion,
    e.updatedAt,
  );
}
export function fsrsStateToEntity(d: FsrsState): FsrsStateEntity {
  const e = new FsrsStateEntity();
  e.learnerId = d.learnerId;
  e.itemId = d.itemId;
  e.stability = String(d.stability);
  e.difficulty = String(d.difficulty);
  e.state = d.state;
  e.grade = d.grade;
  e.hintUsed = d.hintUsed;
  e.lastReview = d.lastReview;
  e.dueDate = d.dueDate.toISOString().slice(0, 10);
  e.wVersion = d.wVersion;
  e.updatedAt = d.updatedAt;
  return e;
}

export function errorLogToDomain(e: ErrorLogEntity): ErrorLogEntry {
  return new ErrorLogEntry(
    e.id,
    e.learnerId,
    e.skillId,
    e.pattern as ErrorLogEntry['pattern'],
    e.producedForm,
    e.frequency,
    Number(e.severity),
    e.firstSeenAt,
    e.lastSeenAt,
  );
}
export function errorLogToEntity(d: ErrorLogEntry): ErrorLogEntity {
  const e = new ErrorLogEntity();
  e.id = d.id;
  e.learnerId = d.learnerId;
  e.skillId = d.skillId;
  e.pattern = d.pattern;
  e.producedForm = d.producedForm;
  e.frequency = d.frequency;
  e.severity = String(d.severity);
  e.firstSeenAt = d.firstSeenAt;
  e.lastSeenAt = d.lastSeenAt;
  return e;
}

export function affectiveSignalToDomain(e: AffectiveSignalEntity): AffectiveSignal {
  return new AffectiveSignal(
    e.id,
    e.learnerId,
    e.kind as AffectiveSignal['kind'],
    e.observedAt,
    Number(e.strength),
  );
}
export function affectiveSignalToEntity(d: AffectiveSignal): AffectiveSignalEntity {
  const e = new AffectiveSignalEntity();
  e.id = d.id;
  e.learnerId = d.learnerId;
  e.kind = d.kind;
  e.observedAt = d.observedAt;
  e.strength = String(d.strength);
  return e;
}