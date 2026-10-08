import {parseCurriculumSpec} from './its-platform/src/infrastructure/curriculum/curriculum-parser.ts';
import fs from 'fs';

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
function hasCycle(nodelist, edgelist){
  const graph = new Map();
  const nodes = new Set(nodelist.map(x=>x.id));
  for(const n of nodelist) graph.set(n.id, []);
  for(const e of edgelist){
    if(!nodes.has(e.from)) nodes.add(e.from);
    if(!nodes.has(e.to)) nodes.add(e.to);
    if(!graph.has(e.from)) graph.set(e.from, []);
    if(!graph.has(e.to)) graph.set(e.to, []);
    graph.get(e.from).push(e.to);
  }
  const state = new Map([...nodes].map(x=>[x, 0]));
  function dfs(cur, path){
    state.set(cur,1);
    const children = graph.get(cur)||[];
    for(let i=0;i<children.length;i++){
      const nxt = children[i];
      if(state.get(nxt)===1){ console.log('backedge', cur, nxt); return true; }
      if(state.get(nxt)===0 && dfs(nxt, path.concat([cur]))){ return true; }
    }
    state.set(cur,2);
    return false;
  }
  for(const n of nodes){
    if(state.get(n)===0){
      if(dfs(n, [n])) return true;
    }
  }
  return false;
}
console.log(hasCycle(r.nodes, edges));
