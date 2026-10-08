import { MasteryGateService, buildMasteryEvidence } from '../../../src/domain/services/mastery-gate.service.js';
import { LearnerMastery } from '../../../src/domain/entities/learner-model.js';

describe('MasteryGateService', () => {
  let service: MasteryGateService;

  beforeEach(() => {
    service = new MasteryGateService();
  });

  const createEvidence = (overrides: Partial<{
    pKnow: number;
    nObs: number;
    distinctDays: number;
    spacedObs: number;
    domain: string;
    observations: Array<{ skillId: string; practicedAt: Date }>;
  }> = {}) => {
    const now = new Date('2026-10-08T12:00:00Z');
    const mastery = new LearnerMastery(
      'learner-1',
      'vocabulary',
      overrides.pKnow ?? 0.90,
      overrides.nObs ?? 5,
      overrides.distinctDays ?? 3,
      overrides.spacedObs ?? 2,
      new Date('2026-10-08T10:00:00Z'),
      new Date('2026-10-08T12:00:00Z')
    );
    return buildMasteryEvidence(
      mastery,
      overrides.observations ?? [
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T10:00:00Z') },
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-07T10:00:00Z') },
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-06T10:00:00Z') },
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-05T10:00:00Z') },
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-04T10:00:00Z') },
      ],
      overrides.domain ?? 'vocabulary',
      new Date('2026-10-08T12:00:00Z')
    );
  };

  describe('evaluate()', () => {
    it('passes all clauses for strong evidence (p=0.90, 5 obs, 3 days, 2 spaced)', () => {
      const evidence = createEvidence({ pKnow: 0.90, nObs: 5, distinctDays: 3, spacedObs: 2 });
      const result = service.evaluate(evidence);
      
      expect(result.passed).toBe(true);
      expect(result.clauses.numeric).toBe(true);
      expect(result.clauses.confidence).toBe(true);
      expect(result.clauses.nObs).toBe(true);
      expect(result.clauses.distinctDays).toBe(true);
      expect(result.clauses.spacedObs).toBe(true);
    });

    it('fails numeric clause when pKnow < 0.85', () => {
      const evidence = createEvidence({ pKnow: 0.82 });
      const result = service.evaluate(evidence);
      
      expect(result.passed).toBe(false);
      expect(result.clauses.numeric).toBe(false);
      // With pKnow=0.82, CI lower may also be < 0.70 depending on n_eff
      // The key assertion is that numeric fails
    });

    it('fails confidence clause when CI lower bound ≤ 0.70', () => {
      // Use lower pKnow with same-day observations to get CI lower ≤ 0.70
      const evidence = createEvidence({
        pKnow: 0.83,
        nObs: 3,
        distinctDays: 1,
        spacedObs: 0,
        observations: [
          { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T10:00:00Z') },
          { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T09:00:00Z') },
          { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T08:00:00Z') },
        ]
      });
      const result = service.evaluate(evidence);
      
      expect(result.passed).toBe(false);
      expect(result.clauses.confidence).toBe(false);
    });

    it('fails nObs clause when nObs < 3', () => {
      const evidence = createEvidence({ nObs: 2 });
      const result = service.evaluate(evidence);
      
      expect(result.passed).toBe(false);
      expect(result.clauses.nObs).toBe(false);
    });

    it('fails distinctDays clause when distinctDays < 2', () => {
      const evidence = createEvidence({ distinctDays: 1 });
      const result = service.evaluate(evidence);
      
      expect(result.passed).toBe(false);
      expect(result.clauses.distinctDays).toBe(false);
    });

    it('fails spacedObs clause when spacedObs < 1', () => {
      const evidence = createEvidence({ spacedObs: 0 });
      const result = service.evaluate(evidence);
      
      expect(result.passed).toBe(false);
      expect(result.clauses.spacedObs).toBe(false);
    });

    it('respects domain-specific lambda (grammar decays slower)', () => {
      const now = new Date('2026-10-08T12:00:00Z');
      const observations = [
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T10:00:00Z') },
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-06T10:00:00Z') },
        { skillId: 'vocabulary', practicedAt: new Date('2026-10-04T10:00:00Z') },
      ];
      
      const vocabEvidence = {
        pKnow: 0.86,
        nObs: 3,
        distinctDays: 3,
        spacedObs: 2,
        observations,
        domain: 'vocabulary',
        now,
      };
      
      const grammarEvidence = {
        pKnow: 0.86,
        nObs: 3,
        distinctDays: 3,
        spacedObs: 2,
        observations: observations.map(o => ({ ...o, skillId: 'grammar' })),
        domain: 'grammar',
        now,
      };

      const vocabResult = service.evaluate(vocabEvidence);
      const grammarResult = service.evaluate(grammarEvidence);

      // Grammar has lower lambda -> higher n_eff -> tighter CI -> more likely to pass confidence
      expect(grammarResult.diagnostics.nEff).toBeGreaterThan(vocabResult.diagnostics.nEff);
      expect(grammarResult.diagnostics.cI95Lower).toBeGreaterThan(vocabResult.diagnostics.cI95Lower);
    });
  });

  describe('evaluateAll()', () => {
    it('evaluates multiple skills and returns map', () => {
      const evidenceMap = new Map([
        ['vocabulary', createEvidence({ domain: 'vocabulary' })],
        ['grammar', createEvidence({ pKnow: 0.80, domain: 'grammar' })],
      ]);
      const results = service.evaluateAll(evidenceMap);
      
      expect(results.size).toBe(2);
      expect(results.get('vocabulary')!.passed).toBe(true);
      expect(results.get('grammar')!.passed).toBe(false);
    });
  });

  describe('allPass()', () => {
    it('returns true when all skills pass', () => {
      const evidenceMap = new Map([
        ['vocabulary', createEvidence({ pKnow: 0.90, domain: 'vocabulary' })],
        ['grammar', createEvidence({ pKnow: 0.88, domain: 'grammar' })],
      ]);
      expect(service.allPass(new Map([
        ['vocabulary', createEvidence({ pKnow: 0.90, domain: 'vocabulary' })],
        ['grammar', createEvidence({ pKnow: 0.88, domain: 'grammar' })],
      ]))).toBe(true);
    });

    it('returns false when any skill fails', () => {
      expect(service.allPass(new Map([
        ['vocabulary', createEvidence({ pKnow: 0.90, domain: 'vocabulary' })],
        ['grammar', createEvidence({ pKnow: 0.80, domain: 'grammar' })],
      ]))).toBe(false);
    });
  });

  describe('evaluateModuleGate()', () => {
    it('passes when mean ≥ 0.85 and min ≥ 0.60', () => {
      const evidences = [
        createEvidence({ pKnow: 0.90, domain: 'vocabulary' }),
        createEvidence({ pKnow: 0.88, domain: 'grammar' }),
        createEvidence({ pKnow: 0.85, domain: 'pronunciation' }),
      ];
      const result = service.evaluateModuleGate(evidences);
      
      expect(result.passed).toBe(true);
      expect(result.meanP).toBeCloseTo(0.877, 2);
      expect(result.minP).toBe(0.85);
    });

    it('fails when mean < 0.85', () => {
      const evidences = [
        createEvidence({ pKnow: 0.80, domain: 'vocabulary' }),
        createEvidence({ pKnow: 0.85, domain: 'grammar' }),
      ];
      const result = service.evaluateModuleGate(evidences);
      
      expect(result.passed).toBe(false);
    });

    it('fails when min < 0.60', () => {
      const evidences = [
        createEvidence({ pKnow: 0.90, domain: 'vocabulary' }),
        createEvidence({ pKnow: 0.55, domain: 'grammar' }),
      ];
      const result = service.evaluateModuleGate(evidences);
      
      expect(result.passed).toBe(false);
    });
  });

  describe('evaluateAccelerationGate()', () => {
    const skillEvidences = [
      createEvidence({ pKnow: 0.96, domain: 'vocabulary' }),
      createEvidence({ pKnow: 0.97, domain: 'grammar' }),
    ];
    const diagnosticTheta = new Map([['vocabulary', 1.2], ['grammar', 1.3]]);
    const lessonTargetTheta = new Map([['vocabulary', 1.0], ['grammar', 1.1]]);

    it('passes when all criteria met', () => {
      const result = service.evaluateAccelerationGate(
        skillEvidences,
        5, // 5 min on lesson
        15, // 15 min median
        diagnosticTheta,
        lessonTargetTheta
      );
      
      expect(result.passed).toBe(true);
      expect(result.diagnostics).toHaveLength(0);
    });

    it('fails when pKnow < 0.95', () => {
      const result = service.evaluateAccelerationGate(
        [createEvidence({ pKnow: 0.93, domain: 'vocabulary' })],
        5, 15, new Map([['vocabulary', 1.2]]), new Map([['vocabulary', 1.0]])
      );
      
      expect(result.passed).toBe(false);
      expect(result.diagnostics.some((d: string) => d.includes('< 0.95'))).toBe(true);
    });

    it('fails when CI lower ≤ 0.85', () => {
      // Use lower pKnow with same-day observations to get CI lower ≤ 0.85
      const evidence = {
        pKnow: 0.88,
        nObs: 3,
        distinctDays: 1,
        spacedObs: 0,
        observations: [
          { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T10:00:00Z') },
          { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T09:00:00Z') },
          { skillId: 'vocabulary', practicedAt: new Date('2026-10-08T08:00:00Z') },
        ],
        domain: 'vocabulary',
        now: new Date('2026-10-08T12:00:00Z'),
      };
      const result = service.evaluateAccelerationGate(
        [evidence],
        5, 15, new Map([['vocabulary', 1.2]]), new Map([['vocabulary', 1.0]])
      );
      
      expect(result.passed).toBe(false);
      expect(result.diagnostics.some((d: string) => d.includes('CI95_lower'))).toBe(true);
    });

    it('fails when time_on_lesson ≥ 0.5 * median', () => {
      const result = service.evaluateAccelerationGate(
        skillEvidences,
        10, // 10 min on lesson
        15, // 15 min median -> 10 >= 7.5
        diagnosticTheta,
        lessonTargetTheta
      );
      
      expect(result.passed).toBe(false);
      expect(result.diagnostics.some((d: string) => d.includes('time'))).toBe(true);
    });

    it('fails when diagnostic θ ≤ target θ', () => {
      const result = service.evaluateAccelerationGate(
        skillEvidences,
        5, 15,
        new Map([['vocabulary', 0.8]]), // below target
        new Map([['vocabulary', 1.0]])
      );
      
      expect(result.passed).toBe(false);
      expect(result.diagnostics.some((d: string) => d.includes('theta'))).toBe(true);
    });
  });
});