import {
  invalidResponseToDomainError,
  parseCefrLevel,
  type AssessmentItem,
  type DialogueAudio,
  type DialogueContent,
  type ItemType,
  type LearnerPreferences,
  type LearnerProfile,
  type LessonContent,
  type ListeningSlotSkill,
  type NextActivity,
  type PackContent,
  type PlacementResult,
  type PracticeResult,
  type ReuseBasis,
  type ScoredItem,
  type Skill,
  type SkillMastery,
} from '@/core';
import type { components } from './generated/api-types';

type Schemas = components['schemas'];

export type LearnerProfileDto = Schemas['LearnerProfile'];
export type NextActivityDto = Schemas['NextActivity'];
export type LessonContentDto = Schemas['LessonContent'];
export type PackContentDto = Schemas['PackContent'];
export type PracticeResultDto = Schemas['PracticeResult'];
export type PlacementResultDto = Schemas['PlacementResult'];
export type DialogueContentDto = Schemas['DialogueContent'];
export type DialogueAudioDto = Schemas['DialogueAudio'];
export type MasteryDto = Record<string, { mastery: number; gate_passed: boolean; last_practice: string }>;

/**
 * The boundary where the wire's snake_case, nullable-everything DTOs become the domain's
 * entities.
 *
 * This is the only module that knows both shapes. Keeping it to one file is what makes
 * "did the contract change?" a question you can answer by reading one diff, and it is
 * where a response that contradicts the contract is turned into `invalid_response` rather
 * than into a `undefined` that surfaces three components later.
 */

/** The contract declares these defaults; applying them is contract-faithful, not a guess. */
function toPreferences(dto: LearnerProfileDto['preferences'] | undefined): LearnerPreferences {
  return {
    recastEnabled: dto?.recast_enabled ?? true,
    metaButtonEnabled: dto?.meta_button_enabled ?? true,
    audioAutoplay: dto?.audio_autoplay ?? false,
    dailyGoalMinutes: dto?.daily_goal_minutes ?? 15,
  };
}

export function toLearnerProfile(dto: LearnerProfileDto): LearnerProfile {
  return {
    learnerId: dto.learner_id,
    createdAt: dto.created_at,
    // `null` is "no diagnostic completed yet" (ADR-045 D3), not a failure to parse. A
    // value that is neither a CEFR level nor null collapses to the same `null` — the UI
    // renders "not yet assessed", which is the accurate thing to say either way.
    cefrLevel: parseCefrLevel(dto.cefr_level),
    mastery: { ...dto.mastery },
    preferences: toPreferences(dto.preferences),
  };
}

export function toNextActivity(dto: NextActivityDto): NextActivity {
  return {
    activityType: dto.activity_type,
    activityId: dto.activity_id,
    rationale: {
      selectionRule: dto.rationale.selection_rule,
      masteryGaps: [...dto.rationale.mastery_gaps],
      iPlus1: dto.rationale.i_plus_1,
    },
    estimatedDurationMinutes: dto.estimated_duration_minutes ?? null,
    prerequisitesMet: dto.prerequisites_met ?? null,
  };
}

function requireCefrLevel(value: string, context: string) {
  const level = parseCefrLevel(value);
  if (level === null) {
    // Unlike the learner profile, a lesson's level is always required and always matches
    // `^(A1|A2|B1|B2|C1|C2)$`. There is no "not assessed" state to fall back to, so the
    // honest outcome is a labelled failure rather than a badge reading "undefined".
    throw invalidResponseToDomainError(`${context} carries cefr_level "${value}", which is not a CEFR level.`);
  }
  return level;
}

export function toLessonContent(dto: LessonContentDto): LessonContent {
  return {
    lessonId: dto.lesson_id,
    title: dto.title,
    cefrLevel: requireCefrLevel(dto.cefr_level, `Lesson ${dto.lesson_id}`),
    reuseBasis: dto.reuse_basis as ReuseBasis,
    authoringState: dto.authoring_state,
    publicationState: dto.publication_state,
    // Ordering and the exactly-four invariant are enforced by `GetLesson`; the mapper
    // only narrows the shape.
    phases: dto.phases.map((phase) => ({
      phase: phase.phase,
      heading: phase.heading,
      markdown: phase.markdown,
    })),
    learnerModel: dto.learner_model ?? null,
  };
}

export function toPackContent(dto: PackContentDto): PackContent {
  return {
    packId: dto.pack_id,
    lessonId: dto.lesson_id,
    schemaVersion: dto.schema_version,
    reuseBasis: dto.reuse_basis ?? null,
    items: dto.items.map(toAssessmentItem),
  };
}

function toAssessmentItem(dto: PackContentDto['items'][number]): AssessmentItem {
  return {
    itemId: dto.item_id,
    itemType: dto.item_type as ItemType,
    skill: dto.skill as Skill,
    domain: dto.domain,
    prompt: dto.prompt,
    scoring: dto.scoring,
    options: dto.options.map((option) => ({
      letter: option.letter,
      text: option.text,
      // Absent on 43 of 841 items — and absent for every option of those items, which is
      // why it is safe to read as a per-item property but must stay per-option in the type.
      brPtForm: option.br_pt_form ?? null,
    })),
  };
}

export function toPracticeResult(dto: PracticeResultDto): PracticeResult {
  return {
    packId: dto.pack_id,
    scoredItems: dto.scored_items.map(toScoredItem),
    masteryUpdates: dto.mastery_updates.map((update) => ({
      skill: update.skill,
      masteryBefore: update.mastery_before,
      masteryAfter: update.mastery_after,
      gatePassed: update.gate_passed,
    })),
    nextReviewSchedule: dto.next_review_schedule.map((entry) => ({
      skill: entry.skill,
      nextReviewAt: entry.next_review_at,
      intervalDays: entry.interval_days,
    })),
  };
}

function toScoredItem(dto: PracticeResultDto['scored_items'][number]): ScoredItem {
  return {
    itemId: dto.item_id,
    // The generated type says `boolean`; the contract's own description says "Null for
    // production items scored asynchronously". The description is the behaviour, so the
    // value is widened here and the null case is rendered as "pending". Reported to
    // `api-developer` as a schema/description mismatch.
    correct: dto.correct ?? null,
    skill: dto.skill,
    bktUpdate: {
      prior: dto.bkt_update.prior,
      posterior: dto.bkt_update.posterior,
      transition: dto.bkt_update.transition,
    },
  };
}

export function toSkillMastery(dto: MasteryDto): readonly SkillMastery[] {
  return Object.entries(dto).map(([skill, entry]) => ({
    skill,
    mastery: entry.mastery,
    gatePassed: entry.gate_passed,
    lastPractice: entry.last_practice ?? null,
  }));
}

export function toPlacementResult(dto: PlacementResultDto): PlacementResult {
  const [lower, upper] = dto.theta_estimate.ci95;
  if (lower === undefined || upper === undefined) {
    throw invalidResponseToDomainError('PlacementResult.theta_estimate.ci95 must carry exactly two numbers.');
  }
  return {
    learnerId: dto.learner_id,
    startNode: dto.start_node,
    theta: dto.theta_estimate.theta,
    standardError: dto.theta_estimate.se,
    ci95: [lower, upper],
    confidence: dto.confidence ?? null,
    stoppingRule: dto.stopping_rule ?? null,
  };
}

export function toDialogueContent(dto: DialogueContentDto): DialogueContent {
  return {
    dialogueId: dto.dialogue_id,
    title: dto.title,
    status: dto.status,
    durationSeconds: dto.duration_seconds ?? null,
    voices: (dto.voices ?? []).map((voice) => ({
      voiceId: voice.voice_id,
      speaker: voice.speaker,
      accent: voice.accent,
    })),
    slots: dto.slots.map((slot) => ({
      slotId: slot.slot_id,
      skill: slot.skill as ListeningSlotSkill,
      transcript: slot.transcript,
      options: slot.options.map((option) => ({ letter: option.letter, text: option.text })),
    })),
  };
}

export function toDialogueAudio(dto: DialogueAudioDto): DialogueAudio {
  return {
    dialogueId: dto.dialogue_id,
    ttlSeconds: dto.ttl_seconds,
    clips: dto.clips.map((clip) => ({
      clipId: clip.clip_id,
      sortIndex: clip.sort_index,
      speakerId: clip.speaker_id,
      voiceId: clip.voice_id,
      take: clip.take,
      rate: clip.rate,
      durationSeconds: clip.duration_s,
      url: clip.url,
      expiresAt: clip.expires_at,
    })),
  };
}
