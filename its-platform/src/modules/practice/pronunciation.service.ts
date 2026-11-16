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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { scorePronunciation } from '../../domain/services/pronunciation-scorer.js';
import type { PronunciationWordScore } from '../../domain/services/pronunciation-scorer.js';
import type { AsrTranscriber } from '../../infrastructure/speech/asr-transcriber.js';
import { ASR_TRANSCRIBER } from '../../infrastructure/speech/asr-transcriber.js';
import { PronunciationAttemptEntity } from '../../infrastructure/entities/pronunciation-attempt.entity.js';
import type { PronunciationEvaluationDto } from './dto/pronunciation-evaluation.dto.js';

/** O que o endpoint devolve: a avaliação do domínio, exatamente como o contrato a descreve. */
export interface PronunciationEvaluationContent {
  readonly overall_score: number;
  readonly word_scores: readonly PronunciationWordScore[];
  readonly feedback_pt: string;
  readonly transcript: string;
  readonly contrastive_tips?: readonly string[];
}

export interface PronunciationAttemptSummary {
  readonly id: string;
  readonly lesson_id: string | null;
  readonly expected_text: string;
  readonly transcript: string;
  readonly overall_score: number;
  readonly feedback_pt: string;
  readonly created_at: string;
}

export interface PronunciationHistoryContent {
  readonly attempts: readonly PronunciationAttemptSummary[];
  readonly summary: {
    readonly totalAttempts: number;
    readonly averageScore: number;
    readonly bestScore: number;
    readonly weakWords: readonly string[];
  };
}

@Injectable()
export class PronunciationService {
  private readonly logger = new Logger(PronunciationService.name);

  constructor(
    @Inject(ASR_TRANSCRIBER) private readonly asr: AsrTranscriber,
    @InjectRepository(PronunciationAttemptEntity)
    private readonly attempts: Repository<PronunciationAttemptEntity>,
  ) {}

  async evaluate(
    dto: PronunciationEvaluationDto,
    learnerId: string,
  ): Promise<PronunciationEvaluationContent> {
    const transcript = await this.resolveTranscript(dto);
    const evaluation = scorePronunciation(dto.expected_text, transcript);

    try {
      await this.attempts.save(
        this.attempts.create({
          learnerId,
          lessonId: null,
          expectedText: dto.expected_text,
          transcript: evaluation.transcript,
          overallScore: evaluation.overall_score,
          wordScores: evaluation.word_scores as unknown as object,
          feedbackPt: evaluation.feedback_pt,
        }),
      );
    } catch (error) {
      // A avaliação já foi produzida; falhar em persistir o histórico não deve anular o feedback.
      this.logger.error(
        `Failed to persist pronunciation attempt for learner ${learnerId}: ${(error as Error).message}`,
      );
    }

    return evaluation;
  }

  async getHistory(learnerId: string): Promise<PronunciationHistoryContent> {
    const rows = await this.attempts.find({
      where: { learnerId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const attempts: PronunciationAttemptSummary[] = rows.map(row => ({
      id: row.id,
      lesson_id: row.lessonId,
      expected_text: row.expectedText,
      transcript: row.transcript,
      overall_score: row.overallScore,
      feedback_pt: row.feedbackPt,
      created_at: row.createdAt.toISOString(),
    }));

    const totalAttempts = rows.length;
    const scores = rows.map(row => row.overallScore);
    const averageScore =
      totalAttempts === 0
        ? 0
        : Math.round((scores.reduce((sum, value) => sum + value, 0) / totalAttempts) * 100) / 100;
    const bestScore = totalAttempts === 0 ? 0 : Math.max(...scores);

    const weakCounts = new Map<string, number>();
    for (const row of rows) {
      const wordScores = Array.isArray(row.wordScores)
        ? (row.wordScores as Array<{ word?: string; status?: string }>)
        : [];
      for (const ws of wordScores) {
        if (!ws || (ws.status !== 'needs_work' && ws.status !== 'missed')) continue;
        const word = String(ws.word ?? '')
          .trim()
          .toLowerCase();
        if (!word) continue;
        weakCounts.set(word, (weakCounts.get(word) ?? 0) + 1);
      }
    }

    const weakWords = [...weakCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([word]) => word);

    return {
      attempts,
      summary: {
        totalAttempts,
        averageScore,
        bestScore,
        weakWords,
      },
    };
  }

  /**
   * Ordem de preferência: o que o navegador já transcreveu (`transcript`) vem primeiro — é
   * observação, não inferência do servidor. O áudio só entra quando não há transcrição e há um
   * motor que possa produzi-la.
   *
   * `transcript` pode ser string vazia deliberada? O DTO a aceita, mas o controller já exigiu
   * "pelo menos um dos dois" no sentido de campo presente; aqui, uma transcrição vazia vinda do
   * cliente significa "não reconheci nada" e é uma entrada legítima para o scorer (que devolve 0
   * com a dica do microfone) — melhor do que mascarar com um 422.
   */
  private async resolveTranscript(dto: PronunciationEvaluationDto): Promise<string> {
    if (dto.transcript !== undefined) {
      return dto.transcript;
    }

    if (dto.audio_base64 === undefined) {
      // O controller já barra a ausência de ambos; chegar aqui seria um bug interno, não um erro
      // do chamador. O 422 mantém a mesma semântica: não há o que pontuar.
      throw new UnprocessableEntityException({
        error: 'no_transcription',
        message:
          'Nenhuma transcrição foi fornecida e este ambiente não possui serviço de ASR configurado.',
      });
    }

    try {
      const outcome = await this.asr.transcribe({
        audioBase64: dto.audio_base64,
        mimeType: dto.mime_type ?? 'audio/webm',
        locale: dto.locale ?? 'en-US',
      });

      if (!outcome.ok) {
        if (outcome.reason === 'not_configured') {
          throw new UnprocessableEntityException({
            error: 'asr_unavailable',
            message:
              'Nenhuma transcrição foi fornecida e este ambiente não possui serviço de ASR configurado.',
          });
        }
        throw new UnprocessableEntityException({
          error: 'transcription_failed',
          message:
            'Não foi possível transcrever a gravação. Tente novamente em um ambiente mais silencioso ou envie a transcrição diretamente.',
        });
      }

      // O motor respondeu, mas pode ter ouvido silêncio. Uma transcrição vazia aqui é dado, não
      // falha: o scorer a transforma na nota e na dica corretas.
      return outcome.transcript;
    } catch (error) {
      if (error instanceof UnprocessableEntityException) throw error;
      // "Não consegui ouvir" e "ouvi e errou tudo" são coisas diferentes. Colapsar a falha do
      // motor num 0 adulteraria o sinal que o aprendiz usa para decidir o próximo passo.
      this.logger.warn(`ASR transcription failed: ${(error as Error).message}`);
      throw new UnprocessableEntityException({
        error: 'transcription_failed',
        message:
          'Não foi possível transcrever a gravação. Tente novamente em um ambiente mais silencioso ou envie a transcrição diretamente.',
      });
    }
  }
}
