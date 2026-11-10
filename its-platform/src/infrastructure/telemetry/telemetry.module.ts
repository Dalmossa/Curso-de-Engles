import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { initializeOtel } from './otel-sdk.js';

/**
 * TelemetryModule initializes OpenTelemetry instrumentation for the entire application.
 * 
 * This module must be imported early in the application bootstrap process,
 * ideally as one of the first modules in AppModule, to ensure all subsequent
 * operations are traced.
 * 
 * It provides:
 * - Automatic HTTP instrumentation (incoming requests, outgoing HTTP calls)
 * - Database query instrumentation (PostgreSQL via pg)
 * - Redis command instrumentation
 * - NestJS framework instrumentation
 * - OTLP trace/metric export to OTel Collector
 * 
 * The OTel Collector must be running and accessible at OTEL_EXPORTER_OTLP_ENDPOINT
 * (default: http://otel-collector:4317).
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'OTEL_SDK',
      useFactory: (config: ConfigService) => initializeOtel(config),
      inject: [ConfigService],
    },
  ],
  exports: ['OTEL_SDK'],
})
export class TelemetryModule {}
