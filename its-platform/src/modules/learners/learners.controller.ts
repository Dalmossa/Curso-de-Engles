import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { LearnersService } from './learners.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
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

  /**
   * O learner corrige o próprio nome de exibição e o próprio avatar.
   *
   * A classe já exige `learner:self` (ADR-038 D2), e este é o mesmo escopo do `GET` ao lado: a
   * rota é sobre **o próprio** recurso do chamador, não sobre um recurso nomeado. A autorização
   * do *objeto* — "este `learner_id` é visível para quem chama?" — é decidida na transação, pela
   * política, e devolve o mesmo 404 para "não existe" e para "é de outro".
   *
   * O corpo é validado pelo `ValidationPipe` global (`whitelist` + `forbidNonWhitelisted`), e um
   * membro não declarado é **rejeitado** — não ignorado (CONSTITUTION §4.5).
   */
  @Patch(':id/profile')
  async updateProfile(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.learnersService.updateProfile(principal.subject, id, dto);
  }

  /**
   * LGPD Art. 18 — Data export (portability).
   * Requires `learner:export` scope (ADR-038 D2). Returns all personal data
   * the platform holds for the learner in a structured, machine-readable format.
   */
  @Scopes(SCOPES.learnerExport)
  @Get(':id/data-export')
  async exportData(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.learnersService.exportData(principal.subject, id);
  }

  /**
   * LGPD Art. 18 — Data erasure (right to be forgotten).
   * Requires `learner:erase` scope (ADR-038 D2). Deletes all personal data
   * the platform holds for the learner. Returns 204 on success.
   */
  @Scopes(SCOPES.learnerErase)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eraseData(
    @CurrentPrincipal() principal: TokenPrincipal,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.learnersService.eraseData(principal.subject, id);
  }
}
