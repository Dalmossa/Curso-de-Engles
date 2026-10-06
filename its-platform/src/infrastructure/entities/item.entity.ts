import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('items')
export class ItemEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 100 })
  id!: string;

  @Column({ name: 'schema_version', type: 'varchar', length: 10, default: '2.0' })
  schemaVersion!: string;

  @Column({ name: 'skill_ids', type: 'text', array: true })
  skillIds!: string[];

  @Column({ name: 'lesson_id', type: 'varchar', length: 50, nullable: true })
  lessonId!: string | null;

  @Column({ name: 'dialogue_id', type: 'varchar', length: 50, nullable: true })
  dialogueId!: string | null;

  @Column({ name: 'slot_number', type: 'smallint', nullable: true })
  slotNumber!: number | null;

  @Column({ name: 'clip_ids', type: 'text', array: true, nullable: true })
  clipIds!: string[] | null;

  @Column({ name: 'cefr_level', type: 'varchar', length: 3 })
  cefrLevel!: string;

  @Column({ name: 'domain_id', type: 'varchar', length: 20 })
  domainId!: string;

  @Column({ name: 'item_type', type: 'varchar', length: 25 })
  itemType!: string;

  @Column({ name: 'listening_kind', type: 'varchar', length: 20, nullable: true })
  listeningKind!: string | null;

  @Column({ name: 'listening_tier', type: 'char', length: 2, nullable: true })
  listeningTier!: string | null;

  @Column({ name: 'modality', type: 'varchar', length: 10 })
  modality!: string;

  @Column({ name: 'scoring', type: 'varchar', length: 25, default: 'choice' })
  scoring!: string;

  @Column({ name: 'stem', type: 'text' })
  stem!: string;

  @Column({ name: 'key', type: 'text', nullable: true })
  key!: string | null;

  @Column({ name: 'answer_variants', type: 'text', array: true, nullable: true })
  answerVariants!: string[] | null;

  @Column({ name: 'p_random', type: 'numeric', precision: 5, scale: 4 })
  pRandom!: string;

  @Column({ name: 'br_pt_tags', type: 'text', array: true, nullable: true })
  brPtTags!: string[] | null;

  @Column({ name: 'br_pt_form_state', type: 'varchar', length: 40, default: 'applicable' })
  brPtFormState!: string;

  @Column({ name: 'irt_model', type: 'varchar', length: 5, default: '2PL' })
  irtModel!: string;

  @Column({ name: 'a', type: 'numeric', precision: 6, scale: 4, nullable: true })
  a!: string | null;

  @Column({ name: 'b', type: 'numeric', precision: 7, scale: 4, nullable: true })
  b!: string | null;

  @Column({ name: 'c', type: 'numeric', precision: 5, scale: 4, default: 0.0 })
  c!: string;

  @Column({ name: 'a_se', type: 'numeric', precision: 6, scale: 4, nullable: true })
  aSe!: string | null;

  @Column({ name: 'b_se', type: 'numeric', precision: 6, scale: 4, nullable: true })
  bSe!: string | null;

  @Column({ name: 'n_responses', type: 'int', default: 0 })
  nResponses!: number;

  @Column({ name: 'calibration_status', type: 'varchar', length: 25, nullable: true })
  calibrationStatus!: string | null;

  @Column({ name: 'anchored_by', type: 'text', array: true, nullable: true })
  anchoredBy!: string[] | null;

  @Column({ name: 'last_refit', type: 'timestamptz', nullable: true })
  lastRefit!: Date | null;

  @Column({ name: 'infit_mnsq', type: 'numeric', precision: 5, scale: 3, nullable: true })
  infitMnsq!: string | null;

  @Column({ name: 'outfit_mnsq', type: 'numeric', precision: 5, scale: 3, nullable: true })
  outfitMnsq!: string | null;

  @Column({ name: 'point_biserial', type: 'numeric', precision: 5, scale: 3, nullable: true })
  pointBiserial!: string | null;

  @Column({ name: 'difficulty_p', type: 'numeric', precision: 5, scale: 3, nullable: true })
  difficultyP!: string | null;

  @Column({ name: 'dif_flags', type: 'jsonb', default: () => "'[]'" })
  difFlags!: unknown;

  @Column({ name: 'retired', type: 'boolean', default: false })
  retired!: boolean;

  @Column({ name: 'retired_reason', type: 'text', nullable: true })
  retiredReason!: string | null;

  @Column({ name: 'lifecycle_state', type: 'varchar', length: 25, default: 'authored' })
  lifecycleState!: string;

  @Column({ name: 'provenance_kind', type: 'varchar', length: 30 })
  provenanceKind!: string;

  @Column({ name: 'provenance_source_file', type: 'text', nullable: true })
  provenanceSourceFile!: string | null;

  @Column({ name: 'provenance_source_locator', type: 'text', nullable: true })
  provenanceSourceLocator!: string | null;

  @Column({ name: 'reviewed_by', type: 'text', nullable: true })
  reviewedBy!: string | null;

  @Column({ name: 'review_due', type: 'date', nullable: true })
  reviewDue!: string | null;

  @Column({ name: 'tts_required', type: 'boolean', default: false })
  ttsRequired!: boolean;

  @Column({ name: 'tts_refs', type: 'text', array: true, default: () => "'{}'" })
  ttsRefs!: string[];

  @Column({ name: 'assist_tts_refs', type: 'text', array: true, default: () => "'{}'" })
  assistTtsRefs!: string[];

  @Column({ name: 'estimated_time_sec', type: 'int', nullable: true })
  estimatedTimeSec!: number | null;

  @Column({ name: 'authored_at', type: 'timestamptz', nullable: true })
  authoredAt!: Date | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;
}