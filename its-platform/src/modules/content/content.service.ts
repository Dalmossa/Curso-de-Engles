import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {
  async getLesson(id: string) {
    // Mock structured response matching LessonContent schema
    return {
      lesson_id: id,
      title: 'Sample Lesson',
      cefr_level: 'A2',
      reuse_basis: 'cite_only',
      fase1: {
        content: 'Sample content',
        media: [],
      },
      fase2: {
        exercises: [],
      },
      fase3: {
        task: 'Sample task',
        success_criteria: ['complete'],
        meta_button: false,
      },
      fase4: {
        items: [],
      },
      learner_model: {},
    };
  }

  async getPack(id: string) {
    return {
      pack_id: id,
      lesson_id: 'les_a2_airport',
      schema_version: 'canonical',
      reuse_basis: 'cite_only',
      items: [
        {
          item_id: 'vocab.airport.001',
          skill: 'vocab',
          domain: 'airport',
          prompt: 'Choose the correct option',
          options: [
            { letter: 'A', text: 'Option A', is_key: false, note: 'not key' },
            { letter: 'B', text: 'Option B', is_key: false, note: 'not key' },
            { letter: 'C', text: 'Option C', is_key: true },
            { letter: 'D', text: 'Option D', is_key: false, note: 'not key' },
          ],
          key: 'C',
        },
      ],
    };
  }

  async getDialogue(id: string) {
    return {
      dialogue_id: id,
      title: 'Sample Dialogue',
      cefr_level: 'A2',
      status: 'shipped',
      duration_seconds: 45,
      voices: [],
      slots: [
        {
          slot_id: 'lst_sample_001',
          skill: 'gist',
          key: 'A',
          transcript: 'Sample transcript',
          distractors: [
            { letter: 'B', text: 'Distractor B', type: 'semantic_plausible' },
            { letter: 'C', text: 'Distractor C', type: 'lexical' },
            { letter: 'D', text: 'Distractor D', type: 'phonological' },
          ],
        },
      ],
    };
  }
}
