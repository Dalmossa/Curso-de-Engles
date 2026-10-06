import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('speakers')
export class SpeakerEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 50 })
  id!: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName!: string;

  @Column({ name: 'gender', type: 'varchar', length: 10, nullable: true })
  gender!: string | null;
}