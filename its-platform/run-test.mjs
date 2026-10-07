import { PGlite } from '@electric-sql/pglite';
import { DataSource } from 'typeorm';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';

async function main() {
  const pglite = new PGlite();
  const ds = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'x',
    username: 'x',
    password: 'x',
    synchronize: false
  });
  await ds.initialize();
  for (const stmt of SCHEMA_STATEMENTS) {
    try { await pglite.query(stmt); } catch (e) {}
  }
  (ds).query = async function(sql, params) {
    const res = await pglite.query(sql, params);
    return res.rows;
  };
  const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
  console.log(JSON.stringify({lessons:report.lessons, packs:report.packs, dialogues:report.dialogues, slots:report.slots, items:report.items, skips:report.skips.length, errors:report.errors.length}));
  await ds.destroy();
}
main();
