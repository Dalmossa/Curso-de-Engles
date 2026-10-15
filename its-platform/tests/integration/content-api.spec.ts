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
import {
  ContentService,
  type DialogueContent,
  type LessonContent,
  type PackContent,
} from '../../src/modules/content/content.service.js';
import { HmacAudioUrlSigner } from '../../src/infrastructure/audio/hmac-audio-url-signer.js';

const CONTENT_ROOT = process.env['CONTENT_REPO_PATH'] ?? join(process.cwd(), '..');

/**
 * The signer `ContentService` now requires (P1.13, ADR-028 §5). A literal here and not a mock:
 * `sign` is a pure function of the key and the clock, so there is nothing to stub.
 */
function testSigner(): HmacAudioUrlSigner {
  return new HmacAudioUrlSigner({ signingKey: 'test-signing-key', baseUrl: 'https://audio.test' });
}

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
    return new ContentService(repository, testSigner());
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
    await expect(new ContentService(repository, testSigner()).getDialogue('dlg_nope')).resolves.toBeNull();
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
    service = new ContentService(new ContentRepository(context.dataSource), testSigner());
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

  /**
   * **A6 — the answer key the catalogue serves. This block pins the defect; it does not approve it.**
   *
   * R6 of the plan is unconditional: *"nunca expor θ marcado como não-reportável — nem gabaritos,
   * keys, nem parâmetros de item"* (`docs/adr/043-h3-theta-cors-sdk.md`, R1's table). Measured on
   * 2026-10-15 over the loaded catalogue, all three `/content/*` payloads publish the key of
   * everything they publish, with no exception — and two of the six channels are **derived**: they
   * still hand the key over after `key` and `is_key` alone are removed.
   *
   * | Route | Member | Measured |
   * |---|---|---|
   * | `GET /content/packs/{id}` | `items[].key` | 841 of the 841 `scoring: 'choice'` items (the other 6 are `asr_phoneme_match` — `null` by design, ADR-004) |
   * | `GET /content/packs/{id}` | `items[].options[].is_key` | 841 options — exactly one per scorable item |
   * | `GET /content/packs/{id}` | `items[].options[].note` *(derived)* | `null` on **841 of 841** key options and on **0 of 2523** distractors — `note === null` *is* the key |
   * | `GET /content/listening/{id}` | `slots[].key` | 74 of 74 slots, across all 13 shipped dialogues |
   * | `GET /content/listening/{id}` | `slots[].distractors[]` *(derived)* | on **74 of 74** slots the key is the letter **absent** from the distractor set (the set is closed at A–D) |
   * | `GET /content/lessons/{id}` | `phases[].markdown` | 122 of 122 lessons — the authored `**Key:** B` line, and the correct row in bold |
   *
   * The contract declares `key`, `is_key` and `slots[].key` **required** (`api-spec.openapi.yaml`
   * lines 416, 538, 589), and **ADR-027 (Accepted)** §2 says `is_key` "marks the key" while its
   * *Neutral* consequences say "the pack's consumer needs `is_key` and `scoring`, which are
   * published". The exposure is **decided**, not accidental; closing it amends an Accepted ADR and
   * breaks the published shape (`CONSTITUTION.md` §4.4), so it is a human decision (R9) and the
   * record is **ADR-044 (Proposed)**.
   *
   * Why pin a defect at all: the fix is a contract change, and the only way to know it is complete
   * is to have today's state asserted member by member — including the two derived channels, which
   * a naive removal of `key`/`is_key` leaves intact. When ADR-044 lands these assertions are
   * **inverted** (the replacement text is in that ADR's implementation plan) and the negative
   * control is that reverting the fix turns them red again. Nothing in this repository reads any of
   * them: scoring goes `ContentRepository` → `item_options.is_key` in the database, and
   * `POST /learners/{id}/practice` takes a `response`, never a `key`.
   */
  describe('the answer key the `/content/*` payloads serve (A6 — pinned defect, ADR-044 Proposed)', () => {
    let packs: PackContent[];
    let dialogues: DialogueContent[];
    let lessons: LessonContent[];
    /**
     * The key of every item, read from `items.key` — **the table is the oracle, never the
     * payload.** A test that takes which option is the key from the payload goes vacuous the
     * moment `options[].is_key` is withdrawn (reproduced: the first draft of the `note` assertion
     * below failed for the wrong reason), while the channel it is meant to pin stays open.
     */
    let keyByItem: Map<string, string | null>;

    beforeAll(async () => {
      const idsOf = async (table: string): Promise<string[]> => {
        const rows = (await context.dataSource.query(`SELECT id FROM ${table} ORDER BY id`)) as Array<{
          id: string;
        }>;
        return rows.map(row => row.id);
      };

      packs = (await Promise.all((await idsOf('packs')).map(id => service.getPack(id)))).filter(
        (pack): pack is PackContent => pack !== null,
      );
      dialogues = (await Promise.all((await idsOf('dialogues')).map(id => service.getDialogue(id)))).filter(
        (dialogue): dialogue is DialogueContent => dialogue !== null,
      );
      lessons = (await Promise.all((await idsOf('lessons')).map(id => service.getLesson(id)))).filter(
        (lesson): lesson is LessonContent => lesson !== null,
      );

      const keyRows = (await context.dataSource.query(`SELECT id, key FROM items`)) as Array<{
        id: string;
        key: string | null;
      }>;
      keyByItem = new Map(keyRows.map(row => [row.id, row.key]));
    }, 300_000);

    const choiceItems = () => packs.flatMap(pack => pack.items).filter(item => item.scoring === 'choice');

    it('serves `items[].key` for every item the pack can score', () => {
      const scorable = choiceItems();
      expect(scorable.length).toBeGreaterThan(0);
      expect(scorable.filter(item => item.key === null).map(item => item.item_id)).toEqual([]);
      // And it is the stored letter, not some other letter: the payload agrees with `items.key`.
      const disagreesWithTheTable = scorable.filter(item => item.key !== keyByItem.get(item.item_id));
      expect(disagreesWithTheTable.map(item => item.item_id)).toEqual([]);
    });

    it('serves `options[].is_key` — exactly one key option per scorable item, on the table key', () => {
      const scorable = choiceItems();
      const notExactlyOne = scorable.filter(item => item.options.filter(option => option.is_key).length !== 1);
      expect(notExactlyOne.map(item => item.item_id)).toEqual([]);

      const flaggedButNotTheKey = scorable.filter(
        item => item.options.find(option => option.is_key)?.letter !== keyByItem.get(item.item_id),
      );
      expect(flaggedButNotTheKey.map(item => item.item_id)).toEqual([]);

      // Not part of the leak, but load-bearing for the fix: the option set is *complete*, so
      // withdrawing the flag leaves a set a client can still render. (Measured 2026-10-15: all
      // 841 scorable items serve four options, lettered A–D, and `item_options` holds four rows
      // for each of the 74 listening slots too — the key plus three distractors.)
      const notFourAbcd = choiceItems().filter(
        item => item.options.length !== 4 || item.options.map(option => option.letter).join('') !== 'ABCD',
      );
      expect(notFourAbcd.map(item => item.item_id)).toEqual([]);
    });

    it('hands the key over through `options[].note` too, which is null on exactly the key options', () => {
      const scorable = choiceItems();
      const keyOption = scorable.map(item => ({
        item_id: item.item_id,
        keyNote: item.options.find(option => option.letter === keyByItem.get(item.item_id))?.note,
        distractorNotes: item.options
          .filter(option => option.letter !== keyByItem.get(item.item_id))
          .map(option => option.note),
      }));
      expect(keyOption.length).toBeGreaterThan(0);

      expect(keyOption.filter(entry => entry.keyNote !== null).map(entry => entry.item_id)).toEqual([]);
      expect(keyOption.filter(entry => entry.distractorNotes.includes(null)).map(entry => entry.item_id)).toEqual([]);
    });

    it('does not leak through `options[].br_pt_form`, which separates no option from another', () => {
      const options = choiceItems().flatMap(item =>
        item.options.map(option => ({ isKey: option.letter === keyByItem.get(item.item_id), form: option.br_pt_form })),
      );
      // Measured: null on 43 of 841 key options and on 48 of 2523 distractors. Both sides carry
      // nulls, so a client cannot read the key off it — recorded here so a later reader does not
      // "fix" a field that is not a channel.
      expect(options.filter(option => option.isKey && option.form === null).length).toBeGreaterThan(0);
      expect(options.filter(option => !option.isKey && option.form === null).length).toBeGreaterThan(0);
    });

    it('serves `slots[].key`, equal to the table value', () => {
      const slots = dialogues.flatMap(dialogue => dialogue.slots);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.filter(slot => slot.key === null).map(slot => slot.slot_id)).toEqual([]);
      expect(slots.filter(slot => slot.key !== keyByItem.get(slot.slot_id)).map(slot => slot.slot_id)).toEqual([]);
    });

    it('hands the key over through `slots[].distractors[]` too — the letter the slot distractor set omits', () => {
      const slots = dialogues.flatMap(dialogue => dialogue.slots);
      // The second channel, and the reason `slots[].key` alone is not the fix: `distractors[]` is
      // the *complement* of the key, so withdrawing the member leaves the key recoverable as
      // {A…D} \ distractors. (Measured: true for all 74 shipped slots; none has an empty set.)
      const keyAbsentFromItsDistractors = slots.filter(slot =>
        slot.distractors.every(distractor => distractor.letter !== keyByItem.get(slot.slot_id)),
      );
      expect(keyAbsentFromItsDistractors.length).toBe(slots.length);
      expect(slots.filter(slot => slot.distractors.length !== 3).map(slot => slot.slot_id)).toEqual([]);
    });

    it('serves the authored key inside the lesson body itself', () => {
      const withKey = lessons.filter(lesson =>
        lesson.phases.some(phase => phase.markdown.includes('**Key:**') || phase.markdown.includes('✓')),
      );
      expect(lessons.length).toBeGreaterThan(0);
      expect(withKey.length).toBe(lessons.length);

      const markdown = (lessons.find(lesson => lesson.lesson_id === 'les_a1_alphabet_sounds')?.phases ?? [])
        .map(phase => phase.markdown)
        .join('\n');
      expect(markdown).toContain('| B | **A, E, I, O, U** |');
      expect(markdown).toContain('**Key:** B');
    });
  });
});
