/**
 * Domain entities — listening corpus (context 3).
 * Pure TypeScript, no framework imports (ADR-014).
 */

export type DialogueStatus = 'shipped' | 'shadow_only';

export class Voice {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly accent: string,
    public readonly gender: string | null,
    public readonly active: boolean,
  ) {}
}

/** D-12: Speaker is an entity; within a dialogue, voice ≡ speaker identity. */
export class Speaker {
  constructor(
    public readonly id: string,
    public readonly displayName: string,
    public readonly gender: string | null,
  ) {}
}

export class DialogueSpeaker {
  constructor(
    public readonly dialogueId: string,
    public readonly speakerId: string,
    public readonly voiceId: string,
  ) {}
}

export class Dialogue {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly cefrLevel: string,
    public readonly status: DialogueStatus,
    public readonly durationSeconds: number,
    public readonly createdAt: Date,
    public readonly speakers: DialogueSpeaker[],
  ) {}
}

export class Clip {
  constructor(
    public readonly id: string,
    public readonly dialogueId: string,
    public readonly speakerId: string,
    public readonly sortIndex: number,
    public readonly utteranceText: string,
    public readonly phoneticTarget: string | null,
  ) {}
}

export class ClipRender {
  constructor(
    public readonly id: string,
    public readonly clipId: string,
    public readonly take: number,
    public readonly voiceId: string,
    public readonly rate: number,
    public readonly durationS: number,
    public readonly uri: string,
    public readonly earCheckedAt: Date | null,
    public readonly earCheckedBy: string | null,
  ) {}
}