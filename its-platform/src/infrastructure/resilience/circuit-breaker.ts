import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Circuit Breaker States
 */
export enum CircuitState {
  CLOSED = 'closed', // Normal operation, requests pass through
  OPEN = 'open', // Failing, requests blocked
  HALF_OPEN = 'half-open', // Testing if service recovered
}

/**
 * Circuit Breaker Configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  successThreshold: number; // Successes in half-open before closing
  timeout: number; // Time in ms before attempting half-open
  monitoringWindow: number; // Time window for failure counting (ms)
}

/**
 * Circuit Breaker for external service calls
 * Implements closed → open → half-open state machine
 */
@Injectable()
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(
    @Inject('CIRCUIT_BREAKER_CONFIG') private readonly circuitConfig: CircuitBreakerConfig,
  ) {
    this.config = circuitConfig;
  }

  /**
   * Execute an operation with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config.timeout) {
        this.transitionToHalfOpen();
      } else {
        // Circuit is open, execute fallback or throw
        if (fallback) {
          return fallback();
        }
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }

  /**
   * Record a successful call
   */
  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.transitionToClosed();
      }
    }
  }

  /**
   * Record a failed call
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      // Any failure in half-open immediately opens the circuit
      this.transitionToOpen();
    } else if (
      this.state === CircuitState.CLOSED &&
      this.failureCount >= this.config.failureThreshold
    ) {
      this.transitionToOpen();
    }
  }

  private transitionToOpen(): void {
    this.state = CircuitState.OPEN;
    this.successCount = 0;
  }

  private transitionToHalfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    this.successCount = 0;
  }

  private transitionToClosed(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
  }

  getState(): CircuitState {
    return this.state;
  }

  getMetrics() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }
}

/**
 * Default circuit breaker configurations per service type
 */
export const DEFAULT_CIRCUIT_CONFIGS: Record<string, CircuitBreakerConfig> = {
  // External API calls - more aggressive
  external_api: {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 30000, // 30 seconds
    monitoringWindow: 60000,
  },
  // Database calls - less aggressive
  database: {
    failureThreshold: 10,
    successThreshold: 5,
    timeout: 10000,
    monitoringWindow: 30000,
  },
  // Redis calls - fast recovery
  redis: {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 5000,
    monitoringWindow: 10000,
  },
  // External HTTP calls
  http: {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 30000,
    monitoringWindow: 60000,
  },
};
