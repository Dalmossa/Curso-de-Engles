'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SpeechSynthesisResult, PronunciationEvaluation, PronunciationTarget, GrammarTip } from '@/core';
import type { ActionResult } from '@/shared/action-result';
import { readStoredSpeakRate } from '@/shared/speak-rate';
import { PronunciationPlayer } from './pronunciation-player';
import { PronunciationRecorder } from './pronunciation-recorder';
import { copy } from '@/presentation/lib/copy';

interface PronunciationPracticeProps {
  /** Initial synthesis result for the initial/current target (may be null; client can regenerate/fallback). */
  synthesis: SpeechSynthesisResult | null;
  /** The current target being practiced (optional; derived from allTargets when omitted). */
  target?: PronunciationTarget;
  /** All available targets in the lesson. Must not be empty. */
  allTargets: readonly PronunciationTarget[];
  /**
   * Server Action to synthesize speech.
   */
  synthesizeAction: (input: { text: string; voice?: string; rate?: 1 | 0.75 | 0.5 }) => Promise<ActionResult<SpeechSynthesisResult>>;
  /** Server Action to evaluate pronunciation. */
  evaluateAction: (input: { expectedText: string; transcript?: string; audioBase64?: string; mimeType?: string; locale?: string }) => Promise<ActionResult<PronunciationEvaluation>>;
  /** Optional server action to fetch a grammar tip from the local RAG. */
  getGrammarTipAction?: (topic: string) => Promise<ActionResult<GrammarTip>>;
  /** Called when evaluation completes. */
  onEvaluate?: (evaluation: PronunciationEvaluation) => void;
  /** Index of the current target in allTargets (optional; managed internally if omitted). */
  currentIndex?: number;
  /** Called when the user navigates to a different target (optional; managed internally if omitted). */
  onTargetChange?: (index: number) => void;
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
  target: targetProp,
  allTargets,
  synthesizeAction,
  evaluateAction,
  getGrammarTipAction,
  onEvaluate,
  currentIndex,
  onTargetChange,
}: PronunciationPracticeProps) {
  const [internalIndex, setInternalIndex] = useState(currentIndex ?? 0);
  const isControlled = typeof onTargetChange === 'function';
  const activeIndex = isControlled ? (currentIndex ?? 0) : internalIndex;
  const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(allTargets.length - 1, 0));
  const activeTarget = allTargets[safeIndex] ?? targetProp ?? allTargets[0]!;

  const [synthesisOverride, setSynthesisOverride] = useState<SpeechSynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [grammarTip, setGrammarTip] = useState<GrammarTip | null>(null);
  const [grammarTipLoading, setGrammarTipLoading] = useState(false);
  const [grammarTipError, setGrammarTipError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const targetKey = `${safeIndex}:${activeTarget.text}`;
  const displayedSynthesis = safeIndex === 0 ? (synthesisOverride ?? synthesis) : synthesisOverride;

  // Adjust state during render when the active target changes (avoids sync setState in effects).
  if (activeKey !== targetKey) {
    setActiveKey(targetKey);
    setGrammarTip(null);
    setGrammarTipError(null);
    setSynthesisOverride(null);
    setIsSynthesizing(safeIndex !== 0);
  }

  // Synthesize speech for non-initial targets on navigation.
  useEffect(() => {
    if (safeIndex === 0) return;

    let cancelled = false;
    void (async () => {
      try {
        const rate = readStoredSpeakRate();
        const result = await synthesizeAction({ text: activeTarget.text, rate });
        if (!cancelled && result.ok) {
          setSynthesisOverride(result.data);
        }
      } finally {
        if (!cancelled) setIsSynthesizing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeIndex, activeTarget.text, synthesizeAction]);

  const handleSynthesize = useCallback(async () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    try {
      const rate = readStoredSpeakRate();
      const result = await synthesizeAction({ text: activeTarget.text, rate });
      if (result.ok) {
        setSynthesisOverride(result.data);
      }
    } finally {
      setIsSynthesizing(false);
    }
  }, [activeTarget.text, synthesizeAction, isSynthesizing]);

  const handleEvaluate = useCallback(
    (evaluation: PronunciationEvaluation) => {
      onEvaluate?.(evaluation);
    },
    [onEvaluate],
  );

  const handleGrammarTip = useCallback(async () => {
    if (!getGrammarTipAction || grammarTipLoading) return;
    setGrammarTipLoading(true);
    setGrammarTipError(null);
    try {
      const result = await getGrammarTipAction(activeTarget.text);
      if (result.ok) {
        setGrammarTip(result.data);
      } else {
        setGrammarTipError(copy.pronunciation.grammarTipError);
      }
    } finally {
      setGrammarTipLoading(false);
    }
  }, [getGrammarTipAction, grammarTipLoading, activeTarget.text]);

  const handleTargetChange = useCallback(
    (index: number) => {
      if (isControlled) {
        onTargetChange(index);
      } else {
        setInternalIndex(index);
      }
    },
    [isControlled, onTargetChange],
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
              onClick={() => handleTargetChange(index)}
              disabled={index === safeIndex}
              className={`btn btn-sm whitespace-nowrap transition-colors ${
                index === safeIndex
                  ? 'btn-primary'
                  : 'btn-outline'
              }`}
              aria-current={index === safeIndex ? 'step' : undefined}
            >
              {t.heading || `${copy.pronunciation.phase} ${t.phase}`}
            </button>
          ))}
        </nav>
      )}

      {/* Current target context */}
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-1">
          {copy.pronunciation.currentTarget}: {activeTarget.heading || `${copy.pronunciation.phase} ${activeTarget.phase}`}
        </p>
      </div>

      {/* Listen tab */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{copy.pronunciation.listen}</h3>
        <div className="p-4 border rounded-lg bg-card">
          <PronunciationPlayer
            synthesis={displayedSynthesis}
            targetText={activeTarget.text}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="btn btn-outline btn-sm"
            >
              {isSynthesizing ? copy.pronunciation.generating : copy.pronunciation.regenerateAudio}
            </button>
            {displayedSynthesis?.engine === 'none' && (
              <span className="text-xs text-muted-foreground">{copy.pronunciation.usingBrowserTTS}</span>
            )}
          </div>
        </div>
      </div>

      {/* Practice tab */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-medium">{copy.pronunciation.practice}</h3>
          {getGrammarTipAction && (
            <button
              type="button"
              onClick={handleGrammarTip}
              disabled={grammarTipLoading}
              className="btn btn-ghost btn-sm text-muted-foreground hover:text-foreground"
            >
              {grammarTipLoading ? copy.pronunciation.grammarTipLoading : copy.pronunciation.grammarTipButton}
            </button>
          )}
        </div>
        {getGrammarTipAction && (grammarTip || grammarTipError) && (
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium">{copy.pronunciation.grammarTipTitle}</p>
            {grammarTipError ? (
              <p className="mt-1 text-sm text-muted-foreground">{grammarTipError}</p>
            ) : grammarTip && grammarTip.tips.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {grammarTip.tips.map((tip, index) => (
                  <li key={`${index}-${tip.slice(0, 24)}`}>{tip}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">{copy.pronunciation.grammarTipEmpty}</p>
            )}
          </div>
        )}
        <div className="p-4 border rounded-lg bg-card">
          <PronunciationRecorder
            targetText={activeTarget.text}
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
            <span>{copy.pronunciation.progress} {safeIndex + 1} / {allTargets.length}</span>
            <span>{Math.round(((safeIndex + 1) / allTargets.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((safeIndex + 1) / allTargets.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
