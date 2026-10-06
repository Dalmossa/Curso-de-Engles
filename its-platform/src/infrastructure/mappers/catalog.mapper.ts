import { CefrLevelEntity } from '../entities/cefr-level.entity.js';
import { DomainEntity } from '../entities/domain.entity.js';
import { SkillEntity } from '../entities/skill.entity.js';
import { ModuleEntity } from '../entities/module.entity.js';
import { LessonEntity } from '../entities/lesson.entity.js';
import { LessonPrerequisiteEntity } from '../entities/lesson-prerequisite.entity.js';
import { SkillPrerequisiteEntity } from '../entities/skill-prerequisite.entity.js';
import { PackEntity } from '../entities/pack.entity.js';
import {
  CefrLevel,
  Domain,
  Skill,
  Module,
  Lesson,
  LessonPrerequisite,
  SkillPrerequisite,
  Pack,
} from '../../domain/entities/catalog.js';

const n = (v: string | null | undefined): number | null => (v == null ? null : Number(v));
const s = (v: number | null | undefined): string | null => (v == null ? null : String(v));

export function cefrLevelToDomain(e: CefrLevelEntity): CefrLevel {
  return new CefrLevel(e.code, e.label, e.sortOrder, n(e.thetaThreshold));
}
export function cefrLevelToEntity(d: CefrLevel): CefrLevelEntity {
  const e = new CefrLevelEntity();
  e.code = d.code;
  e.label = d.label;
  e.sortOrder = d.sortOrder;
  e.thetaThreshold = s(d.thetaThreshold);
  return e;
}

export function domainToDomain(e: DomainEntity): Domain {
  return new Domain(e.id, e.label, e.tracked);
}
export function domainToEntity(d: Domain): DomainEntity {
  const e = new DomainEntity();
  e.id = d.id;
  e.label = d.label;
  e.tracked = d.tracked;
  return e;
}

export function skillToDomain(e: SkillEntity): Skill {
  return new Skill(e.id, e.domainId, e.label, e.description);
}
export function skillToEntity(d: Skill): SkillEntity {
  const e = new SkillEntity();
  e.id = d.id;
  e.domainId = d.domainId;
  e.label = d.label;
  e.description = d.description;
  return e;
}

export function moduleToDomain(e: ModuleEntity): Module {
  return new Module(
    e.id,
    e.title,
    e.cefrLevel,
    e.track as Module['track'],
    e.sourceMarkdowns,
    e.sortOrder,
    e.expectedLessons,
  );
}
export function moduleToEntity(d: Module): ModuleEntity {
  const e = new ModuleEntity();
  e.id = d.id;
  e.title = d.title;
  e.cefrLevel = d.cefrLevel;
  e.track = d.track;
  e.sourceMarkdowns = d.sourceMarkdowns;
  e.sortOrder = d.sortOrder;
  e.expectedLessons = d.expectedLessons;
  return e;
}

export function lessonToDomain(e: LessonEntity): Lesson {
  return new Lesson(
    e.id,
    e.moduleId,
    e.title,
    e.cefrLevel,
    e.reuseBasis as Lesson['reuseBasis'],
    e.authoringState as Lesson['authoringState'],
    e.publicationState as Lesson['publicationState'],
    e.permissionState as Lesson['permissionState'],
    e.sourceRef,
    e.createdAt,
    e.updatedAt,
  );
}
export function lessonToEntity(d: Lesson): LessonEntity {
  const e = new LessonEntity();
  e.id = d.id;
  e.moduleId = d.moduleId;
  e.title = d.title;
  e.cefrLevel = d.cefrLevel;
  e.reuseBasis = d.reuseBasis;
  e.authoringState = d.authoringState;
  e.publicationState = d.publicationState;
  e.permissionState = d.permissionState;
  e.sourceRef = d.sourceRef;
  e.createdAt = d.createdAt;
  e.updatedAt = d.updatedAt;
  return e;
}

export function lessonPrerequisiteToDomain(e: LessonPrerequisiteEntity): LessonPrerequisite {
  return new LessonPrerequisite(
    e.lessonId,
    e.prereqId,
    e.edgeType as LessonPrerequisite['edgeType'],
  );
}
export function lessonPrerequisiteToEntity(d: LessonPrerequisite): LessonPrerequisiteEntity {
  const e = new LessonPrerequisiteEntity();
  e.lessonId = d.lessonId;
  e.prereqId = d.prereqId;
  e.edgeType = d.edgeType;
  return e;
}

export function skillPrerequisiteToDomain(e: SkillPrerequisiteEntity): SkillPrerequisite {
  return new SkillPrerequisite(e.lessonId, e.skillId, Number(e.weight));
}
export function skillPrerequisiteToEntity(d: SkillPrerequisite): SkillPrerequisiteEntity {
  const e = new SkillPrerequisiteEntity();
  e.lessonId = d.lessonId;
  e.skillId = d.skillId;
  e.weight = String(d.weight);
  return e;
}

export function packToDomain(e: PackEntity): Pack {
  return new Pack(
    e.id,
    e.lessonId,
    e.schemaVersion as Pack['schemaVersion'],
    e.reuseBasis as Pack['reuseBasis'],
    e.manifest,
    e.itemIds,
    e.createdAt,
  );
}
export function packToEntity(d: Pack): PackEntity {
  const e = new PackEntity();
  e.id = d.id;
  e.lessonId = d.lessonId;
  e.schemaVersion = d.schemaVersion;
  e.reuseBasis = d.reuseBasis;
  e.manifest = d.manifest;
  e.itemIds = d.itemIds;
  e.createdAt = d.createdAt;
  return e;
}