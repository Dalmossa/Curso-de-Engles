import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diagnostic_responses')
export class DiagnosticResponseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: string;

  @Column({ name: 'diagnostic_id', type: 'uuid' })
  diagnosticId!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'item_id', type: 'varchar', length: 100 })
  itemId!: string;

  @Column({ name: 'skill_id', type: 'varchar', length: 50 })
  skillId!: string;

  @Column({ name: 'correct', type: 'boolean' })
  correct!: boolean;

  @Column({ name: 'response_time_ms', type: 'int' })
  responseTimeMs!: number;

  @Column({ name: 'theta_after', type: 'numeric', precision: 6, scale: 3 })
  thetaAfter!: string;

  @Column({ name: 'se_after', type: 'numeric', precision: 6, scale: 3 })
  seAfter!: string;
}