/**
 * `GET /learners/{learner_id}/next` — the i+1 selection using NextActivitySelector.
 *
 * This implementation uses the domain's NextActivitySelector with the curriculum graph
 * from the spec and learner model from the database.
 */

import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { LearnerScopeService } from '../learners/learner-scope.service.js';
import {
  NextActivitySelector,
  type NextActivitySelection,
  type LearnerModel,
} from '../../domain/services/next-activity-selector.js';
import type { CurriculumGraph } from '../../infrastructure/curriculum/curriculum-types.js';
import { parseCurriculumSpec } from '../../infrastructure/curriculum/curriculum-parser.js';
import { type FsrsStateName } from '../../domain/services/fsrs-scheduler.service.js';

interface MasteryRow {
  skill_id: string;
  p_know: number;
  n_obs: number;
  distinct_days: number;
  spaced_obs: number;
  last_practice_at: Date | null;
}

interface FsrsRow {
  item_id: string;
  stability: number;
  difficulty: number;
  state: number;
  grade: number | null;
  hint_used: boolean;
  last_review: Date;
  due_date: Date;
}

interface ThetaRow {
  skill_id: string;
  theta: number;
  se: number;
  ci95_lower: number;
  ci95_upper: number;
}

interface DiagnosticRow {
  id: string;
  cefr: string;
  theta_estimate: number;
  skill_theta: Record<string, { theta: number; se: number }>;
  completed_at: Date;
}

interface PracticeAttemptRow {
  pack_id: string;
  completed_at: Date | null;
}

@Injectable()
export class CurriculumService {
  private readonly curriculumGraph: CurriculumGraph;
  private readonly selector: NextActivitySelector;

  constructor(
    private readonly learnerScope: LearnerScopeService,
    @Inject(DataSource) private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    // Load curriculum graph from spec file
    this.curriculumGraph = this.loadCurriculumGraph();
    this.selector = new NextActivitySelector(this.curriculumGraph);
  }

  private loadCurriculumGraph(): CurriculumGraph {
    const specPath = this.configService.get<string>('CURRICULUM_SPEC_PATH') ||
      path.resolve('/home/dalmo/Documentos/Curso-de-Ingles/specs/curriculum-graph-spec.md');
    const markdown = fs.readFileSync(specPath, 'utf-8');
    return parseCurriculumSpec(markdown);
  }

  async getNextActivity(subject: string, learnerId: string, query: unknown): Promise<any> {
    // Verify learner visibility (RLS policy)
    await this.learnerScope.requireVisible(subject, learnerId);

    // Build learner model from database
    const learnerModel = await this.buildLearnerModel(learnerId);

    // Select next activity
    const selection: NextActivitySelection = this.selector.selectNextActivity(learnerModel);

    // Map to API response format
    const primary = selection.primary;
    return {
      activity_type: primary.activityType,
      activity_id: primary.activityId,
      rationale: {
        selection_rule: primary.rationale.selectionRule,
        mastery_gaps: primary.rationale.masteryGaps,
        i_plus_1: primary.rationale.iPlus1,
      },
      estimated_duration_minutes: primary.estimatedDurationMinutes,
      prerequisites_met: primary.prerequisitesMet,
    };
  }

  private async buildLearnerModel(learnerId: string): Promise<LearnerModel> {
    // Fetch all data in parallel
    const [
      masteryRows,
      fsrsRows,
      thetaRows,
      diagnosticRows,
      practiceRows,
    ] = await Promise.all([
      this.dataSource.query<MasteryRow[]>(
        `SELECT skill_id, p_know, n_obs, distinct_days, spaced_obs, last_practice_at
           FROM learner_mastery
          WHERE learner_id = $1`,
        [learnerId],
      ),
      this.dataSource.query<FsrsRow[]>(
        `SELECT item_id, stability, difficulty, state, grade, hint_used, last_review, due_date
           FROM fsrs_states
          WHERE learner_id = $1`,
        [learnerId],
      ),
      this.dataSource.query<ThetaRow[]>(
        `SELECT skill_id, theta, se, ci95_lower, ci95_upper
           FROM theta_estimates
          WHERE learner_id = $1`,
        [learnerId],
      ),
      this.dataSource.query<DiagnosticRow[]>(
        `SELECT id, cefr, theta_estimate, skill_theta, completed_at
           FROM diagnostic_results
          WHERE learner_id = $1
          ORDER BY completed_at DESC
          LIMIT 1`,
        [learnerId],
      ),
      this.dataSource.query<PracticeAttemptRow[]>(
        `SELECT pack_id, completed_at
           FROM practice_attempts
          WHERE learner_id = $1
          ORDER BY started_at DESC
          LIMIT 50`,
        [learnerId],
      ),
    ]);

    // Build mastery map
    const mastery = new Map<string, { pKnow: number; nObs: number; distinctDays: number; spacedObs: number; lastPracticeAt: Date | null }>();
    for (const row of masteryRows) {
      mastery.set(row.skill_id, {
        pKnow: Number(row.p_know),
        nObs: row.n_obs,
        distinctDays: row.distinct_days,
        spacedObs: row.spaced_obs,
        lastPracticeAt: row.last_practice_at,
      });
    }

    // Build FSRS states map
    const fsrsStates = new Map<string, {
      stability: number;
      difficulty: number;
      state: FsrsStateName;
      lastReview: Date;
      dueDate: Date;
      elapsedDays: number;
      scheduledDays: number;
      reps: number;
      lapses: number;
    }>();
    for (const row of fsrsRows) {
      fsrsStates.set(row.item_id, {
        stability: Number(row.stability),
        difficulty: Number(row.difficulty),
        state: ['new', 'learning', 'review', 'relearning'][row.state] as FsrsStateName,
        lastReview: row.last_review,
        dueDate: row.due_date,
        elapsedDays: 0,
        scheduledDays: 0,
        reps: 0,
        lapses: 0,
      });
    }

    // Build theta estimates map
    const thetaEstimates = new Map<string, { theta: number; se: number; ci95Lower: number; ci95Upper: number }>();
    for (const row of thetaRows) {
      thetaEstimates.set(row.skill_id, {
        theta: Number(row.theta),
        se: Number(row.se),
        ci95Lower: Number(row.ci95_lower),
        ci95Upper: Number(row.ci95_upper),
      });
    }

    // Determine current node from latest completed practice attempt
    let currentNodeId: string | null = null;
    for (const attempt of practiceRows) {
      if (attempt.completed_at && attempt.pack_id) {
        // Extract lesson_id from pack_id (pack_les_<lesson>_v1 -> les_<lesson>)
        const lessonMatch = attempt.pack_id.match(/pack[-_]les_([a-z0-9_]+)(?:_v\d+)?/);
        if (lessonMatch) {
          currentNodeId = `les_${lessonMatch[1]}`;
          break;
        }
      }
    }

    // Fallback to diagnostic start node
    if (!currentNodeId && diagnosticRows.length > 0) {
      const diag = diagnosticRows[0]!;
      // Use the CEFR level to find entry point
      const cefr = diag.cefr as 'A1' | 'A2' | 'B1' | 'B2';
      currentNodeId = this.curriculumGraph.entryPoints.get(`${cefr},General`) || null;
    }

    // Determine track (default to General)
    const track: 'General' | 'IT' = 'General';

    return {
      learnerId,
      currentNodeId,
      track,
      mastery,
      thetaEstimates,
      fsrsStates,
      affectiveSignals: [],
      currentLessonId: currentNodeId,
      timeBudgetMinutes: 30,
    };
  }
}