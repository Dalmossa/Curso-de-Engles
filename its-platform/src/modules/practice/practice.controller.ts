import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PracticeSubmissionDto } from './dto/practice-submission.dto.js';
import { PracticeService } from './practice.service.js';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
import { CurrentPrincipal } from '../../common/auth/current-principal.decorator.js';
import type { TokenPrincipal } from '../../common/auth/token-principal.js';

@Scopes(SCOPES.learnerSelf)
@Controller('learners')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  /**
   * `200` for the same reason as `POST /learners/{learner_id}/placement`: the contract publishes one
   * success status, and scoring a submission creates no addressable resource. The body is
   * `PracticeSubmissionDto`, which is what makes the published `required`, `pattern`, `minItems` and
   * `minimum` enforceable (§4.5).
   *
   * `principal.subject` is the session context and `id` the addressed object, kept apart so that the
   * 404 comes from the policy (ADR-038 D3) rather than from a comparison in this method.
   */
  @Post(':id/practice')
  @HttpCode(200)
  async submitPractice(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PracticeSubmissionDto,
  ) {
    return this.practiceService.submitPractice(principal.subject, id, body);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
