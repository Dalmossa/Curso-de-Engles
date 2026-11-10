import Link from 'next/link';
import { MASTERY_GATE, type MasteryBand, type MasteryOverview, type SkillMastery } from '@/core';
import { formatDateTime } from '@/shared/format';
import { routes } from '@/shared/routes';
import { EMPTY_STATE_COPY, masteryBandLabel, skillLabel } from '../lib/copy';
import { buttonClasses } from './ui/button';
import { EmptyState } from './ui/feedback';
import { Progress, type ProgressTone } from './ui/progress';

const BAND_TONES: Readonly<Record<MasteryBand, ProgressTone>> = {
  not_started: 'neutral',
  emerging: 'danger',
  developing: 'warning',
  approaching: 'brand',
  mastered: 'success',
};

export interface MasteryPanelProps {
  readonly overview: MasteryOverview;
  /** Rows from `GET /learners/{id}/mastery`, when the screen has them. Adds gate and recency. */
  readonly rows?: readonly SkillMastery[];
  readonly className?: string;
}

/**
 * Per-skill mastery, with the gate marked where the contract puts it.
 *
 * The gate line is rendered at the value from `MASTERY_GATE` (0.85) rather than at a
 * percentage that merely looks right: `mastery_gaps` and `gate_passed` are both defined
 * against that number, and a bar that turns green at 80% would contradict the badge beside
 * it.
 *
 * With nothing measured the panel is an empty state rather than an empty list: a card whose
 * body is blank reads as a failed load, and the learner this happens to is precisely the one
 * who does not yet know that the diagnostic is what produces the first number. That is why
 * the call to action is the diagnostic and not "praticar" — there is no mastery to practice
 * against until a placement exists.
 */
export function MasteryPanel({ overview, rows, className }: MasteryPanelProps) {
  const recency = new Map((rows ?? []).map((row) => [row.skill, row.lastPractice]));

  if (overview.entries.length === 0) {
    const copy = EMPTY_STATE_COPY.mastery;
    return (
      <EmptyState
        className={className}
        title={copy.title}
        description={copy.description}
        action={
          <Link
            href={routes.diagnostic}
            className={buttonClasses('primary', 'md')}
            data-testid="mastery-empty-cta"
          >
            {copy.actionLabel}
          </Link>
        }
        data-testid="mastery-empty"
      />
    );
  }

  return (
    <div className={className}>
      <p className="mb-4 text-sm text-ink-600">
        <span className="font-medium text-ink-900">{overview.passedCount}</span> de{' '}
        <span className="font-medium text-ink-900">{overview.entries.length}</span> habilidades na meta de domínio
        ({MASTERY_GATE.toFixed(2).replace('.', ',')}).
      </p>

      <ul className="flex flex-col gap-4">
        {overview.entries.map((entry) => {
          const lastPractice = recency.get(entry.skill);
          return (
            <li key={entry.skill} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink-900">{skillLabel(entry.skill)}</span>
                <span className="text-xs text-ink-500">
                  {masteryBandLabel(entry.band)}
                  {lastPractice === undefined || lastPractice === null
                    ? ''
                    : ` · última prática ${formatDateTime(lastPractice)}`}
                </span>
              </div>
              <Progress
                value={entry.mastery}
                tone={BAND_TONES[entry.band]}
                ariaLabel={`Domínio em ${skillLabel(entry.skill)}`}
                // The gate is stated in the accessible value text as well as in the colour,
                // so the information does not depend on seeing a colour change.
                label={`${Math.round(entry.mastery * 100)}%${entry.gatePassed ? ' ✓' : ''}`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
