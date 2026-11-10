import { DashboardSkeleton } from '@/presentation/components/skeletons';

/**
 * The dashboard segment's fallback.
 *
 * `DashboardPage` awaits the learner profile and the recommendation before any JSX exists, so
 * the whole page suspends and this is what paints in the meantime. The file lives in the route
 * group rather than only in `app/loading.tsx` so the fallback has the dashboard's own shape —
 * and because `loading.tsx` is prefetched, arriving here from another route paints instantly.
 */
export default function Loading() {
  return <DashboardSkeleton />;
}
