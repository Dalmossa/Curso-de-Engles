/**
 * Domain entity — AppendOnlyEvent (context 8; CONSTITUTION §4.6 WORM ledger).
 * Pure TypeScript, no framework imports (ADR-014).
 *
 * Hash-chain semantics live in the domain layer: prev_hash of row N must equal
 * row_hash of row N-1 within the same chain (verified on write and by audit).
 * SQL-side enforcement lands in P0.4 (trigger), domain-side verification in P1.
 */

export class AppendOnlyEvent {
  constructor(
    public readonly seq: string,
    public readonly eventId: string,
    public readonly learnerId: string | null,
    public readonly sessionId: string | null,
    public readonly lessonId: string | null,
    public readonly itemId: string | null,
    public readonly skillIds: string[] | null,
    public readonly eventType: string,
    public readonly occurredAt: Date,
    public readonly payload: unknown,
    public readonly prevHash: Buffer | null,
    public readonly rowHash: Buffer,
  ) {}
}