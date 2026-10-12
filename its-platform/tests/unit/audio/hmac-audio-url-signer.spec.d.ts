/**
 * P1.13 — `HmacAudioUrlSigner` against ADR-028 §5 and the three specs behind it.
 *
 * The signer is the one part of P1.13 that is a pure function of a key and a clock, so every
 * property the ADR claims is asserted here directly: the URL and signature *format* (asserted
 * byte for byte, because the origin must recompute the same string), the 300 s TTL, the boundary
 * just inside and just outside it, tampering with each signed member, and a wrong-length
 * signature that must be **rejected without throwing** (`timingSafeEqual` throws on a length
 * mismatch — ADR-028 §Implementation Plan A).
 *
 * The clock is injected rather than slept on: a 300 s boundary test that waits 300 s is a test
 * that will be deleted.
 */
export {};
//# sourceMappingURL=hmac-audio-url-signer.spec.d.ts.map