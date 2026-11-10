import { GenericPageSkeleton } from '@/presentation/components/skeletons';

/**
 * The root fallback, for the routes that have no skeleton of their own (`/login`, `/diagnostic`).
 *
 * It is a page-shaped skeleton rather than the "Carregando…" line it used to be: a line of
 * text is a placeholder that tells a sighted learner nothing about what is coming, and the
 * skeleton communicates the same thing to everyone. Routes with a recognisable layout declare
 * their own `loading.tsx` closer to the page, which is the one that wins.
 */
export default function Loading() {
  return <GenericPageSkeleton />;
}
