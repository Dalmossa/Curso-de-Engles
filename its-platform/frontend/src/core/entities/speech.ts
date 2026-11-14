/**
 * História 1 — TTS Synthesis
 *
 * The response from `POST /content/tts` carries either a synthesized audio blob
 * (`engine: 'remote'`) or an explicit statement that no engine is configured
 * (`engine: 'none'`). The client must fall back to `window.speechSynthesis`
 * when `engine === 'none'` — this is the designed path for bare-metal
 * deployments, not an error.
 */
export interface SpeechSynthesisAudio {
  readonly mimeType: string;
  readonly base64: string;
  readonly durationMs: number | null;
}

export interface SpeechSynthesisResult {
  readonly text: string;
  readonly voice: string;
  readonly rate: 1 | 0.75;
  readonly engine: 'remote' | 'none';
  readonly audio: SpeechSynthesisAudio | null;
  readonly fallbackReason: 'not_configured' | 'upstream_error' | null;
}

/** Input for the TTS synthesis request. */
export interface SpeechSynthesisInput {
  readonly text: string;
  readonly voice?: string;
  readonly rate?: 1 | 0.75;
}

/**
 * História 2 — Pronunciation Evaluation
 *
 * Word-level scoring result. `status` distinguishes three cases:
 * - `correct`: exact match (similarity 1.0)
 * - `needs_work`: recognized but deviating articulation (0.5 ≤ similarity < 0.9)
 * - `missed`: word was not recognized at all (similarity 0)
 *
 * `confidence` is the similarity score rounded to two decimals; 1 only for exact match.
 */
export interface PronunciationWordScore {
  readonly word: string;
  readonly status: 'correct' | 'needs_work' | 'missed';
  readonly confidence: number; // 0..1, two decimals
}

/** Complete pronunciation evaluation response. */
export interface PronunciationEvaluation {
  readonly overallScore: number; // 0..100, integer
  readonly wordScores: readonly PronunciationWordScore[];
  readonly feedbackPt: string;
  readonly transcript: string;
}

/** Input for pronunciation evaluation. */
export interface PronunciationEvaluationInput {
  readonly expectedText: string;
  readonly transcript?: string;
  readonly audioBase64?: string;
  readonly mimeType?: string;
  readonly locale?: string;
}

/**
 * Target phrases extracted from lesson content for pronunciation practice.
 * Each phase may contribute one or more target sentences.
 */
export interface PronunciationTarget {
  readonly phase: number;
  readonly heading: string;
  readonly text: string;
}