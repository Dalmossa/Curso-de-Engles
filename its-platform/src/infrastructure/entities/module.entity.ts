import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('modules')
export class ModuleEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'title', type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'cefr_level', type: 'varchar', length: 3 })
  cefrLevel!: string;

  @Column({ name: 'track', type: 'varchar', length: 10 })
  track!: string;

  @Column({ name: 'source_markdowns', type: 'text', array: true })
  sourceMarkdowns!: string[];

  @Column({ name: 'sort_order', type: 'int' })
  sortOrder!: number;

  @Column({ name: 'expected_lessons', type: 'int' })
  expectedLessons!: number;
}