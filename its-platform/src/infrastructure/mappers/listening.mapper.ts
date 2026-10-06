import { VoiceEntity } from '../entities/voice.entity.js';
import { SpeakerEntity } from '../entities/speaker.entity.js';
import { DialogueEntity } from '../entities/dialogue.entity.js';
import { DialogueSpeakerEntity } from '../entities/dialogue-speaker.entity.js';
import { ClipEntity } from '../entities/clip.entity.js';
import { ClipRenderEntity } from '../entities/clip-render.entity.js';
import {
  Voice,
  Speaker,
  Dialogue,
  DialogueSpeaker,
  Clip,
  ClipRender,
} from '../../domain/entities/listening-corpus.js';

export function voiceToDomain(e: VoiceEntity): Voice {
  return new Voice(e.id, e.label, e.accent, e.gender, e.active);
}
export function voiceToEntity(d: Voice): VoiceEntity {
  const e = new VoiceEntity();
  e.id = d.id;
  e.label = d.label;
  e.accent = d.accent;
  e.gender = d.gender;
  e.active = d.active;
  return e;
}

export function speakerToDomain(e: SpeakerEntity): Speaker {
  return new Speaker(e.id, e.displayName, e.gender);
}
export function speakerToEntity(d: Speaker): SpeakerEntity {
  const e = new SpeakerEntity();
  e.id = d.id;
  e.displayName = d.displayName;
  e.gender = d.gender;
  return e;
}

export function dialogueSpeakerToDomain(e: DialogueSpeakerEntity): DialogueSpeaker {
  return new DialogueSpeaker(e.dialogueId, e.speakerId, e.voiceId);
}
export function dialogueSpeakerToEntity(d: DialogueSpeaker): DialogueSpeakerEntity {
  const e = new DialogueSpeakerEntity();
  e.dialogueId = d.dialogueId;
  e.speakerId = d.speakerId;
  e.voiceId = d.voiceId;
  return e;
}

export function dialogueToDomain(e: DialogueEntity, speakers: DialogueSpeaker[] = []): Dialogue {
  return new Dialogue(
    e.id,
    e.title,
    e.cefrLevel,
    e.status as Dialogue['status'],
    e.durationSeconds,
    e.createdAt,
    speakers,
  );
}
export function dialogueToEntity(d: Dialogue): DialogueEntity {
  const e = new DialogueEntity();
  e.id = d.id;
  e.title = d.title;
  e.cefrLevel = d.cefrLevel;
  e.status = d.status;
  e.durationSeconds = d.durationSeconds;
  e.createdAt = d.createdAt;
  return e;
}

export function clipToDomain(e: ClipEntity): Clip {
  return new Clip(
    e.id,
    e.dialogueId,
    e.speakerId,
    e.sortIndex,
    e.utteranceText,
    e.phoneticTarget,
  );
}
export function clipToEntity(d: Clip): ClipEntity {
  const e = new ClipEntity();
  e.id = d.id;
  e.dialogueId = d.dialogueId;
  e.speakerId = d.speakerId;
  e.sortIndex = d.sortIndex;
  e.utteranceText = d.utteranceText;
  e.phoneticTarget = d.phoneticTarget;
  return e;
}

export function clipRenderToDomain(e: ClipRenderEntity): ClipRender {
  return new ClipRender(
    e.id,
    e.clipId,
    e.take,
    e.voiceId,
    Number(e.rate),
    Number(e.durationS),
    e.uri,
    e.earCheckedAt,
    e.earCheckedBy,
  );
}
export function clipRenderToEntity(d: ClipRender): ClipRenderEntity {
  const e = new ClipRenderEntity();
  e.id = d.id;
  e.clipId = d.clipId;
  e.take = d.take;
  e.voiceId = d.voiceId;
  e.rate = String(d.rate);
  e.durationS = String(d.durationS);
  e.uri = d.uri;
  e.earCheckedAt = d.earCheckedAt;
  e.earCheckedBy = d.earCheckedBy;
  return e;
}