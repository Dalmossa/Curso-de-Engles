/**
 * ErrorLog Service — Write path for error logging and remediation ranking.
 *
 * Implements post-lesson-practice-spec.md §4.2:
 * - Writes {skill_id, pattern, produced_form, frequency, severity, first_seen, last_seen}
 * - Ranks by frequency × severity × recency for remediation generation
 * - Upserts on (learner_id, skill_id, pattern, produced_form) to aggregate
 */

import { ErrorLogEntry } from '../entities/learner-model.js';
import type { ErrorPattern } from '../entities/learner-model.js';

export type { ErrorPattern };
export { ErrorLogEntry };

export interface ErrorLogWriteInput {
  learnerId: string;
  skillId: string;
  pattern: ErrorPattern;
  producedForm: string;
  severity: number;  // 0.0–1.0, higher = more severe
  observedAt: Date;
}

export interface ErrorLogUpsertResult {
  entry: ErrorLogEntry;
  isNew: boolean;
  frequencyBefore: number;
  frequencyAfter: number;
}

export interface RemediationRankingInput {
  learnerId: string;
  skillId: string;
  limit?: number;  // default 6 per §4.2 step 4
}

export interface RankedErrorPattern {
  pattern: ErrorPattern;
  producedForm: string;
  frequency: number;
  severity: number;
  firstSeenAt: Date;
  lastSeenAt: Date;
  rankScore: number;  // frequency × severity × recency
}

/**
 * Generates a deterministic ID for an error log entry.
 * Based on learner + skill + pattern + producedForm (normalized).
 */
export function generateErrorLogId(
  learnerId: string,
  skillId: string,
  pattern: ErrorPattern,
  producedForm: string
): string {
  // Simple deterministic hash for upsert key
  const normalized = producedForm.toLowerCase().trim().replace(/\s+/g, '_');
  const str = `${learnerId}|${skillId}|${pattern}|${normalized}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `err_${Math.abs(hash).toString(36)}`;
}

/**
 * Recency weight: exponential decay based on days since last seen.
 * weight = exp(-λ * days) where λ = 0.1 (half-life ~7 days).
 */
export function computeRecencyWeight(lastSeenAt: Date, now: Date, lambda = 0.1): number {
  const days = (now.getTime() - lastSeenAt.getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-lambda * days);
}

/**
 * Upserts an error log entry.
 * If entry exists for (learner, skill, pattern, producedForm), increments frequency
 * and updates lastSeenAt. Otherwise creates new entry with frequency=1.
 */
export function upsertErrorLog(
  existingEntries: Map<string, ErrorLogEntry>,
  input: ErrorLogWriteInput
): ErrorLogUpsertResult {
  const { learnerId, skillId, pattern, producedForm, severity, observedAt } = input;
  const id = generateErrorLogId(learnerId, skillId, pattern, producedForm);

  const existing = existingEntries.get(id);

  if (existing) {
    // Update existing entry
    const newFrequency = existing.frequency + 1;
    const updatedEntry = new ErrorLogEntry(
      existing.id,
      existing.learnerId,
      existing.skillId,
      existing.pattern,
      existing.producedForm,
      newFrequency,
      // Severity: keep the maximum observed severity
      Math.max(existing.severity, severity),
      existing.firstSeenAt,
      observedAt  // Update lastSeenAt to most recent
    );

    existingEntries.set(id, updatedEntry);

    return {
      entry: updatedEntry,
      isNew: false,
      frequencyBefore: existing.frequency,
      frequencyAfter: newFrequency,
    };
  } else {
    // Create new entry
    const newEntry = new ErrorLogEntry(
      id,
      learnerId,
      skillId,
      pattern,
      producedForm,
      1,
      severity,
      observedAt,
      observedAt
    );

    existingEntries.set(id, newEntry);

    return {
      entry: newEntry,
      isNew: true,
      frequencyBefore: 0,
      frequencyAfter: 1,
    };
  }
}

/**
 * Batch upsert for multiple error observations in one session.
 * Returns all upserted/updated entries.
 */
export function upsertErrorLogBatch(
  existingEntries: Map<string, ErrorLogEntry>,
  inputs: ErrorLogWriteInput[]
): ErrorLogUpsertResult[] {
  return inputs.map(input => upsertErrorLog(existingEntries, input));
}

/**
 * Ranks error patterns for remediation generation.
 * Per post-lesson-practice-spec.md §4.2:
 * remediation_set(learner, skill) =
 *   1. Rank error_log entries for `skill` by (frequency × severity × recency)
 *   2. For each top error pattern, select IRT item with:
 *        - b closest to learner's current θ(skill) (challenge ≈ +0.3 logit)
 *        - distractor set containing the *specific wrong form* the learner produced
 *   3. Order by ascending b (easiest first)
 *   4. Cap at 6 items
 */
export function rankErrorPatternsForRemediation(
  entries: ErrorLogEntry[],
  input: RemediationRankingInput,
  now: Date = new Date()
): RankedErrorPattern[] {
  const { learnerId, skillId, limit = 6 } = input;

  // Filter for this learner and skill
  const filtered = entries.filter(
    e => e.learnerId === learnerId && e.skillId === skillId
  );

  // Compute rank score: frequency × severity × recency
  const ranked = filtered.map(entry => {
    const recencyWeight = computeRecencyWeight(entry.lastSeenAt, now);
    const rankScore = entry.frequency * entry.severity * recencyWeight;

    return {
      pattern: entry.pattern,
      producedForm: entry.producedForm,
      frequency: entry.frequency,
      severity: entry.severity,
      firstSeenAt: entry.firstSeenAt,
      lastSeenAt: entry.lastSeenAt,
      rankScore,
    };
  });

  // Sort by rankScore descending
  ranked.sort((a, b) => b.rankScore - a.rankScore);

  // Cap at limit
  return ranked.slice(0, limit);
}

/**
 * Gets remediation items for a skill based on ranked error patterns.
 * Returns item selection criteria for the item bank query.
 */
export interface RemediationItemCriteria {
  skillId: string;
  targetTheta: number;           // learner's current θ(skill) + 0.3
  errorPatterns: RankedErrorPattern[];
  maxItems: number;
}

export function buildRemediationCriteria(
  rankedPatterns: RankedErrorPattern[],
  currentTheta: number,
  maxItems = 6
): RemediationItemCriteria {
  return {
    skillId: rankedPatterns[0]?.pattern || '',
    targetTheta: currentTheta + 0.3,  // challenge ≈ +0.3 logit per §4.2
    errorPatterns: rankedPatterns,
    maxItems,
  };
}

/**
 * Maps error patterns to specific distractor requirements for remediation items.
 * Per §4.2 step 2: distractor set must contain the *specific wrong form*
 * the learner produced.
 */
export interface RemediationDistractorRequirement {
  pattern: ErrorPattern;
  producedForm: string;
  requiredDistractor: string;
}

export function getDistractorRequirements(
  rankedPatterns: RankedErrorPattern[]
): RemediationDistractorRequirement[] {
  return rankedPatterns.map(rp => ({
    pattern: rp.pattern,
    producedForm: rp.producedForm,
    requiredDistractor: rp.producedForm,  // The exact form the learner produced
  }));
}

/**
 * Error patterns from post-lesson-practice-spec.md §4.3 (content-map.md §9.1)
 * with their severity weights for ranking.
 */
export const ERROR_PATTERN_SEVERITY: Record<ErrorPattern, number> = {
  null_subject: 0.9,
  eventually: 0.7,
  responsible_of: 0.6,
  th_stopped: 0.8,
  w_v_interference: 0.85,
  false_cognate_activated: 0.75,
  spelling_no_epenthetic_vowel: 0.5,
  article_omission: 0.65,
};

/**
 * Gets default severity for an error pattern.
 */
export function getDefaultSeverity(pattern: ErrorPattern): number {
  return ERROR_PATTERN_SEVERITY[pattern] ?? 0.5;
}

/**
 * Infers error pattern from learner's response and correct answer.
 * Used when the system detects an error but pattern isn't explicitly classified.
 */
export function inferErrorPattern(
  skillId: string,
  producedForm: string,
  correctForm: string
): ErrorPattern | null {
  // Pronunciation patterns
  if (skillId.includes('th_') || skillId.includes('pron_')) {
    // Check for TH stopping: learner produces T/D instead of TH (Unicode or ASCII)
    // Check for Unicode THETA (θ), ETH (ð), or ASCII 'th'
    const hasThInCorrect = /[θð]/.test(correctForm) || /th/i.test(correctForm);
    if (/[td]/.test(producedForm) && hasThInCorrect) {
      return 'th_stopped';
    }
    if (/[wv]/.test(producedForm) && /[wv]/.test(correctForm) && producedForm !== correctForm) {
      return 'w_v_interference';
    }
  }

  // Grammar patterns
  if (skillId.includes('grammar') || skillId.includes('be_') || skillId.includes('subject')) {
    // Null subject: missing "it/there" at start
    if (producedForm.startsWith('is ') || producedForm.startsWith('are ') || producedForm.startsWith('was ')) {
      return 'null_subject';
    }
    // Article omission: check if correct form has article at start OR after copula (am/is/are/was/were)
    const correctHasArticleAtStart = /^(a|an|the)\s/i.test(correctForm);
    const correctHasArticleAfterCopula = /\b(am|is|are|was|were)\s+(a|an|the)\s/i.test(correctForm);
    const producedHasArticleAtStart = /^(a|an|the)\s/i.test(producedForm);
    const producedHasArticleAfterCopula = /\b(am|is|are|was|were)\s+(a|an|the)\s/i.test(producedForm);
    
    if ((correctHasArticleAtStart || correctHasArticleAfterCopula) && 
        !producedHasArticleAtStart && !producedHasArticleAfterCopula) {
      return 'article_omission';
    }
  }

  // False cognates
  const falseCognates = ['eventually', 'actually', 'pretend', 'realize', 'library'];
  for (const fc of falseCognates) {
    if (producedForm.toLowerCase().includes(fc) && !correctForm.toLowerCase().includes(fc)) {
      return 'false_cognate_activated';
    }
  }

  // Spelling: missing epenthetic vowel (Brazilian Portuguese adds vowel in consonant clusters)
  // e.g., "start" -> "estart", "school" -> "eschool", "blue" -> "blueu"
  if (producedForm.length > correctForm.length) {
    // Check for epenthetic vowel pattern: added vowel at start or between consonants
    const hasEpentheticVowel = /^[aeiou]/.test(producedForm) && !/^[aeiou]/.test(correctForm) ||
                               /[bcdfghjklmnpqrstvwxyz]{2,}/.test(correctForm) && 
                               /[aeiou]/.test(producedForm.slice(1));
    if (hasEpentheticVowel) {
      return 'spelling_no_epenthetic_vowel';
    }
  }

  // Responsible of -> responsible for
  if (producedForm.includes('responsible of') && correctForm.includes('responsible for')) {
    return 'responsible_of';
  }

  return null;
}

/**
 * Creates an ErrorLogWriteInput from a detected error during practice/assessment.
 */
export function createErrorLogInput(
  learnerId: string,
  skillId: string,
  producedForm: string,
  correctForm: string,
  observedAt: Date = new Date()
): ErrorLogWriteInput | null {
  const pattern = inferErrorPattern(skillId, producedForm, correctForm);
  if (!pattern) return null;

  return {
    learnerId,
    skillId,
    pattern,
    producedForm,
    severity: getDefaultSeverity(pattern),
    observedAt,
  };
}