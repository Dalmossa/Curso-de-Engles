/**
 * P1.12 — the `/content/*` API over the *real* persisted catalogue (ADR-027).
 *
 * Every other content test in this repo either drives the loader (`content-loader.spec.ts`,
 * `loader.integration.spec.ts`) or feeds it fixtures. This one closes the last gap: it runs the
 * real `loadContent` over the content repo into PGlite, then calls `ContentService` — through
 * `ContentRepository`, exactly as Nest wires it — and checks what a caller would receive.
 *
 * It exists because the service used to answer from a mock, and no test could have noticed: the
 * three payloads are assembled from eight tables, and the assembly is where the defects were
 * (ADR-027). Two of them are asserted directly here:
 *
 *   * **§3a — the 11 unscorable slots.** `content-check.mjs` reports that the corpus marks an
 *     item's key with `✓` in one of two table columns; the loader read only one, so 11 shipped
 *     slots loaded with `items.key IS NULL`. The regression test below calls `getDialogue` for
 *     their four dialogues and requires each of the 11 to arrive with a non-null key.
 *   * **§3 — the same 404 for "not shipped" and "unknown".** The serving rule lives in the
 *     service (the repository is a pure read), so both cases are asserted at this level: an
 *     unknown id and a `shadow_only` row both return `null`.
 *
 * Nothing is mocked. The only fabricated rows are the two the corpus cannot supply — a
 * `shadow_only` dialogue and a dialogue at the 45 s floor — and they are inserted directly into
 * the migrated schema, not through a stub. The sub-floor half of the rule cannot be reached
 * through a real database at all (`dialogues.duration_seconds` CHECKs 45–120), so it is covered
 * against a stubbed repository in the first `describe` of this file.
 */
export {};
//# sourceMappingURL=content-api.spec.d.ts.map