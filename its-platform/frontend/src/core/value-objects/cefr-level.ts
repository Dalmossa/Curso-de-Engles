/**
 * CEFR band — `^(A1|A2|B1|B2|C1|C2)$` in the contract.
 *
 * A2 is the important case: `LearnerProfile.cefr_level` is
 * `type: [string, 'null']` and `null` means "no diagnostic has been completed yet"
 * (ADR-045 D3) — not an error and not a band. That is why `parseCefrLevel` returns
 * `CefrLevel | null` rather than throwing, and why every consumer is forced by the
 * type to render the unassessed case instead of defaulting to A1.
 */
export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type CefrLevel = (typeof CEFR_LEVELS)[number];

export function isCefrLevel(value: unknown): value is CefrLevel {
  return typeof value === 'string' && (CEFR_LEVELS as readonly string[]).includes(value);
}

/** `null` for "not yet assessed" *and* for a value that is not a CEFR level at all. */
export function parseCefrLevel(value: unknown): CefrLevel | null {
  return isCefrLevel(value) ? value : null;
}

/** 1-based position in the ladder; A1 → 1. */
export function cefrOrdinal(level: CefrLevel): number {
  return CEFR_LEVELS.indexOf(level) + 1;
}

/** Sorts ascending by band. Useful for a curriculum ordered by level. */
export function compareCefrLevels(left: CefrLevel, right: CefrLevel): number {
  return cefrOrdinal(left) - cefrOrdinal(right);
}
