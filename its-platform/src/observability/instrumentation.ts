import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

/**
 * Registers all auto-instrumentations for the ITS Platform.
 *
 * This function is called during application bootstrap to enable:
 * - HTTP incoming/outgoing request instrumentation
 * - PostgreSQL query instrumentation
 * - Redis command instrumentation
 * - NestJS framework instrumentation
 *
 * Call this once at application startup, before any instrumented code runs.
 */
export function registerAutoInstrumentations(): void {
  registerInstrumentations({
    instrumentations: [
      // HTTP instrumentation - traces incoming requests and outgoing HTTP calls
      new HttpInstrumentation({
        // Ignore health check endpoints to reduce noise
        ignoreIncomingRequestHook: request => {
          const url = request.url || '';
          return (
            url === '/health' || url === '/ready' || url === '/metrics' || url === '/favicon.ico'
          );
        },
        // Add custom attributes to HTTP spans
        requestHook: (span, request) => {
          // Add correlation ID if present
          const req = request as any;
          const correlationId = req.headers?.['x-correlation-id'] as string | undefined;
          if (correlationId) {
            span.setAttribute('http.request.header.x-correlation-id', correlationId);
          }
          // Add traceparent header for W3C correlation
          const traceparent = req.headers?.traceparent as string | undefined;
          if (traceparent) {
            span.setAttribute('http.request.header.traceparent', traceparent);
          }
        },
        responseHook: (span, response) => {
          // Echo correlation ID in response
          const res = response as any;
          const correlationId = res.getHeader?.('x-correlation-id') as string | undefined;
          if (correlationId) {
            span.setAttribute('http.response.header.x-correlation-id', correlationId);
          }
        },
      }),

      // PostgreSQL instrumentation - traces database queries
      new PgInstrumentation({
        // Enhanced database reporting includes query parameters (sanitized)
        enhancedDatabaseReporting: true,
        // Optional: filter out health check queries
        // filter: (query) => !query.text.includes('health'),
      }),

      // Redis instrumentation - traces Redis commands
      new RedisInstrumentation({
        // Add Redis command attributes
        // responseHook is not needed for Redis as it's mostly command/response
      }),

      // NestJS instrumentation - traces controller methods, guards, pipes, interceptors
      new NestInstrumentation({
        // This will trace the full NestJS request lifecycle
      }),

      // BullMQ instrumentation - not available as separate package, relies on auto-instrumentations
      // GraphQL instrumentation (optional - only if GraphQL is used)
      // new GraphQLInstrumentation({
      //   // Traces GraphQL resolvers
      // }),
    ],
  });
}

/**
 * Instrumentation configuration for specific modules.
 * These can be enabled/disabled via environment variables.
 */
export interface InstrumentationConfig {
  http?: boolean;
  pg?: boolean;
  redis?: boolean;
  nestjs?: boolean;
}

/**
 * Registers instrumentations based on configuration.
 * Useful for selectively disabling instrumentations in tests or specific environments.
 */
export function registerConfiguredInstrumentations(config: InstrumentationConfig = {}): void {
  const instrumentations: any[] = [];

  if (config.http !== false) {
    instrumentations.push(
      new HttpInstrumentation({
        ignoreIncomingRequestHook: request => {
          const url = request.url || '';
          return (
            url === '/health' || url === '/ready' || url === '/metrics' || url === '/favicon.ico'
          );
        },
        requestHook: (span, request) => {
          const req = request as any;
          const correlationId = req.headers?.['x-correlation-id'] as string | undefined;
          if (correlationId) {
            span.setAttribute('http.request.header.x-correlation-id', correlationId);
          }
          const traceparent = req.headers?.traceparent as string | undefined;
          if (traceparent) {
            span.setAttribute('http.request.header.traceparent', traceparent);
          }
        },
        responseHook: (span, response) => {
          const res = response as any;
          const correlationId = res.getHeader?.('x-correlation-id') as string | undefined;
          if (correlationId) {
            span.setAttribute('http.response.header.x-correlation-id', correlationId);
          }
        },
      }),
    );
  }

  if (config.pg !== false) {
    instrumentations.push(
      new PgInstrumentation({
        enhancedDatabaseReporting: true,
      }),
    );
  }

  if (config.redis !== false) {
    instrumentations.push(new RedisInstrumentation());
  }

  if (config.nestjs !== false) {
    instrumentations.push(new NestInstrumentation());
  }

  registerInstrumentations({ instrumentations });
}
