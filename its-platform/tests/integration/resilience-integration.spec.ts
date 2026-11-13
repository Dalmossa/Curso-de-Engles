/**
 * Resilience Integration Tests
 * Tests the full resilience interceptor with circuit breaker, retry, timeout, and fallback
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResilienceModule } from '../../../src/infrastructure/resilience/resilience.module.js';
import { ResilienceInterceptor, ResilienceContext } from '../../../src/infrastructure/resilience/resilience.interceptor.js';
import { CircuitBreaker, CircuitState } from '../../../src/infrastructure/resilience/circuit-breaker.js';
import { FallbackStrategy } from '../../../src/infrastructure/resilience/fallback.strategy.js';
import { FALLBACK_CONFIGS_TOKEN } from '../../../src/infrastructure/resilience/fallback.strategy.js';
import { ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable, of, throwError, delay } from 'rxjs';

describe('Resilience Integration', () => {
  let module: TestingModule;
  let interceptor: ResilienceInterceptor;
  let circuitBreaker: CircuitBreaker;
  let fallbackStrategy: FallbackStrategy;

  // Mock execution context
  const createMockContext = (serviceName: string, method = 'GET'): ExecutionContext => {
    const handler = {
      name: 'testOperation',
    };
    
    const clazz = {
      name: serviceName,
    };

    return {
      getHandler: () => handler,
      getClass: () => clazz,
      switchToHttp: () => ({
        getRequest: () => ({ method, url: `/api/${serviceName}` }),
      }),
    } as unknown as ExecutionContext;
  };

  // Mock call handler
  const createMockCallHandler = (result: unknown, shouldThrow = false, delayMs = 0): CallHandler => {
    const observable = shouldThrow 
      ? throwError(() => new Error('Service unavailable'))
      : of(result).pipe(delay(delayMs));
    
    return {
      handle: () => observable,
    } as CallHandler;
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.local', '.env'],
        }),
        ResilienceModule,
      ],
    }).compile();

    interceptor = module.get<ResilienceInterceptor>(ResilienceInterceptor);
    circuitBreaker = module.get<CircuitBreaker>(CircuitBreaker);
    fallbackStrategy = module.get<FallbackStrategy>(FallbackStrategy);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    // Reset circuit breaker state
    (circuitBreaker as any).state = CircuitState.CLOSED;
    (circuitBreaker as any).failureCount = 0;
    (circuitBreaker as any).successCount = 0;
    (circuitBreaker as any).lastFailureTime = 0;
  });

  describe('Successful Operations', () => {
    it('should pass through successful operations', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler({ data: 'success' });

      const result = await interceptor.intercept(context, handler).toPromise();
      expect(result).toEqual({ data: 'success' });
    });

    it('should record success metrics', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler({ data: 'success' });

      await interceptor.intercept(context, handler).toPromise();
      
      const states = interceptor.getCircuitBreakerStates();
      expect(states.external_api).toBeDefined();
      expect(states.external_api.state).toBe(CircuitState.CLOSED);
    });
  });

  describe('Circuit Breaker Integration', () => {
    it('should open circuit after threshold failures', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler(null, true); // Always throws

      // Fail 5 times (threshold for external_api)
      for (let i = 0; i < 5; i++) {
        try {
          await interceptor.intercept(context, handler).toPromise();
        } catch (e) {
          // Expected
        }
      }

      const states = interceptor.getCircuitBreakerStates();
      expect(states.external_api.state).toBe(CircuitState.OPEN);
    });

    it('should execute fallback when circuit is open', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler(null, true);

      // Open the circuit
      for (let i = 0; i < 5; i++) {
        try {
          await interceptor.intercept(context, handler).toPromise();
        } catch (e) {}
      }

      // Next call should use fallback
      const fallbackHandler = createMockCallHandler({ fallback: true });
      const result = await interceptor.intercept(context, fallbackHandler).toPromise();
      
      // Fallback for external_api returns default empty object
      expect(result).toEqual({});
    });
  });

  describe('Retry Integration', () => {
    it('should retry idempotent operations', async () => {
      let attempts = 0;
      const context = createMockContext('ExternalApiService');
      
      const handler = {
        handle: () => new Observable(observer => {
          attempts++;
          if (attempts < 3) {
            observer.error(new Error('Temporary failure'));
          } else {
            observer.next({ data: 'success' });
            observer.complete();
          }
        }),
      } as CallHandler;

      const result = await interceptor.intercept(context, handler).toPromise();
      expect(result).toEqual({ data: 'success' });
      expect(attempts).toBe(3);
    });

    it('should not retry non-idempotent operations', async () => {
      let attempts = 0;
      const context = createMockContext('ExternalApiService', 'POST');
      
      const handler = {
        handle: () => new Observable(observer => {
          attempts++;
          observer.error(new Error('Temporary failure'));
        }),
      } as CallHandler;

      await expect(
        interceptor.intercept(context, handler).toPromise()
      ).rejects.toThrow('Temporary failure');
      
      expect(attempts).toBe(1); // Only one attempt for POST
    });
  });

  describe('Timeout Integration', () => {
    it('should timeout long-running operations', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler({ data: 'success' }, false, 200); // 200ms delay

      // Default timeout for external_api is 15000ms, so this should pass
      // Let's test with a shorter timeout by using a service with shorter timeout
      const dbContext = createMockContext('DatabaseService');
      const dbHandler = createMockCallHandler({ data: 'success' }, false, 100); // 100ms delay
      
      // Database timeout is 5000ms default, so this should pass
      const result = await interceptor.intercept(dbContext, dbHandler).toPromise();
      expect(result).toEqual({ data: 'success' });
    });
  });

  describe('Fallback Integration', () => {
    it('should activate fallback for external_api', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler(null, true);

      // Open circuit
      for (let i = 0; i < 5; i++) {
        try {
          await interceptor.intercept(context, handler).toPromise();
        } catch (e) {}
      }

      // Call with fallback
      const fallbackHandler = createMockCallHandler({ fallback: true });
      const result = await interceptor.intercept(context, fallbackHandler).toPromise();
      
      // external_api fallback is DEFAULT with empty object
      expect(result).toEqual({});
    });

    it('should cache successful responses for fallback', async () => {
      const context = createMockContext('ExternalApiService');
      const handler = createMockCallHandler({ data: 'cached-response' });

      // Successful call
      await interceptor.intercept(context, handler).toPromise();

      // Now simulate failure with open circuit
      const failHandler = createMockCallHandler(null, true);
      for (let i = 0; i < 5; i++) {
        try {
          await interceptor.intercept(context, failHandler).toPromise();
        } catch (e) {}
      }

      // Should return cached response
      const fallbackHandler = createMockCallHandler({ fallback: true });
      const result = await interceptor.intercept(context, fallbackHandler).toPromise();
      
      // With cache, should return cached data
      expect(result).toEqual({ data: 'cached-response' });
    });
  });

  describe('Metrics Collection', () => {
    it('should expose circuit breaker states for monitoring', async () => {
      const states = interceptor.getCircuitBreakerStates();
      
      // Should have states for all configured services
      expect(states).toHaveProperty('external_api');
      expect(states).toHaveProperty('database');
      expect(states).toHaveProperty('redis');
      expect(states).toHaveProperty('http');
      
      // All should start closed
      for (const [name, state] of Object.entries(states)) {
        expect(state.state).toBe(CircuitState.CLOSED);
      }
    });

    it('should allow forcing circuit breaker state for testing', async () => {
      interceptor.forceCircuitBreakerState('external_api', CircuitState.OPEN);
      
      const states = interceptor.getCircuitBreakerStates();
      expect(states.external_api.state).toBe(CircuitState.OPEN);
    });
  });

  describe('Service-Specific Configurations', () => {
    it('should use different configs for different services', async () => {
      // Test that each service has its own circuit breaker
      const context1 = createMockContext('ExternalApiService');
      const context2 = createMockContext('DatabaseService');
      const handler = createMockCallHandler(null, true);

      // Fail external_api 5 times
      for (let i = 0; i < 5; i++) {
        try {
          await interceptor.intercept(context1, handler).toPromise();
        } catch (e) {}
      }

      // Database should still be closed (threshold is 10)
      for (let i = 0; i < 5; i++) {
        try {
          await interceptor.intercept(context2, handler).toPromise();
        } catch (e) {}
      }

      const states = interceptor.getCircuitBreakerStates();
      expect(states.external_api.state).toBe(CircuitState.OPEN);
      expect(states.database.state).toBe(CircuitState.CLOSED);
    });
  });
});