import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('practice_attempts')
export class PracticeAttemptEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'pack_layer', type: 'varchar', length: 3 })
  packLayer!: string;

  @Column({ name: 'pack_id', type: 'varchar', length: 100, nullable: true })
  packId!: string | null;

  @Column({ name: 'started_at', type: 'timestamptz', default: () => 'now()' })
  startedAt!: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Column({ name: 'total_items', type: 'int' })
  totalItems!: number;

  @Column({ name: 'correct_count', type: 'int' })
  correctCount!: number;
}