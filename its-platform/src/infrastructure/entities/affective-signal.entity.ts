import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('affective_signals')
export class AffectiveSignalEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @Column({ name: 'kind', type: 'varchar', length: 30 })
  kind!: string;

  @Column({ name: 'observed_at', type: 'timestamptz', default: () => 'now()' })
  observedAt!: Date;

  @Column({ name: 'strength', type: 'numeric', precision: 3, scale: 2 })
  strength!: string;
}