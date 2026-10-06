import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dialogues')
export class DialogueEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'title', type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'cefr_level', type: 'varchar', length: 3 })
  cefrLevel!: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status!: string;

  @Column({ name: 'duration_seconds', type: 'int' })
  durationSeconds!: number;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}