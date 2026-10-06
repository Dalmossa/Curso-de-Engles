import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fsrs_states')
export class FsrsStateEntity {
  @PrimaryColumn({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @PrimaryColumn({ name: 'item_id', type: 'varchar', length: 100 })
  itemId!: string;

  @Column({ name: 'stability', type: 'numeric', precision: 10, scale: 3 })
  stability!: string;

  @Column({ name: 'difficulty', type: 'numeric', precision: 4, scale: 3 })
  difficulty!: string;

  @Column({ name: 'state', type: 'varchar', length: 10 })
  state!: string;

  @Column({ name: 'grade', type: 'smallint', nullable: true })
  grade!: number | null;

  @Column({ name: 'hint_used', type: 'boolean', default: false })
  hintUsed!: boolean;

  @Column({ name: 'last_review', type: 'timestamptz', default: () => 'now()' })
  lastReview!: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate!: string;

  @Column({ name: 'w_version', type: 'varchar', length: 40 })
  wVersion!: string;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;
}