"use strict";
/**
 * P2.2 — pure tests for `verifyAuditChain`.
 *
 * No database: the rows are synthetic, and each row's `row_hash` is produced by the same
 * `hashAuditRow` the verifier recomputes with. What these tests isolate is the *verdict* logic —
 * a good chain is accepted, and each of the three tamper shapes a `BIGINT IDENTITY` chain can
 * exhibit is rejected with the right `brokenAtSeq`:
 *
 *   * a modified `row_hash`,
 *   * a modified `prev_hash`,
 *   * a `seq` gap (a deleted row).
 *
 * The serialization's agreement with the migration's trigger is deliberately **not** asserted
 * here — that needs a real hash written by the trigger and is the integration spec's job.
 */
import { AuditChainVerifier, hashAuditRow, verifyAuditChain, } from '../../../src/domain/services/audit-chain-verifier.js';
function fields(overrides = {}) {
    return {
        eventId: '11111111-1111-4111-8111-111111111111',
        learnerId: 'aaaaaaaa-aaaa-4111-8111-111111111111',
        sessionId: null,
        lessonId: null,
        itemId: null,
        skillIds: null,
        eventType: 'session_start',
        occurredAt: '2026-10-12 12:00:00+00',
        payloadText: '{"n": 1}',
        ...overrides,
    };
}
/** A row whose stored `row_hash` is the hash of its own fields — i.e. a link the trigger could have written. */
function linked(seq, prevHash, overrides = {}) {
    const base = {
        seq,
        prevHash,
        rowHash: '',
        ...fields(overrides),
    };
    return { ...base, rowHash: hashAuditRow(base) };
}
function chainOfThree() {
    const first = linked('1', null, { payloadText: '{"n": 1}' });
    const second = linked('2', first.rowHash, { payloadText: '{"n": 2}' });
    const third = linked('3', second.rowHash, { payloadText: '{"n": 3}' });
    return [first, second, third];
}
const ZERO_HASH = '0'.repeat(64);
describe('verifyAuditChain (P2.2, pure)', () => {
    it('accepts an empty chain — nothing recorded is nothing corrupted', () => {
        expect(verifyAuditChain([])).toEqual({ ok: true, length: 0 });
    });
    it('accepts a well-formed chain and reports its length', () => {
        const result = verifyAuditChain(chainOfThree());
        expect(result).toEqual({ ok: true, length: 3 });
    });
    it('rejects a modified row_hash at the row that was changed', () => {
        const chain = chainOfThree();
        chain[1] = { ...chain[1], rowHash: ZERO_HASH };
        const result = verifyAuditChain(chain);
        expect(result.ok).toBe(false);
        if (result.ok)
            return;
        expect(result.brokenAtSeq).toBe('2');
        expect(result.reason).toContain('row_hash mismatch');
    });
    it('rejects a modified prev_hash (the link no longer points at the previous row_hash)', () => {
        const chain = chainOfThree();
        chain[2] = { ...chain[2], prevHash: ZERO_HASH };
        const result = verifyAuditChain(chain);
        expect(result.ok).toBe(false);
        if (result.ok)
            return;
        expect(result.brokenAtSeq).toBe('3');
        expect(result.reason).toContain('prev_hash does not link');
    });
    it('rejects a non-NULL prev_hash on the first row', () => {
        const chain = chainOfThree();
        chain[0] = { ...chain[0], prevHash: ZERO_HASH };
        const result = verifyAuditChain(chain);
        expect(result.ok).toBe(false);
        if (result.ok)
            return;
        expect(result.brokenAtSeq).toBe('1');
        expect(result.reason).toContain('first row prev_hash must be NULL');
    });
    it('rejects a seq gap even when the surviving links and hashes are internally consistent', () => {
        // Rows 1, 2, 4: row 4 links to row 2 as if row 3 had never existed. Every hash is valid and
        // both links resolve — only the missing `3` reveals that a row was removed.
        const first = linked('1', null, { payloadText: '{"n": 1}' });
        const second = linked('2', first.rowHash, { payloadText: '{"n": 2}' });
        const fourth = linked('4', second.rowHash, { payloadText: '{"n": 4}' });
        const result = verifyAuditChain([first, second, fourth]);
        expect(result.ok).toBe(false);
        if (result.ok)
            return;
        expect(result.brokenAtSeq).toBe('4');
        expect(result.reason).toContain('seq gap');
        expect(result.reason).toContain('expected 3');
    });
    it('compares seq as bigint, not as a float (a 64-bit seq is not rounded)', () => {
        // 9007199254740993 is 2^53 + 1: not representable as a JS number. If the verifier coerced it
        // through Number, the +1 would be lost and this valid pair would be reported as a gap.
        const first = linked('9007199254740992', null);
        const second = linked('9007199254740993', first.rowHash);
        expect(verifyAuditChain([first, second])).toEqual({ ok: true, length: 2 });
    });
    it('AuditChainVerifier reads through its reader and delegates the verdict', async () => {
        const rows = chainOfThree();
        const reader = { readChain: async () => rows };
        await expect(new AuditChainVerifier(reader).verify()).resolves.toEqual({ ok: true, length: 3 });
    });
});
//# sourceMappingURL=audit-chain-verifier.spec.js.map