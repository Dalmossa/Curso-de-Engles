import Link from 'next/link';
import { buttonClasses } from '@/presentation/components/ui/button';
import { routes } from '@/shared/routes';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold text-ink-900">Página não encontrada</h1>
      <p className="text-sm text-ink-600">
        O caminho solicitado não existe nesta versão da interface.
      </p>
      <Link href={routes.home} className={buttonClasses('primary', 'lg')}>
        Voltar ao painel
      </Link>
    </div>
  );
}
