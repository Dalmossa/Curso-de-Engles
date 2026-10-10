/**
 * Queue Health Check — Health check for BullMQ queues
 * 
 * Simple health check functions (not using @nestjs/terminus due to version conflicts).
 * Can be used by custom health check endpoints.
 */

import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service.js';
import type { QueueName, QueueMetrics } from './queue.service.js';

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: 'healthy' | 'degraded' | 'unhealthy'; metric?: QueueMetrics; message?: string }>;
}

export interface QueueHealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  metric: QueueMetrics;
  message: string;
}

interface CheckEntry {
  status: 'healthy' | 'degraded' | 'unhealthy';
  metric?: QueueMetrics;
  message?: string;
}

@Injectable()
export class QueueHealthCheck {
  constructor(private readonly queueService: QueueService) {}

  /**
   * Check if all queues are healthy
   */
  async checkAll(): Promise<HealthCheckResult> {
    try {
      const metrics = await this.queueService.getAllMetrics();
      
      // Check if any queue has excessive failed jobs
      const failedThreshold = 100;
      const stuckThreshold = 50;
      
      const checks: Record<string, CheckEntry> = {};
      let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      for (const [queueName, metric] of Object.entries(metrics)) {
        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        let message: string | undefined;
        
        if (metric.failed > failedThreshold) {
          status = 'unhealthy';
          message = `${metric.failed} failed jobs (threshold: ${failedThreshold})`;
          overallStatus = 'unhealthy';
        } else if (metric.active > stuckThreshold) {
          status = 'degraded';
          message = `${metric.active} active jobs (possible stall)`;
          if (overallStatus === 'healthy') overallStatus = 'degraded';
        }
        
        const entry: CheckEntry = { status, metric };
        if (message !== undefined) {
          entry.message = message;
        }
        checks[queueName] = entry;
      }

      return { status: overallStatus, checks };
    } catch (error) {
      return {
        status: 'unhealthy',
        checks: {
          error: { status: 'unhealthy', message: error instanceof Error ? error.message : 'Unknown error' }
        }
      };
    }
  }

  /**
   * Check specific queue
   */
  async checkQueue(queueName: 'priority' | 'standard' | 'low'): Promise<QueueHealthCheckResult> {
    try {
      const metric = await this.queueService.getQueueMetrics(queueName);
      
      const failedThreshold = 100;
      const stuckThreshold = 50;
      
      if (metric.failed > failedThreshold) {
        return { status: 'unhealthy', metric, message: `${metric.failed} failed jobs (threshold: ${failedThreshold})` };
      }
      
      if (metric.active > stuckThreshold) {
        return { status: 'degraded', metric, message: `${metric.active} active jobs (possible stall)` };
      }
      
      return { status: 'healthy', metric, message: 'OK' };
    } catch (error) {
      return {
        status: 'unhealthy',
        metric: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Re-export QueueMetrics for consumers
export type { QueueMetrics } from './queue.service.js';
