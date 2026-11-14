// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainError } from '@/core/errors/domain-error';

/**
 * RF-009 — `/lessons/[lesson_id]` must distinguish three failures that the API reports
 * differently but that a `catch (error) { throw error }` collapses into one:
 *
 * - `404` → the learner asked for a lesson that does not exist: `notFound()`, the framework's
 *   page, not a runtime error in the server log (the defect this file pins down).
 * - `401/403` → the session is the problem: `redirect('/login')`, because retrying cannot help.
 * - anything else (network, `5xx`, an unparseable body) → propagate, so `error.tsx` can offer
 *   a retry instead of pretending the lesson does not exist.
 */

const notFound = vi.fn((): never => {
  throw new Error('NEXT_NOT_FOUND');
});
const redirect = vi.fn((url: string): never => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock('next/navigation', () => ({ notFound, redirect }));

const getServerContext = vi.fn();
vi.mock('@/infrastructure/composition/server-container', () => ({ getServerContext }));

vi.mock('@/presentation/components/lesson-view', () => ({
  LessonView: () => null,
}));

const { default: LessonPage } = await import('@/app/(lessons)/lessons/[lesson_id]/page');

const LESSON_ID = 'les_a1_alphabet_sounds';

const lesson = {
  lessonId: LESSON_ID,
  title: 'Alphabet, Sounds, Letter Names',
  cefrLevel: 'A1',
  phases: [],
};

function errorOf(kind: 'not_found' | 'unauthorized' | 'network'): DomainError {
  const status = kind === 'not_found' ? 404 : kind === 'unauthorized' ? 401 : null;
  return new DomainError({
    kind,
    status,
    title: kind,
    detail: `stub ${kind}`,
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

function context(behaviour: () => Promise<unknown>): void {
  getServerContext.mockResolvedValue({
    useCases: { getLesson: { execute: behaviour } },
  });
}

describe('RF-009 — /lessons/[lesson_id] failure handling', () => {
  it('renders the 404 page when the API says the lesson is missing', async () => {
    context(() => Promise.reject(errorOf('not_found')));

    await expect(
      LessonPage({ params: Promise.resolve({ lesson_id: LESSON_ID }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('sends an unauthenticated learner to /login', async () => {
    context(() => Promise.reject(errorOf('unauthorized')));

    await expect(
      LessonPage({ params: Promise.resolve({ lesson_id: LESSON_ID }) }),
    ).rejects.toThrow('NEXT_REDIRECT:/login');
    expect(redirect).toHaveBeenCalledWith('/login');
    expect(notFound).not.toHaveBeenCalled();
  });

  it('propagates infrastructure failures instead of faking a 404', async () => {
    const failure = errorOf('network');
    context(() => Promise.reject(failure));

    await expect(
      LessonPage({ params: Promise.resolve({ lesson_id: LESSON_ID }) }),
    ).rejects.toBe(failure);
    expect(notFound).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('does not call the API for a malformed lesson id', async () => {
    const spy = vi.fn();
    context(spy);

    await expect(
      LessonPage({ params: Promise.resolve({ lesson_id: 'LES-A1' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(spy).not.toHaveBeenCalled();
  });

  it('renders the lesson when the API answers', async () => {
    context(() => Promise.resolve(lesson));

    const element = await LessonPage({ params: Promise.resolve({ lesson_id: LESSON_ID }) });
    expect(element).toBeTruthy();
    // `execute` is only reached because `isLessonId` accepted the id.
    expect(getServerContext).toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });
});
