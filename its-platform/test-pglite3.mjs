import { PGlite } from '@electric-sql/pglite';
import { DataSource } from 'typeorm';
import { SCHEMA_STATEMENTS } from './src/migrations/1791331200000-create-schema.ts';
import { loadContent } from './dist/infrastructure/content/content-loader.js';

async function run() {
  const pglite = new PGlite();
  const ds = new DataSource({
    type: 'postgres',
    driver: pglite,
    synchronize: false
  } as any);
  await ds.initialize();
  const drv = ds.driver as any;
  for (const stmt of SCHEMA_STATEMENTS) {
    try {
      await drv.query(stmt);
    } catch (e) {}
  }
  const report = await loadContent(ds, '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
  console.log(JSON.stringify({
    lessons: report.lessons,
    packs: report.packs,
    dialogues: report.dialogues,
    slots: report.slots,
    items: report.items,
    skips: report.skips.length,
    errors: report.errors.length
  }));
  await ds.destroy();
}

run();
