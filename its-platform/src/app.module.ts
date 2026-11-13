import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObservabilityModule } from './observability/observability.module.js';
import { ResilienceModule } from './infrastructure/resilience/resilience.module.js';
import { HealthModule } from './health/health.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ConsentModule } from './modules/consent/consent.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { LearnersModule } from './modules/learners/learners.module.js';
import { PracticeModule } from './modules/practice/practice.module.js';
import { PlacementModule } from './modules/placement/placement.module.js';
import { CurriculumModule } from './modules/curriculum/curriculum.module.js';
import { AuditModule } from './modules/audit/audit.module.js';

@Module({
  imports: [
    // ObservabilityModule must be first to ensure all subsequent operations are traced
    ObservabilityModule,
    // ResilienceModule provides circuit breaker, retry, and timeout patterns
    ResilienceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    DatabaseModule,
    AuthModule,
    ConsentModule,
    HealthModule,
    ContentModule,
    LearnersModule,
    PracticeModule,
    PlacementModule,
    CurriculumModule,
    AuditModule,
  ],
})
export class AppModule {}
