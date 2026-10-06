import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listening_attempts')
export class ListeningAttemptEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'dialogue_id', type: 'varchar', length: 50 })
  dialogueId!: string;

  @Column({ name: 'started_at', type: 'timestamptz', default: () => 'now()' })
  startedAt!: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Column({ name: 'total_slots', type: 'int' })
  totalSlots!: number;

  @Column({ name: 'correct_count', type: 'int' })
  correctCount!: number;
}