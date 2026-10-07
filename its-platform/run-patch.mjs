import { PGlite } from '@electric-sql/pglite';
import { DataSource } from 'typeorm';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';

const pglite = new PGlite();
const ds = new DataSource({
  type: 'postgres',
  url: 'postgres://localhost:5432/fake',
  synchronize: false
});
try {
  await ds.initialize();
} catch (e) {
  // expected to fail on real connect
}
// Patch driver to use PGlite
const drv = ds.driver as any;
drv.postgres = {
  Pool: class {
    constructor() {}
    async connect() {
      return { query: (s,ps)=>pglite.query(s,ps), release:()=>{} };
    }
    async end() {}
  },
  Client: class {
    constructor() {}
    async connect() { return this; }
    async query(s,ps){ return pglite.query(s,ps); }
    async end() {}
  }
};
drv.createPool = function() {
  const pool = {
    connect: async () => ({ query:(s,ps)=>pglite.query(s,ps), release:()=>{} }),
    on: ()=>{},
    end: async ()=>{}
  };
  return pool;
};
for (const stmt of SCHEMA_STATEMENTS) {
  try { await pglite.query(stmt); } catch (e) {}
}
const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
console.log(report.lessons, report.packs, report.dialogues, report.slots, report.items, report.skips.length, report.errors.length);
await ds.destroy();
