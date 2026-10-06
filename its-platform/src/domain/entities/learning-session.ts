/**
 * Domain entities — learning session (context 5) and its attempt/response records.
 * Pure TypeScript, no framework imports (ADR-014).
 */

export type PackLayer = 'p1' | 'p2' | 'p3';
export type Confidence = 1 | 2 | 3 | 4 | 5;

export class LearningSession {
  constructor(
    public readonly id: string,
    public readonly learnerId: string,
    public readonly startedAt: Date,
    public readonly endedAt: Date | null,
  ) {}
}

export class PracticeAttempt {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly learnerId: string,
    public readonly packLayer: PackLayer,
    public readonly packId: string | null,
    public readonly startedAt: Date,
    public readonly completedAt: Date | null,
    public readonly totalItems: number,
    public readonly correctCount: number,
  ) {}
}

export class ItemResponse {
  constructor(
    public readonly id: string,
    public readonly attemptId: string,
    public readonly learnerId: string,
    public readonly itemId: string,
    public readonly response: string | null,
    public readonly correct: boolean | null,
    public readonly responseTimeMs: number,
    public readonly confidence: Confidence | null,
    public readonly bktPrior: number,
    public readonly bktPosterior: number,
    public readonly createdAt: Date,
  ) {}
}

export class ListeningAttempt {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly learnerId: string,
    public readonly dialogueId: string,
    public readonly startedAt: Date,
    public readonly completedAt: Date | null,
    public readonly totalSlots: number,
    public readonly correctCount: number,
  ) {}
}

export class SlotResponse {
  constructor(
    public readonly id: string,
    public readonly attemptId: string,
    public readonly learnerId: string,
    public readonly itemId: string,
    public readonly responseLetter: 'A' | 'B' | 'C' | 'D' | null,
    public readonly correct: boolean,
    public readonly responseTimeMs: number,
    public readonly voiceId: string,
    public readonly clipId: string,
    public readonly assistUsed: boolean,
    public readonly replays: number,
    public readonly createdAt: Date,
  ) {}
}