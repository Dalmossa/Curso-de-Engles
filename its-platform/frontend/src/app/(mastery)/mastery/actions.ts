'use server';

import { getServerContext } from '@/infrastructure/composition/server-container';
import { serializeDomainError, type ActionResult } from '@/shared/action-result';
import type { SpeechSynthesisInput, SpeechSynthesisResult } from '@/core';

export async function synthesizeWeakWordAction(
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
