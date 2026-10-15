/**
 * A5b — `LearnerScopeService`: the addressed learner, or the 404 ADR-038 D3 fixes.
 *
 * This is the smallest file in the change and it carries the largest claim: *the 404 is a
 * consequence of the policy, never of a comparison*. Everything the claim needs is observable here,
 * because the two arguments have different destinations and a swap is visible without a database:
 *
 * | what | where it must go | what a swap would produce |
 * |---|---|---|
 * | `subject` (token `sub`, D7) | the GUC, via `withLearner` | the caller's context becomes the object it addressed — every read succeeds |
 * | `learnerId` (path parameter) | the query's `$1` | the query filters by the caller's own id — every read returns the caller's own row |
 *
 * Both failure modes are silent in production (a 200 where a 404 belonged, with somebody's data),
 * which is exactly why they are asserted here as **position**, not as presence: a stub that receives
 * two string arguments cannot tell them apart, so each case asserts what the *other* one did not
 * receive.
 *
 * The `PgSessionContext` and the repository are stubs on purpose. What this file asserts is the
 * decision this class makes; that the load really happens through a transaction whose GUC the
 * database honours is asserted against a real connection in
 * `tests/integration/learner-scope-rls.spec.ts`.
 */

import { NotFoundException } from '@nestjs/common';
import type { QueryRunner } from 'typeorm';

import { LearnerScopeService } from '../../../src/modules/learners/learner-scope.service.js';
import { LearnerRepository } from '../../../src/infrastructure/repositories/learner.repository.js';
import { PgSessionContext } from '../../../src/infrastructure/persistence/pg-session-context.js';

/** The token's `sub` — who the caller is (ADR-038 D7). Nothing here ever compares it to `ADDRESSED`. */
const SUBJECT = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
/** The path parameter — what the caller addressed. A different learner, in the case that matters. */
const ADDRESSED = '9b7e4a01-8c4d-1e2f-3a4b-5c6d3f2a1c44';

interface Harness {
  service: LearnerScopeService;
  /** Every `learnerId` handed to the GUC, in order. */
  gucContexts: string[];
  /** Every `learnerId` handed to the query, in order. */
  queried: string[];
  /** Whether the query ran through the transaction the context opened. */
  throughTransaction: boolean[];
}

function harness(visible: boolean): Harness {
  const gucContexts: string[] = [];
  const queried: string[] = [];
  const throughTransaction: boolean[] = [];

  const tx = { marker: 'tx' } as unknown as QueryRunner;

  const sessionContext = {
    withLearner: <T>(learnerId: string, work: (runner: QueryRunner) => Promise<T>): Promise<T> => {
      gucContexts.push(learnerId);
      return work(tx);
    },
  } as unknown as PgSessionContext;

  const repository = {
    findById: (learnerId: string, runner?: QueryRunner): Promise<{ id: string } | null> => {
      queried.push(learnerId);
      throughTransaction.push(runner === tx);
      return Promise.resolve(visible ? { id: learnerId } : null);
    },
  } as unknown as LearnerRepository;

  return {
    service: new LearnerScopeService(sessionContext, repository),
    gucContexts,
    queried,
    throughTransaction,
  };
}

describe('A5b — `LearnerScopeService.requireVisible`', () => {
  it('puts the token subject in the session context and the addressed id in the query', async () => {
    const h = harness(true);

    await h.service.requireVisible(SUBJECT, ADDRESSED);

    expect(h.gucContexts).toEqual([SUBJECT]);
    expect(h.queried).toEqual([ADDRESSED]);
  });

  it('never swaps them — neither argument reaches the other destination', async () => {
    const h = harness(true);

    await h.service.requireVisible(SUBJECT, ADDRESSED);

    // The negative control for the two silent failures named in the header. Without these the first
    // case still passes when the arguments are swapped, because both are strings.
    expect(h.gucContexts).not.toContain(ADDRESSED);
    expect(h.queried).not.toContain(SUBJECT);
  });

  it('reads inside the transaction the session context opened, never outside it', async () => {
    const h = harness(true);

    await h.service.requireVisible(SUBJECT, ADDRESSED);

    expect(h.throughTransaction).toEqual([true]);
  });

  it('answers 404 — not 403 — when the addressed learner is not visible', async () => {
    const h = harness(false);

    await expect(h.service.requireVisible(SUBJECT, ADDRESSED)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('uses one message for "no such learner" and "another learner\'s learner"', async () => {
    const h = harness(false);

    const refusal = await h.service.requireVisible(SUBJECT, ADDRESSED).catch((e: unknown) => e);

    // The occurrence carries a single message, so the response `detail` is the same either way: the
    // caller cannot use this route to learn whether an id exists (CONSTITUTION.md §4.4).
    expect((refusal as NotFoundException).message).toBe('Learner not found');
    expect((refusal as NotFoundException).getStatus()).toBe(404);
  });

  it('opens one context per request, not one per call site', async () => {
    const h = harness(true);

    await h.service.requireVisible(SUBJECT, ADDRESSED);

    expect(h.gucContexts).toHaveLength(1);
    expect(h.queried).toHaveLength(1);
  });

  it('returns the loaded row when the policy returns one', async () => {
    const h = harness(true);

    await expect(h.service.requireVisible(SUBJECT, ADDRESSED)).resolves.toEqual({ id: ADDRESSED });
  });
});

/**
 * A7b — the same load, with the work that needs it.
 *
 * `GET …/profile` reads four more tables *after* the row is loaded (ADR-045 D1), and those reads have
 * one obligation in common: they must run under the same learner context, in the same transaction,
 * or the policy that decided the 404 does not apply to them. `withVisible` is that shape, and
 * `requireVisible` is its degenerate case — so the 404 exists once, not once per route that needs the
 * row.
 */
describe('A7b — `LearnerScopeService.withVisible`', () => {
  it('hands the loaded row and the transaction to the work, in the context it opened', async () => {
    const h = harness(true);
    const seen: unknown[][] = [];

    const answer = await h.service.withVisible(SUBJECT, ADDRESSED, async (learner, tx) => {
      seen.push([learner, tx]);
      return 'the work ran';
    });

    expect(answer).toBe('the work ran');
    // The row and the runner, in that order — the runner is what every subsequent read must use.
    expect(seen).toEqual([[{ id: ADDRESSED }, { marker: 'tx' }]]);
    expect(h.gucContexts).toEqual([SUBJECT]);
    expect(h.queried).toEqual([ADDRESSED]);
    expect(h.throughTransaction).toEqual([true]);
  });

  it('does not run the work when the addressed learner is not visible', async () => {
    const h = harness(false);
    const ran: string[] = [];

    await expect(
      h.service.withVisible(SUBJECT, ADDRESSED, async () => {
        ran.push('ran');
        return null;
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    // The refusal is decided before the work, so an aggregate built inside it cannot be half-built,
    // and nothing below the load has observed a row the caller cannot see.
    expect(ran).toEqual([]);
  });

  it('refuses with the same 404 `requireVisible` gives — one message, one status', async () => {
    const h = harness(false);

    const refusal = await h.service
      .withVisible(SUBJECT, ADDRESSED, async () => null)
      .catch((error: unknown) => error);

    // Same instance of the rule, so the response `detail` cannot drift between the routes that load
    // and the routes that load and then read.
    expect((refusal as NotFoundException).getStatus()).toBe(404);
    expect((refusal as NotFoundException).message).toBe('Learner not found');
  });
});
