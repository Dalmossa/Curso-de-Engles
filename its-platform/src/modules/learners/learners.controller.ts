import { Controller, Get, Param, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { LearnersService } from './learners.service.js';

@Controller('learners')
export class LearnersController {
  constructor(private readonly learnersService: LearnersService) {}

  @Get(':id/profile')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    const profile = await this.learnersService.getProfile(id);
    if (!profile) throw new NotFoundException({ error: 'not_found', message: 'Learner not found', request_id: cryptoRandom() });
    return profile;
  }

  @Get(':id/mastery')
  async getMastery(@Param('id', ParseUUIDPipe) id: string) {
    return this.learnersService.getMastery(id);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
