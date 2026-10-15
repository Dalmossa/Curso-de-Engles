import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller.js';
import { PracticeService } from './practice.service.js';
import { LearnersModule } from '../learners/learners.module.js';

// `LearnersModule` supplies `LearnerScopeService`: a submission is only scored once the addressed
// learner has been resolved under the caller's RLS context (ADR-038 D3).
@Module({
  imports: [LearnersModule],
  controllers: [PracticeController],
  providers: [PracticeService],
})
export class PracticeModule {}
