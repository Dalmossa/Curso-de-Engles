import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

describe('OpenAPI endpoints contract - comprehensive', () => {
  let spec: any;
  
  beforeAll(() => {
    // Re-pointed to the canonical document in A2 (ADR-040). This file used to
    // validate `docs/api/openapi.yaml`, the deprecated predecessor, so its
    // assertions described the document nobody publishes.
    const specPath = join(process.cwd(), 'docs', 'api-spec.openapi.yaml');
    const specContent = readFileSync(specPath, 'utf8');
    spec = yaml.parse(specContent);
  });

  const endpoints = [
    { path: '/content/lessons/{lesson_id}', methods: ['get'] },
    { path: '/content/packs/{pack_id}', methods: ['get'] },
    { path: '/content/listening/{dialogue_id}', methods: ['get'] },
    { path: '/content/listening/{dialogue_id}/audio', methods: ['get'] },
    { path: '/learners/{learner_id}/placement', methods: ['post'] },
    { path: '/learners/{learner_id}/next', methods: ['get'] },
    { path: '/learners/{learner_id}/practice', methods: ['post'] },
    { path: '/learners/{learner_id}/profile', methods: ['get'] },
    { path: '/learners/{learner_id}/mastery', methods: ['get'] },
    { path: '/auth/refresh', methods: ['post'] },
  ];

  endpoints.forEach(({ path, methods }) => {
    methods.forEach(method => {
      it(`should define ${method.toUpperCase()} ${path}`, () => {
        expect(spec.paths).toHaveProperty(path);
        expect(spec.paths[path]).toHaveProperty(method);
      });

      it(`${method.toUpperCase()} ${path} should have responses`, () => {
        const operation = spec.paths[path][method];
        expect(operation.responses).toBeDefined();
        expect(Object.keys(operation.responses).length).toBeGreaterThan(0);
      });
    });
  });

  // Every error response must carry a `Problem` body (RFC 9457, CONSTITUTION §4.3).
  //
  // This replaces a block that asserted the opposite: it required
  // `content['application/json']` on the 400 response, which is how the defect
  // ADR-034 D4 fixes stayed protected by a test. It also asserted
  // `expect(responses).toHaveProperty('400')` inside a branch guarded by
  // `responses['400'] || responses['404']`, so any path publishing only a 404
  // failed on a 400 that was never required.
  //
  // The media type itself (`application/problem+json`) is enforced by
  // `scripts/contract-gate.mjs` (ADR-040 D5.7). It is deliberately NOT asserted
  // again here: a second copy of one obligation is the failure mode ADR-040
  // exists to remove (D5.1).
  it('should reference the Problem schema from every error response', () => {
    const verbs = ['get', 'post', 'put', 'patch', 'delete'];
    let checked = 0;
    for (const [path, item] of Object.entries<any>(spec.paths)) {
      for (const [method, operation] of Object.entries<any>(item)) {
        if (!verbs.includes(method)) continue;
        for (const [status, response] of Object.entries<any>(operation.responses ?? {})) {
          if (!/^[45]\d\d$/.test(status)) continue;
          const mediaTypes = Object.values<any>(response.content ?? {});
          expect(mediaTypes.length).toBeGreaterThan(0);
          for (const mediaType of mediaTypes) {
            expect(mediaType.schema?.$ref).toBe('#/components/schemas/Problem');
          }
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('should have 404 error responses for resource endpoints', () => {
    const resourcePaths = [
      '/content/lessons/{lesson_id}',
      '/content/packs/{pack_id}',
      '/content/listening/{dialogue_id}',
      '/content/listening/{dialogue_id}/audio',
      '/learners/{learner_id}/profile',
      '/learners/{learner_id}/mastery',
    ];
    resourcePaths.forEach(path => {
      if (spec.paths[path] && spec.paths[path].get) {
        const responses = spec.paths[path].get.responses;
        expect(responses).toHaveProperty('404');
      }
    });
  });
});
