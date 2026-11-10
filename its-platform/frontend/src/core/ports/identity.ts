/**
 * Who the current learner is.
 *
 * This port exists because ADR-013 is open: the platform is a Resource Server and the
 * token story is unresolved, so the learner identity is mocked and the mock must be
 * *replaceable in one place*. Its only implementation reads a server-only environment
 * variable, and it is only ever called from server code — routing this through a port
 * rather than reading `process.env` at the call site is what keeps that constraint
 * enforceable.
 *
 * When ADR-013 closes, the replacement reads the verified token's subject. No use case
 * changes.
 */
export interface LearnerIdentity {
  getLearnerId(): Promise<string>;
}

/** The credential the platform verifies. `null` means "send no `Authorization` header". */
export interface AccessTokenProvider {
  getAccessToken(): Promise<string | null>;
}
