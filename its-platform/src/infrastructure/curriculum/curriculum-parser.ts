import type {
  CurriculumGraph,
  CurriculumNode,
  CurriculumEdge,
  ModuleInfo,
  RemediationInfo,
  NodeType,
  EdgeType,
  Track,
  CEFRLevel,
  StartNodeMapping,
  DiagnosticProfile,
} from './curriculum-types.js';

const CEFR_RANK: Record<CEFRLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3 };

function parseModuleCatalogTable(markdown: string): Map<string, ModuleInfo> {
  const modules = new Map<string, ModuleInfo>();
  const lines = markdown.split('\n');
  let inModuleTable = false;
  let headerSkipped = false;
  let separatorSkipped = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() || '';

    // Detect module catalog table header (flexible match)
    if (line.includes('Module ID') && line.includes('Title') && line.includes('CEFR') && line.includes('Source Markdown')) {
      inModuleTable = true;
      headerSkipped = true;
      separatorSkipped = false;
      continue;
    }

    if (inModuleTable) {
      // Skip separator line
      if (!separatorSkipped && line.startsWith('|---')) {
        separatorSkipped = true;
        continue;
      }

      // End of table
      if (line.startsWith('|') && line.includes('|') && line.split('|').length >= 7) {
        // Parse module row
        const parts = line.split('|').slice(1, -1).map(p => p.trim());
        if (parts.length >= 6) {
          const modId = parts[0]!.replace(/[`*]/g, '').trim();
          const title = parts[1]!.replace(/[`*]/g, '').trim();
          const cefr = parts[2]!.replace(/[`*]/g, '').trim();
          const sourceMarkdown = parts[3]!.replace(/[`*]/g, '').trim();
          const trackRaw = parts[4]!.replace(/[`*]/g, '').trim();
          const lessonsStr = parts[5]!.replace(/[`*]/g, '').trim();
          if (modId.startsWith('mod_')) {
            // Normalize track: "IT Track" -> "IT", "General" -> "General", "Both" -> "Both"
            const track = trackRaw === 'IT Track' ? 'IT' : trackRaw as Track;
            const mod: ModuleInfo = {
              id: modId,
              title,
              cefrLevel: cefr as CEFRLevel,
              track,
              sourceMarkdowns: sourceMarkdown.split(',').map(s => s.trim()).filter(Boolean),
              sortOrder: modules.size,
              expectedLessons: parseInt(lessonsStr, 10) || 0,
              lessonIds: [],
            };
            modules.set(modId, mod);
          }
        }
        continue;
      }

      // Exit table when we hit a non-table line after header/separator
      if (headerSkipped && separatorSkipped && !line.startsWith('|')) {
        inModuleTable = false;
      }
    }
  }

  return modules;
}

function parseLessonRegistry(markdown: string, modules: Map<string, ModuleInfo>): {
  nodes: Map<string, CurriculumNode>;
  edges: CurriculumEdge[];
  remediationNodes: Map<string, RemediationInfo>;
} {
  const nodes = new Map<string, CurriculumNode>();
  const edges: CurriculumEdge[] = [];
  const remediationNodes = new Map<string, RemediationInfo>();

  const lines = markdown.split('\n');
  let currentModuleId: string | null = null;
  let currentModuleCefr: CEFRLevel = 'A1';
  let currentModuleTrack: Track = 'General';
  let inLessonTable = false;
  let inRemediationTable = false;
  let lessonTableHeaderSkipped = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim() || '';

    // Detect module header in §4.3: `**`mod_a1_foundation`**` (A1, General)
    // Format: `**`mod_id`**` (A1, General)` - bold with code inside, NO trailing backtick
    // CEFR level can be A1, A2, B1, B2 or A2→B1 (transitional)
    const modMatch = line.match(/^\*\*\s*`([^`]+)`\s*\*\*\s*\((A[12]|B[12]|A2→B1),\s*(General|IT\s*Track)\)/);
    if (modMatch) {
      const [, modId, cefr, track] = modMatch;
      currentModuleId = modId!.trim();
      // Normalize CEFR level: A2→B1 maps to A2 for tracking purposes
      const normalizedCefr = cefr === 'A2→B1' ? 'A2' : cefr;
      currentModuleCefr = (normalizedCefr || 'A1') as CEFRLevel;
      currentModuleTrack = (track?.trim() || 'General') as Track;
      if (!modules.has(currentModuleId)) {
        modules.set(currentModuleId, {
          id: currentModuleId,
          title: '',
          cefrLevel: currentModuleCefr,
          track: currentModuleTrack,
          sourceMarkdowns: [],
          sortOrder: modules.size,
          expectedLessons: 0,
          lessonIds: [],
        });
      }
      inLessonTable = false;
      inRemediationTable = false;
      lessonTableHeaderSkipped = false;
      continue;
    }

    // Detect lesson table header (both 4-column legacy and 6-column ADR-021 formats)
    if (line.includes('| Lesson ID | Title | Source | Status |') || 
        line.includes('| Lesson ID | Title | Source | New skills | Prerequisite skills | Status |')) {
      inLessonTable = true;
      lessonTableHeaderSkipped = false;
      inRemediationTable = false;
      continue;
    }

    // Detect remediation table header
    if (line.includes('| Lesson ID | Target Skill | Trigger |')) {
      inLessonTable = false;
      inRemediationTable = true;
      continue;
    }

    // End of lesson table - detect when we hit a module header or empty section
    if (inLessonTable && !line.startsWith('|') && line.length > 0) {
      // But don't exit if it's a note line (starts with ↳ or >)
      if (!line.startsWith('↳') && !line.startsWith('>')) {
        inLessonTable = false;
      }
    }

    // Parse lesson rows
    if (inLessonTable && line.startsWith('|') && line.includes('|')) {
      if (!lessonTableHeaderSkipped && line.startsWith('|---')) {
        lessonTableHeaderSkipped = true;
        
        continue;
      }
      if (lessonTableHeaderSkipped) {
        const parts = line.split('|').slice(1, -1).map(p => p.trim());
        // ADR-021: Expect 6 columns now: Lesson ID | Title | Source | New skills | Prerequisite skills | Status
        // Support both 4-column (legacy) and 6-column (ADR-021) formats
        const lessonIdCandidate = (parts[0] ?? '').replace(/[`*]/g, '').trim();
        const isLessonRow = lessonIdCandidate.startsWith('les_');
        const isNoteRow = lessonIdCandidate.startsWith('↳') || lessonIdCandidate.startsWith('>');
        
        // Skip note rows (not lesson rows)
        if (isNoteRow) {
          continue;
        }
        
        if (isLessonRow && parts.length < 4) {
          throw new Error(`Lesson row has ${parts.length} columns, expected at least 4: ${line}`);
        }
        if (isLessonRow) {
          const lessonId = parts[0]!.replace(/[`*]/g, '').trim();
          const title = parts[1]!.replace(/[`*]/g, '').trim();
          const source = parts[2]!.replace(/[`*]/g, '').trim();
          
          // Support both 4-column (legacy) and 6-column (ADR-021) formats
          let newSkillsStr = '';
          let prereqSkillsStr = '';
          let status: string;
          
          if (parts.length >= 6) {
            // 6-column format (ADR-021): Lesson ID | Title | Source | New skills | Prerequisite skills | Status
            newSkillsStr = parts[3]!.replace(/[`*]/g, '').trim();
            prereqSkillsStr = parts[4]!.replace(/[`*]/g, '').trim();
            status = parts[5]!.replace(/[`*]/g, '').trim();
          } else {
            // 4-column format (legacy): Lesson ID | Title | Source | Status
            newSkillsStr = '';
            prereqSkillsStr = '';
            status = parts[3]!.replace(/[`*]/g, '').trim();
          }
          
          const cleanStatus = status.replace(/[✅`*]/g, '').trim();
          let nodeStatus: CurriculumNode['status'] = 'authored';
          if (cleanStatus.includes('blocked')) nodeStatus = 'blocked_no_adequate_source';

          const newSkills = newSkillsStr ? newSkillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
          const prereqSkills = prereqSkillsStr ? prereqSkillsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
          
          if (lessonId.startsWith('les_') && currentModuleId) {
            const cleanStatus = status.replace(/[✅`*]/g, '').trim();
            let nodeStatus: CurriculumNode['status'] = 'authored';
            if (cleanStatus.includes('blocked')) nodeStatus = 'blocked_no_adequate_source';

            const node: CurriculumNode = {
              id: lessonId,
              type: 'lesson',
              title: title,
              cefrLevel: currentModuleCefr,
              track: currentModuleTrack,
              moduleId: currentModuleId,
              sourceRef: source,
              status: nodeStatus,
              metadata: {
                newSkills,
                skills: prereqSkills,
              },
            };
            nodes.set(node.id, node);

            // Update module
            const mod = modules.get(currentModuleId);
            if (mod) {
              mod.lessonIds.push(node.id);
              mod.expectedLessons++;
            }
          }
        }
      }
    }

    // Parse remediation rows
    if (inRemediationTable && line.startsWith('|') && line.includes('|')) {
      const parts = line.split('|').slice(1, -1).map(p => p.trim());
      if (parts.length >= 3) {
        const lessonId = parts[0]!.replace(/[`*]/g, '').trim();
        const targetSkill = parts[1]!.replace(/[`*]/g, '').trim();
        const trigger = parts[2]!.replace(/[`*]/g, '').trim();
        if (lessonId.startsWith('les_rem_')) {
          const rem: RemediationInfo = {
            lessonId: lessonId.replace(/[`*]/g, '').trim(),
            targetSkill: targetSkill.replace(/[`*]/g, '').trim(),
            trigger: trigger.replace(/[`*]/g, '').trim(),
          };
          remediationNodes.set(rem.lessonId, rem);

          // Add remediation node to graph
          nodes.set(rem.lessonId, {
            id: rem.lessonId,
            type: 'lesson',
            title: rem.targetSkill,
            cefrLevel: 'A1' as CEFRLevel,
            track: 'General' as Track,
            status: 'authored',
            metadata: { isRemediation: true, trigger: rem.trigger },
          });
        }
      }
    }
  }

  // Build prerequisite edges from module sequences (lessons within module)
  for (const mod of modules.values()) {
    let prevLessonId: string | null = null;
    for (const lessonId of mod.lessonIds) {
      if (prevLessonId) {
        edges.push({
          from: prevLessonId,
          to: lessonId,
          type: 'prerequisite',
        });
      }
      prevLessonId = lessonId;
    }
  }

  // Add module -> first lesson edges so modules connect to their lessons
  for (const mod of modules.values()) {
    if (mod.lessonIds.length > 0) {
      edges.push({
        from: mod.id,
        to: mod.lessonIds[0]!,
        type: 'module_sequence', // reuse module_sequence type for module->lesson connection
      });
    }
  }

  // Add module -> first lesson edges so modules connect to their lessons
  for (const mod of modules.values()) {
    if (mod.lessonIds.length > 0) {
      edges.push({
        from: mod.id,
        to: mod.lessonIds[0]!,
        type: 'module_sequence',
      });
    }
  }

  // Add cross-module edges: last lesson of module -> first lesson of successor modules
  const moduleSequence: Record<string, string[]> = {
    mod_a1_foundation: ['mod_a1_grammar_start'],
    mod_a1_grammar_start: ['mod_a1_vocab_core'],
    mod_a1_vocab_core: ['mod_a1_comm_basic'],
    mod_a1_comm_basic: ['mod_a2_workplace_intro'],
    mod_a2_workplace_intro: ['mod_a2_workplace_comm'],
    mod_a2_workplace_comm: ['mod_a2_workplace_tasks'],
    mod_a2_workplace_tasks: ['mod_a2_travel', 'mod_a2_it_fundamentals'],
    mod_a2_travel: ['mod_a2_skills_rw'],
    mod_a2_skills_rw: ['mod_b1_grammar_consolidate', 'mod_a2_it_communication'],
    mod_b1_grammar_consolidate: ['mod_b1_workplace_adv'],
    mod_b1_workplace_adv: ['mod_b1_fluency_project', 'mod_b1_it_technical'],
    mod_b1_fluency_project: ['mod_b2_professional'],
    mod_b2_professional: ['mod_b2_cert_prep', 'mod_b2_it_senior'],
  };

  for (const [fromModId, toModIds] of Object.entries(moduleSequence)) {
    const fromMod = modules.get(fromModId);
    if (!fromMod || fromMod.lessonIds.length === 0) continue;
    for (const toModId of toModIds) {
      const toMod = modules.get(toModId);
      if (toMod && toMod.lessonIds.length > 0) {
        edges.push({
          from: fromMod.lessonIds[fromMod.lessonIds.length - 1]!,
          to: toMod.lessonIds[0]!,
          type: 'prerequisite',
        });
      }
    }
  }

  return { nodes, edges, remediationNodes };
}

function buildModuleSequenceEdges(modules: Map<string, ModuleInfo>): CurriculumEdge[] {
  const edges: CurriculumEdge[] = [];

  // Module sequence from spec
  const moduleSequence: Record<string, string[]> = {
    mod_a1_foundation: ['mod_a1_grammar_start'],
    mod_a1_grammar_start: ['mod_a1_vocab_core'],
    mod_a1_vocab_core: ['mod_a1_comm_basic'],
    mod_a1_comm_basic: ['mod_a2_workplace_intro'],
    mod_a2_workplace_intro: ['mod_a2_workplace_comm'],
    mod_a2_workplace_comm: ['mod_a2_workplace_tasks'],
    mod_a2_workplace_tasks: ['mod_a2_skills_rw', 'mod_a2_it_fundamentals'],
    mod_a2_skills_rw: ['mod_b1_grammar_consolidate', 'mod_a2_it_communication'],
    mod_a2_travel: [], // substituted by IT track
    mod_b1_grammar_consolidate: ['mod_b1_workplace_adv'],
    mod_b1_workplace_adv: ['mod_b1_fluency_project', 'mod_b1_it_technical'],
    mod_b1_fluency_project: ['mod_b2_professional'],
    mod_b2_professional: ['mod_b2_cert_prep', 'mod_b2_it_senior'],
  };

  for (const [fromMod, toMods] of Object.entries(moduleSequence)) {
    for (const toMod of toMods) {
      if (modules.has(fromMod) && modules.has(toMod)) {
        edges.push({
          from: fromMod,
          to: toMod,
          type: 'module_sequence',
        });
      }
    }
  }

  // Alternative path edges (General ↔ IT at module boundaries)
  // NOTE: These are NOT added as traversable edges in the DAG to preserve acyclicity.
  // They represent mutually exclusive track choices at module boundaries.
  // The actual track is chosen at diagnostic time and the path follows only one branch.
  // We track them as metadata only.
  const altPaths: [string, string][] = [
    ['mod_a2_travel', 'mod_a2_it_fundamentals'],
    ['mod_a2_skills_rw', 'mod_a2_it_communication'],
    ['mod_b1_workplace_adv', 'mod_b1_it_technical'],
    ['mod_b2_professional', 'mod_b2_it_senior'],
  ];
  const alternativePaths = new Map<string, string>();
  for (const [gen, it] of altPaths) {
    if (modules.has(gen) && modules.has(it)) {
      alternativePaths.set(gen, it);
      alternativePaths.set(it, gen);
    }
  }
  // We don't add them to edges for DAG validation

  return edges;
}

export function parseCurriculumSpec(markdown: string): CurriculumGraph {
  // Step 1: Parse module catalog from section 3 table
  const modules = parseModuleCatalogTable(markdown);

  // Step 2: Parse lesson registry from section 4.3
  const { nodes, edges: lessonEdges, remediationNodes } = parseLessonRegistry(markdown, modules);

  // Step 3: Build module sequence edges
  const moduleEdges = buildModuleSequenceEdges(modules);

  // Step 4: Add module nodes to graph
  for (const mod of modules.values()) {
    nodes.set(mod.id, {
      id: mod.id,
      type: 'module',
      title: mod.title,
      cefrLevel: mod.cefrLevel,
      track: mod.track,
      sourceRef: mod.sourceMarkdowns.join(', '),
      status: 'authored',
      metadata: { sortOrder: mod.sortOrder, expectedLessons: mod.expectedLessons },
    });
  }

  // Step 5: Remediation edges (dynamic at runtime, not in static DAG to preserve acyclicity)
  // We keep remediationNodes in the graph for metadata but don't add edges

  // Step 6: Entry points from §5.1
  const entryPoints = new Map<string, string>([
    ['A1,General', 'les_a1_alphabet_sounds'],
    ['A1,IT', 'les_a1_alphabet_sounds'],
    ['A2,General', 'les_a2_greetings_intro'],
    ['A2,IT', 'les_a2_it_terms_basics'],
    ['B1,General', 'les_b1_tenses_review'],
    ['B1,IT', 'les_b1_it_architecture_vocab'],
    ['B2,General', 'les_b2_register_nuance'],
    ['B2,IT', 'les_b2_it_mentoring'],
  ]);

  // Alternative paths as metadata (not traversable edges for DAG)
  const altPaths: [string, string][] = [
    ['mod_a2_travel', 'mod_a2_it_fundamentals'],
    ['mod_a2_skills_rw', 'mod_a2_it_communication'],
    ['mod_b1_workplace_adv', 'mod_b1_it_technical'],
    ['mod_b2_professional', 'mod_b2_it_senior'],
  ];
  const alternativePaths = new Map<string, string>();
  for (const [gen, it] of altPaths) {
    if (modules.has(gen) && modules.has(it)) {
      alternativePaths.set(gen, it);
      alternativePaths.set(it, gen);
    }
  }

  const allEdges = [...lessonEdges, ...moduleEdges];

  return { nodes, edges: allEdges, modules, entryPoints, remediationNodes, alternativePaths };
}

export function mapDiagnosticToStartNode(profile: DiagnosticProfile): StartNodeMapping {
  const { overallTheta, skills, role, profile: learnerProfile } = profile;
  let cefrBand: CEFRLevel;
  if (overallTheta < -1.0) cefrBand = 'A1';
  else if (overallTheta < 0.5) cefrBand = 'A2';
  else if (overallTheta < 1.5) cefrBand = 'B1';
  else cefrBand = 'B2';

  const track: Track = role === 'dev' && (skills['vocabulary']?.theta ?? 0) > (skills['grammar']?.theta ?? 0) ? 'IT' : 'General';

  const skillsRecord = skills as Record<string, { theta: number }>;
  const weakSkills = Object.entries(skillsRecord)
    .filter(([, v]) => v.theta < -1.0)
    .map(([s]) => s);

  const startNodes: Record<string, string> = {
    'A1,General': 'les_a1_alphabet_sounds',
    'A1,IT': 'les_a1_alphabet_sounds',
    'A2,General': 'les_a2_greetings_intro',
    'A2,IT': 'les_a2_it_terms_basics',
    'B1,General': 'les_b1_tenses_review',
    'B1,IT': 'les_b1_it_architecture_vocab',
    'B2,General': 'les_b2_register_nuance',
    'B2,IT': 'les_b2_it_mentoring',
  };

  const startNode = startNodes[`${cefrBand},${track}`] || 'les_a1_alphabet_sounds';

  const remediation: string[] = [];
  if (weakSkills.includes('pronunciation')) remediation.push('les_rem_pronunciation_th_vw');
  if (weakSkills.includes('listening')) remediation.push('les_rem_listening_slow_clear');
  if (learnerProfile === 'false_beginner_suspected') remediation.push('les_rem_confidence_builder');

  return { startNode, remediationNodes: remediation };
}

export function validateAcyclic(graph: CurriculumGraph): { valid: boolean; cycle?: string[] } {
  const adj = new Map<string, string[]>();
  const indegree = new Map<string, number>();

  for (const nodeId of graph.nodes.keys()) {
    adj.set(nodeId, []);
    indegree.set(nodeId, 0);
  }

  for (const edge of graph.edges) {
    if (adj.has(edge.from) && adj.has(edge.to)) {
      adj.get(edge.from)!.push(edge.to);
      indegree.set(edge.to, (indegree.get(edge.to) || 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [nodeId, deg] of indegree) {
    if (deg === 0) queue.push(nodeId);
  }

  const topo: string[] = [];
  while (queue.length) {
    const u = queue.shift()!;
    topo.push(u);
    for (const v of adj.get(u) || []) {
      const newDeg = indegree.get(v)! - 1;
      indegree.set(v, newDeg);
      if (newDeg === 0) queue.push(v);
    }
  }

  if (topo.length !== graph.nodes.size) {
    const remaining = Array.from(graph.nodes.keys()).filter(n => !topo.includes(n));
    return { valid: false, cycle: remaining };
  }
  return { valid: true };
}

export function validateCEFRMonotonicity(graph: CurriculumGraph): boolean {
  const getRank = (level: CEFRLevel): number => CEFR_RANK[level] ?? -1;
  for (const edge of graph.edges) {
    const fromNode = graph.nodes.get(edge.from);
    const toNode = graph.nodes.get(edge.to);
    if (fromNode && toNode && fromNode.cefrLevel && toNode.cefrLevel) {
      if (getRank(fromNode.cefrLevel) > getRank(toNode.cefrLevel)) {
        return false;
      }
    }
  }
  return true;
}

export function validateReachability(graph: CurriculumGraph): string[] {
  const reachable = new Set<string>();
  for (const entryId of graph.entryPoints.values()) {
    if (graph.nodes.has(entryId)) {
      dfs(entryId, graph, reachable);
    }
  }
  const orphans = Array.from(graph.nodes.keys() as Iterable<string>).filter(n => {
    const node = graph.nodes.get(n);
    const meta = node?.metadata as Record<string, unknown> | undefined;
    return !reachable.has(n) && node?.type === 'lesson' && meta?.['isRemediation'] !== true;
  });
  return orphans;
}

function dfs(nodeId: string, graph: CurriculumGraph, visited: Set<string>): void {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);
  for (const edge of graph.edges) {
    if (edge.from === nodeId) {
      dfs(edge.to, graph, visited);
    }
  }
}