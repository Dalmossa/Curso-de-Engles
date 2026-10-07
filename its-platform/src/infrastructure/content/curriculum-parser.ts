import type { CurriculumRecord, ModuleRecord } from './content-types.js';
import * as fs from 'fs';
import * as path from 'path';

export function parseCurriculum(contentRoot: string): CurriculumRecord {
  const specPath = path.join(contentRoot, 'specs', 'curriculum-graph-spec.md');
  const markdown = fs.readFileSync(specPath, 'utf-8');
  const lines = markdown.split(/\r?\n/);
  const modules: ModuleRecord[] = [];
  let inTable = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes('| Module ID | Title | CEFR |')) {
      inTable = true;
      i++;
      continue;
    }
    if (inTable) {
      if (line.startsWith('#')) {
        inTable = false;
        break;
      }
      const cols = line.split('|');
      if (cols.length >= 6 && cols[1] && cols[1].includes('mod_')) {
        const moduleId = cols[1].replace(/`/g, '').trim();
        const title = cols[2] ? cols[2].replace(/`/g, '').trim() : '';
        const cefr = cols[3] ? cols[3].replace(/`/g, '').trim() : '';
        const sourceMd = cols[4] || '';
        const track = cols[5] ? cols[5].replace(/`/g, '').trim() : '';
        const lessonsCount = cols[6] ? parseInt(cols[6].replace(/[^0-9]/g, '')) || 0 : 0;
        modules.push({
          module_id: moduleId,
          title,
          cefr_level: cefr,
          track,
          source_markdowns: sourceMd.split('+').map((s: string) => s.replace(/`/g, '').trim()).filter(Boolean),
          sort_order: modules.length,
          expected_lessons: lessonsCount,
        });
      }
    }
  }
  return { modules };
}
