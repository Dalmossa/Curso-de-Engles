/**
 * Consent Domain Module — LGPD compliance
 *
 * Exports all domain-layer consent primitives.
 * Infrastructure, application and presentation layers depend on this.
 */

export { ConsentPurpose, CONSENT_PURPOSE_LABELS, CONSENT_PURPOSE_DESCRIPTIONS, isValidConsentPurpose, getAllConsentPurposes } from './consent-purpose.js';
export { Consent } from './consent.js';
export type { ConsentRepositoryPort } from './consent-repository.port.js';
export { ConsentDomainService } from './consent-domain.service.js';