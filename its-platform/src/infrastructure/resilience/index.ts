/**
 * Resilience Module - Public API
 *
 * Provides resilience patterns for outbound HTTP calls:
 * - Circuit Breaker (closed → open → half-open)
 * - Retry with exponential backoff + jitter (idempotent calls only)
 * - Explicit timeouts on every outbound call
 * - Documented fallback strategies per service
 * - OTel metrics integration for all patterns
 */

// Circuit Breaker
export {
  CircuitBreaker,
  CircuitState,
  type CircuitBreakerConfig,
  DEFAULT_CIRCUIT_CONFIGS,
} from './circuit-breaker.js';

// Retry
export {
  executeWithRetry,
  calculateDelay,
  isRetryableError,
  isIdempotent,
  type RetryConfig,
  DEFAULT_RETRY_CONFIGS,
} from './retry.js';

// Timeout
export {
  withTimeout,
  type TimeoutConfig,
  TimeoutError,
  DEFAULT_TIMEOUTS,
  getDefaultTimeout,
} from './timeout.js';

// Fallback
export {
  FallbackStrategy,
  type FallbackConfig,
  FallbackStrategyType,
  DEFAULT_FALLBACK_CONFIGS,
  createFallbackConfigs,
  FALLBACK_CONFIGS_TOKEN,
  DegradedAuthError,
  DegradedServiceError,
} from './fallback.strategy.js';

// Interceptor
export {
  ResilienceInterceptor,
  type ResilienceContext,
  Resilience,
  ResilienceService,
} from './resilience.interceptor.js';

// Module
export { ResilienceModule } from './resilience.module.js';
