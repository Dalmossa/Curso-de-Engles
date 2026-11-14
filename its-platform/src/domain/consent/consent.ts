import { ConsentPurpose } from './consent-purpose.js';

/**
 * Value Object representando um consentimento LGPD.
 *
 * Regras de negócio (LGPD Art. 7, 8, 9, 18):
 * - Consentimento deve ser livre, informado e inequívoco
 * - Finalidade específica (granularidade por purpose)
 * - Facilidade de revogação (tão fácil quanto dar)
 * - Revogação não afeta legalidade do processamento anterior
 * - Titular pode solicitar eliminação dos dados (Art. 18)
 */
export class Consent {
  private readonly _consentId: string;
  private readonly _learnerId: string;
  private readonly _purpose: ConsentPurpose;
  private readonly _granted: boolean;
  private readonly _grantedAt: Date | null;
  private readonly _withdrawnAt: Date | null;
  private readonly _version: string; // Versão da política de privacidade no momento do consentimento
  private readonly _ipHash: string | null; // Hash do IP para auditoria (LGPD Art. 7, §1)
  private readonly _userAgent: string | null; // User agent para auditoria

  constructor(props: {
    consentId: string;
    learnerId: string;
    purpose: ConsentPurpose;
    granted: boolean;
    grantedAt?: Date | null;
    withdrawnAt?: Date | null;
    version?: string;
    ipHash?: string | null;
    userAgent?: string | null;
  }) {
    if (!props.consentId || props.consentId.trim().length === 0) {
      throw new Error('ConsentId is required');
    }
    if (!props.learnerId || props.learnerId.trim().length === 0) {
      throw new Error('LearnerId is required');
    }
    if (!props.purpose || !Object.values(ConsentPurpose).includes(props.purpose)) {
      throw new Error(`Invalid consent purpose: ${props.purpose}`);
    }

    this._consentId = props.consentId;
    this._learnerId = props.learnerId;
    this._purpose = props.purpose;
    this._granted = props.granted;
    this._grantedAt = props.granted ? (props.grantedAt ?? new Date()) : null;
    this._withdrawnAt = props.withdrawnAt ?? null;
    this._version = props.version ?? '1.0';
    this._ipHash = props.ipHash ?? null;
    this._userAgent = props.userAgent ?? null;

    // Invariantes
    if (
      this._granted &&
      this._withdrawnAt &&
      this._grantedAt &&
      this._withdrawnAt < this._grantedAt
    ) {
      throw new Error('WithdrawnAt cannot be before GrantedAt');
    }
    if (!this._granted && this._grantedAt) {
      throw new Error('GrantedAt must be null when not granted');
    }
  }

  get consentId(): string {
    return this._consentId;
  }

  get learnerId(): string {
    return this._learnerId;
  }

  get purpose(): ConsentPurpose {
    return this._purpose;
  }

  get granted(): boolean {
    return this._granted;
  }

  get grantedAt(): Date | null {
    return this._grantedAt;
  }

  get withdrawnAt(): Date | null {
    return this._withdrawnAt;
  }

  get version(): string {
    return this._version;
  }

  get ipHash(): string | null {
    return this._ipHash;
  }

  get userAgent(): string | null {
    return this._userAgent;
  }

  /** Consentimento está ativo (concedido e não revogado) */
  get isActive(): boolean {
    return this._granted && this._withdrawnAt === null;
  }

  /** Consentimento foi revogado */
  get isWithdrawn(): boolean {
    return this._withdrawnAt !== null;
  }

  /** Cria novo consentimento concedido */
  static grant(props: {
    consentId: string;
    learnerId: string;
    purpose: ConsentPurpose;
    version?: string;
    ipHash?: string | null;
    userAgent?: string | null;
  }): Consent {
    return new Consent({
      ...props,
      granted: true,
      grantedAt: new Date(),
      withdrawnAt: null,
    });
  }

  /** Cria consentimento revogado (para histórico) */
  static withdraw(props: {
    consentId: string;
    learnerId: string;
    purpose: ConsentPurpose;
    grantedAt: Date;
    version?: string;
    ipHash?: string | null;
    userAgent?: string | null;
  }): Consent {
    return new Consent({
      ...props,
      granted: false,
      withdrawnAt: new Date(),
    });
  }

  /** Retorna nova instância com consentimento revogado (LGPD Art. 8 - facilidade de revogação) */
  withdraw(): Consent {
    if (!this._granted) {
      throw new Error('Cannot withdraw already withdrawn consent');
    }
    return new Consent({
      consentId: this._consentId,
      learnerId: this._learnerId,
      purpose: this._purpose,
      granted: false,
      grantedAt: this._grantedAt,
      withdrawnAt: new Date(),
      version: this._version,
      ipHash: this._ipHash,
      userAgent: this._userAgent,
    });
  }

  /** Retorna nova instância com consentimento concedido (re-concessão) */
  regrant(version?: string, ipHash?: string | null, userAgent?: string | null): Consent {
    if (this._granted && this._withdrawnAt === null) {
      throw new Error('Consent is already active');
    }
    return new Consent({
      consentId: this._consentId,
      learnerId: this._learnerId,
      purpose: this._purpose,
      granted: true,
      grantedAt: new Date(),
      withdrawnAt: null,
      version: version ?? this._version,
      ipHash: ipHash ?? this._ipHash,
      userAgent: userAgent ?? this._userAgent,
    });
  }

  toJSON(): object {
    return {
      consentId: this._consentId,
      learnerId: this._learnerId,
      purpose: this._purpose,
      granted: this._granted,
      grantedAt: this._grantedAt?.toISOString() ?? null,
      withdrawnAt: this._withdrawnAt?.toISOString() ?? null,
      version: this._version,
      ipHash: this._ipHash,
      userAgent: this._userAgent,
    };
  }
}
