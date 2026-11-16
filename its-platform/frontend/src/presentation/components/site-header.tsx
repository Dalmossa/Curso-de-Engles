import Link from 'next/link';
import { cookies } from 'next/headers';

import { APP_NAME } from '@/shared/constants';
import { routes } from '@/shared/routes';
import { SESSION_TOKEN_COOKIE } from '@/shared/auth-cookies';
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
 * **It is a Server Component, and it decides whether there is a profile trigger at all.**
 * The trigger is only rendered when the request carries a session cookie: a popover that
 * opens onto an empty account is worse than no popover, and a header that shows a
 * profile button to somebody who is not signed in is a promise the platform cannot keep.
 * The check is a cookie's presence, not a verification — the API remains the only party
 * that can decide whether the credential is good, and a header that duplicated that
 * would be a second answer to a security question.
 *
 * **The identity is read server-side and never leaves the server.** The profile is fetched
 * with the server's own credential (`ITS_API_TOKEN` or the session's access token), and
 * only the three members the popover draws — the name, the picture and the band — are
 * handed to the client component. The token never enters the browser bundle, and the
 * browser never names a learner.
 *
 * **A failure to read the profile must not take the header down.** The header is the
 * frame of every screen; a header that throws because the API is down replaces a small
 * inconvenience with a blank page. So a failure here means *no trigger* — the learner
 * keeps the navigation, and the pages below still render (and show their own error).
 */
export async function SiteHeader() {
  const jar = await cookies();
  const hasSession = jar.get(SESSION_TOKEN_COOKIE)?.value !== undefined;

  const identity = hasSession ? await readIdentity() : null;

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

        {identity !== null && <AccountMenuPopover identity={identity} />}
      </div>
    </header>
  );
}

/**
 * The learner's identity, read server-side.
 *
 * `null` on any failure — no session, an unreachable API, a learner the API refuses.
 * The header renders without the trigger in that case, and the pages below carry their
 * own error state. A header that threw would be a worse outcome than a header without a
 * profile button.
 */
async function readIdentity() {
  try {
    const { getServerContext } = await import('@/infrastructure/composition/server-container');
    const { useCases, learnerId } = await getServerContext();
    return await useCases.getAccountIdentity.execute(learnerId);
  } catch {
    return null;
  }
}
