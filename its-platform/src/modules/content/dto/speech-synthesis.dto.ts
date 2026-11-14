/**
 * História 1 — o corpo de `POST /content/tts`, transcrito do contrato.
 *
 * `docs/api-spec.openapi.yaml` → `components.schemas.SpeechSynthesisRequest`:
 * `required: [text]`, `text` entre 1 e 500 caracteres, `voice` no formato BCP-47 simples
 * (`en-US`) e `rate` no par de acomodação `1 | 0.75` — as mesmas duas velocidades que a escuta
 * publica (ADR-028 §2). Um membro não declarado é **rejeitado** (`whitelist` +
 * `forbidNonWhitelisted`, `CONSTITUTION.md` §4.5), e é por isso que o esquema do contrato declara
 * `additionalProperties: false`.
 *
 * Não há `format`/`engine` no corpo: o formato é decisão do adaptador (MP3 é o que o navegador
 * toca sem codec extra) e o motor é configuração do ambiente. Deixar o cliente escolher um
 * fornecedor seria publicar a configuração do servidor como parte da API.
 */

import { IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/** BCP-47 no subconjunto que o contrato publica: idioma minúsculo, região maiúscula. */
export const SPEECH_LOCALE_PATTERN = /^[a-z]{2}-[A-Z]{2}$/;

/** As duas velocidades renderizadas. Outra velocidade não é sintetizada, então não é aceita. */
export const SPEECH_RATES: readonly number[] = [1, 0.75];

export class SpeechSynthesisDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text!: string;

  @IsOptional()
  @IsString()
  @Matches(SPEECH_LOCALE_PATTERN)
  voice?: string;

  @IsOptional()
  @IsIn(SPEECH_RATES)
  rate?: number;
}
