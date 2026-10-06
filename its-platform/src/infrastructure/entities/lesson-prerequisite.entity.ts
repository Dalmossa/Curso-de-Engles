import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('lesson_prerequisites')
export class LessonPrerequisiteEntity {
  @PrimaryColumn({ name: 'lesson_id', type: 'varchar', length: 50 })
  lessonId!: string;

  @PrimaryColumn({ name: 'prereq_id', type: 'varchar', length: 50 })
  prereqId!: string;

  @Column({ name: 'edge_type', type: 'varchar', length: 20, default: 'prerequisite' })
  edgeType!: string;
}