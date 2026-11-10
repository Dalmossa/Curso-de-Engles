'use client';

import Link from 'next/link';
import type { AssessmentItem } from '@/core';
import { verdictFor, type PracticeFeedback } from '@/application/use-cases/submit-practice';
import { skillLabel } from '../lib/copy';
import { Alert } from './ui/alert';
import { Badge } from './ui/badge';
import { Button, buttonClasses } from './ui/button';
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from './ui/card';

export interface PracticeFeedbackPanelProps {
  readonly feedback: PracticeFeedback;
  readonly items: readonly AssessmentItem[];
  readonly onRestart: () => void;
}

/**
 * Feedback for a submitted practice pack.
 *
 * ADR-044: the answer key is revealed only here, via `scored_items[].correct` from the
 * submission result. Nothing about the pre-submission payload is used to infer correctness.
 */
export function PracticeFeedbackPanel({ feedback, items, onRestart }: PracticeFeedbackPanelProps) {
  const result = feedback.result;
  const totalGraded = feedback.score.graded;
  const correct = feedback.score.correct;
  const pendingCount = feedback.pendingItemIds.length;

  return (
    <div className="flex flex-col gap-6">
      <Card data-testid="practice-feedback">
        <CardHeader>
          <CardTitle as="h2">Resultado da prática</CardTitle>
          <p className="text-sm text-ink-600">
            Pacote {result.packId}. {totalGraded}{' '}
            {totalGraded === 1 ? 'item corrigido' : 'itens corrigidos'}{pendingCount > 0 ? ` · ${pendingCount} aguardando correção` : ''}.
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <Badge tone="success">Corretos: {correct}</Badge>
            <Badge tone="danger">Errados: {totalGraded - correct}</Badge>
            {pendingCount > 0 ? <Badge tone="neutral">Pendentes: {pendingCount}</Badge> : null}
          </div>

          {pendingCount > 0 ? (
            <Alert tone="info" title="Correção assíncrona">
              Alguns itens foram enviados para correção automática. Seu resultado será atualizado quando o backend
              concluir a análise.
            </Alert>
          ) : null}
        </CardBody>

        <CardFooter className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onRestart}>
            Refazer este pacote
          </Button>
          <Link href="/" className={buttonClasses('primary')}>
            Voltar ao painel
          </Link>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-ink-900">Detalhes por item</h3>
        <ol className="flex flex-col gap-3">
          {items.map((item, index) => {
            const verdict = verdictFor(item.itemId, feedback);
            const tone = verdictToTone(verdict);

            return (
              <li key={item.itemId}>
                <Card data-testid={`feedback-item-${item.itemId}`}>
                  <CardBody className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold tabular-nums text-ink-500">{index + 1}.</span>
                      <Badge tone="neutral">{skillLabel(item.skill)}</Badge>
                      <Badge tone="neutral">{item.itemType}</Badge>
                      <Badge tone={tone}>{verdictLabel(verdict)}</Badge>
                    </div>
                    <p className="text-sm font-medium text-ink-900">{item.prompt}</p>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function verdictToTone(verdict: ReturnType<typeof verdictFor>): 'success' | 'danger' | 'warning' | 'neutral' {
  switch (verdict) {
    case 'correct':
      return 'success';
    case 'incorrect':
      return 'danger';
    case 'pending':
      return 'warning';
    case 'unscored':
      return 'neutral';
  }
}

function verdictLabel(verdict: ReturnType<typeof verdictFor>): string {
  switch (verdict) {
    case 'correct':
      return 'Correto';
    case 'incorrect':
      return 'Incorreto';
    case 'pending':
      return 'Pendente';
    case 'unscored':
      return 'Sem pontuação';
  }
}
