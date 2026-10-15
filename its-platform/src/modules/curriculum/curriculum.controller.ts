import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CurriculumService } from './curriculum.service.js';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
import { CurrentPrincipal } from '../../common/auth/current-principal.decorator.js';
import type { TokenPrincipal } from '../../common/auth/token-principal.js';

@Scopes(SCOPES.learnerSelf)
@Controller('learners')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get(':id/next')
  async getNextActivity(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: any,
  ) {
    return this.curriculumService.getNextActivity(principal.subject, id, query);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
