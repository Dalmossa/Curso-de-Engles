import type { NextRequest } from 'next/server';

/**
 * Resolve the public origin for redirects from the incoming request.
 *
 * When the dev server binds to 0.0.0.0 (LAN access), internal request URLs can carry
 * 0.0.0.0 as host, which is a bind address and not a valid client destination. Prefer
 * the client-facing Host/X-Forwarded-* headers so redirects work from phones on the LAN.
 */
export function getRequestOrigin(req: NextRequest): string {
  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto || req.nextUrl.protocol.replace(':', '') || 'http';

  const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || req.headers.get('host') || req.nextUrl.host;

  const bindAll = /^(0\.0\.0\.0|\[?::\]?)(:\d+)?$/i;
  let safeHost = host;
  if (bindAll.test(safeHost)) {
    const fallback = req.nextUrl.host;
    safeHost = bindAll.test(fallback) ? fallback.replace(/^(0\.0\.0\.0|\[?::\]?)/i, 'localhost') : fallback;
  }
  if (bindAll.test(safeHost)) {
    safeHost = 'localhost';
  }

  return `${proto}://${safeHost}`;
}

export function redirectTo(req: NextRequest, path: string): URL {
  return new URL(path, getRequestOrigin(req));
}
