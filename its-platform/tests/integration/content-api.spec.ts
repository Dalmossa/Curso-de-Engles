/**
 * P1.12 — the `/content/*` API over the *real* persisted catalogue (ADR-027).
 *
 * Every other content test in this repo either drives the loader (`content-loader.spec.ts`,
 * `loader.integration.spec.ts`) or feeds it fixtures. This one closes the last gap: it runs the
 * real `loadContent` over the content repo into PGlite, then calls `ContentService` — through
 * `ContentRepository`, exactly as Nest wires it — and checks what a caller would receive.
 *
 * It exists because the service used to answer from a mock, and no test could have noticed: the
 * three payloads are assembled from eight tables, and the assembly is where the defects were
 * (ADR-027). Two of them are asserted directly here:
 *
 *   * **§3a — the 11 unscorable slots.** `content-check.mjs` reports that the corpus marks an
 *     item's key with `✓` in one of two table columns; the loader read only one, so 11 shipped
 *     slots loaded with `items.key IS NULL`. The regression test below calls `getDialogue` for
 *     their four dialogues and requires each of the 11 to arrive with a non-null key.
 *   * **§3 — the same 404 for "not shipped" and "unknown".** The serving rule lives in the
 *     service (the repository is a pure read), so both cases are asserted at this level: an
 *     unknown id and a `shadow_only` row both return `null`.
 *
 * Nothing is mocked. The only fabricated rows are the two the corpus cannot supply — a
 * `shadow_only` dialogue and a dialogue at the 45 s floor — and they are inserted directly into
 * the migrated schema, not through a stub. The sub-floor half of the rule cannot be reached
 * through a real database at all (`dialogues.duration_seconds` CHECKs 45–120), so it is covered
 * against a stubbed repository in the first `describe` of this file.
 */

jest.setTimeout(300_000);

import { join } from 'path';
import { createTestDb, type TestDbContext } from '../helpers/db.js';
import { loadContent } from '../../src/infrastructure/content/content-loader.js';
import {
  ContentRepository,
  type DialogueRow,
} from '../../src/infrastructure/repositories/content.repository.js';
import { ContentService } from '../../src/modules/content/content.service.js';

const CONTENT_ROOT = process.env['CONTENT_REPO_PATH'] ?? join(process.cwd(), '..');

/**
 * ADR-027 §3a's 11 slots, grouped by the dialogue that owns them. Before the fix each loaded
 * with `items.key IS NULL` and no option flagged `is_key` — present in the API response, and
 * unscorable.
 */
const PREVIOUSLY_UNSCORABLE_SLOTS: Record<string, string[]> = {
  dlg_a2_05_touch_base: ['lst_inference_007'],
  dlg_b1_01_incident: ['lst_gist_010', 'lst_inference_008'],
  dlg_b1_02_disagree: ['lst_detail_012', 'lst_gist_011', 'lst_inference_009', 'lst_pragmatic_005'],
  dlg_b1_03_tradeoff: ['lst_detail_013', 'lst_gist_012', 'lst_inference_010', 'lst_pragmatic_006'],
};

describe('ContentService.getDialogue — the serving policy, against a stubbed row', () => {
  /**
   * The floor's lower half is unreachable against a real database: the DDL CHECK admits only
   * 45–120 s, so no `dialogues` row can sit below 45 and the guard in `getDialogue` would never
   * fire. That is a reason to keep the guard (defence in depth, and the column is one migration
   * away from changing) and a reason to test it here rather than pretend the catalogue covers it.
   */
  function serviceWith(dialogue: Partial<DialogueRow>): ContentService {
    const row: DialogueRow = {
      id: 'dlg_stub',
      title: 'Stub',
      cefr_level: 'A1',
      status: 'shipped',
      duration_seconds: 60,
      transcript: '> **Ana:** Stub.',
      ...dialogue,
    };
    const repository = {
      findDialogue: async () => ({ dialogue: row, voices: [], slots: [], options: [] }),
    } as unknown as ContentRepository;
    return new ContentService(repository);
  }

  it('serves a shipped dialogue at exactly 45 s', async () => {
    const dialogue = await serviceWith({ duration_seconds: 45 }).getDialogue('dlg_stub');
    expect(dialogue?.duration_seconds).toBe(45);
  });

  it('returns null below 45 s', async () => {
    await expect(serviceWith({ duration_seconds: 44 }).getDialogue('dlg_stub')).resolves.toBeNull();
  });

  it('returns null for a shadow_only row', async () => {
    await expect(serviceWith({ status: 'shadow_only' }).getDialogue('dlg_stub')).resolves.toBeNull();
  });

  it('returns null when the row does not exist', async () => {
    const repository = { findDialogue: async () => null } as unknown as ContentRepository;
    await expect(new ContentService(repository).getDialogue('dlg_nope')).resolves.toBeNull();
  });
});

describe('Content API over the real catalogue (P1.12)', () => {
  let context: TestDbContext;
  let service: ContentService;

  beforeAll(async () => {
    context = await createTestDb();
    const report = await loadContent(context.dataSource, CONTENT_ROOT);
    // The loader reports per-file failures instead of aborting the transaction (ADR-022 §6);
    // an empty `errors[]` is the precondition for everything below.
    expect(report.errors).toEqual([]);
    service = new ContentService(new ContentRepository(context.dataSource));
  }, 300_000);

  afterAll(async () => {
    await context.cleanup();
  });

  describe('GET /content/lessons/{lesson_id}', () => {
    it('serves the lesson row and its four authored phases', async () => {
      const lesson = await service.getLesson('les_a1_alphabet_sounds');
      expect(lesson).not.toBeNull();
      expect(lesson).toMatchObject({
        lesson_id: 'les_a1_alphabet_sounds',
        title: 'Alphabet, Sounds, Letter Names',
        cefr_level: 'A1',
        reuse_basis: 'cite_only',
        authoring_state: 'authored',
        publication_state: 'publishable',
      });
      expect(lesson?.phases.map(phase => phase.phase)).toEqual([1, 2, 3, 4]);
      expect(lesson?.phases.map(phase => phase.heading)).toEqual([
        'FASE 1 — Input (i+1) [4 min]',
        'FASE 2 — Guided Practice [5 min]',
        'FASE 3 — Output Task [4 min]',
        'FASE 4 — Shadow CAT [2 min]',
      ]);
      for (const phase of lesson?.phases ?? []) {
        expect(typeof phase.markdown).toBe('string');
        expect(phase.markdown.length).toBeGreaterThan(0);
      }
    });

    it('serves `learner_model: null` for the one lesson that declares none', async () => {
      const lesson = await service.getLesson('les_a2_it_internet_history');
      expect(lesson).not.toBeNull();
      // Present and null, not absent: the JSON column holds a JSON null.
      expect(lesson).toHaveProperty('learner_model', null);
    });

    it('returns null for an unknown lesson id', async () => {
      await expect(service.getLesson('les_zz_does_not_exist')).resolves.toBeNull();
    });
  });

  describe('GET /content/packs/{pack_id}', () => {
    it('serves a legacy pack whose items follow `packs.item_ids`, with options by position', async () => {
      const pack = await service.getPack('pack_les_a1_alphabet_sounds_v1');
      expect(pack).not.toBeNull();
      expect(pack?.lesson_id).toBe('les_a1_alphabet_sounds');
      expect(pack?.schema_version).toBe('legacy_v1');

      const declared = (await context.dataSource.query(
        `SELECT item_ids FROM packs WHERE id = $1`,
        ['pack_les_a1_alphabet_sounds_v1'],
      )) as Array<{ item_ids: string[] }>;
      expect(pack?.items.map(item => item.item_id)).toEqual(declared[0]?.item_ids ?? []);

      const vowels = pack?.items.find(item => item.item_id === 'vocab.alphabet.vowels');
      expect(vowels).toBeDefined();
      expect(vowels).toMatchObject({
        item_type: 'contextual_selection',
        skill: 'vocab',
        domain: 'vocab',
        prompt: '**Vowels** in English are:',
        scoring: 'choice',
        key: 'B',
        listening_items: [],
      });
      expect(vowels?.options.map(option => option.letter)).toEqual(['A', 'B', 'C', 'D']);
      expect(vowels?.options.filter(option => option.is_key)).toHaveLength(1);
      expect(vowels?.options.find(option => option.is_key)?.text).toBe('**A, E, I, O, U**');
      // The key option's `note` is null — the column's real value, and the value that made the
      // published `type: string` unsatisfiable (see the contract spec).
      expect(vowels?.options.find(option => option.is_key)?.note).toBeNull();
      for (const option of vowels?.options ?? []) {
        if (!option.is_key) expect(option.note).not.toBeNull();
        expect(option.br_pt_form).toBe('vogais / A, E, I, O, U');
      }
    });

    it('serves a canonical pack, including an ASR item with no options and a null key', async () => {
      const pack = await service.getPack('pack_les_a2_greetings_intro_v1');
      expect(pack?.schema_version).toBe('canonical');

      const asr = pack?.items.find(item => item.item_id === 'prn_th_voiced_001');
      expect(asr).toMatchObject({
        scoring: 'asr_phoneme_match',
        skill: 'pronunciation',
        key: null,
      });
      expect(asr?.options).toEqual([]);

      const choice = pack?.items.find(item => item.item_id === 'grm_demonstrative_this_001');
      expect(choice).toMatchObject({ scoring: 'choice', key: 'A', skill: 'grammar' });
      expect(choice?.options.find(option => option.is_key)?.text).toBe('This');
    });

    it('returns null for an unknown pack id', async () => {
      await expect(service.getPack('pack_zz_does_not_exist_v1')).resolves.toBeNull();
    });
  });

  describe('GET /content/listening/{dialogue_id}', () => {
    it('serves a shipped dialogue with its voices, slots and transcript', async () => {
      const dialogue = await service.getDialogue('dlg_a1_01_first_intro');
      expect(dialogue).not.toBeNull();
      expect(dialogue).toMatchObject({
        dialogue_id: 'dlg_a1_01_first_intro',
        cefr_level: 'A1',
        status: 'shipped',
        duration_seconds: 51,
      });
      expect(dialogue?.voices.map(voice => `${voice.speaker}:${voice.voice_id}:${voice.accent}`)).toEqual([
        'Ana:v_a:en-US',
        'Ben:v_b:en-US',
      ]);

      // The transcript is per slot in the contract (ADR-027 §3b); every slot repeats the
      // dialogue's own `dialogues.transcript` value — a per-slot slice would need a link the
      // data does not have.
      const stored = (await context.dataSource.query(`SELECT transcript FROM dialogues WHERE id = $1`, [
        'dlg_a1_01_first_intro',
      ])) as Array<{ transcript: string }>;
      const storedTranscript = stored[0]?.transcript;
      expect(typeof storedTranscript).toBe('string');
      expect(dialogue?.slots).toHaveLength(6);
      for (const slot of dialogue?.slots ?? []) {
        expect(slot.transcript).toBe(storedTranscript);
        expect(slot.key).toMatch(/^[A-D]$/);
      }

      expect(dialogue?.slots.map(slot => slot.slot_id)).toEqual([
        'lst_gist_001',
        'lst_detail_001',
        'lst_inference_001',
        'lst_lexical_001',
        'lst_prn_th_001',
        'lst_prn_th_002',
      ]);
      // `lst_pron_minpair` is the one `listening_kind` whose skill is not its suffix.
      expect(dialogue?.slots.find(slot => slot.slot_id === 'lst_prn_th_001')?.skill).toBe('pronunciation');
      expect(dialogue?.slots.find(slot => slot.slot_id === 'lst_gist_001')?.skill).toBe('gist');

      const gist = dialogue?.slots.find(slot => slot.slot_id === 'lst_gist_001');
      // Distractors are the non-key options, by position: the key is B, so A, C, D remain.
      expect(gist?.distractors.map(distractor => distractor.letter)).toEqual(['A', 'C', 'D']);
      expect(gist?.distractors.find(distractor => distractor.letter === 'C')?.type).toBe(
        'overgeneralization',
      );
    });

    it('serves a non-null key for each of the 11 slots that used to load unscorable (ADR-027 §3a)', async () => {
      const expected = Object.entries(PREVIOUSLY_UNSCORABLE_SLOTS);
      const total = expected.reduce((count, [, ids]) => count + ids.length, 0);
      expect(total).toBe(11);

      for (const [dialogueId, slotIds] of expected) {
        const dialogue = await service.getDialogue(dialogueId);
        expect(dialogue).not.toBeNull();
        for (const slotId of slotIds) {
          const slot = dialogue?.slots.find(candidate => candidate.slot_id === slotId);
          expect(slot).toBeDefined();
          expect(slot?.key).toMatch(/^[A-D]$/);
        }
      }

      // And the loader wrote them: the read path is not compensating for a missing column.
      const rows = (await context.dataSource.query(`SELECT id, key FROM items WHERE id = ANY($1)`, [
        expected.flatMap(([, ids]) => ids),
      ])) as Array<{ id: string; key: string | null }>;
      expect(rows).toHaveLength(11);
      for (const row of rows) expect(row.key).toMatch(/^[A-D]$/);
    });

    it('returns null for an unknown dialogue id', async () => {
      await expect(service.getDialogue('dlg_zz_does_not_exist')).resolves.toBeNull();
    });
  });

  describe('the serving rule against rows the corpus cannot supply (ADR-027 §3)', () => {
    const SHADOW_ONLY_ID = 'dlg_zz_shadow_only_probe';
    const AT_FLOOR_ID = 'dlg_zz_at_floor_probe';

    beforeAll(async () => {
      await context.dataSource.query(
        `INSERT INTO dialogues (id, title, cefr_level, status, duration_seconds, transcript)
         VALUES ($1, $2, 'A1', 'shadow_only', 51, $3)`,
        [SHADOW_ONLY_ID, 'A shadow-only row no corpus file declares', '> **Ana:** Shadow only.'],
      );
      await context.dataSource.query(
        `INSERT INTO dialogues (id, title, cefr_level, status, duration_seconds, transcript)
         VALUES ($1, $2, 'A1', 'shipped', 45, $3)`,
        [AT_FLOOR_ID, 'Exactly at the Q-L2 floor', '> **Ana:** Forty-five seconds.'],
      );
    });

    it('serves a shipped dialogue at exactly the 45 s floor', async () => {
      const dialogue = await service.getDialogue(AT_FLOOR_ID);
      expect(dialogue).not.toBeNull();
      expect(dialogue?.duration_seconds).toBe(45);
      expect(dialogue?.voices).toEqual([]);
      expect(dialogue?.slots).toEqual([]);
    });

    it('returns the same null for `shadow_only` as for an unknown id', async () => {
      await expect(service.getDialogue(SHADOW_ONLY_ID)).resolves.toBeNull();
      await expect(service.getDialogue('dlg_zz_not_a_dialogue')).resolves.toBeNull();
    });
  });
});
