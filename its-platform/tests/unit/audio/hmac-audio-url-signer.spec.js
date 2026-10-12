"use strict";
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
import { createHmac } from 'node:crypto';
import { HmacAudioUrlSigner } from '../../../src/infrastructure/audio/hmac-audio-url-signer.js';
const KEY = 'unit-test-signing-key';
const BASE = 'https://audio.test';
/** Exactly on a second, so `Math.floor(now / 1000)` is stable across the cases. */
const T0 = Date.UTC(2026, 9, 11, 12, 0, 0);
function signerAt(epochMs, overrides = {}) {
    return new HmacAudioUrlSigner({
        signingKey: overrides.signingKey ?? KEY,
        baseUrl: overrides.baseUrl ?? BASE,
        now: () => epochMs,
    });
}
/** Sets a query parameter on an already-built URL without re-encoding anything else. */
function withParam(url, name, value) {
    const parsed = new URL(url);
    parsed.searchParams.set(name, value);
    return parsed.toString();
}
describe('HmacAudioUrlSigner (P1.13, ADR-028 §5)', () => {
    it('defaults the TTL to exactly 300 seconds', () => {
        expect(signerAt(T0).defaultTtlSeconds).toBe(300);
    });
    it('builds the URL and signature the ADR fixes, byte for byte', () => {
        const { url, expiresAt } = signerAt(T0).sign({
            clipId: 'clp_dlg_a1_01_first_intro_1',
            take: 2,
            rate: 1,
        });
        const exp = T0 / 1000 + 300;
        const payload = `clp_dlg_a1_01_first_intro_1/take-2?rate=1&exp=${exp}`;
        const sig = createHmac('sha256', KEY).update(payload).digest('hex');
        expect(url).toBe(`${BASE}/catalog/render/clp_dlg_a1_01_first_intro_1/take-2.opus?rate=1&exp=${exp}&sig=${sig}`);
        // RFC 3339, Z-suffixed — the shape the contract's `expires_at` pattern requires.
        expect(expiresAt).toBe('2026-10-11T12:05:00.000Z');
    });
    it('honours an explicit ttlSeconds instead of the default', () => {
        const { expiresAt } = signerAt(T0).sign({
            clipId: 'clp_x_1',
            take: 1,
            rate: 1,
            ttlSeconds: 60,
        });
        expect(expiresAt).toBe('2026-10-11T12:01:00.000Z');
    });
    it('verifies its own URL, at rate 1 and at 0.75', () => {
        const signer = signerAt(T0);
        const atOne = signer.sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const atThreeQuarters = signer.sign({ clipId: 'clp_x_1', take: 3, rate: 0.75 });
        expect(signer.verify(atOne.url)).toEqual({ ok: true });
        expect(signer.verify(atThreeQuarters.url)).toEqual({ ok: true });
    });
    it('accepts a URL one second inside the 300 s boundary', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        expect(signerAt(T0 + 299_000).verify(url)).toEqual({ ok: true });
    });
    it('rejects a URL at the 300 s boundary and one second past it', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        expect(signerAt(T0 + 300_000).verify(url)).toEqual({ ok: false, reason: 'expired' });
        expect(signerAt(T0 + 300_001).verify(url)).toEqual({ ok: false, reason: 'expired' });
    });
    it('rejects a tampered signature', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const tampered = withParam(url, 'sig', 'f'.repeat(64));
        expect(signerAt(T0).verify(tampered)).toEqual({ ok: false, reason: 'signature mismatch' });
    });
    it('rejects a tampered exp — it is inside the signature, not beside it', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const tampered = withParam(url, 'exp', String(T0 / 1000 + 86_400));
        expect(signerAt(T0).verify(tampered)).toEqual({ ok: false, reason: 'signature mismatch' });
    });
    it('rejects a tampered take in the path', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const tampered = url.replace('/take-1.', '/take-2.');
        expect(signerAt(T0).verify(tampered)).toEqual({ ok: false, reason: 'signature mismatch' });
    });
    it('rejects a tampered clip_id in the path', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const tampered = url.replace('clp_x_1', 'clp_y_1');
        expect(signerAt(T0).verify(tampered)).toEqual({ ok: false, reason: 'signature mismatch' });
    });
    it('rejects a tampered rate in the query', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const tampered = withParam(url, 'rate', '0.75');
        expect(signerAt(T0).verify(tampered)).toEqual({ ok: false, reason: 'signature mismatch' });
    });
    it('rejects a signature whose length is wrong without throwing (timingSafeEqual guard)', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const wrongLength = withParam(url, 'sig', 'abcd');
        expect(() => signerAt(T0).verify(wrongLength)).not.toThrow();
        expect(signerAt(T0).verify(wrongLength)).toEqual({ ok: false, reason: 'malformed signature' });
    });
    it('rejects a 64-character signature that is not hex, without throwing', () => {
        const { url } = signerAt(T0).sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        const nonHex = withParam(url, 'sig', 'z'.repeat(64));
        expect(() => signerAt(T0).verify(nonHex)).not.toThrow();
        expect(signerAt(T0).verify(nonHex)).toEqual({ ok: false, reason: 'malformed signature' });
    });
    it('rejects a URL that is not a URL, and one that is not a render path', () => {
        const signer = signerAt(T0);
        expect(signer.verify('not a url')).toEqual({ ok: false, reason: 'not a URL' });
        expect(signer.verify(`${BASE}/catalog/render/clp_x_1/other.opus`)).toEqual({
            ok: false,
            reason: 'not a catalogue render path',
        });
    });
    it('rejects a URL signed with a different key', () => {
        const { url } = signerAt(T0, { signingKey: 'key-a' }).sign({
            clipId: 'clp_x_1',
            take: 1,
            rate: 1,
        });
        expect(signerAt(T0, { signingKey: 'key-b' }).verify(url)).toEqual({
            ok: false,
            reason: 'signature mismatch',
        });
    });
    it('fails closed at construction on an empty key or base URL', () => {
        expect(() => signerAt(T0, { signingKey: '   ' })).toThrow(/AUDIO_URL_SIGNING_KEY/);
        expect(() => signerAt(T0, { baseUrl: '' })).toThrow(/AUDIO_BASE_URL/);
    });
    it('normalises a trailing slash on the base URL and trims the key', () => {
        const signer = signerAt(T0, { baseUrl: `${BASE}/` });
        const { url } = signer.sign({ clipId: 'clp_x_1', take: 1, rate: 1 });
        expect(url.startsWith(`${BASE}/catalog/render/`)).toBe(true);
        expect(signer.verify(url)).toEqual({ ok: true });
    });
});
//# sourceMappingURL=hmac-audio-url-signer.spec.js.map