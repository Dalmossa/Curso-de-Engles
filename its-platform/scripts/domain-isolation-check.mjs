#!/usr/bin/env node
/**
 * Domain Isolation Check (P0.2)
 *
 * Enforces ADR-014: the domain layer must not depend on infrastructure.
 * Any file under `src/domain/` importing `typeorm` or `@nestjs/*` fails the build.
 *
 * Usage: node scripts/domain-isolation-check.mjs
 * Exit: 0 = clean, 1 = violations found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DOMAIN_ROOT = join(ROOT, 'src', 'domain');

const FORBIDDEN_PATTERNS = [
  { pattern: /from\s+['"]typeorm['"]/, name: 'typeorm' },
  { pattern: /import\s+.*\s+from\s+['"]typeorm['"]/, name: 'typeorm' },
  { pattern: /require\(['"]typeorm['"]\)/, name: 'typeorm' },
  { pattern: /from\s+['"]@nestjs\/[\w/-]+['"]/, name: '@nestjs/*' },
  { pattern: /import\s+.*\s+from\s+['"]@nestjs\/[\w/-]+['"]/, name: '@nestjs/*' },
  { pattern: /require\(['"]@nestjs\/[\w/-]+['"]\)/, name: '@nestjs/*' },
];

function findDomainFiles(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findDomainFiles(full));
      } else if (['.ts', '.js'].includes(extname(entry.name))) {
        files.push(full);
      }
    }
  } catch {
    // directory doesn't exist
  }
  return files;
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { pattern, name } of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        const trimmed = line.trimStart();
        if (!trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
          violations.push({
            file: relative(ROOT, filePath),
            violation: `imports ${name}`,
            line: i + 1,
          });
        }
      }
    }
  }
  return violations;
}

function main() {
  try {
    statSync(DOMAIN_ROOT, { throwIfNoEntry: false });
  } catch {
    console.log('✓ src/domain/ does not exist yet — nothing to check');
    return 0;
  }

  const files = findDomainFiles(DOMAIN_ROOT);
  if (files.length === 0) {
    console.log('✓ src/domain/ exists but contains no .ts/.js files');
    return 0;
  }

  let allViolations = [];
  for (const file of files) {
    allViolations.push(...checkFile(file));
  }

  if (allViolations.length === 0) {
    console.log(`✓ Domain isolation check passed — ${files.length} file(s) scanned, 0 violations`);
    return 0;
  }

  console.error('\n✗ DOMAIN ISOLATION VIOLATIONS');
  console.error('===============================');
  console.error('Files under src/domain/ must not import typeorm or @nestjs/*');
  console.error('Move infrastructure concerns to src/infrastructure/ or src/application/\n');

  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line}  →  ${v.violation}`);
  }
  console.error(`\nTotal: ${allViolations.length} violation(s) in ${new Set(allViolations.map(v => v.file)).size} file(s)`);
  return 1;
}

process.exit(main());