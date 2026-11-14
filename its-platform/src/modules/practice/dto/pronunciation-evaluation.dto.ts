/**
 * História 2 — o corpo de `POST /practice/pronunciation-evaluate`.
 *
 * O contrato aceita **duas** origens de transcrição, e essa é a decisão central deste arquivo:
 *
 * - `transcript` — o texto que o próprio navegador reconheceu (Web Speech API). É o caminho
 *   barato e funciona sem motor de ASR no servidor.
 * - `audio_base64` — a gravação, para quando o servidor tem ASR configurado. O áudio vai como
 *   base64 em JSON, e não como `multipart/form-data`, porque o `HttpClient` do BFF fala JSON e o
 *   `multer` não é dependência do projeto. O limite de 500 000 caracteres é folgado para 15 s a
 *   24 kbps (≈ 45 KB de áudio, ≈ 60 KB em base64) e apertado o bastante para não aceitar um
 *   arquivo de minutos.
 *
 * A regra "pelo menos um dos dois" não cabe em class-validator por campo, então o controller a
 * verifica e responde `400` — é um erro do chamador, não do servidor.
 */

import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/** BCP-47 no subconjunto que o contrato publica (`en-US`). */
export const PRONUNCIATION_LOCALE_PATTERN = /^[a-z]{2}-[A-Z]{2}$/;

/** Base64 canônico, sem espaços — o mesmo formato que o adaptador de ASR espera. */
export const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

/** 15 s a 24 kbps em base64, com margem; acima disso é gravação fora do limite da UI. */
const MAX_AUDIO_BASE64_LENGTH = 500_000;

export class PronunciationEvaluationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  expected_text!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2_000)
  transcript?: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_AUDIO_BASE64_LENGTH)
  @Matches(BASE64_PATTERN)
  audio_base64?: string;

  @IsOptional()
  @IsString()
  @Matches(/^audio\/[a-z0-9.+-]+$/i)
  mime_type?: string;

  @IsOptional()
  @IsString()
  @Matches(PRONUNCIATION_LOCALE_PATTERN)
  locale?: string;
}
