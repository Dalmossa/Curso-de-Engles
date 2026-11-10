import type { NextActivity } from '@/core';
import { formatDurationMinutes } from '@/shared/format';
import { selectionRuleExplanation, selectionRuleLabel, skillLabel } from '../lib/copy';
import { Badge } from './ui/badge';

export interface RationalePanelProps {
  readonly rationale: NextActivity['rationale'];
  readonly estimatedDurationMinutes: number | null;
  readonly prerequisitesMet: boolean | null;
}

/**
 * "Por que esta atividade?" — the reason the recommendation engine chose what it chose.
 *
 * Every field shown is one the contract publishes on `NextActivity.rationale`; nothing is
 * inferred. `prerequisitesMet === false` is a warning rather than a blocker, because the
 * platform still chose to serve the activity.
 */
export function RationalePanel({ rationale, estimatedDurationMinutes, prerequisitesMet }: RationalePanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand" data-testid="selection-rule">
          {selectionRuleLabel(rationale.selectionRule)}
        </Badge>
        {rationale.iPlus1 ? (
          <Badge tone="success" data-testid="i-plus-1">
            Nível i+1
          </Badge>
        ) : null}
        {estimatedDurationMinutes === null ? null : (
          <Badge tone="neutral">{formatDurationMinutes(estimatedDurationMinutes)}</Badge>
        )}
      </div>

      <p className="text-sm text-ink-600">{selectionRuleExplanation(rationale.selectionRule)}</p>

      {rationale.masteryGaps.length === 0 ? (
        <p className="text-sm text-ink-600">
          Nenhuma habilidade abaixo da meta de domínio (0,85) motivou esta escolha.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
            Habilidades abaixo de 0,85
          </p>
          <ul className="flex flex-wrap gap-2" data-testid="mastery-gaps">
            {rationale.masteryGaps.map((gap) => (
              <li key={gap}>
                <Badge tone="warning">{skillLabel(gap)}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {prerequisitesMet === false ? (
        <p className="text-sm text-warning-700" data-testid="prerequisites-warning">
          Os pré-requisitos desta atividade ainda não foram concluídos. A plataforma a recomenda mesmo assim —
          vale saber que ela pode exigir mais esforço.
        </p>
      ) : null}
    </div>
  );
}
