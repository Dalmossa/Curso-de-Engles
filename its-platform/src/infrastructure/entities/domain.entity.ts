import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('domains')
export class DomainEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 20 })
  id!: string;

  @Column({ name: 'label', type: 'varchar', length: 50 })
  label!: string;

  @Column({ name: 'tracked', type: 'boolean', default: true })
  tracked!: boolean;
}