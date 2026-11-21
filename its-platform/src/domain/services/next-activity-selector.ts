/**
 * Next-Activity Selector (i+1) — Curriculum navigator using DAG + Mastery Gate + BKT + FSRS.
 *
 * Implements the "Content Selector" row from curriculum-graph-spec.md §11:
 * - Graph Provides: Available next nodes (unlocked by mastery gates)
 * - Graph Consumes: Learner model, affective state
 *
 * Algorithm:
 * 1. Get learner's current node (last completed lesson) or diagnostic start node
 * 2. Find all reachable successor nodes via prerequisite edges
 * 3. Filter by mastery gate (all prereq skills pass MasteryGateService)
 * 4. Apply i+1 principle: prefer nodes that introduce new skills (skill_transfer edge weights)
 * 5. Apply spaced repetition: prioritize due FSRS reviews
 * 6. Apply mastery gaps: prioritize skills where P(mastery) < 0.85
 * 7. Apply track affinity (General vs IT) and CEFR progression
 * 8. Return ranked activities with rationale
 */

import { MasteryGateService, buildMasteryEvidence } from './mastery-gate.service.js';
import type { MasteryEvidence } from './mastery-gate.service.js';
import type { CurriculumGraph, CurriculumNode, CurriculumEdge } from '../../infrastructure/curriculum/curriculum-types.js';

export type ActivityType = 'lesson' | 'practice_pack' | 'listening' | 'review';

export interface NextActivityCandidate {
  activityId: string;
  activityType: ActivityType;
  nodeId: string;
  title: string;
  cefrLevel: string;
  track: 'General' | 'IT';
  estimatedDurationMinutes: number;
  rationale: {
    selectionRule: 'mastery_gate' | 'prerequisite' | 'spaced_review' | 'diagnostic_followup' | 'i_plus_1' | 'remediation';
    masteryGaps: string[];
    iPlus1: boolean;
    skillTransferScores: Record<string, number>;
    fsrsPriority: number;
    masteryGapPriority: number;
    moduleSequencePriority?: number;
  };
  prerequisitesMet: boolean;
}

export interface NextActivitySelection {
  primary: NextActivityCandidate;
  alternatives: NextActivityCandidate[];
  selectionMetadata: {
    learnerId: string;
    currentNodeId: string | null;
    track: 'General' | 'IT';
    timestamp: Date;
    availableNodes: number;
    filteredByGate: number;
  };
}

export interface LearnerModel {
  learnerId: string;
  currentNodeId: string | null;
  track: 'General' | 'IT';
  mastery: Map<string, { pKnow: number; nObs: number; distinctDays: number; spacedObs: number; lastPracticeAt: Date | null }>;
  thetaEstimates: Map<string, { theta: number; se: number; ci95Lower: number; ci95Upper: number }>;
  fsrsStates: Map<string, { stability: number; difficulty: number; lastReview: Date; dueDate: Date }>;
  affectiveSignals: Array<{ kind: string; observedAt: Date; strength: number }>;
  currentLessonId: string | null;
  timeBudgetMinutes: number;
}

export interface FsrsState {
  itemId: string;
  stability: number;
  difficulty: number;
  lastReview: Date;
  dueDate: Date;
}

export class NextActivitySelector {
  private masteryGate: MasteryGateService;
  private curriculumGraph: CurriculumGraph;

  constructor(curriculumGraph: CurriculumGraph) {
    this.masteryGate = new MasteryGateService();
    this.curriculumGraph = curriculumGraph;
  }

  /**
   * Selects the next activity for a learner.
   * 
   * @param learner - Full learner model with mastery, FSRS, theta, etc.
   * @returns Ranked next activity with rationale
   */
  selectNextActivity(learner: LearnerModel): NextActivitySelection {
    const now = new Date();
    
    // 1. Determine current position in graph
    const currentNodeId = learner.currentNodeId;
    const track = learner.track;
    
    // 2. Find all reachable nodes from current position (or entry points if no current node)
    const reachableNodes = this.findReachableNodes(currentNodeId, track, learner.thetaEstimates);
    
    // 3. Filter by mastery gate (prerequisite skills must pass)
    const unlockedNodes = this.filterByMasteryGate(reachableNodes, learner);
    
    // 3b. Check for remediation triggers across all skills (not just prereqs)
    const allMasteryGaps: string[] = [];
    console.log('[DEBUG selectNextActivity] learner.mastery keys:', Array.from(learner.mastery.keys()));
    console.log('[DEBUG selectNextActivity] learner.mastery entries:', Array.from(learner.mastery.entries()));
    for (const [skillId, mastery] of learner.mastery) {
      console.log('[DEBUG selectNextActivity] skill:', skillId, 'pKnow:', mastery.pKnow);
      if (mastery.pKnow <= 0.3) {
        allMasteryGaps.push(skillId);
      }
    }
    console.log('[DEBUG selectNextActivity] allMasteryGaps:', allMasteryGaps);
    
    // 3b. Add remediation nodes if needed
    const remediationNodes = this.findRemediationNodes(allMasteryGaps);
    for (const [nodeId, node] of remediationNodes) {
      reachableNodes.set(nodeId, node);
    }
    
    // 3c. Filter remediation nodes by mastery gate (they have no prereqs)
    for (const [nodeId, node] of remediationNodes) {
      unlockedNodes.set(nodeId, node);
    }
    
    // 4. Apply i+1 scoring to unlocked nodes
    console.log('[DEBUG selectNextActivity] unlockedNodes size before scoreCandidates:', unlockedNodes.size);
    const scoredCandidates = this.scoreCandidates(unlockedNodes, learner, now);
    
    // 4b. Add spaced review items (FSRS due)
    const reviewCandidates = this.getSpacedReviewCandidates(learner, now);
    
    // 5. Merge and rank all candidates
    const allCandidates = [...scoredCandidates, ...reviewCandidates];
    allCandidates.sort((a, b) => this.compareCandidates(a, b)); // descending
    
    if (allCandidates.length === 0) {
      throw new Error('No activities available for learner');
    }
    
    const primary = allCandidates[0]!;
    const alternatives = allCandidates.slice(1, 4);
    
    return {
      primary,
      alternatives,
      selectionMetadata: {
        learnerId: learner.learnerId,
        currentNodeId,
        track,
        timestamp: now,
        availableNodes: reachableNodes.size,
        filteredByGate: unlockedNodes.size,
      },
    };
  }

  /**
   * Finds all nodes reachable from the current node (or entry points).
   * Excludes the current node itself - only returns successors.
   */
  private findReachableNodes(
    currentNodeId: string | null, 
    track: 'General' | 'IT',
    learnerThetaEstimates?: Map<string, { theta: number; se: number; ci95Lower: number; ci95Upper: number }>
  ): Map<string, CurriculumNode> {
    const reachable = new Map<string, CurriculumNode>();
    
    // Use entry point only if no currentNodeId (new learner) - thetaEstimates optional
    // If currentNodeId is set, trust it (learner has progressed in curriculum)
    const effectiveCurrentNodeId = currentNodeId;
    
    if (effectiveCurrentNodeId && this.curriculumGraph.nodes.has(effectiveCurrentNodeId)) {
      // BFS from current node following prerequisite edges
      const queue = [effectiveCurrentNodeId];
      const visited = new Set<string>([effectiveCurrentNodeId]);
      
      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        const node = this.curriculumGraph.nodes.get(nodeId);
        
        // Only add to reachable if it's NOT the starting node
        // (we want successors, not the current node itself)
        if (nodeId !== effectiveCurrentNodeId && node) {
          reachable.set(nodeId, node);
        }
        
        // Follow prerequisite edges forward
        for (const edge of this.curriculumGraph.edges) {
          if (edge.from === nodeId && edge.type === 'prerequisite') {
            if (!visited.has(edge.to) && this.isTrackCompatible(edge.to, track)) {
              visited.add(edge.to);
              queue.push(edge.to);
            }
          }
        }
      }
    } else {
      // No current node - start from appropriate entry point for the track
      // Infer CEFR level from theta estimates, default to A1 for new learners
      let targetCefr: 'A1' | 'A2' | 'B1' | 'B2' = 'A1';
      if (learnerThetaEstimates && learnerThetaEstimates.size > 0) {
        // Use overall theta (average of all skills) to determine CEFR band
        let totalTheta = 0;
        let count = 0;
        for (const [, estimate] of learnerThetaEstimates) {
          totalTheta += estimate.theta;
          count++;
        }
        const avgTheta = count > 0 ? totalTheta / count : -2.0;
        if (avgTheta >= 1.5) targetCefr = 'B2';
        else if (avgTheta >= 0.5) targetCefr = 'B1';
        else if (avgTheta >= -1.0) targetCefr = 'A2';
        else targetCefr = 'A1';
      }
      
      const entryKey = `${targetCefr},${track}`;
      const entryNodeId = this.curriculumGraph.entryPoints.get(entryKey);
      if (entryNodeId && this.curriculumGraph.nodes.has(entryNodeId)) {
        reachable.set(entryNodeId, this.curriculumGraph.nodes.get(entryNodeId)!);
      }
    }
    
    return reachable;
  }

  /**
   * Finds remediation nodes for specific skills that need remediation.
   * Per curriculum-graph-spec.md §4.3, remediation nodes are triggered by:
   * - pronunciation θ < -1.5 -> les_rem_pronunciation_th_vw
   * - listening θ < -1.5 -> les_rem_listening_slow_clear
   * - grammar θ < -1.5 -> les_rem_grammar_be_pronouns
   * - profile = false_beginner -> les_rem_confidence_builder
   * - writing mastery < 0.60 -> les_rem_writing_svo
   */
  private findRemediationNodes(triggers: string[]): Map<string, CurriculumNode> {
    const remediationMap = new Map<string, CurriculumNode>();
    
    // Map skills to their remediation node IDs (from curriculum-graph-spec.md §4.3)
    const remediationMapSkill: Record<string, string> = {
      'th_voiced': 'les_rem_pronunciation_th_vw',
      'th_unvoiced': 'les_rem_pronunciation_th_vw',
      'v_w_interference': 'les_rem_pronunciation_th_vw',
      'listening': 'les_rem_listening_slow_clear',
      'present_simple_be': 'les_rem_grammar_be_pronouns',
      'pronouns': 'les_rem_grammar_be_pronouns',
      'grammar': 'les_rem_grammar_be_pronouns',
      'writing': 'les_rem_writing_svo',
      'sv_order': 'les_rem_writing_svo',
    };
    
    console.log('[DEBUG findRemediationNodes] triggers:', triggers);
    console.log('[DEBUG findRemediationNodes] curriculumGraph nodes has les_rem_pronunciation_th_vw:', this.curriculumGraph.nodes.has('les_rem_pronunciation_th_vw'));
    
    for (const trigger of triggers) {
      const remediationId = remediationMapSkill[trigger];
      console.log('[DEBUG findRemediationNodes] trigger:', trigger, '-> remediationId:', remediationId);
      if (remediationId && this.curriculumGraph.nodes.has(remediationId)) {
        const node = this.curriculumGraph.nodes.get(remediationId)!;
        remediationMap.set(remediationId, node);
        console.log('[DEBUG findRemediationNodes] Added remediation node:', remediationId);
      }
    }
    
    console.log('[DEBUG findRemediationNodes] returning map size:', remediationMap.size);
    return remediationMap;
  }

  /**
   * Checks if a node is a remediation node.
   */
  private isRemediationNode(nodeId: string): boolean {
    return nodeId.startsWith('les_rem_');
  }

  /**
   * Gets the target skill for a remediation node.
   * Maps remediation node IDs to the skill they target.
   */
  private getRemediationTargetSkill(nodeId: string): string | null {
    const remediationTargetMap: Record<string, string> = {
      'les_rem_pronunciation_th_vw': 'th_voiced', // Covers th_voiced, th_unvoiced, v_w_interference
      'les_rem_listening_slow_clear': 'listening',
      'les_rem_grammar_be_pronouns': 'present_simple_be', // Covers grammar, pronouns
      'les_rem_confidence_builder': 'affective_filter', // Special case
      'les_rem_writing_svo': 'writing', // Covers writing, sv_order
    };
    return remediationTargetMap[nodeId] ?? null;
  }

  /**
   * Filters nodes by mastery gate - all prerequisite skills must pass.
   */
  private filterByMasteryGate(
    reachableNodes: Map<string, CurriculumNode>,
    learner: LearnerModel
  ): Map<string, CurriculumNode> {
    const unlocked = new Map<string, CurriculumNode>();
    
    for (const [nodeId, node] of reachableNodes) {
      if (node.type !== 'lesson') continue; // Only lessons for now
      
      // Get prerequisite skills for this lesson (from graph edges)
      const prereqSkills = this.getPrerequisiteSkills(nodeId);
      
      if (prereqSkills.length === 0) {
        // No prerequisites - unlocked
        unlocked.set(nodeId, node);
        continue;
      }
      
      // Build evidence map for prerequisite skills
      const evidenceMap = new Map<string, MasteryEvidence>();
      for (const skillId of prereqSkills) {
        const mastery = learner.mastery.get(skillId);
        if (mastery) {
          evidenceMap.set(skillId, buildMasteryEvidence(
            mastery as any,
            [], // observations would come from learner history
            this.getSkillDomain(skillId),
            new Date()
          ));
        }
      }
      
      // Check if ALL prerequisite skills pass the gate
      if (this.masteryGate.allPass(evidenceMap)) {
        unlocked.set(nodeId, node);
      }
    }
    
    return unlocked;
  }

  /**
   * Scores unlocked candidates using i+1 principle, mastery gaps, FSRS, etc.
   */
  private scoreCandidates(
    unlockedNodes: Map<string, CurriculumNode>,
    learner: LearnerModel,
    now: Date
  ): NextActivityCandidate[] {
    const candidates: NextActivityCandidate[] = [];
    
    // DEBUG
    console.log('[DEBUG scoreCandidates] unlockedNodes size:', unlockedNodes.size);
    console.log('[DEBUG scoreCandidates] unlockedNodes keys:', Array.from(unlockedNodes.keys()));
    console.log('[DEBUG scoreCandidates] unlockedNodes has les_rem_pronunciation_th_vw:', unlockedNodes.has('les_rem_pronunciation_th_vw'));
    
    // First, collect all skills with very low mastery (pKnow <= 0.3) for remediation check
    const lowMasterySkills = new Set<string>();
    for (const [skillId, mastery] of learner.mastery) {
      if (mastery.pKnow <= 0.3) {
        lowMasterySkills.add(skillId);
      }
    }
    console.log('[DEBUG scoreCandidates] lowMasterySkills:', Array.from(lowMasterySkills));
    
    // DEBUG: Check Map iteration
    console.log('[DEBUG scoreCandidates] Map entries():', Array.from(unlockedNodes.entries()).length);
    console.log('[DEBUG scoreCandidates] Map keys():', Array.from(unlockedNodes.keys()).length);
    console.log('[DEBUG scoreCandidates] Map values():', Array.from(unlockedNodes.values()).length);
    console.log('[DEBUG scoreCandidates] Map [Symbol.iterator]:', typeof unlockedNodes[Symbol.iterator]);
    console.log('[DEBUG scoreCandidates] Map forEach count:', (() => { let c = 0; unlockedNodes.forEach(() => c++); return c; })());
    
    // Use forEach to ensure full iteration (fixes VM/module realm bug where for...of stops at 31/42)
    unlockedNodes.forEach((node, nodeId) => {
      console.log('[DEBUG scoreCandidates] ITERATING:', nodeId, 'type:', node.type, 'isRemediation:', nodeId.startsWith('les_rem_'));
      if (node.type !== 'lesson') {
        console.log('[DEBUG scoreCandidates] SKIPPING:', nodeId, 'type:', node.type);
        return;
      }
      
      // Get skills this lesson introduces
      const newSkills = this.getNewSkills(nodeId);
      const prereqSkills = this.getPrerequisiteSkills(nodeId);
      
      // Calculate i+1 score: how many NEW skills this lesson introduces that learner is ready for
      let iPlus1Score = 0;
      const skillTransferScores: Record<string, number> = {};
      
      for (const skill of newSkills) {
        const mastery = learner.mastery.get(skill);
        if (mastery) {
          // i+1: skill is just beyond current mastery (0.3 < p < 0.85)
          if (mastery.pKnow > 0.3 && mastery.pKnow < 0.85) {
            iPlus1Score += 1;
          }
        }
        skillTransferScores[skill] = mastery?.pKnow ?? 0;
      }
      
      // Calculate mastery gap priority (skills where learner is weak)
      let masteryGapPriority = 0;
      const masteryGaps: string[] = [];
      for (const skill of prereqSkills) {
        const mastery = learner.mastery.get(skill);
        if (mastery && mastery.pKnow < 0.85) {
          masteryGapPriority += (0.85 - mastery.pKnow);
          masteryGaps.push(skill);
        }
      }
      
      // Check for remediation triggers (very low mastery = theta < -1.5 equivalent)
      // Per curriculum-graph-spec.md §4.3: remediation triggers at theta < -1.5
      // Approximate: pKnow <= 0.3 corresponds to theta < -1.5
      const remediationTriggers: string[] = [];
      const isRemediationNode = this.isRemediationNode(node.id);
      
      if (isRemediationNode) {
        // For remediation nodes, check the target skill of the remediation
        const targetSkill = this.getRemediationTargetSkill(node.id);
        const hasTargetSkill = targetSkill !== null && lowMasterySkills.has(targetSkill);
        console.log('[DEBUG scoreCandidates] node:', node.id, 'isRemediation:', isRemediationNode, 'targetSkill:', targetSkill, 'lowMasterySkills:', Array.from(lowMasterySkills), 'hasTargetSkill:', hasTargetSkill);
        if (hasTargetSkill) {
          remediationTriggers.push(targetSkill!);
          // Add target skill to masteryGaps for rationale
          masteryGaps.push(targetSkill!);
        }
      } else {
        // For regular lessons, check if any prereq skill has very low mastery
        for (const gap of masteryGaps) {
          const mastery = learner.mastery.get(gap);
          if (mastery && mastery.pKnow <= 0.3) {
            remediationTriggers.push(gap);
          }
        }
      }
      
      console.log('[DEBUG scoreCandidates] node:', node.id, 'remediationTriggers:', remediationTriggers, 'isRemediation:', isRemediationNode);
      
      // FSRS priority for review items in this lesson
      const fsrsPriority = this.getFsrsPriorityForLesson(node.id, learner);
      
      // Track affinity bonus
      const trackBonus = this.getTrackAffinity(node, learner.track);
      
      // CEFR progression bonus (prefer same or next CEFR level)
      const cefrBonus = this.getCefrProgressionBonus(node, learner);

      // Module sequence bonus: prefer next lesson in current module order
      const moduleSequencePriority = this.getModuleSequencePriority(node, learner);
      
      // Determine selection rule
      let selectionRule: NextActivityCandidate['rationale']['selectionRule'] = 'prerequisite';
      if (remediationTriggers.length > 0) {
        selectionRule = 'remediation';
      } else if (iPlus1Score > 0) {
        selectionRule = 'i_plus_1';
      } else if (masteryGapPriority > 0) {
        selectionRule = 'mastery_gate';
      } else if (fsrsPriority > 0) {
        selectionRule = 'spaced_review';
      }
      
      console.log('[DEBUG scoreCandidates] node:', node.id, 'selectionRule:', selectionRule, 'iPlus1Score:', iPlus1Score, 'masteryGapPriority:', masteryGapPriority, 'fsrsPriority:', fsrsPriority, 'moduleSequencePriority:', moduleSequencePriority, 'totalScore approx:', (iPlus1Score * 10 + masteryGapPriority * 5 + (remediationTriggers.length > 0 ? 100000 : 0) + fsrsPriority * 3));
      
      const totalScore = 
        iPlus1Score * 10 +
        masteryGapPriority * 5 +
        (remediationTriggers.length > 0 ? 100000 : 0) + // Extremely high priority for remediation - always takes precedence
        fsrsPriority * 3 +
        trackBonus * 2 +
        cefrBonus * 1 +
        moduleSequencePriority * 4;
      
      candidates.push({
        activityId: node.id,
        activityType: 'lesson',
        nodeId: node.id,
        title: node.title,
        cefrLevel: node.cefrLevel,
        track: node.track,
        estimatedDurationMinutes: 15,
        rationale: {
          selectionRule,
          masteryGaps,
          iPlus1: iPlus1Score > 0,
          skillTransferScores,
          fsrsPriority,
          masteryGapPriority,
          moduleSequencePriority,
        },
        prerequisitesMet: true,
      });
      console.log('[DEBUG scoreCandidates] PUSHED candidate:', node.id, 'selectionRule:', selectionRule, 'totalScore:', totalScore);
    });
    
    return candidates;
  }

  /**
   * Gets spaced review candidates from FSRS due items.
   */
  private getSpacedReviewCandidates(learner: LearnerModel, now: Date): NextActivityCandidate[] {
    const candidates: NextActivityCandidate[] = [];
    
    for (const [itemId, fsrsState] of learner.fsrsStates) {
      if (fsrsState.dueDate <= now) {
        // This item is due for review
        candidates.push({
          activityId: `review_${itemId}`,
          activityType: 'review',
          nodeId: itemId,
          title: `Review: ${itemId}`,
          cefrLevel: 'A1', // would come from item metadata
          track: 'General',
          estimatedDurationMinutes: 5,
          rationale: {
            selectionRule: 'spaced_review',
            masteryGaps: [],
            iPlus1: false,
            skillTransferScores: {},
            fsrsPriority: 1 / (fsrsState.stability + 1), // lower stability = higher priority
            masteryGapPriority: 0,
          },
          prerequisitesMet: true,
        });
      }
    }
    
    return candidates;
  }

  // --- Helper methods ---
  
  private getPrerequisiteSkills(nodeId: string): string[] {
    // From graph edges - prerequisite edges point TO this lesson
    const prereqSkills: string[] = [];
    for (const edge of this.curriculumGraph.edges) {
      if (edge.to === nodeId && edge.type === 'prerequisite') {
        const fromNode = this.curriculumGraph.nodes.get(edge.from);
        const skills = fromNode?.metadata && 'skills' in fromNode.metadata 
          ? fromNode.metadata['skills'] as string[] 
          : undefined;
        if (skills) {
          prereqSkills.push(...skills);
        }
      }
    }
    return [...new Set(prereqSkills)];
  }

  private getNewSkills(nodeId: string): string[] {
    const node = this.curriculumGraph.nodes.get(nodeId);
    const newSkills = node?.metadata && 'newSkills' in node.metadata 
      ? node.metadata['newSkills'] as string[] 
      : undefined;
    return newSkills ?? [];
  }

  private getSkillDomain(skillId: string): string {
    // Map skill IDs to domains (simplified)
    if (skillId.includes('vocab') || skillId.includes('vocabulary')) return 'vocabulary';
    if (skillId.includes('grammar') || skillId.includes('present_simple') || skillId.includes('past_')) return 'grammar';
    if (skillId.includes('pronun') || skillId.includes('th_') || skillId.includes('minpair')) return 'pronunciation';
    if (skillId.includes('listen')) return 'listening';
    if (skillId.includes('read')) return 'reading';
    return 'coherence';
  }

  private getFsrsPriorityForLesson(lessonId: string, learner: LearnerModel): number {
    // Count how many FSRS items in this lesson are due/overdue
    let dueCount = 0;
    // Would need lesson -> items mapping
    return 0;
  }

  private getTrackAffinity(node: CurriculumNode, learnerTrack: 'General' | 'IT'): number {
    if (node.track === learnerTrack) return 1;
    // Cross-track allowed but lower priority
    return 0.5;
  }

  private getCefrProgressionBonus(node: CurriculumNode, learner: LearnerModel): number {
    const cefrOrder = ['A1', 'A2', 'B1', 'B2'];
    const currentCefrIndex = learner.currentNodeId 
      ? cefrOrder.indexOf(this.curriculumGraph.nodes.get(learner.currentNodeId)?.cefrLevel ?? 'A1')
      : 0;
    const nodeCefrIndex = cefrOrder.indexOf(node.cefrLevel);
    
    if (nodeCefrIndex === currentCefrIndex) return 1;
    if (nodeCefrIndex === currentCefrIndex + 1) return 1;
    return 0;
  }

  /**
   * Prioritizes next lesson in the same module sequence.
   * For learners at a module boundary, prefers first lesson of next module by sortOrder.
   */
  private getModuleSequencePriority(node: CurriculumNode, learner: LearnerModel): number {
    const nodeModuleId = node.moduleId;
    if (!nodeModuleId) return 0;

    const currentNodeId = learner.currentNodeId;
    if (!currentNodeId) {
      // New learner: prefer entry point module's first lesson
      const moduleInfo = this.curriculumGraph.modules.get(nodeModuleId);
      if (!moduleInfo) return 0;
      const idx = moduleInfo.lessonIds.indexOf(node.id);
      return idx === 0 ? 20 : 0;
    }

    const currentNode = this.curriculumGraph.nodes.get(currentNodeId);
    const currentModuleId = currentNode?.moduleId;
    if (!currentModuleId) return 0;

    // Same module: prefer immediate next lesson in declared lessonIds order
    if (currentModuleId === nodeModuleId) {
      const moduleInfo = this.curriculumGraph.modules.get(nodeModuleId);
      if (!moduleInfo) return 0;
      const currentIdx = moduleInfo.lessonIds.indexOf(currentNodeId);
      const nodeIdx = moduleInfo.lessonIds.indexOf(node.id);
      if (currentIdx >= 0 && nodeIdx === currentIdx + 1) return 20;
      if (currentIdx >= 0 && nodeIdx > currentIdx) return 1;
      return 0;
    }

    // Different module: if current was last in its module, prefer first lesson of next module
    const currentModule = this.curriculumGraph.modules.get(currentModuleId);
    if (!currentModule) return 0;
    const lastInCurrent = currentModule.lessonIds[currentModule.lessonIds.length - 1];
    if (lastInCurrent !== currentNodeId) return 0;

    const targetModule = this.curriculumGraph.modules.get(nodeModuleId);
    if (!targetModule) return 0;
    const firstInTarget = targetModule.lessonIds[0];
    if (node.id !== firstInTarget) return 0;

    // Prefer nearest next module by sortOrder, same track and CEFR progression
    if (targetModule.track !== (currentNode?.track ?? learner.track)) return 0;
    const cefrOrder = ['A1', 'A2', 'B1', 'B2'];
    const currentCefrIdx = cefrOrder.indexOf(currentModule.cefrLevel);
    const targetCefrIdx = cefrOrder.indexOf(targetModule.cefrLevel);
    if (targetCefrIdx < currentCefrIdx || targetCefrIdx > currentCefrIdx + 1) return 0;

    const sortDiff = targetModule.sortOrder - currentModule.sortOrder;
    if (sortDiff <= 0) return 0;
    return sortDiff === 1 ? 2 : 1;
  }

  private isTrackCompatible(nodeId: string, track: 'General' | 'IT'): boolean {
    const node = this.curriculumGraph.nodes.get(nodeId);
    if (!node) return false;
    // IT track learners can access General track content
    // General track learners typically don't access IT track content
    if (track === 'IT') return true;
    return node.track === 'General';
  }

  private compareCandidates(a: NextActivityCandidate, b: NextActivityCandidate): number {
    // Higher score first
    const scoreA = this.getTotalScore(a);
    const scoreB = this.getTotalScore(b);
    return scoreB - scoreA;
  }

  private getTotalScore(candidate: NextActivityCandidate): number {
    const r = candidate.rationale;
    const remediationBonus = r.selectionRule === 'remediation' ? 100000 : 0;
    return (
      remediationBonus +
      (r.iPlus1 ? 10 : 0) +
      r.masteryGapPriority * 5 +
      r.fsrsPriority * 3 +
      r.masteryGapPriority * 2 +
      (r.moduleSequencePriority ?? 0) * 4
    );
  }
}