import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('error_log')
export class ErrorLogEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'skill_id', type: 'varchar', length: 50 })
  skillId!: string;

  @Column({ name: 'pattern', type: 'varchar', length: 60 })
  pattern!: string;

  @Column({ name: 'produced_form', type: 'text' })
  producedForm!: string;

  @Column({ name: 'frequency', type: 'int', default: 1 })
  frequency!: number;

  @Column({ name: 'severity', type: 'numeric', precision: 3, scale: 2 })
  severity!: string;

  @Column({ name: 'first_seen_at', type: 'timestamptz', default: () => 'now()' })
  firstSeenAt!: Date;

  @Column({ name: 'last_seen_at', type: 'timestamptz', default: () => 'now()' })
  lastSeenAt!: Date;
}