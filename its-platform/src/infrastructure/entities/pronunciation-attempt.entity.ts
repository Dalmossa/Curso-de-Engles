import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LearnerEntity } from './learner.entity.js';

@Entity('pronunciation_attempts')
@Index('IDX_pronunciation_attempts_learner_created_at', ['learnerId', 'createdAt'])
export class PronunciationAttemptEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'learner_id', type: 'uuid' })
  learnerId!: string;

  @ManyToOne(() => LearnerEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'learner_id' })
  learner?: LearnerEntity;

  @Column({ name: 'lesson_id', type: 'varchar', nullable: true })
  lessonId!: string | null;

  @Column({ name: 'expected_text', type: 'text' })
  expectedText!: string;

  @Column({ name: 'transcript', type: 'text' })
  transcript!: string;

  @Column({ name: 'overall_score', type: 'int' })
  overallScore!: number;

  @Column({ name: 'word_scores', type: 'jsonb' })
  wordScores!: unknown;

  @Column({ name: 'feedback_pt', type: 'text' })
  feedbackPt!: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt!: Date;
}
