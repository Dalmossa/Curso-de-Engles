import type { SpeechRepository } from '@/core';
import type { SpeechSynthesisInput, SpeechSynthesisResult } from '@/core';

/**
 * Use case for synthesizing speech from text (TTS).
 *
 * Delegates to the SpeechRepository port. The repository handles the HTTP call
 * and returns either a synthesized audio blob (engine: 'remote') or an explicit
 * fallback indicator (engine: 'none'), which the UI uses to trigger the
 * browser's built-in speechSynthesis.
 */
export class SynthesizeSpeech {
  constructor(private readonly speech: SpeechRepository) {}

  async execute(input: SpeechSynthesisInput): Promise<SpeechSynthesisResult> {
    return this.speech.synthesizeSpeech(input);
  }
}