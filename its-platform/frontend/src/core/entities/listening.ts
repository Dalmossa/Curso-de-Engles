/**
 * `GET /content/listening/{dialogue_id}`.
 *
 * `options` is again the complete, unmarked set (ADR-044 D3): the member it replaced
 * published `distractors[]`, whose *complement* recovered the key as `{A…D} \
 * distractors` on all 74 shipped slots. Nothing here identifies a key either.
 */
export type ListeningSlotSkill = 'gist' | 'detail' | 'inference' | 'lexical' | 'pragmatic' | 'pronunciation';

export interface DialogueVoice {
  readonly voiceId: string;
  readonly speaker: string;
  readonly accent: string;
}

export interface DialogueSlotOption {
  readonly letter: string;
  readonly text: string;
}

export interface DialogueSlot {
  readonly slotId: string;
  readonly skill: ListeningSlotSkill;
  /** The dialogue's full authored transcript — the same string on every slot. */
  readonly transcript: string;
  readonly options: readonly DialogueSlotOption[];
}

export interface DialogueContent {
  readonly dialogueId: string;
  readonly title: string;
  readonly status: 'shipped' | 'shadow_only';
  readonly durationSeconds: number | null;
  readonly voices: readonly DialogueVoice[];
  readonly slots: readonly DialogueSlot[];
}

export interface DialogueAudioClip {
  readonly clipId: string;
  readonly sortIndex: number;
  readonly speakerId: string;
  readonly voiceId: string;
  readonly take: number;
  readonly rate: 1 | 0.75;
  readonly durationSeconds: number;
  readonly url: string;
  readonly expiresAt: string;
}

export interface DialogueAudio {
  readonly dialogueId: string;
  readonly ttlSeconds: number;
  readonly clips: readonly DialogueAudioClip[];
}
