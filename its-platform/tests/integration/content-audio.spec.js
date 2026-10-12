"use strict";
/**
 * P1.13 — `GET /content/listening/{dialogue_id}/audio`, over seeded `clip_renders` (ADR-028).
 *
 * The ADR's own honesty note is the shape of this file. `clip_renders` holds **0** rows: no audio
 * has been rendered (M3 is not done) and `content-loader.ts` has no statement that touches the
 * table. So every render read here is a **seed fixture** inserted straight into the migrated
 * schema — never a corpus artefact. The endpoint is real; the audio is not, and this file says so
 * rather than letting a green suite imply a playable catalogue.
 *
 * What is asserted is the executable half of ADR-028 §3: the four admission conditions as SQL, in
 * the same all-or-nothing form `ContentRepository.findDialogueAudio` writes them. The seeds are
 * built to separate the conditions from one another, because a test that fails for two reasons at
 * once proves neither:
 *
 *   * **D_L1** — the one shipped, *L1-only* dialogue (discovered at runtime, never hardcoded) —
 *     carries a **complete take 1** and a **partial take 2**, so "the highest `take` complete for
 *     the whole dialogue" is distinguished from "the highest `take` that exists";
 *   * **D_A** — an L2 dialogue — is complete but **not ear-checked**, so §3.4 is the only thing
 *     that withholds it, until the checks are recorded;
 *   * **D_B** — renders **only at `rate` 0.75** — isolates the rate filter from take completeness;
 *   * **D_C** — **only a partial take** — exercises "no complete `take`" on its own;
 *   * the **shadow-only probe** carries complete, ear-checked renders *and* a speaker mapping, so
 *     `status = 'shipped'` (§3.1) is the only condition that can refuse it.
 *
 * The negative control for §3 condition 4 is in the ADR's Implementation Plan but is not a test
 * here: it is the manual removal of the ear-check predicate from the repository SQL, watched
 * against the D_A assertion below (recorded in the ADR follow-up report). Adding a switch to the
 * production query so a unit test could flip it would put a test seam in the SQL the ADR wants
 * raw.
 */
jest.setTimeout(300_000);
import { join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { createTestDb } from '../helpers/db.js';
import { loadContent } from '../../src/infrastructure/content/content-loader.js';
import { ContentRepository } from '../../src/infrastructure/repositories/content.repository.js';
import { ContentService, } from '../../src/modules/content/content.service.js';
import { ContentController } from '../../src/modules/content/content.controller.js';
import { HmacAudioUrlSigner } from '../../src/infrastructure/audio/hmac-audio-url-signer.js';
const CONTENT_ROOT = join(process.cwd(), '..');
const KEY = 'p1-13-integration-signing-key';
const BASE = 'https://audio.integration.test';
let context;
let dataSource;
let signer;
let service;
let controller;
/** Discovered from the loaded catalogue, never hardcoded (the corpus is the fixture). */
let l1Only;
let l2EarCheck;
let l2Rate075;
let l2Partial;
let l2Admitted;
const SHADOW_PROBE = 'dlg_zz_p113_shadow_probe';
const NO_CLIPS_PROBE = 'dlg_zz_p113_no_clips_probe';
/** The clips of a dialogue and the voice `dialogue_speakers` pins to each speaker (ADR-028 §2). */
async function clipVoices(dialogueId) {
    return (await dataSource.query(`SELECT c.id AS clip_id, c.sort_index, c.speaker_id, ds.voice_id
       FROM clips c
       JOIN dialogue_speakers ds
         ON ds.dialogue_id = c.dialogue_id AND ds.speaker_id = c.speaker_id
      WHERE c.dialogue_id = $1
      ORDER BY c.sort_index`, [dialogueId]));
}
/**
 * Seed one `take` of a dialogue's renders — the fixture M3 will one day replace. `uri` is built
 * under `catalog/`, the only prefix the `clip_renders_uri_catalog_only` CHECK accepts.
 */
async function seedTake(dialogueId, take, rate, options = {}) {
    const clips = await clipVoices(dialogueId);
    const selected = options.skipLast === true ? clips.slice(0, -1) : clips;
    const durationS = options.durationS ?? 4.0;
    const earCheckedAt = options.earChecked === true ? new Date() : null;
    const earCheckedBy = options.earChecked === true ? 'sp_native_ear' : null;
    for (const clip of selected) {
        await dataSource.query(`INSERT INTO clip_renders
         (clip_id, take, voice_id, rate, duration_s, uri, ear_checked_at, ear_checked_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (clip_id, take) DO UPDATE
         SET rate = EXCLUDED.rate,
             duration_s = EXCLUDED.duration_s,
             uri = EXCLUDED.uri,
             ear_checked_at = EXCLUDED.ear_checked_at,
             ear_checked_by = EXCLUDED.ear_checked_by`, [
            clip.clip_id,
            take,
            clip.voice_id,
            rate,
            durationS,
            `catalog/render/${clip.clip_id}/take-${take}.opus`,
            earCheckedAt,
            earCheckedBy,
        ]);
    }
    return selected;
}
/** A single-row id query that fails loudly when the discovery finds nothing. */
async function singleId(sql, params = []) {
    const rows = (await dataSource.query(sql, params));
    const id = rows[0]?.id;
    if (id === undefined)
        throw new Error(`discovery matched no row: ${sql}`);
    return id;
}
/** The playlist, or a loud failure — `null` here is the refusal every other test asserts. */
function expectAdmitted(result) {
    if (result === null)
        throw new Error('expected the playlist; got the ADR-028 §3 refusal (null)');
    return result;
}
/** The status/body a Nest HTTP exception carries, for comparing two refusals field by field. */
async function rejectionOf(work) {
    try {
        await work;
    }
    catch (error) {
        const http = error;
        return { status: http.getStatus(), body: http.getResponse() };
    }
    throw new Error('expected the call to reject, but it resolved');
}
beforeAll(async () => {
    context = await createTestDb();
    const report = await loadContent(context.dataSource, CONTENT_ROOT);
    expect(report.errors).toEqual([]);
    dataSource = context.dataSource;
    signer = new HmacAudioUrlSigner({ signingKey: KEY, baseUrl: BASE });
    service = new ContentService(new ContentRepository(dataSource), signer);
    controller = new ContentController(service);
    const shippedWithClips = `d.status = 'shipped'
      AND EXISTS (SELECT 1 FROM clips c WHERE c.dialogue_id = d.id)`;
    l1Only = await singleId(`SELECT d.id FROM dialogues d
      WHERE ${shippedWithClips}
        AND NOT EXISTS (
              SELECT 1 FROM items i WHERE i.dialogue_id = d.id AND i.listening_tier = 'L2')
      ORDER BY d.id
      LIMIT 1`);
    const l2 = (await dataSource.query(`SELECT d.id FROM dialogues d
      WHERE ${shippedWithClips}
        AND EXISTS (
              SELECT 1 FROM items i WHERE i.dialogue_id = d.id AND i.listening_tier = 'L2')
      ORDER BY d.id`));
    if (l2.length < 4)
        throw new Error(`expected >= 4 L2 dialogues, found ${l2.length}`);
    const [first, second, third, fourth] = l2;
    if (!first || !second || !third || !fourth)
        throw new Error('unreachable: length checked above');
    l2EarCheck = first.id;
    l2Rate075 = second.id;
    l2Partial = third.id;
    l2Admitted = fourth.id;
    // D_L1: a complete take 1, and a take 2 that exists for every clip but one (incomplete).
    await seedTake(l1Only, 1, 1, {});
    await seedTake(l1Only, 2, 1, { skipLast: true });
    // D_A: complete at rate 1, deliberately not ear-checked — §3.4 is the only refusal in play.
    await seedTake(l2EarCheck, 1, 1, {});
    // D_B: renders only at 0.75, ear-checked, so the rate query parameter is the only variable.
    await seedTake(l2Rate075, 1, 0.75, { earChecked: true });
    // D_C: a partial take only — no take is complete at any rate.
    await seedTake(l2Partial, 1, 1, { skipLast: true, earChecked: true });
    // D_E: an admitted L2 dialogue (complete, ear-checked) for the controller-level tests.
    await seedTake(l2Admitted, 1, 1, { earChecked: true });
    // A shadow-only clone of D_L1's speaker/voice set: complete, ear-checked renders, no L2 item —
    // so §3.1 (`status = 'shipped'`) is the one condition that can refuse it.
    await dataSource.query(`INSERT INTO dialogues (id, title, cefr_level, status, duration_seconds, transcript)
     VALUES ($1, $2, 'A1', 'shadow_only', 51, $3)`, [SHADOW_PROBE, 'A shadow-only row no corpus file declares', '> **Ana:** Shadow only.']);
    await dataSource.query(`INSERT INTO dialogue_speakers (dialogue_id, speaker_id, voice_id)
     SELECT $1, speaker_id, voice_id FROM dialogue_speakers WHERE dialogue_id = $2`, [SHADOW_PROBE, l1Only]);
    await dataSource.query(`INSERT INTO clips (id, dialogue_id, speaker_id, sort_index, utterance_text)
     SELECT 'clp_' || $1 || '_' || sort_index, $1, speaker_id, sort_index, 'Shadow only.'
       FROM clips WHERE dialogue_id = $2`, [SHADOW_PROBE, l1Only]);
    await seedTake(SHADOW_PROBE, 1, 1, { earChecked: true });
    // A shipped dialogue with no clips at all: §3.2's "every clip has a render" is vacuous, and
    // there is no complete take over an empty clip set either.
    await dataSource.query(`INSERT INTO dialogues (id, title, cefr_level, status, duration_seconds, transcript)
     VALUES ($1, $2, 'A1', 'shipped', 51, $3)`, [NO_CLIPS_PROBE, 'A shipped row with no clips', '> **Ana:** No clips.']);
}, 300_000);
afterAll(async () => {
    await context.cleanup();
});
describe('ContentService.getDialogueAudio over seeded clip_renders (P1.13)', () => {
    it('the ADR §3 gate leaves only the L2-free dialogues ungated', async () => {
        const [shipped, l1OnlyRows, l2Rows] = await Promise.all([
            dataSource.query(`SELECT d.id FROM dialogues d
          WHERE d.status = 'shipped'
            AND EXISTS (SELECT 1 FROM clips c WHERE c.dialogue_id = d.id)`),
            dataSource.query(`SELECT d.id FROM dialogues d
          WHERE d.status = 'shipped'
            AND EXISTS (SELECT 1 FROM clips c WHERE c.dialogue_id = d.id)
            AND NOT EXISTS (
                  SELECT 1 FROM items i WHERE i.dialogue_id = d.id AND i.listening_tier = 'L2')
          ORDER BY d.id`),
            dataSource.query(`SELECT d.id FROM dialogues d
          WHERE d.status = 'shipped'
            AND EXISTS (SELECT 1 FROM clips c WHERE c.dialogue_id = d.id)
            AND EXISTS (
                  SELECT 1 FROM items i WHERE i.dialogue_id = d.id AND i.listening_tier = 'L2')`),
        ]);
        expect(shipped).toHaveLength(13);
        // The denominator is 13 and the sum is 13 — the census is complete, not a sample.
        expect(l1OnlyRows.length + l2Rows.length).toBe(shipped.length);
        // The census the ADR states: **11 of 13** dialogues carry an L2 item (ADR-028 §3). The first
        // draft of the ADR said 12 and the measurement corrected it — `dlg_a2_02_what_does` and
        // `dlg_b1_01_incident` declare **both** of their L2 items `withdrawn` (`§9 DEF-7` ×2,
        // `DEF-10`, `DEF-11`) and the loader inserts only shipped slots, so neither carries one. The
        // gate is data-driven (`items.listening_tier`), so `DEF-11`'s deferred replacement (`§10.3`)
        // re-arms it for `dlg_b1_01_incident` with no code change — which is why this asserts the
        // *measured* ids instead of hard-coding a count.
        expect(l1OnlyRows.map(row => row.id)).toEqual(['dlg_a2_02_what_does', 'dlg_b1_01_incident']);
        expect(l2Rows).toHaveLength(11);
        // `l1Only` is the dialogue the discovery picked for the ungated case — it must be L1-free.
        expect(l1OnlyRows.map(row => row.id)).toContain(l1Only);
        expect(l2Rows.map(row => row.id)).not.toContain(l1Only);
    });
    it('serves the highest take complete for the whole dialogue, in sort_index order, at the pinned voice', async () => {
        const expected = await clipVoices(l1Only);
        expect(expected.length).toBeGreaterThan(1);
        const first = expectAdmitted(await service.getDialogueAudio(l1Only, 1));
        expect(first.dialogue_id).toBe(l1Only);
        expect(first.cefr_level).toMatch(/^[ABC][12]$/);
        expect(first.ttl_seconds).toBe(300);
        expect(first.clips.map(clip => clip.clip_id)).toEqual(expected.map(clip => clip.clip_id));
        expect(first.clips.map(clip => clip.sort_index)).toEqual(expected.map(clip => clip.sort_index));
        for (const clip of first.clips) {
            // The partial take 2 exists for every clip but the last; the served take is 1.
            expect(clip.take).toBe(1);
            // `NUMERIC` → `Number`, never the `"1.00"` string the driver returns (ADR-028 §2).
            expect(clip.rate).toBe(1);
            expect(typeof clip.rate).toBe('number');
            expect(typeof clip.duration_s).toBe('number');
            expect(clip.duration_s).toBeGreaterThan(0);
            expect(clip.voice_id).toBe(expected.find(candidate => candidate.clip_id === clip.clip_id)?.voice_id);
            // The URL is the ADR §5 literal, and it verifies against the signer that produced it.
            const url = new URL(clip.url);
            expect(url.origin).toBe(BASE);
            expect(url.pathname).toBe(`/catalog/render/${clip.clip_id}/take-${clip.take}.opus`);
            expect(url.searchParams.get('rate')).toBe('1');
            expect(url.searchParams.get('sig')).toMatch(/^[0-9a-f]{64}$/);
            expect(signer.verify(clip.url)).toEqual({ ok: true });
            // RFC 3339 with a `Z`, the shape `DialogueAudioClip.expires_at` publishes.
            expect(clip.expires_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        }
        // Completing take 2 flips the *whole* playlist: §2's rule is per dialogue, not per clip.
        await seedTake(l1Only, 2, 1, {});
        const second = expectAdmitted(await service.getDialogueAudio(l1Only, 1));
        expect(second.clips.map(clip => clip.clip_id)).toEqual(expected.map(clip => clip.clip_id));
        for (const clip of second.clips)
            expect(clip.take).toBe(2);
    });
    it('withholds an L2 dialogue until every selected render is ear-checked (ADR-028 §3.4)', async () => {
        await expect(service.getDialogueAudio(l2EarCheck, 1)).resolves.toBeNull();
        const rendered = await clipVoices(l2EarCheck);
        await dataSource.query(`UPDATE clip_renders SET ear_checked_at = now(), ear_checked_by = 'sp_native_ear'
        WHERE clip_id = ANY($1)`, [rendered.map(clip => clip.clip_id)]);
        const served = expectAdmitted(await service.getDialogueAudio(l2EarCheck, 1));
        expect(served.clips).toHaveLength(rendered.length);
        for (const clip of served.clips)
            expect(clip.take).toBe(1);
    });
    it('serves and signs the 0.75 accommodation, and refuses a rate with no renders', async () => {
        // The L2 gate is already satisfied at 0.75; there are simply no rate-1 renders to serve.
        await expect(service.getDialogueAudio(l2Rate075, 1)).resolves.toBeNull();
        const served = expectAdmitted(await service.getDialogueAudio(l2Rate075, 0.75));
        expect(served.clips.length).toBeGreaterThan(1);
        for (const clip of served.clips) {
            expect(clip.rate).toBe(0.75);
            expect(typeof clip.rate).toBe('number');
            expect(new URL(clip.url).searchParams.get('rate')).toBe('0.75');
            expect(signer.verify(clip.url)).toEqual({ ok: true });
        }
    });
    it('refuses a dialogue whose only renders are a partial take', async () => {
        await expect(service.getDialogueAudio(l2Partial, 1)).resolves.toBeNull();
        // The refusal is incompleteness, not an empty table: the renders exist, one clip is missing.
        const clips = await clipVoices(l2Partial);
        const rendered = (await dataSource.query(`SELECT count(*)::int AS n FROM clip_renders WHERE clip_id = ANY($1) AND take = 1 AND rate = 1`, [clips.map(clip => clip.clip_id)]));
        expect(clips.length).toBeGreaterThan(1);
        expect(rendered[0]?.n).toBe(clips.length - 1);
    });
    it('answers the same null for a not-admitted dialogue, a shadow_only row and an unknown id', async () => {
        // The shadow probe is complete and ear-checked — only `status` can refuse it.
        const shadowClips = await clipVoices(SHADOW_PROBE);
        const ready = (await dataSource.query(`SELECT count(*)::int AS n FROM clip_renders
        WHERE clip_id = ANY($1) AND take = 1 AND rate = 1
          AND ear_checked_at IS NOT NULL AND ear_checked_by IS NOT NULL`, [shadowClips.map(clip => clip.clip_id)]));
        expect(shadowClips.length).toBeGreaterThan(1);
        expect(ready[0]?.n).toBe(shadowClips.length);
        await expect(service.getDialogueAudio(SHADOW_PROBE, 1)).resolves.toBeNull();
        await expect(service.getDialogueAudio(l2Partial, 1)).resolves.toBeNull();
        await expect(service.getDialogueAudio('dlg_zz_p113_unknown', 1)).resolves.toBeNull();
    });
    it('serves nothing for a shipped dialogue with no clips', async () => {
        await expect(service.getDialogueAudio(NO_CLIPS_PROBE, 1)).resolves.toBeNull();
    });
});
describe('ContentController.getDialogueAudio (P1.13)', () => {
    it('refuses a malformed dialogue_id with a 400', async () => {
        await expect(controller.getDialogueAudio('not-a-dialogue', '1')).rejects.toBeInstanceOf(BadRequestException);
    });
    it('refuses an unsupported rate with a 400', async () => {
        await expect(controller.getDialogueAudio(l2Admitted, '0.5')).rejects.toBeInstanceOf(BadRequestException);
        await expect(controller.getDialogueAudio(l2Admitted, 'abc')).rejects.toBeInstanceOf(BadRequestException);
    });
    it('defaults rate to 1 and serves an admitted playlist', async () => {
        const served = expectAdmitted(await controller.getDialogueAudio(l2Admitted));
        expect(served.dialogue_id).toBe(l2Admitted);
        expect(served.clips.every(clip => clip.rate === 1 && clip.take === 1)).toBe(true);
    });
    it('returns one 404 body for an unknown id and a not-admitted dialogue', async () => {
        const unknown = await rejectionOf(controller.getDialogueAudio('dlg_zz_p113_unknown', '1'));
        const withheld = await rejectionOf(controller.getDialogueAudio(l2Partial, '1'));
        expect(unknown.status).toBe(404);
        expect(withheld.status).toBe(404);
        // Every member but the per-request correlation id is identical, so "not admitted" cannot be
        // probed for (ADR-028 §3).
        const { request_id: unknownRequestId, ...unknownRest } = unknown.body;
        const { request_id: withheldRequestId, ...withheldRest } = withheld.body;
        expect(unknownRest).toEqual(withheldRest);
        expect(typeof unknownRequestId).toBe('string');
        expect(typeof withheldRequestId).toBe('string');
    });
});
//# sourceMappingURL=content-audio.spec.js.map