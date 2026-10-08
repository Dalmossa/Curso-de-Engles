export interface LessonRecord {
  id: string;
  title: string;
  cefr_level: string;
  source_markdown: string;
  reuse_basis: string;
  module_id?: string;
  module_title?: string;
  module_cefr?: string;
  prereq_lessons: string[];
  skill_items: Array<{
    skill: string;
    domain: string;
    theta_reportable: boolean;
    objective: string;
    min_theta: number;
  }>;
  learner_model: any;
}

export interface PackItemOptionRecord {
  option_id?: string;
  slot: string;
  value: string;
  note?: string;
  is_key: boolean;
  br_pt_form?: string;
  br_pt_form_state?: string;
  distractor_type?: string | null;
}

export interface PackItemRecord {
  item_id: string;
  type: string;
  type_mapped?: string;
  question?: string;
  instructions?: string;
  scoring?: string;
  difficulty?: number;
  words_target?: number;
  clear_response?: boolean;
  confidence?: boolean;
  options: PackItemOptionRecord[];
  stem_from_table?: boolean;
  source_provenance?: string;
  is_scannable?: boolean;
  asr_target?: string;
  p_random?: number;
  max_words?: number;
  accept_punct?: boolean;
  accept_case?: boolean;
  require_exact_match?: boolean;
}

export interface PackRecord {
  pack_id: string;
  lesson_id: string;
  title: string;
  cefr_level: string;
  time_cap: number;
  split: string;
  interleaved: boolean;
  reuse_basis: string;
  schema: 'canonical' | 'legacy' | 'legacy_v1';
  items: PackItemRecord[];
  skip_count: number;
  skips: Array<{ item_id: string; reason: string }>;
}

export interface ClipRecord {
  clip_id: string;
  dialogue_id: string;
  speaker_id: string;
  sort_index: number;
  text: string;
  time_start?: number;
  time_end?: number;
}

export interface SlotRecord {
  slot_id: string;
  dialogue_id: string;
  sequence: number;
  speaker_id: string;
  status: string;
  expected_response?: string;
  rubric?: string;
  assessment_item_id?: string;
  clip_ids: string[];
}

export interface DialogueRecord {
  dialogue_id: string;
  title: string;
  cefr_level: string;
  kind: string;
  duration_seconds: number;
  status: string;
  setting?: string;
  register?: string;
  turns: number;
  speakers: Array<{ speaker_id: string; voice_id: string; role?: string }>;
  slots: SlotRecord[];
  clips: ClipRecord[];
}

export interface CorpusRecord {
  dialogues: DialogueRecord[];
  voices: Array<{ voice_id: string; gender: string; description?: string }>;
  speakers: Array<{ speaker_id: string; voice_label: string; display_name?: string }>;
}

export interface ModuleRecord {
  module_id: string;
  title: string;
  cefr_level: string;
  track: string;
  source_markdowns: string[];
  sort_order: number;
  expected_lessons: number;
}

export interface CurriculumRecord {
  modules: ModuleRecord[];
}

export interface LoadReport {
  lessons: number;
  packs: number;
  dialogues: number;
  slots: number;
  items: number;
  options: number;
  clips: number;
  skips: Array<{ type: string; ref_id: string; reason: string }>;
  errors: string[];
}
