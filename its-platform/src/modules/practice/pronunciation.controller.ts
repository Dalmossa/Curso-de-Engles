/**
 * História 2 — `POST /practice/pronunciation-evaluate`.
 *
 * Controller separado do `PracticeController` porque o recurso é outro: aquele endereça um
 * aprendiz (`/learners/{id}/practice`) e grava um attempt; este avalia uma gravação e não persiste
 * nada. Ainda assim o escopo é `learner:self` — a avaliação é um ato do aprendiz sobre a própria
 * fala, e um token sem esse escopo não tem por que chamá-la.
 *
 * `@HttpCode(200)` pelo mesmo motivo do `POST /learners/{id}/practice`: a avaliação não cria um
 * recurso endereçável, e o contrato publica um único status de sucesso. O BFF do frontend só fala
 * `GET`/`POST` com corpo JSON, então não há `201` a interpretar.
 */

import { BadRequestException, Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CurrentPrincipal } from '../../common/auth/current-principal.decorator.js';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
import type { TokenPrincipal } from '../../common/auth/token-principal.js';
import { PronunciationEvaluationDto } from './dto/pronunciation-evaluation.dto.js';
import { PronunciationService } from './pronunciation.service.js';
import type {
  PronunciationEvaluationContent,
  PronunciationHistoryContent,
} from './pronunciation.service.js';

@Controller('practice')
@Scopes(SCOPES.learnerSelf)
export class PronunciationController {
  constructor(private readonly pronunciation: PronunciationService) {}

  @Post('pronunciation-evaluate')
  @HttpCode(200)
  async evaluate(
    @Body() dto: PronunciationEvaluationDto,
    @CurrentPrincipal() principal: TokenPrincipal,
  ): Promise<PronunciationEvaluationContent> {
    // "Pelo menos um dos dois" não cabe em um decorador de campo: é uma relação entre membros.
    // É `400` — o contrato declara a regra e o chamador a violou — e não `422`, que aqui significa
    // "o servidor não tem como produzir a transcrição que faltou".
    if (dto.transcript === undefined && dto.audio_base64 === undefined) {
      throw new BadRequestException(
        'Either `transcript` or `audio_base64` must be provided for pronunciation evaluation.',
      );
    }

    return this.pronunciation.evaluate(dto, principal.subject);
  }

  @Get('pronunciation-history')
  async history(
    @CurrentPrincipal() principal: TokenPrincipal,
  ): Promise<PronunciationHistoryContent> {
    return this.pronunciation.getHistory(principal.subject);
  }
}
