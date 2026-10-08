export type NodeType = 'lesson' | 'module' | 'milestone' | 'diagnostic_entry';
export type EdgeType =
  | 'prerequisite'
  | 'alternative_path'
  | 'remediation'
  | 'enrichment'
  | 'module_sequence';
export type Track = 'General' | 'IT';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface CurriculumNode {
  id: string;
  type: NodeType;
  title: string;
  cefrLevel: CEFRLevel;
  track: Track;
  moduleId?: string;
  sourceRef?: string;
  status: 'authored' | 'blocked_no_adequate_source';
  metadata?: Record<string, unknown>;
}

export interface CurriculumEdge {
  from: string;
  to: string;
  type: EdgeType;
  skillTransfer?: Record<string, number>;
  newSkillsIntroduced?: string[];
  weight?: number;
}

export interface CurriculumGraph {
  nodes: Map<string, CurriculumNode>;
  edges: CurriculumEdge[];
  modules: Map<string, ModuleInfo>;
  entryPoints: Map<string, string>; // "(cefr,track)" -> lessonId
  remediationNodes: Map<string, RemediationInfo>;
  alternativePaths: Map<string, string>; // moduleId <-> alternative moduleId
}

export interface ModuleInfo {
  id: string;
  title: string;
  cefrLevel: CEFRLevel;
  track: Track;
  sourceMarkdowns: string[];
  sortOrder: number;
  expectedLessons: number;
  lessonIds: string[];
}

export interface RemediationInfo {
  lessonId: string;
  targetSkill: string;
  trigger: string;
}

export interface StartNodeMapping {
  startNode: string;
  remediationNodes: string[];
}

export interface DiagnosticProfile {
  overallTheta: number;
  skills: Record<string, { theta: number }>;
  role?: string;
  profile?: string;
}