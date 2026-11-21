import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InlineSpeakButton, clampSpeakRate, cleanSpeechText, speakText } from '@/presentation/components/inline-speak-button';

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
  const speak = vi.fn((utterance: MockUtterance) => {
    queueMicrotask(() => utterance.onend?.());
  });
  const cancel = vi.fn();
  const synth = { speak, cancel };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true, writable: true });
  // @ts-expect-error test mock
  globalThis.SpeechSynthesisUtterance = MockUtterance;
  return { speak, cancel, synth };
}

afterEach(() => {
  vi.restoreAllMocks();
  // cleanup speechSynthesis mock to avoid leaking between tests
  // @ts-expect-error test cleanup
  delete window.speechSynthesis;
  // @ts-expect-error test cleanup
  delete globalThis.SpeechSynthesisUtterance;
});

describe('inline speak utilities', () => {
  it('cleans markdown and clamps rate', () => {
    expect(cleanSpeechText('**Hello** _world_ `code` [link](x)')).toBe('Hello world code link');
    expect(clampSpeakRate(1)).toBe(1);
    expect(clampSpeakRate(0.75)).toBe(0.75);
    expect(clampSpeakRate(0.8)).toBe(0.75);
    expect(clampSpeakRate(0.9)).toBe(1);
    expect(clampSpeakRate(0.5)).toBe(0.5);
    expect(clampSpeakRate(0.4)).toBe(0.5);
  });

  it('falls back to browser speechSynthesis when action returns no remote audio', async () => {
    const { speak, cancel } = installSpeechSynthesisMock();
    const action = vi.fn().mockResolvedValue({ ok: true, data: { engine: 'none', audio: null } });

    const handle = speakText('Hello there', { rate: 0.75, synthesizeAction: action });
    await handle.done;

    expect(action).toHaveBeenCalledWith({ text: 'Hello there', rate: 0.75 });
    expect(cancel).toHaveBeenCalled();
    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0]?.[0] as MockUtterance;
    expect(utterance.text).toBe('Hello there');
    expect(utterance.lang).toBe('en-US');
    expect(utterance.rate).toBe(0.75);
  });

  it('requests 0.75 synthesis for 0.5x target and plays browser speech at 0.5', async () => {
    const { speak } = installSpeechSynthesisMock();
    const action = vi.fn().mockResolvedValue({ ok: true, data: { engine: 'none', audio: null } });

    const handle = speakText('Slow please', { rate: 0.5, synthesizeAction: action });
    await handle.done;

    expect(action).toHaveBeenCalledWith({ text: 'Slow please', rate: 0.75 });
    expect(speak).toHaveBeenCalledTimes(1);
    const utterance = speak.mock.calls[0]?.[0] as MockUtterance;
    expect(utterance.rate).toBe(0.5);
  });

  it('stops browser speech on cancel', async () => {
    const cancel = vi.fn();
    const speak = vi.fn(() => {
      // never ends by itself
    });
    Object.defineProperty(window, 'speechSynthesis', { value: { speak, cancel }, configurable: true, writable: true });
    // @ts-expect-error test mock
    globalThis.SpeechSynthesisUtterance = MockUtterance;

    const handle = speakText('A longer phrase to speak', { rate: 1 });
    handle.stop();
    await expect(handle.done).rejects.toMatchObject({ name: 'AbortError' });
    expect(cancel).toHaveBeenCalled();
  });
});

describe('InlineSpeakButton', () => {
  it('renders, toggles playing state, and is accessible', async () => {
    installSpeechSynthesisMock();
    render(<InlineSpeakButton text="Hello world from test" label="Ouvir" stopLabel="Parar" />);

    const button = screen.getByRole('button', { name: 'Ouvir' });
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });

    // after utterance ends (mock ends immediately) it should return to idle
    expect(screen.getByRole('button', { name: 'Ouvir' })).toBeInTheDocument();
  });

  it('is disabled when text is empty after cleaning', () => {
    render(<InlineSpeakButton text="** **" label="Ouvir" />);
    expect(screen.getByRole('button', { name: 'Ouvir' })).toBeDisabled();
  });
});
