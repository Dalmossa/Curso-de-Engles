---
adr: 026
title: Learner context for the app role — the single writer of `app.current_learner_id`, its transaction scope, and what PGlite can verify
status: Accepted
date: 2026-10-11
authors: [@system-design-architect]
deciders: [@system-design-architect, @security-engineer]
consulted: [@database-engineer, @qa-sdet, @devops-engineer]
informed: [@team]
tags: [rls, multi-tenancy, learner-context, guc, set-local, pglite, postgresql, adr-003, adr-014, adr-019, p1.10, security]
---

## Context

**P1.10** (*placement result persistence*) shipped a repository that writes
`diagnostic_results` + `diagnostic_responses` in one transaction, and 12 integration tests that
pass. Both tables carry ADR-003's `learner_isolation` policy. The repository never sets
`app.current_learner_id`, and the P1.10 backlog row records that as a caveat:

> **Operational:** both tables carry the `learner_isolation` RLS policy for role `its_platform_app`;
> the repository does not set `app.current_learner_id` (no established pattern in the repo yet).

"Not measured" and "not a problem" are different claims, and the caveat made the second one by
omission. Measured, it is the first: **`persist()` cannot write anything as the role the code runs
as.** The integration suite is green because it connects as the table **owner**, and PostgreSQL
does not apply a table's policies to its owner unless `FORCE ROW LEVEL SECURITY` is set —
`relforcerowsecurity = false` on both tables, measured.

The pattern was never missing, only unimplemented. Two artefacts already name it:

- `docs/data-model.erd.md` §9 rule 1 — "`SET LOCAL app.current_learner_id = '<uuid>'` is issued
  **once per transaction** by `PgSessionContext` — the single writer (domain-model X-4). `SET LOCAL`
  never appears in application code outside that class."
- `docs/domain-model.md` §2.2 — "the GUC wrapper is the single writer of `app.current_learner_id`".

`PgSessionContext` appears in no source file. This ADR implements the decision those two lines
already made, fixes the predicate they rely on, and corrects the reason the repository believed the
behaviour was untestable.

### Measured — through the real `DiagnosticResultRepository.persist()` on the PGlite harness

A real run from `administerDiagnostic` (`θ = −1.28`, 12 answers, `start_node = les_a2_greetings_intro`)
with only the result row's FK targets seeded. Stack: `@electric-sql/pglite` 0.5.8, `typeorm` 0.3.20,
Node 24.21.0; on the other side PostgreSQL 15.17 (alpine) via `pg`. Every table below was produced by
running the probe, not by reasoning about the engines:

| # | role & context | outcome |
|---|---|---|
| 1 | owner (what the suite connects as) | passes RLS, fails at `diagnostic_responses_item_id_fkey` — ADR-021's empty catalogue |
| 2 | `its_platform_app`, GUC never set | **`new row violates row-level security policy for table "diagnostic_results"`** |
| 3 | `its_platform_app` + `set_config(…, true)` in the transaction | RLS passes; fails at the *same* `items` FK as (1) |
| 4 | `its_platform_app` + **another** learner's context | `new row violates row-level security policy` — fail-closed |

(2) is the defect. (3) is the same wall as (1), which is what proves the GUC — not the role, not the
transaction — is the whole difference between a run that stores and a run that does not.

### Measured — the GUC's lifecycle, on real PostgreSQL 15.17

`docs/adr/019` and `docs/data-model.erd.md` §9 rest on one sentence: *an unset GUC evaluates NULL,
so `missing_ok` is fail-closed and the strict two-arg form's hard error is avoided.* It is true on a
connection the GUC has never touched, and false on every connection afterwards:

| # | step | `current_setting('app.current_learner_id', true)` |
|---|---|---|
| 0 | fresh session, never set | `NULL` |
| 1 | inside a transaction, after `set_config(…, true)` | `'11111111-…'` |
| 2 | **after `COMMIT`** | `''` — not `NULL` |
| 3 | **after `ROLLBACK`** | `''` — not `NULL` |
| 4 | after `set_config(…, false)` then `COMMIT` | `'99999999-…'` — **survives** |

The GUC becomes a *placeholder* at the end of the first transaction, and a placeholder's reset value
is the empty string. `''::uuid` does not evaluate to `NULL`; it **raises**
`invalid input syntax for type uuid: ""`. So on a pooled connection, the *second* context-less
learner-scoped statement fails differently from the first, and neither failure is the one the
schema's own header promises. Both still refuse the row — the failure is fail-closed, never a leak —
but a gate whose failure mode depends on how many transactions preceded it is not a gate anyone can
reason about, which is the property ADR-003 bought.

### Measured — what PGlite can and cannot verify

`docs/adr/014` heads a section **"Binding constraint: what must not run on PGlite"**. Its five items
split along exactly the line this measurement draws:

| ADR-014's item | as measured | verdict |
|---|---|---|
| 1. *RLS policies* — "cannot be tested against a single connection that is **already the owner role**" | the owner bypasses both tables (`relforcerowsecurity = false`) | **confirmed**, and it is the precise reason P1.10's suite is green while the code cannot write |
| 2. *`SET LOCAL` / `SET ROLE` / per-request GUC assignment* — connection-scoped state | `SET ROLE`, `SET LOCAL` and `set_config(…, true)` behave identically to PostgreSQL 15.17 | **contradicted** |
| 3. *Cross-learner isolation* — "requires two concurrent sessions" | one session, sequential: learner B's context rejects learner A's row (probe 4) | **half** — the *concurrent* half needs two sessions; the exclusivity claim does not hold |
| 4. Anything asserting **write concurrency** | one exclusive connection cannot exhibit contention | confirmed |
| 5. pgBackRest / PITR | external process | confirmed |

Item 1 is the whole mechanism, and it is correct: the harness connects as the owner, and it is the
role — not PGlite — that makes the test vacuous. Item 2 is contradicted by every row of the table
above: with the right role, PGlite enforces the policy and the test can fail. That is also the part
stated in three other places — `docs/adr/README.md` line 66 ("RLS, `SET LOCAL`, role-switching … and
concurrency **cannot** run on PGlite"), `docs/data-model.erd.md` §9 rule 4 ("PGlite cannot exercise
`SET LOCAL` role-switching or `current_setting` GUCs faithfully"), and `BACKLOG.md`'s "real
PostgreSQL only" block.

What PGlite genuinely cannot do is **two sessions at once** — item 3's concurrency and item 4: lock
contention, a pool handing one connection to two learners, and the cross-talk that
`set_config(…, false)` would cause there. That is the smaller, real limitation, and it is the one
P2.2/P2.10 depend on.

## Decision

### 1. `PgSessionContext` is the single writer of the GUC

One class — `src/infrastructure/persistence/pg-session-context.ts` — contains the string
`app.current_learner_id`. Everywhere else, no. This is `data-model.erd.md` §9 rule 1 executed.

### 2. It owns the transaction, and the context is set inside it

```ts
class PgSessionContext {
  withLearner<T>(learnerId: string, work: (tx: QueryRunner) => Promise<T>): Promise<T>;
}
```

- `work` receives a `QueryRunner` **already inside** a transaction that has the context set.
- The GUC is written with `SELECT set_config('app.current_learner_id', $1, true)` — the identifier
  is the only literal, the learner id is a **bind parameter**. `SET LOCAL '…' || learnerId` would
  put a request-supplied string into a statement, which is the injection ADR-003's design exists to
  make impossible.
- Commit on success, rollback on throw, `release()` in `finally`.
- Repositories keep the shape P1.10 already gave `persist()`: `tx?: QueryRunner`. They are *below*
  the boundary and must never set the GUC themselves — including when they own their transaction,
  which after this ADR they should not.

Placement is the decision. The GUC is transaction-scoped state, so the only component that can
correctly set it is the one that owns the transaction; a component that does not own the transaction
either writes it session-wide (a leak, D3) or writes a `SET LOCAL` that PostgreSQL silently discards
outside a transaction block.

### 3. Transaction scope only — `set_config(…, true)`, never `SET`/`set_config(…, false)`

Session-scoped context survives the transaction (measured, row 4 above) and therefore survives the
connection's return to the pool. The next learner checked out on that connection then holds a context
they did not set: their `SELECT`s are evaluated against the previous learner's id, which the policy
*satisfies*, so the policy returns the previous learner's rows. `SET LOCAL`-only makes the leak
impossible by construction rather than by discipline. Review rule: the third argument of
`set_config` is `true` or the call is wrong.

### 3b. The single writer, enforced by a gate

"One writer" is worth exactly what enforces it. `npm run domain:check` already fails a forbidden
import under `src/domain/`; the GUC is the symmetrical case in `src/infrastructure/`, and it gets the
same treatment rather than a review convention. `scripts/rls-context-check.mjs` — wired into
`test:all` and the CI workflow — fails if the string `app.current_learner_id` appears in any file
other than `src/infrastructure/persistence/pg-session-context.ts` and the migration, or in that file
without `, true)`. Architecture that is only prose is re-litigated in the next PR; this repository
has the scar for that in the P0.5 note on `content-check.mjs`, a gate that could not fail certifying
a loader that did not work.

### 4. The policy predicate becomes `nullif(current_setting('app.current_learner_id', true), '')::uuid`

Amendment to the ADR-019 migration (`src/migrations/1791331200000-create-schema.ts`, the `DO $$` loop
that creates `learner_isolation` on 15 tables). The `''` placeholder is not an edge case; it is the
steady state of every pooled connection that has served one learner-scoped transaction.

Verified on PostgreSQL 15.17 by rebuilding the policy and re-running the matrix:

| situation | as shipped | with `nullif(…, '')` |
|---|---|---|
| context-less, virgin session (GUC `NULL`) | RLS violation | RLS violation |
| context-less, GUC `''` (second transaction onward) | **`invalid input syntax for type uuid: ""`** | **RLS violation** |
| own context | insert committed | insert committed |
| another learner's context | RLS violation | RLS violation |

The remedy changes no positive path and removes no protection; it restores the sentence the schema's
header already asserts, on every connection rather than only the first.

`scripts/migration-check.mjs` gains an assertion on the predicate **text** (`nullif(` present in
every `learner_isolation` policy's `USING`/`WITH CHECK`). Counting 45 policies was the check that
existed; it cannot see an expression change inside one of them.

### 5. Cross-connection concurrency stays on real PostgreSQL; everything else does not

- **PGlite is sufficient** for: policy existence, role switching, `SET LOCAL`/`set_config`, GUC
  semantics, `WITH CHECK` rejection, cross-learner denial within a session, owner bypass.
- **Real PostgreSQL is required** for: two sessions at once, lock contention, pool cross-talk, and
  the concurrency P2.2/P2.10 assert.

Corrections applied with this record: `docs/adr/README.md` line 66, `docs/adr/014`'s **"Binding
constraint: what must not run on PGlite"** items 2–3 (the driver choice there is unaffected — only
the reason is narrowed), `docs/data-model.erd.md` §9 rule 4 and the SQL template above it, and
`BACKLOG.md`'s "real PostgreSQL only" note. `CONSTITUTION.md` §4.8's *rule* goes further than this
measurement requires (it asks that RLS/GUC/multi-connection tests run on real PostgreSQL in CI) and
is honoured as written — P1.10's integration suite runs on both; only its rationale clause, which
`docs/adr/014` item 2 was the source of, needed narrowing. P1.10's integration suite gains an
app-role test on PGlite; its 12 owner-role tests keep their value as mapping tests, with the header
stating which role they exercise.

### 6. A learner-scoped persistence test that does not set the context is not a passing test

It is a test that cannot fail — the same defect as the P0.5 gate. Every future learner-scoped
integration test runs under `its_platform_app`; the owner-role path is what a *deliberate* bypass
test should assert. P2.1 owns the cross-learner **concurrent** suite; it does not own the
single-session one, which this ADR moves into P1's reach.

### 7. Fail-closed, and not by adding a permissive policy

The fix is never "make the INSERT succeed". No session-user fallback, no `USING (true)` for the app
role, no `search_path`-style default learner. A context-less write must be refused, and the
refusal's *mode* is what §4 makes uniform.

## Consequences

### Positive

- `persist()` can write a run as the role it runs as, with one place to audit.
- `SET LOCAL`-only makes cross-learner leakage via a pooled connection structurally impossible, not
  merely policy-forbidden.
- The GUC failure is one behaviour (`RLS violation`) on every connection, so a test may assert it.
- The injection surface closes: the learner id never enters a statement as text.
- The repository's RLS verification claim stops being false in both directions — PGlite now verifies
  RLS & role behaviour, and the artefacts stop saying it cannot.

### Negative

- **Every learner-scoped use case acquires a transaction.** It was already one (`P1.10`'s write is a
  single transaction); this makes the boundary explicit and named, but it does mean a repository can
  no longer be used outside `withLearner` and still be correct.
- **A migration file that has already been run is edited in place.** Allowed because the schema is
  one fresh-schema migration and no environment holds learner-scoped data (P1.10: "`diagnostic_results`
  is empty in every environment"); it would not be allowed once a deployment exists.
- **A new gate to maintain.** `rls-context-check.mjs` is one more script for one more invariant.
- **The safest option is still not taken** — see `FORCE ROW LEVEL SECURITY` below.

### Neutral

- ADR-014's driver choice, ADR-003's policy design and ADR-019's grant model are unchanged; only the
  predicate expression and the belief about testability are.
- The `missing_ok` deviation ADR-019 recorded is kept — and, with §4, it now means what it says on
  every connection instead of only a fresh one.
- Content tables stay policy-free (ERD §9 rule 2), so the loader and `content-check.mjs` are
  unaffected by all of this.

## Alternatives Considered

1. **The repository sets the GUC itself when it opens its own transaction.** Rejected: it spreads a
   cross-cutting invariant across every repository, and a repository joining a caller's transaction
   must *not* set it — so the rule would immediately have two exceptions.
2. **A NestJS interceptor or middleware sets it per request.** Rejected: it does not own a
   transaction, `SET LOCAL` outside one is a no-op, and `SET` leaks exactly as §3 describes. A request
   can also span several transactions.
3. **A TypeORM subscriber or an `@WithLearnerContext()` decorator.** Rejected: it hides I/O in a
   place nobody reads, and `CONSTITUTION.md` §4.2's separation is about knowing where the boundary
   is. An explicit call is the point.
4. **`AsyncLocalStorage` carrying the learner id, applied lazily at query time.** Rejected:
   ambient request state as a data-access input makes a domain-adjacent decision implicit, and the
   GUC would still need a transaction to be transaction-scoped.
5. **Session-scoped `SET` (or `set_config(…, false)`), with a `RESET` in a `finally`.** Rejected: a
   release path that can be skipped is a leak with extra steps, and the connection can be returned to
   the pool by a different code path than the one that set it.
6. **`ALTER TABLE … FORCE ROW LEVEL SECURITY`, so the owner is bound too.** The strongest option, and
   the one that would have made the P1.10 suite fail on day one instead of passing vacuously. Not
   taken in this record: it changes every owner-role path at once (migration, loader,
   `content-check.mjs`, the PGlite harness) and needs its own blast-radius analysis; it deserves its
   own ADR rather than riding along with this one. Named here so it is not rediscovered.
7. **Keep the shipped predicate and document the `''` failure.** Rejected: the failure mode would
   then be "the second transaction on a warm connection raises a type error a caller cannot
   distinguish from a malformed UUID" — a documented trap where a one-line `nullif` removes it.
8. **Verify RLS on real PostgreSQL only, as the four artefacts say.** Rejected on measurement: it
   would keep the single-session behaviour uncovered until P2.1, for a limitation PGlite does not have.

## Implementation Plan

- [ ] `src/infrastructure/persistence/pg-session-context.ts` — `withLearner`, `set_config(…, true)`,
      bind-parameter id, commit/rollback/release
- [ ] `scripts/rls-context-check.mjs` — `app.current_learner_id` appears in exactly that file, and
      with `, true)`; wired into `package.json` `test:all` and the CI workflow
- [ ] `src/migrations/1791331200000-create-schema.ts` — `nullif(…, '')` in the `learner_isolation`
      loop (15 tables), and the header's `missing_ok` note updated to the measured lifecycle
- [ ] `scripts/migration-check.mjs` — assert the predicate text contains `nullif`
- [ ] `tests/integration/diagnostic-persistence.spec.ts` — an app-role test: context-less `persist()`
      is refused by RLS, and `withLearner(...)` persists the same run
- [ ] `DiagnosticResultService` — persist through `withLearner`, so the production path is the tested
      path (not a second, untested one)
- [x] corrected `docs/adr/README.md`'s 014 bullet, `docs/data-model.erd.md` §9 rule 4 + SQL template,
      `docs/adr/014`'s Binding constraint, `BACKLOG.md`'s "real PostgreSQL only" block and B-001
- [ ] `@devops-engineer`: the `rls-integration` CI job runs the new app-role test against PostgreSQL 16
      (the PGlite run is the fast gate; the service-container run is the real-engine one)

## References

- `docs/adr/003-postgresql-rls.md` — the policy, the roles, the `SET LOCAL` per transaction rule
- `docs/adr/014-datastore-pglite-dev-postgres-prod.md` — the driver split and its stated limitation
- `docs/adr/019-p0.4-schema-migration.md` — the migration, the `missing_ok` deviation, the grant model
- `docs/adr/018-persistence-derived-from-specs.md` — RLS on every learner-scoped table
- `docs/data-model.erd.md` §9 rules 1–4 · `docs/domain-model.md` §2.2 (X-4) · `CONSTITUTION.md` §4.8
- `src/infrastructure/repositories/diagnostic-result.repository.ts` — P1.10, the first caller
- `src/migrations/1791331200000-create-schema.ts` — the 15-table `learner_isolation` loop
- `BACKLOG.md` B-001 (this defect) · `BACKLOG.md` P2.1 (the concurrent cross-learner suite)
