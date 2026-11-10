import { clampMastery, isMasteryPassing, masteryBand, type MasteryBand } from '../value-objects/mastery';
import { isSkill, skillOrder } from '../value-objects/skill';

export interface MasteryEntry {
  readonly skill: string;
  readonly mastery: number;
  readonly band: MasteryBand;
  readonly gatePassed: boolean;
  /** `false` for a skill id the platform has no label for — still shown, never dropped. */
  readonly isKnownSkill: boolean;
}

export interface MasteryOverview {
  readonly entries: readonly MasteryEntry[];
  /** Skill ids below the gate, weakest first. */
  readonly gaps: readonly string[];
  readonly passedCount: number;
  readonly averageMastery: number;
  /** Every tracked skill is at or above the gate, and there is at least one. */
  readonly allPassed: boolean;
}

/**
 * Deterministic display order: the six canonical skills in their canonical order,
 * then anything else alphabetically. A learner's mastery map is an open map, so an
 * unrecognised key must still be shown — silently hiding it would hide the one skill
 * that is actually broken.
 */
function compareEntries(left: MasteryEntry, right: MasteryEntry): number {
  const leftOrder = skillOrder(left.skill);
  const rightOrder = skillOrder(right.skill);
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  if (leftOrder === Number.MAX_SAFE_INTEGER) return left.skill.localeCompare(right.skill);
  return 0;
}

/**
 * `null`/absent is not `0`: a skill the learner has never practised is unknown, and
 * fabricating a zero would put an "emerging" bar on screen for a skill nobody has
 * measured. Callers pass only the keys the server actually sent.
 */
export function summarizeMastery(mastery: Readonly<Record<string, number>>): MasteryOverview {
  const entries: MasteryEntry[] = Object.entries(mastery)
    .map(([skill, raw]) => {
      const value = clampMastery(raw);
      return {
        skill,
        mastery: value,
        band: masteryBand(value),
        gatePassed: isMasteryPassing(value),
        isKnownSkill: isSkill(skill),
      };
    })
    .sort(compareEntries);

  const gaps = entries
    .filter((entry) => !entry.gatePassed)
    .slice()
    .sort((left, right) => left.mastery - right.mastery || left.skill.localeCompare(right.skill))
    .map((entry) => entry.skill);

  const total = entries.reduce((sum, entry) => sum + entry.mastery, 0);

  return {
    entries,
    gaps,
    passedCount: entries.filter((entry) => entry.gatePassed).length,
    averageMastery: entries.length === 0 ? 0 : total / entries.length,
    allPassed: entries.length > 0 && entries.every((entry) => entry.gatePassed),
  };
}

/**
 * The UI's own reading of a `mastery_gaps` list. The server's
 * `NextActivity.rationale.mastery_gaps` is authoritative for the *reason* an activity
 * was chosen; this is only used to cross-check it (e.g. to notice a gap list that
 * names a skill the profile does not carry, which is a contract drift signal).
 */
export function unknownGaps(gaps: readonly string[], mastery: Readonly<Record<string, number>>): readonly string[] {
  return gaps.filter((gap) => !(gap in mastery));
}
