import { ItemEntity } from '../entities/item.entity.js';
import { ItemOptionEntity } from '../entities/item-option.entity.js';
import { AssessmentItem, ItemOption } from '../../domain/entities/assessment-item.js';

const n = (v: string | null | undefined): number | null => (v == null ? null : Number(v));
const s = (v: number | null | undefined): string | null => (v == null ? null : String(v));

export function itemOptionToDomain(e: ItemOptionEntity): ItemOption {
  return new ItemOption(
    e.id,
    e.itemId,
    e.position,
    e.optionText,
    e.isKey,
    e.distractorType as ItemOption['distractorType'],
    e.brPtForm,
    e.note,
    n(e.expectedShare),
  );
}
export function itemOptionToEntity(d: ItemOption): ItemOptionEntity {
  const e = new ItemOptionEntity();
  e.id = d.id;
  e.itemId = d.itemId;
  e.position = d.position;
  e.optionText = d.optionText;
  e.isKey = d.isKey;
  e.distractorType = d.distractorType;
  e.brPtForm = d.brPtForm;
  e.note = d.note;
  e.expectedShare = s(d.expectedShare);
  return e;
}

export function itemToDomain(e: ItemEntity, options: ItemOption[] = []): AssessmentItem {
  return new AssessmentItem(
    e.id,
    e.schemaVersion,
    e.skillIds,
    e.lessonId,
    e.dialogueId,
    e.slotNumber,
    e.clipIds,
    e.cefrLevel,
    e.domainId,
    e.itemType as AssessmentItem['itemType'],
    e.listeningKind as AssessmentItem['listeningKind'],
    e.listeningTier as AssessmentItem['listeningTier'],
    e.modality as AssessmentItem['modality'],
    e.scoring as AssessmentItem['scoring'],
    e.stem,
    e.key,
    e.answerVariants,
    Number(e.pRandom),
    e.brPtTags,
    e.brPtFormState as AssessmentItem['brPtFormState'],
    e.irtModel,
    n(e.a),
    n(e.b),
    Number(e.c),
    n(e.aSe),
    n(e.bSe),
    e.nResponses,
    e.calibrationStatus as AssessmentItem['calibrationStatus'],
    e.anchoredBy,
    e.lastRefit,
    n(e.infitMnsq),
    n(e.outfitMnsq),
    n(e.pointBiserial),
    n(e.difficultyP),
    e.difFlags,
    e.retired,
    e.retiredReason,
    e.lifecycleState as AssessmentItem['lifecycleState'],
    e.provenanceKind as AssessmentItem['provenanceKind'],
    e.provenanceSourceFile,
    e.provenanceSourceLocator,
    e.reviewedBy,
    e.reviewDue == null ? null : new Date(`${e.reviewDue}T00:00:00Z`),
    e.ttsRequired,
    e.ttsRefs,
    e.assistTtsRefs,
    e.estimatedTimeSec,
    e.authoredAt,
    e.createdAt,
    e.updatedAt,
    options,
  );
}

export function itemToEntity(d: AssessmentItem, options: ItemOptionEntity[] = []): ItemEntity {
  const e = new ItemEntity();
  e.id = d.id;
  e.schemaVersion = d.schemaVersion;
  e.skillIds = d.skillIds;
  e.lessonId = d.lessonId;
  e.dialogueId = d.dialogueId;
  e.slotNumber = d.slotNumber;
  e.clipIds = d.clipIds;
  e.cefrLevel = d.cefrLevel;
  e.domainId = d.domainId;
  e.itemType = d.itemType;
  e.listeningKind = d.listeningKind;
  e.listeningTier = d.listeningTier;
  e.modality = d.modality;
  e.scoring = d.scoring;
  e.stem = d.stem;
  e.key = d.key;
  e.answerVariants = d.answerVariants;
  e.pRandom = String(d.pRandom);
  e.brPtTags = d.brPtTags;
  e.brPtFormState = d.brPtFormState;
  e.irtModel = d.irtModel;
  e.a = s(d.a);
  e.b = s(d.b);
  e.c = String(d.c);
  e.aSe = s(d.aSe);
  e.bSe = s(d.bSe);
  e.nResponses = d.nResponses;
  e.calibrationStatus = d.calibrationStatus;
  e.anchoredBy = d.anchoredBy;
  e.lastRefit = d.lastRefit;
  e.infitMnsq = s(d.infitMnsq);
  e.outfitMnsq = s(d.outfitMnsq);
  e.pointBiserial = s(d.pointBiserial);
  e.difficultyP = s(d.difficultyP);
  e.difFlags = d.difFlags;
  e.retired = d.retired;
  e.retiredReason = d.retiredReason;
  e.lifecycleState = d.lifecycleState;
  e.provenanceKind = d.provenanceKind;
  e.provenanceSourceFile = d.provenanceSourceFile;
  e.provenanceSourceLocator = d.provenanceSourceLocator;
  e.reviewedBy = d.reviewedBy;
  e.reviewDue = d.reviewDue == null ? null : d.reviewDue.toISOString().slice(0, 10);
  e.ttsRequired = d.ttsRequired;
  e.ttsRefs = d.ttsRefs;
  e.assistTtsRefs = d.assistTtsRefs;
  e.estimatedTimeSec = d.estimatedTimeSec;
  e.authoredAt = d.authoredAt;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}