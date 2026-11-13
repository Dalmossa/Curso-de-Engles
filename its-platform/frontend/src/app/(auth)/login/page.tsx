import Link from 'next/link';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { buttonClasses } from '@/presentation/components/ui/button';
import { routes } from '@/shared/routes';

const DEV_EMAIL = 'dev@its.local';
const DEV_PASSWORD = 'dev12345';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string; dev?: string }>;
}) {
  const params = (await searchParams) || {};
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const useDevCredentials = isDevelopment && params.dev === '1';
  const next = params.next ?? '/';

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
          {params.error === 'unavailable' && (
            <p className="text-sm text-red-600">
              Não conseguimos falar com o servidor agora. Tente novamente em instantes.
            </p>
          )}
          {params.error === 'session' && (
            <p className="text-sm text-red-600">
              Sua sessão expirou. Entre novamente para continuar de onde parou.
            </p>
          )}
          {isDevelopment && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-subtle px-3 py-2 text-xs text-ink-600">
              <span>
                Ambiente de desenvolvimento: usuário <span className="font-mono">{DEV_EMAIL}</span>
              </span>
              <Link
                href={`/login?dev=1&next=${encodeURIComponent(next)}`}
                className={buttonClasses('ghost', 'sm')}
              >
                Preencher credenciais
              </Link>
            </div>
          )}
          <form action="/api/auth/login" method="post" className="flex flex-col gap-3">
            <input type="hidden" name="next" value={next} />
            <label className="flex flex-col gap-1 text-sm">
              <span>E-mail</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={useDevCredentials ? DEV_EMAIL : undefined}
                className="rounded-lg border border-subtle px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>Senha</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                defaultValue={useDevCredentials ? DEV_PASSWORD : undefined}
                className="rounded-lg border border-subtle px-3 py-2"
              />
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
          <Link href={routes.home} className="text-sm text-ink-600 underline">
            Ir para o painel
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
