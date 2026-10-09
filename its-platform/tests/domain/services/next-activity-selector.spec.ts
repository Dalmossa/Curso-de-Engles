import { NextActivitySelector } from '../../../src/domain/services/next-activity-selector.js';
import { MasteryGateService, buildMasteryEvidence } from '../../../src/domain/services/mastery-gate.service.js';
import { LearnerMastery } from '../../../src/domain/entities/learner-model.js';
import { CurriculumGraph, CurriculumNode, CurriculumEdge } from '../../../src/infrastructure/curriculum/curriculum-types.js';
import { parseCurriculumSpec } from '../../../src/infrastructure/curriculum/curriculum-parser.js';
import type { NextActivityCandidate } from '../../../src/domain/services/next-activity-selector.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('NextActivitySelector', () => {
  let selector: NextActivitySelector;
  let curriculumGraph: CurriculumGraph;

  beforeAll(() => {
    // Load the real curriculum graph for testing
    const markdown = readFileSync(resolve(__dirname, '../../../../specs/curriculum-graph-spec.md'), 'utf-8');
    curriculumGraph = parseCurriculumSpec(markdown);
    selector = new NextActivitySelector(curriculumGraph);
  });

  const createLearnerModel = (overrides: Partial<{
    currentNodeId: string | null;
    track: 'General' | 'IT';
    mastery: Map<string, { pKnow: number; nObs: number; distinctDays: number; spacedObs: number; lastPracticeAt: Date | null }>;
    fsrsStates: Map<string, { stability: number; difficulty: number; lastReview: Date; dueDate: Date }>;
  }> = {}) => {
    const now = new Date('2026-10-08T12:00:00Z');
    
    // Default mastery for A1 skills
    const defaultMastery = new Map<string, { pKnow: number; nObs: number; distinctDays: number; spacedObs: number; lastPracticeAt: Date | null }>([
      ['present_simple_be', { pKnow: 0.90, nObs: 5, distinctDays: 3, spacedObs: 2, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['wh_questions_how', { pKnow: 0.85, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['greetings_vocab', { pKnow: 0.88, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['th_voiced', { pKnow: 0.80, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['th_unvoiced', { pKnow: 0.78, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['h_aspirated', { pKnow: 0.75, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['present_simple', { pKnow: 0.82, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['past_simple', { pKnow: 0.60, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['weekend_vocab', { pKnow: 0.55, nObs: 2, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
      ['connected_speech', { pKnow: 0.50, nObs: 2, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date('2026-10-08T10:00:00Z') }],
    ]);

    return {
      learnerId: 'test-learner-1',
      currentNodeId: overrides.currentNodeId ?? 'les_a1_greetings',
      track: overrides.track ?? 'General',
      mastery: overrides.mastery ?? defaultMastery,
      thetaEstimates: new Map(),
      fsrsStates: overrides.fsrsStates ?? new Map(),
      affectiveSignals: [],
      currentLessonId: null,
      timeBudgetMinutes: 15,
    };
  };

  describe('selectNextActivity()', () => {
    it('returns a lesson when at entry point with no current node', () => {
      const learner = createLearnerModel({ currentNodeId: null });
      const selection = selector.selectNextActivity(learner);
      
      expect(selection.primary).toBeDefined();
      expect(selection.primary.activityType).toBe('lesson');
      expect(selection.primary.nodeId).toBe('les_a1_alphabet_sounds'); // A1 General entry point
      expect(selection.selectionMetadata.availableNodes).toBeGreaterThan(0);
    });

    it('returns next lesson in sequence after completing les_a1_greetings', () => {
      const learner = createLearnerModel({ currentNodeId: 'les_a1_greetings' });
      const selection = selector.selectNextActivity(learner);
      
      expect(selection.primary).toBeDefined();
      expect(selection.primary.activityType).toBe('lesson');
      // Should be next lesson in mod_a1_foundation: les_a1_intro_dialogue
      expect(selection.primary.nodeId).toBe('les_a1_intro_dialogue');
    });

    it('respects track (General vs IT) when selecting next activity', () => {
      const learner = createLearnerModel({ track: 'IT', currentNodeId: 'les_a1_comm_basic' });
      const selection = selector.selectNextActivity(learner);
      
      // Should go to IT track entry: mod_a2_it_fundamentals -> les_a2_it_terms_basics
      // But since at A1, should still be on A1 track
      expect(selection.primary.track).toBe('IT');
    });

    it('filters out lessons where prerequisites are not met', () => {
      // Create learner with low mastery on prerequisites for les_a2_greetings_intro
      const learner = createLearnerModel({
        currentNodeId: 'les_a1_comm_basic', // Last A1 lesson
        mastery: new Map([
          ['present_simple_be', { pKnow: 0.50, nObs: 2, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }],
          ['wh_questions_how', { pKnow: 0.50, nObs: 2, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }],
          ['greetings_vocab', { pKnow: 0.50, nObs: 2, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }],
          ['th_voiced', { pKnow: 0.40, nObs: 1, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }],
          ['th_unvoiced', { pKnow: 0.40, nObs: 1, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }],
          ['h_aspirated', { pKnow: 0.40, nObs: 1, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }],
        ])
      });
      
      const selection = selector.selectNextActivity(learner);
      
      // Should NOT suggest les_a2_greetings_intro (A2 entry) because prereqs not met
      // Should suggest remediation or stay on A1
      expect(selection.primary.nodeId).not.toBe('les_a2_greetings_intro');
    });

    it('suggests remediation when mastery is declining', () => {
      const learner = createLearnerModel({
        currentNodeId: 'les_a2_greetings_intro',
        mastery: new Map([
          ['present_simple_be', { pKnow: 0.70, nObs: 5, distinctDays: 3, spacedObs: 2, lastPracticeAt: new Date() }],
          ['wh_questions_how', { pKnow: 0.60, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['greetings_vocab', { pKnow: 0.65, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['th_voiced', { pKnow: 0.30, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }], // Very low
          ['th_unvoiced', { pKnow: 0.25, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }], // Very low
          ['h_aspirated', { pKnow: 0.35, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
        ])
      });
      
      const selection = selector.selectNextActivity(learner);
      
      // Should suggest remediation for pronunciation (th_voiced, th_unvoiced)
      expect(selection.primary.rationale.selectionRule).toBe('remediation');
      expect(selection.primary.rationale.masteryGaps).toContain('th_voiced');
    });

    it('includes spaced review items when FSRS items are due', () => {
      const dueDate = new Date('2026-10-08T10:00:00Z'); // Due now
      const fsrsStates = new Map([
        ['vocab_greetings_hello', { stability: 5.0, difficulty: 5.0, lastReview: new Date('2026-10-01'), dueDate }],
      ]);
      
      const learner = createLearnerModel({ fsrsStates });
      const selection = selector.selectNextActivity(learner);
      
      // Should have review item as alternative
      const hasReview = selection.alternatives.some((a: NextActivityCandidate) => a.activityType === 'review');
      expect(hasReview).toBe(true);
    });

    it('prefers i+1 activities (new skills at right difficulty)', () => {
      // Learner has mastered present_simple_be but not past_simple
      const learner = createLearnerModel({
        currentNodeId: 'les_a1_greetings',
        mastery: new Map([
          ['present_simple_be', { pKnow: 0.95, nObs: 5, distinctDays: 3, spacedObs: 2, lastPracticeAt: new Date() }],
          ['wh_questions_how', { pKnow: 0.90, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['greetings_vocab', { pKnow: 0.92, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['th_voiced', { pKnow: 0.88, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['th_unvoiced', { pKnow: 0.85, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['h_aspirated', { pKnow: 0.80, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['past_simple', { pKnow: 0.40, nObs: 2, distinctDays: 1, spacedObs: 0, lastPracticeAt: new Date() }], // Ready for i+1
        ])
      });
      
      const selection = selector.selectNextActivity(learner);
      
      // Should pick a lesson that introduces past_simple (i+1)
      expect(selection.primary.rationale.iPlus1).toBe(true);
      expect(selection.primary.rationale.selectionRule).toBe('i_plus_1');
    });

    it('returns alternatives ranked by score', () => {
      const learner = createLearnerModel();
      const selection = selector.selectNextActivity(learner);
      
      expect(selection.alternatives.length).toBeGreaterThan(0);
      expect(selection.alternatives.length).toBeLessThanOrEqual(3);
      
      // Alternatives should be sorted by score (highest first)
      for (let i = 0; i < selection.alternatives.length - 1; i++) {
        const altA = selection.alternatives[i]!;
        const altB = selection.alternatives[i + 1]!;
        const scoreA = altA.rationale.fsrsPriority * 3 + 
                       altA.rationale.masteryGapPriority * 5;
        const scoreB = altB.rationale.fsrsPriority * 3 + 
                       altB.rationale.masteryGapPriority * 5;
        expect(scoreA).toBeGreaterThanOrEqual(scoreB);
      }
    });

    it('includes metadata in selection result', () => {
      const learner = createLearnerModel();
      const selection = selector.selectNextActivity(learner);
      
      expect(selection.selectionMetadata.learnerId).toBe('test-learner-1');
      expect(selection.selectionMetadata.track).toBe('General');
      expect(selection.selectionMetadata.currentNodeId).toBe('les_a1_greetings');
      expect(typeof selection.selectionMetadata.availableNodes).toBe('number');
      expect(typeof selection.selectionMetadata.filteredByGate).toBe('number');
    });
  });

  describe('track switching', () => {
    it('allows IT track learner to access General track content', () => {
      const learner = createLearnerModel({ 
        track: 'IT', 
        currentNodeId: 'les_a1_comm_basic' 
      });
      const selection = selector.selectNextActivity(learner);
      
      // IT track can access General track
      expect(selection.primary).toBeDefined();
    });

    it('respects module sequence constraints', () => {
      const learner = createLearnerModel({ currentNodeId: 'les_a1_greetings' });
      const selection = selector.selectNextActivity(learner);
      
      // Next lesson should be in same module (mod_a1_foundation)
      expect(selection.primary.nodeId).toBe('les_a1_intro_dialogue');
      
      // After mod_a1_foundation, should go to mod_a1_grammar_start
      const learner2 = createLearnerModel({ currentNodeId: 'les_a1_articles_nouns' }); // Last in mod_a1_foundation
      const selection2 = selector.selectNextActivity(learner2);
      expect(selection2.primary.nodeId).toBe('les_a1_to_be_forms'); // First in mod_a1_grammar_start
    });
  });

  describe('remediation triggering', () => {
    it('triggers remediation for pronunciation when theta < -1.5', () => {
      const overrideMastery = new Map([
        ['present_simple_be', { pKnow: 0.80, nObs: 5, distinctDays: 3, spacedObs: 2, lastPracticeAt: new Date() }],
        ['wh_questions_how', { pKnow: 0.75, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
        ['greetings_vocab', { pKnow: 0.78, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
        ['th_voiced', { pKnow: 0.15, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }],
        ['th_unvoiced', { pKnow: 0.20, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }],
        ['h_aspirated', { pKnow: 0.65, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
      ]);
      console.log('[TEST DEBUG] override mastery th_voiced:', overrideMastery.get('th_voiced'));
      console.log('[TEST DEBUG] override mastery th_unvoiced:', overrideMastery.get('th_unvoiced'));
      const learner = createLearnerModel({
        currentNodeId: 'les_a2_greetings_intro',
        mastery: overrideMastery,
      });
      
      const selection = selector.selectNextActivity(learner);
      
      // Should suggest remediation for pronunciation
      expect(selection.primary.rationale.selectionRule).toBe('remediation');
      expect(selection.primary.rationale.masteryGaps).toContain('th_voiced');
    });

    it('triggers remediation for listening when theta < -1.5', () => {
      const learner = createLearnerModel({
        currentNodeId: 'les_a2_greetings_intro',
        mastery: new Map([
          ['present_simple_be', { pKnow: 0.80, nObs: 5, distinctDays: 3, spacedObs: 2, lastPracticeAt: new Date() }],
          ['wh_questions_how', { pKnow: 0.75, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['greetings_vocab', { pKnow: 0.78, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
          ['listening', { pKnow: 0.20, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }], // Very low -> remediation
        ])
      });
      
      const selection = selector.selectNextActivity(learner);
      
      expect(selection.primary.rationale.selectionRule).toBe('remediation');
      expect(selection.primary.rationale.masteryGaps).toContain('listening');
    });
  });
});