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

export const dynamic = 'force-dynamic';

function buildPlaceholderRoadmap(): RoadmapModule[] {
  return [
    {
      id: 'mod-01',
      index: 1,
      title: 'Módulo 1 - Primeiros passos',
      description: 'Fundamentos para começar sua trilha no ITS.',
      isUnlocked: true,
      lessons: [
        { id: 'les_a1_to_be_forms', title: 'Verbo "to be": formas e usos', durationMinutes: 15, isUnlocked: true, isCompleted: false },
        { id: 'les_a1_greetings', title: 'Cumprimentos e apresentações', durationMinutes: 12, isUnlocked: true, isCompleted: false },
        { id: 'les_a1_pronouns_subject_object', title: 'Pronomes sujeito e objeto', durationMinutes: 14, isUnlocked: true, isCompleted: false },
        { id: 'les_a1_numbers_colors', title: 'Números, cores e perguntas básicas', durationMinutes: 10, isUnlocked: true, isCompleted: false },
      ],
    },
    {
      id: 'mod-02',
      index: 2,
      title: 'Módulo 2 - Rotina e perguntas',
      description: 'Perguntas, rotina diária e vocabulário prático.',
      isUnlocked: true,
      lessons: [
        { id: 'les_a1_present_simple', title: 'Presente simples: rotina', durationMinutes: 16, isUnlocked: true, isCompleted: false },
        { id: 'les_a1_wh_questions', title: 'Perguntas com WH-', durationMinutes: 14, isUnlocked: true, isCompleted: false },
        { id: 'les_a1_there_is_are', title: 'There is / There are', durationMinutes: 12, isUnlocked: true, isCompleted: false },
        { id: 'les_a1_time_dates', title: 'Horas, datas e compromissos', durationMinutes: 13, isUnlocked: true, isCompleted: false },
      ],
    },
    {
      id: 'mod-03',
      index: 3,
      title: 'Módulo 3 - Conversação aplicada',
      description: 'Diálogos reais com foco em fluência prática.',
      isUnlocked: false,
      lessons: [
        { id: 'les_a2_small_talk', title: 'Small talk no trabalho', durationMinutes: 16, isUnlocked: false, isCompleted: false },
        { id: 'les_a2_meeting_open', title: 'Abrir uma reunião em inglês', durationMinutes: 15, isUnlocked: false, isCompleted: false },
        { id: 'les_a2_ask_for_help', title: 'Pedir ajuda com clareza', durationMinutes: 14, isUnlocked: false, isCompleted: false },
      ],
    },
  ];
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
  const modules = buildPlaceholderRoadmap();

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
            <Link href={routes.practice} className={buttonClasses('ghost', 'sm')}>
              Revisar (SRS)
            </Link>
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
          <Link href={routes.practice} className={buttonClasses('ghost', 'sm')}>
            Ver revisões
          </Link>
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
              <div className="mt-4">
                <Link href={routes.practice} className={buttonClasses('secondary', 'sm')}>
                  Ir para Revisar
                </Link>
              </div>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
