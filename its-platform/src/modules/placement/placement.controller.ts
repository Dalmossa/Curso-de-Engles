import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PlacementService } from './placement.service.js';

@Controller('learners')
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  @Post(':id/placement')
  async runDiagnostic(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    return this.placementService.runDiagnostic(id, body);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
