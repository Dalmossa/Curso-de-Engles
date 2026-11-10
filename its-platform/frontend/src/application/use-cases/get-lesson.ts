import {
  normalizeLessonPhases,
  summarizeMastery,
  type ContentRepository,
  type LearnerProfile,
  type LearnerRepository,
  type LessonContent,
  type MasteryOverview,
  type SkillMastery,
} from '@/core';

export interface MasteryScreenData {
  readonly cefrLevel: LearnerProfile['cefrLevel'];
  /**
   * From `/learners/{id}/mastery`, which is the endpoint that publishes
   * `gate_passed` and `last_practice`. `gate_passed` is still recomputed locally in
   * `summarizeMastery` so the bars cannot disagree with the server on any other screen.
   */
  readonly overview: MasteryOverview;
  /** Gate and recency per skill, as the endpoint reported them. */
  readonly rows: readonly SkillMastery[];
}

export class GetMasteryScreenData {
  constructor(private readonly learners: LearnerRepository) {}

  async execute(learnerId: string): Promise<MasteryScreenData> {
    const [profile, rows] = await Promise.all([
      this.learners.getProfile(learnerId),
      this.learners.getMastery(learnerId),
    ]);

    return {
      cefrLevel: profile.cefrLevel,
      overview: summarizeMastery(profile.mastery),
      rows: rows.slice().sort((left, right) => left.skill.localeCompare(right.skill)),
    };
  }
}

/**
 * A lesson, with the four-phase invariant already enforced.
 *
 * `normalizeLessonPhases` throws a `DomainError` for a payload that is not exactly
 * phases 1–4, so no component ever has to decide what to do with a three-phase lesson —
 * the error boundary does, once.
 */
export class GetLesson {
  constructor(private readonly content: ContentRepository) {}

  async execute(lessonId: string): Promise<LessonContent> {
    const lesson = await this.content.getLesson(lessonId);
    return { ...lesson, phases: normalizeLessonPhases(lesson.phases) };
  }
}
