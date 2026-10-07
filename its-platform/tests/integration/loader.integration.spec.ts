import { createTestDb } from '../helpers/db';
import { createTempContentRoot, createLessonFixture, createPackFixture, cleanupTempDir } from '../helpers/fixtures';
import { loadContent } from '../../src/infrastructure/content/content-loader';
import { DataSource } from 'typeorm';

describe('Loader integration tests', () => {
  it('persists lessons correctly with PGlite', async () => {
    const { dataSource, cleanup } = await createTestDb();
    const contentRoot = createTempContentRoot();
    try {
      createLessonFixture(contentRoot, 'a1', 'test');
      const report = await loadContent(dataSource, contentRoot);
      expect(report.lessons).toBe(1);
      const rows = await dataSource.query('SELECT * FROM lessons');
      expect(rows.length).toBe(1);
      expect(rows[0].lesson_id).toContain('les_a1');
    } finally {
      cleanup();
      cleanupTempDir(contentRoot);
    }
  });

  it('persists packs with items and options', async () => {
    const { dataSource, cleanup } = await createTestDb();
    const contentRoot = createTempContentRoot();
    try {
      createLessonFixture(contentRoot, 'a1', 'test');
      createPackFixture(contentRoot, 'les_a1_test');
      const report = await loadContent(dataSource, contentRoot);
      expect(report.packs).toBe(1);
      expect(report.items).toBeGreaterThan(0);
      expect(report.options).toBeGreaterThan(0);
    } finally {
      cleanup();
      cleanupTempDir(contentRoot);
    }
  });
});
