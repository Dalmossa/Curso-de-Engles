import type { SpeechRepository } from '@/core';
import type { PronunciationEvaluationInput, PronunciationEvaluation } from '@/core';

/**
 * Use case for evaluating pronunciation against a target phrase.
 *
 * Accepts either a transcript (from Web Speech API) or recorded audio (base64).
 * Delegates to the SpeechRepository port which handles the HTTP call.
 * The backend returns word-level scoring with overall score and Portuguese feedback.
 * Throws DomainError on 422 (no transcript and no ASR service configured).
 */
export class EvaluatePronunciation {
  constructor(private readonly speech: SpeechRepository) {}

  async execute(input: PronunciationEvaluationInput): Promise<PronunciationEvaluation> {
    return this.speech.evaluatePronunciation(input);
  }
}