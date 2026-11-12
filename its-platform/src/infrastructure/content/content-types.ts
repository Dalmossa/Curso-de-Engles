/**
 * Record shapes for the content loader, reconciled with the ADR-019 DDL
 * (`src/migrations/1791331200000-create-schema.ts`) per ADR-022; `lessons.body`
 * is ADR-027 §5's addition to that DDL.
 *
 * These are *parser* shapes, not TypeORM entities: the loader sits in
 * `src/infrastructure/content/` and writes rows with raw SQL through a
 * `QueryRunner`. Parser code must not import TypeORM/NestJS.
 *
 * Every field below names a real column of a real table. There is no
 * `listening_slots` table, no `lessons.source_markdown`/`prereq_lessons`/
 * `skill_items`, and no `packs.publication_state` (ADR-022 §1).
 */

/** One authored `FASE` block: its heading line (verbatim minus `#`s) and its body. */
export interface LessonPhase {
  phase: number;
  heading: string;
  markdown: string;
}

/**
 * `lessons.body` (ADR-027 §5): the lesson's four authored phases, verbatim, and
 * the parsed `DADOS PARA O LEARNER MODEL` block (`null` for the one lesson whose
 * file has none — `lessons/a2/les_a2_it_internet_history.md`).
 */
export interface LessonBody {
  phases: LessonPhase[];
  learner_model: unknown | null;
}

export interface LessonRecord {
  id: string;
  module_id: string;
  title: string;
  cefr_level: string;
  reuse_basis: string;
  authoring_state: string;
  publication_state: string;
  permission_state: string;
  source_ref: string | null;
  /** The four phases + learner model, persisted to `lessons.body` (ADR-027 §5). */
  body: LessonBody;
  /** Declared `prereq_lessons` (JSON learner-model block). */
  prereq_lessons: string[];
}

export interface ModuleRecord {
  id: string;
  title: string;
  cefr_level: string;
  /** `General` | `IT` | `Both` — the DDL CHECK vocabulary (ADR-022 §3). */
  track: string;
  source_markdowns: string[];
  sort_order: number;
  expected_lessons: number;
}

export interface CurriculumRecord {
  modules: ModuleRecord[];
  /** lesson id → module id, from `curriculum-graph-spec.md` §4.3. */
  lesson_modules: Record<string, string>;
}

export interface ItemOptionRecord {
  /** `item_options.position`: slot letter A→1 … F→6. */
  position: number;
  option_text: string;
  is_key: boolean;
  distractor_type: string | null;
  br_pt_form: string | null;
  note: string | null;
}

export interface PackItemRecord {
  item_id: string;
  skill_ids: string[];
  domain_id: string;
  item_type: string;
  scoring: string;
  stem: string;
  /** The key option's slot letter, or null for a no-option (production) item. */
  key: string | null;
  p_random: number;
  br_pt_form_state: string;
  options: ItemOptionRecord[];
}

export interface PackSkipRecord {
  item_id: string;
  reason: string;
}

export interface PackRecord {
  id: string;
  lesson_id: string;
  schema_version: 'canonical' | 'legacy_v1';
  reuse_basis: string;
  title: string;
  time_cap: number;
  split: string;
  interleaved: boolean;
  items: PackItemRecord[];
  skips: PackSkipRecord[];
}

export interface ClipRecord {
  id: string;
  dialogue_id: string;
  speaker_id: string;
  sort_index: number;
  utterance_text: string;
}

export interface CorpusItemRecord {
  item_id: string;
  dialogue_id: string;
  /** 1-based ordinal of the admitted slot within its dialogue. */
  slot_number: number;
  listening_kind: string;
  listening_tier: 'L1' | 'L2';
  stem: string;
  key: string | null;
  p_random: number;
  options: ItemOptionRecord[];
  status: string;
}

export interface DialogueSpeakerRecord {
  speaker_id: string;
  display_name: string;
  gender: string | null;
  voice_id: string;
}

export interface DialogueRecord {
  id: string;
  title: string;
  cefr_level: string;
  status: 'shipped' | 'shadow_only';
  duration_seconds: number;
  /** ADR-027 §3b: the authored `> **Speaker:** …` block, verbatim (`dialogues.transcript`). */
  transcript: string;
  speakers: DialogueSpeakerRecord[];
  clips: ClipRecord[];
  items: CorpusItemRecord[];
}

export interface SpeakerRecord {
  id: string;
  display_name: string;
  gender: string | null;
}

export interface VoiceRecord {
  id: string;
  label: string;
  accent: string;
  gender: string | null;
}

export interface CorpusRecord {
  dialogues: DialogueRecord[];
  voices: VoiceRecord[];
  speakers: SpeakerRecord[];
  skips: Array<{ ref_id: string; reason: string }>;
}

export interface LoadReport {
  lessons: number;
  packs: number;
  dialogues: number;
  slots: number;
  items: number;
  options: number;
  clips: number;
  skills: number;
  skips: Array<{ type: string; ref_id: string; reason: string }>;
  errors: string[];
}
