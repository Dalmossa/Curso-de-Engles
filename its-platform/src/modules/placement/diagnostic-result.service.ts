import { Injectable } from '@nestjs/common';
import type { DiagnosticRun } from '../../domain/entities/pilot-bank.js';
import {
  DiagnosticResultRepository,
  type PersistResult,
} from '../../infrastructure/repositories/diagnostic-result.repository.js';

/**
 * Application-layer entry point for P1.10: persist a completed `DiagnosticRun`. The domain and
 * the HTTP layer never see TypeORM; this is the seam they go through.
 */
@Injectable()
export class DiagnosticResultService {
  constructor(private readonly repository: DiagnosticResultRepository) {}

  async persistRun(run: DiagnosticRun): Promise<PersistResult> {
    return this.repository.persist(run);
  }
}
