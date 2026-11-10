import { Module, Global } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker.js';
import { DEFAULT_CIRCUIT_CONFIGS } from './circuit-breaker.js';
import { DEFAULT_RETRY_CONFIGS } from './retry.js';
import { DEFAULT_TIMEOUTS } from './timeout.js';

/**
 * ResilienceModule provides resilience patterns for outbound calls:
 * - Circuit Breaker (closed → open → half-open)
 * - Retry with exponential backoff + jitter (idempotent calls only)
 * - Explicit timeouts on every outbound call
 * - Documented fallback strategies
 * 
 * This module is Global so it can be injected anywhere in the application.
 */
@Global()
@Module({
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
  ],
  exports: [
    CircuitBreaker,
    'CIRCUIT_BREAKER_CONFIG',
    'RETRY_CONFIGS',
    'TIMEOUT_CONFIGS',
  ],
})
export class ResilienceModule {}
