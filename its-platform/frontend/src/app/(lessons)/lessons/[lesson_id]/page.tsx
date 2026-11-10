import { notFound } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { LessonView } from '@/presentation/components/lesson-view';
import { isLessonId, type LessonContent } from '@/core';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly params: Promise<{ lesson_id: string }>;
}

/**
 * The fetch is resolved before any JSX exists, so the `notFound()` below is reached with
 * data or without it — never from inside a `try` that is wrapping markup (a `throw` during
 * render would not be caught there anyway, which is what `error.tsx` is for).
 */
async function loadLesson(lessonId: string): Promise<LessonContent | null> {
  try {
    const { useCases } = await getServerContext();
    return await useCases.getLesson.execute(lessonId);
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { lesson_id } = await params;

  if (!isLessonId(lesson_id)) notFound();

  const lesson = await loadLesson(lesson_id);
  if (lesson === null) notFound();

  return <LessonView lesson={lesson} />;
}
