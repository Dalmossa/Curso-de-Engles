'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpeechSynthesisResult } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { cn } from '@/shared/utils/cn';
import { playbackMultiplier, toSynthesisRate, type SpeakRate } from '@/shared/speak-rate';

export type { SpeakRate };

export interface SpeakOptions {
  readonly rate: SpeakRate;
  readonly synthesizeAction?: (input: { text: string; rate?: 1 | 0.75 | 0.5 }) => Promise<ActionResult<SpeechSynthesisResult>>;
  readonly signal?: AbortSignal;
}

export interface SpeakHandle {
  stop: () => void;
  readonly done: Promise<void>;
}

export function clampSpeakRate(rate: number): SpeakRate {
  if (rate <= 0.625) return 0.5;
  if (rate <= 0.875) return 0.75;
  return 1;
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

async function playRemoteAudio(base64: string, mimeType: string, playbackRate: number, signal?: AbortSignal): Promise<void> {
  if (typeof Audio === 'undefined') {
    throw new Error('audio-unavailable');
  }

  await new Promise<void>((resolve, reject) => {
    const audio = new Audio(`data:${mimeType};base64,${base64}`);
    audio.playbackRate = Math.min(2, Math.max(0.25, playbackRate));
    audio.preservesPitch = true;
    (audio as HTMLAudioElement & { mozPreservesPitch?: boolean }).mozPreservesPitch = true;
    (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
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
  const targetRate = clampSpeakRate(options.rate);
  const synthesisRate = toSynthesisRate(targetRate);
  const done = (async () => {
    if (!cleaned) return;

    let remoteFailed = false;
    if (options.synthesizeAction) {
      try {
        const result = await options.synthesizeAction({ text: cleaned, rate: synthesisRate });
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        if (result.ok && result.data.engine === 'remote' && result.data.audio) {
          const multiplier = playbackMultiplier(targetRate, result.data.rate ?? synthesisRate);
          await playRemoteAudio(result.data.audio.base64, result.data.audio.mimeType, multiplier, signal);
          return;
        }
        // engine none or missing audio -> fallback to browser TTS
      } catch (error) {
        if (isAbortError(error) || signal.aborted) throw error;
        remoteFailed = true;
      }
    }

    try {
      await playBrowserSpeech(cleaned, targetRate, signal);
    } catch (error) {
      if (isAbortError(error) || signal.aborted) throw error;
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
  /** Called when playback starts/stops. Alias: `onPlayStateChange`. */
  readonly onPlayingChange?: (playing: boolean) => void;
  /** Alias for `onPlayingChange`, kept for mockup/controller compatibility. */
  readonly onPlayStateChange?: (playing: boolean) => void;
  /**
   * Controlled mode: when provided, the button delegates playback to the caller.
   * It does not call `speakText` internally. `text` is still used for disabled/label logic.
   */
  readonly controlledPlaying?: boolean;
  readonly onControlledToggle?: () => void;
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
  onPlayStateChange,
  controlledPlaying,
  onControlledToggle,
}: InlineSpeakButtonProps) {
  const [playingInternal, setPlayingInternal] = useState(false);
  const [error, setError] = useState(false);
  const handleRef = useRef<SpeakHandle | null>(null);
  const textRef = useRef(text);
  const isControlled = controlledPlaying !== undefined;

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  const stop = useCallback(() => {
    handleRef.current?.stop();
    handleRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  const emitPlaying = useCallback(
    (value: boolean) => {
      onPlayingChange?.(value);
      onPlayStateChange?.(value);
    },
    [onPlayStateChange, onPlayingChange],
  );

  const setPlayingState = useCallback(
    (value: boolean) => {
      if (!isControlled) setPlayingInternal(value);
      emitPlaying(value);
    },
    [emitPlaying, isControlled],
  );

  const playing = isControlled ? controlledPlaying : playingInternal;

  const handleClick = useCallback(async () => {
    if (disabled) return;

    if (isControlled) {
      onControlledToggle?.();
      return;
    }

    if (playingInternal) {
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
  }, [disabled, isControlled, onControlledToggle, playingInternal, rate, setPlayingState, stop, synthesizeAction]);

  const cleaned = cleanSpeechText(text);
  const isDisabled = disabled || (cleaned.length === 0 && !isControlled);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={playing ? stopLabel : label}
      aria-pressed={playing}
      title={playing ? stopLabel : label}
      className={cn(
        'inline-flex min-h-11 min-w-11 h-11 w-11 items-center justify-center rounded-md border text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0 sm:text-xs',
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
