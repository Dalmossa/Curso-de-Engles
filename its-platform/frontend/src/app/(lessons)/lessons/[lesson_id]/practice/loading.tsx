import { PracticeSkeleton } from '@/presentation/components/skeletons';

/**
 * The practice segment's fallback.
 *
 * This page redirects when the pack is missing or malformed, and redirects while streaming are
 * client-side, so the only thing worth showing before the pack arrives is its shape: the item
 * blocks the learner is about to answer.
 */
export default function Loading() {
  return <PracticeSkeleton />;
}
