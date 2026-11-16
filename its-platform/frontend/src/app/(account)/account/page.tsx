import Link from 'next/link';

import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { account as copy } from '@/presentation/lib/copy';
import { routes } from '@/shared/routes';
import { DeleteAccountPanel } from './delete-account-panel';
import { ExportDataButton } from './export-data-button';
import { PersonalDataPanel } from './personal-data-panel';

/**
 * `/account` — a conta do aluno: os dados que a plataforma guarda e o que ele pode fazer
 * com eles.
 *
 * **É uma Server Component.** A identidade é lida no servidor, com a credencial do
 * servidor — e a tela é renderizada com o que ela já sabe. Só as três seções que
 * **escrevem** (o nome, a exportação e a exclusão) são Client Components, e cada uma
 * delas é a menor possível.
 *
 * **A ordem é a do costume do Google, e não é arbitrária.** Primeiro o que o aluno
 * reconhece (o nome, o e-mail), depois o que o protege (a senha), depois o que a lei lhe
 * dá (a exportação e a exclusão). A zona de perigo vem por último, separada de tudo o
 * resto — e é a única seção com um fundo diferente, porque é a única cujas consequências
 * não têm volta.
 *
 * **A tela exige uma sessão.** O proxy trata de `/account` como de qualquer outra rota
 * protegida: sem cookies, o pedido é redirecionado para `/login` antes de a página ser
 * renderizada. E a leitura da identidade abaixo também falha de forma explícita se,
 * por alguma razão, a sessão não existir.
 */
export default async function AccountPage() {
  const { getServerContext } = await import('@/infrastructure/composition/server-container');
  const { useCases, learnerId } = await getServerContext();
  const identity = await useCases.getAccountIdentity.execute(learnerId);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{copy.pageTitle}</h1>
        <p className="text-sm text-ink-600">{copy.pageDescription}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle as="h2">{copy.personalDataTitle}</CardTitle>
          <p className="text-sm text-ink-600">{copy.personalDataDescription}</p>
        </CardHeader>
        <CardBody>
          <PersonalDataPanel identity={identity} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">{copy.securityTitle}</CardTitle>
          <p className="text-sm text-ink-600">{copy.securityDescription}</p>
        </CardHeader>
        <CardBody>
          {/* The password flow already exists — the screen points at it instead of
              growing a second one. */}
          <Link
            href={routes.forgotPassword}
            className="inline-flex items-center rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {copy.changePassword}
          </Link>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">{copy.privacyTitle}</CardTitle>
          <p className="text-sm text-ink-600">{copy.privacyDescription}</p>
        </CardHeader>
        <CardBody>
          <ExportDataButton />
        </CardBody>
      </Card>

      <Card className="border-danger-200 bg-danger-50/40">
        <CardHeader>
          <CardTitle as="h2" className="text-danger-700">
            {copy.dangerTitle}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <DeleteAccountPanel />
        </CardBody>
      </Card>
    </div>
  );
}
