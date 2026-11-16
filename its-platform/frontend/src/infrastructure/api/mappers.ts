import {
  invalidResponseToDomainError,
  parseCefrLevel,
  type AccountIdentity,
  type AssessmentItem,
  type DialogueAudio,
  type DialogueContent,
  type ForgotPasswordResult,
  type ItemType,
  type LearnerPreferences,
  type LearnerProfile,
  type LessonContent,
  type ListeningSlotSkill,
  type NextActivity,
  type PackContent,
  type PlacementResult,
  type PracticeResult,
  type PronunciationEvaluation,
  type PronunciationWordScore,
  type ResetPasswordResult,
  type ReuseBasis,
  type ScoredItem,
  type Skill,
  type SkillMastery,
  type SpeechSynthesisResult,
} from '@/core';
import type { components } from './generated/api-types';

type Schemas = components['schemas'];

export type LearnerProfileDto = Schemas['LearnerProfile'];
export type LearnerIdentityDto = Schemas['LearnerIdentity'];
export type UpdateLearnerProfileRequestDto = Schemas['UpdateLearnerProfileRequest'];

/**
 * The members that make an identity, taken from the profile.
 *
 * **Two responses, one shape.** `GET /learners/{id}/profile` answers the whole portfolio,
 * and `PATCH /learners/{id}/profile` answers the identity; the members they share are the
 * same five, with the same types. Naming that overlap as a type is what lets one mapper
 * read both — and what makes "the header and the account screen show the same name" a
 * property of the code rather than a coincidence.
 */
export type AccountIdentitySource = Pick<
  LearnerProfileDto,
  'learner_id' | 'display_name' | 'email' | 'avatar_url' | 'cefr_level'
>;
export type NextActivityDto = Schemas['NextActivity'];
export type LessonContentDto = Schemas['LessonContent'];
export type PackContentDto = Schemas['PackContent'];
export type PracticeResultDto = Schemas['PracticeResult'];
export type PlacementResultDto = Schemas['PlacementResult'];
export type DialogueContentDto = Schemas['DialogueContent'];
export type DialogueAudioDto = Schemas['DialogueAudio'];
export type SpeechSynthesisDto = Schemas['SpeechSynthesis'];
export type PronunciationEvaluationRequestDto = Schemas['PronunciationEvaluationRequest'];
export type PronunciationEvaluationDto = Schemas['PronunciationEvaluation'];
export type ForgotPasswordRequestDto = Schemas['ForgotPasswordRequest'];
export type ForgotPasswordResponseDto = Schemas['ForgotPasswordResponse'];
export type ResetPasswordRequestDto = Schemas['ResetPasswordRequest'];
export type ResetPasswordResponseDto = Schemas['ResetPasswordResponse'];
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

/**
 * The account's identity — the name, the picture, the e-mail and the band.
 *
 * The source is the profile (`GET /learners/{id}/profile`), and the same three members
 * also come back from the `PATCH`. Both are mapped by this one function, so the header
 * and the account screen cannot drift apart: there is one reading of what the wire says
 * the learner's identity is.
 *
 * `null` is carried through as `null`, never as an empty string — "no name chosen" and
 * "a name of zero characters" are different states, and only the first exists.
 */
export function toAccountIdentity(dto: AccountIdentitySource): AccountIdentity {
  return {
    learnerId: dto.learner_id,
    displayName: dto.display_name ?? null,
    email: dto.email ?? null,
    avatarUrl: dto.avatar_url ?? null,
    cefrLevel: parseCefrLevel(dto.cefr_level),
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

/**
 * Maps the TTS synthesis response from snake_case DTO to domain entity.
 */
export function toSpeechSynthesisResult(dto: SpeechSynthesisDto): SpeechSynthesisResult {
  return {
    text: dto.text,
    voice: dto.voice,
    rate: dto.rate as 1 | 0.75,
    engine: dto.engine,
    audio: dto.audio
      ? {
          mimeType: dto.audio.mime_type,
          base64: dto.audio.base64,
          durationMs: dto.audio.duration_ms,
        }
      : null,
    fallbackReason: dto.fallback_reason,
  };
}

/**
 * Maps the pronunciation evaluation response from snake_case DTO to domain entity.
 */
export function toPronunciationEvaluation(dto: PronunciationEvaluationDto): PronunciationEvaluation {
  return {
    overallScore: dto.overall_score,
    wordScores: dto.word_scores.map((ws): PronunciationWordScore => ({
      word: ws.word,
      status: ws.status,
      confidence: ws.confidence,
    })),
    feedbackPt: dto.feedback_pt,
    transcript: dto.transcript,
  };
}

/**
 * Maps the password recovery response to the domain entity.
 *
 * `devResetToken` and `devResetUrl` are optional in the contract — the API sends them
 * only outside production — so they stay `undefined` here when they are absent, and the
 * interface simply does not show a link it never received.
 */
export function toForgotPasswordResult(dto: ForgotPasswordResponseDto): ForgotPasswordResult {
  return {
    message: dto.message,
    devResetToken: dto.devResetToken ?? null,
    devResetUrl: dto.devResetUrl ?? null,
  };
}

/** Maps the password reset response to the domain entity. */
export function toResetPasswordResult(dto: ResetPasswordResponseDto): ResetPasswordResult {
  return { message: dto.message };
}
