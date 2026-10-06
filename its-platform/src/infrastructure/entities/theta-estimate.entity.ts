import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('theta_estimates')
export class ThetaEstimateEntity {
  @PrimaryColumn({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @PrimaryColumn({ name: 'skill_id', type: 'varchar', length: 50 })
  skillId!: string;

  @Column({ name: 'theta', type: 'numeric', precision: 6, scale: 3 })
  theta!: string;

  @Column({ name: 'se', type: 'numeric', precision: 6, scale: 3 })
  se!: string;

  @Column({ name: 'ci95_lower', type: 'numeric', precision: 6, scale: 3 })
  ci95Lower!: string;

  @Column({ name: 'ci95_upper', type: 'numeric', precision: 6, scale: 3 })
  ci95Upper!: string;

  @Column({ name: 'evidence_count', type: 'int', default: 0 })
  evidenceCount!: number;

  @Column({ name: 'last_updated', type: 'timestamptz', default: () => 'now()' })
  lastUpdated!: Date;
}