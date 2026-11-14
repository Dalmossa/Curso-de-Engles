/**
 * História 1 — adaptador HTTP do port `SpeechSynthesizer`.
 *
 * O contrato com o motor externo é deliberadamente pequeno, porque nenhum fornecedor está
 * escolhido: `POST {TTS_SERVICE_URL}` com `{ text, voice, rate, format }` e **ou** bytes de áudio
 * (`Content-Type: audio/*`) **ou** `{ audio_base64, mime_type, duration_ms? }`. As duas formas são
 * aceitas porque as duas são comuns: Piper e Coqui devolvem bytes, serviços gerenciados devolvem
 * JSON. Aceitar ambas mantém a escolha do fornecedor do lado de fora deste arquivo.
 *
 * Nada de conteúdo do aprendiz passa por aqui — só o texto da lição —, e nenhum log deste módulo
 * imprime o texto: tamanho e status bastam para diagnosticar.
 */

import { Logger } from '@nestjs/common';
import type {
  SpeechSynthesisAudio,
  SpeechSynthesisInput,
  SpeechSynthesisOutcome,
  SpeechSynthesizer,
} from './speech-synthesizer.js';
import { unavailableSynthesis } from './speech-synthesizer.js';

/** Formato pedido ao motor. MP3 é o que o navegador toca sem depender de codec do sistema. */
const REQUESTED_FORMAT = 'mp3';

const DEFAULT_TIMEOUT_MS = 8_000;

export interface HttpSpeechSynthesizerOptions {
  readonly baseUrl: string;
  /** Enviado como bearer quando presente; nunca logado. */
  readonly apiKey?: string | undefined;
  readonly timeoutMs?: number;
  /** Só para testes: substitui `fetch` sem mock global. */
  readonly fetchImpl?: typeof fetch;
}

interface JsonSynthesisBody {
  audio_base64?: unknown;
  mime_type?: unknown;
  duration_ms?: unknown;
}

/** Base64 válido o suficiente para recusar um corpo corrompido antes de publicá-lo. */
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

export class HttpSpeechSynthesizer implements SpeechSynthesizer {
  private readonly logger = new Logger(HttpSpeechSynthesizer.name);
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: HttpSpeechSynthesizerOptions) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async synthesize(input: SpeechSynthesisInput): Promise<SpeechSynthesisOutcome> {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      accept: 'audio/*, application/json',
    };
    if (this.apiKey !== undefined && this.apiKey !== '') {
      headers['authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await this.fetchImpl(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: input.text,
          voice: input.voice,
          rate: input.rate,
          format: REQUESTED_FORMAT,
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        // O status é logável; o corpo do motor pode conter o texto enviado, então não vai para
        // o log. `text.length` é o suficiente para reproduzir o tamanho da entrada.
        this.logger.warn(
          `TTS upstream answered ${response.status} for ${input.text.length} characters`,
        );
        return unavailableSynthesis('upstream_error');
      }

      const contentType = response.headers.get('content-type') ?? '';
      const audio = contentType.startsWith('audio/')
        ? await this.fromAudioBytes(response, contentType)
        : await this.fromJson(response);

      if (audio === null) {
        this.logger.warn(
          `TTS upstream returned an unusable body (${contentType || 'no content type'})`,
        );
        return unavailableSynthesis('upstream_error');
      }

      return { engine: 'remote', audio, fallbackReason: null };
    } catch (error) {
      // Qualquer falha de transporte, timeout ou parse é "motor indisponível" para o chamador: o
      // fallback do navegador existe exatamente para este caso, e um 500 impediria a lição de
      // renderizar por causa de um recurso acessório.
      this.logger.warn(
        `TTS upstream failed: ${error instanceof Error ? error.name : 'unknown error'}`,
      );
      return unavailableSynthesis('upstream_error');
    }
  }

  private async fromAudioBytes(
    response: Response,
    contentType: string,
  ): Promise<SpeechSynthesisAudio | null> {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength === 0) return null;
    return {
      mimeType: contentType.split(';')[0]?.trim() || 'audio/mpeg',
      base64: buffer.toString('base64'),
      // Bytes de áudio não carregam duração; o cliente a lê do elemento `<audio>`.
      durationMs: null,
    };
  }

  private async fromJson(response: Response): Promise<SpeechSynthesisAudio | null> {
    const body = (await response.json()) as JsonSynthesisBody;
    const base64 = body.audio_base64;
    if (typeof base64 !== 'string' || base64.length === 0 || !BASE64.test(base64)) return null;

    const mimeType =
      typeof body.mime_type === 'string' && body.mime_type.length > 0
        ? body.mime_type
        : 'audio/mpeg';
    const durationMs =
      typeof body.duration_ms === 'number' && Number.isFinite(body.duration_ms)
        ? body.duration_ms
        : null;

    return { mimeType, base64, durationMs };
  }
}
