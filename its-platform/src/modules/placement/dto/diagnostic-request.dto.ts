/**
 * A5a — the request body of `POST /learners/{learner_id}/placement`, as the contract publishes it.
 *
 * `docs/api-spec.openapi.yaml` → `components.schemas.DiagnosticRequest` declares
 * `required: [learner_id, mode]`, `mode ∈ {adaptive, fixed}`, a `format: uuid` identifier and an
 * optional `prior_estimate` object whose `source` is one of three values. `CONSTITUTION.md` §4.5
 * makes enforcing that mandatory — a global `ValidationPipe` with `whitelist` and
 * `forbidNonWhitelisted`, so that an undeclared member is rejected rather than ignored — and §4.5
 * states why: *"Data sanitization"* and no mass assignment. Until A5a the controller took
 * `@Body() body: any`, which gave the pipe no metatype to validate against and made the published
 * schema advisory.
 *
 * No member beyond the contract's is declared, and no constraint the contract omits is invented:
 * the `snake_case` spelling of `learner_id`, extra required members and cross-member rules (such as
 * this body's `learner_id` agreeing with the path parameter of the same name) are decisions, not
 * deductions — `reports/api/fase-5.md` §8 records the last one as open.
 */

import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';

/** `DiagnosticRequest.mode` — the contract's enum, verbatim. */
export const DIAGNOSTIC_MODES = ['adaptive', 'fixed'] as const;
export type DiagnosticMode = (typeof DIAGNOSTIC_MODES)[number];

/** `DiagnosticRequest.prior_estimate.source` — the contract's enum, verbatim. */
export const PRIOR_ESTIMATE_SOURCES = [
  'previous_diagnostic',
  'self_report',
  'external_test',
] as const;
export type PriorEstimateSource = (typeof PRIOR_ESTIMATE_SOURCES)[number];

/**
 * `DiagnosticRequest.prior_estimate` — a warm start for the estimate.
 *
 * The contract declares no `required` inside it, so all three members are optional; what it does
 * declare is their types, which is why this is a class the pipe can reach rather than `object`.
 */
export class PriorEstimateDto {
  @IsOptional()
  @IsNumber()
  theta?: number;

  @IsOptional()
  @IsNumber()
  se?: number;

  @IsOptional()
  @IsIn(PRIOR_ESTIMATE_SOURCES)
  source?: PriorEstimateSource;
}

/** `components.schemas.DiagnosticRequest`. */
export class DiagnosticRequestDto {
  @IsDefined()
  @IsUUID()
  learner_id!: string;

  @IsDefined()
  @IsIn(DIAGNOSTIC_MODES)
  mode!: DiagnosticMode;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriorEstimateDto)
  prior_estimate?: PriorEstimateDto;
}
