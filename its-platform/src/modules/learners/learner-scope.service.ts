/**
 * A5b — "the addressed learner must be visible to the caller", in one place (ADR-038 D3).
 *
 * Five routes address a learner by path parameter (`GET …/profile`, `GET …/mastery`,
 * `GET …/next`, `POST …/placement`, `POST …/practice`), and before this file each of them answered
 * for *any* id at all, because none of them read the database. Implementing the rule once — here —
 * is what keeps it from being four implementations of the same sentence, and it is why ADR-038 D3
 * can say the 404 *"não precisa ser lembrado em cada controller"*: a handler that wants the
 * addressed learner asks for it, and a handler that does not ask cannot serve one.
 *
 * The two arguments are not interchangeable, and swapping them is the defect this class exists to
 * make impossible to write by accident:
 *
 * | argument | source | what it decides |
 * |---|---|---|
 * | `subject` | the token's `sub` (ADR-038 D7) | the session context — who the caller **is** |
 * | `learnerId` | the path parameter | the object — what the caller **addressed** |
 *
 * They never meet in a comparison. `subject` goes to `PgSessionContext`, whose only job is the
 * learner context this transaction runs under (ADR-026 §1); `learnerId` goes to the query as `$1`.
 * The policy intersects the two, and the intersection is empty whenever the addressed row belongs
 * to someone else — whatever the id happens to be, and whether or not it exists.
 *
 * The refusal is a `NotFoundException`, i.e. a 404 with the same body for *"no such learner"* and
 * *"another learner's learner"*. `ProblemExceptionFilter` renders it; this file builds no body of
 * its own (P1.17). One message covers both cases on purpose: an answer that distinguishes them is
 * the oracle that lets a caller enumerate the platform's learners one uuid at a time.
 */

import { Injectable, NotFoundException } from '@nestjs/common';

import { PgSessionContext } from '../../infrastructure/persistence/pg-session-context.js';
import type { VisibleLearner } from '../../infrastructure/repositories/learner.repository.js';
import { LearnerRepository } from '../../infrastructure/repositories/learner.repository.js';

/** The one message both cases produce — see the header. */
const LEARNER_NOT_FOUND = 'Learner not found';

@Injectable()
export class LearnerScopeService {
  constructor(
    private readonly sessionContext: PgSessionContext,
    private readonly learners: LearnerRepository,
  ) {}

  /**
   * Load the addressed learner under the caller's own context, or refuse with the 404 of D3.
   *
   * The transaction is `PgSessionContext`'s (ADR-026 §3): `SET LOCAL` is a no-op outside a
   * transaction, so the writer must be the thing that opened it, and the read must happen inside.
   * Nothing is written, so the commit is empty — the transaction exists to bound the GUC, not to
   * change data.
   */
  async requireVisible(subject: string, learnerId: string): Promise<VisibleLearner> {
    const learner = await this.sessionContext.withLearner(subject, (tx) =>
      this.learners.findById(learnerId, tx),
    );

    if (learner === null) {
      throw new NotFoundException(LEARNER_NOT_FOUND);
    }

    return learner;
  }
}
