import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Add password reset token columns to users table.
 *
 * Supports the "forgot password" flow with single-use, time-limited tokens.
 * Tokens are stored as SHA-256 hashes (not plaintext) with a 30-minute TTL.
 * Each user can have at most one active reset token at a time.
 */

export class AddPasswordResetColumns1802000000000 implements MigrationInterface {
  name = 'AddPasswordResetColumns1802000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns for password reset token (hashed) and expiration
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN reset_token_hash VARCHAR(64),
      ADD COLUMN reset_token_expires_at TIMESTAMPTZ
    `);

    // Add index for token lookup (hashed lookup)
    await queryRunner.query(`
      CREATE INDEX idx_users_reset_token_hash ON users (reset_token_hash)
      WHERE reset_token_hash IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_reset_token_hash`);
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS reset_token_hash,
      DROP COLUMN IF EXISTS reset_token_expires_at
    `);
  }
}
