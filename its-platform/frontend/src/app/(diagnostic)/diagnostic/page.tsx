'use client';

import { useState } from 'react';
import { deserializeDomainError, type ActionResult } from '@/shared/action-result';
import type { PlacementResult } from '@/core';
import { DiagnosticForm, type DiagnosticFormValues } from '@/presentation/forms/diagnostic-form';
import { ErrorState } from '@/presentation/components/error-state';
import { runDiagnosticAction } from './actions';

export default function DiagnosticPage() {
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: DiagnosticFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const result: ActionResult<PlacementResult> = await runDiagnosticAction(values);
      if (!result.ok) {
        setError(deserializeDomainError(result.error));
        return;
      }
    } catch (e) {
      setError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DiagnosticForm onSubmit={onSubmit} isSubmitting={submitting} />
      {error ? <ErrorState error={error} /> : null}
    </div>
  );
}
