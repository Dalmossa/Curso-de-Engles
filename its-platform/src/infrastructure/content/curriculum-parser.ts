import type { CurriculumRecord, ModuleRecord } from './content-types.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads `curriculum-graph-spec.md`:
 *  - §3 MODULE CATALOG — the module table (`| Module ID | Title | CEFR | … | Track | Lessons |`).
 *  - §4.3 Canonical Lesson Registry — the `**`mod_x`** (CEFR, Track)` blocks and their
 *    `| `lesson_id` | … |` rows, which are the lesson→module fallback of ADR-022 §3.
 *
 * The spec is absent from a fixture content root; in that case the parser returns
 * an empty catalog instead of throwing, so the loader keeps one honest code path
 * (the fixture supplies a minimal spec — see tests/helpers/fixtures.ts — so a
 * lesson whose module cannot be resolved still fails loudly at insert time).
 */

function strip(s: string): string {
  return s.replace(/\*/g, '').replace(/`/g, '').trim();
}

function firstCefr(text: string): string | null {
  const m = text.match(/\b([ABC][12])\b/);
  return m && m[1] ? m[1] : null;
}

function mapTrack(track: string): string {
  const t = strip(track);
  if (/^it\b/i.test(t) || /it track/i.test(t)) return 'IT';
  if (/^both\b/i.test(t)) return 'Both';
  if (/^general\b/i.test(t)) return 'General';
  return t;
}

function backtickedSpans(cell: string): string[] {
  const out: string[] = [];
  for (const m of cell.matchAll(/`([^`]+)`/g)) {
    if (m[1]) out.push(m[1].trim());
  }
  return out;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(c => c.trim());
}

export function parseCurriculum(contentRoot: string): CurriculumRecord {
  const specPath = path.join(contentRoot, 'specs', 'curriculum-graph-spec.md');
  if (!fs.existsSync(specPath)) {
    return { modules: [], lesson_modules: {} };
  }
  const markdown = fs.readFileSync(specPath, 'utf-8');
  const lines = markdown.split(/\r?\n/);

  const modules: ModuleRecord[] = [];
  const byId = new Map<string, ModuleRecord>();
  const lessonModules: Record<string, string> = {};

  // --- §3 module catalog -------------------------------------------------
  let inModuleTable = false;
  for (const line of lines) {
    if (!inModuleTable && /^\|\s*Module ID\s*\|/.test(line)) {
      inModuleTable = true;
      continue;
    }
    if (inModuleTable) {
      if (!line.startsWith('|')) {
        if (line.trim() === '') continue;
        inModuleTable = false;
        continue;
      }
      const cols = splitRow(line);
      const id = cols[0] ? strip(cols[0]) : '';
      if (!id.startsWith('mod_')) continue;
      const cefr = cols[2] ? firstCefr(cols[2]) : null;
      const expected = cols[5] ? parseInt(cols[5].replace(/[^0-9]/g, ''), 10) : 0;
      const rec: ModuleRecord = {
        id,
        title: cols[1] ? strip(cols[1]) : id,
        cefr_level: cefr ?? 'A1',
        track: cols[4] ? mapTrack(cols[4]) : 'General',
        source_markdowns: cols[3] ? backtickedSpans(cols[3]) : [],
        sort_order: modules.length + 1,
        expected_lessons: Number.isFinite(expected) ? expected : 0,
      };
      modules.push(rec);
      byId.set(id, rec);
    }
  }

  // --- §4.3 lesson registry ---------------------------------------------
  // Block headers look like: **`mod_a2_workplace_intro`** (A2, General) — …
  let currentModule: string | null = null;
  for (const line of lines) {
    const header = line.match(/^\*\*`(mod_[a-z0-9_]+)`\*\*\s*\(([^)]*)\)/);
    if (header && header[1]) {
      currentModule = header[1];
      if (!byId.has(currentModule)) {
        const inner = header[2] ?? '';
        const cefr = firstCefr(inner);
        const trackPart = inner.includes(',') ? inner.split(',').slice(1).join(',') : 'General';
        const rec: ModuleRecord = {
          id: currentModule,
          title: currentModule,
          cefr_level: cefr ?? 'A1',
          track: mapTrack(trackPart),
          source_markdowns: [],
          sort_order: modules.length + 1,
          expected_lessons: 0,
        };
        modules.push(rec);
        byId.set(currentModule, rec);
      }
      continue;
    }
    if (currentModule) {
      const row = line.match(/^\|\s*`?(les_[a-z0-9_]+)`?\s*\|/);
      const lessonId = row && row[1] ? row[1] : null;
      if (lessonId) lessonModules[lessonId] = currentModule;
    }
  }

  return { modules, lesson_modules: lessonModules };
}
