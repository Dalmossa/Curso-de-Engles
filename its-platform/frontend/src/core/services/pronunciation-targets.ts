import type { LessonContent, LessonPhase } from '../entities/lesson';
import type { PronunciationTarget } from '../entities/speech';

/**
 * Extracts pronounceable target sentences/terms from a lesson's phases.
 *
 * Baseline (compatibility): for every phase, split markdown into sentence-like chunks,
 * clean them, keep those that look like English sentences, and return them in encounter order.
 *
 * Expansion: for Fase 1 (phase 1), also extract dialogue turns and speakable table terms
 * (e.g. alphabet/glossary English columns) in document order. Results are deduplicated by
 * normalized text while preserving first-seen order.
 *
 * This is a pure function — no I/O, no framework.
 */
export function extractPronunciationTargets(lesson: LessonContent): readonly PronunciationTarget[] {
  const targets: PronunciationTarget[] = [];
  const seen = new Set<string>();

  for (const phase of lesson.phases) {
    const candidates = phase.phase === 1 ? extractPhaseOneCandidates(phase) : extractSentenceCandidatesFromText(phase.markdown);

    for (const text of candidates) {
      const cleaned = text.trim();
      if (!cleaned) continue;
      const key = normalizeDedupKey(cleaned);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      targets.push({
        phase: phase.phase,
        heading: phase.heading,
        text: cleaned,
      });
    }
  }

  return targets;
}

function normalizeDedupKey(text: string): string {
  return cleanForSpeech(text).toLowerCase().replace(/\s+/g, ' ').trim();
}

function extractPhaseOneCandidates(phase: LessonPhase): string[] {
  const lines = normalizeLineEndings(phase.markdown).split('\n');
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (/^\s*>/.test(line)) {
      const block = collectBlockquote(lines, i);
      const turns = parseDialogueTurnsFromBlock(block.lines);
      if (turns.length >= 2) {
        for (const turn of turns) {
          if (isSpeakableTargetText(turn)) out.push(turn);
        }
      } else {
        // Not a dialogue: dequote and try sentence extraction.
        out.push(...extractSentenceCandidatesFromText(block.lines.join('\n')));
      }
      i = block.end;
      continue;
    }

    if (isTableLine(line)) {
      const table = parseTable(lines, i);
      if (table) {
        const speakCol = detectSpeakColumn(table.header);
        if (speakCol >= 0) {
          const alphabet = isAlphabetTable(table.header, table.rows);
          const tableCells: string[] = [];
          for (const row of table.rows) {
            const cell = speakableTableCell(row[speakCol] ?? '', alphabet);
            if (cell) tableCells.push(cell);
          }
          if (alphabet) {
            const uniqueLetters = Array.from(new Set(tableCells.map((c) => c.toUpperCase())));
            uniqueLetters.sort((a, b) => a.localeCompare(b, 'en'));
            out.push(...uniqueLetters);
          } else {
            out.push(...tableCells);
          }
        }
        // Non-speakable tables are ignored for pronunciation targets.
        i = table.end;
        continue;
      }
      while (i < lines.length && isTableLine(lines[i] ?? '')) i++;
      continue;
    }

    // Plain text run until next blockquote/table.
    let j = i;
    const plain: string[] = [];
    while (j < lines.length && !/^\s*>/.test(lines[j] ?? '') && !isTableLine(lines[j] ?? '')) {
      plain.push(lines[j] ?? '');
      j++;
    }
    if (plain.length > 0) out.push(...extractSentenceCandidatesFromText(plain.join('\n')));
    i = j;
  }

  return out;
}

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

function collectBlockquote(lines: readonly string[], start: number): { lines: string[]; end: number } {
  const collected: string[] = [];
  let end = start;
  while (end < lines.length) {
    const line = lines[end] ?? '';
    if (/^\s*>/.test(line)) {
      collected.push(line.replace(/^\s*>\s?/, ''));
      end++;
      continue;
    }
    if (line.trim() === '' && end + 1 < lines.length && /^\s*>/.test(lines[end + 1] ?? '')) {
      collected.push('');
      end++;
      continue;
    }
    break;
  }
  return { lines: collected, end };
}

function parseDialogueTurnsFromBlock(blockLines: readonly string[]): string[] {
  const turns: string[] = [];
  for (const rawLine of blockLines) {
    const t = rawLine.trim();
    if (!t) continue;

    let speaker: string | null = null;
    let textPart: string | null = null;
    const bold = t.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (bold) {
      speaker = cleanForSpeech(bold[1] ?? '').replace(/:\s*$/, '').trim();
      textPart = (bold[2] ?? '').replace(/^:\s*/, '').trim();
    } else {
      const plain = t.match(/^([A-Za-zÀ-ÿ][^:]{0,40}?):\s+(.+)$/);
      if (plain) {
        speaker = cleanForSpeech(plain[1] ?? '').trim();
        textPart = (plain[2] ?? '').trim();
      }
    }
    if (!speaker || !textPart) continue;

    let text = textPart.replace(/^["“”']+/, '').replace(/["“”']+$/, '').trim();
    const cleaned = cleanForSpeech(text);
    if (cleaned) turns.push(cleaned);
  }
  return turns;
}

function isTableLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.includes('|');
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  const withoutEdges = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return withoutEdges.split('|').map((cell) => cell.trim());
}

function isSeparatorRow(cells: readonly string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')));
}

function parseTable(lines: readonly string[], start: number): { header: string[]; rows: string[][]; end: number } | null {
  if (start >= lines.length) return null;
  const first = lines[start] ?? '';
  const second = lines[start + 1] ?? '';
  if (!isTableLine(first) || !isTableLine(second)) return null;
  const header = splitTableRow(first);
  const sep = splitTableRow(second);
  if (!isSeparatorRow(sep)) return null;

  let end = start + 2;
  const rows: string[][] = [];
  while (end < lines.length) {
    const line = lines[end] ?? '';
    if (!isTableLine(line)) break;
    const cells = splitTableRow(line);
    if (isSeparatorRow(cells)) {
      end++;
      continue;
    }
    rows.push(header.map((_, i) => cells[i] ?? ''));
    end++;
  }
  if (rows.length === 0) return null;
  return { header, rows, end };
}

const SPEAK_HEADER_TOKENS = [
  'inglês',
  'ingles',
  'english',
  'en-us',
  'en-gb',
  'letter',
  'letra',
  'expressão',
  'expressao',
  'expression',
  'termo',
  'term',
  'palavra',
  'word',
];

function normalizeHeaderCell(text: string): string {
  return cleanForSpeech(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function detectSpeakColumn(header: readonly string[]): number {
  let fallback = -1;
  for (let i = 0; i < header.length; i++) {
    const h = normalizeHeaderCell(header[i] ?? '');
    if (!h) continue;
    if (SPEAK_HEADER_TOKENS.some((token) => h.includes(token))) {
      // Prefer explicit English-language columns over generic letter/term labels.
      if (/(ingles|english|en-us|en-gb)/.test(h)) return i;
      if (fallback < 0) fallback = i;
    }
  }
  return fallback;
}

function isSingleAlphabetLetter(text: string): boolean {
  return /^[A-Za-z]$/.test(cleanForSpeech(text).trim());
}

function isAlphabetTable(header: readonly string[], rows: readonly (readonly string[])[]): boolean {
  const speakCol = detectSpeakColumn(header);
  if (speakCol < 0) return false;
  const headerNorm = normalizeHeaderCell(header[speakCol] ?? '');
  const headerLooksAlphabet = headerNorm === 'letter' || headerNorm === 'letra' || headerNorm.includes('letter') || headerNorm.includes('letra');
  const sample = rows
    .map((r) => cleanForSpeech(r[speakCol] ?? '').trim())
    .filter((v) => v.length > 0)
    .slice(0, 12);
  if (sample.length === 0) return false;
  const letters = sample.filter((v) => isSingleAlphabetLetter(v));
  return letters.length >= Math.min(3, sample.length) && (headerLooksAlphabet || letters.length === sample.length);
}

function speakableTableCell(text: string, alphabet: boolean): string | null {
  const cleaned = cleanForSpeech(text).trim();
  if (!cleaned) return null;
  if (alphabet) {
    if (!isSingleAlphabetLetter(cleaned)) return null;
    return cleaned.toUpperCase();
  }
  if (!isSpeakableTargetText(cleaned)) return null;
  return cleaned;
}

function isSpeakableTargetText(text: string): boolean {
  const s = text.trim();
  if (s.length < 1 || s.length > 300) return false;
  if (!/[A-Za-z]/.test(s)) return false;
  if (/^(#+|Table|Figure|Example|Note:|Tip:|Warning:|Caution:)/i.test(s)) return false;
  // Allow isolated A-Z alphabet letters.
  if (/^[A-Za-z]$/.test(s)) return true;
  if (s.length < 2) return false;
  const latin = (s.match(/[A-Za-z]/g) || []).length / Math.max(1, s.length);
  if (latin < 0.3) return false;
  return true;
}

function cleanForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\([^)]*\/[^)]*\)/g, '')
    .replace(/\([^)]*\[[^\]]+\][^)]*\)/g, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits markdown text into sentences.
 */
function splitIntoSentences(markdown: string): string[] {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/^\s{0,3}>\s?/gm, '');

  const parts = withoutCode.split(/(?<=[.!?])\s+/);
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

/**
 * Cleans a sentence for pronunciation practice.
 */
function cleanSentence(sentence: string): string {
  return sentence
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\([^)]*\/[^)]*\)/g, '')
    .replace(/\([^)]*\[[^\]]+\][^)]*\)/g, '')
    .replace(/^[\-\*\d+\.\)]\s+/, '')
    .replace(/^\s{0,3}>\s?/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Determines if a cleaned sentence is suitable for pronunciation practice.
 */
function isPronounceable(sentence: string): boolean {
  if (sentence.length < 10 || sentence.length > 300) return false;
  if (!/^[A-Za-z]/.test(sentence)) return false;
  const words = sentence.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 3) return false;
  const latinRatio = (sentence.match(/[A-Za-z]/g) || []).length / sentence.length;
  if (latinRatio < 0.5) return false;
  if (/^(#+|Table|Figure|Example|Note:|Tip:|Warning:|Caution:)/i.test(sentence)) return false;
  return true;
}

function extractSentenceCandidatesFromText(text: string): string[] {
  const sentences = splitIntoSentences(text);
  const out: string[] = [];
  for (const sentence of sentences) {
    const cleaned = cleanSentence(sentence);
    if (isPronounceable(cleaned)) out.push(cleaned);
  }
  return out;
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

  const result = new Map<number, readonly PronunciationTarget[]>();
  for (const [phase, arr] of map.entries()) {
    result.set(phase, arr);
  }
  return result;
}
