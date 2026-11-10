import 'server-only';

import { appendQuery, type ApiRequest, type ApiTransport } from './api-transport';
import type { HttpClient } from './http-client';
import { OPERATIONS, type OperationSpec } from './operations';
import { assertParams } from './param-validation';

export interface DirectApiGatewayOptions {
  /** Always server-side: the token must never reach a browser. */
  readonly baseUrl: string;
  readonly getAccessToken: () => Promise<string | null>;
  readonly httpClient: HttpClient;
}

/**
 * Talks to the NestJS API directly. Server-only by construction.
 *
 * Every call goes through the operation table, so a path can only be one the contract
 * declares and every identifier is pattern-checked before it is interpolated.
 */
export class DirectApiGateway implements ApiTransport {
  constructor(private readonly options: DirectApiGatewayOptions) {}

  async request<T>(request: ApiRequest): Promise<T> {
    const spec = OPERATIONS[request.operation];

    const supplied: Record<string, string | undefined> = {
      ...toStringRecord(request.query),
      ...request.pathParams,
    };
    assertParams(spec, supplied);

    const token = await this.options.getAccessToken();

    return this.options.httpClient.send<T>({
      method: spec.method,
      url: buildOperationUrl(this.options.baseUrl, spec, supplied),
      headers: token === null ? {} : { Authorization: `Bearer ${token}` },
      body: request.body,
      signal: request.signal,
    });
  }
}

function toStringRecord(
  input: Readonly<Record<string, string | number | undefined>> | undefined,
): Record<string, string | undefined> {
  if (!input) return {};
  const output: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(input)) {
    output[key] = value === undefined ? undefined : String(value);
  }
  return output;
}

/**
 * `{learner_id}` → the value. Concatenation rather than `new URL(path, base)`: the
 * contract's paths start with `/`, which would discard the `/api/v1` prefix that lives in
 * the base URL — the exact bug that produces 404s nobody can explain.
 */
export function buildOperationUrl(
  baseUrl: string,
  spec: OperationSpec,
  params: Readonly<Record<string, string | undefined>>,
): string {
  const path = spec.path.replace(/\{([a-z_]+)\}/g, (_match, name: string) => {
    const value = params[name];
    if (value === undefined) {
      // Unreachable: `assertParams` requires every path parameter first.
      throw new Error(`Missing path parameter "${name}" for operation at ${spec.path}.`);
    }
    return encodeURIComponent(value);
  });

  const query: Record<string, string | undefined> = {};
  for (const param of spec.queryParams) {
    const value = params[param.name];
    if (value !== undefined && value !== '') query[param.name] = value;
  }

  return appendQuery(`${baseUrl}${path}`, query);
}
