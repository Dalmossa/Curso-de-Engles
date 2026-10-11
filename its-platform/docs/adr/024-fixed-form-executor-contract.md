---
adr: 024
title: Fixed-form diagnostic executor — completeness, ordering, the §3.3a reportability lattice, and the run's output contract
status: Accepted
date: 2026-10-11
authors: [@system-design-architect]
deciders: [@system-design-architect, @backend-lead]
consulted: [@qa-sdet, @database-engineer, @content-owner]
informed: [@team]
tags: [diagnostic, fixed-form, executor, reportability, three-state-lattice, diagnostic_results, adr-017, p1.9]
---

## Context

**P1.9** (*fixed-form diagnostic executor `diagnostic_form_v1`, no CAT*) is the third item on the
critical path `P0 → P1.8 → P1.11 → P1.9 → P1.10`, and the only one whose acceptance is stated in
`BACKLOG.md` as a list of properties the artefact must have rather than as an algorithm:

> **12 items** (Gram 4 · Voc 3 · Read 3 · Pron 2 · **Listening 0**), selected **by blueprint
> position, never by θ**. Form version pinned on the run. `authored` provenance admitted (gate
> G-Q7 is a *CAT* rule). **No SE stopping rule**.

`src/domain/services/diagnostic-fixed-form.service.ts` implements `administerDiagnostic()` and had
**no tests at all** before this ADR. The properties above are mostly not enforced by it.

### What the executor does today

| # | Defect | Consequence |
|---|---|---|
| 1 | `if (!resp) continue` — an unanswered item is **silently skipped** | A 3-response run returns a *completed* run whose placement is computed over 3 items. A **0-response** run returns `θ = 0` → `cefr A2` → `les_a2_greetings_intro`: a placement derived from no evidence at all, with nothing in the return value saying so |
| 2 | `formId: 'diag_form_v1_' + Date.now()` | The "pinned form" has a **different identity every call**. Nothing about the item set is reproducible |
| 3 | `startedAt = new Date()`, `completedAt = startedAt + n × 30 s` | The executor **invents** timing. The `responseTimeMs` it was given are ignored, and `new Date()` in a domain function makes the return value a function of wall-clock time |
| 4 | `thetaEstimatesPerStep` | Built, appended to, and **never read or returned**. Dead |
| 5 | `seOverall` from `computeThetaEstimate` is computed and **discarded**; `seStatistical`/`ci95Lower`/`ci95Upper` all use the *declared* bank constant | The run's own precision never reaches the output. §3.6's `overall.ci_95` is `θ ± 1.96·se` with the **run's** `se` (its example: `se 0.28` vs a disclosed `se_statistical 0.31`, `se_effective 0.43` — three different numbers, one per purpose) |
| 6 | `validatePilotBank(form)` is called and its result **never used** | The five P1.8 criteria — which include the exact 4/3/3/2 blueprint the acceptance names — gate nothing |
| 7 | `skillThetas` is keyed by **skill** (`present_simple_be`, `th_voiced`, …) | §3.6 keys `skills` by **domain** (`grammar`, `vocabulary`, `reading`, `pronunciation`, `listening`), and §3.3a is a rule about **domain** item counts |
| 8 | `reportable: skillResponses.length >= 2` | Invented. §3.3a's floor is **5** items for a point estimate; 3–4 is a **band**; 0–2 is `insufficient_evidence` |
| 9 | `profile: placement.profile` returns the **input role** (`general`/`it`/`dev`) | `diagnostic_results.profile` is the §4 *false-beginner* diagnosis. As shipped, the value is never `false_beginner_suspected`, so §5.1's `les_rem_confidence_builder` trigger (which ADR-023 Decision 4 wires) **can never fire** |
| 10 | `stoppingRule` does not exist on `DiagnosticRun` | `diagnostic_results.stopping_rule VARCHAR(50) NOT NULL` — a **NOT NULL** column P1.10 cannot fill |
| 11 | `precisionLabel` does not exist on `DiagnosticRun` | `diagnostic_results.precision_label VARCHAR(20) NOT NULL` — same |

### The contradiction this ADR has to settle: §3.3a vs §3.6

`diagnostic-spec.md` §3.3a ("Dimensionality — Why Skill θ Is Under-Identified") states the
reportability lattice **as a function of items administered in a domain**:

| Domain θ items administered | Reported as |
|---|---|
| ≥ 5 | Point estimate + SE |
| 3–4 | **Band only ("A1–A2"), no point estimate** |
| 0–2 | `insufficient_evidence: true`, excluded from the profile |

ADR-017 §2 fixed the MVP form at **Grammar 4 · Vocabulary 3 · Reading 3 · Pronunciation 2 ·
Listening 0** — below §2.1's Min Items (6/5/4/3) for **every** domain, and below §3.3a's
identification floor of 5 for **every** domain. §3.6's worked example nevertheless shows
`skill_theta_reportable: {grammar: true, vocabulary: true, reading: true, pronunciation: false,
listening: false}` with point estimates for grammar/vocabulary/reading.

Both cannot hold for the same run. §3.6 — and §3.3a's own sample sentence, *"Gramática e
vocabulário foram avaliados com boa precisão"* — are **CAT-era shapes**: they describe a variable-
length run that reaches §2.1's minimums, which ADR-017 §2 removed ("No CAT, no MFI"). §3.3a's
**rule** is about identification, not about selection, and it survives the removal of CAT intact.

So the fixed form is a deliberately sub-specification instrument, and the honest consequence —
today unsaid anywhere — is:

> **`diagnostic_form_v1` reports no domain point estimate.** Grammar, Vocabulary and Reading
> (3–4 items each) are reported as **bands**; Pronunciation (2) and Listening (0) are
> `insufficient_evidence`. Only the **overall θ**, estimated from all 12 items, is a point
> estimate, and it is the basis of `cefr` and of the routing in ADR-023.

This is not a defect to be papered over: it is the difference between *"Você é A2"* (supported,
12 items) and four confident per-skill numbers derived from 3 items each (not supported). §3.3a's
own framing is explicit that showing the latter *"is worse than showing three numbers and two gaps"*.

### Where the domain bands come from

§3.3a gives the band rule's shape (`"A1–A2"`) but not its derivation. It must be data, not a
hand-written string, and it must satisfy: (i) never a point estimate; (ii) monotone — a higher
domain θ never yields a lower band; (iii) bounded by the A1–B2 ladder. The derivation used here is
the same interval logic ADR-023 uses for routing: the band is the **span of CEFR bands covered by
the domain θ's own 95 % interval** (`θ_d ± 1.96·SE_d`, with `SE_d` from the same
`computeThetaEstimate` that produced `θ_d`). A 3-item domain has a wide `SE_d`, so it will usually
span two or more bands — **and that is the true answer**: three items cannot resolve a band more
narrowly. §3.6's `"A1–A2"` is the narrow-`SE_d` case of the same rule, not a different one.

## Decision

1. **The form is fixed and its composition is checked, not assumed.** `administerDiagnostic`
   reads `createDiagnosticFormV1()`, runs `validatePilotBank`, and **throws**
   `DiagnosticFormInvalidError` (naming the failed criteria) if it does not pass. The run also
   asserts, independently of the validator: 12 items, composition `4/3/3/2/0` by `domainId`,
   **12 distinct item ids** (no repetition), and **zero listening items**.

2. **Items are administered in the form's declared order, and never selected by θ.** The item
   sequence is a function of the form alone. The executor must not consult `correct`/`responseTimeMs`
   when choosing an item. (Property test: an all-correct response set and an all-wrong one yield
   the identical item-id sequence.)

3. **An incomplete run is an error, never a placement.** Every one of the form's 12 items must have
   exactly one response. A missing response, an unknown `itemId`, or a duplicate `itemId` **throws**
   `DiagnosticIncompleteError` / `DiagnosticResponseError` naming the offending ids. `θ` is never
   estimated from a subset. (This is the removal of defect 1, and it is the same fail-closed
   principle as `content-check.mjs`'s `EXPECTED_SKIP_COUNT`.)

4. **The run is pure.** `startedAt` and `completedAt` are **inputs**, not clock reads; the executor
   validates `completedAt >= startedAt` and throws otherwise. `formId` is **deterministic** —
   derived from the ordered item ids, identical across calls. No `new Date()`, no randomness, no I/O.

5. **The stopping rule is the form length, never `SE`.** `DiagnosticRun.stoppingRule` is added and
   set to `fixed_form_12_items`. ADR-017 §2 and §3.5(X4+X12) forbid an `SE`-based stop, and
   `diagnostic_results.stopping_rule` is `NOT NULL`.

6. **Two intervals, named for their purpose.** `seOverall` is the run's realised statistical SE and
   `ci95Lower/Upper = θ ± 1.96·seOverall` (§3.6's algebra, and its `overall.ci_95`).
   `placementCi95Lower/Upper = θ ± 1.96·seEffective` is the interval `band_bounds` is built from
   (ADR-017 §3, ADR-023 Decision 2) — the one that *explains* `start_cefr`. `seStatistical`,
   `seParameter`, `seEffective` and `precisionLabel` continue to carry the **declared** disclosure
   values, unchanged. Both intervals are derivable from persisted data (`theta`, `se_effective`),
   so no column is added.

7. **Domains are keyed by domain, in §3.3a's three-state lattice.** `skillThetas` (per skill) is
   replaced by `domainThetas`, one entry per domain of the blueprint plus Listening, each carrying
   an explicit `state` discriminator (which is what `docs/data-model.erd.md` line 70 requires of
   `diagnostic_results.skill_theta`): `point_estimate` (n ≥ 5, with `theta`/`se`/`cefr`), `band`
   (3–4, with `cefrBand`), `insufficient_evidence` (0–2, with `reason`).
   `skillThetaReportable[domain] = (state === 'point_estimate')` — **derived, never listed**.
   For `diagnostic_form_v1` this yields band/band/band/insufficient/insufficient, and an
   all-false reportability map; §3.6's map is the CAT-era shape and is recorded as such.

8. **`profile` is the §4 diagnosis, not the input role.** The input role (`general`/`it`/`dev`) is
   carried as `role` and is what ADR-023 Decision 3's track rule reads. `profile` is derived from
   §4.1's signals that the 12-item run can actually evaluate — *Grammar θ ≫ Vocabulary θ (Δ > 1.0)*
   and *Pronunciation θ < −1.5 while Reading θ > 0.0* — and is `false_beginner_suspected` when one
   fires, else `null`. This is what makes ADR-023 Decision 4's `les_rem_confidence_builder`
   trigger reachable. §4.1's other three signals are **not** evaluated, and the reason is recorded
   rather than guessed: *high guess rate* needs per-item guess data the MVP does not collect, and
   *self-report vs θ mismatch* needs a self-report the request does not carry.

9. **`bktPriorsOverride` stays `{}`.** §4.2 says *"inflate P(L₀) for grammar/vocab, deflate for
   speaking/pronunciation"* and gives **no magnitude** in any spec. Emitting invented numbers would
   put unowned priors into the learner model; the empty map plus a comment naming the missing
   magnitude spec is the honest state, and it is explicitly **not** a claim that §4.2 is done.

10. **`placementProvisional` is derived, not hardcoded** (G-7): `true` iff any administered item's
    `calibrationStatus !== 'empirically_calibrated'`. Today every pilot item is `expert_anchored`,
    so it is `true` — but it becomes `false` by itself when Stage-2 calibration lands, which a
    literal `true` never would.

### Acceptance tests (the properties above, as assertions)

Blueprint composition and order; no repetition; selection independent of θ; incomplete / unknown /
duplicate responses each throw; timestamps come from the input and a reversed pair throws;
`formId` stable across calls; `stoppingRule === 'fixed_form_12_items'` and constant in `SE`;
`authored` provenance administers normally (G-Q7 is a CAT rule); the §3.3a lattice for
4/3/3/2/0 → band/band/band/insufficient/insufficient; a synthetic ≥5-item domain → `point_estimate`
(proving the lattice is computed, not listed); `skillThetaReportable` equal to the derived map;
`ci95*` from `seOverall` and `placementCi95*` from `seEffective`; `getCefrFromTheta ∉ {C1, C2}`;
§4.1 signal → `profile` and the confidence-builder node; and an integration property that
`computeStartNode(run.θ, run.seEffective, run.domainThetas, run.role)` reproduces the run's
`startCefr`/`startNode`/`belowScale`/`remediationNodes` **exactly**.

## Consequences

### Positive

- The executor cannot return a placement it cannot support: no evidence → an error, not `A2`.
- The two intervals, the declared-vs-realised SE, and the reportability floor are each stated once,
  with a test apiece. Defects 1–11 all become assertions.
- `diagnostic_results` can be filled completely by P1.10 (`stopping_rule`, `precision_label`) with
  no null and no default.
- ADR-023's confidence-builder trigger stops being unreachable.

### Negative

- **The learner sees no per-domain point estimate from the MVP placement.** This is §3.3a applied
  to a 12-item form; it is a real product consequence and it should be surfaced in the results
  screen copy (*"pronúncia e compreensão oral: evidência insuficiente"*), not silently omitted.
- Domain bands will usually be wide (`A1–B2` for a 3-item domain), because three items genuinely
  do not identify more. A narrower band would be a fabricated one.
- `skills` seeding is an **ADR-021** dependency: `diagnostic_responses.skill_id REFERENCES
  skills(id)` cannot be satisfied until ADR-021 lands, so **P1.10 is blocked on ADR-021** for the
  response rows (not for the result row). Recorded here so it is not discovered at P1.10.
- §3.6's `skill_theta_reportable` map, §3.6's `overall.se`, and §3.3a's sample results-screen
  sentence are CAT-era and now inconsistent with the fixed form. Amending spec prose is the
  content owner's call under `SDD.md` §9; this ADR records the state instead of hiding it.

### Neutral

- `getCefrFromTheta` (fixed in ADR-023 Decision 1) is reused for the point-estimate band of the
  overall θ and for the endpoints of a domain band. One ladder, three uses.
- The `A1–B2` ladder means `C1`/`C2` remain unreachable, as in ADR-023.

## Alternatives Considered

1. **Keep the silent skip and return an incomplete run (`completedAt: null`).** Rejected for P1.9:
   `DiagnosticRun.completedAt` being nullable was the escape hatch that let a 3-item run look
   finished. A partial-run API is a real need, but it needs its own contract (what may be shown,
   what may be persisted) — inventing one here would be the same defect with a nicer shape.
2. **Report domain point estimates anyway, since they are "only" used for routing.** Rejected:
   §3.3a is explicit that below 5 items the domain θ is *determined by the overall θ plus noise*.
   Reporting it is the exact "five confident numbers, two of which are noise" failure §3.3a names.
   Routing still *uses* the domain θs because §5.1's track and remediation rules are written on
   them (ADR-023 Decision 3–4), but they are not reported as learner-facing measurements.
3. **Rescale §3.3a's floor for a 12-item form (e.g. `n ≥ 3`).** Rejected: the floor is an
   identification property of the model, not a preference, and lowering it to fit the form is the
   `stats` §4.3 bank-sizing mistake in reverse.
4. **Implement §4.2's BKT prior overrides with chosen magnitudes.** Rejected: no artefact states
   them, and `bkt_priors_override` is a learner-model write. Deferred (Decision 9).

## Implementation Plan

- [ ] `DiagnosticRun` gains `role`, `stoppingRule`, `precisionLabel`, `seOverall`,
      `placementCi95Lower/Upper`, `domainThetas`; `skillThetas`/`SkillTheta` replaced by the
      domain-keyed three-state lattice
- [ ] `administerDiagnostic` rewritten per Decisions 1–10; typed errors for 1, 3, 4
- [ ] `createDiagnosticFormV1`'s `formId` made deterministic (Decision 4)
- [ ] §4.1 signals (the two computable ones) and the derived `profile`
- [ ] Acceptance tests above, in `tests/domain/services/diagnostic-fixed-form.service.spec.ts`
- [ ] `BACKLOG.md` P1.9 → DONE with evidence; `MEMORY.md` updated
