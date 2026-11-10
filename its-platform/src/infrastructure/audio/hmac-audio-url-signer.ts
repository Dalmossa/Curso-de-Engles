/**
 * P1.13 — the HMAC-SHA256 audio URL signer (ADR-028 §5).
 *
 * `security-spec.md` §4 names the mechanism — *"Signed URLs (audio) | HMAC-SHA256 | Rotating
 * signing key in KMS"* — and this is exactly that, with no new dependency: `node:crypto` is
 * HMAC-SHA256, and the signing key arrives from configuration, sourced from the secret manager
 * in deployed environments.
 *
 * The URL is the ADR's, verbatim:
 *
 * ```
 * {AUDIO_BASE_URL}/catalog/render/{clipId}/take-{take}.opus?rate={rate}&exp={unix}&sig={hex}
 * sig = HMAC-SHA256(key, "{clipId}/take-{take}?rate={rate}&exp={unix}")
 * ```
 *
 * Three properties are load-bearing:
 *
 * 1. **`exp` is inside the signature input.** Expiry is not a query parameter a client may edit;
 *    changing it invalidates the signature. A signed URL that carried a checkable-by-the-origin
 *    timestamp would be a URL with a hint, not a control. The signature covers the **clip, the
 *    take and the rate** — the three things the URL selects. It carries no learner identifier
 *    (ADR-028 §4): catalogue audio is not learner-scoped, and a signed URL is logged by proxies,
 *    CDNs and browsers.
 * 2. **Verification is constant-time and cannot throw.** `timingSafeEqual` raises on a
 *    length mismatch, so the length is checked first and a malformed signature is a refusal, not
 *   an exception on a hot path (ADR-028 §A).
 * 3. **The TTL is 300 s.** `security-spec.md` §7, the P1.13 backlog row and `diagnostic-spec.md`
 *    §9's pricing of a pre-signed URL all agree on that number; it is the class default.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
  AudioUrlSigner,
  AudioUrlVerifyResult,
  SignedAudioUrl,
  SignAudioUrlInput,
} from './audio-url-signer.js';

/** `security-spec.md` §7 / `diagnostic-spec.md` §9: the one TTL the specs agree on. */
const DEFAULT_TTL_SECONDS = 300;

/**
 * The path the ADR fixes. The `catalog/` prefix is the one `iac-spec.md` §2.4's 30-day `audio/`
 * lifecycle rule does not expire, which is why `clip_renders.uri` is constrained to it (§6) and
 * the URL is built from the render identity rather than read back out of `uri`.
 */
const RENDER_PATH = /\/catalog\/render\/([^/]+)\/take-(\d+)\.opus$/;

/** A hex SHA-256 digest: 64 characters. A wrong-length `sig` is rejected, never compared. */
const HEX_SHA256 = /^[0-9a-f]{64}$/i;

export interface HmacAudioUrlSignerOptions {
  /**
   * `AUDIO_URL_SIGNING_KEY`; a KMS-rotated secret in deployed environments. Optional **so the DI
   * factory can forward an unset value**: outside production only, a missing key falls back to
   * `DEV_FALLBACK_SIGNING_KEY` so the stack boots without KMS access; in production a missing key
   * stays a loud construction failure (ADR-028 §5 fail-closed). An empty string is **not** unset —
   * it still fails the validation below, by design.
   */
  signingKey?: string | undefined;
  /** `AUDIO_BASE_URL` — same rule as `signingKey`; dev-only fallback, never in production. */
  baseUrl?: string | undefined;
  /**
   * Test seam only. Returns epoch **milliseconds**; production uses `Date.now`. Injecting a clock
   * is what makes the 300 s boundary (just inside, just outside) a deterministic assertion
   * instead of a sleep.
   */
  now?: () => number;
}

/**
 * The dev-only fallbacks. The key is named so `grep` finds it in any audit, and it is never valid
 * in production: `NODE_ENV=production` refuses to fall back to it at all, keeping ADR-028 §5's
 * fail-closed construction in every deployed environment.
 */
const DEV_FALLBACK_SIGNING_KEY = 'temp-fallback-key-do-not-use-in-prod';
const DEV_FALLBACK_BASE_URL = 'https://audio.test';

export class HmacAudioUrlSigner implements AudioUrlSigner {
  readonly defaultTtlSeconds = DEFAULT_TTL_SECONDS;

  private readonly key: string;
  private readonly baseUrl: string;
  private readonly now: () => number;

  constructor(options: HmacAudioUrlSignerOptions = {}) {
    // Fail closed at construction, not at the first request: an empty key would produce URLs
    // signed with the empty string, and an empty base URL would produce relative URLs a client
    // cannot fetch. Both are configuration defects that must be loud.
    //
    // The one relaxation is dev-only: outside `NODE_ENV=production`, an **unset** key/URL (missing
    // from options and from the environment) falls back to the named dev constants above so a
    // developer can boot the stack without KMS access. Production never falls back — the same
    // construction failure as before applies.
    const isProduction = process.env['NODE_ENV'] === 'production';
    const rawSigningKey =
      options.signingKey ??
      process.env['AUDIO_URL_SIGNING_KEY'] ??
      (isProduction ? '' : DEV_FALLBACK_SIGNING_KEY);
    const rawBaseUrl =
      options.baseUrl ?? process.env['AUDIO_BASE_URL'] ?? (isProduction ? '' : DEV_FALLBACK_BASE_URL);
    const signingKey = rawSigningKey.trim();
    const baseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
    if (signingKey.length === 0) {
      throw new Error('HmacAudioUrlSigner requires a non-empty AUDIO_URL_SIGNING_KEY');
    }
    if (baseUrl.length === 0) {
      throw new Error('HmacAudioUrlSigner requires a non-empty AUDIO_BASE_URL');
    }
    if (signingKey === DEV_FALLBACK_SIGNING_KEY || baseUrl === DEV_FALLBACK_BASE_URL) {
      console.warn(
        '⚠️ AUDIO_URL_SIGNING_KEY/AUDIO_BASE_URL not configured — using the named dev fallback. Never valid in production.',
      );
    }
    this.key = signingKey;
    this.baseUrl = baseUrl;
    this.now = options.now ?? Date.now;
  }

  sign(input: SignAudioUrlInput): SignedAudioUrl {
    const ttlSeconds = input.ttlSeconds ?? this.defaultTtlSeconds;
    const exp = Math.floor(this.now() / 1000) + ttlSeconds;
    const render = `${input.clipId}/take-${input.take}?rate=${input.rate}&exp=${exp}`;
    const sig = createHmac('sha256', this.key).update(render).digest('hex');
    const url =
      `${this.baseUrl}/catalog/render/${input.clipId}/take-${input.take}.opus` +
      `?rate=${input.rate}&exp=${exp}&sig=${sig}`;
    return { url, expiresAt: new Date(exp * 1000).toISOString() };
  }

  verify(url: string): AudioUrlVerifyResult {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { ok: false, reason: 'not a URL' };
    }

    const match = RENDER_PATH.exec(parsed.pathname);
    const clipId = match?.[1];
    const take = match?.[2];
    if (clipId === undefined || take === undefined) {
      return { ok: false, reason: 'not a catalogue render path' };
    }

    const rate = parsed.searchParams.get('rate');
    const exp = parsed.searchParams.get('exp');
    const sig = parsed.searchParams.get('sig');
    if (rate === null || exp === null || sig === null) {
      return { ok: false, reason: 'missing rate, exp or sig' };
    }
    if (!/^\d+$/.test(exp)) {
      return { ok: false, reason: 'malformed exp' };
    }
    // The exact bytes that were signed: the raw `rate` string, not `Number(rate)` re-stringified,
    // so a URL that was signed at `rate=1` and tampered to `rate=1.0` fails rather than rounds.
    const payload = `${clipId}/take-${take}?rate=${rate}&exp=${exp}`;
    const expected = createHmac('sha256', this.key).update(payload).digest();
    const provided = Buffer.from(sig, 'hex');
    if (!HEX_SHA256.test(sig) || provided.length !== expected.length) {
      return { ok: false, reason: 'malformed signature' };
    }
    if (!timingSafeEqual(provided, expected)) {
      return { ok: false, reason: 'signature mismatch' };
    }

    if (Number(exp) * 1000 <= this.now()) {
      return { ok: false, reason: 'expired' };
    }
    return { ok: true };
  }
}
