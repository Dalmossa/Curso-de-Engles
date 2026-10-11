import { Injectable } from '@nestjs/common';
import type { LessonPhase } from '../../infrastructure/content/content-types.js';
import {
  ContentRepository,
  type ItemOptionRow,
  type PackRows,
} from '../../infrastructure/repositories/content.repository.js';

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
 * - **`key` is served as the column's value**, `null` included. ADR-004 declares
 *   `key: Optional[str]  # None for production items`, and 6 of the 847 pack items are
 *   `asr_phoneme_match` with no options and no key. Callers distinguish them by `scoring`.
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
  is_key: boolean;
  /** `item_options.br_pt_form` — nullable column. */
  br_pt_form: string | null;
  /** `item_options.note` — nullable: the DDL requires it only of a *distractor*. */
  note: string | null;
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
  /** `items.key` — `null` when there is no choice (ADR-004's production items). */
  key: string | null;
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

export interface DialogueDistractorContent {
  letter: string;
  text: string;
  /** `item_options.distractor_type` — nullable in fact (the corpus stores prose there). */
  type: string | null;
}

export interface DialogueSlotContent {
  slot_id: string;
  skill: string;
  /**
   * `items.key`. The column is nullable; measured, all 74 shipped slots carry one and
   * `content-check.mjs` fails a choice that does not, so the served value is non-null today.
   * The type keeps the column's nullability rather than asserting a guarantee the DDL lacks.
   */
  key: string | null;
  transcript: string;
  distractors: DialogueDistractorContent[];
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

/** The Q-L2 floor (ADR-027 §3); the DDL's own CHECK is the full 45–120 s range. */
const MIN_DIALOGUE_SECONDS = 45;

@Injectable()
export class ContentService {
  constructor(private readonly contentRepository: ContentRepository) {}

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
      .map(item => ({
        item_id: item.id,
        item_type: item.item_type,
        skill: skillNamespaceOf(item.skill_ids),
        domain: item.domain_id,
        prompt: item.stem,
        scoring: item.scoring,
        options: (options.get(item.id) ?? []).map(option => ({
          letter: LETTERS.charAt(option.position - 1),
          text: option.option_text,
          is_key: option.is_key,
          br_pt_form: option.br_pt_form,
          note: option.note,
        })),
        key: item.key,
        listening_items: [],
      }));

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
        key: slot.key,
        transcript: dialogue.transcript,
        distractors: (options.get(slot.item_id) ?? [])
          .filter(option => !option.is_key)
          .map(option => ({
            letter: LETTERS.charAt(option.position - 1),
            text: option.option_text,
            type: option.distractor_type,
          })),
      })),
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
