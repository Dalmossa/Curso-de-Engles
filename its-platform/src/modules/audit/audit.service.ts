/**
 * P2.2 — `AuditService`: the validated seam between callers and the insert-only audit repository.
 *
 * It does two things and nothing else:
 *
 * 1. **Validates what a caller may write.** `event_type` is one of the closed twelve; a
 *    `learner_id`, when present, is a UUID (or `null` for a system/audit row); `payload` is a
 *    **plain** object — not an array, not a `Date`, not a class instance — because `payload` is
 *    `JSONB` and its shape is the event's data, so anything that survives `JSON.stringify` as
 *    something other than an object has lost its keys. The database CHECKs and the enum are the
 *    backstop, not the validation: a `TypeError` from `JSON.stringify` on a cyclic object is a
 *    500, and a wrong `event_type` is a 500 from the enum, neither of which should reach a caller.
 * 2. **Routes the write through the right transaction.** A learner-scoped event is written inside
 *    `PgSessionContext.withLearner` — the single writer of the learner session GUC (ADR-026 §1)
 *    — because ADR-003's `learner_isolation` `WITH CHECK` refuses the row otherwise. A
 *    `learner_id IS NULL` event is deliberately **not** given a learner context: it is a
 *    system/audit row, invisible under the learner policy and admissible only to
 *    `its_platform_admin`/`its_platform_worker`, which is the context a caller emitting one must
 *    already be running in.
 *
 * ## Why each of the twelve event types is emitted
 *
 * The vocabulary is closed (CONSTITUTION §4.6, domain-model X-3); the list below is the *reason*
 * for each member, not an extension of it.
 *
 * | `event_type` | Emitted when | Source of the obligation |
 * |---|---|---|
 * | `item_response` | a learner answers a practice/diagnostic item | stats §9.1; `item_responses` is the current state, this is the immutable trail |
 * | `diagnostic_run` | a placement/diagnostic run completes | stats §9.1; placement is the most consequential derived fact, so its run is recordable |
 * | `session_start` | a practice session opens | stats §9.1 |
 * | `session_end` | a practice session closes | stats §9.1 |
 * | `auth_success` | an authentication attempt succeeds | ASVS `v4.0.3-7.1.3`/`7.2.1` (both outcomes) |
 * | `auth_failure` | an authentication attempt fails | ASVS `v4.0.3-7.1.3`/`7.2.1` — **failure is the security-relevant half** |
 * | `access_denied` | a request is refused by authZ/RLS | ASVS `v4.0.3-7.2.2` (all access-control denials) |
 * | `validation_failure` | a request fails validation before dispatch | ASVS `v4.0.3-7.2.1`; attacks and integrations show up here before anywhere else |
 * | `consent_granted` | a learner grants a purpose-specific consent | LGPD Art. 8 / domain-model X-2; the withdrawal transition is only provable if the grant is recorded |
 * | `consent_withdrawn` | a learner withdraws a consent | LGPD Art. 8/18; the WORM chain keeps the grant→withdraw history even after erasure is applied |
 * | `data_export` | a data-subject export is served | LGPD Art. 18; the audit trail the LGPD requires |
 * | `data_erasure` | a data-subject erasure is applied | LGPD Art. 18; paired with `learners … ON DELETE SET NULL` on the chain (domain-model X-2) |
 *
 * **Call sites that do not exist yet.** Only the four practice/diagnostic events have a natural
 * home in the built code (`PracticeService`, the placement flow). The other eight —
 * `auth_success`, `auth_failure`, `access_denied`, `validation_failure`, `consent_granted`,
 * `consent_withdrawn`, `data_export`, `data_erasure` — belong to P1.15–P1.17 (auth, consent,
 * LGPD export/erasure) and M6, which are **not built**. This story provides the write path and
 * the verifier; it does **not** invent those call sites, and no current code emits these eight.
 * Where they land, they call `AuditService.append` — the vocabulary above is the contract they
 * will satisfy.
 */

import { Injectable } from '@nestjs/common';
import {
  AUDIT_EVENT_TYPES,
  type AuditAppendResult,
  type AuditEventInput,
  type AuditEventType,
  AuditRepository,
} from '../../infrastructure/repositories/audit.repository.js';
import { PgSessionContext } from '../../infrastructure/persistence/pg-session-context.js';

/** A caller handed the audit path something it cannot write. A 400 at the HTTP edge, not a 500. */
export class AuditValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuditValidationError';
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** Throws `AuditValidationError` on the first problem; returns nothing on success. */
export function assertValidAuditEvent(event: AuditEventInput): void {
  if (!AUDIT_EVENT_TYPES.includes(event.eventType)) {
    throw new AuditValidationError(
      `event_type ${String(event.eventType)} is not one of the closed ${AUDIT_EVENT_TYPES.length} values`,
    );
  }

  if (event.learnerId !== undefined && event.learnerId !== null) {
    if (typeof event.learnerId !== 'string' || !UUID_RE.test(event.learnerId)) {
      throw new AuditValidationError(
        `learner_id must be a UUID or null, got ${String(event.learnerId)}`,
      );
    }
  }

  for (const [field, value] of [
    ['session_id', event.sessionId],
    ['lesson_id', event.lessonId],
    ['item_id', event.itemId],
  ] as const) {
    if (value !== undefined && value !== null && typeof value !== 'string') {
      throw new AuditValidationError(`${field} must be a string or null`);
    }
  }

  if (event.skillIds !== undefined && event.skillIds !== null) {
    if (!Array.isArray(event.skillIds) || event.skillIds.some(id => typeof id !== 'string')) {
      throw new AuditValidationError('skill_ids must be an array of strings or null');
    }
  }

  if (!isPlainObject(event.payload)) {
    throw new AuditValidationError(
      'payload must be a plain object (JSONB); an array, Date, or class instance is not one',
    );
  }
}

/** Identity of the appended row: `seq` is a string (BIGINT — see `audit.repository.ts`). */
export type { AuditAppendResult } from '../../infrastructure/repositories/audit.repository.js';
export type {
  AuditEventInput,
  AuditEventType,
} from '../../infrastructure/repositories/audit.repository.js';

@Injectable()
export class AuditService {
  constructor(
    private readonly repository: AuditRepository,
    private readonly sessionContext: PgSessionContext,
  ) {}

  /**
   * Validate and append one event.
   *
   * A learner-scoped event goes through `withLearner`, so its `INSERT` is evaluated against the
   * caller's learner session context; a system event is appended directly and the caller must be
   * in a worker/admin context (see the file header).
   */
  async append(event: AuditEventInput): Promise<AuditAppendResult> {
    assertValidAuditEvent(event);

    if (event.learnerId !== undefined && event.learnerId !== null) {
      return this.sessionContext.withLearner(event.learnerId, tx =>
        this.repository.append(event, tx),
      );
    }

    return this.repository.append(event);
  }
}
