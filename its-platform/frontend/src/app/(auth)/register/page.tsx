import Link from 'next/link';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { buttonClasses } from '@/presentation/components/ui/button';
import { routes } from '@/shared/routes';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const params = (await searchParams) || {};
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-start justify-center pt-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle as="h1">Criar conta</CardTitle>
          <p className="text-sm text-ink-600">
            Crie sua conta para começar sua trilha adaptativa no ITS.
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {params.error === 'exists' && (
            <p className="text-sm text-red-600">Este e-mail já está cadastrado.</p>
          )}
          {params.error === 'unavailable' && (
            <p className="text-sm text-red-600">
              Não conseguimos falar com o servidor agora. Tente novamente em instantes.
            </p>
          )}
          <form action="/api/auth/register" method="post" className="flex flex-col gap-3">
            <input type="hidden" name="next" value={params.next ?? '/'} />
            <label className="flex flex-col gap-1 text-sm">
              <span>Nome</span>
              <input name="displayName" type="text" className="rounded-lg border border-subtle px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>E-mail</span>
              <input name="email" type="email" required className="rounded-lg border border-subtle px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Senha</span>
              <input name="password" type="password" required minLength={6} className="rounded-lg border border-subtle px-3 py-2" />
            </label>
            <button type="submit" className={buttonClasses('primary', 'lg')}>
              Criar conta
            </button>
          </form>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <div className="h-px flex-1 bg-subtle" />
            <span>ou</span>
            <div className="h-px flex-1 bg-subtle" />
          </div>
          <a href="/api/auth/google" className={buttonClasses('secondary', 'lg')}>
            Continuar com Google
          </a>
          <div className="flex items-center justify-between text-sm">
            <Link href="/login" className="text-ink-600 underline">
              Já tenho conta
            </Link>
            <Link href={routes.home} className="text-ink-600 underline">
              Ir para o painel
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
