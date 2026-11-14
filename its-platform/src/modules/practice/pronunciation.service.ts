/**
 * História 2 — do corpo da requisição à avaliação, sem inventar nota.
 *
 * O serviço tem uma responsabilidade: resolver a **transcrição** e entregá-la ao domínio. Quando
 * não há transcrição e não há ASR configurado, ele responde `422` — e não `0`. Um zero para
 * "não ouvi nada" seria indistinguível de um zero para "ouvi tudo errado", e o aprendiz agiria
 * sobre a informação errada (repetir versus checar o microfone).
 *
 * O áudio não é persistido em lugar nenhum deste caminho: chega como string, é enviado ao motor e
 * sai de escopo. Retenção de gravação exigiria base legal e prazo definidos (LGPD), e nenhuma das
 * duas foi decidida para este recurso.
 */

import { Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { scorePronunciation } from '../../domain/services/pronunciation-scorer.js';
import type { PronunciationWordScore } from '../../domain/services/pronunciation-scorer.js';
import type { AsrTranscriber } from '../../infrastructure/speech/asr-transcriber.js';
import { ASR_TRANSCRIBER } from '../../infrastructure/speech/asr-transcriber.js';
import type { PronunciationEvaluationDto } from './dto/pronunciation-evaluation.dto.js';

/** O que o contrato publica em `PronunciationEvaluation`. */
export interface PronunciationEvaluationContent {
  overall_score: number;
  word_scores: readonly PronunciationWordScore[];
  feedback_pt: string;
  /** A transcrição efetivamente avaliada — para o cliente exibir o que o ASR entendeu. */
  transcript: string;
}

type TranscriptResolution =
  | { readonly kind: 'ok'; readonly transcript: string }
  | { readonly kind: 'not_configured' }
  | { readonly kind: 'upstream_error' };

const DEFAULT_LOCALE = 'en-US';
const DEFAULT_MIME_TYPE = 'audio/webm';

@Injectable()
export class PronunciationService {
  private readonly logger = new Logger(PronunciationService.name);

  constructor(@Inject(ASR_TRANSCRIBER) private readonly transcriber: AsrTranscriber) {}

  async evaluate(body: PronunciationEvaluationDto): Promise<PronunciationEvaluationContent> {
    const resolved = await this.resolveTranscript(body);
    if (resolved.kind !== 'ok') {
      // `422` e não `503`: o pedido está bem formado e o servidor entendeu; o que falta é uma
      // capacidade que este ambiente não tem. A mensagem diz qual é, sem expor configuração.
      throw new UnprocessableEntityException(
        resolved.kind === 'not_configured'
          ? 'No transcript was supplied and no ASR service is configured for this environment.'
          : 'The ASR service could not transcribe the recording. Try again.',
      );
    }

    const evaluation = scorePronunciation(body.expected_text, resolved.transcript);
    this.logger.log(
      `Pronunciation evaluated: ${evaluation.word_scores.length} words, score ${evaluation.overall_score}`,
    );

    return { ...evaluation, transcript: resolved.transcript };
  }

  private async resolveTranscript(body: PronunciationEvaluationDto): Promise<TranscriptResolution> {
    if (body.transcript !== undefined) {
      return { kind: 'ok', transcript: body.transcript };
    }

    if (body.audio_base64 === undefined) {
      // Inalcançável pelo controller (ele exige um dos dois), mas o serviço não depende de um
      // chamador bem comportado para não gravar `undefined` numa avaliação.
      return { kind: 'not_configured' };
    }

    const outcome = await this.transcriber.transcribe({
      audioBase64: body.audio_base64,
      mimeType: body.mime_type ?? DEFAULT_MIME_TYPE,
      locale: body.locale ?? DEFAULT_LOCALE,
    });

    return outcome.ok ? { kind: 'ok', transcript: outcome.transcript } : { kind: outcome.reason };
  }
}
