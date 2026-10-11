import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function createLessonFixture(contentRoot: string, cefr: 'a1'|'a2'|'b1'|'b2'|'remediation' = 'a1', name: string = 'test_lesson'): string {
  const lessonId = `les_${cefr}_${name}`;
  const dir = path.join(contentRoot, 'lessons', cefr);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${lessonId}.md`);
  const markdown = `---
title: "Test Lesson"
module_id: "mod_${cefr}_foundation"
skill_domains: ["vocabulary"]
prerequisites: []
estimated_duration_min: 15
reuse_basis: "cite_only"
source_references: []
---
# Test Lesson

Content here...

\`\`\`json
{
  "lesson_id": "${lessonId}",
  "title": "Test Lesson",
  "cefr_level": "${cefr.toUpperCase()}",
  "module_id": "mod_${cefr}_foundation",
  "prereq_lessons": [],
  "skill_items": {
    "vocabulary": ["word1"]
  },
  "provenance": {
    "reuse_basis": "cite_only"
  },
  "source_markdown": "test"
}
\`\`\`
`;
  fs.writeFileSync(file, markdown);
  return file;
}

export function createPackFixture(contentRoot: string, lessonId: string): string {
  const packId = `pack_${lessonId}_v1`;
  const cefrDir = lessonId.split('_')[1] || 'a1';
  const dir = path.join(contentRoot, 'packs', cefrDir, lessonId);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${packId}.md`);
  const markdown = `---
pack_id: "${packId}"
lesson_id: "${lessonId}"
title: "Test Pack"
cefr_level: "${cefrDir.toUpperCase()}"
time_cap: 10
split: 5
interleaved: false
schema_version: "canonical"
reuse_basis: "cite_only"
skill_domains: ["vocabulary"]
---
### ITEM item_001
**Type:** mcq
**Difficulty:** 0.3
**Question:** What is hello?
**Options:**
- A. Goodbye
- B. Hi
- C. Yes
- D. No
**Key:** B
**Note:** B. Hi
`;
  fs.writeFileSync(file, markdown);
  return file;
}

export function createListeningFixture(contentRoot: string): string {
  const dir = path.join(contentRoot, 'corpus');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'listening-corpus.md');
  // The real corpus format the parser reads (ADR-022 §2): a `## \`dlg_…\`` header,
  // `**Voices:**` speaker↔voice assignments, a transcript of `> **Name:** …` turns, and
  // one `### L1-n — \`lst_…\`` slot with a `| Slot | Value |` table keyed with `✓`.
  // Two voices are mandatory: the deferred D-5 trigger requires >= 2 distinct speakers.
  // The transcript is >= 113 words because `dialogues.duration_seconds` is
  // words ÷ 150 × 60 and the DDL rejects anything below 45 s.
  const markdown = `# Listening Corpus (fixture)

## \`dlg_a1_test_001\`

**Setting:** A new colleague's first morning on the team.
**Voices:** Ana \`v_a\` (F), Ben \`v_b\` (M)

**Transcript:**

> **Ana:** Hi Ben, good morning. I am Ana and I start on the payments team today, so I want to say hello before the first meeting begins.
> **Ben:** Good morning Ana, welcome to the team. I am Ben and I work in design, so we will probably talk about the new checkout screen quite often this month.
> **Ana:** That sounds good. I have one question about the standup, because nobody told me what time it starts and I do not want to be late on my very first day.
> **Ben:** The standup starts at nine every morning and it lasts about fifteen minutes, so please arrive a little early and bring your laptop with you.
> **Ana:** Thank you, that helps a lot. I will write it down now so I can remember it later when the day gets busy.

---

### L1-1 — \`lst_gist_001\` · gist · A1 · voice \`v_a+v_b\`
**Status:** shipped

**What is this conversation mainly about?**

| Slot | Value |
|------|-------|
| A | A customer complaint about a late delivery |
| B | **A new colleague's first day and the standup time** ✓ |
| C | A holiday plan for the whole team |
| D | A bug in the payments service |

**Key:** B
`;
  fs.writeFileSync(file, markdown);
  return file;
}

/**
 * A temp content root carrying a minimal `specs/curriculum-graph-spec.md`. The lesson
 * fixtures reference a module (`mod_<cefr>_foundation`) and `loadContent` refuses a
 * lesson whose module is absent from the curriculum graph — the same fail-closed rule
 * the real content satisfies through its §4.3 registry. Without the spec the fixture
 * root would load zero lessons.
 */
export function createTempContentRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'its-content-'));
  const specsDir = path.join(root, 'specs');
  fs.mkdirSync(specsDir, { recursive: true });
  const levels: Array<[string, string]> = [
    ['a1', 'A1'],
    ['a2', 'A2'],
    ['b1', 'B1'],
    ['b2', 'B2'],
    ['remediation', 'A1'],
  ];
  const rows = levels
    .map(
      ([c, cefr]) =>
        `| \`mod_${c}_foundation\` | Fixture Foundation ${cefr} | ${cefr} | \`test.md\` | General | 1 |`,
    )
    .join('\n');
  fs.writeFileSync(
    path.join(specsDir, 'curriculum-graph-spec.md'),
    `# Curriculum Graph (fixture)

## 3. MODULE CATALOG

| Module ID | Title | CEFR | Source Markdown(s) | Track | Lessons |
|-----------|-------|------|-------------------|-------|---------|
${rows}
`,
  );
  return root;
}

export function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
