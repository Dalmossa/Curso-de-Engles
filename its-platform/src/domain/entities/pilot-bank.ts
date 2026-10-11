/**
 * Domain entities — Stage-1 Pilot Bank (diagnostic_form_v1)
 * 
 * 12 expert-anchored items for the fixed-form diagnostic per ADR-017.
 * Items are authored (provenance.kind = 'authored') which is permitted for
 * the fixed form per ADR-017 §2 ("authored provenance is permitted").
 * 
 * Items per ADR-017 §2:
 * - Grammar: 4 items
 * - Vocabulary: 3 items  
 * - Reading: 3 items
 * - Pronunciation: 2 items (minimal-pair identification only)
 * Total: 12 items
 * 
 * Calibration: expert_anchored with declared SE per ADR-017 §1
 * - Var_b = (1.75 / n_raters)², n_raters = 3 → Var_b = 0.340
 * - Var_a = 0.35² = 0.1225
 * - SE_parameter ≈ 0.30
 * - SE_statistical = 1/√(n·a²/4) = 1/√(12·1.2²/4) = 1/√4.32 = 0.481
 * - SE_effective = √(0.481² + 0.30²) = 0.567
 * CI₉₅ half-width = 1.96 × 0.567 = ±1.11 on θ
 * 
 * Per ADR-017 §2: items have provenance.kind = 'authored' which is
 * permitted for the fixed form (not a CAT). The form is versioned as
 * diagnostic_form_v1 and pinned on the run.
 */

import type { ItemType, Modality, Scoring, DistractorType, CalibrationStatus, ProvenanceKind, LifecycleState } from './assessment-item.js';
import type { ItemOption } from './assessment-item.js';

export interface PilotBankItem {
  readonly id: string;
  readonly schemaVersion: string;
  readonly skillIds: string[];
  readonly lessonId: string | null;
  readonly dialogueId: string | null;
  readonly slotNumber: number | null;
  readonly clipIds: string[] | null;
  readonly cefrLevel: string;
  readonly domainId: string;
  readonly itemType: ItemType;
  readonly listeningKind: null;
  readonly listeningTier: null;
  readonly modality: Modality;
  readonly scoring: Scoring;
  readonly stem: string;
  readonly key: string;
  readonly answerVariants: string[] | null;
  readonly pRandom: number;
  readonly brPtTags: string[];
  readonly brPtFormState: 'applicable' | 'not_applicable_no_distractor_set';
  readonly irtModel: string;
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly aSe: number;
  readonly bSe: number;
  readonly nResponses: number;
  readonly calibrationStatus: CalibrationStatus;
  readonly anchoredBy: string[];
  readonly lastRefit: Date | null;
  readonly infitMnsq: number | null;
  readonly outfitMnsq: number | null;
  readonly pointBiserial: number | null;
  readonly difficultyP: number | null;
  readonly difFlags: unknown;
  readonly retired: boolean;
  readonly retiredReason: string | null;
  readonly lifecycleState: LifecycleState;
  readonly provenanceKind: ProvenanceKind;
  readonly provenanceSourceFile: string | null;
  readonly provenanceSourceLocator: string | null;
  readonly reviewedBy: string | null;
  readonly reviewDue: Date | null;
  readonly ttsRequired: boolean;
  readonly ttsRefs: string[];
  readonly assistTtsRefs: string[];
  readonly estimatedTimeSec: number;
  readonly authoredAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly options: ItemOption[];
}

export interface DiagnosticForm {
  readonly formVersion: string;
  readonly formId: string;
  readonly items: PilotBankItem[];
  readonly totalItems: number;
  readonly domains: Record<string, number>;
  readonly blueprint: FormBlueprint;
  readonly calibrationDisclosure: CalibrationDisclosure;
}

export interface FormBlueprint {
  readonly grammar: number;
  readonly vocabulary: number;
  readonly reading: number;
  readonly pronunciation: number;
  readonly total: number;
}

export interface CalibrationDisclosure {
  readonly poolStatus: 'expert_anchored';
  readonly seStatistical: number;
  readonly seParameter: number;
  readonly seEffective: number;
  readonly precisionLabel: 'provisional';
  readonly domainsNotAssessed: string[];
  readonly disclosureText: string;
}

export interface DiagnosticRun {
  readonly formVersion: string;
  readonly formId: string;
  readonly learnerId: string;
  readonly sessionId: string;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly responses: DiagnosticResponse[];
  readonly thetaOverall: number;
  readonly seStatistical: number;
  readonly seParameter: number;
  readonly seEffective: number;
  readonly cefr: string;
  readonly ci95Lower: number;
  readonly ci95Upper: number;
  readonly skillThetas: SkillTheta[];
  readonly profile: string;
  readonly recommendedStartNode: string;
  readonly calibrationDisclosure: CalibrationDisclosure;
  readonly skillThetaReportable: Record<string, boolean>;
  readonly bktPriorsOverride: Record<string, number>;
  readonly placementProvisional: boolean;
  readonly startCefr: string;
  readonly startNode: string;
  readonly belowScale: boolean;
  readonly remediationNodes: string[];
}

export interface DiagnosticResponse {
  readonly itemId: string;
  readonly skillId: string;
  readonly correct: boolean;
  readonly responseTimeMs: number;
  readonly thetaAfter: number;
  readonly seAfter: number;
}

export interface SkillTheta {
  readonly skillId: string;
  readonly theta: number;
  readonly se: number;
  readonly cefr: string;
  readonly reportable: boolean;
  readonly itemsAdministered: number;
  readonly note?: string;
}

export interface StartNodeMapping {
  readonly startCefr: string;
  readonly startNode: string;
  readonly belowScale: boolean;
  readonly remediationNodes: string[];
  readonly profile: string;
}

/**
 * CEFR θ thresholds per stats-progress-evaluation-spec.md §3.1
 * A2 = −0.5, B1 = 0.5, B2 = 1.5
 */
export const CEFR_THRESHOLDS = {
  A1: { min: -Infinity, max: -0.5, label: 'A1' },
  A2: { min: -0.5, max: 0.5, label: 'A2' },
  B1: { min: 0.5, max: 1.5, label: 'B1' },
  B2: { min: 1.5, max: Infinity, label: 'B2' },
} as const;

/**
 * Start node mapping per curriculum-graph-spec.md §5.1
 * CEFR band → (General track, IT track) entry nodes
 *
 * §5.1 is the authority ADR-017 §3 names, and it is authoritative here even where the ids it
 * names are not the only ones that exist: all three ids the previous B1/IT and B2 rows carried
 * (`les_b1_it_write_docs`, `les_b2_professional_argument`, `les_b2_it_advanced_patterns`) are
 * real lessons, so existence does not decide a row — §5.1 does (ADR-023 Decision 3 and its
 * Context §1). §5.1's B1/IT note is explicit that the IT entry points were repointed on
 * 2026-09-30 (§4.4.6) once their sources were restored, so the older ids are the stale ones.
 */
export const START_NODE_TABLE: Record<string, { general: string; it: string }> = {
  A1: { general: 'les_a1_alphabet_sounds', it: 'les_a1_alphabet_sounds' },
  A2: { general: 'les_a2_greetings_intro', it: 'les_a2_it_terms_basics' },
  B1: { general: 'les_b1_tenses_review', it: 'les_b1_it_architecture_vocab' },
  B2: { general: 'les_b2_register_nuance', it: 'les_b2_it_mentoring' },
} as const;

/**
 * Remediation nodes per curriculum-graph-spec.md §6.4
 */
export const REMEDIATION_NODES = [
  'les_rem_confidence_builder',
  'les_rem_grammar_be_pronouns',
  'les_rem_listening_slow_clear',
  'les_rem_pronunciation_th_vw',
  'les_rem_writing_svo',
] as const;

/**
 * Skill to domain mapping for domain-level reporting
 */
export const SKILL_TO_DOMAIN: Record<string, string> = {
  // Grammar skills
  'present_simple_be': 'grammar',
  'present_simple_questions': 'grammar',
  'articles_nouns': 'grammar',
  'demonstrative_this': 'grammar',
  'wh_questions_how': 'grammar',
  'regular_verbs_past': 'grammar',
  'past_narrative': 'grammar',
  'future_will': 'grammar',
  'present_continuous': 'grammar',
  'modals_can_need': 'grammar',
  'imperatives': 'grammar',
  'prepositions_basic': 'grammar',
  'tenses_review': 'grammar',
  'modals': 'grammar',
  'conditionals': 'grammar',
  'passive': 'grammar',
  'reported_speech': 'grammar',
  'question_forms': 'grammar',
  'register_nuance': 'grammar',
  
  // Vocabulary skills
  'greetings_vocab': 'vocabulary',
  'numbers_colors': 'vocabulary',
  'days_months': 'vocabulary',
  'time_dates': 'vocabulary',
  'food': 'vocabulary',
  'occupations': 'vocabulary',
  'false_cognates': 'vocabulary',
  'travel_vocab_core': 'vocabulary',
  'tech_terms_basics': 'vocabulary',
  'it_acronyms_deep': 'vocabulary',
  'it_jargon_mastery': 'vocabulary',
  'email_register': 'vocabulary',
  'meeting_vocab': 'vocabulary',
  'weekend_vocab': 'vocabulary',
  'corporate_wrapup': 'vocabulary',
  'finance_business': 'vocabulary',
  'hr_career': 'vocabulary',
  'sales_marketing': 'vocabulary',
  'professional_argument': 'vocabulary',
  'professional_email_advanced': 'vocabulary',
  'professional_review': 'vocabulary',
  'professional_summary': 'vocabulary',
  'exam_vocab': 'vocabulary',
  'celpe_br': 'vocabulary',
  
  // Reading skills
  'reading_skimming': 'reading',
  'reading_strategy': 'reading',
  'reading_comprehension': 'reading',
  'email_samples': 'reading',
  'meeting_participate': 'reading',
  
  // Pronunciation skills
  'th_voiced': 'pronunciation',
  'th_unvoiced': 'pronunciation',
  'h_aspirated': 'pronunciation',
  's_consonant_cluster': 'pronunciation',
  'r_initial': 'pronunciation',
  'word_stress': 'pronunciation',
  'connected_speech': 'pronunciation',
  'sentence_stress': 'pronunciation',
  'intonation_patterns': 'pronunciation',
  
  // Listening skills
  'dialog_comprehension': 'listening',
  'natural_speed': 'listening',
  'multi_speaker': 'listening',
  'meeting_open': 'listening',
  'discussion_flow': 'listening',
  
  // Coherence skills (pair-level)
  'reciprocal_introduction': 'coherence',
  'email_register_pairing': 'coherence',
  'two_part_disagreement_frame': 'coherence',
  
  // Writing skills
  'writing_svo': 'writing',
  'writing_messages': 'writing',
  'writing_bio': 'writing',
  'writing_past': 'writing',
  'writing_selfcheck': 'writing',
  'email_basics': 'writing',
} as const;
