import type { SpeechRepository } from '@/core';
import type {
  SpeechSynthesisInput,
  SpeechSynthesisResult,
  PronunciationEvaluationInput,
  PronunciationEvaluation,
  PronunciationHistory,
  GrammarTip,
} from '@/core';
import type { ApiTransport } from '../api-transport';
import {
  toSpeechSynthesisResult,
  toPronunciationEvaluation,
  toPronunciationHistory,
  toGrammarTip,
  type SpeechSynthesisDto,
  type PronunciationEvaluationDto,
  type PronunciationHistoryResponseDto,
  type GrammarTipResponseDto,
} from '../mappers';

export class HttpSpeechRepository implements SpeechRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async synthesizeSpeech(input: SpeechSynthesisInput): Promise<SpeechSynthesisResult> {
    const dto = await this._transport.request<SpeechSynthesisDto>({
      operation: 'content.tts',
      body: {
        text: input.text,
        voice: input.voice,
        rate: input.rate,
      },
    });
    return toSpeechSynthesisResult(dto);
  }

  async evaluatePronunciation(input: PronunciationEvaluationInput): Promise<PronunciationEvaluation> {
    const body: Record<string, string> = {
      expected_text: input.expectedText,
      locale: input.locale ?? 'en-US',
      mime_type: input.mimeType ?? 'audio/webm',
    };
    if (input.transcript !== undefined && input.transcript !== '') body.transcript = input.transcript;
    if (input.audioBase64 !== undefined && input.audioBase64 !== '') body.audio_base64 = input.audioBase64;
    // Keep contract-compatible behavior: at least one of transcript/audio_base64 must be present.
    if (body.transcript === undefined && body.audio_base64 === undefined && input.transcript !== undefined) {
      body.transcript = input.transcript;
    }

    const dto = await this._transport.request<PronunciationEvaluationDto>({
      operation: 'practice.pronunciation',
      body,
    });
    return toPronunciationEvaluation(dto);
  }

  async getPronunciationHistory(): Promise<PronunciationHistory> {
    const dto = await this._transport.request<PronunciationHistoryResponseDto>({
      operation: 'practice.pronunciationHistory',
    });
    return toPronunciationHistory(dto);
  }

  async getGrammarTip(topic: string): Promise<GrammarTip> {
    const dto = await this._transport.request<GrammarTipResponseDto>({
      operation: 'content.grammarTip',
      query: { topic },
    });
    return toGrammarTip(dto);
  }
}