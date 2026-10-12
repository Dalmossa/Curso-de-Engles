/**
 * ADR-023 — diagnostic routing semantics: the property tests (that ADR's "the acceptance").
 *
 * Everything here runs against the **real** `SE_eff` (0.567) that `pilot-bank.service.ts` §1
 * declares, so the windows the tests exercise are the windows production sees.
 *
 * The registry proof (test 6) loads the real `specs/curriculum-graph-spec.md` through the
 * existing infrastructure parser/validator rather than a fixture copy: `start_node` must be a
 * *lesson ID of the registry*, and a fixture would only prove the fixture.
 */
export {};
//# sourceMappingURL=diagnostic-placement.service.spec.d.ts.map