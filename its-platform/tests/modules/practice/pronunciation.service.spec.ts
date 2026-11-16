import { UnprocessableEntityException } from '@nestjs/common';

import { PronunciationService } from '../../../src/modules/practice/pronunciation.service.js';

describe('PronunciationService', () => {
  const makeAttemptRepo = () => ({
    create: jest.fn((value: unknown) => value),
    save: jest.fn(async (value: unknown) => value),
    find: jest.fn(),
  });

  const availableAsr = {
    transcribe: jest.fn(async () => ({ ok: true, transcript: 'hello world' })),
  };

  const unavailableAsr = {
    transcribe: jest.fn(async () => ({ ok: false, reason: 'not_configured' })),
  };

  it('persists each evaluation attempt for the authenticated learner', async () => {
    const attempts = makeAttemptRepo();
    const service = new PronunciationService(availableAsr as any, attempts as any);

    const result = await service.evaluate({ expected_text: 'hello world', transcript: 'hello world' } as any, 'learner-1');

    expect(result.overall_score).toBe(100);
    expect(attempts.create).toHaveBeenCalledWith(expect.objectContaining({
      learnerId: 'learner-1',
      lessonId: null,
      expectedText: 'hello world',
      transcript: 'hello world',
      overallScore: 100,
      feedbackPt: expect.any(String),
      wordScores: expect.any(Array),
    }));
    expect(attempts.save).toHaveBeenCalledTimes(1);
  });

  it('still returns evaluation when persisting history fails', async () => {
    const attempts = makeAttemptRepo();
    attempts.save.mockRejectedValueOnce(new Error('db down'));
    const service = new PronunciationService(availableAsr as any, attempts as any);

    await expect(
      service.evaluate({ expected_text: 'hello world', transcript: 'hello word' } as any, 'learner-1'),
    ).resolves.toEqual(expect.objectContaining({
      overall_score: expect.any(Number),
      transcript: 'hello word',
      feedback_pt: expect.any(String),
    }));
  });

  it('throws 422 when no transcript is provided and ASR is unavailable', async () => {
    const attempts = makeAttemptRepo();
    const service = new PronunciationService(unavailableAsr as any, attempts as any);

    await expect(
      service.evaluate({ expected_text: 'hello world', audio_base64: 'ZmFrZQ==', mime_type: 'audio/webm' } as any, 'learner-1'),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it('returns pronunciation history with aggregate summary and weak words', async () => {
    const attempts = makeAttemptRepo();
    attempts.find.mockResolvedValue([
      {
        id: 'a2',
        learnerId: 'learner-1',
        lessonId: null,
        expectedText: 'debug the thread',
        transcript: 'debu tred',
        overallScore: 60,
        feedbackPt: 'Tente de novo.',
        wordScores: [
          { word: 'debug', status: 'needs_work', confidence: 0.7 },
          { word: 'the', status: 'correct', confidence: 1 },
          { word: 'thread', status: 'missed', confidence: 0 },
        ],
        createdAt: new Date('2026-01-02T10:00:00Z'),
      },
      {
        id: 'a1',
        learnerId: 'learner-1',
        lessonId: 'les_1',
        expectedText: 'ship debug',
        transcript: 'sheep debu',
        overallScore: 40,
        feedbackPt: 'Quase lá.',
        wordScores: [
          { word: 'ship', status: 'needs_work', confidence: 0.6 },
          { word: 'debug', status: 'needs_work', confidence: 0.6 },
        ],
        createdAt: new Date('2026-01-01T10:00:00Z'),
      },
    ]);
    const service = new PronunciationService(availableAsr as any, attempts as any);

    const history = await service.getHistory('learner-1');

    expect(attempts.find).toHaveBeenCalledWith({
      where: { learnerId: 'learner-1' },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    expect(history.summary).toEqual({
      totalAttempts: 2,
      averageScore: 50,
      bestScore: 60,
      weakWords: ['debug', 'ship', 'thread'],
    });
    expect(history.attempts[0]).toEqual(expect.objectContaining({
      id: 'a2',
      expected_text: 'debug the thread',
      overall_score: 60,
      created_at: '2026-01-02T10:00:00.000Z',
    }));
  });
});
