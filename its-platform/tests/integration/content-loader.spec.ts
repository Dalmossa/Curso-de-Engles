import { createTestDb } from '../helpers/db';
import { createTempContentRoot, createLessonFixture, createPackFixture, createListeningFixture, cleanupTempDir } from '../helpers/fixtures';
import { loadContent } from '../../src/infrastructure/content/content-loader';

describe('Content Loader Integration (PGlite)', () => {
  it('loads lessons, packs, and listening with PGlite', async () => {
    const { dataSource, cleanup } = await createTestDb();
    const contentRoot = createTempContentRoot();
    try {
      createLessonFixture(contentRoot, 'a1', 'greetings');
      createPackFixture(contentRoot, 'les_a1_greetings');
      createListeningFixture(contentRoot);

      const report = await loadContent(dataSource, contentRoot);
      expect(report.lessons).toBeGreaterThan(0);
      expect(report.packs).toBeGreaterThan(0);
      expect(report.dialogues).toBeGreaterThan(0);
      expect(report.items).toBeGreaterThan(0);
      expect(Array.isArray(report.errors)).toBe(true);
      expect(Array.isArray(report.skips)).toBe(true);
    } finally {
      cleanup();
      cleanupTempDir(contentRoot);
    }
  });

  it('is idempotent when loading same content twice', async () => {
    const { dataSource, cleanup } = await createTestDb();
    const contentRoot = createTempContentRoot();
    try {
      createLessonFixture(contentRoot, 'a1', 'greetings');
      createPackFixture(contentRoot, 'les_a1_greetings');
      createListeningFixture(contentRoot);

      const report1 = await loadContent(dataSource, contentRoot);
      const report2 = await loadContent(dataSource, contentRoot);
      expect(report1.lessons).toBe(report2.lessons);
      expect(report1.packs).toBe(report2.packs);
    } finally {
      cleanup();
      cleanupTempDir(contentRoot);
    }
  });
});
