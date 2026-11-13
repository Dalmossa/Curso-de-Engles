import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentEntity } from '../../infrastructure/persistence/consent/consent.entity.js';
import { ConsentPurpose } from '#domain/consent/consent-purpose.js';
import { ConsentDomainService } from '#domain/consent/consent-domain.service.js';
import type { ConsentRepositoryPort } from '#domain/consent/consent-repository.port.js';
import { Consent } from '#domain/consent/consent.js';

@Injectable()
export class ConsentService {
  private readonly domainService: ConsentDomainService;

  constructor(
    @InjectRepository(ConsentEntity)
    private readonly repo: Repository<ConsentEntity>,
  ) {
    // Adapter para usar o repositório TypeORM como porta do domínio
    const repositoryPort: ConsentRepositoryPort = {
      save: async (consent) => {
        const entity = this.toEntity(consent);
        const saved = await this.repo.save(entity);
        return this.toDomain(saved);
      },
      findById: async (id) => {
        const entity = await this.repo.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
      },
      findActiveByLearnerAndPurpose: async (learnerId, purpose) => {
        const entity = await this.repo
          .createQueryBuilder('consent')
          .where('consent.learnerId = :learnerId', { learnerId })
          .andWhere('consent.purpose = :purpose', { purpose })
          .andWhere('consent.granted = true')
          .andWhere('consent.withdrawnAt IS NULL')
          .getOne();
        return entity ? this.toDomain(entity) : null;
      },
      findAllByLearner: async (learnerId) => {
        const entities = await this.repo.find({
          where: { learnerId },
          order: { createdAt: 'DESC' },
        });
        return entities.map((e) => this.toDomain(e));
      },
      findActiveByLearner: async (learnerId) => {
        const entities = await this.repo
          .createQueryBuilder('consent')
          .where('consent.learnerId = :learnerId', { learnerId })
          .andWhere('consent.granted = true')
          .andWhere('consent.withdrawnAt IS NULL')
          .orderBy('consent.createdAt', 'DESC')
          .getMany();
        return entities.map((e) => this.toDomain(e));
      },
      hasActiveConsent: async (learnerId, purpose) => {
        const count = await this.repo
          .createQueryBuilder('consent')
          .where('consent.learnerId = :learnerId', { learnerId })
          .andWhere('consent.purpose = :purpose', { purpose })
          .andWhere('consent.granted = true')
          .andWhere('consent.withdrawnAt IS NULL')
          .getCount();
        return count > 0;
      },
      countActiveByPurpose: async (purpose) => {
        return this.repo
          .createQueryBuilder('consent')
          .where('consent.purpose = :purpose', { purpose })
          .andWhere('consent.granted = true')
          .andWhere('consent.withdrawnAt IS NULL')
          .getCount();
      },
      findWithdrawnInPeriod: async (from: Date, to: Date) => {
        const entities = await this.repo
          .createQueryBuilder('consent')
          .where('consent.granted = false')
          .andWhere('consent.withdrawnAt IS NOT NULL')
          .andWhere('consent.withdrawnAt BETWEEN :from AND :to', { from, to })
          .orderBy('consent.withdrawnAt', 'DESC')
          .getMany();
        return entities.map((e) => this.toDomain(e));
      },
      findByVersion: async (version) => {
        const entities = await this.repo.find({
          where: { version },
          order: { createdAt: 'DESC' },
        });
        return entities.map((e) => this.toDomain(e));
      },
    };

    this.domainService = new ConsentDomainService(repositoryPort, '1.0');
  }

  private toDomain(entity: ConsentEntity): Consent {
    return new Consent({
      consentId: entity.id,
      learnerId: entity.learnerId,
      purpose: entity.purpose as ConsentPurpose,
      granted: entity.granted,
      grantedAt: entity.grantedAt,
      withdrawnAt: entity.withdrawnAt,
      version: entity.version,
      ipHash: entity.ipHash,
      userAgent: entity.userAgent,
    });
  }

  private toEntity(consent: Consent): ConsentEntity {
    const entity = new ConsentEntity();
    entity.id = consent.consentId;
    entity.learnerId = consent.learnerId;
    entity.purpose = consent.purpose;
    entity.granted = consent.granted;
    entity.grantedAt = consent.grantedAt;
    entity.withdrawnAt = consent.withdrawnAt;
    entity.version = consent.version;
    entity.ipHash = consent.ipHash;
    entity.userAgent = consent.userAgent;
    return entity;
  }

  async getConsents(learnerId: string) {
    return this.domainService.getActiveConsents(learnerId);
  }

  async grantConsent(
    learnerId: string,
    purpose: ConsentPurpose,
    ipHash?: string | null,
    userAgent?: string | null,
  ) {
    return this.domainService.grantConsent({
      learnerId,
      purpose,
      ipHash: ipHash ?? null,
      userAgent: userAgent ?? null,
    });
  }

  async withdrawConsent(learnerId: string, purpose: ConsentPurpose) {
    return this.domainService.withdrawConsent({ learnerId, purpose });
  }
}