/**
 * Queue Service — High-level API for enqueueing async tasks
 * 
 * Provides typed job enqueueing with priority, delay, and retry options.
 * Uses BullMQ under the hood (ADR-005, ADR-011).
 */

import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue, QueueEvents, Job } from 'bullmq';
import type { JobsOptions } from 'bullmq';

export type QueueName = 'priority' | 'standard' | 'low';

export interface QueueJobData {
  // BKT mastery update
  updateBktMastery?: {
    learnerId: string;
    itemId: string;
    correct: boolean;
    responseTimeMs: number;
    itemType: string;
    nOptions: number;
    skillId: string;
  };
  // FSRS scheduling
  scheduleFsrsReview?: {
    learnerId: string;
    itemId: string;
    grade: 1 | 2 | 3 | 4;
    masteryProbability?: number;
    skillId: string;
  };
  // IRT recalibration
  recalibrateIrt?: {
    learnerId: string;
    diagnosticId: string;
  };
  // Notification
  sendNotification?: {
    learnerId: string;
    template: string;
    payload: Record<string, unknown>;
  };
  // Domain event emission
  emitDomainEvent?: {
    eventType: string;
    payload: Record<string, unknown>;
    correlationId: string;
  };
}

export interface EnqueueOptions {
  queue?: QueueName;
  delay?: number;           // ms
  priority?: number;        // higher = more urgent (priority queue only)
  attempts?: number;        // retry count
  backoff?: number | 'exponential'; // ms or exponential
  jobId?: string;           // for idempotency
  removeOnComplete?: number | boolean;
  removeOnFail?: number | boolean;
}

export interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private queueEvents: Map<QueueName, QueueEvents> = new Map();

  constructor(
    @Inject('PRIORITY_QUEUE') private readonly priorityQueue: Queue,
    @Inject('STANDARD_QUEUE') private readonly standardQueue: Queue,
    @Inject('LOW_QUEUE') private readonly lowQueue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    // Wait for queues to be ready
    await Promise.all([
      this.priorityQueue.waitUntilReady(),
      this.standardQueue.waitUntilReady(),
      this.lowQueue.waitUntilReady(),
    ]);

    // Set up event listeners for monitoring
    for (const [name, queue] of Object.entries({ priority: this.priorityQueue, standard: this.standardQueue, low: this.lowQueue })) {
      const qEvents = new QueueEvents(name);
      qEvents.on('completed', ({ jobId }: { jobId: string }) => {
        this.logger.debug(`Job ${jobId} completed in ${name} queue`);
      });
      qEvents.on('failed', ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
        this.logger.warn(`Job ${jobId} failed in ${name} queue: ${failedReason}`);
      });
      qEvents.on('stalled', ({ jobId }: { jobId: string }) => {
        this.logger.warn(`Job ${jobId} stalled in ${name} queue`);
      });
      this.queueEvents.set(name as QueueName, qEvents);
    }

    this.logger.log('Queue service initialized with priority, standard, and low queues');
  }

  async onModuleDestroy(): Promise<void> {
    // Graceful shutdown: wait for active jobs, then close
    await Promise.all([
      this.priorityQueue.close(),
      this.standardQueue.close(),
      this.lowQueue.close(),
    ]);

    // Close queue events
    for (const [, events] of this.queueEvents) {
      await events.close();
    }

    this.logger.log('Queue service shut down');
  }

  /**
   * Get queue by name
   */
  private getQueue(name: QueueName): Queue {
    switch (name) {
      case 'priority': return this.priorityQueue;
      case 'standard': return this.standardQueue;
      case 'low': return this.lowQueue;
    }
  }

  /**
   * Enqueue a job with typed data
   */
  async enqueue<T extends keyof QueueJobData>(
    taskType: T,
    data: QueueJobData[T],
    options: EnqueueOptions = {}
  ): Promise<Job<QueueJobData[T]>> {
    const { queue = this.selectQueue(taskType), ...opts } = options;
    const bullQueue = this.getQueue(queue);

    const jobData = { [taskType]: data } as QueueJobData;
    const jobOptions: JobsOptions = {
      delay: opts.delay ?? 0,
      priority: opts.priority ?? (queue === 'priority' ? 9 : 5),
      attempts: opts.attempts ?? 3,
      backoff: opts.backoff === 'exponential' ? { type: 'exponential', delay: 1000 } : { type: 'fixed', delay: opts.backoff ?? 5000 },
      removeOnComplete: opts.removeOnComplete ?? true,
      removeOnFail: opts.removeOnFail ?? false,
    };

    // Only add jobId if provided
    if (opts.jobId) {
      jobOptions.jobId = opts.jobId;
    }

    const job = await bullQueue.add(taskType, jobData, jobOptions);
    this.logger.debug(`Enqueued ${taskType} job ${job.id} to ${queue} queue`);

    return job;
  }

  /**
   * Select appropriate queue based on task type
   */
  private selectQueue(taskType: keyof QueueJobData): QueueName {
    // Priority queue for learner-facing, latency-sensitive updates
    if (taskType === 'updateBktMastery') return 'priority';
    // Standard queue for scheduled/periodic work
    if (taskType === 'scheduleFsrsReview' || taskType === 'recalibrateIrt') return 'standard';
    // Low queue for notifications and background tasks
    return 'low';
  }

  /**
   * Enqueue BKT mastery update (priority queue)
   */
  async enqueueBktUpdate(
    learnerId: string,
    itemId: string,
    correct: boolean,
    responseTimeMs: number,
    itemType: string,
    nOptions: number,
    skillId: string,
    options: Omit<EnqueueOptions, 'queue'> = {}
  ): Promise<Job> {
    return this.enqueue('updateBktMastery', {
      learnerId,
      itemId,
      correct,
      responseTimeMs,
      itemType,
      nOptions,
      skillId,
    }, { ...options, queue: 'priority', priority: options.priority ?? 9 });
  }

  /**
   * Enqueue FSRS review scheduling (standard queue)
   */
  async enqueueFsrsReview(
    learnerId: string,
    itemId: string,
    grade: 1 | 2 | 3 | 4,
    masteryProbability: number | undefined,
    skillId: string,
    options: Omit<EnqueueOptions, 'queue'> = {}
  ): Promise<Job> {
    const payload: QueueJobData['scheduleFsrsReview'] = {
      learnerId,
      itemId,
      grade,
      skillId,
    };
    if (masteryProbability !== undefined) {
      payload.masteryProbability = masteryProbability;
    }
    return this.enqueue('scheduleFsrsReview', payload, { ...options, queue: 'standard' });
  }

  /**
   * Enqueue IRT recalibration (standard queue)
   */
  async enqueueIrtRecalibration(
    learnerId: string,
    diagnosticId: string,
    options: Omit<EnqueueOptions, 'queue'> = {}
  ): Promise<Job> {
    return this.enqueue('recalibrateIrt', {
      learnerId,
      diagnosticId,
    }, { ...options, queue: 'standard' });
  }

  /**
   * Enqueue notification (low queue)
   */
  async enqueueNotification(
    learnerId: string,
    template: string,
    payload: Record<string, unknown>,
    options: Omit<EnqueueOptions, 'queue'> = {}
  ): Promise<Job> {
    return this.enqueue('sendNotification', {
      learnerId,
      template,
      payload,
    }, { ...options, queue: 'low' });
  }

  /**
   * Enqueue domain event emission (priority queue for critical events)
   */
  async enqueueDomainEvent(
    eventType: string,
    payload: Record<string, unknown>,
    correlationId: string,
    options: Omit<EnqueueOptions, 'queue'> = {}
  ): Promise<Job> {
    return this.enqueue('emitDomainEvent', {
      eventType,
      payload,
      correlationId,
    }, { ...options, queue: 'priority', priority: options.priority ?? 7 });
  }

  /**
   * Get job status
   */
  async getJobStatus(queueName: QueueName, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);
    return job ?? null;
  }

  /**
   * Get queue metrics
   */
  async getQueueMetrics(queueName: QueueName): Promise<QueueMetrics> {
    const queue = this.getQueue(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Get all queue metrics
   */
  async getAllMetrics(): Promise<Record<QueueName, QueueMetrics>> {
    const [priority, standard, low] = await Promise.all([
      this.getQueueMetrics('priority'),
      this.getQueueMetrics('standard'),
      this.getQueueMetrics('low'),
    ]);

    return { priority, standard, low };
  }

  /**
   * Pause/resume queue
   */
  async pauseQueue(queueName: QueueName): Promise<void> {
    await this.getQueue(queueName).pause();
    this.logger.log(`Paused ${queueName} queue`);
  }

  async resumeQueue(queueName: QueueName): Promise<void> {
    await this.getQueue(queueName).resume();
    this.logger.log(`Resumed ${queueName} queue`);
  }

  /**
   * Clean completed/failed jobs
   */
  async cleanQueue(queueName: QueueName, grace: number = 86400000, limit: number = 100): Promise<string[]> {
    const queue = this.getQueue(queueName);
    return queue.clean(grace, limit, 'completed');
  }
}

// Types
export interface QueueJobData {
  // BKT mastery update
  updateBktMastery?: {
    learnerId: string;
    itemId: string;
    correct: boolean;
    responseTimeMs: number;
    itemType: string;
    nOptions: number;
    skillId: string;
  };
  // FSRS scheduling
  scheduleFsrsReview?: {
    learnerId: string;
    itemId: string;
    grade: 1 | 2 | 3 | 4;
    masteryProbability?: number;
    skillId: string;
  };
  // IRT recalibration
  recalibrateIrt?: {
    learnerId: string;
    diagnosticId: string;
  };
  // Notification
  sendNotification?: {
    learnerId: string;
    template: string;
    payload: Record<string, unknown>;
  };
  // Domain event emission
  emitDomainEvent?: {
    eventType: string;
    payload: Record<string, unknown>;
    correlationId: string;
  };
}

export interface EnqueueOptions {
  queue?: QueueName;
  delay?: number;           // ms
  priority?: number;        // higher = more urgent (priority queue only)
  attempts?: number;        // retry count
  backoff?: number | 'exponential'; // ms or exponential
  jobId?: string;           // for idempotency
  removeOnComplete?: number | boolean;
  removeOnFail?: number | boolean;
}

export interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}
