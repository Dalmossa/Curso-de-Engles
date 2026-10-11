#!/usr/bin/env node
/**
 * RLS Context Check (ADR-026 §3, §3b — the gate §3b promises)
 *
 * "One writer" is worth exactly what enforces it. `npm run domain:check` already fails a
 * forbidden import under `src/domain/`; the GUC `app.current_learner_id` is the symmetrical case
 * in `src/infrastructure/`, and this script is the same treatment rather than a review
 * convention. ADR-026 §3b, `data-model.erd.md` §9 rule 1, `domain-model.md` §2.2 (X-4).
 *
 * Rule 1 — the GUC name has exactly two legal homes.
 *   Any `.ts` file under `src/` that contains the literal `app.current_learner_id` must be either
 *     (a) src/infrastructure/persistence/pg-session-context.ts — the single writer (ADR-026 §1),
 *     (b) a file under `src/migrations/` — the ADR-019 create-schema migration, the only other
 *         artefact that may name the predicate it creates (ADR-026 §4).
 *   Anywhere else under `src/` is a violation, reported as `file:line` with the offending line.
 *   Repositories keep the `tx?: QueryRunner` shape and never set the GUC themselves (ADR-026 §2).
 *
 * Rule 2 — the writer must use the safe shape.
 *   In the writer file, `set_config('app.current_learner_id', $1, true)` must appear literally.
 *   `$1` is not stylistic: `SET LOCAL … || learnerId` would put a request-supplied string into a
 *   statement, which is the injection ADR-003's design exists to make impossible. And the third
 *   argument must never be `false`: a session-scoped context survives COMMIT, survives the
 *   connection's return to the pool, and the next learner checked out on that connection is then
 *   evaluated against the previous learner's id (ADR-026 §3, D3). A missing writer file is a
 *   FAILURE — "the writer is gone" is not "nothing to check".
 *
 * Rule 3 — the migration keeps `nullif`.
 *   Every file under `src/migrations/` that names the GUC must carry the predicate ADR-026 §4
 *   prescribes, `nullif(current_setting('app.current_learner_id', true), '')`. The GUC is `NULL`
 *   on a fresh session but `''` on every connection after its first learner-scoped transaction;
 *   `''::uuid` does not evaluate to NULL, it raises `invalid input syntax for type uuid: ""`. So
 *   without `nullif`, the *second* transaction on a warm pooled connection fails differently from
 *   the first — the failure mode depends on how many transactions preceded it.
 *
 * One deliberate tolerance, and only one: the migration builds its policy inside
 * `DO $$ … EXECUTE '…' … $$`, so the predicate's own single quotes are doubled there and the
 * shipped spelling is `nullif(current_setting(''app.current_learner_id'', true), '''')`. The
 * predicate check therefore accepts 1 or 2 quote characters per delimiter and nothing else — the
 * `nullif` wrapper, the function name, the GUC and both arguments are required verbatim.
 *
 * Usage: node scripts/rls-context-check.mjs
 * Exit: 0 = clean (prints files scanned), 1 = violations found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const SRC_ROOT = join(ROOT, 'src');
const MIGRATIONS_ROOT = join(SRC_ROOT, 'migrations');
const WRITER_FILE = join(SRC_ROOT, 'infrastructure', 'persistence', 'pg-session-context.ts');
const WRITER_REL = 'src/infrastructure/persistence/pg-session-context.ts';

const GUC = 'app.current_learner_id';

/** Rule 2 — the one shape the writer may ship: bind parameter `$1`, transaction-scoped `true`. */
const WRITER_SAFE_FORM = "set_config('app.current_learner_id', $1, true)";

/** Rule 2 — the session-scoped variant, rejected verbatim as ADR-026 §3b prescribes. */
const SESSION_SCOPED_FORM = /set_config\([^)]*app\.current_learner_id[^)]*,\s*false\s*\)/;

/** Rule 3 — ADR-026 §4's predicate, tolerant only of the `DO $$`/`EXECUTE` quote-doubling. */
const NULLIF_PREDICATE =
  /nullif\(\s*current_setting\(\s*'{1,2}app\.current_learner_id'{1,2}\s*,\s*true\s*\)\s*,\s*'{1,2}'{1,2}\s*\)/;

function findTsFiles(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findTsFiles(full));
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(full);
      }
    }
  } catch {
    // directory doesn't exist
  }
  return files;
}

function isLegalGucHome(file) {
  return file === WRITER_FILE || file.startsWith(MIGRATIONS_ROOT + '/');
}

/** Rule 1 — the GUC name lives in exactly two places. */
function checkRule1(file, lines) {
  const violations = [];
  if (isLegalGucHome(file)) return violations;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(GUC)) {
      violations.push({
        rule: 'Rule 1',
        file: relative(ROOT, file),
        line: i + 1,
        detail: `names ${GUC} but is neither the single writer nor a migration`,
        source: lines[i].trim(),
      });
    }
  }
  return violations;
}

/** Rule 2 — the writer exists, uses `$1`, and never `, false)`. */
function checkRule2() {
  const violations = [];
  if (!statSync(WRITER_FILE, { throwIfNoEntry: false })) {
    violations.push({
      rule: 'Rule 2',
      file: WRITER_REL,
      line: 0,
      detail: 'the single writer is missing entirely — the GUC has no writer (ADR-026 §1)',
      source: '',
    });
    return violations;
  }

  const content = readFileSync(WRITER_FILE, 'utf-8');
  if (!content.includes(WRITER_SAFE_FORM)) {
    violations.push({
      rule: 'Rule 2',
      file: WRITER_REL,
      line: 0,
      detail:
        'does not contain the bind-parameter form ' +
        `"SELECT set_config('app.current_learner_id', $1, true)" (ADR-026 §2)`,
      source: '',
    });
  }

  // The file must not match the session-scoped regex at all; report every line that matches it.
  const falseArgHits = content
    .split('\n')
    .map((line, i) => ({ line, i: i + 1 }))
    .filter(({ line }) => SESSION_SCOPED_FORM.test(line));

  if (falseArgHits.length === 0 && SESSION_SCOPED_FORM.test(content)) {
    violations.push({
      rule: 'Rule 2',
      file: WRITER_REL,
      line: 0,
      detail: 'contains a session-scoped set_config(…, false) — the context would outlive COMMIT (ADR-026 §3)',
      source: '',
    });
  }
  for (const hit of falseArgHits) {
    violations.push({
      rule: 'Rule 2',
      file: WRITER_REL,
      line: hit.i,
      detail: 'session-scoped set_config(…, false) — the context would outlive COMMIT (ADR-026 §3)',
      source: hit.line.trim(),
    });
  }
  return violations;
}

/** Rule 3 — the migration's predicate keeps `nullif`. */
function checkRule3(file, content) {
  if (!content.includes(GUC)) return [];
  if (NULLIF_PREDICATE.test(content)) return [];

  return [
    {
      rule: 'Rule 3',
      file: relative(ROOT, file),
      line: 0,
      detail:
        `names ${GUC} but the predicate is not ` +
        "nullif(current_setting('app.current_learner_id', true), '') — " +
        "the '' placeholder raises invalid input syntax for type uuid: \"\" on a warm connection " +
        '(ADR-026 §4)',
      source: '',
    },
  ];
}

function main() {
  if (!statSync(SRC_ROOT, { throwIfNoEntry: false })) {
    console.log('✓ src/ does not exist yet — nothing to check');
    return 0;
  }

  const files = findTsFiles(SRC_ROOT);
  const violations = [];

  for (const file of files) {
    violations.push(...checkRule1(file, readFileSync(file, 'utf-8').split('\n')));
  }
  violations.push(...checkRule2());
  for (const file of files.filter((f) => f.startsWith(MIGRATIONS_ROOT + '/'))) {
    violations.push(...checkRule3(file, readFileSync(file, 'utf-8')));
  }

  if (violations.length === 0) {
    console.log(
      `✓ RLS context check passed — ${files.length} file(s) scanned, 0 violations ` +
        `(single writer: ${WRITER_REL}, set_config(…, true))`,
    );
    return 0;
  }

  console.error('\n✗ RLS CONTEXT VIOLATIONS');
  console.error('========================');
  console.error(`ADR-026: \`${GUC}\` has exactly two legal homes — the single writer`);
  console.error(`${WRITER_REL} (written as \`set_config(…, $1, true)\`) and \`src/migrations/\`.`);
  console.error('The third argument of set_config is `true`, or the call is wrong (ADR-026 §3);');
  console.error("the migration's policy predicate keeps `nullif(…, '')` (ADR-026 §4).\n");

  for (const v of violations) {
    console.error(
      `  ${v.rule}  ${v.file}${v.line ? `:${v.line}` : ''}  →  ${v.detail}`,
    );
    if (v.source) console.error(`        ${v.source}`);
  }

  const filesWithViolations = new Set(violations.map((v) => v.file)).size;
  console.error(
    `\nTotal: ${violations.length} violation(s) in ${filesWithViolations} file(s), ${files.length} file(s) scanned`,
  );
  return 1;
}

process.exit(main());
