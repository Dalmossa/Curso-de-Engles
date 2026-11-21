'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LessonPhase } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import type { SpeechSynthesisResult } from '@/core';
import { Markdown } from './markdown';
import { InlineSpeakButton, cleanSpeechText, speakText, type SpeakRate } from './inline-speak-button';
import { cn } from '@/shared/utils/cn';

export type SynthesizeAction = (input: {
  text: string;
  voice?: string;
  rate?: 1 | 0.75;
}) => Promise<ActionResult<SpeechSynthesisResult>>;

export interface DialogueTurn {
  readonly speaker: string;
  readonly text: string;
  readonly raw: string;
}

export interface DialogueSegment {
  readonly type: 'dialogue';
  readonly turns: readonly DialogueTurn[];
}

export interface InteractiveTable {
  readonly header: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly speakColumnIndex: number;
}

export interface TableSegment {
  readonly type: 'table';
  readonly table: InteractiveTable;
}

export interface MarkdownSegment {
  readonly type: 'markdown';
  readonly markdown: string;
}

export type PhaseSegment = DialogueSegment | TableSegment | MarkdownSegment;

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

function stripMdInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~]+/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim();
  const withoutEdges = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return withoutEdges.split('|').map((cell) => cell.trim());
}

function isSeparatorRow(cells: readonly string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')));
}

function isTableLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.includes('|');
}

function detectSpeakColumn(header: readonly string[]): number {
  for (let i = 0; i < header.length; i++) {
    const h = stripMdInline(header[i] ?? '').toLowerCase();
    if (h.includes('inglês') || h.includes('ingles') || h.includes('english') || h.includes('en-us') || h.includes('en-gb')) {
      return i;
    }
  }
  return -1;
}

export function parseInteractiveTable(lines: readonly string[], start: number): { segment: TableSegment; end: number } | null {
  if (start >= lines.length) return null;
  const first = lines[start] ?? '';
  const second = lines[start + 1] ?? '';
  if (!isTableLine(first) || !isTableLine(second)) return null;
  const header = splitTableRow(first);
  const sep = splitTableRow(second);
  if (!isSeparatorRow(sep)) return null;

  let end = start + 2;
  const rows: string[][] = [];
  while (end < lines.length) {
    const line = lines[end] ?? '';
    if (!isTableLine(line)) break;
    const cells = splitTableRow(line);
    if (isSeparatorRow(cells)) {
      end++;
      continue;
    }
    const normalized = header.map((_, i) => cells[i] ?? '');
    rows.push(normalized);
    end++;
  }

  if (rows.length === 0) return null;
  const speakColumnIndex = detectSpeakColumn(header);
  if (speakColumnIndex < 0) return null;

  return {
    segment: {
      type: 'table',
      table: { header, rows, speakColumnIndex },
    },
    end,
  };
}

function parseBlockquoteBlock(lines: readonly string[], start: number): { lines: string[]; end: number } {
  const collected: string[] = [];
  let end = start;
  while (end < lines.length) {
    const line = lines[end] ?? '';
    if (/^\s*>/.test(line)) {
      collected.push(line.replace(/^\s*>\s?/, ''));
      end++;
      continue;
    }
    if (line.trim() === '' && end + 1 < lines.length && /^\s*>/.test(lines[end + 1] ?? '')) {
      collected.push('');
      end++;
      continue;
    }
    break;
  }
  return { lines: collected, end };
}

function parseSpeakerTurn(line: string): DialogueTurn | null {
  const raw = line.trim();
  if (!raw) return null;

  // Accept: **Speaker:** text | **Speaker**: text | **Speaker (role):** text (colon inside or outside bold)
  let speaker: string | null = null;
  let textPart: string | null = null;
  const bold = raw.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (bold) {
    speaker = stripMdInline(bold[1] ?? '').replace(/:\s*$/, '').trim();
    textPart = (bold[2] ?? '').replace(/^:\s*/, '').trim();
  } else {
    const plain = raw.match(/^([A-Za-zÀ-ÿ][^:]{0,40}?):\s+(.+)$/);
    if (plain) {
      speaker = stripMdInline(plain[1] ?? '').trim();
      textPart = (plain[2] ?? '').trim();
    }
  }

  if (!speaker || !textPart) return null;

  let text = textPart.replace(/^["“”']+/, '').replace(/["“”']+$/, '').trim();
  const cleaned = cleanSpeechText(text);
  if (!cleaned) return null;
  // Normalize speaker display a bit (remove trailing colon leftovers)
  const normalizedSpeaker = speaker.replace(/:\s*$/, '').trim();
  if (!normalizedSpeaker) return null;
  return { speaker: normalizedSpeaker, text: cleaned, raw };
}

export function extractDialogueTurnsFromBlock(blockLines: readonly string[]): readonly DialogueTurn[] | null {
  const turns: DialogueTurn[] = [];
  for (const bline of blockLines) {
    const t = bline.trim();
    if (!t) continue;
    const turn = parseSpeakerTurn(t);
    if (turn) turns.push(turn);
  }
  return turns.length >= 2 ? turns : null;
}

export function parseDialogueTurns(markdown: string): readonly DialogueTurn[] | null {
  const lines = normalizeLineEndings(markdown).split('\n');
  const all: DialogueTurn[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (/^\s*>/.test(line)) {
      const block = parseBlockquoteBlock(lines, i);
      const turns = extractDialogueTurnsFromBlock(block.lines);
      if (turns) all.push(...turns);
      i = block.end;
      continue;
    }
    i++;
  }

  return all.length >= 2 ? all : null;
}

export function segmentPhaseContent(markdown: string): readonly PhaseSegment[] {
  const normalized = normalizeLineEndings(markdown);
  const lines = normalized.split('\n');
  const segments: PhaseSegment[] = [];
  let buffer: string[] = [];

  const flushBuffer = () => {
    const joined = buffer.join('\n');
    if (joined.trim()) segments.push({ type: 'markdown', markdown: joined });
    buffer = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (/^\s*>/.test(line)) {
      const block = parseBlockquoteBlock(lines, i);
      const turns = extractDialogueTurnsFromBlock(block.lines);
      if (turns && turns.length >= 2) {
        flushBuffer();
        segments.push({ type: 'dialogue', turns });
      } else {
        buffer.push(...lines.slice(i, block.end));
      }
      i = block.end;
      continue;
    }

    if (isTableLine(line)) {
      const table = parseInteractiveTable(lines, i);
      if (table) {
        flushBuffer();
        segments.push(table.segment);
        i = table.end;
        continue;
      }
      while (i < lines.length && isTableLine(lines[i] ?? '')) {
        buffer.push(lines[i] ?? '');
        i++;
      }
      continue;
    }

    buffer.push(line);
    i++;
  }

  flushBuffer();
  return segments.length > 0 ? segments : [{ type: 'markdown', markdown }];
}

function DialoguePlayer({
  turns,
  synthesizeAction,
}: {
  readonly turns: readonly DialogueTurn[];
  readonly synthesizeAction?: SynthesizeAction;
}) {
  const [rate, setRate] = useState<SpeakRate>(1);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);
  const runIdRef = useRef(0);

  const stopPlayback = useCallback(() => {
    runIdRef.current += 1;
    cancelRef.current?.();
    cancelRef.current = null;
    setActiveLineIndex(null);
    setPlayingAll(false);
  }, []);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const playIndex = useCallback(
    async (index: number, options?: { asSequence?: boolean }) => {
      // stop any current playback first
      runIdRef.current += 1;
      cancelRef.current?.();
      cancelRef.current = null;
      const myRun = runIdRef.current;
      const turn = turns[index];
      if (!turn) return;

      setActiveLineIndex(index);
      setPlayingAll(Boolean(options?.asSequence));

      const handle = speakText(turn.text, { rate, synthesizeAction });
      cancelRef.current = () => handle.stop();
      try {
        await handle.done;
      } catch {
        // aborted or failed: state reset below if still current run
      } finally {
        if (runIdRef.current === myRun) {
          cancelRef.current = null;
          setActiveLineIndex(null);
          if (!options?.asSequence) setPlayingAll(false);
        }
      }
    },
    [rate, synthesizeAction, turns],
  );

  const playSequence = useCallback(async () => {
    // cancel current
    runIdRef.current += 1;
    cancelRef.current?.();
    cancelRef.current = null;
    const myRun = runIdRef.current;
    setPlayingAll(true);
    try {
      for (let idx = 0; idx < turns.length; idx++) {
        if (runIdRef.current !== myRun) break;
        const turn = turns[idx];
        if (!turn) continue;
        setActiveLineIndex(idx);
        const handle = speakText(turn.text, { rate, synthesizeAction });
        cancelRef.current = () => handle.stop();
        try {
          await handle.done;
        } catch {
          break;
        }
      }
    } finally {
      if (runIdRef.current === myRun) {
        cancelRef.current = null;
        setActiveLineIndex(null);
        setPlayingAll(false);
      }
    }
  }, [rate, synthesizeAction, turns]);

  const handleLineClick = useCallback(
    (index: number) => {
      if (activeLineIndex === index && !playingAll) {
        stopPlayback();
        return;
      }
      if (activeLineIndex === index && playingAll) {
        // clicking active line during sequence stops everything
        stopPlayback();
        return;
      }
      void playIndex(index, { asSequence: false });
    },
    [activeLineIndex, playIndex, playingAll, stopPlayback],
  );

  return (
    <div className="my-4 rounded-lg border border-border-subtle bg-surface-sunken p-4" data-testid="lesson-dialogue">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={playingAll ? stopPlayback : () => void playSequence()}
          className={cn(
            'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
            playingAll
              ? 'border-brand-500 bg-brand-100 text-brand-700'
              : 'border-border-subtle bg-surface text-ink-800 hover:bg-surface-raised',
          )}
          aria-label={playingAll ? 'Parar diálogo' : 'Ouvir diálogo'}
        >
          <span aria-hidden="true">{playingAll ? '■' : '▶'}</span>
          {playingAll ? 'Parar diálogo' : 'Ouvir diálogo'}
        </button>
        <div className="ml-auto flex items-center gap-1 text-sm">
          <span className="text-ink-600">Velocidade</span>
          <button
            type="button"
            onClick={() => setRate(1)}
            className={cn(
              'rounded border px-2 py-1 text-xs',
              rate === 1 ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-border-subtle text-ink-700',
            )}
            aria-pressed={rate === 1}
          >
            1.0x
          </button>
          <button
            type="button"
            onClick={() => setRate(0.75)}
            className={cn(
              'rounded border px-2 py-1 text-xs',
              rate === 0.75 ? 'border-brand-500 bg-brand-100 text-brand-700' : 'border-border-subtle text-ink-700',
            )}
            aria-pressed={rate === 0.75}
          >
            0.75x
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {turns.map((turn, index) => {
          const active = activeLineIndex === index;
          const linePlaying = active;
          return (
            <li
              key={`${turn.speaker}-${index}`}
              className={cn(
                'flex items-start gap-3 rounded-md border px-3 py-2 transition-colors',
                active ? 'border-brand-400 bg-brand-50' : 'border-transparent',
              )}
              data-active={active ? 'true' : 'false'}
              data-speaker={turn.speaker}
            >
              <button
                type="button"
                onClick={() => handleLineClick(index)}
                aria-label={linePlaying ? `Parar fala de ${turn.speaker}` : `Ouvir fala de ${turn.speaker}`}
                aria-pressed={linePlaying}
                title={linePlaying ? `Parar fala de ${turn.speaker}` : `Ouvir fala de ${turn.speaker}`}
                className={cn(
                  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                  linePlaying
                    ? 'border-brand-500 bg-brand-100 text-brand-700'
                    : 'border-border-subtle bg-surface text-ink-700 hover:bg-surface-sunken',
                )}
              >
                <span aria-hidden="true">{linePlaying ? '■' : '🔊'}</span>
              </button>
              <div className="min-w-0">
                <p className={cn('text-sm font-semibold', active ? 'text-brand-800' : 'text-ink-900')}>{turn.speaker}</p>
                <p className={cn('text-sm', active ? 'text-brand-900' : 'text-ink-800')}>{turn.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InteractiveTableView({
  table,
  synthesizeAction,
}: {
  readonly table: InteractiveTable;
  readonly synthesizeAction?: SynthesizeAction;
}) {
  const [rate] = useState<SpeakRate>(1);
  return (
    <div className="my-4 overflow-x-auto" data-testid="lesson-glossary-table">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-border-subtle bg-surface-sunken px-2 py-2 text-left font-semibold text-ink-900 w-10">
              <span className="sr-only">Ouvir</span>
            </th>
            {table.header.map((cell, i) => (
              <th key={i} className="border border-border-subtle bg-surface-sunken px-3 py-2 text-left font-semibold text-ink-900">
                <Markdown>{cell}</Markdown>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => {
            const speakTextValue = cleanSpeechText(stripMdInline(row[table.speakColumnIndex] ?? ''));
            return (
              <tr key={r} className="align-top">
                <td className="border border-border-subtle px-2 py-2">
                  {speakTextValue ? (
                    <InlineSpeakButton
                      text={speakTextValue}
                      synthesizeAction={synthesizeAction}
                      rate={rate}
                      label="Ouvir termo"
                      stopLabel="Parar"
                    />
                  ) : null}
                </td>
                {table.header.map((_, c) => (
                  <td key={c} className="border border-border-subtle px-3 py-2 text-ink-800">
                    <Markdown>{row[c] ?? ''}</Markdown>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function LessonPhaseContent({
  phase,
  synthesizeAction,
}: {
  readonly phase: LessonPhase;
  readonly synthesizeAction?: SynthesizeAction;
}) {
  const segments = useMemo(() => segmentPhaseContent(phase.markdown), [phase.markdown]);

  return (
    <div className="flex flex-col gap-4" data-testid={`lesson-phase-content-${phase.phase}`}>
      {segments.map((segment, index) => {
        if (segment.type === 'dialogue') {
          return <DialoguePlayer key={index} turns={segment.turns} synthesizeAction={synthesizeAction} />;
        }
        if (segment.type === 'table') {
          return <InteractiveTableView key={index} table={segment.table} synthesizeAction={synthesizeAction} />;
        }
        return <Markdown key={index}>{segment.markdown}</Markdown>;
      })}
    </div>
  );
}
