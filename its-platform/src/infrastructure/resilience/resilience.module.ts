import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CircuitBreaker } from './circuit-breaker.js';
import { DEFAULT_CIRCUIT_CONFIGS } from './circuit-breaker.js';
import { DEFAULT_RETRY_CONFIGS } from './retry.js';
import { DEFAULT_TIMEOUTS } from './timeout.js';
import {
  FallbackStrategy,
  createFallbackConfigs,
  FALLBACK_CONFIGS_TOKEN,
} from './fallback.strategy.js';
import { ResilienceInterceptor } from './resilience.interceptor.js';

/**
 * ResilienceModule provides resilience patterns for outbound calls:
 * - Circuit Breaker (closed → open → half-open)
 * - Retry with exponential backoff + jitter (idempotent calls only)
 * - Explicit timeouts on every outbound call
 * - Documented fallback strategies per service
 * - OTel metrics integration for all patterns
 *
 * This module is Global so it can be injected anywhere in the application.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // Circuit Breaker with default configs
    {
      provide: 'CIRCUIT_BREAKER_CONFIG',
      useValue: DEFAULT_CIRCUIT_CONFIGS,
    },
    CircuitBreaker,

    // Retry configs
    {
      provide: 'RETRY_CONFIGS',
      useValue: DEFAULT_RETRY_CONFIGS,
    },

    // Timeout configs
    {
      provide: 'TIMEOUT_CONFIGS',
      useValue: DEFAULT_TIMEOUTS,
    },

    // Fallback configs (environment-aware)
    {
      provide: FALLBACK_CONFIGS_TOKEN,
      useFactory: (configService: ConfigService) => createFallbackConfigs(configService),
      inject: [ConfigService],
    },

    // Fallback Strategy
    FallbackStrategy,

    // Unified Resilience Interceptor
    ResilienceInterceptor,
  ],
  exports: [
    CircuitBreaker,
    'CIRCUIT_BREAKER_CONFIG',
    'RETRY_CONFIGS',
    'TIMEOUT_CONFIGS',
    FALLBACK_CONFIGS_TOKEN,
    FallbackStrategy,
    ResilienceInterceptor,
  ],
})
export class ResilienceModule {}
