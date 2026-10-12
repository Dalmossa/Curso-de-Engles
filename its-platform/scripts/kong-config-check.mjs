#!/usr/bin/env node
/**
 * Kong Config Check (BACKLOG P2.3 — ADR-030 §D2–D7)
 *
 * The P2.3 acceptance is "per-learner 100/min, per-IP 1000/min, enforced at
 * the gateway". ADR-030 turns that sentence into a machine-checked declarative
 * contract in iac/kong/kong.yml, and this script is the gate that enforces it
 * (ADR-030 D7) — the same family as `contract:check` / `domain:check`.
 *
 * The assertions, mapped to ADR-030:
 *   1.  kong.yml exists and parses as YAML (D7).
 *   2.  `_format_version` is "3.0" — the Kong declarative schema version (D7).
 *   3.  `_transform: true` — deck rewrites plugin defaults into the explicit,
 *       per-plugin config DB-less Kong expects at runtime (D7).
 *   4.  No pre-ADR-012 upstream survives in the ACTIVE file: curriculum-service,
 *       adaptive-engine and auth-service may appear only in comment lines. The
 *       header comment legitimately records that the trio is gone (D1); the
 *       active YAML — service names, urls, plugin config — must never reference
 *       it. The raw text is therefore scanned with comment lines excluded.
 *   5.  Exactly one upstream — the NestJS monolith `its-platform-api` (D1).
 *   6.  Every route keeps `strip_path: false` — the API has no global prefix
 *       and @Controller() paths are served as-is (D1).
 *   7.  Route coverage derives from docs/api/openapi.yaml: every first path
 *       segment must be served by some route, and the /health + /ready probes
 *       must exist (D1, D7 — P0.8).
 *   8.  The three layers exist with the exact limit_by/minute (D2, D3):
 *       service per-IP 1000/min (D-06), /learners per-consumer 100/min (P2.3
 *       acceptance, latent until auth lands), /auth per-IP 5/min (S-03).
 *   9.  Every rate-limiting plugin is Redis-backed with placeholder secrets
 *       (D6): policy redis, non-empty redis_host, integer redis_database
 *       (DB 2), boolean fault_tolerant (fail-open), headers true, and
 *       redis_username / redis_password exactly ${KONG_REDIS_*} — a literal
 *       secret anywhere fails the gate (D6/D7).
 *
 * Paths resolve against process.cwd() because npm runs this script from
 * its-platform/ (package.json script `kong:check`), matching the other
 * scripts/ gates.
 *
 * Usage: node scripts/kong-config-check.mjs
 * Exit: 0 = PASS, 1 = one or more FAIL
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const KONG_FILE = join(process.cwd(), 'iac', 'kong', 'kong.yml');
const OPENAPI_FILE = join(process.cwd(), 'docs', 'api', 'openapi.yaml');

/** Pre-ADR-012 split upstreams — allowed in comment lines only (ADR-030 D1). */
const LEGACY_SERVICES = ['curriculum-service', 'adaptive-engine', 'auth-service'];

const FAILURES = [];

function fail(message) {
  FAILURES.push(message);
}

function report(failures) {
  for (const failure of failures) {
    console.log(`FAIL: ${failure}`);
  }
  return 1;
}

function main() {
  // ---- 1. Parse ---------------------------------------------------------
  let raw;
  try {
    raw = readFileSync(KONG_FILE, 'utf-8');
  } catch (err) {
    fail(`cannot read kong config ${KONG_FILE}: ${err.message}`);
    return report(FAILURES);
  }

  let doc;
  try {
    doc = YAML.parse(raw);
  } catch (err) {
    fail(`kong.yml does not parse as YAML: ${err.message}`);
    return report(FAILURES);
  }

  // ---- 2. Declarative schema version ------------------------------------
  if (doc._format_version !== '3.0' && String(doc._format_version) !== '3.0') {
    fail(`_format_version is ${JSON.stringify(doc._format_version)}, expected "3.0" (ADR-030 D7)`);
  }

  // ---- 3. Transform flag ------------------------------------------------
  if (doc._transform !== true) {
    fail(`_transform is ${JSON.stringify(doc._transform)}, expected true (ADR-030 D7)`);
  }

  // ---- 4. No legacy upstream in the active file --------------------------
  // Comment lines may name the pre-ADR-012 trio to record that it is gone;
  // active YAML must never reference it (ADR-030 D1/D7).
  const activeText = raw
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .join('\n');
  for (const legacy of LEGACY_SERVICES) {
    if (activeText.includes(legacy)) {
      fail(`kong.yml references legacy upstream "${legacy}" in active config (pre-ADR-012; ADR-030 D1)`);
    }
  }

  // ---- 5. Exactly one upstream: the NestJS monolith ----------------------
  const services = Array.isArray(doc.services) ? doc.services : [];
  if (services.length !== 1) {
    fail(`expected exactly 1 service, found ${services.length} (ADR-030 D1)`);
  }
  const svc = services[0] ?? {};
  if (svc.name !== 'its-platform-api') {
    fail(`service name is ${JSON.stringify(svc.name)}, expected "its-platform-api" (ADR-030 D1)`);
  }
  if (typeof svc.url !== 'string' || !svc.url.includes('its-platform-api')) {
    fail(`service url is ${JSON.stringify(svc.url)}, expected to contain "its-platform-api" (ADR-030 D1)`);
  }

  const routes = Array.isArray(svc.routes) ? svc.routes : [];

  // ---- 6. Every route is prefix-less -------------------------------------
  for (const route of routes) {
    if (route.strip_path !== false) {
      fail(
        `route ${JSON.stringify(route.name)} strip_path is ${JSON.stringify(route.strip_path)}, expected false (ADR-030 D1)`,
      );
    }
  }

  // ---- 7. Route coverage from docs/api/openapi.yaml -----------------------
  let openapiRaw = '';
  try {
    openapiRaw = readFileSync(OPENAPI_FILE, 'utf-8');
  } catch (err) {
    fail(`cannot read openapi spec ${OPENAPI_FILE}: ${err.message}`);
  }

  const segments = new Set();
  for (const line of openapiRaw.split('\n')) {
    const match = /^  (\/(?:[a-zA-Z0-9_-]+))/.exec(line);
    if (match) segments.add(match[1]);
  }
  const routePaths = new Set(routes.flatMap((route) => route.paths ?? []));
  for (const segment of segments) {
    if (!routePaths.has(segment)) {
      fail(`no kong route covers openapi first segment "${segment}" (ADR-030 D7)`);
    }
  }
  for (const probe of ['/health', '/ready']) {
    if (!routePaths.has(probe)) {
      fail(`no kong route for ${probe} probe (P0.8; ADR-030 D7)`);
    }
  }

  // ---- 8. The three rate-limiting layers ----------------------------------
  const servicePlugins = Array.isArray(svc.plugins) ? svc.plugins : [];
  const isRateLimit = (plugin) => Boolean(plugin) && plugin.name === 'rate-limiting';

  const serviceLayer = servicePlugins.find(
    (plugin) => isRateLimit(plugin) && plugin.config?.limit_by === 'ip' && plugin.config?.minute === 1000,
  );
  if (!serviceLayer) {
    fail(
      'service-level layer missing or wrong: rate-limiting limit_by "ip", minute 1000 (ADR-030 D2; threat D-06 flood)',
    );
  }

  const learnersRoute = routes.find((route) => (route.paths ?? []).includes('/learners'));
  const learnersLayer = (learnersRoute?.plugins ?? []).find(
    (plugin) => isRateLimit(plugin) && plugin.config?.limit_by === 'consumer' && plugin.config?.minute === 100,
  );
  if (!learnersLayer) {
    fail(
      '/learners route layer missing or wrong: rate-limiting limit_by "consumer", minute 100 (ADR-030 D2; P2.3 acceptance)',
    );
  }

  const authRoute = routes.find((route) => (route.paths ?? []).includes('/auth'));
  const authLayer = (authRoute?.plugins ?? []).find(
    (plugin) => isRateLimit(plugin) && plugin.config?.limit_by === 'ip' && plugin.config?.minute === 5,
  );
  if (!authLayer) {
    fail('/auth route layer missing or wrong: rate-limiting limit_by "ip", minute 5 (ADR-030 D2; S-03 stuffing)');
  }

  // ---- 9. Every rate-limiting plugin is Redis-backed with placeholders ------
  const rateLimitPlugins = [];
  for (const plugin of servicePlugins) {
    if (isRateLimit(plugin)) rateLimitPlugins.push({ plugin, location: 'service its-platform-api' });
  }
  for (const route of routes) {
    for (const plugin of route.plugins ?? []) {
      if (isRateLimit(plugin)) rateLimitPlugins.push({ plugin, location: `route ${JSON.stringify(route.name)}` });
    }
  }

  for (const { plugin, location } of rateLimitPlugins) {
    const config = plugin.config ?? {};
    if (config.policy !== 'redis') {
      fail(`rate-limiting on ${location}: policy ${JSON.stringify(config.policy)}, expected "redis" (ADR-030 D6)`);
    }
    if (typeof config.redis_host !== 'string' || config.redis_host.length === 0) {
      fail(`rate-limiting on ${location}: redis_host must be a non-empty string (ADR-030 D6)`);
    }
    if (!Number.isInteger(config.redis_database)) {
      fail(
        `rate-limiting on ${location}: redis_database must be an integer, got ${JSON.stringify(config.redis_database)} (ADR-030 D6)`,
      );
    }
    if (typeof config.fault_tolerant !== 'boolean') {
      fail(
        `rate-limiting on ${location}: fault_tolerant must be a boolean, got ${JSON.stringify(config.fault_tolerant)} (ADR-030 D6)`,
      );
    }
    if (config.headers !== true) {
      fail(`rate-limiting on ${location}: headers must be true (client rate-limit headers)`);
    }
    if (!/^\$\{KONG_REDIS_USERNAME\}$/.test(config.redis_username ?? '')) {
      fail(
        'rate-limiting on ' +
          location +
          ': redis_username must be the ${KONG_REDIS_USERNAME} placeholder, never a literal (ADR-030 D6)',
      );
    }
    if (!/^\$\{KONG_REDIS_PASSWORD\}$/.test(config.redis_password ?? '')) {
      fail(
        'rate-limiting on ' +
          location +
          ': redis_password must be the ${KONG_REDIS_PASSWORD} placeholder, never a literal (ADR-030 D6)',
      );
    }
  }

  // ---- Result --------------------------------------------------------------
  if (FAILURES.length > 0) {
    return report(FAILURES);
  }
  console.log(
    `PASS: Kong config checks (${services.length} service, ${routes.length} routes, ` +
      `${rateLimitPlugins.length} rate-limiting plugins, 9 assertions)`,
  );
  return 0;
}

process.exit(main());