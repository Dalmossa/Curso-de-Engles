import {
  Injectable,
  Inject,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, from, throwError, catchError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CircuitBreaker, CircuitState, type CircuitBreakerConfig, DEFAULT_CIRCUIT_CONFIGS } from './circuit-breaker.js';
import { FallbackStrategy, type FallbackConfig, FALLBACK_CONFIGS_TOKEN } from './fallback.strategy.js';
import {
  executeWithRetry,
  type RetryConfig,
  isIdempotent,
  DEFAULT_RETRY_CONFIGS,
} from './retry.js';
import { withTimeout, type TimeoutConfig, TimeoutError, DEFAULT_TIMEOUTS } from './timeout.js';
import { getMeter } from '../../observability/metrics.js';
import type { Counter, Histogram, UpDownCounter } from '@opentelemetry/api';

/**
 * Operation context for resilience patterns
 */
export interface ResilienceContext {
  serviceName: string;
  operationName: string;
  method?: string;
  url?: string;
  isIdempotent?: boolean;
  circuitBreakerConfig?: Partial<CircuitBreakerConfig>;
  retryConfig?: Partial<RetryConfig>;
  timeoutConfig?: Partial<TimeoutConfig>;
  fallbackConfig?: Partial<FallbackConfig>;
}

/**
 * Resilience Metrics (OTel integration)
 */
interface ResilienceMetrics {
  circuitBreakerStateChanges: Counter;
  circuitBreakerState: UpDownCounter;
  retryAttempts: Counter;
  retryDelays: Histogram;
  timeouts: Counter;
  fallbackActivations: Counter;
  operationDuration: Histogram;
  operationErrors: Counter;
}

/**
 * Unified Resilience Interceptor
 * Combines circuit breaker, retry, timeout, and fallback patterns
 * with OTel metrics integration
 */
@Injectable()
export class ResilienceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResilienceInterceptor.name);
  private readonly metrics: ResilienceMetrics;
  private readonly circuitBreakers = new Map<string, CircuitBreaker>();

  constructor(
    @Inject('CIRCUIT_BREAKER_CONFIG') private readonly circuitConfigs: Record<string, CircuitBreakerConfig>,
    @Inject(FALLBACK_CONFIGS_TOKEN) private readonly fallbackConfigs: Record<string, FallbackConfig>,
    @Inject('RETRY_CONFIGS') private readonly retryConfigs: Record<string, RetryConfig>,
    @Inject('TIMEOUT_CONFIGS') private readonly timeoutConfigs: Record<string, number>,
    private readonly configService: ConfigService,
    private readonly fallbackStrategy: FallbackStrategy,
  ) {
    this.metrics = this.initializeMetrics();
  }

  /**
   * Initialize OTel metrics for resilience patterns
   */
  private initializeMetrics(): ResilienceMetrics {
    const meter = getMeter();
    
    return {
      circuitBreakerStateChanges: meter.createCounter('its_platform_circuit_breaker_state_changes_total', {
        description: 'Total number of circuit breaker state changes',
        unit: '1',
      }),
      circuitBreakerState: meter.createUpDownCounter('its_platform_circuit_breaker_state', {
        description: 'Current circuit breaker state (0=closed, 1=half-open, 2=open)',
        unit: '1',
      }),
      retryAttempts: meter.createCounter('its_platform_retry_attempts_total', {
        description: 'Total number of retry attempts',
        unit: '1',
      }),
      retryDelays: meter.createHistogram('its_platform_retry_delay_seconds', {
        description: 'Retry delay in seconds',
        unit: 's',
      }),
      timeouts: meter.createCounter('its_platform_timeouts_total', {
        description: 'Total number of timeouts',
        unit: '1',
      }),
      fallbackActivations: meter.createCounter('its_platform_fallback_activations_total', {
        description: 'Total number of fallback activations',
        unit: '1',
      }),
      operationDuration: meter.createHistogram('its_platform_resilience_operation_duration_seconds', {
        description: 'Operation duration with resilience patterns applied',
        unit: 's',
      }),
      operationErrors: meter.createCounter('its_platform_resilience_operation_errors_total', {
        description: 'Total number of operation errors after resilience patterns',
        unit: '1',
      }),
    };
  }

  /**
   * Get config with fallback - ensures we always return a valid config
   */
  private getCircuitConfig(serviceName: string): CircuitBreakerConfig {
    // Use bracket notation for default access with non-null assertion
    const defaultConfig = DEFAULT_CIRCUIT_CONFIGS['default']!;
    return this.circuitConfigs[serviceName] ?? this.circuitConfigs['http'] ?? this.circuitConfigs['default'] ?? defaultConfig;
  }

  private getRetryConfig(serviceName: string, method: string): RetryConfig {
    const isIdempotentOp = isIdempotent(method);
    const configKey = isIdempotentOp ? 'http_get' : 'http_post';
    // Use bracket notation for default access with non-null assertion
    const defaultRetryConfig = DEFAULT_RETRY_CONFIGS['default']!;
    return this.retryConfigs[configKey] ?? this.retryConfigs['default'] ?? defaultRetryConfig;
  }

  private getTimeoutConfig(serviceName: string, operationType: string): number {
    return this.timeoutConfigs[operationType] ?? this.timeoutConfigs['default'] ?? DEFAULT_TIMEOUTS.default;
  }

  private getFallbackConfig(serviceName: string): FallbackConfig | undefined {
    return this.fallbackConfigs[serviceName];
  }

  /**
   * Get or create circuit breaker for a service
   */
  private getCircuitBreaker(serviceName: string): CircuitBreaker {
    if (!this.circuitBreakers.has(serviceName)) {
      const config = this.getCircuitConfig(serviceName);
      const breaker = new CircuitBreaker(config);
      this.circuitBreakers.set(serviceName, breaker);
    }
    return this.circuitBreakers.get(serviceName)!;
  }

  /**
   * Record circuit breaker state change metrics
   */
  private recordCircuitBreakerMetrics(serviceName: string, oldState: CircuitState, newState: CircuitState): void {
    const stateValue = newState === CircuitState.CLOSED ? 0 : newState === CircuitState.HALF_OPEN ? 1 : 2;
    
    this.metrics.circuitBreakerStateChanges.add(1, {
      service: serviceName,
      from_state: oldState,
      to_state: newState,
    });
    this.metrics.circuitBreakerState.add(stateValue, { service: serviceName });
    
    this.logger.log(`Circuit breaker for "${serviceName}" changed: ${oldState} -> ${newState}`);
  }

  /**
   * Intercept and apply resilience patterns
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Extract resilience context from request/handler metadata
    const resilienceContext = this.extractResilienceContext(context);
    
    if (!resilienceContext) {
      // No resilience context, pass through
      return next.handle();
    }

    const { serviceName, operationName, method = 'GET' } = resilienceContext;
    const startTime = Date.now();
    const circuitBreaker = this.getCircuitBreaker(serviceName);
    const retryConfig = this.getRetryConfig(serviceName, method);
    const timeout = this.getTimeoutConfig(serviceName, `http_${method.toLowerCase()}`);

    return from(this.executeWithResilience(
      serviceName,
      operationName,
      method,
      () => next.handle().toPromise(),
      circuitBreaker,
      retryConfig,
      timeout,
      startTime,
    )).pipe(
      catchError((error: unknown) => {
        this.recordErrorMetrics(serviceName, operationName, error, Date.now() - startTime);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Execute operation with all resilience patterns
   */
  private async executeWithResilience<T>(
    serviceName: string,
    operationName: string,
    method: string,
    operation: () => Promise<T>,
    circuitBreaker: CircuitBreaker,
    retryConfig: RetryConfig,
    timeout: number,
    startTime: number,
  ): Promise<T> {
    const previousState = circuitBreaker.getState();

    // Wrap operation with timeout
    const operationWithTimeout = async (): Promise<T> => {
      return withTimeout(operation, { timeout });
    };

    // Wrap with retry (only for idempotent operations)
    const operationWithRetry = async (): Promise<T> => {
      if (!isIdempotent(method)) {
        return operationWithTimeout();
      }

      return executeWithRetry(
        operationWithTimeout,
        retryConfig,
        (attempt, error, delay) => {
          this.metrics.retryAttempts.add(1, {
            service: serviceName,
            operation: operationName,
            attempt: attempt.toString(),
          });
          this.metrics.retryDelays.record(delay / 1000, {
            service: serviceName,
            operation: operationName,
          });
          this.logger.debug(
            `Retry attempt ${attempt} for ${serviceName}.${operationName} after ${delay}ms`,
            { error: error instanceof Error ? error.message : String(error) }
          );
        },
      );
    };

    // Execute with circuit breaker and fallback
    try {
      const result = await circuitBreaker.execute(
        operationWithRetry,
        // Fallback function
        async () => {
          const fallbackConfig = this.getFallbackConfig(serviceName);
          this.metrics.fallbackActivations.add(1, {
            service: serviceName,
            operation: operationName,
            strategy: fallbackConfig?.strategy ?? 'error',
          });
          
          const fallbackResult = await this.fallbackStrategy.execute(serviceName, operation, { method });
          return fallbackResult! as T;
        },
      );

      // Record success metrics
      const duration = Date.now() - startTime;
      this.metrics.operationDuration.record(duration / 1000, {
        service: serviceName,
        operation: operationName,
        result: 'success',
      });

      // Check for state change
      const currentState = circuitBreaker.getState();
      if (currentState !== previousState) {
        this.recordCircuitBreakerMetrics(serviceName, previousState, currentState);
      }

      // Store successful response for fallback cache
      this.fallbackStrategy.storeForFallback(serviceName, result);

      return result;
    } catch (error) {
      // Record error metrics
      const duration = Date.now() - startTime;
      this.metrics.operationDuration.record(duration / 1000, {
        service: serviceName,
        operation: operationName,
        result: 'error',
      });
      this.metrics.operationErrors.add(1, {
        service: serviceName,
        operation: operationName,
        error_type: error instanceof Error ? error.name : 'UnknownError',
      });

      // Check for state change after error
      const currentState = circuitBreaker.getState();
      if (currentState !== previousState) {
        this.recordCircuitBreakerMetrics(serviceName, previousState, currentState);
      }

      throw error;
    }
  }

  /**
   * Extract resilience context from execution context
   * This can be enhanced with decorators or metadata
   */
  private extractResilienceContext(context: ExecutionContext): ResilienceContext | null {
    const handler = context.getHandler();
    const className = context.getClass()?.name ?? '';
    
    // Check for resilience metadata on the handler or class
    const metadata = Reflect.getMetadata('resilience', handler) ?? 
                     Reflect.getMetadata('resilience', context.getClass());
    
    if (metadata) {
      return metadata as ResilienceContext;
    }

    // Infer from class name patterns
    const serviceName = this.inferServiceName(className);
    if (!serviceName) {
      return null;
    }

    return {
      serviceName,
      operationName: handler.name,
      method: 'GET', // Default, could be inferred from HTTP method
    };
  }

  /**
   * Infer service name from class name
   */
  private inferServiceName(className: string): string | null {
    const lower = className.toLowerCase();
    
    if (lower.includes('jwks') || lower.includes('token') || lower.includes('auth')) {
      return 'jwks';
    }
    if (lower.includes('database') || lower.includes('repository') || lower.includes('typeorm')) {
      return 'database';
    }
    if (lower.includes('redis') || lower.includes('cache')) {
      return 'redis';
    }
    if (lower.includes('kong') || lower.includes('gateway')) {
      return 'kong';
    }
    if (lower.includes('external') || lower.includes('http') || lower.includes('api')) {
      return 'external_api';
    }
    
    return 'default';
  }

  /**
   * Record error metrics
   */
  private recordErrorMetrics(
    serviceName: string,
    operationName: string,
    error: unknown,
    durationMs: number
  ): void {
    const errorType = error instanceof Error ? error.name : 'UnknownError';
    const isTimeout = error instanceof TimeoutError;
    
    if (isTimeout) {
      this.metrics.timeouts.add(1, {
        service: serviceName,
        operation: operationName,
      });
    }
  }

  /**
   * Get all circuit breaker states (for monitoring/health checks)
   */
  getCircuitBreakerStates(): Record<string, { state: CircuitState; metrics: ReturnType<CircuitBreaker['getMetrics']> }> {
    const states: Record<string, { state: CircuitState; metrics: ReturnType<CircuitBreaker['getMetrics']> }> = {};
    
    for (const [name, breaker] of this.circuitBreakers.entries()) {
      states[name] = {
        state: breaker.getState(),
        metrics: breaker.getMetrics(),
      };
    }
    
    return states;
  }

  /**
   * Manually trigger circuit breaker state for testing
   */
  forceCircuitBreakerState(serviceName: string, state: CircuitState): void {
    const breaker = this.getCircuitBreaker(serviceName);
    // Access private state for testing
    (breaker as any).state = state;
    this.logger.warn(`Forced circuit breaker "${serviceName}" to ${state}`);
  }
}

/**
 * Decorator to attach resilience context to a method
 */
export function Resilience(context: ResilienceContext): MethodDecorator {
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    Reflect.defineMetadata('resilience', context, descriptor.value);
    return descriptor;
  };
}

/**
 * Decorator for service-level resilience configuration
 */
export function ResilienceService(config: Omit<ResilienceContext, 'operationName'>): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata('resilience', config, target);
  };
}