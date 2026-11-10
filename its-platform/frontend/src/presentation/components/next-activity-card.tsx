import Link from 'next/link';
import type { ActivityDestination, NextActivity } from '@/core';
import { routes } from '@/shared/routes';
import { activityTypeLabel, EMPTY_STATE_COPY, unavailableReasonMessage } from '../lib/copy';
import { RationalePanel } from './rationale-panel';
import { Badge } from './ui/badge';
import { buttonClasses, Button } from './ui/button';
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from './ui/card';
import { EmptyState } from './ui/feedback';

export interface NextActivityCardProps {
  /**
   * `null` when the platform has nothing to recommend.
   *
   * `GET /learners/{id}/next` is typed as always returning a recommendation, so the dashboard
   * never passes `null` today. The prop is nullable anyway because the alternative for a
   * missing recommendation — dereferencing it — turns "nothing to do right now" into a
   * page-level error with a correlation id, which describes the plumbing and not the learner's
   * situation. The guard costs one render and is real to test.
   */
  readonly activity: NextActivity | null;
  /** The resolved destination, or `null` alongside a `null` activity. */
  readonly destination: ActivityDestination | null;
}

/**
 * The dashboard's recommendation, with its justification and one call to action.
 *
 * The CTA is a real `<Link>` only when `resolveActivityDestination` found a screen for the
 * activity *and* the identifier matched the contract's own pattern. Otherwise it is a
 * disabled button that says which of the two reasons applies — never a link to a 404 and
 * never a hidden card, because "the platform recommended something you cannot open" is
 * information the learner and the developer both need.
 */
export function NextActivityCard({ activity, destination }: NextActivityCardProps) {
  if (activity === null || destination === null) {
    const copy = EMPTY_STATE_COPY.nextActivity;
    return (
      <Card data-testid="next-activity-card">
        <CardBody>
          <EmptyState
            title={copy.title}
            description={copy.description}
            action={
              <Link
                href={routes.mastery}
                className={buttonClasses('primary', 'md')}
                data-testid="next-activity-empty-cta"
              >
                {copy.actionLabel}
              </Link>
            }
            data-testid="next-activity-empty"
          />
        </CardBody>
      </Card>
    );
  }

  const openable = destination.available && destination.href !== null;

  return (
    <Card data-testid="next-activity-card">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle as="h2">Próxima atividade</CardTitle>
          <Badge tone="neutral">{activityTypeLabel(activity.activityType)}</Badge>
        </div>
        <p className="font-mono text-xs break-all text-ink-500">{activity.activityId}</p>
      </CardHeader>

      <CardBody>
        <RationalePanel
          rationale={activity.rationale}
          estimatedDurationMinutes={activity.estimatedDurationMinutes}
          prerequisitesMet={activity.prerequisitesMet}
        />
      </CardBody>

      <CardFooter>
        {openable ? (
          <Link href={destination.href} className={buttonClasses('primary', 'lg')} data-testid="start-activity">
            Começar
          </Link>
        ) : (
          <>
            <Button variant="secondary" size="lg" disabled>
              Começar
            </Button>
            <p className="text-sm text-ink-600" data-testid="activity-unavailable">
              {destination.unavailableReason === null
                ? 'Esta atividade não pode ser aberta.'
                : unavailableReasonMessage(destination.unavailableReason)}
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
