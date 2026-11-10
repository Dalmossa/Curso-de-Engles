import type { PracticeRepository, PracticeResult, PracticeSubmissionInput } from '@/core';
import type { ApiTransport } from '../api-transport';
import type { components } from '../generated/api-types';
import { toPracticeResult, type PracticeResultDto } from '../mappers';

type PracticeSubmissionDto = components['schemas']['PracticeSubmission'];
type ResponseDto = PracticeSubmissionDto['responses'][number];
type ResponseBodyDto = ResponseDto['response'];

export class HttpPracticeRepository implements PracticeRepository {
  constructor(private readonly _transport: ApiTransport) {}

  async submit(learnerId: string, submission: PracticeSubmissionInput): Promise<PracticeResult> {
    // The body is built with exactly the members `PracticeSubmission` declares: the DTO
    // rejects an unknown member rather than ignoring it (`additionalProperties: false`),
    // so there is no room for a convenience field here.
    const body: PracticeSubmissionDto = {
      learner_id: learnerId,
      pack_id: submission.packId,
      responses: submission.responses.map((response) => toResponseDto(response)),
    };

    const dto = await this._transport.request<PracticeResultDto>({
      operation: 'learner.practice',
      pathParams: { learner_id: learnerId },
      body,
    });

    return toPracticeResult(dto);
  }
}

function toResponseDto(response: PracticeSubmissionInput['responses'][number]): ResponseDto {
  const base = {
    item_id: response.itemId,
    response: toResponseBody(response.response),
    response_time_ms: response.responseTimeMs,
  };
  return response.confidence === undefined ? base : { ...base, confidence: response.confidence };
}

/** `response` is `oneOf: string | object`, and the object branch forbids unknown members. */
function toResponseBody(response: PracticeSubmissionInput['responses'][number]['response']): ResponseBodyDto {
  if (typeof response === 'string') return response;

  const body: Exclude<ResponseBodyDto, string> = {};
  if (response.transcript !== undefined) body.transcript = response.transcript;
  if (response.audioRef !== undefined) body.audio_ref = response.audioRef;
  return body;
}
