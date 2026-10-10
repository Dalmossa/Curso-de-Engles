/**
 * Domain Events — Adaptive Engine Event Stream
 * 
 * Pure TypeScript, no framework imports (ADR-014).
 * Events are emitted by the AdaptiveEngine and consumed by handlers
 * (notifications, analytics, audit log, etc.).
 * 
 * Idempotency: Handlers MUST be idempotent (at-least-once delivery assumed).
 * Each event carries a unique eventId and correlationId for deduplication.
 */

import type { LearnerMastery } from '../entities/learner-model.js';
import type { FsrsReviewOutput } from '../services/fsrs-scheduler.service.js';
import type { NextActivitySelection } from '../services/next-activity-selector.js';
import type { MasteryEvidence } from '../services/mastery-gate.service.js';

// ============================================================================
// Base Event Types
// ============================================================================

export interface DomainEventBase {
  eventId: string;           // UUID v4 - unique per emission
  correlationId: string;     // Groups related events (e.g., one learning session)
  occurredAt: Date;          // When the event happened
  learnerId: string;         // Subject of the event
  sessionId?: string;        // Learning session context
}

export type DomainEventType =
  | 'LearnerPlaced'
  | 'MasteryUpdated'
  | 'ActivitySelected'
  | 'ReviewScheduled'
  | 'RemediationTriggered'
  | 'GatePassed'
  | 'GateFailed'
  | 'LessonCompleted'
  | 'PracticeSubmitted'
  | 'AffectiveSignalRecorded'
  | 'ErrorLogged';

// ============================================================================
// Event Payloads
// ============================================================================

export interface LearnerPlacedPayload {
  diagnosticId: string;
  theta: number;
  seEffective: number;
  ci95Lower: number;
  ci95Upper: number;
  cefr: string;
  startCefr: string;
  startNode: string;
  remediationNodes: string[];
  belowScale: boolean;
  precisionLabel: 'low' | 'medium' | 'high';
}

export interface MasteryUpdatedPayload {
  skillId: string;
  pKnowBefore: number;
  pKnowAfter: number;
  nObs: number;
  distinctDays: number;
  spacedObs: number;
  pLearn: number;
  pSlip: number;
  pGuess: number;
  gatePassed: boolean;
}

export interface ActivitySelectedPayload {
  selection: NextActivitySelection;
  selectionReason: 'diagnostic_followup' | 'remediation' | 'i_plus_1' | 'prerequisite' | 'spaced_review' | 'mastery_gate';
}

export interface ReviewScheduledPayload {
  itemId: string;
  skillIds: string[];
  state: 'new' | 'learning' | 'review' | 'relearning';
  stability: number;
  difficulty: number;
  intervalDays: number;
  dueDate: Date;
  rating: 1 | 2 | 3 | 4;
}

export interface RemediationTriggeredPayload {
  skillId: string;
  pKnow: number;
  remediationNodeId: string;
  triggerReason: 'mastery_gap' | 'error_pattern' | 'gate_failure';
}

export interface GateResultPayload {
  skillId: string;
  evidence: MasteryEvidence;
  passed: boolean;
  clauses: {
    pKnowThreshold: boolean;
    ci95LowerThreshold: boolean;
    minObservations: boolean;
    spacedEvidence: boolean;
  };
}

export interface LessonCompletedPayload {
  lessonId: string;
  moduleId: string;
  cefrLevel: string;
  track: 'General' | 'IT';
  durationMinutes: number;
  itemsCompleted: number;
}

export interface PracticeSubmittedPayload {
  packId: string;
  lessonId: string;
  totalItems: number;
  correctItems: number;
  timeSpentMs: number;
  skillResults: Array<{
    skillId: string;
    correct: boolean;
    responseTimeMs: number;
  }>;
}

export interface AffectiveSignalRecordedPayload {
  kind: 'skip_streak' | 'hint_seeking' | 'session_abandon' | 'time_on_task_spike' | 'rapid_guessing';
  strength: number;
  context: Record<string, unknown>;
}

export interface ErrorLoggedPayload {
  errorId: string;
  skillId: string;
  pattern: string;
  producedForm: string;
  frequency: number;
  severity: number;
  isNewPattern: boolean;
}

// ============================================================================
// Full Event Types
// ============================================================================

export type LearnerPlacedEvent = DomainEventBase & {
  eventType: 'LearnerPlaced';
  payload: LearnerPlacedPayload;
};

export type MasteryUpdatedEvent = DomainEventBase & {
  eventType: 'MasteryUpdated';
  payload: MasteryUpdatedPayload;
};

export type ActivitySelectedEvent = DomainEventBase & {
  eventType: 'ActivitySelected';
  payload: ActivitySelectedPayload;
};

export type ReviewScheduledEvent = DomainEventBase & {
  eventType: 'ReviewScheduled';
  payload: ReviewScheduledPayload;
};

export type RemediationTriggeredEvent = DomainEventBase & {
  eventType: 'RemediationTriggered';
  payload: RemediationTriggeredPayload;
};

export type GatePassedEvent = DomainEventBase & {
  eventType: 'GatePassed';
  payload: GateResultPayload;
};

export type GateFailedEvent = DomainEventBase & {
  eventType: 'GateFailed';
  payload: GateResultPayload;
};

export type LessonCompletedEvent = DomainEventBase & {
  eventType: 'LessonCompleted';
  payload: LessonCompletedPayload;
};

export type PracticeSubmittedEvent = DomainEventBase & {
  eventType: 'PracticeSubmitted';
  payload: PracticeSubmittedPayload;
};

export type AffectiveSignalRecordedEvent = DomainEventBase & {
  eventType: 'AffectiveSignalRecorded';
  payload: AffectiveSignalRecordedPayload;
};

export type ErrorLoggedEvent = DomainEventBase & {
  eventType: 'ErrorLogged';
  payload: ErrorLoggedPayload;
};

export type DomainEvent =
  | LearnerPlacedEvent
  | MasteryUpdatedEvent
  | ActivitySelectedEvent
  | ReviewScheduledEvent
  | RemediationTriggeredEvent
  | GatePassedEvent
  | GateFailedEvent
  | LessonCompletedEvent
  | PracticeSubmittedEvent
  | AffectiveSignalRecordedEvent
  | ErrorLoggedEvent;

// ============================================================================
// Event Factory Helpers
// ============================================================================

export function createEventId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createCorrelationId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createLearnerPlacedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: LearnerPlacedPayload
): LearnerPlacedEvent {
  return { ...base, eventType: 'LearnerPlaced', payload };
}

export function createMasteryUpdatedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: MasteryUpdatedPayload
): MasteryUpdatedEvent {
  return { ...base, eventType: 'MasteryUpdated', payload };
}

export function createActivitySelectedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: ActivitySelectedPayload
): ActivitySelectedEvent {
  return { ...base, eventType: 'ActivitySelected', payload };
}

export function createReviewScheduledEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: ReviewScheduledPayload
): ReviewScheduledEvent {
  return { ...base, eventType: 'ReviewScheduled', payload };
}

export function createRemediationTriggeredEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: RemediationTriggeredPayload
): RemediationTriggeredEvent {
  return { ...base, eventType: 'RemediationTriggered', payload };
}

export function createGatePassedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: GateResultPayload
): GatePassedEvent {
  return { ...base, eventType: 'GatePassed', payload };
}

export function createGateFailedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: GateResultPayload
): GateFailedEvent {
  return { ...base, eventType: 'GateFailed', payload };
}

export function createLessonCompletedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: LessonCompletedPayload
): LessonCompletedEvent {
  return { ...base, eventType: 'LessonCompleted', payload };
}

export function createPracticeSubmittedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: PracticeSubmittedPayload
): PracticeSubmittedEvent {
  return { ...base, eventType: 'PracticeSubmitted', payload };
}

export function createAffectiveSignalRecordedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: AffectiveSignalRecordedPayload
): AffectiveSignalRecordedEvent {
  return { ...base, eventType: 'AffectiveSignalRecorded', payload };
}

export function createErrorLoggedEvent(
  base: Omit<DomainEventBase, 'eventType'>,
  payload: ErrorLoggedPayload
): ErrorLoggedEvent {
  return { ...base, eventType: 'ErrorLogged', payload };
}

// ============================================================================
// Event Handler Type
// ============================================================================

export interface EventHandler {
  handle(event: DomainEvent): Promise<void> | void;
}

export type EventHandlerMap = Map<DomainEventType, EventHandler[]>;

// ============================================================================
// Simple Event Bus (in-memory, for domain layer)
// ============================================================================

export class DomainEventBus {
  private handlers: EventHandlerMap = new Map();
  private emittedEvents: DomainEvent[] = [];

  subscribe(eventType: DomainEventType, handler: EventHandler): () => void {
    const handlers = this.handlers.get(eventType) ?? [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
    return () => this.unsubscribe(eventType, handler);
  }

  unsubscribe(eventType: DomainEventType, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (!handlers) return;
    const idx = handlers.indexOf(handler);
    if (idx >= 0) handlers.splice(idx, 1);
  }

  async emit(event: DomainEvent): Promise<void> {
    this.emittedEvents.push(event);
    const handlers = this.handlers.get(event.eventType) ?? [];
    await Promise.all(handlers.map(h => h.handle(event)));
  }

  getEmittedEvents(): readonly DomainEvent[] {
    return this.emittedEvents;
  }

  clearEmittedEvents(): void {
    this.emittedEvents = [];
  }
}

// Singleton instance for the domain layer
export const domainEventBus = new DomainEventBus();
