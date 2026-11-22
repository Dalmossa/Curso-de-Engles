import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ALLOWED_PREFIX = 'catalog/render/';
const CLIP_PATH_RE = /^catalog\/render\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+$/;

function getUpstreamBase(): string {
  const env = process.env.AUDIO_BASE_URL ?? process.env.NEXT_PUBLIC_AUDIO_BASE_URL ?? 'http://192.168.0.6:3200';
  return env.trim().replace(/\/+$/, '');
}

function safeJoinPath(parts: string[]): string | null {
  if (parts.length === 0) return null;
  if (parts.some((p) => !p || p === '.' || p === '..' || p.includes('\\'))) return null;
  const joined = parts.join('/');
  if (!joined.startsWith(ALLOWED_PREFIX)) return null;
  if (!CLIP_PATH_RE.test(joined)) return null;
  return joined;
}

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const safePath = safeJoinPath(path ?? []);
  if (!safePath) {
    return NextResponse.json({ error: 'invalid_media_path' }, { status: 400 });
  }

  const upstream = `${getUpstreamBase()}/${safePath}`;
  const range = req.headers.get('range');
  const headers: HeadersInit = {};
  if (range) headers.Range = range;

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstream, {
      method: req.method === 'HEAD' ? 'HEAD' : 'GET',
      headers,
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ error: 'media_upstream_unavailable' }, { status: 502 });
  }

  const respHeaders = new Headers();
  const contentType = upstreamRes.headers.get('content-type');
  const contentLength = upstreamRes.headers.get('content-length');
  const contentRange = upstreamRes.headers.get('content-range');
  const acceptRanges = upstreamRes.headers.get('accept-ranges');
  const cacheControl = upstreamRes.headers.get('cache-control');

  if (contentType) respHeaders.set('Content-Type', contentType);
  if (contentLength) respHeaders.set('Content-Length', contentLength);
  if (contentRange) respHeaders.set('Content-Range', contentRange);
  respHeaders.set('Accept-Ranges', acceptRanges ?? 'bytes');
  respHeaders.set('Cache-Control', cacheControl ?? 'public, max-age=3600');
  respHeaders.set('X-Content-Type-Options', 'nosniff');

  return new NextResponse(req.method === 'HEAD' ? null : upstreamRes.body, {
    status: upstreamRes.status,
    headers: respHeaders,
  });
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context);
}

export async function HEAD(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context);
}
