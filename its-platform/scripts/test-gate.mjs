#!/usr/bin/env node
/**
 * Test Gate — allowlist by ID (R11 / D-0, ADR-021).
 *
 * `npm test` runs the whole suite and exits 1 while P1.3 is not done, so on its
 * own it cannot distinguish "the 5 known failures" from "a new regression".
 * This gate runs Jest once, reads its JSON report, and asserts that the set of
 * failing tests is EXACTLY the ratified allowlist in
 * `tests/allowlist/known-failures.json`:
 *
 *   - a failure that is not in the allowlist  -> FAIL (new regression)
 *   - an allowlisted test that now passes     -> FAIL (stale entry: someone
 *                                                fixed P1.3 and must retire the
 *                                                line, or a test was renamed)
 *   - a suite that fails to run (hook timeout, import error) -> FAIL
 *
 * The second rule is the point: an allowlist that is never re-validated decays
 * into a suppression list. This one cannot, because passing tests make it red.
 *
 * This gate is only trustworthy because the PGlite hook timeout was fixed:
 * before that, suite-level failures appeared in 1 of 3 runs (see `jest.config.ts`
 * `testTimeout` and the A2 report §"flake").
 *
 * Usage: node scripts/test-gate.mjs
 * Exit: 0 = the failing set equals the allowlist; 1 = anything else
 */

import { readFileSync, existsSync, rmSync, mkdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { execFileSync } from 'child_process';

const ROOT = process.cwd();
// `TEST_GATE_ALLOWLIST` exists so the negative controls can point the gate at a
// mutated copy without editing the ratified file. See the A2 report §"controles
// negativos".
const ALLOWLIST_PATH = process.env.TEST_GATE_ALLOWLIST
  ? process.env.TEST_GATE_ALLOWLIST
  : join(ROOT, 'tests', 'allowlist', 'known-failures.json');
const REPORT_PATH = join(ROOT, 'coverage', 'test-gate-report.json');

if (!existsSync(ALLOWLIST_PATH)) {
  console.error(`FAIL: allowlist not found: ${ALLOWLIST_PATH}`);
  process.exit(1);
}

const allowlist = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
const allowed = new Set((allowlist.entries ?? []).map((e) => `${e.file}::${e.name}`));

// --- Run Jest once, capturing the machine-readable report -------------------
const jest = join(ROOT, 'node_modules', 'jest', 'bin', 'jest.js');
mkdirSync(dirname(REPORT_PATH), { recursive: true });
try {
  execFileSync(process.execPath, ['--experimental-vm-modules', jest, '--json', `--outputFile=${REPORT_PATH}`], {
    cwd: ROOT,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
} catch {
  // A non-zero exit is expected while the allowlisted failures exist; the report
  // is what we judge, not the exit code.
}

if (!existsSync(REPORT_PATH)) {
  console.error('FAIL: jest produced no JSON report (did the run crash?)');
  process.exit(1);
}
const report = JSON.parse(readFileSync(REPORT_PATH, 'utf8'));
rmSync(REPORT_PATH, { force: true });

// --- Collect the observed failures ------------------------------------------
const observed = new Map();
for (const suite of report.testResults ?? []) {
  const file = relative(ROOT, suite.name);
  const assertions = suite.assertionResults ?? [];
  const hasFailedAssertion = assertions.some((a) => a.status === 'failed');
  for (const a of assertions) {
    if (a.status === 'failed') observed.set(`${file}::${a.fullName}`, 'test');
  }
  if (suite.status === 'failed' && !hasFailedAssertion) {
    observed.set(`${file}::<suite>`, 'suite');
  }
}

// --- Compare against the allowlist -----------------------------------------
const unexpected = [...observed.keys()].filter((k) => !allowed.has(k)).sort();
const stale = [...allowed].filter((k) => !observed.has(k)).sort();

if (unexpected.length > 0) {
  for (const k of unexpected) {
    console.log(`FAIL: ${observed.get(k) === 'suite' ? 'suite failed to run' : 'test failed'}: ${k}`);
  }
}
if (stale.length > 0) {
  for (const k of stale) {
    console.log(`FAIL: allowlisted but now passing — retire this line: ${k}`);
  }
}

if (unexpected.length > 0 || stale.length > 0) {
  console.log(
    `FAIL: test gate — ${unexpected.length} unexpected, ${stale.length} stale, ` +
      `${allowed.size} allowlisted (ADR-021 / D-0)`,
  );
  process.exit(1);
}

console.log(
  `PASS: test gate — failing set equals the allowlist (${allowed.size} known-red from ADR-021); ` +
    `${report.numPassedTests} passed, ${report.numTotalTests} total`,
);
