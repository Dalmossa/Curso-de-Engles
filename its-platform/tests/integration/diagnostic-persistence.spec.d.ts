/**
 * P1.10 — Placement result persistence (integration).
 *
 * The unit under test is `DiagnosticResultRepository.persist`, fed a **real** `DiagnosticRun`
 * from `administerDiagnostic` (P1.9) over all 12 items of `diagnostic_form_v1` in form order.
 * Nothing here fabricates a run shape: the assertions read back what the executor produced and
 * check that the two DDL tables (ADR-019 migration 1791331200000) hold it.
 *
 * The `diagnostic_responses` FKs (`item_id → items`, `skill_id → skills`) and
 * `diagnostic_results` FKs (`start_node → lessons`, `cefr`/`start_cefr → cefr_levels`) are real,
 * so the test seeds a minimal catalogue derived from the run itself rather than hard-coding ids.
 * That is also the honest demonstration of ADR-024 Decision 9: the response rows are only
 * storable once the referenced `items`/`skills` exist.
 *
 * **The answers this file used to exclude are now cases.** ADR-025 replaced
 * `computeThetaEstimate`: the old estimator's Fisher-information term collapsed as θ grew, so an
 * all-correct run produced an intermediate `se_after` of ~2.2e6 and PostgreSQL rejected the row
 * against `NUMERIC(6,3)` — 2509 of the form's 4096 response patterns could not be persisted at
 * all. Under ADR-025 every pattern yields `|θ̂| ≤ 6` and `0 < se < 6`, so the all-correct and
 * all-wrong runs are asserted at the end of this file rather than described here. The two
 * ordinary profiles below remain (they keep exercising the mapping) and nothing about them is
 * now special.
 *
 * **Which role the tests run as.** The `describe` below connects as the **table owner** — `postgres`
 * on the PGlite harness — and PostgreSQL does not apply a table's policies to its owner unless
 * `FORCE ROW LEVEL SECURITY` is set, which neither diagnostic table sets. So none of the 12 tests
 * below is an RLS test, and a `persist()` that never sets `app.current_learner_id` passes every one
 * of them. ADR-026 measured exactly that and closed it: the second `describe` at the end of this
 * file takes `SET ROLE its_platform_app` and exercises ADR-003's policy through
 * `PgSessionContext`, the single writer of the GUC. It is the half these tests cannot see.
 */
export {};
//# sourceMappingURL=diagnostic-persistence.spec.d.ts.map