import { notFound, redirect } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { isLessonId, isPackId } from '@/core';
import type { PracticeScreenData } from '@/application/use-cases/submit-practice';
import { PracticeSession } from '@/presentation/components/practice-session';
import { routes } from '@/shared/routes';
import { submitPracticeAction } from './actions';

export const dynamic = 'force-dynamic';

interface PageProps {
  readonly params: Promise<{ lesson_id: string }>;
  readonly searchParams: Promise<{ pack?: string }>;
}

/** Resolved before any JSX exists; see the note in the sibling lesson page. */
async function loadPack(packId: string): Promise<PracticeScreenData | null> {
  try {
    const { useCases } = await getServerContext();
    return await useCases.getPracticePack.execute(packId);
  } catch {
    return null;
  }
}

export default async function PracticePage({ params, searchParams }: PageProps) {
  const { lesson_id } = await params;
  const { pack } = await searchParams;

  if (!isLessonId(lesson_id)) notFound();

  // There is no endpoint that lists a lesson's packs, so the pack id can only arrive from
  // the recommendation that sent the learner here. Reaching this URL without one is a
  // hand-built URL, not a broken state: send them to the lesson instead of inventing a pack.
  if (pack === undefined || !isPackId(pack)) redirect(routes.lesson(lesson_id));

  const data = await loadPack(pack);
  if (data === null) redirect(routes.lesson(lesson_id));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Prática</h1>
        <p className="text-sm text-ink-600">
          Pacote <span className="font-mono">{data.pack.packId}</span> · lição{' '}
          <span className="font-mono">{data.lessonId}</span>
        </p>
      </header>
      <PracticeSession pack={data.pack} onSubmit={submitPracticeAction} />
    </div>
  );
}
