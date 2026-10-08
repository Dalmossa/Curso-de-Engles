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
          }
          if(prereqs.length===0){
            const jm = md.match(/```json[\s\S]*?```/);
            if(jm){
              try{const j=JSON.parse(jm[0].replace(/```json|```/g,'')); if(Array.isArray(j.prereq_lessons)) prereqs = j.prereq_lessons.filter(x=>typeof x==='string');}catch{}
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
const diagNodes = [
  {id:'diag_a1_general', type:'Diagnostic Entry'},{id:'diag_a1_it', type:'Diagnostic Entry'},
  {id:'diag_a2_general', type:'Diagnostic Entry'},{id:'diag_a2_it', type:'Diagnostic Entry'},
  {id:'diag_b1_general', type:'Diagnostic Entry'},{id:'diag_b1_it', type:'Diagnostic Entry'},
  {id:'diag_b2_general', type:'Diagnostic Entry'},{id:'diag_b2_it', type:'Diagnostic Entry'},
];
for(const d of diagNodes){ if(!r.nodes.some(n=>n.id===d.id)) r.nodes.push(d); }
edges.push(
  {from:'diag_a1_general', to:'les_a1_alphabet_sounds', type:'Prerequisite'},{from:'diag_a1_it', to:'les_a1_alphabet_sounds', type:'Prerequisite'},
  {from:'diag_a2_general', to:'les_a2_greetings_intro', type:'Prerequisite'},{from:'diag_a2_it', to:'les_a2_it_terms_basics', type:'Prerequisite'},
  {from:'diag_b1_general', to:'les_b1_tenses_review', type:'Prerequisite'},{from:'diag_b1_it', to:'les_b1_it_architecture_vocab', type:'Prerequisite'},
  {from:'diag_b2_general', to:'les_b2_register_nuance', type:'Prerequisite'},{from:'diag_b2_it', to:'les_b2_it_mentoring', type:'Prerequisite'},
);
const hasIncoming = new Set(edges.map(e=>e.to));
for(const mod of r.modules){
  const sorted = [...mod.lessons];
  for(let i=0;i<sorted.length;i++){
    const lid = sorted[i].lessonId;
    if(i===0){
      if(!hasIncoming.has(lid)){
        const t=(mod.track||'').toLowerCase(); const c=(mod.cefrLevel||'').toUpperCase();
        if(c==='A1') edges.push({from:t==='it'?'diag_a1_it':'diag_a1_general', to:lid, type:'Prerequisite'});
        else if(c==='A2') edges.push({from:t==='it'?'diag_a2_it':'diag_a2_general', to:lid, type:'Prerequisite'});
        else if(c==='B1') edges.push({from:t==='it'?'diag_b1_it':'diag_b1_general', to:lid, type:'Prerequisite'});
        else if(c==='B2') edges.push({from:t==='it'?'diag_b2_it':'diag_b2_general', to:lid, type:'Prerequisite'});
        hasIncoming.add(lid);
      }
    } else {
      const prev = sorted[i-1].lessonId;
      const incomingFromLessons = edges.filter(e=>e.to===lid && r.nodes.some(n=>n.id===e.from && n.type==='Lesson')).length;
      if(incomingFromLessons===0){
        edges.push({from:prev, to:lid, type:'Prerequisite'});
        hasIncoming.add(lid);
      }
    }
  }
}
const val = validateDAG({nodes:r.nodes, edges});
console.log(val);
