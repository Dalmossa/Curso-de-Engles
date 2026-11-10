import { GenericPageSkeleton } from '@/presentation/components/skeletons';
import { LOADING_LABELS } from '@/presentation/lib/copy';

/**
 * The diagnostic segment's fallback.
 *
 * The page itself renders immediately (it is a client form); the wait that exists here is the
 * placement request on submit, which the form already reports on its own submit button. This
 * skeleton therefore only covers the navigation, and says which screen is coming so that a
 * screen reader is not left with silence.
 */
export default function Loading() {
  return <GenericPageSkeleton label={LOADING_LABELS.diagnostic} />;
}
