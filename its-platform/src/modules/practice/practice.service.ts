import { Injectable } from '@nestjs/common';
import type { PracticeSubmissionDto } from './dto/practice-submission.dto.js';

@Injectable()
export class PracticeService {
  /**
   * `body.pack_id` no longer carries a fallback: it is `required` by the contract and enforced by
   * `PracticeSubmissionDto`, so `body.pack_id || 'pack_les_a2_airport_v1'` could only ever hide a
   * body the pipe had already rejected. The echo is the caller's own pack id.
   */
  async submitPractice(id: string, body: PracticeSubmissionDto) {
    return {
      pack_id: body.pack_id,
      scored_items: [
        {
          item_id: 'vocab.airport.001',
          correct: true,
          skill: 'vocab',
          bkt_update: {
            prior: 0.5,
            posterior: 0.8,
            transition: 'learned',
          },
        },
      ],
      mastery_updates: [
        {
          skill: 'vocab',
          mastery_before: 0.5,
          mastery_after: 0.6,
          gate_passed: false,
        },
      ],
      next_review_schedule: [],
    };
  }
}
