import { AppendOnlyEventEntity } from '../entities/append-only-event.entity.js';
import { AppendOnlyEvent } from '../../domain/entities/append-only-event.js';

export function appendOnlyEventToDomain(e: AppendOnlyEventEntity): AppendOnlyEvent {
  return new AppendOnlyEvent(
    e.seq,
    e.eventId,
    e.learnerId,
    e.sessionId,
    e.lessonId,
    e.itemId,
    e.skillIds,
    e.eventType,
    e.occurredAt,
    e.payload,
    e.prevHash,
    e.rowHash,
  );
}
export function appendOnlyEventToEntity(d: AppendOnlyEvent): AppendOnlyEventEntity {
  const e = new AppendOnlyEventEntity();
  e.seq = d.seq;
  e.eventId = d.eventId;
  e.learnerId = d.learnerId;
  e.sessionId = d.sessionId;
  e.lessonId = d.lessonId;
  e.itemId = d.itemId;
  e.skillIds = d.skillIds;
  e.eventType = d.eventType;
  e.occurredAt = d.occurredAt;
  e.payload = d.payload;
  e.prevHash = d.prevHash;
  e.rowHash = d.rowHash;
  return e;
}