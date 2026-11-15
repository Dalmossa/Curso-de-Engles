/**
 * A política de senha nova, em lógica pura.
 *
 * As duas regras são as mesmas do contrato publicado (`docs/api-spec.openapi.yaml` →
 * `ResetPasswordRequest.newPassword`): mínimo de 8 caracteres e máximo de 72 — 72 é o
 * ponto em que o **bcrypt** trunca a senha, e uma senha truncada é uma senha que o
 * usuário não digitou.
 *
 * A confirmação é exigida porque um erro de digitação em um campo de senha não tem
 * como ser detectado por quem não consegue lê-la: sem a confirmação, a conta fica com uma
 * senha que o usuário nunca viu.
 *
 * Esta função não decide *como* dizer o problema — `presentation/lib/copy.ts` faz isso.
 * Aqui só há o motivo, sem texto de interface.
 */

/** O mesmo mínimo que o contrato publica. */
export const MIN_PASSWORD_LENGTH = 8;

/** O mesmo teto que o contrato publica — e o limite do bcrypt. */
export const MAX_PASSWORD_LENGTH = 72;

/** Os motivos pelos quais uma senha nova é recusada. */
export type PasswordProblem = 'too_short' | 'too_long' | 'mismatch';

/** Os motivos pelos quais o **tamanho** de uma senha é recusado. */
export type PasswordLengthProblem = 'too_short' | 'too_long';

export type PasswordValidation =
  | { readonly ok: true }
  | { readonly ok: false; readonly problem: PasswordProblem };

export type PasswordLengthValidation =
  | { readonly ok: true }
  | { readonly ok: false; readonly problem: PasswordLengthProblem };

/**
 * Checks only the length of a password.
 *
 * The server-side use case needs this one: the confirmation field never leaves the
 * browser, so the server can check the length but not the match.
 */
export function validatePasswordLength(password: string): PasswordLengthValidation {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, problem: 'too_short' };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, problem: 'too_long' };
  }
  return { ok: true };
}

/**
 * Checks a new password against the policy.
 *
 * The order matters: the length is checked before the confirmation, because a password
 * that is too short is wrong in itself — telling the user that the two fields differ
 * would hide the real problem behind a second one.
 */
export function validateNewPassword(password: string, confirmation: string): PasswordValidation {
  const length = validatePasswordLength(password);
  if (!length.ok) {
    return { ok: false, problem: length.problem };
  }
  if (password !== confirmation) {
    return { ok: false, problem: 'mismatch' };
  }
  return { ok: true };
}

/**
 * A conservative e-mail check — enough to refuse an obviously malformed address before
 * it leaves the server.
 *
 * The API is the authority: it rejects a malformed address with `400`, and this check
 * exists so the round trip is not spent on an address that could never be accepted. It
 * is intentionally narrower than the RFC: the goal is to catch a missing `@` or a
 * missing domain, not to reimplement a mailbox validator.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function isEmailCandidate(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 320) return false;
  return EMAIL_PATTERN.test(trimmed);
}
