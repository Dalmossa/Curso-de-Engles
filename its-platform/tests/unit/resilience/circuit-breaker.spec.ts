/**
 * Circuit Breaker Unit Tests
 * Tests the closed → open → half-open state machine
 */

import { CircuitBreaker, CircuitState, CircuitBreakerConfig } from '../../../src/infrastructure/resilience/circuit-breaker.js';

describe('CircuitBreaker', () => {
  const defaultConfig: CircuitBreakerConfig = {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 100, // Short timeout for testing
    monitoringWindow: 1000,
  };

  let circuitBreaker: CircuitBreaker;

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker(defaultConfig);
  });

  describe('Initial State', () => {
    it('should start in CLOSED state', () => {
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });

    it('should have zero failure and success counts', () => {
      const metrics = circuitBreaker.getMetrics();
      expect(metrics.failureCount).toBe(0);
      expect(metrics.successCount).toBe(0);
    });
  });

  describe('Closed State Behavior', () => {
    it('should execute operation successfully in closed state', async () => {
      const result = await circuitBreaker.execute(async () => 'success');
      expect(result).toBe('success');
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });

    it('should increment failure count on error', async () => {
      try {
        await circuitBreaker.execute(async () => { throw new Error('failure'); });
      } catch (e) {
        // Expected
      }
      expect(circuitBreaker.getMetrics().failureCount).toBe(1);
    });

    it('should transition to OPEN after failure threshold reached', async () => {
      // Fail 3 times (threshold)
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }
      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    });

    it('should execute fallback when open', async () => {
      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }

      const result = await circuitBreaker.execute(
        async () => { throw new Error('should not execute'); },
        async () => 'fallback-result'
      );
      expect(result).toBe('fallback-result');
    });

    it('should throw when open and no fallback provided', async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }

      await expect(
        circuitBreaker.execute(async () => 'should not execute')
      ).rejects.toThrow('Circuit breaker is OPEN');
    });
  });

  describe('Open State Behavior', () => {
    it('should transition to HALF_OPEN after timeout', async () => {
      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }
      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 150));

      // Next execution should transition to half-open
      // Use a successful operation to stay in HALF_OPEN
      await circuitBreaker.execute(async () => 'success');
      
      expect(circuitBreaker.getState()).toBe(CircuitState.HALF_OPEN);
    });

    it('should reject calls immediately when open (before timeout)', async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }

      await expect(
        circuitBreaker.execute(async () => 'should not execute')
      ).rejects.toThrow('Circuit breaker is OPEN');
    });
  });

  describe('Half-Open State Behavior', () => {
    it('should transition to CLOSED after success threshold', async () => {
      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }

      // Wait for timeout to enter half-open
      await new Promise(resolve => setTimeout(resolve, 150));

      // Succeed twice (success threshold)
      await circuitBreaker.execute(async () => 'success');
      await circuitBreaker.execute(async () => 'success');

      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });

    it('should transition back to OPEN on any failure in half-open', async () => {
      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }

      // Wait for timeout to enter half-open
      await new Promise(resolve => setTimeout(resolve, 150));

      // Fail once in half-open
      try {
        await circuitBreaker.execute(async () => { throw new Error('failure'); });
      } catch (e) {}

      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    });

    it('should reset failure count on successful close', async () => {
      // Open the circuit
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }

      // Wait for timeout to enter half-open
      await new Promise(resolve => setTimeout(resolve, 150));

      // Succeed twice to close
      await circuitBreaker.execute(async () => 'success');
      await circuitBreaker.execute(async () => 'success');

      expect(circuitBreaker.getMetrics().failureCount).toBe(0);
      expect(circuitBreaker.getMetrics().successCount).toBe(0);
    });
  });

  describe('Success Handling', () => {
    it('should reset failure count on success in closed state', async () => {
      // Fail twice (below threshold)
      for (let i = 0; i < 2; i++) {
        try {
          await circuitBreaker.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }
      expect(circuitBreaker.getMetrics().failureCount).toBe(2);

      // Succeed once
      await circuitBreaker.execute(async () => 'success');
      expect(circuitBreaker.getMetrics().failureCount).toBe(0);
    });
  });

  describe('Metrics', () => {
    it('should return correct metrics', async () => {
      await circuitBreaker.execute(async () => 'success');
      await circuitBreaker.execute(async () => 'success');
      
      try {
        await circuitBreaker.execute(async () => { throw new Error('failure'); });
      } catch (e) {}

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.state).toBe(CircuitState.CLOSED);
      expect(metrics.failureCount).toBe(1);
      expect(metrics.successCount).toBe(0); // Only counts in half-open
    });
  });

  describe('Configuration Variants', () => {
    it('should work with different thresholds', async () => {
      const config: CircuitBreakerConfig = {
        failureThreshold: 5,
        successThreshold: 3,
        timeout: 100,
        monitoringWindow: 1000,
      };
      const cb = new CircuitBreaker(config);

      // Should need 5 failures to open
      for (let i = 0; i < 4; i++) {
        try {
          await cb.execute(async () => { throw new Error('failure'); });
        } catch (e) {}
      }
      expect(cb.getState()).toBe(CircuitState.CLOSED);

      try {
        await cb.execute(async () => { throw new Error('failure'); });
      } catch (e) {}
      expect(cb.getState()).toBe(CircuitState.OPEN);
    });
  });
});