import { ConsentRecordEntity } from '../entities/consent-record.entity.js';
import { ConsentRecord } from '../../domain/entities/consent-record.js';

export function consentRecordToDomain(e: ConsentRecordEntity): ConsentRecord {
  return new ConsentRecord(
    e.id,
    e.learnerId,
    e.purpose as ConsentRecord['purpose'],
    e.version,
    e.grantedAt,
    e.withdrawnAt,
    e.legalBasis,
    e.createdAt,
  );
}
export function consentRecordToEntity(d: ConsentRecord): ConsentRecordEntity {
  const e = new ConsentRecordEntity();
  e.id = d.id;
  e.learnerId = d.learnerId;
  e.purpose = d.purpose;
  e.version = d.version;
  e.grantedAt = d.grantedAt;
  e.withdrawnAt = d.withdrawnAt;
  e.legalBasis = d.legalBasis;
  e.createdAt = d.createdAt;
  return e;
}