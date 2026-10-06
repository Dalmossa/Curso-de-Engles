import { SessionEntity } from '../entities/session.entity.js';
import { PracticeAttemptEntity } from '../entities/practice-attempt.entity.js';
import { ItemResponseEntity } from '../entities/item-response.entity.js';
import { ListeningAttemptEntity } from '../entities/listening-attempt.entity.js';
import { SlotResponseEntity } from '../entities/slot-response.entity.js';
import {
  LearningSession,
  PracticeAttempt,
  ItemResponse,
  ListeningAttempt,
  SlotResponse,
} from '../../domain/entities/learning-session.js';

export function sessionToDomain(e: SessionEntity): LearningSession {
  return new LearningSession(e.id, e.learnerId, e.startedAt, e.endedAt);
}
export function sessionToEntity(d: LearningSession): SessionEntity {
  const e = new SessionEntity();
  e.id = d.id;
  e.learnerId = d.learnerId;
  e.startedAt = d.startedAt;
  e.endedAt = d.endedAt;
  return e;
}

export function practiceAttemptToDomain(e: PracticeAttemptEntity): PracticeAttempt {
  return new PracticeAttempt(
    e.id,
    e.sessionId,
    e.learnerId,
    e.packLayer as PracticeAttempt['packLayer'],
    e.packId,
    e.startedAt,
    e.completedAt,
    e.totalItems,
    e.correctCount,
  );
}
export function practiceAttemptToEntity(d: PracticeAttempt): PracticeAttemptEntity {
  const e = new PracticeAttemptEntity();
  e.id = d.id;
  e.sessionId = d.sessionId;
  e.learnerId = d.learnerId;
  e.packLayer = d.packLayer;
  e.packId = d.packId;
  e.startedAt = d.startedAt;
  e.completedAt = d.completedAt;
  e.totalItems = d.totalItems;
  e.correctCount = d.correctCount;
  return e;
}

export function itemResponseToDomain(e: ItemResponseEntity): ItemResponse {
  return new ItemResponse(
    e.id,
    e.attemptId,
    e.learnerId,
    e.itemId,
    e.response,
    e.correct,
    e.responseTimeMs,
    e.confidence == null ? null : (Number(e.confidence) as ItemResponse['confidence']),
    Number(e.bktPrior),
    Number(e.bktPosterior),
    e.createdAt,
  );
}
export function itemResponseToEntity(d: ItemResponse): ItemResponseEntity {
  const e = new ItemResponseEntity();
  e.id = d.id;
  e.attemptId = d.attemptId;
  e.learnerId = d.learnerId;
  e.itemId = d.itemId;
  e.response = d.response;
  e.correct = d.correct;
  e.responseTimeMs = d.responseTimeMs;
  e.confidence = d.confidence == null ? null : String(d.confidence);
  e.bktPrior = String(d.bktPrior);
  e.bktPosterior = String(d.bktPosterior);
  e.createdAt = d.createdAt;
  return e;
}

export function listeningAttemptToDomain(e: ListeningAttemptEntity): ListeningAttempt {
  return new ListeningAttempt(
    e.id,
    e.sessionId,
    e.learnerId,
    e.dialogueId,
    e.startedAt,
    e.completedAt,
    e.totalSlots,
    e.correctCount,
  );
}
export function listeningAttemptToEntity(d: ListeningAttempt): ListeningAttemptEntity {
  const e = new ListeningAttemptEntity();
  e.id = d.id;
  e.sessionId = d.sessionId;
  e.learnerId = d.learnerId;
  e.dialogueId = d.dialogueId;
  e.startedAt = d.startedAt;
  e.completedAt = d.completedAt;
  e.totalSlots = d.totalSlots;
  e.correctCount = d.correctCount;
  return e;
}

export function slotResponseToDomain(e: SlotResponseEntity): SlotResponse {
  return new SlotResponse(
    e.id,
    e.attemptId,
    e.learnerId,
    e.itemId,
    e.responseLetter as SlotResponse['responseLetter'],
    e.correct,
    e.responseTimeMs,
    e.voiceId,
    e.clipId,
    e.assistUsed,
    e.replays,
    e.createdAt,
  );
}
export function slotResponseToEntity(d: SlotResponse): SlotResponseEntity {
  const e = new SlotResponseEntity();
  e.id = d.id;
  e.attemptId = d.attemptId;
  e.learnerId = d.learnerId;
  e.itemId = d.itemId;
  e.responseLetter = d.responseLetter;
  e.correct = d.correct;
  e.responseTimeMs = d.responseTimeMs;
  e.voiceId = d.voiceId;
  e.clipId = d.clipId;
  e.assistUsed = d.assistUsed;
  e.replays = d.replays;
  e.createdAt = d.createdAt;
  return e;
}