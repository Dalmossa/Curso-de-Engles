'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AccountIdentity } from '@/core';
import { UNNAMED_ACCOUNT_FALLBACK } from '@/core';
import { account as copy } from '@/presentation/lib/copy';
import { routes } from '@/shared/routes';
import { AccountAvatar } from './account-avatar';
import { AccountProfileEditor } from './account-profile-editor';

/**
 * O menu flutuante da conta — o popover que abre no avatar do cabeçalho.
 *
 * **Ele é um Client Component, e é o menor possível.** O servidor já sabe quem é o aluno
 * (o `SiteHeader` leu o perfil), e esse dado chega aqui como prop: nenhuma requisição
 * acontece no navegador, e o token nunca chega ao bundle. O que o componente precisa de
 * estado é o que é *interação* — aberto, contas expandidas, editor aberto — e nada mais.
 *
 * **As três saídas, e todas as três fecham.** O botão `X`, a tecla `Esc` e o clique fora.
 * Uma janela flutuante que só se fecha por um caminho é uma janela que captura a pessoa
 * que entrou nela (heurística de Nielsen: *controle e liberdade do usuário*). O foco
 * volta ao gatilho em todas elas — fechar um diálogo e deixar o foco no `body` é a
 * forma mais comum de perder um leitor de tela.
 *
 * **O agrupamento é Gestalt, e o espaçamento conta.** A identidade é uma sub-card
 * elevada dentro do popover; as ações de sessão são um bloco; o rodapé é separado por
 * uma linha. A proximidade diz o que pertence a quê — e o `gap` entre os grupos é maior
 * que o `gap` dentro deles.
 *
 * **A animação é uma mola criticamente amortecida, sem overshoot.** `cubic-bezier(0.2, 0, 0, 1)`
 * chega ao lugar e para — não passa do ponto e volta, que é o que uma mola elástica faz e
 * o que um popover não deve fazer: o conteúdo é *texto*, e texto que se move demais é
 * texto que ninguém lê. A entrada é ancorada no gatilho (`transform-origin: top right`),
 * porque é de lá que o popover *nasce*.
 */
export interface AccountMenuPopoverProps {
  readonly identity: AccountIdentity;
}

export function AccountMenuPopover({ identity }: AccountMenuPopoverProps) {
  const [open, setOpen] = useState(false);
  const [accountsExpanded, setAccountsExpanded] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [current, setCurrent] = useState(identity);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    setEditorOpen(false);
    if (returnFocus) {
      // The focus returns to where it came from — the trigger. Without this, the focus
      // falls on `<body>` and a keyboard user has to tab the whole page back.
      triggerRef.current?.focus();
    }
  }, []);

  // Escape closes, from anywhere in the document — and the click outside closes too.
  // Both listeners exist only while the popover is open: a listener that is always
  // mounted is a listener that fires on every click of the application.
  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close(true);
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (containerRef.current?.contains(target)) return;
      close(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  // The dialog takes the focus when it opens, so a screen reader announces it and the
  // next Tab lands on the close button rather than back on the trigger.
  useEffect(() => {
    if (open) popoverRef.current?.focus();
  }, [open]);

  const name = current.displayName ?? UNNAMED_ACCOUNT_FALLBACK;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="account-menu-popover"
        aria-label={
          current.displayName === null
            ? copy.triggerLabel
            : copy.triggerLabelNamed(current.displayName)
        }
        onClick={() => (open ? close(false) : setOpen(true))}
        className="rounded-full transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        <AccountAvatar
          avatarUrl={current.avatarUrl}
          displayName={current.displayName}
          cefrLevel={current.cefrLevel}
          size={36}
        />
      </button>

      {open && (
        <div
          id="account-menu-popover"
          ref={popoverRef}
          role="dialog"
          aria-label={copy.triggerLabel}
          tabIndex={-1}
          className="account-popover absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-border-subtle bg-surface-raised shadow-2xl shadow-ink-900/10 focus:outline-none"
        >
          {/* The close button sits on its own line, at the top right — where the
              Google Account popover puts it, and where a mouse reaches for it. */}
          <div className="flex justify-end px-2 pt-2">
            <button
              type="button"
              onClick={() => close(true)}
              aria-label={copy.close}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-surface-sunken hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>

          {editorOpen ? (
            <AccountProfileEditor
              identity={current}
              onCancel={() => setEditorOpen(false)}
              onSaved={(updated) => {
                setCurrent(updated);
                setEditorOpen(false);
              }}
            />
          ) : (
            <>
              {/* The identity card — its own elevation, its own background: it is a
                  different kind of thing from the actions below it. */}
              <div className="mx-3 mb-2 rounded-2xl bg-surface-sunken p-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <AccountAvatar
                      avatarUrl={current.avatarUrl}
                      displayName={current.displayName}
                      cefrLevel={current.cefrLevel}
                      size={64}
                    />
                    <button
                      type="button"
                      onClick={() => setEditorOpen(true)}
                      aria-label={copy.editProfile}
                      title={copy.editProfile}
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-ink-700 shadow-sm transition-colors hover:bg-border-subtle hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      <span aria-hidden="true" className="text-xs leading-none">
                        ✎
                      </span>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {/* The name truncates rather than wrapping: a name of four words
                        must not push the e-mail out of the card. The full text stays
                        in `title`, for the mouse. */}
                    <p
                      className="truncate text-base font-semibold text-ink-900"
                      title={name}
                      data-testid="account-display-name"
                    >
                      {name}
                    </p>
                    <p className="truncate text-sm text-ink-600" title={current.email ?? undefined}>
                      {current.email ?? copy.emailMissing}
                    </p>
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-200">
                      {current.cefrLevel === null
                        ? copy.levelMissing
                        : `${copy.levelLabel} ${current.cefrLevel}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* The accounts accordion. It is collapsed by default: the learner has
                  one account, and the list of one is noise until it is asked for. */}
              <div className="border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setAccountsExpanded((expanded) => !expanded)}
                  aria-expanded={accountsExpanded}
                  className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                >
                  <span>{copy.accounts}</span>
                  <span aria-hidden="true" className="text-xs text-ink-500">
                    {accountsExpanded ? '⌃' : '⌄'}
                  </span>
                </button>
                {accountsExpanded && (
                  <div className="px-5 pb-3">
                    <p className="flex items-center gap-2 text-sm text-ink-600">
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
                      >
                        {current.displayName === null
                          ? 'A'
                          : current.displayName.trim().charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{current.email ?? name}</span>
                      <span className="ml-auto text-xs text-ink-500">{copy.currentAccount}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* The session block. */}
              <div className="border-t border-border-subtle py-1">
                <Link
                  href={routes.loginWithSwitch}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-ink-600"
                  >
                    +
                  </span>
                  {copy.addAnotherAccount}
                </Link>

                {/* The sign-out is a real form posting to the BFF: the session is
                    revoked server-side and the cookies are cleared by the route that
                    answers it — not by a script in the browser. */}
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-ink-600"
                    >
                      ⏻
                    </span>
                    {copy.signOut}
                  </button>
                </form>
              </div>

              {/* The footer pill — the way into the account screen, where the LGPD
                  rights live. It is a pill because it is the one destination that is
                  a *place*, not an action. */}
              <div className="border-t border-border-subtle p-3">
                <Link
                  href={routes.account}
                  className="flex w-full items-center justify-center rounded-full border border-border-strong px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-sunken hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {copy.manageAccount}
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
