import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('diagnostic_results')
export class DiagnosticResultEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'form_version', type: 'varchar', length: 30, default: 'diagnostic_form_v1' })
  formVersion!: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ name: 'theta', type: 'numeric', precision: 6, scale: 3 })
  theta!: string;

  @Column({ name: 'se_statistical', type: 'numeric', precision: 6, scale: 3 })
  seStatistical!: string;

  @Column({ name: 'se_parameter', type: 'numeric', precision: 6, scale: 3 })
  seParameter!: string;

  @Column({ name: 'se_effective', type: 'numeric', precision: 6, scale: 3 })
  seEffective!: string;

  @Column({ name: 'precision_label', type: 'varchar', length: 20 })
  precisionLabel!: string;

  @Column({ name: 'ci95_lower', type: 'numeric', precision: 6, scale: 3 })
  ci95Lower!: string;

  @Column({ name: 'ci95_upper', type: 'numeric', precision: 6, scale: 3 })
  ci95Upper!: string;

  @Column({ name: 'cefr', type: 'varchar', length: 3 })
  cefr!: string;

  @Column({ name: 'start_cefr', type: 'varchar', length: 3 })
  startCefr!: string;

  @Column({ name: 'below_scale', type: 'boolean', default: false })
  belowScale!: boolean;

  @Column({ name: 'start_node', type: 'varchar', length: 50 })
  startNode!: string;

  @Column({ name: 'remediation_nodes', type: 'text', array: true, default: () => "'{}'" })
  remediationNodes!: string[];

  @Column({ name: 'profile', type: 'varchar', length: 40, nullable: true })
  profile!: string | null;

  @Column({ name: 'stopping_rule', type: 'varchar', length: 50 })
  stoppingRule!: string;

  @Column({ name: 'bkt_priors_override', type: 'jsonb', nullable: true })
  bktPriorsOverride!: unknown;

  @Column({ name: 'skill_theta', type: 'jsonb' })
  skillTheta!: unknown;
}