'use server';

import { getServerContext } from '@/infrastructure/composition/server-container';
import { serializeDomainError, type ActionResult } from '@/shared/action-result';
import type { PracticeFeedback } from '@/application/use-cases/submit-practice';
import type { PracticeResponseInput } from '@/core';

export async function submitPracticeAction(
  packId: string,
  responses: readonly PracticeResponseInput[],
): Promise<ActionResult<PracticeFeedback>> {
  try {
    const { useCases, learnerId } = await getServerContext();
    const feedback = await useCases.submitPractice.execute(learnerId, packId, responses);
    return { ok: true, data: feedback };
  } catch (error) {
    return { ok: false, error: serializeDomainError(error as unknown as Parameters<typeof serializeDomainError>[0]) };
  }
}
