import { NextActivitySelector } from './its-platform/dist/domain/services/next-activity-selector.js';
import { parseCurriculumSpec } from './its-platform/dist/infrastructure/curriculum/curriculum-parser.js';
import { readFileSync } from 'fs';

const markdown = readFileSync('./specs/curriculum-graph-spec.md', 'utf-8');
const graph = parseCurriculumSpec(markdown);

const learner = {
  learnerId: 'test-learner-1',
  currentNodeId: 'les_a2_greetings_intro',
  track: 'General',
  mastery: new Map([
    ['present_simple_be', { pKnow: 0.80, nObs: 5, distinctDays: 3, spacedObs: 2, lastPracticeAt: new Date() }],
    ['wh_questions_how', { pKnow: 0.75, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
    ['greetings_vocab', { pKnow: 0.78, nObs: 4, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
    ['th_voiced', { pKnow: 0.15, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }],
    ['th_unvoiced', { pKnow: 0.20, nObs: 3, distinctDays: 3, spacedObs: 1, lastPracticeAt: new Date() }],
    ['h_aspirated', { pKnow: 0.65, nObs: 3, distinctDays: 2, spacedObs: 1, lastPracticeAt: new Date() }],
  ]),
  thetaEstimates: new Map(),
  fsrsStates: new Map(),
  affectiveSignals: [],
  currentLessonId: null,
  timeBudgetMinutes: 15,
};

const selector = new NextActivitySelector(graph);
const selection = selector.selectNextActivity(learner);
console.log('Primary:', selection.primary.activityType, selection.primary.nodeId, selection.primary.rationale.selectionRule);
console.log('Mastery gaps:', selection.primary.rationale.masteryGaps);
console.log('Alternatives:');
for (const alt of selection.alternatives) {
  console.log('  ', alt.nodeId, alt.rationale.selectionRule);
}
