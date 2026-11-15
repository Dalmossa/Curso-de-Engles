/**
 * O corpo de `POST /auth/reset-password`, transcrito do contrato.
 *
 * `docs/api-spec.openapi.yaml` → `components.schemas.ResetPasswordRequest`:
 * `required: [token, newPassword]`.
 *
 * Os limites não são arbitrários:
 *
 * - `token` — 64 caracteres hex é o que o gerador emite (32 bytes aleatórios); o teto de 128
 *   deixa folga para um token de outro formato sem aceitar carga arbitrária.
 * - `newPassword` — mínimo de 8 caracteres (o mesmo mínimo que o frontend exige) e máximo de
 *   72, porque o bcrypt **trunca** a senha em 72 bytes: aceitar mais faria duas senhas
 *   diferentes produzirem o mesmo hash, o que quebraria a promessa de "a senha nova é a que
 *   eu digitei".
 *
 * O membro não declarado é **rejeitado** (`whitelist` + `forbidNonWhitelisted` no
 * `ValidationPipe` global, `CONSTITUTION.md` §4.5), e é por isso que o esquema do contrato
 * declara `additionalProperties: false`.
 */

import { IsString, MaxLength, MinLength } from 'class-validator';

/** 32 bytes aleatórios em hex são 64 caracteres; 128 é o teto tolerado. */
export const RESET_TOKEN_MAX_LENGTH = 128;

/** Mínimo de senha nova — o mesmo mínimo exigido pela interface. */
export const NEW_PASSWORD_MIN_LENGTH = 8;

/** O bcrypt trunca em 72 bytes; acima disso a parte final seria silenciosamente ignorada. */
export const NEW_PASSWORD_MAX_LENGTH = 72;

export class ResetPasswordDto {
  @IsString()
  @MinLength(1)
  @MaxLength(RESET_TOKEN_MAX_LENGTH)
  token!: string;

  @IsString()
  @MinLength(NEW_PASSWORD_MIN_LENGTH)
  @MaxLength(NEW_PASSWORD_MAX_LENGTH)
  newPassword!: string;
}
