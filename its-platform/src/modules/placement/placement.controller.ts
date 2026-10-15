import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { DiagnosticRequestDto } from './dto/diagnostic-request.dto.js';
import { PlacementService } from './placement.service.js';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
import { CurrentPrincipal } from '../../common/auth/current-principal.decorator.js';
import type { TokenPrincipal } from '../../common/auth/token-principal.js';

@Scopes(SCOPES.learnerSelf)
@Controller('learners')
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  /**
   * `200`, not Nest's `201` for `POST`: this operation computes a placement result and creates no
   * addressable resource, and `docs/api-spec.openapi.yaml` publishes exactly one success status for
   * it — `200`. Served and published disagreed until A5a (measured over HTTP; `reports/api/fase-5.md`
   * §2). The body is `DiagnosticRequestDto` so that §4.5's `whitelist`/`forbidNonWhitelisted` have a
   * metatype to act on; with `any` the published schema was advisory.
   *
   * `principal.subject` goes in as the session context and `id` as the addressed object — separately,
   * because ADR-038 D3 makes the 404 the policy's answer rather than a comparison made here.
   */
  @Post(':id/placement')
  @HttpCode(200)
  async runDiagnostic(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: DiagnosticRequestDto,
  ) {
    return this.placementService.runDiagnostic(principal.subject, id, body);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
