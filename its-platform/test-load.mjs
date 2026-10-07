import { PGlite } from '@electric-sql/pglite';
import { DataSource } from 'typeorm';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';

async function main() {
  const pglite = new PGlite();
  const ds = new DataSource({ type: 'postgres', url: 'postgres://x', synchronize: false });
  try { await ds.initialize(); } catch (e) {}
  const drv = ds.driver;
  drv.master = { connect: async () => ({ query: (s,p)=>pglite.query(s,p), release: ()=>{} }) };
  drv.isConnected = true;
  for (const stmt of SCHEMA_STATEMENTS) {
    try { await pglite.query(stmt); } catch (e) {}
  }
  ds.query = async (sql, params) => { const res = await pglite.query(sql, params); return res.rows; };
  const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
  console.log(report.lessons, report.packs, report.dialogues, report.slots, report.items, report.skips.length, report.errors.length);
}
main().catch(e=>{console.error(e);});
