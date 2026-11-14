'use server';

import { getServerContext } from '@/infrastructure/composition/server-container';
import { serializeDomainError, type ActionResult } from '@/shared/action-result';
import type { SpeechSynthesisInput, SpeechSynthesisResult } from '@/core';
import type { PronunciationEvaluationInput, PronunciationEvaluation } from '@/core';

/**
 * Server Action: Synthesize speech via TTS.
 *
 * Returns the synthesis result which may contain audio (engine: 'remote') or
 * indicate no engine is configured (engine: 'none'), in which case the client
 * should fall back to window.speechSynthesis.
 */
export async function synthesizeSpeechAction(
  input: SpeechSynthesisInput,
): Promise<ActionResult<SpeechSynthesisResult>> {
  try {
    const { useCases } = await getServerContext();
    const result = await useCases.synthesizeSpeech.execute(input);
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: serializeDomainError(error as unknown as Parameters<typeof serializeDomainError>[0]) };
  }
}

/**
 * Server Action: Evaluate pronunciation against a target phrase.
 *
 * Accepts either a transcript (from Web Speech API) or recorded audio (base64).
 * Returns word-level scoring with overall score and Portuguese feedback.
 * Returns error on 422 (no transcript and no ASR service configured).
 */
export async function evaluatePronunciationAction(
  input: PronunciationEvaluationInput,
): Promise<ActionResult<PronunciationEvaluation>> {
  try {
    const { useCases } = await getServerContext();
    const result = await useCases.evaluatePronunciation.execute(input);
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: serializeDomainError(error as unknown as Parameters<typeof serializeDomainError>[0]) };
  }
}