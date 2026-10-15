import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PracticeSubmissionDto } from './dto/practice-submission.dto.js';
import { PracticeService } from './practice.service.js';

@Controller('learners')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  /**
   * `200` for the same reason as `POST /learners/{learner_id}/placement`: the contract publishes one
   * success status, and scoring a submission creates no addressable resource. The body is
   * `PracticeSubmissionDto`, which is what makes the published `required`, `pattern`, `minItems` and
   * `minimum` enforceable (§4.5).
   */
  @Post(':id/practice')
  @HttpCode(200)
  async submitPractice(@Param('id', ParseUUIDPipe) id: string, @Body() body: PracticeSubmissionDto) {
    return this.practiceService.submitPractice(id, body);
  }
}

function cryptoRandom(): string {
  return (globalThis as any).crypto?.randomUUID?.() ?? require('crypto').randomUUID();
}
