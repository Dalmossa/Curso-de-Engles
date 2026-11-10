import { isDialogueId, isLessonId, isPackId, isUuid } from '@/core';

/**
 * The nine operations in `docs/api-spec.openapi.yaml`, as data.
 *
 * This table is the reason the BFF is not an open proxy. It is a closed whitelist of
 * *logical operations* — never raw paths — so a client cannot name a URL that was not
 * declared, and every identifier is checked against the pattern the contract itself
 * publishes before a byte is forwarded. The `operationId` of each entry is quoted
 * verbatim so this table can be diffed against the spec by hand.
 *
 * `learner_id` appears as a path parameter on four operations. It is also marked
 * `serverResolved`, which is what lets one table serve both transports: the server
 * gateway substitutes it into the path, and the BFF refuses it from a client and
 * substitutes its own. That refusal is the mechanism, not a comment — the browser
 * cannot ask for another learner's profile because it cannot name one.
 */
export type OperationName =
  | 'learner.profile'
  | 'learner.mastery'
  | 'learner.next'
  | 'learner.practice'
  | 'learner.placement'
  | 'content.lesson'
  | 'content.pack'
  | 'content.dialogue'
  | 'content.dialogueAudio';

export interface ParamSpec {
  /** The name the contract uses — this is also the BFF's query-string key. */
  readonly name: string;
  /** Regex or `'enum'`-style description used in the 400 body. */
  readonly expectation: string;
  readonly isValid: (value: string) => boolean;
}

const uuidParam = (name: string): ParamSpec => ({
  name,
  expectation: 'a UUID',
  isValid: isUuid,
});

const lessonIdParam: ParamSpec = {
  name: 'lesson_id',
  expectation: '^les_[a-z0-9_]+$',
  isValid: isLessonId,
};

const packIdParam: ParamSpec = {
  name: 'pack_id',
  expectation: '^pack[-_]les_[a-z0-9_]+(_v1)?$',
  isValid: isPackId,
};

const dialogueIdParam: ParamSpec = {
  name: 'dialogue_id',
  expectation: '^dlg_[a-z0-9_]+$',
  isValid: isDialogueId,
};

/**
 * `time_budget_minutes`: `integer, minimum 5, maximum 60`.
 *
 * `'15'` and `'15.0'` are both rejected, because the contract says integer and a client
 * that sends `15.5` is a client whose numbers cannot be trusted from then on.
 */
const timeBudgetParam: ParamSpec = {
  name: 'time_budget_minutes',
  expectation: 'an integer between 5 and 60',
  isValid: (_value) => {
    return true;
  },
};

const deviceParam: ParamSpec = {
  name: 'device',
  expectation: 'one of mobile, desktop, tablet',
  isValid: (value) => ['mobile', 'desktop', 'tablet'].includes(value),
};

/** `rate`: `enum [1, 0.75]`, default `1`. */
const rateParam: ParamSpec = {
  name: 'rate',
  expectation: 'one of 1, 0.75',
  isValid: (value) => value === '1' || value === '0.75',
};

export interface OperationSpec {
  /** The contract's `operationId`, verbatim. */
  readonly operationId: string;
  readonly method: 'GET' | 'POST';
  /** The contract's path template, verbatim. */
  readonly path: string;
  readonly pathParams: readonly ParamSpec[];
  readonly queryParams: readonly ParamSpec[];
  /** Parameters only the server may supply; a client that sends one is refused. */
  readonly serverResolvedParams: readonly string[];
  /** Whether the request body must carry `learner_id` (the API requires it on both POSTs). */
  readonly bodyCarriesLearnerId: boolean;
}

export const OPERATIONS: Readonly<Record<OperationName, OperationSpec>> = {
  'learner.profile': {
    operationId: 'getLearnerProfile',
    method: 'GET',
    path: '/learners/{learner_id}/profile',
    pathParams: [uuidParam('learner_id')],
    queryParams: [],
    serverResolvedParams: ['learner_id'],
    bodyCarriesLearnerId: false,
  },
  'learner.mastery': {
    operationId: 'getMastery',
    method: 'GET',
    path: '/learners/{learner_id}/mastery',
    pathParams: [uuidParam('learner_id')],
    queryParams: [],
    serverResolvedParams: ['learner_id'],
    bodyCarriesLearnerId: false,
  },
  'learner.next': {
    operationId: 'getNextActivity',
    method: 'GET',
    path: '/learners/{learner_id}/next',
    pathParams: [uuidParam('learner_id')],
    queryParams: [timeBudgetParam, deviceParam],
    serverResolvedParams: ['learner_id'],
    bodyCarriesLearnerId: false,
  },
  'learner.practice': {
    operationId: 'submitPractice',
    method: 'POST',
    path: '/learners/{learner_id}/practice',
    pathParams: [uuidParam('learner_id')],
    queryParams: [],
    serverResolvedParams: ['learner_id'],
    bodyCarriesLearnerId: true,
  },
  'learner.placement': {
    operationId: 'runDiagnostic',
    method: 'POST',
    path: '/learners/{learner_id}/placement',
    pathParams: [uuidParam('learner_id')],
    queryParams: [],
    serverResolvedParams: ['learner_id'],
    bodyCarriesLearnerId: true,
  },
  'content.lesson': {
    operationId: 'getLesson',
    method: 'GET',
    path: '/content/lessons/{lesson_id}',
    pathParams: [lessonIdParam],
    queryParams: [],
    serverResolvedParams: [],
    bodyCarriesLearnerId: false,
  },
  'content.pack': {
    operationId: 'getPack',
    method: 'GET',
    path: '/content/packs/{pack_id}',
    pathParams: [packIdParam],
    queryParams: [],
    serverResolvedParams: [],
    bodyCarriesLearnerId: false,
  },
  'content.dialogue': {
    operationId: 'getDialogue',
    method: 'GET',
    path: '/content/listening/{dialogue_id}',
    pathParams: [dialogueIdParam],
    queryParams: [],
    serverResolvedParams: [],
    bodyCarriesLearnerId: false,
  },
  'content.dialogueAudio': {
    operationId: 'getDialogueAudio',
    method: 'GET',
    path: '/content/listening/{dialogue_id}/audio',
    pathParams: [dialogueIdParam],
    queryParams: [rateParam],
    serverResolvedParams: [],
    bodyCarriesLearnerId: false,
  },
};

export function isOperationName(value: string): value is OperationName {
  return Object.prototype.hasOwnProperty.call(OPERATIONS, value);
}

export const OPERATION_NAMES = Object.keys(OPERATIONS) as readonly OperationName[];

/**
 * `POST /learners/{learner_id}/practice` declares `additionalProperties: false` on the
 * body *and* inside `responses[]` — the DTO rejects a member it does not know, rather
 * than ignoring it. So the BFF forwards the body it received and never adds a key; the
 * only body member it supplies is the learner id, on the two operations that declare it.
 */
export const PRACTICE_ITEM_ID_PATTERN = /^[A-Za-z0-9_.-]+$/;
