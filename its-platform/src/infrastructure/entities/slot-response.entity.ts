import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slot_responses')
export class SlotResponseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: string;

  @Column({ name: 'attempt_id', type: 'uuid' })
  attemptId!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'item_id', type: 'varchar', length: 100 })
  itemId!: string;

  @Column({ name: 'response_letter', type: 'char', length: 1, nullable: true })
  responseLetter!: string | null;

  @Column({ name: 'correct', type: 'boolean' })
  correct!: boolean;

  @Column({ name: 'response_time_ms', type: 'int' })
  responseTimeMs!: number;

  @Column({ name: 'voice_id', type: 'varchar', length: 20 })
  voiceId!: string;

  @Column({ name: 'clip_id', type: 'varchar', length: 60 })
  clipId!: string;

  @Column({ name: 'assist_used', type: 'boolean', default: false })
  assistUsed!: boolean;

  @Column({ name: 'replays', type: 'smallint', default: 0 })
  replays!: number;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}