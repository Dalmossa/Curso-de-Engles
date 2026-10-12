export declare function createLessonFixture(contentRoot: string, cefr?: 'a1' | 'a2' | 'b1' | 'b2' | 'remediation', name?: string): string;
export declare function createPackFixture(contentRoot: string, lessonId: string): string;
export declare function createListeningFixture(contentRoot: string): string;
/**
 * A temp content root carrying a minimal `specs/curriculum-graph-spec.md`. The lesson
 * fixtures reference a module (`mod_<cefr>_foundation`) and `loadContent` refuses a
 * lesson whose module is absent from the curriculum graph — the same fail-closed rule
 * the real content satisfies through its §4.3 registry. Without the spec the fixture
 * root would load zero lessons.
 */
export declare function createTempContentRoot(): string;
export declare function cleanupTempDir(dir: string): void;
//# sourceMappingURL=fixtures.d.ts.map