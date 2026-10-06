import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('voices')
export class VoiceEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 20 })
  id!: string;

  @Column({ name: 'label', type: 'varchar', length: 50 })
  label!: string;

  @Column({ name: 'accent', type: 'varchar', length: 50 })
  accent!: string;

  @Column({ name: 'gender', type: 'varchar', length: 10, nullable: true })
  gender!: string | null;

  @Column({ name: 'active', type: 'boolean', default: true })
  active!: boolean;
}