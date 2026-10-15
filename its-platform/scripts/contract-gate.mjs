#!/usr/bin/env node
/**
 * Contract gate — canonical spec × NestJS routes (ADR-040 D5).
 *
 * Replaced `contract-check.mjs` — deleted in A3, along with `scripts/contract-check-full.mjs` —
 * whose 31 lines asked only whether the obsolete document contained ten substrings. A0's N-4
 * proved on a copy that it PASSED with `components.schemas = {}`, with `POST` swapped for `GET`,
 * and with a path that exists in no controller. Those three mutations are cases in
 * `tests/contract/gate.spec.ts`, which runs THIS file.
 *
 * What it owns (ADR-040 D5.1): spec ↔ implementation. What it deliberately does
 * NOT own: instance × schema validation and the drift guard between the two
 * documents — both already live in `tests/contract/schemas.spec.ts`, and
 * duplicating them here would recreate the very defect (two copies of one
 * obligation) that ADR-040 exists to remove.
 *
 * Usage:
 *   node scripts/contract-gate.mjs [--spec <path>] [--src <dir>]
 *
 * `--spec`/`--src` exist so the negative controls can point the gate at a
 * mutated copy without editing the repository.
 */
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, relative, basename } from 'path';
import YAML from 'yaml';

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
};

const ROOT = process.cwd();
const SPEC_PATH = flag('spec', join(ROOT, 'docs', 'api-spec.openapi.yaml'));
const SRC_DIR = flag('src', join(ROOT, 'src'));

/**
 * Repo root — the pinned spec files (`specs/*.md`) are addressed relative to it,
 * and this process runs with its-platform as its cwd.
 */
function repoRoot() {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  } catch {
    return join(ROOT, '..');
  }
}

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];
const DECORATORS = { Get: 'get', Post: 'post', Put: 'put', Patch: 'patch', Delete: 'delete' };

/**
 * Routes that are implemented but intentionally absent from the contract.
 * An entry is only valid while its route still exists: the gate fails on a
 * stale exemption, so this list cannot accumulate dead permissions.
 */
const ROUTE_EXEMPTIONS = [
  {
    path: '/health',
    reason:
      'Liveness probe consumed by Kong and the orchestrator. §4.4 governs /api/v1; a probe is not a versioned API surface.',
  },
  {
    path: '/ready',
    reason: 'Readiness probe, same reasoning as /health.',
  },
];

const failures = [];
const fail = (rule, detail) => failures.push(`${rule}: ${detail}`);

// ---------------------------------------------------------------------------
// 1. The document must parse. This is the defect D2 removed: for the whole life
//    of the file, no tool consumed it because it was Markdown with a .yaml name.
// ---------------------------------------------------------------------------
if (!existsSync(SPEC_PATH)) {
  fail('spec', `not found: ${SPEC_PATH}`);
  report();
} else {
  let doc;
  try {
    doc = YAML.parse(readFileSync(SPEC_PATH, 'utf8'));
  } catch (error) {
    fail(
      'parse',
      `${relative(ROOT, SPEC_PATH)} is not parseable YAML: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (doc !== undefined) main(doc);
  else report();
}

// ---------------------------------------------------------------------------
// 2. Routes, read from the NestJS controllers.
// ---------------------------------------------------------------------------
function listControllers(dir) {
  const found = [];
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.controller.ts')) found.push(p);
    }
  };
  if (existsSync(dir)) walk(dir);
  return found.sort();
}

function extractRoutes(dir) {
  const routes = [];
  for (const file of listControllers(dir)) {
    const text = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
      .replace(/^[ \t]*\/\/.*$/gm, ''); // line comments
    const controllerMatch = text.match(/@Controller\s*\(([^)]*)\)/);
    if (!controllerMatch) continue;
    // `@Controller()`, `@Controller('auth')` and `@Controller({ version:
    // VERSION_NEUTRAL })` are all legal. Reading only the string form — as this
    // did until A2 — silently drops every route of an object-form controller,
    // and a dropped route does not fail the gate: it turns the route into a
    // "stale exemption". A gate that under-reads the implementation reports an
    // agreement it never checked.
    const args = controllerMatch[1];
    let prefix = '';
    const stringArg = args.match(/^\s*(?:'([^']*)'|"([^"]*)")/);
    if (stringArg) {
      prefix = stringArg[1] ?? stringArg[2] ?? '';
    } else {
      const pathProperty = args.match(/\bpath\s*:\s*(?:'([^']*)'|"([^"]*)")/);
      prefix = pathProperty ? (pathProperty[1] ?? pathProperty[2] ?? '') : '';
    }
    const decoratorRe = /@(Get|Post|Put|Patch|Delete)\s*\(\s*(?:'([^']*)'|"([^"]*)")?\s*\)/g;
    let match;
    while ((match = decoratorRe.exec(text)) !== null) {
      const verb = DECORATORS[match[1]];
      const suffix = match[2] ?? match[3] ?? '';
      routes.push({
        method: verb,
        path: `/${[prefix, suffix].filter(Boolean).join('/')}`,
        file: relative(ROOT, file),
      });
    }
  }
  return routes;
}

/** `/content/lessons/{lesson_id}` and `/content/lessons/:lesson_id` are the same route. */
function normalize(path) {
  return (
    '/' +
    path
      .split('/')
      .filter(Boolean)
      .map((segment) => (segment.startsWith('{') || segment.startsWith(':') ? '{}' : segment))
      .join('/')
  );
}

// ---------------------------------------------------------------------------
// The checks.
// ---------------------------------------------------------------------------
function main(doc) {
  // --- shape ---------------------------------------------------------------
  if (typeof doc.openapi !== 'string' || !doc.openapi.startsWith('3.1')) {
    fail('spec', `openapi must be a 3.1.x version string, found ${JSON.stringify(doc.openapi)}`);
  }

  const schemas = doc.components?.schemas;
  if (schemas === null || typeof schemas !== 'object' || Object.keys(schemas).length === 0) {
    // A0's N-4a: the old gate passed with this mutation.
    fail('schemas', 'components.schemas is empty or missing');
  }

  const paths = doc.paths;
  if (paths === null || typeof paths !== 'object' || Object.keys(paths).length === 0) {
    fail('paths', 'paths is empty or missing');
    report();
    return;
  }

  // --- servers must carry the §4.4 version prefix --------------------------
  const servers = Array.isArray(doc.servers) ? doc.servers : [];
  if (servers.length === 0) fail('servers', 'no servers declared');
  for (const server of servers) {
    if (typeof server?.url !== 'string') {
      fail('servers', `server without a url: ${JSON.stringify(server)}`);
      continue;
    }
    let pathname;
    try {
      pathname = new URL(server.url).pathname;
    } catch {
      fail('servers', `not an absolute URL: ${server.url}`);
      continue;
    }
    if (pathname.replace(/\/+$/, '') !== '/api/v1') {
      fail('servers', `${server.url} does not end in /api/v1 (CONSTITUTION §4.4)`);
    }
  }

  // --- every $ref must resolve (D5.2, minus the spectral ruleset) ----------
  for (const ref of collectRefs(doc)) {
    if (resolvePointer(doc, ref) === undefined) {
      fail('$ref', `${ref} does not resolve`);
    }
  }

  // --- Problem must exist and carry the RFC 9457 core members (D5.5) -------
  const problem = schemas?.Problem;
  if (problem === undefined) {
    fail('Problem', 'components.schemas.Problem is missing (ADR-034, CONSTITUTION §4.3)');
  } else {
    for (const member of ['type', 'title', 'status']) {
      if (problem.properties?.[member] === undefined) {
        fail('Problem', `Problem.properties.${member} is missing (ADR-034 D2)`);
      }
    }
  }

  // --- the derived contract declares the revision it derived FROM (D6) ------
  // `Curso-de-Ingles/specs/*.md` is the source of truth (ADR-018); this document
  // is derived. Without the pin, drift between a spec and the OpenAPI is not
  // detectable: both look correct, which is why nobody looked before A0.
  const provenance = doc.info?.['x-contract-provenance'];
  if (provenance === null || typeof provenance !== 'object') {
    fail('pin', 'info.x-contract-provenance is missing (ADR-040 D6)');
  } else {
    if (
      typeof provenance['derived-at'] !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(provenance['derived-at'])
    ) {
      fail(
        'pin',
        `derived-at must be an ISO date, found ${JSON.stringify(provenance['derived-at'])}`,
      );
    }
    const blobs = provenance['spec-blobs'];
    if (blobs === null || typeof blobs !== 'object' || Object.keys(blobs).length === 0) {
      fail('pin', 'spec-blobs is empty — the pin would verify nothing');
    } else {
      const root = repoRoot();
      for (const [file, expected] of Object.entries(blobs)) {
        const absolute = join(root, file);
        if (!existsSync(absolute)) {
          fail('pin', `${file} is pinned but does not exist`);
          continue;
        }
        let actual;
        try {
          actual = execFileSync('git', ['hash-object', absolute], { encoding: 'utf8' }).trim();
        } catch {
          fail('pin', `${file} could not be hashed (is this a git repository?)`);
          continue;
        }
        if (actual !== expected) {
          fail(
            'pin',
            `${file} changed since the contract was derived (pinned ${String(expected).slice(0, 12)}, actual ${actual.slice(0, 12)}) — review the diff and re-derive before moving the pin`,
          );
        }
      }
    }
  }

  // --- no boolean Deprecation header (D5.4, ADR-033 D2) --------------------
  for (const { path, value } of collectKeys(doc, /^deprecation$/i)) {
    const schema = value?.schema ?? value;
    const isBoolean =
      schema?.type === 'boolean' ||
      typeof schema?.const === 'boolean' ||
      (Array.isArray(schema?.enum) && schema.enum.some((v) => typeof v === 'boolean'));
    if (isBoolean) {
      fail(
        'Deprecation',
        `${path} declares the boolean form; RFC 9745 §2.1 requires a Date (RFC 9651 §3.3.7, serialised @<unix-seconds>) — the boolean is the retired draft form. CONSTITUTION §4.4 v2.2.0 mandates the date form`,
      );
    }
  }

  // --- error responses and resource 404s ----------------------------------
  for (const [path, item] of Object.entries(paths)) {
    const hasParameter = /\{[^}]+\}/.test(path);
    for (const [verb, operation] of Object.entries(item)) {
      if (!HTTP_METHODS.includes(verb)) continue;
      if (operation.responses === null || typeof operation.responses !== 'object') {
        fail('responses', `${verb.toUpperCase()} ${path} declares no responses`);
        continue;
      }
      for (const [status, response] of Object.entries(operation.responses)) {
        if (!/^[45]\d\d$/.test(status)) continue;
        const mediaTypes = Object.keys(response?.content ?? {});
        if (mediaTypes.length === 0) {
          fail('error media type', `${verb.toUpperCase()} ${path} ${status} declares no content`);
        }
        for (const mediaType of mediaTypes) {
          if (mediaType !== 'application/problem+json') {
            fail(
              'error media type',
              `${verb.toUpperCase()} ${path} ${status} serves ${mediaType}; CONSTITUTION §4.3 mandates application/problem+json`,
            );
            continue;
          }
          // §4.3 makes `Problem` the *sole* error shape, and serving the right media type with
          // a different schema is the failure the media-type check alone cannot see. This
          // obligation used to live only in `tests/contract/endpoints.spec.ts` (it asserted the
          // `$ref` per error response); A3 removed that file as subsumed and moved its one
          // unique assertion here, where the media type is already being read.
          const ref = response.content?.[mediaType]?.schema?.['$ref'];
          if (typeof ref !== 'string' || resolvePointer(doc, ref) !== problem) {
            fail(
              'Problem',
              `${verb.toUpperCase()} ${path} ${status} does not reference components.schemas.Problem (CONSTITUTION §4.3, ADR-034)`,
            );
          }
        }
      }
      // R6: reading another learner's object answers 404, so every read of a
      // resource with an identifier must publish that answer.
      if (verb === 'get' && hasParameter && !('404' in operation.responses)) {
        fail('404', `GET ${path} declares no 404 (R6/ADR-038)`);
      }
    }
  }

  // --- spec × implementation, both directions (D5.3) and method (D5.6) ----
  const specOperations = new Map();
  for (const [path, item] of Object.entries(paths)) {
    specOperations.set(
      normalize(path),
      new Set(Object.keys(item).filter((k) => HTTP_METHODS.includes(k))),
    );
  }

  const implemented = new Map();
  for (const route of extractRoutes(SRC_DIR)) {
    const key = normalize(route.path);
    if (!implemented.has(key)) implemented.set(key, { methods: new Set(), paths: new Set() });
    implemented.get(key).methods.add(route.method);
    implemented.get(key).paths.add(route.path);
  }

  for (const [key, methods] of specOperations) {
    const impl = implemented.get(key);
    if (impl === undefined) {
      fail('spec path has no route', `${key} is published but no controller implements it`);
      continue;
    }
    const missing = [...methods].filter((m) => !impl.methods.has(m));
    const extra = [...impl.methods].filter((m) => !methods.has(m));
    if (missing.length > 0 || extra.length > 0) {
      // A0's N-4b: the old gate passed with POST swapped for GET.
      fail(
        'method',
        `${key}: spec=[${[...methods].sort().join(',')}] implementation=[${[...impl.methods].sort().join(',')}]`,
      );
    }
  }

  const exemptions = new Map(ROUTE_EXEMPTIONS.map((e) => [normalize(e.path), e]));
  for (const [key, route] of implemented) {
    if (specOperations.has(key)) continue;
    if (exemptions.has(key)) continue;
    for (const path of route.paths) {
      fail(
        'route not in spec',
        `${path} is implemented but absent from the canonical spec (${[...route.methods].sort().join(',')})`,
      );
    }
  }
  for (const [key, exemption] of exemptions) {
    if (!implemented.has(key)) {
      fail('stale exemption', `${exemption.path} is exempted but no controller implements it`);
    }
  }

  // --- §4.4 as applied by the application itself ---------------------------
  // The spec's `servers` carry /api/v1, and the route comparison above is
  // deliberately prefix-agnostic (spec paths are relative to `servers`). That
  // leaves one way for the contract to be true on paper and false in
  // production: the application stops mounting the prefix. Assert it here.
  //
  // Read over the composition roots rather than over `main.ts` alone: A4 moved
  // the configuration into `src/app.setup.ts` (`configureApp`), which `main.ts`
  // *and* `tests/integration/error-response.spec.ts` call, so the pipeline the
  // integration test exercises is the one that ships. Which file holds the calls
  // does not matter; that one of them does, and that `main.ts` reaches it, is
  // the obligation. Controls: N-16, N-17, N-19.
  const mainFile = join(SRC_DIR, 'main.ts');
  const roots = ['main.ts', 'app.setup.ts']
    .map((name) => join(SRC_DIR, name))
    .filter((file) => existsSync(file));
  if (!existsSync(mainFile)) {
    fail('prefix', `main.ts not found under ${SRC_DIR}`);
  } else if (roots.length === 0) {
    fail('prefix', `no composition root under ${SRC_DIR} (looked for main.ts, app.setup.ts)`);
  } else {
    const where = roots.map((file) => basename(file)).join(' + ');
    const config = roots.map((file) => readFileSync(file, 'utf8')).join('\n');
    if (!/setGlobalPrefix\s*\(\s*'api'/.test(config)) {
      fail('prefix', `${where} does not call setGlobalPrefix('api') (CONSTITUTION §4.4)`);
    }
    if (!/enableVersioning\s*\(/.test(config) || !/VersioningType\.URI/.test(config)) {
      fail(
        'prefix',
        `${where} does not enable URI versioning (CONSTITUTION §4.4 prohibits header and query versioning)`,
      );
    }
    if (!/defaultVersion\s*:\s*'1'/.test(config)) {
      fail('prefix', `${where} does not declare defaultVersion '1' (§4.4 defines /api/v1)`);
    }
    // The configuration has to reach the application from `main.ts` — either
    // inline, or through the function that holds it. Without this, a correct
    // `app.setup.ts` that nothing calls would satisfy every rule above.
    const main = readFileSync(mainFile, 'utf8');
    if (!/setGlobalPrefix\s*\(\s*'api'/.test(main) && !/configureApp\s*\(/.test(main)) {
      fail(
        'prefix',
        "main.ts neither applies the §4.4 prefix nor calls the function that does (configureApp)",
      );
    }
  }

  report();
}

function report() {
  if (failures.length > 0) {
    for (const failure of failures) console.log(`FAIL: ${failure}`);
    console.log(`FAIL: contract gate — ${failures.length} violation(s)`);
    process.exit(1);
  }
  console.log(
    `PASS: contract gate — canonical spec parses, servers carry /api/v1, ` +
      `every error response serves application/problem+json and references Problem, ` +
      `and spec × routes agree in both directions`,
  );
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function collectRefs(node, out = []) {
  if (node === null || typeof node !== 'object') return out;
  if (typeof node.$ref === 'string') out.push(node.$ref);
  for (const value of Object.values(node)) collectRefs(value, out);
  return out;
}

function resolvePointer(doc, ref) {
  if (!ref.startsWith('#/')) return undefined;
  let current = doc;
  for (const segment of ref.slice(2).split('/')) {
    const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
    if (current === null || typeof current !== 'object' || !(key in current)) return undefined;
    current = current[key];
  }
  return current;
}

function collectKeys(node, pattern, path = '#', out = []) {
  if (node === null || typeof node !== 'object') return out;
  for (const [key, value] of Object.entries(node)) {
    const here = `${path}/${key}`;
    if (pattern.test(key)) out.push({ path: here, value });
    collectKeys(value, pattern, here, out);
  }
  return out;
}
