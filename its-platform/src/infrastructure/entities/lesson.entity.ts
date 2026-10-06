import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('lessons')
export class LessonEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'module_id', type: 'varchar', length: 50 })
  moduleId!: string;

  @Column({ name: 'title', type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'cefr_level', type: 'varchar', length: 3 })
  cefrLevel!: string;

  @Column({ name: 'reuse_basis', type: 'varchar', length: 30 })
  reuseBasis!: string;

  @Column({ name: 'authoring_state', type: 'varchar', length: 20 })
  authoringState!: string;

  @Column({ name: 'publication_state', type: 'varchar', length: 32 })
  publicationState!: string;

  @Column({ name: 'permission_state', type: 'varchar', length: 20 })
  permissionState!: string;

  @Column({ name: 'source_ref', type: 'text', nullable: true })
  sourceRef!: string | null;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt!: Date;
}