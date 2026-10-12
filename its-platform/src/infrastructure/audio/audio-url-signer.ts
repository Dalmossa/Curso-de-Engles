/**
 * P1.13 — the audio delivery port (ADR-028 §5).
 *
 * A plain TypeScript interface with no framework import: it lives in the tree the *adapter*
 * lives in, not in `src/domain/` — the domain has no notion of a URL, and the precedent is that
 * `ContentService` already depends on `infrastructure/repositories` (ADR-028 §Implementation
 * Plan A). `HmacAudioUrlSigner` is the mechanism `security-spec.md` §4 names; an S3-presign
 * adapter is specified but deliberately not built (ADR-028 §5), so this is the only
 * implementation a request can reach today.
 *
 * The port exists to make the origin swappable by configuration: the bytes are served by the
 * CDN/origin, never by the Nest process (ADR-028 §5), and `AUDIO_BASE_URL` is the seam that
 * lets dev, staging and prod differ without touching the service, the controller or the
 * contract.
 */

/** One signed catalogue render URL, and when it stops being valid. */
export interface SignedAudioUrl {
  /** The URL the client fetches; the origin verifies the signature before serving bytes. */
  url: string;
  /**
   * When the URL expires, RFC 3339 with a `Z` zone — the exact shape the contract's
   * `DialogueAudioClip.expires_at` publishes (`YYYY-MM-DDTHH:MM:SS(.sss)Z`).
   */
  expiresAt: string;
}

/** What a caller must name to receive a URL: the render, and (optionally) how long it lives. */
export interface SignAudioUrlInput {
  /** `clip_renders.clip_id` — the DDL's per-turn unit (ADR-028 §3b), e.g. `clp_dlg_a1_01_1`. */
  clipId: string;
  /** `clip_renders.take`; the URL names the take, so the client can send it back. */
  take: number;
  /** `clip_renders.rate` — `1` or `0.75`. */
  rate: number;
  /** Validity window in seconds; omitted ⇒ the adapter's `defaultTtlSeconds`. */
  ttlSeconds?: number;
}

/** The outcome of `verify`. `reason` is for logs; the URL is served only on `ok: true`. */
export interface AudioUrlVerifyResult {
  ok: boolean;
  reason?: string;
}

export interface AudioUrlSigner {
  /**
   * The TTL `sign` applies when the caller passes none. Exposed so `ContentService` can publish
   * the `ttl_seconds` it actually used without hard-coding a policy value the ADR owns
   * (ADR-028 §7: *"`ttl_seconds` is the TTL actually used (300), so a client never has to know
   * the policy"*).
   */
  readonly defaultTtlSeconds: number;
  sign(input: SignAudioUrlInput): SignedAudioUrl;
  verify(url: string): AudioUrlVerifyResult;
}

/** DI token for the port; the module binds `HmacAudioUrlSigner` to it. */
export const AUDIO_URL_SIGNER = Symbol('AUDIO_URL_SIGNER');
