/**
 * P1.13 — `GET /content/listening/{dialogue_id}/audio`, over seeded `clip_renders` (ADR-028).
 *
 * The ADR's own honesty note is the shape of this file. `clip_renders` holds **0** rows: no audio
 * has been rendered (M3 is not done) and `content-loader.ts` has no statement that touches the
 * table. So every render read here is a **seed fixture** inserted straight into the migrated
 * schema — never a corpus artefact. The endpoint is real; the audio is not, and this file says so
 * rather than letting a green suite imply a playable catalogue.
 *
 * What is asserted is the executable half of ADR-028 §3: the four admission conditions as SQL, in
 * the same all-or-nothing form `ContentRepository.findDialogueAudio` writes them. The seeds are
 * built to separate the conditions from one another, because a test that fails for two reasons at
 * once proves neither:
 *
 *   * **D_L1** — the one shipped, *L1-only* dialogue (discovered at runtime, never hardcoded) —
 *     carries a **complete take 1** and a **partial take 2**, so "the highest `take` complete for
 *     the whole dialogue" is distinguished from "the highest `take` that exists";
 *   * **D_A** — an L2 dialogue — is complete but **not ear-checked**, so §3.4 is the only thing
 *     that withholds it, until the checks are recorded;
 *   * **D_B** — renders **only at `rate` 0.75** — isolates the rate filter from take completeness;
 *   * **D_C** — **only a partial take** — exercises "no complete `take`" on its own;
 *   * the **shadow-only probe** carries complete, ear-checked renders *and* a speaker mapping, so
 *     `status = 'shipped'` (§3.1) is the only condition that can refuse it.
 *
 * The negative control for §3 condition 4 is in the ADR's Implementation Plan but is not a test
 * here: it is the manual removal of the ear-check predicate from the repository SQL, watched
 * against the D_A assertion below (recorded in the ADR follow-up report). Adding a switch to the
 * production query so a unit test could flip it would put a test seam in the SQL the ADR wants
 * raw.
 */
export {};
//# sourceMappingURL=content-audio.spec.d.ts.map