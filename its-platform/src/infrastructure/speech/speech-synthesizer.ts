/**
 * História 1 — a porta de síntese de fala (TTS), no mesmo molde de `audio-url-signer.ts`.
 *
 * O domínio não conhece áudio, e a camada de conteúdo não deve conhecer fornecedor. Este arquivo
 * é o contrato entre os dois: o `ContentService` injeta `SPEECH_SYNTHESIZER` e nunca
 * `HttpSpeechSynthesizer`, de modo que trocar um serviço externo (ou acrescentar um motor local)
 * não toca o serviço, o controller nem o contrato OpenAPI.
 *
 * O resultado tem **três** desfechos possíveis, e não dois: sintetizou, não há motor configurado,
 * e o motor configurado falhou. O terceiro existe porque ele é observável e diferente do segundo:
 * "não configurado" é o estado normal do ambiente bare-metal de hoje, "falhou" é um incidente. Os
 * dois terminam no mesmo fallback do navegador (`speechSynthesis`), mas o motivo é publicado no
 * corpo e registrado no log, então a diferença não se perde.
 */

export type SpeechSynthesisEngine = 'remote' | 'none';

export type SpeechFallbackReason = 'not_configured' | 'upstream_error';

export interface SpeechSynthesisInput {
  /** O texto a sintetizar. O DTO limita o tamanho antes de chegar aqui. */
  readonly text: string;
  /** BCP-47, por exemplo `en-US`. */
  readonly voice: string;
  /** `1` ou `0.75`, as mesmas duas velocidades da acomodação de escuta (ADR-028 §2). */
  readonly rate: number;
}

export interface SpeechSynthesisAudio {
  /** `audio/mpeg`, `audio/wav`, … — o que o motor devolveu, sem reinterpretação. */
  readonly mimeType: string;
  readonly base64: string;
  /** Duração informada pelo motor, ou `null` quando ele não a informa. */
  readonly durationMs: number | null;
}

export interface SpeechSynthesisOutcome {
  readonly engine: SpeechSynthesisEngine;
  /** `null` exatamente quando `engine === 'none'` — nunca um áudio vazio. */
  readonly audio: SpeechSynthesisAudio | null;
  readonly fallbackReason: SpeechFallbackReason | null;
}

export interface SpeechSynthesizer {
  synthesize(input: SpeechSynthesisInput): Promise<SpeechSynthesisOutcome>;
}

/** Token de DI da porta; o módulo liga o adaptador escolhido a ele. */
export const SPEECH_SYNTHESIZER = Symbol('SPEECH_SYNTHESIZER');

/** Resposta de um adaptador que não sintetiza nada, por qualquer motivo honesto. */
export function unavailableSynthesis(reason: SpeechFallbackReason): SpeechSynthesisOutcome {
  return { engine: 'none', audio: null, fallbackReason: reason };
}
