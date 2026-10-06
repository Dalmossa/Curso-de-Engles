import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('packs')
export class PackEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 100 })
  id!: string;

  @Column({ name: 'lesson_id', type: 'varchar', length: 50 })
  lessonId!: string;

  @Column({ name: 'schema_version', type: 'varchar', length: 20 })
  schemaVersion!: string;

  @Column({ name: 'reuse_basis', type: 'varchar', length: 30 })
  reuseBasis!: string;

  @Column({ name: 'manifest', type: 'jsonb' })
  manifest!: unknown;

  @Column({ name: 'item_ids', type: 'text', array: true })
  itemIds!: string[];

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}