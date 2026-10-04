---
adr: 003
title: PostgreSQL Row-Level Security for multi-tenancy
status: Accepted
date: 2026-10-03
authors: [@platform-lead, @backend-lead]
deciders: [@platform-lead, @backend-lead, @security-lead]
consulted: [@db-admin]
informed: [@team]
tags: [database, security, rls, multi-tenancy, postgresql]
---

## Context

The ITS Platform stores all learner data in a single PostgreSQL database (multi-tenant). Each learner must only access their own data. Requirements:

- **Zero-trust** — even compromised service account cannot cross learner boundaries
- **Defense in depth** — application bugs shouldn't leak data
- **Audit compliance** — LGPD/GDPR require technical enforcement
- **Performance** — RLS policies must not add significant latency
- **Simplicity** — application code shouldn't need `WHERE learner_id = $1` on every query

## Decision

**Enable PostgreSQL Row-Level Security (RLS) on all learner-scoped tables.**

### Implementation

```sql
-- Enable RLS on all learner-scoped tables
ALTER TABLE learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE theta_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsrs_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables with learner_id

-- Policy: learners see only their own rows
CREATE POLICY learner_isolation ON learners
  FOR ALL TO its_platform_app
  USING (id = current_setting('app.current_learner_id')::uuid)
  WITH CHECK (id = current_setting('app.current_learner_id')::uuid);

CREATE POLICY learner_isolation ON mastery
  FOR ALL TO its_platform_app
  USING (learner_id = current_setting('app.current_learner_id')::uuid)
  WITH CHECK (learner_id = current_setting('app.current_learner_id')::uuid);

-- ... repeat for all tables

-- Admin role bypasses RLS
CREATE POLICY admin_bypass ON learners
  FOR ALL TO its_platform_admin
  USING (true) WITH CHECK (true);

-- Service-to-service (workers) use explicit learner_id
CREATE POLICY worker_access ON mastery
  FOR ALL TO its_platform_worker
  USING (true) WITH CHECK (true);
```

### Application Integration

```python
# FastAPI dependency
async def set_learner_context(learner_id: UUID, db: AsyncSession):
    await db.execute(text("SET LOCAL app.current_learner_id = :lid"), {"lid": str(learner_id)})

# Usage in endpoint
@router.get("/me/profile")
async def get_profile(
    learner_id: UUID = Depends(get_current_learner_id),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(set_learner_context),
):
    # No WHERE learner_id needed — RLS handles it
    result = await db.execute(select(Learner).where(Learner.id == learner_id))
    return result.scalar_one()
```

## Consequences

### Positive
- **Guaranteed isolation** — even `SELECT * FROM mastery` returns only current learner
- **Defense in depth** — SQL injection, ORM bugs, forgotten WHERE clauses cannot leak data
- **Compliance** — technical control for LGPD Art. 46, GDPR Art. 32
- **Simpler app code** — no repetitive `WHERE learner_id = $1`
- **Auditable** — `pg_policies` shows enforcement

### Negative
- **Performance overhead** — ~1-3% per query (measured); mitigated by indexes on `learner_id`
- **Migration complexity** — existing tables need `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- **Debugging** — `SET LOCAL` must be set per transaction; easy to forget in scripts
- **Connection pooling** — PgBouncer transaction pooling required (not statement pooling)

### Neutral
- **Admin/Worker roles** — need separate DB roles for bypass
- **Cascade deletes** — RLS applies to FK cascades; verify `ON DELETE CASCADE` works

## Alternatives Considered

1. **Application-level only** — `WHERE learner_id = $1` everywhere; human error risk
2. **Separate schemas per learner** — unmanageable at scale (10k+ learners)
3. **Separate databases per learner** — operational nightmare
4. **Views with security_barrier** — more complex, same effect
5. **PostgreSQL Row Security (pre-9.5)** — not available; we're on 16+

## Implementation Plan

- [x] Enable RLS on all learner-scoped tables in migration `003_enable_rls.sql`
- [x] Create policies for `learner`, `admin`, `worker` roles
- [x] Create DB roles: `its_platform_app`, `its_platform_admin`, `its_platform_worker`
- [x] Grant minimal privileges per role
- [x] Add `set_learner_context` FastAPI dependency
- [x] Integration tests: verify cross-learner query returns 0 rows
- [ ] Load test: RLS overhead < 3% p95
- [ ] Document in `CONTRIBUTING.md`: always use dependency, never raw SQL with learner_id

## References

- `security-spec.md` §2.3 — Data classification
- `threat-model.md` §3.4 — Information Disclosure I-04
- PostgreSQL RLS docs: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- `data-model.erd.md` — Table definitions