import { Controller, Get, Param, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { LearnersService } from './learners.service.js';

@Controller('learners')
export class LearnersController {
  constructor(private readonly learnersService: LearnersService) {}

  @Get(':id/profile')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    const profile = await this.learnersService.getProfile(id);
    // No body of its own: the global `ProblemExceptionFilter` renders the `Problem` (P1.17), with
    // this occurrence's message as `detail`. A missing learner is a 404 for the same reason
    // `POST /learners` in the spec is not a 409 — the DDL has no uniqueness to violate beyond the
    // primary key (ADR-038's object-level 404 rule applies to reads of another learner's object).
    if (!profile) throw new NotFoundException('Learner not found');
    return profile;
  }

  @Get(':id/mastery')
  async getMastery(@Param('id', ParseUUIDPipe) id: string) {
    return this.learnersService.getMastery(id);
  }
}

