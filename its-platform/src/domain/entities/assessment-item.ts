/**
 * Domain entities — item bank (context 2).
 * Pure TypeScript, no framework imports (ADR-014).
 */

export type ItemType =
  | 'gap_fill'
  | 'error_correction'
  | 'form_selection'
  | 'definition_match'
  | 'register_selection'
  | 'scanning'
  | 'cloze'
  | 'matching'
  | 'ordering'
  | 'contextual_selection'
  | 'minimal_pair'
  | 'production';

export type ListeningKind =
  | 'lst_gist'
  | 'lst_detail'
  | 'lst_inference'
  | 'lst_lexical'
  | 'lst_pragmatic'
  | 'lst_pron_minpair';

export type Modality = 'text' | 'listening' | 'speaking';
export type Scoring = 'choice' | 'free_text' | 'asr_phoneme_match';
export type DistractorType =
  | 'l1_transfer'
  | 'overgeneralization'
  | 'semantic_plausible'
  | 'form_alternative'
  | 'register_mismatch'
  | 'negative_control';

export type LifecycleState =
  | 'authored'
  | 'drafted'
  | 'peer_reviewed'
  | 'expert_anchored'
  | 'partially_calibrated'
  | 'empirically_calibrated'
  | 'serving'
  | 'rejected'
  | 'revision'
  | 'retired';

export type CalibrationStatus = 'expert_anchored' | 'partially_calibrated' | 'empirically_calibrated';
export type ProvenanceKind = 'source_derived' | 'authored' | 'authored_reviewed_corpus';

export class ItemOption {
  constructor(
    public readonly id: string,
    public readonly itemId: string,
    public readonly position: number,
    public readonly optionText: string,
    public readonly isKey: boolean,
    public readonly distractorType: DistractorType | null,
    public readonly brPtForm: string | null,
    public readonly note: string | null,
    public readonly expectedShare: number | null,
  ) {}
}

export class AssessmentItem {
  constructor(
    public readonly id: string,
    public readonly schemaVersion: string,
    public readonly skillIds: string[],
    public readonly lessonId: string | null,
    public readonly dialogueId: string | null,
    public readonly slotNumber: number | null,
    public readonly clipIds: string[] | null,
    public readonly cefrLevel: string,
    public readonly domainId: string,
    public readonly itemType: ItemType,
    public readonly listeningKind: ListeningKind | null,
    public readonly listeningTier: 'L1' | 'L2' | null,
    public readonly modality: Modality,
    public readonly scoring: Scoring,
    public readonly stem: string,
    public readonly key: string | null,
    public readonly answerVariants: string[] | null,
    public readonly pRandom: number,
    public readonly brPtTags: string[] | null,
    public readonly brPtFormState: 'applicable' | 'not_applicable_no_distractor_set',
    public readonly irtModel: string,
    public readonly a: number | null,
    public readonly b: number | null,
    public readonly c: number,
    public readonly aSe: number | null,
    public readonly bSe: number | null,
    public readonly nResponses: number,
    public readonly calibrationStatus: CalibrationStatus | null,
    public readonly anchoredBy: string[] | null,
    public readonly lastRefit: Date | null,
    public readonly infitMnsq: number | null,
    public readonly outfitMnsq: number | null,
    public readonly pointBiserial: number | null,
    public readonly difficultyP: number | null,
    public readonly difFlags: unknown,
    public readonly retired: boolean,
    public readonly retiredReason: string | null,
    public readonly lifecycleState: LifecycleState,
    public readonly provenanceKind: ProvenanceKind,
    public readonly provenanceSourceFile: string | null,
    public readonly provenanceSourceLocator: string | null,
    public readonly reviewedBy: string | null,
    public readonly reviewDue: Date | null,
    public readonly ttsRequired: boolean,
    public readonly ttsRefs: string[],
    public readonly assistTtsRefs: string[],
    public readonly estimatedTimeSec: number | null,
    public readonly authoredAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly options: ItemOption[],
  ) {}
}