// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CURRICULUM_MODULES, getAllLessons } from '@/core/data/curriculum';

/**
 * RF-009 — the dashboard builds its cards from `CURRICULUM_MODULES`, and every card links to
 * `/lessons/{id}`. So a registry row that is not a lesson the API serves turns into a 404 the
 * learner can reach by clicking (this is exactly what happened: 57 IDs from the §3 plan were
 * never authored, while the authored files carry §4.3's names).
 *
 * The registry is the authority, not this test: it re-reads §4.3 and compares. One row
 * (`les_b1_it_presentations`) is `blocked_no_adequate_source` and has no lesson file, so the
 * catalog must not offer it.
 */

const BLOCKED = ['les_b1_it_presentations'];

/** `its-platform/frontend/tests/unit/core` → repo root. */
const SPEC_PATH = fileURLToPath(
  new URL('../../../../../specs/curriculum-graph-spec.md', import.meta.url),
);

interface RegistryModule {
  readonly id: string;
  readonly lessons: readonly { readonly id: string; readonly title: string }[];
}

function parseRegistry(markdown: string): RegistryModule[] {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.startsWith('### 4.3 '));
  const end = lines.findIndex((line) => line.startsWith('## 4.4 '));
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('curriculum spec §4.3 registry not found');
  }

  const modules: RegistryModule[] = [];
  let current: { id: string; lessons: { id: string; title: string }[] } | null = null;

  for (const line of lines.slice(start, end)) {
    const moduleId = line.match(/^\*\*`(mod_[a-z0-9_]+)`\*\*/)?.[1];
    if (moduleId !== undefined) {
      current = { id: moduleId, lessons: [] };
      modules.push(current);
      continue;
    }
    const row = line.match(/^\| `(les_[a-z0-9_]+)` \| ([^|]+?) \|/);
    const lessonId = row?.[1];
    const title = row?.[2];
    if (lessonId !== undefined && title !== undefined && current !== null) {
      current.lessons.push({ id: lessonId, title: title.trim() });
    }
  }

  return modules;
}

const registry = parseRegistry(readFileSync(SPEC_PATH, 'utf8'));

describe('RF-009 — dashboard lesson catalog matches the canonical registry', () => {
  it('reads the §4.3 registry it is meant to mirror', () => {
    expect(registry).toHaveLength(18);
    expect(registry.flatMap((mod) => mod.lessons)).toHaveLength(123);
  });

  it('declares the same modules, without gaps in their sequence', () => {
    // Set, not order: §4.3 groups rows by authoring batch (`mod_b1_fluency_project` sits last),
    // while the catalog orders modules by the learner-facing sequence.
    expect([...CURRICULUM_MODULES.map((mod) => mod.id)].sort()).toEqual(
      [...registry.map((mod) => mod.id)].sort(),
    );
    expect(CURRICULUM_MODULES.map((mod) => mod.index)).toEqual(
      CURRICULUM_MODULES.map((_, idx) => idx + 1),
    );
  });

  it('offers every authored lesson, and only authored lessons', () => {
    for (const registryModule of registry) {
      const expected = registryModule.lessons
        .map((lesson) => lesson.id)
        .filter((id) => !BLOCKED.includes(id));
      const actual = CURRICULUM_MODULES.find((mod) => mod.id === registryModule.id)?.lessons ?? [];
      expect(actual.map((lesson) => lesson.id), registryModule.id).toEqual(expected);
    }
  });

  it('keeps the blocked row out of the navigable catalog', () => {
    const ids = getAllLessons().map((lesson) => lesson.id);
    for (const blocked of BLOCKED) expect(ids).not.toContain(blocked);
  });

  it('has no duplicate and only pattern-valid lesson IDs', () => {
    const ids = getAllLessons().map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(122);
    for (const id of ids) expect(id).toMatch(/^les_[a-z0-9_]+$/);
  });
});
