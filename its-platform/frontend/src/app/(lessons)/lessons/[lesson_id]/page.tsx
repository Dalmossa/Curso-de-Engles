import { notFound, redirect } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { LessonView } from '@/presentation/components/lesson-view';
import { PronunciationPractice } from '@/presentation/components/pronunciation-practice';
import { extractPronunciationTargets, getFirstTargets } from '@/core/services/pronunciation-targets';
import { isLessonId, type LessonContent } from '@/core';
import { isDomainError, isAuthenticationFailure } from '@/core/errors/domain-error';
import type { SpeechSynthesisResult } from '@/core';
import { synthesizeSpeechAction, evaluatePronunciationAction } from './speech/actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly params: Promise<{ lesson_id: string }>;
}

/**
 * Loads lesson from the real backend API. No mock fallback — if the API is unavailable,
 * the error propagates to the error boundary (error.tsx) which shows a proper
 * unavailability message. If the lesson doesn't exist, returns 404 via notFound().
 */
async function loadLesson(lessonId: string): Promise<LessonContent | null> {
  const { useCases } = await getServerContext();
  try {
    return await useCases.getLesson.execute(lessonId);
  } catch (error) {
    if (isDomainError(error) && error.isMissingResource) {
      return null;
    }
    if (isAuthenticationFailure(error)) {
      redirect('/login');
    }
    // Let network/server errors propagate to error.tsx boundary
    throw error;
  }
}

interface PronunciationPracticeProps {
  lesson: LessonContent;
}

async function PronunciationPracticePanel({ lesson }: PronunciationPracticeProps) {
  const { useCases } = await getServerContext();

  // Extract pronunciation targets from lesson content
  const targets = getFirstTargets(lesson, 10);
  const firstTarget = targets[0];

  // Synthesize speech for the first target (server-side)
  let initialSynthesis: SpeechSynthesisResult | null = null;
  if (firstTarget) {
    try {
      const result = await useCases.synthesizeSpeech.execute({ text: firstTarget.text, rate: 1 });
      initialSynthesis = result;
    } catch {
      // Fallback will be handled client-side
      initialSynthesis = null;
    }
  }

  return (
    <PronunciationPractice
      synthesis={initialSynthesis}
      target={firstTarget!}
      allTargets={targets}
      synthesizeAction={synthesizeSpeechAction}
      evaluateAction={evaluatePronunciationAction}
      currentIndex={0}
      onTargetChange={() => {}} // Navigation handled by client state
    />
  );
}

export default async function LessonPage({ params }: PageProps) {
  const { lesson_id } = await params;

  if (!isLessonId(lesson_id)) notFound();

  const lesson = await loadLesson(lesson_id);
  if (!lesson) notFound();

  const targets = extractPronunciationTargets(lesson);

  return (
    <div className="space-y-8">
      <LessonView lesson={lesson} />
      {targets.length > 0 && <PronunciationPracticePanel lesson={lesson} />}
    </div>
  );
}
