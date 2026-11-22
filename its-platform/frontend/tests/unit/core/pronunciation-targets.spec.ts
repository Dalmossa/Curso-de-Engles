// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { LessonContent, LessonPhase } from '@/core';
import { extractPronunciationTargets, getFirstTargets, getTargetsByPhase } from '@/core/services/pronunciation-targets';

function lessonWithPhases(phases: readonly LessonPhase[]): LessonContent {
  return {
    lessonId: 'les_test_targets',
    title: 'Test targets',
    cefrLevel: 'A1',
    reuseBasis: 'authored_material',
    authoringState: 'authored',
    publicationState: 'publishable',
    phases,
    learnerModel: null,
  };
}

function phase(phaseNumber: number, markdown: string, heading = `Phase ${phaseNumber}`): LessonPhase {
  return { phase: phaseNumber, heading, markdown };
}

describe('extractPronunciationTargets', () => {
  it('extracts pronounceable sentences from lesson phases in order (compatibility)', () => {
    const lesson = lessonWithPhases([
      phase(
        2,
        'This is a complete sentence. Another sentence follows here. Short.',
        'Practice',
      ),
      phase(3, 'Please read this line aloud carefully. It helps pronunciation.', 'Output'),
    ]);

    const targets = extractPronunciationTargets(lesson);

    expect(targets.map((t) => t.text)).toEqual([
      'This is a complete sentence.',
      'Another sentence follows here.',
      'Please read this line aloud carefully.',
      'It helps pronunciation.',
    ]);
    expect(targets.every((t) => t.phase === 2 || t.phase === 3)).toBe(true);
  });

  it('extracts dialogue turns from phase 1 blockquotes in document order', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '### Scenario',
          '',
          '> **Ana (dev):** "Good morning. Can you help me?"',
          '>',
          '> **Bruno (IT):** "Sure. Go ahead."',
          '>',
          '> **Ana:** "My name is Ana Silva."',
          '',
          'Some extra context.',
        ].join('\n'),
        'Input',
      ),
      phase(2, 'Guided practice text is here.', 'Practice'),
      phase(3, 'Output task text is here.', 'Output'),
      phase(4, 'Quick check text is here.', 'Check'),
    ]);

    const targets = extractPronunciationTargets(lesson);
    const phase1 = targets.filter((t) => t.phase === 1).map((t) => t.text);

    expect(phase1.slice(0, 3)).toEqual([
      'Good morning. Can you help me?',
      'Sure. Go ahead.',
      'My name is Ana Silva.',
    ]);
  });

  it('extracts speakable English-column terms from phase 1 tables and deduplicates in order', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '### Glossário contrastivo (pt-BR ↔ en-US)',
          '',
          '| Inglês (en-US) | Português (pt-BR) | Nota |',
          '|---|---|---|',
          '| **Good morning** | bom dia | Saudação |',
          '| **Nice to meet you** | prazer | Primeiro contato |',
          '| **Good morning** | repetido | deve deduplicar |',
          '| **Hi / Hello** | oi / olá | Informal |',
          '',
          '> **Ana:** "Good morning everyone here."',
          '>',
          '> **Bruno:** "Nice to meet you today."',
        ].join('\n'),
        'Input',
      ),
      phase(2, 'Practice sentence goes here.', 'Practice'),
      phase(3, 'Output sentence goes here.', 'Output'),
      phase(4, 'Check sentence goes here.', 'Check'),
    ]);

    const targets = extractPronunciationTargets(lesson).filter((t) => t.phase === 1);
    const texts = targets.map((t) => t.text);

    expect(texts).toContain('Good morning');
    expect(texts).toContain('Nice to meet you');
    expect(texts).toContain('Hi / Hello');
    expect(texts.filter((t) => t.toLowerCase() === 'good morning')).toHaveLength(1);
    // Table terms come before the dialogue block in markdown, so order preserved.
    expect(texts.indexOf('Good morning')).toBeLessThan(texts.indexOf('Good morning everyone here.'));
  });

  it('extracts alphabet letters from phase 1 alphabet tables as isolated A-Z targets, deduplicated and ordered', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '### Alfabeto',
          '',
          '| Letter | Name |',
          '|---|---|',
          '| C | cee |',
          '| A | ay |',
          '| B | bee |',
          '| A | ay |',
        ].join('\n'),
        'Input',
      ),
      phase(2, 'Practice sentence goes here.', 'Practice'),
      phase(3, 'Output sentence goes here.', 'Output'),
      phase(4, 'Check sentence goes here.', 'Check'),
    ]);

    const texts = extractPronunciationTargets(lesson).filter((t) => t.phase === 1).map((t) => t.text);
    expect(texts).toEqual(['A', 'B', 'C']);
  });

  it('extracts glossary/term tables by header tokens (Letter/Letra/Expressão/Termo)', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '| Expressão | PT-BR |',
          '|---|---|',
          '| **pull request** | solicitação de mudança |',
          '| **deploy** | implantação |',
        ].join('\n'),
        'Input',
      ),
      phase(2, 'Practice sentence goes here.', 'Practice'),
      phase(3, 'Output sentence goes here.', 'Output'),
      phase(4, 'Check sentence goes here.', 'Check'),
    ]);
    const texts = extractPronunciationTargets(lesson).map((t) => t.text);
    expect(texts).toContain('pull request');
    expect(texts).toContain('deploy');
  });

  it('keeps only first occurrence when dialogue and table produce same normalized text', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '> **A:** "Hello there."',
          '>',
          '> **B:** "Hi friend."',
          '',
          '| Inglês (en-US) | PT |',
          '|---|---|',
          '| **Hello there.** | oi |',
        ].join('\n'),
      ),
      phase(2, 'Practice sentence goes here.', 'x'),
      phase(3, 'Output sentence goes here.', 'x'),
      phase(4, 'Check sentence goes here.', 'x'),
    ]);

    const texts = extractPronunciationTargets(lesson).map((t) => t.text);
    expect(texts.filter((t) => t === 'Hello there.')).toHaveLength(1);
  });

  it('does not treat non-English-header tables in phase 1 as speakable glossary tables', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '| Armadilha | Forma | Por quê? |',
          '|---|---|---|',
          '| errado | certo | motivo |',
        ].join('\n'),
      ),
      phase(2, 'Another safe sentence here.', 'P2'),
      phase(3, 'Another safe sentence here.', 'P3'),
      phase(4, 'Another safe sentence here.', 'P4'),
    ]);

    const texts = extractPronunciationTargets(lesson).map((t) => t.text);
    expect(texts).not.toContain('errado');
    expect(texts).not.toContain('certo');
  });
});

describe('getFirstTargets and getTargetsByPhase', () => {
  it('returns first N targets and groups by phase', () => {
    const lesson = lessonWithPhases([
      phase(
        1,
        [
          '> **A:** "First target sentence."',
          '>',
          '> **B:** "Another opening line."',
        ].join('\n'),
        'Input',
      ),
      phase(2, 'Second target sentence. Third target sentence.', 'Practice'),
      phase(3, 'Fourth target sentence.', 'Output'),
      phase(4, 'Fifth target sentence.', 'Check'),
    ]);

    expect(getFirstTargets(lesson, 2).map((t) => t.text)).toEqual([
      'First target sentence.',
      'Another opening line.',
    ]);

    const grouped = getTargetsByPhase(lesson);
    expect(grouped.get(1)?.[0]?.text).toBe('First target sentence.');
    expect(grouped.get(2)?.map((t) => t.text)).toEqual(['Second target sentence.', 'Third target sentence.']);
  });
});
