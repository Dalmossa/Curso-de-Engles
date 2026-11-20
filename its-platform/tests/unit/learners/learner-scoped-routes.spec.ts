/**
 * A5b — the five learner-scoped routes all resolve the addressed learner first, and none of them
 * builds a body when that resolution refuses.
 *
 * The five operations live in four modules, so this is the file that keeps them one decision: every
 * handler/service passes `(subject, id)` — the token's `sub` and the path parameter, in that order —
 * to the one `LearnerScopeService`, and every value is produced only after that call resolves.
 * ADR-038 D3 removed the alternative shape by name (`if (pathId === tokenSubject)`), and the way
 * that removal survives contact with five handlers is that the handlers cannot answer without
 * asking.
 *
 * What is asserted here is *delegation and consequence*, not content: whether the payloads are
 * truthful is P1.10/P1.11's question and A5b's ratified scope leaves them the stubs they were. Each
 * route pins one member of its published body so that "the payload did not change" has an address.
 *
 * Under A7b, `GET .../profile` asks `withVisible` for the row **and the transaction** (ADR-045 D1)
 * so its reads run under the policy that decided the 404; the other routes keep their own ask shape.
 * The members it now derives are asserted in `tests/integration/learner-routes-bodies.spec.ts`;
 * what is pinned here is that the ask still happens first, with the subject first, and that no body
 * is built when it refuses.
 */

import { NotFoundException } from '@nestjs/common';
import type { QueryRunner } from 'typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { LearnerProfileRepository } from '../../../src/infrastructure/repositories/learner-profile.repository.js';
import type { UserIdentityRepository } from '../../../src/infrastructure/repositories/user-identity.repository.js';
import type { VisibleLearner } from '../../../src/infrastructure/repositories/learner.repository.js';
import { CurriculumService } from '../../../src/modules/curriculum/curriculum.service.js';
import { LearnerScopeService } from '../../../src/modules/learners/learner-scope.service.js';
import { LearnersService } from '../../../src/modules/learners/learners.service.js';
import { PlacementService } from '../../../src/modules/placement/placement.service.js';
import { PracticeService } from '../../../src/modules/practice/practice.service.js';
import type { DiagnosticRequestDto } from '../../../src/modules/placement/dto/diagnostic-request.dto.js';
import type { PracticeSubmissionDto } from '../../../src/modules/practice/dto/practice-submission.dto.js';

const SUBJECT = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const ADDRESSED = '9b7e4a01-8c4d-1e2f-3a4b-5c6d3f2a1c44';

const PACK_ID = 'pack_les_a2_airport_v1';
const ITEM_ID = 'grm_airport_immigration_questions_001';

const placementBody = { learner_id: ADDRESSED, mode: 'adaptive' } as DiagnosticRequestDto;
const practiceBody = {
  learner_id: ADDRESSED,
  pack_id: PACK_ID,
  responses: [{ item_id: ITEM_ID, response: 'B', response_time_ms: 900 }],
} as PracticeSubmissionDto;

/** The two ways a handler asks ADR-038 D3's question — load only, or load and then read (A7b). */
type Scope = Pick<LearnerScopeService, 'requireVisible' | 'withVisible'>;

/**
 * The profile's other collaborator, stubbed for the same reason the scope service is: what is under
 * test here is the ask, not the aggregate. An empty answer is the honest stub.
 */
const PROFILE_REPOSITORY = {
  read: () => Promise.resolve({ cefr: null, mastery: {}, fsrsStates: {} }),
} as unknown as LearnerProfileRepository;

/** The identity collaborator, stubbed: no account. */
const IDENTITY_REPOSITORY = {
  read: () => Promise.resolve(null),
  update: () => Promise.resolve(null),
} as unknown as UserIdentityRepository;

/**
 * Minimal DataSource/tx for constructing a real PracticeService whose grading path can succeed
 * without a database, while the scope ask remains the real decision under test.
 */
function mockTxForPractice(): unknown {
  const insertAttempt = { id: 'attempt-1' };
  const insertSession = { id: 'session-1', learner_id: ADDRESSED, started_at: new Date(), ended_at: null };
  const query = jest.fn().mockImplementation((sql: string) => {
    if (sql.includes('FROM packs')) {
      return Promise.resolve([{ id: PACK_ID, lesson_id: 'les_a2_airport', item_ids: [ITEM_ID] }]);
    }
    if (sql.includes('FROM items')) {
      return Promise.resolve([
        {
          id: ITEM_ID,
          item_type: 'contextual_selection',
          skill_ids: '{grammar.present_simple_airport}',
          domain_id: 'grammar',
          scoring: 'choice',
          stem: 'Stem',
          key: 'B',
          p_random: 0.25,
        },
      ]);
    }
    if (sql.includes('FROM sessions')) {
      return Promise.resolve([insertSession]);
    }
    if (sql.includes('INSERT INTO sessions')) {
      return Promise.resolve([insertSession]);
    }
    if (sql.includes('INSERT INTO practice_attempts')) {
      return Promise.resolve([insertAttempt]);
    }
    if (sql.includes('FROM learner_mastery')) {
      return Promise.resolve([]);
    }
    if (sql.includes('INSERT INTO learner_mastery')) {
      return Promise.resolve([]);
    }
    if (sql.includes('INSERT INTO item_responses')) {
      return Promise.resolve([]);
    }
    if (sql.includes('FROM fsrs_parameters')) {
      return Promise.resolve([
        {
          w_version: '4.5.0',
          w: [0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542],
          decay: 0.1542,
          factor: 0.9803,
        },
      ]);
    }
    if (sql.includes('FROM fsrs_states')) {
      return Promise.resolve([]);
    }
    if (sql.includes('INSERT INTO fsrs_states')) {
      return Promise.resolve([]);
    }
    if (sql.includes('ORDER BY fs.due_date')) {
      return Promise.resolve([]);
    }
    return Promise.resolve([]);
  });
  return { query };
}

const MOCK_DATA_SOURCE = {
  query: jest.fn().mockImplementation((sql: string, params?: unknown[]) =>
    (mockTxForPractice() as { query: (s: string, p?: unknown[]) => Promise<unknown[]> }).query(sql, params),
  ),
} as unknown as DataSource;

/** Minimal mock ConfigService for service construction */
const MOCK_CONFIG_SERVICE = {
  get: jest.fn().mockReturnValue('/home/dalmo/Documentos/Curso-de-Ingles/specs/curriculum-graph-spec.md'),
} as unknown as ConfigService;

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
    call: (scope) =>
      new LearnersService(
        scope as LearnerScopeService,
        PROFILE_REPOSITORY,
        IDENTITY_REPOSITORY,
      ).getProfile(SUBJECT, ADDRESSED),
    member: 'learner_id',
  },
  {
    name: 'GET /learners/{learner_id}/mastery',
    call: (scope) =>
      new LearnersService(
        scope as LearnerScopeService,
        PROFILE_REPOSITORY,
        IDENTITY_REPOSITORY,
      ).getMastery(SUBJECT, ADDRESSED),
    member: 'grammar',
  },
  {
    name: 'GET /learners/{learner_id}/next',
    call: (scope) =>
      new CurriculumService(
        scope as LearnerScopeService,
        MOCK_DATA_SOURCE,
        MOCK_CONFIG_SERVICE,
      ).getNextActivity(SUBJECT, ADDRESSED, {}),
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
    call: (scope) => {
      // Real PracticeService: it must resolve the addressed learner via withVisible before grading.
      const service = new PracticeService(
        scope as LearnerScopeService,
        {} as never,
        MOCK_DATA_SOURCE,
      );
      return service.submitPractice(SUBJECT, ADDRESSED, practiceBody) as Promise<Record<string, unknown>>;
    },
    member: 'pack_id',
  },
];

/** The transaction a runner-free stub hands to the work — what `withVisible` passes through. */
const TX = mockTxForPractice() as unknown as QueryRunner;

/** A scope service that records what it was asked and answers the way the real one would. */
function scope(visible: boolean): { service: Scope; asked: Array<[string, string]> } {
  const asked: Array<[string, string]> = [];

  /** The one rule both methods share: record the ask, then refuse or answer. */
  const ask = <T>(subject: string, learnerId: string, answer: () => T): T => {
    asked.push([subject, learnerId]);
    if (!visible) throw new NotFoundException('Learner not found');
    return answer();
  };

  const service: Scope = {
    requireVisible: (subject: string, learnerId: string) =>
      ask(subject, learnerId, () => Promise.resolve({ id: learnerId, created_at: new Date(0), last_active_at: null })),

    withVisible: <T>(
      subject: string,
      learnerId: string,
      work: (learner: VisibleLearner, tx: QueryRunner) => Promise<T>,
    ) =>
      ask(subject, learnerId, () =>
        work({ id: learnerId, created_at: new Date(0), last_active_at: null }, TX),
      ),
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
