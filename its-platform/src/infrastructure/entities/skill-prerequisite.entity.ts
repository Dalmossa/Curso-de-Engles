import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('skill_prerequisite')
export class SkillPrerequisiteEntity {
  @PrimaryColumn({ name: 'lesson_id', type: 'varchar', length: 50 })
  lessonId!: string;

  @PrimaryColumn({ name: 'skill_id', type: 'varchar', length: 50 })
  skillId!: string;

  @Column({ name: 'weight', type: 'numeric', precision: 4, scale: 3, default: 1.0 })
  weight!: string;
}