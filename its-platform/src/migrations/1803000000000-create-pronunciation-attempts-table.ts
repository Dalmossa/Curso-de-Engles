import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePronunciationAttemptsTable1803000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pronunciation_attempts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'learner_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'lesson_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expected_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'transcript',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'overall_score',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'word_scores',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'feedback_pt',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'pronunciation_attempts',
      new TableForeignKey({
        columnNames: ['learner_id'],
        referencedTableName: 'learners',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'pronunciation_attempts',
      new TableIndex({
        name: 'IDX_pronunciation_attempts_learner_created_at',
        columnNames: ['learner_id', 'created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'pronunciation_attempts',
      'IDX_pronunciation_attempts_learner_created_at',
    );

    const table = await queryRunner.getTable('pronunciation_attempts');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('learner_id'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('pronunciation_attempts', foreignKey);
    }

    await queryRunner.dropTable('pronunciation_attempts');
  }
}
