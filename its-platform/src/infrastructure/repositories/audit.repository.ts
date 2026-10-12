/**
 * P2.2 — the insert-only write path for `append_only_events` (CONSTITUTION §4.6).
 *
 * The WORM table and its tamper-evident hash chain already exist in the database: the
 * ADR-019 migration (`src/migrations/1791331200000-create-schema.ts` §8) owns `seq`, `row_hash`,
 * `prev_hash`, the `its_event_type` enum, the `BEFORE INSERT` trigger
 * `trg_append_only_hash_chain` / `fn_append_only_hash_chain()` that computes the chain, and the
 * `BEFORE UPDATE OR DELETE` guard `trg_append_only_guard`. This file is the application side of
 * that contract and adds no policy of its own:
 *
 * 1. **There is no UPDATE and no DELETE here — by construction.** The only statements this class
 *    can issue against the table are `INSERT` and `SELECT`. Immutability is a database grant
 *    (`REVOKE UPDATE, DELETE … FROM its_platform_app, its_platform_worker`), so the application
 *    is never the only line of defence; but a repository method named `update()` would be a
 *    second, weaker line that pretends to be one, so there is none.
 * 2. **`seq` is a string, and it stays a string.** `seq` is `BIGINT`; the `pg` driver hands
 *    `int8` back as a **string** because a JavaScript `number` is a 53-bit float and a 64-bit id
 *    would silently lose precision above `Number.MAX_SAFE_INTEGER`. The type below says `string`
 *    on purpose, exactly as `content.repository.ts` does for `NUMERIC`. Do not `Number()` it.
 * 3. **The chain is computed by the trigger, not here.** `append()` supplies no `prev_hash` and
 *    no `row_hash`; the function does, under `pg_advisory_xact_lock`, so two concurrent appends
 *    serialise and the second links to the first. This file must never try to compute a hash —
 *    that would be a second serialization that can drift from the migration's.
 *
 * `readChain()` is the verifier's reader. It casts every component to the **same text form the
 * trigger hashes** (`event_id::text`, `learner_id::text`, `occurred_at::text`, `payload::text`,
 * `array_to_string(skill_ids, ',')`, `encode(…, 'hex')`), so `AuditChainVerifier` can recompute
 * the bytes character for character without re-implementing PostgreSQL's `timestamptz`/`jsonb`
 * output formats. Two consequences are load-bearing:
 *
 *   * `occurred_at::text` is rendered in the **session's** `TimeZone`/`DateStyle`. The trigger
 *     hashed it with the writer's settings, so the verifier must read under the same ones — UTC
 *     in this platform (CONSTITUTION §4.6 is UTC-only) and stable across both.
 *   * A read must run as a role whose policy admits every row. `learner_isolation` compares
 *     `learner_id` to the session GUC, so the system/audit rows whose `learner_id IS NULL` (the
 *     auth/consent/erasure events, whose call sites live in P1.15–P1.17 and M6) are invisible to
 *     `its_platform_app`. The table owner and `its_platform_admin`/`its_platform_worker` see
 *     them; that is the context the verifier is meant to run in.
 */

import { Injectable } from '@nestjs/common';
import { DataSource, type QueryRunner } from 'typeorm';
import type { AuditChainRow } from '../../domain/services/audit-chain-verifier.js';

/**
 * The `its_event_type` enum, restated in TypeScript. It is **closed** (CONSTITUTION §4.6,
 * domain-model X-3): adding a value is a schema change, not an application change. The tuple
 * order matches the migration's `CREATE TYPE its_event_type AS ENUM (…)` for easy diffing.
 */
export const AUDIT_EVENT_TYPES = [
  'item_response',
  'diagnostic_run',
  'session_start',
  'session_end',
  'auth_success',
  'auth_failure',
  'access_denied',
  'validation_failure',
  'consent_granted',
  'consent_withdrawn',
  'data_export',
  'data_erasure',
] as const;

export type AuditEventType = (typeof AUDIT_EVENT_TYPES)[number];

/**
 * One event to append. Absent optional fields are written as SQL `NULL` — and that matters:
 * `learner_id IS NULL` is what marks a system/audit row, which the learner policy deliberately
 * hides (see the file header). `payload` is `JSONB` and must be an object; the shape differs per
 * `event_type` (stats §9.1's fields live here rather than in dedicated columns).
 *
 * `occurredAt` is optional. When omitted, the column default `now()` applies, so the trigger
 * hashes the transaction timestamp; supplying it lets an already-timestamped event (e.g. one
 * replayed from a queue) keep its own time.
 */
export interface AuditEventInput {
  readonly eventType: AuditEventType;
  readonly learnerId?: string | null;
  readonly sessionId?: string | null;
  readonly lessonId?: string | null;
  readonly itemId?: string | null;
  readonly skillIds?: readonly string[] | null;
  readonly occurredAt?: Date;
  readonly payload: Record<string, unknown>;
}

/** What the `INSERT … RETURNING` gives back. `seq` is a string (see the header). */
export interface AuditAppendResult {
  readonly seq: string;
  readonly event_id: string;
  readonly row_hash: string;
}

@Injectable()
export class AuditRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Append one event and return its identity and chain hash.
   *
   * `tx` lets a caller that already owns a transaction — `PgSessionContext.withLearner`, which is
   * what establishes the learner session context (ADR-026 §1) for a learner-scoped event — join
   * it; when omitted the
   * repository opens (and closes) its own. Ownership is carried in `ownsTransaction` rather than
   * inferred per call site, so a caller-supplied runner is never committed or released here.
   *
   * No `prev_hash`/`row_hash` is passed: the trigger computes both.
   */
  async append(event: AuditEventInput, tx?: QueryRunner): Promise<AuditAppendResult> {
    const ownsTransaction = tx === undefined;
    const qr: QueryRunner = tx ?? this.dataSource.createQueryRunner();

    if (ownsTransaction) {
      await qr.connect();
      await qr.startTransaction();
    }

    try {
      const rows = (await qr.query(
        `INSERT INTO append_only_events (
           learner_id, session_id, lesson_id, item_id, skill_ids, event_type, occurred_at, payload
         ) VALUES ($1, $2, $3, $4, $5, $6, coalesce($7::timestamptz, now()), $8::jsonb)
         RETURNING seq::text AS seq, event_id::text AS event_id, encode(row_hash, 'hex') AS row_hash`,
        [
          event.learnerId ?? null,
          event.sessionId ?? null,
          event.lessonId ?? null,
          event.itemId ?? null,
          event.skillIds ?? null,
          event.eventType,
          event.occurredAt ?? null,
          JSON.stringify(event.payload),
        ],
      )) as AuditAppendResult[];

      const result = rows[0];
      if (!result) {
        // A successful INSERT with RETURNING always produces a row; this only rejects a driver
        // that silently returned nothing rather than reporting a `row_hash` we never verified.
        throw new Error('append_only_events INSERT returned no row');
      }

      if (ownsTransaction) {
        await qr.commitTransaction();
      }

      return result;
    } catch (error) {
      if (ownsTransaction) {
        await qr.rollbackTransaction();
      }
      throw error;
    } finally {
      if (ownsTransaction) {
        await qr.release();
      }
    }
  }

  /**
   * Every event in `seq` order, with each hashed component already in the text form the trigger
   * used. This is the only read path; `AuditChainVerifier` turns the rows into a verdict.
   *
   * Read context is the caller's: as the table owner (tests), `its_platform_admin` or
   * `its_platform_worker`, every row is visible; as `its_platform_app` it is not (see the header).
   */
  async readChain(): Promise<AuditChainRow[]> {
    const rows = (await this.dataSource.query(
      `SELECT
         seq::text                          AS seq,
         encode(prev_hash, 'hex')           AS prev_hash,
         encode(row_hash, 'hex')            AS row_hash,
         event_id::text                     AS event_id,
         learner_id::text                   AS learner_id,
         session_id::text                   AS session_id,
         lesson_id                          AS lesson_id,
         item_id                            AS item_id,
         array_to_string(skill_ids, ',')    AS skill_ids_text,
         event_type::text                   AS event_type,
         occurred_at::text                  AS occurred_at,
         payload::text                      AS payload_text
       FROM append_only_events
       ORDER BY seq`,
    )) as Array<{
      seq: string;
      prev_hash: string | null;
      row_hash: string;
      event_id: string;
      learner_id: string | null;
      session_id: string | null;
      lesson_id: string | null;
      item_id: string | null;
      skill_ids_text: string | null;
      event_type: string;
      occurred_at: string;
      payload_text: string;
    }>;

    return rows.map(row => ({
      seq: row.seq,
      prevHash: row.prev_hash,
      rowHash: row.row_hash,
      eventId: row.event_id,
      learnerId: row.learner_id,
      sessionId: row.session_id,
      lessonId: row.lesson_id,
      itemId: row.item_id,
      skillIds:
        row.skill_ids_text === null || row.skill_ids_text === ''
          ? null
          : row.skill_ids_text.split(','),
      eventType: row.event_type,
      occurredAt: row.occurred_at,
      payloadText: row.payload_text,
    }));
  }
}
