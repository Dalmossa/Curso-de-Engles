/**
 * The six skill ids the platform tracks.
 *
 * `LearnerProfile.mastery` is an open map — "keyed by the learner's own skill ids" —
 * so an unknown key is a *possible* value, not a contract violation, and
 * `parseSkill` returning `null` must not be treated as corrupt data. The UI labels
 * the six it knows and humanises the rest.
 */
export const SKILLS = ['grammar', 'vocab', 'reading', 'pronunciation', 'listening', 'coherence'] as const;

export type Skill = (typeof SKILLS)[number];

export function isSkill(value: unknown): value is Skill {
  return typeof value === 'string' && (SKILLS as readonly string[]).includes(value);
}

export function parseSkill(value: unknown): Skill | null {
  return isSkill(value) ? value : null;
}

/** Position in the canonical display order, so a skill list is never re-shuffled per render. */
export function skillOrder(skill: string): number {
  const index = (SKILLS as readonly string[]).indexOf(skill);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
