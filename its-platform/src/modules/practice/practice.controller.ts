import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PracticeService } from './practice.service.js';

@Controller('learners')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post(':id/practice')
  async submitPractice(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    return this.practiceService.submitPractice(id, body);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
