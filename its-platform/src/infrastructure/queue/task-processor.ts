/**
 * Task Processor — BullMQ workers for processing async tasks
 * 
 * Consumes jobs from priority, standard, and low queues.
 * Each worker is configured with appropriate concurrency and retry settings.
 * 
 * ADR-005, ADR-011
 */

import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service.js';
import type { QueueName, QueueJobData } from './queue.service.js';
import { AdaptiveEngine } from '../../domain/services/adaptive-engine.service.js';

@Injectable()
export class TaskProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TaskProcessor.name);
  private workers: Map<QueueName, Worker> = new Map();
  private adaptiveEngine: AdaptiveEngine | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly queueService: QueueService,
  ) {}

  setAdaptiveEngine(engine: AdaptiveEngine): void {
    this.adaptiveEngine = engine;
  }

  async onModuleInit(): Promise<void> {
    // Create workers for each queue
    this.createWorkers();
    this.logger.log('Task processor initialized with workers for priority, standard, and low queues');
  }

  async onModuleDestroy(): Promise<void> {
    // Graceful shutdown: close all workers
    await Promise.all(
      Array.from(this.workers.values()).map(w => w.close())
    );
    this.logger.log('Task processor shut down');
  }

  private createWorkers(): void {
    const redisConfig = {
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD') || undefined,
      db: this.config.get('REDIS_DB', 0),
    };

    // Priority worker - BKT updates (high concurrency, low latency)
    const priorityWorker = new Worker('priority', async (job: Job) => {
      return this.processJob(job);
    }, {
      connection: redisConfig,
      concurrency: 10, // High concurrency for BKT updates
      limiter: {
        max: 1000,
        duration: 1000, // Rate limit: 1000 jobs/sec
      },
    });

    // Standard worker - FSRS, IRT (moderate concurrency)
    const standardWorker = new Worker('standard', async (job: Job) => {
      return this.processJob(job);
    }, {
      connection: redisConfig,
      concurrency: 5, // Moderate concurrency
    });

    // Low worker - notifications, background tasks (low concurrency)
    const lowWorker = new Worker('low', async (job: Job) => {
      return this.processJob(job);
    }, {
      connection: redisConfig,
      concurrency: 2, // Low concurrency
    });

    // Set up event handlers
    for (const [name, worker] of [['priority', priorityWorker], ['standard', standardWorker], ['low', lowWorker]] as const) {
      worker.on('completed', (job: Job) => {
        this.logger.debug(`Job ${job.id} completed in ${name} worker`);
      });

      worker.on('failed', (job: Job | undefined, err: Error) => {
        this.logger.error(`Job ${job?.id} failed in ${name} worker: ${err.message}`, err.stack);
      });

      worker.on('stalled', (jobId: string) => {
        this.logger.warn(`Job ${jobId} stalled in ${name} worker`);
      });

      worker.on('error', (err: Error) => {
        this.logger.error(`${name} worker error: ${err.message}`, err.stack);
      });

      this.workers.set(name, worker);
    }
  }

  private async processJob(job: Job): Promise<void> {
    const taskType = job.name as keyof QueueJobData;
    const data = job.data as QueueJobData[keyof QueueJobData];

    if (!data) {
      this.logger.warn(`Job ${job.id} has no data for task ${taskType}`);
      return;
    }

    this.logger.debug(`Processing ${taskType} job ${job.id}`);

    // Handle each task type with explicit type checking
    if (taskType === 'updateBktMastery') {
      await this.processBktUpdate(data);
    } else if (taskType === 'scheduleFsrsReview') {
      await this.processFsrsReview(data);
    } else if (taskType === 'recalibrateIrt') {
      await this.processIrtRecalibration(data);
    } else if (taskType === 'sendNotification') {
      await this.processNotification(data);
    } else if (taskType === 'emitDomainEvent') {
      await this.processDomainEvent(data);
    } else {
      this.logger.warn(`Unknown task type: ${taskType}`);
    }
  }

  private async processBktUpdate(data: QueueJobData[keyof QueueJobData]): Promise<void> {
    if (!this.adaptiveEngine) {
      throw new Error('AdaptiveEngine not set on TaskProcessor');
    }

    // TypeScript doesn't narrow the type here, so we cast
    const bktData = data as QueueJobData['updateBktMastery'];
    if (!bktData || !('correct' in bktData)) {
      this.logger.warn('Invalid data for updateBktMastery');
      return;
    }

    // The adaptive engine's processPractice handles BKT internally
    // This worker is for fire-and-forget BKT updates from API layer
    // For now, we log and the actual BKT update happens in the adaptive engine
    this.logger.debug(`BKT update for learner ${bktData.learnerId}, skill ${bktData.skillId}, correct: ${bktData.correct}`);
  }

  private async processFsrsReview(data: QueueJobData[keyof QueueJobData]): Promise<void> {
    if (!this.adaptiveEngine) {
      throw new Error('AdaptiveEngine not set on TaskProcessor');
    }

    const fsrsData = data as QueueJobData['scheduleFsrsReview'];
    if (!fsrsData || !('grade' in fsrsData)) {
      this.logger.warn('Invalid data for scheduleFsrsReview');
      return;
    }

    this.logger.debug(`FSRS review for learner ${fsrsData.learnerId}, item ${fsrsData.itemId}, grade ${fsrsData.grade}`);
    // FSRS scheduling is handled in adaptive engine's processPractice
  }

  private async processIrtRecalibration(data: QueueJobData[keyof QueueJobData]): Promise<void> {
    if (!this.adaptiveEngine) {
      throw new Error('AdaptiveEngine not set on TaskProcessor');
    }

    const irtData = data as QueueJobData['recalibrateIrt'];
    if (!irtData || !('diagnosticId' in irtData)) {
      this.logger.warn('Invalid data for recalibrateIrt');
      return;
    }

    this.logger.log(`IRT recalibration for learner ${irtData.learnerId}, diagnostic ${irtData.diagnosticId}`);
    // IRT recalibration would be implemented when Stage-2 is available
  }

  private async processNotification(data: QueueJobData[keyof QueueJobData]): Promise<void> {
    const notifData = data as QueueJobData['sendNotification'];
    if (!notifData || !('template' in notifData)) {
      this.logger.warn('Invalid data for sendNotification');
      return;
    }

    this.logger.debug(`Notification for learner ${notifData.learnerId}: ${notifData.template}`);
    // Notification delivery implementation (email, push, in-app)
  }

  private async processDomainEvent(data: QueueJobData[keyof QueueJobData]): Promise<void> {
    const eventData = data as QueueJobData['emitDomainEvent'];
    if (!eventData || !('eventType' in eventData)) {
      this.logger.warn('Invalid data for emitDomainEvent');
      return;
    }

    this.logger.debug(`Domain event: ${eventData.eventType}, correlation: ${eventData.correlationId}`);
    // Domain events are emitted via the domain event bus
    // This worker could forward to Kafka for event streaming (ADR-011)
  }
}
