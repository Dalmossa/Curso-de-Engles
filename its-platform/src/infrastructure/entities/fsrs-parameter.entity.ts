import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fsrs_parameters')
export class FsrsParameterEntity {
  @PrimaryColumn({ name: 'w_version', type: 'varchar', length: 40 })
  wVersion!: string;

  @Column({ name: 'w', type: 'jsonb' })
  w!: unknown;

  @Column({ name: 'decay', type: 'numeric', precision: 6, scale: 4 })
  decay!: string;

  @Column({ name: 'factor', type: 'numeric', precision: 6, scale: 4 })
  factor!: string;

  @Column({ name: 'n_reviews', type: 'int', default: 0 })
  nReviews!: number;

  @Column({ name: 'fitted_at', type: 'timestamptz', nullable: true })
  fittedAt!: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive!: boolean;
}