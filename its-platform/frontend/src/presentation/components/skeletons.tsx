import { LOADING_LABELS } from '../lib/copy';
import { Card, CardBody, CardFooter, CardHeader } from './ui/card';
import { LoadingRegion, Skeleton } from './ui/feedback';

/**
 * The app's loading skeletons, in one module because they are one idea repeated per screen:
 * the real layout, painted in grey, at the size it will finally have.
 *
 * Two rules drive every choice below.
 *
 * **Match the real geometry.** A fallback that does not match the content it replaces is a
 * layout shift the moment it is swapped out (CLS). So the header is as tall as the real
 * header, the cards are the same `Card`/`CardHeader`/`CardBody` chrome the data will land
 * in, and the number of placeholder rows is the number of rows these screens usually show.
 *
 * **Never invent a number.** These are static, not derived from data that is not here yet:
 * a skeleton that rendered "4 of 5 habilidades" would be a claim, and the point of a
 * placeholder is that it claims nothing.
 */

/** Exactly the four phases `GetLesson` guarantees the rendered lesson has. */
const LESSON_PHASES = [1, 2, 3, 4] as const;
/** A typical pack is longer than this; three items is enough to read the pattern. */
const PRACTICE_ITEMS = [1, 2, 3] as const;
/** `choice` items carry four options (the schema's own ceiling), so four is the tall case. */
const PRACTICE_OPTIONS = [1, 2, 3, 4] as const;
/** One row per skill the mastery panel usually has data for. */
const MASTERY_ROWS = [1, 2, 3, 4] as const;

/** The dashboard's two columns: the recommendation card, and the mastery card beside it. */
export function DashboardSkeleton() {
  return (
    <LoadingRegion
      label={LOADING_LABELS.dashboard}
      className="flex flex-col gap-8"
      data-testid="dashboard-skeleton"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* h1 + CefrBadge, the two things the real header puts on one line. */}
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <ActivityCardSkeleton />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardBody>
            <MasteryPanelSkeleton />
          </CardBody>
        </Card>
      </div>
    </LoadingRegion>
  );
}

/** `/mastery`: the same header shape, one card with the same panel inside. */
export function MasterySkeleton() {
  return (
    <LoadingRegion
      label={LOADING_LABELS.mastery}
      className="flex flex-col gap-8"
      data-testid="mastery-skeleton"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-56" />
        </CardHeader>
        <CardBody>
          <MasteryPanelSkeleton />
        </CardBody>
      </Card>
    </LoadingRegion>
  );
}

/**
 * A lesson: the header of badges, title and id, then the four authored phases.
 *
 * Four is not a guess — `normalizeLessonPhases` in `GetLesson` refuses a lesson that does
 * not have exactly the four phases, so four bars is the shape the data will have.
 */
export function LessonSkeleton() {
  return (
    <LoadingRegion
      label={LOADING_LABELS.lesson}
      className="flex flex-col gap-8"
      data-testid="lesson-skeleton"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-3 w-40" />
      </div>

      <ol className="flex flex-col gap-8" data-testid="lesson-skeleton-phases">
        {LESSON_PHASES.map((phase) => (
          <li key={phase} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3 border-b border-border-subtle pb-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </li>
        ))}
      </ol>
    </LoadingRegion>
  );
}

/** A practice pack: the header line, then one block per item with its options. */
export function PracticeSkeleton() {
  return (
    <LoadingRegion
      label={LOADING_LABELS.practice}
      className="flex flex-col gap-6"
      data-testid="practice-skeleton"
    >
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Skeleton className="h-4 w-64" />

      <ol className="flex flex-col gap-6" data-testid="practice-skeleton-items">
        {PRACTICE_ITEMS.map((item) => (
          <li key={item}>
            {/* Form chrome without a form: a `fieldset` with no `legend` is a group that
                names nothing, so it is hidden from assistive technology alongside the
                placeholder blocks it contains. */}
            <fieldset
              aria-hidden="true"
              className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-raised p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-5 w-2/3" />
              <div className="flex flex-col gap-2">
                {PRACTICE_OPTIONS.map((option) => (
                  <Skeleton key={option} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
    </LoadingRegion>
  );
}

/**
 * The fallback for a screen with no skeleton of its own (`app/loading.tsx`, the diagnostic
 * form): a title, a paragraph and a card of content — the least specific shape that is
 * still recognisably *a page* rather than a spinner.
 */
export function GenericPageSkeleton({ label = LOADING_LABELS.generic }: { readonly label?: string }) {
  return (
    <LoadingRegion label={label} className="flex flex-col gap-6" data-testid="page-skeleton">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </CardBody>
      </Card>
    </LoadingRegion>
  );
}

/** The recommendation card, badge row, rationale and its one call to action. */
function ActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-3 w-56" />
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardBody>
      <CardFooter>
        <Skeleton className="h-12 w-32 rounded-lg" />
      </CardFooter>
    </Card>
  );
}

/**
 * The inside of `MasteryPanel`: the summary line and its per-skill rows.
 *
 * Shared with the dashboard card above because it is the same component in both places —
 * a skeleton that drifted from `MasteryPanel` would be a skeleton for a different screen.
 */
function MasteryPanelSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-64" />
      <ul className="flex flex-col gap-4" data-testid="mastery-skeleton-rows">
        {MASTERY_ROWS.map((row) => (
          <li key={row} className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
