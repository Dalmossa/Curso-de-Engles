/**
 * P1.12 — the content catalog's read path (ADR-027 §1).
 *
 * The loader (ADR-020, reconciled to the ADR-019 DDL by ADR-022) is the only writer of
 * `lessons` / `packs` / `items` / `item_options` / `dialogues` / `speakers` / `voices` /
 * `dialogue_speakers`; this repository is the only reader the API uses. There is **no file
 * access here and none at request time** (ADR-027 §1: *"the DB is the only read path"*), and no
 * domain type crosses this boundary — every interface below names a real ADR-019 column.
 *
 * Three read facts are load-bearing:
 *
 * 1. **Options are read one query per resource, not one per item.** `WHERE item_id = ANY($1)`
 *    covers every item of a pack or dialogue in a single round trip and is ordered by
 *    `position`, so a 122-pack catalogue can never produce an N+1.
 * 2. **A pack's items are `packs.item_ids`, in that array's order.** It is the column the loader
 *    writes with exactly the ids it inserted (ADR-022 §2), so it is the pack's declared
 *    membership *and* its order. `items.lesson_id` is not a substitute: it is the lesson's set,
 *    and the ADR measured that the two are not the same (a lesson's FASE 4 items are not its
 *    pack's items).
 * 3. **`jsonb` is normalised here.** `lessons.body` is `JSONB`; whichever driver reads it may
 *    hand back an object or its text. The repository returns a JS value, so no caller has to
 *    know which driver answered.
 *
 * The methods are pure reads keyed by id and return `null` when the row is absent. The
 * *policy* — what is servable — belongs to `ContentService` (ADR-027 §3: a dialogue that is not
 * `shipped` is not served, and the caller cannot tell it from an unknown id).
 */

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/** `lessons`, narrowed to the columns `/content/lessons/{lesson_id}` serves. */
export interface LessonRow {
  id: string;
  title: string;
  cefr_level: string;
  reuse_basis: string;
  authoring_state: string;
  publication_state: string;
  /** `lessons.body` (ADR-027 §5): `{"phases":[…],"learner_model":…|null}`, already JSON-decoded. */
  body: unknown;
}

/** `packs` row, narrowed to the columns `/content/packs/{pack_id}` serves. */
export interface PackRow {
  id: string;
  lesson_id: string;
  schema_version: string;
  /** The loader-inserted item ids, in the pack's own order (ADR-022 §2). */
  item_ids: string[];
}

/** `items` row, narrowed to the columns `PackContent.items[]` serves. */
export interface ItemRow {
  id: string;
  item_type: string;
  /** `items.skill_ids`; `skill_ids[0]`'s namespace is the contract's `skill` (ADR-027 §2). */
  skill_ids: string[];
  domain_id: string;
  scoring: string;
  /** `items.stem` — the contract's `prompt`. */
  stem: string;
  /** `items.key`: nullable by design (ADR-004's production/minimal-pair items). */
  key: string | null;
}

/** One `item_options` row. `distractor_type`/`br_pt_form`/`note` are nullable columns. */
export interface ItemOptionRow {
  item_id: string;
  /** 1–6; the contract's `letter` is this position's letter (`A`→1 … `F`→6). */
  position: number;
  option_text: string;
  is_key: boolean;
  distractor_type: string | null;
  br_pt_form: string | null;
  note: string | null;
}

export interface PackRows {
  pack: PackRow;
  items: ItemRow[];
  options: ItemOptionRow[];
}

/** `dialogues` row. `transcript` is ADR-027 §3b's column. */
export interface DialogueRow {
  id: string;
  title: string;
  cefr_level: string;
  /** The DDL's CHECK vocabulary: `shipped` | `shadow_only`. */
  status: string;
  duration_seconds: number;
  transcript: string;
}

/** `dialogue_speakers` ⋈ `speakers` ⋈ `voices`. */
export interface DialogueVoiceRow {
  voice_id: string;
  speaker: string;
  accent: string;
}

/** A listening `items` row of a dialogue; `skill` is derived from `listening_kind` (§3). */
export interface DialogueSlotRow {
  item_id: string;
  slot_number: number | null;
  listening_kind: string | null;
  key: string | null;
}

export interface DialogueRows {
  dialogue: DialogueRow;
  voices: DialogueVoiceRow[];
  slots: DialogueSlotRow[];
  options: ItemOptionRow[];
}

/**
 * One selected render of a dialogue's audio playlist, narrowed to the columns
 * `DialogueAudioClip` serves (P1.13, ADR-028 §2).
 *
 * `rate` and `duration_s` are typed `string` on purpose: both are `NUMERIC`, and `pg`/TypeORM
 * hand `NUMERIC` back as a **string**. The published contract says `type: number`, so the
 * conversion belongs to the mapper — `ContentService.getDialogueAudio` — not here, and making
 * the row type `string` is what stops the service compiling if it forgets (ADR-028 §2's
 * implementation note, the defect class ADR-027 had to repair in `PackOption.note`).
 */
export interface DialogueAudioClipRow {
  clip_id: string;
  sort_index: number;
  /** `clips.speaker_id`; `dialogue_speakers` maps it to the render's `voice_id`. */
  speaker_id: string;
  /** The voice `dialogue_speakers` pins to that speaker (ADR-028 §2), not the render's own. */
  voice_id: string;
  take: number;
  /** `clip_renders.rate` — NUMERIC. */
  rate: string;
  /** `clip_renders.duration_s` — NUMERIC. */
  duration_s: string;
}

export interface DialogueAudioRows {
  dialogue_id: string;
  cefr_level: string;
  clips: DialogueAudioClipRow[];
}


/** A `jsonb`/`json` column may arrive parsed or as text, depending on the driver. */
function asJson(value: unknown): unknown {
  return typeof value === 'string' ? (JSON.parse(value) as unknown) : value;
}

@Injectable()
export class ContentRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * The lesson row, or `null`. `body` is returned as a JS value (see `asJson`); the service
   * reads `phases`/`learner_model` out of it without touching the filesystem.
   */
  async findLesson(id: string): Promise<LessonRow | null> {
    const rows = (await this.dataSource.query(
      `SELECT id, title, cefr_level, reuse_basis, authoring_state, publication_state, body
         FROM lessons
        WHERE id = $1`,
      [id],
    )) as LessonRow[];
    const row = rows[0];
    return row ? { ...row, body: asJson(row.body) } : null;
  }

  /**
   * The pack row plus its items and their options, or `null`.
   *
   * Two queries beyond the pack itself: the items (`WHERE id = ANY($1)`) and every option of
   * every one of them (`WHERE item_id = ANY($1) ORDER BY item_id, position`). The caller
   * re-orders `items` by `packs.item_ids` and groups `options` by item — membership and order
   * are the pack's, and this method does not guess either.
   */
  async findPack(id: string): Promise<PackRows | null> {
    const packRows = (await this.dataSource.query(
      `SELECT id, lesson_id, schema_version, item_ids
         FROM packs
        WHERE id = $1`,
      [id],
    )) as PackRow[];
    const pack = packRows[0];
    if (!pack) return null;

    const itemIds = Array.isArray(pack.item_ids) ? pack.item_ids : [];
    if (itemIds.length === 0) return { pack, items: [], options: [] };

    const items = (await this.dataSource.query(
      `SELECT id, item_type, skill_ids, domain_id, scoring, stem, key
         FROM items
        WHERE id = ANY($1)`,
      [itemIds],
    )) as ItemRow[];

    const options = (await this.dataSource.query(
      `SELECT item_id, position, option_text, is_key, distractor_type, br_pt_form, note
         FROM item_options
        WHERE item_id = ANY($1)
        ORDER BY item_id, position`,
      [itemIds],
    )) as ItemOptionRow[];

    return { pack, items, options };
  }

  /**
   * The dialogue row plus its voices and its listening slots, or `null`.
   *
   * `status`/`duration_seconds` are returned as stored and are **not** filtered here: ADR-027 §3
   * makes "only `shipped`, and `duration_seconds >= 45`" a serving rule of `ContentService`,
   * which must answer the same `null` for "does not exist" and "exists, not shipped".
   */
  async findDialogue(id: string): Promise<DialogueRows | null> {
    const dialogueRows = (await this.dataSource.query(
      `SELECT id, title, cefr_level, status, duration_seconds, transcript
         FROM dialogues
        WHERE id = $1`,
      [id],
    )) as DialogueRow[];
    const dialogue = dialogueRows[0];
    if (!dialogue) return null;

    // `dialogue_speakers` has no ordering column; the speaker's name is the only stable one.
    const voices = (await this.dataSource.query(
      `SELECT v.id AS voice_id, s.display_name AS speaker, v.accent
         FROM dialogue_speakers ds
         JOIN speakers s ON s.id = ds.speaker_id
         JOIN voices   v ON v.id = ds.voice_id
        WHERE ds.dialogue_id = $1
        ORDER BY s.display_name`,
      [id],
    )) as DialogueVoiceRow[];

    const slots = (await this.dataSource.query(
      `SELECT id AS item_id, slot_number, listening_kind, key
         FROM items
        WHERE dialogue_id = $1
        ORDER BY slot_number`,
      [id],
    )) as DialogueSlotRow[];

    const slotIds = slots.map(slot => slot.item_id);
    const options =
      slotIds.length === 0
        ? []
        : ((await this.dataSource.query(
            `SELECT item_id, position, option_text, is_key, distractor_type, br_pt_form, note
               FROM item_options
              WHERE item_id = ANY($1)
              ORDER BY item_id, position`,
            [slotIds],
          )) as ItemOptionRow[]);

    return { dialogue, voices, slots, options };
  }

  /**
   * The source of `GET /content/listening/{dialogue_id}/audio`'s playlist, or `null` when
   * ADR-028 §3 refuses the request.
   *
   * All four admission conditions are **SQL**, not post-filtering (ADR-028 §Implementation
   * Plan B). The query returns rows only when every one of them holds, so "not admitted" and
   * "unknown id" are the same empty result — the property the controller turns into one 404
   * body.
   *
   * 1. `status = 'shipped'` (§3.1), and the 45 s Q-L2 floor ADR-027 §3 fixed;
   * 2. every clip of the dialogue has at least one render (§3.2), and
   * 3. the highest `take` complete for the whole dialogue is served (§3.3 / §2);
   * 4. if any item of the dialogue is `listening_tier = 'L2'`, every selected render carries
   *    both `ear_checked_at` and `ear_checked_by` (§3.4, `Q-L7`).
   *
   * **Take completeness is per `rate`.** `UNIQUE (clip_id, take)` means one `(clip, take)` row
   * carries one `rate`, so a global take cannot serve two rates; the requested rate is a
   * filter before completeness is computed, and a partially-rendered *higher* take at that rate
   * is ignored in favour of the highest *complete* one. §2 does not spell this out and it is
   * recorded in the ADR follow-up report rather than guessed silently: it is the only reading
   * under which the served `rate` and `duration_s` are the selected render's own.
   *
   * The playlist is also dropped whole when its length is not the dialogue's clip count — a clip
   * whose speaker has no `dialogue_speakers` row would otherwise yield a shorter, silently
   * incomplete playlist. That guard is **not** in ADR-028 §3; it is the same all-or-nothing
   * stance, applied to the one join the schema does not constrain by foreign key.
   */
  async findDialogueAudio(id: string, rate: number): Promise<DialogueAudioRows | null> {
    const rows = (await this.dataSource.query(
      `WITH clips_of AS (
         SELECT c.id AS clip_id, c.sort_index, c.speaker_id, d.id AS dialogue_id, d.cefr_level
           FROM clips c
           JOIN dialogues d ON d.id = c.dialogue_id
          WHERE d.id = $1
            AND d.status = 'shipped'
            AND d.duration_seconds >= 45
       ),
       render_takes AS (
         SELECT r.clip_id, r.take
           FROM clip_renders r
           JOIN clips_of co ON co.clip_id = r.clip_id
          WHERE r.rate = $2
       ),
       complete_takes AS (
         SELECT rt.take
           FROM render_takes rt
          GROUP BY rt.take
         HAVING count(DISTINCT rt.clip_id) = (SELECT count(*) FROM clips_of)
       ),
       chosen AS (
         SELECT (SELECT max(take) FROM complete_takes) AS take,
                (SELECT count(*) FROM clips_of)         AS clip_count
       ),
       has_l2 AS (
         SELECT EXISTS (
           SELECT 1 FROM items i WHERE i.dialogue_id = $1 AND i.listening_tier = 'L2'
         ) AS value
       ),
       playlist AS (
         SELECT co.clip_id, co.sort_index, co.speaker_id, co.dialogue_id, co.cefr_level,
                ds.voice_id, r.take, r.rate, r.duration_s,
                r.ear_checked_at, r.ear_checked_by
           FROM clips_of co
           JOIN chosen ON chosen.take IS NOT NULL
           JOIN clip_renders r
             ON r.clip_id = co.clip_id AND r.take = chosen.take AND r.rate = $2
           JOIN dialogue_speakers ds
             ON ds.dialogue_id = $1 AND ds.speaker_id = co.speaker_id
       )
       SELECT p.clip_id, p.sort_index, p.speaker_id, p.dialogue_id, p.cefr_level,
              p.voice_id, p.take, p.rate, p.duration_s
         FROM playlist p
         CROSS JOIN has_l2
         CROSS JOIN chosen
        WHERE (
                NOT has_l2.value
                OR NOT EXISTS (
                     SELECT 1 FROM playlist q
                      WHERE q.ear_checked_at IS NULL OR q.ear_checked_by IS NULL
                   )
              )
          AND (SELECT count(*) FROM playlist) = chosen.clip_count
        ORDER BY p.sort_index`,
      [id, rate],
    )) as Array<DialogueAudioClipRow & { dialogue_id: string; cefr_level: string }>;

    const first = rows[0];
    if (!first) return null;
    return {
      dialogue_id: first.dialogue_id,
      cefr_level: first.cefr_level,
      clips: rows.map(row => ({
        clip_id: row.clip_id,
        sort_index: row.sort_index,
        speaker_id: row.speaker_id,
        voice_id: row.voice_id,
        take: row.take,
        rate: row.rate,
        duration_s: row.duration_s,
      })),
    };
  }
}
