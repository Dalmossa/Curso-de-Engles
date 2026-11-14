/**
 * Observability Module - OpenTelemetry instrumentation for ITS Platform
 *
 * This module provides unified traces, metrics, and logs via OpenTelemetry SDK.
 * It includes:
 * - OTel SDK initialization and configuration
 * - Auto-instrumentation for HTTP, PostgreSQL, Redis, NestJS, BullMQ
 * - W3C traceparent correlation ID propagation
 * - Custom spans for domain services (mastery gate, BKT, FSRS, auth, content)
 * - Custom metrics (histograms, counters, gauges)
 * - Log correlation with trace_id/span_id
 */

// Observability Module (NestJS module)
export { ObservabilityModule } from './observability.module.js';

// OTel SDK Provider
export * from './otel.provider.js';

// Auto-instrumentation registration
export * from './instrumentation.js';

// Correlation ID middleware with W3C traceparent support
export * from './correlation-id.middleware.js';

// Custom span helpers for domain services
export * from './custom-spans.js';

// Custom metrics
export * from './metrics.js';

// Re-export key OpenTelemetry API types for convenience
export type { Span, SpanStatusCode, SpanKind, TraceFlags } from '@opentelemetry/api';

export { trace, metrics, context, propagation } from '@opentelemetry/api';
