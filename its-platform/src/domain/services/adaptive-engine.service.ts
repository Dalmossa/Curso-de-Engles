/**
 * Adaptive Engine — Orchestrator for the ITS Platform
 * 
 * Coordinates BKT, FSRS, NextActivitySelector, MasteryGate, and ErrorLog.
 * Emits typed domain events for all significant state transitions.
 * 
 * Pure TypeScript, no framework imports (ADR-014).
 */

import type { 
  LearnerMastery, 
  ErrorLogEntry, 
  ErrorPattern, 
  ThetaEstimate, 
  FsrsState, 
  AffectiveSignal 
} from '../entities/learner-model.js';
import { 
  initializeBktState, 
  bktUpdate, 
  computeGuessProbability, 
  DEFAULT_BKT_PARAMS,
  type BktParameters, 
  type BktState, 
  type BktUpdateResult,
  type BktSkillParam 
} from './bkt-engine.service.js';
import { 
  createFsrsScheduler, 
  defaultFsrsScheduler,
  type FsrsParameters, 
  type FsrsCardState, 
  type FsrsReviewInput, 
  type FsrsReviewOutput, 
  type FsrsRating, 
  type FsrsStateName,
  type FsrsScheduler 
} from './fsrs-scheduler.service.js';
import { NextActivitySelector, type LearnerModel, type NextActivitySelection } from './next-activity-selector.js';
import { MasteryGateService, buildMasteryEvidence, type MasteryEvidence, type MasteryGateResult } from './mastery-gate.service.js';
import { 
  upsertErrorLog, 
  inferErrorPattern, 
  getDefaultSeverity,
  generateErrorLogId,
  type ErrorLogWriteInput,
  type ErrorLogUpsertResult,
  type ErrorPattern as ErrorLogErrorPattern 
} from './error-log.service.js';
import { domainEventBus, type DomainEvent, createEventId, createCorrelationId,
  createLearnerPlacedEvent, createMasteryUpdatedEvent, createActivitySelectedEvent,
  createReviewScheduledEvent, createRemediationTriggeredEvent, createGatePassedEvent,
  createGateFailedEvent, createLessonCompletedEvent, createPracticeSubmittedEvent,
  createAffectiveSignalRecordedEvent, createErrorLoggedEvent } from '../events/domain-events.js';
import type { CurriculumGraph, CurriculumNode } from '../../infrastructure/curriculum/curriculum-types.js';

// Type for FSRS state in learner model (simpler than FsrsCardState)
type LearnerFsrsState = {
  stability: number;
  difficulty: number;
  lastReview: Date;
  dueDate: Date;
};

export interface AdaptiveEngineConfig {
  bktParams?: Partial<BktParameters>;
  fsrsParams?: Partial<FsrsParameters>;
}

export interface LearnerProfile {
  learnerId: string;
  track: 'General' | 'IT';
  currentNodeId: string | null;
  timeBudgetMinutes: number;
}

export interface PracticeResult {
  packId: string;
  lessonId: string;
  skillId: string;
  itemId: string;
  correct: boolean;
  responseTimeMs: number;
  itemType: string;
  nOptions: number;
}

export interface LessonCompletion {
  lessonId: string;
  moduleId: string;
  cefrLevel: string;
  track: 'General' | 'IT';
  durationMinutes: number;
  itemsCompleted: number;
}

export interface DiagnosticResult {
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
  skillTheta?: Map<string, { theta: number; se: number }>;
}

export interface AdaptiveEngineResult {
  nextActivity: NextActivitySelection;
  masteryUpdates: Map<string, BktUpdateResult>;
  fsrsUpdates: Map<string, FsrsReviewOutput>;
  gateResults: Map<string, { passed: boolean; evidence: MasteryEvidence }>;
  remediationTriggered: boolean;
  eventsEmitted: DomainEvent[];
}

/**
 * BKT Engine wrapper class for the adaptive engine.
 */
export class BktEngineWrapper {
  private params: BktParameters;

  constructor(params: BktParameters) {
    this.params = params;
  }

  initialize(skillId: string, learnerMastery: LearnerMastery | null, itemPGuess: number): BktState {
    const bktSkillParam: BktSkillParam = {
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
      evidenceCount: 1, // Single observation
    };
  }

  getParameters(): BktParameters {
    return { ...this.params };
  }
}

/**
 * ErrorLog Service wrapper class for the adaptive engine.
 */
export class ErrorLogServiceWrapper {
  private entries: Map<string, ErrorLogEntry> = new Map();

  async logError(input: ErrorLogWriteInput): Promise<ErrorLogUpsertResult & { isNewPattern: boolean; id: string; frequency: number; severity: number }> {
    const result = upsertErrorLog(this.entries, input);
    return {
      ...result,
      isNewPattern: result.isNew,
      id: result.entry.id,
      frequency: result.entry.frequency,
      severity: result.entry.severity,
    };
  }

  getEntries(): ReadonlyMap<string, ErrorLogEntry> {
    return this.entries;
  }

  inferPattern(skillId: string, producedForm: string, correctForm: string): ErrorPattern | null {
    return inferErrorPattern(skillId, producedForm, correctForm);
  }

  getDefaultSeverity(pattern: ErrorPattern): number {
    return getDefaultSeverity(pattern);
  }

  generateId(learnerId: string, skillId: string, pattern: ErrorPattern, producedForm: string): string {
    return generateErrorLogId(learnerId, skillId, pattern, producedForm);
  }
}

/**
 * Main Adaptive Engine orchestrator.
 * Coordinates all adaptive tutoring components and emits domain events.
 */
export class AdaptiveEngine {
  private bktEngine: BktEngineWrapper;
  private fsrsScheduler: FsrsScheduler;
  private nextActivitySelector: NextActivitySelector;
  private masteryGate: MasteryGateService;
  private errorLogService: ErrorLogServiceWrapper;
  private curriculumGraph: CurriculumGraph;
  private config: { bktParams: BktParameters; fsrsParams: FsrsParameters };

  constructor(
    curriculumGraph: CurriculumGraph,
    config: AdaptiveEngineConfig = {}
  ) {
    this.curriculumGraph = curriculumGraph;
    this.config = {
      bktParams: { ...DEFAULT_BKT_PARAMS, ...config.bktParams } as BktParameters,
      fsrsParams: { ...config.fsrsParams } as FsrsParameters,
    };

    // Initialize services
    this.bktEngine = new BktEngineWrapper(this.config.bktParams);
    this.fsrsScheduler = createFsrsScheduler(this.config.fsrsParams);
    this.nextActivitySelector = new NextActivitySelector(curriculumGraph);
    this.masteryGate = new MasteryGateService();
    this.errorLogService = new ErrorLogServiceWrapper();
  }

  /**
   * Process diagnostic result and place learner at appropriate start node.
   * Emits LearnerPlacedEvent.
   */
  async processDiagnostic(
    learnerId: string,
    diagnosticResult: DiagnosticResult,
    sessionId: string
  ): Promise<{ nextActivity: NextActivitySelection; events: DomainEvent[] }> {
    const correlationId = createCorrelationId();
    const baseEvent = { eventId: createEventId(), correlationId, learnerId, sessionId, occurredAt: new Date() };

    // Create initial learner model from diagnostic
    const learnerModel = this.buildLearnerModelFromDiagnostic(learnerId, diagnosticResult);

    // Select first activity
    const selection = this.nextActivitySelector.selectNextActivity(learnerModel);

    // Emit placement event
    const placedEvent = createLearnerPlacedEvent(baseEvent, {
      diagnosticId: diagnosticResult.diagnosticId,
      theta: diagnosticResult.theta,
      seEffective: diagnosticResult.seEffective,
      ci95Lower: diagnosticResult.ci95Lower,
      ci95Upper: diagnosticResult.ci95Upper,
      cefr: diagnosticResult.cefr,
      startCefr: diagnosticResult.startCefr,
      startNode: diagnosticResult.startNode,
      remediationNodes: diagnosticResult.remediationNodes,
      belowScale: diagnosticResult.belowScale,
      precisionLabel: diagnosticResult.precisionLabel,
    });

    await domainEventBus.emit(placedEvent);

    // Emit activity selection event
    const activityEvent = createActivitySelectedEvent(baseEvent, {
      selection,
      selectionReason: 'diagnostic_followup',
    });
    await domainEventBus.emit(activityEvent);

    return { nextActivity: selection, events: [placedEvent, activityEvent] };
  }

  /**
   * Process practice submission (answers to practice pack items).
   * Updates BKT, FSRS, ErrorLog, checks mastery gates.
   * Emits MasteryUpdatedEvent, ReviewScheduledEvent, GatePassed/FailedEvent, etc.
   */
  async processPractice(
    learnerId: string,
    sessionId: string,
    results: PracticeResult[],
    currentNodeId: string | null,
    track: 'General' | 'IT',
    timeBudgetMinutes: number
  ): Promise<AdaptiveEngineResult> {
    const correlationId = createCorrelationId();

    const masteryUpdates = new Map<string, BktUpdateResult>();
    const fsrsUpdates = new Map<string, FsrsReviewOutput>();
    const gateResults = new Map<string, { passed: boolean; evidence: MasteryEvidence }>();
    const emittedEvents: DomainEvent[] = [];
    let remediationTriggered = false;

    // Build learner model from current state (would be loaded from repository)
    const learnerModel = await this.buildLearnerModel(learnerId, currentNodeId, track, timeBudgetMinutes);

    // Process each practice result
    for (const result of results) {
      const eventId = createEventId();
      const eventBase = { eventId, correlationId, learnerId, sessionId, occurredAt: new Date() };

      // 1. Update BKT for the skill
      const currentMasteryPartial = learnerModel.mastery.get(result.skillId);
      // Convert partial mastery to full LearnerMastery for initializeBktState
      const currentMastery: LearnerMastery | null = currentMasteryPartial ? {
        learnerId,
        skillId: result.skillId,
        pKnow: currentMasteryPartial.pKnow,
        nObs: currentMasteryPartial.nObs,
        distinctDays: currentMasteryPartial.distinctDays,
        spacedObs: currentMasteryPartial.spacedObs,
        lastPracticeAt: currentMasteryPartial.lastPracticeAt,
        updatedAt: new Date(),
      } : null;
      const bktState = this.bktEngine.initialize(result.skillId, currentMastery, computeGuessProbability(result.itemType, result.nOptions));
      const bktResult = this.bktEngine.update(bktState, result.correct);

      // Update learner model
      const updatedMastery: LearnerMastery = {
        learnerId,
        skillId: result.skillId,
        pKnow: bktResult.stateAfter.pKnow,
        nObs: (currentMasteryPartial?.nObs ?? 0) + 1,
        distinctDays: currentMasteryPartial?.distinctDays ?? 1,
        spacedObs: currentMasteryPartial?.spacedObs ?? 0,
        lastPracticeAt: new Date(),
        updatedAt: new Date(),
      };
      learnerModel.mastery.set(result.skillId, {
        pKnow: updatedMastery.pKnow,
        nObs: updatedMastery.nObs,
        distinctDays: updatedMastery.distinctDays,
        spacedObs: updatedMastery.spacedObs,
        lastPracticeAt: updatedMastery.lastPracticeAt,
      });

      masteryUpdates.set(result.skillId, bktResult);

      // Emit MasteryUpdatedEvent
      const masteryEvent = createMasteryUpdatedEvent(eventBase, {
        skillId: result.skillId,
        pKnowBefore: bktResult.stateBefore.pKnow,
        pKnowAfter: bktResult.stateAfter.pKnow,
        nObs: updatedMastery.nObs,
        distinctDays: updatedMastery.distinctDays,
        spacedObs: updatedMastery.spacedObs,
        pLearn: bktResult.stateAfter.pLearn,
        pSlip: bktResult.stateAfter.pSlip,
        pGuess: bktResult.stateAfter.pGuess,
        gatePassed: false, // Will be updated after gate check
      });
      await domainEventBus.emit(masteryEvent);
      emittedEvents.push(masteryEvent);

      // 2. Update FSRS for the item
      // Get the learner's FSRS state (simpler type) and convert to full FsrsCardState for the scheduler
      const learnerFsrsState = learnerModel.fsrsStates.get(result.itemId);
      const fsrsCardState: FsrsCardState = learnerFsrsState ? {
        stability: learnerFsrsState.stability,
        difficulty: learnerFsrsState.difficulty,
        state: 'review',
        lastReview: learnerFsrsState.lastReview,
        dueDate: learnerFsrsState.dueDate,
        elapsedDays: 0,
        scheduledDays: 0,
        reps: 0,
        lapses: 0,
      } : this.createNewFsrsCardState();

      const fsrsInput: FsrsReviewInput = {
        cardState: fsrsCardState,
        rating: this.mapCorrectnessToRating(result.correct),
        now: new Date(),
        masteryProbability: updatedMastery.pKnow,
      };

      const fsrsOutput = this.fsrsScheduler.review(fsrsInput);
      fsrsUpdates.set(result.itemId, fsrsOutput);

      // Update learner model FSRS state - use the simpler LearnerFsrsState type
      learnerModel.fsrsStates.set(result.itemId, {
        stability: fsrsOutput.stability,
        difficulty: fsrsOutput.difficulty,
        lastReview: fsrsOutput.lastReview,
        dueDate: fsrsOutput.dueDate,
      });

      // Emit ReviewScheduledEvent
      const reviewEvent = createReviewScheduledEvent(eventBase, {
        itemId: result.itemId,
        skillIds: [result.skillId],
        state: fsrsOutput.state,
        stability: fsrsOutput.stability,
        difficulty: fsrsOutput.difficulty,
        intervalDays: fsrsOutput.intervalDays,
        dueDate: fsrsOutput.dueDate,
        rating: fsrsInput.rating,
      });
      await domainEventBus.emit(reviewEvent);
      emittedEvents.push(reviewEvent);

      // 3. Check mastery gate for the skill
      const evidence = buildMasteryEvidence(
        updatedMastery,
        [], // observations would come from repository
        this.inferDomainFromSkillId(result.skillId),
        new Date()
      );

      const gateResult = this.masteryGate.evaluate(evidence);
      gateResults.set(result.skillId, { passed: gateResult.passed, evidence });

      // Emit GatePassed/FailedEvent
      const gateEvent = gateResult.passed
        ? createGatePassedEvent(eventBase, {
            skillId: result.skillId,
            evidence,
            passed: true,
            clauses: {
              pKnowThreshold: gateResult.clauses.numeric,
              ci95LowerThreshold: gateResult.clauses.confidence,
              minObservations: gateResult.clauses.nObs,
              spacedEvidence: gateResult.clauses.spacedObs,
            },
          })
        : createGateFailedEvent(eventBase, {
            skillId: result.skillId,
            evidence,
            passed: false,
            clauses: {
              pKnowThreshold: gateResult.clauses.numeric,
              ci95LowerThreshold: gateResult.clauses.confidence,
              minObservations: gateResult.clauses.nObs,
              spacedEvidence: gateResult.clauses.spacedObs,
            },
          });

      await domainEventBus.emit(gateEvent);
      emittedEvents.push(gateEvent);

      // 4. Check for remediation triggers
      if (!gateResult.passed && evidence.pKnow < 0.3) {
        const remediationNodes = this.findRemediationNodes(result.skillId);
        if (remediationNodes.length > 0) {
          remediationTriggered = true;
          const remediationEvent = createRemediationTriggeredEvent(eventBase, {
            skillId: result.skillId,
            pKnow: evidence.pKnow,
            remediationNodeId: remediationNodes[0]!,
            triggerReason: 'mastery_gap',
          });
          await domainEventBus.emit(remediationEvent);
          emittedEvents.push(remediationEvent);
        }
      }

      // 5. Log error patterns if incorrect
      if (!result.correct) {
        const pattern = this.errorLogService.inferPattern(result.itemType, result.skillId, '');
        if (pattern) {
          const errorEntry = await this.errorLogService.logError({
            learnerId,
            skillId: result.skillId,
            pattern,
            producedForm: result.itemId, // placeholder - would be actual response
            severity: this.errorLogService.getDefaultSeverity(pattern),
            observedAt: new Date(),
          });

          if (errorEntry.isNewPattern) {
            const errorEvent = createErrorLoggedEvent(eventBase, {
              errorId: errorEntry.id,
              skillId: result.skillId,
              pattern,
              producedForm: result.itemId,
              frequency: errorEntry.frequency,
              severity: errorEntry.severity,
              isNewPattern: true,
            });
            await domainEventBus.emit(errorEvent);
            emittedEvents.push(errorEvent);
          }
        }
      }
    }

    // 6. Select next activity
    const selection = this.nextActivitySelector.selectNextActivity(learnerModel);

    // Emit ActivitySelectedEvent
    const activityEvent = createActivitySelectedEvent(
      { eventId: createEventId(), correlationId, learnerId, sessionId, occurredAt: new Date() },
      { selection, selectionReason: this.determineSelectionReason(selection, learnerModel) }
    );
    await domainEventBus.emit(activityEvent);
    emittedEvents.push(activityEvent);

    return {
      nextActivity: selection,
      masteryUpdates,
      fsrsUpdates,
      gateResults,
      remediationTriggered,
      eventsEmitted: emittedEvents,
    };
  }

  /**
   * Process lesson completion.
   * Emits LessonCompletedEvent and selects next activity.
   */
  async processLessonCompletion(
    learnerId: string,
    sessionId: string,
    completion: LessonCompletion
  ): Promise<{ nextActivity: NextActivitySelection; events: DomainEvent[] }> {
    const correlationId = createCorrelationId();
    const baseEvent = { eventId: createEventId(), correlationId, learnerId, sessionId, occurredAt: new Date() };

    // Emit LessonCompletedEvent
    const lessonEvent = createLessonCompletedEvent(baseEvent, completion);
    await domainEventBus.emit(lessonEvent);

    // Build updated learner model
    const learnerModel = await this.buildLearnerModel(
      learnerId,
      completion.lessonId,
      completion.track,
      completion.durationMinutes
    );

    // Select next activity
    const selection = this.nextActivitySelector.selectNextActivity(learnerModel);

    // Emit ActivitySelectedEvent
    const activityEvent = createActivitySelectedEvent(baseEvent, {
      selection,
      selectionReason: 'prerequisite',
    });
    await domainEventBus.emit(activityEvent);

    return { nextActivity: selection, events: [lessonEvent, activityEvent] };
  }

  /**
   * Record affective signal.
   * Emits AffectiveSignalRecordedEvent.
   */
  async recordAffectiveSignal(
    learnerId: string,
    sessionId: string,
    kind: 'skip_streak' | 'hint_seeking' | 'session_abandon' | 'time_on_task_spike' | 'rapid_guessing',
    strength: number,
    context: Record<string, unknown>
  ): Promise<DomainEvent> {
    const event = createAffectiveSignalRecordedEvent(
      { eventId: createEventId(), correlationId: createCorrelationId(), learnerId, sessionId, occurredAt: new Date() },
      { kind, strength, context }
    );
    await domainEventBus.emit(event);
    return event;
  }

  /**
   * Get next activity recommendation without state mutation.
   */
  getNextActivity(learnerModel: LearnerModel): NextActivitySelection {
    return this.nextActivitySelector.selectNextActivity(learnerModel);
  }

  /**
   * Build learner model from diagnostic result.
   */
  private buildLearnerModelFromDiagnostic(
    learnerId: string,
    diagnostic: DiagnosticResult
  ): LearnerModel {
    const mastery = new Map<string, LearnerModel['mastery'] extends Map<string, infer V> ? V : never>();
    
    // Initialize mastery from diagnostic skill thetas
    if (diagnostic.skillTheta) {
      for (const [skillId, thetaData] of diagnostic.skillTheta) {
        // Convert theta to pKnow using logistic function
        const pKnow = 1 / (1 + Math.exp(-thetaData.theta));
        mastery.set(skillId, {
          pKnow,
          nObs: 0,
          distinctDays: 0,
          spacedObs: 0,
          lastPracticeAt: null,
        });
      }
    }

    return {
      learnerId,
      currentNodeId: diagnostic.startNode,
      track: 'General', // diagnostic doesn't have track, default to General
      mastery,
      thetaEstimates: new Map(),
      fsrsStates: new Map<string, LearnerFsrsState>(),
      affectiveSignals: [],
      currentLessonId: null,
      timeBudgetMinutes: 30,
    };
  }

  /**
   * Build learner model from current state.
   * In production, this would load from repository.
   */
  private async buildLearnerModel(
    learnerId: string,
    currentNodeId: string | null,
    track: 'General' | 'IT',
    timeBudgetMinutes: number
  ): Promise<LearnerModel> {
    // This is a stub - in production would load from repository
    return {
      learnerId,
      currentNodeId,
      track,
      mastery: new Map(),
      thetaEstimates: new Map(),
      fsrsStates: new Map<string, LearnerFsrsState>(),
      affectiveSignals: [],
      currentLessonId: currentNodeId,
      timeBudgetMinutes,
    };
  }

  /**
   * Create a new FSRS card state for a new item (full FsrsCardState for the scheduler).
   */
  private createNewFsrsCardState(): FsrsCardState {
    const now = new Date();
    return {
      stability: 0,
      difficulty: 0,
      state: 'new',
      lastReview: now,
      dueDate: now,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
    };
  }

  /**
   * Map correctness to FSRS rating.
   */
  private mapCorrectnessToRating(correct: boolean): FsrsRating {
    // Simplified: correct -> Good (3), incorrect -> Again (1)
    // In practice, this would consider response time, hint usage, etc.
    return correct ? 3 : 1;
  }

  /**
   * Determine selection reason for activity.
   */
  private determineSelectionReason(
    selection: NextActivitySelection,
    learnerModel: LearnerModel
  ): 'diagnostic_followup' | 'remediation' | 'i_plus_1' | 'prerequisite' | 'spaced_review' | 'mastery_gate' {
    const primary = selection.primary;
    if (primary.rationale.selectionRule === 'remediation') return 'remediation';
    if (primary.rationale.iPlus1) return 'i_plus_1';
    if (primary.rationale.fsrsPriority > 0) return 'spaced_review';
    if (primary.rationale.masteryGaps.length > 0) return 'mastery_gate';
    return 'prerequisite';
  }

  /**
   * Find remediation nodes for a skill.
   */
  private findRemediationNodes(skillId: string): string[] {
    const remediationNodes: string[] = [];
    for (const [nodeId, node] of this.curriculumGraph.nodes) {
      const curriculumNode = node as CurriculumNode & { kind?: string; skillIds?: string[] };
      if (curriculumNode.kind === 'remediation' && curriculumNode.skillIds?.includes(skillId)) {
        remediationNodes.push(nodeId);
      }
    }
    return remediationNodes;
  }

  /**
   * Infer domain from skill ID.
   */
  private inferDomainFromSkillId(skillId: string): string {
    if (skillId.includes('vocab') || skillId.includes('word')) return 'vocabulary';
    if (skillId.includes('grammar') || skillId.includes('tense') || skillId.includes('verb')) return 'grammar';
    if (skillId.includes('pronunciation') || skillId.includes('phon') || skillId.includes('pron_')) return 'pronunciation';
    if (skillId.includes('reading') || skillId.includes('comprehension')) return 'reading';
    if (skillId.includes('listening') || skillId.includes('audio')) return 'listening';
    if (skillId.includes('coherence') || skillId.includes('writing') || skillId.includes('discourse')) return 'coherence';
    return 'vocabulary'; // default
  }

  // Getters for testing
  getBktEngine(): BktEngineWrapper { return this.bktEngine; }
  getFsrsScheduler(): FsrsScheduler { return this.fsrsScheduler; }
  getNextActivitySelector(): NextActivitySelector { return this.nextActivitySelector; }
  getMasteryGate(): MasteryGateService { return this.masteryGate; }
  getErrorLogService(): ErrorLogServiceWrapper { return this.errorLogService; }
  getCurriculumGraph(): CurriculumGraph { return this.curriculumGraph; }
}
