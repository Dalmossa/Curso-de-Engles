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
  const markdown = `# Listening Corpus

## Dialogue dlg_test_001
- **Dialogue ID:** dlg_test_001
- **Title:** Test Dialogue
- **CEFR:** A1
- **Kind:** dialogue
- **Duration:** 60s
- **Status:** shipped
- **Setting:** test
- **Register:** neutral

**Speakers:**
- spk1 (voice: voice_test_f)

**Script:**
1. spk1: Hello there.
`;
  fs.writeFileSync(file, markdown);
  return file;
}

export function createTempContentRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'its-content-'));
}

export function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
