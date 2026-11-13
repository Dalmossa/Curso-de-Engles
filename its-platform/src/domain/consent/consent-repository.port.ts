import { Consent } from './consent.js';
import { ConsentPurpose } from './consent-purpose.js';

/**
 * Port do repositório de consentimentos (Domain → Infrastructure).
 * Implementado por TypeORMConsentRepository em infrastructure/.
 */
export interface ConsentRepositoryPort {
  /** Salva um consentimento (create ou update) */
  save(consent: Consent): Promise<Consent>;

  /** Busca consentimento por ID */
  findById(consentId: string): Promise<Consent | null>;

  /** Busca consentimento ativo do learner para uma finalidade */
  findActiveByLearnerAndPurpose(learnerId: string, purpose: ConsentPurpose): Promise<Consent | null>;

  /** Busca todos os consentimentos do learner (inclui revogados para histórico) */
  findAllByLearner(learnerId: string): Promise<Consent[]>;

  /** Busca consentimentos ativos do learner */
  findActiveByLearner(learnerId: string): Promise<Consent[]>;

  /** Verifica se learner tem consentimento ativo para finalidade */
  hasActiveConsent(learnerId: string, purpose: ConsentPurpose): Promise<boolean>;

  /** Conta consentimentos ativos por finalidade (para relatórios LGPD) */
  countActiveByPurpose(purpose: ConsentPurpose): Promise<number>;

  /** Busca consentimentos revogados em período (para auditoria) */
  findWithdrawnInPeriod(from: Date, to: Date): Promise<Consent[]>;

  /** Busca consentimentos por versão da política (para migração) */
  findByVersion(version: string): Promise<Consent[]>;
}