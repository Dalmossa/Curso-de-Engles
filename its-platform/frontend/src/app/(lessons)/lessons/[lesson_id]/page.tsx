import { notFound, redirect } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { LessonView } from '@/presentation/components/lesson-view';
import { isLessonId, type LessonContent } from '@/core';
import { isDomainError, isAuthenticationFailure } from '@/core/errors/domain-error';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly params: Promise<{ lesson_id: string }>;
}

/**
 * Loads lesson from the real backend API. No mock fallback — if the API is unavailable,
 * the error propagates to the error boundary (error.tsx) which shows a proper
 * unavailability message. If the lesson doesn't exist, returns 404 via notFound().
 */
async function loadLesson(lessonId: string): Promise<LessonContent | null> {
  const { useCases } = await getServerContext();
  try {
    return await useCases.getLesson.execute(lessonId);
  } catch (error) {
    if (isDomainError(error) && error.isMissingResource) {
      return null;
    }
    if (isAuthenticationFailure(error)) {
      redirect('/login');
    }
    // Let network/server errors propagate to error.tsx boundary
    throw error;
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { lesson_id } = await params;

  if (!isLessonId(lesson_id)) notFound();

  const lesson = await loadLesson(lesson_id);
  if (!lesson) notFound();

  return <LessonView lesson={lesson} />;
}
