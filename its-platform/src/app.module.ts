import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelemetryModule } from './infrastructure/telemetry/telemetry.module.js';
import { ResilienceModule } from './infrastructure/resilience/resilience.module.js';
import { HealthModule } from './health/health.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { LearnersModule } from './modules/learners/learners.module.js';
import { PracticeModule } from './modules/practice/practice.module.js';
import { PlacementModule } from './modules/placement/placement.module.js';
import { CurriculumModule } from './modules/curriculum/curriculum.module.js';
import { AuditModule } from './modules/audit/audit.module.js';

@Module({
  imports: [
    // TelemetryModule must be first to ensure all subsequent operations are traced
    TelemetryModule,
    // ResilienceModule provides circuit breaker, retry, and timeout patterns
    ResilienceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    DatabaseModule,
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
