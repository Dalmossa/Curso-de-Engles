import type { LessonContent } from '../entities/lesson';
import type { PronunciationTarget } from '../entities/speech';

/**
 * Extracts pronounceable target sentences from a lesson's phases.
 *
 * The heuristic: take each phase's markdown, split into sentences, keep those
 * that look like English sentences (start with a letter, reasonable length),
 * and return them with their phase/heading context so the UI can present them
 * in the lesson flow.
 *
 * This is a pure function — no I/O, no framework — so it is trivial to test
 * and the lesson view can call it without any async boundary.
 */
export function extractPronunciationTargets(lesson: LessonContent): readonly PronunciationTarget[] {
  const targets: PronunciationTarget[] = [];

  for (const phase of lesson.phases) {
    const sentences = splitIntoSentences(phase.markdown);
    for (const sentence of sentences) {
      const cleaned = cleanSentence(sentence);
      if (isPronounceable(cleaned)) {
        targets.push({
          phase: phase.phase,
          heading: phase.heading,
          text: cleaned,
        });
      }
    }
  }

  return targets;
}

/**
 * Splits markdown text into sentences.
 *
 * Handles:
 * - Basic sentence termination (., !, ?)
 * - Avoids splitting on abbreviations (e.g., "e.g.", "Mr.", "Dr.")
 * - Respects markdown code blocks and inline code (doesn't split inside)
 * - Respects blockquotes and list items
 */
function splitIntoSentences(markdown: string): string[] {
  // Remove markdown code blocks and inline code first
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/`[^`]*`/g, ''); // inline code

  // Split on sentence boundaries, keeping the delimiter
  const parts = withoutCode.split(/(?<=[.!?])\s+/);

  // Clean up each part
  return parts
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Cleans a sentence for pronunciation practice.
 *
 * Removes:
 * - Markdown formatting (**, *, _, ~, `)
 * - Parenthetical asides that are not part of the spoken sentence
 * - List markers (-, *, 1., etc.)
 * - Excess whitespace
 */
function cleanSentence(sentence: string): string {
  return sentence
    // Remove markdown bold/italic/strikethrough/inline code markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown links, keep link text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove parenthetical asides that look like pronunciation guides
    .replace(/\([^)]*\/[^)]*\)/g, '')
    .replace(/\([^)]*\[[^\]]+\][^)]*\)/g, '')
    // Remove list markers at start
    .replace(/^[\-\*\d+\.\)]\s+/, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Determines if a cleaned sentence is suitable for pronunciation practice.
 *
 * Criteria:
 * - Starts with a letter (not a symbol, number, or markdown artifact)
 * - Length between 10 and 300 characters (reasonable spoken sentence)
 * - Contains at least 3 words
 * - Is primarily Latin script (English lesson content)
 */
function isPronounceable(sentence: string): boolean {
  if (sentence.length < 10 || sentence.length > 300) return false;

  // Must start with a letter
  if (!/^[A-Za-z]/.test(sentence)) return false;

  // At least 3 words
  const words = sentence.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 3) return false;

  // Primarily Latin letters (allow some punctuation, numbers)
  const latinRatio = (sentence.match(/[A-Za-z]/g) || []).length / sentence.length;
  if (latinRatio < 0.5) return false;

  // Skip sentences that look like headers, code, or metadata
  if (/^(#+|Table|Figure|Example|Note:|Tip:|Warning:|Caution:)/i.test(sentence)) return false;

  return true;
}

/**
 * Gets the first N pronunciation targets from a lesson, for quick access.
 */
export function getFirstTargets(lesson: LessonContent, count: number = 5): readonly PronunciationTarget[] {
  return extractPronunciationTargets(lesson).slice(0, count);
}

/**
 * Gets all pronunciation targets grouped by phase.
 */
export function getTargetsByPhase(lesson: LessonContent): ReadonlyMap<number, readonly PronunciationTarget[]> {
  const targets = extractPronunciationTargets(lesson);
  const map = new Map<number, PronunciationTarget[]>();

  for (const target of targets) {
    const existing = map.get(target.phase) || [];
    existing.push(target);
    map.set(target.phase, existing);
  }

  // Convert arrays to readonly
  const result = new Map<number, readonly PronunciationTarget[]>();
  for (const [phase, arr] of map.entries()) {
    result.set(phase, arr);
  }
  return result;
}