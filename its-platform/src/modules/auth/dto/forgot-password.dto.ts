/**
 * O corpo de `POST /auth/forgot-password`, transcrito do contrato.
 *
 * `docs/api-spec.openapi.yaml` → `components.schemas.ForgotPasswordRequest`:
 * `required: [email]`, `email` no formato `email` e no máximo 320 caracteres.
 *
 * O e-mail é validado **aqui**, e não só comparado com a tabela: um corpo com `email`
 * ausente ou malformado é um erro do chamador (`400`), enquanto um e-mail bemformado que
 * não existe no banco é uma resposta normal (`200`) — a resposta não pode revelar se a
 * conta existe, em nenhum ambiente.
 *
 * O membro não declarado é **rejeitado** (`whitelist` + `forbidNonWhitelisted` no
 * `ValidationPipe` global, `CONSTITUTION.md` §4.5), e é por isso que o esquema do contrato
 * declara `additionalProperties: false`.
 */

import { IsEmail, MaxLength } from 'class-validator';

/** O maior endereço de e-mail que a RFC 5321 permite em um campo `To:`. */
export const EMAIL_MAX_LENGTH = 320;

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(EMAIL_MAX_LENGTH)
  email!: string;
}
