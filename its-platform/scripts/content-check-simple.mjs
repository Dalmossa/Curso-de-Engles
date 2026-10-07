#!/usr/bin/env node
import { DataSource } from 'typeorm';
import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from '../src/migrations/1791331200000-create-schema.ts';
import { loadContent } from '../dist/infrastructure/content/content-loader.js';

const EXPECTED_SKIP_COUNT = 16;
const CONTENT_REPO_PATH = process.env.CONTENT_REPO_PATH || '/home/dalmo/Documentos/Projetos/Curso-de-Ingles';

async function getDataSource() {
  if (process.env.DATABASE_URL) {
    return new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: false,
      synchronize: false
    });
  }
  return new DataSource({
    type: 'postgres',
    url: 'postgres://test:test@localhost:5432/test',
    ssl: false,
    synchronize: false
  });
}

async function run() {
  try {
    const ds = await getDataSource();
    await ds.initialize();
    const report = await loadContent(ds, CONTENT_REPO_PATH);
    console.log(report);
  } catch (err) {
    console.error('err');
  }
}

run();
