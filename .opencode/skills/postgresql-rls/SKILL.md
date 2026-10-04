---
name: PostgreSQL RLS
description: Row-Level Security policies, multi-tenancy, learner isolation for ITS Platform
---

# PostgreSQL RLS Skill — ITS Platform

## When to Use
- Implementing row-level security on learner-scoped tables
- Creating policies for different roles (learner, admin, worker)
- Testing RLS isolation
- Debugging policy issues

## Core Principle

**All learner-scoped tables MUST have RLS enabled** with policies that enforce `learner_id = current_setting('app.current_learner_id')::uuid`

## Implementation

### 1. Enable RLS on All Learner-Scoped Tables

```sql
-- Core tables with RLS
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
```

### 2. Policy: Learner Isolation

```sql
-- Policy: learners see only their own rows
CREATE POLICY learner_isolation ON learners
    FOR ALL TO its_platform_app
    USING (id = current_setting('app.current_learner_id')::uuid)
    WITH CHECK (id = current_setting('app.current_learner_id')::uuid);

CREATE POLICY learner_isolation ON mastery
    FOR ALL TO its_platform_app
    USING (learner_id = current_setting('app.current_learner_id')::uuid)
    WITH CHECK (learner_id = current_setting('app.current_learner_id')::uuid);

CREATE POLICY learner_isolation ON theta_estimates
    FOR ALL TO its_platform_app
    USING (learner_id = current_setting('app.current_learner_id')::uuid)
    WITH CHECK (learner_id = current_setting('app.current_learner_id')::uuid);

-- Repeat for ALL learner-scoped tables
```

### 3. Admin Role Bypass

```sql
-- Admin role bypasses RLS
CREATE POLICY admin_bypass ON learners
    FOR ALL TO its_platform_admin
    USING (true) WITH CHECK (true);

CREATE POLICY admin_bypass ON mastery
    FOR ALL TO its_platform_admin
    USING (true) WITH CHECK (true);

-- Repeat for all tables
```

### 4. Worker Role (Explicit learner_id)

```sql
-- Service-to-service (workers) use explicit learner_id
CREATE POLICY worker_access ON mastery
    FOR ALL TO its_platform_worker
    USING (true) WITH CHECK (true);

CREATE POLICY worker_access ON theta_estimates
    FOR ALL TO its_platform_worker
    USING (true) WITH CHECK (true);

-- Repeat for all tables
```

### 5. Role Creation & Grants

```sql
-- Create roles
CREATE ROLE its_platform_app NOLOGIN;
CREATE ROLE its_platform_admin NOLOGIN;
CREATE ROLE its_platform_worker NOLOGIN;

-- Grant minimal privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO its_platform_app;
GRANT ALL ON ALL TABLES IN SCHEMA public TO its_platform_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO its_platform_worker;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO its_platform_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO its_platform_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO its_platform_worker;
```

## Application Integration

### FastAPI Dependency

```python
# its_platform/dependencies.py
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

async def set_learner_context(learner_id: UUID, db: AsyncSession):
    """Set the current learner_id for RLS policies"""
    await db.execute(
        text("SET LOCAL app.current_learner_id = :lid"),
        {"lid": str(learner_id)}
    )

async def get_current_learner_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> UUID:
    # Validate JWT, extract learner_id
    learner_id = verify_jwt(credentials.credentials)
    await set_learner_context(learner_id, db)
    return learner_id
```

### Usage in Endpoint

```python
# its_platform/api/v1/mastery.py
@router.get("/me/mastery")
async def get_mastery(
    learner_id: UUID = Depends(get_current_learner_id),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(set_learner_context),
):
    # No WHERE learner_id needed — RLS handles it
    result = await db.execute(select(Mastery).where(Mastery.learner_id == learner_id))
    return result.scalars().all()
```

## Testing RLS Isolation

```python
# tests/integration/test_rls_isolation.py
import pytest
from its_platform.db.models import Learner, Mastery
from its_platform.db.session import get_db

@pytest.mark.asyncio
async def test_learner_a_cannot_read_learner_b_mastery():
    async with get_db() as db:
        # Create two learners
        learner_a = await create_learner(db, "learner_a")
        learner_b = await create_learner(db, "learner_b")
        
        # Create mastery for learner_b
        mastery_b = Mastery(learner_id=learner_b.id, skill_id="grammar.present_simple", mastery=0.9)
        db.add(mastery_b)
        await db.commit()
        
        # Set context to learner_a
        await db.execute(text("SET LOCAL app.current_learner_id = :lid"), {"lid": str(learner_a.id)})
        
        # Query should return 0 rows (RLS blocks access to learner_b's data)
        result = await db.execute(select(Mastery))
        masteries = result.scalars().all()
        
        assert len(masteries) == 0  # RLS isolation works!

@pytest.mark.asyncio
async def test_admin_bypasses_rls():
    async with get_db() as db:
        # Set admin role
        await db.execute(text("SET ROLE its_platform_admin"))
        
        # Admin should see all data
        result = await db.execute(select(Mastery))
        masteries = result.scalars().all()
        
        assert len(masteries) > 0  # Admin sees all learners' data
```

## Common Issues & Debugging

### Issue: RLS Not Working
```sql
-- Check if RLS is enabled
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'mastery';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'mastery';

-- Check current setting
SHOW app.current_learner_id;
```

### Issue: Policy Not Applied
```sql
-- Verify role membership
SELECT current_user, current_role;

-- Check if policy applies to role
SELECT * FROM pg_policies WHERE tablename = 'mastery' AND roles @> ARRAY['its_platform_app'];
```

### Issue: Performance Overhead
- RLS adds ~1-3% overhead per query
- Ensure indexes on `learner_id` for all RLS tables
- Use `EXPLAIN ANALYZE` to verify index usage

```sql
-- Check index usage
EXPLAIN ANALYZE SELECT * FROM mastery WHERE learner_id = 'uuid-here';
```

## Validation Checklist
- [ ] RLS enabled on ALL learner-scoped tables
- [ ] Policies for `its_platform_app` (learner isolation)
- [ ] Policies for `its_platform_admin` (bypass)
- [ ] Policies for `its_platform_worker` (explicit access)
- [ ] Roles created with minimal privileges
- [ ] Integration test: learner A cannot read learner B's data
- [ ] Integration test: admin bypasses RLS
- [ ] Integration test: worker can access with explicit learner_id
- [ ] Indexes on `learner_id` for all RLS tables
- [ ] Performance overhead < 3%