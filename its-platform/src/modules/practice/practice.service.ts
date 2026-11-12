import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { LearnerScopeService } from '../learners/learner-scope.service.js';
import { ContentService } from '../content/content.service.js';
import type { PracticeSubmissionDto } from './dto/practice-submission.dto.js';
import {
  bktUpdate,
  initializeBktState,
  computeGuessProbability,
  checkMasteryGate,
  type BktSkillParam,
  type BktState,
  type MasteryGateResult,
} from '../../domain/services/bkt-engine.service.js';
import { LearnerMastery } from '../../domain/entities/learner-model.js';
import {
  createFsrsScheduler,
  type FsrsCardState,
  type FsrsReviewOutput,
  type FsrsReviewInput,
  type FsrsStateName,
  type FsrsRating,
} from '../../domain/services/fsrs-scheduler.service.js';

/** Pack item with key for grading. */
interface PackItemWithKey {
  id: string;
  item_type: string;
  skill_ids: string[];
  domain_id: string;
  scoring: string;
  stem: string;
  key: string | null;
  p_random: number;
}

/** Pack with items for grading. */
interface PackForGrading {
  id: string;
  lesson_id: string;
  items: PackItemWithKey[];
}

/** Session row. */
interface SessionRow {
  id: string;
  learner_id: string;
  started_at: Date;
  ended_at: Date | null;
}

/** Learner mastery row. */
interface LearnerMasteryRow {
  learner_id: string;
  skill_id: string;
  p_know: number;
  n_obs: number;
  distinct_days: number;
  spaced_obs: number;
  last_practice_at: Date | null;
  updated_at: Date;
}

/** FSRS state row. */
interface FsrsStateRow {
  learner_id: string;
  item_id: string;
  stability: number;
  difficulty: number;
  state: number;
  grade: number | null;
  hint_used: boolean;
  last_review: Date;
  due_date: Date;
  w_version: string;
  updated_at: Date;
}

@Injectable()
export class PracticeService {
  constructor(
    private readonly learnerScope: LearnerScopeService,
    private readonly contentService: ContentService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  /**
   * Grades a practice submission and persists results.
   *
   * Flow:
   * 1. Verify learner visibility (RLS)
   * 2. Fetch pack content with item keys
   * 3. Grade each response
   * 4. Create session (or reuse active)
   * 5. Create practice_attempt
   * 6. Create item_responses with BKT prior/posterior
   * 7. Update learner_mastery per skill using BKT
   * 8. Update FSRS states for choice items
   * 9. Return PracticeResult
   */
  async submitPractice(subject: string, id: string, body: PracticeSubmissionDto) {
    // 1. Verify learner visibility (RLS policy)
    await this.learnerScope.requireVisible(subject, id);

    // 2. Fetch pack with items and keys
    const pack = await this.getPackForGrading(body.pack_id);
    if (!pack) {
      throw new Error(`Pack not found: ${body.pack_id}`);
    }

    // 3. Grade responses
    const gradedItems = this.gradeResponses(pack.items, body.responses);

    // 4-8. Persist everything in a transaction
    const result = await this.dataSource.transaction(async (manager) => {
      // Get or create session
      const session = await this.getOrCreateSession(manager, id);

      // Create practice attempt
      const attempt = await this.createPracticeAttempt(manager, session.id, id, body.pack_id, gradedItems);

      // Create item responses and update mastery
      const masteryUpdates = await this.processItemResponses(manager, attempt.id, id, gradedItems);

      // Update FSRS for choice items
      await this.updateFsrsStates(manager, id, gradedItems);

      // Build next review schedule
      const nextReviewSchedule = await this.buildNextReviewSchedule(manager, id, masteryUpdates);

      return {
        pack_id: body.pack_id,
        scored_items: gradedItems.map(item => ({
          item_id: item.itemId,
          correct: item.correct,
          skill: item.skill,
          bkt_update: item.bktUpdate,
        })),
        mastery_updates: masteryUpdates,
        next_review_schedule: nextReviewSchedule,
      };
    });

    return result;
  }

  /**
   * Fetches pack with items including keys for grading.
   * Uses raw SQL to get the `key` column which ContentService doesn't expose.
   */
  private async getPackForGrading(packId: string): Promise<PackForGrading | null> {
    const packRows = await this.dataSource.query(
      `SELECT id, lesson_id, item_ids
         FROM packs
        WHERE id = $1`,
      [packId],
    );
    const pack = packRows[0];
    if (!pack) return null;

    const itemIds = Array.isArray(pack.item_ids) ? pack.item_ids : [];
    if (itemIds.length === 0) {
      return { id: pack.id, lesson_id: pack.lesson_id, items: [] };
    }

    const items = await this.dataSource.query(
      `SELECT id, item_type, skill_ids, domain_id, scoring, stem, key, p_random
         FROM items
        WHERE id = ANY($1)`,
      [itemIds],
    );

    // Order items by pack's item_ids order
    const position = new Map<string, number>(itemIds.map((itemId: string, index: number) => [itemId, index]));
    const orderedItems = items
      .sort((a: { id: string }, b: { id: string }) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0))
      .map((item: any) => ({
        id: item.id,
        item_type: item.item_type,
        skill_ids: item.skill_ids,
        domain_id: item.domain_id,
        scoring: item.scoring,
        stem: item.stem,
        key: item.key,
        p_random: Number(item.p_random),
      }));

    return {
      id: pack.id,
      lesson_id: pack.lesson_id,
      items: orderedItems,
    };
  }

  /**
   * Grades user responses against correct answers.
   */
  private gradeResponses(
    packItems: PackItemWithKey[],
    responses: PracticeSubmissionDto['responses'],
  ): Array<{
    itemId: string;
    correct: boolean | null;
    skill: string;
    bktUpdate: { prior: number; posterior: number; transition: 'learned' | 'retained' | 'forgot' | 'guessed' };
    response: string | { transcript?: string; audioRef?: string };
    responseTimeMs: number;
    confidence?: number;
  }> {
    const responseMap = new Map(responses.map(r => [r.item_id, r]));

    return packItems.map(item => {
      const response = responseMap.get(item.id);
      const skill = item.skill_ids[0]?.split('.')[0] ?? 'vocab';

      // For choice items, compare selected letter with key
      // For free_text/asr_phoneme_match, correct is null (async scoring)
      let correct: boolean | null = null;

      if (item.scoring === 'choice' && response && typeof response.response === 'string') {
        correct = response.response === item.key;
      } else if (item.scoring !== 'choice') {
        // Production items: correct is null (scored asynchronously)
        correct = null;
      }

      // Get learner's current mastery for this skill (will be fetched in transaction)
      // For now, use defaults - actual BKT update happens in transaction with real mastery data
      const guessProb = computeGuessProbability(item.item_type, 4); // default 4 options
      const initialState: BktState = {
        pKnow: 0.15, // DEFAULT_BKT_PARAMS.pL0
        pLearn: 0.25, // DEFAULT_BKT_PARAMS.pT
        pSlip: 0.10, // DEFAULT_BKT_PARAMS.pS
        pGuess: guessProb,
      };

      // If correct is null (production), don't update BKT
      const bktState = correct !== null ? bktUpdate(initialState, correct) : initialState;
      const transition = this.deriveTransition(initialState.pKnow, bktState.pKnow, correct);

      const result: {
        itemId: string;
        correct: boolean | null;
        skill: string;
        bktUpdate: { prior: number; posterior: number; transition: 'learned' | 'retained' | 'forgot' | 'guessed' };
        response: string | { transcript?: string; audioRef?: string };
        responseTimeMs: number;
        confidence?: number;
      } = {
        itemId: item.id,
        correct,
        skill,
        bktUpdate: {
          prior: initialState.pKnow,
          posterior: bktState.pKnow,
          transition,
        },
        response: response?.response ?? '',
        responseTimeMs: response?.response_time_ms ?? 0,
      };
      if (response?.confidence !== undefined) {
        result.confidence = response.confidence;
      }
      return result;
    });
  }

  /**
   * Derives BKT transition label from prior/posterior and correctness.
   */
  private deriveTransition(
    prior: number,
    posterior: number,
    correct: boolean | null,
  ): 'learned' | 'retained' | 'forgot' | 'guessed' {
    if (correct === null) return 'learned'; // production items default

    const improved = posterior > prior + 0.01;
    const declined = posterior < prior - 0.01;

    if (correct) {
      return improved ? 'learned' : 'retained';
    } else {
      return declined ? 'forgot' : 'guessed';
    }
  }

  /**
   * Gets or creates an active session for the learner.
   */
  private async getOrCreateSession(manager: any, learnerId: string): Promise<SessionRow> {
    // Try to find an active session (no ended_at) in the last 24 hours
    const activeSessions = await manager.query(
      `SELECT id, learner_id, started_at, ended_at
         FROM sessions
        WHERE learner_id = $1
          AND ended_at IS NULL
          AND started_at > NOW() - INTERVAL '24 hours'
        ORDER BY started_at DESC
        LIMIT 1`,
      [learnerId],
    );

    if (activeSessions.length > 0) {
      return activeSessions[0];
    }

    // Create new session
    const newSessions = await manager.query(
      `INSERT INTO sessions (learner_id, started_at)
       VALUES ($1, NOW())
       RETURNING id, learner_id, started_at, ended_at`,
      [learnerId],
    );
    return newSessions[0];
  }

  /**
   * Creates a practice attempt record.
   */
  private async createPracticeAttempt(
    manager: any,
    sessionId: string,
    learnerId: string,
    packId: string,
    gradedItems: Array<{ correct: boolean | null }>,
  ) {
    const totalItems = gradedItems.length;
    const correctCount = gradedItems.filter(i => i.correct === true).length;

    const attempts = await manager.query(
      `INSERT INTO practice_attempts (session_id, learner_id, pack_layer, pack_id, started_at, completed_at, total_items, correct_count)
       VALUES ($1, $2, 'L1', $3, NOW(), NOW(), $4, $5)
       RETURNING id, session_id, learner_id, pack_layer, pack_id, started_at, completed_at, total_items, correct_count`,
      [sessionId, learnerId, packId, totalItems, correctCount],
    );
    return attempts[0];
  }

  /**
   * Processes item responses: creates item_responses and updates learner_mastery.
   */
  private async processItemResponses(
    manager: any,
    attemptId: string,
    learnerId: string,
    gradedItems: Array<{
      itemId: string;
      correct: boolean | null;
      skill: string;
      bktUpdate: { prior: number; posterior: number; transition: string };
      response: string | { transcript?: string; audioRef?: string };
      responseTimeMs: number;
      confidence?: number;
    }>,
  ) {
    const skillUpdates = new Map<string, { before: number; after: number; gatePassed: boolean }>();

    for (const item of gradedItems) {
      const skillId = item.skill;
      const prior = item.bktUpdate.prior;
      const posterior = item.bktUpdate.posterior;
      const correct = item.correct;

      // Get current mastery for this skill
      const masteryRows = await manager.query(
        `SELECT p_know, n_obs, distinct_days, spaced_obs, last_practice_at
           FROM learner_mastery
          WHERE learner_id = $1 AND skill_id = $2`,
        [learnerId, skillId],
      );

      let currentMastery: { pKnow: number; nObs: number; distinctDays: number; spacedObs: number; lastPracticeAt: Date | null } | null = null;
      if (masteryRows.length > 0) {
        const row = masteryRows[0];
        currentMastery = {
          pKnow: Number(row.p_know),
          nObs: row.n_obs,
          distinctDays: row.distinct_days,
          spacedObs: row.spaced_obs,
          lastPracticeAt: row.last_practice_at,
        };
      }

      // Initialize BKT state with current mastery
      const guessProb = 0.25; // default, will be overridden per item in real implementation
      const bktParams: BktSkillParam = {
        skillId,
        pL0: 0.15,
        pT: 0.25,
        pS: 0.10,
        pG: guessProb,
        source: 'judgement_anchor',
        fittedAt: null,
        modelVersion: '1.0',
      };

      const bktState = initializeBktState(
        skillId,
        currentMastery
          ? new LearnerMastery(
              learnerId,
              skillId,
              currentMastery.pKnow,
              currentMastery.nObs,
              currentMastery.distinctDays,
              currentMastery.spacedObs,
              currentMastery.lastPracticeAt,
              new Date(),
            )
          : null,
        bktParams,
        guessProb,
      );
      // Override pKnow with actual prior from grading
      bktState.pKnow = prior;

      // Update BKT if scored
      let updatedState = bktState;
      if (correct !== null) {
        updatedState = bktUpdate(bktState, correct);
      }

      // Check mastery gate
      const newNobs = (currentMastery?.nObs ?? 0) + (correct !== null ? 1 : 0);
      const newDistinctDays = currentMastery?.distinctDays ?? 0;
      const newSpacedObs = currentMastery?.spacedObs ?? 0;
      const gate = checkMasteryGate(updatedState.pKnow, newNobs, newDistinctDays, newSpacedObs);

      // Track skill update
      const before = currentMastery?.pKnow ?? 0.15;
      skillUpdates.set(skillId, {
        before,
        after: updatedState.pKnow,
        gatePassed: gate.passes,
      });

      // Create item_response
      const responseText = typeof item.response === 'string' ? item.response : item.response.transcript ?? '';
      await manager.query(
        `INSERT INTO item_responses (attempt_id, learner_id, item_id, response, correct, response_time_ms, confidence, bkt_prior, bkt_posterior)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          attemptId,
          learnerId,
          item.itemId,
          responseText,
          correct,
          item.responseTimeMs,
          item.confidence ?? null,
          prior,
          updatedState.pKnow,
        ],
      );

      // Upsert learner_mastery
      await manager.query(
        `INSERT INTO learner_mastery (learner_id, skill_id, p_know, n_obs, distinct_days, spaced_obs, last_practice_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (learner_id, skill_id) DO UPDATE SET
           p_know = $3,
           n_obs = $4,
           distinct_days = $5,
           spaced_obs = $6,
           last_practice_at = NOW(),
           updated_at = NOW()`,
        [
          learnerId,
          skillId,
          updatedState.pKnow,
          newNobs,
          newDistinctDays,
          newSpacedObs,
        ],
      );
    }

    // Convert to mastery_updates format
    return Array.from(skillUpdates.entries()).map(([skill, update]) => ({
      skill,
      mastery_before: update.before,
      mastery_after: update.after,
      gate_passed: update.gatePassed,
    }));
  }

  /**
   * Updates FSRS states for choice items.
   */
  private async updateFsrsStates(
    manager: any,
    learnerId: string,
    gradedItems: Array<{
      itemId: string;
      correct: boolean | null;
      skill: string;
      bktUpdate: { prior: number; posterior: number; transition: string };
    }>,
  ) {
    const scheduler = createFsrsScheduler();

    for (const item of gradedItems) {
      if (item.correct === null) continue; // Skip production items

      // Get current FSRS state
      const fsrsRows = await manager.query(
        `SELECT stability, difficulty, state, grade, hint_used, last_review, due_date, w_version
           FROM fsrs_states
          WHERE learner_id = $1 AND item_id = $2`,
        [learnerId, item.itemId],
      );

      let cardState: FsrsCardState;
      if (fsrsRows.length > 0) {
        const row = fsrsRows[0];
        cardState = {
          stability: Number(row.stability),
          difficulty: Number(row.difficulty),
          state: row.state as FsrsStateName,
          lastReview: row.last_review,
          dueDate: row.due_date,
          elapsedDays: 0,
          scheduledDays: 0,
          reps: 0,
          lapses: 0,
        };
      } else {
        // New card - get initial state from scheduler
        const grade = item.correct ? 3 : 1;
        cardState = scheduler.getInitialState(grade as FsrsRating, new Date());
      }

      // Grade: 1=Again, 2=Hard, 3=Good, 4=Easy
      // For now: correct -> 3 (Good), incorrect -> 1 (Again)
      const grade = item.correct ? 3 : 1;

      const reviewInput: FsrsReviewInput = {
        cardState,
        rating: grade as FsrsRating,
        now: new Date(),
      };

      const result: FsrsReviewOutput = scheduler.review(reviewInput);

      await manager.query(
        `INSERT INTO fsrs_states (learner_id, item_id, stability, difficulty, state, grade, hint_used, last_review, due_date, w_version, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, '4.5.0', NOW())
         ON CONFLICT (learner_id, item_id) DO UPDATE SET
           stability = $3,
           difficulty = $4,
           state = $5,
           grade = $6,
           hint_used = $7,
           last_review = $8,
           due_date = $9,
           updated_at = NOW()`,
        [
          learnerId,
          item.itemId,
          result.stability,
          result.difficulty,
          result.state,
          grade,
          false,
          new Date(),
          result.dueDate,
        ],
      );
    }
  }

  /**
   * Builds next review schedule from FSRS due items.
   */
  private async buildNextReviewSchedule(
    manager: any,
    learnerId: string,
    masteryUpdates: Array<{ skill: string; mastery_after: number; gate_passed: boolean }>,
  ) {
    const now = new Date();
    const fsrsRows = await manager.query(
      `SELECT skill_id, item_id, due_date, stability
         FROM fsrs_states fs
         JOIN items i ON i.id = fs.item_id
        WHERE fs.learner_id = $1
          AND fs.due_date <= $2
          AND i.skill_ids IS NOT NULL
        ORDER BY fs.due_date ASC
        LIMIT 20`,
      [learnerId, now],
    );

    const scheduleMap = new Map<string, { nextReviewAt: Date; intervalDays: number }>();

    for (const row of fsrsRows) {
      const skillIds = row.skill_id; // This is item_id, we need to get skill from items
      // Get skill from item
      const itemRows = await manager.query(
        `SELECT skill_ids FROM items WHERE id = $1`,
        [row.item_id],
      );
      if (itemRows.length === 0) continue;
      const skill = itemRows[0].skill_ids[0]?.split('.')[0] ?? 'vocab';

      const dueDate = new Date(row.due_date);
      const intervalDays = Math.max(1, Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      if (!scheduleMap.has(skill) || dueDate < scheduleMap.get(skill)!.nextReviewAt) {
        scheduleMap.set(skill, { nextReviewAt: dueDate, intervalDays });
      }
    }

    return Array.from(scheduleMap.entries()).map(([skill, sched]) => ({
      skill,
      next_review_at: sched.nextReviewAt.toISOString(),
      interval_days: sched.intervalDays,
    }));
  }
}