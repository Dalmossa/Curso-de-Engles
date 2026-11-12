import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAuthTables1794508563775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'password_hash',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'display_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'avatar_url',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'email_verified',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'provider',
                    type: 'varchar',
                    default: "'local'",
                },
                {
                    name: 'provider_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'learner_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'last_login_at',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'role',
                    type: 'varchar',
                    default: "'learner'",
                },
                {
                    name: 'cefr_level',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'google_id',
                    type: 'varchar',
                    isNullable: true,
                },
            ],
        }), true);

        // Create unique index on email
        await queryRunner.createIndex('users', new TableIndex({
            name: 'IDX_users_email',
            columnNames: ['email'],
            isUnique: true,
        }));

        // Create user_sessions table
        await queryRunner.createTable(new Table({
            name: 'user_sessions',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: 'token_hash',
                    type: 'varchar',
                },
                {
                    name: 'access_token',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'expires_at',
                    type: 'timestamptz',
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'last_used_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'user_agent',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'ip_hash',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'revoked',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'reused',
                    type: 'boolean',
                    default: false,
                },
            ],
        }), true);

        // Create indexes on user_sessions
        await queryRunner.createIndex('user_sessions', new TableIndex({
            name: 'IDX_user_sessions_user_id',
            columnNames: ['user_id'],
        }));

        await queryRunner.createIndex('user_sessions', new TableIndex({
            name: 'IDX_user_sessions_expires_at',
            columnNames: ['expires_at'],
        }));

        // Create foreign key from user_sessions to users
        await queryRunner.createForeignKey('user_sessions', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key first
        const userSessionsTable = await queryRunner.getTable('user_sessions');
        const foreignKey = userSessionsTable?.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('user_sessions', foreignKey);
        }

        // Drop tables
        await queryRunner.dropTable('user_sessions');
        await queryRunner.dropTable('users');
    }
}