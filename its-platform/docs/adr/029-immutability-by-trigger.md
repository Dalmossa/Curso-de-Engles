---
adr: 029
title: Immutability is a trigger, not a grant — items.id (I-2) and the append-only guard (X-3) are enforced in PL/pgSQL for every role
status: Accepted
date: 2026-10-12
authors: [@its-architect]
deciders: [@its-architect, @security-lead]
consulted: [@backend-lead, @database-engineer, @test-engineer]
informed: [@team]
tags: [immutability, rls, grants, triggers, i-2, x-3, p2.1, p2.2, adr-019, adr-026]
---

## Context

`CONSTITUTION.md` §4.6 makes two immutability promises, and `src/migrations/1791331200000-create-schema.ts`
(ADR-019) was written to keep them. Verifying **P2.1** (RLS isolation + integration suite) and **P2.2**
(immutable, tamper-evident audit log) proved that one of the two promises is a **comment, not a
control** — the DDL statement that says it enforces I-2 does nothing, and the gate that says it proves
I-2 is fooled by an unrelated error. This ADR records the measurements and the replacement: both
immutability guarantees are now PL/pgSQL triggers, which cover **every** role (owner and
`its_platform_admin` included) in a way a `REVOKE` grant never can.

### The two promises

| Control | Text | DDL expression at `3c944d8` |
|---|---|---|
| **X-3** (domain-model) | WORM: `append_only_events` is append-only | `REVOKE UPDATE, DELETE ON append_only_events FROM its_platform_app, its_platform_worker` |
| **I-2** (domain-model) | Identifiers immutable: no `UPDATE` on `items.id`, no `DELETE` on `items` | `REVOKE UPDATE (id) ON items FROM its_platform_app, its_platform_worker` + `REVOKE DELETE ON items FROM …` |

### Measurement 1 — the column-level REVOKE is inert (I-2 does not hold)

The migration grants `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES … TO its_platform_app`
(table-level), then re-applies the revoked set afterwards, including `REVOKE UPDATE (id) ON items`.
PostgreSQL ACLs have **no negative entries**: a column-level REVOKE cannot carve a column back out of
a table-level grant (the GRANT documentation says so, and the live cluster agreed). Measured on a
fresh `postgres:16-alpine` with the migration applied, as `its_platform_app`:

| Probe | Result |
|---|---|
| `has_column_privilege('its_platform_app','items','id','UPDATE')` | **`true`** |
| `has_table_privilege ('its_platform_app','items','UPDATE')` | `true` |
| `pg_attribute.attacl` rows for `items` | **`0`** — the column REVOKE left no trace |
| `UPDATE items SET id = 'it_hacked'` on a seeded row | **1 row affected** — the primary key was rewritten |

`REVOKE DELETE ON items` is a table-level revoke and **does** hold (`DELETE` refused) — so the
defect is exactly the column-level statement, not the surrounding grant algebra.

### Measurement 2 — the gate that asserted I-2 was fooled by a foreign key

`scripts/migration-check.mjs` asserted "app role cannot UPDATE items.id (I-2 column grant)" by
running `UPDATE items SET id = 'it_test_2' WHERE id = 'it_test_1'` and expecting *an* error. It
passed **16/16** — for the wrong reason: the gate's own fixture seeding inserts rows into
`item_options` (lines 217/222), so the `UPDATE` fails with
`update or delete on table "items" violates foreign key constraint "item_options_item_id_fkey"`,
an RI error that has nothing to do with privileges. Reproduced verbatim: the same statement errors
with the FK message; the same statement against a row **without** options children succeeds. The
gate proved referential integrity, and the green run said nothing about I-2.

This is the second time in this verification that a green gate was exactly wrong (the first is the
three-RLS-specs story in `MEMORY.md`: committed without ever running). Both share the mechanism —
an assertion that observes *an* error where a specific control was the claim.

## Decision

**Immutability is enforced by `BEFORE UPDATE`/`BEFORE DELETE` triggers, not by grants.** Two triggers,
one per promise, in `SCHEMA_STATEMENTS` (the migration is replayed, not versioned — ADR-019/ADR-027
pattern; this is the same additive edit P1.13 made for the `clip_renders` CHECK):

1. `fn_append_only_guard()` + `trg_append_only_guard` — `BEFORE UPDATE OR DELETE ON append_only_events`,
   raises `append_only_events is immutable: % operation not allowed`. Lands with **P2.2**; it is the
   only control that stops the table **owner** and `its_platform_admin` (who hold `GRANT ALL`), which
   a `REVOKE` cannot express at all.
2. `fn_item_id_immutable()` + `trg_item_id_immutable` — `BEFORE UPDATE ON items`, raises
   `items.id is immutable: % operation not allowed` when `NEW.id IS DISTINCT FROM OLD.id`. Replaces
   the inert `REVOKE UPDATE (id) ON items` (both occurrences — the pre-policy one at the top of
   section 12 and the "re-apply after blanket grants" one in section 13, which are additionally
   redundant with each other). `REVOKE DELETE ON items` stays — it is table-level and it works.

**The gates now assert the control, not an error.** `migration-check.mjs`:
- the triggers assertion lists **six** named triggers (the four ADR-019 ones, plus the two above);
- the I-2 assertion seeds a fresh item with **no** `item_options` children, attempts `UPDATE items
  SET id = …` as `its_platform_app` and expects `/immutable/`, then attempts it as the connection
  **owner** and expects the same — the owner half is the part no grant-based control could ever pass,
  so it is the part that proves the trigger rather than the grant algebra.

## Consequences

### Positive
- I-2 and X-3 hold for **every** role, including the table owner and `its_platform_admin`. A
  `REVOKE`-only design could never make that claim; the append-only and immutable-identifier
  promises now live in the one layer that cannot be bypassed (the same reasoning that chose the
  `clip_renders.uri` CHECK in ADR-028 §7b).
- The I-2 gate cannot be fooled by an unrelated error again: it observes the trigger's own
  exception, and the no-children fixture removes the RI confound that hid the defect.
- `rls-isolation.spec.ts` (P2.1) and `audit-append.spec.ts` (P2.2) both assert the trigger message,
  once under the app role and once under the owner, so the property is regression-tested at two
  layers (gate + integration suite).

### Negative
- One PL/pgSQL trigger on every `items` UPDATE. The comparison (`NEW.id IS DISTINCT FROM OLD.id`)
  is per-row and cheap; the write path on `items` is authoring/refit only and not hot.
- Any future grant edit re-opening table-level `UPDATE` on `items` no longer silently re-opens
  `items.id` — a reader must know the trigger exists. The DDL comment at the trigger states the
  whole story (including why the column REVOKE is absent) so the trap is not re-set.

### Neutral
- The migration stays a single replayed `SCHEMA_STATEMENTS`; CI's `rls-integration` job order
  (migration-check first, then the two real-mode specs) is unchanged.
- The two triggers add no API surface and no contract change; they are recorded in `CHANGELOG.md`
  as schema objects (the same way the `clip_renders` CHECK was), not as endpoints.

## Alternatives Considered

| Alternative | Verdict |
|---|---|
| **Per-column `GRANT UPDATE (col1, …, colN)` on `items`** (canonical ACL idiom for "everything except id") | Rejected: role-scoped only — `its_platform_admin` and the owner still bypass it; a 46-column grant drifts as the table evolves (a new column silently becomes unupdatable or updatable depending on which side you default); and it looks like the same grant algebra that produced the defect. |
| **Keep the column-level REVOKE** | Rejected on measurement: it is inert; keeping it in the DDL labeled I-2 is a trap for the next reader. |
| **Trigger on `items` (chosen)** | Accepted: all-role coverage; consistent with the `trg_append_only_guard` precedent and with the DDL's existing trigger set (I-3, D-5, G-8); testable by message; small surface. |

## References

- `CONSTITUTION.md` §4.6 (identifiers immutable; hash chain) — the promise
- `domain-model` X-3 / I-2 — the controls table
- `src/migrations/1791331200000-create-schema.ts` — the DDL (sections 12–13; trigger set)
- `scripts/migration-check.mjs` — the corrected assertions
- `tests/integration/rls-isolation.spec.ts`, `tests/integration/audit-append.spec.ts` — the
  owner-role assertions no grant-based control could satisfy
- P1.13 / ADR-028 §7b — the "constraint in the DDL, asserted by the gate" precedent