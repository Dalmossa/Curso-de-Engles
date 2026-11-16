/**
 * O corpo de `PATCH /api/v1/learners/:id/profile`, transcrito do contrato.
 *
 * `docs/api-spec.openapi.yaml` → `components.schemas.UpdateLearnerProfileRequest`:
 * `additionalProperties: false`, and two members — `displayName` and `avatarUrl` — both optional.
 *
 * **"Opcional" tem três estados, e os três são diferentes.** Um membro ausente (`undefined`) é
 * "não mexa neste campo"; um membro `null` é "limpe este campo"; um valor é "use este valor".
 * A distinção sobrevive porque `@IsOptional()` (do `class-validator`) pula a validação **apenas**
 * para `null` e `undefined` — e é por isso que o tipo declarado é `string | null` e não `string`:
 * com `string`, o `design:type` emitido seria `String`, a conversão implícita do `ValidationPipe`
 * (`enableImplicitConversion: true`) transformaria um número em texto antes da validação, e
 * `123` passaria como nome. Com `string | null` o tipo emitido é `Object`, a conversão não toca no
 * valor, e `@IsString()` continua rejeitando o que não é texto.
 *
 * O membro não declarado é **rejeitado** (`whitelist` + `forbidNonWhitelisted` no `ValidationPipe`
 * global, `CONSTITUTION.md` §4.5), e é por isso que o esquema do contrato declara
 * `additionalProperties: false`.
 *
 * **As regras de conteúdo moram no domínio** (`src/domain/entities/learner-identity.ts`), e este
 * arquivo apenas as transcreve: o que é um avatar aceitável é uma regra sobre *identidade*, não
 * sobre *formato de requisição*, e ela precisa de um dono só — inclusive porque a regra de
 * segurança (nenhum SVG, nenhum `http://`) não pode depender de um decorator esquecido.
 */

import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import type { ValidatorConstraintInterface } from 'class-validator';

import {
  AVATAR_MAX_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  isAllowedAvatar,
} from '../../../domain/entities/learner-identity.js';

/**
 * Recorta o valor **antes** da validação.
 *
 * Sem isto, um nome de espaços passaria por `@MinLength(1)` — são três caracteres — e seria
 * gravado como um nome que não é nome. Recortar antes de validar faz a regra ser uma só: o que
 * o validador mede é exatamente o que será gravado.
 */
const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

/**
 * O avatar tem de ser um `https://` ou um `data:` de imagem raster — a regra completa está em
 * `isAllowedAvatar`, e a mensagem diz o que é aceitável em vez de repetir a gramática interna.
 */
@ValidatorConstraint({ name: 'allowedAvatar', async: false })
export class AllowedAvatarConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isAllowedAvatar(value);
  }

  defaultMessage(): string {
    return (
      'avatar_url must be an https URL or a data URL of a PNG, JPEG, WEBP or GIF image ' +
      `up to ${AVATAR_MAX_LENGTH} characters`
    );
  }
}

export class UpdateProfileDto {
  /**
   * O nome de exibição. 1 a 80 caracteres depois de recortado; `null` limpa o campo.
   */
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MinLength(DISPLAY_NAME_MIN_LENGTH)
  @MaxLength(DISPLAY_NAME_MAX_LENGTH)
  display_name?: string | null;

  /**
   * O avatar: um endereço `https://` ou um `data:` URL de imagem raster com até 100 KiB de texto.
   * `null` limpa o campo.
   */
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(AVATAR_MAX_LENGTH)
  @Validate(AllowedAvatarConstraint)
  avatar_url?: string | null;
}
