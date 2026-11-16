import type { AccountIdentity, AccountRepository } from '@/core';

/**
 * Use case: reads the learner's own identity.
 *
 * Nothing is decided here — the repository already knows how to read it, and the one thing
 * this case *does* add is the guarantee that the answer is an identity and not a profile:
 * the header needs a name, a picture and a band, and it must not have to read the whole
 * learning portfolio to get them.
 *
 * The learner id arrives as an argument rather than being resolved inside: the composition
 * root resolves it once, server-side, and the browser never names a learner.
 */
export class GetAccountIdentity {
  constructor(private readonly accounts: AccountRepository) {}

  async execute(learnerId: string): Promise<AccountIdentity> {
    return this.accounts.getIdentity(learnerId);
  }
}
