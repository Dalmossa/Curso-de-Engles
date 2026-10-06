/**
 * Domain entities — catalog (context 1).
 * Pure TypeScript: no typeorm, no @nestjs/* (ADR-014, domain-isolation-check).
 */

export type Track = 'General' | 'IT' | 'Both';
export type AuthoringState = 'authored' | 'specified' | 'unauthored' | 'blocked' | 'withdrawn';
export type PublicationState = 'publishable' | 'restricted_pending_permission' | 'not_publishable';
export type PermissionState = 'not_required' | 'requested' | 'granted' | 'refused';
export type ReuseBasis = 'cite_only' | 'adapt_with_attribution' | 'adapt_requires_permission';
export type PackSchemaVersion = 'canonical' | 'legacy_v1';
export type EdgeType = 'prerequisite' | 'alternative_path' | 'remediation' | 'enrichment';

export class CefrLevel {
  constructor(
    public readonly code: string,
    public readonly label: string,
    public readonly sortOrder: number,
    /** θ*_CEFR — NULL for A1/C1/C2 (unspecified in every spec; ERD §10). */
    public readonly thetaThreshold: number | null,
  ) {}
}

export class Domain {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly tracked: boolean,
  ) {}
}

export class Skill {
  constructor(
    public readonly id: string,
    public readonly domainId: string,
    public readonly label: string,
    public readonly description: string | null,
  ) {}
}

export class Module {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly cefrLevel: string,
    public readonly track: Track,
    public readonly sourceMarkdowns: string[],
    public readonly sortOrder: number,
    public readonly expectedLessons: number,
  ) {}
}

export class Lesson {
  constructor(
    public readonly id: string,
    public readonly moduleId: string,
    public readonly title: string,
    public readonly cefrLevel: string,
    public readonly reuseBasis: ReuseBasis,
    public readonly authoringState: AuthoringState,
    public readonly publicationState: PublicationState,
    public readonly permissionState: PermissionState,
    public readonly sourceRef: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class LessonPrerequisite {
  constructor(
    public readonly lessonId: string,
    public readonly prereqId: string,
    public readonly edgeType: EdgeType,
  ) {}
}

/** Replaces v0.1.0 skill→skill prerequisites: the gate reads lesson→skill (ADR-015 §4). */
export class SkillPrerequisite {
  constructor(
    public readonly lessonId: string,
    public readonly skillId: string,
    public readonly weight: number,
  ) {}
}

export class Pack {
  constructor(
    public readonly id: string,
    public readonly lessonId: string,
    public readonly schemaVersion: PackSchemaVersion,
    public readonly reuseBasis: ReuseBasis,
    public readonly manifest: unknown,
    public readonly itemIds: string[],
    public readonly createdAt: Date,
  ) {}
}