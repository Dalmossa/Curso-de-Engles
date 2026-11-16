import type { CefrLevel } from '../value-objects/cefr-level';

/** `LessonContent.reuse_basis` — the licence classification each lesson declares. `cite_only` = author original material and cite as bibliography, reproduce nothing. `adapt_with_attribution` = adapt a permissively-licensed source with attribution. `adapt_requires_permission` = adapt a restricted source only with written, perpetual redistribution permission. `authored_material` = material 100% original do autor, sem reprodução ou adaptação de fonte restrita. */
export type ReuseBasis = 'cite_only' | 'adapt_with_attribution' | 'adapt_requires_permission' | 'authored_material';

export type AuthoringState = 'authored' | 'specified' | 'unauthored' | 'blocked' | 'withdrawn';

export type PublicationState = 'publishable' | 'restricted_pending_permission' | 'not_publishable';

/** One of the lesson's four authored phases (ADR-027 §4). */
export interface LessonPhase {
  readonly phase: number;
  /** The authored heading line, verbatim minus its `#`s. */
  readonly heading: string;
  /** The phase body, verbatim markdown. */
  readonly markdown: string;
}

export interface LessonContent {
  readonly lessonId: string;
  readonly title: string;
  readonly cefrLevel: CefrLevel;
  readonly reuseBasis: ReuseBasis;
  readonly authoringState: AuthoringState;
  readonly publicationState: PublicationState;
  /** Exactly four, ordered 1..4 — see `normalizeLessonPhases`. */
  readonly phases: readonly LessonPhase[];
  /** The `DADOS PARA O LEARNER MODEL` block, or `null` for the 1 lesson of 122 without one. */
  readonly learnerModel: Readonly<Record<string, unknown>> | null;
}

/**
 * A lesson whose `publication_state` is not `publishable` is still *served* —
 * P1.18 consumes the field precisely so a pre-publish licence check can act on it —
 * but the UI must say so rather than present restricted content as finished.
 */
export function isPublishable(lesson: Pick<LessonContent, 'publicationState'>): boolean {
  return lesson.publicationState === 'publishable';
}
