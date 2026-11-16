import type { GrammarTip, SpeechRepository } from '@/core';

export class GetGrammarTip {
  constructor(private readonly speech: SpeechRepository) {}

  async execute(topic: string): Promise<GrammarTip> {
    return this.speech.getGrammarTip(topic);
  }
}
