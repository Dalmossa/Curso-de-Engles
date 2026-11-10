import { routes } from '@/shared/routes';
import type { ActivityType, NextActivity } from '../entities/activity';
import { isDialogueId, isLessonId, isPackId } from '../value-objects/identifiers';

export { isDialogueId, isLessonId, isPackId };

/**
 * `pack_les_a2_greetings_v1` → `les_a2_greetings`.
 *
 * The pack id embeds its lesson (`^pack[-_]les_…`), which is what lets a
 * `practice_pack` activity reach the practice screen nested under that lesson instead
 * of needing a pack route the plan does not have. `null` when the id is malformed —
 * the caller renders "cannot open" rather than a broken link.
 */
export function lessonIdFromPackId(packId: string): string | null {
  if (!isPackId(packId)) return null;
  const withoutPrefix = packId.replace(/^pack[-_]/, '');
  const withoutSuffix = withoutPrefix.replace(/_v1$/, '');
  return isLessonId(withoutSuffix) ? withoutSuffix : null;
}

export interface ActivityDestination {
  readonly activityType: ActivityType;
  /** The id as received. Echoed so an unavailable activity is still debuggable. */
  readonly activityId: string;
  /** A real, navigable path — or `null` when this build has no screen for it. */
  readonly href: string | null;
  /** Whether the CTA may be a link at all. */
  readonly available: boolean;
  /** Set for both `lesson` and `practice_pack`, which are nested under a lesson. */
  readonly lessonId: string | null;
  /** Why the CTA is disabled. `null` when it is not. */
  readonly unavailableReason: UnavailableReason | null;
}

export type UnavailableReason =
  /** `listening` and `review` are contract-legal activity types with no screen yet. */
  | 'not_implemented'
  /** The id does not match the contract's own pattern for that activity type. */
  | 'malformed_identifier';

/**
 * Maps a recommendation to a route.
 *
 * `listening` and `review` are deliberately *unavailable* rather than pointed
 * somewhere plausible: `listening` would need a dialogue screen
 * (`GET /content/listening/{id}` exists but is out of this slice) and `review` has no
 * id semantics the UI can act on at all. A disabled CTA that says why is honest;
 * a link to a 404 is not.
 */
export function resolveActivityDestination(
  activity: Pick<NextActivity, 'activityType' | 'activityId'>,
): ActivityDestination {
  const { activityType, activityId } = activity;

  const unavailable = (reason: UnavailableReason, lessonId: string | null = null): ActivityDestination => ({
    activityType,
    activityId,
    href: null,
    available: false,
    lessonId,
    unavailableReason: reason,
  });

  switch (activityType) {
    case 'lesson': {
      if (!isLessonId(activityId)) return unavailable('malformed_identifier');
      return {
        activityType,
        activityId,
        href: routes.lesson(activityId),
        available: true,
        lessonId: activityId,
        unavailableReason: null,
      };
    }
    case 'practice_pack': {
      const lessonId = lessonIdFromPackId(activityId);
      if (lessonId === null) return unavailable('malformed_identifier');
      return {
        activityType,
        activityId,
        href: routes.lessonPractice(lessonId, activityId),
        available: true,
        lessonId,
        unavailableReason: null,
      };
    }
    case 'listening': {
      // The dialogue id is validated even though the screen does not exist yet, so the
      // reason reported to the learner stays accurate once it does.
      if (!isDialogueId(activityId)) return unavailable('malformed_identifier');
      return unavailable('not_implemented');
    }
    case 'review':
      return unavailable('not_implemented');
  }
}
