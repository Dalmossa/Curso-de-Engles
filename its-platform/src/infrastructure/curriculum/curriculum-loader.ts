import { DataSource, Repository } from 'typeorm';
import type { QueryRunner } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity.js';
import { LessonEntity } from '../entities/lesson.entity.js';
import { LessonPrerequisiteEntity } from '../entities/lesson-prerequisite.entity.js';
import type { CurriculumGraph, CurriculumNode, ModuleInfo } from './curriculum-types.js';
import { parseCurriculumSpec } from './curriculum-parser.js';

export interface LoadReport {
  modules: number;
  lessons: number;
  prerequisites: number;
  skips: { id: string; reason: string }[];
}

const SKIP_BASELINE = 0;

export async function loadCurriculum(
  dataSource: DataSource,
  specMarkdown: string
): Promise<LoadReport> {
  const graph = parseCurriculumSpec(specMarkdown);
  const report: LoadReport = { modules: 0, lessons: 0, prerequisites: 0, skips: [] };

  const qr = dataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();

  try {
    const moduleRepo = qr.manager.getRepository(ModuleEntity);
    const lessonRepo = qr.manager.getRepository(LessonEntity);
    const prereqRepo = qr.manager.getRepository(LessonPrerequisiteEntity);

    // 1. Upsert modules
    for (const mod of graph.modules.values()) {
      await moduleRepo.upsert(
        {
          id: mod.id,
          title: mod.title,
          cefrLevel: mod.cefrLevel,
          track: mod.track,
          sourceMarkdowns: mod.sourceMarkdowns,
          sortOrder: mod.sortOrder,
          expectedLessons: mod.expectedLessons,
        },
        { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true }
      );
      report.modules++;
    }

    // 2. Upsert lessons (only those with module_id, i.e., lesson nodes)
    for (const node of graph.nodes.values()) {
      if (node.type !== 'lesson' || !node.moduleId) continue;
      if (node.status === 'blocked_no_adequate_source') {
        report.skips.push({ id: node.id, reason: 'blocked_no_adequate_source' });
        continue;
      }
      await lessonRepo.upsert(
        {
          id: node.id,
          moduleId: node.moduleId,
          title: node.title,
          cefrLevel: node.cefrLevel,
          reuseBasis: 'cite_only',
          authoringState: node.status === 'authored' ? 'authored' : 'blocked',
          publicationState: 'publishable',
          permissionState: 'not_required',
          sourceRef: node.sourceRef || null,
        },
        { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true }
      );
      report.lessons++;
    }

    // 3. Upsert prerequisites (lesson -> lesson edges of type prerequisite)
    for (const edge of graph.edges) {
      if (edge.type !== 'prerequisite') continue;
      const fromNode = graph.nodes.get(edge.from);
      const toNode = graph.nodes.get(edge.to);
      if (!fromNode || !toNode || fromNode.type !== 'lesson' || toNode.type !== 'lesson') continue;

      await prereqRepo.upsert(
        {
          lessonId: edge.to,
          prereqId: edge.from,
          edgeType: edge.type,
        },
        { conflictPaths: ['lessonId', 'prereqId'], skipUpdateIfNoValuesChanged: true }
      );
      report.prerequisites++;
    }

    await qr.commitTransaction();
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }

  if (report.skips.length !== SKIP_BASELINE) {
    throw new Error(
      `Curriculum load skip count mismatch: expected ${SKIP_BASELINE}, got ${report.skips.length}. ` +
      `Skips: ${report.skips.map(s => `${s.id}:${s.reason}`).join('; ')}`
    );
  }

  return report;
}

export async function loadCurriculumFromFile(
  dataSource: DataSource,
  specPath: string
): Promise<LoadReport> {
  const fs = await import('fs');
  const path = await import('path');
  const markdown = fs.readFileSync(path.resolve(specPath), 'utf-8');
  return loadCurriculum(dataSource, markdown);
}