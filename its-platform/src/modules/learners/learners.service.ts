import { Injectable } from '@nestjs/common';

@Injectable()
export class LearnersService {
  async getProfile(id: string) {
    return {
      learner_id: id,
      created_at: new Date().toISOString(),
      cefr_level: 'A2',
      mastery: { grammar: 0.5, vocab: 0.5 },
      theta_estimates: {},
      fsrs_states: {},
      preferences: {
        recast_enabled: true,
        meta_button_enabled: true,
        audio_autoplay: false,
        daily_goal_minutes: 20,
      },
      streak_days: 0,
      xp: 0,
    };
  }

  async getMastery(id: string) {
    return {
      grammar: { mastery: 0.5, gate_passed: false, last_practice: new Date().toISOString() },
      vocab: { mastery: 0.5, gate_passed: false, last_practice: new Date().toISOString() },
    };
  }
}
