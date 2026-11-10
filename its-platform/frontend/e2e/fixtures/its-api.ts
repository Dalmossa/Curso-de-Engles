/**
 * The ITS API as a fixture: the DTOs `docs/api-spec.openapi.yaml` declares, verbatim in
 * snake_case, together with the expectations the smoke spec derives from them.
 *
 * Both live in one module on purpose. `KEYS` is the *only* place an answer key exists,
 * and `PACK` — the payload the browser is allowed to receive before a submission — is
 * built from `ITEMS` without it (ADR-044). A fixture set that kept a second copy of the
 * key on the spec side could drift from the one the fake API scores with, and the drift
 * would look exactly like a product defect.
 */
import type { components } from '@/infrastructure/api/generated/api-types';

type Schemas = components['schemas'];

export type LearnerProfileDto = Schemas['LearnerProfile'];
export type NextActivityDto = Schemas['NextActivity'];
export type LessonContentDto = Schemas['LessonContent'];
export type PackContentDto = Schemas['PackContent'];
export type PracticeResultDto = Schemas['PracticeResult'];
export type PracticeSubmissionDto = Schemas['PracticeSubmission'];

export const LEARNER_ID_PATTERN = /^[0-9a-fA-F-]{36}$/;

export const LESSON_ID = 'les_a2_greetings';
/** 1 of the 122 lessons declares no `DADOS PARA O LEARNER MODEL` block. */
export const RESTRICTED_LESSON_ID = 'les_a2_it_internet_history';
export const PACK_ID = 'pack_les_a2_greetings_v1';

export interface FixtureItem {
  readonly item_id: string;
  readonly item_type: PackContentDto['items'][number]['item_type'];
  readonly skill: PackContentDto['items'][number]['skill'];
  readonly domain: string;
  readonly prompt: string;
  readonly scoring: PackContentDto['items'][number]['scoring'];
  readonly options: readonly {
    readonly letter: string;
    readonly text: string;
    readonly br_pt_form?: string;
  }[];
  /** What `POST /practice` scores against. Never published on `PACK`. */
  readonly key: string;
}

const GRAMMAR_ITEM: FixtureItem = {
  item_id: 'vocab.meeting.standup_timebox',
  item_type: 'gap_fill',
  skill: 'grammar',
  domain: 'verb_patterns',
  prompt: 'Choose the sentence that is correct in standard English.',
  scoring: 'choice',
  options: [
    { letter: 'A', text: 'I am agree with you.' },
    { letter: 'B', text: 'I agree with you.' },
    { letter: 'C', text: 'I agreeing with you.' },
  ],
  key: 'B',
};

const VOCAB_ITEM: FixtureItem = {
  item_id: 'voc_www_vs_internet_001',
  item_type: 'definition_match',
  skill: 'vocab',
  domain: 'it_workplace',
  prompt: 'Which term means "a fault in the software"?',
  scoring: 'choice',
  // A gloss on *every* option: the member is only published when it cannot single out
  // the key (ADR-044 D6(b)), so the pack is a legal payload with the glosses present.
  options: [
    { letter: 'A', text: 'a deploy', br_pt_form: 'uma implantação' },
    { letter: 'B', text: 'a deadline', br_pt_form: 'um prazo' },
    { letter: 'C', text: 'a bug', br_pt_form: 'um defeito' },
  ],
  key: 'C',
};

/**
 * The two generations of `item_id` the catalogue actually carries, in one pack — and a
 * key of `B` on the first item and `C` on the second, so a component that highlighted the
 * first option, or the alphabetically last, would still be caught.
 */
export const ITEMS: readonly FixtureItem[] = [GRAMMAR_ITEM, VOCAB_ITEM];

/** The item the spec answers *correctly*: its key is `B`. */
export const CORRECT_ITEM = GRAMMAR_ITEM;
/** The item the spec answers *incorrectly*: its key is `C`. */
export const WRONG_ITEM = VOCAB_ITEM;

/**
 * The letter that is *not* `item.key`, chosen deterministically. Named by letter rather
 * than by index so the spec never indexes an array (`noUncheckedIndexedAccess` would make
 * `options[0]` possibly-undefined, and the assertion would be about the type checker
 * rather than about the product).
 */
export function wrongLetter(item: FixtureItem): string {
  const wrong = item.options.find((option) => option.letter !== item.key);
  if (wrong === undefined) throw new Error(`Fixture item ${item.item_id} offers no wrong option.`);
  return wrong.letter;
}

/** The `text` the browser shows for a letter, for `getByRole` accessible-name assertions. */
export function optionText(item: FixtureItem, letter: string): string {
  const option = item.options.find((candidate) => candidate.letter === letter);
  if (option === undefined) throw new Error(`Fixture item ${item.item_id} has no option ${letter}.`);
  return option.text;
}

/** What the browser is served: the complete, unmarked option set. */
export const PACK: PackContentDto = {
  pack_id: PACK_ID,
  lesson_id: LESSON_ID,
  schema_version: 'canonical',
  reuse_basis: 'cite_only',
  items: ITEMS.map((item) => ({
    item_id: item.item_id,
    item_type: item.item_type,
    skill: item.skill,
    domain: item.domain,
    prompt: item.prompt,
    scoring: item.scoring,
    options: item.options.map((option) => ({
      letter: option.letter,
      text: option.text,
      ...(option.br_pt_form === undefined ? {} : { br_pt_form: option.br_pt_form }),
    })),
  })),
};

export const LEARNER_PROFILE: LearnerProfileDto = {
  learner_id: '00000000-0000-0000-0000-000000000001',
  created_at: '2026-09-01T09:00:00.000Z',
  cefr_level: 'A2',
  mastery: { grammar: 0.62, vocab: 0.71, reading: 0.91, pronunciation: 0.54, listening: 0.83 },
  preferences: {
    recast_enabled: true,
    meta_button_enabled: true,
    audio_autoplay: false,
    daily_goal_minutes: 15,
  },
};

export const MASTERY: Readonly<
  Record<string, { mastery: number; gate_passed: boolean; last_practice: string }>
> = {
  grammar: { mastery: 0.62, gate_passed: false, last_practice: '2026-10-14T18:20:00.000Z' },
  vocab: { mastery: 0.71, gate_passed: false, last_practice: '2026-10-16T07:05:00.000Z' },
  reading: { mastery: 0.91, gate_passed: true, last_practice: '2026-10-10T20:00:00.000Z' },
};

/**
 * A `practice_pack` recommendation, which is the activity whose destination is the
 * practice screen nested under its lesson (`/lessons/{lesson}/practice?pack={pack}`).
 */
export const NEXT_ACTIVITY: NextActivityDto = {
  activity_type: 'practice_pack',
  activity_id: PACK_ID,
  rationale: {
    selection_rule: 'mastery_gate',
    mastery_gaps: ['grammar', 'vocab'],
    i_plus_1: true,
  },
  estimated_duration_minutes: 15,
  prerequisites_met: true,
};

/** Every phase present, and a `learner_model` block: the ordinary, publishable lesson. */
export const GREETINGS_LESSON: LessonContentDto = {
  lesson_id: LESSON_ID,
  title: 'Saudações e apresentações',
  cefr_level: 'A2',
  reuse_basis: 'cite_only',
  authoring_state: 'authored',
  publication_state: 'publishable',
  phases: [
    {
      phase: 1,
      heading: 'Aquecimento',
      markdown: 'O que você diz ao encontrar um colega de manhã? **Good morning!**',
    },
    {
      phase: 2,
      heading: 'Entrada compreensível',
      markdown: 'Leia o diálogo:\n\n> — Hi, I am Ana. I am a **backend** developer.',
    },
    { phase: 3, heading: 'Prática guiada', markdown: 'Complete: "I ___ a developer."' },
    { phase: 4, heading: 'Tarefa de saída', markdown: 'Apresente-se ao seu time em três frases.' },
  ],
  learner_model: { target_skills: ['grammar', 'vocab'], i_plus_1: true, estimated_minutes: 15 },
};

/**
 * `publication_state: restricted_pending_permission` and `learner_model: null`: the one
 * shape in 122 lessons that must render a warning instead of a learner model (ADR-044's
 * sibling rule — a restricted lesson must not be presented as studyable).
 */
export const RESTRICTED_LESSON: LessonContentDto = {
  lesson_id: RESTRICTED_LESSON_ID,
  title: 'A history of the internet',
  cefr_level: 'A2',
  reuse_basis: 'adapt_requires_permission',
  authoring_state: 'blocked',
  publication_state: 'restricted_pending_permission',
  phases: [
    { phase: 1, heading: 'Aquecimento', markdown: 'Quando você usou a internet pela primeira vez?' },
    { phase: 2, heading: 'Entrada compreensível', markdown: 'ARPANET conectou quatro universidades.' },
    { phase: 3, heading: 'Prática guiada', markdown: 'Ordene os acontecimentos.' },
    { phase: 4, heading: 'Tarefa de saída', markdown: 'Escreva uma linha do tempo de cinco eventos.' },
  ],
  learner_model: null,
};

export const LESSONS: Readonly<Record<string, LessonContentDto>> = {
  [LESSON_ID]: GREETINGS_LESSON,
  [RESTRICTED_LESSON_ID]: RESTRICTED_LESSON,
};

/** A request that contradicts the fixture contract — answered as Problem Details. */
export class FixtureProblem extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    readonly detail: string,
  ) {
    super(detail);
    this.name = 'FixtureProblem';
  }
}

/**
 * `POST /learners/{id}/practice`, as the contract describes it: the *only* response that
 * carries `scored_items[].correct` (ADR-044).
 *
 * It scores against the same `ITEMS` the pack was built from, and refuses a submission
 * that does not name exactly the pack's items — a UI that dropped one, or invented one,
 * should fail loudly here rather than look correct on screen.
 */
export function scoreSubmission(body: PracticeSubmissionDto): PracticeResultDto {
  if (body.pack_id !== PACK_ID) {
    throw new FixtureProblem(404, 'Pack not found', `No pack ${body.pack_id} in this fixture.`);
  }

  const expected = new Set(ITEMS.map((item) => item.item_id));
  for (const response of body.responses) {
    if (!expected.has(response.item_id)) {
      throw new FixtureProblem(
        400,
        'Unknown item',
        `Item ${response.item_id} is not part of pack ${PACK_ID}.`,
      );
    }
  }
  if (body.responses.length !== ITEMS.length) {
    throw new FixtureProblem(
      400,
      'Incomplete submission',
      `Pack ${PACK_ID} declares ${ITEMS.length} items; received ${body.responses.length}.`,
    );
  }

  return {
    pack_id: PACK_ID,
    scored_items: ITEMS.map((item) => {
      const submission = body.responses.find((response) => response.item_id === item.item_id);
      return {
        item_id: item.item_id,
        correct: submission?.response === item.key,
        skill: item.skill,
        bkt_update: { prior: 0.62, posterior: 0.7, transition: 'guessed' as const },
      };
    }),
    mastery_updates: [{ skill: 'grammar', mastery_before: 0.62, mastery_after: 0.7, gate_passed: false }],
    next_review_schedule: [
      { skill: 'grammar', next_review_at: '2026-10-21T09:00:00.000Z', interval_days: 3 },
    ],
  };
}
