'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { SpeechSynthesisResult } from '@/core';
import { copy } from '@/presentation/lib/copy';
import { playbackMultiplier, readStoredSpeakRate, toSynthesisRate, writeStoredSpeakRate, type SpeakRate } from '@/shared/speak-rate';

interface PronunciationPlayerProps {
  /** The synthesis result from the TTS API. */
  synthesis: SpeechSynthesisResult | null;
  /** The text being spoken, used for word highlighting. */
  targetText: string;
  /** Called when a word boundary is reached during playback. */
  onWordBoundary?: (wordIndex: number) => void;
  /** Called when playback ends (either naturally or by user). */
  onEnd?: () => void;
}

/**
 * PronunciationPlayer — plays synthesized speech with word-level highlighting.
 *
 * Features:
 * - Plays at 1.0x or 0.75x rate (matching the TTS API's rate options)
 * - Highlights words progressively as they are spoken
 * - Falls back to window.speechSynthesis when engine === 'none'
 * - Exposes onWordBoundary for external sync (e.g., karaoke-style highlighting)
 */
export function PronunciationPlayer({
  synthesis,
  targetText,
  onWordBoundary,
  onEnd,
}: PronunciationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<SpeakRate>(() => readStoredSpeakRate());
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordTimingsRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Split target text into words for highlighting (derived state, no effect needed)
  const words = useMemo(
    () =>
      targetText
        .toLowerCase()
        .replace(/[.,!?;:()\[\]{}"']/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 0),
    [targetText],
  );

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (utteranceRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  }, []);

  // Clean up audio/utterance on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const playWithAudio = useCallback(
    async (audioBase64: string, mimeType: string, playbackRate: number) => {
      stopPlayback();

      const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
      audioRef.current = audio;
      audio.playbackRate = playbackRate;
      audio.preservesPitch = true;
      (audio as HTMLAudioElement & { mozPreservesPitch?: boolean }).mozPreservesPitch = true;
      (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;

      // We can't get word boundaries from raw audio, so we estimate timing
      // based on average speech rate (~150 words per minute at 1.0x)
      if (words.length > 0) {
        const avgWordDurationMs = (60000 / 150) / playbackRate; // ~400ms per word at 1.0x
        wordTimingsRef.current = words.map((_: string, i: number) => i * avgWordDurationMs);
      } else {
        wordTimingsRef.current = [];
      }

      let wordIndex = 0;
      const checkWordBoundary = () => {
        if (!audioRef.current) return;
        const timings = wordTimingsRef.current;
        if (timings.length === 0) return;
        const currentTime = audioRef.current.currentTime * 1000;
        while (wordIndex < timings.length) {
          const timing = timings[wordIndex];
          if (timing === undefined || timing > currentTime) break;
          setCurrentWordIndex(wordIndex);
          onWordBoundary?.(wordIndex);
          wordIndex++;
        }
      };

      timerRef.current = setInterval(checkWordBoundary, 50);

      audio.onended = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        onEnd?.();
      };

      audio.onerror = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      };

      try {
        setIsPlaying(true);
        await audio.play();
      } catch {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsPlaying(false);
        setCurrentWordIndex(-1);
      }
    },
    [words, onWordBoundary, onEnd, stopPlayback],
  );

  const playWithSpeechSynthesis = useCallback(
    (text: string, playbackRate: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
        return;
      }
      stopPlayback();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      utterance.lang = 'en-US';
      utterance.rate = playbackRate;

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      // Word boundary events for highlighting
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const textBeforeWord = text.slice(0, charIndex);
          const wordIndex =
            textBeforeWord
              .toLowerCase()
              .replace(/[.,!?;:()\[\]{}"']/g, '')
              .split(/\s+/)
              .filter((w) => w.length > 0).length - 1;
          if (wordIndex >= 0 && wordIndex < words.length) {
            setCurrentWordIndex(wordIndex);
            onWordBoundary?.(wordIndex);
          }
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [words, onWordBoundary, onEnd, stopPlayback],
  );

  const handlePlay = useCallback(() => {
    if (!synthesis) return;

    if (synthesis.engine === 'remote' && synthesis.audio) {
      const multiplier = playbackMultiplier(rate, synthesis.rate ?? toSynthesisRate(rate));
      void playWithAudio(synthesis.audio.base64, synthesis.audio.mimeType, multiplier);
    } else {
      playWithSpeechSynthesis(synthesis.text || targetText, rate);
    }
  }, [synthesis, rate, targetText, playWithAudio, playWithSpeechSynthesis]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    stopPlayback();
    onEnd?.();
  }, [stopPlayback, onEnd]);

  const handleRateChange = useCallback(
    (newRate: SpeakRate) => {
      setRate(newRate);
      writeStoredSpeakRate(newRate);
      if (isPlaying && synthesis) {
        if (synthesis.engine === 'remote' && synthesis.audio) {
          const multiplier = playbackMultiplier(newRate, synthesis.rate ?? toSynthesisRate(newRate));
          void playWithAudio(synthesis.audio.base64, synthesis.audio.mimeType, multiplier);
        } else {
          playWithSpeechSynthesis(synthesis.text || targetText, newRate);
        }
      }
    },
    [isPlaying, synthesis, targetText, playWithAudio, playWithSpeechSynthesis],
  );

  if (!synthesis) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{copy.pronunciation.noAudio}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Word-by-word display with highlighting */}
      <div className="flex flex-wrap gap-1.5" aria-live="polite">
        {words.map((word: string, index: number) => (
          <span
            key={`${word}-${index}`}
            className={`px-1.5 py-0.5 rounded text-sm transition-colors duration-150 ${
              index === currentWordIndex
                ? 'bg-primary text-primary-foreground font-medium'
                : index < currentWordIndex
                  ? 'text-foreground'
                  : 'text-muted-foreground'
            }`}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" role="group" aria-label={copy.pronunciation.speed}>
          <span className="sr-only">{copy.pronunciation.speed}</span>
          {([1, 0.75, 0.5] as const).map((r) => {
            const label = r === 1 ? '1.0x' : r === 0.75 ? '0.75x' : '0.5x';
            const title =
              r === 1
                ? `${copy.pronunciation.speed}: normal (1.0x)`
                : r === 0.75
                  ? `${copy.pronunciation.speed}: lenta (0.75x)`
                  : `${copy.pronunciation.speed}: bem lenta (0.5x)`;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRateChange(r)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  rate === r
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-muted'
                }`}
                aria-pressed={rate === r}
                title={title}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1.5">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="btn btn-primary btn-sm"
              aria-label={copy.pronunciation.play}
            >
              ▶ {copy.pronunciation.play}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="btn btn-secondary btn-sm"
              aria-label={copy.pronunciation.pause}
            >
              ⏸ {copy.pronunciation.pause}
            </button>
          )}
          <button
            type="button"
            onClick={handleStop}
            className="btn btn-ghost btn-sm"
            aria-label={copy.pronunciation.stop}
            disabled={!isPlaying && currentWordIndex < 0}
          >
            ⏹ {copy.pronunciation.stop}
          </button>
        </div>
      </div>

      {/* Engine indicator for fallback */}
      {synthesis.engine === 'none' && (
        <p className="text-xs text-muted-foreground italic">{copy.pronunciation.fallbackNotice}</p>
      )}
    </div>
  );
}
