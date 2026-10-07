import { Injectable } from '@nestjs/common';

@Injectable()
export class PracticeService {
  async submitPractice(id: string, body: any) {
    return {
      pack_id: body.pack_id || 'pack_les_a2_airport_v1',
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
