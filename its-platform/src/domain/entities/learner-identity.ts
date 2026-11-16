/**
 * Domain entity — the learner's **identity**: the `users` row behind the name and the avatar.
 *
 * Pure TypeScript, no framework imports (ADR-014). The rules live here rather than in the DTO
 * because they are rules about *what an identity may be*, not about *how a request is shaped*:
 * the DTO transcribes them, and the service and the tests read them from the same place. A rule
 * that lives only in a decorator is a rule no other caller can consult — and the avatar rule is
 * a **safety** rule, not a formatting rule, so it must have exactly one owner.
 *
 * **What an avatar may be.** Two forms, and nothing else:
 *
 * 1. an **`https://` URL** — the picture lives somewhere else and the platform stores the address;
 * 2. a **`data:` URL** of a raster image — `image/png`, `image/jpeg`, `image/webp` or `image/gif`,
 *    base64-encoded, up to 100 KiB of text.
 *
 * Everything else is refused, and the refusals are the point rather than the exceptions:
 *
 * - **`http://`** would put the picture on a channel the page cannot verify, and the browser would
 *   block it as mixed content on the HTTPS deployment anyway — a refusal the user would read as a
 *   broken avatar rather than as a rule.
 * - **`data:image/svg+xml`** is an *active* document: an SVG can carry script, and a data URL is
 *   same-origin with the page that renders it. The raster formats above cannot.
 * - **`data:text/html`**, **`javascript:`** and every other scheme are not pictures at all.
 *
 * **The 100 KiB ceiling.** `users.avatar_url` is a `text` column, so the database will accept a
 * megabyte of base64 — and a megabyte of base64 is a megabyte of every profile read, every export
 * and every header render, paid for by a user who chose a small picture. The ceiling is therefore
 * part of the rule, not a property of the column: the whole data URL (header included) may not
 * exceed 100 KiB of text, which also bounds what a request may carry.
 *
 * **The name.** 1 to 80 characters after trimming. The lower bound is "a name is not empty", the
 * upper bound is "a name is a label, not a paragraph" — and it is also shorter than the column
 * (`varchar(255)`), so the rule and the storage agree without the database ever being the thing
 * that says no.
 */

export const DISPLAY_NAME_MIN_LENGTH = 1;

/** 80 characters — a label, not a paragraph. Shorter than `users.display_name` (`varchar(255)`). */
export const DISPLAY_NAME_MAX_LENGTH = 80;

/** 100 KiB of text — the ceiling for a data-URL avatar, header included. */
export const AVATAR_MAX_LENGTH = 102_400;

/** The raster formats an avatar may be. SVG is deliberately absent — see this file's header. */
export const ALLOWED_AVATAR_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

export type AllowedAvatarMimeType = (typeof ALLOWED_AVATAR_MIME_TYPES)[number];

/**
 * `data:<mime>;base64,<payload>` — the payload is restricted to the base64 alphabet, and the
 * padding is the only `=` the grammar allows (and only at the end).
 */
const DATA_URL_PATTERN = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/;

/**
 * The identity a learner presents: the display name, the account's e-mail and the avatar.
 *
 * Every member admits `null`, and that is not a convenience — it is the honest answer for a
 * learner whose row has never been filled in. A name that has not been chosen is not an empty
 * string, and an avatar that was never set is not a broken image.
 */
export interface LearnerIdentity {
  readonly displayName: string | null;
  readonly email: string | null;
  readonly avatarUrl: string | null;
}

/** The two members `PATCH /learners/{learner_id}/profile` may change, and only these two. */
export interface LearnerIdentityPatch {
  /** `undefined` — leave as it is; `null` — clear it; a string — set it. */
  readonly displayName?: string | null;
  /** `undefined` — leave as it is; `null` — clear it; a string — set it. */
  readonly avatarUrl?: string | null;
}

/**
 * The trimmed display name, or `null` when there is nothing to store.
 *
 * Trimming is part of the rule rather than a courtesy: a name of spaces is not a name, and the
 * alternative — storing it and letting every screen decide whether to trim it — is one decision
 * repeated by every reader.
 */
export function normalizeDisplayName(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/** Is this display name one the platform accepts? */
export function isAllowedDisplayName(value: string): boolean {
  const normalized = normalizeDisplayName(value);
  return (
    normalized !== null &&
    normalized.length >= DISPLAY_NAME_MIN_LENGTH &&
    normalized.length <= DISPLAY_NAME_MAX_LENGTH
  );
}

/** Is this a data URL of an allowed raster image, within the ceiling? */
export function isAllowedAvatarDataUrl(value: string): boolean {
  if (value.length > AVATAR_MAX_LENGTH) return false;

  const match = DATA_URL_PATTERN.exec(value);
  if (match === null) return false;

  const payload = match[2] ?? '';
  // Base64 is four characters per three bytes: a payload that is not a multiple of four (once
  // the padding is counted) is not a base64 payload, and `Buffer.from` would silently drop the
  // remainder rather than refuse it.
  const unpadded = payload.replace(/=+$/, '');
  return unpadded.length % 4 !== 1;
}

/** Is this an `https://` URL? */
export function isAllowedAvatarRemoteUrl(value: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === 'https:' && parsed.hostname.length > 0;
}

/**
 * Is this an avatar the platform accepts — an `https://` URL or a data URL of an allowed raster
 * image?
 */
export function isAllowedAvatar(value: string): boolean {
  return isAllowedAvatarRemoteUrl(value) || isAllowedAvatarDataUrl(value);
}
