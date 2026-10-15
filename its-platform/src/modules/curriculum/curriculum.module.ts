import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller.js';
import { CurriculumService } from './curriculum.service.js';
import { LearnersModule } from '../learners/learners.module.js';

// `LearnersModule` is imported for `LearnerScopeService` — the one place that answers "may this
// caller see the learner this route addresses?". Importing the module does not register its
// controller a second time; it makes the single implementation of ADR-038 D3 reachable from here.
@Module({
  imports: [LearnersModule],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}
