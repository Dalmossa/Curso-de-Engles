import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('learners')
export class LearnerEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ name: 'last_active_at', type: 'timestamptz', nullable: true })
  lastActiveAt!: Date | null;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;
}