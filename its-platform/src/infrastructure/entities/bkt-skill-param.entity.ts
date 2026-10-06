import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('bkt_skill_params')
export class BktSkillParamEntity {
  @PrimaryColumn({ name: 'skill_id', type: 'varchar', length: 50 })
  skillId!: string;

  @Column({ name: 'p_l0', type: 'numeric', precision: 4, scale: 3, default: 0.15 })
  pL0!: string;

  @Column({ name: 'p_t', type: 'numeric', precision: 4, scale: 3, default: 0.25 })
  pT!: string;

  @Column({ name: 'p_s', type: 'numeric', precision: 4, scale: 3, default: 0.1 })
  pS!: string;

  @Column({ name: 'source', type: 'varchar', length: 20 })
  source!: string;

  @Column({ name: 'fitted_at', type: 'timestamptz', nullable: true })
  fittedAt!: Date | null;

  @Column({ name: 'model_version', type: 'varchar', length: 30, nullable: true })
  modelVersion!: string | null;
}