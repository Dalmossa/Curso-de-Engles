import { FsrsParameterEntity } from '../entities/fsrs-parameter.entity.js';
import { BktSkillParamEntity } from '../entities/bkt-skill-param.entity.js';
import { FsrsParameter, BktSkillParam } from '../../domain/entities/stats.js';

export function fsrsParameterToDomain(e: FsrsParameterEntity): FsrsParameter {
  return new FsrsParameter(
    e.wVersion,
    e.w,
    Number(e.decay),
    Number(e.factor),
    e.nReviews,
    e.fittedAt,
    e.isActive,
  );
}
export function fsrsParameterToEntity(d: FsrsParameter): FsrsParameterEntity {
  const e = new FsrsParameterEntity();
  e.wVersion = d.wVersion;
  e.w = d.w;
  e.decay = String(d.decay);
  e.factor = String(d.factor);
  e.nReviews = d.nReviews;
  e.fittedAt = d.fittedAt;
  e.isActive = d.isActive;
  return e;
}

export function bktSkillParamToDomain(e: BktSkillParamEntity): BktSkillParam {
  return new BktSkillParam(
    e.skillId,
    Number(e.pL0),
    Number(e.pT),
    Number(e.pS),
    Number(e.pG),  // Added pG field
    e.source,
    e.fittedAt,
    e.modelVersion,
  );
}
export function bktSkillParamToEntity(d: BktSkillParam): BktSkillParamEntity {
  const e = new BktSkillParamEntity();
  e.skillId = d.skillId;
  e.pL0 = String(d.pL0);
  e.pT = String(d.pT);
  e.pS = String(d.pS);
  e.pG = String(d.pG);  // Added pG field
  e.source = d.source;
  e.fittedAt = d.fittedAt;
  e.modelVersion = d.modelVersion;
  return e;
}
