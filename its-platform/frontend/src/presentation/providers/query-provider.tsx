'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { isDomainError } from '@/core';

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Learner data changes on every practice submission, so a short window is the
        // most a screen can justify without re-reading.
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Retrying a 401 or a 404 just repeats the same answer three times and delays
          // the error state the learner is owed. `isRetryable` is the domain's own
          // judgement, so this stays in step with what the UI offers a retry button for.
          if (isDomainError(error)) return error.isRetryable && failureCount < 2;
          return failureCount < 2;
        },
      },
      mutations: {
        // A repeated submission would double-count a practice pack. Never automatic.
        retry: 0,
      },
    },
  });
}

/**
 * One `QueryClient` per browser session, created lazily in state rather than at module
 * scope — a module-level client is shared across requests on the server, which leaks one
 * learner's cached data into another's render.
 */
export function QueryProvider({ children }: { readonly children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
