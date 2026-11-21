'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpeechSynthesisResult } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { cn } from '@/shared/utils/cn';

export type SpeakRate = 1 | 0.75;

export interface SpeakOptions {
  readonly rate: SpeakRate;
  readonly synthesizeAction?: (input: { text: string; rate?: 1 | 0.75 }) => Promise<ActionResult<SpeechSynthesisResult>>;
  readonly signal?: AbortSignal;
}

export interface SpeakHandle {
  stop: () => void;
  readonly done: Promise<void>;
}

export function clampSpeakRate(rate: number): SpeakRate {
  return rate <= 0.875 ? 0.75 : 1;
}

export function cleanSpeechText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function playRemoteAudio(base64: string, mimeType: string, rate: SpeakRate, signal?: AbortSignal): Promise<void> {
  if (typeof Audio === 'undefined') {
    throw new Error('audio-unavailable');
  }

  await new Promise<void>((resolve, reject) => {
    const audio = new Audio(`data:${mimeType};base64,${base64}`);
    audio.playbackRate = rate;
    let settled = false;

    const cleanup = () => {
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
      signal?.removeEventListener('abort', onAbort);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const onAbort = () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
      fail(new DOMException('Aborted', 'AbortError'));
    };

    audio.onended = finish;
    audio.onerror = () => fail(new Error('audio-error'));
    // Some browsers emit pause at end; treat as completion if ended.
    audio.onpause = () => {
      if (audio.ended) finish();
    };
    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) {
      onAbort();
      return;
    }

    void audio.play().catch(fail);
  });
}

async function playBrowserSpeech(text: string, rate: SpeakRate, signal?: AbortSignal): Promise<void> {
  if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') {
    throw new Error('speech-synthesis-unavailable');
  }

  await new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = clampSpeakRate(rate);
    let settled = false;

    const cleanup = () => {
      utterance.onend = null;
      utterance.onerror = null;
      signal?.removeEventListener('abort', onAbort);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const onAbort = () => {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      fail(new DOMException('Aborted', 'AbortError'));
    };

    utterance.onend = finish;
    utterance.onerror = (event) => {
      // 'canceled'/'interrupted' happen on cancel; treat as abort when requested.
      if (signal?.aborted || event.error === 'canceled' || event.error === 'interrupted') {
        fail(new DOMException('Aborted', 'AbortError'));
      } else {
        fail(new Error(event.error || 'speech-error'));
      }
    };

    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) {
      onAbort();
      return;
    }

    try {
      // Cancel any previous utterance in this synth to avoid overlap.
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      fail(error);
    }
  });
}

export function speakText(text: string, options: SpeakOptions): SpeakHandle {
  const controller = new AbortController();
  const { signal } = controller;
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const cleaned = cleanSpeechText(text);
  const rate = clampSpeakRate(options.rate);
  const done = (async () => {
    if (!cleaned) return;

    let remoteFailed = false;
    if (options.synthesizeAction) {
      try {
        const result = await options.synthesizeAction({ text: cleaned, rate });
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        if (result.ok && result.data.engine === 'remote' && result.data.audio) {
          await playRemoteAudio(result.data.audio.base64, result.data.audio.mimeType, rate, signal);
          return;
        }
        // engine none or missing audio -> fallback to browser TTS
      } catch (error) {
        if (isAbortError(error) || signal.aborted) throw error;
        remoteFailed = true;
      }
    }

    try {
      await playBrowserSpeech(cleaned, rate, signal);
    } catch (error) {
      if (isAbortError(error) || signal.aborted) throw error;
      // If browser TTS unavailable and no remote audio, surface as silent failure for UI state handling? throw
      if (!options.synthesizeAction || remoteFailed) throw error;
      throw error;
    }
  })();

  // Prevent unhandled rejection when caller only uses stop/control flow.
  void done.catch(() => undefined);

  return {
    stop: () => controller.abort(),
    done,
  };
}

export interface InlineSpeakButtonProps {
  readonly text: string;
  readonly synthesizeAction?: SpeakOptions['synthesizeAction'];
  readonly rate?: SpeakRate;
  readonly className?: string;
  readonly label?: string;
  readonly stopLabel?: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly onPlayingChange?: (playing: boolean) => void;
}

export function InlineSpeakButton({
  text,
  synthesizeAction,
  rate = 1,
  className,
  label = 'Ouvir',
  stopLabel = 'Parar',
  active = false,
  disabled = false,
  onPlayingChange,
}: InlineSpeakButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const handleRef = useRef<SpeakHandle | null>(null);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  const stop = useCallback(() => {
    handleRef.current?.stop();
    handleRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  const setPlayingState = useCallback(
    (value: boolean) => {
      setPlaying(value);
      onPlayingChange?.(value);
    },
    [onPlayingChange],
  );

  const handleClick = useCallback(async () => {
    if (disabled) return;
    if (playing) {
      stop();
      setPlayingState(false);
      return;
    }

    setError(false);
    const handle = speakText(textRef.current, { rate, synthesizeAction });
    handleRef.current = handle;
    setPlayingState(true);
    try {
      await handle.done;
    } catch (err) {
      if (!isAbortError(err)) setError(true);
    } finally {
      if (handleRef.current === handle) {
        handleRef.current = null;
        setPlayingState(false);
      }
    }
  }, [disabled, playing, rate, setPlayingState, stop, synthesizeAction]);

  const cleaned = cleanSpeechText(text);
  const isDisabled = disabled || cleaned.length === 0;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={playing ? stopLabel : label}
      aria-pressed={playing}
      title={playing ? stopLabel : label}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-40',
        playing || active
          ? 'border-brand-500 bg-brand-100 text-brand-700'
          : 'border-border-subtle bg-surface text-ink-700 hover:bg-surface-sunken',
        error && !playing ? 'border-amber-400 text-amber-700' : null,
        className,
      )}
    >
      <span aria-hidden="true">{playing ? '■' : '🔊'}</span>
    </button>
  );
}
