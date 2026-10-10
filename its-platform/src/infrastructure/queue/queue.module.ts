/**
 * Queue Module — BullMQ-based async task processing
 * 
 * Implements ADR-005 (Celery + Redis) adapted for NestJS/TypeScript using BullMQ.
 * Priority queues: priority > standard > low
 * 
 * Pure TypeScript infrastructure layer.
 */

import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { QueueService } from './queue.service.js';
import { TaskProcessor } from './task-processor.js';
import { QueueHealthCheck } from './queue-health.indicator.js';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PRIORITY_QUEUE',
      useFactory: (config: ConfigService) => {
        const redisConfig = {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD') || undefined,
          db: config.get('REDIS_DB', 0),
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => Math.min(times * 100, 3000),
          enableReadyCheck: true,
          lazyConnect: false,
        };
        return new Queue('priority', { connection: redisConfig, defaultJobOptions: { removeOnComplete: 100, removeOnFail: 50 } });
      },
      inject: [ConfigService],
    },
    {
      provide: 'STANDARD_QUEUE',
      useFactory: (config: ConfigService) => {
        const redisConfig = {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD') || undefined,
          db: config.get('REDIS_DB', 0),
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => Math.min(times * 100, 3000),
          enableReadyCheck: true,
          lazyConnect: false,
        };
        return new Queue('standard', { connection: redisConfig, defaultJobOptions: { removeOnComplete: 100, removeOnFail: 50 } });
      },
      inject: [ConfigService],
    },
    {
      provide: 'LOW_QUEUE',
      useFactory: (config: ConfigService) => {
        const redisConfig = {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD') || undefined,
          db: config.get('REDIS_DB', 0),
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => Math.min(times * 100, 3000),
          enableReadyCheck: true,
          lazyConnect: false,
        };
        return new Queue('low', { connection: redisConfig, defaultJobOptions: { removeOnComplete: 50, removeOnFail: 20 } });
      },
      inject: [ConfigService],
    },
    QueueService,
    TaskProcessor,
    QueueHealthCheck,
  ],
  exports: ['PRIORITY_QUEUE', 'STANDARD_QUEUE', 'LOW_QUEUE', QueueService, TaskProcessor, QueueHealthCheck],
})
export class QueueModule {}
