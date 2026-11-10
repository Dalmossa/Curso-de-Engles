/**
 * The core layer's public surface.
 *
 * The `application` and `infrastructure` layers import from here rather than reaching
 * into individual modules, which keeps the boundary visible: a new export is a
 * deliberate act, and it is obvious in review when something framework-shaped tries to
 * sneak into the layer that is supposed to be pure.
 */
export * from './entities/activity';
export * from './entities/learner';
export * from './entities/lesson';
export * from './entities/listening';
export * from './entities/placement';
export * from './entities/practice';

export * from './errors/domain-error';
export * from './errors/problem-details';

export type { AccessTokenProvider, LearnerIdentity } from './ports/identity';
export type { ContentRepository } from './ports/content-repository';
export type { CurriculumRepository } from './ports/curriculum-repository';
export type { LearnerRepository } from './ports/learner-repository';
export type { PlacementRepository } from './ports/placement-repository';
export type { PracticeRepository } from './ports/practice-repository';

export * from './services/activity-destination';
export * from './services/lesson-phases';
export * from './services/mastery-gate';
export * from './services/practice-session';

export * from './value-objects/cefr-level';
export * from './value-objects/identifiers';
export * from './value-objects/mastery';
export * from './value-objects/skill';
