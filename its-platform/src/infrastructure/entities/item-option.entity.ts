import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('item_options')
export class ItemOptionEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id!: string;

  @Column({ name: 'item_id', type: 'varchar', length: 100 })
  itemId!: string;

  @Column({ name: 'position', type: 'smallint' })
  position!: number;

  @Column({ name: 'option_text', type: 'text' })
  optionText!: string;

  @Column({ name: 'is_key', type: 'boolean', default: false })
  isKey!: boolean;

  @Column({ name: 'distractor_type', type: 'varchar', length: 25, nullable: true })
  distractorType!: string | null;

  @Column({ name: 'br_pt_form', type: 'text', nullable: true })
  brPtForm!: string | null;

  @Column({ name: 'note', type: 'text', nullable: true })
  note!: string | null;

  @Column({ name: 'expected_share', type: 'numeric', precision: 4, scale: 3, nullable: true })
  expectedShare!: string | null;
}