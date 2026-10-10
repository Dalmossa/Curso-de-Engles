/**
 * Property-based tests for ErrorLog Service.
 * Tests upsert idempotency, ranking invariants, and remediation criteria.
 */

import fc from 'fast-check';
import {
  upsertErrorLog,
  upsertErrorLogBatch,
  rankErrorPatternsForRemediation,
  buildRemediationCriteria,
  getDistractorRequirements,
  getDefaultSeverity,
  inferErrorPattern,
  createErrorLogInput,
  generateErrorLogId,
  computeRecencyWeight,
  ERROR_PATTERN_SEVERITY,
  ErrorLogEntry,
  type ErrorLogWriteInput,
  type ErrorPattern,
  type RankedErrorPattern,
} from '@/domain/services/error-log.service.ts';

describe('ErrorLog Service — Property Tests', () => {
  // Valid error patterns from the ErrorPattern union type
  const validPatterns: ErrorPattern[] = [
    'null_subject',
    'eventually',
    'responsible_of',
    'th_stopped',
    'w_v_interference',
    'false_cognate_activated',
    'spelling_no_epenthetic_vowel',
    'article_omission',
  ];

  // --- Helper to create test entries ---
  const createEntry = (overrides: Partial<ErrorLogEntry> = {}): ErrorLogEntry => {
    return new ErrorLogEntry(
      overrides.id || 'test_id',
      overrides.learnerId || 'learner_1',
      overrides.skillId || 'grammar_present_simple_be',
      overrides.pattern || 'null_subject',
      overrides.producedForm || 'is raining',
      overrides.frequency ?? 1,
      overrides.severity ?? 0.5,
      overrides.firstSeenAt || new Date('2026-01-01'),
      overrides.lastSeenAt || new Date('2026-01-01')
    );
  };

  const createInput = (overrides: Partial<ErrorLogWriteInput> = {}): ErrorLogWriteInput => ({
    learnerId: 'learner_1',
    skillId: 'grammar_present_simple_be',
    pattern: 'null_subject',
    producedForm: 'is raining',
    severity: 0.5,
    observedAt: new Date(),
    ...overrides,
  });

  // --- generateErrorLogId ---

  it('generateErrorLogId: deterministic for same inputs', () => {
    const id1 = generateErrorLogId('learner_1', 'skill_1', 'null_subject', 'is raining');
    const id2 = generateErrorLogId('learner_1', 'skill_1', 'null_subject', 'is raining');
    expect(id1).toBe(id2);
  });

  it('generateErrorLogId: different for different inputs', () => {
    const id1 = generateErrorLogId('learner_1', 'skill_1', 'null_subject', 'is raining');
    const id2 = generateErrorLogId('learner_2', 'skill_1', 'null_subject', 'is raining');
    const id3 = generateErrorLogId('learner_1', 'skill_2', 'null_subject', 'is raining');
    const id4 = generateErrorLogId('learner_1', 'skill_1', 'eventually', 'is raining');
    const id5 = generateErrorLogId('learner_1', 'skill_1', 'null_subject', 'are raining');

    expect(new Set([id1, id2, id3, id4, id5]).size).toBe(5);
  });

  it('generateErrorLogId: normalizes producedForm (case, whitespace)', () => {
    const id1 = generateErrorLogId('l1', 's1', 'null_subject', 'Is Raining');
    const id2 = generateErrorLogId('l1', 's1', 'null_subject', 'is raining');
    const id3 = generateErrorLogId('l1', 's1', 'null_subject', '  is   raining  ');
    expect(id1).toBe(id2);
    expect(id2).toBe(id3);
  });

  // --- computeRecencyWeight ---

  it('computeRecencyWeight: returns 1 for same day', () => {
    const now = new Date();
    const weight = computeRecencyWeight(now, now);
    expect(weight).toBe(1);
  });

  it('computeRecencyWeight: decays exponentially with days', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const w1 = computeRecencyWeight(yesterday, now);
    const w7 = computeRecencyWeight(weekAgo, now);

    expect(w1).toBeLessThan(1);
    expect(w1).toBeGreaterThan(w7);
    expect(w7).toBeCloseTo(Math.exp(-0.1 * 7), 5);
  });

  it('computeRecencyWeight: never negative', () => {
    const now = new Date();
    const longAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const weight = computeRecencyWeight(longAgo, now);
    expect(weight).toBeGreaterThan(0);
  });

  // --- upsertErrorLog ---

  it('upsertErrorLog: creates new entry when none exists', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const input = createInput();

    const result = upsertErrorLog(entries, input);

    expect(result.isNew).toBe(true);
    expect(result.frequencyBefore).toBe(0);
    expect(result.frequencyAfter).toBe(1);
    expect(result.entry.frequency).toBe(1);
    expect(result.entry.severity).toBe(input.severity);
    expect(entries.size).toBe(1);
  });

  it('upsertErrorLog: increments frequency on existing entry', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const input = createInput();

    const r1 = upsertErrorLog(entries, input);
    expect(r1.isNew).toBe(true);
    expect(r1.frequencyAfter).toBe(1);

    const r2 = upsertErrorLog(entries, input);
    expect(r2.isNew).toBe(false);
    expect(r2.frequencyBefore).toBe(1);
    expect(r2.frequencyAfter).toBe(2);
    expect(r2.entry.frequency).toBe(2);
  });

  it('upsertErrorLog: updates lastSeenAt to most recent', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const baseTime = new Date('2026-01-01T10:00:00Z');
    const laterTime = new Date('2026-01-01T12:00:00Z');

    const input1 = createInput({ observedAt: baseTime });
    const r1 = upsertErrorLog(entries, input1);

    const input2 = createInput({ observedAt: laterTime });
    const r2 = upsertErrorLog(entries, input2);

    expect(r2.entry.lastSeenAt.getTime()).toBe(laterTime.getTime());
    expect(r2.entry.firstSeenAt.getTime()).toBe(baseTime.getTime());
  });

  it('upsertErrorLog: keeps maximum severity', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const input1 = createInput({ severity: 0.3 });
    const r1 = upsertErrorLog(entries, input1);

    const input2 = createInput({ severity: 0.8 });
    const r2 = upsertErrorLog(entries, input2);

    expect(r2.entry.severity).toBe(0.8);

    const input3 = createInput({ severity: 0.5 });
    const r3 = upsertErrorLog(entries, input3);
    expect(r3.entry.severity).toBe(0.8);
  });

  it('upsertErrorLog: different producedForm creates separate entries', () => {
    const entries = new Map<string, ErrorLogEntry>();

    const input1 = createInput({ producedForm: 'is raining' });
    const r1 = upsertErrorLog(entries, input1);

    const input2 = createInput({ producedForm: 'are raining' });
    const r2 = upsertErrorLog(entries, input2);

    expect(entries.size).toBe(2);
    expect(r1.entry.producedForm).toBe('is raining');
    expect(r2.entry.producedForm).toBe('are raining');
  });

  // --- upsertErrorLogBatch ---

  it('upsertErrorLogBatch: processes all inputs', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const inputs = [
      createInput({ producedForm: 'error1' }),
      createInput({ producedForm: 'error2' }),
      createInput({ producedForm: 'error1' }),
    ];

    const results = upsertErrorLogBatch(entries, inputs);

    expect(results.length).toBe(3);
    expect(results[0]?.isNew).toBe(true);
    expect(results[1]?.isNew).toBe(true);
    expect(results[2]?.isNew).toBe(false);
    expect(entries.size).toBe(2);
  });

  // --- rankErrorPatternsForRemediation ---

  it('rankErrorPatternsForRemediation: sorts by frequency × severity × recency', () => {
    const now = new Date();
    const entries: ErrorLogEntry[] = [
      createEntry({ skillId: 'skill_1', pattern: 'th_stopped', frequency: 10, severity: 0.5, lastSeenAt: now }),
      createEntry({ skillId: 'skill_1', pattern: 'eventually', frequency: 5, severity: 0.9, lastSeenAt: now }),
      createEntry({ skillId: 'skill_1', pattern: 'w_v_interference', frequency: 8, severity: 0.7, lastSeenAt: now }),
    ];

    const ranked = rankErrorPatternsForRemediation(entries, {
      learnerId: 'learner_1',
      skillId: 'skill_1',
      limit: 10,
    });

    // w_v: 8 * 0.7 = 5.6
    // th_stopped: 10 * 0.5 = 5.0
    // eventually: 5 * 0.9 = 4.5
    expect(ranked.length).toBeGreaterThanOrEqual(3);
    expect(ranked[0]?.pattern).toBe('w_v_interference');
    expect(ranked[1]?.pattern).toBe('th_stopped');
    expect(ranked[2]?.pattern).toBe('eventually');
  });

  it('rankErrorPatternsForRemediation: recency affects ranking', () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const entries: ErrorLogEntry[] = [
      createEntry({ skillId: 'skill_1', pattern: 'article_omission', frequency: 10, severity: 0.9, lastSeenAt: weekAgo }),
      createEntry({ skillId: 'skill_1', pattern: 'null_subject', frequency: 5, severity: 0.5, lastSeenAt: now }),
    ];

    const ranked = rankErrorPatternsForRemediation(entries, {
      learnerId: 'learner_1',
      skillId: 'skill_1',
    });

    // old_high: 10 * 0.9 * exp(-0.7) ≈ 9 * 0.496 = 4.47
    // new_low: 5 * 0.5 * 1.0 = 2.5
    expect(ranked[0]?.pattern).toBe('article_omission');
  });

  it('rankErrorPatternsForRemediation: filters by learnerId and skillId', () => {
    const now = new Date();
    const entries: ErrorLogEntry[] = [
      createEntry({ learnerId: 'l1', skillId: 's1', pattern: 'null_subject' }),
      createEntry({ learnerId: 'l1', skillId: 's2', pattern: 'eventually' }),
      createEntry({ learnerId: 'l2', skillId: 's1', pattern: 'responsible_of' }),
      createEntry({ learnerId: 'l1', skillId: 's1', pattern: 'th_stopped' }),
    ];

    const ranked = rankErrorPatternsForRemediation(entries, {
      learnerId: 'l1',
      skillId: 's1',
    });

    expect(ranked.length).toBe(2);
    const patterns = ranked.map((r: RankedErrorPattern) => r.pattern).sort();
    expect(patterns).toEqual(['null_subject', 'th_stopped']);
  });

  it('rankErrorPatternsForRemediation: respects limit', () => {
    const now = new Date();
    const entries: ErrorLogEntry[] = validPatterns.map((p, i) =>
      createEntry({ skillId: 'skill_1', pattern: p, frequency: 10 - i, lastSeenAt: now })
    );

    const ranked = rankErrorPatternsForRemediation(entries, {
      learnerId: 'learner_1',
      skillId: 'skill_1',
      limit: 3,
    });

    expect(ranked.length).toBe(3);
    expect(ranked[0]?.pattern).toBe('null_subject');
    expect(ranked[1]?.pattern).toBe('eventually');
    expect(ranked[2]?.pattern).toBe('responsible_of');
  });

  it('rankErrorPatternsForRemediation: default limit is 6', () => {
    const now = new Date();
    const entries: ErrorLogEntry[] = validPatterns.map((p, i) =>
      createEntry({ skillId: 'skill_1', pattern: p, frequency: 10 - i, lastSeenAt: now })
    );

    const ranked = rankErrorPatternsForRemediation(entries, {
      learnerId: 'learner_1',
      skillId: 'skill_1',
    });

    expect(ranked.length).toBe(6);
  });

  // --- buildRemediationCriteria ---

  it('buildRemediationCriteria: targetTheta = currentTheta + 0.3', () => {
    const ranked: RankedErrorPattern[] = [
      { pattern: 'null_subject', producedForm: 'f1', frequency: 5, severity: 0.8, firstSeenAt: new Date(), lastSeenAt: new Date(), rankScore: 4 },
    ];

    const criteria = buildRemediationCriteria(ranked, 0.5, 6);
    expect(criteria.targetTheta).toBe(0.8);
  });

  it('buildRemediationCriteria: uses first pattern skillId', () => {
    const ranked: RankedErrorPattern[] = [
      { pattern: 'null_subject', producedForm: 'f1', frequency: 5, severity: 0.8, firstSeenAt: new Date(), lastSeenAt: new Date(), rankScore: 4 },
    ];

    const criteria = buildRemediationCriteria(ranked, 0.5, 6);
    expect(criteria.skillId).toBe('null_subject');
  });

  it('buildRemediationCriteria: respects maxItems', () => {
    const ranked: RankedErrorPattern[] = validPatterns.map((p, i) => ({
      pattern: p, producedForm: `f${i}`, frequency: 1, severity: 0.5,
      firstSeenAt: new Date(), lastSeenAt: new Date(), rankScore: 1,
    }));

    const criteria = buildRemediationCriteria(ranked, 0.5, 3);
    expect(criteria.maxItems).toBe(3);
    expect(criteria.errorPatterns.length).toBe(8);
  });

  // --- getDistractorRequirements ---

  it('getDistractorRequirements: maps producedForm to requiredDistractor', () => {
    const ranked: RankedErrorPattern[] = [
      { pattern: 'null_subject', producedForm: 'is raining', frequency: 5, severity: 0.8, firstSeenAt: new Date(), lastSeenAt: new Date(), rankScore: 4 },
      { pattern: 'th_stopped', producedForm: 'sink', frequency: 3, severity: 0.7, firstSeenAt: new Date(), lastSeenAt: new Date(), rankScore: 2.1 },
    ];

    const requirements = getDistractorRequirements(ranked);

    expect(requirements.length).toBe(2);
    expect(requirements[0]?.requiredDistractor).toBe('is raining');
    expect(requirements[1]?.requiredDistractor).toBe('sink');
    expect(requirements[0]?.pattern).toBe('null_subject');
  });

  // --- getDefaultSeverity ---

  it('getDefaultSeverity: returns configured severity for each pattern', () => {
    expect(getDefaultSeverity('null_subject')).toBe(0.9);
    expect(getDefaultSeverity('th_stopped')).toBe(0.8);
    expect(getDefaultSeverity('w_v_interference')).toBe(0.85);
    expect(getDefaultSeverity('eventually')).toBe(0.7);
    expect(getDefaultSeverity('responsible_of')).toBe(0.6);
    expect(getDefaultSeverity('false_cognate_activated')).toBe(0.75);
    expect(getDefaultSeverity('spelling_no_epenthetic_vowel')).toBe(0.5);
    expect(getDefaultSeverity('article_omission')).toBe(0.65);
  });

  it('getDefaultSeverity: returns 0.5 for unknown pattern', () => {
    expect(getDefaultSeverity('unknown_pattern' as ErrorPattern)).toBe(0.5);
  });

  // --- inferErrorPattern ---

  it('inferErrorPattern: detects th_stopped (TH -> T/D)', () => {
    // Use Unicode THETA (θ U+03B8) or ETH (ð U+00F0) in correct form, or ASCII 'th'
    const theta = String.fromCharCode(0x03B8); // θ
    const eth = String.fromCharCode(0x00F0);   // ð
    expect(inferErrorPattern('pron_th_voiced', 'dis', eth + 'is')).toBe('th_stopped');
    expect(inferErrorPattern('pron_th_unvoiced', 'sink', theta + 'ink')).toBe('th_stopped');
    // Also test with ASCII 'th'
    expect(inferErrorPattern('pron_th_voiced', 'dis', 'this')).toBe('th_stopped');
    expect(inferErrorPattern('pron_th_unvoiced', 'sink', 'think')).toBe('th_stopped');
  });

  it('inferErrorPattern: detects w_v_interference', () => {
    expect(inferErrorPattern('pron_w_v', 'wery', 'very')).toBe('w_v_interference');
    expect(inferErrorPattern('pron_w_v', 'vine', 'wine')).toBe('w_v_interference');
  });

  it('inferErrorPattern: detects null_subject (missing it/there)', () => {
    expect(inferErrorPattern('grammar_be_affirmative', 'is raining', 'it is raining')).toBe('null_subject');
    expect(inferErrorPattern('grammar_be_affirmative', 'are students', 'there are students')).toBe('null_subject');
  });

  it('inferErrorPattern: detects article_omission', () => {
    expect(inferErrorPattern('grammar_articles', 'I am engineer', 'I am an engineer')).toBe('article_omission');
  });

  it('inferErrorPattern: detects false_cognate_activated', () => {
    expect(inferErrorPattern('vocab_false_cognates', 'eventually I will go', 'maybe I will go')).toBe('false_cognate_activated');
    expect(inferErrorPattern('vocab_false_cognates', 'actually I work here', 'currently I work here')).toBe('false_cognate_activated');
  });

  it('inferErrorPattern: detects responsible_of', () => {
    expect(inferErrorPattern('grammar_prepositions', 'I am responsible of the team', 'I am responsible for the team')).toBe('responsible_of');
  });

  it('inferErrorPattern: detects spelling_no_epenthetic_vowel', () => {
    expect(inferErrorPattern('spelling_clusters', 'estart', 'start')).toBe('spelling_no_epenthetic_vowel');
  });

  it('inferErrorPattern: returns null for unrecognized', () => {
    expect(inferErrorPattern('unknown_skill', 'foo', 'bar')).toBeNull();
  });

  // --- createErrorLogInput ---

  it('createErrorLogInput: returns input with inferred pattern and severity', () => {
    const input = createErrorLogInput('l1', 'grammar_be', 'is raining', 'it is raining');
    expect(input).not.toBeNull();
    expect(input?.pattern).toBe('null_subject');
    expect(input?.severity).toBe(0.9);
    expect(input?.producedForm).toBe('is raining');
  });

  it('createErrorLogInput: returns null when pattern not inferred', () => {
    const input = createErrorLogInput('l1', 'unknown_skill', 'foo', 'bar');
    expect(input).toBeNull();
  });

  // --- ERROR_PATTERN_SEVERITY ---

  it('ERROR_PATTERN_SEVERITY: all patterns have severity in [0, 1]', () => {
    for (const [, severity] of Object.entries(ERROR_PATTERN_SEVERITY)) {
      expect(severity).toBeGreaterThanOrEqual(0);
      expect(severity).toBeLessThanOrEqual(1);
    }
  });

  // --- Integration: Full upsert + rank cycle ---

  it('full cycle: upsert multiple errors then rank for remediation', () => {
    const entries = new Map<string, ErrorLogEntry>();

    const baseInput = createInput({
      learnerId: 'l1',
      skillId: 'grammar_be',
      pattern: 'null_subject',
      producedForm: 'is raining',
    });

    upsertErrorLog(entries, { ...baseInput, observedAt: new Date('2026-01-01'), severity: 0.9 });
    upsertErrorLog(entries, { ...baseInput, observedAt: new Date('2026-01-02'), severity: 0.9 });
    upsertErrorLog(entries, { ...baseInput, pattern: 'article_omission', producedForm: 'am engineer', observedAt: new Date('2026-01-03'), severity: 0.65 });

    const entryArray = Array.from(entries.values());

    const ranked = rankErrorPatternsForRemediation(entryArray, {
      learnerId: 'l1',
      skillId: 'grammar_be',
    });

    expect(ranked.length).toBe(2);
    expect(ranked[0]?.pattern).toBe('null_subject');
    expect(ranked[0]?.frequency).toBe(2);
    expect(ranked[1]?.pattern).toBe('article_omission');
    expect(ranked[1]?.frequency).toBe(1);
  });

  it('full cycle: remediation criteria includes distractor requirements', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const baseInput = createInput({
      learnerId: 'l1',
      skillId: 'grammar_be',
      pattern: 'null_subject',
      producedForm: 'is raining',
    });

    upsertErrorLog(entries, baseInput);
    upsertErrorLog(entries, baseInput);

    const entryArray = Array.from(entries.values());
    const ranked = rankErrorPatternsForRemediation(entryArray, {
      learnerId: 'l1',
      skillId: 'grammar_be',
    });

    const criteria = buildRemediationCriteria(ranked, -0.5);
    const distractors = getDistractorRequirements(ranked);

    expect(criteria.targetTheta).toBe(-0.2);
    expect(distractors[0]?.requiredDistractor).toBe('is raining');
    expect(distractors[0]?.pattern).toBe('null_subject');
  });

  // --- Edge Cases ---

  it('upsertErrorLog: handles rapid successive calls (same timestamp)', () => {
    const entries = new Map<string, ErrorLogEntry>();
    const sameTime = new Date('2026-01-01T10:00:00Z');

    const input = createInput({ observedAt: sameTime });
    upsertErrorLog(entries, input);
    upsertErrorLog(entries, input);
    upsertErrorLog(entries, input);

    const entry = entries.values().next().value;
    expect(entry?.frequency).toBe(3);
    expect(entry?.lastSeenAt).toEqual(sameTime);
  });

  it('rankErrorPatternsForRemediation: empty entries returns empty', () => {
    const ranked = rankErrorPatternsForRemediation([], {
      learnerId: 'l1',
      skillId: 's1',
    });
    expect(ranked).toHaveLength(0);
  });

  it('rankErrorPatternsForRemediation: no matching learner/skill returns empty', () => {
    const entries = [createEntry({ learnerId: 'l2', skillId: 's2' })];
    const ranked = rankErrorPatternsForRemediation(entries, {
      learnerId: 'l1',
      skillId: 's1',
    });
    expect(ranked).toHaveLength(0);
  });
});