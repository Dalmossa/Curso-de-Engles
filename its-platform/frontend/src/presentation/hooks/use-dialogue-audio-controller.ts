'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SpeechSynthesisResult } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { cleanSpeechText } from '@/presentation/components/inline-speak-button';
import { playbackMultiplier, readStoredSpeakRate, toSynthesisRate, writeStoredSpeakRate, type SpeakRate } from '@/shared/speak-rate';

export type DialogueSynthesizeAction = (input: {
  text: string;
  voice?: string;
  rate?: 1 | 0.75 | 0.5;
}) => Promise<ActionResult<SpeechSynthesisResult>>;

export interface DialogueTurnInput {
  readonly speaker: string;
  readonly text: string;
  /** Pre-rendered clip URL. When present, playback uses it directly and skips TTS/speechSynthesis. */
  readonly audioUrl?: string | null;
}

export interface DialogueAudioState {
  readonly activeIndex: number | null;
  readonly playingAll: boolean;
  readonly isPlaying: boolean;
  readonly isLoading: boolean;
  readonly rate: SpeakRate;
  readonly currentTime: number;
  readonly duration: number;
  readonly canSeek: boolean;
  readonly supportsTimeline: boolean;
  readonly error: string | null;
}

export interface DialogueAudioController extends DialogueAudioState {
  readonly turns: readonly DialogueTurnInput[];
  setRate: (rate: SpeakRate) => void;
  playAll: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  stop: () => void;
  restart: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  playTurn: (index: number) => Promise<void>;
  toggleTurn: (index: number) => Promise<void>;
  seek: (time: number) => void;
  playSlow: (text: string) => Promise<void>;
}

interface PlayOptions {
  readonly asSequence?: boolean;
  readonly rateOverride?: SpeakRate;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/* clamp helper removed; progress is clamped inline where needed */

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function useDialogueAudioController({
  turns,
  synthesizeAction,
}: {
  readonly turns: readonly DialogueTurnInput[];
  readonly synthesizeAction?: DialogueSynthesizeAction;
  readonly storageKey?: string;
}): DialogueAudioController {
  const [rate, setRateState] = useState<SpeakRate>(() => readStoredSpeakRate());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canSeek, setCanSeek] = useState(false);
  const [supportsTimeline, setSupportsTimeline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rateRef = useRef(rate);
  const runIdRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastReportedTimeRef = useRef(-1);
  const sequenceRef = useRef<{ active: boolean; index: number }>({ active: false, index: -1 });

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  const cancelRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const cleanupAudio = useCallback(() => {
    cancelRaf();
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onloadedmetadata = null;
      audio.ondurationchange = null;
      audio.onpause = null;
      audio.onplay = null;
      try {
        audio.pause();
        audio.src = '';
        audio.load();
      } catch {
        // ignore
      }
      audioRef.current = null;
    }
    const utterance = utteranceRef.current;
    if (utterance) {
      utterance.onend = null;
      utterance.onerror = null;
      utteranceRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }, [cancelRaf]);

  const resetPlaybackState = useCallback((keepRate = true) => {
    setActiveIndex(null);
    setPlayingAll(false);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setCanSeek(false);
    setSupportsTimeline(false);
    if (!keepRate) setRateState(readStoredSpeakRate());
    lastReportedTimeRef.current = -1;
    sequenceRef.current = { active: false, index: -1 };
  }, []);

  const hardStop = useCallback(() => {
    runIdRef.current += 1;
    cleanupAudio();
    resetPlaybackState();
  }, [cleanupAudio, resetPlaybackState]);

  useEffect(() => () => hardStop(), [hardStop]);

  const reportTime = useCallback((time: number, dur: number, force = false) => {
    const rounded = Math.round(time * 10) / 10;
    if (!force && Math.abs(rounded - lastReportedTimeRef.current) < 0.05) return;
    lastReportedTimeRef.current = rounded;
    setCurrentTime(time);
    if (Number.isFinite(dur) && dur > 0) setDuration(dur);
  }, []);

  const startRaf = useCallback((audio: HTMLAudioElement) => {
    cancelRaf();
    const tick = () => {
      const a = audioRef.current;
      if (!a || a !== audio) return;
      reportTime(a.currentTime || 0, a.duration || 0);
      if (!a.paused && !a.ended) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelRaf, reportTime]);

  const playRemoteAudio = useCallback((src: string, playbackRate: number, myRun: number) => {
    return new Promise<void>((resolve, reject) => {
      if (typeof Audio === 'undefined') {
        reject(new Error('audio-unavailable'));
        return;
      }
      const audio = new Audio(src);
      audio.preload = 'auto';
      // Do not set crossOrigin for plain playback; static clip servers may omit CORS headers.
      audio.playbackRate = Math.min(2, Math.max(0.25, playbackRate));
      audio.preservesPitch = true;
      (audio as HTMLAudioElement & { mozPreservesPitch?: boolean }).mozPreservesPitch = true;
      (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
      audioRef.current = audio;
      setCanSeek(true);
      setSupportsTimeline(true);

      const finish = () => {
        cancelRaf();
        if (audioRef.current === audio) audioRef.current = null;
        resolve();
      };
      const fail = (err: unknown) => {
        cancelRaf();
        if (audioRef.current === audio) audioRef.current = null;
        reject(err);
      };

      audio.onloadedmetadata = () => {
        if (runIdRef.current !== myRun) return;
        const d = Number.isFinite(audio.duration) ? audio.duration : 0;
        setDuration(d);
        reportTime(audio.currentTime || 0, d, true);
      };
      audio.ondurationchange = () => {
        if (runIdRef.current !== myRun) return;
        const d = Number.isFinite(audio.duration) ? audio.duration : 0;
        if (d > 0) setDuration(d);
      };
      audio.onplay = () => {
        if (runIdRef.current !== myRun) return;
        setIsPlaying(true);
        setIsLoading(false);
        startRaf(audio);
      };
      audio.onpause = () => {
        if (runIdRef.current !== myRun) return;
        cancelRaf();
        reportTime(audio.currentTime || 0, audio.duration || 0, true);
        if (!audio.ended) setIsPlaying(false);
      };
      audio.onended = () => {
        if (runIdRef.current !== myRun) return;
        reportTime(audio.duration || 0, audio.duration || 0, true);
        setIsPlaying(false);
        finish();
      };
      audio.onerror = () => {
        if (runIdRef.current !== myRun) return;
        setIsPlaying(false);
        fail(new Error('audio-error'));
      };

      void audio.play().catch((err) => {
        if (runIdRef.current !== myRun) return;
        fail(err);
      });
    });
  }, [cancelRaf, reportTime, startRaf]);

  const playBrowserSpeech = useCallback((text: string, playbackRate: SpeakRate, myRun: number) => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        reject(new Error('speech-synthesis-unavailable'));
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = playbackRate;
      utteranceRef.current = utterance;
      setCanSeek(false);
      setSupportsTimeline(false);
      setDuration(0);
      setCurrentTime(0);

      utterance.onstart = () => {
        if (runIdRef.current !== myRun) return;
        setIsLoading(false);
        setIsPlaying(true);
      };
      utterance.onend = () => {
        if (runIdRef.current !== myRun) return;
        setIsPlaying(false);
        if (utteranceRef.current === utterance) utteranceRef.current = null;
        resolve();
      };
      utterance.onerror = (event) => {
        if (runIdRef.current !== myRun) return;
        setIsPlaying(false);
        if (utteranceRef.current === utterance) utteranceRef.current = null;
        if (event.error === 'canceled' || event.error === 'interrupted') {
          reject(new DOMException('Aborted', 'AbortError'));
        } else {
          reject(new Error(event.error || 'speech-error'));
        }
      };

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  const playUrlInternal = useCallback(async (url: string, myRun: number, targetRate: SpeakRate) => {
    setError(null);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    await playRemoteAudio(url, targetRate, myRun);
  }, [playRemoteAudio]);

  const playTextInternal = useCallback(async (text: string, myRun: number, rateOverride?: SpeakRate, audioUrl?: string | null) => {
    const cleaned = cleanSpeechText(text);
    const targetRate = rateOverride ?? rateRef.current;

    if (audioUrl) {
      try {
        await playUrlInternal(audioUrl, myRun, targetRate);
        return;
      } catch (err) {
        if (isAbortError(err) || runIdRef.current !== myRun) throw err;
        // Pre-rendered clip failed; fall through only if we have text for TTS/speech.
        if (!cleaned) throw err;
      }
    }

    if (!cleaned) return;
    const synthesisRate = toSynthesisRate(targetRate);

    setError(null);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);

    let remoteFailed = false;
    if (synthesizeAction) {
      try {
        const result = await synthesizeAction({ text: cleaned, rate: synthesisRate });
        if (runIdRef.current !== myRun) throw new DOMException('Aborted', 'AbortError');
        if (result.ok && result.data.engine === 'remote' && result.data.audio) {
          const multiplier = playbackMultiplier(targetRate, result.data.rate ?? synthesisRate);
          const src = `data:${result.data.audio.mimeType};base64,${result.data.audio.base64}`;
          await playRemoteAudio(src, multiplier, myRun);
          return;
        }
      } catch (err) {
        if (isAbortError(err) || runIdRef.current !== myRun) throw err;
        remoteFailed = true;
      }
    }

    if (runIdRef.current !== myRun) throw new DOMException('Aborted', 'AbortError');
    try {
      await playBrowserSpeech(cleaned, targetRate, myRun);
    } catch (err) {
      if (isAbortError(err) || runIdRef.current !== myRun) throw err;
      if (!synthesizeAction || remoteFailed) throw err;
      throw err;
    }
  }, [playBrowserSpeech, playRemoteAudio, playUrlInternal, synthesizeAction]);

  const stop = useCallback(() => {
    hardStop();
  }, [hardStop]);

  const playTurn = useCallback(async (index: number, options?: PlayOptions) => {
    const turn = turns[index];
    if (!turn) return;
    runIdRef.current += 1;
    const myRun = runIdRef.current;
    cleanupAudio();
    sequenceRef.current = { active: Boolean(options?.asSequence), index };
    setActiveIndex(index);
    setPlayingAll(Boolean(options?.asSequence));
    setIsPlaying(false);

    try {
      await playTextInternal(turn.text, myRun, options?.rateOverride, turn.audioUrl);
    } catch (err) {
      if (!isAbortError(err) && runIdRef.current === myRun) {
        setError('audio-error');
      }
    } finally {
      if (runIdRef.current === myRun) {
        cleanupAudio();
        setIsPlaying(false);
        setIsLoading(false);
        if (!options?.asSequence) {
          setActiveIndex(null);
          setPlayingAll(false);
          setCurrentTime(0);
          setDuration(0);
          setCanSeek(false);
          setSupportsTimeline(false);
        }
      }
    }
  }, [cleanupAudio, playTextInternal, turns]);

  const playAll = useCallback(async () => {
    if (turns.length === 0) return;
    runIdRef.current += 1;
    const myRun = runIdRef.current;
    cleanupAudio();
    setError(null);
    setPlayingAll(true);

    try {
      for (let i = 0; i < turns.length; i++) {
        if (runIdRef.current !== myRun) break;
        sequenceRef.current = { active: true, index: i };
        setActiveIndex(i);
        setIsPlaying(false);
        setIsLoading(false);
        try {
          await playTextInternal(turns[i]?.text ?? '', myRun, undefined, turns[i]?.audioUrl);
        } catch (err) {
          if (isAbortError(err) || runIdRef.current !== myRun) break;
          setError('audio-error');
          break;
        }
        if (runIdRef.current !== myRun) break;
        cleanupAudio();
      }
    } finally {
      if (runIdRef.current === myRun) {
        cleanupAudio();
        resetPlaybackState();
      }
    }
  }, [cleanupAudio, playTextInternal, resetPlaybackState, turns]);

  const toggleTurn = useCallback(async (index: number) => {
    if (activeIndex === index && (isPlaying || isLoading || playingAll)) {
      stop();
      return;
    }
    await playTurn(index, { asSequence: false });
  }, [activeIndex, isLoading, isPlaying, playTurn, playingAll, stop]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  }, []);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (audio && audio.paused && !audio.ended) {
      try {
        await audio.play();
      } catch {
        // ignore
      }
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setIsPlaying(true);
          return;
        }
      } catch {
        // ignore
      }
    }
    if (activeIndex !== null) {
      await playTurn(activeIndex, { asSequence: playingAll });
    } else {
      await playAll();
    }
  }, [activeIndex, playAll, playTurn, playingAll]);

  const togglePlayPause = useCallback(async () => {
    if (isLoading) return;
    if (isPlaying) {
      pause();
      return;
    }
    await resume();
  }, [isLoading, isPlaying, pause, resume]);

  const restart = useCallback(async () => {
    if (playingAll) {
      await playAll();
      return;
    }
    if (activeIndex !== null) {
      await playTurn(activeIndex, { asSequence: false });
      return;
    }
    await playAll();
  }, [activeIndex, playAll, playTurn, playingAll]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const next = Math.min(Math.max(time, 0), audio.duration);
    try {
      audio.currentTime = next;
      reportTime(next, audio.duration, true);
    } catch {
      // ignore
    }
  }, [reportTime]);

  const setRate = useCallback((next: SpeakRate) => {
    setRateState(next);
    writeStoredSpeakRate(next);
    rateRef.current = next;
    const audio = audioRef.current;
    if (audio) {
      // Adjust playback multiplier relative to synthesis rate encoded in current flow is not tracked here;
      // for remote audio already playing we keep the effective speed by scaling from current rate.
      // Simpler: restart current turn/sequence at new rate.
    }
    // If playing, restart current context at new rate for consistency across engines.
    if (isPlaying || isLoading || activeIndex !== null) {
      const wasSequence = playingAll;
      const idx = activeIndex ?? 0;
      void (async () => {
        if (wasSequence) {
          // restart sequence from current index for predictability
          runIdRef.current += 1;
          const myRun = runIdRef.current;
          cleanupAudio();
          setPlayingAll(true);
          for (let i = idx; i < turns.length; i++) {
            if (runIdRef.current !== myRun) break;
            setActiveIndex(i);
            try {
              await playTextInternal(turns[i]?.text ?? '', myRun, next, turns[i]?.audioUrl);
            } catch (err) {
              if (isAbortError(err) || runIdRef.current !== myRun) break;
              break;
            }
            cleanupAudio();
          }
          if (runIdRef.current === myRun) {
            cleanupAudio();
            resetPlaybackState();
          }
        } else {
          await playTurn(idx, { asSequence: false, rateOverride: next });
        }
      })();
    }
  }, [activeIndex, cleanupAudio, isLoading, isPlaying, playTurn, playTextInternal, playingAll, resetPlaybackState, turns]);

  const playSlow = useCallback(async (text: string) => {
    runIdRef.current += 1;
    const myRun = runIdRef.current;
    cleanupAudio();
    setActiveIndex(null);
    setPlayingAll(false);
    setIsPlaying(false);
    try {
      await playTextInternal(text, myRun, 0.5);
    } catch (err) {
      if (!isAbortError(err) && runIdRef.current === myRun) setError('audio-error');
    } finally {
      if (runIdRef.current === myRun) {
        cleanupAudio();
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentTime(0);
        setDuration(0);
        setCanSeek(false);
        setSupportsTimeline(false);
      }
    }
  }, [cleanupAudio, playTextInternal]);

  return useMemo(() => ({
    turns,
    activeIndex,
    playingAll,
    isPlaying,
    isLoading,
    rate,
    currentTime,
    duration,
    canSeek,
    supportsTimeline,
    error,
    setRate,
    playAll,
    pause,
    resume,
    stop,
    restart,
    togglePlayPause,
    playTurn: (index: number) => playTurn(index, { asSequence: false }),
    toggleTurn,
    seek,
    playSlow,
  }), [activeIndex, canSeek, currentTime, duration, error, isLoading, isPlaying, pause, playAll, playSlow, playTurn, playingAll, rate, restart, resume, seek, setRate, stop, supportsTimeline, togglePlayPause, toggleTurn, turns]);
}
