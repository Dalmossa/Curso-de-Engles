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
 *     their four dialogues and requires each of the 11 to arrive with its four options served —
 *     the key included and, since ADR-044, unmarked.
 *   * **§3 — the same 404 for "not shipped" and "unknown".** The serving rule lives in the
 *     service (the repository is a pure read), so both cases are asserted at this level: an
 *     unknown id and a `shadow_only` row both return `null`.
 *
 * `R6`/ADR-044 adds a third obligation this file is the only place to assert: **nothing the three
 * payloads serve is a function of the answer key.** The final block states that predicate on the
 * whole loaded catalogue (see its header for the three conjuncts and the six channels they close).
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
  type PackOptionContent,
} from '../../src/modules/content/content.service.js';
import { HmacAudioUrlSigner } from '../../src/infrastructure/audio/hmac-audio-url-signer.js';
import { UnavailableSpeechSynthesizer } from '../../src/infrastructure/speech/unavailable-speech.js';

const CONTENT_ROOT = process.env['CONTENT_REPO_PATH'] ?? join(process.cwd(), '..');

/**
 * The signer `ContentService` now requires (P1.13, ADR-028 §5). A literal here and not a mock:
 * `sign` is a pure function of the key and the clock, so there is nothing to stub.
 */
function testSigner(): HmacAudioUrlSigner {
  return new HmacAudioUrlSigner({ signingKey: 'test-signing-key', baseUrl: 'https://audio.test' });
}

/**
 * ADR-027 §3a's 11 slots, grouped by the dialogue that owns them. Before that fix each loaded
 * with `items.key IS NULL` and no option flagged `is_key`, which made it unscorable. ADR-044 then
 * took the key out of the payload, so this regression's evidence is the table plus the *shape* of
 * what is served: a slot whose key failed to load yields three options, not four.
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
    return new ContentService(repository, testSigner(), new UnavailableSpeechSynthesizer());
  }

  it('serves a shipped dialogue at exactly 45 s', async () => {
    const dialogue = await serviceWith({ duration_seconds: 45 }).getDialogue('dlg_stub');
    expect(dialogue?.duration_seconds).toBe(45);
  });

  it('returns null below 45 s', async () => {
    await expect(serviceWith({ duration_seconds: 44 }).getDialogue('dlg_stub')).resolves.toBeNull();
  });

  it('returns null for a shadow_only row', async () => {
    await expect(
      serviceWith({ status: 'shadow_only' }).getDialogue('dlg_stub'),
    ).resolves.toBeNull();
  });

  it('returns null when the row does not exist', async () => {
    const repository = { findDialogue: async () => null } as unknown as ContentRepository;
    await expect(
      new ContentService(repository, testSigner(), new UnavailableSpeechSynthesizer()).getDialogue(
        'dlg_nope',
      ),
    ).resolves.toBeNull();
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
    service = new ContentService(
      new ContentRepository(context.dataSource),
      testSigner(),
      new UnavailableSpeechSynthesizer(),
    );
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
        reuse_basis: 'authored_material',
        authoring_state: 'authored',
        publication_state: 'publishable',
      });
      expect(lesson?.phases.map(phase => phase.phase)).toEqual([1, 2, 3, 4]);
      expect(lesson?.phases.map(phase => phase.heading)).toEqual([
        'FASE 1 — Input Contextualizado (i+1) [4 min]',
        'FASE 2 — Prática Guiada [5 min]',
        'FASE 3 — Tarefa de Produção (Output & Pronúncia) [4 min]',
        'FASE 4 — Shadow CAT / Verificação Rápida [2 min]',
      ]);
      for (const phase of lesson?.phases ?? []) {
        expect(typeof phase.markdown).toBe('string');
        expect(phase.markdown.length).toBeGreaterThan(0);
      }
    });

    it('serves the authored learner model for `les_a2_it_internet_history`', async () => {
      const lesson = await service.getLesson('les_a2_it_internet_history');
      expect(lesson).not.toBeNull();
      expect(lesson).toHaveProperty('learner_model');
      expect(lesson?.learner_model).toMatchObject({
        lesson_id: 'les_a2_it_internet_history',
        reuse_basis: 'authored_material',
        status: 'authored',
      });
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
      expect(pack?.schema_version).toBe('canonical');

      const declared = (await context.dataSource.query(`SELECT item_ids FROM packs WHERE id = $1`, [
        'pack_les_a1_alphabet_sounds_v1',
      ])) as Array<{ item_ids: string[] }>;
      expect(pack?.items.map(item => item.item_id)).toEqual(declared[0]?.item_ids ?? []);

      const vowels = pack?.items.find(item => item.item_id === 'voc_letters_vowels_001');
      expect(vowels).toBeDefined();
      expect(vowels).toMatchObject({
        item_type: 'contextual_selection',
        skill: 'vocab',
        domain: 'vocab',
        prompt: 'Which letters are the **vowels** in English?',
        scoring: 'choice',
        listening_items: [],
      });
      // A6/R6 (ADR-044): no `key` member, and no `is_key`/`note` on the options. The correct option
      // is identified **in the table**, which is where scoring reads it — the payload serves the
      // complete set, unmarked.
      expect(vowels).not.toHaveProperty('key');
      expect(vowels?.options.map(option => option.letter)).toEqual(['A', 'B', 'C', 'D']);

      const stored = (await context.dataSource.query(`SELECT key FROM items WHERE id = $1`, [
        'voc_letters_vowels_001',
      ])) as Array<{ key: string | null }>;
      expect(stored[0]?.key).toBe('B');
      expect(vowels?.options.find(option => option.letter === stored[0]?.key)?.text).toContain(
        'A, E, I, O, U',
      );

      // `br_pt_form` survives where it is uniform within the item (ADR-044 D6(b)): all four
      // options of this one carry the same gloss, so the member stays for all four.
      // In this canonical item each option has its own gloss, so uniformity does not apply.
      for (const option of vowels?.options ?? []) {
        expect(option).not.toHaveProperty('is_key');
        expect(option).not.toHaveProperty('note');
      }
    });

    it('serves a canonical pack: an ASR item with no options, and a choice item without a key', async () => {
      const pack = await service.getPack('pack_les_a2_greetings_intro_v1');
      expect(pack?.schema_version).toBe('canonical');

      const asr = pack?.items.find(item => item.item_id === 'prn_greetings_workplace_th_h_001');
      expect(asr).toMatchObject({
        scoring: 'asr_phoneme_match',
        skill: 'pronunciation',
      });
      expect(asr?.options).toEqual([]);
      // `scoring` keeps carrying the distinction ADR-027 §2 needed — an item with no options is
      // `asr_phoneme_match` by design, not broken (ADR-004). What goes away is the second signal,
      // the null `key` (ADR-044 D1).
      expect(asr).not.toHaveProperty('key');

      const choice = pack?.items.find(
        item => item.item_id === 'grm_greetings_workplace_formal_register_001',
      );
      expect(choice).toMatchObject({ scoring: 'choice', skill: 'grammar' });
      expect(choice).not.toHaveProperty('key');
      expect(choice?.options.map(option => option.letter)).toEqual(['A', 'B', 'C', 'D']);
      // The correct option is in the served set, and it is not marked.
      expect(
        choice?.options.some(option => option.text.includes('Good morning, Mr. Alves. Nice to meet you.')),
      ).toBe(true);
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
      expect(
        dialogue?.voices.map(voice => `${voice.speaker}:${voice.voice_id}:${voice.accent}`),
      ).toEqual(['Ana:v_a:en-US', 'Ben:v_b:en-US']);

      // The transcript is per slot in the contract (ADR-027 §3b); every slot repeats the
      // dialogue's own `dialogues.transcript` value — a per-slot slice would need a link the
      // data does not have.
      const stored = (await context.dataSource.query(
        `SELECT transcript FROM dialogues WHERE id = $1`,
        ['dlg_a1_01_first_intro'],
      )) as Array<{ transcript: string }>;
      const storedTranscript = stored[0]?.transcript;
      expect(typeof storedTranscript).toBe('string');
      expect(dialogue?.slots).toHaveLength(6);
      expect(dialogue?.slots).toHaveLength(6);
      for (const slot of dialogue?.slots ?? []) {
        expect(slot.transcript).toBe(storedTranscript);
        // A6/R6 (ADR-044 D3): no `key` member and no `distractors[]` — the payload serves the
        // complete option set, the key option included and unmarked.
        expect(slot).not.toHaveProperty('key');
        expect(slot).not.toHaveProperty('distractors');
        expect(slot.options.map(option => option.letter)).toEqual(['A', 'B', 'C', 'D']);
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
      expect(dialogue?.slots.find(slot => slot.slot_id === 'lst_prn_th_001')?.skill).toBe(
        'pronunciation',
      );
      expect(dialogue?.slots.find(slot => slot.slot_id === 'lst_gist_001')?.skill).toBe('gist');

      const gist = dialogue?.slots.find(slot => slot.slot_id === 'lst_gist_001');
      // The served set is the table's set, complete and in order — the key option included, with
      // nothing on the payload saying which one it is (ADR-044 D3: no `key`, no `distractors[]`).
      const gistOptions = (await context.dataSource.query(
        `SELECT position, option_text, is_key, distractor_type FROM item_options
         WHERE item_id = $1 ORDER BY position`,
        ['lst_gist_001'],
      )) as Array<{
        position: number;
        option_text: string;
        is_key: boolean;
        distractor_type: string | null;
      }>;
      expect(gistOptions).toHaveLength(4);
      expect(gist?.options.map(option => option.text)).toEqual(
        gistOptions.map(row => row.option_text),
      );
      expect(gist?.options.map(option => option.letter)).toEqual(
        gistOptions.map(row => 'ABCD'.charAt(row.position - 1)),
      );
      // The flag and the rationale stay in the table: they are the material a *post-answer*
      // feedback surface would read, and that surface does not exist (ADR-044 D2/D3, R3).
      expect(gistOptions.filter(row => row.is_key)).toHaveLength(1);
      expect(gistOptions.filter(row => row.distractor_type === 'overgeneralization')).toHaveLength(
        1,
      );
    });

    it('keeps a scored key for each of the 11 slots that used to load unscorable (ADR-027 §3a)', async () => {
      const expected = Object.entries(PREVIOUSLY_UNSCORABLE_SLOTS);
      const total = expected.reduce((count, [, ids]) => count + ids.length, 0);
      expect(total).toBe(11);

      // The regression's evidence moves with the fix (ADR-044): the payload no longer says which
      // option is correct, so the proof is (i) the table and (ii) the *completeness* of the served
      // set — a slot whose key had failed to load has three options, not four.
      const rows = (await context.dataSource.query(`SELECT id, key FROM items WHERE id = ANY($1)`, [
        expected.flatMap(([, ids]) => ids),
      ])) as Array<{ id: string; key: string | null }>;
      expect(rows).toHaveLength(11);
      for (const row of rows) expect(row.key).toMatch(/^[A-D]$/);

      for (const [dialogueId, slotIds] of expected) {
        const dialogue = await service.getDialogue(dialogueId);
        expect(dialogue).not.toBeNull();
        for (const slotId of slotIds) {
          const slot = dialogue?.slots.find(candidate => candidate.slot_id === slotId);
          expect(slot).toBeDefined();
          expect(slot?.options.map(option => option.letter)).toEqual(['A', 'B', 'C', 'D']);
        }
      }
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
   * **R6/A6 — nothing the `/content/*` payloads serve is a function of the answer key.**
   *
   * A6a wrote this block to *pin the defect*: seven channels over three routes, three of them
   * derived, so that the fix had an exact surface to invert. `docs/adr/044` is `Accepted`
   * (2026-10-15) and A6c inverted it, so what is asserted now is the closure. The predicate is
   * D6's, and all three conjuncts are load-bearing — each one covers a channel the others miss:
   *
   * | # | Conjunct | The channel that makes it necessary |
   * |---|---|---|
   * | (a) | no member of the projection is a function of the key | `items[].key` (841/841 scorable items), `options[].is_key` (841 options), `options[].note` — `null` on 841/841 key options and 0/2523 distractors |
   * | (b) | the options of one item are isomorphic: same members, same `null` pattern | `br_pt_form`, the seventh channel — 17 items had exactly one gloss-less option and it was the key in all 17 (34 items mixed gloss and no gloss inside the item) |
   * | (c) | the served letter set is the item's complete set | `slots[].distractors[]` — the complement of the key on 74/74 slots |
   *
   * "All three are load-bearing" is not rhetoric: the negative control measured it. With
   * `items[].key`, `options[].is_key` and `slots[].key` withdrawn — the plan's *"one line of
   * `select`"* — 4 of the 7 pinned assertions stayed green, because `note`, the distractor
   * complement and the lesson body are independent channels (`docs/adr/044` §3).
   *
   * The oracle is the **table** (`items.key`, `item_options.is_key`), never the payload. A test
   * that learns which option is correct *from the payload* goes vacuous exactly when the payload
   * stops saying it — which is the state being asserted, so it would pass for the wrong reason.
   * The first draft of A6a did exactly that (it read `option.is_key`); ADR-044 §3 reproduces it.
   *
   * One member is deliberately still served, and it is asserted below so that a later reader does
   * not "fix" a decision: the authored lesson body keeps its key (D5 — the lesson is study
   * material, not the assessment payload). Scoring never reads any of this: it goes
   * `ContentRepository` → `item_options.is_key` in the database, and
   * `POST /learners/{id}/practice` takes a `response`, never a key.
   */
  describe('R6 — nothing the `/content/*` payloads serve is a function of the answer key (A6, ADR-044)', () => {
    let packs: PackContent[];
    let dialogues: DialogueContent[];
    let lessons: LessonContent[];
    /**
     * The key of every item, read from `items.key` — **the table is the oracle, never the
     * payload.** A6a's first draft read `option.is_key` instead and went vacuous the moment the
     * member was withdrawn, i.e. exactly when the channel it existed to pin was still open.
     */
    let keyByItem: Map<string, string | null>;

    beforeAll(async () => {
      const idsOf = async (table: string): Promise<string[]> => {
        const rows = (await context.dataSource.query(
          `SELECT id FROM ${table} ORDER BY id`,
        )) as Array<{
          id: string;
        }>;
        return rows.map(row => row.id);
      };

      packs = (await Promise.all((await idsOf('packs')).map(id => service.getPack(id)))).filter(
        (pack): pack is PackContent => pack !== null,
      );
      dialogues = (
        await Promise.all((await idsOf('dialogues')).map(id => service.getDialogue(id)))
      ).filter((dialogue): dialogue is DialogueContent => dialogue !== null);
      lessons = (
        await Promise.all((await idsOf('lessons')).map(id => service.getLesson(id)))
      ).filter((lesson): lesson is LessonContent => lesson !== null);

      const keyRows = (await context.dataSource.query(`SELECT id, key FROM items`)) as Array<{
        id: string;
        key: string | null;
      }>;
      keyByItem = new Map(keyRows.map(row => [row.id, row.key]));
    }, 300_000);

    const choiceItems = () =>
      packs.flatMap(pack => pack.items).filter(item => item.scoring === 'choice');

    it('carries no `key` on an item and no `is_key` or `note` on an option (D6a)', () => {
      const scorable = choiceItems();
      expect(scorable.length).toBeGreaterThan(0);

      expect(scorable.filter(item => 'key' in item).map(item => item.item_id)).toEqual([]);
      const options = scorable.flatMap(item => item.options);
      expect(options.filter(option => 'is_key' in option)).toEqual([]);
      expect(options.filter(option => 'note' in option)).toEqual([]);

      // The names do not come back under another spelling: the projection's members are `letter`
      // and `text`, plus `br_pt_form` only when published under D6(b)'s rule (the next test pins it).
      const memberNames = new Set(options.flatMap(option => Object.keys(option)));
      expect([...memberNames].every(name => ['letter', 'text', 'br_pt_form'].includes(name))).toBe(
        true,
      );
      expect(memberNames.has('letter')).toBe(true);
      expect(memberNames.has('text')).toBe(true);
    });

    it('makes the options of one item isomorphic — same members, same `null` pattern (D6b)', () => {
      /** Members present, and whether each is null — the two halves of "isomorphic". */
      const shapeOf = (option: PackOptionContent): string =>
        Object.entries(option)
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([name, value]) => `${name}=${value === null ? 'null' : 'value'}`)
          .join(',');

      const nonIsomorphic = choiceItems()
        .map(item => ({ item_id: item.item_id, shapes: new Set(item.options.map(shapeOf)) }))
        .filter(entry => entry.shapes.size !== 1);
      expect(nonIsomorphic.map(entry => entry.item_id)).toEqual([]);
    });

    it('serves every scorable item its complete option set, lettered A–D (D6c)', async () => {
      const scorable = choiceItems();
      const notFourAbcd = scorable.filter(
        item =>
          item.options.length !== 4 ||
          item.options.map(option => option.letter).join('') !== 'ABCD',
      );
      expect(notFourAbcd.map(item => item.item_id)).toEqual([]);

      // And it is the table's set, not a filtered subset of it: served count equals row count for
      // every scorable item, so "the key option is among them, unmarked" is measured, not assumed.
      const rows = (await context.dataSource.query(
        `SELECT item_id, count(*)::int AS options FROM item_options GROUP BY item_id`,
      )) as Array<{ item_id: string; options: number }>;
      const rowsByItem = new Map(rows.map(row => [row.item_id, row.options]));
      const subset = scorable.filter(item => rowsByItem.get(item.item_id) !== item.options.length);
      expect(subset.map(item => item.item_id)).toEqual([]);
    });

    it('publishes `br_pt_form` only when every option of the item has one (D6b, the seventh channel)', async () => {
      const scorable = choiceItems();
      const partial = scorable.filter(item => {
        const withGloss = item.options.filter(option => option.br_pt_form !== undefined).length;
        return withGloss !== 0 && withGloss !== item.options.length;
      });
      // The invariant: never a partial publication (that would leak the key by absence).
      expect(partial.map(item => item.item_id)).toEqual([]);

      const withGloss = scorable.filter(item =>
        item.options.every(option => option.br_pt_form !== undefined),
      );
      const withoutGloss = scorable.filter(item =>
        item.options.every(option => option.br_pt_form === undefined),
      );
      expect(withGloss.length + withoutGloss.length).toBe(scorable.length);
      expect(scorable.length).toBeGreaterThan(0);

      // Table truth: publication is uniform-only. A mixed item in the table is never surfaced
      // partially; a uniformly glossed item in the table is not withheld.
      const rows = (await context.dataSource.query(
        `SELECT i.id, count(*)::int AS options,
                count(*) FILTER (WHERE o.br_pt_form IS NOT NULL)::int AS glossed
           FROM items i JOIN item_options o ON o.item_id = i.id
          WHERE i.scoring = 'choice'
          GROUP BY i.id`,
      )) as Array<{ id: string; options: number; glossed: number }>;
      const glossedByItem = new Map(rows.map(row => [row.id, row.glossed]));

      const publishedWhileMixed = scorable.filter(item => {
        const glossed = glossedByItem.get(item.item_id) ?? 0;
        const uniform = glossed === 0 || glossed === item.options.length;
        return !uniform && item.options.some(option => option.br_pt_form !== undefined);
      });
      expect(publishedWhileMixed.map(item => item.item_id)).toEqual([]);

      const withheldWhileUniformGlossed = scorable.filter(item => {
        const glossed = glossedByItem.get(item.item_id) ?? 0;
        return glossed === item.options.length && item.options.some(option => option.br_pt_form === undefined);
      });
      expect(withheldWhileUniformGlossed.map(item => item.item_id)).toEqual([]);
    });

    it('serves each slot its complete option set, with no `key` and no `distractors[]` (D3)', async () => {
      const slots = dialogues.flatMap(dialogue => dialogue.slots);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.filter(slot => 'key' in slot).map(slot => slot.slot_id)).toEqual([]);
      expect(slots.filter(slot => 'distractors' in slot).map(slot => slot.slot_id)).toEqual([]);
      const notFourAbcd = slots.filter(
        slot => slot.options.map(option => option.letter).join('') !== 'ABCD',
      );
      expect(notFourAbcd.map(slot => slot.slot_id)).toEqual([]);

      // Against the table, option by option and in order: `distractors[]` published the complement
      // of the key, so "the served set is complete" is the half that has to be measured, not the
      // count alone. (The key row is among the four — 11 of the 74 slots mark it with a check mark
      // rather than in the value column, ADR-027 §3a.)
      const rows = (await context.dataSource.query(
        `SELECT item_id, option_text FROM item_options
          WHERE LEFT(item_id, 4) = 'lst_' ORDER BY item_id, position`,
      )) as Array<{ item_id: string; option_text: string }>;
      const bySlot = new Map<string, string[]>();
      for (const row of rows) {
        bySlot.set(row.item_id, [...(bySlot.get(row.item_id) ?? []), row.option_text]);
      }
      const disagrees = slots.filter(slot => {
        const fromTable = bySlot.get(slot.slot_id) ?? [];
        return (
          fromTable.length !== slot.options.length ||
          fromTable.some((text, index) => text !== slot.options[index]?.text)
        );
      });
      expect(disagrees.map(slot => slot.slot_id)).toEqual([]);
    });

    it('keeps the key and the flag in the table — the change is a projection, not a deletion (Neutral)', async () => {
      const scorable = choiceItems();
      const keyRows = (await context.dataSource.query(
        `SELECT id, key FROM items WHERE scoring = 'choice'`,
      )) as Array<{ id: string; key: string | null }>;
      expect(keyRows.filter(row => row.key === null).map(row => row.id)).toEqual([]);
      expect(keyRows.filter(row => row.key !== keyByItem.get(row.id)).map(row => row.id)).toEqual(
        [],
      );

      const flagRows = (await context.dataSource.query(
        `SELECT item_id, count(*) FILTER (WHERE is_key)::int AS keys FROM item_options GROUP BY item_id`,
      )) as Array<{ item_id: string; keys: number }>;
      const keysByItem = new Map(flagRows.map(row => [row.item_id, row.keys]));
      const wrong = scorable.filter(item => keysByItem.get(item.item_id) !== 1);
      expect(wrong.map(item => item.item_id)).toEqual([]);

      // The pair that makes this a read-path change: present in the table, absent from the payload.
      // If a later change stops writing the flag, this test fails for the data, not for the reader.
      const flaggedInPayload = scorable.filter(item =>
        item.options.some(option => 'is_key' in option),
      );
      expect(flaggedInPayload.map(item => item.item_id)).toEqual([]);
    });

    it('still serves the authored key inside the lesson body — by decision (D5)', () => {
      // Not a defect pin, and deliberately the inverse of the ones above: ADR-044 D5 keeps the key
      // in the lesson, because the body is the study material (`AGENTS.md`: Input → Guided Practice
      // → Output Task → Formative Check) rather than the assessment payload. A phase that strips it
      // changes this test and the ADR together; the alternative was measured and not chosen.
      const withKey = lessons.filter(lesson =>
        lesson.phases.some(
          phase => phase.markdown.includes('**Key:**') || phase.markdown.includes('✓'),
        ),
      );
      expect(lessons.length).toBeGreaterThan(0);
      expect(withKey.length).toBe(lessons.length);

      const markdown = (
        lessons.find(lesson => lesson.lesson_id === 'les_a1_alphabet_sounds')?.phases ?? []
      )
        .map(phase => phase.markdown)
        .join('\n');
      expect(markdown).toContain('| B | **A, E, I, O, U** |');
      expect(markdown).toContain('**Key:** B');
    });
  });
});
