import { Module } from '@nestjs/common';
import { PlacementController } from './placement.controller.js';
import { PlacementService } from './placement.service.js';
import { DiagnosticResultService } from './diagnostic-result.service.js';
import { DiagnosticResultRepository } from '../../infrastructure/repositories/diagnostic-result.repository.js';

/**
 * `DiagnosticResultRepository`/`DiagnosticResultService` are P1.10's persistence path. They are
 * registered here (the placement module owns the diagnostic) and get their `DataSource` from the
 * global `DatabaseModule`.
 */
@Module({
  controllers: [PlacementController],
  providers: [PlacementService, DiagnosticResultService, DiagnosticResultRepository],
  exports: [DiagnosticResultService],
})
export class PlacementModule {}
