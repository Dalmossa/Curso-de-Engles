import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initializeOtel } from './otel.provider.js';
import { registerAutoInstrumentations } from './instrumentation.js';

/**
 * ObservabilityModule initializes OpenTelemetry instrumentation for the entire application.
 *
 * This module must be imported FIRST in AppModule (before all other modules)
 * to ensure all subsequent operations are traced.
 *
 * It provides:
 * - OpenTelemetry SDK initialization (NodeSDK)
 * - Automatic HTTP instrumentation (incoming requests, outgoing HTTP calls)
 * - Database query instrumentation (PostgreSQL via pg)
 * - Redis command instrumentation
 * - NestJS framework instrumentation
 * - BullMQ job queue instrumentation
 * - OTLP trace/metric export to OTel Collector
 * - W3C traceparent correlation ID propagation
 * - Custom metrics for domain operations
 *
 * The OTel Collector must be running and accessible at OTEL_EXPORTER_OTLP_ENDPOINT
 * (default: http://otel-collector:4317).
 *
 * Environment variables:
 * - OTEL_SERVICE_NAME: Service name (default: its-platform-api)
 * - OTEL_EXPORTER_OTLP_ENDPOINT: OTel Collector endpoint (default: http://otel-collector:4317)
 * - OTEL_METRIC_EXPORT_INTERVAL_MS: Metric export interval (default: 30000)
 * - APP_VERSION: Application version (default: 0.1.0)
 * - NODE_ENV: Deployment environment (default: development)
 * - HOSTNAME: Service instance ID (default: random UUID)
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'OTEL_SDK',
      useFactory: (config: ConfigService) => {
        // Register auto-instrumentations first
        registerAutoInstrumentations();
        // Then initialize the SDK
        return initializeOtel(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['OTEL_SDK'],
})
export class ObservabilityModule {}