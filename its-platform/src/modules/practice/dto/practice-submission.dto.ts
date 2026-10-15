/**
 * A5a — the request body of `POST /learners/{learner_id}/practice`, as the contract publishes it.
 *
 * `docs/api-spec.openapi.yaml` → `components.schemas.PracticeSubmission`:
 * `required: [learner_id, pack_id, responses]`, `learner_id` a uuid, `pack_id` and every
 * `responses[].item_id` restricted by `pattern`, `responses` at least one item
 * (`minItems: 1`), and each item requiring `item_id` / `response` / `response_time_ms` with
 * `response_time_ms >= 0` and an optional `confidence ∈ [0, 1]`.
 *
 * The two patterns are the contract's, transcribed — not widened. That was checked before it was
 * enforced: `reports/api/fase-5.md` §2 measures **all 49** distinct item ids the packs declare
 * against `ITEM_ID_PATTERN` and finds **0** violations, so an item id a caller legitimately holds is
 * never rejected by this DTO. `response` is the one member class-validator cannot express alone;
 * see `./response-shape.ts`.
 *
 * `whitelist` + `forbidNonWhitelisted` (§4.5) apply at every level the pipe can reach, which is why
 * each nested shape is a class rather than `object` or `any`.
 */

import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { IsResponseShape } from './response-shape.js';

/** `PracticeSubmission.pack_id` — the contract's pattern, verbatim. */
export const PACK_ID_PATTERN = /^pack[-_]les_[a-z0-9_]+(_v1)?$/;

/** `PracticeSubmission.responses[].item_id` — the contract's pattern, verbatim. */
export const ITEM_ID_PATTERN = /^(grm|voc|rdg|prn|lst|coh)_[a-z0-9_.-]+$/;

/** One submission inside `responses`. */
export class PracticeResponseDto {
  @IsDefined()
  @Matches(ITEM_ID_PATTERN)
  item_id!: string;

  @IsDefined()
  @IsResponseShape()
  response!: string | { transcript?: string; audio_ref?: string };

  @IsDefined()
  @IsInt()
  @Min(0)
  response_time_ms!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;
}

/** `components.schemas.PracticeSubmission`. */
export class PracticeSubmissionDto {
  @IsDefined()
  @IsUUID()
  learner_id!: string;

  @IsDefined()
  @Matches(PACK_ID_PATTERN)
  pack_id!: string;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PracticeResponseDto)
  responses!: PracticeResponseDto[];
}
