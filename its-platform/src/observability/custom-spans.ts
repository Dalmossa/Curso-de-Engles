import {
  trace,
  type Span,
  SpanStatusCode,
  context,
  propagation,
  ROOT_CONTEXT,
} from '@opentelemetry/api';
import type { Request } from 'express';

/**
 * Custom span helpers for domain services.
 * These create spans with semantic attributes for key domain operations.
 */

// Tracer name for the ITS Platform
export const TRACER_NAME = 'its-platform';

/**
 * Gets the platform tracer instance.
 */
export function getTracer(): ReturnType<typeof trace.getTracer> {
  return trace.getTracer(TRACER_NAME);
}

/**
 * Creates a span for the Mastery Gate evaluation.
 * Attributes: skill_id, domain, p_know, n_obs, distinct_days, spaced_obs, passed, clauses
 */
export function createMasteryGateSpan(
  skillId: string,
  domain: string,
  attributes: {
    pKnow: number;
    nObs: number;
    distinctDays: number;
    spacedObs: number;
    observationsCount: number;
  },
): { span: Span; end: (result: { passed: boolean; clauses: Record<string, boolean> }) => void } {
  const tracer = getTracer();
  const span = tracer.startSpan('domain.mastery_gate.evaluate', {
    attributes: {
      'skill.id': skillId,
      'skill.domain': domain,
      'mastery.p_know': attributes.pKnow,
      'mastery.n_obs': attributes.nObs,
      'mastery.distinct_days': attributes.distinctDays,
      'mastery.spaced_obs': attributes.spacedObs,
      'mastery.observations_count': attributes.observationsCount,
    },
  });

  return {
    span,
    end: (result: { passed: boolean; clauses: Record<string, boolean> }) => {
      span.setAttribute('mastery_gate.passed', result.passed);
      for (const [clause, passed] of Object.entries(result.clauses)) {
        span.setAttribute(`mastery_gate.clause.${clause}`, passed);
      }
      span.setStatus({ code: result.passed ? SpanStatusCode.OK : SpanStatusCode.ERROR });
      span.end();
    },
  };
}

/**
 * Creates a span for BKT (Bayesian Knowledge Tracing) update.
 * Attributes: skill_id, p_know_before, p_know_after, p_know_delta, correct, p_learn, p_slip, p_guess
 */
export function createBktUpdateSpan(
  skillId: string,
  attributes: {
    pKnowBefore: number;
    correct: boolean;
    pLearn: number;
    pSlip: number;
    pGuess: number;
  },
): { span: Span; end: (result: { pKnowAfter: number; pKnowDelta: number }) => void } {
  const tracer = getTracer();
  const span = tracer.startSpan('domain.bkt.update', {
    attributes: {
      'skill.id': skillId,
      'bkt.p_know_before': attributes.pKnowBefore,
      'bkt.correct': attributes.correct,
      'bkt.p_learn': attributes.pLearn,
      'bkt.p_slip': attributes.pSlip,
      'bkt.p_guess': attributes.pGuess,
    },
  });

  return {
    span,
    end: (result: { pKnowAfter: number; pKnowDelta: number }) => {
      span.setAttribute('bkt.p_know_after', result.pKnowAfter);
      span.setAttribute('bkt.p_know_delta', result.pKnowDelta);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    },
  };
}

/**
 * Creates a span for FSRS (Free Spaced Repetition Scheduler) review.
 * Attributes: skill_id, stability_before, difficulty_before, state_before, rating, interval_days, stability_after, difficulty_after, state_after
 */
export function createFsrsReviewSpan(
  skillId: string,
  attributes: {
    stabilityBefore: number;
    difficultyBefore: number;
    stateBefore: string;
    rating: number;
    elapsedDays: number;
    masteryProbability?: number;
  },
): {
  span: Span;
  end: (result: {
    stabilityAfter: number;
    difficultyAfter: number;
    stateAfter: string;
    intervalDays: number;
    retrievability: number;
  }) => void;
} {
  const tracer = getTracer();
  const span = tracer.startSpan('domain.fsrs.review', {
    attributes: {
      'skill.id': skillId,
      'fsrs.stability_before': attributes.stabilityBefore,
      'fsrs.difficulty_before': attributes.difficultyBefore,
      'fsrs.state_before': attributes.stateBefore,
      'fsrs.rating': attributes.rating,
      'fsrs.elapsed_days': attributes.elapsedDays,
      'fsrs.mastery_probability': attributes.masteryProbability ?? 0,
    },
  });

  return {
    span,
    end: (result: {
      stabilityAfter: number;
      difficultyAfter: number;
      stateAfter: string;
      intervalDays: number;
      retrievability: number;
    }) => {
      span.setAttribute('fsrs.stability_after', result.stabilityAfter);
      span.setAttribute('fsrs.difficulty_after', result.difficultyAfter);
      span.setAttribute('fsrs.state_after', result.stateAfter);
      span.setAttribute('fsrs.interval_days', result.intervalDays);
      span.setAttribute('fsrs.retrievability', result.retrievability);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    },
  };
}

/**
 * Creates a span for authentication operations (login, register, refresh, logout).
 * Attributes: operation, user_id, learner_id, session_id, success
 */
export function createAuthSpan(
  operation: 'login' | 'register' | 'refresh' | 'logout' | 'revoke' | 'verify',
  attributes: {
    userId?: string;
    learnerId?: string;
    sessionId?: string;
    email?: string;
    provider?: string;
  },
): { span: Span; end: (success: boolean, error?: Error) => void } {
  const tracer = getTracer();
  const span = tracer.startSpan(`auth.${operation}`, {
    attributes: {
      'auth.operation': operation,
      'user.id': attributes.userId ?? '',
      'learner.id': attributes.learnerId ?? '',
      'session.id': attributes.sessionId ?? '',
      'user.email': attributes.email ?? '',
      'auth.provider': attributes.provider ?? '',
    },
  });

  return {
    span,
    end: (success: boolean, error?: Error) => {
      span.setAttribute('auth.success', success);
      if (error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      span.end();
    },
  };
}

/**
 * Creates a span for content loading operations (lesson, pack, dialogue, audio).
 * Attributes: operation, content_id, content_type, cefr_level, found
 */
export function createContentLoadSpan(
  operation: 'lesson' | 'pack' | 'dialogue' | 'dialogue_audio',
  contentId: string,
  attributes: {
    cefrLevel?: string;
    schemaVersion?: string;
  },
): { span: Span; end: (found: boolean, itemCount?: number, error?: Error) => void } {
  const tracer = getTracer();
  const span = tracer.startSpan(`content.load.${operation}`, {
    attributes: {
      'content.operation': operation,
      'content.id': contentId,
      'content.type': operation,
      'content.cefr_level': attributes.cefrLevel ?? '',
      'content.schema_version': attributes.schemaVersion ?? '',
    },
  });

  return {
    span,
    end: (found: boolean, itemCount = 0, error?: Error) => {
      span.setAttribute('content.found', found);
      span.setAttribute('content.item_count', itemCount);
      if (error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      span.end();
    },
  };
}

/**
 * Creates a span for placement/diagnostic operations.
 * Attributes: learner_id, form_version, items_count, theta_estimate, cefr_band
 */
export function createPlacementSpan(
  learnerId: string,
  attributes: {
    formVersion: string;
    itemsCount: number;
  },
): {
  span: Span;
  end: (result: {
    theta: number;
    cefrBand: string;
    provisional: boolean;
    calibrationStatus: string;
  }) => void;
} {
  const tracer = getTracer();
  const span = tracer.startSpan('placement.diagnostic.run', {
    attributes: {
      'learner.id': learnerId,
      'diagnostic.form_version': attributes.formVersion,
      'diagnostic.items_count': attributes.itemsCount,
    },
  });

  return {
    span,
    end: (result: {
      theta: number;
      cefrBand: string;
      provisional: boolean;
      calibrationStatus: string;
    }) => {
      span.setAttribute('diagnostic.theta', result.theta);
      span.setAttribute('diagnostic.cefr_band', result.cefrBand);
      span.setAttribute('diagnostic.provisional', result.provisional);
      span.setAttribute('diagnostic.calibration_status', result.calibrationStatus);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    },
  };
}

/**
 * Creates a span for practice session operations.
 * Attributes: learner_id, pack_id, mode, items_count
 */
export function createPracticeSpan(
  learnerId: string,
  packId: string,
  attributes: {
    mode: 'adaptive' | 'fixed';
    itemsCount: number;
  },
): {
  span: Span;
  end: (result: { correctCount: number; totalCount: number; skillsUpdated: number }) => void;
} {
  const tracer = getTracer();
  const span = tracer.startSpan('practice.session.submit', {
    attributes: {
      'learner.id': learnerId,
      'pack.id': packId,
      'practice.mode': attributes.mode,
      'practice.items_count': attributes.itemsCount,
    },
  });

  return {
    span,
    end: (result: { correctCount: number; totalCount: number; skillsUpdated: number }) => {
      span.setAttribute('practice.correct_count', result.correctCount);
      span.setAttribute('practice.total_count', result.totalCount);
      span.setAttribute(
        'practice.accuracy',
        result.totalCount > 0 ? result.correctCount / result.totalCount : 0,
      );
      span.setAttribute('practice.skills_updated', result.skillsUpdated);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    },
  };
}

/**
 * Creates a span for database operations (repository methods).
 * Attributes: db.operation, db.table, db.query_type
 */
export function createDbSpan(
  operation: 'find' | 'findOne' | 'save' | 'update' | 'delete' | 'query',
  table: string,
  attributes?: {
    queryType?: string;
    entityId?: string;
  },
): { span: Span; end: (result: { rowCount?: number; error?: Error }) => void } {
  const tracer = getTracer();
  const span = tracer.startSpan(`db.${operation}`, {
    attributes: {
      'db.operation': operation,
      'db.table': table,
      'db.query_type': attributes?.queryType ?? '',
      'db.entity_id': attributes?.entityId ?? '',
    },
  });

  return {
    span,
    end: (result: { rowCount?: number; error?: Error }) => {
      if (result.rowCount !== undefined) {
        span.setAttribute('db.row_count', result.rowCount);
      }
      if (result.error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: result.error.message });
        span.recordException(result.error);
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      span.end();
    },
  };
}

/**
 * Creates a span for queue operations (BullMQ job processing).
 * Attributes: queue.name, job.id, job.name, job.attempts
 */
export function createQueueSpan(
  queueName: string,
  jobId: string,
  attributes: {
    jobName: string;
    attempts: number;
  },
): { span: Span; end: (result: { success: boolean; durationMs: number; error?: Error }) => void } {
  const tracer = getTracer();
  const span = tracer.startSpan('queue.job.process', {
    attributes: {
      'queue.name': queueName,
      'job.id': jobId,
      'job.name': attributes.jobName,
      'job.attempts': attributes.attempts,
    },
  });

  return {
    span,
    end: (result: { success: boolean; durationMs: number; error?: Error }) => {
      span.setAttribute('job.success', result.success);
      span.setAttribute('job.duration_ms', result.durationMs);
      if (result.error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: result.error.message });
        span.recordException(result.error);
      } else {
        span.setStatus({ code: SpanStatusCode.OK });
      }
      span.end();
    },
  };
}

/**
 * Helper to run a function within a span context.
 * Automatically ends the span and handles errors.
 */
export async function withSpan<T>(
  spanName: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> {
  const tracer = getTracer();
  return tracer.startActiveSpan(spanName, { attributes: attributes ?? {} }, async span => {
    try {
      const result = await fn(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Adds attributes to the current active span.
 */
export function addSpanAttributes(attributes: Record<string, string | number | boolean>): void {
  const span = trace.getSpan(context.active());
  if (span) {
    for (const [key, value] of Object.entries(attributes)) {
      span.setAttribute(key, value);
    }
  }
}

/**
 * Records an exception on the current active span.
 */
export function recordSpanException(error: Error): void {
  const span = trace.getSpan(context.active());
  if (span) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  }
}

/**
 * Sets the status of the current active span.
 */
export function setSpanStatus(code: SpanStatusCode, message?: string): void {
  const span = trace.getSpan(context.active());
  if (span) {
    span.setStatus({ code, message: message ?? '' });
  }
}

/**
 * Gets the current trace ID from the active span (for logging correlation).
 */
export function getCurrentTraceId(): string | undefined {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    return spanContext.traceId;
  }
  return undefined;
}

/**
 * Gets the current span ID from the active span (for logging correlation).
 */
export function getCurrentSpanId(): string | undefined {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    return spanContext.spanId;
  }
  return undefined;
}
