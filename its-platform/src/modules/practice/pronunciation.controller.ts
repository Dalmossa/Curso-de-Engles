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

import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SCOPES, Scopes } from '../../common/auth/scopes.decorator.js';
import { PronunciationEvaluationDto } from './dto/pronunciation-evaluation.dto.js';
import { PronunciationService } from './pronunciation.service.js';
import type { PronunciationEvaluationContent } from './pronunciation.service.js';

@Scopes(SCOPES.learnerSelf)
@Controller('practice')
export class PronunciationController {
  constructor(private readonly pronunciationService: PronunciationService) {}

  @Post('pronunciation-evaluate')
  @HttpCode(200)
  async evaluate(
    @Body() body: PronunciationEvaluationDto,
  ): Promise<PronunciationEvaluationContent> {
    const hasTranscript = body.transcript !== undefined;
    const hasAudio = body.audio_base64 !== undefined;
    if (!hasTranscript && !hasAudio) {
      // Erro do chamador (faltou a entrada), não indisponibilidade do servidor: `400`, e a
      // mensagem diz exatamente qual membro acrescentar.
      throw new BadRequestException(
        'Supply either `transcript` (browser speech recognition) or `audio_base64` (server ASR).',
      );
    }

    return this.pronunciationService.evaluate(body);
  }
}
