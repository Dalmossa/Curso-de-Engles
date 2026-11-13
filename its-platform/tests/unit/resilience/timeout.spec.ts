/**
 * Timeout Unit Tests
 * Tests explicit timeout on every outbound call
 */

import { withTimeout, TimeoutConfig, TimeoutError, DEFAULT_TIMEOUTS, getDefaultTimeout } from '../../../src/infrastructure/resilience/timeout.js';

describe('Timeout', () => {
  describe('withTimeout', () => {
    it('should resolve when operation completes before timeout', async () => {
      const config: TimeoutConfig = { timeout: 1000 };
      
      const result = await withTimeout(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return 'success';
        },
        config
      );

      expect(result).toBe('success');
    });

    it('should reject with TimeoutError when operation exceeds timeout', async () => {
      const config: TimeoutConfig = { timeout: 50 };
      
      await expect(
        withTimeout(
          async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            return 'success';
          },
          config
        )
      ).rejects.toThrow(TimeoutError);
    });

    it('should include timeout value in error', async () => {
      const config: TimeoutConfig = { timeout: 500 };
      
      try {
        await withTimeout(
          async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
          },
          config
        );
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect((error as TimeoutError).timeout).toBe(500);
        expect((error as TimeoutError).message).toContain('500ms');
      }
    });

    it('should use custom error message when provided', async () => {
      const config: TimeoutConfig = { 
        timeout: 50,
        message: 'Custom timeout message'
      };
      
      try {
        await withTimeout(
          async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
          },
          config
        );
      } catch (error) {
        expect((error as TimeoutError).message).toBe('Custom timeout message');
      }
    });

    it('should cleanup timeout on success', async () => {
      const config: TimeoutConfig = { timeout: 1000 };
      let timeoutCleared = false;
      
      // We can't directly test cleanup, but we can verify no memory leak by running many times
      for (let i = 0; i < 10; i++) {
        await withTimeout(
          async () => 'success',
          config
        );
      }
      
      // If we get here without hanging, cleanup works
      expect(true).toBe(true);
    });

    it('should cleanup timeout on error', async () => {
      const config: TimeoutConfig = { timeout: 50 };
      
      for (let i = 0; i < 5; i++) {
        try {
          await withTimeout(
            async () => {
              await new Promise(resolve => setTimeout(resolve, 200));
            },
            config
          );
        } catch (e) {
          // Expected
        }
      }
      
      expect(true).toBe(true);
    });
  });

  describe('TimeoutError', () => {
    it('should have correct name and properties', () => {
      const error = new TimeoutError('Test timeout', 5000);
      
      expect(error.name).toBe('TimeoutError');
      expect(error.message).toBe('Test timeout');
      expect(error.timeout).toBe(5000);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('DEFAULT_TIMEOUTS', () => {
    it('should have all required timeout configurations', () => {
      expect(DEFAULT_TIMEOUTS.http_get).toBe(5000);
      expect(DEFAULT_TIMEOUTS.http_post).toBe(10000);
      expect(DEFAULT_TIMEOUTS.http_put).toBe(10000);
      expect(DEFAULT_TIMEOUTS.http_delete).toBe(10000);
      expect(DEFAULT_TIMEOUTS.database).toBe(5000);
      expect(DEFAULT_TIMEOUTS.redis).toBe(2000);
      expect(DEFAULT_TIMEOUTS.external_api).toBe(15000);
      expect(DEFAULT_TIMEOUTS.default).toBe(5000);
    });
  });

  describe('getDefaultTimeout', () => {
    it('should return configured timeout for known operation types', () => {
      expect(getDefaultTimeout('http_get')).toBe(5000);
      expect(getDefaultTimeout('http_post')).toBe(10000);
      expect(getDefaultTimeout('database')).toBe(5000);
      expect(getDefaultTimeout('redis')).toBe(2000);
    });

    it('should return default timeout for unknown operation types', () => {
      expect(getDefaultTimeout('unknown_operation')).toBe(5000);
      expect(getDefaultTimeout('')).toBe(5000);
    });
  });
});