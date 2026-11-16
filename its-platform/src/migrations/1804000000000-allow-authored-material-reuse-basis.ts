import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Alarga o CHECK de `reuse_basis` em `lessons` e `packs` para aceitar `authored_material`.
 *
 * Por que esta migration existe:
 *   O `CREATE TABLE` da migration `1791331200000-create-schema` (linhas 95-96 e 129-130)
 *   define `lessons_reuse_basis_check` / `packs_reuse_basis_check` com apenas três valores:
 *   `cite_only`, `adapt_with_attribution`, `adapt_requires_permission`.
 *   A especificação atual reconhece a proveniência `authored_material` (10 lições/packs
 *   reautoradas, sincronizadas via `scripts/sync-authored-content.mjs`), então um banco criado
 *   do zero — o harness PGlite dos testes e o CI — recusa a carga dessas lições com
 *   `violates check constraint "lessons_reuse_basis_check"`, o que cascateia em packs que
 *   referenciam lições desconhecidas.
 *
 *   O banco real já recebeu o widening em runtime pelo script de sync (commit d5e3581), de modo
 *   que esta migration é um **no-op** nele: `up` consulta `pg_constraint` e, se a constraint
 *   já contiver `'authored_material'`, não altera nada. Isso é a prova de idempotência.
 *
 *   A operação é puramente aditiva: amplia a lista de valores permitidos, nunca restringe,
 *   nunca apaga dados, não usa `DROP TABLE` nem `TRUNCATE`.
 */
export class AllowAuthoredMaterialReuseBasis1804000000000 implements MigrationInterface {
  name = 'AllowAuthoredMaterialReuseBasis1804000000000';

  private readonly TABLES = [
    { table: 'lessons', constraint: 'lessons_reuse_basis_check' },
    { table: 'packs', constraint: 'packs_reuse_basis_check' },
  ];

  private readonly VALUES = [
    "'cite_only'",
    "'adapt_with_attribution'",
    "'adapt_requires_permission'",
    "'authored_material'",
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { table, constraint } of this.TABLES) {
      // 1. Consulta pg_constraint para obter a definição atual da constraint.
      const rows = await queryRunner.query(
        `
        SELECT pg_get_constraintdef(oid) AS def
        FROM pg_constraint
        WHERE conname = $1
          AND conrelid = $2::regclass
        `,
        [constraint, table],
      );

      if (rows.length === 0) {
        console.warn(
          `[${this.name}] Constraint "${constraint}" não encontrada na tabela "${table}"; pulando.`,
        );
        continue;
      }

      const def: string = rows[0].def;

      // 2. Idempotência: se já contiver 'authored_material', não faz nada.
      if (def.includes("'authored_material'")) {
        console.warn(
          `[${this.name}] Constraint "${constraint}" da tabela "${table}" já aceita ` +
            `'authored_material' — no-op.`,
        );
        continue;
      }

      // 3. Caso contrário, recria a constraint com a lista ampliada.
      await queryRunner.query(
        `
        ALTER TABLE ${table}
          DROP CONSTRAINT ${constraint},
          ADD CONSTRAINT ${constraint}
          CHECK (reuse_basis IN (${this.VALUES.join(',')}))
        `,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { table, constraint } of this.TABLES) {
      // Só remove 'authored_material' se nenhuma linha das tabelas usar esse valor.
      // Se houver linhas, lança erro claro — nunca apaga nem altera dados silenciosamente.
      const rows = await queryRunner.query(
        `
        SELECT COUNT(*) AS cnt
        FROM ${table}
        WHERE reuse_basis = 'authored_material'
        `,
      );

      const count = Number(rows[0]?.cnt ?? 0);
      if (count > 0) {
        throw new Error(
          `[${this.name}] down() abortado: "${table}" contém ${count} linha(s) com ` +
            `reuse_basis = 'authored_material'. Remova ou reatribua essas linhas antes de reverter.`,
        );
      }

      const defRows = await queryRunner.query(
        `
        SELECT pg_get_constraintdef(oid) AS def
        FROM pg_constraint
        WHERE conname = $1
          AND conrelid = $2::regclass
        `,
        [constraint, table],
      );

      if (defRows.length === 0) {
        continue;
      }

      const def: string = defRows[0].def;
      if (!def.includes("'authored_material'")) {
        // Já está sem o valor: nada a fazer.
        continue;
      }

      await queryRunner.query(
        `
        ALTER TABLE ${table}
          DROP CONSTRAINT ${constraint},
          ADD CONSTRAINT ${constraint}
          CHECK (reuse_basis IN ('cite_only','adapt_with_attribution','adapt_requires_permission'))
        `,
      );
    }
  }
}
