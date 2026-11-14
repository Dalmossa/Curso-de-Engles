import {
  metrics,
  type Counter,
  type Histogram,
  type UpDownCounter,
  type Meter,
} from '@opentelemetry/api';

/**
 * Custom metrics for the ITS Platform.
 * All metrics are prefixed with `its_platform_` and follow Prometheus naming conventions.
 */

// Meter name for the ITS Platform
export const METER_NAME = 'its-platform';

/**
 * Gets the platform meter instance.
 */
export function getMeter(): Meter {
  return metrics.getMeter(METER_NAME);
}

/**
 * HTTP Request Metrics
 */

// Counter for total HTTP requests
export const httpRequestsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_http_requests_total', {
    description: 'Total number of HTTP requests',
    unit: '1',
  });
})();

// Histogram for HTTP request duration
export const httpRequestDuration = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_http_request_duration_seconds', {
    description: 'HTTP request duration in seconds',
    unit: 's',
  });
})();

// Counter for HTTP requests by status code
export const httpRequestsByStatus = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_http_requests_by_status_total', {
    description: 'Total number of HTTP requests by status code',
    unit: '1',
  });
})();

/**
 * Authentication Metrics
 */

// Counter for authentication attempts
export const authAttemptsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_auth_attempts_total', {
    description: 'Total number of authentication attempts',
    unit: '1',
  });
})();

// Counter for authentication results
export const authResultsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_auth_results_total', {
    description: 'Total number of authentication results',
    unit: '1',
  });
})();

// Histogram for authentication latency
export const authLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_auth_latency_seconds', {
    description: 'Authentication operation latency in seconds',
    unit: 's',
  });
})();

// Gauge for active sessions
export const activeSessions = (() => {
  const meter = getMeter();
  return meter.createUpDownCounter('its_platform_active_sessions', {
    description: 'Number of active user sessions',
    unit: '1',
  });
})();

/**
 * Content Loading Metrics
 */

// Counter for content load requests
export const contentLoadTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_content_load_total', {
    description: 'Total number of content load requests',
    unit: '1',
  });
})();

// Histogram for content load latency
export const contentLoadLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_content_load_latency_seconds', {
    description: 'Content load latency in seconds',
    unit: 's',
  });
})();

// Counter for content not found
export const contentNotFoundTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_content_not_found_total', {
    description: 'Total number of content not found responses',
    unit: '1',
  });
})();

/**
 * Domain Service Metrics
 */

// Mastery Gate evaluations
export const masteryGateEvaluationsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_mastery_gate_evaluations_total', {
    description: 'Total number of mastery gate evaluations',
    unit: '1',
  });
})();

export const masteryGatePassedTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_mastery_gate_passed_total', {
    description: 'Total number of mastery gate passes',
    unit: '1',
  });
})();

export const masteryGateLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_mastery_gate_latency_seconds', {
    description: 'Mastery gate evaluation latency in seconds',
    unit: 's',
  });
})();

// BKT Updates
export const bktUpdatesTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_bkt_updates_total', {
    description: 'Total number of BKT updates',
    unit: '1',
  });
})();

export const bktUpdateLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_bkt_update_latency_seconds', {
    description: 'BKT update latency in seconds',
    unit: 's',
  });
})();

// FSRS Reviews
export const fsrsReviewsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_fsrs_reviews_total', {
    description: 'Total number of FSRS reviews',
    unit: '1',
  });
})();

export const fsrsReviewLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_fsrs_review_latency_seconds', {
    description: 'FSRS review latency in seconds',
    unit: 's',
  });
})();

/**
 * Placement/Diagnostic Metrics
 */

export const placementRunsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_placement_runs_total', {
    description: 'Total number of placement diagnostic runs',
    unit: '1',
  });
})();

export const placementLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_placement_latency_seconds', {
    description: 'Placement diagnostic latency in seconds',
    unit: 's',
  });
})();

/**
 * Practice Session Metrics
 */

export const practiceSessionsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_practice_sessions_total', {
    description: 'Total number of practice sessions submitted',
    unit: '1',
  });
})();

export const practiceItemsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_practice_items_total', {
    description: 'Total number of practice items answered',
    unit: '1',
  });
})();

export const practiceAccuracy = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_practice_accuracy', {
    description: 'Practice session accuracy (correct/total)',
    unit: '1',
  });
})();

export const practiceLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_practice_latency_seconds', {
    description: 'Practice session submission latency in seconds',
    unit: 's',
  });
})();

/**
 * Database Metrics
 */

export const dbOperationsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_db_operations_total', {
    description: 'Total number of database operations',
    unit: '1',
  });
})();

export const dbOperationLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_db_operation_latency_seconds', {
    description: 'Database operation latency in seconds',
    unit: 's',
  });
})();

export const dbPoolConnections = (() => {
  const meter = getMeter();
  return meter.createUpDownCounter('its_platform_db_pool_connections', {
    description: 'Number of database pool connections',
    unit: '1',
  });
})();

/**
 * Queue Metrics (BullMQ)
 */

export const queueJobsEnqueuedTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_queue_jobs_enqueued_total', {
    description: 'Total number of jobs enqueued',
    unit: '1',
  });
})();

export const queueJobsProcessedTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_queue_jobs_processed_total', {
    description: 'Total number of jobs processed',
    unit: '1',
  });
})();

export const queueJobsFailedTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_queue_jobs_failed_total', {
    description: 'Total number of jobs failed',
    unit: '1',
  });
})();

export const queueJobLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_queue_job_latency_seconds', {
    description: 'Job processing latency in seconds',
    unit: 's',
  });
})();

export const queueQueueLength = (() => {
  const meter = getMeter();
  return meter.createUpDownCounter('its_platform_queue_length', {
    description: 'Current queue length',
    unit: '1',
  });
})();

/**
 * Cache/Redis Metrics
 */

export const redisOperationsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_redis_operations_total', {
    description: 'Total number of Redis operations',
    unit: '1',
  });
})();

export const redisOperationLatency = (() => {
  const meter = getMeter();
  return meter.createHistogram('its_platform_redis_operation_latency_seconds', {
    description: 'Redis operation latency in seconds',
    unit: 's',
  });
})();

/**
 * Error Metrics
 */

export const errorsTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_errors_total', {
    description: 'Total number of errors',
    unit: '1',
  });
})();

/**
 * Business Metrics
 */

export const activeLearners = (() => {
  const meter = getMeter();
  return meter.createUpDownCounter('its_platform_active_learners', {
    description: 'Number of active learners',
    unit: '1',
  });
})();

export const lessonsCompletedTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_lessons_completed_total', {
    description: 'Total number of lessons completed',
    unit: '1',
  });
})();

export const skillsMasteredTotal = (() => {
  const meter = getMeter();
  return meter.createCounter('its_platform_skills_mastered_total', {
    description: 'Total number of skills mastered',
    unit: '1',
  });
})();

/**
 * Helper functions for recording metrics with common attributes
 */

export function recordHttpRequest(
  method: string,
  route: string,
  statusCode: number,
  durationSeconds: number,
): void {
  const labels = { method, route, status_code: statusCode.toString() };
  httpRequestsTotal.add(1, labels);
  httpRequestDuration.record(durationSeconds, labels);
  httpRequestsByStatus.add(1, { status_code: statusCode.toString() });
}

export function recordAuthAttempt(
  operation: string,
  success: boolean,
  durationSeconds: number,
): void {
  const labels = { operation, result: success ? 'success' : 'failure' };
  authAttemptsTotal.add(1, labels);
  authResultsTotal.add(1, labels);
  authLatency.record(durationSeconds, labels);
}

export function recordContentLoad(
  operation: 'lesson' | 'pack' | 'dialogue' | 'dialogue_audio',
  found: boolean,
  durationSeconds: number,
  cefrLevel?: string,
): void {
  const labels = { operation, found: found.toString(), cefr_level: cefrLevel ?? 'unknown' };
  contentLoadTotal.add(1, labels);
  contentLoadLatency.record(durationSeconds, labels);
  if (!found) {
    contentNotFoundTotal.add(1, { operation, cefr_level: cefrLevel ?? 'unknown' });
  }
}

export function recordMasteryGateEvaluation(
  domain: string,
  passed: boolean,
  durationSeconds: number,
): void {
  const labels = { domain, passed: passed.toString() };
  masteryGateEvaluationsTotal.add(1, labels);
  if (passed) {
    masteryGatePassedTotal.add(1, labels);
  }
  masteryGateLatency.record(durationSeconds, labels);
}

export function recordBktUpdate(skillId: string, durationSeconds: number): void {
  bktUpdatesTotal.add(1, { skill_id: skillId });
  bktUpdateLatency.record(durationSeconds, { skill_id: skillId });
}

export function recordFsrsReview(skillId: string, durationSeconds: number): void {
  fsrsReviewsTotal.add(1, { skill_id: skillId });
  fsrsReviewLatency.record(durationSeconds, { skill_id: skillId });
}

export function recordPlacementRun(
  formVersion: string,
  provisional: boolean,
  calibrationStatus: string,
  durationSeconds: number,
): void {
  const labels = {
    form_version: formVersion,
    provisional: provisional.toString(),
    calibration_status: calibrationStatus,
  };
  placementRunsTotal.add(1, labels);
  placementLatency.record(durationSeconds, labels);
}

export function recordPracticeSession(
  mode: 'adaptive' | 'fixed',
  packId: string,
  correctCount: number,
  totalCount: number,
  durationSeconds: number,
  skillsUpdated: number,
): void {
  const labels = { mode, pack_id: packId };
  practiceSessionsTotal.add(1, labels);
  practiceItemsTotal.add(totalCount, labels);
  practiceAccuracy.record(totalCount > 0 ? correctCount / totalCount : 0, labels);
  practiceLatency.record(durationSeconds, labels);
}

export function recordDbOperation(
  operation: string,
  table: string,
  durationSeconds: number,
  success: boolean,
  rowCount?: number,
): void {
  const labels = { operation, table, success: success.toString() };
  dbOperationsTotal.add(1, labels);
  dbOperationLatency.record(durationSeconds, labels);
}

export function recordQueueJob(
  queueName: string,
  jobName: string,
  success: boolean,
  durationSeconds: number,
): void {
  const labels = { queue: queueName, job: jobName, success: success.toString() };
  if (success) {
    queueJobsProcessedTotal.add(1, labels);
  } else {
    queueJobsFailedTotal.add(1, labels);
  }
  queueJobLatency.record(durationSeconds, labels);
}

export function recordError(errorType: string, component: string): void {
  errorsTotal.add(1, { error_type: errorType, component });
}

/**
 * Initialize all metrics (called at startup to ensure they're registered)
 */
export function initializeMetrics(): void {
  // Accessing each metric ensures they're registered with the meter provider
  // This is a no-op if already initialized
  const _ = [
    httpRequestsTotal,
    httpRequestDuration,
    httpRequestsByStatus,
    authAttemptsTotal,
    authResultsTotal,
    authLatency,
    activeSessions,
    contentLoadTotal,
    contentLoadLatency,
    contentNotFoundTotal,
    masteryGateEvaluationsTotal,
    masteryGatePassedTotal,
    masteryGateLatency,
    bktUpdatesTotal,
    bktUpdateLatency,
    fsrsReviewsTotal,
    fsrsReviewLatency,
    placementRunsTotal,
    placementLatency,
    practiceSessionsTotal,
    practiceItemsTotal,
    practiceAccuracy,
    practiceLatency,
    dbOperationsTotal,
    dbOperationLatency,
    dbPoolConnections,
    queueJobsEnqueuedTotal,
    queueJobsProcessedTotal,
    queueJobsFailedTotal,
    queueJobLatency,
    queueQueueLength,
    redisOperationsTotal,
    redisOperationLatency,
    errorsTotal,
    activeLearners,
    lessonsCompletedTotal,
    skillsMasteredTotal,
  ];
  // Suppress unused variable warning
  void _;
}
