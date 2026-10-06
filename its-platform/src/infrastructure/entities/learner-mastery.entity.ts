import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('learner_mastery')
export class LearnerMasteryEntity {
  @PrimaryColumn({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @PrimaryColumn({ name: 'skill_id', type: 'varchar', length: 50 })
  skillId!: string;

  @Column({ name: 'p_know', type: 'numeric', precision: 4, scale: 3 })
  pKnow!: string;

  @Column({ name: 'n_obs', type: 'int', default: 0 })
  nObs!: number;

  @Column({ name: 'distinct_days', type: 'int', default: 0 })
  distinctDays!: number;

  @Column({ name: 'spaced_obs', type: 'int', default: 0 })
  spacedObs!: number;

  @Column({ name: 'last_practice_at', type: 'timestamptz', nullable: true })
  lastPracticeAt!: Date | null;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;
}