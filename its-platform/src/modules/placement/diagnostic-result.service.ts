import { Injectable } from '@nestjs/common';
import type { DiagnosticRun } from '../../domain/entities/pilot-bank.js';
import {
  DiagnosticResultRepository,
  type PersistResult,
} from '../../infrastructure/repositories/diagnostic-result.repository.js';
import { PgSessionContext } from '../../infrastructure/persistence/pg-session-context.js';

/**
 * Application-layer entry point for P1.10: persist a completed `DiagnosticRun`. The domain and
 * the HTTP layer never see TypeORM; this is the seam they go through.
 *
 * ADR-026 §2: the production path must run inside a learner context, or `persist()` is refused by
 * ADR-003's RLS policy when it runs as `its_platform_app`. `withLearner` opens the transaction and
 * sets the GUC; the repository joins it via its existing `tx` parameter. This keeps the production
 * path identical to the one the integration suite exercises through `PgSessionContext`.
 */
@Injectable()
export class DiagnosticResultService {
  constructor(
    private readonly repository: DiagnosticResultRepository,
    private readonly sessionContext: PgSessionContext,
  ) {}

  async persistRun(run: DiagnosticRun): Promise<PersistResult> {
    return this.sessionContext.withLearner(run.learnerId, tx => this.repository.persist(run, tx));
  }
}
