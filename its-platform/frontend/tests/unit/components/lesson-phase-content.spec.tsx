import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LessonPhase } from '@/core';
import { LessonPhaseContent, parseDialogueTurns, segmentPhaseContent } from '@/presentation/components/lesson-phase-content';

class MockUtterance {
  text: string;
  lang = '';
  rate = 1;
  onend: ((ev?: unknown) => void) | null = null;
  onerror: ((ev: { error: string }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function installSpeechSynthesisMock() {
  const queue: MockUtterance[] = [];
  const speak = vi.fn((utterance: MockUtterance) => {
    queue.push(utterance);
    // do not auto-end; tests can end manually
  });
  const cancel = vi.fn(() => {
    const pending = queue.splice(0, queue.length);
    for (const u of pending) u.onerror?.({ error: 'canceled' });
  });
  Object.defineProperty(window, 'speechSynthesis', { value: { speak, cancel }, configurable: true, writable: true });
  // @ts-expect-error test mock
  globalThis.SpeechSynthesisUtterance = MockUtterance;
  return {
    speak,
    cancel,
    endNext: () => {
      const u = queue.shift();
      u?.onend?.();
    },
    queue,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  // @ts-expect-error cleanup
  delete window.speechSynthesis;
  // @ts-expect-error cleanup
  delete globalThis.SpeechSynthesisUtterance;
});

const dialogueMarkdown = [
  '### Scenario',
  '',
  '> **Ana:** "Good morning. Can you help me?"',
  '>',
  '> **Bruno:** "Sure. Go ahead."',
  '>',
  '> **Ana:** "Thank you very much."',
].join('\n');

const glossaryMarkdown = [
  '### Glossário contrastivo (pt-BR ↔ en-US)',
  '',
  '| Inglês (en-US) | Português (pt-BR) | Nota |',
  '|---|---|---|',
  '| **Good morning** | bom dia | Saudação |',
  '| **Nice to meet you** | prazer | Contato |',
].join('\n');

function phase(markdown: string, n = 1): LessonPhase {
  return { phase: n, heading: 'Fase de teste', markdown };
}

describe('lesson phase content parser', () => {
  it('parses dialogue turns from blockquotes (>= 2 turns)', () => {
    const turns = parseDialogueTurns(dialogueMarkdown);
    expect(turns).not.toBeNull();
    expect(turns?.map((t) => [t.speaker, t.text])).toEqual([
      ['Ana', 'Good morning. Can you help me?'],
      ['Bruno', 'Sure. Go ahead.'],
      ['Ana', 'Thank you very much.'],
    ]);
  });

  it('segments dialogue, EN-header glossary table, and common markdown', () => {
    const md = [dialogueMarkdown, '', glossaryMarkdown, '', 'A common paragraph with **bold** text.'].join('\n');
    const segments = segmentPhaseContent(md);
    const types = segments.map((s) => s.type);

    expect(types).toContain('dialogue');
    expect(types).toContain('table');
    expect(types).toContain('markdown');
    expect(types.indexOf('dialogue')).toBeLessThan(types.indexOf('table'));
    expect(types.indexOf('table')).toBeLessThan(types.lastIndexOf('markdown'));

    const dialogue = segments.find((s): s is Extract<typeof segments[number], { type: 'dialogue' }> => s.type === 'dialogue');
    const table = segments.find((s): s is Extract<typeof segments[number], { type: 'table' }> => s.type === 'table');
    expect(dialogue?.turns).toHaveLength(3);
    expect(table?.table.header[0]).toContain('Inglês');
    expect(table?.table.rows[0]?.[0]).toContain('Good morning');
    expect(table?.table.speakColumnIndex).toBe(0);
  });
});

describe('LessonPhaseContent component', () => {
  it('renders dialogue with per-line controls, sequential play, highlights and speed toggle', async () => {
    const mock = installSpeechSynthesisMock();
    render(<LessonPhaseContent phase={phase(dialogueMarkdown)} />);

    expect(screen.getByTestId('lesson-dialogue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ouvir diálogo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1.0x' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: '0.75x' }));
    expect(screen.getByRole('button', { name: '0.75x' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Ouvir diálogo' }));
    expect(mock.speak).toHaveBeenCalledTimes(1);
    let items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('data-active', 'true');

    // finish first utterance -> moves to second
    await act(async () => {
      mock.endNext();
    });
    expect(mock.speak).toHaveBeenCalledTimes(2);
    items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('data-active', 'false');
    expect(items[1]).toHaveAttribute('data-active', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Parar diálogo' }));
    expect(mock.cancel).toHaveBeenCalled();
  });

  it('renders glossary table with inline speak buttons for English column', () => {
    installSpeechSynthesisMock();
    render(<LessonPhaseContent phase={phase(glossaryMarkdown)} />);

    expect(screen.getByTestId('lesson-glossary-table')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: /Ouvir termo|Parar/ });
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    // table content still rendered
    expect(screen.getByText(/bom dia/)).toBeInTheDocument();
  });
});
