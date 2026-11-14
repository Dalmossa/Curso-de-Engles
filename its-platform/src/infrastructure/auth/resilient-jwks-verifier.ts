/**
 * Resilient JWKS Token Verifier
 *
 * Wraps the standard JWKS verifier with resilience patterns:
 * - Circuit breaker (prevents cascade failures when JWKS endpoint is down)
 * - Retry with exponential backoff (for network errors)
 * - Explicit timeout (5s for JWKS fetch)
 * - Fallback to cached JWKS (degraded auth mode)
 * - OTel metrics for all operations
 */

import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createRemoteJWKSet,
  jwtVerify,
  type JWK,
  type KeyLike,
  type JWSHeaderParameters,
  type FlattenedJWSInput,
} from 'jose';

import {
  TokenVerificationError,
  type TokenPrincipal,
  type TokenVerifier,
} from '../../common/auth/token-principal.js';
import { refusalFor, scopesOf } from './token-claims.js';
import { CircuitBreaker, CircuitState } from '../resilience/circuit-breaker.js';
import {
  FallbackStrategy,
  FALLBACK_CONFIGS_TOKEN,
  type FallbackConfig,
  DegradedAuthError,
} from '../resilience/fallback.strategy.js';
import { executeWithRetry, type RetryConfig, DEFAULT_RETRY_CONFIGS } from '../resilience/retry.js';
import { withTimeout, TimeoutError, DEFAULT_TIMEOUTS } from '../resilience/timeout.js';
import { getMeter } from '../../observability/metrics.js';
import type { Counter, Histogram, UpDownCounter } from '@opentelemetry/api';

export interface ResilientJwksVerifierOptions {
  readonly jwksUri: string;
  readonly issuer: string;
  readonly audience: string;
  readonly cacheTtlMs?: number;
}

interface CachedJwks {
  keys: JWK[];
  fetchedAt: number;
  expiresAt: number;
}

// Type for the remote JWKS resolver function
type RemoteJwksResolver = (
  protectedHeader?: JWSHeaderParameters,
  token?: FlattenedJWSInput,
) => Promise<KeyLike>;

/**
 * Resilient JWKS Token Verifier with full resilience patterns
 */
@Injectable()
export class ResilientJwksVerifier implements TokenVerifier {
  private readonly logger = 'ResilientJwksVerifier';
  private readonly options: ResilientJwksVerifierOptions;
  private readonly circuitBreaker: CircuitBreaker;
  private readonly fallbackStrategy: FallbackStrategy;
  private cachedJwks: CachedJwks | null = null;
  private remoteJwksResolver: RemoteJwksResolver | null = null;

  // OTel Metrics
  private readonly jwksFetchTotal: Counter;
  private readonly jwksFetchDuration: Histogram;
  private readonly jwksCacheHits: Counter;
  private readonly jwksCacheMisses: Counter;
  private readonly circuitBreakerState: UpDownCounter;
  private readonly fallbackActivations: Counter;

  constructor(
    private readonly configService: ConfigService,
    @Inject(FALLBACK_CONFIGS_TOKEN) fallbackConfigs: Record<string, FallbackConfig>,
    fallbackStrategy: FallbackStrategy,
  ) {
    this.options = {
      jwksUri:
        configService.get<string>('JWKS_URI') ?? 'http://kong:8000/api/v1/.well-known/jwks.json',
      issuer: configService.get<string>('JWT_ISSUER') ?? 'its-platform',
      audience: configService.get<string>('JWT_AUDIENCE') ?? 'its-platform-api',
      cacheTtlMs: configService.get<number>('JWKS_CACHE_TTL_MS') ?? 300000, // 5 minutes
    };

    // Initialize circuit breaker for JWKS
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 30000, // 30 seconds before half-open
      monitoringWindow: 60000,
    });

    this.fallbackStrategy = fallbackStrategy;

    // Initialize OTel metrics
    const meter = getMeter();
    this.jwksFetchTotal = meter.createCounter('its_platform_jwks_fetch_total', {
      description: 'Total number of JWKS fetch attempts',
      unit: '1',
    });
    this.jwksFetchDuration = meter.createHistogram('its_platform_jwks_fetch_duration_seconds', {
      description: 'JWKS fetch duration in seconds',
      unit: 's',
    });
    this.jwksCacheHits = meter.createCounter('its_platform_jwks_cache_hits_total', {
      description: 'Total number of JWKS cache hits',
      unit: '1',
    });
    this.jwksCacheMisses = meter.createCounter('its_platform_jwks_cache_misses_total', {
      description: 'Total number of JWKS cache misses',
      unit: '1',
    });
    this.circuitBreakerState = meter.createUpDownCounter(
      'its_platform_jwks_circuit_breaker_state',
      {
        description: 'JWKS circuit breaker state (0=closed, 1=half-open, 2=open)',
        unit: '1',
      },
    );
    this.fallbackActivations = meter.createCounter('its_platform_jwks_fallback_activations_total', {
      description: 'Total number of JWKS fallback activations',
      unit: '1',
    });
  }

  /**
   * Verify a JWT token using resilient JWKS fetching
   */
  async verify(token: string): Promise<TokenPrincipal> {
    const startTime = Date.now();

    try {
      // Get JWKS resolver (with resilience patterns)
      const resolver = await this.getJwksResolverWithResilience();

      // Verify token with JWKS resolver
      const { payload } = await jwtVerify(token, resolver, {
        algorithms: ['RS256'],
        issuer: this.options.issuer,
        audience: this.options.audience,
      });

      const subject = payload.sub;
      if (typeof subject !== 'string' || subject.trim().length === 0) {
        throw new TokenVerificationError('the token carries no `sub`', 'missing_subject');
      }

      // Record success metrics
      this.jwksFetchTotal.add(1, { result: 'success' });
      this.jwksFetchDuration.record((Date.now() - startTime) / 1000);

      // Update circuit breaker state metric
      this.updateCircuitBreakerMetric();

      return { subject, scopes: scopesOf(payload), claims: { ...payload } };
    } catch (error) {
      // Record error metrics
      this.jwksFetchTotal.add(1, {
        result: 'error',
        error_type: error instanceof Error ? error.name : 'UnknownError',
      });
      this.jwksFetchDuration.record((Date.now() - startTime) / 1000);
      this.updateCircuitBreakerMetric();

      const refusal = refusalFor(error);
      throw new TokenVerificationError(refusal.message, refusal.reason);
    }
  }

  /**
   * Get JWKS resolver with full resilience patterns applied
   */
  private async getJwksResolverWithResilience(): Promise<RemoteJwksResolver> {
    const circuitState = this.circuitBreaker.getState();

    // If circuit is open, try fallback immediately
    if (circuitState === CircuitState.OPEN) {
      return this.getFallbackResolver();
    }

    // Try to fetch fresh JWKS with retry and timeout
    const baseRetryConfig = DEFAULT_RETRY_CONFIGS['http_get'];
    const retryConfig: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 500,
      maxDelay: 5000,
      jitter: true,
      jitterFactor: 0.3,
      retryableStatusCodes: baseRetryConfig?.retryableStatusCodes ?? [408, 429, 500, 502, 503, 504],
      retryableErrors: baseRetryConfig?.retryableErrors ?? [
        'ECONNRESET',
        'ETIMEDOUT',
        'ENOTFOUND',
        'ECONNREFUSED',
        'EPIPE',
      ],
    };

    const timeout = this.configService.get<number>('JWKS_FETCH_TIMEOUT_MS') ?? 5000;

    try {
      // Execute with circuit breaker (no fallback here, we'll handle errors in catch)
      const jwks = await this.circuitBreaker.execute(
        async () => {
          return await executeWithRetry(
            async () => {
              return await withTimeout(() => this.fetchJwks(), {
                timeout,
                message: `JWKS fetch timed out after ${timeout}ms`,
              });
            },
            retryConfig,
            (attempt, error, delay) => {
              console.warn(`JWKS fetch retry attempt ${attempt} after ${delay}ms`, {
                error: error instanceof Error ? error.message : String(error),
              });
            },
          );
        },
        // Fallback - we just re-throw to be caught below
        async () => {
          throw new Error('Circuit breaker fallback');
        },
      );

      // Cache successful response
      this.cacheJwks(jwks);
      this.jwksCacheMisses.add(1); // Count as miss since we fetched fresh

      // Create remote JWKS resolver from cached keys
      this.remoteJwksResolver = createRemoteJWKSet(new URL(this.options.jwksUri), {
        // @ts-expect-error - jose types don't expose keys option but it works at runtime
        keys: this.cachedJwks!.keys,
      }) as unknown as RemoteJwksResolver;

      return this.remoteJwksResolver;
    } catch (error) {
      // If we get here, both primary and fallback failed
      if (error instanceof DegradedAuthError) {
        this.fallbackActivations.add(1, { strategy: 'degraded' });
        throw error;
      }
      // Try fallback resolver as last resort
      return this.getFallbackResolver();
    }
  }

  /**
   * Fetch JWKS from remote endpoint
   */
  private async fetchJwks(): Promise<{ keys: JWK[] }> {
    const response = await fetch(this.options.jwksUri, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'its-platform-jwks-verifier/1.0',
      },
      // Don't follow redirects for security
      redirect: 'error',
    });

    if (!response.ok) {
      throw new Error(`JWKS fetch failed: ${response.status} ${response.statusText}`);
    }

    const jwks = (await response.json()) as { keys: JWK[] };

    if (!jwks.keys || !Array.isArray(jwks.keys) || jwks.keys.length === 0) {
      throw new Error('JWKS response contains no keys');
    }

    return jwks;
  }

  /**
   * Get fallback resolver (cached or degraded)
   */
  private getFallbackResolver(): RemoteJwksResolver {
    // Try cached JWKS first
    if (this.cachedJwks && this.cachedJwks.expiresAt > Date.now()) {
      this.jwksCacheHits.add(1);
      console.info('[JWKS] Using cached JWKS (fallback mode)');

      return createRemoteJWKSet(new URL(this.options.jwksUri), {
        // @ts-expect-error - jose types don't expose keys option but it works at runtime
        keys: this.cachedJwks.keys,
      }) as unknown as RemoteJwksResolver;
    }

    // No valid cache - degraded mode
    this.fallbackActivations.add(1, { strategy: 'degraded' });
    console.warn('[JWKS] No valid JWKS cache available, auth degraded');

    throw new DegradedAuthError(
      'JWKS unavailable and no valid cache - authentication degraded',
      new Error('JWKS fetch failed and cache expired'),
    );
  }

  /**
   * Cache JWKS for fallback use
   */
  private cacheJwks(jwks: { keys: JWK[] }): void {
    this.cachedJwks = {
      keys: jwks.keys,
      fetchedAt: Date.now(),
      expiresAt: Date.now() + this.options.cacheTtlMs!,
    };
  }

  /**
   * Update circuit breaker state metric
   */
  private updateCircuitBreakerMetric(): void {
    const state = this.circuitBreaker.getState();
    const stateValue = state === CircuitState.CLOSED ? 0 : state === CircuitState.HALF_OPEN ? 1 : 2;
    this.circuitBreakerState.add(stateValue);
  }

  /**
   * Get current circuit breaker state (for health checks)
   */
  getCircuitBreakerState(): CircuitState {
    return this.circuitBreaker.getState();
  }

  /**
   * Get cache status (for monitoring)
   */
  getCacheStatus(): { hasCache: boolean; expiresAt: number | null; ageMs: number | null } {
    if (!this.cachedJwks) {
      return { hasCache: false, expiresAt: null, ageMs: null };
    }
    return {
      hasCache: true,
      expiresAt: this.cachedJwks.expiresAt,
      ageMs: Date.now() - this.cachedJwks.fetchedAt,
    };
  }

  /**
   * Force refresh JWKS cache (for testing/admin)
   */
  async forceRefresh(): Promise<void> {
    this.cachedJwks = null;
    this.remoteJwksResolver = null;
    await this.getJwksResolverWithResilience();
  }
}
