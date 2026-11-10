'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import type { DiagnosticMode, PriorEstimateSource } from '@/core';
import { Button } from '../components/ui/button';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/card';

const formSchema = z.object({
  mode: z.enum(['adaptive', 'fixed'] as const satisfies readonly [DiagnosticMode, DiagnosticMode]),
  hasPriorEstimate: z.boolean(),
  theta: z
    .coerce
    .number()
    .min(-5, 'Valor entre -5 e 5.')
    .max(5, 'Valor entre -5 e 5.')
    .optional(),
  se: z
    .coerce
    .number()
    .min(0.1, 'Mínimo 0,10.')
    .max(1, 'Máximo 1,00.')
    .optional(),
  source: z
    .enum(['previous_diagnostic', 'self_report', 'external_test'] as const satisfies readonly [PriorEstimateSource, PriorEstimateSource, PriorEstimateSource])
    .optional(),
}).refine((data) => {
  if (!data.hasPriorEstimate) return true;
  return data.theta !== undefined && data.se !== undefined && data.source !== undefined;
}, {
  message: 'Preencha o estimador anterior quando selecionado.',
  path: ['hasPriorEstimate'],
});

export type DiagnosticFormValues = z.infer<typeof formSchema>;

interface DiagnosticFormProps {
  readonly onSubmit: (values: DiagnosticFormValues) => void;
  readonly isSubmitting: boolean;
}

export function DiagnosticForm({ onSubmit, isSubmitting }: DiagnosticFormProps) {
  const { control, register, handleSubmit, formState: { errors } } = useForm<
    z.input<typeof formSchema>,
    unknown,
    DiagnosticFormValues
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: 'adaptive',
      hasPriorEstimate: false,
    },
  });

  // `useWatch` rather than the `watch` returned by `useForm`: the latter is flagged by the
  // React Compiler as an uninstrumentable render-time subscription.
  const hasPriorEstimate = useWatch({ control, name: 'hasPriorEstimate' });

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h1">Diagnóstico de colocação</CardTitle>
        <p className="text-sm text-ink-600">
          O endpoint atual retorna apenas o resultado da colocação (início e estimativa θ). Não há fluxo de questões
          nesta versão da interface.
        </p>
      </CardHeader>
      <CardBody>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit((values) => onSubmit(values))}>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-ink-900">Modo</legend>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="radio" value="adaptive" {...register('mode')} />
              Adaptativo
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="radio" value="fixed" {...register('mode')} />
              Fixo
            </label>
          </fieldset>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                {...register('hasPriorEstimate')}
                // The refine() error lands on this field, so the field has to carry it
                // (WCAG 3.3.1 / 4.1.3): a message in a sibling paragraph is not enough.
                aria-invalid={errors.hasPriorEstimate ? true : undefined}
                aria-describedby={errors.hasPriorEstimate ? 'prior-estimate-error' : undefined}
              />
              Usar estimativa anterior (opcional)
            </label>

            {hasPriorEstimate ? (
              <div className="grid gap-4 rounded-lg border border-border-subtle p-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="theta" className="text-sm text-ink-700">Theta</label>
                  <input
                    id="theta"
                    type="number"
                    step="0.01"
                    className="rounded-lg border border-border-subtle bg-surface-raised p-2 text-sm text-ink-900"
                    {...register('theta')}
                    aria-invalid={errors.theta ? true : undefined}
                    aria-describedby={errors.theta ? 'theta-error' : undefined}
                  />
                  {errors.theta ? (
                    <p id="theta-error" role="alert" className="text-xs text-danger-600">
                      {errors.theta.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="se" className="text-sm text-ink-700">Erro padrão (se)</label>
                  <input
                    id="se"
                    type="number"
                    step="0.01"
                    className="rounded-lg border border-border-subtle bg-surface-raised p-2 text-sm text-ink-900"
                    {...register('se')}
                    aria-invalid={errors.se ? true : undefined}
                    aria-describedby={errors.se ? 'se-error' : undefined}
                  />
                  {errors.se ? (
                    <p id="se-error" role="alert" className="text-xs text-danger-600">
                      {errors.se.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="source" className="text-sm text-ink-700">Fonte</label>
                  <select
                    id="source"
                    className="rounded-lg border border-border-subtle bg-surface-raised p-2 text-sm text-ink-900"
                    {...register('source')}
                    aria-invalid={errors.source ? true : undefined}
                    aria-describedby={errors.source ? 'source-error' : undefined}
                  >
                    <option value="">Selecione</option>
                    <option value="previous_diagnostic">Diagnóstico anterior</option>
                    <option value="self_report">Autoavaliação</option>
                    <option value="external_test">Teste externo</option>
                  </select>
                  {errors.source ? (
                    <p id="source-error" role="alert" className="text-xs text-danger-600">
                      {errors.source.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
            {errors.hasPriorEstimate ? (
              <p id="prior-estimate-error" role="alert" className="text-xs text-danger-600">
                {errors.hasPriorEstimate.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando…' : 'Iniciar diagnóstico'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
