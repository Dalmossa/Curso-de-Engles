'use client';

import { useMemo } from 'react';
import type { LessonPhase } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import type { SpeechSynthesisResult } from '@/core';
import { Markdown } from './markdown';
import { InlineSpeakButton, cleanSpeechText } from './inline-speak-button';
import { cn } from '@/shared/utils/cn';
import { readStoredSpeakRate, type SpeakRate } from '@/shared/speak-rate';
import { useDialogueAudioController, formatTime, type DialogueSynthesizeAction } from '@/presentation/hooks/use-dialogue-audio-controller';
import { resolveDialogueClipUrl } from '@/shared/dialogue-audio';
/* Listen-and-repeat scrolls/focuses the existing pronunciation practice panel in the lesson page. */

export type SynthesizeAction = (input: {
  text: string;
  voice?: string;
  rate?: 1 | 0.75 | 0.5;
}) => Promise<ActionResult<SpeechSynthesisResult>>;

export interface DialogueTurn {
  readonly speaker: string;
  readonly text: string;
  readonly raw: string;
  /** Optional pre-rendered clip URL; when absent, resolved from static lookup. */
  readonly audioUrl?: string | null;
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

function speakerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

function speakerToneClass(index: number): string {
  const tones = [
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-sky-100 text-sky-800 border-sky-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-rose-100 text-rose-800 border-rose-200',
  ];
  return tones[index % tones.length]!;
}

function DialogueAudioPlayer({
  controller,
}: {
  readonly controller: ReturnType<typeof useDialogueAudioController>;
}) {
  const total = controller.duration > 0 ? controller.duration : 0;
  const current = Math.min(controller.currentTime, total || controller.currentTime);
  const progress = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  const canSeek = controller.canSeek && total > 0;
  const playPauseLabel = controller.isPlaying ? 'Pausar diálogo' : 'Reproduzir diálogo';

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-raised p-4 shadow-sm" aria-label="Player de áudio do diálogo">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void controller.restart()}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border-subtle bg-surface px-3 text-sm text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          aria-label="Reiniciar diálogo"
          title="Reiniciar"
        >
          <span aria-hidden="true">↺</span>
        </button>
        <button
          type="button"
          onClick={() => void controller.togglePlayPause()}
          className={cn(
            'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
            controller.isPlaying
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-teal-500 text-white hover:bg-teal-600',
          )}
          aria-label={playPauseLabel}
          aria-pressed={controller.isPlaying}
          title={controller.isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          <span aria-hidden="true" className="text-base">{controller.isPlaying ? '❚❚' : '▶'}</span>
        </button>

        <div className="ml-auto flex items-center gap-1 text-sm" role="group" aria-label="Velocidade de reprodução">
          {([1, 0.75, 0.5] as const).map((r) => {
            const active = controller.rate === r;
            const label = r === 1 ? '1x' : r === 0.75 ? '0.75x' : '0.5x';
            return (
              <button
                key={r}
                type="button"
                onClick={() => controller.setRate(r)}
                className={cn(
                  'min-h-11 rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                  active
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-border-subtle bg-surface text-ink-700 hover:bg-surface-sunken',
                )}
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="w-10 shrink-0 text-xs tabular-nums text-ink-600" aria-label="Tempo atual">
          {formatTime(current)}
        </span>
        <div className="relative h-11 grow">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-border-subtle" aria-hidden="true">
            <div className="h-full rounded-full bg-teal-500 transition-[width] duration-100 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={total > 0 ? total : 1}
            step={0.1}
            value={total > 0 ? current : 0}
            disabled={!canSeek}
            onChange={(e) => controller.seek(Number(e.target.value))}
            className="absolute inset-0 h-11 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-teal-600"
            aria-label="Posição do áudio do diálogo"
            aria-valuetext={`${formatTime(current)} de ${formatTime(total)}`}
          />
        </div>
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-ink-600" aria-label="Tempo total">
          {total > 0 ? formatTime(total) : '—:—'}
        </span>
      </div>

      {!canSeek && controller.supportsTimeline === false && controller.isPlaying ? (
        <p className="mt-2 text-xs text-ink-600">Linha do tempo indisponível na síntese do navegador.</p>
      ) : null}
      {controller.error ? (
        <p className="mt-2 text-xs text-amber-700" role="status">Não foi possível reproduzir o áudio agora.</p>
      ) : null}
    </div>
  );
}

/* Evaluate action kept in props for compatibility; Listen-and-repeat scrolls to existing practice panel. */

function ListenRepeatCard({
  targetText,
  controller,
}: {
  readonly targetText: string | null;
  readonly controller: ReturnType<typeof useDialogueAudioController>;
}) {
  if (!targetText) return null;

  const handleRecordClick = () => {
    const target = document.getElementById('lesson-pronunciation-practice');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const focusable = target.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus({ preventScroll: true });
    }
  };

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-raised p-4 sm:p-5" aria-labelledby="listen-repeat-heading">
      <h3 id="listen-repeat-heading" className="text-base font-semibold text-ink-900">Listen and repeat</h3>
      <p className="mt-1 text-sm text-ink-600">Ouça e repita a frase para praticar sua pronúncia</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void controller.playSlow(targetText)}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Ouvir frase lenta
        </button>
        <button
          type="button"
          onClick={handleRecordClick}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Gravar minha voz
        </button>
      </div>
    </section>
  );
}

function DialogueSection({
  turns,
  synthesizeAction,
}: {
  readonly turns: readonly DialogueTurn[];
  readonly synthesizeAction?: SynthesizeAction;
}) {
  const resolvedTurns = useMemo(
    () => turns.map((t) => ({ ...t, audioUrl: t.audioUrl ?? resolveDialogueClipUrl(t.speaker, t.text) })),
    [turns],
  );
  const controller = useDialogueAudioController({ turns: resolvedTurns, synthesizeAction: synthesizeAction as DialogueSynthesizeAction | undefined });
  const speakers = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of turns) {
      if (!map.has(t.speaker)) map.set(t.speaker, map.size);
    }
    return map;
  }, [turns]);

  const targetText = turns[0]?.text ?? null;

  return (
    <div className="my-4 flex flex-col gap-4" data-testid="lesson-dialogue">
      <DialogueAudioPlayer controller={controller} />

      <ul className="flex flex-col gap-3" aria-label="Transcrição do diálogo">
        {turns.map((turn, index) => {
          const active = controller.activeIndex === index;
          const linePlaying = active && controller.isPlaying;
          const speakerIndex = speakers.get(turn.speaker) ?? 0;
          const first = index === 0;
          return (
            <li
              key={`${turn.speaker}-${index}`}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors sm:px-4',
                active ? 'border-teal-300 bg-teal-50/70' : 'border-border-subtle bg-surface-raised',
                first && !active ? 'bg-surface-sunken/60' : null,
              )}
              data-active={active ? 'true' : 'false'}
              data-speaker={turn.speaker}
            >
              <div
                className={cn(
                  'mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                  speakerToneClass(speakerIndex),
                )}
                aria-hidden="true"
                title={turn.speaker}
              >
                {speakerInitials(turn.speaker)}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-semibold', active ? 'text-teal-900' : 'text-ink-900')}>{turn.speaker}</p>
                <p className={cn('mt-0.5 text-sm leading-relaxed', active ? 'text-teal-950' : 'text-ink-800')}>{turn.text}</p>
              </div>
              <InlineSpeakButton
                text={turn.text}
                synthesizeAction={synthesizeAction}
                rate={controller.rate}
                label={`Ouvir fala de ${turn.speaker}`}
                stopLabel={`Parar fala de ${turn.speaker}`}
                active={active}
                controlledPlaying={linePlaying}
                onControlledToggle={() => void controller.toggleTurn(index)}
              />
            </li>
          );
        })}
      </ul>

      <ListenRepeatCard targetText={targetText} controller={controller} />
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
  const rate: SpeakRate = readStoredSpeakRate();
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
          return <DialogueSection key={index} turns={segment.turns} synthesizeAction={synthesizeAction} />;
        }
        if (segment.type === 'table') {
          return <InteractiveTableView key={index} table={segment.table} synthesizeAction={synthesizeAction} />;
        }
        return <Markdown key={index}>{segment.markdown}</Markdown>;
      })}
    </div>
  );
}
