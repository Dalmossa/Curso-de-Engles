import type { DialogueAudio, DialogueContent } from '../entities/listening';
import type { LessonContent } from '../entities/lesson';
import type { PackContent } from '../entities/practice';

/**
 * The catalogue endpoints under `/content/*`.
 *
 * None of these takes a learner id: the catalogue is learner-independent, and the
 * audio playlist's signed URLs carry no learner identifier either (ADR-028 §4).
 */
export interface ContentRepository {
  getLesson(lessonId: string): Promise<LessonContent>;
  /** Serves items whose options include the key, unmarked (ADR-044). */
  getPack(packId: string): Promise<PackContent>;
  getDialogue(dialogueId: string): Promise<DialogueContent>;
  getDialogueAudio(dialogueId: string, rate?: 1 | 0.75): Promise<DialogueAudio>;
}
