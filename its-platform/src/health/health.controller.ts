import { Controller, Get } from '@nestjs/common';

@Controller()
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
