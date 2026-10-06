/**
 * Domain entities — statistical parameter store (used by BKT, IRT, FSRS).
 * Pure TypeScript, no framework imports (ADR-014).
 */

export class FsrsParameter {
  constructor(
    public readonly wVersion: string,
    public readonly w: unknown,
    public readonly decay: number,
    public readonly factor: number,
    public readonly nReviews: number,
    public readonly fittedAt: Date | null,
    public readonly isActive: boolean,
  ) {}
}

export class BktSkillParam {
  constructor(
    public readonly skillId: string,
    public readonly pL0: number,
    public readonly pT: number,
    public readonly pS: number,
    public readonly source: string,
    public readonly fittedAt: Date | null,
    public readonly modelVersion: string | null,
  ) {}
}