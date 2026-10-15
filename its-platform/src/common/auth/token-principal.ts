/**
 * The port a bearer token is verified through (A5b, ADR-038 D1/D7).
 *
 * `CONSTITUTION.md` §4.5 makes token validation an obligation of the edge, and ADR-013 fixes what
 * the platform may do with the result: *"The API is a Resource Server. It does not issue tokens."*
 * So this file contains no signing path of any kind — only the shape of a verified caller and the
 * one failure mode. A verifier that could mint a token would be the Authorization Server ADR-013
 * forbids, and the absence of that capability here is the point rather than an omission.
 *
 * `subject` is the learner id (ADR-038 D7, ratified 2026-10-15): the token's `sub` is what the
 * application puts into the learner context ADR-026 §1 has exactly one writer for, so ADR-003's
 * policy — not a comparison of ids in a controller — decides what the caller can see. D3 rejects
 * the alternative explicitly: *"Não há `if (pathId === tokenSubject)`"*.
 *
 * `scopes` is the authority for ADR-038 D2, and it is deliberately a *separate* field from
 * `subject`: §4.5 states that *"authorisation is a separate concern from authentication and is
 * never inferred from token validity alone"* — a valid token with no scope is an authenticated
 * caller, not an authorised one.
 */

/** What a successfully verified bearer token establishes about its caller. */
export interface TokenPrincipal {
  /** The learner id, from the token's `sub` (ADR-038 D7). */
  readonly subject: string;
  /** The granted scopes, from the token's `scope` claim. Never inferred from `subject`. */
  readonly scopes: readonly string[];
  /** Every claim the signature covered, for handlers that need more than the two above. */
  readonly claims: Readonly<Record<string, unknown>>;
}

/**
 * Verifies a bearer token. Implementations must be *total*: every input either yields a principal
 * or throws `TokenVerificationError` — never a raw library error, and never a 5xx at the edge. A
 * verifier that cannot reach its key material must refuse the request (§4.5, deny by default).
 */
export interface TokenVerifier {
  verify(token: string): Promise<TokenPrincipal>;
}

/**
 * Why a token was refused. Machine-readable on purpose: the guard maps *every* refusal to the same
 * 401 body (the response must not be an oracle), while a log line and a test can tell the cases
 * apart — which is the difference between "an incident happened" and "here is which clause failed".
 */
export type TokenRefusal =
  | 'missing_subject'
  | 'invalid_signature'
  | 'expired'
  | 'not_yet_valid'
  | 'claims'
  | 'malformed'
  | 'unreachable_jwks'
  | 'unconfigured'
  | 'unknown';

export class TokenVerificationError extends Error {
  constructor(
    message: string,
    readonly reason: TokenRefusal = 'unknown',
  ) {
    super(message);
    this.name = 'TokenVerificationError';
  }
}
