import type { AccountIdentity, AccountProfilePatch, AccountRepository } from '@/core';
import { DomainError, isAllowedAvatar, isAllowedDisplayName, normalizeDisplayName } from '@/core';

/**
 * Use case: the learner corrects their own display name and avatar.
 *
 * **The validation happens here, and not only at the API.** The platform is the authority —
 * it refuses an SVG, um `http://` e um nome de 81 caracteres, e a interface não deve
 * descobrir isso com uma mensagem de `400` depois de o aluno ter preenchido o formulário
 * inteiro. This case refuses the same values first, with the same rules, so the learner
 * gets the correction while the answer is still in front of them.
 *
 * **The rules are duplicated on purpose.** The backend owns them in
 * `src/domain/entities/learner-identity.ts` and this file owns a copy in
 * `src/core/entities/account.ts`. Two copies of one rule is a smell in general — but these
 * are two *deployments* of the same platform, each with its own core, and the interface
 * needs the rule before it can talk to the API. The API remains the authority: whatever
 * this case accepts, the API decides whether it is accepted; this case only refuses the
 * values it knows are refused.
 *
 * **`null` survives the trip.** "Clear the avatar" is a legitimate instruction, and it is
 * not the same as "leave the avatar as it is" — so `null` is passed through and `undefined`
 * is not sent at all.
 */
export class UpdateAccountProfile {
  constructor(private readonly accounts: AccountRepository) {}

  async execute(learnerId: string, patch: AccountProfilePatch): Promise<AccountIdentity> {
    const prepared: AccountProfilePatch = {
      ...(patch.displayName === undefined ? {} : { displayName: this.normalizeName(patch.displayName) }),
      ...(patch.avatarUrl === undefined ? {} : { avatarUrl: this.normalizeAvatar(patch.avatarUrl) }),
    };

    return this.accounts.updateProfile(learnerId, prepared);
  }

  /**
   * The name, trimmed. `null` is a legitimate value — it clears the name — and a name of
   * only spaces is *not* a name: it is an instruction to clear one, and saying so here is
   * clearer than saying it in a validation message.
   */
  private normalizeName(value: string | null): string | null {
    if (value === null) return null;

    const normalized = normalizeDisplayName(value);
    if (normalized === null) return null;

    if (!isAllowedDisplayName(normalized)) {
      throw new DomainError({
        kind: 'invalid_input',
        status: 400,
        title: 'Nome inválido',
        detail: 'O nome deve ter entre 1 e 80 caracteres.',
        problemType: null,
        requestId: null,
        retryAfterSeconds: null,
      });
    }

    return normalized;
  }

  /** The avatar, unchanged — except that an unacceptable one never leaves here. */
  private normalizeAvatar(value: string | null): string | null {
    if (value === null) return null;

    if (!isAllowedAvatar(value)) {
      throw new DomainError({
        kind: 'invalid_input',
        status: 400,
        title: 'Avatar inválido',
        detail:
          'A foto deve ser um endereço https ou uma imagem PNG, JPEG, WEBP ou GIF de até 100 KiB.',
        problemType: null,
        requestId: null,
        retryAfterSeconds: null,
      });
    }

    return value;
  }
}
