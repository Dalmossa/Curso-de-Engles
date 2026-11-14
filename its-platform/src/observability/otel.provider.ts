import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_INSTANCE_ID,
} from '@opentelemetry/semantic-conventions';
import type { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

/**
 * Creates and configures the OpenTelemetry NodeSDK for the ITS Platform.
 * This is initialized once at application startup and provides:
 * - Automatic HTTP instrumentation (incoming/outgoing requests)
 * - PostgreSQL query instrumentation (via pg)
 * - Redis command instrumentation
 * - NestJS framework instrumentation
 * - OTLP trace/metric export to the OTel Collector
 *
 * Logs are correlated via the logging instrumentation which adds trace_id/span_id to log records.
 */
export function createOtelSDK(config: ConfigService): NodeSDK {
  const serviceName = config.get<string>('OTEL_SERVICE_NAME') || 'its-platform-api';
  const serviceVersion = config.get<string>('APP_VERSION') || '0.1.0';
  const environment = config.get<string>('NODE_ENV') || 'development';
  const otelCollectorEndpoint =
    config.get<string>('OTEL_EXPORTER_OTLP_ENDPOINT') || 'http://otel-collector:4317';
  const serviceInstanceId = config.get<string>('HOSTNAME') || randomUUID();

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: environment,
      [SEMRESATTRS_SERVICE_INSTANCE_ID]: serviceInstanceId,
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${otelCollectorEndpoint}/v1/traces`,
    }),
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${otelCollectorEndpoint}/v1/metrics`,
        }),
        exportIntervalMillis: config.get<number>('OTEL_METRIC_EXPORT_INTERVAL_MS') || 30000,
      }),
    ],
    instrumentations: [
      getNodeAutoInstrumentations({
        // Enable all auto-instrumentations except ones that might conflict or be too noisy
        '@opentelemetry/instrumentation-fs': {
          enabled: false, // Disable filesystem instrumentation (too noisy)
        },
        '@opentelemetry/instrumentation-dns': {
          enabled: false, // Disable DNS instrumentation
        },
        '@opentelemetry/instrumentation-http': {
          enabled: true,
          // Add request/response headers to spans for debugging
          requestHook: (span, request) => {
            const req = request as any;
            span.setAttribute(
              'http.request.header.x-correlation-id',
              req.headers?.['x-correlation-id'] || '',
            );
          },
          responseHook: (span, response) => {
            const res = response as any;
            span.setAttribute(
              'http.response.header.x-correlation-id',
              res.getHeader?.('x-correlation-id') || '',
            );
          },
        },
        '@opentelemetry/instrumentation-pg': {
          enabled: true,
          // Enhanced PostgreSQL instrumentation
          enhancedDatabaseReporting: true,
        },
        '@opentelemetry/instrumentation-redis': {
          enabled: true,
        },
        '@opentelemetry/instrumentation-nestjs-core': {
          enabled: true,
        },
      }),
    ],
  });

  return sdk;
}

/**
 * Initializes the OpenTelemetry SDK and registers shutdown handlers.
 * Must be called as early as possible in the application lifecycle,
 * before any other instrumented code runs.
 */
export function initializeOtel(config: ConfigService): NodeSDK {
  const sdk = createOtelSDK(config);

  // Initialize the SDK
  sdk.start();

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`[OTel] Received ${signal}, shutting down SDK...`);
    try {
      await sdk.shutdown();
      console.log('[OTel] SDK shut down successfully');
    } catch (error) {
      console.error('[OTel] Error during shutdown:', error);
    }
    process.exit(0);
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  return sdk;
}
