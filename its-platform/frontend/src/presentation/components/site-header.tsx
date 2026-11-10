import Link from 'next/link';
import { APP_NAME } from '@/shared/constants';
import { routes } from '@/shared/routes';
import { ThemeToggle } from './theme-toggle';

const NAV_ITEMS = [
  { href: routes.home, label: 'Painel' },
  { href: routes.mastery, label: 'Progresso' },
  { href: routes.diagnostic, label: 'Diagnóstico' },
] as const;

/**
 * A Server Component, with exactly one client leaf inside it (`ThemeToggle`).
 *
 * That is the shape the whole app follows: `'use client'` sits at the smallest possible
 * node, so the shell, the navigation and every card above it stay server-rendered and cost
 * nothing in the browser bundle.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border-subtle bg-surface-raised/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
        <Link href={routes.home} className="text-sm font-semibold tracking-tight text-ink-900">
          {APP_NAME}
        </Link>

        <nav aria-label="Navegação principal" className="flex-1">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-ink-600 transition-colors hover:bg-surface-sunken hover:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
