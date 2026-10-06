import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consent_records')
export class ConsentRecordEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'purpose', type: 'varchar', length: 60 })
  purpose!: string;

  @Column({ name: 'version', type: 'varchar', length: 20 })
  version!: string;

  @Column({ name: 'granted_at', type: 'timestamptz', nullable: true })
  grantedAt!: Date | null;

  @Column({ name: 'withdrawn_at', type: 'timestamptz', nullable: true })
  withdrawnAt!: Date | null;

  @Column({ name: 'legal_basis', type: 'varchar', length: 40 })
  legalBasis!: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}