# MEMORY

- P0.5: Port content loader (lessons, packs, listening) — parsers TS + loader idempotente + gate content-check (PGlite/PG real), unit tests de parsers; ADR-020; skips baseline fail-closed. DONE 2026-10-07
- P0.6: NestJS API scaffolding implemented for endpoints listed (content/lessons, content/packs, content/listening, learners placement/next/practice/profile/mastery, auth/refresh). Global ValidationPipe + RFC 9457 Problem exception filter configured. Contract tests added. DONE 2026-10-07
- P0.7: Test harness + test expansion — added reusable PGlite test DB helpers (tests/helpers/db.ts, fixtures.ts), integration tests for loader with idempotency, expanded contract tests covering all endpoints, parser unit tests with real fixtures, test-all script; all gates pass (typecheck, build, tests, domain-isolation, content-check, contract-check). DONE 2026-10-07
