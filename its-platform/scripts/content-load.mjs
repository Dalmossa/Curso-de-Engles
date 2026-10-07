#!/usr/bin/env node
import { DataSource } from 'typeorm';
import { loadContent } from '../dist/infrastructure/content/content-loader.js';

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }
  const ds = new DataSource({
    type: 'postgres',
    url: dbUrl,
    ssl: false,
  });
  await ds.initialize();
  const report = await loadContent(ds, process.env.CONTENT_REPO_PATH || '/home/dalmo/Documentos/Projetos/Curso-de-Ingles');
  console.log(JSON.stringify(report, null, 2));
  await ds.destroy();
}

run();
