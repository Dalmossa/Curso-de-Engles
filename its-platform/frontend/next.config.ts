import type { NextConfig } from 'next';

/**
 * The browser never talks to the NestJS API directly and never holds a token
 * (ADR-013 leaves the token story open, so the frontend keeps it server-side and
 * exposes the API through the BFF at `/api/its`). `connect-src 'self'` below is
 * therefore the strict and correct policy, not an oversight.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Signed clip URLs are served by an origin that differs per environment
  // (DialogueAudioClip.url declares only the scheme), so `https:` is the
  // narrowest honest allow-list.
  "media-src 'self' blob: https:",
  "connect-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
].join('; ');

/**
 * Dev is excluded from the CSP on purpose: the dev server needs `unsafe-eval`
 * and a websocket for HMR, and a policy that has to be loosened in dev is a
 * policy nobody notices breaking in production.
 */
const isProduction = process.env.NODE_ENV === 'production';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // `microphone=(self)` is pre-authorised for the pronunciation coach surface
  // (ASR scoring items); nothing else is granted.
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(self)' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(isProduction
    ? [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // The service worker must be revalidated on every navigation, or a
        // stale worker outlives the deploy that replaced it.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default nextConfig;
