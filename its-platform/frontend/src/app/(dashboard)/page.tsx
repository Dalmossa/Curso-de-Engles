import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { resolveActivityDestination } from '@/core';
import { NextActivityCard } from '@/presentation/components/next-activity-card';
import { MasteryPanel } from '@/presentation/components/mastery-panel';
import { CefrBadge } from '@/presentation/components/cefr-badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { buttonClasses } from '@/presentation/components/ui/button';
import { CourseRoadmap, type RoadmapModule } from '@/presentation/components/dashboard/course-roadmap';
import { routes } from '@/shared/routes';
import { isAuthenticationFailure } from '@/core/errors/domain-error';
import { CURRICULUM_MODULES, getModulesByTrack } from '@/core/data/curriculum';
import type { CefrLevel } from '@/core/value-objects/cefr-level';
import type { MasteryOverview } from '@/core/services/mastery-gate';

export const dynamic = 'force-dynamic';

/**
 * Converts curriculum modules to RoadmapModule format, marking completion
 * based on the learner's mastery data.
 */
function buildRoadmapFromCurriculum(
  modules: readonly typeof CURRICULUM_MODULES[0][],
  mastery: Record<string, number>,
  cefrLevel: CefrLevel | null,
): RoadmapModule[] {
  return modules.map((mod, idx) => ({
    id: mod.id,
    index: idx + 1,
    title: mod.title,
    description: mod.description,
    isUnlocked: isModuleUnlocked(mod, cefrLevel),
    lessons: mod.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      durationMinutes: lesson.durationMinutes,
      isUnlocked: isLessonUnlocked(lesson.id, mastery),
      isCompleted: isLessonCompleted(lesson.id, mastery),
    })),
  }));
}

/**
 * A module is unlocked if the learner's CEFR level meets or exceeds the module's level,
 * or if it's the entry module for their level.
 */
function isModuleUnlocked(module: typeof CURRICULUM_MODULES[0], learnerCefr: CefrLevel | null): boolean {
  if (!learnerCefr) return module.index === 1; // First module unlocked if no level
  const cefrOrder: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const learnerIdx = cefrOrder.indexOf(learnerCefr);
  const moduleIdx = cefrOrder.indexOf(module.cefrLevel);
  return moduleIdx <= learnerIdx;
}

/**
 * A lesson is unlocked if its module is unlocked and prerequisites are met.
 * For now, simplified: unlocked if module is unlocked.
 */
function isLessonUnlocked(_lessonId: string, mastery: Record<string, number>): boolean {
  // TODO: Check prerequisites from curriculum graph
  // For now, consider unlocked if any related skill has mastery > 0
  return Object.keys(mastery).length > 0;
}

/**
 * A lesson is completed if its target skills all have mastery >= 0.85 (gate threshold).
 * Simplified: check if any skill from the lesson has mastery >= 0.85.
 */
function isLessonCompleted(_lessonId: string, mastery: Record<string, number>): boolean {
  // TODO: Map lessonId to its target skills from curriculum
  // For now, use a simple heuristic: if the lesson ID appears in mastery with high score
  const matchingEntry = Object.entries(mastery).find(
    ([k]) => k.includes(_lessonId.replace('les_', '')) || _lessonId.includes(k),
  );
  if (matchingEntry !== undefined) return matchingEntry[1] >= 0.85;
  return false;
}

export default async function DashboardPage() {
  let dashboard;
  try {
    const { useCases, learnerId } = await getServerContext();
    dashboard = await useCases.getLearnerDashboard.execute(learnerId);
  } catch (error) {
    if (isAuthenticationFailure(error)) {
      redirect('/login');
    }
    throw error;
  }

  // Convert MasteryOverview to Record<string, number> for curriculum functions
  const masteryRecord: Record<string, number> = Object.fromEntries(
    (dashboard.mastery as MasteryOverview).entries.map((e) => [e.skill, e.mastery]),
  );

  // Track not in preferences yet; default to General
  const track = 'General';
  const modules = buildRoadmapFromCurriculum(
    getModulesByTrack(track),
    masteryRecord,
    dashboard.cefrLevel,
  );

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.isCompleted).length, 0);
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Minha Trilha</h1>
            <CefrBadge level={dashboard.cefrLevel} prefix="Nível" />
          </div>
          <div className="flex items-center gap-2">
            <Link href={routes.mastery} className={buttonClasses('ghost', 'sm')}>
              Meu progresso
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
          <span>
            <span className="font-medium text-ink-900">{completedLessons}/{totalLessons}</span> aulas concluídas
          </span>
          <span>•</span>
          <span>
            <span className="font-medium text-ink-900">{progressPct}%</span> da trilha
          </span>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Continuar de onde parei</h2>
        </div>
        <NextActivityCard
          activity={dashboard.nextActivity}
          destination={resolveActivityDestination(dashboard.nextActivity)}
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sua trilha</h2>
            <p className="text-sm text-ink-500">Siga na ordem ou deixe o ITS te guiar pelo próximo passo ideal</p>
          </div>
          <CourseRoadmap modules={modules} />
        </section>
        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle as="h2">Domínio por habilidade</CardTitle>
              <p className="text-sm text-ink-600">Seu avanço real por habilidade</p>
            </CardHeader>
            <CardBody>
              <MasteryPanel overview={dashboard.mastery} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle as="h2">Dica</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink-600">
                O ITS prioriza o <span className="font-medium">melhor próximo passo</span> com base no seu domínio. Nem sempre é a próxima aula da lista, pode ser uma revisão espaçada.
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
