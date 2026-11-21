'use client';

import { useState } from 'react';

import type { PronunciationHistory, SpeechSynthesisInput, SpeechSynthesisResult } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { copy } from '@/presentation/lib/copy';
import { readStoredSpeakRate } from '@/shared/speak-rate';

export interface PronunciationMasteryCardProps {
  readonly history: PronunciationHistory | null;
  readonly synthesizeAction: (
    input: SpeechSynthesisInput,
  ) => Promise<ActionResult<SpeechSynthesisResult>>;
}

function playWithBrowserTts(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = readStoredSpeakRate();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Erros de TTS do navegador são ignorados para não quebrar a UI.
  }
}

async function playAudioBase64(base64: string, mimeType: string, targetRate?: number, synthesisRate?: number): Promise<void> {
  const target = targetRate ?? readStoredSpeakRate();
  const multiplier = synthesisRate ? target / synthesisRate : target;
  const audio = new Audio(`data:${mimeType};base64,${base64}`);
  audio.playbackRate = Math.min(2, Math.max(0.25, multiplier));
  audio.preservesPitch = true;
  (audio as HTMLAudioElement & { mozPreservesPitch?: boolean }).mozPreservesPitch = true;
  (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
  await audio.play();
}

export function PronunciationMasteryCard({
  history,
  synthesizeAction,
}: PronunciationMasteryCardProps) {
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const t = copy.pronunciationMastery;

  const handlePlayWord = async (word: string) => {
    if (playingWord) return;

    setPlayingWord(word);
    try {
      const rate = readStoredSpeakRate();
      const result = await synthesizeAction({ text: word, rate });
      if (result.ok && result.data.audio) {
        await playAudioBase64(result.data.audio.base64, result.data.audio.mimeType, rate, result.data.rate);
      } else {
        playWithBrowserTts(word);
      }
    } catch {
      try {
        playWithBrowserTts(word);
      } catch {
        // Falha silenciosa: reprodução de áudio não deve quebrar a UI.
      }
    } finally {
      setPlayingWord(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardBody>
        {history === null ? (
          <p className="text-sm text-ink-600">{t.unavailable}</p>
        ) : history.summary.totalAttempts === 0 ? (
          <p className="text-sm text-ink-600">{t.noAttempts}</p>
        ) : (
          <div className="flex flex-col gap-6">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border-subtle p-4">
                <dt className="text-sm text-ink-600">{t.totalAttempts}</dt>
                <dd className="mt-1 text-2xl font-semibold text-ink-900">
                  {history.summary.totalAttempts}
                </dd>
              </div>
              <div className="rounded-lg border border-border-subtle p-4">
                <dt className="text-sm text-ink-600">{t.averageScore}</dt>
                <dd className="mt-1 text-2xl font-semibold text-ink-900">
                  {history.summary.averageScore}
                </dd>
              </div>
              <div className="rounded-lg border border-border-subtle p-4">
                <dt className="text-sm text-ink-600">{t.bestScore}</dt>
                <dd className="mt-1 text-2xl font-semibold text-ink-900">
                  {history.summary.bestScore}
                </dd>
              </div>
            </dl>

            {history.summary.weakWords.length > 0 ? (
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-ink-900">{t.weakWords}</h3>
                <ul className="flex flex-wrap gap-2">
                  {history.summary.weakWords.map((word) => (
                    <li key={word}>
                      <button
                        type="button"
                        onClick={() => void handlePlayWord(word)}
                        disabled={playingWord === word}
                        className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-sm text-ink-900 transition-colors hover:bg-surface-raised disabled:opacity-60"
                        aria-label={`${t.playWord}: ${word}`}
                        title={`${t.playWord}: ${word}`}
                      >
                        <span aria-hidden="true">🔊</span>
                        <span>{word}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
