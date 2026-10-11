import type { LessonBody, LessonPhase, LessonRecord } from './content-types.js';

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

/**
 * A `FASE` heading, tolerant across the two generations measured in the content
 * (ADR-027 §3): level 1–3, an optional emoji/pictograph run, then `FASE`, optional
 * spaces, a digit. The separator (`—` vs `:`) and the `[N min]` suffix are not
 * required — the heading is otherwise read verbatim.
 */
const PHASE_HEADING =
  /^#{1,3}[ \t]+(?:\p{Extended_Pictographic}[\uFE0F\u200D\p{Extended_Pictographic}]*[ \t]+)*FASE[ \t]*(\d)/u;

/** `## 📊 DADOS PARA O LEARNER MODEL …` — the section that carries the JSON block. */
const LEARNER_MODEL_HEADING =
  /^#{1,3}[ \t]+(?:\p{Extended_Pictographic}[\uFE0F\u200D\p{Extended_Pictographic}]*[ \t]+)*DADOS PARA O LEARNER MODEL/iu;

/**
 * The lesson's four authored `FASE` blocks, verbatim and in `phase` order
 * (ADR-027 §5). **Fence-aware**: a `FASE` line inside a ``` or ~~~ fenced block is
 * not a heading. Returns exactly four entries.
 *
 * Throws when the headings are not exactly `1,2,3,4`: the same fail-fast stance the
 * strict `JSON.parse` on the learner-model block takes (ADR-022 §2). The loader
 * names the offending file; the message names the offending values.
 */
export function extractPhases(markdown: string): LessonPhase[] {
  const lines = markdown.split(/\r?\n/);
  const found: Array<{ phase: number; heading: string; lineIndex: number }> = [];

  let inFence = false;
  let fenceChar: string | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;

    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence && fence[1]) {
      const ch = fence[1][0] ?? '';
      if (!inFence) {
        inFence = true;
        fenceChar = ch;
      } else if (ch === fenceChar) {
        inFence = false;
        fenceChar = null;
      }
      continue;
    }
    if (inFence) continue;

    const m = line.match(PHASE_HEADING);
    if (!m || !m[1]) continue;
    found.push({
      phase: Number(m[1]),
      heading: line.replace(/^#{1,3}[ \t]*/, '').trim(),
      lineIndex: i,
    });
  }

  const numbers = found.map(f => f.phase);
  if (numbers.join(',') !== '1,2,3,4') {
    throw new Error(
      `lesson FASE headings must be exactly 1,2,3,4 in order; got [${numbers.join(',')}]`,
    );
  }

  return found.map((f, idx) => {
    const next = found[idx + 1];
    const bodyEnd = next ? next.lineIndex : lines.length;
    return {
      phase: f.phase,
      heading: f.heading,
      // The section body: from the line after the heading to the line before the next
      // FASE heading (or EOF), heading excluded, trailing whitespace trimmed.
      markdown: lines
        .slice(f.lineIndex + 1, bodyEnd)
        .join('\n')
        .replace(/\s+$/, ''),
    };
  });
}

/**
 * The parsed JSON of the `## 📊 DADOS PARA O LEARNER MODEL` section's ```json fence,
 * or `null` when the lesson has no such section (ADR-027 §5; measured: 121/122).
 * The parse stays strict — a malformed fence throws (the loader names the file).
 */
export function extractLearnerModel(markdown: string): unknown | null {
  const lines = markdown.split(/\r?\n/);

  let headingIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line !== undefined && LEARNER_MODEL_HEADING.test(line)) {
      headingIndex = i;
      break;
    }
  }
  if (headingIndex === -1) return null;

  for (let i = headingIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined || !/^\s*```json/.test(line)) continue;
    let end = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const l2 = lines[j];
      if (l2 !== undefined && l2.trim().startsWith('```')) {
        end = j;
        break;
      }
    }
    if (end === -1) {
      throw new Error('Unterminated JSON fence in the learner model block');
    }
    try {
      return JSON.parse(lines.slice(i + 1, end).join('\n')) as unknown;
    } catch (e) {
      throw new Error(`Invalid JSON in learner model block: ${(e as Error).message}`);
    }
  }
  return null;
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

  // The persisted `lessons.body` (ADR-027 §5). Extraction comes after the inline
  // learner-model scan above so a malformed `json` fence still throws the original,
  // file-named error rather than the section-scoped one.
  const body: LessonBody = {
    phases: extractPhases(markdown),
    learner_model: extractLearnerModel(markdown),
  };

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
    body,
    prereq_lessons,
  };
}
