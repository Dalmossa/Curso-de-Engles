import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Fallback Strategy Types
 */
export enum FallbackStrategyType {
  /** Return cached data if available, otherwise throw */
  CACHE = 'cache',
  /** Return degraded/stale response */
  DEGRADED = 'degraded',
  /** Return a default/empty response */
  DEFAULT = 'default',
  /** Throw the original error (no fallback) */
  ERROR = 'error',
  /** Custom fallback function */
  CUSTOM = 'custom',
}

/**
 * Fallback Configuration per Service
 */
export interface FallbackConfig {
  strategy: FallbackStrategyType;
  /** TTL for cached fallback in ms */
  cacheTtl?: number;
  /** Default response for DEFAULT strategy */
  defaultResponse?: unknown;
  /** Custom fallback function */
  customFallback?: (error: Error) => Promise<unknown>;
  /** Whether to log fallback activation */
  logFallback?: boolean;
}

/**
 * Service-specific fallback configurations
 */
export const DEFAULT_FALLBACK_CONFIGS: Record<string, FallbackConfig> = {
  // JWKS verification - critical for auth, fail closed with degraded mode
  jwks: {
    strategy: FallbackStrategyType.DEGRADED,
    cacheTtl: 300000, // 5 minutes
    logFallback: true,
  },
  // Database - use degraded mode with circuit breaker
  database: {
    strategy: FallbackStrategyType.DEGRADED,
    logFallback: true,
  },
  // Redis - cache fallback with short TTL
  redis: {
    strategy: FallbackStrategyType.CACHE,
    cacheTtl: 60000, // 1 minute
    logFallback: true,
  },
  // External APIs - default empty response
  external_api: {
    strategy: FallbackStrategyType.DEFAULT,
    defaultResponse: {},
    logFallback: true,
  },
  // Kong API Gateway
  kong: {
    strategy: FallbackStrategyType.DEGRADED,
    logFallback: true,
  },
  // Default fallback
  default: {
    strategy: FallbackStrategyType.ERROR,
    logFallback: false,
  },
};

/**
 * Cache entry for fallback responses
 */
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Fallback Strategy Executor
 * Implements documented fallback strategies for each external dependency
 */
@Injectable()
export class FallbackStrategy {
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly configs: Record<string, FallbackConfig>;

  constructor(
    @Inject('FALLBACK_CONFIGS') fallbackConfigs: Record<string, FallbackConfig> | undefined,
    private readonly configService: ConfigService,
  ) {
    // Ensure we always have a valid config object - fallbackConfigs might be undefined from DI
    this.configs = { ...DEFAULT_FALLBACK_CONFIGS, ...(fallbackConfigs ?? {}) };
  }

  /**
   * Get config for a service, with fallback to default
   */
  private getConfig(serviceName: string): FallbackConfig {
    // Use non-null assertion since we guarantee a default config exists
    return (this.configs[serviceName] ?? this.configs['default'] ?? DEFAULT_FALLBACK_CONFIGS['default'])!;
  }

  /**
   * Execute fallback for a service
   */
  async execute<T>(
    serviceName: string,
    operation: () => Promise<T>,
    context?: { method?: string; url?: string; attempt?: number }
  ): Promise<T> {
    const config = this.getConfig(serviceName);
    
    try {
      return await operation();
    } catch (error) {
      if (config.logFallback) {
        console.warn(
          `[Fallback] Service "${serviceName}" failed, applying ${config.strategy} strategy`,
          { error: error instanceof Error ? error.message : String(error), context }
        );
      }

      switch (config.strategy) {
        case FallbackStrategyType.CACHE:
          return this.getCachedFallback<T>(serviceName, config);
        case FallbackStrategyType.DEGRADED:
          return this.getDegradedResponse<T>(serviceName, error as Error);
        case FallbackStrategyType.DEFAULT:
          return config.defaultResponse as T;
        case FallbackStrategyType.CUSTOM:
          if (config.customFallback) {
            return config.customFallback(error as Error) as Promise<T>;
          }
          throw error;
        case FallbackStrategyType.ERROR:
        default:
          throw error;
      }
    }
  }

  /**
   * Store a successful response for potential fallback use
   */
  storeForFallback<T>(serviceName: string, data: T): void {
    const config = this.getConfig(serviceName);
    if (config.cacheTtl) {
      this.cache.set(serviceName, {
        data,
        expiresAt: Date.now() + config.cacheTtl,
      });
    }
  }

  /**
   * Get cached fallback response
   */
  private getCachedFallback<T>(serviceName: string, config: FallbackConfig): T {
    const entry = this.cache.get(serviceName);
    if (entry && entry.expiresAt > Date.now()) {
      if (config.logFallback) {
        console.info(`[Fallback] Returning cached response for "${serviceName}"`);
      }
      return entry.data as T;
    }
    
    // Cache expired or not found, fall through to degraded
    if (config.logFallback) {
      console.warn(`[Fallback] No valid cache for "${serviceName}", using degraded response`);
    }
    return this.getDegradedResponse<T>(serviceName, new Error('No cached response available'));
  }

  /**
   * Generate degraded response based on service type
   */
  private getDegradedResponse<T>(serviceName: string, error: Error): T {
    // Service-specific degraded responses
    switch (serviceName) {
      case 'jwks':
        // For JWKS, we can't really degrade - auth must fail closed
        // But we return a special marker that the verifier can check
        throw new DegradedAuthError('JWKS unavailable, auth degraded', error);
      
      case 'database':
        // Return empty result sets for read operations
        return [] as unknown as T;
      
      case 'redis':
        // Redis unavailable - operations that depend on cache should proceed without it
        return null as unknown as T;
      
      case 'external_api':
      case 'kong':
        // Return minimal viable response
        return { degraded: true, service: serviceName, error: error.message } as unknown as T;
      
      default:
        throw new DegradedServiceError(`Service ${serviceName} degraded`, error);
    }
  }

  /**
   * Clear cache for a service
   */
  clearCache(serviceName: string): void {
    this.cache.delete(serviceName);
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): Record<string, { size: number; oldestEntry: number | null }> {
    const stats: Record<string, { size: number; oldestEntry: number | null }> = {};
    let oldestEntry: number | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      if (!oldestEntry || entry.expiresAt < oldestEntry) {
        oldestEntry = entry.expiresAt;
      }
      stats[key] = { size: 1, oldestEntry: entry.expiresAt };
    }
    
    return stats;
  }
}

/**
 * Error thrown when auth is degraded but not completely failed
 */
export class DegradedAuthError extends Error {
  constructor(message: string, public readonly originalError: Error) {
    super(message);
    this.name = 'DegradedAuthError';
  }
}

/**
 * Error thrown when a service is degraded
 */
export class DegradedServiceError extends Error {
  constructor(message: string, public readonly originalError: Error) {
    super(message);
    this.name = 'DegradedServiceError';
  }
}

/**
 * Fallback configuration provider
 */
export const FALLBACK_CONFIGS_TOKEN = 'FALLBACK_CONFIGS';

export function createFallbackConfigs(configService: ConfigService): Record<string, FallbackConfig> {
  // Use a helper to safely get config values
  const getConfig = <T>(key: string, defaultValue: T): T => {
    return configService.get<T>(key) ?? defaultValue;
  };
  
  // Directly inline the default values to avoid TypeScript issues
  return {
    jwks: {
      strategy: FallbackStrategyType.DEGRADED,
      cacheTtl: getConfig('FALLBACK_JWKS_CACHE_TTL', 300000),
      logFallback: getConfig('FALLBACK_JWKS_LOG', true),
    },
    database: {
      strategy: FallbackStrategyType.DEGRADED,
      logFallback: getConfig('FALLBACK_DATABASE_LOG', true),
    },
    redis: {
      strategy: FallbackStrategyType.CACHE,
      cacheTtl: getConfig('FALLBACK_REDIS_CACHE_TTL', 60000),
      logFallback: getConfig('FALLBACK_REDIS_LOG', true),
    },
    external_api: {
      strategy: FallbackStrategyType.DEFAULT,
      defaultResponse: {},
      logFallback: getConfig('FALLBACK_EXTERNAL_API_LOG', true),
    },
    kong: {
      strategy: FallbackStrategyType.DEGRADED,
      logFallback: getConfig('FALLBACK_KONG_LOG', true),
    },
    default: {
      strategy: FallbackStrategyType.ERROR,
      logFallback: false,
    },
  };
}