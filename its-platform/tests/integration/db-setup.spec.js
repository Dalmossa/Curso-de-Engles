"use strict";
import { createTestDb } from '../helpers/db';
describe('Test DB harness', () => {
    it('creates isolated PGlite database', async () => {
        const { dataSource, cleanup } = await createTestDb();
        try {
            const result = await dataSource.query('SELECT 1 as test');
            expect(result[0].test).toBe(1);
        }
        finally {
            await cleanup();
        }
    });
    it('provides reusable fixtures', async () => {
        const { dataSource, cleanup } = await createTestDb();
        try {
            const tables = await dataSource.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename LIMIT 5");
            expect(tables.length).toBeGreaterThan(0);
        }
        finally {
            await cleanup();
        }
    });
});
//# sourceMappingURL=db-setup.spec.js.map