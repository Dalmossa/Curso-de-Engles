import { parseLesson } from '../../../src/infrastructure/content/lesson-parser.js';
import { parsePack } from '../../../src/infrastructure/content/pack-parser.js';
import { parseListeningCorpus } from '../../../src/infrastructure/content/listening-parser.js';

describe('Lesson parser', () => {
  it('parses lesson with frontmatter JSON', () => {
    const markdown = `# Test
\`\`\`json
{
  "lesson_id": "les_a1_test",
  "title": "Test Lesson",
  "cefr_level": "A1",
  "module_id": "mod_a1_test",
  "prereq_lessons": [],
  "skill_items": {
    "vocabulary": ["hello"]
  },
  "provenance": {
    "reuse_basis": "cite_only"
  }
}
\`\`\`
`;
    const result = parseLesson(markdown, 'les_a1_test.md');
    expect(result.id).toBe('les_a1_test');
    expect(result.cefr_level).toBe('A1');
    expect(result.reuse_basis).toBe('cite_only');
    expect(result.skill_items.length).toBeGreaterThan(0);
  });

  it('extracts lesson metadata from markdown', () => {
    const markdown = `**Lesson ID:** les_a2_airport | A2
**Reuse basis:** cite_only
**Source Markdown:** Ingles-basico.md
\`\`\`json
{
  "lesson_id": "les_a2_airport",
  "cefr_level": "A2",
  "title": "Airport"
}
\`\`\`
`;
    const result = parseLesson(markdown, 'test.md');
    expect(result.id).toBe('les_a2_airport');
    expect(result.reuse_basis).toBe('cite_only');
  });
});

describe('Pack parser', () => {
  it('parses canonical pack with items', () => {
    const markdown = `---
pack_id: "pack_les_a1_test_v1"
lesson_id: "les_a1_test"
schema_version: "canonical"
reuse_basis: "cite_only"
---
### ITEM item_001
**Type:** mcq
**Question:** Test?
**Options:**
- A. Yes
- B. No
**Key:** A
**Note:** A. Yes
`;
    const result = parsePack(markdown, 'pack_les_a1_test_v1.md');
    expect(result.pack_id).toBe('pack_les_a1_test_v1');
    expect(result.lesson_id).toBe('les_a1_test');
    expect(result.schema).toBe('canonical');
    expect(result.items.length).toBe(1);
    expect(result.items[0]!.options.length).toBe(2);
    expect(result.items[0]!.options[0]!.is_key).toBe(true);
  });

  it('parses legacy pack format', () => {
    const markdown = `# Pack
### ITEM item_001
**Type:** mcq
**Question:** Q?
**Options:**
- Yes
- No
**Key:** Yes
`;
    const result = parsePack(markdown, 'pack_legacy.md');
    expect(result.items.length).toBe(1);
    expect(result.schema).toBe('legacy');
  });
});

describe('Listening parser', () => {
  it('parses listening corpus', () => {
    const markdown = `# Listening Corpus
## Dialogue dlg_test_001
- **Dialogue ID:** dlg_test_001
- **Title:** Test
- **CEFR:** A1
- **Kind:** dialogue
- **Duration:** 60s
- **Status:** shipped

**Speakers:**
- spk1 (voice: voice_f)

**Script:**
1. spk1: Hello.
`;
    const result = parseListeningCorpus(markdown);
    expect(result.dialogues.length).toBe(1);
    expect(result.dialogues[0]!.dialogue_id).toBe('dlg_test_001');
    expect(result.dialogues[0]!.status).toBe('shipped');
    expect(result.dialogues[0]!.duration_seconds).toBe(60);
  });

  it('rejects dialogues with duration < 45s per Q-L2', () => {
    const markdown = `# Listening Corpus
## Dialogue dlg_test_short
- **Dialogue ID:** dlg_test_short
- **Title:** Short
- **CEFR:** A2
- **Kind:** dialogue
- **Duration:** 30s
- **Status:** shipped

**Speakers:**
- spk1 (voice: voice_f)

**Script:**
1. spk1: Hi.
`;
    expect(() => parseListeningCorpus(markdown)).toThrow(/Q-L2.*45/);
  });
});
