import { Module } from '@nestjs/common';
import { PlacementController } from './placement.controller.js';
import { PlacementService } from './placement.service.js';
import { DiagnosticResultService } from './diagnostic-result.service.js';
import { DiagnosticResultRepository } from '../../infrastructure/repositories/diagnostic-result.repository.js';
import { PgSessionContext } from '../../infrastructure/persistence/pg-session-context.js';
import { LearnersModule } from '../learners/learners.module.js';

// `LearnersModule` supplies `LearnerScopeService`: before this route computes anything it resolves
// the addressed learner under the caller's RLS context (ADR-038 D3), so a placement cannot be run
// against a learner the caller cannot see.
@Module({
  imports: [LearnersModule],
  controllers: [PlacementController],
  providers: [PlacementService, DiagnosticResultService, DiagnosticResultRepository, PgSessionContext],
  exports: [DiagnosticResultService],
})
export class PlacementModule {}
