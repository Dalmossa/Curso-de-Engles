import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { LearnersModule } from './modules/learners/learners.module.js';
import { PracticeModule } from './modules/practice/practice.module.js';
import { PlacementModule } from './modules/placement/placement.module.js';
import { CurriculumModule } from './modules/curriculum/curriculum.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AuditModule } from './modules/audit/audit.module.js';

@Module({
  imports: [
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
    AuthModule,
    AuditModule,
  ],
})
export class AppModule {}
