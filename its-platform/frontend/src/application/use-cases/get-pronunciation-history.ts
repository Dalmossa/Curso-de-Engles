import type { PronunciationHistory, SpeechRepository } from '@/core';

export class GetPronunciationHistory {
  constructor(private readonly speech: SpeechRepository) {}

  async execute(): Promise<PronunciationHistory> {
    return this.speech.getPronunciationHistory();
  }
}
