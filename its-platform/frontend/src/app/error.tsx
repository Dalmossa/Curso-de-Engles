'use client';

import { ErrorState } from '@/presentation/components/error-state';

export default function ErrorBoundary({ error, reset }: { readonly error: Error & { digest?: string }; readonly reset: () => void }) {
  return <ErrorState error={error} onRetry={reset} />;
}
