import type { LessonRecord } from './content-types.js';

/**
 * Optional context the loader supplies so the parser can honour ADR-022 §3's
 * fallbacks without knowing the filesystem or the curriculum spec:
 *  - `dirCefr`       — CEFR from the lesson's directory (`lessons/a2/…` → `A2`).
 *  - `lessonModules` — the §4.3 lesson→module registry, keyed by lesson id; the
 *    lookup happens after the id is resolved, so the map is passed whole.
 */
export interface LessonParseContext {
  dirCefr: string | null;
  lessonModules: Record<string, string>;
}

const DEFAULT_CONTEXT: LessonParseContext = { dirCefr: null, lessonModules: {} };

function firstBackticked(line: string): string | null {
  const m = line.match(/`([^`]+)`/);
  return m && m[1] ? m[1].trim() : null;
}

/** First CEFR token (`A1`…`C2`) in a string, or null. */
function firstCefr(text: string): string | null {
  const m = text.match(/\b([ABC][12])\b/);
  return m && m[1] ? m[1] : null;
}

function cleanTitle(h1: string): string {
  let t = h1.replace(/^#\s*/, '').trim();
  t = t.replace(/^(Lesson|Lição de 15 Minutos)\s*:\s*/i, '').trim();
  t = t.replace(/^["“]/, '').replace(/["”]$/, '').trim();
  return t;
}

export function parseLesson(
  markdown: string,
  filename: string,
  ctx: LessonParseContext = DEFAULT_CONTEXT,
): LessonRecord {
  const lines = markdown.split(/\r?\n/);

  let declaredId: string | null = null;
  let declaredModule: string | null = null;
  let declaredCefr: string | null = null;
  let declaredReuse: string | null = null;
  let declaredSource: string | null = null;
  let h1 = '';
  let metaCefr: string | null = null;

  // The header region is the top of the file; 80 lines is generous for the
  // 115 lessons that declare prose metadata, and the §4.3-style metadata table
  // for the 7 that declare `| **CEFR Level** | A2 (…) |` instead.
  const headerEnd = Math.min(120, lines.length);
  for (let i = 0; i < headerEnd; i++) {
    const line = lines[i];
    if (line === undefined) continue;

    if (!h1) {
      const h = line.match(/^#\s+(.+)$/);
      if (h && h[1]) h1 = h[1].trim();
    }

    const mId = line.match(/\*\*Lesson ID:\*\*\s*`?([A-Za-z0-9_-]+)`?/i);
    if (mId && mId[1] && !declaredId) declaredId = mId[1];

    const mMod = line.match(/\*\*Module:\*\*\s*`?([A-Za-z0-9_-]+)`?/i);
    if (mMod && mMod[1] && !declaredModule) declaredModule = mMod[1];

    const mCefr = line.match(/\*\*CEFR:\*\*\s*([^|]*)$/i);
    if (mCefr && mCefr[1] && !declaredCefr) declaredCefr = firstCefr(mCefr[1]);

    const mReuse = line.match(/\*\*Reuse basis:\*\*\s*(.*)$/i);
    if (mReuse && mReuse[1] && !declaredReuse) {
      declaredReuse = firstBackticked(mReuse[1]) ?? mReuse[1].trim().split(/[\s(—]/)[0] ?? null;
    }

    const mSource = line.match(/\*\*Source(?:\s+Markdown)?:\*\*\s*(.*)$/i);
    if (mSource && mSource[1] && !declaredSource) declaredSource = mSource[1].trim();

    if (!metaCefr) {
      const mRow = line.match(/\|\s*\*\*CEFR Level\*\*\s*\|\s*([^|]+)\|/i);
      if (mRow && mRow[1]) metaCefr = firstCefr(mRow[1]);
    }
  }

  // The JSON learner-model block stays supported (ADR-022 §2) but is no longer
  // the only source; `module_id` and `prereq_lessons` still come from it. Its
  // `cefr_level` is used only when it is a valid CEFR code (see below).
  let learnerModel: Record<string, unknown> = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && line.includes('```json')) {
      const start = i + 1;
      let end = -1;
      for (let j = start; j < lines.length; j++) {
        const l2 = lines[j];
        if (l2 && l2.trim().startsWith('```')) {
          end = j;
          break;
        }
      }
      if (end > start) {
        try {
          learnerModel = JSON.parse(lines.slice(start, end).join('\n')) as Record<string, unknown>;
        } catch (e) {
          throw new Error(
            `Invalid JSON in learner model block in ${filename}: ${(e as Error).message}`,
          );
        }
      }
      break;
    }
  }

  const jsonId = typeof learnerModel['lesson_id'] === 'string' ? learnerModel['lesson_id'] : null;
  const jsonModule =
    typeof learnerModel['module_id'] === 'string' ? learnerModel['module_id'] : null;
  const jsonTitle = typeof learnerModel['title'] === 'string' ? learnerModel['title'] : null;

  const id =
    declaredId ??
    jsonId ??
    filename.match(/les_[a-z0-9_]+/i)?.[0] ??
    filename.replace(/\.md$/, '');

  const module_id = declaredModule ?? jsonModule ?? ctx.lessonModules[id] ?? '';
  // The JSON block's `cefr_level` is a *last resort* and only when it is a valid code:
  // 7 real lessons declare `A2+` there (not a CEFR code, would violate the FK), while
  // the integration fixture declares a valid `"A1"`. Order: `**CEFR:**` → metadata
  // table → directory → valid JSON code.
  const jsonCefrRaw =
    typeof learnerModel['cefr_level'] === 'string' ? learnerModel['cefr_level'].trim() : null;
  const jsonCefr = jsonCefrRaw && /^(A|B|C)[12]$/.test(jsonCefrRaw) ? jsonCefrRaw : null;
  const cefr_level = declaredCefr ?? metaCefr ?? ctx.dirCefr ?? jsonCefr ?? '';

  const reuse_basis = declaredReuse ?? 'cite_only';
  const publication_state =
    reuse_basis === 'adapt_requires_permission' ? 'restricted_pending_permission' : 'publishable';
  const permission_state = reuse_basis === 'adapt_requires_permission' ? 'requested' : 'not_required';

  const prereqRaw = learnerModel['prereq_lessons'];
  const prereq_lessons = Array.isArray(prereqRaw)
    ? prereqRaw.filter((p): p is string => typeof p === 'string')
    : [];

  return {
    id,
    module_id,
    title: h1 ? cleanTitle(h1) : (jsonTitle ?? id),
    cefr_level,
    reuse_basis,
    authoring_state: id.startsWith('blocked_') ? 'blocked' : 'authored',
    publication_state,
    permission_state,
    source_ref: declaredSource,
    prereq_lessons,
  };
}
