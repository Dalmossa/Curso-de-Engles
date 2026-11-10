import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT } from '@opentelemetry/semantic-conventions';
import { ConfigService } from '@nestjs/config';

/**
 * Creates and configures the OpenTelemetry NodeSDK for the ITS Platform.
 * This is initialized once at application startup and provides:
 * - Automatic HTTP instrumentation (incoming/outgoing requests)
 * - PostgreSQL query instrumentation
 * - Redis command instrumentation
 * - NestJS framework instrumentation
 * - OTLP trace/metric export to the OTel Collector
 */
export function createOtelSDK(config: ConfigService): NodeSDK {
  const serviceName = 'its-platform-api';
  const serviceVersion = config.get<string>('APP_VERSION') || '0.1.0';
  const environment = config.get<string>('NODE_ENV') || 'development';
  const otelCollectorEndpoint = config.get<string>('OTEL_EXPORTER_OTLP_ENDPOINT') || 'http://otel-collector:4317';

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: environment,
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${otelCollectorEndpoint}/v1/traces`,
    }),
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${otelCollectorEndpoint}/v1/metrics`,
        }),
        exportIntervalMillis: 30000, // Export metrics every 30 seconds
      }),
    ],
    instrumentations: [
      getNodeAutoInstrumentations({
        // Enable all auto-instrumentations except ones that might conflict
        '@opentelemetry/instrumentation-fs': {
          enabled: false, // Disable filesystem instrumentation (too noisy)
        },
        '@opentelemetry/instrumentation-dns': {
          enabled: false, // Disable DNS instrumentation
        },
      }),
    ],
  });

  return sdk;
}

/**
 * Initializes the OpenTelemetry SDK and registers shutdown handlers.
 * Must be called as early as possible in the application lifecycle.
 */
export function initializeOtel(config: ConfigService): NodeSDK {
  const sdk = createOtelSDK(config);
  
  // Initialize the SDK
  sdk.start();
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await sdk.shutdown();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    await sdk.shutdown();
    process.exit(0);
  });

  return sdk;
}
