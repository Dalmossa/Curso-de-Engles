import Link from 'next/link';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { buttonClasses } from '@/presentation/components/ui/button';
import { routes } from '@/shared/routes';

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = (await searchParams) || {};
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-start justify-center pt-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle as="h1">Entrar no ITS Platform</CardTitle>
          <p className="text-sm text-ink-600">
            Acesse sua conta para continuar sua trilha adaptativa.
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {params.error === 'invalid' && (
            <p className="text-sm text-red-600">E-mail ou senha inválidos.</p>
          )}
          <form action="/api/auth/login" method="post" className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span>E-mail</span>
              <input name="email" type="email" required className="rounded-lg border border-subtle px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Senha</span>
              <input name="password" type="password" required className="rounded-lg border border-subtle px-3 py-2" />
            </label>
            <button type="submit" className={buttonClasses('primary', 'lg')}>
              Entrar
            </button>
          </form>
          <div className="flex items-center justify-between text-sm">
            <Link href="/register" className="text-ink-600 underline">
              Criar conta
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <div className="h-px flex-1 bg-subtle" />
            <span>ou</span>
            <div className="h-px flex-1 bg-subtle" />
          </div>
          <a href="/api/auth/google" className={buttonClasses('secondary', 'lg')}>
            Continuar com Google
          </a>
          <p className="text-xs text-ink-500">
            Em modo desenvolvimento ainda é possível usar o painel com `ITS_API_TOKEN` configurado no servidor.
          </p>
          <Link href={routes.home} className="text-sm text-ink-600 underline">
            Ir para o painel
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
