'use client';

import { useState, useCallback } from 'react';
import type { SpeechSynthesisResult, PronunciationEvaluation, PronunciationTarget } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { PronunciationPlayer } from './pronunciation-player';
import { PronunciationRecorder } from './pronunciation-recorder';
import { copy } from '@/presentation/lib/copy';

interface PronunciationPracticeProps {
  /** The synthesis result from TTS for the current target. */
  synthesis: SpeechSynthesisResult | null;
  /** The current target being practiced. */
  target: PronunciationTarget;
  /** All available targets in the lesson. */
  allTargets: readonly PronunciationTarget[];
  /**
   * Server Action to synthesize speech.
   *
   * The shape is the project's `ActionResult`: a success carries the data, a failure
   * carries the serialised `DomainError`. The actions are the real Server Actions
   * (`speech/actions.ts`) — an inline wrapper declared in the Server Component is **not**
   * one, and Next.js refuses to pass a plain function to a Client Component.
   */
  synthesizeAction: (input: { text: string; voice?: string; rate?: 1 | 0.75 }) => Promise<ActionResult<SpeechSynthesisResult>>;
  /** Server Action to evaluate pronunciation. */
  evaluateAction: (input: { expectedText: string; transcript?: string; audioBase64?: string; mimeType?: string; locale?: string }) => Promise<ActionResult<PronunciationEvaluation>>;
  /** Called when evaluation completes. */
  onEvaluate?: (evaluation: PronunciationEvaluation) => void;
  /** Index of the current target in allTargets. */
  currentIndex: number;
  /** Called when the user navigates to a different target. */
  onTargetChange: (index: number) => void;
}

/**
 * PronunciationPractice — the main panel for speaking practice in a lesson.
 *
 * Combines:
 * - PronunciationPlayer: listen to the target phrase (with fallback to browser TTS)
 * - PronunciationRecorder: record and evaluate pronunciation
 * - Navigation between multiple targets in the lesson
 */
export function PronunciationPractice({
  synthesis,
  target,
  allTargets,
  synthesizeAction,
  evaluateAction,
  onEvaluate,
  currentIndex,
  onTargetChange,
}: PronunciationPracticeProps) {
  const [localSynthesis, setLocalSynthesis] = useState<SpeechSynthesisResult | null>(synthesis);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Update local synthesis when prop changes (e.g., after target change)
  if (synthesis !== localSynthesis) {
    setLocalSynthesis(synthesis);
  }

  const handleSynthesize = useCallback(async () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    try {
      const result = await synthesizeAction({ text: target.text, rate: 1 });
      if (result.ok && result.data) {
        setLocalSynthesis(result.data);
      }
    } finally {
      setIsSynthesizing(false);
    }
  }, [target.text, synthesizeAction, isSynthesizing]);

  const handleEvaluate = useCallback(
    (evaluation: PronunciationEvaluation) => {
      onEvaluate?.(evaluation);
    },
    [onEvaluate],
  );

  return (
    <section className="space-y-6" aria-labelledby="pronunciation-practice-heading">
      <header>
        <h2 id="pronunciation-practice-heading" className="text-xl font-semibold">
          {copy.pronunciation.practiceTitle}
        </h2>
        <p className="text-muted-foreground mt-1">{copy.pronunciation.practiceDescription}</p>
      </header>

      {/* Target navigation */}
      {allTargets.length > 1 && (
        <nav className="flex items-center gap-2 overflow-x-auto pb-2" aria-label={copy.pronunciation.targetNavigation}>
          {allTargets.map((t, index) => (
            <button
              key={index}
              onClick={() => onTargetChange(index)}
              disabled={index === currentIndex}
              className={`btn btn-sm whitespace-nowrap transition-colors ${
                index === currentIndex
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
              aria-current={index === currentIndex ? 'step' : undefined}
            >
              {t.heading || `${copy.pronunciation.phase} ${t.phase}`}
            </button>
          ))}
        </nav>
      )}

      {/* Current target context */}
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">
          {copy.pronunciation.currentTarget}: {target.heading || `${copy.pronunciation.phase} ${target.phase}`}
        </p>
      </div>

      {/* Listen tab */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{copy.pronunciation.listen}</h3>
        <div className="p-4 border rounded-lg bg-card">
          <PronunciationPlayer
            synthesis={localSynthesis}
            targetText={target.text}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="btn btn-outline btn-sm"
            >
              {isSynthesizing ? copy.pronunciation.generating : copy.pronunciation.regenerateAudio}
            </button>
            {localSynthesis?.engine === 'none' && (
              <span className="text-xs text-muted-foreground">{copy.pronunciation.usingBrowserTTS}</span>
            )}
          </div>
        </div>
      </div>

      {/* Practice tab */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{copy.pronunciation.practice}</h3>
        <div className="p-4 border rounded-lg bg-card">
          <PronunciationRecorder
            targetText={target.text}
            evaluateAction={evaluateAction}
            onEvaluate={handleEvaluate}
            maxDurationSeconds={15}
          />
        </div>
      </div>

      {/* Progress indicator */}
      {allTargets.length > 1 && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{copy.pronunciation.progress} {currentIndex + 1} / {allTargets.length}</span>
            <span>{Math.round(((currentIndex + 1) / allTargets.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / allTargets.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}