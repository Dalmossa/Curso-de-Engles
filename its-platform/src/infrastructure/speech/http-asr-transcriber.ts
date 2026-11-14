/**
 * História 2 — adaptador HTTP do port `AsrTranscriber`.
 *
 * Contrato: `POST {ASR_SERVICE_URL}` com `{ audio_base64, mime_type, locale }`, respondendo
 * `{ transcript }` (ou `{ text }`, a forma que Whisper e vários serviços gerenciados usam).
 * `ASR_API_KEY`, quando definida, vai como bearer — e nunca é logada.
 *
 * O áudio do aprendiz **não** é persistido: ele existe como string neste processo, vai ao motor e
 * é descartado. Guardar gravações exigiria base legal e retenção definidas (LGPD), e nenhuma das
 * duas existe para este recurso.
 */

import { Logger } from '@nestjs/common';
import type { AsrOutcome, AsrTranscriber, AsrTranscriptionInput } from './asr-transcriber.js';

const DEFAULT_TIMEOUT_MS = 20_000;

export interface HttpAsrTranscriberOptions {
  readonly baseUrl: string;
  readonly apiKey?: string | undefined;
  readonly timeoutMs?: number;
  /** Só para testes: substitui `fetch` sem mock global. */
  readonly fetchImpl?: typeof fetch;
}

interface AsrJsonBody {
  transcript?: unknown;
  text?: unknown;
}

export class HttpAsrTranscriber implements AsrTranscriber {
  private readonly logger = new Logger(HttpAsrTranscriber.name);
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: HttpAsrTranscriberOptions) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async transcribe(input: AsrTranscriptionInput): Promise<AsrOutcome> {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      accept: 'application/json',
    };
    if (this.apiKey !== undefined && this.apiKey !== '') {
      headers['authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await this.fetchImpl(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          audio_base64: input.audioBase64,
          mime_type: input.mimeType,
          locale: input.locale,
        }),
        // Transcrição é mais lenta que síntese: o áudio é decodificado antes do reconhecimento.
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        this.logger.warn(`ASR upstream answered ${response.status}`);
        return { ok: false, reason: 'upstream_error' };
      }

      const body = (await response.json()) as AsrJsonBody;
      const transcript =
        typeof body.transcript === 'string'
          ? body.transcript
          : typeof body.text === 'string'
            ? body.text
            : null;

      if (transcript === null) {
        this.logger.warn('ASR upstream returned no transcript member');
        return { ok: false, reason: 'upstream_error' };
      }

      return { ok: true, transcript };
    } catch (error) {
      this.logger.warn(
        `ASR upstream failed: ${error instanceof Error ? error.name : 'unknown error'}`,
      );
      return { ok: false, reason: 'upstream_error' };
    }
  }
}
