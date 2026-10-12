import { Module } from '@nestjs/common';
import { AuditService } from './audit.service.js';
import { AuditRepository } from '../../infrastructure/repositories/audit.repository.js';
import { PgSessionContext } from '../../infrastructure/persistence/pg-session-context.js';

/**
 * P2.2's write path, registered so `AuditService` is injectable wherever an event is emitted.
 *
 * There is **no controller and no route** here on purpose: this story adds an internal append
 * path and a verifier, not an API surface (an audit log is written by the code that acts, never
 * by a client). The providers get their `DataSource` from the global `DatabaseModule`, and
 * `PgSessionContext` (ADR-026) is the transaction/GUC owner the service injects for a
 * learner-scoped append.
 *
 * **No caller is wired yet.** `PracticeService` and the placement flow are the natural homes for
 * `session_start` / `session_end` / `item_response` / `diagnostic_run`; the auth, consent and
 * LGPD flows (P1.15–P1.17, M6) for the other eight. None of those has been changed by this story
 * — see `AuditService`'s header for the eight event types with no call site at all.
 */
@Module({
  providers: [AuditService, AuditRepository, PgSessionContext],
  exports: [AuditService, AuditRepository],
})
export class AuditModule {}
