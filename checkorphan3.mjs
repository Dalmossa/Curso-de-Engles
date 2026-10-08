import {parseCurriculumSpec} from './its-platform/src/infrastructure/curriculum/curriculum-parser.ts';
import fs from 'fs';

const CONTENT_REPO_PATH = '.';
const r = parseCurriculumSpec(CONTENT_REPO_PATH);
// enrich prereqs
for(const mod of r.modules){
  for(const les of mod.lessons){
    const candidates = [
      `${CONTENT_REPO_PATH}/lessons/a1/${les.lessonId}.md`,
      `${CONTENT_REPO_PATH}/lessons/a2/${les.lessonId}.md`,
      `${CONTENT_REPO_PATH}/lessons/b1/${les.lessonId}.md`,
      `${CONTENT_REPO_PATH}/lessons/b2/${les.lessonId}.md`,
      `${CONTENT_REPO_PATH}/lessons/remediation/${les.lessonId}.md`,
      `${CONTENT_REPO_PATH}/lessons/a2/lesson-15min-workplace-greetings.md`,
    ];
    for(const c of candidates){
      try{if(fs.existsSync(c)){const md=fs.readFileSync(c).toString();const m=md.match(/\*\*Prereq Lessons\*\*\s*\|\s*(.+?)\s*\|/);if(m){const prereqs=[];const re=/les_[a-z0-9_]+/g;let mm;while((mm=re.exec(m[1]))!==null)prereqs.push(mm[0]);if(prereqs.length>0)les.prereqs=prereqs;break;}}}catch{}
    }
  }
}
