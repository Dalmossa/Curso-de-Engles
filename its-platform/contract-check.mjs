#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';

const specPath = join(process.cwd(), 'docs', 'api', 'openapi.yaml');
const spec = readFileSync(specPath, 'utf8');

// Basic checks
if (!spec.includes('openapi: 3.1')) {
  console.error('FAIL: not OpenAPI 3.1');
  process.exit(1);
}
const required = [
  '/content/lessons/{lesson_id}',
  '/content/packs/{pack_id}',
  '/content/listening/{dialogue_id}',
  '/learners/{learner_id}/placement',
  '/learners/{learner_id}/next',
  '/learners/{learner_id}/practice',
  '/learners/{learner_id}/profile',
  '/learners/{learner_id}/mastery',
  '/auth/refresh',
];
for (const r of required) {
  if (!spec.includes(r)) {
    console.error(`FAIL: missing ${r}`);
    process.exit(1);
  }
}
console.log('PASS: OpenAPI contract checks');
