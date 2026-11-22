import type { LessonPhase } from '@/core';

export type LessonTranslationMap = Readonly<Record<string, string>>;

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

function stripMdInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]+/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function cleanSpeechText(text: string): string {
  return stripMdInline(text).replace(/\s+/g, ' ').trim();
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  const withoutEdges = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return withoutEdges.split('|').map((cell) => cell.trim());
}

function isSeparatorRow(cells: readonly string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')));
}

function isTableLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.includes('|');
}

function detectSpeakColumn(header: readonly string[]): number {
  for (let i = 0; i < header.length; i++) {
    const h = stripMdInline(header[i] ?? '').toLowerCase();
    if (h.includes('inglês') || h.includes('ingles') || h.includes('english') || h.includes('en-us') || h.includes('en-gb')) {
      return i;
    }
  }
  return -1;
}

function detectPortugueseColumn(header: readonly string[]): number {
  for (let i = 0; i < header.length; i++) {
    const h = stripMdInline(header[i] ?? '').toLowerCase();
    if (h.includes('portugu') || h.includes('pt-br') || h.includes('pt br') || h.includes('tradu')) return i;
  }
  return -1;
}

function normalizeTranslationKey(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function lookupTranslation(map: LessonTranslationMap | undefined, speaker: string | null, text: string): string | null {
  if (!map) return null;
  const t = normalizeTranslationKey(text);
  if (!t) return null;
  const speakerKey = speaker ? `${normalizeTranslationKey(speaker)}|${t}` : null;
  if (speakerKey && map[speakerKey]) return map[speakerKey] ?? null;
  if (map[t]) return map[t] ?? null;
  const raw = text.trim();
  if (map[raw]) return map[raw] ?? null;
  return null;
}

/**
 * Extracts PT-BR translations from existing lesson markdown tables (glossary/vocab tables).
 * Reuses data already present in lessons; no new source created.
 */
export function extractLessonTranslations(phases: readonly Pick<LessonPhase, 'markdown'>[]): LessonTranslationMap {
  const out: Record<string, string> = {};

  for (const phase of phases) {
    const lines = normalizeLineEndings(phase.markdown).split('\n');
    let i = 0;
    while (i < lines.length) {
      const first = lines[i] ?? '';
      const second = lines[i + 1] ?? '';
      if (!isTableLine(first) || !isTableLine(second)) {
        i++;
        continue;
      }
      const header = splitTableRow(first);
      const sep = splitTableRow(second);
      if (!isSeparatorRow(sep)) {
        i++;
        continue;
      }
      const ptCol = detectPortugueseColumn(header);
      const enCol = detectSpeakColumn(header);
      const useEnCol = enCol >= 0 ? enCol : 0;
      i += 2;
      while (i < lines.length && isTableLine(lines[i] ?? '')) {
        const row = splitTableRow(lines[i] ?? '');
        if (ptCol >= 0) {
          const en = cleanSpeechText(row[useEnCol] ?? '');
          const pt = stripMdInline(row[ptCol] ?? '').trim();
          if (en && pt) {
            const key = normalizeTranslationKey(en);
            if (key && !out[key]) out[key] = pt;
          }
        }
        i++;
      }
    }
  }

  return out;
}
