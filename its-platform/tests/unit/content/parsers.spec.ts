import { parseLesson } from '../../../src/infrastructure/content/lesson-parser.js';
import { parsePack } from '../../../src/infrastructure/content/pack-parser.js';
import {
  parseListeningCorpus,
  transcriptDuration,
} from '../../../src/infrastructure/content/listening-parser.js';

/**
 * Contract tests for the content parsers under ADR-022. Every field asserted here
 * names a real ADR-019 column: there is no `lessons.skill_items`, no
 * `packs.pack_id`/`packs.schema`, no `dialogues.dialogue_id` and no
 * `listening_slots` table.
 */

describe('Lesson parser', () => {
  it('reads the JSON learner-model block and derives the ADR-019 state columns', () => {
    const markdown = `# Test
\`\`\`json
{
  "lesson_id": "les_a1_test",
  "title": "Test Lesson",
  "cefr_level": "A1",
  "module_id": "mod_a1_test",
  "prereq_lessons": ["les_a1_prev"],
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
    expect(result.module_id).toBe('mod_a1_test');
    expect(result.prereq_lessons).toEqual(['les_a1_prev']);
    expect(result.authoring_state).toBe('authored');
    expect(result.publication_state).toBe('publishable');
    expect(result.permission_state).toBe('not_required');
  });

  it('takes the declared id over the filename and resolves the module from the §4.3 registry', () => {
    const markdown = `**Lesson ID:** \`les_a2_greetings_intro\`
**Reuse basis:** \`adapt_requires_permission\`
**Source Markdown:** \`Ingles-basico.md\`
\`\`\`json
{
  "lesson_id": "les_a2_greetings_intro",
  "module_id": "mod_a2_travel",
  "cefr_level": "A2",
  "title": "Greetings"
}
\`\`\`
`;
    // The real repo declares `les_a2_greetings_intro` inside
    // `lesson-15min-workplace-greetings.md`, so the id can never be inferred from
    // the filename; and the module is resolved from `curriculum-graph-spec.md`.
    const result = parseLesson(markdown, 'lesson-15min-workplace-greetings.md', {
      dirCefr: null,
      lessonModules: { les_a2_greetings_intro: 'mod_a2_travel' },
    });
    expect(result.id).toBe('les_a2_greetings_intro');
    expect(result.module_id).toBe('mod_a2_travel');
    expect(result.cefr_level).toBe('A2');
    // ADR-022 §3: `source_ref` is the *declared* `**Source:**` value, verbatim —
    // the lessons declare markdown, so the ref keeps its inline code spans.
    expect(result.source_ref).toBe('`Ingles-basico.md`');
    // `adapt_requires_permission` may not be published.
    expect(result.publication_state).toBe('restricted_pending_permission');
    expect(result.permission_state).toBe('requested');
  });

  it('reads CEFR from the metadata table and rejects a non-CEFR JSON value', () => {
    const markdown = `**Lesson ID:** les_b1_standup

| **CEFR Level** | B1 (threshold) |
| --- | --- |

\`\`\`json
{ "lesson_id": "les_b1_standup", "cefr_level": "A2+" }
\`\`\`
`;
    // The 7 lessons without a prose `**CEFR:**` declare `A2+` in the JSON block,
    // which is not a CEFR code; the metadata table wins.
    const result = parseLesson(markdown, 'lesson-b1-standup.md');
    expect(result.cefr_level).toBe('B1');
  });
});

describe('Pack parser', () => {
  it('parses the canonical schema (frontmatter manifest + YAML items)', () => {
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
    expect(result.id).toBe('pack_les_a1_test_v1');
    expect(result.lesson_id).toBe('les_a1_test');
    expect(result.schema_version).toBe('canonical');
    expect(result.items.length).toBe(1);
    expect(result.items[0]!.stem).toBe('Test?');
    expect(result.items[0]!.item_type).toBe('contextual_selection');
    expect(result.items[0]!.scoring).toBe('choice');
    // The fixture declares no `skill:`/`domain:`, so the documented `vocab` fallback
    // keeps `items.domain_id` (NOT NULL, FK → domains) satisfiable.
    expect(result.items[0]!.domain_id).toBe('vocab');
    expect(result.items[0]!.options.length).toBe(2);
    expect(result.items[0]!.key).toBe('A');
    expect(result.items[0]!.options[0]!.is_key).toBe(true);
    expect(result.items[0]!.options[1]!.is_key).toBe(false);
  });

  it('parses the legacy_v1 schema (`**Pack ID:**` + slot table)', () => {
    const markdown = `# Pack

**Pack ID:** \`pack_les_a1_test_v1\`
**Lesson:** \`les_a1_test.md\`
**Items:** 1
**Time cap:** 4 min
**Split:** 100% current
**Interleaved:** yes

---

### ITEM 1
**item_id:** \`vocab.greetings.hello\`
**domain:** \`vocab\`
**level:** L1
**stem:** **Hello** means:
| Slot | Value |
|------|-------|
| A | Goodbye |
| B | **A greeting** |
**Key:** B
**br_pt_form:** "olá"
`;
    const result = parsePack(markdown, 'pack_legacy_v1.md');
    expect(result.schema_version).toBe('legacy_v1');
    expect(result.id).toBe('pack_les_a1_test_v1');
    expect(result.lesson_id).toBe('les_a1_test');
    expect(result.time_cap).toBe(4);
    expect(result.interleaved).toBe(true);
    expect(result.items.length).toBe(1);
    expect(result.items[0]!.item_id).toBe('vocab.greetings.hello');
    expect(result.items[0]!.domain_id).toBe('vocab');
    expect(result.items[0]!.stem).toBe('**Hello** means:');
    expect(result.items[0]!.options.length).toBe(2);
    expect(result.items[0]!.key).toBe('B');
    expect(result.items[0]!.options[1]!.is_key).toBe(true);
    // Legacy `**br_pt_form:**` is item-level; the DDL has no item column for it.
    expect(result.items[0]!.options[0]!.br_pt_form).toBe('olá');
    // A legacy item records no distractor rationale, and the row says so truthfully.
    expect(result.items[0]!.options[0]!.note).toBe(
      'no distractor rationale recorded (legacy_v1)',
    );
  });

  it('rejects a document that is neither schema', () => {
    expect(() => parsePack('# Nothing\n\nNo manifest here.\n', 'pack_unknown.md')).toThrow(
      /Unknown pack schema/,
    );
  });
});

describe('Listening parser', () => {
  const corpus = `# Listening Corpus

## \`dlg_a1_test_001\`

**Setting:** A short test conversation.
**Voices:** Ana \`v_a\` (F), Ben \`v_b\` (M)

**Transcript:**

> **Ana:** Hello there.
> **Ben:** Hi Ana.

---

### L1-1 — \`lst_gist_001\` · gist · A1 · voice \`v_a+v_b\`
**Status:** shipped

**What is this conversation mainly about?**

| Slot | Value |
|------|-------|
| A | A greeting |
| B | **A first meeting** ✓ |

**Key:** B
`;

  it('parses speakers, clips and the slot table into items/options', () => {
    const result = parseListeningCorpus(corpus);
    expect(result.dialogues.length).toBe(1);
    const d = result.dialogues[0]!;
    expect(d.id).toBe('dlg_a1_test_001');
    expect(d.cefr_level).toBe('A1');
    expect(d.status).toBe('shipped');
    // D-5: a dialogue needs at least two distinct speakers.
    expect(d.speakers.length).toBeGreaterThanOrEqual(2);
    expect(d.clips.length).toBe(2);
    expect(result.voices.length).toBe(2);
    expect(result.voices.every(v => v.accent === 'en-US')).toBe(true);
    expect(d.items.length).toBe(1);
    expect(d.items[0]!.item_id).toBe('lst_gist_001');
    expect(result.dialogues[0]!.items[0]!.listening_kind).toBe('lst_gist');
    expect(result.dialogues[0]!.items[0]!.listening_tier).toBe('L1');
    expect(result.dialogues[0]!.items[0]!.stem).toBe('What is this conversation mainly about?');
    expect(result.dialogues[0]!.items[0]!.options.length).toBe(2);
    expect(result.dialogues[0]!.items[0]!.key).toBe('B');
    expect(result.dialogues[0]!.items[0]!.options[1]!.is_key).toBe(true);
  });

  it('models duration at 150 wpm — the Q-L2 floor is the DDL CHECK, not a throw', () => {
    // Q-L2's 45 s floor is enforced by `CHECK (duration_seconds BETWEEN 45 AND 120)`
    // and by verify-integrity [5]; §8.1's model is 150 words per minute, so 45 s
    // corresponds to ~113 words and 150 words to exactly 60 s.
    const words = Array.from({ length: 150 }, () => 'word').join(' ');
    expect(transcriptDuration(words)).toBe(60);
    expect(transcriptDuration('')).toBe(0);
  });
});
