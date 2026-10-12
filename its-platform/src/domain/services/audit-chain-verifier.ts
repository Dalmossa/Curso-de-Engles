/**
 * P2.2 — `AuditChainVerifier`: recompute the `append_only_events` hash chain and report the first
 * row that does not belong to it (CONSTITUTION §4.6, domain-model X-3).
 *
 * This file is **pure** (ADR-014: no TypeORM, no NestJS). It owns the serialization the
 * migration's `fn_append_only_hash_chain()` uses, and the reader is a port it receives rather
 * than a database it opens.
 *
 * ## The serialization is the migration's, character for character
 *
 * The `BEFORE INSERT` trigger in `src/migrations/1791331200000-create-schema.ts` builds
 * `NEW.row_hash` as
 *
 * ```sql
 * sha256(convert_to(
 *   coalesce(encode(NEW.prev_hash, 'hex'), '') || '|' ||
 *   NEW.event_id::text || '|' || coalesce(NEW.learner_id::text, '') || '|' ||
 *   coalesce(NEW.session_id::text, '') || '|' || coalesce(NEW.lesson_id, '') || '|' ||
 *   coalesce(NEW.item_id, '') || '|' || coalesce(array_to_string(NEW.skill_ids, ','), '') || '|' ||
 *   NEW.event_type::text || '|' || NEW.occurred_at::text || '|' || NEW.payload::text,
 *   'UTF8'))
 * ```
 *
 * `serializeAuditRow` below is the same ten fields joined by `|`, and `hashAuditRow` is
 * `sha256(utf8(serializeAuditRow(row)))`. The reader is required to hand back each component
 * **already in its `::text` form** (`occurred_at::text`, `payload::text`, …) — the repository
 * does exactly that — so this verifier never re-implements PostgreSQL's `timestamptz` or `jsonb`
 * output formatting. If it did, a formatting difference would be reported as a tamper, which is
 * the worst possible false positive for an integrity check. The integration test proves the two
 * serializations agree by verifying a real chain the trigger wrote.
 *
 * ## What each check is for
 *
 * 1. **`prev_hash` link.** Row N's `prev_hash` must equal row N-1's `row_hash`; row 1's must be
 *    `NULL`. This is the chain itself.
 * 2. **`row_hash` recompute.** The stored `row_hash` must equal the hash of the row's own fields
 *    **and its `prev_hash`**. This is what detects a payload/`event_type`/`skill_ids`/… edit made
 *    with `UPDATE` if the database's own immutability were ever bypassed (superuser, replica
 *    promotion): the bytes no longer hash to the recorded value.
 * 3. **`seq` contiguity.** `seq` is `BIGINT GENERATED ALWAYS AS IDENTITY`, so the chain order is
 *    the insertion order and a `WHERE`-less read returns it. A **deleted middle row is invisible
 *    to checks 1–2 alone**: the successor still hashes to its own stored value, and its
 *    `prev_hash` points at a row that is simply not in the result set. Requiring
 *    `seq[N] == seq[N-1] + 1` is what makes "the sequence is contiguous" — and therefore "no row
 *    was removed" — part of the verdict. The check is deliberately **not** claimed to detect
 *    truncation of the tail: deleting the last rows leaves a shorter, still-contiguous chain, and
 *    no recompute of surviving rows can see what was never read. That is a retention/replication
 *    property (WORM storage), not a property of this function; the migration's
 *    `pg_advisory_xact_lock` and the revoked `DELETE` grant are the controls for it.
 *
 * A gap is reported as `{ok: false, brokenAtSeq, reason}`, so the operator learns *which* seq is
 * wrong, not merely that something is.
 */

import { createHash } from 'node:crypto';

/**
 * One `append_only_events` row, each field in the text form the trigger hashed. `seq` is a
 * **string** (BIGINT): it is compared as a `bigint`, never as a float (see `audit.repository.ts`).
 */
export interface AuditChainRow {
  /** `seq::text`. */
  readonly seq: string;
  /** `encode(prev_hash, 'hex')`, or `null` on the first row. */
  readonly prevHash: string | null;
  /** `encode(row_hash, 'hex')`. */
  readonly rowHash: string;
  /** `event_id::text`. */
  readonly eventId: string;
  /** `learner_id::text`, or `null`. */
  readonly learnerId: string | null;
  /** `session_id::text`, or `null`. */
  readonly sessionId: string | null;
  readonly lessonId: string | null;
  readonly itemId: string | null;
  /** `skill_ids`, split on `,`; `null` for a `NULL` array (an empty array is also `null` here). */
  readonly skillIds: readonly string[] | null;
  /** `event_type::text`. */
  readonly eventType: string;
  /** `occurred_at::text` — the session-timezone rendering the trigger hashed. */
  readonly occurredAt: string;
  /** `payload::text` — `jsonb`'s canonical output, which is deterministic. */
  readonly payloadText: string;
}

export type AuditChainResult =
  | { readonly ok: true; readonly length: number }
  | { readonly ok: false; readonly brokenAtSeq: string; readonly reason: string };

/** The rows to verify, in chain order. The repository implements this; tests supply a stub. */
export interface AuditChainReader {
  readChain(): Promise<AuditChainRow[]>;
}

/** The ten fields the trigger concatenates with `|`, in order. */
export function serializeAuditRow(row: AuditChainRow): string {
  return [
    row.prevHash ?? '',
    row.eventId,
    row.learnerId ?? '',
    row.sessionId ?? '',
    row.lessonId ?? '',
    row.itemId ?? '',
    row.skillIds === null ? '' : row.skillIds.join(','),
    row.eventType,
    row.occurredAt,
    row.payloadText,
  ].join('|');
}

/** `sha256(convert_to(<serializeAuditRow>, 'UTF8'))`, hex — comparable to `encode(row_hash,'hex')`. */
export function hashAuditRow(row: AuditChainRow): string {
  return createHash('sha256').update(serializeAuditRow(row), 'utf8').digest('hex');
}

/**
 * Verify a chain handed over in `seq` order. Pure: no I/O, no database, no framework.
 *
 * An empty chain is `{ok: true, length: 0}` — nothing recorded is nothing corrupted; the caller
 * decides whether an empty audit log is itself acceptable.
 */
export function verifyAuditChain(rows: readonly AuditChainRow[]): AuditChainResult {
  let previous: AuditChainRow | undefined;

  for (const row of rows) {
    if (previous === undefined) {
      if (row.prevHash !== null) {
        return {
          ok: false,
          brokenAtSeq: row.seq,
          reason: `first row prev_hash must be NULL, got ${row.prevHash}`,
        };
      }
    } else {
      if (row.prevHash !== previous.rowHash) {
        return {
          ok: false,
          brokenAtSeq: row.seq,
          reason:
            `prev_hash does not link: expected row ${previous.seq}'s row_hash ` +
            `(${previous.rowHash}), got ${row.prevHash ?? 'NULL'}`,
        };
      }

      // `seq` is identity-ordered; a jump means a row was removed from between these two, and
      // hashes alone cannot show that (see the header). Compare as bigint, never as Number.
      const expectedSeq = BigInt(previous.seq) + 1n;
      if (BigInt(row.seq) !== expectedSeq) {
        return {
          ok: false,
          brokenAtSeq: row.seq,
          reason: `seq gap: expected ${expectedSeq.toString()}, got ${row.seq}`,
        };
      }
    }

    const recomputed = hashAuditRow(row);
    if (recomputed !== row.rowHash) {
      return {
        ok: false,
        brokenAtSeq: row.seq,
        reason: `row_hash mismatch: stored ${row.rowHash}, recomputed ${recomputed}`,
      };
    }

    previous = row;
  }

  return { ok: true, length: rows.length };
}

/**
 * Reads the chain and verifies it. The reader decides the read context — for a learner-scoped
 * table that means its implementation must run as the owner, `its_platform_admin` or
 * `its_platform_worker`, because `learner_isolation` hides the `learner_id IS NULL` audit rows
 * from `its_platform_app` (see `audit.repository.ts`).
 */
export class AuditChainVerifier {
  constructor(private readonly reader: AuditChainReader) {}

  async verify(): Promise<AuditChainResult> {
    return verifyAuditChain(await this.reader.readChain());
  }
}
