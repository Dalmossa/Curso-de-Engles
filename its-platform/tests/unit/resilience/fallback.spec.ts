/**
 * Fallback Strategy Unit Tests
 * Tests documented fallback strategies per service
 */

import { FallbackStrategy, FallbackConfig, FallbackStrategyType, FALLBACK_CONFIGS_TOKEN, createFallbackConfigs, DegradedServiceError, DegradedAuthError } from '../../../src/infrastructure/resilience/fallback.strategy.js';
import { ConfigService } from '@nestjs/config';

describe('FallbackStrategy', () => {
  let fallbackStrategy: FallbackStrategy;
  let mockConfigService: Partial<ConfigService>;

  const testFallbackConfigs: Record<string, FallbackConfig> = {
    redis: {
      strategy: FallbackStrategyType.CACHE,
      cacheTtl: 1000,
      logFallback: true,
    },
    database: {
      strategy: FallbackStrategyType.DEGRADED,
      logFallback: true,
    },
    default_service: {
      strategy: FallbackStrategyType.DEFAULT,
      defaultResponse: { fallback: true },
      logFallback: true,
    },
    error_service: {
      strategy: FallbackStrategyType.ERROR,
      logFallback: true,
    },
    custom_service: {
      strategy: FallbackStrategyType.CUSTOM,
      customFallback: async () => { return { custom: true }; },
      logFallback: true,
    },
    default: {
      strategy: FallbackStrategyType.ERROR,
      logFallback: false,
    },
  };

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn(),
    };
    fallbackStrategy = new FallbackStrategy(
      testFallbackConfigs,
      mockConfigService as ConfigService,
    );
  });

  describe('Cache Fallback', () => {
    it('should return cached response when available', async () => {
      // Store a successful response
      fallbackStrategy.storeForFallback('redis', { data: 'cached' });

      const result = await fallbackStrategy.execute('redis', async () => {
        throw new Error('Service unavailable');
      });

      expect(result).toEqual({ data: 'cached' });
    });

    it('should fall through to degraded when cache expired', async () => {
      // Store with short TTL
      const shortTtlConfig: FallbackConfig = { 
        strategy: testFallbackConfigs['redis']!.strategy,
        cacheTtl: 1,
        logFallback: testFallbackConfigs['redis']!.logFallback!,
      };
      const strategy = new FallbackStrategy(
        { ...testFallbackConfigs, ['redis']: shortTtlConfig },
        mockConfigService as ConfigService,
      );

      strategy.storeForFallback('redis', { data: 'cached' });

      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 10));

      const result = await strategy.execute('redis', async () => {
        throw new Error('Service unavailable');
      });

      // Should return degraded response (null for redis)
      expect(result).toBeNull();
    });

    it('should return degraded when no cache', async () => {
      const result = await fallbackStrategy.execute('redis', async () => {
        throw new Error('Service unavailable');
      });

      expect(result).toBeNull();
    });
  });

  describe('Degraded Fallback', () => {
    it('should return degraded response for database service', async () => {
      const result = await fallbackStrategy.execute('database', async () => {
        throw new Error('Database unavailable');
      });

      expect(result).toEqual([]);
    });

    it('should throw DegradedAuthError for JWKS service', async () => {
      const jwksConfig: Record<string, FallbackConfig> = { 
        ...testFallbackConfigs, 
        jwks: { strategy: FallbackStrategyType.DEGRADED, logFallback: true } 
      };
      const strategy = new FallbackStrategy(jwksConfig, mockConfigService as ConfigService);

      await expect(
        strategy.execute('jwks', async () => { throw new Error('JWKS unavailable'); })
      ).rejects.toThrow(DegradedAuthError);
    });
  });

  describe('Default Fallback', () => {
    it('should return configured default response', async () => {
      const result = await fallbackStrategy.execute('default_service', async () => {
        throw new Error('Service unavailable');
      });

      expect(result).toEqual({ fallback: true });
    });
  });

  describe('Error Fallback', () => {
    it('should throw original error', async () => {
      await expect(
        fallbackStrategy.execute('error_service', async () => {
          throw new Error('Service unavailable');
        })
      ).rejects.toThrow('Service unavailable');
    });
  });

  describe('Custom Fallback', () => {
    it('should execute custom fallback function', async () => {
      const result = await fallbackStrategy.execute('custom_service', async () => {
        throw new Error('Service unavailable');
      });

      expect(result).toEqual({ custom: true });
    });
  });

  describe('Cache Management', () => {
    it('should clear cache for specific service', async () => {
      fallbackStrategy.storeForFallback('redis', { data: 'cached' });
      fallbackStrategy.clearCache('redis');

      const result = await fallbackStrategy.execute('redis', async () => {
        throw new Error('Service unavailable');
      });

      expect(result).toBeNull();
    });

    it('should clear all caches', async () => {
      fallbackStrategy.storeForFallback('redis', { data: 'cached1' });
      fallbackStrategy.storeForFallback('default_service', { data: 'cached2' });
      fallbackStrategy.clearAllCaches();

      // default_service has DEFAULT strategy with defaultResponse, so it returns that
      const result1 = await fallbackStrategy.execute('default_service', async () => {
        throw new Error('Service unavailable');
      });
      expect(result1).toEqual({ fallback: true });
      
      // database has DEGRADED strategy, so it returns empty array
      const result2 = await fallbackStrategy.execute('database', async () => {
        throw new Error('Service unavailable');
      });
      expect(result2).toEqual([]);
    });
  });

  describe('createFallbackConfigs', () => {
    it('should create configs with environment overrides', () => {
      const mockConfig = {
        get: jest.fn((key: string) => {
          if (key === 'FALLBACK_JWKS_CACHE_TTL') return 600000;
          if (key === 'FALLBACK_REDIS_CACHE_TTL') return 120000;
          return undefined;
        }),
      };

      const configs = createFallbackConfigs(mockConfig as unknown as ConfigService);

      expect(configs['jwks']!.cacheTtl).toBe(600000);
      expect(configs['redis']!.cacheTtl).toBe(120000);
    });

    it('should use defaults when env not set', () => {
      const mockConfig = {
        get: jest.fn(() => undefined),
      };

      const configs = createFallbackConfigs(mockConfig as unknown as ConfigService);

      expect(configs['jwks']!.cacheTtl).toBe(300000);
      expect(configs['redis']!.cacheTtl).toBe(60000);
    });
  });
});