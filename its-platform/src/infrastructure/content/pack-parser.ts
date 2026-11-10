import type { PackRecord, PackItemRecord, ItemOptionRecord } from './content-types.js';
import { parse as parseYaml } from 'yaml';

/**
 * Pack reader for both on-disk schemas (ADR-004):
 *  - **canonical**  — `^pack_id:` in a ```yaml manifest, items in ```yaml blocks.
 *  - **legacy_v1**  — `**Pack ID:**` prose, items with `**item_id:**` + a slot table.
 *  - neither ⇒ throw (ADR-004, ADR-022 §2).
 *
 * Item ids come from the *declared* field (`item_id:` / `**item_id:**`), never the
 * positional `### ITEM n` header. The `MATCHING_KEY_UNSUPPORTED` skip is a shared
 * step so it applies to both schemas (ADR-022 §2).
 */

const MATCHING_KEY_UNSUPPORTED = new Set<string>([
  'vocab.clean_code.dry_yagni',
  'vocab.email.fyi_asap',
  'vocab.incident.runbook_oncall',
  'vocab.acronym.sla_slo_sli',
  'vocab.arch.latency_throughput',
  'vocab.project.risk_mitigation',
  'vocab.culture.punctuality',
  'vocab.culture.feedback',
]);

const DISTRACTOR_TYPES = new Set([
  'l1_transfer',
  'overgeneralization',
  'semantic_plausible',
  'form_alternative',
  'register_mismatch',
  'negative_control',
]);

// The DDL's `CHECK (is_key OR note IS NOT NULL)` forbids a NULL distractor note and
// the loader may not invent a rationale; this is the honest placeholder (ADR-022 §3).
const NO_RATIONALE = 'no distractor rationale recorded (legacy_v1)';

const LETTERS = 'ABCDEF';

function unquote(value: string): string {
  return value.replace(/`/g, '').replace(/^"(.*)"$/, '$1').trim();
}

function yamlString(value: unknown): string | null {
  return typeof value === 'string' ? unquote(value) : null;
}

/** Normalise a declared domain onto the `domains` seed vocabulary. */
function normalizeDomain(domain: string): string {
  const d = unquote(domain).toLowerCase();
  if (d === 'vocabulary') return 'vocab';
  return d;
}

/** First ```yaml fenced block's body, or null. */
function fencedYaml(text: string): string | null {
  const m = text.match(/```ya?ml\r?\n([\s\S]*?)```/);
  return m && m[1] !== undefined ? m[1] : null;
}

/**
 * Leading `---`-delimited YAML frontmatter, or null. The on-disk canonical packs
 * carry their manifest inside a ```yaml fence, but the integration fixtures and the
 * platform's own `tests/helpers/fixtures.ts` declare it as frontmatter; both are YAML
 * manifests and `parsePack` detects either through the same `^pack_id:` line.
 */
function frontmatterYaml(text: string): string | null {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  return m && m[1] !== undefined ? m[1] : null;
}

function parseYamlBlock(text: string): Record<string, unknown> {
  const body = fencedYaml(text) ?? frontmatterYaml(text);
  if (body === null) return {};
  // The canonical items wrap very scalar in a backtick (`item_id: \`x\``), which
  // is *not* a valid YAML plain scalar and makes `yaml.parse` throw. Re-quote the
  // simple `key: \`value\`` form before parsing so the item fields are read.
  const normalized = body.replace(
    /^(\s*(?:[A-Za-z0-9_-]+):\s*)`([^`\n]*)`\s*$/gm,
    '$1"$2"',
  );
  try {
    const parsed = parseYaml(normalized) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Map a declared type onto the `items.item_type` CHECK vocabulary (ADR-022 §3). */
function mapItemType(raw: string | null, hasOptions: boolean): string {
  const t = (raw ?? '').toLowerCase().trim();
  if (t.includes('minimal_pair')) return 'minimal_pair';
  if (t === 'defect_counting') return 'scanning';
  if (
    t === 'multiple_choice' ||
    t === 'contextual_selection' ||
    t === 'true_false_microtext' ||
    t === 'checklist_completion'
  ) {
    return 'contextual_selection';
  }
  if (t === 'gap_fill' || t === 'error_correction' || t === 'scanning') return t;
  return hasOptions ? 'contextual_selection' : 'production';
}

function deriveScoring(itemType: string, hasOptions: boolean): string {
  if (hasOptions) return 'choice';
  if (itemType === 'minimal_pair') return 'asr_phoneme_match';
  return 'free_text';
}

function pRandom(nOptions: number): number {
  if (nOptions <= 0) return 1.0;
  return Math.round((1 / nOptions) * 10000) / 10000;
}

interface RawOption {
  letter: string;
  text: string;
  isKey: boolean;
}

/** Parse a `| Slot | Value |` table into options (letters A–F). */
function parseOptionTable(block: string): { options: RawOption[]; keyLetter: string | null } {
  const keyMatch = block.match(/\*\*Key:\*\*\s*([A-F])\b/i);
  const keyLetter = keyMatch && keyMatch[1] ? keyMatch[1].toUpperCase() : null;

  const headerIdx = block.search(/^\|\s*Slot\s*\|\s*Value\s*\|/m);
  const options: RawOption[] = [];
  if (headerIdx === -1) return { options, keyLetter };

  const tableText = block.slice(headerIdx);
  const rows = tableText.split(/\r?\n/);
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    if (raw === undefined) continue;
    const line = raw.trim();
    if (!line.startsWith('|')) {
      if (i > 0 && line !== '') break;
      continue;
    }
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    if (cells.length < 2) continue;
    const letter = (cells[0] ?? '').replace(/\*/g, '').trim();
    if (!LETTERS.includes(letter) || letter.length !== 1) continue;
    const rawValue = cells[1] ?? '';
    const isKey = rawValue.includes('✓') || letter === keyLetter;
    const text = rawValue.replace(/✓/g, '').trim();
    options.push({ letter, text, isKey });
  }
  return { options, keyLetter };
}

/**
 * Parse the `**Options:**` list form (`- A. Goodbye`) used by the integration
 * fixtures' canonical pack. Scoped to the `**Options:**` section when present so an
 * unrelated bullet list elsewhere in the block cannot be mistaken for options.
 */
function parseOptionList(block: string): { options: RawOption[]; keyLetter: string | null } {
  const keyMatch = block.match(/\*\*Key:\*\*\s*([A-F])\b/i);
  const keyLetter = keyMatch && keyMatch[1] ? keyMatch[1].toUpperCase() : null;

  const optsIdx = block.search(/^\*\*Options:\*\*\s*$/im);
  const scope = optsIdx === -1 ? block : block.slice(optsIdx);
  const options: RawOption[] = [];
  for (const m of scope.matchAll(/^-\s*([A-F])[.)]\s*(.+?)\s*$/gm)) {
    const letter = (m[1] ?? '').toUpperCase();
    const text = (m[2] ?? '').replace(/✓/g, '').trim();
    if (letter === '' || text === '') continue;
    options.push({ letter, text, isKey: letter === keyLetter });
  }
  return { options, keyLetter };
}

/** The block's options: the `| Slot | Value |` table if present, else the list form. */
function parseOptions(block: string): { options: RawOption[]; keyLetter: string | null } {
  const table = parseOptionTable(block);
  if (table.options.length > 0) return table;
  const list = parseOptionList(block);
  return list.options.length > 0 ? list : table;
}

/** The item's prompt: blockquote lines before the option table, else `**stem:**`/`**Question:**`. */
function extractStem(block: string): string {
  const tableIdx = block.search(/^\|\s*Slot\s*\|\s*Value\s*\|/m);
  const scope = tableIdx === -1 ? block : block.slice(0, tableIdx);
  const quoted: string[] = [];
  for (const line of scope.split(/\r?\n/)) {
    const m = line.match(/^>\s?(.*)$/);
    if (m && m[1] !== undefined && m[1].trim() !== '') quoted.push(m[1].trim());
  }
  if (quoted.length > 0) return quoted.join('\n');
  const stemLine = block.match(/\*\*(?:stem|question):\*\*\s*(.*)$/im);
  if (stemLine && stemLine[1]) return stemLine[1].trim();
  return '';
}

function finalizeCanonicalItem(
  block: string,
  filename: string,
): { item: PackItemRecord | null; skip: boolean } {
  const yaml = parseYamlBlock(block);
  const header = block.match(/^###\s+ITEM\s+(\S+)/m);
  const declared = yaml['item_id'] ? unquote(String(yaml['item_id'])) : null;
  const proseId = block.match(/\*\*item_id:\*\*\s*`?([^`\s]+)`?/i);
  const item_id = declared ?? (proseId && proseId[1] ? proseId[1] : (header?.[1] ?? null));
  if (!item_id) {
    throw new Error(`Canonical item without an id in ${filename}`);
  }
  if (MATCHING_KEY_UNSUPPORTED.has(item_id)) return { item: null, skip: true };

  const { options: rawOptions, keyLetter } = parseOptions(block);

  const skill = yamlString(yaml['skill']);
  const namespace = skill ? skill.split('.')[0] ?? '' : '';
  // A canonical item may declare its domain in YAML (`domain:`) or in prose
  // (`**domain:**`), and the integration fixture declares neither. `vocab` is the same
  // fallback `finalizeLegacyItem` uses, and it keeps `items.domain_id` (NOT NULL,
  // FK → domains) satisfiable.
  const proseDomain = block.match(/\*\*domain:\*\*\s*`?([a-z_]+)`?/i)?.[1] ?? null;
  const declaredDomain = yamlString(yaml['domain']) ?? proseDomain;
  let domain_id = normalizeDomain(namespace.length > 0 ? namespace : (declaredDomain ?? ''));
  if (domain_id === 'coherence' && declaredDomain) domain_id = normalizeDomain(declaredDomain);
  if (domain_id === '') domain_id = 'vocab';

  const typeRaw =
    yamlString(yaml['type']) ?? (block.match(/\*\*Type:\*\*\s*([^\n]+)/i)?.[1]?.trim() ?? null);
  const item_type = mapItemType(typeRaw, rawOptions.length > 0);
  const scoring = deriveScoring(item_type, rawOptions.length > 0);

  const distractorList = Array.isArray(yaml['distractors']) ? yaml['distractors'] : [];
  const distractors = distractorList
    .filter((d): d is Record<string, unknown> => typeof d === 'object' && d !== null)
    .map(d => ({
      note: yamlString(d['note']),
      br_pt_form: yamlString(d['br_pt_form']),
      distractor_type: yamlString(d['distractor_type']),
    }));

  let di = 0;
  const options: ItemOptionRecord[] = rawOptions.map(o => {
    if (o.isKey) {
      return {
        position: LETTERS.indexOf(o.letter) + 1,
        option_text: o.text,
        is_key: true,
        distractor_type: null,
        br_pt_form: null,
        note: null,
      };
    }
    const d = distractors[di];
    di += 1;
    const dtype = d?.distractor_type ?? null;
    return {
      position: LETTERS.indexOf(o.letter) + 1,
      option_text: o.text,
      is_key: false,
      distractor_type: dtype && DISTRACTOR_TYPES.has(dtype) ? dtype : null,
      br_pt_form: d?.br_pt_form ?? null,
      note: d?.note ?? NO_RATIONALE,
    };
  });

  const brState = yamlString(yaml['br_pt_form_state']);
  const keyOption = options.find(o => o.is_key) ?? null;

  return {
    item: {
      item_id,
      skill_ids: skill ? [skill] : [domain_id],
      domain_id,
      item_type,
      scoring,
      stem: extractStem(block) || item_id,
      key: keyOption ? LETTERS[keyOption.position - 1] ?? null : (keyLetter ?? null),
      p_random: pRandom(options.length),
      br_pt_form_state: brState ?? 'applicable',
      options,
    },
    skip: false,
  };
}

function finalizeLegacyItem(
  block: string,
  filename: string,
): { item: PackItemRecord | null; skip: boolean } {
  const header = block.match(/^###\s+ITEM\s+(\S+)/m);
  const proseId = block.match(/\*\*item_id:\*\*\s*`?([^`\s]+)`?/i);
  const item_id = proseId && proseId[1] ? proseId[1] : (header?.[1] ?? null);
  if (!item_id) {
    throw new Error(`Legacy item without an id in ${filename}`);
  }
  if (MATCHING_KEY_UNSUPPORTED.has(item_id)) return { item: null, skip: true };

  const { options: rawOptions, keyLetter } = parseOptions(block);
  const domainMatch = block.match(/\*\*domain:\*\*\s*`?([A-Za-z0-9_]+)`?/i);
  const domain_id = domainMatch && domainMatch[1] ? normalizeDomain(domainMatch[1]) : 'vocab';
  const typeMatch = block.match(/\*\*Type:\*\*\s*([^\n]+)/i);
  const item_type = mapItemType(typeMatch?.[1]?.trim() ?? null, rawOptions.length > 0);
  const scoring = deriveScoring(item_type, rawOptions.length > 0);

  // Legacy `**br_pt_form:**` is item-level; the DDL has no item column for it, so it
  // is recorded on each option (matching the loader this replaces).
  const brMatch = block.match(/\*\*br_pt_form:\*\*\s*(.*)$/im);
  const brPt = brMatch && brMatch[1] ? brMatch[1].trim().replace(/^"|"$/g, '') : null;

  const options: ItemOptionRecord[] = rawOptions.map(o => ({
    position: LETTERS.indexOf(o.letter) + 1,
    option_text: o.text,
    is_key: o.isKey,
    distractor_type: null,
    br_pt_form: brPt,
    note: o.isKey ? null : NO_RATIONALE,
  }));

  const keyOption = options.find(o => o.is_key) ?? null;
  return {
    item: {
      item_id,
      skill_ids: [domain_id],
      domain_id,
      item_type,
      scoring,
      stem: extractStem(block) || item_id,
      key: keyOption ? LETTERS[keyOption.position - 1] ?? null : (keyLetter ?? null),
      p_random: pRandom(options.length),
      br_pt_form_state: options.length === 0 ? 'not_applicable_no_distractor_set' : 'applicable',
      options,
    },
    skip: false,
  };
}

interface ItemBlock {
  text: string;
}

/** Split a pack document into `### ITEM …` blocks, stopping at the next level-2 heading. */
function itemBlocks(markdown: string): ItemBlock[] {
  const lines = markdown.split(/\r?\n/);
  const starts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && /^###\s+ITEM\b/.test(line)) starts.push(i);
  }
  const blocks: ItemBlock[] = [];
  for (let s = 0; s < starts.length; s++) {
    const start = starts[s] ?? 0;
    const next = starts[s + 1] ?? lines.length;
    let end = next;
    for (let j = start + 1; j < next; j++) {
      const line = lines[j];
      if (line && /^##(?!#)/.test(line)) {
        end = j;
        break;
      }
    }
    blocks.push({ text: lines.slice(start, end).join('\n') });
  }
  return blocks;
}

function collectItems(
  markdown: string,
  filename: string,
  schema: 'canonical' | 'legacy_v1',
): { items: PackItemRecord[]; skips: Array<{ item_id: string; reason: string }> } {
  const items: PackItemRecord[] = [];
  const skips: Array<{ item_id: string; reason: string }> = [];
  for (const block of itemBlocks(markdown)) {
    const result =
      schema === 'canonical'
        ? finalizeCanonicalItem(block.text, filename)
        : finalizeLegacyItem(block.text, filename);
    if (result.skip) {
      const idMatch = block.text.match(/\*\*item_id:\*\*\s*`?([^`\s]+)`?/i);
      const yamlId = parseYamlBlock(block.text)['item_id'];
      const id = yamlId ? unquote(String(yamlId)) : (idMatch?.[1] ?? 'unknown');
      skips.push({ item_id: id, reason: 'matching_key_unsupported' });
      continue;
    }
    if (result.item) items.push(result.item);
  }
  return { items, skips };
}

function packTitle(markdown: string, fallback: string): string {
  const h1 = markdown.match(/^#\s+(.+)$/m);
  if (!h1 || !h1[1]) return fallback;
  let t = h1[1].trim();
  t = t.replace(/^Practice Pack\s*[:—]\s*/i, '').trim();
  return t || fallback;
}

function parseCanonicalPack(markdown: string, filename: string): PackRecord {
  const meta = parseYamlBlock(markdown);
  const pack_id = yamlString(meta['pack_id']) ?? filename.replace(/\.md$/, '');
  const lesson_id = yamlString(meta['lesson_id']) ?? '';
  const reuseProse = markdown.match(/\*\*Reuse basis:\*\*\s*`([^`]+)`/i);
  const reuse_basis = reuseProse && reuseProse[1] ? reuseProse[1].trim() : 'cite_only';
  const conformance =
    meta['spec_conformance'] && typeof meta['spec_conformance'] === 'object'
      ? (meta['spec_conformance'] as Record<string, unknown>)
      : {};
  const { items, skips } = collectItems(markdown, filename, 'canonical');
  return {
    id: pack_id,
    lesson_id,
    schema_version: 'canonical',
    reuse_basis,
    title: packTitle(markdown, pack_id),
    time_cap: typeof meta['estimated_minutes'] === 'number' ? meta['estimated_minutes'] : 0,
    split: yamlString(conformance['split']) ?? 'mixed',
    interleaved: typeof conformance['interleaved'] === 'boolean' ? conformance['interleaved'] : true,
    items,
    skips,
  };
}

function parseLegacyPack(markdown: string, filename: string): PackRecord {
  const packLine = markdown.match(/\*\*Pack ID:\*\*\s*`?([^`\s]+)`?/i);
  const pack_id = packLine && packLine[1] ? packLine[1] : filename.replace(/\.md$/, '');
  const lessonLine = markdown.match(/\*\*Lesson:\*\*\s*`?([^`\s]+?)\.md`?/i);
  const lesson_id = lessonLine && lessonLine[1] ? lessonLine[1] : '';
  const reuseLine = markdown.match(/\*\*Reuse basis:\*\*\s*`([^`]+)`/i);
  const reuse_basis = reuseLine && reuseLine[1] ? reuseLine[1].trim() : 'cite_only';
  const timeLine = markdown.match(/\*\*Time cap:\*\*\s*(\d+)/i);
  const time_cap = timeLine && timeLine[1] ? parseInt(timeLine[1], 10) : 0;
  const splitLine = markdown.match(/\*\*Split:\*\*\s*(.+)$/im);
  const split = splitLine && splitLine[1] ? splitLine[1].trim() : 'mixed';
  const interleaved = /\*\*Interleaved:\*\*\s*yes/i.test(markdown);
  const { items, skips } = collectItems(markdown, filename, 'legacy_v1');
  return {
    id: pack_id,
    lesson_id,
    schema_version: 'legacy_v1',
    reuse_basis,
    title: packTitle(markdown, pack_id),
    time_cap,
    split,
    interleaved,
    items,
    skips,
  };
}

export function parsePack(markdown: string, filename: string): PackRecord {
  // ADR-004 detection — order matters because some files have BOTH prose headers and YAML.
  // Canonical packs (7 files): have ```yaml fence with pack_id: at the TOP (manifest before items)
  //   OR frontmatter YAML (---) with pack_id: and lesson_id WITHOUT _v1.
  // Legacy_v1 packs (115 files): have ```yaml fence with pack_id: at the BOTTOM (manifest after items),
  //   and lesson_id ends in _v1.
  // Both have "**Pack ID:**" prose header.
  
  // Check for fenced YAML blocks (could be multiple - top manifest and/or bottom manifest)
  const fenceMatches = [...markdown.matchAll(/```ya?ml\r?\n([\s\S]*?)```/g)];
  
  // Look at the FIRST fenced YAML block (canonical manifest position)
  const firstFence = fenceMatches[0]?.[1];
  if (firstFence && /^pack_id:/m.test(firstFence)) {
    // Check if this is a legacy pack by looking at lesson_id in the first fence
    if (/lesson_id:\s*\S*_v1/.test(firstFence)) {
      return parseLegacyPack(markdown, filename);
    }
    return parseCanonicalPack(markdown, filename);
  }
  
  // Check the LAST fenced YAML block (legacy manifest position)
  const lastFence = fenceMatches[fenceMatches.length - 1]?.[1];
  if (lastFence && /^pack_id:/m.test(lastFence)) {
    if (/lesson_id:\s*\S*_v1/.test(lastFence)) {
      return parseLegacyPack(markdown, filename);
    }
    // Canonical pack with manifest only at bottom (unusual but possible)
    return parseCanonicalPack(markdown, filename);
  }
  
  // Check frontmatter YAML (---) - some canonical packs use this instead of fenced YAML
  const frontYaml = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  const frontContent = frontYaml?.[1];
  if (frontContent && /^pack_id:/m.test(frontContent)) {
    if (/lesson_id:\s*\S*_v1/.test(frontContent)) {
      return parseLegacyPack(markdown, filename);
    }
    return parseCanonicalPack(markdown, filename);
  }
  
  // Fallback: prose header "**Pack ID:**" — default to legacy (most common)
  if (/\*\*Pack ID:\*\*/i.test(markdown)) return parseLegacyPack(markdown, filename);
  
  throw new Error(`Unknown pack schema in ${filename}`);
}
