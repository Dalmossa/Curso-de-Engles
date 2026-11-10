'use client';

import { ErrorState } from '@/presentation/components/error-state';

export default function GlobalError({ error, reset }: { readonly error: Error & { digest?: string }; readonly reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-surface-sunken px-4 py-8">
          <ErrorState error={error} onRetry={reset} />
        </main>
      </body>
    </html>
  );
}
