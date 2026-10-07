import { PGlite } from '@electric-sql/pglite';
import { DataSource } from 'typeorm';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';

const EXPECTED_SKIP_COUNT = 16;
const CONTENT_REPO_PATH = '/home/dalmo/Documentos/Projetos/Curso-de-Ingles';

async function main() {
  const pglite = new PGlite();
  const ds = new DataSource({ type: 'postgres', url: 'postgres://x:x@x:5432/x', synchronize: false });
  try { await ds.initialize(); } catch (e) {}
  const drv = ds.driver;
  drv.master = { connect: async () => ({ query: (s,p)=>pglite.query(s,p), release: ()=>{} }) };
  drv.isConnected = true;
  for (const stmt of SCHEMA_STATEMENTS) {
    try { await pglite.query(stmt); } catch (e) {}
  }
  ds.query = async (sql, params) => { const res = await pglite.query(sql, params); return res.rows; };
  const report = await loadContent(ds, CONTENT_REPO_PATH);
  const skips = Array.isArray(report.skips) ? report.skips : [];
  const out = JSON.stringify({
    lessons: report.lessons,
    packs: report.packs,
    dialogues: report.dialogues,
    slots: report.slots,
    items: report.items,
    skips: skips.length,
    errors: report.errors.length
  });
  process.stdout.write(out + '\n');
  if (skips.length !== EXPECTED_SKIP_COUNT || report.errors.length > 0) {
    process.exit(1);
  }
  process.stdout.write('PASS\n');
  await ds.destroy();
}
main().catch(e => {
  process.stderr.write(e.toString());
  process.exit(1);
});
