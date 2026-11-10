// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { clampMastery, isMasteryPassing, masteryBand, MASTERY_GATE, summarizeMastery } from '@/core';

describe('mastery', () => {
  it('uses gate 0.85 as per contract', () => {
    expect(MASTERY_GATE).toBe(0.85);
    expect(isMasteryPassing(0.85)).toBe(true);
    expect(isMasteryPassing(0.849)).toBe(false);
  });

  it('clamps values', () => {
    expect(clampMastery(-1)).toBe(0);
    expect(clampMastery(2)).toBe(1);
    expect(clampMastery(NaN)).toBe(0);
  });

  it('computes bands correctly', () => {
    expect(masteryBand(0)).toBe('not_started');
    expect(masteryBand(0.4)).toBe('emerging');
    expect(masteryBand(0.6)).toBe('developing');
    expect(masteryBand(0.8)).toBe('approaching');
    expect(masteryBand(0.85)).toBe('mastered');
    expect(masteryBand(1)).toBe('mastered');
  });

  it('summarizes mastery', () => {
    const summary = summarizeMastery({ grammar: 0.9, vocab: 0.5 });
    expect(summary.entries).toHaveLength(2);
    expect(summary.passedCount).toBe(1);
    expect(summary.gaps).toContain('vocab');
    expect(summary.allPassed).toBe(false);
  });
});
