import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CurriculumService } from './curriculum.service.js';

@Controller('learners')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get(':id/next')
  async getNextActivity(@Param('id', ParseUUIDPipe) id: string, @Query() query: any) {
    return this.curriculumService.getNextActivity(id, query);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
