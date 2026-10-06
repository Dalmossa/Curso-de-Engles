import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dialogue_speakers')
export class DialogueSpeakerEntity {
  @PrimaryColumn({ name: 'dialogue_id', type: 'varchar', length: 50 })
  dialogueId!: string;

  @PrimaryColumn({ name: 'speaker_id', type: 'varchar', length: 50 })
  speakerId!: string;

  @Column({ name: 'voice_id', type: 'varchar', length: 20 })
  voiceId!: string;
}