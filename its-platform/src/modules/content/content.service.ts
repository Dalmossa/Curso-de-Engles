import { Inject, Injectable } from '@nestjs/common';
import type { LessonPhase } from '../../infrastructure/content/content-types.js';
import {
  ContentRepository,
  type ItemOptionRow,
  type PackRows,
} from '../../infrastructure/repositories/content.repository.js';
import { AUDIO_URL_SIGNER } from '../../infrastructure/audio/audio-url-signer.js';
import type { AudioUrlSigner } from '../../infrastructure/audio/audio-url-signer.js';

/**
 * P1.12 — the three `/content/*` payloads, read from the persisted catalog and nothing else
 * (ADR-027 §1). There is no mock left in this file and no file access: the loader wrote the
 * rows, the repository reads them, and this service is the mapping between the columns and the
 * shapes the two OpenAPI files publish.
 *
 * Each mapping is a decision ADR-027 measured, not a preference:
 *
 * - **`skill` from `skill_ids[0]`'s namespace.** `"vocab.hedge_calibration"` → `vocab`; the
 *   legacy packs store the bare domain (`["vocab"]`), so both generations land in the published
 *   enum. Measured over the catalogue: vocab 689, grammar 141, listening 74, reading 8,
 *   pronunciation 7, coherence 2 — all six published values, nothing outside them.
 * - **`options[].letter` from `position`.** 1→A … 6→F; the corpus uses 1–4 everywhere (measured:
 *   `max(position) = 4`), and the DDL CHECKs the 1–6 range.
 * - **No member of a projection is a function of the answer key** (ADR-044, `Accepted`
 *   2026-10-15). `items[].key`, `options[].is_key`, `options[].note`, `slots[].key` and
 *   `slots[].distractors[]` are *not* published; the key option is served inside a complete,
 *   unmarked set, and the flag/rationale stay in the table where scoring reads them. `br_pt_form`
 *   is published per item, and only when every option of that item carries one (the rule and the
 *   17-item measurement are on the interface below).
 * - **`listening_items` is `[]`.** ADR-004's declared default, and a measured fact rather than
 *   an omission: no pack item owns a listening slot (`items.clip_ids` is never populated).
 * - **`slots[].skill` is `listening_kind` minus its `lst_` prefix**, with the corpus's single
 *   irregular row (`lst_pron_minpair`) mapped to `pronunciation` — `listening-corpus-spec.md`
 *   §4's own type→skill table, whose six rows are all in use.
 * - **`slots[].transcript` is the dialogue's transcript.** The published shape asks for it per
 *   slot and no slot↔clip link exists, so the dialogue's string is repeated once per slot
 *   (ADR-027 §3b records the duplication as the contract's, not the data's).
 * - **Only `shipped` is served, and only at/above the Q-L2 floor.** A dialogue that fails either
 *   is `null` — the *same* 404 body as an unknown id, so a caller cannot distinguish "does not
 *   exist" from "exists, not shipped" (ADR-027 §3).
 */

/** `A`–`F`: the contract's `letter` for `item_options.position` 1–6. */
const LETTERS = 'ABCDEF';

/**
 * `listening_corpus-spec` §4's type→skill table, as the mapping the ADR states: the `lst_`
 * prefix comes off, and `lst_pron_minpair` is the one row whose skill name is not its suffix.
 */
function listeningSkillOf(kind: string | null): string {
  const base = (kind ?? '').replace(/^lst_/, '');
  return base === 'pron_minpair' ? 'pronunciation' : base;
}

/** `items.skill_ids[0]`'s namespace, e.g. `"grammar.third_person_s"` → `"grammar"`. */
function skillNamespaceOf(skillIds: string[]): string {
  return (skillIds[0] ?? '').split('.')[0] ?? '';
}

/** Options indexed by their item, in the `position` order the query already applied. */
function optionsByItem(options: ItemOptionRow[]): Map<string, ItemOptionRow[]> {
  const grouped = new Map<string, ItemOptionRow[]>();
  for (const option of options) {
    const list = grouped.get(option.item_id);
    if (list) list.push(option);
    else grouped.set(option.item_id, [option]);
  }
  return grouped;
}

/** One authored `FASE` block, exactly as `lessons.body` carries it (ADR-027 §5). */
export interface LessonContent {
  lesson_id: string;
  title: string;
  cefr_level: string;
  reuse_basis: string;
  authoring_state: string;
  publication_state: string;
  phases: LessonPhase[];
  /** The parsed `DADOS PARA O LEARNER MODEL` block, or `null` for the one lesson without one. */
  learner_model: unknown;
}

export interface PackOptionContent {
  letter: string;
  text: string;
  /**
   * `item_options.br_pt_form` — published **only when every option of the item carries one**
   * (ADR-044 D6(b)). The rule is not cosmetic: measured 2026-10-15, 17 items had exactly one
   * gloss-less option and it was the key in all 17, so publishing a partial gloss tells a client
   * which option is correct. The global ratio (43 of 841 key options, 48 of 2523 distractors) reads
   * like no channel at all — inside an item, a single gloss-less option is the key.
   */
  br_pt_form?: string;
}

/** ADR-004's `List[ListeningSlot]`, declared and served empty (§`listening_items` above). */
export interface PackListeningSlotContent {
  slot_id: string;
  skill: string;
}

export interface PackItemContent {
  item_id: string;
  item_type: string;
  skill: string;
  domain: string;
  prompt: string;
  scoring: string;
  options: PackOptionContent[];
  listening_items: PackListeningSlotContent[];
}

export interface PackContent {
  pack_id: string;
  lesson_id: string;
  schema_version: string;
  items: PackItemContent[];
}

export interface DialogueVoiceContent {
  voice_id: string;
  speaker: string;
  accent: string;
}

export interface DialogueOptionContent {
  letter: string;
  text: string;
}

export interface DialogueSlotContent {
  slot_id: string;
  skill: string;
  /**
   * Every option of the slot — the key included and unmarked (ADR-044 D3). `distractors[]` used to
   * publish the *complement* of the key, which made the key recoverable as {A…D} \ distractors on
   * all 74 shipped slots; the complete set is also what a renderer needs, since a client cannot
   * draw an item from its distractors alone.
   */
  options: DialogueOptionContent[];
  transcript: string;
}

export interface DialogueContent {
  dialogue_id: string;
  title: string;
  cefr_level: string;
  status: string;
  duration_seconds: number;
  voices: DialogueVoiceContent[];
  slots: DialogueSlotContent[];
}

/** One signed render in a dialogue's playlist (ADR-028 §2 / §7). */
export interface DialogueAudioClipContent {
  clip_id: string;
  sort_index: number;
  speaker_id: string;
  voice_id: string;
  take: number;
  /** `clip_renders.rate`, converted from NUMERIC's string to the number the contract publishes. */
  rate: number;
  /** `clip_renders.duration_s`, same conversion. */
  duration_s: number;
  url: string;
  expires_at: string;
}

export interface DialogueAudioContent {
  dialogue_id: string;
  cefr_level: string;
  /** The TTL the signer actually used, so a client never has to know the policy (ADR-028 §7). */
  ttl_seconds: number;
  clips: DialogueAudioClipContent[];
}

/** The Q-L2 floor (ADR-027 §3); the DDL's own CHECK is the full 45–120 s range. */
const MIN_DIALOGUE_SECONDS = 45;

@Injectable()
export class ContentService {
  constructor(
    private readonly contentRepository: ContentRepository,
    @Inject(AUDIO_URL_SIGNER) private readonly audioUrlSigner: AudioUrlSigner,
  ) {}

  /**
   * The lesson, its four phases and its learner model — all from `lessons`, and `phases`
   * verbatim out of `lessons.body` (ADR-027 §5). Unknown id ⇒ `null` (the controller 404s).
   */
  async getLesson(id: string): Promise<LessonContent | null> {
    const lesson = await this.contentRepository.findLesson(id);
    if (!lesson) return null;

    const body = readBody(lesson.body);
    return {
      lesson_id: lesson.id,
      title: lesson.title,
      cefr_level: lesson.cefr_level,
      reuse_basis: lesson.reuse_basis,
      authoring_state: lesson.authoring_state,
      publication_state: lesson.publication_state,
      phases: body.phases,
      learner_model: body.learner_model,
    };
  }

  /**
   * The pack, its items and their options. `items` follow `packs.item_ids`' own order (the
   * order the pack file declares) and `options` follow `position`. Both `schema_version` values
   * are served — ADR-004's two pack schemas, 7 canonical and 115 legacy_v1 today.
   */
  async getPack(id: string): Promise<PackContent | null> {
    const rows: PackRows | null = await this.contentRepository.findPack(id);
    if (!rows) return null;

    const options = optionsByItem(rows.options);
    const position = new Map(rows.pack.item_ids.map((itemId, index) => [itemId, index] as const));
    const rankOf = (itemId: string): number => position.get(itemId) ?? Number.MAX_SAFE_INTEGER;

    const items = [...rows.items]
      .sort((a, b) => rankOf(a.id) - rankOf(b.id))
      .map(item => {
        const stored = options.get(item.id) ?? [];
        // D6(b): `br_pt_form` is published only when *every* option of the item carries one. Inside
        // an item, a gloss present on some options and missing on others points at the one that is
        // missing — measured, 17 items had exactly one gloss-less option and it was the key in all
        // 17. The alternative (publish the glosses that exist) is the leak; the alternative (publish
        // the member as `null` where missing) is the same leak spelled differently.
        const glossed = stored.length > 0 && stored.every(option => option.br_pt_form !== null);
        return {
          item_id: item.id,
          item_type: item.item_type,
          skill: skillNamespaceOf(item.skill_ids),
          domain: item.domain_id,
          prompt: item.stem,
          scoring: item.scoring,
          options: stored.map(option => ({
            letter: LETTERS.charAt(option.position - 1),
            text: option.option_text,
            ...(glossed ? { br_pt_form: option.br_pt_form as string } : {}),
          })),
          listening_items: [],
        };
      });

    return {
      pack_id: rows.pack.id,
      lesson_id: rows.pack.lesson_id,
      schema_version: rows.pack.schema_version,
      items,
    };
  }

  /**
   * The dialogue, its voices and its keyed slots, or `null` for an unknown id **and** for a row
   * that is not `shipped` or falls below the 45 s floor — one `null`, one 404 body, so the two
   * cases are indistinguishable to the caller (ADR-027 §3).
   */
  async getDialogue(id: string): Promise<DialogueContent | null> {
    const rows = await this.contentRepository.findDialogue(id);
    if (!rows) return null;

    const { dialogue } = rows;
    // The floor is re-asserted here rather than trusted to the reader: `shipped` is the state
    // the endpoint serves, and a sub-45 s dialogue is a content defect the DDL should have
    // caught, not something to publish.
    if (dialogue.status !== 'shipped' || dialogue.duration_seconds < MIN_DIALOGUE_SECONDS) {
      return null;
    }

    const options = optionsByItem(rows.options);
    return {
      dialogue_id: dialogue.id,
      title: dialogue.title,
      cefr_level: dialogue.cefr_level,
      status: dialogue.status,
      duration_seconds: dialogue.duration_seconds,
      voices: rows.voices.map(voice => ({
        voice_id: voice.voice_id,
        speaker: voice.speaker,
        accent: voice.accent,
      })),
      slots: rows.slots.map(slot => ({
        slot_id: slot.item_id,
        skill: listeningSkillOf(slot.listening_kind),
        transcript: dialogue.transcript,
        // The complete set, by `position`, in the order the reader returns (ADR-044 D3). The key
        // option is in it and carries nothing that distinguishes it; the flag (`is_key`) and the
        // rationale (`distractor_type`) stay in the table for a post-answer surface to read, and no
        // such surface exists yet (R3).
        options: (options.get(slot.item_id) ?? []).map(option => ({
          letter: LETTERS.charAt(option.position - 1),
          text: option.option_text,
        })),
      })),
    };
  }

  /**
   * The dialogue's audio playlist, or `null` for every refusal (P1.13, ADR-028).
   *
   * The *admission* decision is entirely `ContentRepository.findDialogueAudio`'s SQL (§3): this
   * method only assembles and signs, so "unknown id", "not shipped", "no complete take" and
   * "L2 not ear-checked" all arrive here as the same `null` and leave as the same 404 body.
   *
   * `rate` and `duration_s` are converted with `Number(...)` because the driver returns
   * `NUMERIC` as a string. Publishing `"1.00"` where the schema says `type: number` is the
   * defect class ADR-027 §2 had to repair in `PackOption.note`, and ADR-028 §2 names it here.
   */
  async getDialogueAudio(id: string, rate: number): Promise<DialogueAudioContent | null> {
    const rows = await this.contentRepository.findDialogueAudio(id, rate);
    if (!rows) return null;

    const clips = rows.clips.map(clip => {
      const signed = this.audioUrlSigner.sign({
        clipId: clip.clip_id,
        take: clip.take,
        rate: Number(clip.rate),
      });
      return {
        clip_id: clip.clip_id,
        sort_index: clip.sort_index,
        speaker_id: clip.speaker_id,
        voice_id: clip.voice_id,
        take: clip.take,
        rate: Number(clip.rate),
        duration_s: Number(clip.duration_s),
        url: signed.url,
        expires_at: signed.expiresAt,
      };
    });

    return {
      dialogue_id: rows.dialogue_id,
      cefr_level: rows.cefr_level,
      ttl_seconds: this.audioUrlSigner.defaultTtlSeconds,
      clips,
    };
  }
}

interface PersistedLessonBody {
  phases: LessonPhase[];
  learner_model: unknown;
}

/**
 * `lessons.body` → the contract's two members. `body` is `NOT NULL DEFAULT
 * '{"phases":[],"learner_model":null}'`, so a row that predates the column yields no phases
 * rather than a crash, and a JSON `null` learner model is preserved as `null` (never
 * `undefined`, which would drop a required member from the payload).
 */
function readBody(value: unknown): PersistedLessonBody {
  if (typeof value !== 'object' || value === null) {
    return { phases: [], learner_model: null };
  }
  const body = value as Record<string, unknown>;
  const phases = Array.isArray(body['phases']) ? (body['phases'] as LessonPhase[]) : [];
  const learnerModel = body['learner_model'] === undefined ? null : body['learner_model'];
  return { phases, learner_model: learnerModel };
}
