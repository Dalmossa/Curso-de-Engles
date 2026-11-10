/**
 * Timeout Configuration
 */
export interface TimeoutConfig {
  timeout: number;           // Timeout in milliseconds
  message?: string;          // Custom timeout error message
}

/**
 * Default timeouts per operation type (in milliseconds)
 */
export const DEFAULT_TIMEOUTS = {
  http_get: 5000,
  http_post: 10000,
  http_put: 10000,
  http_delete: 10000,
  database: 5000,
  redis: 2000,
  external_api: 15000,
  default: 5000,
} as const;

/**
 * Timeout Error Class
 */
export class TimeoutError extends Error {
  constructor(message: string, public readonly timeout: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Execute an operation with a timeout
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  config: TimeoutConfig
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(
        config.message || `Operation timed out after ${config.timeout}ms`,
        config.timeout
      ));
    }, config.timeout);
  });
  
  try {
    const result = await Promise.race([operation(), timeoutPromise]);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Get default timeout for an operation type
 */
export function getDefaultTimeout(operationType: string): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (DEFAULT_TIMEOUTS as any)[operationType] ?? DEFAULT_TIMEOUTS.default;
}
