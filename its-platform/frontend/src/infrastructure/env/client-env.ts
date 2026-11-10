import { z } from 'zod';

/**
 * Public environment — the variables Next inlines into the browser bundle.
 *
 * Each member is written as a literal `process.env.NEXT_PUBLIC_…` member expression,
 * because that is the only form Next's build-time replacement recognises. Reading
 * `process.env` dynamically or destructuring it would leave the expression in place and
 * the value `undefined` at runtime — the classic Next environment footgun
 * (`nextjs-env-config`).
 *
 * **There is deliberately no `NEXT_PUBLIC_*_API_URL`.** The browser has no path to the
 * NestJS API and no token to present to it: reads happen in Server Components and writes
 * in Server Actions, both of which reach the API from the server (see
 * `src/infrastructure/api/direct-gateway.server.ts`). A public base URL would be an
 * invitation to add the one code path the architecture forbids. When the PWA gains
 * offline replay it will need a same-origin BFF, and that variable belongs to that change.
 */
const ClientEnvSchema = z.object({
  /** Public origin of this app, for absolute metadata URLs. Optional in development. */
  NEXT_PUBLIC_APP_URL: z.url().optional(),
});

export type ClientEnv = z.infer<typeof ClientEnvSchema>;

let cached: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  if (cached) return cached;

  const parsed = ClientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    // Not `server-only` copy: this one *can* fail in the browser, and when it does the
    // message has to say so plainly instead of blaming a missing server variable.
    throw new Error(`Invalid public environment (NEXT_PUBLIC_*):\n${problems}`);
  }

  cached = parsed.data;
  return cached;
}

export function resetClientEnvCache(): void {
  cached = null;
}
