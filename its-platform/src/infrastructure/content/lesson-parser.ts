import type { LessonRecord } from './content-types.js';

export function parseLesson(markdown: string, filename: string, registry?: any): LessonRecord {
  const lines = markdown.split(/\r?\n/);
  let lessonId = '';
  let reuseBasis = '';
  let sourceMarkdown = '';
  for (let i = 0; i < Math.min(40, lines.length); i++) {
    const line = lines[i];
    if (!line) continue;
    const mId = line.match(/\*\*Lesson ID:\*\*\s*(.+?)(?:\s*\|\s*.*)?$/i) || line.match(/Lesson ID:\s*(.+)$/i);
    if (mId && mId[1]) lessonId = mId[1].trim().replace(/[`"']/g, '');
    const mReuse = line.match(/\*\*Reuse basis:\*\*\s*(.+)$/i);
    if (mReuse && mReuse[1]) reuseBasis = mReuse[1].trim().replace(/[`"']/g, '');
    const mSource = line.match(/\*\*Source:\*\*\s*(.+)$/i) || line.match(/\*\*Source Markdown.*:\*\*\s*(.+)$/i);
    if (mSource && mSource[1]) sourceMarkdown = mSource[1].trim().replace(/[`"']/g, '');
  }
  let learnerModel: any = {};
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
          const jsonStr = lines.slice(start, end).join('\n');
          learnerModel = JSON.parse(jsonStr);
        } catch (e) {
          throw new Error(`Invalid JSON in learner model block in ${filename}: ${(e as Error).message}`);
        }
      }
      break;
    }
  }
  const lm = learnerModel || {};
  const lesson_id = lessonId || lm.lesson_id || filename.match(/les_[a-z0-9_]+/)?.[0] || '';
  const cefr_level = lm.cefr_level || '';
  const prereq_lessons = lm.prereq_lessons || [];
  const skill_items = lm.skill_items || {};
  let skillItemsArr: any[] = [];
  if (Array.isArray(lm.skill_items)) {
    skillItemsArr = lm.skill_items;
  } else if (typeof skill_items === 'object') {
    Object.keys(skill_items).forEach((skill) => {
      const arr = (skill_items as any)[skill];
      if (Array.isArray(arr)) {
        arr.forEach((item: any) => {
          skillItemsArr.push({
            skill: skill,
            domain: skill === 'vocabulary' ? 'vocab' : skill,
            theta_reportable: true,
            objective: String(item),
            min_theta: 0.7,
          });
        });
      }
    });
  }
  return {
    id: lesson_id,
    title: lm.title || lessonId || lesson_id,
    cefr_level,
    source_markdown: sourceMarkdown || lm.source_markdown || '',
    reuse_basis: reuseBasis || lm.provenance?.reuse_basis || '',
    module_id: lm.module_id,
    prereq_lessons,
    skill_items: skillItemsArr,
    learner_model: lm,
  };
}
