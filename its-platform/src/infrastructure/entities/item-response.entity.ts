import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('item_responses')
export class ItemResponseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: string;

  @Column({ name: 'attempt_id', type: 'uuid' })
  attemptId!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'item_id', type: 'varchar', length: 100 })
  itemId!: string;

  @Column({ name: 'response', type: 'text', nullable: true })
  response!: string | null;

  @Column({ name: 'correct', type: 'boolean', nullable: true })
  correct!: boolean | null;

  @Column({ name: 'response_time_ms', type: 'int' })
  responseTimeMs!: number;

  @Column({ name: 'confidence', type: 'numeric', precision: 3, scale: 2, nullable: true })
  confidence!: string | null;

  @Column({ name: 'bkt_prior', type: 'numeric', precision: 4, scale: 3 })
  bktPrior!: string;

  @Column({ name: 'bkt_posterior', type: 'numeric', precision: 4, scale: 3 })
  bktPosterior!: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}