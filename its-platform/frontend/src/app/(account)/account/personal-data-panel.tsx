'use client';

import { useState } from 'react';

import type { AccountIdentity } from '@/core';
import { updateAccountProfileAction } from '@/presentation/actions/account-actions';
import { account as copy } from '@/presentation/lib/copy';
import { AccountAvatar } from '@/presentation/components/account-avatar';

/**
 * A seção "Dados Pessoais" — o nome, a foto, o e-mail e a banda.
 *
 * **O e-mail é exibido, não editado.** O e-mail é a identidade de login da conta, e a
 * plataforma não o altera por esta tela — mudar o e-mail de uma conta é uma operação de
 * segurança, com verificação de posse, e uma caixa de texto que fingisse permitir a
 * mudança seria uma mentira. O que a tela oferece é o **link** para o fluxo que de fato
 * existe.
 *
 * **O nome e a foto são editados aqui, e a gravação é a mesma action do popover.** Um
 * learner que corrige o nome no popover e o corrige na tela de conta está a corrigir a
 * mesma coisa — e as duas places mostram o resultado do mesmo `PATCH`.
 */
export function PersonalDataPanel({ identity }: { readonly identity: AccountIdentity }) {
  const [displayName, setDisplayName] = useState(identity.displayName ?? '');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    const result = await updateAccountProfileAction({
      displayName: displayName.trim().length === 0 ? null : displayName,
      avatarUrl: identity.avatarUrl,
    });

    setPending(false);

    if (!result.ok) {
      setError(result.error.detail || result.error.title || copy.nameInvalid);
      return;
    }

    setMessage(copy.saved);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex items-center gap-4">
        <AccountAvatar
          avatarUrl={identity.avatarUrl}
          displayName={identity.displayName}
          cefrLevel={identity.cefrLevel}
          size={64}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-ink-700">{copy.avatarLabel}</p>
          <p className="text-xs text-ink-500">{copy.avatarHint}</p>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.displayNameLabel}</span>
        <input
          type="text"
          name="displayName"
          value={displayName}
          maxLength={80}
          placeholder={copy.displayNamePlaceholder}
          onChange={(event) => setDisplayName(event.target.value)}
          className="rounded-lg border border-subtle bg-surface-raised px-3 py-2 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <span className="text-xs text-ink-500">{copy.displayNameHint}</span>
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.emailLabel}</span>
        <p className="text-ink-900">{identity.email ?? copy.emailMissing}</p>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.levelLabel}</span>
        <p className="text-ink-900">
          {identity.cefrLevel === null ? copy.levelMissing : identity.cefrLevel}
        </p>
      </div>

      {error !== null && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {message !== null && (
        <p role="status" className="text-sm text-green-700">
          {message}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {pending ? copy.saving : copy.save}
        </button>
      </div>
    </form>
  );
}
