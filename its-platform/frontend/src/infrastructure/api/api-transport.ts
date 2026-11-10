import type { OperationName } from './operations';

/**
 * A call expressed as a *logical operation*, never as a URL.
 *
 * This is the seam between the repositories and the two ways of reaching the API. The
 * server gateway turns an operation into a real path against the NestJS base URL and
 * attaches the bearer token; the browser gateway turns the same operation into
 * `/api/its/{operation}?…` and attaches nothing. Neither the repositories nor the pages
 * know which one they got, and adding a third (a service worker replaying an offline
 * queue, say) would not touch them.
 */
export interface ApiRequest {
  readonly operation: OperationName;
  /** Path parameters, keyed by the contract's own names. */
  readonly pathParams?: Readonly<Record<string, string>>;
  /** Query parameters, keyed by the contract's own names. */
  readonly query?: Readonly<Record<string, string | number | undefined>>;
  readonly body?: unknown;
  readonly signal?: AbortSignal;
}

export interface ApiTransport {
  request<T>(request: ApiRequest): Promise<T>;
}

/** Encodes query parameters, skipping the ones the caller left undefined. */
export function appendQuery(
  url: string,
  params: Readonly<Record<string, string | number | undefined>> | undefined,
): string {
  if (!params) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query === '' ? url : `${url}${url.includes('?') ? '&' : '?'}${query}`;
}
