import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ name: 'display_name', type: 'varchar', nullable: true })
  displayName!: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatarUrl!: string | null;

  @Column({ name: 'email_verified', default: false })
  emailVerified!: boolean;

  @Column({ type: 'varchar', default: 'local' })
  provider!: string;

  @Column({ name: 'provider_id', type: 'varchar', nullable: true })
  providerId!: string | null;

  @Column({ name: 'learner_id', type: 'varchar', nullable: true })
  learnerId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ type: 'varchar', default: 'learner' })
  role!: string;

  @Column({ name: 'cefr_level', type: 'varchar', nullable: true })
  cefrLevel!: string | null;

  @Column({ name: 'google_id', type: 'varchar', nullable: true })
  googleId!: string | null;
}