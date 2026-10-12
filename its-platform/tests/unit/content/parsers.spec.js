"use strict";
import { extractLearnerModel, extractPhases, parseLesson, } from '../../../src/infrastructure/content/lesson-parser.js';
import { parsePack } from '../../../src/infrastructure/content/pack-parser.js';
import { parseListeningCorpus, transcriptDuration, } from '../../../src/infrastructure/content/listening-parser.js';
/**
 * Contract tests for the content parsers under ADR-022. Every field asserted here
 * names a real ADR-019 column: there is no `lessons.skill_items`, no
 * `packs.pack_id`/`packs.schema`, no `dialogues.dialogue_id` and no
 * `listening_slots` table.
 */
/**
 * ADR-027 §5: `parseLesson` now fails closed unless `extractPhases` yields exactly
 * 1,2,3,4, so every fixture carries the four `FASE` headings the real lessons have.
 */
const PHASES = `## FASE 1 — Input (i+1) [4 min]

Phase one body.

## FASE 2 — Guided Practice [5 min]

Phase two body.

## FASE 3 — Output Task [4 min]

Phase three body.

## FASE 4 — Shadow CAT [2 min]

Phase four body.
`;
describe('Lesson parser', () => {
    it('reads the JSON learner-model block and derives the ADR-019 state columns', () => {
        const markdown = `# Test

${PHASES}
## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

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
        // ADR-027 §5: the four phases and the learner model land on `lessons.body`.
        expect(result.body.phases.map(p => p.phase)).toEqual([1, 2, 3, 4]);
        expect(result.body.phases[0]?.heading).toBe('FASE 1 — Input (i+1) [4 min]');
        expect(result.body.learner_model).toEqual(expect.objectContaining({ lesson_id: 'les_a1_test' }));
    });
    it('takes the declared id over the filename and resolves the module from the §4.3 registry', () => {
        const markdown = `**Lesson ID:** \`les_a2_greetings_intro\`
**Reuse basis:** \`adapt_requires_permission\`
**Source Markdown:** \`Ingles-basico.md\`

${PHASES}
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

${PHASES}
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
describe('Lesson phases and learner model (ADR-027 §5)', () => {
    it('extracts the four phases verbatim, spanning both header generations', () => {
        const generationA = `## FASE 1 — Input (i+1) [4 min]
a1
## FASE 2 — Guided Practice [5 min]
a2
## FASE 3 — Output Task [4 min]
a3
## FASE 4 — Shadow CAT [2 min]
a4
`;
        const a = extractPhases(generationA);
        expect(a.map(p => p.phase)).toEqual([1, 2, 3, 4]);
        expect(a[0]?.heading).toBe('FASE 1 — Input (i+1) [4 min]');
        expect(a[0]?.markdown).toBe('a1');
        expect(a[3]?.markdown).toBe('a4');
        const generationB = `## 📥 FASE 1: INPUT COMPREENSÍVEL (i+1) — 4 min
b1
## 🛠 FASE 2: GUIDED PRACTICE — 5 min
b2
## 🎭 FASE 3: OUTPUT TASK (Communicative) — 4 min
b3
## ✅ FASE 4: FORMATIVE CHECK — 2 min
b4
`;
        const b = extractPhases(generationB);
        expect(b.map(p => p.phase)).toEqual([1, 2, 3, 4]);
        // `heading` is verbatim: emoji, case and the `:` separator are preserved.
        expect(b[0]?.heading).toBe('📥 FASE 1: INPUT COMPREENSÍVEL (i+1) — 4 min');
        expect(b[3]?.heading).toBe('✅ FASE 4: FORMATIVE CHECK — 2 min');
    });
    it('does not read a FASE heading inside a fenced block', () => {
        const markdown = `## FASE 1 — Input (i+1) [4 min]
one
\`\`\`
## FASE 2 — not a heading
\`\`\`
## FASE 2 — Guided Practice [5 min]
two
## FASE 3 — Output Task [4 min]
three
## FASE 4 — Shadow CAT [2 min]
four
`;
        const phases = extractPhases(markdown);
        expect(phases.map(p => p.phase)).toEqual([1, 2, 3, 4]);
        expect(phases[1]?.heading).toBe('FASE 2 — Guided Practice [5 min]');
        expect(phases[1]?.markdown).toBe('two');
        // The fenced line stays inside phase 1's body, verbatim.
        expect(phases[0]?.markdown).toContain('## FASE 2 — not a heading');
    });
    it('fails closed when the headings are not exactly 1,2,3,4', () => {
        expect(() => extractPhases('## FASE 1 — A [1 min]\n\n## FASE 3 — C [1 min]\n')).toThrow(/1,2,3,4/);
        expect(() => extractPhases('# Nothing here\n')).toThrow(/1,2,3,4/);
    });
    it('reads the learner-model JSON from its section, or null when absent', () => {
        expect(extractLearnerModel('# Nothing here\n')).toBeNull();
        const withModel = `## 📊 DADOS PARA O LEARNER MODEL (Pedagogical Memory)

\`\`\`json
{ "lesson_id": "les_a1_test" }
\`\`\`
`;
        expect(extractLearnerModel(withModel)).toEqual({ lesson_id: 'les_a1_test' });
        // A malformed fence still throws (the loader names the file).
        expect(() => extractLearnerModel('## 📊 DADOS PARA O LEARNER MODEL\n\n```json\n{ not valid json }\n```\n')).toThrow(/Invalid JSON/);
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
        expect(result.items[0].stem).toBe('Test?');
        expect(result.items[0].item_type).toBe('contextual_selection');
        expect(result.items[0].scoring).toBe('choice');
        // The fixture declares no `skill:`/`domain:`, so the documented `vocab` fallback
        // keeps `items.domain_id` (NOT NULL, FK → domains) satisfiable.
        expect(result.items[0].domain_id).toBe('vocab');
        expect(result.items[0].options.length).toBe(2);
        expect(result.items[0].key).toBe('A');
        expect(result.items[0].options[0].is_key).toBe(true);
        expect(result.items[0].options[1].is_key).toBe(false);
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
        expect(result.items[0].item_id).toBe('vocab.greetings.hello');
        expect(result.items[0].domain_id).toBe('vocab');
        expect(result.items[0].stem).toBe('**Hello** means:');
        expect(result.items[0].options.length).toBe(2);
        expect(result.items[0].key).toBe('B');
        expect(result.items[0].options[1].is_key).toBe(true);
        // Legacy `**br_pt_form:**` is item-level; the DDL has no item column for it.
        expect(result.items[0].options[0].br_pt_form).toBe('olá');
        // A legacy item records no distractor rationale, and the row says so truthfully.
        expect(result.items[0].options[0].note).toBe('no distractor rationale recorded (legacy_v1)');
    });
    it('rejects a document that is neither schema', () => {
        expect(() => parsePack('# Nothing\n\nNo manifest here.\n', 'pack_unknown.md')).toThrow(/Unknown pack schema/);
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
        const d = result.dialogues[0];
        expect(d.id).toBe('dlg_a1_test_001');
        expect(d.cefr_level).toBe('A1');
        expect(d.status).toBe('shipped');
        // D-5: a dialogue needs at least two distinct speakers.
        expect(d.speakers.length).toBeGreaterThanOrEqual(2);
        expect(d.clips.length).toBe(2);
        expect(result.voices.length).toBe(2);
        expect(result.voices.every(v => v.accent === 'en-US')).toBe(true);
        expect(d.items.length).toBe(1);
        expect(d.items[0].item_id).toBe('lst_gist_001');
        expect(result.dialogues[0].items[0].listening_kind).toBe('lst_gist');
        expect(result.dialogues[0].items[0].listening_tier).toBe('L1');
        expect(result.dialogues[0].items[0].stem).toBe('What is this conversation mainly about?');
        expect(result.dialogues[0].items[0].options.length).toBe(2);
        expect(result.dialogues[0].items[0].key).toBe('B');
        expect(result.dialogues[0].items[0].options.filter(o => o.is_key).length).toBe(1);
    });
    // ADR-027 §3b: the authored transcript is the artefact `clips` are derived from — a clip
    // keeps one turn's text plus a `speaker_id`, so the speaker's name and the authored line
    // structure survive only in `dialogues.transcript`.
    it('keeps the authored transcript verbatim (ADR-027 §3b)', () => {
        const d = parseListeningCorpus(corpus).dialogues[0];
        expect(d.transcript).toBe('> **Ana:** Hello there.\n> **Ben:** Hi Ana.');
    });
    // ADR-027 §3a: the key marker has two generations in `corpus/listening-corpus.md` — 76 rows
    // put `✓` in the value column, 11 put `✓ —` in the trailing column where the distractor type
    // would sit. Reading only the value column loaded those 11 shipped slots with `key = null`
    // and every option `is_key = false`, i.e. unscorable.
    const corpusWithTrailingKey = corpus.replace(`| Slot | Value |
|------|-------|
| A | A greeting |
| B | **A first meeting** ✓ |`, `| Slot | Value | Distractor type |
|------|-------|-----------------|
| A | A greeting | semantic_plausible |
| B | **A first meeting** | ✓ — |`);
    it('reads the key marker from the trailing column too, and still exactly one key', () => {
        const item = parseListeningCorpus(corpusWithTrailingKey).dialogues[0].items[0];
        expect(item.key).toBe('B');
        expect(item.options.filter(o => o.is_key).length).toBe(1);
        expect(item.options[1].option_text).toContain('A first meeting');
        expect(item.options[1].is_key).toBe(true);
        // The key row's own column carries the marker, not a distractor type.
        expect(item.options[0].note).toBe('semantic_plausible');
        expect(item.options[1].note).toBeNull();
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
//# sourceMappingURL=parsers.spec.js.map