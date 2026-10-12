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
export {};
//# sourceMappingURL=audit-chain-verifier.spec.d.ts.map