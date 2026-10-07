#!/usr/bin/env node
import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from '../src/migrations/1791331200000-create-schema.ts';
import { loadContent } from '../dist/infrastructure/content/content-loader.js';
import { DataSource } from 'typeorm';

const EXPECTED_SKIP_COUNT = 16;
const CONTENT_REPO_PATH = process.env.CONTENT_REPO_PATH || '/home/dalmo/Documentos/Projetos/Curso-de-Ingles';

async function run() {
  try {
    if (process.env.DATABASE_URL) {
      const ds = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: false,
        synchronize: false
      });
      await ds.initialize();
      for (const stmt of SCHEMA_STATEMENTS) {
        try {
          await ds.query(stmt);
        } catch (e) {}
      }
      const report = await loadContent(ds, CONTENT_REPO_PATH);
      const skips = Array.isArray(report.skips) ? report.skips : [];
      if (skips.length !== EXPECTED_SKIP_COUNT || (report.errors && report.errors.length > 0)) {
        console.error('FAIL');
        process.exit(1);
      }
      console.log('PASS');
      await ds.destroy();
      return;
    }

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
    if (skips.length !== EXPECTED_SKIP_COUNT || (report.errors && report.errors.length > 0)) {
      console.error('FAIL');
      process.exit(1);
    }
    console.log(JSON.stringify({
      lessons: report.lessons,
      packs: report.packs,
      dialogues: report.dialogues,
      slots: report.slots,
      items: report.items,
      skips: skips.length
    }));
    await ds.destroy();
  } catch (err) {
    console.error('FAIL:', err);
    process.exit(1);
  }
}

run();
