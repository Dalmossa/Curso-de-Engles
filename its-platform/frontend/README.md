# ITS Platform Frontend

This is the ITS Platform frontend (Next.js App Router, TypeScript, Tailwind CSS v4, PWA).

## Architecture note

- **No BFF proxy** (reversal of an earlier decision). There is no `/app/api/its/*` route and no `BffApiGateway`. All API calls originate server-side: Server Components and Server Actions use `DirectApiGateway` (server-only) to reach the NestJS API at `ITS_API_BASE_URL`. The browser has no public API base URL — `NEXT_PUBLIC_API_BASE_URL` was removed deliberately. The operation whitelist in `src/infrastructure/api/operations.ts` remains as the validation gate.
- Layer boundaries: `presentation → application → core` (dependency rule). `infrastructure` implements `core` ports. The only exception is `@/infrastructure/composition/*` imported by server code; ESLint `no-restricted-imports` enforces this.
- ADR-044: pack payloads ship with `options[]` as the complete unmarked set — the answer key is revealed only via `scored_items[].correct` from `POST /learners/{id}/practice`, so the UI never highlights the key before submission.
- Mastery gate = `0.85` (matches contract). `LearnerProfile.cefr_level` may be `null`. `streak_days`/`xp` do not exist in this slice.
- Diagnostic: only `POST /learners/{id}/placement` is used (no diagnostic question endpoint in the contract). `PlacementResult.theta`/`standardError` are rendered as returned — flagged for review against ADR-043.

## Quick start

```bash
cd its-platform/frontend
npm install
cp .env.example .env.local  # adjust as needed
npm run dev                 # http://localhost:3100
```

## Scripts

- `npm run dev` — start Next.js dev server (port 3100)
- `npm run build` — typecheck + build (Next)
- `npm run start` — production server (port 3100)
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript `--noEmit`
- `npm run test` — Vitest (unit + integration)
- `npm run test:e2e` — Playwright
- `npm run api:types` — generate `src/infrastructure/api/generated/api-types.ts` from `../docs/api-spec.openapi.yaml`

## Environment variables

Server-only: `ITS_API_BASE_URL`, `ITS_API_TOKEN`, `ITS_LEARNER_ID`, `ITS_API_TIMEOUT_MS`. Public: `NEXT_PUBLIC_APP_URL`. Never commit `.env.local`; `.env.example` is the template.

## Routes

- `/` (dashboard) — `GET /learners/{id}/next` + profile mastery summary
- `/lessons/[lesson_id]` — `GET /content/lessons/{id}` (4 phases + learner_model)
- `/lessons/[lesson_id]/practice?pack=...` — `GET /content/packs/{id}` + `POST /learners/{id}/practice`
- `/mastery` — profile + mastery rows
- `/diagnostic` — starts placement (no question flow)

## Tests

Core unit tests opt into `@vitest-environment node` to keep core DOM-free.

## PWA

Minimal `manifest.ts`, inline no-flash theme script, service worker registered only in production.
