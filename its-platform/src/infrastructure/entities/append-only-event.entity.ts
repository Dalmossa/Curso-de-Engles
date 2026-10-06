import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('append_only_events')
export class AppendOnlyEventEntity {
  @PrimaryGeneratedColumn({ name: 'seq', type: 'bigint' })
  seq!: string;

  @Column({ name: 'event_id', type: 'uuid', default: () => 'gen_random_uuid()' })
  eventId!: string;

  @Column({ name: 'learner_id', type: 'uuid', nullable: true })
  learnerId!: string | null;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId!: string | null;

  @Column({ name: 'lesson_id', type: 'varchar', length: 50, nullable: true })
  lessonId!: string | null;

  @Column({ name: 'item_id', type: 'varchar', length: 100, nullable: true })
  itemId!: string | null;

  @Column({ name: 'skill_ids', type: 'text', array: true, nullable: true })
  skillIds!: string[] | null;

  @Column({ name: 'event_type', type: 'varchar', length: 30 })
  eventType!: string;

  @Column({ name: 'occurred_at', type: 'timestamptz', default: () => 'now()' })
  occurredAt!: Date;

  @Column({ name: 'payload', type: 'jsonb' })
  payload!: unknown;

  @Column({ name: 'prev_hash', type: 'bytea', nullable: true })
  prevHash!: Buffer | null;

  @Column({ name: 'row_hash', type: 'bytea' })
  rowHash!: Buffer;
}