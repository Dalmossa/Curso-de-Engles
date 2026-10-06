import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('clips')
export class ClipEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 60 })
  id!: string;

  @Column({ name: 'dialogue_id', type: 'varchar', length: 50 })
  dialogueId!: string;

  @Column({ name: 'speaker_id', type: 'varchar', length: 50 })
  speakerId!: string;

  @Column({ name: 'sort_index', type: 'smallint' })
  sortIndex!: number;

  @Column({ name: 'utterance_text', type: 'text' })
  utteranceText!: string;

  @Column({ name: 'phonetic_target', type: 'text', nullable: true })
  phoneticTarget!: string | null;
}