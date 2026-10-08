#!/usr/bin/env node
import { PGlite } from '@electric-sql/pglite';
import { SCHEMA_STATEMENTS } from '../src/migrations/1791331200000-create-schema.ts';
import { loadCurriculumFromFile } from '../dist/infrastructure/curriculum/curriculum-loader.js';
import { DataSource } from 'typeorm';
import { parseCurriculumSpec, validateAcyclic, validateCEFRMonotonicity, validateReachability } from '../dist/infrastructure/curriculum/curriculum-parser.js';
import { ModuleEntity } from '../dist/infrastructure/entities/module.entity.js';
import { LessonEntity } from '../dist/infrastructure/entities/lesson.entity.js';
import { LessonPrerequisiteEntity } from '../dist/infrastructure/entities/lesson-prerequisite.entity.js';

const SPEC_PATH = '/home/dalmo/Documentos/Projetos/Curso-de-Ingles/specs/curriculum-graph-spec.md';

async function run() {
  try {
    // Read spec once for validation
    const fs = await import('fs');
    const markdown = fs.readFileSync(SPEC_PATH, 'utf-8');
    const graph = parseCurriculumSpec(markdown);

    // Validation 1: Acyclicity
    const acyclic = validateAcyclic(graph);
    if (!acyclic.valid) {
      throw new Error(`DAG has cycle! Nodes in cycle: ${acyclic.cycle?.join(', ')}`);
    }
    console.log('✓ Acyclicity: PASS');

    // Validation 2: CEFR Monotonicity
    const monotonic = validateCEFRMonotonicity(graph);
    if (!monotonic) {
      throw new Error('CEFR monotonicity violated: edge goes from higher to lower CEFR');
    }
    console.log('✓ CEFR Monotonicity: PASS');

    // Validation 3: Reachability
    const orphans = validateReachability(graph);
    if (orphans.length > 0) {
      throw new Error(`Orphan lesson nodes (unreachable): ${orphans.join(', ')}`);
    }
    console.log('✓ Reachability: PASS');

    // Validation 4: Module count
    if (graph.modules.size !== 18) {
      throw new Error(`Expected 18 modules, got ${graph.modules.size}`);
    }
    console.log('✓ Module count: 18');

    // Validation 5: Lesson count
    const lessonNodes = Array.from(graph.nodes.values()).filter(n => n.type === 'lesson');
    if (lessonNodes.length !== 123) {
      throw new Error(`Expected 123 lesson IDs, got ${lessonNodes.length}`);
    }
    console.log('✓ Lesson registry count: 123');

    // Validation 6: Remediation nodes
    if (graph.remediationNodes.size !== 5) {
      throw new Error(`Expected 5 remediation nodes, got ${graph.remediationNodes.size}`);
    }
    console.log('✓ Remediation nodes: 5');

    // Validation 7: Entry points
    if (graph.entryPoints.size !== 8) {
      throw new Error(`Expected 8 entry points, got ${graph.entryPoints.size}`);
    }
    console.log('✓ Entry points: 8');

    console.log(`\n✅ Graph validation passed: ${graph.nodes.size} nodes, ${graph.edges.length} edges`);
    console.log(`   Modules: ${graph.modules.size}, Lessons: ${lessonNodes.length}, Remediation: ${graph.remediationNodes.size}`);

    // Now load into DB (PGlite or real PG)
    if (process.env.DATABASE_URL) {
      const ds = new DataSource({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: false,
        synchronize: false,
        entities: [ModuleEntity, LessonEntity, LessonPrerequisiteEntity],
      });
      await ds.initialize();
      for (const stmt of SCHEMA_STATEMENTS) {
        try { await ds.query(stmt); } catch (e) {}
      }
      const report = await loadCurriculumFromFile(ds, SPEC_PATH);
      console.log(`✓ Loaded: ${report.modules} modules, ${report.lessons} lessons, ${report.prerequisites} prereqs`);
      await ds.destroy();
      return;
    }

    // PGlite mode
    const pglite = new PGlite();
    for (const stmt of SCHEMA_STATEMENTS) {
      try { await pglite.query(stmt); } catch (e) {}
    }

    // Use DataSource with PGlite driver wrapper (same pattern as content-check)
    const ds = new DataSource({
      type: 'postgres',
      url: 'postgres://x:x@x:5432/x',
      synchronize: false,
      entities: [ModuleEntity, LessonEntity, LessonPrerequisiteEntity],
    });
    try { await ds.initialize(); } catch (e) {}
    const drv = ds.driver;
    drv.master = {
      connect: async function() {
        return {
          query: async function(sql, params) {
            const res = await pglite.query(sql, params);
            return { rows: res.rows, rowCount: res.rows.length };
          },
          release: function() {},
        };
      },
    };
    drv.isConnected = true;
    ds.query = async function(sql, params) {
      const res = await pglite.query(sql, params);
      return res.rows;
    };

    const report = await loadCurriculumFromFile(ds, SPEC_PATH);
    console.log(`✓ Loaded (PGlite): ${report.modules} modules, ${report.lessons} lessons, ${report.prerequisites} prereqs`);

    // Verify persisted
    const moduleCount = await ds.getRepository(ModuleEntity).count();
    const lessonCount = await ds.getRepository(LessonEntity).count();
    const prereqCount = await ds.getRepository(LessonPrerequisiteEntity).count();

    if (moduleCount < 18) throw new Error(`DB module count ${moduleCount} < 18`);
    if (lessonCount < 122) throw new Error(`DB lesson count ${lessonCount} < 122`);
    console.log(`✓ DB verified: ${moduleCount} modules, ${lessonCount} lessons, ${prereqCount} prerequisites`);

    await ds.destroy();
    console.log('\n✅ CURRICULUM CHECK PASSED');
  } catch (err) {
    console.error('\n❌ CURRICULUM CHECK FAILED:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

run();