/**
 * A5b — the five learner-scoped routes all resolve the addressed learner first, and none of them
 * builds a body when that resolution refuses.
 *
 * The five operations live in four modules, so this is the file that keeps them one decision: every
 * handler passes `(subject, id)` — the token's `sub` and the path parameter, in that order — to the
 * one `LearnerScopeService`, and every handler's value is produced only after that call resolves.
 * ADR-038 D3 removed the alternative shape by name (`if (pathId === tokenSubject)`), and the way
 * that removal survives contact with five handlers is that the handlers cannot answer without
 * asking.
 *
 * What is asserted here is *delegation and consequence*, not content: whether the payloads are
 * truthful is P1.10/P1.11's question and A5b's ratified scope leaves them the stubs they were. Each
 * route pins one member of its published body so that "the payload did not change" has an address.
 *
 * The scope service is a stub — it is the decision under test. That the real one loads the row from
 * PostgreSQL under the caller's own RLS context is `tests/integration/learner-scope-rls.spec.ts`.
 */

import { NotFoundException } from '@nestjs/common';

import { CurriculumService } from '../../../src/modules/curriculum/curriculum.service.js';
import { LearnerScopeService } from '../../../src/modules/learners/learner-scope.service.js';
import { LearnersService } from '../../../src/modules/learners/learners.service.js';
import { PlacementService } from '../../../src/modules/placement/placement.service.js';
import { PracticeService } from '../../../src/modules/practice/practice.service.js';
import type { DiagnosticRequestDto } from '../../../src/modules/placement/dto/diagnostic-request.dto.js';
import type { PracticeSubmissionDto } from '../../../src/modules/practice/dto/practice-submission.dto.js';

const SUBJECT = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const ADDRESSED = '9b7e4a01-8c4d-1e2f-3a4b-5c6d3f2a1c44';

const placementBody = { learner_id: ADDRESSED, mode: 'adaptive' } as DiagnosticRequestDto;
const practiceBody = {
  learner_id: ADDRESSED,
  pack_id: 'pack_les_a2_airport_v1',
  responses: [{ item_id: 'voc_airport_001', response: 'gate', response_time_ms: 900 }],
} as PracticeSubmissionDto;

type Scope = Pick<LearnerScopeService, 'requireVisible'>;

interface Route {
  readonly name: string;
  /** The handler, with the scope service it was built with. */
  readonly call: (scope: Scope) => Promise<Record<string, unknown>>;
  /** One member the published body carries — the address of "the payload is still the stub's". */
  readonly member: string;
}

const ROUTES: readonly Route[] = [
  {
    name: 'GET /learners/{learner_id}/profile',
    call: (scope) => new LearnersService(scope as LearnerScopeService).getProfile(SUBJECT, ADDRESSED),
    member: 'learner_id',
  },
  {
    name: 'GET /learners/{learner_id}/mastery',
    call: (scope) => new LearnersService(scope as LearnerScopeService).getMastery(SUBJECT, ADDRESSED),
    member: 'grammar',
  },
  {
    name: 'GET /learners/{learner_id}/next',
    call: (scope) =>
      new CurriculumService(scope as LearnerScopeService).getNextActivity(SUBJECT, ADDRESSED, {}),
    member: 'activity_id',
  },
  {
    name: 'POST /learners/{learner_id}/placement',
    call: (scope) =>
      new PlacementService(scope as LearnerScopeService).runDiagnostic(
        SUBJECT,
        ADDRESSED,
        placementBody,
      ),
    member: 'start_node',
  },
  {
    name: 'POST /learners/{learner_id}/practice',
    call: (scope) =>
      new PracticeService(scope as LearnerScopeService).submitPractice(
        SUBJECT,
        ADDRESSED,
        practiceBody,
      ),
    member: 'pack_id',
  },
];

/** A scope service that records what it was asked and answers the way the real one would. */
function scope(visible: boolean): { service: Scope; asked: Array<[string, string]> } {
  const asked: Array<[string, string]> = [];
  const service: Scope = {
    requireVisible: (subject: string, learnerId: string) => {
      asked.push([subject, learnerId]);
      if (!visible) return Promise.reject(new NotFoundException('Learner not found'));
      return Promise.resolve({ id: learnerId });
    },
  };
  return { service, asked };
}

describe('A5b — five routes, one question asked before any of them answers', () => {
  for (const route of ROUTES) {
    it(`${route.name} asks with the subject first and the addressed id second`, async () => {
      const stub = scope(true);

      await route.call(stub.service);

      expect(stub.asked).toEqual([[SUBJECT, ADDRESSED]]);
    });

    it(`${route.name} produces no body when the addressed learner is not visible`, async () => {
      const stub = scope(false);

      // The refusal is the 404 of ADR-038 D3, not a 403 and not an empty body: nothing below the
      // call has run, so there is no payload to leak.
      await expect(route.call(stub.service)).rejects.toBeInstanceOf(NotFoundException);
      expect(stub.asked).toHaveLength(1);
    });

    it(`${route.name} still answers the payload it published (${route.member})`, async () => {
      const stub = scope(true);

      const body = await route.call(stub.service);

      expect(Object.keys(body)).toContain(route.member);
    });
  }
});
