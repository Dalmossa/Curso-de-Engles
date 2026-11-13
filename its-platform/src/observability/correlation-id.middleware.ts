import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { trace, context, propagation, SpanStatusCode, type SpanContext } from '@opentelemetry/api';

/**
 * W3C Trace Context headers
 * - traceparent: carries trace-id, parent-span-id, trace-flags
 * - tracestate: carries vendor-specific trace state
 */
export const TRACEPARENT_HEADER = 'traceparent';
export const TRACESTATE_HEADER = 'tracestate';
export const CORRELATION_ID_HEADER = 'x-correlation-id';

/**
 * Extracted trace context from W3C traceparent header.
 * Format: version-trace-id-parent-id-flags (e.g., 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01)
 */
export interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: string;
}

/**
 * Extracts trace context from W3C traceparent header.
 */
export function extractTraceContext(traceparent: string | undefined): TraceContext | null {
  if (!traceparent) return null;

  // W3C traceparent format: version-trace-id-parent-id-flags
  const parts = traceparent.split('-');
  if (parts.length !== 4) return null;

  const version = parts[0];
  const traceId = parts[1];
  const parentId = parts[2];
  const flags = parts[3];
  
  if (version !== '00') return null; // Only support version 00

  // Validate trace-id (32 hex chars) and parent-id (16 hex chars)
  if (!traceId || !parentId || !flags) return null;
  if (!/^[0-9a-f]{32}$/i.test(traceId) || !/^[0-9a-f]{16}$/i.test(parentId)) {
    return null;
  }

  return { traceId, spanId: parentId, traceFlags: flags };
}

/**
 * Creates a W3C traceparent header from trace context.
 */
export function createTraceparentHeader(traceId: string, spanId: string, sampled = true): string {
  const flags = sampled ? '01' : '00';
  return `00-${traceId}-${spanId}-${flags}`;
}

/**
 * Creates a W3C tracestate header (vendor-specific).
 * For now, we don't add vendor-specific state, but the header is propagated if present.
 */
export function createTracestateHeader(existing?: string): string | undefined {
  // Propagate existing tracestate if present
  return existing;
}

/**
 * Resolves correlation ID: adopts inbound if valid UUID v4, otherwise generates new one.
 * The correlation ID must be a valid UUID for the ProblemDetails contract.
 */
function resolveCorrelationId(inbound: string | undefined): string {
  if (inbound && isValidUuid(inbound)) {
    return inbound;
  }
  return randomUUID();
}

/** Validates UUID format (RFC 4122). */
function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Correlation ID middleware function that:
 * 1. Extracts W3C traceparent/tracestate from incoming request
 * 2. Creates/continues OpenTelemetry trace context
 * 3. Generates or adopts correlation ID (UUID v4)
 * 4. Injects correlation ID and trace context into response headers
 * 5. Makes correlation ID available on request object
 * 
 * This is a functional middleware (not a class) to avoid issues with
 * OpenTelemetry Express instrumentation wrapping class constructors.
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Extract incoming trace context from W3C headers
  const incomingTraceparent = req.headers[TRACEPARENT_HEADER] as string | undefined;
  const incomingTracestate = req.headers[TRACESTATE_HEADER] as string | undefined;

  const traceContext = extractTraceContext(incomingTraceparent);

  // 2. Extract or generate correlation ID
  const inboundCorrelationId = req.headers[CORRELATION_ID_HEADER] as string | undefined;
  const correlationId = resolveCorrelationId(inboundCorrelationId);

  // 3. Store correlation ID on request for use in handlers/filters
  (req as any).correlationId = correlationId;

  // 4. Set response headers (for all responses, not just errors)
  res.setHeader(CORRELATION_ID_HEADER, correlationId);

  // Propagate trace context in response headers
  if (traceContext) {
    // Continue the existing trace - create a child span context for the response
    const traceparent = createTraceparentHeader(traceContext.traceId, traceContext.spanId, true);
    res.setHeader(TRACEPARENT_HEADER, traceparent);
    if (incomingTracestate) {
      res.setHeader(TRACESTATE_HEADER, incomingTracestate);
    }
  } else {
    // No incoming trace context - this request starts a new trace
    // The HTTP instrumentation will create the root span automatically
    // We just ensure correlation ID is propagated
  }

  // 5. Add trace context to request for manual span creation
  if (traceContext) {
    // Store extracted trace context for manual span creation
    (req as any).traceContext = traceContext;
  }

  next();
}

/**
 * Helper to get correlation ID from request.
 * Falls back to generating one if middleware hasn't run.
 */
export function getCorrelationId(req: Request): string {
  const existing = (req as any).correlationId;
  if (existing && typeof existing === 'string') {
    return existing;
  }
  return randomUUID();
}

/**
 * Helper to get trace context from request.
 * Returns null if no trace context was extracted.
 */
export function getTraceContext(req: Request): TraceContext | null {
  return (req as any).traceContext ?? null;
}

/**
 * Creates a child span within the current request's trace context.
 * Use this in domain services to create custom spans that are correlated with the request.
 */
export function createChildSpan(
  name: string,
  req: Request,
  attributes?: Record<string, string | number | boolean>
): { span: ReturnType<typeof trace.getTracer> extends { startSpan: (name: string, options?: any, context?: any) => infer S } ? S : any; end: (error?: Error) => void } {
  const tracer = trace.getTracer('its-platform');
  const traceContext = getTraceContext(req);

  let span: ReturnType<typeof tracer.startSpan>;
  if (traceContext) {
    // Create span as child of the extracted trace context
    const parentSpanContext: SpanContext = {
      traceId: traceContext.traceId,
      spanId: traceContext.spanId,
      traceFlags: 0x01, // sampled
    };
    const parentContext = trace.setSpanContext(context.active(), parentSpanContext);
    span = tracer.startSpan(name, { attributes: attributes ?? {} }, parentContext);
  } else {
    // No parent context - create root span (HTTP instrumentation should have created one)
    span = tracer.startSpan(name, { attributes: attributes ?? {} });
  }

  return {
    span,
    end: (error?: Error) => {
      if (error) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
      }
      span.end();
    },
  };
}