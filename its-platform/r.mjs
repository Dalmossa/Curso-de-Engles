import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';
import { DataSource } from 'typeorm';

async function main() {
  const pglite = new PGlite();
  const ds = new DataSource({
    type: 'postgres',
    url: 'postgres://localhost:5432/fake',
    synchronize: false
  });
  try { await ds.initialize(); } catch (e) {}
  const drv = ds.driver;
  drv.postgres = {
    Pool: class {
      constructor() {}
      async connect() { return { query: (s, ps) => pglite.query(s, ps), release: () => {} }; }
      async end() {}
    },
    Client: class {
      constructor() {}
      async connect() { return this; }
      async query(s, ps) { return pglite.query(s, ps); }
      async end() {}
    }
  };
  drv.createPool = function() {
    return { connect: async () => ({ query:(s,ps)=>pglite.query(s,ps), release:()=>{} }), on: ()=>{}, end: async ()=>{} };
  };
  for (const stmt of SCHEMA_STATEMENTS) {
    try { await pglite.query(stmt); } catch (e) {}
  }
  ds.query = async function(sql, params) {
    const res = await pglite.query(sql, params);
    return res.rows;
  };
  const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
  console.log(report.lessons, report.packs, report.dialogues, report.slots, report.items, report.skips.length, report.errors.length);
  await ds.destroy();
}
main();
