'use server';

import { redirect } from 'next/navigation';
import { toDomainError, type PlacementResult } from '@/core';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { serializeDomainError, type ActionResult } from '@/shared/action-result';
import type { DiagnosticFormValues } from '@/presentation/forms/diagnostic-form';
import { routes } from '@/shared/routes';

/**
 * Runs the diagnostic placement. `redirect` navigates by throwing, so it stays outside the
 * `catch`: a captured redirect used to be serialised as an error with no `kind`, which left
 * `ErrorState` with no copy to render.
 */
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
  } catch (error) {
    return { ok: false, error: serializeDomainError(toDomainError(error)) };
  }

  // No results page yet: a successful placement goes home.
  redirect(routes.home);
}
