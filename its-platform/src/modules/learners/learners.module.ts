/**
 * The `learners` context.
 *
 * `LearnerScopeService` is **exported** on purpose. Four of the five learner-scoped routes live in
 * other modules (`curriculum`, `placement`, `practice`), and every one of them has to ask the same
 * question — *"is the learner this request addresses visible to this caller?"* — before it answers.
 * Exporting makes that dependency explicit and single: one implementation of the rule, four
 * callers, no second copy that can drift. `PgSessionContext` and `LearnerRepository` are its
 * collaborators and are provided here because this is the module that owns them; ADR-026 §2 keeps
 * the transaction and the GUC in that pair, never in a handler.
 */

import { Module } from '@nestjs/common';
import { LearnersController } from './learners.controller.js';
import { LearnersService } from './learners.service.js';
import { LearnerScopeService } from './learner-scope.service.js';
import { LearnerRepository } from '../../infrastructure/repositories/learner.repository.js';
import { PgSessionContext } from '../../infrastructure/persistence/pg-session-context.js';

@Module({
  controllers: [LearnersController],
  providers: [LearnersService, LearnerScopeService, LearnerRepository, PgSessionContext],
  exports: [LearnerScopeService],
})
export class LearnersModule {}
