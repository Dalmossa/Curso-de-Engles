# Changelog

All notable changes to the ITS Platform API are recorded here.

**Mandate:** `CONSTITUTION.md` §4.4 — *"Every breaking change is recorded in `CHANGELOG.md`
with the migration path before the change merges."* This file is that record. It was
mandated by Constitution v1.0.0 and did not exist until 2026-10-04; the omission was found
while amending §4.4, not by any automated check.

**Format:** [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning per
[SemVer](https://semver.org/spec/v2.0.0.html) as governed by `CONSTITUTION.md` §6.1.

---

## Unreleased

No released version yet. The platform has never been deployed.

### Changed — breaking

| Change | Migration path | Story |
|---|---|---|
| Error responses move from `ErrorResponse` (`{error, message, request_id}`, `application/json`) to RFC 9457 `Problem` (`{type, title, status, detail, instance}`, `application/problem+json`) | Clients branching on the `error` string read `Problem.title`; clients reading `message` read `Problem.detail`; `request_id` is retained as an RFC 9457 extension member. `ErrorResponse` remains declared and `deprecated: true` for the duration of the migration. | P1.17 |
| **`mastery.gate_passed` and its trigger are removed** | A consumer that read `gate_passed` calls the domain gate function, which returns the **full four-clause** predicate: `p ≥ 0.85 ∧ CI₉₅_lower(P) > 0.70 ∧ n_obs ≥ 3 ∧ distinct_days ≥ 2 ∧ spaced_obs ≥ 1`. The old column was `mastery >= 0.85` alone — it dropped the interval conjunct *and* the whole evidence clause that `PRD.md` §6.6, `post-lesson` §7.1 and `curriculum-graph` §6.1 require. **The replacement is stricter, so consumers that relied on the old value may now observe `false`.** That is the correction, not a regression | ADR-018 §1–2, P1.2 |
| **`fsrs_states.retrievability` removed** | Call the domain function: `R(t) = (1 + 0.9803·t/S)^(−0.1542)`. The generated column implemented `exp(−t/S)` — at `t = 10S` it returned ≈0 where the spec mandates **0.693** — and froze the current FSRS parameter set into each row, while `stats` §6.2a refits at 512 pooled reviews. `w_version` is added so a row is attributable to the parameter set that produced it | ADR-018 §3 |
| **`item_responses.bkt_transition` removed** | Nothing replaces it, deliberately. `learned/retained/forgot/guessed` is defined in **no** spec and is not recoverable from a binary outcome — it is a claim about *why* an answer was wrong, which only the learner can make. `item_responses.confidence` already exists and is the honest signal | ADR-018 §9.7 |
| **`learners.cefr_level`, `streak_days`, `xp`, `consent_given_at`, `consent_version` removed** | The band's authority is `DiagnosticRun`. A cached band is stored as a projection carrying `derived_from_diagnostic_id` + `as_of`; a bare `cefr_level` column has no provenance, so a re-diagnostic left a stale value with no way to tell. `streak_days`/`xp` had no basis in any spec (ADR-015 §3). `consent_given_at`/`consent_version` are replaced by append-only `consent_records(learner_id, purpose, version, granted_at, withdrawn_at, legal_basis)` — two columns cannot express purpose-specific, withdrawable consent under LGPD Art. 8 | ADR-015 §3–4, ADR-018 §9.9–9.12 |
| **`lessons.status` split into three columns** | `authoring_state` (`SDD.md` §4's five values) · `publication_state` · `permission_state` (`not_required` / `requested` / `granted` / `refused`). The single column conflated *"does the artefact exist"* with *"may it ship"*, and `permission_state` had no home in any current artefact. `reuse_basis = 'adapt_requires_permission'` records that a lesson *requires* permission, never whether it was *obtained* — so the **48 permission-gated lessons of `PRD.md` §2 carry no fact about their own status**, and §9 M5's exit condition (*"the 13 externally-sourced lessons publish with attribution strings; the 48 restricted ones either hold permission or are excluded"*) cannot be evaluated from the database at all. Original `cite_only` material was equally indistinguishable | ADR-018 §6, §9.12 |
| **`withdrawn` removed from database status vocabularies; `retired` replaces it** | `assessment` §7's *"pulled by defect, retained for audit, not served"* becomes `items.retired BOOLEAN` + `retired_reason`, unifying `SDD.md` §11 with `assessment` §7. `listening_items.status` narrows to `('shipped','shadow_only')`. `withdrawn` survives only in `authoring_state`, meaning *removed* | ADR-018 §6 |
| **Identifier canonicalisation** | Every `skill_id` resolves to `<domain>.<slug>` and every `item_id` to `<prefix>_<skill-slug>_<NNN>` through `identifier_aliases`. Historical spellings — bare (`th_voiced`), short (`lst.gist`), prefix (`pron_th_voiced`), fully dotted (`vocab.tenses.present`, 770 ids) — **continue to resolve**, so `(learner_id, item_id)` rows written before migration keep working. Consumers resolve through the alias table rather than pattern-matching an id | ADR-016 §2, P3.14 |
| **`items.skill_id` → `items.skill_ids TEXT[]` + GIN** | A single FK cannot hold `assessment` §1's `skill_ids[]`. Queries filter on `skill_ids @> ARRAY[…]` | ADR-018 §9.1 |
| **`listening_items` folded into `items`** | Discriminated by `modality = 'listening'` with a nullable `dialogue_id`. One item table, one FK, one FSRS review queue across all five domains — `post-lesson` §3.4 schedules L2 review over Listening, which the old schema made unschedulable | ADR-018 §5, §9.6 |

### Removed

| Removal | Reason | Story |
|---|---|---|
| `content_embeddings`, `pgvector`, HNSW index | **No endpoint uses it, no spec mentions it, and `RNF-001` forbids an asserted artefact.** Content is served by id. Deferred to P3 with a stated blocker: *a retrieval requirement that names a query*. If it returns it is its own ADR — an HNSW index over authored pedagogical content is a pedagogical decision (what counts as semantically near a lesson) wearing a database hat | ADR-018 §8 |
| `ms_*` / `diag_*` graph node kinds | `curriculum-graph` §1.1 declared **four** node kinds; `ms_` and `diag_` have **zero** instances repo-wide while carrying their own mastery gates and a `§11` Gamification dependency. `CONSTITUTION.md` §9 step 3: a declared-but-empty type is a promise the repository does not keep. §11's dependency is struck with them | ADR-015 §3 |

### Changed — non-breaking

| Change | Notes | Story |
|---|---|---|
| Base URL gains an `/api` prefix: `/v1` → `/api/v1` | Only the `servers.url` entries in `docs/api-spec.openapi.yaml` change. **No path within the API is renamed** — the 9 published paths are unchanged. A client that built its base URL from the server list must re-read it. | ADR-012 |
| Local development port `8000` → `3000` | uvicorn's default → NestJS's default. Loopback only. | ADR-012 |
| Global path versioning enforced | `app.setGlobalPrefix('api')` + `enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })`. Header and query-parameter versioning are prohibited by §4.4. | ADR-012 |
| **`lessons.body` and `dialogues.transcript` materialised by the loader** | ADR-027's persistence half. `lessons.body JSONB NOT NULL DEFAULT '{"phases":[],"learner_model":null}'` holds the four authored `FASE` blocks and the learner-model block — write-once content read whole by one endpoint, so it is a **column, not a `lesson_phases` table**, by the fold criterion of ADR-018 (`packs.manifest` is the precedent, and the schema ADR-022 §1 *rejected* is still rejected). `dialogues.transcript TEXT NOT NULL` holds the authored transcript that `clips` are **derived from**; re-joining it from the clips would be reconstructing a source from its own derivation — a clip keeps one turn's text and a `speaker_id`, so the speaker's name and the authored line structure survive only here. **Neither column is served yet:** the three `/content/*` routes still return mocks, and the response-schema amendment lands in the same ADR's API half, in this same unreleased version. No client is affected by a column | ADR-027 §5, §3b |
| **11 listening items became scorable** | `parseSlotTable` read the key marker `✓` from the option table's **value** column only. `corpus/listening-corpus.md` has two generations: **76** rows put `✓` in the value column and **11** put `✓ —` in the trailing column, where the distractor type otherwise sits. Those 11 shipped slots therefore loaded with `items.key IS NULL` and every option `is_key = false`, so **no surface could score them** — diagnostic, shadow CAT or FSRS — and nothing in either repository saw it: `verify-integrity.py`'s **[9]/[11d]/[11e] glob `packs/`**, so `corpus/` is outside every check that would have caught it. The rule is now "the `✓` may sit in either column", and `content-check.mjs` asserts the invariant **two-sidedly**: options ⇔ exactly one key (the 6 ASR-scored minimal-pair items carry no options and legitimately no key — ADR-004: `key: Optional[str]  # None for production items`) | ADR-027 §3a, ADR-004 |

### Added

| Addition | Notes | Story |
|---|---|---|
| `Problem` schema (RFC 9457) | Declared in `components/schemas`. `ErrorResponse` is marked `deprecated: true`. | P1.17 |
| `/auth/refresh` annotated `x-mvp-scope: excluded` | Returns `501`. The path is annotated rather than deleted because removal is itself a breaking change and ADR-013 does not authorise one. | ADR-013 |
| `remediation_nodes` (≤ 3) on the placement result | The second half of `curriculum-graph` §5.1's return value — `diagnostic_results` had **no column for it**, so half of the start-node mapping had nowhere to land | ADR-017 §3, ADR-018 §9.15, P1.11 |
| `below_scale` on the placement result | Emitted when `band_bounds` lies entirely below A1 → start node `les_a1_alphabet_sounds`. **No spec defined this case**; a θ below the scale is reachable in the false-beginner persona, which `PRD.md` §3 names as *"the target placement case"* | ADR-017 §3, P1.11 |
| `skill_theta` with an **explicit discriminator** | `diagnostic` §3.3a's three-state lattice — `point_estimate` (n ≥ 5) / `band` (n 3–4) / `insufficient_evidence` (n 0–2) — had **no tag**, so every consumer branched on key presence. It is now a tagged union | ADR-018 §9.15 |
| `form_version` on the placement result | Pins `diagnostic_form_v1` so a later Stage-2 form is *comparable* to it rather than silently replacing it | ADR-017 §2, P1.9 |
| `Speaker`, `Clip`, `clip_renders` entities | `listening-corpus` §2.1 makes within-dialogue voice ≡ speaker identity — **load-bearing**, and `lst_lexical_007` is solvable because of it — yet `Speaker` had no entity. A render take had no entity either, so `assessment` §7's *"a retired item remains queryable"* is unsatisfiable: `b` was estimated against one render and there was no way to know which | ADR-015 §4.4, ADR-018 §9.13, SDD §1 class 8 |
| `skill_registry` + `identifier_aliases` | One canonical form per identifier class, with a mapping table that **survives the rename** so `(learner_id, item_id)` history keeps resolving. Five `skill_id` spellings coexist today and `item_id` is textually indistinguishable from `skill_id` in the Family-B packs | ADR-016 |

### Changed — placement semantics

| Change | Notes | Story |
|---|---|---|
| `placement_provisional` is **derived** from `calibration_status != empirically_calibrated`, never stored as a boolean | It is a property of the evidence, so it clears **by data and never by a date or a flag flip**. The MVP has no rendered audio, so `diagnostic` §2.1.1(4)'s scheduled re-diagnostic does not exist and the label never clears there — which is why `PRD.md` §9 M4's exit condition (*"`placement_provisional` is gone"*) is amended by ADR-017 §5 to *"routing is deterministic, conservative, and its precision is displayed"* | ADR-017 §5, ADR-018 §9.9 |
| The MVP diagnostic is a **fixed 12-item form** (`diagnostic_form_v1`), not a CAT | **This changes the response's precision, and clients must not read θ as a point estimate.** At `a = 1.2`, `SE_stat = 0.481` and `SE_eff ≈ 0.567` → CI₉₅ half-width **±1.11 on θ, wider than the 1.0 gap between CEFR thresholds** (`stats` §3.1). Three independent spec rules already forbade the CAT: `assessment` §2.4 G-Q7 empties the CAT pool (`authored` items barred until `reviewed_by` is set); `stats` §6.2b truncates `elapsed_days` to whole days so an intra-test repeat yields `R = 1.000` and carries no information; and 10 Stage-1 items cannot fill an 18-slot blueprint | ADR-017 §2 |
| Start-node routing is **ordinal and conservative** | `start_cefr` = the **lowest** CEFR band whose θ threshold lies inside `[θ ± 1.96·SE_eff]`. Under-placement, never over-placement — same direction as `stats` §2.1's `P(L₀) = 0.15`. A client that assumed monotonicity in the returned `cefr` must be re-tested: the same θ can now route lower | ADR-017 §3, P1.11 |
| **Listening produces no θ at all** | `diagnostic` §2.1.1(3) already required it; §0 of the diagnostic form has **0 listening items**, so no listening θ is produced, reported or displayed. `curriculum-graph` §4.3's remediation trigger `listening θ < −1.5` was therefore a predicate that **can never be true**, and is substituted by `listening BKT p_know < 0.85` on ≥3 observations. The substitution **weakens** the trigger — BKT is the weaker instrument — and is recorded as such per `CONSTITUTION.md` §9 step 3 | ADR-017 §4 |
| FSRS grade scale is FSRS's native 4-point rating | `post-lesson` §3.2 declared `R = 1 \| 2 \| 3` and §3.3 assigned **correct-immediately → 1**, but FSRS-4.5 derives `S0` from 0.212 / 1.2931 / 2.3065 / 8.2956 in the order where **1 is the worst rating (Again)**. The two scales are inverted and the mapping was never stated. Now: correct-immediately → **4 Easy** · correct-after-hesitation / after-hint / self-corrected → **3 Good** · incorrect-no-hint → **1 Again**. `Hard (2)` is reserved for guided recall and is currently unassigned — recorded, not forced | ADR-018 §4 |

### Deprecated

| Deprecated | Sunset | Replacement | Notes |
|---|---|---|---|
| `ErrorResponse` schema | TBD — set when P1.17 lands | `Problem` | Do not use for new endpoints. |
| `/auth/refresh` | **No sunset date.** Blocked on ADR-013. | Token refresh performed by the external IdP | Not merely deprecated — **out of MVP scope and must not be implemented.** Sunset is deliberately absent because the endpoint is not planned, not scheduled. |

---

## Deprecation policy

`CONSTITUTION.md` §4.4 governs. Restated here so the changelog is self-contained for a
reader who arrives from a release note.

| Rule | Value |
|---|---|
| **Response headers on a deprecated endpoint** | `Deprecation: true` and `Sunset: <HTTP-date>` (RFC 8594) |
| **Minimum notice — security and correctness fixes** | 90 days |
| **Minimum notice — feature retirement** | 180 days |
| **Retirement gate** | The `Sunset` date has passed **and** ADR-006 (Kong) access logs show **no external traffic to that prefix for 30 consecutive days**. This metric must already exist when the endpoint is deprecated, not be built afterwards. |
| **Rule for changing a `Sunset` date** | Allowed only in the direction of *later*, and the change is itself a changelog entry with a reason. |

---

## Version history

No released versions. `CONSTITUTION.md` §6.1 defines the release SemVer policy that will
apply from the first release.
