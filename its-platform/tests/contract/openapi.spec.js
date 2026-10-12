"use strict";
import { readFileSync } from 'fs';
import { join } from 'path';
describe('OpenAPI contract', () => {
    it('should be valid OpenAPI 3.1 document', () => {
        const specPath = join(process.cwd(), 'docs', 'api', 'openapi.yaml');
        const specContent = readFileSync(specPath, 'utf8');
        expect(specContent).toContain('openapi: 3.1');
        expect(specContent).toContain('/content/lessons/{lesson_id}');
        expect(specContent).toContain('/learners/{learner_id}/next');
        expect(specContent).toContain('/learners/{learner_id}/practice');
        expect(specContent).toContain('/content/packs/{pack_id}');
        expect(specContent).toContain('/content/listening/{dialogue_id}');
        expect(specContent).toContain('/learners/{learner_id}/profile');
        expect(specContent).toContain('/learners/{learner_id}/mastery');
        expect(specContent).toContain('/auth/refresh');
    });
});
//# sourceMappingURL=openapi.spec.js.map