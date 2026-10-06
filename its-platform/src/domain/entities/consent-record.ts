/**
 * Domain entity — ConsentRecord (context 8; LGPD §9–§11, ADR-003).
 * Pure TypeScript, no framework imports (ADR-014).
 */

export type ConsentPurpose =
  | 'learning_analytics'
  | 'research_aggregate'
  | 'personalization'
  | 'marketing_communication';

export class ConsentRecord {
  constructor(
    public readonly id: string,
    public readonly learnerId: string,
    public readonly purpose: ConsentPurpose,
    public readonly version: string,
    public readonly grantedAt: Date | null,
    public readonly withdrawnAt: Date | null,
    public readonly legalBasis: string,
    public readonly createdAt: Date,
  ) {}

  /** LGPD §8.5: withrawal must be non-destructive — the record survives, timestamps carry the truth. */
  get isActive(): boolean {
    return this.grantedAt !== null && this.withdrawnAt === null;
  }
}