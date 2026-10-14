import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

// VERSION_NEUTRAL: for URI versioning this omits the version segment, so the
// probes stay at /health and /ready. They are liveness/readiness endpoints for
// the orchestrator and the gateway (P0.8), not a versioned API surface, and
// `src/main.ts` excludes them from the global prefix for the same reason.
@Controller({ version: VERSION_NEUTRAL })
export class HealthController {
  @Get('health')
  health(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  ready(): { status: string; timestamp: string; checks: Record<string, boolean> } {
    // P0.8: /ready binds to actual dependency checks (DB, Redis, etc.) in later stories
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: true, // TODO: real check in P0.4/P1.12
        redis: true, // TODO: real check in P0.7/P1.7
        config: true,
      },
    };
  }
}
