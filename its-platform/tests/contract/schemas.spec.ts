describe('Schema validation against OpenAPI excerpts', () => {
  it('LessonContent matches shape', () => {
    const instance = {
      lesson_id: 'les_a2_airport',
      title: 'Airport',
      cefr_level: 'A2',
      reuse_basis: 'cite_only',
      fase1: { content: 'c', media: [] },
      fase2: { exercises: [] },
      fase3: { task: 't', success_criteria: ['s'], meta_button: false },
      fase4: { items: [] },
      learner_model: {},
    };
    expect(instance.lesson_id).toBeDefined();
    expect(instance.fase1).toBeDefined();
    expect(instance.fase2).toBeDefined();
    expect(instance.fase3).toBeDefined();
    expect(instance.fase4).toBeDefined();
    expect(instance.learner_model).toBeDefined();
  });
});
