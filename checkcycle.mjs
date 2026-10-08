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
      try{
        if(fs.existsSync(c)){
          const md = fs.readFileSync(c).toString();
          let prereqs = [];
          const m = md.match(/\*\*Prereq Lessons\*\*\s*\|\s*(.+?)\s*\|/);
          if(m){
            const re = /les_[a-z0-9_]+/g;
            let mm; while((mm=re.exec(m[1]))!==null) prereqs.push(mm[0]);
          } else {
            const jm = md.match(/```json[\s\S]*?```/);
            if(jm){
              try{const j = JSON.parse(jm[0].replace(/```json|```/g,'')); if(Array.isArray(j.prereq_lessons)) prereqs = j.prereq_lessons.filter(x=>typeof x==='string');}catch{}
            }
          }
          if(prereqs.length>0) les.prereqs = prereqs;
          break;
        }
      }catch{}
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
console.log(edges.length);
