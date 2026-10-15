import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LearnersService } from './learners.service.js';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
import { CurrentPrincipal } from '../../common/auth/current-principal.decorator.js';
import type { TokenPrincipal } from '../../common/auth/token-principal.js';

// Class-level: every route on this controller is the caller's own portfolio, and ADR-038 D2 gives
// that its own scope. The guard reads handler metadata first and class metadata second, so this
// stays the rule while an operation can still narrow it.
@Scopes(SCOPES.learnerSelf)
@Controller('learners')
export class LearnersController {
  constructor(private readonly learnersService: LearnersService) {}

  /**
   * `principal.subject` is the token's `sub` and `id` is the path parameter, and they travel
   * **separately** down to `PgSessionContext` and the query. There is no comparison between them
   * here, or anywhere: ADR-038 D3 makes the 404 the consequence of the policy returning no row, and
   * the controller therefore has no `if (!profile) throw` of its own left to forget.
   */
  @Get(':id/profile')
  async getProfile(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.learnersService.getProfile(principal.subject, id);
  }

  @Get(':id/mastery')
  async getMastery(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.learnersService.getMastery(principal.subject, id);
  }
}
