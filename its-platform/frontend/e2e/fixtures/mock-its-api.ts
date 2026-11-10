import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { join } from 'node:path';

import {
  FixtureProblem,
  LEARNER_ID_PATTERN,
  LEARNER_PROFILE,
  LESSONS,
  MASTERY,
  NEXT_ACTIVITY,
  PACK,
  scoreSubmission,
  type PracticeSubmissionDto,
} from './its-api';

/**
 * A fake ITS API, so the smoke flow is deterministic and depends on no running backend.
 *
 * The pages fetch server-side (`DirectApiGateway`, `server-only` — there is no BFF proxy,
 * see the frontend README), which means `page.route` cannot stand in for the API: the
 * request never leaves the Next.js server process. So the mock has to be a real HTTP
 * server, and it has to listen where the server under test is configured to look —
 * `ITS_API_BASE_URL`, resolved the same way Next.js resolves it (shell, then `.env.local`,
 * then the documented default).
 *
 * Every worker binds the port itself, with `SO_REUSEPORT` (see `bind`). That matters more
 * than it looks: the test runner stops a worker as soon as it has no more tests, so a mock
 * owned by a single worker is an API that disappears mid-run for everybody else — and it
 * disappears *quietly*, because the practice page treats an unreachable pack as "go back
 * to the lesson". A fixture outage then reads as a product defect on the wrong screen.
 */
const MOCK_ID = 'its-platform-e2e-mock';
const PING_PATH = '/__its_e2e__/ping';

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

export interface MockRequest {
  readonly method: string;
  readonly path: string;
}

export interface MockItsApi {
  readonly baseUrl: string;
  readonly origin: string;
  /**
   * The requests *this* process's listener happened to serve.
   *
   * A sample, not a complete log, and only when this worker holds its own listener: with
   * `SO_REUSEPORT` the kernel spreads connections across every worker's socket, and
   * without it the sibling that owns the port keeps them all.
   */
  readonly requests: readonly MockRequest[];
  /** True while *some* mock answers on the port — this worker's, or a sibling's. */
  isAlive: () => Promise<boolean>;
}

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

/** `.env.local` is the file `npm run dev` itself reads; its absence is not an error. */
function readEnvLocal(name: string): string | null {
  try {
    const contents = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
    const match = new RegExp(`^${name}=(.*)$`, 'm').exec(contents);
    const value = match?.[1]?.trim();
    return value === undefined || value === '' ? null : value;
  } catch {
    return null;
  }
}

export function resolveApiBaseUrl(): string {
  const explicit = process.env.ITS_API_BASE_URL?.trim();
  if (explicit !== undefined && explicit !== '') return stripTrailingSlashes(explicit);
  const fromFile = readEnvLocal('ITS_API_BASE_URL');
  return stripTrailingSlashes(fromFile ?? DEFAULT_API_BASE_URL);
}

async function pingMock(origin: string, prefix: string): Promise<boolean> {
  try {
    const response = await fetch(`${origin}${prefix}${PING_PATH}`, {
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return false;
    const body = (await response.json()) as { mock?: unknown };
    return body.mock === MOCK_ID;
  } catch {
    return false;
  }
}

/**
 * Bound to every interface rather than to the hostname in the URL: `localhost` resolves to
 * `::1` on some machines and `127.0.0.1` on others, and a mock listening on only one of the
 * two is a `ECONNREFUSED` that reads like a backend outage.
 */
function listen(server: Server, port: number, reusePort: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen({ port, reusePort }, () => {
      server.off('error', reject);
      resolve();
    });
  });
}

interface BindResult {
  /** Whether this process ended up holding a listener. */
  readonly owned: boolean;
  readonly error: unknown | null;
}

/**
 * Bind the port, preferring `SO_REUSEPORT`.
 *
 * `reusePort` is the point of this function. It lets *every* worker hold the port at the
 * same time — the fixtures are stateless and identical, so which socket accepts a
 * connection does not matter — and that is what stops one worker from taking the API down
 * for the others when the runner stops it between tests.
 *
 * It also keeps `EADDRINUSE` meaningful: a listener that did not ask for `reusePort` — the
 * real backend — still collides with us, which is the case the loud error below describes.
 *
 * On a platform where the option itself is refused, the plain bind is retried, and the
 * caller falls back to sharing a sibling's listener. That fallback is strictly worse (it
 * is the arrangement `reusePort` exists to avoid), so it is a last resort, not the design.
 */
async function bind(server: Server, port: number): Promise<BindResult> {
  try {
    await listen(server, port, true);
    return { owned: true, error: null };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE') return { owned: false, error };
    try {
      await listen(server, port, false);
      return { owned: true, error: null };
    } catch (plainError) {
      return { owned: false, error: plainError };
    }
  }
}

let current: Promise<MockItsApi> | null = null;

/**
 * The mock for this worker: its own listener, bound once per process.
 *
 * Never closed. With `SO_REUSEPORT` every worker has its own socket on the port, so closing
 * this one would be safe — but the fallback path borrows a sibling's listener, and a
 * borrowed listener is not ours to close. Releasing on process exit covers both.
 *
 * The liveness check is therefore a cheap assertion rather than a recovery path: `isAlive`
 * is true if *any* mock answers, so it stays true for as long as the fixture is up, and
 * the rebind below only fires if the whole port went away (a sibling's listener plus ours
 * dying together, i.e. an external kill).
 */
export async function ensureMockApi(): Promise<MockItsApi> {
  if (current !== null) {
    const existing = await current;
    if (await existing.isAlive()) return existing;
    current = null;
  }

  const pending = startMockApi();
  current = pending;
  try {
    return await pending;
  } catch (error) {
    current = null;
    throw error;
  }
}

async function startMockApi(): Promise<MockItsApi> {
  const baseUrl = resolveApiBaseUrl();
  const parsed = new URL(baseUrl);
  const origin = parsed.origin;
  const prefix = stripTrailingSlashes(parsed.pathname);
  const port = Number(parsed.port === '' ? (parsed.protocol === 'https:' ? 443 : 80) : parsed.port);

  const requests: MockRequest[] = [];
  const server = createServer((request, response) => {
    void serve(request, response, prefix, requests);
  });

  const bound = await bind(server, port);

  if (!bound.owned) {
    // No listener of our own. Two reasons, and only one of them is recoverable: the
    // platform refused `reusePort` and a sibling worker holds the port (share it — the
    // fixtures are identical), or something that is not this fixture is listening.
    if (await pingMock(origin, prefix)) {
      server.close();
      return { baseUrl, origin, requests, isAlive: () => pingMock(origin, prefix) };
    }

    if ((bound.error as NodeJS.ErrnoException | null)?.code === 'EADDRINUSE') {
      throw new Error(
        [
          `E2E: something is already listening on ${origin}${prefix} and it is not the fixture API`,
          `(the ITS backend itself, most likely). The smoke flow is meant to run against fixtures,`,
          `so it must not talk to a real backend, and it cannot bind the port either.`,
          ``,
          `Either stop that process, or point both the mock and the frontend elsewhere:`,
          `  ITS_API_BASE_URL=http://localhost:3010/api/v1 npm run dev`,
          `  ITS_API_BASE_URL=http://localhost:3010/api/v1 npx playwright test`,
        ].join('\n'),
      );
    }
    throw bound.error;
  }

  return { baseUrl, origin, requests, isAlive: () => pingMock(origin, prefix) };
}

function json(
  response: ServerResponse,
  status: number,
  body: unknown,
  contentType = 'application/json',
): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    'content-type': contentType,
    'content-length': Buffer.byteLength(payload),
    'cache-control': 'no-store',
    // One request per connection, deliberately.
    //
    // The app's `fetch` keeps sockets alive (~4 s), and this mock lives inside a Playwright
    // worker, which the runner stops as soon as it has no more tests. A kept-alive socket
    // outlives the worker that owns it, so the next request on it is an `ECONNRESET` that
    // the app can only render as an error page — an intermittent fixture failure dressed as
    // a product failure, at the exact moment a worker exits. Closing each connection costs
    // nothing here (a handful of requests against a local socket) and removes the window.
    connection: 'close',
  });
  response.end(payload);
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(raw === '' ? 'null' : raw);
  } catch {
    throw new FixtureProblem(400, 'Malformed body', 'The request body is not JSON.');
  }
}

async function serve(
  request: IncomingMessage,
  response: ServerResponse,
  prefix: string,
  requests: MockRequest[],
): Promise<void> {
  const path = new URL(request.url ?? '/', 'http://mock.its').pathname;
  const method = request.method ?? 'GET';
  requests.push({ method, path });

  try {
    if (prefix !== '' && path !== prefix && !path.startsWith(`${prefix}/`)) {
      throw new FixtureProblem(404, 'Not found', `The API lives under ${prefix}; received ${path}.`);
    }

    const segments = path
      .slice(prefix.length)
      .split('/')
      .filter((segment) => segment !== '');
    const [resource, identifier, action] = segments;

    if (resource === '__its_e2e__' && identifier === 'ping') {
      return json(response, 200, { mock: MOCK_ID, pid: process.pid });
    }

    if (resource === 'content' && identifier === 'lessons') {
      const lesson = LESSONS[action ?? ''];
      if (lesson === undefined) {
        throw new FixtureProblem(404, 'Lesson not found', `No lesson "${action ?? ''}" in this fixture.`);
      }
      return json(response, 200, lesson);
    }

    if (resource === 'content' && identifier === 'packs') {
      if (action !== PACK.pack_id) {
        throw new FixtureProblem(404, 'Pack not found', `No pack "${action ?? ''}" in this fixture.`);
      }
      return json(response, 200, PACK);
    }

    if (resource === 'learners') {
      const learnerId = identifier ?? '';
      if (!LEARNER_ID_PATTERN.test(learnerId)) {
        throw new FixtureProblem(400, 'Invalid learner id', `"${learnerId}" is not a UUID.`);
      }
      if (action === 'profile') return json(response, 200, { ...LEARNER_PROFILE, learner_id: learnerId });
      if (action === 'next') return json(response, 200, NEXT_ACTIVITY);
      if (action === 'mastery') return json(response, 200, MASTERY);
      if (action === 'practice') {
        if (method !== 'POST') {
          throw new FixtureProblem(405, 'Method not allowed', `${method} ${path} is not supported.`);
        }
        const body = (await readJson(request)) as PracticeSubmissionDto;
        return json(response, 200, scoreSubmission(body));
      }
    }

    throw new FixtureProblem(404, 'Not found', `${method} ${path} is not part of the fixture API.`);
  } catch (error) {
    const problem =
      error instanceof FixtureProblem
        ? error
        : new FixtureProblem(500, 'Fixture failure', `${String(error)}`);
    json(
      response,
      problem.status,
      {
        type: 'about:blank',
        title: problem.title,
        status: problem.status,
        detail: problem.detail,
        request_id: randomUUID(),
      },
      'application/problem+json',
    );
  }
}
