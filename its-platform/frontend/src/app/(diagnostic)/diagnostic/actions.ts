'use server';

import { redirect } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { serializeDomainError, type ActionResult } from '@/shared/action-result';
import type { DiagnosticFormValues } from '@/presentation/forms/diagnostic-form';
import type { PlacementResult } from '@/core';
import { routes } from '@/shared/routes';

export async function runDiagnosticAction(
  values: DiagnosticFormValues,
): Promise<ActionResult<PlacementResult>> {
  try {
    const { useCases, learnerId } = await getServerContext();

    const input = values.hasPriorEstimate && values.theta !== undefined && values.se !== undefined && values.source !== undefined
      ? {
          mode: values.mode,
          priorEstimate: { theta: values.theta, se: values.se, source: values.source },
        }
      : { mode: values.mode };

    await useCases.runDiagnostic.execute(learnerId, input);
    // We don't have a results page yet; redirect to home
    redirect(routes.home);
  } catch (error) {
    return { ok: false, error: serializeDomainError(error as unknown as Parameters<typeof serializeDomainError>[0]) };
  }
}
