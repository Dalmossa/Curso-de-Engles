import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('skills')
export class SkillEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'domain_id', type: 'varchar', length: 20 })
  domainId!: string;

  @Column({ name: 'label', type: 'varchar', length: 100 })
  label!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;
}