import type { SpeechRepository } from '@/core';
import type {
  SpeechSynthesisInput,
  SpeechSynthesisResult,
  PronunciationEvaluationInput,
  PronunciationEvaluation,
} from '@/core';
import type { ApiTransport } from '../api-transport';
import {
  toSpeechSynthesisResult,
  toPronunciationEvaluation,
  type SpeechSynthesisDto,
  type PronunciationEvaluationRequestDto,
  type PronunciationEvaluationDto,
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
    const requestDto: PronunciationEvaluationRequestDto = {
      expected_text: input.expectedText,
      transcript: input.transcript ?? '',
      audio_base64: input.audioBase64 ?? '',
      mime_type: input.mimeType ?? 'audio/webm',
      locale: input.locale ?? 'en-US',
    };

    const dto = await this._transport.request<PronunciationEvaluationDto>({
      operation: 'practice.pronunciation',
      body: requestDto,
    });
    return toPronunciationEvaluation(dto);
  }
}