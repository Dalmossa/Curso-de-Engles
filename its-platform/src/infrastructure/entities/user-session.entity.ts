import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity.js';

@Entity('user_sessions')
@Index(['userId'])
@Index(['expiresAt'])
export class UserSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'token_hash', type: 'varchar' })
  tokenHash!: string;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  accessToken!: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'last_used_at' })
  lastUsedAt!: Date;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent!: string | null;

  @Column({ name: 'ip_hash', type: 'varchar', nullable: true })
  ipHash!: string | null;

  @Column({ name: 'revoked', type: 'boolean', default: false })
  revoked!: boolean;

  @Column({ name: 'reused', type: 'boolean', default: false })
  reused!: boolean;
}