import { LessonSkeleton } from '@/presentation/components/skeletons';

/**
 * The lesson segment's fallback.
 *
 * `LessonPage` resolves the lesson before it can decide between `notFound()` and a render, so
 * there is nothing to stream but the skeleton. It sits at the `[lesson_id]` segment, which
 * makes it the fallback for the lesson screen and the ancestor of the practice screen's own
 * (more specific) one.
 */
export default function Loading() {
  return <LessonSkeleton />;
}
