import type {
  ClipRecord,
  CorpusItemRecord,
  CorpusRecord,
  DialogueRecord,
  DialogueSpeakerRecord,
  ItemOptionRecord,
  SpeakerRecord,
  VoiceRecord,
} from './content-types.js';

/**
 * Reader for `corpus/listening-corpus.md` in the format that exists on disk
 * (ADR-022 §2). The corpus is a *dialogue* document, not a list of slots:
 *
 *   ## `dlg_a1_01_first_intro`
 *   **Setting:** …                       → `dialogues.title`
 *   **Voices:** Ana `v_a` (F), Ben `v_b` (M) → speakers + voice assignments
 *   **Transcript:** / **Transcript (Q-L9 anchor):**
 *   > **Ana:** Hi. I'm Ana Silva.        → `clips` (one clip per turn)
 *   ### L1-1 — `lst_gist_001` · gist · A1 · voice `v_a+v_b`
 *   **Status:** shipped                  → status leading token
 *   **What is this conversation mainly about?**
 *   | Slot | Value | Distractor type |     → `item_options`
 *
 * There is no `listening_slots` table (ADR-022 §1); the slots become `items` with
 * `dialogue_id` + `slot_number`, and the transcript becomes `clips`.
 *
 * Duration is **derived**, never asserted: transcript words ÷ 150 wpm, rounded
 * (ADR-022 §2/§3). The `CHECK (duration_seconds BETWEEN 45 AND 120)` is the gate;
 * Q-L2 is enforced by letting the DDL reject an out-of-range dialogue.
 */

const LETTERS = 'ABCDEF';

// The DDL's `CHECK (is_key OR note IS NOT NULL)` forbids a NULL distractor note and
// the loader may not invent a rationale; this is the honest placeholder (ADR-022 §3).
const NO_RATIONALE = 'no distractor rationale recorded (legacy_v1)';

const DISTRACTOR_TYPES = new Set([
  'l1_transfer',
  'overgeneralization',
  'semantic_plausible',
  'form_alternative',
  'register_mismatch',
  'negative_control',
]);

/** The `items.listening_kind` CHECK vocabulary (ADR-019). */
const LISTENING_KINDS = new Set([
  'lst_gist',
  'lst_detail',
  'lst_inference',
  'lst_lexical',
  'lst_pragmatic',
  'lst_pron_minpair',
]);

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** CEFR from the dialogue id prefix (`dlg_a1_…` → `A1`). */
function cefrFromId(dialogueId: string): string {
  const m = dialogueId.match(/dlg_([ab][12])_/i);
  return m && m[1] ? m[1].toUpperCase() : 'A1';
}

/** `lst_prn_*` collapses onto the DDL's single minimal-pair kind (ADR-019). */
function listeningKind(itemId: string): string | null {
  if (itemId.startsWith('lst_prn_')) return 'lst_pron_minpair';
  const m = itemId.match(/^(lst_[a-z]+)_/);
  const base = m && m[1] ? m[1] : '';
  return LISTENING_KINDS.has(base) ? base : null;
}

interface ParsedOption {
  letter: string;
  text: string;
  isKey: boolean;
  note: string | null;
}

/** Parse the `| Slot | Value | … |` option table of a slot block. */
function parseSlotTable(block: string): ParsedOption[] {
  const headerIdx = block.search(/^\|\s*Slot\s*\|\s*Value\s*\|/m);
  if (headerIdx === -1) return [];
  const tableText = block.slice(headerIdx);
  const rows = tableText.split(/\r?\n/);
  const options: ParsedOption[] = [];
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    if (raw === undefined) continue;
    const line = raw.trim();
    if (!line.startsWith('|')) {
      if (i > 0 && line !== '') break;
      continue;
    }
    const cells = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(c => c.trim());
    if (cells.length < 2) continue;
    const letter = (cells[0] ?? '').replace(/\*/g, '').trim();
    if (letter.length !== 1 || !LETTERS.includes(letter)) continue;
    const rawValue = cells[1] ?? '';
    const rawNote = (cells[2] ?? '').trim();
    // ADR-027 §3a: the key marker `✓` has two generations in `corpus/listening-corpus.md` —
    // 76 rows put it in the value column (`| C | … ✓ |`), 11 put `✓ —` in the trailing column
    // (`| C | … | ✓ — |`), where the type would otherwise sit. Reading only the value column
    // loaded those 11 shipped slots with `items.key = NULL` and every option `is_key = false`,
    // i.e. unscorable. `verify-integrity.py` [9]/[11d]/[11e] glob `packs/`, so nothing saw it.
    const isKey = rawValue.includes('✓') || rawNote.includes('✓');
    const text = rawValue.replace(/✓/g, '').trim();
    const note = /^[✓—\s]*$/.test(rawNote) ? null : rawNote;
    options.push({ letter, text, isKey, note });
  }
  return options;
}

/**
 * The item's question: the first bold span ending in `?`, else the first bold span
 * that is not a known metadata label, else the item id.
 */
function extractStem(block: string, itemId: string): string {
  const tableIdx = block.search(/^\|\s*Slot\s*\|\s*Value\s*\|/m);
  const scope = tableIdx === -1 ? block : block.slice(0, tableIdx);
  const labels = /^(status|gated on|interference|feedback|target|recorded honestly|provenance|reuse basis|voices|setting|spec|authoring date)/i;

  let fallback: string | null = null;
  for (const line of scope.split(/\r?\n/)) {
    for (const m of line.matchAll(/\*\*([^*]+)\*\*/g)) {
      const text = (m[1] ?? '').trim();
      if (text === '' || labels.test(text)) continue;
      if (text.endsWith('?')) return text;
      if (fallback === null) fallback = text;
    }
  }
  return fallback ?? itemId;
}

interface RawSlot {
  tier: 'L1' | 'L2';
  itemId: string;
  status: string;
  body: string;
}

interface RawDialogue {
  id: string;
  setting: string;
  voicesLine: string;
  transcript: string;
  slots: RawSlot[];
}

/** Split the corpus into per-dialogue raw blocks at `## \`dlg_…\`` boundaries. */
function splitDialogues(markdown: string): RawDialogue[] {
  const lines = markdown.split(/\r?\n/);
  const starts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && /^##\s+`dlg_[a-z0-9_]+`/.test(line)) starts.push(i);
  }
  const out: RawDialogue[] = [];
  for (let s = 0; s < starts.length; s++) {
    const start = starts[s] ?? 0;
    const end = starts[s + 1] ?? lines.length;
    const block = lines.slice(start, end);
    const header = block[0] ?? '';
    const idMatch = header.match(/dlg_[a-z0-9_]+/);
    if (!idMatch) continue;
    const id = idMatch[0];
    const bodyText = block.join('\n');

    const settingMatch = bodyText.match(/\*\*Setting:\*\*\s*(.+)$/m);
    const voicesMatch = bodyText.match(/\*\*Voices:\*\*\s*(.+)$/m);

    // Transcript: everything after the `**Transcript…:**` header up to the first
    // horizontal rule (the slot region begins there).
    let transcript = '';
    const tIdx = block.findIndex(l => l !== undefined && /\*\*Transcript[^*]*:\*\*/.test(l));
    if (tIdx !== -1) {
      const turns: string[] = [];
      for (let j = tIdx + 1; j < block.length; j++) {
        const l = block[j];
        if (l === undefined) continue;
        if (/^---\s*$/.test(l)) break;
        if (/^###\s+/.test(l)) break;
        if (l.startsWith('>')) turns.push(l);
      }
      transcript = turns.join('\n');
    }

    const slots: RawSlot[] = [];
    for (let j = 0; j < block.length; j++) {
      const l = block[j];
      if (l === undefined) continue;
      const slot = l.match(/^###\s+(L[12])-\d+\s+—\s+`(lst_[a-z0-9_]+)`/);
      if (!slot || !slot[1] || !slot[2]) continue;
      let slotEnd = block.length;
      for (let k = j + 1; k < block.length; k++) {
        const l2 = block[k];
        if (l2 !== undefined && (/^###\s+/.test(l2) || /^##(?!#)/.test(l2))) {
          slotEnd = k;
          break;
        }
      }
      const slotBody = block.slice(j, slotEnd).join('\n');
      const statusMatch = slotBody.match(/\*\*Status:\*\*\s*([A-Za-z-]+)/);
      slots.push({
        tier: slot[1] === 'L2' ? 'L2' : 'L1',
        itemId: slot[2],
        status: statusMatch && statusMatch[1] ? statusMatch[1].toLowerCase() : 'shipped',
        body: slotBody,
      });
    }

    out.push({
      id,
      setting: settingMatch && settingMatch[1] ? settingMatch[1].trim() : id,
      voicesLine: voicesMatch && voicesMatch[1] ? voicesMatch[1] : '',
      transcript,
      slots,
    });
  }
  return out;
}

/** Turn transcript blockquote lines into clips, joining continuation lines. */
function parseClips(
  dialogueId: string,
  transcript: string,
  speakerFor: (name: string) => string | null,
  speakerNames: Map<string, { speaker_id: string; display_name: string; gender: string | null; voice_id: string }>,
): ClipRecord[] {
  interface Turn {
    name: string | null;
    text: string;
  }
  const turns: Turn[] = [];
  for (const raw of transcript.split(/\r?\n/)) {
    const line = raw.replace(/^>\s?/, '').trim();
    if (line === '') continue;
    const nameMatch = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    if (nameMatch && nameMatch[1] !== undefined) {
      turns.push({ name: nameMatch[1].trim(), text: (nameMatch[2] ?? '').trim() });
      continue;
    }
    const last = turns[turns.length - 1];
    if (last) last.text = last.text === '' ? line : `${last.text} ${line}`;
  }

  const clips: ClipRecord[] = [];
  let index = 0;
  for (const turn of turns) {
    const speakerId = turn.name ? speakerFor(turn.name) : null;
    const known = turn.name ? speakerNames.get(turn.name) : undefined;
    if (!speakerId || !known) continue;
    index += 1;
    clips.push({
      id: `clp_${dialogueId}_${index}`,
      dialogue_id: dialogueId,
      speaker_id: speakerId,
      sort_index: index,
      utterance_text: turn.text,
    });
  }
  return clips;
}

/** Transcript-only word count + §8.1 duration model (150 wpm), ADR-022 §3. */
export function transcriptDuration(transcript: string): number {
  // §8.1's "Words" is what the §8.5 script computes: the `> **Name:** text` lines
  // have the marker stripped but the name label stays (the script's own
  // `re.sub(r'^>\s*\*\*…')` can no longer anchor after `lstrip('> ')`). Counting
  // it the same way is what makes this `dialogues.duration_seconds` agree with the
  // corpus's declared measurement instead of drifting ~1 s per turn below it.
  const words = transcript
    .split(/\r?\n/)
    .map(l => l.replace(/^>\s?/, ''))
    .join(' ')
    .match(/[A-Za-z'’\-]+/g);
  const n = words ? words.length : 0;
  return Math.round((n / 150) * 60);
}

function parseDialogue(raw: RawDialogue): { dialogue: DialogueRecord; skips: CorpusRecord['skips'] } {
  const cefr = cefrFromId(raw.id);

  // `**Voices:** Ana \`v_a\` (F), Ben \`v_b\` (M) · **Target duration:** …`
  const speakerEntries: Array<{
    display_name: string;
    speaker_id: string;
    gender: string | null;
    voice_id: string;
  }> = [];
  for (const m of raw.voicesLine.matchAll(/([A-Za-z][A-Za-z]*)\s*`(v_[a-z])`\s*\(([FM])\)/g)) {
    const name = m[1];
    const voice = m[2];
    const gender = m[3] ?? null;
    if (!name || !voice) continue;
    speakerEntries.push({
      display_name: name,
      speaker_id: `spk_${raw.id}_${slug(name)}`,
      gender,
      voice_id: voice,
    });
  }

  const nameToEntry = new Map(speakerEntries.map(e => [e.display_name, e]));
  const speakerFor = (name: string): string | null => nameToEntry.get(name)?.speaker_id ?? null;

  const clips = parseClips(raw.id, raw.transcript, speakerFor, nameToEntry);

  const dialogueSpeakers: DialogueSpeakerRecord[] = speakerEntries.map(e => ({
    speaker_id: e.speaker_id,
    display_name: e.display_name,
    gender: e.gender,
    voice_id: e.voice_id,
  }));

  const items: CorpusItemRecord[] = [];
  const skips: CorpusRecord['skips'] = [];
  let slotNumber = 0;
  for (const slot of raw.slots) {
    if (slot.status !== 'shipped') {
      skips.push({ ref_id: slot.itemId, reason: 'slot_status_not_shipped' });
      continue;
    }
    slotNumber += 1;
    const rawOptions = parseSlotTable(slot.body);
    const keyOption = rawOptions.find(o => o.isKey) ?? null;
    const options: ItemOptionRecord[] = rawOptions.map(o => ({
      position: LETTERS.indexOf(o.letter) + 1,
      option_text: o.text,
      is_key: o.isKey,
      distractor_type:
        o.note && DISTRACTOR_TYPES.has(o.note.split(/[\s(]/)[0] ?? '')
          ? (o.note.split(/[\s(]/)[0] ?? null)
          : null,
      br_pt_form: null,
      note: o.isKey ? null : (o.note ?? NO_RATIONALE),
    }));

    const kind = listeningKind(slot.itemId);
    items.push({
      item_id: slot.itemId,
      dialogue_id: raw.id,
      slot_number: slotNumber,
      listening_kind: kind ?? 'lst_detail',
      listening_tier: slot.tier,
      stem: extractStem(slot.body, slot.itemId),
      key: keyOption ? keyOption.letter : null,
      p_random: options.length > 0 ? Math.round((1 / options.length) * 10000) / 10000 : 1.0,
      options,
      status: 'shipped',
    });
  }

  const duration = transcriptDuration(raw.transcript);

  return {
    dialogue: {
      id: raw.id,
      title: raw.setting,
      cefr_level: cefr,
      status: 'shipped',
      duration_seconds: duration,
      // ADR-027 §3b: the authored `> **Speaker:** …` block, verbatim. Stored because `clips`
      // are derived from it and keep neither the speaker's name nor the authored line breaks.
      transcript: raw.transcript,
      speakers: dialogueSpeakers,
      clips,
      items,
    },
    skips,
  };
}

export function parseListeningCorpus(markdown: string): CorpusRecord {
  const dialogues: DialogueRecord[] = [];
  const skips: CorpusRecord['skips'] = [];

  const speakerById = new Map<string, SpeakerRecord>();
  const speakers: SpeakerRecord[] = [];
  const voiceById = new Map<string, VoiceRecord>();
  const voices: VoiceRecord[] = [];

  for (const raw of splitDialogues(markdown)) {
    const { dialogue, skips: dialogueSkips } = parseDialogue(raw);
    dialogues.push(dialogue);
    skips.push(...dialogueSkips);

    for (const ds of dialogue.speakers) {
      if (speakerById.has(ds.speaker_id)) continue;
      const rec: SpeakerRecord = {
        id: ds.speaker_id,
        display_name: ds.display_name,
        gender: ds.gender,
      };
      speakerById.set(ds.speaker_id, rec);
      speakers.push(rec);
      if (!voiceById.has(ds.voice_id)) {
        const v: VoiceRecord = {
          id: ds.voice_id,
          label: ds.voice_id,
          accent: 'en-US',
          gender: ds.gender,
        };
        voiceById.set(ds.voice_id, v);
        voices.push(v);
      }
    }
  }

  return { dialogues, voices, speakers, skips };
}
