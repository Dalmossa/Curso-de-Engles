import type {
  ContentRepository,
  CurriculumRepository,
  LearnerRepository,
  PlacementRepository,
  PracticeRepository,
  SpeechRepository,
} from '@/core';
import { GetLearnerDashboard } from './use-cases/get-learner-dashboard';
import { GetLesson, GetMasteryScreenData } from './use-cases/get-lesson';
import { GetPracticePack, SubmitPractice } from './use-cases/submit-practice';
import { RunDiagnostic } from './use-cases/run-diagnostic';
import { SynthesizeSpeech } from './use-cases/synthesize-speech';
import { EvaluatePronunciation } from './use-cases/evaluate-pronunciation';

/**
 * What the application layer needs from the outside world. An interface, not the
 * concrete HTTP repositories: this is the seam the tests substitute, and the reason
 * `application` never imports `infrastructure`.
 */
export interface Repositories {
  readonly learners: LearnerRepository;
  readonly curriculum: CurriculumRepository;
  readonly content: ContentRepository;
  readonly practice: PracticeRepository;
  readonly placement: PlacementRepository;
  readonly speech: SpeechRepository;
}

export interface UseCases {
  readonly getLearnerDashboard: GetLearnerDashboard;
  readonly getMasteryScreenData: GetMasteryScreenData;
  readonly getLesson: GetLesson;
  readonly getPracticePack: GetPracticePack;
  readonly submitPractice: SubmitPractice;
  readonly runDiagnostic: RunDiagnostic;
  readonly synthesizeSpeech: SynthesizeSpeech;
  readonly evaluatePronunciation: EvaluatePronunciation;
}

/**
 * Composition inside the layer: use cases are constructed from ports and nothing else.
 * Which adapter satisfies the port is decided one layer out (`infrastructure/composition`),
 * so a server render and a test differ only in that decision.
 */
export function createUseCases(repositories: Repositories): UseCases {
  return {
    getLearnerDashboard: new GetLearnerDashboard(repositories.learners, repositories.curriculum),
    getMasteryScreenData: new GetMasteryScreenData(repositories.learners),
    getLesson: new GetLesson(repositories.content),
    getPracticePack: new GetPracticePack(repositories.content),
    submitPractice: new SubmitPractice(repositories.practice),
    runDiagnostic: new RunDiagnostic(repositories.placement),
    synthesizeSpeech: new SynthesizeSpeech(repositories.speech),
    evaluatePronunciation: new EvaluatePronunciation(repositories.speech),
  };
}
