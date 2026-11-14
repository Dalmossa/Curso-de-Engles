'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { SpeechSynthesisResult } from '@/core';
import { copy } from '@/presentation/lib/copy';

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
  const [rate, setRate] = useState<1 | 0.75>(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordTimingsRef = useRef<number[]>([]);

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

  // Clean up audio/utterance on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playWithAudio = useCallback(
    async (audioBase64: string, mimeType: string, playbackRate: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
      audioRef.current = audio;
      audio.playbackRate = playbackRate;

      // We can't get word boundaries from raw audio, so we estimate timing
      // based on average speech rate (~150 words per minute at 1.0x)
      if (words.length > 0) {
        const avgWordDurationMs = (60000 / 150) / playbackRate; // ~400ms per word at 1.0x
        wordTimingsRef.current = words.map((_: string, i: number) => i * avgWordDurationMs);
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
          wordIndex++;
          setCurrentWordIndex(wordIndex - 1);
          onWordBoundary?.(wordIndex - 1);
        }
      };

      const interval = setInterval(checkWordBoundary, 50);

      audio.onended = () => {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        onEnd?.();
      };

      audio.onerror = () => {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        onEnd?.();
      };

      setIsPlaying(true);
      await audio.play();
    },
    [words, onWordBoundary, onEnd],
  );

  const playWithSpeechSynthesis = useCallback(
    (text: string, playbackRate: number) => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      utterance.lang = 'en-US';
      utterance.rate = playbackRate;

      // Word boundary events for highlighting
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const textBeforeWord = text.slice(0, charIndex);
          const wordIndex = textBeforeWord
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
        if (event.error !== 'interrupted') {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
          onEnd?.();
        }
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    },
    [onWordBoundary, onEnd],
  );

  const handlePlay = useCallback(() => {
    if (!synthesis) return;

    if (synthesis.engine === 'remote' && synthesis.audio) {
      playWithAudio(synthesis.audio.base64, synthesis.audio.mimeType, rate);
    } else {
      playWithSpeechSynthesis(synthesis.text, rate);
    }
  }, [synthesis, rate, playWithAudio, playWithSpeechSynthesis]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (utteranceRef.current) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    onEnd?.();
  }, [onEnd]);

  const handleRateChange = useCallback((newRate: 1 | 0.75) => {
    setRate(newRate);
    if (isPlaying) {
      handleStop();
      handlePlay();
    }
  }, [isPlaying, handleStop, handlePlay]);

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
            key={index}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              index === currentWordIndex
                ? 'bg-primary text-primary-foreground font-medium'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={handlePause}
              className="btn btn-sm btn-outline"
              aria-label={copy.pronunciation.pause}
            >
              {copy.pronunciation.pause}
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="btn btn-sm btn-primary"
              aria-label={copy.pronunciation.play}
            >
              {copy.pronunciation.play}
            </button>
          )}
          <button
            onClick={handleStop}
            disabled={!isPlaying}
            className="btn btn-sm btn-outline"
            aria-label={copy.pronunciation.stop}
          >
            {copy.pronunciation.stop}
          </button>
        </div>

        <div className="flex items-center gap-1 ml-2 border-l pl-3">
          <span className="text-xs text-muted-foreground">{copy.pronunciation.speed}</span>
          <button
            onClick={() => handleRateChange(1)}
            className={`btn btn-xs ${rate === 1 ? 'btn-primary' : 'btn-outline'}`}
            aria-pressed={rate === 1}
          >
            1.0x
          </button>
          <button
            onClick={() => handleRateChange(0.75)}
            className={`btn btn-xs ${rate === 0.75 ? 'btn-primary' : 'btn-outline'}`}
            aria-pressed={rate === 0.75}
          >
            0.75x
          </button>
        </div>

        {synthesis.engine === 'none' && synthesis.fallbackReason && (
          <span className="text-xs text-amber-600 dark:text-amber-400 ml-2">
            {copy.pronunciation.fallbackNotice}
          </span>
        )}
      </div>
    </div>
  );
}