import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * P1.15 — Create consents table for LGPD granular consent management.
 *
 * This migration adds the `consents` table for granular consent management per LGPD Art. 7, 8.
 * The existing `consent_records` table is kept for audit/historical purposes.
 *
 * RLS policy: learner_id = current_setting('app.current_learner_id')::uuid
 * Unique constraint: one active consent per learner+purpose (where withdrawn_at IS NULL)
 */

export const CONSENTS_SCHEMA_STATEMENTS: string[] = [
  // ------------------------------------------------------------------
  // Consents table (LGPD granular consent management)
  // ------------------------------------------------------------------
  `CREATE TABLE consents (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id        UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    purpose           VARCHAR(60) NOT NULL,
    granted           BOOLEAN NOT NULL DEFAULT false,
    granted_at        TIMESTAMPTZ,
    withdrawn_at      TIMESTAMPTZ,
    version           VARCHAR(20) NOT NULL DEFAULT '1.0',
    ip_hash           TEXT,
    user_agent        TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (granted_at IS NOT NULL OR withdrawn_at IS NOT NULL),
    CHECK (NOT granted OR granted_at IS NOT NULL),
    CHECK (NOT granted OR withdrawn_at IS NULL)
  )`,

  // Unique active consent per learner+purpose
  `CREATE UNIQUE INDEX uq_consents_learner_purpose_active
    ON consents (learner_id, purpose)
    WHERE granted = true AND withdrawn_at IS NULL`,

  // Indexes for common queries
  `CREATE INDEX idx_consents_learner ON consents (learner_id, created_at DESC)`,
  `CREATE INDEX idx_consents_purpose ON consents (purpose)`,
  `CREATE INDEX idx_consents_withdrawn ON consents (withdrawn_at) WHERE withdrawn_at IS NOT NULL`,

  // Updated_at trigger
  `CREATE FUNCTION fn_consents_updated_at() RETURNS trigger AS $$
  BEGIN
    NEW.updated_at := now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  `CREATE TRIGGER trg_consents_updated_at
    BEFORE UPDATE ON consents
    FOR EACH ROW EXECUTE FUNCTION fn_consents_updated_at()`,

  // ------------------------------------------------------------------
  // RLS Policies (ADR-003)
  // ------------------------------------------------------------------
  `ALTER TABLE consents ENABLE ROW LEVEL SECURITY`,

  `CREATE POLICY learner_isolation ON consents FOR ALL TO its_platform_app
    USING (learner_id = nullif(current_setting('app.current_learner_id', true), '')::uuid)
    WITH CHECK (learner_id = nullif(current_setting('app.current_learner_id', true), '')::uuid)`,

  `CREATE POLICY admin_bypass ON consents FOR ALL TO its_platform_admin USING (true) WITH CHECK (true)`,

  `CREATE POLICY worker_access ON consents FOR ALL TO its_platform_worker USING (true) WITH CHECK (true)`,

  // ------------------------------------------------------------------
  // Grants
  // ------------------------------------------------------------------
  `GRANT SELECT, INSERT, UPDATE, DELETE ON consents TO its_platform_app`,
  `GRANT SELECT, INSERT, UPDATE, DELETE ON consents TO its_platform_worker`,
  `GRANT ALL ON consents TO its_platform_admin`,
  `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO its_platform_app, its_platform_worker`,
];

export class CreateConsentsTable1800000000000 implements MigrationInterface {
  name = 'CreateConsentsTable1800000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const statement of CONSENTS_SCHEMA_STATEMENTS) {
      await queryRunner.query(statement);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop policies
    await queryRunner.query(`DROP POLICY IF EXISTS learner_isolation ON consents`);
    await queryRunner.query(`DROP POLICY IF EXISTS admin_bypass ON consents`);
    await queryRunner.query(`DROP POLICY IF EXISTS worker_access ON consents`);
    await queryRunner.query(`ALTER TABLE consents DISABLE ROW LEVEL SECURITY`);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS consents CASCADE`);

    // Drop function
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_consents_updated_at()`);
  }
}
