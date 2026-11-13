/**
 * Retry Policy Unit Tests
 * Tests exponential backoff + jitter with idempotency check
 */

import {
  executeWithRetry,
  calculateDelay,
  isRetryableError,
  isIdempotent,
  RetryConfig,
  DEFAULT_RETRY_CONFIGS,
} from '../../../src/infrastructure/resilience/retry.js';

describe('Retry Policy', () => {
  describe('isIdempotent', () => {
    it('should return true for idempotent HTTP methods', () => {
      expect(isIdempotent('GET')).toBe(true);
      expect(isIdempotent('HEAD')).toBe(true);
      expect(isIdempotent('OPTIONS')).toBe(true);
      expect(isIdempotent('PUT')).toBe(true);
      expect(isIdempotent('DELETE')).toBe(true);
      expect(isIdempotent('get')).toBe(true); // case insensitive
      expect(isIdempotent('Put')).toBe(true);
    });

    it('should return false for non-idempotent HTTP methods', () => {
      expect(isIdempotent('POST')).toBe(false);
      expect(isIdempotent('PATCH')).toBe(false);
      expect(isIdempotent('post')).toBe(false);
    });
  });

  describe('calculateDelay', () => {
    const config: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 100,
      maxDelay: 5000,
      jitter: true,
      jitterFactor: 0.3,
      retryableStatusCodes: [500, 502, 503],
      retryableErrors: ['ECONNRESET'],
    };

    it('should calculate exponential backoff', () => {
      const delay1 = calculateDelay(1, { ...config, jitter: false });
      const delay2 = calculateDelay(2, { ...config, jitter: false });
      const delay3 = calculateDelay(3, { ...config, jitter: false });

      expect(delay1).toBe(100);  // 100 * 2^0
      expect(delay2).toBe(200);  // 100 * 2^1
      expect(delay3).toBe(400);  // 100 * 2^2
    });

    it('should cap at maxDelay', () => {
      const delay = calculateDelay(10, { ...config, jitter: false, maxDelay: 500 });
      expect(delay).toBe(500);
    });

    it('should add jitter when enabled', () => {
      const delays = new Set<number>();
      for (let i = 0; i < 100; i++) {
        delays.add(calculateDelay(1, config));
      }
      // With jitter, we should get varied delays
      expect(delays.size).toBeGreaterThan(1);
      // All delays should be within jitter range (70-130 for base 100 with factor 0.3)
      for (const delay of delays) {
        expect(delay).toBeGreaterThanOrEqual(70);
        expect(delay).toBeLessThanOrEqual(130);
      }
    });

    it('should not add jitter when disabled', () => {
      const delay = calculateDelay(1, { ...config, jitter: false });
      expect(delay).toBe(100);
    });

    it('should handle zero jitter factor', () => {
      const delay = calculateDelay(1, { ...config, jitterFactor: 0 });
      expect(delay).toBe(100);
    });
  });

  describe('isRetryableError', () => {
    const config: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 100,
      maxDelay: 5000,
      jitter: true,
      jitterFactor: 0.3,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
      retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE'],
    };

    it('should return true for retryable status codes', () => {
      const error = { status: 500, response: { status: 500 } };
      expect(isRetryableError(error, config)).toBe(true);

      const error2 = { status: 429 };
      expect(isRetryableError(error2, config)).toBe(true);
    });

    it('should return false for non-retryable status codes', () => {
      const error = { status: 400 };
      expect(isRetryableError(error, config)).toBe(false);

      const error2 = { status: 401 };
      expect(isRetryableError(error2, config)).toBe(false);
    });

    it('should return true for retryable error codes', () => {
      const error = new Error('Connection reset');
      (error as any).code = 'ECONNRESET';
      expect(isRetryableError(error, config)).toBe(true);
    });

    it('should return true for retryable error names', () => {
      const error = new Error('timeout');
      error.name = 'ETIMEDOUT';
      expect(isRetryableError(error, config)).toBe(true);
    });

    it('should return true for retryable error messages', () => {
      const error = new Error('ECONNREFUSED: Connection refused');
      expect(isRetryableError(error, config)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const error = new Error('Unauthorized');
      error.name = 'AuthError';
      expect(isRetryableError(error, config)).toBe(false);
    });

    it('should handle null/undefined errors', () => {
      expect(isRetryableError(null, config)).toBe(false);
      expect(isRetryableError(undefined, config)).toBe(false);
    });
  });

  describe('executeWithRetry', () => {
    it('should succeed on first attempt', async () => {
      const config: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 10,
        maxDelay: 100,
        jitter: false,
        jitterFactor: 0,
        retryableStatusCodes: [500],
        retryableErrors: ['ECONNRESET'],
      };

      let attempts = 0;
      const result = await executeWithRetry(async () => {
        attempts++;
        return 'success';
      }, config);

      expect(result).toBe('success');
      expect(attempts).toBe(1);
    });

    it('should retry on retryable errors', async () => {
      const config: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 10,
        maxDelay: 100,
        jitter: false,
        jitterFactor: 0,
        retryableStatusCodes: [500],
        retryableErrors: ['ECONNRESET'],
      };

      let attempts = 0;
      const result = await executeWithRetry(async () => {
        attempts++;
        if (attempts < 3) {
          const error = new Error('Server error');
          (error as any).status = 500;
          throw error;
        }
        return 'success';
      }, config);

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should not retry on non-retryable errors', async () => {
      const config: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 10,
        maxDelay: 100,
        jitter: false,
        jitterFactor: 0,
        retryableStatusCodes: [500],
        retryableErrors: ['ECONNRESET'],
      };

      let attempts = 0;
      await expect(
        executeWithRetry(async () => {
          attempts++;
          const error = new Error('Bad request');
          (error as any).status = 400;
          throw error;
        }, config)
      ).rejects.toThrow('Bad request');

      expect(attempts).toBe(1);
    });

    it('should not retry on last attempt', async () => {
      const config: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 10,
        maxDelay: 100,
        jitter: false,
        jitterFactor: 0,
        retryableStatusCodes: [500],
        retryableErrors: ['ECONNRESET'],
      };

      let attempts = 0;
      await expect(
        executeWithRetry(async () => {
          attempts++;
          const error = new Error('Server error');
          (error as any).status = 500;
          throw error;
        }, config)
      ).rejects.toThrow('Server error');

      expect(attempts).toBe(3);
    });

    it('should call onRetry callback', async () => {
      const config: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 10,
        maxDelay: 100,
        jitter: false,
        jitterFactor: 0,
        retryableStatusCodes: [500],
        retryableErrors: ['ECONNRESET'],
      };

      const retryCalls: Array<{ attempt: number; delay: number }> = [];
      let attempts = 0;

      await expect(
        executeWithRetry(
          async () => {
            attempts++;
            const error = new Error('Server error');
            (error as any).status = 500;
            throw error;
          },
          config,
          (attempt, error, delay) => {
            retryCalls.push({ attempt, delay });
          }
        )
      ).rejects.toThrow('Server error');

      expect(retryCalls.length).toBe(2); // Called on attempts 1 and 2
      expect(retryCalls[0]?.attempt).toBe(1);
      expect(retryCalls[1]?.attempt).toBe(2);
    });

    it('should use default config when not specified', () => {
      const config = DEFAULT_RETRY_CONFIGS['default']!;
      expect(config.maxAttempts).toBe(3);
      expect(config.baseDelay).toBe(100);
      expect(config.jitter).toBe(true);
    });
  });
});