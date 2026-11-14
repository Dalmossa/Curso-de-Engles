import type { SpeechSynthesisInput, SpeechSynthesisResult } from '../entities/speech';
import type { PronunciationEvaluationInput, PronunciationEvaluation } from '../entities/speech';

/**
 * Port for speech-related operations (TTS synthesis and pronunciation evaluation).
 *
 * This is the seam between the application layer (use cases) and the infrastructure
 * layer (HTTP repositories). Tests substitute a fake implementation; the server
 * composition root provides the real HTTP adapter.
 */
export interface SpeechRepository {
  /**
   * Synthesizes speech from text via TTS.
   *
   * Returns the synthesis result which may contain audio (engine: 'remote') or
   * indicate no engine is configured (engine: 'none'), in which case the client
   * should fall back to window.speechSynthesis.
   */
  synthesizeSpeech(input: SpeechSynthesisInput): Promise<SpeechSynthesisResult>;

  /**
   * Evaluates pronunciation against a target phrase.
   *
   * Accepts either a transcript (from Web Speech API) or recorded audio (base64).
   * Returns word-level scoring with overall score and Portuguese feedback.
   * Returns 422 if no transcript is supplied and no ASR service is configured.
   */
  evaluatePronunciation(input: PronunciationEvaluationInput): Promise<PronunciationEvaluation>;
}