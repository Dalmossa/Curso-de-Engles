import { Injectable } from '@nestjs/common';

/**
 * Retry Configuration
 */
export interface RetryConfig {
  maxAttempts: number;           // Maximum number of attempts (including first)
  baseDelay: number;             // Base delay in ms
  maxDelay: number;              // Maximum delay in ms
  jitter: boolean;               // Whether to add jitter
  jitterFactor: number;          // Jitter factor (0-1)
  retryableStatusCodes: number[]; // HTTP status codes that are retryable
  retryableErrors: string[];     // Error codes/names that are retryable
}

/**
 * Determines if an operation is idempotent and safe to retry
 */
export function isIdempotent(method: string): boolean {
  return ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(method.toUpperCase());
}

/**
 * Default retry configurations per operation type
 */
export const DEFAULT_RETRY_CONFIGS: Record<string, RetryConfig> = {
  // GET requests - safe to retry
  http_get: {
    maxAttempts: 3,
    baseDelay: 100,
    maxDelay: 5000,
    jitter: true,
    jitterFactor: 0.3,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE'],
  },
  // PUT/DELETE - idempotent, safe to retry
  http_idempotent: {
    maxAttempts: 3,
    baseDelay: 200,
    maxDelay: 10000,
    jitter: true,
    jitterFactor: 0.3,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE'],
  },
  // POST - NOT idempotent, only retry on network errors
  http_post: {
    maxAttempts: 2,
    baseDelay: 500,
    maxDelay: 5000,
    jitter: true,
    jitterFactor: 0.2,
    retryableStatusCodes: [], // Never retry POST on status codes
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE'],
  },
  // Database operations
  database: {
    maxAttempts: 3,
    baseDelay: 50,
    maxDelay: 1000,
    jitter: true,
    jitterFactor: 0.2,
    retryableStatusCodes: [],
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'connection terminated'],
  },
  // Redis operations
  redis: {
    maxAttempts: 3,
    baseDelay: 50,
    maxDelay: 500,
    jitter: true,
    jitterFactor: 0.2,
    retryableStatusCodes: [],
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'connection closed'],
  },
  // Default for unknown operations
  default: {
    maxAttempts: 3,
    baseDelay: 100,
    maxDelay: 5000,
    jitter: true,
    jitterFactor: 0.3,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE'],
  },
};

/**
 * Calculate delay with exponential backoff and optional jitter
 */
export function calculateDelay(
  attempt: number,
  config: RetryConfig
): number {
  const exponentialDelay = config.baseDelay * Math.pow(2, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
  
  if (!config.jitter) {
    return cappedDelay;
  }
  
  // Add jitter: random value between (1 - jitterFactor) and (1 + jitterFactor)
  const jitterRange = cappedDelay * config.jitterFactor;
  const jitter = (Math.random() - 0.5) * 2 * jitterRange;
  
  return Math.max(0, Math.floor(cappedDelay + jitter));
}

/**
 * Determine if an error is retryable based on configuration
 */
export function isRetryableError(error: unknown, config: RetryConfig): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorName = error instanceof Error ? error.name : '';
  const errorCode = (error as any).code || '';
  const statusCode = (error as any).status || (error as any).response?.status || 0;
  
  // Check status codes
  if (statusCode && config.retryableStatusCodes.includes(statusCode)) {
    return true;
  }
  
  // Check error codes/names
  for (const retryableError of config.retryableErrors) {
    if (
      errorCode.includes(retryableError) ||
      errorName.includes(retryableError) ||
      errorMessage.includes(retryableError)
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * Execute an operation with retry logic, exponential backoff, and jitter
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig,
  onRetry?: (attempt: number, error: unknown, delay: number) => void
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on last attempt
      if (attempt === config.maxAttempts) {
        break;
      }
      
      // Check if error is retryable
      if (!isRetryableError(error, config)) {
        throw error;
      }
      
      // Calculate delay
      const delay = calculateDelay(attempt, config);
      
      // Notify about retry
      if (onRetry) {
        onRetry(attempt, error, delay);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
