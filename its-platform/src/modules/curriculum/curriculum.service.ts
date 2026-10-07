import { Injectable } from '@nestjs/common';

@Injectable()
export class CurriculumService {
  async getNextActivity(id: string, query: any) {
    return {
      activity_type: 'lesson',
      activity_id: 'les_a2_airport',
      rationale: {
        selection_rule: 'prerequisite',
        mastery_gaps: [],
        i_plus_1: true,
      },
      estimated_duration_minutes: 15,
      prerequisites_met: true,
    };
  }
}
