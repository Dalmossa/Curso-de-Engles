/**
 * `LessonView` — the four authored phases, plus the two states a lesson can be in that
 * are not "content ready": a licence that has not been granted, and a `learner_model`
 * block that does not exist.
 *
 * Both are surfaced rather than hidden, so both are asserted: the publication warning
 * because presenting restricted content as finished is the mislabelling the repository's
 * licence rules exist to prevent, and the absent learner model because rendering an empty
 * panel would claim the block had been interpreted when it had not.
 *
 * Internal catalogue metadata (`lessonId`, `authoringState`, `reuseBasis`) is not shown in
 * the learner-facing lesson UI.
 */
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LessonView } from '@/presentation/components/lesson-view';
import { LESSON_WITHOUT_LEARNER_MODEL, PUBLISHABLE_LESSON, RESTRICTED_LESSON } from './fixtures';

describe('LessonView', () => {
  it('renders the four phases in order', () => {
    render(<LessonView lesson={PUBLISHABLE_LESSON} />);

    expect(screen.getByTestId('lesson-phases')).toBeInTheDocument();
    expect(
      screen.getAllByTestId(/^lesson-phase-[1-4]$/).map((element) => element.getAttribute('data-testid')),
    ).toEqual(['lesson-phase-1', 'lesson-phase-2', 'lesson-phase-3', 'lesson-phase-4']);

    PUBLISHABLE_LESSON.phases.forEach((authored, index) => {
      const listItem = screen.getByTestId(`lesson-phase-${authored.phase}`);
      expect(within(listItem).getByText(`FASE ${authored.phase}`)).toBeInTheDocument();
      expect(within(listItem).getByRole('heading', { name: authored.heading })).toBeInTheDocument();
      // The body is rendered as markdown, not as escaped text.
      expect(within(listItem).getByText('destaque').tagName).toBe('STRONG');
      expect(listItem).toHaveTextContent(`Corpo da fase ${index + 1} com destaque.`);
    });
  });

  it('identifies the lesson by title and level and hides internal metadata', () => {
    render(<LessonView lesson={PUBLISHABLE_LESSON} />);

    expect(screen.getByRole('heading', { level: 1, name: PUBLISHABLE_LESSON.title })).toBeInTheDocument();
    expect(screen.getByTestId('cefr-badge')).toHaveTextContent('A2');

    expect(screen.queryByText(PUBLISHABLE_LESSON.lessonId)).toBeNull();
    expect(screen.queryByTestId('authoring-state')).toBeNull();
    expect(screen.queryByTestId('reuse-basis')).toBeNull();
  });

  it('says nothing about publication for a publishable lesson', () => {
    render(<LessonView lesson={PUBLISHABLE_LESSON} />);

    expect(screen.queryByTestId('publication-warning')).toBeNull();
    expect(screen.queryByText(/não liberado para publicação/i)).toBeNull();
  });

  it('warns when the lesson is not publishable, and still shows the content for review', () => {
    render(<LessonView lesson={RESTRICTED_LESSON} />);

    const warning = screen.getByTestId('publication-warning');
    expect(warning).toHaveTextContent('Conteúdo ainda não liberado para publicação');
    expect(warning).toHaveTextContent('restricted_pending_permission');

    // Internal licence/authoring metadata remains hidden from the learner-facing view.
    expect(screen.queryByText(RESTRICTED_LESSON.lessonId)).toBeNull();
    expect(screen.queryByTestId('authoring-state')).toBeNull();
    expect(screen.queryByTestId('reuse-basis')).toBeNull();

    // A restricted lesson is served, so its phases are readable — the warning is not a
    // substitute for the content, and it is not a 404.
    expect(screen.getByTestId('lesson-phases')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^lesson-phase-[1-4]$/)).toHaveLength(4);
  });

  it('renders the learner model block when the lesson declares one', () => {
    render(<LessonView lesson={PUBLISHABLE_LESSON} />);

    const block = screen.getByTestId('learner-model');
    expect(block.tagName).toBe('PRE');
    expect(block).toHaveTextContent('target_skills');
    expect(JSON.parse(block.textContent ?? '')).toEqual(PUBLISHABLE_LESSON.learnerModel);
    expect(screen.queryByTestId('learner-model-absent')).toBeNull();
  });

  it('states that the learner model is absent rather than showing an empty panel', () => {
    render(<LessonView lesson={LESSON_WITHOUT_LEARNER_MODEL} />);

    expect(screen.getByTestId('learner-model-absent')).toHaveTextContent(
      'Esta lição não declara um bloco de dados para o learner model.',
    );
    expect(screen.queryByTestId('learner-model')).toBeNull();
  });
});
