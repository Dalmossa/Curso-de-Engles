'use client';

import { useState } from 'react';

import type { AccountIdentity } from '@/core';
import { updateAccountProfileAction } from '@/presentation/actions/account-actions';
import { useAccountIdentity } from '@/presentation/providers/account-identity-provider';
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
 *
 * **A gravação publica a identidade nova, e é isso que fecha o defeito.** O cabeçalho
 * mora no layout raiz, e o layout raiz não é redesenhado pelo cliente quando uma Server
 * Action muda os dados por trás dele: o nome chegava ao banco e o cabeçalho continuava
 * com o nome antigo. Publicando a identidade no contexto, o cabeçalho passa a mostrar o
 * nome novo — e a tela de conta também, porque as duas leem o mesmo lugar.
 *
 * **O campo do nome é não controlado, e a `key` dele é o nome publicado.** Um input
 * controlado exigiria um efeito para "ajustar o estado quando a propriedade muda" — e
 * ajustar estado dentro de um efeito é um segundo ciclo de render por uma informação que
 * o React já sabe. A `key` resolve o mesmo problema do jeito que o React recomenda: quando
 * o nome publicado muda, o input é remontado com o valor novo. E o que o aluno escreveu
 * sem salvar é lido do formulário no momento do envio — o valor vive no formulário, que
 * é onde o valor de um input não controlado vive.
 */
export function PersonalDataPanel({ identity }: { readonly identity: AccountIdentity }) {
  const { identity: published, setIdentity } = useAccountIdentity();
  // A identidade publicada pelo contexto é a mais recente: ela muda quando o nome é
  // gravado aqui ou no popover. A prop é o valor inicial, e o valor de segurança — o que
  // o servidor renderizou quando a página foi aberta.
  const current = published ?? identity;

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    const field = event.currentTarget.elements.namedItem('displayName');
    const typed = field instanceof HTMLInputElement ? field.value : '';

    const result = await updateAccountProfileAction({
      displayName: typed.trim().length === 0 ? null : typed,
      avatarUrl: current.avatarUrl,
    });

    setPending(false);

    if (!result.ok) {
      setError(result.error.detail || result.error.title || copy.nameInvalid);
      return;
    }

    // O servidor devolve a identidade como está agora — e ela é publicada para que o
    // cabeçalho e o popover mostrem o mesmo nome, sem esperar um recarregamento.
    setIdentity(result.data);
    setMessage(copy.saved);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex items-center gap-4">
        <AccountAvatar
          avatarUrl={current.avatarUrl}
          displayName={current.displayName}
          cefrLevel={current.cefrLevel}
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
          key={current.displayName ?? ''}
          type="text"
          name="displayName"
          defaultValue={current.displayName ?? ''}
          maxLength={80}
          placeholder={copy.displayNamePlaceholder}
          className="rounded-lg border border-subtle bg-surface-raised px-3 py-2 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <span className="text-xs text-ink-500">{copy.displayNameHint}</span>
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.emailLabel}</span>
        <p className="text-ink-900">{current.email ?? copy.emailMissing}</p>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.levelLabel}</span>
        <p className="text-ink-900">
          {current.cefrLevel === null ? copy.levelMissing : current.cefrLevel}
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
