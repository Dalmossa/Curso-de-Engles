import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
import { ConsentEntity } from './consent.entity.js';
import { Consent } from '#domain/consent/consent.js';
import { ConsentPurpose } from '#domain/consent/consent-purpose.js';
import type { ConsentRepositoryPort } from '#domain/consent/consent-repository.port.js';

@Injectable()
export class TypeORMConsentRepository implements ConsentRepositoryPort {
  constructor(
    @InjectRepository(ConsentEntity)
    private readonly repo: Repository<ConsentEntity>,
  ) {}

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

  async save(consent: Consent): Promise<Consent> {
    const entity = this.toEntity(consent);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async findById(consentId: string): Promise<Consent | null> {
    const entity = await this.repo.findOne({ where: { id: consentId } });
    return entity ? this.toDomain(entity) : null;
  }

  async findActiveByLearnerAndPurpose(
    learnerId: string,
    purpose: ConsentPurpose,
  ): Promise<Consent | null> {
    const entity = await this.repo
      .createQueryBuilder('consent')
      .where('consent.learnerId = :learnerId', { learnerId })
      .andWhere('consent.purpose = :purpose', { purpose })
      .andWhere('consent.granted = true')
      .andWhere('consent.withdrawnAt IS NULL')
      .getOne();
    return entity ? this.toDomain(entity) : null;
  }

  async findAllByLearner(learnerId: string): Promise<Consent[]> {
    const entities = await this.repo.find({
      where: { learnerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }

  async findActiveByLearner(learnerId: string): Promise<Consent[]> {
    const entities = await this.repo
      .createQueryBuilder('consent')
      .where('consent.learnerId = :learnerId', { learnerId })
      .andWhere('consent.granted = true')
      .andWhere('consent.withdrawnAt IS NULL')
      .orderBy('consent.createdAt', 'DESC')
      .getMany();
    return entities.map(e => this.toDomain(e));
  }

  async hasActiveConsent(learnerId: string, purpose: ConsentPurpose): Promise<boolean> {
    const count = await this.repo
      .createQueryBuilder('consent')
      .where('consent.learnerId = :learnerId', { learnerId })
      .andWhere('consent.purpose = :purpose', { purpose })
      .andWhere('consent.granted = true')
      .andWhere('consent.withdrawnAt IS NULL')
      .getCount();
    return count > 0;
  }

  async countActiveByPurpose(purpose: ConsentPurpose): Promise<number> {
    return this.repo
      .createQueryBuilder('consent')
      .where('consent.purpose = :purpose', { purpose })
      .andWhere('consent.granted = true')
      .andWhere('consent.withdrawnAt IS NULL')
      .getCount();
  }

  async findWithdrawnInPeriod(from: Date, to: Date): Promise<Consent[]> {
    const entities = await this.repo
      .createQueryBuilder('consent')
      .where('consent.granted = false')
      .andWhere('consent.withdrawnAt IS NOT NULL')
      .andWhere('consent.withdrawnAt BETWEEN :from AND :to', { from, to })
      .orderBy('consent.withdrawnAt', 'DESC')
      .getMany();
    return entities.map(e => this.toDomain(e));
  }

  async findByVersion(version: string): Promise<Consent[]> {
    const entities = await this.repo.find({
      where: { version },
      order: { createdAt: 'DESC' },
    });
    return entities.map(e => this.toDomain(e));
  }
}
