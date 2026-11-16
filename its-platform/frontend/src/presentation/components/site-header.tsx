import Link from 'next/link';

import { APP_NAME } from '@/shared/constants';
import { routes } from '@/shared/routes';
import { AccountMenuPopover } from './account-menu-popover';
import { ThemeToggle } from './theme-toggle';

const NAV_ITEMS = [
  { href: routes.home, label: 'Minha Trilha' },
  { href: routes.mastery, label: 'Progresso' },
  { href: routes.diagnostic, label: 'Diagnóstico' },
] as const;

/**
 * The global header — the same block on every route.
 *
 * **It does not read the identity, and that is deliberate.** The identity used to be read
 * here, on the server, and handed to the popover as a prop. It worked — until the learner
 * changed their name: the write reached the database, the server re-rendered this very
 * component with the new name, and **the client never applied it**, because a shared
 * layout is reused from the client cache and is not swapped when a Server Action mutates
 * the data behind it. The header kept the old name until the page was reloaded.
 *
 * The identity now lives in a client context (`AccountIdentityProvider`), seeded by the
 * root layout from the server. The server is still the one that reads the profile and the
 * one that writes it; what changed is that the value the header draws is a value the
 * client can replace the moment its owner changes it — which is the same thing the Google
 * Account popover does, and the reason a global menu does not go stale under you.
 *
 * **A failure to read the profile must not take the header down.** The header is the
 * frame of every screen; a header that throws because the API is down replaces a small
 * inconvenience with a blank page. So a failure to read the identity means *no trigger* —
 * the learner keeps the navigation, and the pages below still render (and show their own
 * error).
 */
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-border-subtle bg-surface-raised/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4">
        <Link
          href={routes.home}
          className="text-sm font-semibold tracking-tight text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {APP_NAME}
        </Link>

        <nav aria-label="Navegação principal" className="flex-1">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-ink-600 transition-colors hover:bg-surface-sunken hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        {/* The popover renders nothing when there is no session — the trigger is the
            promise, and without an identity there is nothing to promise. */}
        <AccountMenuPopover />
      </div>
    </header>
  );
}
