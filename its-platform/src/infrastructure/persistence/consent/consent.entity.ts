import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../entities/user.entity.js';

/**
 * Entidade de Consentimento LGPD.
 *
 * RLS policy defined in migration.
 * Garante isolamento total entre learners.
 */
@Entity('consents')
@Index(['learnerId', 'purpose'], { unique: true, where: 'withdrawn_at IS NULL' }) // Um consentimento ativo por learner+purpose
@Index(['learnerId'])
@Index(['purpose'])
@Index(['withdrawnAt'])
@Index(['version'])
export class ConsentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'learner_id' })
  learnerId!: string;

  @Column({
    type: 'enum',
    enum: [
      'analytics',
      'marketing',
      'personalization',
      'third_party_sharing',
      'sensitive_processing',
    ],
  })
  purpose!: string;

  @Column({ name: 'granted', type: 'boolean', default: false })
  granted!: boolean;

  @Column({ name: 'granted_at', type: 'timestamptz', nullable: true })
  grantedAt!: Date | null;

  @Column({ name: 'withdrawn_at', type: 'timestamptz', nullable: true })
  withdrawnAt!: Date | null;

  @Column({ type: 'varchar', default: '1.0' })
  version!: string;

  @Column({ name: 'ip_hash', type: 'varchar', nullable: true })
  ipHash!: string | null;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relacionamento opcional para queries join
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'learner_id', referencedColumnName: 'id' })
  user!: UserEntity;
}