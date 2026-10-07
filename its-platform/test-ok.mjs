import { PGlite } from '@electric-sql/pglite';
import { DataSource } from 'typeorm';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';

const pglite = new PGlite();
const ds = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'test',
  username: 'test',
  password: 'test',
  synchronize: false
} as any);
await ds.initialize();
for (const stmt of SCHEMA_STATEMENTS) {
  try { await pglite.query(stmt); } catch (e) {}
}
// patch ds to use pglite for queries
(ds as any).query = async (sql, params) => (await pglite.query(sql, params)).rows;
const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
console.log(report.lessons, report.packs, report.dialogues, report.slots, report.items, report.skips.length, report.errors.length);
await ds.destroy();
