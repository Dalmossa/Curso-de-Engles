import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cefr_levels')
export class CefrLevelEntity {
  @PrimaryColumn({ name: 'code', type: 'varchar', length: 3 })
  code!: string;

  @Column({ name: 'label', type: 'varchar', length: 50 })
  label!: string;

  @Column({ name: 'sort_order', type: 'int' })
  sortOrder!: number;

  @Column({ name: 'theta_threshold', type: 'numeric', precision: 4, scale: 2, nullable: true })
  thetaThreshold!: string | null;
}