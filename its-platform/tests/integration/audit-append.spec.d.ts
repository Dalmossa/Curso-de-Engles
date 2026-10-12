/**
 * P2.2 — `append_only_events` append path and chain verification against **real PostgreSQL 16**
 * (ADR-014: the hash chain's trigger, its advisory lock and the role grants are only really
 * exercised on a real server).
 *
 * Skipped unless `TEST_DATABASE_URL` or `DATABASE_URL` is set, the way `rls-isolation.spec.ts`
 * is — a PGlite run would assert the same trigger logic but not the role model the UPDATE refusal
 * depends on.
 *
 * What this spec proves that no unit test can:
 *
 *   1. `AuditService.append` writes through the trigger; three appends produce a **contiguous**
 *      chain the repository's reader reconciles (`AuditChainVerifier` → `{ok: true, length: 3}`).
 *      This is also the proof that the TS serialization in `audit-chain-verifier.ts` is the
 *      migration's, byte for byte: the hashes were computed by `fn_append_only_hash_chain()` and
 *      the verifier recomputes them.
 *   2. Consecutive appends link: row N+1's `prev_hash` equals row N's `row_hash` as raw `bytea`,
 *      not merely as equal-looking hex.
 *   3. `UPDATE append_only_events` is refused for `its_platform_app` — the `REVOKE` is the
 *      primary control (X-3), and the `BEFORE UPDATE` guard is the backstop for a role that
 *      somehow did hold the grant (asserted separately as the owner).
 *   4. The read context matters: a `learner_id IS NULL` system row is invisible to
 *      `its_platform_app` under a learner GUC but visible to `its_platform_worker` — the reason
 *      `readChain()` must run as a bypass/worker context.
 */
export {};
//# sourceMappingURL=audit-append.spec.d.ts.map