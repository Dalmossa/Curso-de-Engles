import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { DiagnosticRequestDto } from './dto/diagnostic-request.dto.js';
import { PlacementService } from './placement.service.js';

@Controller('learners')
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  /**
   * `200`, not Nest's `201` for `POST`: this operation computes a placement result and creates no
   * addressable resource, and `docs/api-spec.openapi.yaml` publishes exactly one success status for
   * it — `200`. Served and published disagreed until A5a (measured over HTTP; `reports/api/fase-5.md`
   * §2). The body is `DiagnosticRequestDto` so that §4.5's `whitelist`/`forbidNonWhitelisted` have a
   * metatype to act on; with `any` the published schema was advisory.
   */
  @Post(':id/placement')
  async runDiagnostic(@Param('id', ParseUUIDPipe) id: string, @Body() body: DiagnosticRequestDto) {
    return this.placementService.runDiagnostic(id, body);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
