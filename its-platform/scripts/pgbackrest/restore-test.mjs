#!/usr/bin/env node
/**
 * pgBackRest Weekly Restore Test (P2.6 / ADR-009)
 *
 * This script runs as a weekly CI job to verify backup integrity:
 * 1. Creates a temporary PostgreSQL cluster
 * 2. Runs pgBackRest delta restore from latest backup
 * 3. Runs integrity checks (checksums, row counts, data freshness)
 * 4. Cleans up
 *
 * Exit codes: 0 = PASS, 1 = FAIL
 */

import { execFileSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const FAILURES = [];
function fail(msg) { FAILURES.push(msg); console.error(`❌ ${msg}`); }
function pass(msg) { console.log(`✅ ${msg}`); }
function info(msg) { console.log(`ℹ️  ${msg}`); }

function run(cmd, args, opts = {}) {
  try {
    const out = execFileSync(cmd, args, { encoding: 'utf8', ...opts });
    return { success: true, output: out.trim() };
  } catch (err) {
    return { success: false, error: err.message, stderr: err.stderr?.toString() };
  }
}

async function main() {
  const env = process.env.NODE_ENV || 'dev';
  const stanza = env; // dev, staging, prod
  const s3Bucket = process.env.PGBACKREST_S3_BUCKET || `its-platform-pgbackrest-${env}`;
  const s3Region = process.env.PGBACKREST_S3_REGION || 'us-east-1';
  const s3AccessKey = process.env.AWS_ACCESS_KEY_ID;
  const s3SecretKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!s3AccessKey || !s3SecretKey) {
    fail('AWS credentials not provided (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)');
    return 1;
  }

  const tmpDir = mkdtempSync(join(tmpdir(), 'pgbackrest-restore-'));
  info(`Working directory: ${tmpDir}`);

  try {
    // 1. Create pgBackRest config
    const configPath = join(tmpDir, 'pgbackrest.conf');
    const config = `
[global]
repo1-type=s3
repo1-path=/its-platform-backups/${env}
repo1-s3-bucket=${s3Bucket}
repo1-s3-region=${s3Region}
repo1-cipher-type=aes-256-cbc
compress-type=zstd
compress-level=3
process-max=4

[global:archive]
repo1-retention-full=30
repo1-retention-diff=7
repo1-retention-archive=7

[${env}]
pg1-path=${join(tmpDir, 'pgdata')}
pg1-port=5432
`;
    writeFileSync(configPath, config);
    info('Created pgBackRest config');

    // 2. Initialize temporary PostgreSQL cluster
    const pgData = join(tmpDir, 'pgdata');
    run('initdb', ['-D', pgData, '--auth=trust', '--encoding=UTF8', '--locale=C']);
    pass('Initialized temporary PostgreSQL cluster');

    // Start PostgreSQL
    const pgProc = spawn('postgres', ['-D', pgData, '-p', '5433'], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    pgProc.stdout.on('data', d => { if (d.toString().includes('database system is ready')) pgProc.emit('ready'); });
    await new Promise((resolve, reject) => {
      pgProc.once('ready', resolve);
      setTimeout(() => reject(new Error('PostgreSQL startup timeout')), 30000);
    });
    pass('Started PostgreSQL on port 5433');

    // 3. Run pgBackRest restore (delta restore from latest backup)
    info('Running pgBackRest delta restore...');
    const restoreResult = run('pgbackrest', [
      '--stanza', env,
      '--type=time',
      '--target-time', new Date(Date.now() - 3600000).toISOString().replace('T', ' ').slice(0, 19),
      '--delta',
      '--log-level-console=info',
      'restore'
    ], { env: { ...process.env, PGBACKREST_CONFIG: configPath, AWS_ACCESS_KEY_ID: s3AccessKey, AWS_SECRET_ACCESS_KEY: s3SecretKey } });

    if (!restoreResult.success) {
      fail(`Restore failed: ${restoreResult.stderr || restoreResult.error}`);
      return 1;
    }
    pass('Delta restore completed');

    // 4. Start restored PostgreSQL
    const restoredProc = spawn('postgres', ['-D', join(tmpDir, 'pgdata'), '-p', '5434'], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    restoredProc.stdout.on('data', d => { if (d.toString().includes('database system is ready')) restoredProc.emit('ready'); });
    await new Promise((resolve, reject) => {
      restoredProc.once('ready', resolve);
      setTimeout(() => reject(new Error('Restored PostgreSQL startup timeout')), 30000);
    });
    pass('Started restored PostgreSQL on port 5434');

    // 5. Run integrity checks
    info('Running integrity checks...');

    // Check 1: pg_verify_checksums
    const checksumResult = run('pg_verify_checksums', ['-D', join(tmpDir, 'pgdata')]);
    if (!checksumResult.success) {
      fail(`Checksum verification failed: ${checksumResult.stderr}`);
      return 1;
    }
    pass('Page checksums verified');

    // Check 2: Row counts on critical tables
    const { Pool } = await import('pg');
    const pool = new Pool({ host: 'localhost', port: 5434, database: 'postgres', user: 'postgres', password: '' });
    
    const tables = [
      'learners',
      'learner_mastery',
      'practice_attempts',
      'diagnostic_results',
      'items',
      'packs',
      'lessons'
    ];

    for (const table of tables) {
      const result = await pool.query(`SELECT count(*) FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      if (count === 0) {
        fail(`Table ${table} has 0 rows after restore`);
        await pool.end();
        return 1;
      }
      info(`Table ${table}: ${count} rows`);
    }
    pass('Critical tables have data');

    // Check 3: Data freshness - practice_attempts within last 2 hours
    const freshnessResult = await pool.query(`
      SELECT max(completed_at) as latest FROM practice_attempts
    `);
    const latest = new Date(freshnessResult.rows[0].latest);
    const hoursSince = (Date.now() - latest.getTime()) / (1000 * 60 * 60);
    if (hoursSince > 2) {
      fail(`Data freshness check failed: latest practice_attempt is ${hoursSince.toFixed(1)} hours old`);
      await pool.end();
      return 1;
    }
    pass(`Data freshness OK: latest practice_attempt ${hoursSince.toFixed(1)} hours ago`);

    await pool.end();

    // 6. Cleanup
    pgProc.kill();
    restoredProc.kill();
    rmSync(tmpDir, { recursive: true, force: true });

    pass('All restore test checks passed!');
    return 0;

  } catch (err) {
    fail(`Unexpected error: ${err.message}`);
    if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
    return 1;
  }
}

process.exit(await main());
