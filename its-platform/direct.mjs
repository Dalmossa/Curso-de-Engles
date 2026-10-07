import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';
import { DataSource } from 'typeorm';

const pglite = new PGlite();
const ds = new DataSource({ type: 'postgres', driver: pglite, synchronize: false });
await ds.initialize();
const drv = ds.driver;
for (const stmt of SCHEMA_STATEMENTS) {
  try { await drv.query(stmt); } catch (e) {}
}
const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
console.log(report.lessons, report.packs, report.dialogues, report.slots, report.items, report.skips.length, report.errors.length);
await ds.destroy();
