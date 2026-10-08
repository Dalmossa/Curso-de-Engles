import {parseCurriculumSpec} from './its-platform/src/infrastructure/curriculum/curriculum-parser.ts';
import fs from 'fs';
import {validateDAG} from './its-platform/src/infrastructure/curriculum/dag-validator.ts';

const CONTENT_REPO_PATH = '.';
const r = parseCurriculumSpec(CONTENT_REPO_PATH);
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
const md = fs.readFileSync(`${CONTENT_REPO_PATH}/specs/curriculum-graph-spec.md`).toString();
const reRem = /les_rem_[a-z0-9_]+/g;
for(const f of new Set(md.match(reRem)||[])){
  const n = r.nodes.find(x=>x.id===f);
  if(n) n.metadata = {...n.metadata, remediation:true};
}
const edges=[]; for(const mod of r.modules){for(const les of mod.lessons){for(const p of les.prereqs){edges.push({from:p,to:les.lessonId,type:'Prerequisite'});}}}
// Also add module sequence edges - every lesson connects to its module? and module sequence between modules
// from spec: Module Sequence edge type exists; but maybe we need to connect lessons to modules conceptually?
// But nodes are Lesson/Module etc. Also add edges from module to lessons? or from lessons to module completion?
// The validator says orphan if no incoming and no outgoing - lessons that are entry points (no prereqs) have no incoming from other lessons; 
// but they should be reachable from diagnostic entry points? The spec says "entry points per CEFR + Track" and "multi-root: Multiple entry points per CEFR level"
// Maybe we need to add diagnostic entry nodes and edges from diag to start nodes?
