import { MasterySkeleton } from '@/presentation/components/skeletons';

/**
 * The mastery segment's fallback.
 *
 * Same reasoning as the dashboard's: the page resolves the profile and the mastery rows before
 * rendering, so the skeleton stands in for the whole segment — header, card, and the rows of
 * `MasteryPanel`.
 */
export default function Loading() {
  return <MasterySkeleton />;
}
