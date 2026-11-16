import type { CefrLevel } from '../value-objects/cefr-level';

/**
 * A identidade da conta — o que o cabeçalho global mostra e o que o aluno pode corrigir.
 *
 * **Separada de `LearnerProfile` de propósito.** O perfil é o *portfólio de aprendizagem* —
 * domínio, FSRS, preferências — e a identidade é a *conta*: o nome que o aluno escolheu, o
 * e-mail com que ele entra, a foto ao lado do nome e a banda em que está. As duas coisas
 * vêm do mesmo `GET /learners/{id}/profile`, mas têm donos diferentes no banco (`users` e as
 * tabelas de aprendizagem) e ciclos de vida diferentes: o perfil muda a cada prática, a
 * identidade muda quando o aluno a edita.
 *
 * **Cada membro admite `null`, e isso é uma resposta honesta.** Um aluno que nunca escolheu
 * um nome tem um nome ausente — não um nome vazio. Um e-mail ausente significa "esta conta
 * não tem e-mail", e a interface mostra isso em vez de inventar um.
 */
export interface AccountIdentity {
  readonly learnerId: string;
  /** O nome de exibição escolhido pelo aluno; `null` quando nunca foi escolhido. */
  readonly displayName: string | null;
  /** O e-mail da conta — o mesmo com que o aluno entra. */
  readonly email: string | null;
  /**
   * O avatar: um endereço `https://` ou um `data:` URL de imagem raster.
   *
   * A regra de aceitação mora na API (`src/domain/entities/learner-identity.ts` no backend);
   * aqui ela é apenas reproduzida para que a interface possa recusar antes de enviar — e
   * porque o que a interface **desenha** depende de ela: um `data:` é desenhado com
   * `<img>`, e um endereço remoto também, mas um `javascript:` nunca seria desenhado.
   */
  readonly avatarUrl: string | null;
  /** A banda atual; `null` enquanto nenhum diagnóstico foi concluído. */
  readonly cefrLevel: CefrLevel | null;
}

/**
 * O que o aluno pode corrigir — o nome e o avatar, e **só** os dois.
 *
 * Os três estados de cada membro são o contrato inteiro:
 *
 * - **ausente** — *"não mexa neste campo"*;
 * - **`null`** — *"limpe este campo"*;
 * - **um valor** — *"use este valor"*.
 *
 * A distinção sobrevive porque `undefined` e `null` são valores diferentes em TypeScript com
 * `exactOptionalPropertyTypes`, e porque o `PATCH` do backend faz a mesma distinção.
 */
export interface AccountProfilePatch {
  readonly displayName?: string | null;
  readonly avatarUrl?: string | null;
}

/** 80 caracteres — um rótulo, não um parágrafo. O mesmo teto que a API aplica. */
export const DISPLAY_NAME_MAX_LENGTH = 80;

/** 100 KiB de texto — o teto do `data:` URL inteiro, cabeçalho incluído. */
export const AVATAR_MAX_LENGTH = 102_400;

/** O que a interface aceita como avatar: as mesmas duas formas que a API aceita. */
export const ALLOWED_AVATAR_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

/**
 * `data:<mime>;base64,<payload>` — só os tipos raster, e o payload é do alfabeto base64.
 *
 * SVG é de fora de propósito: um SVG é um documento ativo e um `data:` URL é same-origin com
 * a página que o desenha. A regra é da API, mas repeti-la aqui é o que impede que a
 * interface envie algo que a API vai recusar.
 */
const DATA_URL_PATTERN = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/;

/** O nome de exibição normalizado: recortado, ou `null` quando não sobrou nada. */
export function normalizeDisplayName(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/** O nome de exibição é aceitável? 1 a 80 caracteres depois de recortado. */
export function isAllowedDisplayName(value: string): boolean {
  const normalized = normalizeDisplayName(value);
  return (
    normalized !== null &&
    normalized.length >= 1 &&
    normalized.length <= DISPLAY_NAME_MAX_LENGTH
  );
}

/** É um `https://` com host? */
export function isAllowedAvatarRemoteUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'https:' && parsed.hostname.length > 0;
}

/** É um `data:` URL de imagem raster dentro do teto? */
export function isAllowedAvatarDataUrl(value: string): boolean {
  if (value.length > AVATAR_MAX_LENGTH) return false;
  const match = DATA_URL_PATTERN.exec(value);
  if (match === null) return false;
  const payload = match[2] ?? '';
  const unpadded = payload.replace(/=+$/, '');
  return unpadded.length % 4 !== 1;
}

/** O avatar é aceitável — um `https://` ou um `data:` de imagem raster? */
export function isAllowedAvatar(value: string): boolean {
  return isAllowedAvatarRemoteUrl(value) || isAllowedAvatarDataUrl(value);
}

/**
 * O texto que o cabeçalho mostra quando não há nome escolhido.
 *
 * Não é uma string vazia e não é o e-mail: o e-mail é secundário, e um e-mail em vez de um
 * nome denuncia a conta em um lugar onde ela não precisa ser identificada.
 */
export const UNNAMED_ACCOUNT_FALLBACK = 'Aprendiz';
