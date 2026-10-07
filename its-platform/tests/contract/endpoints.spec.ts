import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

describe('OpenAPI endpoints contract - comprehensive', () => {
  let spec: any;
  
  beforeAll(() => {
    const specPath = join(process.cwd(), 'docs', 'api', 'openapi.yaml');
    const specContent = readFileSync(specPath, 'utf8');
    spec = yaml.parse(specContent);
  });

  const endpoints = [
    { path: '/content/lessons/{lesson_id}', methods: ['get'] },
    { path: '/content/packs/{pack_id}', methods: ['get'] },
    { path: '/content/listening/{dialogue_id}', methods: ['get'] },
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

  it('should have 400 error response schemas defined', () => {
    const paths = spec.paths;
    for (const path of Object.keys(paths)) {
      for (const method of Object.keys(paths[path])) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          const responses = paths[path][method].responses;
          // Check for common error responses
          if (responses['400'] || responses['404']) {
            expect(responses).toHaveProperty('400');
            expect(responses['400'].content['application/json']).toBeDefined();
          }
        }
      }
    }
  });

  it('should have 404 error responses for resource endpoints', () => {
    const resourcePaths = [
      '/content/lessons/{lesson_id}',
      '/content/packs/{pack_id}',
      '/content/listening/{dialogue_id}',
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
