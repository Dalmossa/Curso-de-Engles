import { Consent } from './consent.js';
import { ConsentPurpose } from './consent-purpose.js';
import type { ConsentRepositoryPort } from './consent-repository.port.js';

/**
 * Serviço de domínio para regras de negócio de consentimento LGPD.
 * Não depende de infraestrutura - apenas de portas.
 */
export class ConsentDomainService {
  private readonly repository: ConsentRepositoryPort;
  private readonly currentPolicyVersion: string;

  constructor(repository: ConsentRepositoryPort, currentPolicyVersion = '1.0') {
    this.repository = repository;
    this.currentPolicyVersion = currentPolicyVersion;
  }

  /** Concede consentimento para uma finalidade (LGPD Art. 7 - livre, informado, específico) */
  async grantConsent(props: {
    learnerId: string;
    purpose: ConsentPurpose;
    ipHash?: string | null;
    userAgent?: string | null;
  }): Promise<Consent> {
    const { learnerId, purpose, ipHash, userAgent } = props;

    // Verifica se já existe consentimento ativo
    const existing = await this.repository.findActiveByLearnerAndPurpose(learnerId, purpose);
    if (existing) {
      throw new Error(`Consent for purpose ${purpose} already granted`);
    }

    const consentId = crypto.randomUUID();
    const consent = Consent.grant({
      consentId,
      learnerId,
      purpose,
      version: this.currentPolicyVersion,
      ipHash: ipHash ?? null,
      userAgent: userAgent ?? null,
    });

    return this.repository.save(consent);
  }

  /** Revoga consentimento (LGPD Art. 8 - revogação fácil, não retroativa) */
  async withdrawConsent(props: { learnerId: string; purpose: ConsentPurpose }): Promise<Consent> {
    const { learnerId, purpose } = props;

    const existing = await this.repository.findActiveByLearnerAndPurpose(learnerId, purpose);
    if (!existing) {
      throw new Error(`No active consent found for purpose ${purpose}`);
    }

    const withdrawn = existing.withdraw();
    return this.repository.save(withdrawn);
  }

  /** Re-concede consentimento anteriormente revogado */
  async regrantConsent(props: {
    learnerId: string;
    purpose: ConsentPurpose;
    ipHash?: string | null;
    userAgent?: string | null;
  }): Promise<Consent> {
    const { learnerId, purpose, ipHash, userAgent } = props;

    const consentId = await this.findLatestConsentId(learnerId, purpose);
    if (!consentId) {
      throw new Error(`No consent record found for purpose ${purpose}`);
    }

    const existing = await this.repository.findById(consentId);
    if (!existing) {
      throw new Error(`Consent record not found for purpose ${purpose}`);
    }

    if (existing.isActive) {
      throw new Error('Consent is already active');
    }

    const regranted = existing.regrant(
      this.currentPolicyVersion,
      ipHash ?? null,
      userAgent ?? null,
    );

    return this.repository.save(regranted);
  }

  /** Busca ID do consentimento mais recente para learner + purpose */
  private async findLatestConsentId(
    learnerId: string,
    purpose: ConsentPurpose,
  ): Promise<string | null> {
    const all = await this.repository.findAllByLearner(learnerId);
    const matching = all
      .filter(c => c.purpose === purpose)
      .sort((a, b) => {
        const dateA = a.withdrawnAt ?? a.grantedAt ?? new Date(0);
        const dateB = b.withdrawnAt ?? b.grantedAt ?? new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    return matching[0]?.consentId ?? null;
  }

  /** Verifica se learner tem consentimento ativo para finalidade */
  async hasActiveConsent(learnerId: string, purpose: ConsentPurpose): Promise<boolean> {
    return this.repository.hasActiveConsent(learnerId, purpose);
  }

  /** Busca consentimento ativo para finalidade */
  async getActiveConsent(learnerId: string, purpose: ConsentPurpose): Promise<Consent | null> {
    return this.repository.findActiveByLearnerAndPurpose(learnerId, purpose);
  }

  /** Lista todos os consentimentos do learner (histórico completo) */
  async getConsentHistory(learnerId: string): Promise<Consent[]> {
    return this.repository.findAllByLearner(learnerId);
  }

  /** Lista apenas consentimentos ativos do learner */
  async getActiveConsents(learnerId: string): Promise<Consent[]> {
    return this.repository.findActiveByLearner(learnerId);
  }

  /** Verifica se todas as finalidades obrigatórias estão concedidas */
  async hasAllRequiredConsents(
    learnerId: string,
    requiredPurposes: ConsentPurpose[],
  ): Promise<boolean> {
    for (const purpose of requiredPurposes) {
      const has = await this.hasActiveConsent(learnerId, purpose);
      if (!has) return false;
    }
    return true;
  }

  /** Relatório LGPD: consentimentos ativos por finalidade */
  async getActiveConsentReport(): Promise<Record<ConsentPurpose, number>> {
    const report: Record<ConsentPurpose, number> = {} as Record<ConsentPurpose, number>;
    for (const purpose of Object.values(ConsentPurpose)) {
      report[purpose] = await this.repository.countActiveByPurpose(purpose);
    }
    return report;
  }

  /** Relatório LGPD: consentimentos revogados em período */
  async getWithdrawalReport(from: Date, to: Date): Promise<Consent[]> {
    return this.repository.findWithdrawnInPeriod(from, to);
  }

  /** Identifica learners que precisam atualizar consentimento (versão antiga) */
  async findLearnersWithOutdatedConsent(): Promise<string[]> {
    const outdated = await this.repository.findByVersion(this.currentPolicyVersion);
    const learnerIds = new Set<string>();
    for (const consent of outdated) {
      if (consent.version !== this.currentPolicyVersion) {
        learnerIds.add(consent.learnerId);
      }
    }
    return Array.from(learnerIds);
  }
}

// Polyfill para crypto.randomUUID em ambientes que não têm
declare global {
  namespace NodeJS {
    interface Global {
      crypto?: { randomUUID: () => string };
    }
  }
}

const crypto = globalThis.crypto ?? {
  randomUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};
