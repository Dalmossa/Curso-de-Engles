import 'server-only';

import { z } from 'zod';

/**
 * Server-only environment.
 *
 * `import 'server-only'` makes Next fail the *build* if this module ever reaches a
 * client bundle, which is the enforcement behind the rule in `nextjs-env-config`:
 * a variable with no `NEXT_PUBLIC_` prefix is not merely undocumented on the client,
 * it is unavailable there. The bearer token belongs to this module and nowhere else.
 *
 * Validation is lazy rather than at import time so that `next build` does not fail on
 * a machine that has no runtime configuration — but it is cached, and it throws, so a
 * misconfiguration surfaces as a clear message on the first request rather than as a
 * `undefined` string interpolated into a URL.
 */
const ServerEnvSchema = z.object({
  /**
   * The NestJS API, including the `/api/v1` prefix. A trailing slash is stripped
   * during normalisation rather than rejected, because both spellings are common and
   * a double slash would 404 in a way that is tedious to diagnose.
   */
  ITS_API_BASE_URL: z.url(),
  /** Empty string is treated as absent: an unset token means "send no Authorization header". */
  ITS_API_TOKEN: z
    .string()
    .optional()
    .transform((value) => (value === undefined || value.trim() === '' ? null : value.trim())),
  /** Mocked learner identity until ADR-013 closes. Must be a UUID — the API validates it. */
  ITS_LEARNER_ID: z.uuid(),
  ITS_API_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(10_000),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = ServerEnvSchema.safeParse({
    ITS_API_BASE_URL: process.env.ITS_API_BASE_URL,
    ITS_API_TOKEN: process.env.ITS_API_TOKEN,
    ITS_LEARNER_ID: process.env.ITS_LEARNER_ID,
    ITS_API_TIMEOUT_MS: process.env.ITS_API_TIMEOUT_MS,
  });

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Invalid server environment:\n${problems}\n\nCopy .env.example to .env.local and fill it in.`,
    );
  }

  cached = {
    ...parsed.data,
    ITS_API_BASE_URL: parsed.data.ITS_API_BASE_URL.replace(/\/+$/, ''),
  };
  return cached;
}

/** Test seam: lets a suite assert on a bad environment without leaking state into the next one. */
export function resetServerEnvCache(): void {
  cached = null;
}
