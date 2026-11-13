import { redirect } from 'next/navigation';
import { getServerContext } from '@/infrastructure/composition/server-container';
import { MasteryPanel } from '@/presentation/components/mastery-panel';
import { CefrBadge } from '@/presentation/components/cefr-badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { isAuthenticationFailure } from '@/core/errors/domain-error';

export const dynamic = 'force-dynamic';

/**
 * Data first, JSX afterwards: a `try` that wraps markup cannot catch anything (React renders the
 * elements later, outside it), which is why the guard lives in its own loader.
 */
async function loadMasteryScreen() {
  try {
    const { useCases, learnerId } = await getServerContext();
    return await useCases.getMasteryScreenData.execute(learnerId);
  } catch (error) {
    if (isAuthenticationFailure(error)) {
      redirect('/login');
    }
    throw error;
  }
}

export default async function MasteryPage() {
  const data = await loadMasteryScreen();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Progresso por habilidade</h1>
          <CefrBadge level={data.cefrLevel} prefix="Nível" />
        </div>
        <p className="text-sm text-ink-600">
          Detalhamento com base em <span className="font-mono">GET /learners/{'{id}'}/mastery</span>.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle as="h2">Linha do tempo de domínio</CardTitle>
        </CardHeader>
        <CardBody>
          <MasteryPanel overview={data.overview} rows={data.rows} />
        </CardBody>
      </Card>
    </div>
  );
}
