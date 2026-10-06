import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clip_renders')
export class ClipRenderEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: string;

  @Column({ name: 'clip_id', type: 'varchar', length: 60 })
  clipId!: string;

  @Column({ name: 'take', type: 'smallint' })
  take!: number;

  @Column({ name: 'voice_id', type: 'varchar', length: 20 })
  voiceId!: string;

  @Column({ name: 'rate', type: 'numeric', precision: 3, scale: 2, default: 1.0 })
  rate!: string;

  @Column({ name: 'duration_s', type: 'numeric', precision: 5, scale: 2 })
  durationS!: string;

  @Column({ name: 'uri', type: 'text' })
  uri!: string;

  @Column({ name: 'ear_checked_at', type: 'timestamptz', nullable: true })
  earCheckedAt!: Date | null;

  @Column({ name: 'ear_checked_by', type: 'text', nullable: true })
  earCheckedBy!: string | null;
}